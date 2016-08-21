'use strict';

import { forEach } from 'lodash';
import { Canvas } from '../utils/canvas';
import { Shape } from './shape';
import { Point } from './point';

export class Pencil extends Shape {
    public type: string = 'pencil';
    private points: Point[];

    constructor(x: number, y: number, public color: string, public lineWidth: number) {
        super(x, y, color);
        this.points = [new Point(x, y)]; // Add starting point
    }

    addPoint(x: number, y: number): void {
        this.points.push(new Point(x, y));
    }

    draw(canvas: Canvas): void {
        canvas.ctx.lineCap = 'round';
        canvas.ctx.beginPath();
        canvas.ctx.moveTo(this.position.x, this.position.y);

        forEach(this.points, (point) => {
            canvas.ctx.lineTo(point.x, point.y);
        });

        canvas.ctx.lineWidth = this.lineWidth;
        canvas.ctx.strokeStyle = this.color;
        canvas.ctx.stroke();
    }
}
