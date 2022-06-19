import { makeDecision } from './decision';
import { noiseGenerator } from './noise';
import { Cell, MazeCoordinate, MazeGeneratorOptions, Direction } from './types';
import {
  createEmptyMaze,
  updateMazeCell,
  queryPossibleMovements,
  getCell,
  queryForEmptySpace,
  queryMaze,
} from './utils';

export function* mazeGenerator({ width, height, seed }: MazeGeneratorOptions) {
  // create noise generator
  const noise = noiseGenerator(seed);
  // create empty maze
  let maze = createEmptyMaze({ width, height });
  yield maze;

  const startingWallOptions = [
    Direction.Top,
    Direction.Right,
    Direction.Bottom,
    Direction.Left,
  ];
  const startingWall = makeDecision(startingWallOptions, noise.next().value);
  const startingWallWidth = [Direction.Top, Direction.Bottom].includes(
    startingWall
  )
    ? width
    : height;
  const startingOffsetOptions = Array(startingWallWidth)
    .fill(0)
    .map((_, i) => i);

  const entranceOffset = makeDecision(
    startingOffsetOptions,
    noise.next().value
  );
  const mazeStartingPoint: MazeCoordinate = {
    x: 0,
    y: 0,
  };

  if ([Direction.Top, Direction.Bottom].includes(startingWall)) {
    mazeStartingPoint.x = entranceOffset;
    mazeStartingPoint.y = startingWall === Direction.Top ? 0 : height - 1;
  }
  if ([Direction.Right, Direction.Left].includes(startingWall)) {
    mazeStartingPoint.x = startingWall === Direction.Left ? 0 : width - 1;
    mazeStartingPoint.y = entranceOffset;
  }
  // start walking in random possible direction until no move is possible
  const cursors: MazeCoordinate[] = [{ ...mazeStartingPoint }];
  let mazeIsReady = false;
  while (!mazeIsReady) {
    const possibleMoves = queryPossibleMovements(maze, cursors[0]);
    if (possibleMoves.length > 0) {
      const move = makeDecision(possibleMoves, noise.next().value);
      if ([Direction.Top, Direction.Bottom].includes(move)) {
        cursors[0].y += move === Direction.Top ? -1 : 1;
      }
      if ([Direction.Right, Direction.Left].includes(move)) {
        cursors[0].x += move === Direction.Right ? 1 : -1;
      }
      if (![Cell.Exit].includes(getCell(maze, cursors[0]))) {
        maze = updateMazeCell(maze, { ...cursors[0], type: Cell.Empty });
      }
    } else {
      // mark current cell as visited and move cursor to previous position
      let replacement = Cell.EmptyVisited;
      if (getCell(maze, { ...cursors[0] }) === Cell.Exit) {
        replacement = Cell.ExitVisited;
      }
      if (getCell(maze, { ...cursors[0] }) === Cell.Entrance) {
        replacement = Cell.EntranceVisited;
      }

      maze = updateMazeCell(maze, {
        ...cursors[0],
        type: replacement,
      });

      const queryCursorPosition = cursors[0];

      const emptySpaces = queryForEmptySpace(maze, queryCursorPosition);
      if (emptySpaces.length >= 1) {
        emptySpaces.forEach((emptySpaceDirection, index) => {
          if (cursors[index] === undefined) {
            cursors[index] = { ...queryCursorPosition };
          }
          if ([Direction.Top, Direction.Bottom].includes(emptySpaceDirection)) {
            cursors[index].y += emptySpaceDirection === Direction.Top ? -1 : 1;
          }
          if ([Direction.Right, Direction.Left].includes(emptySpaceDirection)) {
            cursors[index].x +=
              emptySpaceDirection === Direction.Right ? 1 : -1;
          }
        });
      } else if (cursors.length > 1) {
        cursors.pop();
      } else {
        /// maze is ready
        yield maze;
        mazeIsReady = true;
      }
    }
    yield maze;
  }
  // replace all visited cells with empty cells
  const visited = queryMaze(maze, Cell.EmptyVisited);
  visited.forEach((cell) => {
    maze = updateMazeCell(maze, { ...cell, type: Cell.Empty });
  });
  const exit = queryMaze(maze, Cell.ExitVisited).pop();
  if (exit) {
    maze = updateMazeCell(maze, { ...exit, type: Cell.Exit });
  }
  const entrance = queryMaze(maze, Cell.EntranceVisited).pop();
  if (entrance) {
    maze = updateMazeCell(maze, { ...entrance, type: Cell.Entrance });
  }
  yield maze;
  // query for all border empty spaces
  const allEmptySpaces = queryMaze(maze, Cell.Empty);
  const entranceOptions = allEmptySpaces.filter(
    ({ x, y }) => x === 0 || y === 0 || x === width - 1 || y === height - 1
  );
  // put entrance
  const mazeEntrance = makeDecision(entranceOptions, noise.next().value);
  maze = updateMazeCell(maze, { ...mazeEntrance, type: Cell.Entrance });
  yield maze;
  // put exit

  const exitOptions = entranceOptions.filter(
    ({ x, y }) => x !== mazeEntrance.x && y !== mazeEntrance.y
  );

  const mazeExit = makeDecision(exitOptions, noise.next().value);
  maze = updateMazeCell(maze, { ...mazeExit, type: Cell.Exit });
  yield maze;
}
