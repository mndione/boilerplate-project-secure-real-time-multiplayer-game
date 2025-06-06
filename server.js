require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();
const http = require('http');
const server = http.createServer(app);

const io = socket.listen(server);
let players = [];
io.on("connection", socket => {
  //console.log('new player connected !');
  const id = socket.id;
  if(!players.includes(id)) players.push(id);
  io.emit('new player', socket.id, players);

  socket.on('disconnect', () => {
    //console.log('player disconnected !');
    const id = socket.id;
    players = players.filter(sid => sid != id);
    io.emit('del player', id);
    //console.log(players);
  });

  socket.on('score', (id, score) => {
    //console.log('event score: ', id, score);
    players = players.map(p => {
      if(p.id == id) p.score = score;
      return p;
    });
    io.emit('update', id, score);
  });
});

app.use(helmet.noSniff());
app.use(helmet.noCache());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy({setTo: 'PHP 7.4.3'}));

app.use('/public', express.static(process.cwd() + '/public'));
//app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 


// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
