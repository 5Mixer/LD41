app.service('game', function() {
	this.player = {
		energy:1000,
		health: 5,
		maxHealth: 5,
		inventory: [
			{ name: "apple", symbol: "🍎", quantity: 3 },
			{ name: "sapling", symbol: "🌱", quantity: 0 },
			{ name: "watermellon", symbol: "🍉", quantity: 0 },
			{ name: "wheat", symbol: "🌾", quantity: 3 },
		],
		findInInventory(itemName){
			for (var i = 0; i < this.inventory.length; i++)
				if (this.inventory[i].name == itemName)
					return this.inventory[i]
			return undefined;
		},addToInventory(itemName,quantity){
			if (this.findInInventory(itemName) != undefined)
				this.findInInventory(itemName).quantity += quantity
		}
	}
	var plantTree = undefined
	var plantWheat = undefined
});
