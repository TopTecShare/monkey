import { Layers } from "./src/types";

const AssetLayers: Layers[] = require('./generated/_assetsLayers.json');

const CollectionLength =10;
const ImgHeightPx = 2048;
const ImgWidthPx = 2048;

export {
    CollectionLength,
    ImgHeightPx,
    ImgWidthPx,
    AssetLayers
}
