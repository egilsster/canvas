'use strict';

import * as $ from 'jquery';

export default function ResizeCanvas() {
    const container = $('.canvasContainer');
    const canvas = $('#myCanvas');
    const canvasWidth = container.width();
    const canvasHeight = container.height();

    canvas.attr('width', canvasWidth);
    canvas.attr('height', canvasHeight);
}
