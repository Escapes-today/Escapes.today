$(function () {
    $(".showcase").sortable({
        connectWith: ".destination",
        containment: "#products",
		cancel: ".addRemove, .dragignore",   
        scroll: true,
	});
	//Slide out the makeplan div when user drags a POI
	$(".showcase").on("click, mousedown", "li", function () {
	  $('.makeplan').removeClass('slidein').css("min-height", "300px");
	  $('.makeplan').css("min-height", "");
	});
    $(".showcase").disableSelection();
    $(".destination").sortable({
        connectWith: ".showcase",
        containment: "#products",
        scroll: true,
		cancel: ".addRemove, .dragignore",
        receive: function (event, ui) {
            $(ui.item).children(".shadowbox").children(".poi").toggleClass("small");
			if($(this).children().size() >= 1){
				$(this).children("li").children(".total").css("display","inline-block");
			}
			var poi = $(ui.item).children(".shadowbox").children(".poi");
			var name = ($(poi).find("h2").text());
			var price = ($(poi).find(".price").text());
			add(name, price);
			$(".addRemove").change();
        },
        remove: function (event, ui) {
			var poi = $(ui.item).children(".shadowbox").children(".poi");
			var name = ($(poi).find("h2").text());
			var price = ($(poi).find(".price").text());
			remove(name);
            poi.toggleClass("small");
			$(".addRemove").change();
        },
    });
    $(".destination").disableSelection();
	$('.deals .shadowbox .poi').addClass('small');
    $('#dealsbtn').click(function () {
        $('.dealbox').toggleClass('slidein');
	        if (!$('.dealbox').hasClass('slidein')) {
            $('html, body').animate({
                scrollTop: $('.dealbox').offset().top
            }, 500);
        }
    });
    $('#makebtn').click(function () {
 	 	$('.makeplan').toggleClass('slidein');
		if (!$('.makeplan').hasClass('slidein')) {
            $('html, body').animate({
                scrollTop: $('.makeplan').offset().top
            }, 500);
        }
    });
	$("#clear").click(function () {
		if($(".destination").children().size() > 0){
			if (confirm("Are you sure you want to clear the cart?") == true) {
			  $(".destination").children().each(function () {
				  $(this).children(".shadowbox").children(".poi").removeClass("small");
				  $(this).insertAfter($(".showcase").children().last())
			  });
			  $(".destination").trigger("sortupdate");
			  $(".showcase").trigger("sortupdate");
			  clear();
			}
		}		
	});
	
	
	$.simpleWeather({
        location: 'Rome, Italy',
        woeid: '',
        unit: 'f',
        success: weather,
		error: function (error) {
            $("#weather").html('<p>' + error + '</p>');
        }
    });
	
$(document).on("change", ".addRemove", function () {
	if($(this).parent(".poi").hasClass("small")){
		$(this).removeClass("fa-plus fa-plus-circle fa-times-circle");
 	 	$(this).addClass("fa-times");
	}else {
		$(this).removeClass("fa-times fa-times-circle fa-plus-circle");
		$(this).addClass("fa-plus");
	}
}).on("mouseenter", ".addRemove", function () {
	if($(this).parent(".poi").hasClass("small")){
		$(this).removeClass("fa-times");
 	 	$(this).addClass("fa-times-circle");
	}else {
		$(this).removeClass("fa-plus");
 	 	$(this).addClass("fa-plus-circle");
	}
}).on(" mouseleave", ".addRemove", function () {
	if($(this).parent(".poi").hasClass("small")){
		$(this).removeClass("fa-times-circle");
 	 	$(this).addClass("fa-times");
	}else {
		$(this).removeClass("fa-plus-circle");
 	 	$(this).addClass("fa-plus");
	}
}).on("click", ".addRemove", function () {
	 if($(this).parent(".poi").hasClass("small")){
		// console.log($(this).parent().find("h2").html());
	remove($(this).parent().find("h2").html());	
		$(".addRemove").change();
	$(".destination").trigger("sortupdate");
	 $(".showcase").trigger("sortupdate");
	 }else {
	
		var li =  $(this).parent(".poi").parent(".shadowbox").parent("li");
		$(li).appendTo($(".destination"));
		
		 $(li).children(".shadowbox").children(".poi").toggleClass("small");
			
			var poi = $(li).children(".shadowbox").children(".poi");
			var name = ($(poi).find("h2").text());
			var price = ($(poi).find(".price").text());
			add(name, price);
			$(".addRemove").change();
	
	 }
});

$(".addDeal").click(function(e) {
		if($(".destination").children().size() > 0){
			if (confirm("Are you sure this will clear your cart?") == true) {
			  $(".destination").children().each(function () {
				  $(this).children(".shadowbox").children(".poi").removeClass("small");
				  $(this).insertAfter($(".showcase").children().last())
			  });
			  $(".destination").trigger("sortupdate");
			  $(".showcase").trigger("sortupdate");
			  clear();
			}
		}		
		
    var dealpoi = $(this).closest(".poi");
	var dname = ($(dealpoi).find("h2").text());
	var dprice = ($(dealpoi).find(".savings").text());
    $(dealpoi).children().find("ol li").each(function() {
        var dest = $(this).text();
        $(".showcase").children().each(function() {
            var poi = $(this).children(".shadowbox").children(".poi");
            var name = ($(poi).find("h2").text());
            var price = ($(poi).find(".price").text());
            //if its the right poi
            if (name.length > 0 && name.indexOf(dest) > -1) {
                poi.addClass("small");
                $(this).appendTo($(".destination"));
                add(name, price);
                $(".addRemove").change();
                $(".destination, .showcase").trigger("sortupdate");
            }
        });
    });
	add(dname, "-" + dprice);
	updateCosts();
});

  
  
$("#checkout").click(function(e) {
    $(".checkoutinfo").toggleClass("checkoutslideRight");
	$(".checkoutinfo").toggleClass("checkoutNorm");
});
});


$(".submitOrder").click(function(e) {
  if(check_form()){
	var now = new Date();
	var start = new Date(now.getFullYear(), 0, 0);
	var diff = now - start;
	
	//86400000 is number of ms in a day
	var day = Math.floor(diff / 86400000);
	var mstag = now.getMilliseconds() % 1000;
	var orderNum = day + mstag;
	
	var rem = "Your order #" + orderNum + " has been recieved.";
	$(this).parent().siblings(".orderRem").text(rem);
	clear_form();
  }
});


  $(document).on("change", ".options .dragignore", function() {
	var poi = $(this).closest(".poi");//().find(".poi");
	 
	 //Get from room type 
	 var cpn  = parseInt(poi.find("[name='perd']").val());
	 //Get from number
	 var nights =  parseInt(poi.find("[name='numd']").val());
	 var cost = cpn*nights;
	 
	 poi.children().find(".price").text("$" + cost).trigger("change");



			var name = ($(poi).find("h2").text());
			var price = ($(poi).find(".price").text());
			updatePrice(name,price);
			
	 console.log(cpn*nights);
  });


function check_form(){
    var $blankFields = $('form input').filter(function () {
        return $.trim($(this).val()) === "";
    });
    if ($blankFields.length) {
		var errors = "Please enter a value for: \n       ";
        $blankFields.each(function () {
            errors +=  $(this).attr('name') + "\n       ";
        });
        alert(errors);
        return false;
    }
    return true;
}


function clear_form(){
   $('form input, form textarea').each(function () {
		$(this).val("");
   });
}