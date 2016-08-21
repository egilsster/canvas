'use strict';

import { Canvas } from '../utils/canvas';
import { Shape } from './shape';

export class Text extends Shape {
    public type: string = 'text';

    constructor(x: number, y: number, color: string, private text: string, public fontSize: number) {
        super(x, y, color);
    }

    public set setText(text: string) {
        this.text = text;
    }

    draw(canvas: Canvas): void {
        canvas.ctx.font = this.fontSize * 5 + 'px Arial';
        canvas.ctx.fillStyle = this.color;
        canvas.ctx.fillText(this.text, this.position.x, this.position.y);
    }
}
