import {getDieImage} from '../images';
import {Roll} from '../roller';
import {Dice, dieRollImages, interpretResultToHtml, parseFullRoll, toRollResult} from './dice';

test('no roll', () => {
    const rollResult = toRollResult({});
    const resultHtml = interpretResultToHtml(rollResult);

    expect(resultHtml).toBe(`<ul>
<li>No sets.</li>

</ul>`);
});

test('should interpret results', () => {
    const rollResult = toRollResult({
        originalRoll: [1, 7, 7, 3, 6, 3, 7, 7],
        sets: {3: 2, 7: 4},
        looseDice: [1, 6]
    });
    const resultHtml = interpretResultToHtml(rollResult);

    expect(resultHtml).toBe(`<ul>
<li>Set!  <b>2×3</b></li>
<li>Set!  <b>4×7</b></li>
<li>Loose dice: 1, 6</li>
</ul>`);
});

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
