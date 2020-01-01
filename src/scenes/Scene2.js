import Phaser from 'phaser';

import jail from '../assets/jail.png';
import win from '../assets/win.png';

import successSound from '../assets/win.mp3';

export default class Scene2 extends Phaser.Scene {

    constructor(){
        super('Scene2');
    }

    init(data){
        this.win = data.win;
    }

    preload(){
        this.load.image('jail', jail);
        this.load.image('win', win);

        this.load.audio('success', successSound);
    }

    create(){
        const bg = this.add.image(0, 0, this.win ? 'win' : 'jail').setOrigin(0, 0);

        bg.setScale(0.234, 0.234);

        if(!this.win){
            setTimeout(() => {
                this.scene.start('GameOver');
            }, 2000);
        }else{
            setTimeout(() => {
                this.sound.play('success');
            }, 10);
        }
    }

}
