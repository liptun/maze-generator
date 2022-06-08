export enum Cell {
  Empty = ' ',
  EmptyVisited = '.',
  Outside = -1,
  Wall = '#',
  Entrance = 's',
  EntranceVisited = 'S',
  Exit = 'e',
  ExitVisited = 'E',
}

export interface MazeCoordinate {
  x: number;
  y: number;
}

export interface MazeDimensions {
  width: number;
  height: number;
}
export interface MazeCell extends MazeCoordinate {
  type: Cell;
}

export interface MazeGeneratorOptions extends MazeDimensions {
  seed: string;
}

export enum Direction {
  Top = 'TOP',
  Right = 'RIGHT',
  Bottom = 'BOTTOM',
  Left = 'LEFT',
}

export interface Surrounding {
  direction: Direction;
  type: Cell;
}

export type Maze = Cell[][];
