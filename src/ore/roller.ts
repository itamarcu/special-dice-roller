import * as Mustache from 'mustache';
import {combineAll} from '../lang';
import {RandomNumberGenerator} from '../rng';
import {combineRolls, Roll, rollDie, Roller} from '../roller';
import base from '../template';
import {DieRollView} from '../view';
import {
    D10_TABLE,
    Dice,
    DicePool,
    dieRollImages,
    Faces,
    interpretResultToHtml,
    parseRollValues,
    RollValues,
    rollValuesMonoid,
} from './dice';
import {SimpleParser} from './parser';

export class ORERoller extends Roller<Dice, Faces, DicePool> {

    constructor(private rng: RandomNumberGenerator, command: string) {
        super(command, [new SimpleParser()], false, false);
    }

    public roll(pool: DicePool): Roll<Dice, Faces>[] {
        return [
            ...rollDie(pool.d, Dice.D10, D10_TABLE, this.rng),
        ];
    }

    public combineRolls(rolls: Roll<Dice, Faces>[]): RollValues {
        const results = rolls
            .map((roll) => parseRollValues(roll));
        return combineAll(results, rollValuesMonoid);
    }

    public toRoll(die: number, faceIdx: number): Roll<Dice, Faces> {
        // NOTICE:  I'm converting from an "enum index" (0 to 9) to a die face (1 to 10)
        // 1 → 1, 2 → 2, ..., 9 → 9, 0 → 10
        // (this is a bit more readable when doing RNG override in tests)
        return new Roll(die, faceIdx === 0 ? 10 : faceIdx as Faces);
    }

    public formatRolls(rolls: Roll<Dice, Faces>[], flavorText?: string): string {
        const combinedRolls = combineRolls(rolls, parseRollValues, rollValuesMonoid);
        return Mustache.render(
            base,
            {
                system: this.command,
                canReRoll: this.canReRoll,
                canKeep: this.canKeep,
                flavorText,
                rolls: rolls
                    .sort((r1, r2) => r1.face - r2.face)
                    .map((roll) => {
                        return new DieRollView(roll, dieRollImages)
                    }),
                rollIndex(): number {
                    return rolls.indexOf(this);
                },
            },
            {interpretation: interpretResultToHtml(combinedRolls)},
        );
    }

    protected toDicePool(dice: Dice[]): DicePool {
        return new DicePool(dice.length);
    }
}
