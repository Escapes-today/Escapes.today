$(function () {
    $(".showcase").sortable({
        connectWith: ".destination",
        containment: "#products",
        cancel: ".addRemove, .dragignore, .dragignoreDefault",
        scroll: true,
        start: function () {
            $(".miniCart").addClass("open");
            $(".locations").addClass('shiftLocations');
        },
        receive: function (event, ui) {
            var poi = $(ui.item).children(".shadowbox").children(".poi");
            if (poi.hasClass("flight")) {
                var name = ($(poi).find("h2").text());
                $(ui.item).appendTo($(".flights"));
                $(".addRemove").change();
                $(".destination, .showcase, .flights").trigger("sortupdate");
                setupScroll();
            }
        }
    });
    $(".flights").sortable({
        connectWith: ".destination",
        containment: "#products",
        cancel: ".addRemove, .dragignore, .dragignoreDefault",
        scroll: true,
        start: function (event, ui) {
            var poi = $(ui.item).children(".shadowbox").children(".poi");
            //poi.removeClass("small");
            //poi.find(".cover").removeClass("max");
            $(".miniCart").addClass("open");
            $(".locations").addClass('shiftLocations');
        },
        remove: function (event, ui) {
            var poi = $(ui.item).children(".shadowbox").children(".poi");
            //poi.removeClass("small");
        }
    });
    //Slide out the makeplan div when user drags a POI
    $(".showcase, .flights").on("click, mousedown", "li", function (e) {
        //If the target click is not going to an interactive area 
        if ($(e.target).parents('.options').length <= 0) {
            //And the it is interactive
            if ($(this).hasClass("dragignoreDefault")) {
                //Alert the user to not add to cart
                interactiveError.dialog("open");
            }
        }
    });
    $(".showcase").disableSelection();
    $(".destination").sortable({
        connectWith: ".showcase, .flights",
        containment: "#products",
        scroll: true,
        cancel: ".addRemove, .dragignore",
        receive: function (event, ui) {
            $(ui.item).children(".shadowbox").children(".poi").toggleClass("preview");
            if ($(this).children().size() >= 1) {
                $(this).children("li").children(".total").css("display", "inline-block");
            }
            var poi = $(ui.item).children(".shadowbox").children(".poi");
            var name = ($(poi).find("h2").text());
            var price = ($(poi).find(".price").text());
            add(name, price);
            $(".addRemove").change();
            $('.destination').slimScroll({
                height: '457px',
                size: '8px',
                alwaysVisible: true,
                color: '#1A3275',
                railOpacity: 0.8
            });
            $('.destination').css("height", "457px");
        },
        remove: function (event, ui) {
            var poi = $(ui.item).children(".shadowbox").children(".poi");
            var name = ($(poi).find("h2").text());
            var price = ($(poi).find(".price").text());
            remove(name);
            poi.toggleClass("preview");
            $(".addRemove").change();
        },
        start: function () {
            $(this).css("overflow-x", "visible");
            $(this).css("overflow-y", "visible");
            $('.destination').slimScroll({
                destroy: true
            });
            $('.destination, .slimScrollDiv').css("height", "457px");
        },
        stop: function () {
            $(this).css("overflow-x", "hidden");
            $('.destination').slimScroll({
                height: '457px',
                size: '8px',
                alwaysVisible: true,
                color: '#1A3275',
                railOpacity: 0.8
            });
            $('.destination, .slimScrollDiv').css("height", "457px");
        },
        sortupdate: function (event, ui) {
            // console.log("dsfa");	
        }
    });

    //$(".destination").disableSelection();
    $('.deals .shadowbox .poi').addClass('small');
    $('#dealsbtn').click(function () {
        $('.dealbox').toggleClass('slidein');
        if (!$('.dealbox').hasClass('slidein')) {
            $('html, body').animate({
                scrollTop: $('.dealbox').offset().top
            }, 500);
        }
    });

    $('.flights .shadowbox .poi').addClass('flight');
    $('#flightsbtn').click(function () {
        $('.flightsbox').toggleClass('slidein');
        if (!$('.flightsbox').hasClass('slidein')) {
            $('html, body').animate({
                scrollTop: $('.flightsbox').offset().top
            }, 500);
        }
    });

    $("#clear").click(function () {
        if ($(".destination").children().size() > 0) {
            clearDialog(null, null);
        }
    });

    $(document).on("change", ".addRemove", function () {
        if ($(this).parent(".poi").hasClass("preview")) {
            $(this).removeClass("fa-plus fa-plus-circle fa-times-circle");
            $(this).addClass("fa-times");
        } else {
            $(this).removeClass("fa-times fa-times-circle fa-plus-circle");
            $(this).addClass("fa-plus");
        }
    }).on("mouseenter", ".addRemove", function () {
        if ($(this).parent(".poi").hasClass("preview")) {
            $(this).removeClass("fa-times");
            $(this).addClass("fa-times-circle");
        } else {
            $(this).removeClass("fa-plus");
            $(this).addClass("fa-plus-circle");
        }
    }).on(" mouseleave", ".addRemove", function () {
        if ($(this).parent(".poi").hasClass("preview")) {
            $(this).removeClass("fa-times-circle");
            $(this).addClass("fa-times");
        } else {
            $(this).removeClass("fa-plus-circle");
            $(this).addClass("fa-plus");
        }
    }).on("click", ".addRemove", function () {
        if ($(this).parent(".poi").hasClass("preview")) {
            // console.log($(this).parent().find("h2").html());
            remove($(this).parent().find("h2").html());
            $(".addRemove").change();
            $(".destination").trigger("sortupdate");
            $(".showcase").trigger("sortupdate");
            setupScroll();
        } else {

            var li = $(this).parent(".poi").parent(".shadowbox").parent("li");
            //If it is unchanged dont add to plan
            if (li.hasClass("dragignoreDefault")) {
                return;
            }
            $(li).appendTo($(".destination"));

            $(li).children(".shadowbox").children(".poi").toggleClass("preview");

            var poi = $(li).children(".shadowbox").children(".poi");
            var name = ($(poi).find("h2").text());
            var price = ($(poi).find(".price").text());
            add(name, price);
            setupScroll();
            $(".addRemove").change();

            $(".miniCart").addClass("open");
            $(".locations").addClass('shiftLocations');
        }
    });

    $(".addDeal").click(function (e) {
        if ($(".destination").children().size() > 0) {
            clearDialog(addDeal, this);
        } else {
            addDeal(this);
        }
    });

    function addDeal(e) {
        var dealpoi = $(e).closest(".poi");
        var dname = ($(dealpoi).find("h2").text());
        var dprice = ($(dealpoi).find(".savings").text());
        $(dealpoi).children().find("ol li").each(function () {
            var dest = $(this).text();
            $(".showcase").children().each(function () {
                var poi = $(this).children(".shadowbox").children(".poi");
                var name = ($(poi).find("h2").text());
                var price = ($(poi).find(".price").text());
                //if its the right poi
                if (name.length > 0 && name.indexOf(dest) > -1) {
                    poi.addClass("preview");
                    $(this).appendTo($(".destination"));
                    add(name, price);
                    $(".addRemove").change();
                    $(".destination, .showcase").trigger("sortupdate");
                    setupScroll();
                    $(".miniCart").addClass("open");
                    $(".locations").addClass('shiftLocations');
                }
            });
        });
        add(dname, "-" + dprice);
        updateCosts();
    }

    //Helper method to call clear dialog and callback a function with
    //params in e
    function clearDialog(callback, e) {
        clearCart.dialog("option", "buttons", {
            "Yes": function () {
                clear();
                $(".fa-times").trigger("change");
                $(this).dialog("close");
                callback(e);
            },
                "Cancel": function () {
                $(this).dialog("close");
            }
        }).dialog("open");
    }

    $("#openPlanBtn").click(function (e) {
        //Finalize plan button
        //Open the first modal dialog
        dialog.dialog("open");
    });


    $("#checkout").click(function (e) {
        $(".checkoutinfo").toggleClass("slideRight");
        $(".checkoutinfo").toggleClass("checkoutNorm");
    });
});

$(document).on("change", ".options .dragignore", function () {
    var poi = $(this).closest(".poi"); //().find(".poi");

    //Remove dragignore class when iteractive object is changed
    li = $(poi).closest("li");
    li.removeClass("dragignoreDefault");
    //Get from room type 
    var cpn = parseInt(poi.find("[name='perd']").val());
    //Get from number
    var nights = parseInt(poi.find("[name='numd']").val());
    var cost = cpn * nights;

    poi.children().find(".price").text("$" + cost).trigger("change");

    var name = ($(poi).find("h2").text());
    var price = ($(poi).find(".price").text());
    updatePrice(name, price);
    // console.log(cpn * nights);
});


function check_form() {
    var $blankFields = $('form input').filter(function () {
        return $.trim($(this).val()) === "";
    });
    if ($blankFields.length) {
        var errors = "Please enter a value for: \n       ";
        $blankFields.each(function () {
            errors += $(this).attr('name') + "\n       ";
        });
        alert(errors);
        return false;
    }
    return true;
}


function clear_form() {
    $('form input, form textarea').each(function () {
        $(this).val("");
    });
}

$(function () {
    (function ($) {
        $(document).ready(function () {
            $('#menuToggle').click(function (e) {
                var $parent = $(this).parent('div');
                $parent.toggleClass('open');
                $(".locations").toggleClass('shiftLocations');
                var divState = $parent.hasClass('open') ? 'hide' : 'show';
                $(this).attr('title', divState + ' divigation');
                setTimeout(function () {
                    // console.log('timeout set');
                    $('#menuToggle > span').toggleClass('divClosed').toggleClass('divOpen');
                }, 200);
                e.preventDefault();
            });
        });
    }(jQuery));


    dialog = $("#dialog-finalize").dialog({
        autoOpen: false,
        resizable: false,
        //height: $(window).height() * .9,
        width: $(window).width() * .95,
        height: 'auto',
        modal: true,
        open: function (event, ui) {
            var dests = [];
            $($('table .dest td:first-child')).each(function () {
                dests.push($(this).text());
            });
            setupMap(dests);
            $('.ui-widget-overlay').bind('click', function () {
                // console.log("click");
                $("#dialog-finalize").dialog("close");
            });
            $("body").css('overflow', 'hidden');
        },
        close: function (event, ui) {
            $("body").css('overflow', 'visible');
        },
        buttons: {
            "Check Out": function () {
                if ($(this).children("table").find(".dest").length > 0) {
                    $(checkout).dialog("open");
                } else {
                    $(noItems).dialog("open");
                }
            },
                "Clear Cart": function () {
                $("#clear").trigger("click");
            },
                "Close": function () {
                $(this).dialog("close");
            }
        }
    });

    checkout = $("#dialog-checkout").dialog({
        autoOpen: false,
        resizable: false,
        width: 'auto',
        height: 'auto',
        position: {
            my: 'center',
            at: 'center',
            of: window
        },
        modal: true,
        open: function (event, ui) {
            $('.ui-widget-overlay').bind('click', function () {
                // console.log("click");
                $("#dialog-checkout").dialog("close");
            });
            $("body").css('overflow', 'hidden');
        },
        close: function (event, ui) {
            $("body").css('overflow', 'visible');
        },
        buttons: {
            "Submit Order": function () {

                if (check_form()) {
                    var now = new Date();
                    var start = new Date(now.getFullYear(), 0, 0);
                    var diff = now - start;

                    //86400000 is number of ms in a day
                    var day = Math.floor(diff / 86400000);
                    var mstag = now.getMilliseconds() % 1000;
                    var orderNum = day + mstag;

                    var rem = "Your order #" + orderNum + " has been recieved.";
                    $(this).find(".orderRem").text(rem);
                    clear_form();
                    //$(this).dialog("options", "buttons"
                    //$( this ).dialog( "close" );
                }
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
    interactiveError = $("#dialog-interactiveError").dialog({
        autoOpen: false,
        resizable: false,
        width: 'auto',
        height: 'auto',
        position: {
            my: 'center',
            at: 'center',
            of: window
        },
        modal: true,
        buttons: {
            "Ok": function () {
                $(this).dialog("close");
            }
        }
    }).disableSelection();
    clearCart = $("#dialog-clearCart").dialog({
        autoOpen: false,
        resizable: false,
        width: 'auto',
        height: 'auto',
        position: {
            my: 'center',
            at: 'center',
            of: window
        },
        modal: true,
        buttons: {
            "Yes": function () {
                $(".destination").children().each(function () {
                    $(this).children(".shadowbox").children(".poi").removeClass("preview");
                    $(this).appendTo($(".showcase"))
                });
                $(".destination").trigger("sortupdate");
                $(".showcase").trigger("sortupdate");
                setupScroll();
                clear();
                $(".fa-times").trigger("change");
                $(this).dialog("close");
            },
                "Cancel": function () {
                $(this).dialog("close");
            }
        }
    }).disableSelection();
    noItems = $("#dialog-noItems").dialog({
        autoOpen: false,
        resizable: false,
        width: 'auto',
        height: 'auto',
        position: {
            my: 'center',
            at: 'center',
            of: window
        },
        modal: true,
        buttons: {
            "Okay": function () {
                $(this).dialog("close");
                $(dialog).dialog("close");
            }
        }
    }).disableSelection();
    $("[type=number]").spinner({
        spin: function (event, ui) {
            //Fire old event handler
            $(this).change();
        }
    }).removeAttr("type");
    $("select").selectmenu({
        change: function (event, data) {
            //Set up default value and disable it
            if ($(this).children(".defVal").length) {
                $(this).children(".defVal").attr("disabled", true); // any other selector as you wish
                $(this).selectmenu("refresh");
            }
            //Fire old event handler
            $(this).change();
        },
        open: function (event, ui) {
            $(this).parents(".poi").addClass("lock");
        },
        close: function (event, ui) {
            $(this).parents(".poi").removeClass("lock");
        },
    });
    $(".ui-menu,.ui-selectmenu-button, .ui-spinner").css("font-size", "12px").css("float", "right");
    $(".ui-selectmenu-button").css("width", $(".ui-selectmenu-button").width() + 20);
});

function setupScroll() {
    $('.destination').slimScroll({
        destroy: true
    });
    $('.destination').slimScroll({
        height: '457px',
        size: '8px',
        alwaysVisible: true,
        color: '#1A3275',
        railOpacity: 0.8
    });
    $('.destination, .slimScrollDiv').css("height", "457px");
}