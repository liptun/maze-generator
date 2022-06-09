import React, { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Maze, Cell } from '../libs/maze/types';

const Wrapper = styled.div`
  padding: 1px;
  display: flex;
  justify-content: center;
`;
const Canvas = styled.canvas`
  outline: 1px solid #ccc;
`;

interface Props {
  maze?: Maze;
  scale?: number;
  width?: number;
  height?: number;
}

const MazeCanvas: FC<Props> = ({
  maze = [],
  scale = 16,
  width = 600,
  height = 600,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        maze.forEach((yRow, y) => {
          yRow.forEach((cell, x) => {
            if (cell === Cell.Empty) {
              ctx.fillStyle = '#EEEEEE';
            }
            if (cell === Cell.EmptyVisited) {
              ctx.fillStyle = '#0000FF';
            }
            if (cell === Cell.Wall) {
              ctx.fillStyle = '#444444';
            }
            if (cell === Cell.Entrance) {
              ctx.fillStyle = '#00FF00';
            }
            if (cell === Cell.EntranceVisited) {
              ctx.fillStyle = '#008800';
            }
            if (cell === Cell.Exit) {
              ctx.fillStyle = '#FF0000';
            }
            if (cell === Cell.ExitVisited) {
              ctx.fillStyle = '#880000';
            }
            ctx.fillRect(x * scale, y * scale, scale, scale);
          });
        });
      }
    }
  }, [canvasRef, maze, scale, width, height]);
  return (
    <Wrapper>
      <Canvas ref={canvasRef} />
    </Wrapper>
  );
};

export default MazeCanvas;
