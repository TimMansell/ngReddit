module.exports = angular.module('ngReddit').factory('KeywordsResultsService', KeywordsResultsService);

KeywordsResultsService.$inject = ['$http'];

function KeywordsResultsService($http) {
    var service = {
        get: get
    };

    return service;

    function get(keyword){
    	return $http.get('https://www.reddit.com/search.json?q='+keyword+'&sort=new')
            .then(success)
            .catch(failed);

        function success(response) {
            return response.data;
        }

        function failed(error) {
            //logger.error('XHR Failed for getAvengers.' + error.data);
        }
    }
}
