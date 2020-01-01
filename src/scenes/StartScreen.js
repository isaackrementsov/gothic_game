import Phaser from 'phaser';
import background from '../assets/background-sharp.png';
import title from '../assets/title.png';
import play from '../assets/play.png'

export default class StartScreen extends Phaser.Scene {

    constructor(){
        super('StartScreen');
    }

    preload(){
        this.load.image('background', background);
        this.load.image('title', title);
        this.load.image('play', play);
    }

    create(){
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        const title = this.add.image(0, 0, 'title').setOrigin(0, 0);
        const play = this.add.sprite(0, 0, 'play').setOrigin(0, 0);

        play.alpha = 0;
        title.alpha = 0;

        bg.setScale(1.17, 1.17);
        play.setScale(0.4, 0.4)
        title.setScale(0.5, 0.5);

        title.x = 120;
        title.y = 350;
        play.x = 280;
        play.y = 400;

        this.tweens.add({
            targets: [title, play],
            alpha: 1,
            duration: 3000,
        });

        this.tweens.add({
            targets: play,
            scale: 0.6,
            x: 260,
            y: 490,
            duration: 1000
        });

        play.setInteractive();
        play.on('pointerup', this.startGame, this);
    }

    startGame(){
        this.scene.start('Scene1');
    }

}
