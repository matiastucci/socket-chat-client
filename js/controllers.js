angular.module('socket-chat.controllers', [])

.controller('ParentCtrl', function($scope, $ionicLoading, $ionicPopup, Chat) {

  $scope.username = Chat.getUsername();

  $scope.showLoading = function(){
    $ionicLoading.show({
      noBackdrop: true,
      template: '<i class="favoriteModal ion-loading-c"></i>'
    });
  };

  $scope.hideLoading = function(){
    $ionicLoading.hide();
  };


  $scope.showUsernamePopup = function() {
    $scope.data = {}

    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.username" autofocus>',
      title: 'Choose a username',
      scope: $scope,
      buttons: [
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.username) {
                //don't allow the user to close unless he enters the username
                e.preventDefault();
              } else {
                return $scope.data.username;
              }
            }
          },
      ]
    });
    myPopup.then(function(res) {
      Chat.setUsername(res);
      $scope.username = res;
    });
  };

  if(!$scope.username){
    $scope.showUsernamePopup();
  }

})

.controller('ChatCtrl', function($scope,$ionicScrollDelegate,Chat,Notification) {

  $scope.messages = Chat.getMessages();

  Notification.hide();

  $ionicScrollDelegate.scrollBottom(true);

  $scope.$watch('newMessage', function(newValue, oldValue) {
    if(typeof newValue != 'undefined'){
      if(newValue != ''){
        Chat.typing();
      }
      else{
        Chat.stopTyping();
      }
    }
  });

  $scope.sendMessage = function() {
    if($scope.newMessage){
      Chat.sendMessage($scope.newMessage);
      $scope.newMessage = '';
      $ionicScrollDelegate.scrollBottom(true);
    }
    else{
      alert('Can\'t be empty');
    }
  };

})

.controller('PeopleCtrl', function($scope, Chat) {
  $scope.showLoading();
  Chat.getUsernames().then(function(res){
    $scope.people  = res.data;
    $scope.numUsers = Object.keys(res.data).length;
    $scope.hideLoading();
  });
})

.controller('AccountCtrl', function($scope,Chat) {
  $scope.username = Chat.getUsername();
});
