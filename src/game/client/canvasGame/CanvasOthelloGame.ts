import Othello, { BoardPosition } from '../../logic/Othello';
import { MarkerType, board8x8 } from '../../logic/consts';
import Point from '../geom/Point';
import Rect from '../geom/Rect';
import Board from './Board';

interface InitialData {
    black: string;
    white: string;
    board: MarkerType[][];
    history: string[];
}

export default class CanvasOthelloGame {

    tryPut: (position: BoardPosition) => void;

    private nextAvailableMoves: BoardPosition[];
    private othello: Othello;
    private board: Board;
    private currentPlayerType: MarkerType = MarkerType.Black;
    private myType: MarkerType;

    private raqId: number;
    private context: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        this.context = canvas.getContext('2d');
    }

    scheduleNextUpdate() {
        this.raqId = requestAnimationFrame(() => this.run());
    }

    init(playerName: string, data: InitialData) {
        this.othello = new Othello(data.board);
        this.board = new Board(this, this.othello.width, this.othello.height);

        this.currentPlayerType = (data.history.length % 2 === 0) ? MarkerType.Black : MarkerType.White;
        this.myType = (data.black === playerName) ? MarkerType.Black : MarkerType.White;

        console.log('현재 턴 플레이어 색:', this.currentPlayerType);
        console.log('내 색:', this.myType);

        this.handleTileMouseMove = this.handleTileMouseMove.bind(this);
        this.handleTileClick = this.handleTileClick.bind(this);
        this.handleResize = this.handleResize.bind(this);

        for (let y = 0; y < this.board.row; ++y) {
            for (let x = 0; x < this.board.column; ++x) {
                const marker = this.othello.board[y][x];
                switch (marker) {
                    case MarkerType.Black:
                    case MarkerType.White:
                        this.board.put({ x, y }, marker);
                        break;
                }
            }
        }

        // event listeners
        window.addEventListener('click', this.handleTileClick);
        window.addEventListener('mousemove', this.handleTileMouseMove);
        window.addEventListener('resize', this.handleResize, false);

        this.handleResize();
        this.updateNextAvailableMoves();
        this.scheduleNextUpdate();
    }

    put(position: BoardPosition) {
        if ( !Othello.isPass(position)) {
            const { valid, delta } = this.othello.put(position, this.currentPlayerType);

            console.log('CanvasOthelloGame.put:', position);

            if (!valid) {
                return;
            }

            console.log('유효함:', position);

            this.board.put(position, this.currentPlayerType);
            for (const p of delta) {
                this.board.flip(p);
            }
        }

        this.currentPlayerType = Othello.oppositeType(this.currentPlayerType);
        this.updateNextAvailableMoves();
    }

    isMyTurn(): boolean {
        return this.currentPlayerType === this.myType;
    }

    handleTileMouseMove(e: MouseEvent) {
        const boundingRect = this.canvas.getBoundingClientRect();
        const mousePoint = { x: e.clientX - boundingRect.left, y: e.clientY - boundingRect.top };

        this.board.everyTile((tile) => {
            tile.hovered = tile.rect.contains(mousePoint);
        });
    }

    handleTileClick(e: MouseEvent) {
        if (!this.isMyTurn()) {
            return;
        }

        const boundingRect = this.canvas.getBoundingClientRect();
        const mousePoint = { x: e.clientX - boundingRect.left, y: e.clientY - boundingRect.top };

        this.board.everyTile((tile) => {
            if (tile.rect.contains(mousePoint) && tile.marker === undefined) {
                this.tryPut(tile.position);
            }
        });
    }

    handleResize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
        this.board.resize(this.canvas.width, this.canvas.height);
    }

    updateNextAvailableMoves() {
        this.board.everyTile((tile) => tile.available = false);

        this.nextAvailableMoves = this.othello.availableMoves(this.currentPlayerType);

        for (const move of this.nextAvailableMoves) {
            this.board.tileAt(move).available = true;
        }
    }

    destroy() {
        // event listeners
        window.removeEventListener('click', this.handleTileClick);
        window.removeEventListener('resize', this.handleResize);
    }

    update() {
        this.scheduleNextUpdate();
    }

    render() {
        this.board.render(this.context);
    }

    run() {
        this.update();
        this.render();
    }
}
