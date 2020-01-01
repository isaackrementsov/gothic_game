import Phaser from 'phaser';

import StartScreen from './scenes/StartScreen';
import Scene1 from './scenes/Scene1';

import Level1 from './scenes/Level1';
import Level2 from './scenes/Level2';
import Level3 from './scenes/Level3';
import Level4 from './scenes/Level4';
import Level5 from './scenes/Level5';

import Scene2 from './scenes/Scene2';

import GameOver from './scenes/GameOver';

const config = {
    type: Phaser.AUTO,
    width: 700,
    height: 700,
    scene: [StartScreen, Scene1, Level1, Level2, Level3, Level4, Level5, Scene2, GameOver],
    physics: {
        default: 'arcade',
        arcade: {debug: false}
    }
}

let game = new Phaser.Game(config);

export default game;
