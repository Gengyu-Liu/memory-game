	$(function(){
		
		let itemimages = -1; //images in one item
		
		/*einstellung für das spiel*/
		
		$('#time').hide();
		$('#menu').hide();
		
		$.each(memoryItems,function(i){
			$('#play').before('<button id="'+memoryItems[i].title+'">' +memoryItems[i].title+ '</button>');
			$('#' + memoryItems[i].title).click(function(){
				ladeImages(i);
			});		

		});
		$('#' + memoryItems[0].title).trigger('click');//beginnt von erstes item
			
		$('#play').click(function(){		//submit the selected item and begin the game

			if(itemimages != -1)	//no selected item 
				startMemorySpiel(itemimages);
			else //select item from function ladeImages
				alert('select an item at first');
		});
			
		$('#zuStart').on('click',function(){	
			$('#game').hide();
			$('#startSeite').show();
			$('#menu').hide();
		});	

		function ladeImages( index ){
			
			itemimages = memoryItems[index].dataName;		//marioimages
			
			$('#gallerie').empty();		//leer always content
			$.each(itemimages,function(i){		//für jden index aus mario.txt
				let bild = itemimages[i].img;  
				$('<img>').attr('src',bild).appendTo('#gallerie').hide().fadeIn();
						
			});
		}

	})