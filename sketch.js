let player;
let fruits = [];
let trash = [];
let score = 0;
let timer = 60;
let gameOver = false;

function setup() {
  createCanvas(600, 400);
  player = new Player();
  setInterval(() => {
    if (!gameOver) timer--;
    if (timer <= 0) gameOver = true;
  }, 1000);
}

function draw() {
  background(100, 200, 100);

  if (!gameOver) {
    player.move();
    player.show();

    // Criar frutas e lixos aleatoriamente
    if (frameCount % 30 === 0) {
      if (random() < 0.7) fruits.push(new FallingObject('fruit'));
      else trash.push(new FallingObject('trash'));
    }

    // Mostrar e atualizar frutas
    for (let i = fruits.length - 1; i >= 0; i--) {
      fruits[i].update();
      fruits[i].show();

      if (fruits[i].hits(player)) {
        score += 10;
        fruits.splice(i, 1);
      } else if (fruits[i].offscreen()) {
        fruits.splice(i, 1);
      }
    }

    // Mostrar e atualizar lixos
    for (let i = trash.length - 1; i >= 0; i--) {
      trash[i].update();
      trash[i].show();

      if (trash[i].hits(player)) {
        score -= 5;
        trash.splice(i, 1);
      } else if (trash[i].offscreen()) {
        trash.splice(i, 1);
      }
    }

    fill(255);
    textSize(16);
    text("Pontos: " + score, 10, 20);
    text("Tempo: " + timer, 10, 40);
  } else {
    fill(0);
    textSize(32);
    textAlign(CENTER);
    text("Fim de Jogo!", width / 2, height / 2 - 20);
    text("Pontuação final: " + score, width / 2, height / 2 + 20);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) player.setDir(-1);
  if (keyCode === RIGHT_ARROW) player.setDir(1);
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) player.setDir(0);
}

// Classe Jogador
class Player {
  constructor() {
    this.x = width / 2;
    this.size = 40;
    this.dir = 0;
  }

  setDir(d) {
    this.dir = d;
  }

  move() {
    this.x += this.dir * 5;
    this.x = constrain(this.x, 0, width - this.size);
  }

  show() {
    fill(255, 200, 0);
    rect(this.x, height - this.size, this.size, this.size);
  }
}

// Classe de Frutas e Lixo
class FallingObject {
  constructor(type) {
    this.x = random(width);
    this.y = 0;
    this.size = 30;
    this.speed = 4;
    this.type = type;
  }

  update() {
    this.y += this.speed;
  }

  show() {
    if (this.type === 'fruit') {
      fill(255, 0, 0); // vermelho
      ellipse(this.x, this.y, this.size);
    } else {
      fill(100); // cinza
      rect(this.x, this.y, this.size, this.size);
    }
  }

  hits(player) {
    return (
      this.x < player.x + player.size &&
      this.x + this.size > player.x &&
      this.y + this.size > height - player.size
    );
  }

  offscreen() {
    return this.y > height;
  }
}