import SimplexNoise from 'simplex-noise';

export const scaleNoise = (noise: number): number => {
  const scaled = noise / 2 + 0.5;
  return Math.max(Math.min(1, scaled), 0);
};

export function* noiseGenerator(seed?: string): Generator<number> {
  const noise = new SimplexNoise(seed);
  let delta = 0;
  while (true) {
    delta += 0.1;
    yield scaleNoise(noise.noise2D(1, delta));
  }
}
