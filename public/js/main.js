jQuery(function($) {'use strict',

	
	// all Parallax Section
	$(window).load(function(){'use strict',
		$("#services").parallax("50%", 0.3);
		$("#clients").parallax("50%", 0.3);
	});
	
	// portfolio filter
	$(window).load(function(){'use strict',
		$portfolio_selectors = $('.portfolio-filter >li>a');
		if($portfolio_selectors!='undefined'){
			$portfolio = $('.portfolio-items');
			$portfolio.isotope({
				itemSelector : '.col-sm-3',
				layoutMode : 'fitRows'
			});
			
			$portfolio_selectors.on('click', function(){
				$portfolio_selectors.removeClass('active');
				$(this).addClass('active');
				var selector = $(this).attr('data-filter');
				$portfolio.isotope({ filter: selector });
				return false;
			});
		}
	});
	
	//Pretty Photo
	 $("a[data-gallery^='prettyPhoto']").prettyPhoto({
	  social_tools: false
	 });
	// Navigation Scroll
	$(window).scroll(function(event) {
		Scroll();
	});

	$('.navbar-collapse ul li a').click(function() {  
		$('html, body').animate({scrollTop: $(this.hash).offset().top - 79}, 1000);
		return false;
	});

});

