import Level from './Level';

import background from '../assets/level1-dark.png';
import message from '../assets/level1-message.png';

export default class Level1 extends Level {

    constructor(){
        super('Level1');
    }

    preload(){
        super.preload(message, background);
    }

    create(){
        super.create();

        const fragileP = 0.3;
        const showTrapP = 0.1;

        super.createPlatform(-0.001, -22.5, 24, fragileP, showTrapP);
        super.createPlatform(0, -17, 20, fragileP, showTrapP);
        super.createPlatform(-4, -11.5, 20, fragileP, showTrapP);
        super.createPlatform(0, -6, 20, fragileP, showTrapP, true);

        super.finishCreate();
    }

    die(wait){
        super.stopAudio();

        if(wait){
            setTimeout(() => {
                this.die();
            }, wait);
        }else{
            this.scene.start('GameOver');
        }
    }

}
