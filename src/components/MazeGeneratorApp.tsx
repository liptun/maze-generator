import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { mazeGenerator } from '../libs/maze/maze';
import { Maze } from '../libs/maze/types';
import MazeCanvas from './MazeCanvas';

const Wrapper = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');
  font-family: 'Lato', sans-serif;
  display: grid;
  grid-gap: 5px;
  font-size: 16px;
  grid-template-columns: auto 20%;
  min-height: 95vh;
`;

const MazeWrapper = styled.div`
  padding: 15px;
`;

const OptionsWrapper = styled.div`
  overflow: none;
  padding: 15px;
`;

const Title = styled.h2`
  font-size: 1.4em;
  font-weight: 700;
  margin: 15px 0 8px;
`;

const InputWrapper = styled.div`
  display: grid;
  grid-gap: 6px;
  margin-bottom: 15px;
`;
const InputWrapperHorizontal = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 15px;
  margin-bottom: 15px;
`;

const inputStyle = css`
  font-family: 'Lato', sans-serif;
  border: 0;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 1.2em;
`;

const Input = styled.input`
  ${inputStyle}
  border: 1px solid #e1e1e1;
`;

const Button = styled.button<{ disabled?: boolean }>`
  ${inputStyle}
  cursor: pointer;
  color: #282828;
  background-color: #eee;
  transition: all 0.2s ease-out;
  :hover {
    background-color: #e1e1e1;
  }
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`;

const GenerateButton = styled(Button)`
  background-color: #fb4934;
  font-size: 700;
  color: white;
  :hover {
    background-color: #cc241d;
  }
`;

const AnimateButton = styled(Button)`
  background-color: #fabd2f;
  font-size: 700;
  color: white;
  :hover {
    background-color: #d79921;
  }
`;

const MazeGeneratorApp: FC = () => {
  const [seed, setSeed] = useState('test');
  const [width, setWidth] = useState(32);
  const [height, setHeight] = useState(32);
  const [scale, setScale] = useState(16);
  const [maze, setMaze] = useState<Maze>([]);
  const [history, setHistory] = useState<Maze[]>([]);
  const [historySelector, setHistorySelector] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [renderSize, setRenderSize] = useState({ width: 600, height: 600 });

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMaze(history[historySelector]);
  }, [history, historySelector]);

  useEffect(() => {
    if (wrapperRef.current) {
      setRenderSize({
        width: wrapperRef.current.clientWidth - 50,
        height: wrapperRef.current.clientHeight - 50,
      });
    }
  }, [wrapperRef]);

  const onAnimateHandle = useCallback(() => {
    setIsAnimating(true);
    for (let i = 0; i < history.length; i++) {
      setTimeout(() => {
        setHistorySelector(i);
        i === history.length - 1 && setIsAnimating(false);
      }, i * ((animationDuration * 1000) / history.length));
    }
  }, [history, animationDuration]);

  const onGenerateHandle = useCallback(() => {
    setIsGenerating(true);
    const mazeGen = mazeGenerator({ width, height, seed });
    let mazeReady = false;
    const history: Maze[] = [];
    while (!mazeReady) {
      const mazeStage = mazeGen.next();
      if (mazeStage.done) {
        mazeReady = true;
      } else {
        history.push(mazeStage.value);
      }
    }
    setHistory(history);
    setHistorySelector(history.length - 1);
    setIsGenerating(false);
  }, [seed, width, height]);

  return (
    <Wrapper>
      <MazeWrapper ref={wrapperRef}>
        <MazeCanvas
          maze={maze}
          scale={scale}
          width={renderSize.width}
          height={renderSize.height}
        />
      </MazeWrapper>
      <OptionsWrapper>
        <Title>Maze generator options</Title>
        <InputWrapper>
          <label>Seed:</label>
          <Input value={seed} onChange={(e) => setSeed(e.target.value)} />
        </InputWrapper>
        <InputWrapperHorizontal>
          <Button
            onClick={() => {
              setWidth(8);
              setHeight(8);
            }}
          >
            8
          </Button>
          <Button
            onClick={() => {
              setWidth(16);
              setHeight(16);
            }}
          >
            16
          </Button>
          <Button
            onClick={() => {
              setWidth(32);
              setHeight(32);
            }}
          >
            32
          </Button>
          <Button
            onClick={() => {
              setWidth(64);
              setHeight(64);
            }}
          >
            64
          </Button>
          <Button
            onClick={() => {
              setWidth(128);
              setHeight(128);
            }}
          >
            128
          </Button>
        </InputWrapperHorizontal>
        <InputWrapper>
          <label>Width: {width}</label>
          <input
            value={width}
            type="range"
            min={3}
            max={128}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </InputWrapper>
        <InputWrapper>
          <label>Height: {height}</label>
          <input
            value={height}
            type="range"
            min={3}
            max={128}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </InputWrapper>
        <InputWrapper>
          <GenerateButton onClick={onGenerateHandle} disabled={isGenerating}>
            Generate
          </GenerateButton>
        </InputWrapper>
        {history.length > 0 && (
          <InputWrapper>
            <label>
              Step {historySelector + 1} from {history.length}
            </label>
            <input
              type="range"
              min={0}
              max={history.length - 1}
              value={historySelector}
              onChange={(e) => setHistorySelector(Number(e.target.value))}
            />
            <InputWrapperHorizontal>
              <Button
                onClick={() => setHistorySelector(historySelector - 1)}
                disabled={historySelector <= 0}
              >
                prev
              </Button>
              <Button
                onClick={() => setHistorySelector(historySelector + 1)}
                disabled={historySelector >= history.length - 1}
              >
                next
              </Button>
            </InputWrapperHorizontal>
          </InputWrapper>
        )}
        {history.length > 0 && (
          <>
            <Title>Animate</Title>
            <InputWrapper>
              <label>Animation duration: {animationDuration}</label>
              <input
                type="range"
                min={1}
                max={10}
                value={animationDuration}
                onChange={(e) => setAnimationDuration(Number(e.target.value))}
              />
            </InputWrapper>
            <InputWrapper>
              <AnimateButton onClick={onAnimateHandle} disabled={isAnimating}>
                Animate
              </AnimateButton>
            </InputWrapper>
          </>
        )}
        <Title>Rendering options</Title>
        <InputWrapper>
          <label>Scale: {scale}</label>
          <input
            value={scale}
            type="range"
            max={16}
            min={1}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </InputWrapper>
      </OptionsWrapper>
    </Wrapper>
  );
};

export default MazeGeneratorApp;
