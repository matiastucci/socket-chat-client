angular.module('socket-chat.services', [])

.factory('Chat', function($rootScope,$http,$ionicScrollDelegate,Notification) {

  var username;
  var messages = [];

  var baseUrl, socket;

  if(window.location.origin.indexOf('localhost') == -1)
    baseUrl = 'https://socket-chat-server.herokuapp.com:443';
  else
    baseUrl = 'http://localhost:8080';

    baseUrl = 'https://socket-chat-server.herokuapp.com:443';
  

  socket = io.connect(baseUrl);

  var functions = {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      return friends[friendId];
    },
    getMessages: function(){
      return messages;
    },
    sendMessage: function(msg){
      messages.push({
        username: username,
        content: msg
      });
      socket.emit('new message', msg, username);
    },
    getUsername: function(){
      return username;
    },
    setUsername: function(newUsername){
      username = newUsername;
      socket.emit('add user', username);
    },
    getUsernames: function(){
      return $http.get(baseUrl+'/usernames');
    },
    typing: function(){
      socket.emit('typing');
    },
    stopTyping: function(){
      socket.emit('stop typing');
    }
  };

  socket.on('user joined', function(data){
    Notification.show(data.username + ' connected');
  });

  socket.on('new message', function(msg){
    $rootScope.$apply(function () {
      messages.push(msg);
      $ionicScrollDelegate.scrollBottom(true);
    });
  });

  socket.on('user left', function(data){
    Notification.show(data.username + ' disconnected');
  });

  socket.on('typing', function(data){
    console.log('typing');
    Notification.show(data.username + ' is typing');
  });

  socket.on('stop typing', function(data){
    console.log('stop typing');
    Notification.hide();
  });

  return functions;

})

.factory('Notification', function($timeout) {

 return {
  show: function(msg){
    var $notificationDiv = angular.element( document.querySelector( '.notification' ) );
    $notificationDiv.css('display','inherit');
    $notificationDiv.html(msg);
    if(msg.indexOf('typing') == -1){
      $timeout(function(){
        $notificationDiv.css('display','none');
      }, 5000);
    }
  },
  hide: function(){
    var $notificationDiv = angular.element( document.querySelector( '.notification' ) );
    $notificationDiv.css('display','none');
  }
 }

});