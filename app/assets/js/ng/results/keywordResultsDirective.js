module.exports = angular.module('ngReddit').directive('rSearchKeywordResults', rSearchKeywordResults);

function rSearchKeywordResults() {
  var directive = {
    link: link,
    restrict: 'EA',
    controller: SearchKeywordResultsController,
    controllerAs: 'kwsrc',
    bindToController: true
  };
  return directive;

  function link(scope, element, attrs) {   
  }
}

SearchKeywordResultsController.$inject = ['$scope', 'KeywordsResultsService'];

function SearchKeywordResultsController($scope, KeywordsResultsService) {
  var kwsrc = this;

  kwsrc.items = [];

  function getItems(keyword) {
      return KeywordsResultsService.get(keyword).then(function(data) {
          kwsrc.items = data;

          return kwsrc.items;
      });
  }

  $scope.$on('search.keyword', function(event, args) {
    getItems(args.keyword);
  });
 
}