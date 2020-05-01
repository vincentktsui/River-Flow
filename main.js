import * as THREE from "three";
import { Sky } from 'three/examples/jsm/objects/Sky.js';
// import { Water } from 'three/examples/jsm/objects/Water2.js';
import { Water } from './js/Water2.js';
import { Loader } from "./js/three";
import SimplexNoise from "simplex-noise";
import Setup from './setup';
import Game from './game';

export default class Main {
    constructor(container) {
        this.game = new Game(container);
        const button = document.getElementById('start-game');
        const titleScreen = document.getElementById('title-screen');
        button.addEventListener("click", () => {
            titleScreen.classList.add("hidden");
            this.game.startAnimating();
        })
    }
}
