import Level from './Level';

import background from '../assets/level4.png';
import message from '../assets/level4-message.png';

import table from '../assets/artifact-table.png';

export default class Level4 extends Level {

    constructor(){
        super('Level4', false, true);
    }

    preload(){
        super.preload(message, background);

        this.load.image('table', table);
    }

    create(){
        super.create();

        const fragileP = 0.3;
        const showTrapP = 0.4;

        super.createPlatform(-0.001, -22.5, 24, fragileP, showTrapP);
        super.createPlatform(0, -17, 20, fragileP, showTrapP);
        super.createPlatform(-4, -11.5, 20, fragileP, showTrapP);
        super.createPlatform(0, -6, 20, fragileP, showTrapP, true);

        super.finishCreate();
    }

    replaceDoor(){
        const table = this.add.image(0, 0, 'table').setOrigin(-0.1, -0.45);

        table.setScale(0.35, 0.35);
    }

}
