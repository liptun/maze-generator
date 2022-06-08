import React, { useEffect, useState } from 'react';
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
  const [width, setWidth] = useState(32);
  const [height, setHeight] = useState(32);
  const [maze, setMaze] = useState<Maze>([]);

  useEffect(() => {
    const mazeGen = mazeGenerator({ width, height, seed });
    for (let i = 0; i < 100; i++) {
      mazeGen.next();
    }
    const maze = mazeGen.next().value as Maze;
    setMaze(maze);
  }, [seed, width, height]);

  return (
    <Wrapper>
      <label>Seed:</label>
      <input value={seed} onChange={(e) => setSeed(e.target.value)} />
      <label>Width:</label>
      <input
        value={width}
        type="number"
        onChange={(e) => setWidth(Number(e.target.value))}
      />
      <label>Height:</label>
      <input
        value={height}
        type="number"
        onChange={(e) => setHeight(Number(e.target.value))}
      />

      <button>Generate</button>
      <MazeCanvas maze={maze} />
    </Wrapper>
  );
}

export default App;
