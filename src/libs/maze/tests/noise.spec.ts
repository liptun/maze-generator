import { noiseGenerator, scaleNoise } from '../noise';

describe('Noise generator', () => {
  it('Should numbers from range -1 and 1 scale properly', () => {
    expect(scaleNoise(1)).toEqual(1);
    expect(scaleNoise(0)).toEqual(0.5);
    expect(scaleNoise(-1)).toEqual(0);
  });

  it('Should clip to 1 numbers larger than 1', () => {
    expect(scaleNoise(1.1)).toEqual(1);
    expect(scaleNoise(2)).toEqual(1);
  });

  it('Should clip to 0 numbers smaller than -1', () => {
    expect(scaleNoise(-1.1)).toEqual(0);
    expect(scaleNoise(-2)).toEqual(0);
  });

  it('Generator should return numeric value', () => {
    const noise = noiseGenerator('seed');
    expect(typeof noise.next().value).toBe('number');
  });
});
