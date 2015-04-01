  $('#sum').click(updateCosts());

  $('#adb').click(function () {
      add("Roman Collesum Tour " + (Math.random() * 1000).toFixed(0), "$" + (Math.random() * 1000).toFixed(2));
  });
  $('#rem').click(function () {
      $($('table .dest').children()).each(function () {
          if ($(this).text().length > 0 && $(this).text().indexOf("Roman Collesum Tour") > -1) {
              $(this).parent().remove();
          }
      });
      updateCosts();

  });

  function add(dest, priceText) {
      if (priceText.indexOf("-") != 0) {
          var prices = priceText.split("-");
          price = prices[prices.length - 1].trim();
          if (price.indexOf(".") == -1) {
              price += ".00";
          } else if (price.indexOf(".") == price.length - 2) {
              price += "0";
          }
      } else {
          price = priceText;
      }
      $('table .space').before('<tr class="dest"><td>' + dest + '</td><td>' + price + '</td><td><i class="removeitem fa fa-times"></i></td></tr>');
      updateCosts();
  };

  function updatePrice(dest, price) {
      $($('table .dest').children()).each(function () {
          if ($(this).length > 0 && $(this).text().indexOf(dest) > -1) {
              $(this).siblings("td").first().text(price);
          }
      });

      updateCosts();
  }


  $(document).on("click", ".removeitem", function () {
      remove($(this).parents("tr").children().first().text());
  }).on("mouseenter mouseleave", ".removeitem", function () {
      $(this).toggleClass("fa-times fa-times-circle")
  });

  function remove(dest) {
      //Remove from map
      remPOIMapPointByName(dest);
      //Remove name in table
      $($('table .dest').children()).each(function () {
          if ($(this).length > 0 && $(this).text().indexOf(dest) > -1) {
              // console.log($(this).parents('tr'));
              $(this).parents('tr').remove();
          }
      });

      $(".destination").children().each(function () {
          var poi = $(this).children(".shadowbox").children(".poi");
          var name = ($(poi).find("h2").text());

          //if its the right poi
          if (name.length > 0 && name.indexOf(dest) > -1) {
              poi.removeClass("preview");
              if (poi.hasClass("flight")) {
                  $(this).appendTo($(".flights"));

              } else {
                  $(this).appendTo($(".showcase"));
              }
          }
      });

      $(".destination").trigger("sortupdate");
      $(".showcase").trigger("sortupdate");
      $(".flights").trigger("sortupdate");
      setupScroll();
      updateCosts();
  }

  function updateCosts() {
      checkDeal();
      var cost = 0;
      $($('table .dest').children()).each(function () {
          //if cost
          if ($(this).text().length > 0 && $(this).text().indexOf("$") > -1) {
              var poicost = parseFloat($(this).html().replace("$", ""));
              cost += poicost;

              if (poicost < 0) {
                  $(this).css("color", "red");
              }
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

  function checkDeal() {
      var pkg = false;
      var deals = [];
      var trOfPkg;
      $($('table .dest').children()).each(function () {
          //If it contains a package
          if ($(this).text().length > 0 && $(this).text().indexOf("Package") > -1) {
              pkg = true;
              trOfPkg = $(this).parent();
              var pname = $(this).text();
              $(".deals").find("h2").each(function (index, element) {
                  if ($(this).text().length > 0 && $(this).text().indexOf(pname) > -1) {
                      var dealpoi = $(this).closest(".poi");
                      var dname = $(this);
                      $(dealpoi).children().find("ol li").each(function () {
                          deals.push($(this).text());
                      });
                  }
              });
          }
      });
      if (pkg) {
          var buypois = [];
          $($('table .dest').not(':last').find("td:first")).each(function () {
              buypois.push($(this).text());
          });
          if (deals.sort().join(',') === buypois.sort().join(',')) {
              // console.log("a ok");
          } else {
              // console.log("not ok");
              $(trOfPkg).remove();
          }
      }
  }

  function clear() {
      $($('table .dest td:first-child')).each(function () {
          remove($(this).text());
          remPOIMapPointByName($(this).text());
      });
      updateCosts();
  }