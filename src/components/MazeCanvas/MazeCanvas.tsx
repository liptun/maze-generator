import React, { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { mazeGenerator } from '../../libs/maze/maze';
import { Maze, MazeCellType } from '../../libs/maze/types';

const Wrapper = styled.div`
  padding: 15px;
`;
const Canvas = styled.canvas`
  outline: 1px solid black;
`;

interface Props {
  maze?: Maze;
}

const MazeCanvas: FC<Props> = ({ maze = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.canvas.width = 600;
        ctx.canvas.height = 600;
        maze.forEach((yRow, y) => {
          yRow.forEach((cell, x) => {
            if (cell === MazeCellType.Empty) {
              ctx.fillStyle = '#EEEEEE';
            }
            if (cell === MazeCellType.EmptyVisited) {
              ctx.fillStyle = '#0000EE';
            }
            if (cell === MazeCellType.Wall) {
              ctx.fillStyle = '#333333';
            }
            if (cell === MazeCellType.Entrance) {
              ctx.fillStyle = '#00FF00';
            }
            if (cell === MazeCellType.Exit) {
              ctx.fillStyle = '#FF0000';
            }
            ctx.fillRect(x * 16, y * 16, 16, 16);
          });
        });
      }
    }
  }, [canvasRef, maze]);
  return (
    <Wrapper>
      <Canvas ref={canvasRef} />
    </Wrapper>
  );
};

export default MazeCanvas;
