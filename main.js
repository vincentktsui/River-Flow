import * as THREE from "three";
import { Sky } from 'three/examples/jsm/objects/Sky.js';
// import { Water } from 'three/examples/jsm/objects/Water2.js';
import { Water } from './js/Water2.js';
import { Loader } from "./js/three";
import SimplexNoise from "simplex-noise";
import Setup from './setup';

export default class Main {
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
        this.now;
        this.then;
        this.elapsed;
        this.fpsInterval;

        this.graphics = new Setup();
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.setupVariables = this.setupVariables.bind(this);
        this.createObstacle = this.createObstacle.bind(this);
        this.restart = this.restart.bind(this);
        this.userInput = this.userInput.bind(this);
        container.appendChild(this.graphics.renderer.domElement);
        document.addEventListener("keydown", this.userInput, false);
        window.addEventListener("resize", this.onWindowResize);
        this.fps = 15;
        this.startAnimating(this.fps);
    }

    setupVariables() {
        this.pushBack = 0;
        this.zOffset = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        this.yAngle = 0;
        this.obstacles = [];
        this.obstaclesOffset = [];
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
        this.graphics.camera.aspect = window.innerWidth / window.innerHeight;
        this.graphics.camera.updateProjectionMatrix();
        this.graphics.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    }

    render() {
        this.center = -this.formula(this.offset + 100 * this.fpsInterval * 0.0002) * 5;
        this.left = this.center - 50;
        this.right = this.center + 50;
        this.adjustVertices(this.offset);
        this.adjustSphere(this.offset, this.center);
        this.adjustObstacles(this.offset, this.center);
        this.adjustCamera(this.offset, this.center);
            
            // zOffset -= 1;
            
            // sphere.position.set(xOffset, yOffset, zOffset);

            // water.material.uniforms[ 'time' ].value += 1.0/60.0;
            // camera.position.set(Math.sin(angle) * 100, 30, Math.cos(angle) * 100 + zOffset)
            // camera.lookAt(new THREE.Vector3(0, 0, zOffset));


        this.graphics.renderer.render(this.graphics.scene, this.graphics.camera);

    }
    
    createObstacle(offset) {
        
        const cylinder_geom = new THREE.CylinderGeometry( 10, 10, 100, 20 );
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
            if ((Math.abs(zPos - this.pushBack) < 1) && (Math.abs(this.yOffset) < 5)) {
                this.pushBack += 1;
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
        const der = -this.derivative(offset + 100 * this.fpsInterval * 0.0002) * (this.fpsInterval * 0.0002) * this.curvatureFactor;
        // const der = -derivative(offset + 100 * fpsInterval * 0.0002);
        // let temp = Math.atan(der) * 90 / Math.PI;
        let temp = Math.atan(der);
        


        this.graphics.camera.position.set(center - Math.sin(temp) * 100, 30, Math.cos(temp) * 100)
        // camera.position.set(center, 30, 100)
        this.graphics.camera.lookAt(new THREE.Vector3(center, 0, 0)); 
    }

    adjustVertices(offset) {
        let hSeg = this.graphics.planeGeometry.parameters.heightSegments + 1;
        let wSeg = this.graphics.planeGeometry.parameters.widthSegments + 1;

        let position = this.graphics.planeGeometry.getAttribute("position")
        let pa = position.array


        let planecenter = this.formula(offset + 100 * this.fpsInterval * 0.0002, wSeg);

        for (let i = 0; i < hSeg; i++) {
            // y
            let planeleft = this.formula(offset + i * this.fpsInterval * 0.0002, wSeg) - 10;
            let planeright = this.formula(offset + i * this.fpsInterval * 0.0002, wSeg) + 10;

            for (let j = 0; j < wSeg; j++) {
                // x
                // let left = formula(i, wSeg) - 5 - (simplex.noise2D(i/hSeg, 0) + 1) * 5;
                // let right = formula(i, wSeg) + 5 + (simplex.noise2D(i/hSeg, 1) + 1) * 5;

                if ((j > planeleft) && (j < planeright)) {
                    pa[3 * (i * wSeg + j) + 2] = 0;
                }
                // else if (i === 100) {
                //     pa[3 * (i * wSeg + j) + 2] = 80;
                // } 
                else {
                    pa[3 * (i * wSeg + j) + 2] = 52;
                }
                // pa[3 * (i * wSeg + j) + 2] = Math.random();
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

    userInput(event) {
        const key = event.key;
        if (key == 'ArrowUp') {
            this.jump();
        }
        if (key == 'ArrowDown') {
            this.dive();
        }
        if (key == 'ArrowLeft') {
            if (this.center + this.xOffset - 10 < this.left) {
            }
            else {
                this.xOffset -= 1;
            }
        }
        if (key == 'ArrowRight') {
            if (this.center + this.xOffset + 10 > this.right) {

            }
            else {
                this.xOffset += 1;
            }            
        }
    }


    animate() {
        this.animationLoop = window.requestAnimationFrame( this.animate );
        this.now = Date.now();
        this.elapsed = this.now - this.then;
        this.offset = this.now * 0.0002;
        if (this.elapsed > this.fpsInterval) {
            this.then = this.now - (this.elapsed % this.fpsInterval);
            this.render(this.offset); 
        }
    }

    startAnimating() {
        this.fpsInterval = 1000 / this.fps;
        this.then = Date.now();
        this.startTime = this.then;
        this.obstacleInterval = setInterval(() => this.createObstacle(this.offset), 2000);
        
        this.animate();
    }


    restart() {
        const modal = document.getElementsByClassName("modal")[0];
        modal.classList.add("hidden");
        this.graphics = new Setup();
        this.setupVariables();
        this.startAnimating(this.fps);
    }

    gameOver() {
        const modal = document.getElementsByClassName("modal")[0];
        const playAgainButton = document.getElementById("play-again");
        playAgainButton.addEventListener("click", this.restart);
        modal.classList.remove("hidden");
        window.cancelAnimationFrame(this.animationLoop);
        window.clearInterval(this.obstacleInterval);
    }
}
