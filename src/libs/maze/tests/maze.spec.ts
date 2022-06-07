import { mazeGenerator } from '../maze';
import {
  Maze,
  MazeCell,
  MazeCellType,
  MazeGeneratorOptions,
  Direction,
} from './../types';
import { queryMaze } from '../utils';
import { makeDecision } from '../decision';

const mazeOptions: MazeGeneratorOptions = {
  width: 8,
  height: 8,
  seed: 'test',
};

jest.mock('../decision');
const makeDecissionMock = makeDecision as jest.Mock;

describe('mazeGenerator()', () => {
  it('Should generate empty maze', () => {
    const gen = mazeGenerator(mazeOptions);
    let maze = gen.next().value as Maze;
    expect(maze).toHaveLength(mazeOptions.height);
    expect(maze[0]).toHaveLength(mazeOptions.width);
  });

  it('Should generate entrance on top wall and exit on bottom wall', () => {
    makeDecissionMock
      .mockReturnValueOnce(Direction.Top)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(5);
    const gen = mazeGenerator(mazeOptions);

    const maze1 = gen.next().value as Maze;
    expect(queryMaze(maze1, MazeCellType.Entrance)).toHaveLength(0);
    expect(queryMaze(maze1, MazeCellType.Exit)).toHaveLength(0);

    const maze2 = gen.next().value as Maze;
    expect(queryMaze(maze2, MazeCellType.Entrance)).toHaveLength(1);
    expect(queryMaze(maze2, MazeCellType.Exit)).toHaveLength(0);

    const maze3 = gen.next().value as Maze;
    expect(queryMaze(maze3, MazeCellType.Entrance)).toHaveLength(1);
    expect(queryMaze(maze3, MazeCellType.Exit)).toHaveLength(1);

    const entrance = queryMaze(maze3, MazeCellType.Entrance).pop();
    const exit = queryMaze(maze3, MazeCellType.Exit).pop();

    expect(entrance).toEqual({ type: MazeCellType.Entrance, x: 3, y: 0 });
    expect(exit).toEqual({
      type: MazeCellType.Exit,
      x: 5,
      y: mazeOptions.height - 1,
    });
  });

  it('Should generate entrance on left wall and exit on right wall', () => {
    makeDecissionMock
      .mockReturnValueOnce(Direction.Left)
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(6);
    const gen = mazeGenerator(mazeOptions);
    gen.next();
    gen.next();
    const maze = gen.next().value as Maze;

    const entrance = queryMaze(maze, MazeCellType.Entrance).pop();
    const exit = queryMaze(maze, MazeCellType.Exit).pop();

    expect(entrance).toEqual({ type: MazeCellType.Entrance, x: 0, y: 2 });
    expect(exit).toEqual({
      type: MazeCellType.Exit,
      x: mazeOptions.width - 1,
      y: 6,
    });
  });

  it('Should generate entrance on right wall and exit on left wall', () => {
    makeDecissionMock
      .mockReturnValueOnce(Direction.Right)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(3);
    const gen = mazeGenerator(mazeOptions);
    gen.next();
    gen.next();
    const maze = gen.next().value as Maze;

    const entrance = queryMaze(maze, MazeCellType.Entrance).pop();
    const exit = queryMaze(maze, MazeCellType.Exit).pop();

    expect(entrance).toEqual({
      type: MazeCellType.Entrance,
      x: mazeOptions.width - 1,
      y: 1,
    });
    expect(exit).toEqual({
      type: MazeCellType.Exit,
      x: 0,
      y: 3,
    });
  });

  it('Should generate entrance on bottom wall and exit on top wall', () => {
    makeDecissionMock
      .mockReturnValueOnce(Direction.Bottom)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(2);
    const gen = mazeGenerator(mazeOptions);
    gen.next();
    gen.next();
    const maze = gen.next().value as Maze;

    const entrance = queryMaze(maze, MazeCellType.Entrance).pop();
    const exit = queryMaze(maze, MazeCellType.Exit).pop();

    expect(entrance).toEqual({
      type: MazeCellType.Entrance,
      x: 5,
      y: mazeOptions.height - 1,
    });
    expect(exit).toEqual({
      type: MazeCellType.Exit,
      x: 2,
      y: 0,
    });
  });

  it('Should clear wall on top of entrance', () => {
    makeDecissionMock
      .mockReturnValueOnce(Direction.Bottom)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(Direction.Top);

    const gen = mazeGenerator(mazeOptions);
    gen.next();
    gen.next();
    gen.next();
    const maze = gen.next().value as Maze;
    const entrance = queryMaze(maze, MazeCellType.Entrance).pop() as MazeCell;
    expect(maze[entrance.y - 1][entrance.x]).toEqual(MazeCellType.Empty);
  });
});
