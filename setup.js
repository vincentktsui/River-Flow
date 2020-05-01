import * as THREE from "three";
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Water } from './js/Water2.js';

export default class Setup {
    constructor() {
        this.scene;
        this.camera;
        this.rederer;
        this.cubeCamera;
        this.water;
        this.planeGeometry;
        this.terrain;
        this.sky;
        this.sphere;
        this.ambientLight;
        this.directionalLight;
        this.setupScene();
        this.setupCameras();
        this.setupRenderer();
        this.setupLights();
        this.setupTerrain();
        this.setupWater();
        this.setupSky();
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

        const cubeCamera = new THREE.CubeCamera(0.1, 1, 512);
        cubeCamera.renderTarget.texture.generateMipmaps = true;
        cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
        this.cubeCamera = cubeCamera;
        this.scene.background = this.cubeCamera.renderTarget; 
    }

    setupRenderer() {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        // renderer.setClearColor("#b2ff66");
        let minHeight = (window.innerHeight < 600) ? 600 : window.innerHeight;
        let minWidth = (window.innerWidth < 750) ? 750 : window.innerWidth;
        renderer.setSize(minWidth, minHeight);
        this.renderer = renderer;
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
        this.planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 200, 200);
        const planeMaterial = new THREE.MeshStandardMaterial({
            roughness: 0.8,
            color: new THREE.Color(0xb2ff66),
            // wireframe: true
        });
        let plane = new THREE.Mesh(this.planeGeometry, planeMaterial);
        plane.castShadow = true;
        plane.receiveShadow = true;
        plane.position.y = -50;
        plane.rotation.x = -Math.PI / 2;
        plane.rotation.z = Math.PI;
        this.terrain = plane;
        this.scene.add(this.terrain);
    }

    setupSky() {
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
        var theta = Math.PI * (parameters.inclination - 0.5);
        var phi = 2 * Math.PI * (parameters.azimuth - 0.5);
        this.directionalLight.position.x = parameters.distance * Math.cos(phi);
        this.directionalLight.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
        this.directionalLight.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta);
        sky.material.uniforms["sunPosition"].value = this.directionalLight.position.copy(
            this.directionalLight.position
        );
        this.sky = sky;
        this.scene.add(this.sky);
        this.cubeCamera.update(this.renderer, this.sky);
    }

    setupLights() {
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.scene.add(this.directionalLight);

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(this.ambientLight);
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
            envMap: this.cubeCamera.renderTarget.texture,
            side: THREE.DoubleSide
        });

        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphere = sphere;
        this.scene.add(this.sphere);
    }

}