import {makeRng} from '../rng';
import {Dice, DicePool} from './dice';
import {ORERoller} from './roller';

test('should react to ore command', () => {
    const roller = new ORERoller(makeRng(0), 'ore');
    expect(roller.handlesCommand('/ore ')).toBe(true);
});

test('should roll 1d - [7]', () => {
    const roller = new ORERoller(makeRng(7), '');
    const result = roller.roll(new DicePool(1));

    expect(result.length).toBe(1);
    expect(result[0].die).toBe(Dice.D10);
    expect(result[0].face).toBe(7);
});

test('should roll 1d - [10]', () => {
    const roller = new ORERoller(makeRng(0), '');
    const result = roller.roll(new DicePool(1));

    expect(result.length).toBe(1);
    expect(result[0].die).toBe(Dice.D10);
    expect(result[0].face).toBe(10);
});

test('should roll a [2, 3, 2]', () => {
    const roller = new ORERoller(makeRng(2, 3, 2), '');
    const result = roller.roll(new DicePool(3));

    expect(result.length).toBe(3);
    expect(result[0].face).toBe(2);
    expect(result[1].face).toBe(3);
    expect(result[2].face).toBe(2);
});
