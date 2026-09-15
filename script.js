import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const container = document.getElementById("webgl");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const group = new THREE.Group();
scene.add(group);

const material = new THREE.MeshBasicMaterial({
  color: 0xd9ff52,
  wireframe: true,
  transparent: true,
  opacity: 0.16
});
const purple = new THREE.MeshBasicMaterial({
  color: 0x8d7cff,
  wireframe: true,
  transparent: true,
  opacity: 0.10
});

const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.75, 2), material);
group.add(sphere);

const torus = new THREE.Mesh(new THREE.TorusGeometry(2.45, 0.008, 8, 160), material);
torus.rotation.x = 1.0;
group.add(torus);

const torus2 = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.006, 8, 160), purple);
torus2.rotation.x = -0.6;
torus2.rotation.y = 0.6;
group.add(torus2);

const particlesGeometry = new THREE.BufferGeometry();
const count = 900;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i += 3) {
  const radius = 3.5 + Math.random() * 4;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  positions[i] = radius * Math.sin(phi) * Math.cos(theta);
  positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
  positions[i + 2] = radius * Math.cos(phi);
}
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(
  particlesGeometry,
  new THREE.PointsMaterial({ color: 0xd9ff52, size: 0.012, transparent: true, opacity: 0.5 })
);
scene.add(particles);

let mouseX = 0, mouseY = 0;
addEventListener("pointermove", (e) => {
  mouseX = (e.clientX / innerWidth - 0.5) * 2;
  mouseY = (e.clientY / innerHeight - 0.5) * 2;
});

function animate(time) {
  requestAnimationFrame(animate);
  const t = time * 0.0003;
  sphere.rotation.x = t * 0.7 + mouseY * 0.12;
  sphere.rotation.y = t + mouseX * 0.18;
  torus.rotation.z = -t * 0.7;
  torus2.rotation.z = t * 0.45;
  group.position.x += ((mouseX * 0.35) - group.position.x) * 0.025;
  group.position.y += ((-mouseY * 0.25) - group.position.y) * 0.025;
  particles.rotation.y = t * 0.2;
  renderer.render(scene, camera);
}
animate(0);

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
