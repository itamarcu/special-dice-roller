import {getDieImage} from '../images';
import {Roll} from '../roller';
import {Dice, dieRollImages, interpretResult, parseFullRoll, toRollResult} from './dice';

test('no roll', () => {
    const rollResult = toRollResult({});
    const result = interpretResult(rollResult);

    expect(result.setsReadable).toBe('---');
});

test('should interpret results', () => {
    const rollResult = toRollResult({
        originalRoll: [1, 7, 7, 3, 6, 3, 7, 7],
        sets: {3: 2, 7: 4},
        singles: {1: true, 6: true},
    });
    const result = interpretResult(rollResult);

    expect(result.setsReadable).toBe('2×3   4×7');
});

test('should interpret results here too', () => {
    const rollResult = toRollResult({
        originalRoll: [1, 2, 3],
        sets: {},
        singles: {1: true, 2: true, 3: true},
    });
    const result = interpretResult(rollResult);

    expect(result.setsReadable).toBe('---');
});

test('counts sets correctly', () => {
    const fullRoll = [6, 7, 10, 10, 6, 6]
    const rollResult = parseFullRoll(fullRoll)
    expect(rollResult.originalRoll).toBe(fullRoll);
    expect(rollResult.sets).toMatchObject({6: 3, 10: 2});
    expect(rollResult.singles).toMatchObject({7: true});
});

test('should get a 3 dice image', () => {
    const roll = new Roll(Dice.D10, 3);

    expect(getDieImage(dieRollImages, roll.die, roll.face)).toBe('d10_3');
});
