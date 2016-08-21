'use strict';

import { map } from 'lodash';
import { Whiteboard } from '../models/whiteboard';
import { Canvas } from '../utils/canvas';

export class Server {
    constructor(public canvas: Canvas, public savedItems: JQuery) { }

    public saveCanvas(name: string): void {
        const stringifiedArray = JSON.stringify(this.canvas.shapes);
        const param = {
            'user': 'egills13',
            'name': name,
            'content': stringifiedArray,
            'template': false
        };

        $.ajax({
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            url: 'http://whiteboard.apphb.com/Home/Save',
            data: param,
            dataType: 'jsonp',
            crossDomain: true,
            success: (data) => {
                this.getSavedList();
                // The save was successful...
            },
            error: (xhr, err) => {
                console.log('Error!');
                // Something went wrong...
            }
        });
    }

    public getSaved(id: number): void {
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            url: 'http://whiteboard.apphb.com/Home/GetWhiteboard',
            data: { ID: id },
            dataType: 'jsonp',
            crossDomain: true,
            success: (data) => {
                const objects = JSON.parse(data['WhiteboardContents']);
                // Go through objects and push to objcontainer
                this.canvas.clearCanvas();
                this.canvas.drawLoaded(objects);
                // The save was successful...
            },
            error: (xhr, err) => {
                console.log('Error!');
                // Something went wrong...
            }
        });
    }

    public getSavedList(): void {
        const param = {
            'user': 'egills13',
            'template': false
        };

        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            url: 'http://whiteboard.apphb.com/Home/GetList',
            data: param,
            dataType: 'jsonp',
            crossDomain: true,
            success: (data) => {
                const savedList = this.generateSavedList(data);
                this.savedItems.html(savedList);
                // The save was successful...
            },
            error: (xhr, err) => {
                console.log('Error!');
                // Something went wrong...
            }
        });
    }

    private generateSavedList(data: Whiteboard[]): string {
        // Make table of buttons to load each drawing
        return map(data, (item) => {
            return '<li class="loadCanvas" value="' +
                item.ID + '"><a href="#">' +
                item.WhiteboardTitle +
                '</a></li>';
        }).join('');
    }
}
