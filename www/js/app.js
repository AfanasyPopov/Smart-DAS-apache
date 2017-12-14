// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

//var itemID = "test";
var localStorageImgArray=[];
var socket = io('http://185.63.32.215:8080');

//var photoArray=[];
angular.module('starter', ['ionic','angular-websocket' , 'starter.controllers', 'starter.services','ngAnimate','toastr'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.photosearch', {
    url: '/photosearch',
    views: {
      'menuContent': {
        templateUrl: 'templates/photosearch.html',
        controller: 'PhotoSearchCtrl'
      }
    }
  })
  
 
  
  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.projects', {
      url: '/projects',
      views: {
        'menuContent': {
          templateUrl: 'templates/projects.html',
          controller: 'ProjectsCtrl'
        }
      }
    })
    .state('app.admin', {
      url: '/admin',
      views: {
        'menuContent': {
          templateUrl: 'templates/admin.html',
          controller: 'AdminCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/photosearch');
});
