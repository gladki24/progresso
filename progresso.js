(function ($) {
	
	var element = function(tag){
		this.position = $(tag).offset().top;
		this.text = $(tag).text();
		this.nextPosition = 0;
		this.id = this.text.replace(/ /g,'').toLowerCase();
		this.height = 0;
	}

	/*var styleObject = function(custom){
		this.barColor = custom.barColor;
		this.activeBarColor = custom.activeBarColor;
	}*/

	$.progresso = function progresso(tag,custom){
		var things = mapElement(tag);
		prependToDocument(things);
		//if(custom)var style = new styleObject(custom);

		$(window).scroll(function(){
			progressLineHeight(2);	
			things = mapElement(tag);
			var scrollTop = $(this).scrollTop();
			$(things).each(function(index){
				if(things[index].height<0){
					$('#' + things[index].id).css('width', 0);
				}

				else if(things[index].height>0 && things[index].height<100){
					$('#' + things[index].id).css({
						'width':things[index].height+'%',
						'background-color':/*style.barColor||*/'#88D498'
					});
				}

				else if(things[index].height>100){
					$('#' + things[index].id).css({
						'width':'100%',
						'background-color':/*style.activeBarColor||*/'#1A936F'
					});
				}

			});
		});

		$(window).resize(things,function(){
			things = mapElement(tag);
		});

		$('.progress-elements').click(function(){
			var id = "#" + $(this).text().replace(/ /g,'').toLowerCase() + "-link";
			$("html, body").animate({ scrollTop: $(id).offset().top+3 }, 1000);
		})
	}

	function mapElement(tag){
		var tagArray = $(tag).toArray();
		var elementArray = jQuery.map(tagArray, function(tag){
			return new element($(tag));
		});

		$(elementArray).each(function(index){

			$(tagArray[index]).attr('id',elementArray[index].id+'-link');

			if(index<elementArray.length-1){
				elementArray[index].nextPosition = elementArray[index+1].position;
				elementArray[index].height = Math.ceil((($(document).scrollTop() - elementArray[index].position)/(elementArray[index].nextPosition-elementArray[index].position))*100);
			}

			else{
				if($('footer').length){
					elementArray[index].nextPosition = $('footer').offset().top;
					elementArray[index].height = Math.ceil((($(document).scrollTop() - elementArray[index].position)/($('footer').offset().top-elementArray[index].position))*100);
				}

				else if($('#footer').length){
					elementArray[index].nextPosition = $('#footer').offset().top;
					elementArray[index].height = Math.ceil((($(document).scrollTop() - elementArray[index].position)/($('#footer').offset().top-elementArray[index].position))*100);
				}

				else{
					elementArray[index].nextPosition = $(document).height();
					elementArray[index].height = Math.ceil((($(document).scrollTop() - elementArray[index].position)/($(document).height()-elementArray[index].position))*100);
				}
			}
		});

		return elementArray;
	}

	function prependToDocument(elements){
		var widthElement = ((1/elements.length)*100)+'%';

		$('head').append('<link rel="stylesheet" type="text/css" href="style.css">');
		$('body').append('<div id="progress-box"></div>');
		$('body').append('<div id="back-box"></div>');

		$(elements).each(function(index){
			$('#progress-box').append('<div class="progress-elements">' + elements[index].text + '</div>');
			$('#back-box').prepend('<div class="box-bar"><div class="bar" id=' + elements[index].id + '></div></div>');
		});

		$('#progress-box .progress-elements').css('width',widthElement);
		$('#back-box .box-bar').css('width',widthElement);

	}

	function progressLineHeight(height){
		var barHeight = $('#progress-box .progress-elements').css('height');
		barHeight = parseInt(barHeight.slice(0,barHeight.indexOf('px'))) + (height || 1);
		$('#back-box').css('height',barHeight+'px');
	}

}(jQuery));