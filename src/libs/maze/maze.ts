import { makeDecision } from './decision';
import { noiseGenerator } from './noise';
import {
  MazeCell,
  MazeCellType,
  MazeCoordinate,
  MazeGeneratorOptions,
  Direction,
} from './types';
import {
  createEmptyMaze,
  updateMazeCell,
  queryPossibleMovements,
} from './utils';

export function* mazeGenerator<Maze>({
  width,
  height,
  seed,
}: MazeGeneratorOptions) {
  // create noise generator
  const noise = noiseGenerator(seed);
  // create empty maze
  let maze = createEmptyMaze({ width, height });
  yield maze;
  // put one entrance
  const entranceWallOptions = [
    Direction.Top,
    Direction.Right,
    Direction.Bottom,
    Direction.Left,
  ];
  const entranceWall = makeDecision(entranceWallOptions, noise.next().value);
  const entranceWallWidth = [Direction.Top, Direction.Bottom].includes(
    entranceWall
  )
    ? width
    : height;
  const entranceOffsetOptions = Array(entranceWallWidth)
    .fill(0)
    .map((_, i) => i);

  const entranceOffset = makeDecision(
    entranceOffsetOptions,
    noise.next().value
  );
  const mazeEntrance: MazeCell = {
    x: 0,
    y: 0,
    type: MazeCellType.Entrance,
  };

  if ([Direction.Top, Direction.Bottom].includes(entranceWall)) {
    mazeEntrance.x = entranceOffset;
    mazeEntrance.y = entranceWall === Direction.Top ? 0 : height - 1;
  }
  if ([Direction.Right, Direction.Left].includes(entranceWall)) {
    mazeEntrance.x = entranceWall === Direction.Left ? 0 : width - 1;
    mazeEntrance.y = entranceOffset;
  }

  maze = updateMazeCell(maze, mazeEntrance);
  yield maze;

  // put one exit
  const mazeExit: MazeCell = {
    x: 0,
    y: 0,
    type: MazeCellType.Exit,
  };

  const exitOffsetOptions = [...entranceOffsetOptions];
  const exitOffset = makeDecision(exitOffsetOptions, noise.next().value);

  if ([Direction.Top, Direction.Bottom].includes(entranceWall)) {
    mazeExit.x = exitOffset;
    mazeExit.y = entranceWall === Direction.Top ? height - 1 : 0;
  }
  if ([Direction.Right, Direction.Left].includes(entranceWall)) {
    mazeExit.x = entranceWall === Direction.Left ? width - 1 : 0;
    mazeExit.y = exitOffset;
  }

  maze = updateMazeCell(maze, mazeExit);
  yield maze;

  // start walking in random possible direction until no move is possible
  const cursor: MazeCoordinate = { x: mazeEntrance.x, y: mazeEntrance.y };
  // const cursorPrev: MazeCoordinate = { ...cursor };
  const cursorHistory: MazeCoordinate[] = [];
  while (true) {
    cursorHistory.push({ ...cursor });
    const possibleMoves = queryPossibleMovements(maze, cursor);
    if (possibleMoves.length > 0) {
      const move = makeDecision(possibleMoves, noise.next().value);
      if ([Direction.Top, Direction.Bottom].includes(move)) {
        cursor.y += move === Direction.Top ? -1 : 1;
      }
      if ([Direction.Right, Direction.Left].includes(move)) {
        cursor.x += move === Direction.Right ? 1 : -1;
      }
      maze = updateMazeCell(maze, { ...cursor, type: MazeCellType.Empty });
    } else {
      // mark current cell as visited and move cursor to previous position
      maze = updateMazeCell(maze, {
        ...cursor,
        type: MazeCellType.EmptyVisited,
      });
      cursor.x = cursorHistory[cursorHistory.length - 2].x
      cursor.y = cursorHistory[cursorHistory.length - 2].y
    }
    yield maze;
  }
}
