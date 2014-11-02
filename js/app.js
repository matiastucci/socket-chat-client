angular.module('socket-chat', ['ionic', 'socket-chat.controllers', 'socket-chat.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html",
      controller: 'ParentCtrl'
    })
    

    .state('tab.chat', {
      url: '/chat',
      views: {
        'tab-chat': {
          templateUrl: 'templates/tab-chat.html',
          controller: 'ChatCtrl'
        }
      }
    })

    .state('tab.people', {
      url: '/people',
      views: {
        'tab-people': {
          templateUrl: 'templates/tab-people.html',
          controller: 'PeopleCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/tab/chat');

});

