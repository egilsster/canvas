import * as $ from 'jquery';

export default function ResizeCanvas() {
    const container = $('.canvasContainer');
    const canvas = $('#myCanvas');
    const canvasWidth = container.width() as number;
    const canvasHeight = container.height() as number;

    canvas.attr('width', canvasWidth);
    canvas.attr('height', canvasHeight);
}
