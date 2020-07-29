import * as THREE from "three";
import { Sky } from 'three/examples/jsm/objects/Sky.js';
// import { Water } from 'three/examples/jsm/objects/Water2.js';
import { Water } from './js/Water2.js';
import { Loader } from "./js/three";
import SimplexNoise from "simplex-noise";
import Setup from './setup';

export default class Game {
    constructor(container) {
        this.pushBack = 0;
        this.zOffset = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        this.yAngle = 0;
        this.moving = undefined;
        this.lockout = false;
        this.left;
        this.right;
        this.center;
        this.obstacles = [];
        this.obstaclesOffset = [];
        this.curvatureFactor = Math.PI;
        this.animationLoop;
        this.obstacleInterval;
        this.offset;
        this.fps;
        this.startTime;
        this.aliveTime;
        this.now;
        this.then;
        this.elapsed;
        this.fpsInterval;
        this.score;

        this.graphics = new Setup();
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.setupVariables = this.setupVariables.bind(this);
        this.createObstacle = this.createObstacle.bind(this);
        this.restart = this.restart.bind(this);
        this.quit = this.quit.bind(this);
        this.userInput = this.userInput.bind(this);
        container.appendChild(this.graphics.renderer.domElement);
        window.addEventListener("resize", this.onWindowResize);
        this.fps = 15;
        this.fpsInterval = 1000 / this.fps;
        // this.offset = Date.now();
        // this.render();
        // this.startAnimating(this.fps);
    }

    setupVariables() {
        this.pushBack = 0;
        this.zOffset = 0;
        this.xOffset = 0;
        this.obstacles = [];
        this.obstaclesOffset = [];
        this.moving = "none"
        this.lockout = false;
        this.yAngle = 0;
        this.yOffset = 0;
    }

    formula(x, offset = 0) {
        let y = x * this.curvatureFactor;
        // let y = x;
        // return (Math.sin(0.5 * y) + Math.sin(y) + 0.2 * Math.sin(3 * y)) * 50 + offset / 2;
        // return (Math.sin(0.5 * y) + Math.sin(y) + 0.2 * Math.sin(3 * y)) * 5 + offset / 2;
        return (Math.sin(0.5 * y) + Math.sin(y)) * 20 + offset / 2;
    }

    derivative(x) {
        let y = x * this.curvatureFactor;
        // let y = x;
        return (Math.cos(0.5 * y) / 2 + 20 * Math.cos(y));
    }



    onWindowResize() {
        let minHeight = (window.innerHeight < 600) ? 600 : window.innerHeight;
        let minWidth = (window.innerWidth < 750) ? 750 : window.innerWidth;
        this.graphics.camera.aspect = window.innerWidth / window.innerHeight;
        this.graphics.camera.updateProjectionMatrix();
        this.graphics.renderer.setSize(minWidth, minHeight);
        this.render();
    }

    render() {
        this.center = -this.formula(this.offset + 100 * this.fpsInterval * 0.0002) * 5;
        this.left = this.center - 50;
        this.right = this.center + 50;
        this.adjustVertices(this.offset);
        this.adjustObstacles(this.offset, this.center);
        this.adjustSphere(this.offset, this.center);
        this.adjustCamera(this.offset, this.center);

        // zOffset -= 1;

        // sphere.position.set(xOffset, yOffset, zOffset);

        // water.material.uniforms[ 'time' ].value += 1.0/60.0;
        // camera.position.set(Math.sin(angle) * 100, 30, Math.cos(angle) * 100 + zOffset)
        // camera.lookAt(new THREE.Vector3(0, 0, zOffset));

        this.graphics.renderer.render(this.graphics.scene, this.graphics.camera);

    }
    createWall(offset) {

    }

    createRock(offset) {

    }

    adjustSun() {
        // Implement this tomorrow, using the elapsed time
        
    }
    

    createObstacle(offset) {

        const cylinder_geom = new THREE.CylinderGeometry(10, 10, 100, 20);
        const cylinder_mat = new THREE.MeshStandardMaterial({
            roughness: 0.8,
            color: new THREE.Color(0x8B4513),
        });
        const cylinder = new THREE.Mesh(cylinder_geom, cylinder_mat);
        cylinder.rotateZ(Math.PI / 2);
        let cylCenter = offset + 200 * this.fpsInterval * 0.0002;
        this.obstacles.push(cylinder);
        this.obstaclesOffset.push(cylCenter);
        this.graphics.scene.add(cylinder);
    }



    adjustSphere() {
        // 5 = 1000px / 200 segs
        if (this.moving === "jump" || this.moving === "dive") {
            this.yAngle += Math.PI / this.fps;
            if (this.yAngle <= Math.PI) {
                if (this.moving === "jump") {
                    this.yOffset = Math.sin(this.yAngle) * 40;
                }
                else {
                    this.yOffset = -Math.sin(this.yAngle) * 40;
                }
            }
            else {
                this.moving = "none"
                this.lockout = false;
                this.yAngle = 0;
                this.yOffset = 0;
            }
        }
        let adjustedCenter = -this.formula(this.offset + (100 - this.pushBack) * this.fpsInterval * 0.0002) * 5;
        this.graphics.sphere.position.set(adjustedCenter + this.xOffset, this.yOffset, this.zOffset + this.pushBack * 5);
        if (this.pushBack > 25) {
            this.gameOver();
        }
    }

    adjustObstacles() {
        for (let i = 0; i < this.obstacles.length; i++) {
            let tempcyl = this.obstacles[i];
            let cylOff = this.obstaclesOffset[i];
            let pos = -this.formula(cylOff) * 5;
            let sphereTime = this.offset + 100 * this.fpsInterval * 0.0002;
            let timeDiff = sphereTime - cylOff;
            let zPos = (timeDiff / 0.0002 / this.fpsInterval);
            if ((Math.abs((this.pushBack - 1) - (zPos + 1)) < .5) && (Math.abs(this.yOffset) < 5)) {
                // console.log("pushback: ", this.pushBack)
                // console.log("zPos: ", zPos)
                this.pushBack = zPos + 3.2;
            }
            tempcyl.position.set(pos, 0, zPos * 5);
            if (zPos > 25) {
                // Remove out of view obstacles
                this.graphics.scene.remove(this.obstacles[i]);
                this.obstacles.splice(i, 1);
                this.obstaclesOffset.splice(i, 1);
                i--;
            }
        }
    }

    adjustCamera(offset, center) {
        const der = -this.derivative(offset + (100 - this.pushBack) * this.fpsInterval * 0.0002) * (this.fpsInterval * 0.0002) * this.curvatureFactor;
        // const der = -this.derivative(offset + (100) * this.fpsInterval * 0.0002) * (this.fpsInterval * 0.0002) * this.curvatureFactor;
        // const der = -derivative(offset + 100 * fpsInterval * 0.0002);
        // let temp = Math.atan(der) * 90 / Math.PI;
        let temp = Math.atan(der);


        let adjustedCenter = -this.formula(this.offset + (100 - this.pushBack) * this.fpsInterval * 0.0002) * 5;
        let x = center - Math.sin(temp) * 100;
        let z = Math.cos(temp) * 100;
        this.graphics.camera.position.set(x, 30, z);
        this.graphics.camera.lookAt(new THREE.Vector3(center, 0, 0));
        this.adjustScore(temp, x, z);
    }

    adjustVertices(offset) {
        let hSeg = this.graphics.planeGeometry.parameters.heightSegments + 1;
        let wSeg = this.graphics.planeGeometry.parameters.widthSegments + 1;

        let position = this.graphics.planeGeometry.getAttribute("position")
        let pa = position.array
        const simplex = new SimplexNoise();
        
        let planecenter = this.formula(offset + 100 * this.fpsInterval * 0.0002, wSeg);

        for (let i = 0; i < hSeg; i++) {
            // y
            let planeleft = this.formula(offset + i * this.fpsInterval * 0.0002, wSeg) - 10;
            let planeright = this.formula(offset + i * this.fpsInterval * 0.0002, wSeg) + 10;

            for (let j = 0; j < wSeg; j++) {
                // x
                if ((j > planeleft) && (j < planeright)) {
                    pa[3 * (i * wSeg + j) + 2] = 0;
                }
                else {
                    pa[3 * (i * wSeg + j) + 2] = 52;
                    //  + simplex.noise2D(j, offset - i) * 3;
                }
            }
        }


        // planeGeometry.setAttribute("position", new THREE.BufferAttribute(pa,3));
        this.graphics.planeGeometry.getAttribute("position").needsUpdate = true;
        this.graphics.planeGeometry.computeVertexNormals();
    }


    dive() {
        if (!this.lockout) {
            this.moving = "dive";
            this.lockout = true;
        }
    }

    jump() {
        if (!this.lockout) {
            this.moving = "jump";
            this.lockout = true;
        }
    }

    adjustScore(theta, x, z) {
        let textGeometry = new THREE.TextGeometry(this.aliveTime.toString(), {
          font: this.graphics.font, 
          size: 20,
          height: 5
        });
        textGeometry.center();
        textGeometry.computeBoundingBox();
        textGeometry.computeVertexNormals();
        
        let material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xb2ff66)
        });
        
        this.graphics.scene.remove(this.score);
        let text = new THREE.Mesh(textGeometry, material);
        text.position.y = 75;
        text.position.x = this.center + Math.sin(theta) * 200;
        text.position.z = -Math.cos(theta) * 200;
        text.lookAt(this.graphics.camera.position);
        this.score = text;
        this.graphics.scene.add(text);
    }

    clearScene() {
        this.obstacles.forEach((obstacle) => {
            this.graphics.scene.remove(obstacle);
        });
    }

    userInput(event) {
        const key = event.key;
        if (key == 'ArrowUp') {
            event.preventDefault();
            this.jump();
        }
        if (key == 'ArrowDown') {
            event.preventDefault();

            this.dive();
        }
        if (key == 'ArrowLeft') {
            event.preventDefault();

            if (this.center + this.xOffset - 10 < this.left) {
            }
            else {
                this.xOffset -= 1;
            }
        }
        if (key == 'ArrowRight') {
            event.preventDefault();

            if (this.center + this.xOffset + 10 > this.right) {

            }
            else {
                this.xOffset += 1;
            }
        }
        if (key == 'Escape') {
            event.preventDefault();
            this.gameOver();
        }
    }


    animate() {
        this.animationLoop = window.requestAnimationFrame(this.animate);
        this.now = Date.now();
        this.aliveTime = this.now - this.startTime;
        this.elapsed = this.now - this.then;
        this.offset = this.now * 0.0002;
        if (this.elapsed > this.fpsInterval) {
            this.then = this.now - (this.elapsed % this.fpsInterval);
            this.render(this.offset);
        }
    }

    startAnimating() {
        this.then = Date.now();
        this.startTime = this.then;
        this.obstacleInterval = setInterval(() => this.createObstacle(this.offset), 2000);
        this.setupVariables();
        document.addEventListener("keydown", this.userInput, false);
        this.animate();
    }


    restart() {
        const modal = document.getElementsByClassName("modal")[0];
        modal.classList.add("hidden");
        // this.graphics = new Setup();
        this.startAnimating();
    }

    quit() {
        const modal = document.getElementsByClassName("modal")[0];
        modal.classList.add("hidden");
        const titleScreen = document.getElementById("title-screen");
        titleScreen.classList.remove("hidden");
    }

    gameOver() {
        document.removeEventListener("keydown", this.userInput);
        this.clearScene();

        const modal = document.getElementsByClassName("modal")[0];
        const playAgainButton = document.getElementById("play-again");
        playAgainButton.addEventListener("click", this.restart);
        const quitButton = document.getElementById("quit");
        quitButton.addEventListener("click", this.quit);
        modal.classList.remove("hidden");
        window.cancelAnimationFrame(this.animationLoop);
        window.clearInterval(this.obstacleInterval);
    }
}
