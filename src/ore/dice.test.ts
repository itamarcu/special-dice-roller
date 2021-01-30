import {getDieImage} from '../images';
import {Roll} from '../roller';
import {Dice, dieRollImages, parseFullRoll} from './dice';

test('counts sets correctly', () => {
    const fullRoll = [6, 7, 10, 10, 6, 6]
    const rollResult = parseFullRoll(fullRoll)
    expect(rollResult.originalRoll).toBe(fullRoll);
    expect(rollResult.sets).toMatchObject({6: 3, 10: 2});
    expect(rollResult.looseDice).toMatchObject([7]);
});

test('should get a 3 dice image', () => {
    const roll = new Roll(Dice.D10, 3);

    expect(getDieImage(dieRollImages, roll.die, roll.face)).toBe('d10_3');
});
