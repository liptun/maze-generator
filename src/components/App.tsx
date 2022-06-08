import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { mazeGenerator } from '../libs/maze/maze';
import { Maze } from '../libs/maze/types';
import MazeCanvas from './MazeCanvas/MazeCanvas';

const Wrapper = styled.div`
  display: grid;
  grid-gap: 5px;
`;

function App() {
  const [seed, setSeed] = useState('test');
  const [width, setWidth] = useState(16);
  const [height, setHeight] = useState(16);
  const [scale, setScale] = useState(16);
  const [maze, setMaze] = useState<Maze>([]);
  const [iterations, setIterations] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const mazeGen = mazeGenerator({ width, height, seed });
    for (let i = 0; i < iterations - 1; i++) {
      mazeGen.next();
    }
    const maze = mazeGen.next().value as Maze;
    setMaze(maze);
  }, [seed, width, height, iterations]);

  const onGenerateHandle = useCallback(() => {
    const mazeGen = mazeGenerator({ width, height, seed });
    setIsAnimating(true);
    for (let i = 0; i < iterations; i++) {
      setTimeout(() => {
        setMaze(mazeGen.next().value as Maze);
      }, 10 * i);
    }
    setTimeout(() => setIsAnimating(false), 10 * iterations)
  }, [seed, width, height, iterations]);

  return (
    <Wrapper>
      <label>Seed:</label>
      <input value={seed} onChange={(e) => setSeed(e.target.value)} />
      <label>Width:</label>
      <input
        value={width}
        type="number"
        max={512}
        onChange={(e) => setWidth(Number(e.target.value))}
      />
      <label>Height:</label>
      <input
        value={height}
        type="number"
        max={512}
        onChange={(e) => setHeight(Number(e.target.value))}
      />
      <label>Scale:</label>
      <input
        value={scale}
        type="number"
        max={16}
        onChange={(e) => setScale(Number(e.target.value))}
      />
      <label>Iterations:</label>
      <input
        value={iterations}
        type="number"
        min={1}
        onChange={(e) => setIterations(Number(e.target.value))}
      />

      <button onClick={onGenerateHandle} disabled={isAnimating}>
        Generate
      </button>
      <MazeCanvas maze={maze} scale={scale} />
    </Wrapper>
  );
}

export default App;
