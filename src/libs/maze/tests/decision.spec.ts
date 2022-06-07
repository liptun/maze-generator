import { makeDecision } from './../decision';

describe('makeDecision()', () => {
  it('When only one choice is provided should return that choice', () => {
    const choice = 'one';
    expect(makeDecision([choice], 0)).toEqual(choice);
    expect(makeDecision([choice], 0.5)).toEqual(choice);
    expect(makeDecision([choice], 1)).toEqual(choice);
  });

  it('When two choices is provided should return one of them based of noise value', () => {
    const choices = ['one', 'two'];
    let noise = 0.4;
    expect(makeDecision(choices, noise)).toEqual(choices[0]);
    noise = 0.5;
    expect(makeDecision(choices, noise)).toEqual(choices[1]);
  });

  it('Should throw error when noise is not between 0 and 1', () => {
    expect(() => makeDecision(['one'], -1)).toThrowError();
    expect(() => makeDecision(['one'], 1)).not.toThrowError();
    expect(() => makeDecision(['one'], 1.1)).toThrowError();
  });

  it('Should throw error when choices array is empty', () => {
    expect(() => makeDecision([], 0)).toThrowError();
    expect(() => makeDecision(['x'], 1)).not.toThrowError();
  });
});
