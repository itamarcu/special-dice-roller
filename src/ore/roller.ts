import * as Mustache from 'mustache';
import {combineAll} from '../lang';
import {RandomNumberGenerator} from '../rng';
import {combineRolls, Roll, rollDie, Roller} from '../roller';
import {DieRollView} from '../view';
import {
    D10_TABLE,
    Dice,
    DicePool,
    dieRollImages,
    Faces,
    parseRollValues,
    RollValues,
    rollValuesMonoid,
} from './dice';
import {SimpleParser} from './parser';
import baseOverride from './template';

// foundry types
// @ts-ignore
declare var Hooks;

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
        /*
         setRolls will be something like:
         [
            {rollsInSet: [DRV(2), DRV(2)]},
            {rollsInSet: [DRV(7), DRV(7), DRV(7)]}
         ]
        */
        const setRolls = Object.entries(combinedRolls.sets)
                .map(s => [parseInt(s[0], 10), s[1]])
                .sort((s1, s2) => s1[0] - s2[0])
                .map(s => ({
                        width: s[1],
                        height: s[0],
                        rollsInSet: new Array(s[1])
                            .fill(new DieRollView(new Roll(Dice.D10, s[0] as Faces), dieRollImages))
                    })
                )
        const looseDiceRolls = combinedRolls.looseDice
                .map(ld => new DieRollView(new Roll(Dice.D10_LOOSE, ld as Faces), dieRollImages))

        Hooks.once('renderChatMessage', (_: any, html: any, __: any) => {
            html.find('.ore-sets').on('click', '.ore-set-roll', (event: Event) => {
                event.preventDefault()
                const setsDiv = event.currentTarget as HTMLDivElement;
                setsDiv.style.outline = setsDiv.style.outline === 'dashed' ? 'none' : 'dashed'
            })
        })

        return Mustache.render(
            baseOverride,
            {
                system: this.command,
                canReRoll: this.canReRoll,
                canKeep: this.canKeep,
                flavorText,
                setRolls,
                looseDiceRolls,
                rollIndex(): number {
                    return rolls.indexOf(this);
                },
            },
        );
    }

    protected toDicePool(dice: Dice[]): DicePool {
        return new DicePool(dice.length);
    }
}
