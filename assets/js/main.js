/*****************************************

	TABLE OF CONTENTS
	---------------------------
        1. Loader
		2. Counter
        3. Subscribe
        4. Open & Close content

 *****************************************/

$(window).on('load', function() {
	'use strict';

	/******************************************************************
	*******************************     1. LOADER
	******************************************************************/

	    setTimeout( function() {
	        $('#loader-container').fadeOut(500);
	    }, 3000);

	/******************************************************************
	*******************************     2. COUNTER
	******************************************************************/

		var Month 		= counter.setMonth;
		var Day 		= counter.setDay;
		var Year 		= counter.setYear;
		var target_date = new Date(Month +','+ Day +','+ Year).getTime();
		 
		var days, hours, minutes, seconds;
		 
		var countdownDays 	 = document.getElementById("days");
		var countdownHours 	 = document.getElementById("hours");
		var countdownMinutes = document.getElementById("minutes");
		var countdownSeconds = document.getElementById("seconds");

		setInterval(function () {
		 
			var current_date = new Date().getTime();
			var seconds_left = (target_date - current_date) / 1000;

			days = seconds_left / 86400;
			days = parseInt(days, 10);
			seconds_left = seconds_left % 86400;

			hours = seconds_left / 3600;
			hours = parseInt(hours, 10);
			seconds_left = seconds_left % 3600;

			minutes = seconds_left / 60;
			minutes = parseInt(minutes, 10);
			seconds = seconds_left % 60;
			seconds = parseInt(seconds, 10);


			days 	= (String(days).length >= 2) ? days : '0' + days;
	    	hours 	= (String(hours).length >= 2) ? hours : '0' + hours;
	    	minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
	    	seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;

			countdownDays.innerHTML = days;
			countdownHours.innerHTML = hours;
			countdownMinutes.innerHTML = minutes;
			countdownSeconds.innerHTML = seconds;

		 
		}, 1000);

		var numberOfIcons 	= $('.layer-soc').length,
			iconWidth 		= $('.layer-soc').outerWidth(true),
			totalIconsWidth	= numberOfIcons * iconWidth;

		$('.icon-center').css({
			width: totalIconsWidth
		});

	/******************************************************************
	*******************************		3. SUBSCRIBE
	******************************************************************/

	    // Event on submit subscribe form
	    $('.subscribe-submit').on('click', function() {

	        // Get value from input field
	        var email = $('#subscribe-email').val(),
	        emailTo = '',
	        apiKey = '',
	        listID = '',
	        is_email_enabled = false,
	        is_mailchimp_enabled = false;

	        // Subscribe via email
	        if( subscribe.emailTo ) {
	            is_email_enabled = true;
	            emailTo = subscribe.emailTo;
	        }
	        // Subscribe via mailchimp
	        if( subscribe.apiKey && subscribe.listID ) {
	            is_mailchimp_enabled = true;
	            apiKey = subscribe.apiKey;
	            listID = subscribe.listID;
	        }

	        // Ajax request for sending mails
	        $.ajax({
	            type: 'POST',
	            url: 'assets/subscribe.php',
	            data: {
	            // Mailchimp service
	            via_mailchimp: is_mailchimp_enabled,
	            // Subscribe via email service
	            via_email: is_email_enabled,
	            // Field value
	            email: email,
	            // Your email
	            email_to: emailTo,
	            // Mailchimp api key
	            api_key: apiKey,
	            // Mailchimp list id
	            list_id: listID,
	            // Server success message
	            success_msg: subscribe.successMsg
	            },
	            dataType: 'json',
	            success: function(json) {
	            	console.log(json);
	                if(json.valid === 0) {
	                    var response = "Email is invalid";
	                    $('.subscribe-response').text(response);
	                    $('.subscribe-response').css('color', 'tomato');
	                } else {
	                    var response = json.message;

	                    $('.subscribe-response').text(response);
	                    $('.subscribe-response').css('color', 'green');

	                    setTimeout(function() {
	                    	$('.subscribe-response').text('');
	                    }, 4000);

	                }

	            },
	            error: function (jqXHR, textStatus, errorThrown) {
	                console.log(textStatus, errorThrown);
	            }

	        });

	        return false;

	    });

	/******************************************************************
	*******************************		4. OPEN & CLOSE CONTENT
	******************************************************************/

		$('.open-content').on('click', function() {

			$('#main-content').css('display', 'block');

			$('#main-content').animateCss('fadeInUp', function() {

				$('#about, #stay-in-touch').css('display', 'table-cell');
				$('.line, .circle-small, .circle-large').css('display', 'block');
				$('.close-content').attr('style','display: block !important');

				$('#about, #stay-in-touch').animateCss('fadeInDownBig');
				$('.line').first().animateCss('fadeInDown');
				$('.line').last().animateCss('fadeInUp');
				$('.circle-small, .circle-large, .close-content').animateCss('zoomIn');

			});
		});

		$('.close-content').on('click', function() {

			$('#about, #stay-in-touch').animateCss('fadeOutDownBig');
			$('.line').first().animateCss('fadeOutUp');
			$('.line').last().animateCss('fadeOutDown');

			$('.circle-small, .circle-large, .close-content').animateCss('zoomOut', function() {

				$('#about, #stay-in-touch').css('display', 'none');
				$('.line, .circle-small, .circle-large').css('display', 'none');
				$('.close-content').attr('style','display: none !important');

			});

			setTimeout(function() {
				$('#main-content').animateCss('fadeOutDown', function() {
					$('#main-content').css('display', 'none');
				});
			}, 500);


		});
		
		$.fn.extend({
		  animateCss: function(animationName, callback) {
			var animationEnd = (function(el) {
			  var animations = {
				animation: 'animationend',
				OAnimation: 'oAnimationEnd',
				MozAnimation: 'mozAnimationEnd',
				WebkitAnimation: 'webkitAnimationEnd',
			  };

			  for (var t in animations) {
				if (el.style[t] !== undefined) {
				  return animations[t];
				}
			  }
			})(document.createElement('div'));

			this.addClass('animated ' + animationName).one(animationEnd, function() {
			  $(this).removeClass('animated ' + animationName);

			  if (typeof callback === 'function') callback();
			});

			return this;
		  },
		});

});