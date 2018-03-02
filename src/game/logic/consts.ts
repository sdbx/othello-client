export enum MarkerType {
    Black,
    White,
    None
}

export const board8x8 = [
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 1, 0, 2, 2, 2],
    [2, 2, 2, 0, 1, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2]
];

export const boardPositionPass = { x: -1, y: -1 };
export const notationPass = '--';