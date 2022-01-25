import * as fs from 'fs';
import { Canvas, createCanvas, loadImage, NodeCanvasRenderingContext2D } from "canvas";
import { ImgWidthPx, ImgHeightPx } from "../config";
import { writeMetaData } from './core';


class Image {
    private _canvas: Canvas;
    private _ctx: NodeCanvasRenderingContext2D; 
    private _allLayerList: Array<any>;

    constructor(_dnaLayerList) {
        this._canvas = createCanvas(ImgWidthPx, ImgHeightPx);
        this._allLayerList = _dnaLayerList;

        this._ctx = this._canvas.getContext("2d");
        // this._ctx.imageSmoothingEnabled = false;
        // this._ctx.patternQuality = 'nearest';
        // this._ctx.quality = 'nearest';
        // this._ctx.textDrawingMode = 'glyph';
    }

    async generate(_editionNo: number) {
        this.emptyImage();

        let loadedElements = await this.loadAllLayerImg();
        loadedElements.forEach((element) => this.drawElement(element));

        this.saveImage(_editionNo);
        this.generateMetadata(_editionNo);
    }

    private drawElement = (_element) => {
      this._ctx.drawImage(
        _element.loadedImage,
        _element.layer.position.x,
        _element.layer.position.y,
        _element.layer.size.width,
        _element.layer.size.height
      );
    };

    private loadAllLayerImg = async () => {
        let loadedElements = [];

        // load all images to be used by canvas
        this._allLayerList.forEach(async (layer) => {
            loadedElements.push(this.loadLayerImg(layer));
        });

        return Promise.all(loadedElements);
    }
    
    // loads an image from the layer path
    // returns the image in a format usable by canvas
    private loadLayerImg = async (_layer) => {
        return new Promise(async (resolve) => {
            const image = await loadImage(`${_layer.selectedElement.path}`);
            resolve({ layer: _layer, loadedImage: image });
        });
    };
    
    private saveImage = (_editionCount) => {
        fs.writeFileSync(
            `./generated/assets/${_editionCount}.png`,
            this._canvas.toBuffer("image/png")
        );

        console.log(`Saved ${_editionCount}.png`)
    };

    private generateMetadata = (
        _edition: number,
    ) => {
      let dateTime = Date.now();
      let _attributesList = this._allLayerList.map(_ => ({trait_type: _.name, value: _.filename}));

      let tempMetadata = {
        name: `The Potion Shop #${_edition}`,
        description: `A collection of 10,000 unique, magical potions on the ethereum blockchain.`,
        edition: _edition,
        date: dateTime,
        attributes: _attributesList,
      };
      
      writeMetaData(JSON.stringify(tempMetadata, null, 4), _edition);
    };
    
    private emptyImage = () => {
        this._ctx.clearRect(0, 0, ImgWidthPx, ImgHeightPx);
    }
}


export { Image }
