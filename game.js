import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let score = 0;

// Player Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(geometry, material);
player.position.y = -3;
scene.add(player);

// Ground
const groundGeo = new THREE.PlaneGeometry(10, 10);
const groundMat = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = Math.PI / 2;
ground.position.y = -3.5;
scene.add(ground);

camera.position.z = 5;

let obstacles = [];
let gameOver = false;

function spawnObstacle() {
  const geo = new THREE.BoxGeometry();
  const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const obs = new THREE.Mesh(geo, mat);
  obs.position.x = (Math.random() - 0.5) * 6;
  obs.position.y = 5;
  scene.add(obs);
  obstacles.push(obs);
}

function checkCollision(a, b) {
  return Math.abs(a.position.x - b.position.x) < 1 &&
         Math.abs(a.position.y - b.position.y) < 1;
}


function animate() {
  if (gameOver) return;


  movePlayer(player.position.x);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  obstacles.forEach(obs => {
    obs.position.y -= 0.05;
  
    if (checkCollision(obs, player)) {
      document.getElementById('gameOver').style.display = 'block';
      document.getElementById('score').textContent = score - 2;
      gameOver = true;
      
    }
  });

  // Remove off-screen obstacles
  obstacles = obstacles.filter(obs => obs.position.y > -6);
}

setInterval(() => {
  if (!gameOver) {
    score++;
    spawnObstacle();
  }
}, 1000);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') player.position.x -= 0.3;
  if (e.key === 'ArrowRight') player.position.x += 0.3;
});

function movePlayer(direction) {
  if (direction === 'left') player.position.x -= 0.3;
  if (direction === 'right') player.position.x += 0.3;
}

function resetGame() {
  gameOver = false;
  score = 0;
  document.getElementById('gameOver').style.display = 'none';
  obstacles.forEach(obs => scene.remove(obs));
  obstacles = [];
  player.position.x = 0;
  player.position.y = -3;
  animate();
}
document.getElementById('restart').addEventListener('click', resetGame);
// document.getElementById('gameOver').style.display = 'none';


animate();



