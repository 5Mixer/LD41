app.controller('clicker', function($scope,game) {
	$scope.player = game.player

	var functions = {
		"apple": [
			{
				name: "Eat (+1 health, +25 energy)",
				call: function (){
					game.player.findInInventory("apple").quantity --;
					game.player.energy += 25
					if (game.player.health < game.player.maxHealth)
						game.player.health ++
				}
			}
		],
		"watermellon": [
			{
				name: "Eat (+2 health, +40 energy)",
				call: function (){
					game.player.findInInventory("watermellon").quantity --;
					game.player.energy += 40
					if (game.player.health < game.player.maxHealth-1)
						game.player.health += 2
				}
			}
		],
		"wheat": [
			{
				name: "Plant (-40 energy)",
				call: function (){
					game.player.findInInventory("wheat").quantity --;
					game.player.energy -= 40
					game.plantWheat();
				}
			}
		],
		"sapling": [
			{
				name: "Eat (-5 health, +300 energy)",
				call: function (){
					if (game.player.health > 5){
						game.player.findInInventory("sapling").quantity --;
						game.player.energy += 300
						game.player.health -= 5
					}
				}
			},
			{
				name: "Plant (-10 energy)",
				call: function (){
					if (game.player.energy > 10){
						if (game.plantTree()){
							game.player.findInInventory("sapling").quantity --;
							game.player.energy -= 10
						}
					}
				}
			}
		]
	}

	$scope.energyClick = function (){
		$scope.player.energy+= 5;
	}
	$scope.getFunctions = function (itemStack){
		return functions[itemStack.name]
	}

	setInterval(function (){
		if ($scope.player.energy > 0){
			$scope.player.energy--;
		}
		$scope.$apply()
	},2000)
	setInterval(function (){
		if ($scope.player.energy < 1){
			$scope.player.health--;
		}
		$scope.$apply()
	},1000)
});
