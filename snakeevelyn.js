const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const cell = 20;
let snake, food, direction, nextDirection;
let score = 0, timer, playing = false;

let total = Number(localStorage.total || 0);
let record = Number(localStorage.record || 0);
let color = localStorage.color || "purple";

const foods = [
  {name:"Manzana", icon:"🍎", points:0},
  {name:"Uvas", icon:"🍇", points:0},
  {name:"Sandía", icon:"🍉", points:0},
  {name:"Burrito", icon:"🌯", points:50},
  {name:"Taco", icon:"🌮", points:50},
  {name:"Hamburguesa", icon:"🍔", points:50},
  {name:"Pasta", icon:"🍝", points:120},
  {name:"Pizza", icon:"🍕", points:120},
  {name:"Lasaña", icon:"🍲", points:120}
];

const palettes = {
  "Normales": [
    {name:"Rojo",value:"red"},
    {name:"Azul",value:"blue"},
    {name:"Verde",value:"green"},
    {name:"Amarillo",value:"yellow"},
    {name:"Naranja",value:"orange"},
    {name:"Morado",value:"purple"},
    {name:"Rosa",value:"pink"},
    {name:"Negro",value:"black"},
    {name:"Blanco",value:"white"},
    {name:"Turquesa",value:"turquoise"},
    {name:"Café",value:"brown"}
  ],

  "Pasteles": [
    {name:"Rosa pastel",value:"#ffb6c1"},
    {name:"Lila pastel",value:"#d8b4fe"},
    {name:"Azul cielo",value:"#87ceeb"},
    {name:"Menta",value:"#98ffcc"},
    {name:"Amarillo pastel",value:"#fff4a3"},
    {name:"Durazno pastel",value:"#ffd1b9"}
  ],

  "Neón": [
    {name:"Verde neón",value:"#39ff14"},
    {name:"Rosa neón",value:"#ff1493"},
    {name:"Naranja neón",value:"#ff6700"},
    {name:"Azul eléctrico",value:"#00e5ff"},
    {name:"Amarillo neón",value:"#ffff00"}
  ],

  "Metálicos": [
    {name:"Dorado",value:"gold"},
    {name:"Plateado",value:"silver"},
    {name:"Bronce",value:"#cd7f32"},
    {name:"Oro rosa",value:"#e8a0a8"},
    {name:"Cromo",value:"#b8c2cc"},
    {name:"Guinda metálico",value:"#94143e"},
    {name:"Azul metálico",value:"#4169e1"},
    {name:"Morado metálico",value:"#8B5CF6"}
  ]
};

function show(id) {
  document.querySelectorAll("main section").forEach(s => s.hidden = true);
  document.getElementById(id).hidden = false;

  if (id === "comida") showFoods();
  if (id === "colores") showColors();
  if (id === "records") updateRecords();
}

function startGame() {
  clearInterval(timer);

  snake = [
    {x:10,y:10},
    {x:9,y:10},
    {x:8,y:10}
  ];

  direction = "right";
  nextDirection = "right";
  score = 0;
  playing = true;

  document.getElementById("score").textContent = score;
  document.getElementById("message").textContent =
    "¡Consigue comida y crece!";

  newFood();
  draw();
  timer = setInterval(update,130);
}

function pauseGame() {
  if (!playing) return;

  playing = false;
  clearInterval(timer);
  document.getElementById("message").textContent = "Juego pausado.";
}

function newFood() {
  const available = foods.filter(f => total >= f.points);

  do {
    food = {
      x:Math.floor(Math.random()*20),
      y:Math.floor(Math.random()*20),
      item:available[Math.floor(Math.random()*available.length)]
    };
  } while (snake && snake.some(p => p.x === food.x && p.y === food.y));
}

function update() {
  direction = nextDirection;
  const head = {...snake[0]};

  if (direction === "up") head.y--;
  if (direction === "down") head.y++;
  if (direction === "left") head.x--;
  if (direction === "right") head.x++;

  if (
    head.x < 0 || head.x >= 20 ||
    head.y < 0 || head.y >= 20 ||
    snake.some((p,i) => i > 0 && p.x === head.x && p.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 5;
    total += 5;
    localStorage.total = total;

    if (score > record) {
      record = score;
      localStorage.record = record;
    }

    document.getElementById("score").textContent = score;
    document.getElementById("record").textContent = record;
    newFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = "#190d27";
  ctx.fillRect(0,0,400,400);

  ctx.strokeStyle = "#382347";

  for (let i=0; i<=400; i+=cell) {
    ctx.beginPath();
    ctx.moveTo(i,0);
    ctx.lineTo(i,400);
    ctx.moveTo(0,i);
    ctx.lineTo(400,i);
    ctx.stroke();
  }

  ctx.font = "20px Arial";
  if (food) {
    ctx.fillText(food.item.icon,food.x*cell,food.y*cell+18);
  }

  if (!snake) return;

  snake.forEach((p,i) => {
    const gradient = ctx.createLinearGradient(
      p.x*cell,p.y*cell,(p.x+1)*cell,(p.y+1)*cell
    );

    if (color === "#94143e") {
      gradient.addColorStop(0,"#ff789b");
      gradient.addColorStop(0.5,"#94143e");
      gradient.addColorStop(1,"#4b0822");

    } else if (color === "#8B5CF6") {
      gradient.addColorStop(0,"#E9D5FF");
      gradient.addColorStop(0.35,"#A855F7");
      gradient.addColorStop(0.7,"#7E22CE");
      gradient.addColorStop(1,"#4C1D95");

    } else {
      gradient.addColorStop(0,color);
      gradient.addColorStop(1,"#ffffff");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(p.x*cell+1,p.y*cell+1,18,18);

    if (i === 0) {
      ctx.fillStyle = "white";
      ctx.fillRect(p.x*cell+5,p.y*cell+5,3,3);
      ctx.fillRect(p.x*cell+12,p.y*cell+5,3,3);
    }
  });
}

function endGame() {
  playing = false;
  clearInterval(timer);

  document.getElementById("message").textContent =
    "¡Fin del juego! Conseguíste " + score + " puntos.";

  updateRecords();
}

function move(dir) {
  const opposite = {
    up:"down",
    down:"up",
    left:"right",
    right:"left"
  };

  if (opposite[dir] !== direction) {
    nextDirection = dir;
  }
}

document.addEventListener("keydown", e => {
  const keys = {
    ArrowUp:"up",w:"up",
    ArrowDown:"down",s:"down",
    ArrowLeft:"left",a:"left",
    ArrowRight:"right",d:"right"
  };

  if (keys[e.key]) {
    e.preventDefault();
    move(keys[e.key]);
  }
});

let touchStart;

canvas.addEventListener("touchstart",e => {
  touchStart = [
    e.touches[0].clientX,
    e.touches[0].clientY
  ];
},{passive:true});

canvas.addEventListener("touchend",e => {
  if (!touchStart) return;

  const dx = e.changedTouches[0].clientX-touchStart[0];
  const dy = e.changedTouches[0].clientY-touchStart[1];

  if (Math.abs(dx)>Math.abs(dy)) {
    move(dx>0?"right":"left");
  } else {
    move(dy>0?"down":"up");
  }

  touchStart = null;
},{passive:true});

function showFoods() {
  document.getElementById("foods").innerHTML = foods.map(f =>
    `<button class="${total < f.points ? "locked" : ""}">
      ${total < f.points ? "🔒" : f.icon}
      ${f.name}
      ${total < f.points ? "(" + f.points + " puntos)" : ""}
    </button>`
  ).join("");
}

function showColors() {
  let html = "";

  for (const [group,colors] of Object.entries(palettes)) {
    const level = {
      Normales:0,
      Pasteles:45,
      Neón:100,
      Metálicos:180
    }[group];

    html += `<h3>${group} ${
      total < level ? "🔒 Desde " + level + " puntos" : ""
    }</h3>`;

    colors.forEach(c => {
      html += `
        <button class="color-option"
          ${total < level ? "disabled" : ""}
          style="background:${c.value};"
          onclick="selectColor('${c.value}')">
          ${c.name}
        </button>`;
    });
  }

  document.getElementById("colors").innerHTML = html;
  document.getElementById("unlock").textContent =
    "Puntos acumulados: " + total;
}

function selectColor(c) {
  color = c;
  localStorage.color = c;
  draw();
}

function updateRecords() {
  document.getElementById("best").textContent = record;
  document.getElementById("total").textContent = total;
  document.getElementById("record").textContent = record;
}

newFood();
draw();
updateRecords();