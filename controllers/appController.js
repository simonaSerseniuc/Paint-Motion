var app = angular.module('PaintMotion', ['ui.bootstrap','ui.router', 'ngRoute', 'ngAnimate'])
                 .filter("toArray", function () {
                     return function (obj) {
                         var result = [];
                         angular.forEach(obj, function (val, key) {
                             result.push(val);
                         });
                         return result;
                     }
                 })
                 .filter('capitalize', function() {
                    return function(input, scope) {
                        if (input != null)
                            input = input.toLowerCase();
                        return input.substring(0,1).toUpperCase() + input.substring(1);
                  }
                 });                 


app.run(function ($rootScope) {
    var controllerOptions = {enableGestures:true, useAllPlugins: true};
});


app.config(function ($routeProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');    
});

app.service('loading', function () {
    this.show = function () {
        $('#loadingDiv').show();
    };
    this.hide = function () {
        $('#loadingDiv').hide();
    };
});

app.service('loader', function(){
    this.show = function () {
        $('#loader').show();
    };
    this.hide = function () {
        $('#loader').hide();
    };
});


