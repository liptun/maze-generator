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
  grid-template-columns: auto 400px;
  min-height: 95vh;
  @media (max-width: 1000px) {
    grid-template-columns: auto;
  }
`;

const MazeWrapper = styled.div`
  padding: 15px;
  @media (max-width: 1000px) {
    order: 2;
  }
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

const MazeGeneratorApp: FC = () => {
  const [seed, setSeed] = useState('test');
  const [width, setWidth] = useState(256);
  const [height, setHeight] = useState(256);
  const [scale, setScale] = useState(4);
  const [maze, setMaze] = useState<Maze>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [renderSize, setRenderSize] = useState({ width: 600, height: 600 });
  const generatorTimer = useRef<NodeJS.Timer>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mazeGen = useRef<Generator>();

  useEffect(() => {
    if (wrapperRef.current) {
      setRenderSize({
        width: wrapperRef.current.clientWidth - 50,
        height: wrapperRef.current.clientHeight - 50,
      });
    }
  }, [wrapperRef]);

  const onRandomSeedHandle = useCallback(() => {
    const newSeed = String(Math.random()).substring(2);
    setSeed(newSeed);
  }, []);

  const onGenerateHandle = useCallback(() => {
    setIsGenerating(true);
    setMaze([])
    mazeGen.current = mazeGenerator({ width, height, seed });
  }, [width, height, seed]);

  const onCancelGenerateHandle = useCallback(() => {
    setIsGenerating(false);
  }, []);

  useEffect(() => {
    if (isGenerating && mazeGen.current !== undefined) {
      let mazeReady = false;
      generatorTimer.current = setInterval(() => {
        if (mazeReady) {
          clearInterval(generatorTimer.current);
        } else {
          let bulk = 1000;
          let mazeDraft: Maze = [];
          while (!mazeReady && bulk > 0) {
            const mazeStage = mazeGen.current?.next();
            bulk--;
            if (mazeStage?.done) {
              mazeReady = true;
              setIsGenerating(false);
            } else {
              mazeDraft = mazeStage?.value as Maze;
            }
          }
          setMaze(mazeDraft);
        }
      }, 0);
    } else {
      clearInterval(generatorTimer.current);
    }
  }, [isGenerating, seed, width, height]);

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
          <Input value={seed} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeed(e.target.value)} />
          <Button onClick={() => onRandomSeedHandle()}>random seed</Button>
        </InputWrapper>
        <InputWrapper>
          <label>Width: {width}</label>
          <input
            value={width}
            type="range"
            min={3}
            max={512}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </InputWrapper>
        <InputWrapper>
          <label>Height: {height}</label>
          <input
            value={height}
            type="range"
            min={3}
            max={512}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </InputWrapper>
        <InputWrapper>
          {!isGenerating ? (
            <>
              <GenerateButton onClick={onGenerateHandle}>
                Generate
              </GenerateButton>
            </>
          ) : (
            <>
              <GenerateButton onClick={onCancelGenerateHandle}>
                Cancel generating
              </GenerateButton>
            </>
          )}
        </InputWrapper>
        <Title>Rendering options</Title>
        <InputWrapper>
          <label>Scale: {scale}</label>
          <input
            value={scale}
            type="range"
            max={64}
            min={1}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </InputWrapper>
      </OptionsWrapper>
    </Wrapper>
  );
};

export default MazeGeneratorApp;
