(function() {
'use strict';
  angular.module('TayoShop', [])
 .controller('PurchaseCtrl', ShoppingListController)
.controller('BoughtCtrl', BoughtItemController)
 .service('ShoppingListService', ShoppingListService);


ShoppingListController.$inject = ['ShoppingListService'];
function ShoppingListController(ShoppingListService) {
	var Purchase = this;
	Purchase.list = ShoppingListService.getShoppingList();
	Purchase.item = function(itemIndex) {
		try {
			ShoppingListService.purchaseItem(itemIndex);
		} catch (err) {
			alert(err);
		}
	};
}


BoughtItemController.$inject = ['ShoppingListService'];
function BoughtItemController(ShoppingListService) {
	var Bought = this;
	Bought.list = ShoppingListService.getPurchasedList();
}


function ShoppingListService() {
	var service = this;

	var buy = [
		{
			name: 'books',
			quantity: 10
		},
		{
			name: 'pens',
			quantity: 28
		},
		{
			name: 'buscuits',
			quantity: 15
		},
		{
			name: 'banana',
			quantity: 24
		},
		{
			name: 'drinks',
			quantity: 1
		}
	];
	var bought = [];

	service.getShoppingList = function() {
		return buy;
	};

	service.getPurchasedList = function() {
		return bought;
	};

	service.purchaseItem = function(itemIndex) {
		if (typeof buy[itemIndex] === 'undefined') {
			return new Error("There is no item in the list...", itemIndex);
		}

		var item = buy.splice(itemIndex,1);

		if (typeof item[0] === 'undefined') {
			return new Error("undefined item", itemIndex);
		}
		bought.push(item[0]);
		return;
	};

}

})();
