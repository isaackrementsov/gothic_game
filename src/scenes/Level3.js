import Level from './Level';

import message from '../assets/level3-message.png';
import background from '../assets/level3.png';

import ghostSpriteSheet from '../assets/ghost-spritesheet.png';

import ghostSound from '../assets/ghost.mp3';

export default class Level3 extends Level {

    constructor(){
        super('Level3', true);
    }

    init(data){
        this.speedFactor = data.health/100 || 0.37;

        this.vx = 200*this.speedFactor/1.5;
    }

    preload(){
        super.preload(message, background);

        this.load.spritesheet('ghost-anim', ghostSpriteSheet, {
            frameHeight: 487,
            frameWidth: 417
        });

        this.load.audio('ghost-sound', ghostSound);
    }

    create(){
        super.create();

        const fragileP = 0.3;
        const showTrapP = 0.1;

        super.createPlatform(-0.001, -22.5, 24, fragileP, showTrapP);
        super.createPlatform(0, -17, 20, fragileP, showTrapP);
        super.createPlatform(-4, -11.5, 20, fragileP, showTrapP);
        super.createPlatform(0, -6, 20, fragileP, showTrapP, true);

        super.finishCreate(true);

        this.ghost = this.physics.add.sprite(0, 0, 'ghost-anim', 0).setOrigin(0, 1);

        this.ghost.setScale(0.15, 0.15);

        this.anims.create({
            key: 'flame',
            frames: this.anims.generateFrameNames('ghost-anim', {start: 0, end: 5}),
            repeat: -1,
            frameRate: 6
        });

        this.ghost.play('flame');

        this.ghostSound = this.sound.add('ghost-sound');
        this.ghostSound.play();

        this.physics.add.overlap(this.character, this.ghost, this.ghostKill, null, this);
    }

    ghostKill(_character, _ghost){
        this.cameras.main.alpha -= 0.013;

        if(this.cameras.main.alpha < 0.1){
            this.die();
        }
    }

    update(){
        super.update();

        if(this.cameras.main.alpha < 1) this.cameras.main.alpha += 0.01;

        let dx = this.character.x - this.ghost.x;
        let dy = this.character.y - this.ghost.y;

        this.ghost.setVelocityX(this.vx*dx/100);
        this.ghost.setVelocityY(this.vy*dy/100);

        if(dx < 0){
            this.ghost.flipX = false;
        }else{
            this.ghost.flipX = true;
        }

        this.ghostSound.volume = Math.min(1, 10/Math.abs(dx + dy));
    }

    die(wait){
        super.stopAudio();
        this.ghostSound.stop();

        if(wait){
            setTimeout(() => {
                this.die();
            }, wait);
        }else{
            this.scene.start('Level3', {health: 100*this.speedFactor});
        }
    }

}
