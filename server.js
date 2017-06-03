var express = require('express'),
    app     = express(),
    eps     = require('ejs'),
    morgan  = require('morgan');

Object.assign=require('object-assign');

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))
//app.use(express.static('public'));


/*var counter = 0;
var BALL_SPEED = 15;
var WIDTH = 1200;
var HEIGHT = 800;
var TANK_INIT_HP = 100;
var mapSize = {"w":3000,"h":3000};
*/
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";


app.get('/', function (req, res) {
  //res.render('index.html', {});
  res.send('{ test 55 }');
});

app.get('/pagecount', function (req, res) {
  res.send('{ pageCount: -1 }');
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});


app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;

/*
var io = require('socket.io')(server);

function GameServer(){
	this.tanks = [];
	this.balls = [];
	this.lastBallId = 0;
	this.objects = []; //require('./objects.json');
	this.object = this.mapBoarderObjects();
	console.log(this.objects);
	console.log(this.objects.length)
}



GameServer.prototype = {

	mapBoarderObjects: function(){
		objectTypes = require('./objectTypes.json');
		console.log(objectTypes)
		var i = 0;
		while(i < mapSize.w){
			this.objects.push({
				"id":getRandomID(),
				"type":objectTypes[getRandomInt(0,6)],
				"x":i +  getRandomInt(5,10),
				"y":-100 - getRandomInt(0,100),
				"w":90,
				"h":180,
				"baseAngle":getRandomInt(0,360),
				"rotationSpeed":2
			});
			this.objects.push({
				"id":getRandomID(),
				"type":objectTypes[getRandomInt(0,6)],
				"x":i +  getRandomInt(0,10),
				"y":mapSize.h + getRandomInt(0,50),
				"w":90,
				"h":180,
				"baseAngle":getRandomInt(0,360),
				"rotationSpeed":2
			})
			i += getRandomInt(50,100)
		}
		i = 0;
		while(i < mapSize.h){
			this.objects.push({
				"id":getRandomID(),
				"type":objectTypes[getRandomInt(0,6)],
				"x":-10 - getRandomInt(0,20),
				"y":i +  getRandomInt(5,10),
				"w":90,
				"h":180,
				"baseAngle":getRandomInt(0,360),
				"rotationSpeed":2
			});
			this.objects.push({
				"id":getRandomID(),
				"type":objectTypes[getRandomInt(0,6)],
				"x": mapSize.w + getRandomInt(0,50),
				"y": i +  getRandomInt(0,10),
				"w":90,
				"h":180,
				"baseAngle":getRandomInt(0,360),
				"rotationSpeed":2
			})
			i += getRandomInt(50,100)
		}
	},

	addTank: function(tank){
		this.tanks.push(tank);
		console.log("Tank joined game");
	},

	addBall: function(ball){
		this.balls.push(ball);
	},

	removeTank: function(tankId){
		//Remove tank object
		this.tanks = this.tanks.filter( function(t){return t.id != tankId} );
	},

	//Sync tank with new data received from a client
	syncTank: function(newTankData){
		this.tanks.forEach( function(tank){
			if(tank.id == newTankData.id){
				tank.x = newTankData.x;
				tank.y = newTankData.y;
				tank.baseAngle = newTankData.baseAngle;
				tank.cannonAngle = newTankData.cannonAngle;
			}
		});
	},

	//The app has absolute control of the balls and their movement
	syncBalls: function(){
		var self = this;
		//Detect when ball is out of bounds
		this.balls.forEach( function(ball){
			self.detectCollision(ball);

			if(ball.x < 0|| ball.x > mapSize.w
				|| ball.y < 0 || ball.y > mapSize.h){

				ball.out = true;
			}else{
				ball.fly();
			}
		});
	},

	//Detect if ball collides with any tank
	detectCollision: function(ball){
		var self = this;

		this.tanks.forEach( function(tank){
			if(tank.id != ball.ownerId
				&& Math.abs(tank.x - ball.x) < 50
				&& Math.abs(tank.y - ball.y) < 50){
				//Hit tank
				self.hurtTank(tank);
				ball.out = true;
				ball.exploding = true;
			}
		});
	},

	hurtTank: function(tank){
		tank.hp -= 2;
	},

	getData: function(tank){
		var gameData = {};
		gameData.tanks = this.tanks;
		gameData.balls = this.balls;
		gameData.objects = this.objects;
		//console.log("object Count: "+gameData.objects.length)
		return gameData;
	},

	cleanDeadTanks: function(){
		this.tanks = this.tanks.filter(function(t){
			return t.hp > 0;
		});
	},

	cleanDeadBalls: function(){
		this.balls = this.balls.filter(function(ball){
			return !ball.out;
		});
	},

	increaseLastBallId: function(){
		this.lastBallId ++;
		if(this.lastBallId > 1000){
			this.lastBallId = 0;
		}
	}

}

var game = new GameServer();
*/
/* Connection events */
/*
io.on('connection', function(client) {

	client.on('joinGame', function(tank){
		console.log(tank.id + ' joined the game');
		var initX = getRandomInt(40, 900);
		var initY = getRandomInt(40, 500);
		client.emit('addTank', { id: tank.id, type: tank.type, isLocal: true, x: initX, y: initY, hp: TANK_INIT_HP });
		client.broadcast.emit('addTank', { id: tank.id, type: tank.type, isLocal: false, x: initX, y: initY, hp: TANK_INIT_HP} );

		game.addTank({ id: tank.id, type: tank.type, hp: TANK_INIT_HP});
	});

	client.on('sync', function(data){
		//Receive data from clients
		if(data.tank != undefined){
			game.syncTank(data.tank);
		}
		//update ball positions
		game.syncBalls();
		//Broadcast data to clients
		client.emit('sync', game.getData(data.tank));
		client.broadcast.emit('sync', game.getData(data.tank));

		//I do the cleanup after sending data, so the clients know
		//when the tank dies and when the balls explode
		game.cleanDeadTanks();
		game.cleanDeadBalls();
		counter ++;
	});

	client.on('shoot', function(ball){
		var ball = new Ball(ball.ownerId, ball.alpha, ball.x, ball.y );
		game.addBall(ball);
	});

	client.on('leaveGame', function(tankId){
		console.log(tankId + ' has left the game');
		game.removeTank(tankId);
		client.broadcast.emit('removeTank', tankId);
	});

});

function Ball(ownerId, alpha, x, y){
	this.id = game.lastBallId;
	game.increaseLastBallId();
	this.ownerId = ownerId;
	this.alpha = alpha; //angle of shot in radians
	this.x = x;
	this.y = y;
	this.out = false;
};

Ball.prototype = {

	fly: function(){
		//move to trayectory
		var speedX = BALL_SPEED * Math.sin(this.alpha);
		var speedY = -BALL_SPEED * Math.cos(this.alpha);
		this.x += speedX;
		this.y += speedY;
	}

}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomID() {
	return Math.random().toString(36).substr(2, 20);
}

*/