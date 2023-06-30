// import './style.css'

import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'

//https://codepen.io/GreenSock/pen/BaarZmV

// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Texture Loader
const loader = new THREE.TextureLoader();
const cross = loader.load('./img/star.png')

//Geometry
const geometry = new THREE.TorusGeometry(0.7, 0.5, 20, 100);

const particlesGeometry = new THREE.BufferGeometry;
const particlescount = 5000;

const posArray = new Float32Array(particlescount * 3)

for (let i = 0; i < particlescount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

//Materials
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.007,
    map: cross,
    transparent: true,


})
const objectMaterial = new THREE.PointsMaterial({
    color: 0xd4593d,
    size: 0.008
})


var distance = Math.min(0.5, window.innerWidth / 4);

const vertices = [];

for (var i = 0; i < 1600; i++) {
    // var theta = THREE.Math.randFloatSpread(360); 
    var theta = Math.acos(THREE.Math.randFloatSpread(2));
    var phi = THREE.Math.randFloatSpread(360);



    vertices.push(
        distance * Math.sin(theta) * Math.cos(phi), distance * Math.sin(theta) * Math.sin(phi), distance * Math.cos(theta)
    );
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));



//Mesh
const ring = new THREE.Points(geometry, objectMaterial)

// ring.scale.set(0.9, 0.9, 0.5)

const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particleMesh)
scene.add(ring)




// const modelLoader = new GLTFLoader();
// modelLoader.load('./Models/planet.glb', (glb) => {

//     glb.scene.scale.set(0.75, 0.7, 0.75);

//     scene.add(glb.scene);
//     glb.scene.position.set(0, 0, 0);
// });


// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)


// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#222233'), 0.7)

/**
 * Animate
 */
//Mouse
// window.addEventListener("wheel", onMouseWheel)
let y = 0;
let position = 0;

function onMouseWheel(event) {
    y = event.deltaY * 0.0007;
}

let oldX = 0;
let oldY = 0;


document.addEventListener('mousemove', animateParticles)
let mouseX = 0;
let mouseY = 0;

function animateParticles(event) {
    // Update the mouse variable
    event.preventDefault();
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;



    // Make the sphere follow the mouse


    // Make the sphere follow the mouse
    //	mouseMesh.position.set(event.clientX, event.clientY, 0);
};

var mouseDown = 0;
document.body.onmousedown = function() {
    ++mouseDown;
    if (mouseDown > 1) {
        mouseDown = 1;
    }
}
document.body.onmouseup = function() {
    --mouseDown;
}

// events





// function animateParticles(event) {
//     mouseY = event.clientY - oldY;
//     mouseX = event.clientX - oldX;

// }


const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()
        // ring.rotation.y = .5 * elapsedTime
        // ring.rotation.x = .05 * elapsedTime


    particleMesh.rotation.y = -1 * (elapsedTime * 0.2);
    ring.rotation.y = -0.7 * (elapsedTime);
    ring.rotation.x = 0.7 * (elapsedTime);

    if (mouseX > -2 && mouseX < 2) {
        if (mouseY > -2 && mouseY < 2) {

            var vector = new THREE.Vector3(mouseX, mouseY, 0.5);
            vector.unproject(camera);
            var dir = vector.sub(camera.position).normalize();
            var distance = -camera.position.z / dir.z;
            var pos = camera.position.clone().add(dir.multiplyScalar(distance));

            if (mouseDown) {

                ring.position.x = pos.x * 0.4;
                ring.position.y = pos.y * 0.4;
                gsap.to(ring.scale, { x: 2, y: 2, z: 2 })

            } else {
                gsap.to(ring.position, { x: 0, y: 0.4, z: 0 })
                gsap.to(ring.scale, { x: 0.5, y: 0.5, z: 0.5 })

            }

        }


    }




    position += y;
    y *= 0.85;
    camera.position.y = -position;
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()