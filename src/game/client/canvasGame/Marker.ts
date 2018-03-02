import { MarkerType } from '../../logic/consts';
import Board from './Board';
import Tile from './Tile';

export default class Marker {
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
            Math.max(this.board.tileSize / 2 - 5, 1),
            0, 2 * Math.PI
        );
        context.fill();
    }
}
