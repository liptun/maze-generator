import { mazeGenerator } from '../maze';
import {
  Maze,
  MazeCell,
  Cell,
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
});
