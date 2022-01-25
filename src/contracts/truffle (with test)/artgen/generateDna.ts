import { CollectionLength } from './config';
import { maxCollectionsPossible, writeDnaData } from './src/stats';
import { writeMetaData, createDna, isDnaUnique } from './src/core';
import { GlobalDnaList } from './src/types';

/**
 * DNA is a list of id's joined together according to
 * layer priority, this stores the dna in an Object
 */
const DnaListHashMap: GlobalDnaList = {};

/**
 * Main Function to generate the collection
 */
const startGeneration = async () => {
    const _max = maxCollectionsPossible();
    if(CollectionLength > _max) {
        console.log(`Max Collections possible with the given assets is ${_max} and you requested ${CollectionLength}`)
        return;
    }

    writeMetaData();
    let _currentCount = 0;

    while(_currentCount < CollectionLength) {
        // const _color = chooseClass();
        const _dna = createDna();

        if(isDnaUnique(_dna, DnaListHashMap)) {
            console.log(`Generated DNA: ${JSON.stringify(_dna)}`)
            DnaListHashMap[_dna.join('')] = _dna;
            _currentCount++;
        } else {
            console.log(`Duplicate DNA: ${_dna}`);
        }
    }
    
    
    writeDnaData(_max, DnaListHashMap);
}

startGeneration();
