import Othello, { BoardPosition } from "../logic/Othello";
import Point from "./geom/Point";
import Rect from "./geom/Rect";
import { MarkerType, board8x8 } from "../logic/consts";

class Marker {

    constructor(
        private board: Board,
        public type: MarkerType,
        public tile: Tile
    ) {
        this.tile.marker = this;
    }

    render(context: CanvasRenderingContext2D) {
        switch (this.type) {
            case MarkerType.Black:
                context.fillStyle = 'black';
            break;
            case MarkerType.White:
                context.fillStyle = 'white';
            break;
        }

        context.beginPath();
        context.arc(
            this.board.topX + this.tile.position.x * this.board.tileSize + this.board.tileSize / 2,
            this.board.topY + this.tile.position.y * this.board.tileSize + this.board.tileSize / 2,
            this.board.tileSize / 2 - 5,
            0, 2 * Math.PI
        );
        context.fill();
    }
}

class Tile {

    marker:Marker;
    rect:Rect;

    constructor(
        private board: Board,
        public readonly position: Point
    ) {
        this.rect = new Rect();
    }

    render(context: CanvasRenderingContext2D) {
        this.rect.x = this.board.topX + this.position.x * this.board.tileSize;
        this.rect.y = this.board.topY + this.position.y * this.board.tileSize;
        this.rect.width = this.board.tileSize;
        this.rect.height = this.board.tileSize;

        context.strokeStyle = 'black';
        context.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
}

class Board {
    
    readonly margin: number = 10;

    topX: number = 10;
    topY: number = 10;
    tileSize: number = 50;

    readonly tiles: Tile[][] = [];
    markers: Marker[] = [];

    private rect: Rect = new Rect();

    constructor(
        public column: number,
        public row: number
    ) {
        for (let y = 0; y < row; ++y) {
            this.tiles[y] = [];
            for (let x = 0; x < column; ++x) {
                this.tiles[y][x] = new Tile(this, { x: x, y: y });
            }
        }
    }

    tileAt(position: BoardPosition): Tile {
        return this.tiles[position.y][position.x];
    }

    markerAt(position: BoardPosition): Marker {
        return this.tileAt(position).marker;
    }

    everyTile(callback: (tile: Tile) => void) {
        for (let row of this.tiles) {
            for (let tile of row) {
                callback(tile);
            }
        }
    }

    put(position: BoardPosition, type: MarkerType) {
        if (this.markerAt(position))
            return;

        this.markers.push(new Marker(this, type, this.tileAt(position)));
    }

    flip(position: BoardPosition) {
        const m = this.markerAt(position);

        if (!m)
            return;
        
        m.type = Othello.oppositeType(m.type);
    }

    resize(width, height) {
        this.rect.width = width;
        this.rect.height = height;

        let size = Math.min(width, height) - this.margin * 2;

        this.tileSize = size / Math.max(this.column, this.row);

        this.topX = width / 2 - size / 2;
        this.topY = height / 2 - size / 2;
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = 'rgb(79, 146, 91)';
        context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        this.everyTile(tile => tile.render(context));
        for (let marker of this.markers)
            marker.render(context);
    }
}

export default class CanvasOthelloGame {

    private othello: Othello;
    private board: Board;
    private currentPlayerType: MarkerType = MarkerType.Black;

    private raqId: number;
    private context: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        this.othello = new Othello(board8x8);
        this.context = canvas.getContext('2d');

        this.handleTileClick = this.handleTileClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    scheduleNextUpdate() {
        this.raqId = requestAnimationFrame(() => this.run());
    }

    init() {
        this.board = new Board(this.othello.width, this.othello.height);
        
        for (let y = 0; y < this.board.row; ++y) {
            for (let x = 0; x < this.board.column; ++x) {
                let marker = this.othello.board[y][x];
                switch (marker) {
                    case MarkerType.Black:
                    case MarkerType.White:
                        this.board.put({x: x, y: y}, marker);
                    break;
                }
            }
        }

        // event listeners
        window.addEventListener('click', this.handleTileClick);
        window.addEventListener('resize', this.handleResize, false);
        
        this.handleResize();
        this.scheduleNextUpdate();
    }

    handleTileClick(e: MouseEvent) {
        let boundingRect = this.canvas.getBoundingClientRect();
        let mousePoint = { x: e.clientX - boundingRect.left, y: e.clientY - boundingRect.top };
        
        this.board.everyTile(tile => {
            if (tile.rect.contains(mousePoint) && tile.marker == undefined) {
                let { valid, delta } = this.othello.put(tile.position, this.currentPlayerType);

                if (!valid)
                    return;

                this.board.put(tile.position, this.currentPlayerType);
                for (let position of delta)
                    this.board.flip(position);

                this.currentPlayerType = Othello.oppositeType(this.currentPlayerType);
            }
        });
    }

    handleResize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
        this.board.resize(this.canvas.width, this.canvas.height);
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