angular.module('starter', ['ionic', 'ionic.contrib.frostedGlass'])

.controller('PageCtrl', function($scope, $ionicFrostedDelegate, $ionicScrollDelegate, $rootScope) {

  var socket = io.connect('https://socket-chat-example.herokuapp.com:443');

  $scope.username = prompt('username');
  socket.emit('new user', $scope.username);

  $scope.messages = [];

  socket.on('new user', function(newUsername){
  	console.log(newUsername);
  });

  socket.on('chat message', function(msg){
    $scope.$apply(function () {
    	$scope.messages.push(msg);
    });
  });

  socket.on('user disconnected', function(username){
  	alert(username + ' disconnected');
  });

  $scope.sendMessage = function() {
    socket.emit('chat message', $scope.newMessage,$scope.username);
    $scope.newMessage = '';

    // Update the scroll area and tell the frosted glass to redraw itself
    $ionicFrostedDelegate.update();
    $ionicScrollDelegate.scrollBottom(true);
  };
  
});
