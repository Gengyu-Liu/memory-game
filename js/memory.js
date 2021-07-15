	function startMemorySpiel(itemimages){
		
		let numClick = 0;		//Anzahl des Klickes auf jeder Round, maximum 2	
		let num = -1;			//index for das erste ausgewählte Bild
		let numFertig = 0; 		//wie viele Bilder schon fertig sind
		let levelNumber = 1; 	//welche level, beginnt von 1
		let seconds = 0; //second timer 		
		const images = itemimages.slice(0,itemimages.length - 3);	//alle bilder und namen
		let bgimg = itemimages[itemimages.length - 2]["img"]; 	//background img src
		let winimg = itemimages[itemimages.length - 1]["img"];		//win img
		let idTIme = 0;	//id für count up timer
		let totalLevelNum = 3;
		//Einstellungen vor dem Beginn
		$('#startSeite').hide();
		$('#game').show();
		
		$('#win').empty().append('<img src="'+winimg+'">');
		
		$('#nextlevel').off('click').on('click',function(){ //entfern vorheriges Event und dann neu Event hinzufügen				
			idTime = startLevel(levelNumber);				
		}).trigger('click');	
		
		$('#close').off('click').on('click',function(){ //entfern vorheriges Event und dann neu Event hinzufügen				
			clearInterval(idTime);	
			$('#game').hide();
			$('#startSeite').show();
			$('#menu').hide();
			$('#time').hide();
		});
		
		function startLevel(levelNum){//beginn eines level
			
			$('#allelevel').empty();
			$('#menu').hide();
			$('#game').empty(); //leeren des griditems	
			
			$('#minute').text('00');
			$('#sekunde').text('00');
			
			numFertig = 0;//reset Anzahl fertiger Bilder 
			seconds = 0;//reset time
			
			let imagesCopy = images;
			let imageArray = imagesCopy.sort(() => 0.5 - Math.random())
			.slice(0, 4 + 2 * (levelNum - 1));	//get n random values from array images 
			
			imageArray = $.merge(imageArray,imageArray);
			imageArray.sort(function(a,b){return 0.5 - Math.random()}); //randomize(shuffle) all the images
			
			let id = showTime();//id von window.setInterval
			$('#time').show();
			
			$.each(imageArray,function(index){
				let divitem = $('<div></div>').addClass('griditem').appendTo('#game');
				let divfront = $('<div></div>').addClass('front').appendTo(divitem);
				let divback = $('<div></div>').addClass('back').appendTo(divitem);
				
				$('<img>').attr("src",imageArray[index].img).appendTo(divfront);
				$('<img>').attr("src",bgimg).appendTo(divback)
				.mouseover(function(){//cursor --> pointer beim mouse darüber
					$(this).css('cursor','pointer');
				})
				.on('click',function(event){
					if(event.detail > 1)
						return; //if double click --> one click
					else
						showAndCompare(divitem,index,imageArray,id);
				});	
				
			});
			showAllHideAll(1300);//Am anfang alle Bilder kurz zeigen
			return id;
			
		}
		function showAndCompare(item,index,imageArray,id){		//zeig und vergleich zwei ausgewählte Bilder	
			if(numClick < 2){//gleichzeitig dürfen nur 2 Bilder angezeigt
				numClick++;						
				item.addClass('flip');//zeig die vorderSeite an
				if(numClick == 1){
					num = index;//welches Element angeklick wurde
				}
				else if(numClick == 2){
					numClick = 0;	//reset maximum Klick Anzahl
					let $cache = {num1:num, num2:index};	//erstes und zweites angeklickte Elemente zu speichern
					if(!(imageArray[$cache["num1"]].name === imageArray[$cache["num2"]].name)){//Abfrage ob zwei Bilder übereinstimmen
						bilderFlip(item,$cache["num1"],300);//nicht überstimmt-->rückseite zeigen
					}
					else{//zwei Bilder überstimmen
						numFertig += 2;
						if(numFertig != imageArray.length){//nicht das Ende eines Levels
							bilderHide(item,$cache["num1"],600);//überstimmt-->komplett verbergen	
						}
						else{		//am Ende einel levels
							levelEnd(id);
						}
					}
				}
			}
		}
		function showAllHideAll(time){//Am anfang des Spiel ein mal kurz alle Bilder zeigen und dann verbergen
			$('.griditem').queue(function(){
				$(this).addClass('flip').dequeue();
				})//vorderseiten anzeigen
				.delay(time)
				.queue(function(){
					$(this).removeClass('flip').dequeue();
				});//rückseite anzeigen	
		}
		
		function showTime(){//zeig count up timer an, Variable seconds wird benutzt
			let isPause = false;
			let id = setInterval( function(){
				if(!isPause){
					$("#sekunde").html(pad(++seconds%60));
					$("#minute").html(pad(parseInt(seconds/60,10)));
				}
			}, 1000);
			function pad(val) { return val > 9 ? val : "0" + val; }
			$('#start').fadeTo('fast',0.2).click(function(){ 
				isPause = false;
				$(this).fadeTo('fast',0.2);
				$('#pause').fadeTo('fast',1);
				$('.griditem').children().show();//alle kindElemente zeigen, um klick des Bildes zu aktivieren
			});
			$('#pause').click(function(){ 
				isPause = true;
				$(this).fadeTo('fast',0.2);
				$('#start').fadeTo('fast',1);
				$('.griditem').children().hide();//alle kindElemente verbergen, um klick des Bildes zu deaktivieren
			});
			return id;
		}
		
		function bilderFlip(item,num,time){	//flip den ausgewählten Bilder wenn die zwei Bilder nicht übereinstimmen
			item.delay(time).queue(function(){
				$(this).removeClass('flip').dequeue();
			});	
			$('.griditem').eq(num).delay(time).queue(function(){
				$(this).removeClass('flip').dequeue();
			});
		}
		
		function bilderHide(item,num,time){	//flip den ausgewählten Bilder wenn die zwei Bilder übereinstimmen
		//behalt den Platz beim hidden nach delay
			item.delay(time).queue(function(){
				$(this).css('visibility','hidden').dequeue();
			});	
			$('.griditem').eq(num).delay(time).queue(function(){
				$(this).css('visibility','hidden').dequeue();
			});
			
		}
		
		function levelEnd(id){	//Am Ende des Spiel ein mal kurz alle Bilder zeigen, nächster level button, zeit und win gif zeigen
			
			clearInterval(id);	//stop count up timer			
			
			$('#time').hide();	//count up timer verbergen 
			
			
		
			
			$('.griditem').css('visibility','visible');	//alle Bilder nochmal zeigen
			$('#zeitlevel').html('<b>Du hast in '+seconds+' Sekunden Level '+levelNumber+ ' geschafft</b>');	
			
			levelNumber++;//level number + 1 --> nächstes Level
			if(levelNumber > totalLevelNum) {//das Ende von letze Level(wenn alle level fertig sind)
				levelNumber = 1;
				$('#allelevel').html('<b>Alle Level geschafft!</b>');	
			}
			
			
			$('#nextlevel').text('Level ' + levelNumber);
			
			$('#menu').show();
			$('#win').show();
			

		}
		
	}
