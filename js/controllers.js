angular.module('chat.controllers', [])

.controller('ChatCtrl', function($scope, $ionicPopup, Socket) {

  $scope.data = {};

  Socket.on('connect',function(){

    var nicknamePopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.username" autofocus>',
      title: 'What\'s your nickname?',
      scope: $scope,
      buttons: [
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.username) {
              e.preventDefault();
            } else {
              return $scope.data.username;
            }
          }
        }
      ]
    });
    nicknamePopup.then(function(nickname) {
      Socket.emit('add user',nickname);
    });

  });

})

.controller('PeopleCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
