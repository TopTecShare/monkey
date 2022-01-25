import glob from 'glob';
import * as fs from 'fs';

const LayerOrder = [
    'BACKGROUND',
    'BASE',
    'EYE',
    'EYEWEAR',
    'MOUTH',
    'FUR',
    'CLOTHING',
    'HEADGEAR',
    'EARRINGS',
    'HOLDING'
]

const notRequired = (name: string) => {
    return [].includes(name)
}

(async () => {
    try {

        const Layers = [];

        const layerNames = glob.sync('./layers/*');
        layerNames.forEach(layerName => {
            const elements = [];
            
            const layerElements = glob.sync(layerName + '/**/*.png');            
            layerElements.forEach((_, id) => {
                const name = _.replace(layerName, '').replace('.png', '').split('/').pop();
                elements.push({ 
                    id,
                    name,
                    filename: _ ,
                    rarityRating: 0,
                });
            })

            const name = layerName.split('/').pop();
            
            if(LayerOrder.includes(name)) {
                console.log(`Layer Included:`, name);
                Layers.push({
                    name,
                    required: !notRequired(name),
                    path: ``,
                    elements
                })
            }
        });

        let writeData: any[] = Layers.map(_ => -1);
        Layers.forEach(layer => {
            writeData[LayerOrder.indexOf(layer.name)] = layer;
        })


        writeData = writeData.map((layer, id)=> ({id, ...layer}))

        fs.writeFileSync(
            "./generated/_assetsLayers.json", 
            JSON.stringify(writeData, null, 4)
        );

    } catch(err) {
        console.log(err)
    }
})();
