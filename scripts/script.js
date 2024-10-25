const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
const ballCountElement = document.createElement('div');
ballCountElement.style.position = 'absolute';
ballCountElement.style.top = '10px';
ballCountElement.style.right = '10px';
ballCountElement.style.color = 'white';
document.body.appendChild(ballCountElement);

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
  return "rgb(" + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ")";
}

function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

Ball.prototype.checkCollisionWithBall = function(otherBall) {
  let dx = this.x - otherBall.x;
  let dy = this.y - otherBall.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < this.size + otherBall.size) {
    // 改变小球的颜色
    this.color = randomColor();
    otherBall.color = randomColor();

    // 碰撞后改变方向
    let tempVelX = this.velX;
    let tempVelY = this.velY;
    this.velX = otherBall.velX;
    this.velY = otherBall.velY;
    otherBall.velX = tempVelX;
    otherBall.velY = tempVelY;
  }
};

Ball.prototype.collisionDetect = function() {
  const dx = this.x - evilCircle.x;
  const dy = this.y - evilCircle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < this.size + evilCircle.size) {
    balls.splice(balls.indexOf(this), 1);
    updateBallCount();
  }
};

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

Ball.prototype.update = function () {
  if (this.x + this.size >= width) {
    this.velX = -this.velX;
  }

  if (this.x - this.size <= 0) {
    this.velX = -this.velX;
  }

  if (this.y + this.size >= height) {
    this.velY = -this.velY;
  }

  if (this.y - this.size <= 0) {
    this.velY = -this.velY;
  }

  

  this.x += this.velX;
  this.y += this.velY;

  // 检测与恶魔圈的碰撞
  const dx = this.x - evilCircle.x;
  const dy = this.y - evilCircle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < this.size + evilCircle.size) {
    balls.splice(balls.indexOf(this), 1);
    updateBallCount();
  }
};

  function updateBallCount() {
    document.getElementById('ballCount').textContent = 'Balls: ' + balls.length;
  }

function EvilCircle(x, y, velX, velY, color, size) {
  Ball.call(this, x, y, velX, velY, color, size);
}

EvilCircle.prototype = Object.create(Ball.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function () {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

EvilCircle.prototype.checkBounds = function () {
  if (this.x + this.size >= width) {
    this.x = width - this.size;
  }

  if (this.x - this.size <= 0) {
    this.x = this.size;
  }

  if (this.y + this.size >= height) {
    this.y = height - this.size;
  }

  if (this.y - this.size <= 0) {
    this.y = this.size;
  }
};

EvilCircle.prototype.setControls = function () {
  window.onkeydown = (e) => {
    switch (e.key) {
      case 'a':
        this.x -= this.velX;
        break;
      case 'd':
        this.x += this.velX;
        break;
      case 'w':
        this.y -= this.velY;
        break;
      case 's':
        this.y += this.velY;
        break;
    }
  };
};

let balls = [];

while (balls.length < 25) {
  let size = random(10, 20);
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size
  );
  balls.push(ball);
}

const evilCircle = new EvilCircle(
  random(0 + 10, width - 10),
  random(0 + 10, height - 10),
  20,
  20,
  'red',
  10
);
evilCircle.setControls();

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect(); // 调用新的 collisionDetect 方法
  

  // 检测与其他小球的碰撞
  for (let j = i + 1; j < balls.length; j++) {
    balls[i].checkCollisionWithBall(balls[j]);
  }
}


  evilCircle.draw();
  evilCircle.checkBounds();

  requestAnimationFrame(loop);
}

// 确保在页面加载完成后调用 loop 函数
window.onload = function() {
  evilCircle.setControls();
  loop();
};

updateBallCount(); // 初始化球数量显示
loop(); // 开始动画循环