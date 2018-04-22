app.controller('survival', function($scope,game) {
	/*global ut */
	var term, eng; // Can't be initialized yet because DOM is not ready
	var pl = { x: 3, y: 2 }; // Player position

	var snakes = []

	var map = [
		"####################",
		"#....#...#.........#",
		"##...##a...#.......#",
		"#..........#....#..#",
		"#........#.........#",
		"#................a.#",
		"####......#..p.....#",
		"#......##..........#",
		"#.............w....#",
		"###......#...w.....#",
		"#...##............p#",
		"#..#pp#......#.#...#",
		"#...##..........#..#",
		"#.......#......a#g.#",
		"####################"
	];
	function setMap(x,y,t){
		var row = map[y]
		s = row.substr(0, x) + t + row.substr(x + 1);
		map[y] = s
	}

	game.plantTree = function (){
		var placed = false;
		if (getTile(pl.x+1,pl.y) == tiles.floor){
			setMap(pl.x+1,pl.y,"#")
			placed = true;
		}
		if (getTile(pl.x-1,pl.y) == tiles.floor){
			setMap(pl.x-1,pl.y,"#")
			placed = true;
		}
		if (getTile(pl.x,pl.y+1) == tiles.floor){
			setMap(pl.x,pl.y+1,"#")
			placed = true;
		}
		if (getTile(pl.x,pl.y-1) == tiles.floor){
			setMap(pl.x,pl.y-1,"#")
			placed = true;
		}
		return placed;
	}
	game.plantWheat = function (){
		if (getTile(pl.x+1,pl.y) == tiles.floor){
			setMap(pl.x+1,pl.y,"w")
			return true;
		}
		if (getTile(pl.x-1,pl.y) == tiles.floor){
			setMap(pl.x-1,pl.y,"w")
			return true;
		}
		if (getTile(pl.x,pl.y+1) == tiles.floor){
			setMap(pl.x,pl.y+1,"w")
			return true;
		}
		if (getTile(pl.x,pl.y-1) == tiles.floor){
			setMap(pl.x,pl.y-1,"w")
			return true;
		}
		return false;
	}

	// The tile palette is precomputed in order to not have to create
	// thousands of Tiles on the fly.

	var tiles = {
		"player" : { solid: false, playerStep: undefined, tile: new ut.Tile("🙂", 255, 255, 255)},
		"tree" : { solid: true, playerStep: function (pos,newpos){
			if (game.player.energy > 10){
				setMap(newpos.x,newpos.y,"s")
				game.player.energy -= 10
				$scope.$apply();
				setTimeout(function (){
					var drop = "."
					var dropr = Math.random();
					if (dropr < .3)
						drop = "a"
					if (dropr < .1)
						drop = "k"

					setMap(this.pos.x,this.pos.y,drop)
					$scope.$apply();
				}.bind({pos:newpos}),300)
			}
		}, tile: new ut.Tile('🌳', 100, 100, 100)},
		"apple" : { solid: false, playerStep: function(pos){
			game.player.addToInventory("apple",1)
			$scope.$apply()
			setMap(pos.x,pos.y,".")
		}, tile: new ut.Tile('🍎', 250,250,250)},
		"floor" : { solid: false, playerStep: undefined, tile: new ut.Tile('-', 30, 140, 50)},
		"sapling" : { solid: false, playerStep: function (pos){
			game.player.addToInventory("sapling",1)
			$scope.$apply()
			setMap(pos.x,pos.y,".")
		}, tile: new ut.Tile('🌱', 250, 250, 250)},
		"wheat" : {solid: false, playerStep: function (pos,newpos){
			if (Math.random() > .7){
				setMap(newpos.x,newpos.y,"p")
				// setTimeout(function (){
				// 	var drop = "."
				// 	setMap(this.pos.x,this.pos.y,drop)
				// }.bind({pos:newpos}),300)
			}
		}, tile: new ut.Tile("🌾",250,250,250)},
		"watermellon" : {solid: false, playerStep: function(pos){
			game.player.addToInventory("watermellon",1)
			$scope.$apply()
			setMap(pos.x,pos.y,".")
		}, tile: new ut.Tile("🍉",250,250,250)},
		"poop" : {solid: false, playerStep: function (pos){
			game.player.health--;
			setMap(pos.x,pos.y,".")
		}, tile: new ut.Tile("💩",250,250,250)},
		"gift" : {solid: false, playerStep: function (pos){
			if (Math.random() < .3){
				game.player.maxHealth += 5;
				game.player.health += 5;
			}else if (Math.random()<.5){
				game.player.energy += 100;
			}else{
				game.player.addToInventory("wheat",3)
			}
			setMap(pos.x,pos.y,".")
		}, tile: new ut.Tile("🎁",250,250,250)},


		"snake": {solid: false, playerStep: undefined, tile: new ut.Tile("🐍",250,250,250)},
		"sparkle" : {solid: false, playerStep: undefined, tile: new ut.Tile("✨",250,250,250)}
	}
	var tileMapping = {
		"#" : tiles.tree,
		"." : tiles.floor,
		"a" : tiles.apple,
		"@" : tiles.player,
		"s" : tiles.sparkle,
		"k" : tiles.sapling,
		"w" : tiles.wheat,
		"e" : tiles.watermellon,
		"g" : tiles.gift,
		"p" : tiles.poop
	}

	function getTile (x,y){
		var t = "";

		if (map[y] == undefined){
			return tiles.floor.tile;
		}
		if (map[y][x] == undefined){
			return tiles.floor.tile;
		}
		t = map[y][x]; //MAY BE OUT OF BOUNDS
		// console.log(tileMapping[t].tile)
		if (t == undefined){
			console.log("error")
		}
		return tileMapping[t]
	}
	// Returns a Tile based on the char array map
	function getDungeonTile(x, y) {
		var t = "";

		if (map[y] == undefined){
			return ut.NULLTILE;
		}
		if (map[y][x] == undefined){
			return ut.NULLTILE;
		}
		t = map[y][x]; //MAY BE OUT OF BOUNDS
		// console.log(tileMapping[t].tile)
		if (t == undefined){
			console.log("error")
		}
		return tileMapping[t].tile
	}

	// "Main loop"
	function tick() {
		eng.update(pl.x, pl.y); // Update tiles
		for (var s = 0; s < snakes.length; s++){
			term.put(tiles.snake.tile,snakes[s].x-pl.x+term.cx,snakes[s].y-pl.y+term.cy)

		}
		term.put(tiles.player.tile, term.cx, term.cy); // Player character
		term.render(); // Render

	}
	setInterval(function(){
		for (var s = 0; s < snakes.length; s++){
			if (snakes[s].x == 1){
				snakes.splice(s,1)
				s--;
			}else{
				if (Math.random() > .8){
					snakes[s].x --;
					if (snakes[s].x == pl.x && snakes[s].y == pl.y){
						snakes.splice(s,1)
						s--;
						game.player.health --;
					}
				}
			}
		}
	},150)

	// Key press handler - movement & collision handling
	function onKeyDown(k) {
		if (game.player.energy > 0){
			var movedir = { x: 0, y: 0 }; // Movement vector
			if (k === ut.KEY_LEFT || k === ut.KEY_H) movedir.x = -1;
			else if (k === ut.KEY_RIGHT || k === ut.KEY_L) movedir.x = 1;
			else if (k === ut.KEY_UP || k === ut.KEY_K) movedir.y = -1;
			else if (k === ut.KEY_DOWN || k === ut.KEY_J) movedir.y = 1;
			if (movedir.x === 0 && movedir.y === 0) return;
			var oldx = pl.x, oldy = pl.y;
			pl.x += movedir.x;
			pl.y += movedir.y;

			var t = getTile(pl.x, pl.y);
			if (t != undefined && t.solid) {
				//If you can't move there, move back
				pl.x = oldx; pl.y = oldy;
			}else{
				// Player moved
				game.player.energy -= 1
				$scope.$apply()

				//Snake check
				for (var s = 0; s < snakes.length; s++){
					if (snakes[s].x == pl.x && snakes[s].y == pl.y){
						snakes.splice(s,1)
						s--;
						game.player.health --;
					}
				}
			}

			if (t.playerStep != undefined){
				t.playerStep(pl,{x:oldx+movedir.x,y:oldy+movedir.y})
			}

			tick();
		}
	}

	function makeCropsRelease (){
		for (var y = 0; y < map.length; y++){
			for (var x = 0; x < map[y].length; x++){
				var tile = getTile(x,y);
				if (tile == tiles.wheat){
					if (Math.random() > .5){
						var place = Math.random() > .85 ? "w" : (Math.random() > .8 ? "e" : "#")
						setMap(x+1,y,place)
					}
					if (Math.random() > .5){
						var place = Math.random() > .85 ? "w" : (Math.random() > .8 ? "e" : "#")
						setMap(x,y-1,place)
					}
					if (Math.random() > .5){
						var place = Math.random() > .85 ? "w" : (Math.random() > .8 ? "e" : "#")
						setMap(x,y+1,place)
					}
					if (Math.random() > .5){
						var place = Math.random() > .85 ? "w" : (Math.random() > .8 ? "e" : "#")
						setMap(x-1,y,place)
					}
				}
			}
		}
		setTimeout(makeCropsRelease,7000+Math.random()*6000)
	}
	setTimeout(makeCropsRelease,6000)


	var snakeInterval = 5000
	function mkSnek (){
		if (Math.random() >.5)
			snakeInterval *= .85;
		if (snakeInterval < 2000){
			snakeInterval = 2000
		}
		snakes.push({x:map[0].length,y:Math.floor(Math.random()*map.length)})
		setTimeout(mkSnek,snakeInterval)
	}
	setTimeout(mkSnek,snakeInterval)

	// Initialize
	window.setInterval(tick, 50); // Animation
	// Initialize Viewport, i.e. the place where the characters are displayed
	term = new ut.Viewport(document.getElementById("map"), 24,24,  "auto", true);
	term.setRenderer("dom")
	term.render()
	// Initialize Engine, i.e. the Tile manager
	// eng = new ut.Engine(term, getDungeonTile, map[0].length, map.length);
	eng = new ut.Engine(term, getDungeonTile, undefined, undefined);
	// Initialize input
	ut.initInput(onKeyDown);


});
