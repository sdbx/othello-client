import Rect from '../geom/Rect';
import Point from '../geom/Point';
import Marker from './Marker';
import Board from './Board';

export default class Tile {

    marker: Marker;
    rect: Rect;
    available: boolean = false;
    hovered: boolean = false;

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

        if (this.board.game.isMyTurn() && this.available && this.hovered) {
            context.fillStyle = 'rgba(1, 1, 1, .3)';
            context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        }

        context.strokeStyle = 'black';
        context.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
}
