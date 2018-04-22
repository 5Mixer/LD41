app.controller('core', function($scope,game) {
	//If you're reading this seriously, you're reading it wrong.
	//This was made in LD. LD shortcuts.
	$scope.dead = false;
	setInterval(function(){
		if (game.player.health < 1){
			$scope.dead = true;
		}
	},60)
})
