import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

let players = [];
let theCollectible = new Collectible({x: 0, y: 0, value: 0, id: self.crypto.randomUUID()});
const Speed = 5;

socket.on('new player', (id, playersId) => {
    if(!players.length) {
        playersId.forEach(pid => {
            let x = Math.floor(Math.random() * 640 - Player.avatarWidth);
            let y = Math.floor(Math.random() * 480 - Player.avatarHeight);
            players.push(new Player({x: x, y: y, score: 0, id: pid}));
        });
    }
    else if(!players.find(p => p.id == id)){
        let x = Math.floor(Math.random() * 640 - Player.avatarWidth);
        let y = Math.floor(Math.random() * 480 - Player.avatarHeight);
        players.push(new Player({x: x, y: y, score: 0, id: id})); 
    }
    draw();
    //console.log(players);
});

socket.on('del player', (id) => {
    players = players.filter(player => player.id != id);
    //console.log(players);
    draw();
});

socket.on('update', (id, score) => {
    players = players.map(p => {
        if(p.id == id) p.score = score;
        return p;
    });
    //console.log('event-update: ', id, score);
    draw();
});

let raf = false;

document.addEventListener("keydown", (e) => {
    let dir = '';
    switch(e.key){
        case 'w':
        case 'W':
        case 'ArrowLeft':
            dir = 'left';
            break;
        case 'a':
        case 'A':
        case 'ArrowUp':
            dir = 'up';
            break;
        case 's':
        case 'S':
        case 'ArrowRight':
            dir = 'right';
            break;
        case 'd':
        case 'D':
        case 'ArrowDown':
            dir = 'down';
    }

    if(dir){
        raf = window.requestAnimationFrame(() => animate(dir));
    }
});

document.addEventListener("keyup", (e) => {
    if(raf) {
        window.cancelAnimationFrame(raf);
        raf = false;
    } 
});

const animate = (dir) => {
    const theplayer = players.find(obj => obj.id == socket.id);
    context.clearRect(theplayer.x, theplayer.y, theplayer.w, theplayer.h);
    theplayer.movePlayer(dir, Speed);
    theplayer.avatar(context, true);
    if(theplayer.collision(theCollectible)){
        window.cancelAnimationFrame(raf);
        socket.emit('score', theplayer.id, theplayer.score);
        //draw();
    }
}

const draw = () => {
  context.reset();
  const theplayer = players.find(obj => obj.id == socket.id);
  context.font = "10px serif";
  context.fillText(theplayer.calculateRank(players), 10, 10);
  //console.log(theplayer);
  theplayer.avatar(context, true);
  players.filter(p => p.id != theplayer.id).forEach(p => p.avatar(context));
  
  let x = Math.floor(Math.random() * 640 - Collectible.collectibleRadius);
  let y = Math.floor(Math.random() * 480 - Collectible.collectibleRadius);
  theCollectible.x = x;
  theCollectible.y = y;
  theCollectible.value = Math.floor(Math.random() * 5);
  theCollectible.draw(context);

  if(theplayer.collision(theCollectible)){
    socket.emit('score', theplayer.id, theplayer.score);
  }
  
}