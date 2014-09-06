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

$("div.slide").not(':first').hide();
//console.log("executing");


function tog(sel,remove,add) {
	$(sel).removeClass(remove).addClass(add);
}
function setCurrentSlide(sel) {
	$("div.slide").removeClass(".current-slide");
	$(sel).addClass(".current-slide");
}
function trans(target) {

	//console.log("Doing a transition");
	$(".current-slide").animate({opacity: 0},
		500,
		function () {
			$(".current-slide").hide();
			$(target).fadeIn(500);
		}
	);
	setCurrentSlide(target);
}

$("#welcome-slide .signIn-btn").click(
	function (e) {
		//Slide the control panel
		trans("#login-slide");
	}
);



$("#welcome-slide .create-btn").click( 
	function (e) {
		//Slide the control panel
		trans("#create-slide");
	}
);

$(" * .FAQ-btn").click(
	function (e) {
		lastSlide = $(".current-slide").attr("id");
		trans("#FAQ-slide");
	}
);

$("#FAQ-slide .back-btn").click(
	function (e) {
		trans(lastSlide);
	}
);


$("#login-slide .submit-creds").click(
	function (e) {
		username = $("#login-slide #name").val();
		var user = {
			username: username,
			password: $("#login-slide #password").val()
		};

		$.ajax({
			url: "TYPE URL HERE",
			type: "POST",
			dataType: "json",
			data: user,
			success: function (result) {
				result = parseJSON(result);
				//On success, move to next page/note editor
				if(result.success) {
					userID = result._id;
					trans("#secretkeyinput-slide");					
				} else {
					/*TELL THEM THAT THEIR SHIT DONT WORK*/
					$("#login-slide #name").attr("placeholder","INCORRECT USERNAME").css("color","red");
					$("#login-slide #password").attr("placeholder","INCORRECT PASSWORD").css("color","red");
				}
				//slide control panel
			}
		});
	}
);

$("#login-slide .back-btn").click(
	function (e) {
		trans("#welcome-slide");
	}
);

$("#create-slide .submit-creds").click(
	function (e) {
		username = $("#create-slide #name").val();
		var user = {
			username: username,
			password: $("#create-slide #name").val()
		};

		$.ajax({
			url: "TYPE URL HERE",
			type: "POST",
			dataType: "json",
			data: user,
			success: function (result) {
				result = parseJSON(result);
				//On success, move to next page/note editor
				if(result.success) {
					skey = result.key;
					userID = result._id;
					$("#secretkey-slide #secretkey").text(skey);
					//slide control panel
					trans("#secretkey-slide");
				} else {
					$("#create-slide #name").attr("placeholder","INVALID USERNAME").css("color","red");
					$("#create-slide #password").attr("placeholder","INVALID PASSWORD").css("color","red");
				}
			}
		});
	}
);

$("#create-slide .back-btn").click(
	function (e) {
		trans("#welcome-slide");
	}
);

$("#secretkey-slide #continue").click(
	function (e) {
		trans("#welcome-slide");
	}
);

$("#enter_secret .submit-creds").click(
	function (e) {
		skey = $("#secretkeyinput").val();
		var key = {key: skey};

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
