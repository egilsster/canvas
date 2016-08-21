'use strict';

import { Canvas } from '../utils/canvas';
import { Shape } from './shape';
import { Point } from './point';

export class Line extends Shape {
    public type: string = 'line';
    private endPoint: Point;

    constructor(x0: number, y0: number, color: string, public lineWidth: number, x1: number, y1: number) {
        super(x0, y0, color);
        this.endPoint = new Point(x1, y1);
    }

    setEndPoint(x: number, y: number): void {
        this.endPoint.x = x;
        this.endPoint.y = y;
    }

    draw(canvas: Canvas): void {
        canvas.ctx.lineCap = 'round';
        canvas.ctx.lineWidth = this.lineWidth;
        canvas.ctx.beginPath();
        canvas.ctx.moveTo(this.position.x, this.position.y);
        canvas.ctx.lineTo(this.endPoint.x, this.endPoint.y);

        canvas.ctx.strokeStyle = this.color;
        canvas.ctx.stroke();
    }
}
