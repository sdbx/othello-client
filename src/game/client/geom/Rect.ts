import Point from "./Point";

export default class Rect {
    constructor(
        public x = 0,
        public y = 0,
        public width = 0,
        public height = 0
    ) {
    }

    contains(point: Point) {
        return (
            this.x <= point.x &&
            this.x + this.width >= point.x &&
            this.y <= point.y &&
            this.y + this.height >= point.y
        );
    }
}