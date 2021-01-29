import {IMonoid} from '../lang';
import {Roll} from '../roller';

export enum Dice {
    D10,
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
        public sets: {[key: number] : number},  // e.g. {3: 2, 7: 4} = 2x3 and 4x7
        public singles: {[key: number] : true},  // represents all the rest; up to 1 of each face.  e.g. {1: true, 6: true} = 1 and 6
    ) {
    }
}

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

export const dieRollImages = new Map<Dice, Map<Faces, string>>();
dieRollImages.set(Dice.D10, diceImages);

export function parseRollValues(roll: Roll<Dice, Faces>): RollValues {
    return new RollValues([roll.face], {}, {})
}

export function parseFullRoll(fullRoll: number[]): RollValues {
    const counts = new Array(11).fill(0)  // [0, 1, ..., 9, 10].  the 0 is not used
    for (const k of fullRoll) {
        counts[k] += 1
    }
    const sets: {[key: number] : number} = {}
    const singles: {[key: number] : true} = {}
    for (const num of fullRoll.slice(1)) {
        if (counts[num] === 0) continue
        if (counts[num] === 1) singles[num] = true
        if (counts[num] >= 2) sets[num] = counts[num]
    }
    return new RollValues(fullRoll, sets, singles)
}

export function toRollResult(partial: Partial<RollValues>): RollValues {
    return Object.assign(new RollValues([], {}, {}), partial);
}

export class InterpretedResult {
    constructor(
        public setsReadable: string,  // e.g. "2×3   4×7" (width 2 height 3, etc)
    ) {
    }
}

export function interpretResult(result: RollValues): InterpretedResult {
    return new InterpretedResult(
        Object.keys(result.sets).length === 0 ? '---' :
        Object.entries(result.sets).map(pair => `${pair[1]}×${pair[0]}`).join('   '),
    );
}

export const rollValuesMonoid: IMonoid<RollValues> = {
    identity: new RollValues([], {}, {}),
    combine: (roll1: RollValues, roll2: RollValues) => parseFullRoll(roll1.originalRoll.concat(roll2.originalRoll)),
};

export const dicePoolMonoid: IMonoid<DicePool> = {
    identity: new DicePool(0),
    combine: (roll1: DicePool, roll2: DicePool) => new DicePool(roll1.d + roll2.d),
};
