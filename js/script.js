var dateModifier = 0;
var date = new Date();
var dateDay = date.getDay();

//cookie handling functions

function createCookie(name,value,days){
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
};

function readCookie(name){
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
};

function eraseCookie(name){
	createCookie(name,"",-1);
};


//get week number function

Date.prototype.getWeek = function(){
	        var onejan = new Date(this.getFullYear(), 0, 1);
	        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
	    }

// show and update saved id:s

function showSaved(){

	savedIDs = readCookie("savedIDs");

	$(".savedList").empty();

	if (savedIDs.length > 1){

		for (var i = 0; i < savedIDs.length; i++) {
			$(".savedList").append("<li class='savedItems' onclick='savedItemClicked($(this))'>" + savedIDs[i] + "</li>");			
		};
		
	};

	$(".savedIDs").fadeIn("fast");

};


//update timetable image

function updateTimetable(){

	idnumber = $(".input-idnumber").val();
	width = $( window ).width();
	height = (window.innerHeight - $(".navbar").height());
	week = $(".input-week").val();

	dayOnly = $("#input-day").is(':checked');

	if(width <= 820){
		if ($(".controls").is(':visible') != true){		
			$(".controls").hide();	
		}
	}else{
		$(".controls").show();
	}

	currentDay = dateDay + dateModifier;

    if(dayOnly) {

    	$("#input-day-label").text("Show week");

	    switch(currentDay){
	    	case 1:
	    		day = 1;
	    		break;
	    	case 2:
	    		day = 2;
	    		break;
	    	case 3:
	    		day = 4;
	    		break;
	    	case 4:
	    		day = 8;
	    		break;
	    	case 5:
	    		day = 16;
	    		break;
	    	default:
	    		day = 0;
    	}

	} else {

    	$("#input-day-label").text("Show day");
	    day = 0;
	}

	createCookie("idnumber", idnumber, 360);

	if (idnumber.length > 0){
		$(".timetable").attr("src", ("http://www.novasoftware.se/ImgGen/schedulegenerator.aspx?format=png&schoolid=80080/sv-se&id=" + idnumber + "&period=&week=" + week + "&mode=0&day=" + day + "&width=" + width + "&height=" + height ));
	}


};

//accept cookie policy

function infoClose(){
	createCookie("infoClosed", "closed", 360);
	$('.info').hide();
	$( ".input-idnumber" ).focus();
}

function newsClose(){
	createCookie("newsClosed", "closed", 360);
	$('.news').hide();
	$( ".input-idnumber" ).focus();	
};

function savedItemClicked(item){
	$(".input-idnumber").val(item.text());
	$(".savedIDs").fadeOut();
};

$(window).on("load", function(){
	$(".input-idnumber").val(readCookie("idnumber"));

	$(".savedIDs").fadeOut(0);

	if($( window ).width() <= 820){

		if(readCookie("idnumber") != null){
			$(".controls").hide();
			$('#input-day').prop('checked', true);			
		}else{
			$(".fas").removeClass("fa-bars").addClass("fa-times");
			$('#input-day').prop('checked', true);
			$(".controls").show();		
		};

	}else{
		$(".controls").show();
	}

	if(readCookie("infoClosed") == "closed"){
		$('.info').hide();
	}else{
		$('.info').show();
	}

	if(readCookie("newsClosed") == "closed"){
		$('.news').hide();
	}else{
		$('.news').show();
	}


	$(".input-week").val((new Date()).getWeek());

	//update triggers

	updateTimetable();	

	$( window ).resize(function() {
		updateTimetable();
	});

	$('.input-idnumber').on('input', function() {
		updateTimetable();
	});

	$('.input-week').on('input', function() {
		updateTimetable();
	});

	$('#input-day').on('click', function() {
		updateTimetable();
		if($(window).width() <= 820){
			$('.menuButton').trigger("click");
		}
	});

	$('.menuButton').on('click', function(){
		$('.controls').slideToggle('fast', function() {
		    if ($(this).is(':visible')){
		        $(this).css('display','flex');
		        $(".fas").removeClass("fa-bars").addClass("fa-times");
		    }else{
		        $(".fas").removeClass("fa-times").addClass("fa-bars");
		    };

		});
	});

	$('.input-idnumber').keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13'){
			if($(window).width() <= 820){
				if ($(this).is(':visible')){
					$('.menuButton').trigger("click");
				}; 
			};
		};
	});

	$('.input-week').keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13'){
			if($(window).width() <= 820){
				if ($(this).is(':visible')){
					$('.menuButton').trigger("click");
				};
			};
		};
	});

	$('#saveItem').keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13'){
			savedIDs = readCookie("savedIDs");

			console.log(savedIDs);

			if (savedIDs){
				savedIDs.push($("#saveItem").val());
			} else {
				savedIDs = [
					$("#saveItem").val()
				];
			};

			console.log(savedIDs);

			$("#saveItem").val();

			createCookie("savedIDs", savedIDs, 360);

			showSaved();
		}
	});

	$(function() {
      //Enable swiping...
      $(".timetable").swipe( {
        //Single swipe handler for left swipes
        swipeLeft:function(event, direction, distance, duration, fingerCount) {

        	if($(window).width() <= 820){

        		if (dateDay + dateModifier == 0){
        			dateModifier = 0;
        		} else if (dateDay + dateModifier == 7){
        			dateModifier = 0;
        		} else {
        			dateModifier += 1;
        		};

	        	updateTimetable();
			}

        },
        swipeRight:function(event, direction, distance, duration, fingerCount) {

        	if($(window).width() <= 820){

        		if (dateDay + dateModifier == 0){
        			dateModifier = 0;
        		} else if (dateDay + dateModifier == 7){
        			dateModifier = 0;
        		} else {
        			dateModifier -= 1;
        		};

	        	updateTimetable();
			}

        },
        swipeUp:function(event, direction, distance, duration, fingerCount) {

        	if($(window).width() <= 820){
	        	dateModifier = 0;
	        	updateTimetable();
			}

        },
        threshold:30
      });
    });

});

