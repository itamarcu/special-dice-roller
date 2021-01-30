import {IMonoid} from '../lang';
import {Roll} from '../roller';

export enum Dice {
    D10,
    D10_LOOSE,
}

export type Faces = 10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const D10_TABLE: Faces[] = [
    10, 1, 2, 3, 4, 5, 6, 7, 8, 9
];

export class DicePool {
    constructor(
        public d: number,
    ) {
    }

    public toString(): string {
        return `d10s: ${this.d}`;
    }
}

export class RollValues {
    constructor(
        public originalRoll: number[],  // e.g. [1, 7, 7, 3, 6, 3, 7, 7]
        public sets: { [key: number]: number },  // e.g. {3: 2, 7: 4} = 2x3 and 4x7
        public looseDice: number[],  // represents all the rest; up to 1 of each face.  e.g. [1, 6] = 1 and 6
    ) {
    }
}

export const dieRollImages = new Map<Dice, Map<Faces, string>>();
const diceImages = new Map<Faces, string>();
diceImages.set(1, 'd10_1');
diceImages.set(2, 'd10_2');
diceImages.set(3, 'd10_3');
diceImages.set(4, 'd10_4');
diceImages.set(5, 'd10_5');
diceImages.set(6, 'd10_6');
diceImages.set(7, 'd10_7');
diceImages.set(8, 'd10_8');
diceImages.set(9, 'd10_9');
diceImages.set(10, 'd10_10');
dieRollImages.set(Dice.D10, diceImages);
const diceImagesLoose = new Map<Faces, string>();
diceImagesLoose.set(1, 'd10_loose_1');
diceImagesLoose.set(2, 'd10_loose_2');
diceImagesLoose.set(3, 'd10_loose_3');
diceImagesLoose.set(4, 'd10_loose_4');
diceImagesLoose.set(5, 'd10_loose_5');
diceImagesLoose.set(6, 'd10_loose_6');
diceImagesLoose.set(7, 'd10_loose_7');
diceImagesLoose.set(8, 'd10_loose_8');
diceImagesLoose.set(9, 'd10_loose_9');
diceImagesLoose.set(10, 'd10_loose_10');
dieRollImages.set(Dice.D10_LOOSE, diceImagesLoose);

export function parseRollValues(roll: Roll<Dice, Faces>): RollValues {
    return new RollValues([roll.face], {}, [])
}

export function parseFullRoll(fullRoll: number[]): RollValues {
    const counts: number[] = new Array(11).fill(0)  // [0, 1, ..., 9, 10].  the 0 is not used
    for (const k of fullRoll) {
        counts[k] += 1
    }
    const sets: { [key: number]: number } = {}
    const looseDice: number[] = []
    counts.forEach((count, num) => {
        if (count === 0) return  // (will also skip the "0" count)
        if (count === 1) looseDice.push(num)
        if (count >= 2) sets[num] = count
    })
    return new RollValues(fullRoll, sets, looseDice)
}

export function toRollResult(partial: Partial<RollValues>): RollValues {
    return Object.assign(new RollValues([], {}, []), partial);
}

export const rollValuesMonoid: IMonoid<RollValues> = {
    identity: new RollValues([], {}, []),
    combine: (roll1: RollValues, roll2: RollValues) => parseFullRoll(roll1.originalRoll.concat(roll2.originalRoll)),
};

export const dicePoolMonoid: IMonoid<DicePool> = {
    identity: new DicePool(0),
    combine: (roll1: DicePool, roll2: DicePool) => new DicePool(roll1.d + roll2.d),
};
