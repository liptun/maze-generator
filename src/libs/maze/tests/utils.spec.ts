import { queryPossibleMovements } from './../utils';
import {
  Maze,
  MazeDimensions,
  MazeCell,
  MazeCellType,
  Direction,
} from '../types';
import { createEmptyMaze, updateMazeCell, queryMaze } from '../utils';

const mazeDimensions: MazeDimensions = {
  width: 8,
  height: 8,
};

describe('createEmptyMaze()', () => {
  it('Should create empty maze with specified dimensions', () => {
    const maze = createEmptyMaze(mazeDimensions);
    expect(maze).toHaveLength(8);
    maze.forEach((el) => expect(el).toHaveLength(8));
  });

  it('Each cell of new maze should be wall', () => {
    const maze = createEmptyMaze(mazeDimensions);
    maze.forEach((x) => x.forEach((y) => expect(y).toEqual(MazeCellType.Wall)));
  });
});

describe('updateMazeCell()', () => {
  it('Should update one cell and return new maze array', () => {
    const maze = createEmptyMaze(mazeDimensions);
    const cellToUpdate: MazeCell = { x: 3, y: 4, type: MazeCellType.Empty };
    const mazeUpdated = updateMazeCell(maze, cellToUpdate);

    expect(maze).not.toEqual(mazeUpdated);
    expect(maze[4][3]).not.toEqual(cellToUpdate.type);
    expect(mazeUpdated[4][3]).toEqual(cellToUpdate.type);
  });
});

describe('queryMaze', () => {
  it('Should query all wall elements', () => {
    const maze = createEmptyMaze(mazeDimensions);
    const query = MazeCellType.Wall;
    const results = queryMaze(maze, query);
    expect(results).toHaveLength(64);
    results.forEach((result) => expect(result.type).toEqual(query));
  });

  it('Should query entrance element', () => {
    let maze = createEmptyMaze(mazeDimensions);
    maze = updateMazeCell(maze, {
      x: 0,
      y: 0,
      type: MazeCellType.Entrance,
    });
    const query = MazeCellType.Entrance;
    const results = queryMaze(maze, query);
    expect(results).toHaveLength(1);
    results.forEach((result) => expect(result.type).toEqual(query));
  });
});

describe('queryPossibleMovements()', () => {
  it('Possible moves should be bottom and right', () => {
    let maze = createEmptyMaze(mazeDimensions);
    const possibleMovements = queryPossibleMovements(maze, { x: 0, y: 0 });
    expect(possibleMovements).toHaveLength(2);
    expect(possibleMovements).toEqual([Direction.Right, Direction.Bottom]);
  });

  it('Possible moves should be top, left and right', () => {
    let maze = createEmptyMaze(mazeDimensions);
    maze = updateMazeCell(maze, { x: 4, y: 7, type: MazeCellType.Entrance });
    const possibleMovements = queryPossibleMovements(maze, { x: 4, y: 6 });
    expect(possibleMovements).toHaveLength(3);
    expect(possibleMovements).toEqual([
      Direction.Top,
      Direction.Right,
      Direction.Left,
    ]);
  });
});
