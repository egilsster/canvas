'use strict';

import { forEach } from 'lodash';
import Shape from './shape';
import Point from './point';

class Pencil extends Shape {
    public type: string = 'pencil';
    private points: Point[];

    constructor(x: number, y: number, public color: string, public lineWidth: number) {
        super(x, y, color);
        this.points = [new Point(x, y)]; // Add starting point
    }

    addPoint(x: number, y: number): void {
        this.points.push(new Point(x, y));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);

        forEach(this.points, (point) => {
            ctx.lineTo(point.x, point.y);
        });

        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
}

export default Pencil;
