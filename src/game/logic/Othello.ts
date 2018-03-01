import { MarkerType } from "./consts";

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

    at(position: BoardPosition): MarkerType {
        return this.board[position.y][position.x];
    }

    put(at: BoardPosition, type: MarkerType): { valid: boolean, delta?: BoardPosition[] } {
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

    get history(): string {
        return this.historyData.map(position => this.convertToNotation(position)).join(' ');
    }

    get width(): number {
        return this.board[0].length;
    }

    get height(): number {
        return this.board.length;
    }

    private convertToNotation(position: BoardPosition): string {
        if (position)
            return String.fromCharCode(position.x + 'a'.charCodeAt(0)) + (position.y + 1);
        
        return '--';
    }

    private set(at: BoardPosition, type: MarkerType): void {
        this.board[at.y][at.x] = type;
    }

    private isValidMove(at: BoardPosition, type: MarkerType): { valid: boolean, delta?: BoardPosition[] } {
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