export enum MazeCellType {
  Empty = ' ',
  EmptyVisited = '.',
  Outside = -1,
  Wall = '#',
  Entrance = 's',
  Exit = 'e',
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
  type: MazeCellType;
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
  type: MazeCellType;
}

export type Maze = MazeCellType[][];
