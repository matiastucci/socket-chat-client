angular.module('chat.services', [])

.factory('Socket', function(socketFactory){
  var myIoSocket = io.connect('http://chat.socket.io:80');
  mySocket = socketFactory({
    ioSocket: myIoSocket
  });
  return mySocket;
})

.factory('Chat', function($ionicScrollDelegate, Socket){

  var username;
  var messages = [];
  var notifications = [];
  var TYPING_MSG = '. . .';

  var Notification = function(username,message){
    var notification          = {};
    notification.username     = username;
    notification.message      = message;
    notification.notification = true;
    return notification;
  };

  Socket.on('new message', function(msg){
    // $rootScope.$apply(function () {
      addMessage(msg);
    // });
  });

  Socket.on('typing', function (data) {
    var typingMsg = {
      username: data.username,
      message: TYPING_MSG
    };
    addMessage(typingMsg);
  });

  Socket.on('stop typing', function (data) {
    removeTypingMessage(data.username);
  });

  Socket.on('user joined', function (data) {
    var msg = data.username + ' joined';
    var notification = new Notification(data.username,msg);
    addMessage(notification);
  });

  Socket.on('user left', function (data) {
    var msg = data.username + ' left';
    var notification = new Notification(data.username,msg);
    addMessage(notification);
  });

  var scrollBottom = function(){
    $ionicScrollDelegate.resize();
    $ionicScrollDelegate.scrollBottom(true);
  };

  var addMessage = function(msg){
    msg.notification = msg.notification || false;
    messages.push(msg);
    scrollBottom();
  };

  var removeTypingMessage = function(usr){
    for (var i = messages.length - 1; i >= 0; i--) {
      if(messages[i].username === usr && messages[i].message.indexOf(TYPING_MSG) > -1){
        messages.splice(i, 1);
        scrollBottom();
        break;
      }
    }
  };

  return {
    getUsername: function(){
      return username;
    },
    setUsername: function(usr){
      username = usr;
    },
    getMessages: function() {
      return messages;
    },
    sendMessage: function(msg){
      messages.push({
        username: username,
        message: msg
      });
      $ionicScrollDelegate.scrollBottom(true);
      Socket.emit('new message', msg);
    }
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
