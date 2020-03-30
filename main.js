import * as THREE from "three";
import { Sky } from 'three/examples/jsm/objects/Sky.js';
// import { Water } from 'three/examples/jsm/objects/Water2.js';
import { Water } from './js/Water2.js';
import { Loader } from "./js/three";
import SimplexNoise from "simplex-noise";

export default class Main {
    constructor(container) {
        let clock = new THREE.Clock();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            10,
            2000
        );
        let angle = 0;
        let zOffset = 0;
        let xOffset = 0;
        let yOffset = 0;
        let yAngle = 0;
        let moving = undefined;
        let lockout = false;
        camera.position.set(Math.sin(angle) + xOffset, 30, Math.cos(angle) * 100 + zOffset)
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        // renderer.setClearColor("#b2ff66");
        renderer.setSize(window.innerWidth, window.innerHeight);
            
        const light = new THREE.DirectionalLight(0xffffff, 0.8);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        

        // water plane
        const waterGeometry = new THREE.PlaneBufferGeometry( 2000, 2000 );
        const water = new Water(waterGeometry, {
            // textureWidth: 512,
            // textureHeight: 512,
            // waterNormals: new THREE.TextureLoader().load('http://realearth.ssec.wisc.edu/js/Cesium/Assets/Textures/waterNormals.jpg', function (texture) {
            //     console.log(texture);
            //     texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            // }),
            // alpha: 0.1,
            // sunDirection: light.position.clone().normalize(),
            // sunColor: 0xffffff,
            // // waterColor: 0x001e0f,
            // waterColor: 0x99ffff,
            // distortionScale: 3.7,
            color: 0x99ffff,
            scale: 4,
            flowDirection: new THREE.Vector2(1, 1),
            textureWidth: 1024,
            textureHeight: 1024,
            reflectivity: 0.6,
        })
        water.rotation.x = - Math.PI / 2;
        // scene.add(water);


        // set up terrain
        const planeGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 200, 200 );
        const planeMaterial = new THREE.MeshStandardMaterial({
            roughness: 0.8,
            color: new THREE.Color(0xb2ff66),
            // wireframe: true
        });
        let hSeg = planeGeometry.parameters.heightSegments + 1;
        let wSeg = planeGeometry.parameters.widthSegments + 1;
        let pos = planeGeometry.getAttribute("position");
        let posarray = pos.array;

        function formula(x, offset) {
            let y = Math.PI * x / 300.0;
            // let y = x;
            // return (Math.sin(0.5 * y) + Math.sin(y) + 0.2 * Math.sin(3 * y)) * 50 + offset / 2;
            return (Math.sin(0.5 * y) + Math.sin(y) + 0.2 * Math.sin(3 * y)) * 5 + offset / 2;
        }
        const simplex = new SimplexNoise();

        for (let i = 0; i < hSeg; i++) {
            // y
            for (let j = 0; j < wSeg; j++) {
                // x
                let center = formula(i, wSeg);
                let left = formula(i, wSeg) - 5 - (simplex.noise2D(i/hSeg, 0) + 1) * 5;
                let right = formula(i, wSeg) + 5 + (simplex.noise2D(i/hSeg, 1) + 1) * 5;
                if ((j > left) && (j < right)) {
                    posarray[3 * (i * wSeg + j) + 2] = 0;
                }
                else {
                    posarray[3 * (i * wSeg + j) + 2] = 52;
                }
                // pa[3 * (i * wSeg + j) + 2] = Math.random();
            }
        }

        planeGeometry.getAttribute("position").needsUpdate = true;
        planeGeometry.computeVertexNormals();
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.castShadow = true;
        plane.receiveShadow = true;
        plane.position.y = -50;
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);


        // set up sky
        const sky = new Sky();
        const uniforms = sky.material.uniforms;
        uniforms["turbidity"].value = 10;
        uniforms["rayleigh"].value = 2;
        uniforms["luminance"].value = 1;
        uniforms["mieCoefficient"].value = 0.005;
        uniforms["mieDirectionalG"].value = 0.8;
        const parameters = {
            distance: 400,
            inclination: 0.45,
            azimuth: 0.205
        }
        scene.add(sky);


        const cubeCamera = new THREE.CubeCamera(0.1, 1, 512);
        cubeCamera.renderTarget.texture.generateMipmaps = true;
        cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
        scene.background = cubeCamera.renderTarget;
        
        function updateSun() {
            var theta = Math.PI * (parameters.inclination - 0.5);
            var phi = 2 * Math.PI * (parameters.azimuth - 0.5);
        
            light.position.x = parameters.distance * Math.cos(phi);
            light.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
            light.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta);
        
            sky.material.uniforms["sunPosition"].value = light.position.copy(
                light.position
            );
            // water.material.uniforms['sunDirection'].value.copy(light.position).normalize();

        
            cubeCamera.update(renderer, sky);
        }
        
        updateSun();

        var geometry = new THREE.IcosahedronBufferGeometry(10, 3);
        var count = geometry.attributes.position.count;

        var colors = [];
        var color = new THREE.Color();

        for (var i = 0; i < count; i += 3) {

            color.setHex(Math.random() * 0xffffff);

            colors.push(color.r, color.g, color.b);
            colors.push(color.r, color.g, color.b);
            colors.push(color.r, color.g, color.b);

        }

        // geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        var material = new THREE.MeshStandardMaterial({
            color: 0x001e0f,
            roughness: 0.0,
            flatShading: true,
            envMap: cubeCamera.renderTarget.texture,
            side: THREE.DoubleSide
        });

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        
        container.appendChild(renderer.domElement);
        
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            render();
        }
        function render() {
            if (moving === "jump" || moving === "dive") {
                if (yAngle <= Math.PI) {
                    yAngle += Math.PI / 90.0;
                    if (moving === "jump") {
                        yOffset = Math.sin(yAngle) * 20;
                    }
                    else {
                        yOffset = -Math.sin(yAngle) * 20;
                    }
                }
                else {
                    moving = "none"
                    lockout = false;
                    yAngle = 0;
                    yOffset = 0;
                }
            }
            // adjustVertices();
            // zOffset -= 1;
            
            sphere.position.set(xOffset, yOffset, zOffset);

            // water.material.uniforms[ 'time' ].value += 1.0/60.0;
            camera.position.set(Math.sin(angle) * 100, 30, Math.cos(angle) * 100 + zOffset)
            camera.lookAt(new THREE.Vector3(0, 0, zOffset));


            renderer.render(scene, camera);

        }

        function adjustVertices() {
            // move last row up
            let position = planeGeometry.getAttribute("position")
            let pa = position.array
            let temp = [];
            for (let j = 0; j < wSeg; j++) {
                temp.push(pa[3 * ((hSeg - 1) * wSeg + j) + 2]);
            }
            for (let i = hSeg - 2; i > 0; i--) {
                for (let j = 0; j < wSeg; j++) {
                    pa[3 * (i * wSeg + j) + 2] = pa[3 * ((i + 1) * wSeg + j) + 2];
                }
            }
            for (let j = 0; j < wSeg; j++) {
                pa[3 * j + 2] = temp.pop();
            }

            planeGeometry.setAttribute("position", new THREE.BufferAttribute(pa,3));
            planeGeometry.getAttribute("position").needsUpdate = true;
            planeGeometry.computeVertexNormals();
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

        function animate() {
            requestAnimationFrame( animate );
            render(); 
        }
        function userInput(event) {
            const key = event.key;
            // if (key == 'ArrowUp') {
            //     sphere.position.z -= 1;
            // }
            if (key == "a" && angle >= -Math.PI/2.0) {
                angle -= Math.PI / 90.0;
            }
            if (key == "d" && angle < Math.PI/2.0) {
                angle += Math.PI / 90.0;
            }
            if (key == 'ArrowUp') {
                jump();
            }
            if (key == 'ArrowDown') {
                dive();
            }
            if (key == 'ArrowLeft') {
                xOffset -= 1;
            }
            if (key == 'ArrowRight') {
                xOffset += 1;
            }
        }
        document.addEventListener("keydown", userInput, false);
        window.addEventListener("resize", onWindowResize);
        animate();
    }
}
