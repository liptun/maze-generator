import {createNoise2D} from 'simplex-noise';
import Alea from 'alea';

export const scaleNoise = (noise: number): number => {
  const scaled = noise / 2 + 0.5;
  return Math.max(Math.min(1, scaled), 0);
};

export function* noiseGenerator(stringSeed?: string): Generator<number> {

  const seed = Alea(stringSeed)
  const noise = createNoise2D(seed)
  let delta = 0;
  while (true) {
    delta += 0.1;
    yield scaleNoise(noise(1, delta));
  }
}
