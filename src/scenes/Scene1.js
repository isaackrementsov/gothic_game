import Phaser from 'phaser';

import missionBrief from '../assets/mission-brief.png';
import continueButton from '../assets/continue.png';

import background from '../assets/scene1.png';

import message1 from '../assets/scene1-message1.png';
import message2 from '../assets/scene1-message2.png';
import message3 from '../assets/scene1-message3.png';
import bottomBar from '../assets/scene1-bottombar.png';

import pop from '../assets/pop.mp3';

export default class Scene1 extends Phaser.Scene {

    constructor(){
        super('Scene1');
    }

    preload(){
        this.load.image('mission-brief', missionBrief);
        this.load.image('continue', continueButton);
        this.load.image('background-scene1', background);
        this.load.image('scene1-message1', message1);
        this.load.image('scene1-message2', message2);
        this.load.image('scene1-message3', message3);
        this.load.image('scene1-bottombar', bottomBar);

        this.load.audio('pop', pop);
    }

    create(){
        this.brief = this.add.image(0, 0, 'mission-brief').setOrigin(0, 0);
        this.button = this.add.sprite(0, 0, 'continue').setOrigin(-1, -9);

        this.brief.setScale(0.9, 0.9);

        this.button.setInteractive();
        this.button.on('pointerup', this.openScene, this);
    }

    openScene(){
        this.brief.destroy();
        this.button.destroy();

        const bg = this.add.image(0, 0, 'background-scene1').setOrigin(0, 0);
        const bottomBar = this.add.image(0, 0, 'scene1-bottombar').setOrigin(0, -10.1);

        this.messageIndex = -1;
        this.messages = [];
        this.nextMessage();

        const enter = this.input.keyboard.addKey('enter');

        enter.on('up', this.nextMessage, this);
    }

    nextMessage(){
        this.sound.play('pop');

        if(this.messageIndex >= 0 && this.messageIndex < 3  ) this.messages[this.messageIndex].destroy();

        this.messageIndex++;

        if(this.messageIndex < 3){
            this.messages[this.messageIndex] = this.add.image(0, 0, 'scene1-message' + (this.messageIndex + 1)).setOrigin(0, 0);
            this.messages[this.messageIndex].setScale(0.95, 0.95);
        }else{
            this.scene.start('Level1');
        }
    }

}
