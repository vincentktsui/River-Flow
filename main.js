import * as THREE from "three";
import { Sky } from 'three/examples/jsm/objects/Sky.js';
// import { Water } from 'three/examples/jsm/objects/Water2.js';
import { Water } from './js/Water2.js';
import { Loader } from "./js/three";
import SimplexNoise from "simplex-noise";
import Setup from './setup';

export default class Main {
    constructor(container) {
        let angle = 0;
        let pushBack = 0;
        let zOffset = 0;
        let xOffset = 0;
        let yOffset = 0;
        let yAngle = 0;
        let moving = undefined;
        let lockout = false;
        let left;
        let right;
        let center;
        let obstacles = [];
        let obstaclesOffset = [];
        
        this.graphics = new Setup();
        container.appendChild(this.graphics.renderer.domElement);


        const curvatureFactor = Math.PI;
        function formula(x, offset = 0) {
            let y = x * curvatureFactor;
            // let y = x;
            // return (Math.sin(0.5 * y) + Math.sin(y) + 0.2 * Math.sin(3 * y)) * 50 + offset / 2;
            // return (Math.sin(0.5 * y) + Math.sin(y) + 0.2 * Math.sin(3 * y)) * 5 + offset / 2;
            return (Math.sin(0.5 * y) + Math.sin(y)) * 20 + offset / 2;
        }

        function derivative(x) {
            let y = x * curvatureFactor;
            // let y = x;
            return (Math.cos(0.5 * y) / 2 + 20 * Math.cos(y));
        }
  

        
        function onWindowResize() {
            this.graphics.camera.aspect = window.innerWidth / window.innerHeight;
            this.graphics.camera.updateProjectionMatrix();
            this.graphics.renderer.setSize(window.innerWidth, window.innerHeight);
            render();
        }

        function render(offset) {
            center = -formula(offset + 100 * fpsInterval * 0.0002) * 5;
            left = center - 50;
            right = center + 50;
            adjustVertices(offset);
            adjustSphere(offset, center);
            adjustObstacles(offset, center);
            adjustCamera(offset, center);
            
            // zOffset -= 1;
            
            // sphere.position.set(xOffset, yOffset, zOffset);

            // water.material.uniforms[ 'time' ].value += 1.0/60.0;
            // camera.position.set(Math.sin(angle) * 100, 30, Math.cos(angle) * 100 + zOffset)
            // camera.lookAt(new THREE.Vector3(0, 0, zOffset));


            this.graphics.renderer.render(this.graphics.scene, this.graphics.camera);

        }
        function createObstacle(offset) {
        
            const cylinder_geom = new THREE.CylinderGeometry( 10, 10, 100, 20 );
            const cylinder_mat = new THREE.MeshStandardMaterial({
                roughness: 0.8,
                color: new THREE.Color(0x8B4513),
            });
            const cylinder = new THREE.Mesh(cylinder_geom, cylinder_mat);
            cylinder.rotateZ(Math.PI / 2);
            let cylCenter = offset + 200 * fpsInterval * 0.0002;
            obstacles.push(cylinder);
            obstaclesOffset.push(cylCenter);
            this.graphics.scene.add(cylinder);
        }



        function adjustSphere(offset, center) {
            // 5 = 1000px / 200 segs
            if (moving === "jump" || moving === "dive") {
                yAngle += Math.PI / fps;
                if (yAngle <= Math.PI) {
                    if (moving === "jump") {
                        yOffset = Math.sin(yAngle) * 40;
                    }
                    else {
                        yOffset = -Math.sin(yAngle) * 40;
                    }
                }
                else {
                    moving = "none"
                    lockout = false;
                    yAngle = 0;
                    yOffset = 0;
                }
            }
            let adjustedCenter = -formula(offset + (100 - pushBack) * fpsInterval * 0.0002) * 5;
            this.graphics.sphere.position.set(adjustedCenter + xOffset, yOffset, zOffset + pushBack * 5);
            if (pushBack > 25) {
                gameOver();
            }
        }

        function adjustObstacles(offset, center) {
            for (let i = 0; i < obstacles.length; i++) {
                let tempcyl = obstacles[i];
                let cylOff = obstaclesOffset[i];
                let pos = -formula(cylOff) * 5;
                let sphereTime = offset + 100 * fpsInterval * 0.0002;
                let timeDiff = sphereTime - cylOff;
                let zPos = (timeDiff / 0.0002 / fpsInterval);
                if ((Math.abs(zPos - pushBack) < 1) && (Math.abs(yOffset) < 5)) {
                    pushBack += 1;
                }
                tempcyl.position.set(pos, 0, zPos * 5);
                if (zPos > 25) {
                    // Remove out of view obstacles
                    this.graphics.scene.remove(obstacles[i]);
                    obstacles.splice(i, 1);
                    obstaclesOffset.splice(i, 1);
                    i--;
                }
            }
        }

        function adjustCamera(offset, center) {
            const der = -derivative(offset + 100 * fpsInterval * 0.0002) * (fpsInterval * 0.0002) * curvatureFactor;
            // const der = -derivative(offset + 100 * fpsInterval * 0.0002);
            // let temp = Math.atan(der) * 90 / Math.PI;
            let temp = Math.atan(der);
            


            this.graphics.camera.position.set(center - Math.sin(temp) * 100, 30, Math.cos(temp) * 100)
            // camera.position.set(center, 30, 100)
            this.graphics.camera.lookAt(new THREE.Vector3(center, 0, 0)); 
        }

        function adjustVertices(offset) {
            let hSeg = this.graphics.planeGeometry.parameters.heightSegments + 1;
            let wSeg = this.graphics.planeGeometry.parameters.widthSegments + 1;

            let position = this.graphics.planeGeometry.getAttribute("position")
            let pa = position.array


            let planecenter = formula(offset + 100 * fpsInterval * 0.0002, wSeg);

            for (let i = 0; i < hSeg; i++) {
                // y
                let planeleft = formula(offset + i * fpsInterval * 0.0002, wSeg) - 10;
                let planeright = formula(offset + i * fpsInterval * 0.0002, wSeg) + 10;

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


        function dive() {
            if (!lockout) {
                moving = "dive";
                lockout = true;
            }
        }

        function jump() {
            if (!lockout) {
                moving = "jump";
                lockout = true;
            }
        }

        function userInput(event) {
            const key = event.key;
            // if (key == 'ArrowUp') {
            //     sphere.position.z -= 1;
            // }
            // if (key == "a" && angle >= -Math.PI/2.0) {
            //     angle -= Math.PI / 90.0;
            // }
            // if (key == "d" && angle < Math.PI/2.0) {
            //     angle += Math.PI / 90.0;
            // }
            if (key == 'ArrowUp') {
                jump();
            }
            if (key == 'ArrowDown') {
                dive();
            }
            if (key == 'ArrowLeft') {
                if (center + xOffset - 10 < left) {
                }
                else {
                    xOffset -= 1;
                }
            }
            if (key == 'ArrowRight') {
                if (center + xOffset + 10 > right) {

                }
                else {
                    xOffset += 1;
                }            
            }
        }
        // setInterval(() => createObstacle(offset), 10000);

        document.addEventListener("keydown", userInput, false);
        window.addEventListener("resize", onWindowResize);
        let animationLoop;
        function animate() {
            animationLoop = window.requestAnimationFrame( animate );
            now = Date.now();
            elapsed = now - then;
            offset = now * 0.0002;
            if (elapsed > fpsInterval) {
                then = now - (elapsed % fpsInterval);
                // then = now;
                render(offset); 
            }
        }
        let obstacleInterval;
        let offset, fps, startTime, now, then, elapsed, fpsInterval;
        function startAnimating() {
            fpsInterval = 1000 / fps;
            then = Date.now();
            startTime = then;
            obstacleInterval = setInterval(() => createObstacle(offset), 2000);
            animate();
        }
        fps = 15;
        startAnimating(fps);

        function restart() {
            const modal = document.getElementsByClassName("modal")[0];
            modal.classList.add("hidden");
            startAnimating(fps);
        }

        function gameOver() {
            const modal = document.getElementsByClassName("modal")[0];
            const playAgainButton = document.getElementById("play-again");
            playAgainButton.addEventListener("click", restart);
            modal.classList.remove("hidden");
            window.cancelAnimationFrame(animationLoop);
            window.clearInterval(obstacleInterval);
        }
    }
}
