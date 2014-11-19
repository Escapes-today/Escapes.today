  $('#sum').click(updateCosts());

  $('#adb').click(function () {
      add("Roman Collesum Tour", "$39.99");
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
      $('table .space').before('<tr class="dest"><td>' + dest + '</td><td>' + price + '</td></tr>');
      updateCosts();
  };


  function remove(dest) {
      $($('table .dest').children()).each(function () {
          if ($(this).length > 0 && $(this).text().indexOf(dest) > -1) {
             $(this).parents('tr').remove();
          }
      });
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
  