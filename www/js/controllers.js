angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, toastr, $ionicHistory, $state, $rootScope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  // Form data for the login modal
  var socket = io('http://185.63.32.215:8080');
  var username = window.localStorage.getItem("username");
  var password = window.localStorage.getItem("password");
  var userkey = window.localStorage.getItem("userkey");
  $scope.url="http://185.63.32.215:3000/Codiad/workspace/Smart-DAS-apache/www/";
  $scope.isAutoLogin=true;
  $scope.organization="";
  $scope.usersCard=true;
  $scope.dbDir=true;
  $rootScope.isMobilePlatform=false;
  $scope.items = [
     {name: 'one', age: 30 },
     { name: 'two', age: 27 },
     { name: 'three', age: 50 },
     { name: 'four', age: 15 },
     { name: 'five', age: 27 },
     { name: 'six', age: 30 }   
	];

  // choise mobile/desktop platform
  $scope.$on('$ionicView.afterEnter', function() {
   //-------Set Menu side (Right for mobile / Left for browser ) version  
        if (document.getElementsByTagName('body')[0].className.indexOf('platform-macintel')==-1) {
            $rootScope.isMobilePlatform=true;
        } else {
            $rootScope.isMobilePlatform=false;
        }

   });

  if (username&&password) {
      $scope.loginData={'username': username, 'password': password, 'userkey': userkey};
  } else {
      $scope.loginData= {};
  } 

  //Init localStorageImgArray for image-data storing (documentId:string, fullPathName:string, uploadStatus:boolean, barcodeId)
  var localStorageImgArray = window.localStorage.getItem("localStorageImgArray");
  if (localStorageImgArray) {
      $scope.localStorageImgArray=JSON.parse(localStorage.getItem("localStorageImgArray"));
  } else {
      $scope.localStorageImgArray= {};
  } 

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal 
  $scope.login = function() {
    $scope.modal.show();
    setBackgroundColor();
    
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
  	if (!$scope.loginData["username"]) {$scope.loginData["username"]=""};
  	if (!$scope.loginData["password"]) {$scope.loginData["password"]=""};
    window.localStorage.setItem('username', $scope.loginData["username"].toLowerCase());
    if ($scope.loginData["password"].length!=32) {
        window.localStorage.setItem('password', md5($scope.loginData["password"]));
    }
    socket.emit('login event',{'username': $scope.loginData["username"].toLowerCase(), 'password': window.localStorage.getItem('password')} );
    //toastr.success('Запрос отправлен...', 'Авторизация:');
    //alert ($scope.loginData);
     // window.localStorage.setItem('url', $scope.loginData["url"]);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    //------Clear LoginDAta & LocalStorage --- delete after dev
    //$scope.loginData= {};
    //window.localStorage.clear();

    $timeout(function() {
        if ($scope.loginData.userkey=='') {
            $ionicHistory.nextViewOptions({disableBack: true });
            $state.go('app.browse');
        };
        $scope.closeLogin();
    }, 1000);
    //location.reload(true);
  };
    // Refresh all content (non-cash reload)
  $scope.doReload = function() {
    socket.emit('send data', $scope.loginData);
    //alert ($scope.loginData);
     // window.localStorage.setItem('url', $scope.loginData["url"]);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    location.reload(true);
  };
  
  
  //-----Menu subgroup ProjectsList----------------------\
  $scope.groups = [];
  for (var i=0; i<3; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j=0; j<3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }
  

//-----------Socket---------------------------
    $scope.getUsersList= function (){ //get user list from server by socket
        //toastr.error ('Запрос отправлен',"getUsersList");
        socket.emit('admin getUsersList',{'username': $scope.loginData["username"].toLowerCase(), 'password': window.localStorage.getItem('password')} );
    };
  
    socket.on('admin getuserslist data', function(allUsersData){// 
            //toastr.success(allUsersData[0], 'allUsersData[0]');
            //toastr.success(allUsersData[1], 'allUsersData[1]');
            $scope.usersList = allUsersData[0];
            $scope.statusList = allUsersData[1];
            $scope.$apply(); 
       });
    //var socket = io();
    socket.on('chat message', function(msg){
        //alert('chat message');
    });
    socket.on('connected', function(msg){
        if(!connectionStatus){
            connectionStatus=true;
            toastr.success('устоновлено', 'Соединение');
            setBackgroundColor();
            $scope.$apply(); 
        }
    });
    
    socket.on('login event done', function(userData){
            $scope.loginData["userkey"]= userData['uuid_key'];
            window.localStorage.setItem('userkey', $scope.loginData["userkey"]);
            toastr.success(/*"ключ получен...": '+userData['uuid_key']+" \n  +*/"Пользователь: "+userData['username']+" "+userData['last_name'], 'Авторизация:');
            $scope.$apply(); 
            $scope.userData=userData;

    });

    socket.on('login event error', function(error){
            toastr.error(error, 'Авторизация:');
            $scope.userData=[];
            $scope.loginData["userkey"]= '';
            window.localStorage.setItem('userkey', $scope.loginData["userkey"]);
            $scope.$apply(); 
    });
    

    socket.on('reconnect', function(msg){
        connectionStatus=true;
        toastr.success('востоновлено', 'Соединение');
        setBackgroundColor();
        $scope.$apply() ;
    });
    socket.on('disconnected', function(msg){
        connectionStatus=false;
        toastr.error('завершено', 'Соединение');
        setBackgroundColor();
        $scope.$apply() ;
    });
    socket.on('connect_error', function(msg){
        if (connectionStatus){
            connectionStatus=false;
            toastr.error('ошибка', 'Соединение');
            setBackgroundColor();
            $scope.$apply() ;
        };

    });

     if ($scope.isAutoLogin) {$scope.doLogin()};
     


})

.controller('ProjectsCtrl', function($scope) { // ----------------------------------- ----------------------------------- -----------------------------------
   
  $scope.playlists = [
    { title: 'Заявки на Склад: №ФР-0001', id: 1 },
    { title: 'Заявки на Склад: №ФР-0002', id: 2 },
    { title: 'Заявки на Склад: №ФР-0003', id: 3 }
  ];
})
.controller('PhotoSearchCtrl', function($scope, Cities, $ionicPopup, $ionicLoading) { // ----------------------------------- -----------------------------------

    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;
    $scope.docLists = [];
    var i;
    for (i = 0; i < 10; i++) {
     $scope.docLists.push ({title: "Заявка на Склад №"+i,description:i*1.21+" м3", docId: i, fullPathName:"img/ionic.png" });
     for (k=0;k<localStorageImgArray.length;k++){
        if(localStorageImgArray[k].documentId=docLists[i].title){
            docLists[i].fullPathName = localStorageImgArray[k].fullPathName;
        } else {
            alert(localStorageImgArray[k].fullPathName);
        };
     }
    };


    //Show Alert  -----------------------------------
    $scope.showAlert = function(title, text) {
		$ionicPopup.alert({
			title: title,
			template: text
		});
	};
    $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...',
      duration: 1000
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
    };
    $scope.hide = function(){
        $ionicLoading.hide().then(function(){
           console.log("The loading indicator is now hidden");
        });
    };
    //Catrure photos from Camera -----------------------------------
    $scope.capturePicture = function(itemImgId){
       // navigator.vibrate(50);
        itemID = itemImgId;
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,destinationType: Camera.DestinationType.FILE_URI });
    };
    function onSuccess(imageURI) {
        //alert(imageURI);
        console.log("debug() function is executed!");
        var image = document.getElementById(itemID);
        image.src = imageURI;
        localStorageImgArrayAddOrReplace(itemID,imageURI);
        alert(localStorageImgArray.length);
    };
    
    function onFail(message) {
        alert('Failed because: ' + message);
    };
    
    //Accept Good  -----------------------------------
    $scope.acceptGood = function(itemId){
        navigator.vibrate(100);
    };
    //Accept Bad  -----------------------------------
    $scope.acceptBad = function (itemId){
        navigator.vibrate([100]);  
        setTimeout (function(){navigator.vibrate(100)}, 500);
    };

})

.controller('PhotoSearchDetailCtrl', function($scope, $http, $stateParams, $ionicPopup) { //  ----------------------------------- ----------------------------------
})
.controller('AdminCtrl', function($scope, $stateParams, $state,$ionicHistory, toastr) { // ----------------------------------- ----------------------------------- -----------------------------------
    //Check for every routing step (check Connetion status)
 //-----check for aviability for non-autorized user-----------
    if ($scope.loginData.userkey=='') {
            $ionicHistory.nextViewOptions({disableBack: true });
            $state.go('app.browse');
    } else {
        $scope.$on('$ionicView.enter', function() { $scope.getUsersList() });
        $scope.sortType     = 'name'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.searchLine   = '';     // set the default search/filter term
       };
})

.controller('AdminUserCtrl', function($scope, $stateParams, $state,$ionicHistory, toastr, $rootScope) { 
    $scope.index = $stateParams.userId;
    $scope.user=$scope.usersList[parseInt($scope.index)];
    $scope.displayVal=$scope.user.role_name;
    // Select ion-select-autocomplete.js  https://inmagik.github.io/ionic-modal-select/#/app/examples
	toastr.success($scope.user.role_name , 'scope.user.role_name:');

    // ----------------------------------- ----------------------------------- -----------------------------------
})

.controller('PlaylistCtrl', function($scope, $stateParams) { // ----------------------------------- ----------------------------------- -----------------------------------
});


//glogal Function area  ----------------------------------- ----------------------------------- ----------------------------------- -----------------------------------




function localStorageImgArrayAddOrReplace(itemID,imageURI){
    var flag= false;
    console.log ('locStor');
    for (var ii=0;localStorageImgArray.length;ii++){
        if (localStorageImgArray[ii].documentId=itemID){
            localStorageImgArray[ii].fullPathName = imageURI;
            localStorageImgArray[ii].uploadStatus="false";       
            flag = true;
        };    
    };
    if (!flag) {
        localStorageImgArray.push({"documentId":itemID, "fullPathName":imageURI, "uploadStatus":"false", "barcodeId":""})
    }
    localStorage.setItem("localStorageImgArray", JSON.stringify(localStorageImgArray));
}

