import Level from './Level';

import background from '../assets/level2.png';
import message from '../assets/level2-message.png';

import healthBarFrame from '../assets/health-bar-frame.png';
import healthBarFill from '../assets/health-bar-fill.png';

export default class Level2 extends Level {

    constructor(){
        super('Level2');

        this.health = 100;
    }

    preload(){
        super.preload(message, background);

        this.load.image('health-bar-frame', healthBarFrame);
        this.load.image('health-bar-fill', healthBarFill);
    }

    create(){
        super.create();

        const fragileP = 0;
        const showTrapP = 0.7;

        super.createPlatform(-0.001, -22.5, 24, fragileP, showTrapP);
        super.createPlatform(0, -17, 20, fragileP, showTrapP);
        super.createPlatform(-4, -11.5, 20, fragileP, showTrapP);
        super.createPlatform(0, -6, 20, fragileP, showTrapP, true);

        const frame = this.add.image(431, 410, 'health-bar-frame').setScrollFactor(0);
        this.fill = this.add.image(431, 411, 'health-bar-fill').setScrollFactor(0);

        frame.setScale(0.2, 0.2);
        this.fill.setScale(0.145, 0.255);

        super.finishCreate();
    }

    die(){
        this.health -= 0.05*this.health;
        this.fill.setScale(0.145, 0.255*this.health/100);
        this.fill.y += 1.22;
    }

    next(){
        super.stopAudio();
        this.scene.start('Level3', {health: this.health});
    }

}
