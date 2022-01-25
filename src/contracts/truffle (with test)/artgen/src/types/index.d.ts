interface LayerElement {
    id: number,
    name: string,
    filename: string | string[],
    colorScheme: string,
    rarityRating: number,
}

interface Layers {
    name: string,
    required: boolean,
    path: string,
    elements: LayerElement[]
}

interface GlobalDnaList {
    [dnaKey: string] : number[]
}

interface StatsList {
    [layer: string] : { [asset: string] : string }[]
}

export { 
    LayerElement, 
    Layers, 
    StatsList,
    GlobalDnaList 
}
