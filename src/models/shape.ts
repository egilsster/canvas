import Point from './point';

export default abstract class Shape {
    public type: string;
    private _position: Point;

    constructor(x: number, y: number, public color: any) {
        this._position = new Point(x, y);
    }

    public get position(): Point {
        return this._position;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
}
