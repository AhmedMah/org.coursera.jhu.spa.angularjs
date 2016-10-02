(function() {
  'use strict';

  angular
    .module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', foundItems)
    .directive('itemsLoaderIndicator', itemsLoaderIndicator)
    .constant('API', {
      url: 'https://davids-restaurant.herokuapp.com',
      endpoint: {
        items: '/menu_items.json'
      }
    });

  NarrowItDownController.$inject = ['MenuSearchService'];
  MenuSearchService.$inject = ['$http', '$filter', 'API'];

  function foundItems() {
    var ddo = {
      restrict: 'E',
      templateUrl: 'foundList.html',
      scope: {
        items: '<',
        onRemove: '&'
      }
    };

    return ddo;
  }

  function itemsLoaderIndicator() {
    var ddo = {
      restrict: 'E',
      templateUrl: 'loader/itemsloaderindicator.template.html',
      link: function(scope, element) {
        scope.$watch('narrowItDown.isLoading', function(newValue, oldValue) {
          if (newValue === true) {
            var loadDiv = element.find('div');
            loadDiv.css('display', 'block');
          }
          else {
            var loadDiv = element.find('div');
            loadDiv.css('display', 'none');
          }
        });
      }
    };

    return ddo;
  }

  function NarrowItDownController(MenuSearchService) {
    var narrowItDown = this;

    narrowItDown.searchTerm = '';
    narrowItDown.found = [];
    narrowItDown.shouldDisplayMessage = false;
    narrowItDown.isLoading = false;

    narrowItDown.doSearchTerm = function() {
      if(narrowItDown.searchTerm) {
        narrowItDown.isLoading = true;
        MenuSearchService.getMatchedMenuItems(narrowItDown.searchTerm)
          .then(checkResponse);
      } else {
        narrowItDown.found = [];
        narrowItDown.isLoading = false;
        narrowItDown.shouldDisplayMessage = true;
      }
    };

    narrowItDown.removeItem = function(itemIndex) {
      console.log(itemIndex);
      narrowItDown.found.splice(itemIndex, 1);
    };

    function resetSearch() {
      narrowItDown.isLoading = false;
      narrowItDown.shouldDisplayMessage = false;
      narrowItDown.searchTerm = '';
    }

    function checkResponse(response) {
      resetSearch();
      narrowItDown.found = response;
      if(!(narrowItDown.found.length > 0)) {
        narrowItDown.shouldDisplayMessage = true;
      }
    }

  }

  function MenuSearchService($http, $filter, API) {
    var menuSearch = this;

    menuSearch.getMatchedMenuItems = function(searchTerm) {
      return $http.get(API.url + API.endpoint.items)
        .then(function(response) {
          var foundItems = $filter('filter')(response.data.menu_items, {description: searchTerm});
          foundItems = $filter('orderBy')(foundItems, 'name');
          return foundItems;
        });
    };
  }
})();
