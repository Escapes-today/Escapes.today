  $('#sum').click(updateCosts());

  $('#adb').click(function () {
      add("Roman Collesum Tour " + (Math.random()*1000).toFixed(0), "$" + (Math.random()*1000).toFixed(2) );
  });
  $('#rem').click(function () {
      $($('table .dest').children()).each(function () {
          if ($(this).text().length > 0 && $(this).text().indexOf("Roman Collesum Tour") > -1) {
              $(this).parent().remove();
          }
      });
      updateCosts();

  });

  function add(dest, price) {
      $('table .space').before('<tr class="dest"><td>' + dest + '</td><td>' + price + '</td><td><i class="removeitem fa fa-times"></i></td></tr>');
      updateCosts();
  };
  
   
$(document).on("click", ".removeitem", function () {
 	remove($(this).parents("tr").children().first().text());
}).on("mouseenter mouseleave", ".removeitem", function () {
    $(this).toggleClass("fa-times fa-times-circle")
});

  function remove(dest) {
	  //Remove name in table
      $($('table .dest').children()).each(function () {
          if ($(this).length > 0 && $(this).text().indexOf(dest) > -1) {
			  console.log( $(this).parents('tr'));
             $(this).parents('tr').remove();
          }
      });
	    
	  
	  $(".destination").children().each(function () {
			var poi = $(this).children(".shadowbox").children(".poi");
			var name = ($(poi).find("h2").text());
			
			//if its the right poi
          if (name.length > 0 && name.indexOf(dest) > -1) {
             poi.removeClass("small");
         	$(this).insertAfter($(".showcase").children().last());
          }
          });
	
	
	$(".destination").trigger("sortupdate");
	 $(".showcase").trigger("sortupdate");

		  
      updateCosts();
  }

  function updateCosts() {
      var cost = 0;
      $($('table .dest').children()).each(function () {
          if ($(this).text().length > 0 && $(this).text().indexOf("$") > -1) {
              cost += parseFloat($(this).html().replace("$", ""));
          }
      });
      $('#sub-total').text('$' + (cost).toFixed(2));
      $('#tax').text('$' + (cost * .06).toFixed(2));
      $('#total').text('$' + (cost * 1.06).toFixed(2));

      if ($('table .dest').length == 0) {
          $('table .empty').show();
      } else {
          $('table .empty').hide();
	  }
  }
  
  function clear() { 
  $($('table .dest').children()).each(function () {
      $(this).parents('tr').remove();  
      });
      updateCosts();
  }
  