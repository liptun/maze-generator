import { makeDecision } from './decision';
import { noiseGenerator } from './noise';
import {
  MazeCell,
  Cell,
  MazeCoordinate,
  MazeGeneratorOptions,
  Direction,
} from './types';
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
  const cursor: MazeCoordinate = { ...mazeStartingPoint };
  let mazeIsReady = false;
  while (!mazeIsReady) {
    const possibleMoves = queryPossibleMovements(maze, cursor);
    if (possibleMoves.length > 0) {
      const move = makeDecision(possibleMoves, noise.next().value);
      if ([Direction.Top, Direction.Bottom].includes(move)) {
        cursor.y += move === Direction.Top ? -1 : 1;
      }
      if ([Direction.Right, Direction.Left].includes(move)) {
        cursor.x += move === Direction.Right ? 1 : -1;
      }
      if (![Cell.Exit].includes(getCell(maze, cursor))) {
        maze = updateMazeCell(maze, { ...cursor, type: Cell.Empty });
      }
    } else {
      // mark current cell as visited and move cursor to previous position
      let replacement = Cell.EmptyVisited;
      if (getCell(maze, { ...cursor }) === Cell.Exit) {
        replacement = Cell.ExitVisited;
      }
      if (getCell(maze, { ...cursor }) === Cell.Entrance) {
        replacement = Cell.EntranceVisited;
      }

      maze = updateMazeCell(maze, {
        ...cursor,
        type: replacement,
      });

      const emptySpaces = queryForEmptySpace(maze, cursor);
      if (emptySpaces.length >= 1) {
        const emptySpaceDirection = emptySpaces.pop() as Direction;
        if ([Direction.Top, Direction.Bottom].includes(emptySpaceDirection)) {
          cursor.y += emptySpaceDirection === Direction.Top ? -1 : 1;
        }
        if ([Direction.Right, Direction.Left].includes(emptySpaceDirection)) {
          cursor.x += emptySpaceDirection === Direction.Right ? 1 : -1;
        }
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

  // put one entrance
  // const entranceWallOptions = [
  //   Direction.Top,
  //   Direction.Right,
  //   Direction.Bottom,
  //   Direction.Left,
  // ];
  // const entranceWall = makeDecision(entranceWallOptions, noise.next().value);
  // const entranceWallWidth = [Direction.Top, Direction.Bottom].includes(
  //   entranceWall
  // )
  //   ? width
  //   : height;
  // const entranceOffsetOptions = Array(entranceWallWidth)
  //   .fill(0)
  //   .map((_, i) => i);

  // const entranceOffset = makeDecision(
  //   entranceOffsetOptions,
  //   noise.next().value
  // );
  // const mazeEntrance: MazeCell = {
  //   x: 0,
  //   y: 0,
  //   type: Cell.Entrance,
  // };

  // if ([Direction.Top, Direction.Bottom].includes(entranceWall)) {
  //   mazeEntrance.x = entranceOffset;
  //   mazeEntrance.y = entranceWall === Direction.Top ? 0 : height - 1;
  // }
  // if ([Direction.Right, Direction.Left].includes(entranceWall)) {
  //   mazeEntrance.x = entranceWall === Direction.Left ? 0 : width - 1;
  //   mazeEntrance.y = entranceOffset;
  // }

  // maze = updateMazeCell(maze, mazeEntrance);
  // yield maze;

  // // put one exit
  // const mazeExit: MazeCell = {
  //   x: 0,
  //   y: 0,
  //   type: Cell.Exit,
  // };

  // const exitOffsetOptions = [...entranceOffsetOptions];
  // const exitOffset = makeDecision(exitOffsetOptions, noise.next().value);

  // if ([Direction.Top, Direction.Bottom].includes(entranceWall)) {
  //   mazeExit.x = exitOffset;
  //   mazeExit.y = entranceWall === Direction.Top ? height - 1 : 0;
  // }
  // if ([Direction.Right, Direction.Left].includes(entranceWall)) {
  //   mazeExit.x = entranceWall === Direction.Left ? width - 1 : 0;
  //   mazeExit.y = exitOffset;
  // }

  // maze = updateMazeCell(maze, mazeExit);
  // yield maze;
}
