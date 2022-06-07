export const makeDecision = <T>(choices: T[], noise: number): T => {
  if (noise < 0 || noise > 1) {
    throw new Error('Noise value must be between 0 and 1');
  }
  if (choices.length < 1) {
    throw new Error('Choices array must contain at least one element');
  }
  const randomIndex = Math.floor(noise * choices.length);
  const minIndex = 0;
  const maxIndex = choices.length - 1;
  const index = Math.max(Math.min(randomIndex, maxIndex), minIndex);
  return choices[index];
};
