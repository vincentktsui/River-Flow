import * as THREE from "three";
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Water } from './js/Water2.js';

export default class Setup {
    constructor() {
        this.scene;
        this.camera;
        this.water;
        this.terrain;
        this.sphere;
        this.setupTerrain();
        this.setupScene();
        this.setupWater();
        this.setupSphere();
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupCameras() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            10,
            1000
        );
    }

    setupWater() {
        const waterGeometry = new THREE.PlaneBufferGeometry(1000, 1000);
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
            flowDirection: new THREE.Vector2(1, 4),
            textureWidth: 1024,
            textureHeight: 1024,
            reflectivity: 0.6,
        })
        water.rotation.x = - Math.PI / 2;
        this.water = water;
        this.scene.add(this.water);
    }

    setupTerrain() {
        const planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 200, 200);
        const planeMaterial = new THREE.MeshStandardMaterial({
            roughness: 0.8,
            color: new THREE.Color(0xb2ff66),
            // wireframe: true
        });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.castShadow = true;
        plane.receiveShadow = true;
        plane.position.y = -50;
        plane.rotation.x = -Math.PI / 2;
        plane.rotation.z = Math.PI;
        this.terrain = plane;
        this.scene.add(this.terrain);
    }

    setupSky() {

    }

    setupLights() {

    }

    setupSphere() {
        const sphereGeometry = new THREE.IcosahedronBufferGeometry(10, 3);
        // var count = geometry.attributes.position.count;

        // var colors = [];
        // var color = new THREE.Color();

        // for (var i = 0; i < count; i += 3) {

        //     color.setHex(Math.random() * 0xffffff);

        //     colors.push(color.r, color.g, color.b);
        //     colors.push(color.r, color.g, color.b);
        //     colors.push(color.r, color.g, color.b);

        // }

        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0x001e0f,
            roughness: 0.0,
            flatShading: true,
            envMap: cubeCamera.renderTarget.texture,
            side: THREE.DoubleSide
        });

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
    }




}