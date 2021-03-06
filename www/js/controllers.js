angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, toastr, $mdToast, $mdDialog) {

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

  /// Create a Toaster function
      $scope.openToast = function() {
    };

     $scope.pop = function (type, title, text){
        toastr.warning(text, title);
        //toastr.pop(type, title, text);
        //toaster.pop('error', "title", "text");
        //toaster.pop('warning', "title", "text");
        //toaster.pop('note', "title", "text");
        //showAlert ('Title','Hello');
  };

    //--Create a Toast ngMaterial function
    $scope.showCustomToast = function() {
        $mdToast.show({
          hideDelay   : 3000,
          position    : 'top right',
          controller  : 'ToastCtrl',
          templateUrl : 'toast-template.html'
        });
      };
      
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
    
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    window.localStorage.setItem('username', $scope.loginData["username"].toLowerCase());
    if ($scope.loginData["password"].length!=32) {
        window.localStorage.setItem('password', md5($scope.loginData["password"]));
    }
    socket.emit('login event',{'username': $scope.loginData["username"].toLowerCase(), 'password': window.localStorage.getItem('password')} );
    toastr.success('Запрос отправлен...', 'Авторизация:');
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
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
  
  //Check for every routing step (check Connetion status)
  $scope.$on('$ionicView.enter', function(e) {
        //checkConnection ();
        setBackgroundColor();
  });
//-----------Socket---------------------------

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
            toastr.success('ключ получен: '+userData['uuid_key']+" \n   Пользователь: "+userData['username']+" "+userData['last_name'], 'Авторизация:');
            $scope.$apply(); 
            $scope.userData=userData;
    });
    
    socket.on('login event error', function(error){
            toastr.error(error, 'Авторизация:');
            $scope.$apply(); 
            $scope.userData=[];
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
        }

    });
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
    $scope.data = {};
	$scope.id = $stateParams.id;
	$scope.showAlert = function(title, text) {
		$ionicPopup.alert({
			title: title,
			template: text
		});
	};
	$scope.refresh = function() {
		$http.get('http://api.openweathermap.org/data/2.5/forecast/daily?id='+$scope.id)
		.success(function(data, status, headers, config){
			$scope.data = data;
			$scope.$broadcast('scroll.refreshComplete');
		})
		.error(function(data, status, headers, config){
			$scope.showAlert(status, data);
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	$scope.refresh();
})

.controller('PlaylistCtrl', function($scope, $stateParams) { // ----------------------------------- ----------------------------------- -----------------------------------
})

.controller('AdminCtrl', function($scope) {
    $scope.user = {
      name: '',
      email: '',
      phone: '',
      address: '',
      donation: ''
    };
  })
  
.controller('ToastCtrl', function($scope, $mdToast, $mdDialog) {

      $scope.closeToast = function() {
        if (isDlgOpen) return;

        $mdToast
          .hide()
          .then(function() {
            isDlgOpen = false;
          });
      };

      $scope.openMoreInfo = function(e) {
        if ( isDlgOpen ) return;
        isDlgOpen = true;

        $mdDialog
          .show($mdDialog
            .alert()
            .title('More info goes here.')
            .textContent('Something witty.')
            .ariaLabel('More info')
            .ok('Got it')
            .targetEvent(e)
          )
          .then(function() {
            isDlgOpen = false;
          });
      };
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

