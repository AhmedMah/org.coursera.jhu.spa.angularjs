(function() {
'use strict';

angular.module('LunchApp', [])

.controller('LunchCheckController', LunchCtrl);

LunchCtrl.$inject = ['$scope','$filter'];
function LunchCtrl($scope, $filter) {
	$scope.lunchContents = "";
	$scope.hasError = false;
	$scope.errorMessage = null;
	$scope.status = 0;
	$scope.empty_items = 0;

	$scope.lunchCheck = function() {
		reset();

		if ($scope.lunchContents == undefined) {
			return lunchError("Please enter data first.", true);
		}

		var lunch = $scope.lunchContents.trim();
		if (lunch == '') {
			return lunchError("Please Enter data first.", true);
		}

		var contents = lunch.split(',');
		if (contents.length == 0) {
			return lunchError("Enter at least one item.", true);
		}

		var lunch_items = [];
		for (var i = 0; i < contents.length; i++) {
			var item = contents[i].trim();
			if (item.length > 0) {
				lunch_items.push(item);
			} else {
				$scope.empty_items++;
			}
		}

		if (lunch_items.length == 0) {
			return lunchError("Enter at least one item .", true);
		}

		if (lunch_items.length <= 3) {
			$scope.status = 1;
		} else {
			$scope.status = 2;
		}

		$scope.lunchContents = lunch_items.join(', ');

		return;
	};

	function lunchError(message, reset) {
		$scope.hasError = true;
		$scope.errorMessage = message;
		if (reset) {
			$scope.lunchContents = '';
		}
		return;
	}

	function reset() {
		$scope.hasError = false;
		$scope.errorMessage = null;
		$scope.status = 0;
		$scope.empty_items = 0;
	}
}
})();
