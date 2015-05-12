var app = angular.module('app', ['onsen', 'ngStorage','ui.bootstrap']);

//define the code which runs for the all application
app.controller('controller', function($scope, $http, $localStorage, $interval) {
	//get the json file/professor and put all of it into the js object profs



if($localStorage.dati == null){
    $localStorage.dati = new Array();
    $localStorage.i = 0;
}

  $scope.nome = $localStorage.first;
  $scope.cognome = $localStorage.last;
  $scope.matricola = $localStorage.id;
  $scope.email = $localStorage.email;
  $scope.main_page="home.html";


  if($scope.nome==null || $scope.cognome==null || $scope.matricola==null || $scope.email==null){
    $scope.main_page="login.html";
  }


 if($localStorage.serverUrl==null)
       $localStorage.serverUrl="127.0.0.1:8080";

 $scope.serverUrl=$localStorage.serverUrl;


  $http.get('http://'+$scope.serverUrl+'/professors')
    .success(function(data, status, headers, config) {
      $scope.profs = data;
      //SAMU
      //$localStorage.professori = data;
      //SAMU
      //to access to data call profs['id'].nome
  });



  /* This function put at the top an alert message with the string you pass
  like parameter. es. ng-click="alert('This is the message')" */
  $scope.alert = function(string) {
    ons.notification.alert({message: string});
  }

  $scope.ricarica = function(){
    $scope.storico = new Array();
    $scope.storico = $localStorage.dati;
    $scope.proffessori = $localStorage.profProfilo;
  }

  /* Executed after the login form */
  $scope.login = function(){

//test
/*
$localStorage.dati = new Array();
$scope.data = new Array();
$localStorage.i = 0;
$scope.test=$localStorage.i;
*/
//end-test

    var first = document.getElementById("first").value;
    var last = document.getElementById("last").value;
    var id = document.getElementById("id").value;
    var email = document.getElementById("email").value;

    var su= document.getElementById("serverUrl").value;

    if(first=="" || last=="" || id=="" || email==""){
      	ons.notification.alert({message:"Please fill all the gaps"});
        return;
    }
    var pattern = new RegExp(".*@.*");
    if (email.search(pattern) == -1) {
        ons.notification.alert({message:"Email not valid. Please insert a valid email"});
        return;
    }
    var pattern2 = new RegExp("[^0-9]+");
    if (id.search(pattern2) != -1){
      ons.notification.alert({message:"Id not valid. Please insert a valid Id"});
      return;
    }


    menu.setMainPage('home.html', {closeMenu: true});
    $localStorage.first = first;
    $localStorage.last = last;
    $localStorage.id = id;
    $localStorage.email = email;
    $localStorage.serverUrl= su;
//prova
//$localStorage.i = $localStorage.i + 1;
//$scope.test = $localStorage.i
//fine prova
    $scope.nome = $localStorage.first;
    $scope.cognome = $localStorage.last;
    $scope.matricola = $localStorage.id;
    $scope.email = $localStorage.email;
    $scope.serverUrl = $localStorage.serverUrl;
  }


  $scope.checkTheConnection=function(){

    var networkState = navigator.connection.type;
    if(networkState != Connection.NONE){
      alert("Online! Type : "+ networkState);

    }else{alert("Sorry, you are offline!");}

  }

  /* Reload the menu-bar */
  $scope.reload=function(){

    $http.get('http://'+$scope.serverUrl+'/professors')
    .success(function(data, status, headers, config) {
      $scope.profs = data;
      //SAMU
      //$localStorage.professori = data;
      //SAMU
      //to access to data call profs['id'].nome
    })
    .error(function(){
      ons.notification.alert({message: "Unable to update!"});
    });
  }




  /*this function is called when clicking on a prof name
   * it manages the http get request for loading the data
   * needed for the prof profile page which is going to
   * be visualized
   */
  $scope.openProfile = function(id){
	  $http.get('http://'+$scope.serverUrl+'/professors/'+id)
	  .success(function(results, statusss, headersss, configss) {
	      $scope.profProfile = results.info;
        //SAMU
        $localStorage.profProfilo = $scope.profProfile;
        //SAMU
              if($scope.profProfile.stato == 0){		//change the color of the class
    		  $scope.profStatus = "Not in the office";
    		  $(".profile-status").css("color","red");
    	      }else{
    		  $scope.profStatus = "In the office";
    		  $(".profile-status").css("color","#00ff6a");
    	      } //call profProfile.keyword to access data
	  });

	  menu.setMainPage('prof-profile.html', {closeMenu: true}) //opens the profile page
  }







  /* Reload the Prof status when you click on button */
  $scope.reload2=function(id){
	$http.get('http://'+$scope.serverUrl+'/professors/'+id)
	.success(function(results, statusss, headersss, configss) {
	      $scope.profProfile = results.info;
        //SAMU
        $localStorage.profProfilo = $scope.profProfile;
        //SAMU
              if($scope.profProfile.stato == 0){
    		  $scope.profStatus = "Not in the office";
    		  $(".profile-status").css("color","red");
    	      }else{
    		  $scope.profStatus = "In the office";
    		  $(".profile-status").css("color","#00ff6a");
    	      }
	})
	.error(function(){
		ons.notification.alert({message: "Unable to update!"});
	});
  }


  /* Executed when you book now*/
  $scope.bookN=function(){

    menu.setMainPage('booknow.html', {closeMenu: true});

  }

  $scope.book=function(id){

    var d=new Date();
    var hh=d.getFullYear();
    var m=(d.getMonth()+1);
    var g=d.getDate();
    var h=d.getHours();
    var mm=d.getUTCMinutes();
    var h1=Math.floor(h+(mm+15)/60);
    var mm1=(mm+15)%60;

    if(m <= 9){m="0"+m;}
    if(g <= 9){g="0"+g;}
    if(h <= 9){h="0"+h;}
    if(mm <= 9){mm="0"+mm;}
    if(mm1 <= 9){mm1="0"+mm1;}
    if(h1 <= 9){h1="0"+h1;}

    var giorno= hh+"-"+m+"-"+g;

    var oraI=h+":"+mm+":00";
    var oraF=h1+":"+mm1+":00";

    var msg=document.getElementById("messaggio").value;
    var c= {

    "matricola": $scope.matricola,
		"nome":$scope.nome,
	  "cognome":$scope.cognome,
		"id":id,
		"type":"now",
		"email":$scope.email,

	  "giorno":giorno,
	  "oraI":oraI,
    "oraF":oraF,

    "messaggio":msg

    };
/*SAMU*/
    $localStorage.dati[$localStorage.i] = c;
    $localStorage.dati[$localStorage.i].oraI= $localStorage.dati[$localStorage.i].oraI.substr(0, 5);
    $localStorage.dati[$localStorage.i].oraF= $localStorage.dati[$localStorage.i].oraF.substr(0, 5);
    //$localStorage.prof_prenotato[$localStorage.i] = $localStorage.professori[c.id];
    $localStorage.i = $localStorage.i + 1;
/*fine_SAMU*/
    $http({
        method: 'POST',
        url: 'http://'+$scope.serverUrl+'/book',
        data: JSON.stringify(c),
        headers: {
            'Content-type': 'text/plain'
        }
    }).success(function(data, status, headers, config) {
      ons.notification.alert({message: data, title: "Book result", animation: "fade" });
    })
    .error(function(){
      ons.notification.alert({message: 'Unable to book! Retry!', title: "Book result", animation: "fade" });
      // oppure: ons.notification.alert({message: string});
    });


    menu.setMainPage('prof-profile.html', {closeMenu: true});
  }



  /*this is to make the calendar collapsable*/
   $scope.isCalendarCollapsed = true;

   $scope.funz2=function(){


   }

	/*Functionto to open the calendar*/
	$scope.openCalendar = function(){
    /*
		$http.get('http://'+$scope.serverUrl+'/professors/'+$scope.profProfile.id+'/lesson')
    .success(function(results) {

	      $scope.lessons =results.info;});
           $http.get('http://'+$scope.serverUrl+'/professors/'+$scope.profProfile.id+'/booking')
    .success(function(results) {
        $scope.bookings = results;});
//    $http.get('http://'+$scope.serverUrl+'/professors/'+id+'/probability').success(function(results) {
//	      $scope.probability = results;}); */

		/*This are events for the calendar */
  		$scope.lessons = [
				{
					start: '2015-05-04T09:00:00',
					end: '2015-05-04T12:00:00'
				},
				{
					start: '2015-05-05T09:00:00',
					end: '2015-05-05T12:00:00'
				},
				{
					start: '2015-05-06T09:00:00',
					end: '2015-05-06T10:30:00'
				},
				{
					start: '2015-05-07T09:00:00',
					end: '2015-05-07T13:30:00'
				},
				{
					start: '2015-05-08T12:00:00',
					end: '2015-05-08T13:30:00'
				},
				{
					start: '2015-05-08T15:00:00',
					end: '2015-05-08T18:00:00'
				},
      ];

		$scope.bookings = [
				{
					start: '2015-05-04T14:00:00',
					end: '2015-05-04T15:00:00'
				},
				];


		$scope.lessonsSource = {
			events: $scope.lessons,
			color: 'red',
			rendering: 'background',
			editable: false,
			overlap: false,
		};

    $scope.bookingsSource = {
      events: $scope.bookings,
      color: 'orange',
//      rendering: 'background',
      editable: false,
      overlap: false,
		};

		$(document).ready(function() {

		$('#calendar').fullCalendar({
			theme: true,
			header: {
				left: 'prev,next',
				center: 'title',
				right: 'agendaWeek,agendaDay'
			},
			defaultView: 'agendaWeek',
			minTime: '08:00:00',
			maxTime: '19:00:00',
//			defaultDate: '2015-02-12',
			weekends: false,
			allDaySlot: false,
			slotDuration: '00:15:00',
			displayEventEnd: false,
			defaultTimedEventDuration: '00:15:00',
			eventLimit: true, // allow "more" link when too many events

			//select the days-hours you want to add the event
			selectable: true,
			selectHelper: true,
			selectOverlap: function(event){
				return event.rendering === 'background';
			},
			select: function(start, end) {
				var title = prompt('Event Title:');
				var eventData;
				if (title) {
					eventData = {
						title: title,
						start: start,
						end: end
					};
					$('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
				}
				$('#calendar').fullCalendar('unselect');
			},

			eventSources: [
			$scope.lessonsSource,
      $scope.bookingsSource,
				]



		});

	});

	}



	 $scope.dialogs = {};
   /*Functionto to open the booking dialog box*/
  $scope.show = function(dlg) {
    if (!$scope.dialogs[dlg]) {
      ons.createDialog(dlg).then(function(dialog) {
        $scope.dialogs[dlg] = dialog;
        dialog.show();
      });
    }
    else {
      $scope.dialogs[dlg].show();
    }
  }





});

app.controller('bookingDialogCtrl', function ($scope,$localStorage,$http) {

	//functions for the calendar popup

	//set the initial date and time to today
	$scope.day = $scope.day ? null : new Date();
	$scope.startTime = $scope.startTime ? null : new Date();
	$scope.endTime = $scope.endTime ? null : new Date();
	$scope.endTime.setMinutes($scope.startTime.getMinutes()+15);


   	//Disable weekend selection
  	$scope.disabled = function(date, mode) {
    	return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  	};

  	// set the min date to today
  	$scope.toggleMin = function() {
    	$scope.minDate = $scope.minDate ? null : new Date();
  	};
  	$scope.toggleMin();

	//open the popup
  	$scope.open = function($event) {
    	$event.preventDefault();
    	$event.stopPropagation();
    	$scope.opened = true;
  	};

	//set options
  	$scope.dateOptions = {
    	formatYear: 'yy',
    	startingDay: 1
  	};
  	$scope.formats = ['yyyy-MM-dd','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  	$scope.format = $scope.formats[0];


  	//functions for the timePickers
	//set steps
  	$scope.hstep = 1;
  	$scope.mstep = 5;

	//toggle AM PM
  	$scope.ismeridian = true;
  	$scope.toggleMode = function() {
    	$scope.ismeridian = ! $scope.ismeridian;
  	};


  	//function for booking
    $scope.bookStudentsEvents=function(id){
    // Variabili ridefinite
    /*
		var giorno = $scope.day.getFullYear()+"-"+($scope.day.getMonth()+1)+"-"+$scope.day.getDate();
    var oraI= $scope.startTime.getHours()+":"+ $scope.startTime.getMinutes();
    var oraF=$scope.endTime.getHours()+":"+ $scope.endTime.getMinutes();
    $localStorage.start = giorno+"T"+oraI+":"+ $scope.startTime.getSeconds();
		$localStorage.end = giorno+"T"+oraF+":"+ $scope.endTime.getSeconds();

    $scope.bookObj = {
	      "matricola": $scope.matricola,
	      "nome":$scope.nome,
        "cognome":$scope.cognome,
	      "id": id,
        "type":"future",
        "email":$scope.email,
        "start":$localStorage.start,
        "end":$localStorage.end,
        "messaggio":$scope.comment
    };

*/





    var hh=$scope.day.getFullYear();
    var m=($scope.day.getMonth()+1);
    var g=$scope.day.getDate();
    var h=$scope.startTime.getHours();
    var mm=$scope.startTime.getMinutes();
    var h1=$scope.endTime.getHours();
    var mm1=$scope.endTime.getMinutes();

    if(m <= 9){m="0"+m;}
    if(g <= 9){g="0"+g;}
    if(h <= 9){h="0"+h;}
    if(mm <= 9){mm="0"+mm;}
    if(mm1 <= 9){mm1="0"+mm1;}
    if(h1 <= 9){h1="0"+h1;}

    var giornoI= hh+"-"+m+"-"+g;

    var oraI=h+":"+mm+":00";
    var oraF=h1+":"+mm1+":00";

    var startT = giornoI+"T"+oraI;
		var endT = giornoI+"T"+oraF;

    var msg=document.getElementById("comm").value;
    var c= {

    "matricola": $scope.matricola,
    "nome":$scope.nome,
    "cognome":$scope.cognome,
    "id":id,
    "type":"future",
    "email":$scope.email,

    "giorno":giornoI,
    "oraI":oraI,
    "oraF":oraF,

    "messaggio":msg



    };
/*SAMU*/
    $localStorage.dati[$localStorage.i] = c;
    $localStorage.dati[$localStorage.i].oraI= $localStorage.dati[$localStorage.i].oraI.substr(0, 5);
    $localStorage.dati[$localStorage.i].oraF= $localStorage.dati[$localStorage.i].oraF.substr(0, 5);
    //$localStorage.prof_prenotato[$localStorage.i] = $localStorage.professori[c.id];
    $localStorage.i = $localStorage.i + 1;
/*fine_SAMU*/


    newEvent = {
      start: startT,
      end: endT
    };
// PER ANDREA:
// Ho ridefinito questo oggetto così non ho toccato il tuo, se ti serviva solo per passarlo esternamente cancellalo pure (il tuo)
/*
    $scope.prenotazExt = {
      "matricola": $scope.matricola,
      "nome": $scope.nome,
      "cognome": $scope.cognome,
      "id": id,
      "type": "future",
      "email": $scope.email,
      "giorno": giorno,
      "oraI": oraI,
      "oraF": oraF
      "messaggio": $scope.comment,
    };
*/


	// non funziona
    $http({
        method: 'POST',
        url: 'http://'+$scope.serverUrl+'/book',
        data: JSON.stringify(c),
        headers: {
            'Content-type': 'text/plain'
        }
    }).success(function(data, status, headers, config) {
      ons.notification.alert({message: data, title: "Book result", animation: "fade" });
      $('#calendar').fullCalendar('renderEvent', newEvent, true);
    })
    .error(function(){
      ons.notification.alert({message: 'Unable to book! Retry!', title: "Book result", animation: "fade" });
    //  $('#calendar').fullCalendar('renderEvent', newEvent, true);
      // oppure: ons.notification.alert({message: string});
    });

	bookingDialog.hide();

	}; // closes the book2 function
});  //closes the controller
