/*
	Main js file

	AES
*/

//$(".panel").top($("body").height()); DONT NEED THIS

var skey = "";
var username = "";
var userID = "";
var currentID = "";
var lastSlide = "";

var g={};


$("div.slide").not(':first').hide();
//$("div.slide").not("#newNote-slide").hide();
//console.log("executing");


function tog(sel,remove,add) {
	$(sel).removeClass(remove).addClass(add);
}
function setCurrentSlide(sel) {
	$(".current-slide").removeClass("current-slide").hide();
	$(sel).addClass("current-slide");
}
function trans(target) {

	//console.log("Doing a transition");
	$(".current-slide").animate({opacity: 0},
		200,
		function () {
			console.log("fading in" + target);
			$(target).css("opacity",100).fadeIn(100);
			$(".current-slide").not(target).removeClass("current-slide").hide();
			$(target).addClass("current-slide");
		}
	);
	//setCurrentSlide(target);
}

$("#welcome-slide .signIn-btn").click(
	function (e) {
		//Slide the control panel
		trans("#login-slide");
		$("div#title .back-btn").show(400);
		$(".back-btn").click(
			function (e) {
				$(e.target).hide(400);
				trans("#welcome-slide");
			}
		);
	}
);



$("#welcome-slide .create-btn").click(
	function (e) {
		//Slide the control panel
		trans("#create-slide");
		$("div#title .back-btn").show(400);
		$(".back-btn").click(
			function (e) {
				$(e.target).hide(400);
				trans("#welcome-slide");
			}
		);
	}
);

$(".FAQ-btn").click(
	function (e) {
		lastSlide = $(".current-slide").attr("id");
		trans("#FAQ-slide");
		console.log(lastSlide);
		$("div#title .back-btn").show(400);
		$(".back-btn").click(
			function (e) {
				$(e.target).hide(400);
				trans("#"+lastSlide);
			}
		);
	}
);


$("#login-slide .submit-creds").click(
	function (e) {
		username = $("#login-slide #name").val();
		var user = {
			"username": username,
			"password": $("#login-slide #password").val()
		};
    user = JSON.stringify(user);
		$("div#title .back-btn").show(400);
		$(".back-btn").click(
			function (e) {
				$(e.target).hide(400);
				trans("#login-slide");
			}
		);

		$.ajax({
			type: "POST",
      url: "/api-login",
      data: user,
     	contentType: "application/json",
      //dataType: "jsonp",
      crossDomain: true,
      error: function (jqXHR, textStatus, errorThrown) {console.log(textStatus,errorThrown);},

      success: function (result) {
        console.log("Request went through like a bad ass");
				switch(result.error) {
					case 0: userID = result._id;
							trans("#secretkeyinput-slide");
							break;
					case 1: $("#login-slide #name").attr("placeholder","PLEASE ENTER A USERNAME").css("color","red").val("");
							$("#login-slide #password").attr("placeholder","PLEASE ENTER A PASSWORD").css("color","red").val("");
							break;// no username or pw
					case 2: $("#login-slide #name").attr("placeholder","USERNAME DOES NOT EXIST").css("color","red").val("");
							$("#login-slide #password").val("");
							break;// user dne
					case 3: $("#login-slide #name").val("");
							$("#login-slide #password").attr("placeholder","INCORRECT PASSWORD").css("color","red").val("");
							break;//wrong user/ pw
					default: $("#login-slide #name").val("");$("#login-slide #password").val("");
				};

				/*if(result.success) {
					userID = result._id;
					trans("#secretkeyinput-slide");
				} else {
					/*TELL THEM THAT THEIR SHIT DONT WORK
					$("#login-slide #name").attr("placeholder","INCORRECT USERNAME").css("color","red");
					$("#login-slide #password").attr("placeholder","INCORRECT PASSWORD").css("color","red");
				}*/
				//slide control panel
			}
		});
	}
);


$("#create-slide .submit-creds").click(
	function (e) {
		username = $("#create-slide #name").val();
		var user = {
			"username": username,
			"password": $("#create-slide #password").val()
		};
    g=JSON.stringify(user);
    user=g;

		$("div#title .back-btn").show(400);
		$(".back-btn").click(
			function (e) {
				$(e.target).hide(400);
				trans("#create-slide");
			}
		);

		$.ajax({
			type: "POST",
      url: "/api-create",
			data: user,
     	contentType: "application/json",
      crossDomain: true,
      error: function (jqXHR, textStatus, errorThrown) {console.log(textStatus,errorThrown);},

			success: function (result) {
				//On success, move to next page/note editor
				switch(result.error) {
					case 0: skey = result.key;
							userID = result._id;
							$("#secretkey-slide #secretkey").text(skey);
							trans("#secretkey-slide");
							break;
					case 1: $("#login-slide #name").attr("placeholder","PLEASE ENTER A USERNAME").css("color","red").val("");
							$("#login-slide #password").attr("placeholder","PLEASE ENTER A PASSWORD").css("color","red").val("");
							break;// no username or pw
					case 2: $("#login-slide #name").attr("placeholder","USERNAME ALREADY TAKEN").css("color","red").val("");
							$("#login-slide #password").val("");
							break;// user dne
					case 3: $("#login-slide #name").val("");
							$("#login-slide #password").attr("placeholder","INCORRECT PASSWORD").css("color","red").val("");
							break;//wrong user/ pw
					default:
				};
				/*if(result.success) {
					skey = result.key;
					userID = result._id;
					$("#secretkey-slide #secretkey").text(skey);
					//slide control panel
					trans("#secretkey-slide");
				} else {
					$("#create-slide #name").attr("placeholder","INVALID USERNAME").css("color","red");
					$("#create-slide #password").attr("placeholder","INVALID PASSWORD").css("color","red");
				}*/
			}
		});
	}
);

$("#secretkey-slide #continue").click(
	function (e) {
		trans("#welcome-slide");
	}
);

$("#secretkeyinput-slide .submit-creds").click(
	function (e) {
		skey = $("#secretkeyinput").val();
		var key = {key: skey};

		$("div#title .back-btn").show(400);
		$(".back-btn").click(
			function (e) {
				$(e.target).hide(400);
				trans("#secretkeyinput-slide");
			}
		);

		$.ajax({
			url: "TYPE URL HERE",
			type: "POST",
			dataType: "json",
			data: key,
			success: function (result) {
				//On success, move to next page
				//loop thru the json object for file titles to display and create the corresponding HTMLs
				var data = parseJSON(result);
				$("#explorer-slide li.list-group-item").remove();
				for(var i = 0; i < data.length; ++i) {
					$("#explorer-slide ul.list-group").append('<li class="list-group-item" data-id="'+data[i].id+'">'+data[i].name+'<button class="deletefile"></button></li>');
				}
				//slide control panel
				trans("#explorer-slide");
			}
		})
	}
);

$("#explorer-slide .add-btn").click(
	function (e) {
		trans("#newNote-slide");
	}
);

$("#newNote-slide .submit").click(
	function (e) {
		req = {
			_id: userID,
			name: $("#newNote-slide #title").text(),
			content: $("#newNote-slide #note").text()
		};
		$.ajax({
			url: "ADD URL HERE",
			type: "POST",
			dataType: "json",
			data: req,
			success: function (result) {
				result = parseJSON(result);
				$("#explorer-slide ul.list-group").append('<li class="list-group-item" data-id="'+result.id+'">'+req.name+'<button class="deletefile"></button></li>');
				trans("#explorer-slide");
			}
		});
	}
);

$("#newNote-slide .cancel").click(
	function (e) {
		/*SHOW CANCEL MESSAGE*/
		trans("#explorer-slide");
		$("#newNote-slide input").val("");
	}
);

$("#explorer-slide .list-group-item").click(

	function (e) {
		$(".list-group-item").hide(".deletefile");
		currentID = $(e.target).data("id");
		var req = {
			key: skey,
			id: $(e.target).data("id")
		};
		$.ajax({
			url: "TYPE URL HERE",
			type: "POST",
			dataType: "json",
			data: req,
			success: function (result) {
				result = parseJSON(result);
				$("#texteditor-slide #title").val(result.name);
				$("#texteditor-slide #note").val(result.content);
				trans(".texteditor-slide");
			}
		});
	}
);

$("#explorer-slide .list-group-item").dblclick(
	function (e) {
		$(e.target).find(".deletefile").show();
	}
);

$("#explorer-slide .list-group-item .deletefile").click(
	function (e) {
		$(e.target).parent().remove();
		var req = {
			_id: userID,
			id:  currentID
		};
		$.ajax({
			url: "TYPE URL HERE",
			type: "POST",
			dataType: "json",
			data: req,
			success: function (result) {
				/*SHOW SUCCESS BANNER??*/
			}
		});
	}
);

$("#texteditor-slide .update").click(
	function (e) {
		var post = {
			_id: userID,
			id: currentID,
			name: $("#texteditor-slide #title").val(),
			content: $("#texteditor-slide #note").val()
		}
		$.ajax({
			url: "TYPE URL HERE",
			type: "POST",
			dataType: "json",
			data: post,
			success: function (result) {
				/*SHOW SUCCESS BANNER*/
				trans("#explorer-slide");
			}
		});
	}
);

$("#texteditor-slide .cancel").click(
	function (e) {
		/*SHOW FAILURE BANNER*/
		trans("#explorer-slide");
	}
);

$("* .logout-btn").click(
	function (e) {
		skey = "";
		currentID = "";
		lastSlide = "";
		user = {_id: userID};
		$.ajax({
			url: "TYPE URL HERE",
			type: "POST",
			data: user,
			success: function (result) {
				trans("#welcome-slide");
			}
		});
		userID = "";
		username = "";
	}
);
