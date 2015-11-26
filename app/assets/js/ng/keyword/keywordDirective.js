module.exports = angular.module('ngReddit').directive('rSearchKeyword', rSearchKeyword);

function rSearchKeyword() {
  var directive = {
    link: link,
    restrict: 'EA',
    controller: keywordController,
    controllerAs: 'kwc',
    bindToController: true
  };
  return directive;

  function link(scope, element, attrs) {   
  }
}

keywordController.$inject = ['$rootScope'];

function keywordController($rootScope) {
  var kwc = this;

  kwc.search = {
    keyword: null
  }
      
  kwc.runKeywordSearch = function(){
    console.log('search for:', kwc.search.keyword);

    $rootScope.$broadcast('search.keyword', {keyword: kwc.search.keyword});
  }
}
