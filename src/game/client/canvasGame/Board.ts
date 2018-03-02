import Othello, { BoardPosition } from '../../logic/Othello';
import { MarkerType } from '../../logic/consts';
import Tile from './Tile';
import Marker from './Marker';
import Rect from '../geom/Rect';
import CanvasOthelloGame from './CanvasOthelloGame';

export default class Board {
    readonly margin: number = 10;

    topX: number = 10;
    topY: number = 10;
    tileSize: number = 50;

    readonly tiles: Tile[][] = [];
    markers: Marker[] = [];

    private rect: Rect = new Rect();

    constructor(
        public game: CanvasOthelloGame,
        public column: number,
        public row: number
    ) {
        for (let y = 0; y < row; ++y) {
            this.tiles[y] = [];
            for (let x = 0; x < column; ++x) {
                this.tiles[y][x] = new Tile(this, { x, y });
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
        for (const row of this.tiles) {
            for (const tile of row) {
                callback(tile);
            }
        }
    }

    put(position: BoardPosition, type: MarkerType) {
        if (this.markerAt(position)) {
            return;
        }

        this.markers.push(new Marker(this, type, this.tileAt(position)));
    }

    flip(position: BoardPosition) {
        const m = this.markerAt(position);

        if (!m) {
            return;
        }
        m.type = Othello.oppositeType(m.type);
    }

    resize(width, height) {
        const size = Math.min(width, height) - this.margin * 2;

        this.rect.width = width;
        this.rect.height = height;

        this.tileSize = size / Math.max(this.column, this.row);

        this.topX = width / 2 - size / 2;
        this.topY = height / 2 - size / 2;
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = 'rgb(79, 146, 91)';
        context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        this.everyTile((tile) => tile.render(context));

        for (const marker of this.markers) {
            marker.render(context);
        }
    }
}
