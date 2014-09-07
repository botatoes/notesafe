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

function loadNote(e, url) {
		$(".list-group-item").hide(".deletefile");
		currentID = $(e.target).data("id");
		var req = {
			"key": skey,
			"_id": $(e.target).data("id")
		};
    req = JSON.stringify(req);
		$.ajax({
      type: "POST",
			url: url,
			data: req,
      contentType: "application/json",
      //dataType: "jsonp",
      crossDomain: true,
      error: function (jqXHR, textStatus, errorThrown) {console.log(textStatus,errorThrown);},
			success: function (result) {

				$("#texteditor-slide #title").val(result.title);
				$("#texteditor-slide #note").val(result.content);
				trans("#texteditor-slide");
			}
		});
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
    user = JSON.stringify(user);
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
      //dataType: "jsonp",
      crossDomain: true,
      error: function (jqXHR, textStatus, errorThrown) {console.log(textStatus,errorThrown);},

      success: function (result) {
        console.log("Request went through like a bad ass");
				switch(result.error) {
					case 0: userID = result._id;
              skey = result.key;
              $("#secretkey-slide #secretkey").val(skey);
							trans("#secretkey-slide");
							break;
					case 1: $("#create-slide #name").attr("placeholder","PLEASE ENTER A USERNAME").css("color","red").val("");
							$("#create-slide #password").attr("placeholder","PLEASE ENTER A PASSWORD").css("color","red").val("");
							break;// no username or pw
					case 2: $("#create-slide #name").attr("placeholder","USERNAME ALREADY TAKEN").css("color","red").val("");
							$("#create-slide #password").val("");
							break;// user dne
					case 3: $("#create-slide #name").val("");
							$("#create-slide #password").attr("placeholder","INCORRECT PASSWORD").css("color","red").val("");
							break;//wrong user/ pw
					default:
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

$("#secretkey-slide #continue").click(
	function (e) {
		trans("#welcome-slide");
	}
);

$("#secretkeyinput-slide .submit-creds").click(
	function (e) {
		skey = $("#secretkeyinput").val();
		var key = {
      "_id": userID,
      "key": skey
    };
    key = JSON.stringify(key);
		$("div#title .back-btn").show(400);
		$(".back-btn").click(
			function (e) {
				$(e.target).hide(400);
				trans("#secretkeyinput-slide");
			}
		);

		$.ajax({
			type: "POST",
      url: "/api-notes",
			data: key,
      contentType: "application/json",
      crossDomain: true,
      error: function (jqXHR, textStatus, errorThrown) {console.log(textStatus,errorThrown);},

			success: function (result) {

        console.log("Request went through like a bad ass");
				//On success, move to next page
				//loop thru the json object for file titles to display and create the corresponding HTMLs
				var data = result;
				$("#explorer-slide li.list-group-item").remove();
				for(var i = 0; i < data.list.length; ++i) {
					$("#explorer-slide ul.list-group").append('<li class="list-group-item" data-id="'+data.list[i].id+'">'+data.list[i].title+'<span style="display:none" class="deletefile">x</span></li>');
				}
        $("#explorer-slide ul.list-group li").click(function(e) {loadNote(e,"/api-read");});
        $("#explorer-slide .list-group-item").dblclick(
			function (e) {
				$(e.target).find(".deletefile").show();
			}
		);
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
		var req = {
			"_id": userID,
			"title": $("#newNote-slide #title").val(),
			"content": $("#newNote-slide #note").val(),
			"nid":""
		};
    req = JSON.stringify(req);
		$.ajax({
     		 type: "POST",
			url: "/api-write",
			data: req,
	        contentType: "application/json",
	      crossDomain: true,
	      error: function (jqXHR, textStatus, errorThrown) {console.log(textStatus,errorThrown);},
				success: function (result) {
				$("#explorer-slide ul.list-group").append('<li class="list-group-item" data-id="'+result.nid+'">'+req.title+'<span style="display:none" class="deletefile">x</span></li>');
				 $("#explorer-slide ul.list-group li").click(function(e) {loadNote(e,"/api-read");});
				 $("#explorer-slide .list-group-item").dblclick(
					function (e) {
							$(e.target).find(".deletefile").show();
						}
					);
				 $("#submitbanner").show(500, function() {$("#submitbanner").hide(500);});

        trans("#explorer-slide");
			}
		});
	}
);

$("#newNote-slide .cancel").click(
	function (e) {
		/*SHOW CANCEL MESSAGE*/
		$("#cancelbanner").show(500, function() {$("#cancelbanner").hide(500);});

		trans("#explorer-slide");
		$("#newNote-slide input").val("");
	}
);




$("#explorer-slide .list-group-item .deletefile").click(
	function (e) {
		$(e.target).parent().remove();
		var req = {
			"_id": userID,
			"nid":  currentID
		};
		req = JSON.stringify(req);
		$.ajax({			
			type: "POST",
			url: "/api-delete",
			data: req,
	        contentType: "application/json",
	      	crossDomain: true,
	      	error: function (jqXHR, textStatus, errorThrown) {console.log(textStatus,errorThrown);},
			success: function (result) {
				/*SHOW SUCCESS BANNER??*/
				//$(/*ADD SELECTOR*/).show(500, function() {$(/*ADD SELECTOR*/).hide(500);});

				$("#explorer-slide li.list-group-item[data-id='"+currentID+"']").remove();
			}
		});
	}
);

$("#texteditor-slide .update").click(
	function (e) {
		var post = {
			"_id": userID,
			"nid": currentID,
			"title": $("#texteditor-slide #title").val(),
			"content": $("#texteditor-slide #note").val()
		}
		post = JSON.stringify(post);
		$.ajax({
			type: "POST",
			url: "/api-write",
			data: post,
	        contentType: "application/json",
	      crossDomain: true,
	      error: function (jqXHR, textStatus, errorThrown) {console.log(textStatus,errorThrown);},
			success: function (result) {
				/*SHOW SUCCESS BANNER*/
				$("#updatebanner").show(500, function() {$("#updatebanner").hide(500);});

				trans("#explorer-slide");
			}
		});
	}
);

$("#texteditor-slide .cancel").click(
	function (e) {
		/*SHOW FAILURE BANNER*/
		$("#cancelbanner").show(500, function() {$("#cancelbanner").hide(500);});

		trans("#explorer-slide");
	}
);

$("* .logout-btn").click(
	function (e) {
		skey = "";
		currentID = "";
		lastSlide = "";
		userID = "";
		username = "";
		trans("#welcome-slide");
	}
);
