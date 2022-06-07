import {
  Maze,
  MazeDimensions,
  MazeCell,
  MazeCellType,
  MazeCoordinate,
  Direction,
} from './types';

export const createEmptyMaze = ({ width, height }: MazeDimensions): Maze =>
  new Array(height).fill(new Array(width).fill(MazeCellType.Wall));

export const updateMazeCell = (maze: Maze, cellToUpdate: MazeCell): Maze => {
  const mazeUpdate = [...maze.map((row) => [...row])];
  const { x, y, type } = cellToUpdate;
  mazeUpdate[y][x] = type;
  return mazeUpdate;
};

export const queryMaze = (maze: Maze, queryType: MazeCellType): MazeCell[] => {
  const results: MazeCell[] = [];
  maze.forEach((yRow, y) => {
    yRow.forEach((type, x) => {
      if (queryType === type) {
        results.push({
          x,
          y,
          type,
        });
      }
    });
  });
  return results;
};

export const getMazeCellType = (
  maze: Maze,
  { x, y }: MazeCoordinate
): MazeCellType => {
  if (y < 0 || y >= maze.length || x < 0 || x >= maze[0].length) {
    return MazeCellType.Outside;
  }
  return maze[y][x];
};

export const queryPossibleMovements = (
  maze: Maze,
  { x, y }: MazeCoordinate
): Direction[] => {
  const result: Direction[] = [];
  const free = MazeCellType.Wall;
  // top
  if (getMazeCellType(maze, { x, y: y - 1 }) === free) {
    [free, MazeCellType.Outside].includes(
      getMazeCellType(maze, { x: x - 1, y: y - 1 })
    ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x: x + 1, y: y - 1 })
      ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x: x - 1, y: y - 2 })
      ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x, y: y - 2 })
      ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x: x + 1, y: y - 2 })
      ) &&
      result.push(Direction.Top);
  }
  // right
  if (getMazeCellType(maze, { x: x + 1, y }) === free) {
    [free, MazeCellType.Outside].includes(
      getMazeCellType(maze, { x: x + 1, y: y - 1 })
    ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x: x + 1, y: y + 1 })
      ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x: x + 2, y: y - 1 })
      ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x: x + 2, y })
      ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x: x + 2, y: y + 1 })
      ) &&
      result.push(Direction.Right);
  }
  // bottom
  if (getMazeCellType(maze, { x, y: y + 1 }) === free) {
    [free, MazeCellType.Outside].includes(
      getMazeCellType(maze, { x: x - 1, y: y + 1 })
    ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x: x + 1, y: y + 1 })
      ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x: x - 1, y: y + 2 })
      ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x, y: y + 2 })
      ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x: x + 1, y: y + 2 })
      ) &&
      result.push(Direction.Bottom);
  }
  // left
  if (getMazeCellType(maze, { x: x - 1, y }) === free) {
    [free, MazeCellType.Outside].includes(
      getMazeCellType(maze, { x: x - 1, y: y - 1 })
    ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x: x - 1, y: y + 1 })
      ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x: x - 2, y: y - 1 })
      ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x: x - 2, y })
      ) &&
      [free, MazeCellType.Outside].includes(
        getMazeCellType(maze, { x: x - 2, y: y + 1 })
      ) &&
      result.push(Direction.Left);
  }

  return result;
};
