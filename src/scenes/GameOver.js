import Phaser from 'phaser';

import gameOver from '../assets/gameOver.png';

import fail from '../assets/fail.mp3';

export default class GameOver extends Phaser.Scene {

    constructor(){
        super('GameOver');
    }

    preload(){
        this.load.image('gameover-background', gameOver);

        this.load.audio('fail', fail);
    }

    create(){
        const bg = this.add.image(0, 0, 'gameover-background').setOrigin(0, 0);

        this.sound.play('fail');

        setTimeout(() => {
            this.scene.start('Level1');
        }, 2000);
    }

}
