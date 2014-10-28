//We are using $(window).load here because we want to wait until the images are loaded
$(window).load(function(){
	//for each description div...
	$('div.description').each(function(){
		//...set the opacity to 0...
		$(this).css('opacity', 0);
		//...find the horiz padding to ensure fit into parent
		var padd = $(this).innerWidth()-$(this).width();
		//..set width same as the image minus the padding...
		$(this).css('width', $(this).siblings('img').width()- padd );		
		//...get the parent (the wrapper) and set it's width same as the image width... '
		$(this).parent().css('width', $(this).siblings('img').width());
		//...set the display to block
		$(this).css('display', 'block');
	});

	$('div.wrapper').hover(function(){
		//when mouse hover over the wrapper div
		//get it's children elements with class description '
		//and show it using fadeTo
		$(this).children('.description').stop().fadeTo(500, 0.7);
	},function(){
		//when mouse out of the wrapper div
		//use fadeTo to hide the div
		$(this).children('.description').stop().fadeTo(500, 0);
	});
});
