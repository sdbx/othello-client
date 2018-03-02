import { MarkerType } from "./consts";
import * as Consts from './consts';

export interface BoardPosition {
    x: number;
    y: number;
}

export default class Othello {

    private historyData: BoardPosition[] = [];

    constructor(public readonly board: MarkerType[][]) {
    }

    static oppositeType(type: MarkerType): MarkerType {
        switch (type) {
            case MarkerType.Black:
                return MarkerType.White;
            case MarkerType.White:
                return MarkerType.Black;
        }
    }

    static parseOne(notation: string): { valid: boolean, position?: BoardPosition } {
        if (notation == Consts.notationPass) {
            return { valid: true, position: Consts.boardPositionPass };
        }

        let result = notation.match(/^([a-z]{1})([0-9]{1,2})$/);
        if (result) {
            let x: number = result[1].charCodeAt(0) - 'a'.charCodeAt(0);
            let y: number = parseInt(result[2]) - 1;

            return { valid: true, position: { x: x, y: y } };
        }
        else {
            return { valid: false };
        }
    }

    static convertToNotation(position: BoardPosition): string {
        if (Othello.isPass(position))
            return '--';
        else
            return String.fromCharCode(position.x + 'a'.charCodeAt(0)) + (position.y + 1);
    }

    static isPass(position: BoardPosition): boolean {
        console.log(position);
        return position.x == Consts.boardPositionPass.x && position.y == Consts.boardPositionPass.y;
    }

    at(position: BoardPosition): MarkerType {
        return this.board[position.y][position.x];
    }

    put(at: BoardPosition, type: MarkerType): { valid: boolean, delta?: BoardPosition[] } {
        if (Othello.isPass(at)) {
            this.historyData.push(Consts.boardPositionPass);
            return { valid:true, delta: [] }
        }

        const result = this.isValidMove(at, type);

        if (result.valid) {
            this.set(at, type);
            
            for (let position of result.delta) {
                this.set(position, type);
            }

            this.historyData.push(at);
        }

        return result;
    }

    availableMoves(type: MarkerType): BoardPosition[] {
        const result = [];

        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                const position = { x: x, y: y };

                if (this.isValidMove(position, type).valid)
                    result.push(position);
            }
        }

        return result;
    }

    get history(): string {
        return this.historyData.map(position => Othello.convertToNotation(position)).join(' ');
    }

    get width(): number {
        return this.board[0].length;
    }

    get height(): number {
        return this.board.length;
    }

    private set(at: BoardPosition, type: MarkerType): void {
        this.board[at.y][at.x] = type;
    }

    private isValidMove(at: BoardPosition, type: MarkerType): { valid: boolean, delta?: BoardPosition[] } {
        if (this.at(at) != MarkerType.None)
            return { valid: false };

        let markersInMiddle = [];

        for (let dy = -1; dy <= 1; ++dy) {
            for (let dx = -1; dx <= 1; ++dx) {
                if (dx == 0 && dy == 0) continue;
                
                markersInMiddle = markersInMiddle.concat(this.checkDirection(at, type, dx, dy));
            }
        }

        if (markersInMiddle.length > 0)
            return { valid: true, delta: markersInMiddle };
        
        return { valid: false };
    }

    private checkDirection(at: BoardPosition, type: MarkerType, dx: number, dy: number): BoardPosition[] {
        let cursor = { x: at.x + dx, y: at.y + dy };
        let markersInMiddle = [];

        while (this.isInBoard(cursor)) {
            let cursorType = this.at(cursor);

            if (cursorType == MarkerType.None)
                break;
            if (cursorType == type)
                return markersInMiddle;

            markersInMiddle.push({ ...cursor });
            cursor.x += dx;
            cursor.y += dy;
        }

        return [];
    }

    private isInBoard(at: BoardPosition) {
        return (
            0 <= at.x && at.x < this.width &&
            0 <= at.y && at.y < this.height
        );
    }
}