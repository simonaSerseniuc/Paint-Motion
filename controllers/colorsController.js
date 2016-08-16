app.controller("colorsController", function ($scope, $uibModalInstance, items, $location, $anchorScroll, loader ) {

	var currentColorIndex = 0,
		currentShadeIndex = 0,
		onColors = true,
		inController = true,
		foundColorIndex, foundShadeIndex, allColors, currentHandId;

	$scope.colors = [
		{ name:"Red", color:"#F44336", shades: reds},
		{ name:"Pink", color:"#E91E63", shades: pinks},
		{ name:"Purple", color:"#9C27B0", shades: purples},
		{ name:"Deep Purple", color:"#673AB7", shades: deepPurples},
		{ name:"Indigo", color:"#3F51B5", shades: ingigos},
		{ name:"Blue", color:"#2196F3", shades: blues},
		{ name:"Light Blue", color:"#03A9F4", shades: lightBlues},
		{ name:"Cyan", color:"#00BCD4", shades: cyans},
		{ name:"Teal", color:"#009688", shades: teals},
		{ name:"Green", color:"#4CAF50", shades: greens},
		{ name:"Light Green", color:"#8BC34A", shades: lightGreens},
		{ name:"Lime", color:"#CDDC39", shades: limes},
		{ name:"Yellow", color:"#FFEB3B", shades: yellows},
		{ name:"Amber", color:"#FFC107", shades: ambers},
		{ name:"Orange", color:"#FF9800", shades: oranges},
		{ name:"Deep Orange", color:"#FF5722", shades: deepOranges},
		{ name:"Brown", color:"#795548", shades: browns},
		{ name:"Grey", color:"#9E9E9E", shades: greys},
		{ name:"Blue Grey", color:"#607D8B", shades: blueGreys},
		{ name:"Black", color:"#000000", shades: []},
		{ name:"White", color:"#FFFFFF", shades: []}
	];
	$scope.colors[currentColorIndex].selected = true;
	$scope.currentColor = $scope.colors[currentColorIndex];
	$scope.currentShade = $scope.colors[currentColorIndex].shades;
	allColors = $scope.colors
	console.log($scope.colors[currentColorIndex].shades); 

	if(items != null && items != undefined){
		var color = items.color,
			foundColors = false;
		for(var i = 0; i < allColors.length && !foundColors; i++){
			if(allColors[i].color == color){
				foundColorIndex = i;
				foundShadeIndex = null;
				foundColors = true;
			} else{
				var foundShades = false;
				for(var j = 0; j < allColors[i].shades.length && !foundShades; j++){
					if(allColors[i].shades[j].color == color){
						foundColorIndex = i;
						foundShadeIndex = j;
						foundShades = true;
					}
				}
			}
		}		

		if(foundColorIndex){
			$scope.colors[currentColorIndex].selected = false;
			currentColorIndex = foundColorIndex;
			$scope.colors[currentColorIndex].selected = true;
			$scope.currentShade = $scope.colors[currentColorIndex].shades;

			if(foundShadeIndex != null && foundShadeIndex != undefined){				
				currentShadeIndex = foundShadeIndex;
				$scope.colors[currentColorIndex].shades[currentShadeIndex].selected = true;
				$scope.currentColor = $scope.colors[currentColorIndex].shades[currentShadeIndex];
			}else{
				$scope.currentColor = $scope.colors[currentColorIndex];
			}

		}
	}

 	Leap.loop({ enableGestures: true, frameEventName: 'animationFrame'},function(frame){
		if(inController && frame.valid && frame.gestures.length > 0){
			frame.gestures.forEach(function(gesture){
				if (gesture.type === "circle" && gesture.state === "stop" && gesture.pointableIds.length == 1) {
					var handId = gesture.handIds[0]
					if(onColors){
			            if (gesture.normal[2] <= 0) {  // clockwise	             
			                
			                currentHandId = handId;
			                goColorRight();
			            } else { //counter clockwise			                
			                goColorLeft();
			            }
			        }else{
			        	console.log("circling in shades");
			        	if (gesture.normal[2] <= 0) {  //is clockwise?	               
			                currentHandId = handId;
			                console.log("clockwise");
			                goShadesRight();
			            } else {
			                console.log("anticlockwise");
			                goShadesLeft();
			            }
			        }
		        }else if(gesture.type === "swipe" && gesture.state === "stop"){
		        	console.log("selecting shade", gesture);
		        	if(gesture.direction[0] > 0 ){
			      		
				      	console.log("swipe right");
				      	if(onColors){
			                currentHandId = handId;
					      	onColors = false;

					      	if($scope.colors[currentColorIndex].shades.length > 0)
					      		$scope.colors[currentColorIndex].shades[0].selected = true;

					      	console.log($scope.colors[currentColorIndex].name);
					      	console.log($scope.colors[currentColorIndex].shades);
					      	console.log($scope.colors[currentColorIndex].shades[0].selected )
		            	}
				  	} else if(gesture.direction[0] < 0 ){
				    	
				    	console.log("swipe left");
				    	if(!onColors){
			                onColors = true;
			                currentHandId = handId;

			                if($scope.colors[currentColorIndex].shades.length > 0)
			                	$scope.colors[currentColorIndex].shades[currentShadeIndex].selected = false;
			            }
		                
				  	}
		        }	
		    });

			$scope.$apply();
        }

        if(inController){
        	if(frame.hands.length > 0){
				var hand = frame.hands[0],
					sphereRadius = hand.sphereRadius,
					id = hand.id;

				if(id != currentHandId){					
					if(isThumbsUp(sphereRadius, hand)){
						startedWith = id;
						loader.show();

						if(isThumbsUp(sphereRadius, hand) && hand.timeVisible > 3){		
							console.log(sphereRadius, hand);			
							loader.hide();
							selectColor();
						}
						
					}
				}else{
					console.log(id, currentHandId)
				}
			}
        }
	});


	var goColorRight = function(){
		$scope.colors[currentColorIndex].selected = false;
		if(currentColorIndex < $scope.colors.length - 1){
			currentColorIndex ++;
		}else if(currentColorIndex == $scope.colors.length - 1){
			currentColorIndex = 0;
		}
		updateCurrentColor(currentColorIndex);
	};

	var goColorLeft = function(){
		$scope.colors[currentColorIndex].selected = false;
		if(currentColorIndex == 0){
			currentColorIndex = $scope.colors.length - 1;
		}else{
			currentColorIndex --;
		}

		updateCurrentColor(currentColorIndex);
	}

	var goShadesRight = function(){
		var currentShades = $scope.colors[currentColorIndex].shades;

		currentShades[currentShadeIndex].selected = false;
		if(currentShadeIndex < currentShades.length - 1){
			currentShadeIndex ++;
		}else if(currentShadeIndex == currentShades.length - 1){
			currentShadeIndex = 0;
		}

		updateCurrentShade(currentShadeIndex);
	}

	var goShadesLeft = function(){
		var currentShades = $scope.colors[currentColorIndex].shades;
		currentShades[currentShadeIndex].selected = false;

		if(currentShadeIndex == 0){
			currentShadeIndex = currentShades.length - 1;
		}else{
			currentShadeIndex --;
		}

		updateCurrentShade(currentShadeIndex);
	}

	var updateCurrentColor = function(index){
		console.log(index);
		$scope.currentColor = $scope.colors[index];
		$scope.currentShade = $scope.colors[index].shades;

		
		var currentSection = $scope.colors[index].name + "-color";
		scrollTo(currentSection);		
		$scope.colors[index].selected = true;
	}

	var updateCurrentShade = function(index){
		console.log(index, $scope.colors[currentColorIndex].shades.length);
		$scope.colors[currentColorIndex].shades[index].selected = true;
		$scope.currentColor = $scope.currentShade[index];

	}

	var scrollTo = function(toSection) {
		if ($location.hash() !== toSection) {	        
			$location.hash(toSection);

		} else {
			$anchorScroll();
		}
    };

 

	var selectColor =  function () {
		$uibModalInstance.close($scope.currentColor);
		inController = false;
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	var isThumbsUp = function(sphereRadius, hand){
		return sphereRadius > 26 && sphereRadius < 39 && hand.thumb.extended 
			&& !hand.indexFinger.extended && !hand.middleFinger.extended
			&& !hand.pinky.extended && !hand.ringFinger.extended;
	}

});

var reds = [{color:'#FFEBEE'},{color:'#FFCDD2'},{color:'#EF9A9A'},{color:'#E57373'},{color:'#EF5350'},{color:'#F44336'},{color:'#E53935'},{color:'#D32F2F'},{color:'#C62828'},{color:'#B71C1C'},{color:'#FF8A80'},{color:'#FF5252'},{color:'#FF1744'},{color:'#D50000'}];
var pinks = [{color:'#FCE4EC'},{color:'#F8BBD0'},{color:'#F48FB1'},{color:'#F06292'},{color:'#EC407A'},{color:'#E91E63'},{color:'#D81B60'},{color:'#C2185B'},{color:'#AD1457'},{color:'#880E4F'},{color:'#FF80AB'},{color:'#FF4081'},{color:'#F50057'},{color:'#C51162'}];
var purples = [{color:'#F3E5F5'},{color:'#E1BEE7'},{color:'#CE93D8'},{color:'#BA68C8'},{color:'#AB47BC'},{color:'#9C27B0'},{color:'#8E24AA'},{color:'#7B1FA2'},{color:'#6A1B9A'},{color:'#4A148C'},{color:'#EA80FC'},{color:'#E040FB'},{color:'#D500F9'},{color:'#AA00FF'}];
var deepPurples = [{color:'#EDE7F6'},{color:'#D1C4E9'},{color:'#B39DDB'},{color:'#9575CD'},{color:'#7E57C2'},{color:'#673AB7'},{color:'#5E35B1'},{color:'#512DA8'},{color:'#4527A0'},{color:'#311B92'},{color:'#B388FF'},{color:'#7C4DFF'},{color:'#651FFF'}];
var ingigos = [{color:'#E8EAF6'},{color:'#C5CAE9'},{color:'#9FA8DA'},{color:'#7986CB'},{color:'#5C6BC0'},{color:'#3F51B5'},{color:'#3949AB'},{color:'#303F9F'},{color:'#283593'},{color:'#1A237E'},{color:'#8C9EFF'},{color:'#536DFE'},{color:'#3D5AFE'},{color:'#304FFE'}];
var blues = [{color:'#E3F2FD'},{color:'#BBDEFB'},{color:'#90CAF9'},{color:'#64B5F6'},{color:'#42A5F5'},{color:'#2196F3'},{color:'#1E88E5'},{color:'#1976D2'},{color:'#1565C0'},{color:'#0D47A1'},{color:'#82B1FF'},{color:'#448AFF'},{color:'#2979FF'},{color:'#2962FF'}];
var lightBlues = [{color:'#E1F5FE'},{color:'#B3E5FC'},{color:'#81D4FA'},{color:'#4FC3F7'},{color:'#29B6F6'},{color:'#03A9F4'},{color:'#039BE5'},{color:'#0288D1'},{color:'#0277BD'},{color:'#01579B'},{color:'#80D8FF'},{color:'#40C4FF'},{color:'#00B0FF'},{color:'#0091EA'}];
var cyans = [{color:'#E0F7FA'},{color:'#B2EBF2'},{color:'#80DEEA'},{color:'#4DD0E1'},{color:'#26C6DA'},{color:'#00BCD4'},{color:'#00ACC1'},{color:'#0097A7'},{color:'#00838F'},{color:'#006064'},{color:'#84FFFF'},{color:'#18FFFF'},{color:'#00E5FF'},{color:'#00B8D4'}];
var teals = [{color:'#E0F2F1'},{color:'#B2DFDB'},{color:'#80CBC4'},{color:'#4DB6AC'},{color:'#26A69A'},{color:'#009688'},{color:'#00897B'},{color:'#00796B'},{color:'#00695C'},{color:'#004D40'},{color:'#A7FFEB'},{color:'#64FFDA'},{color:'#1DE9B6'},{color:'#00BFA5'}];
var greens = [{color:'#E8F5E9'},{color:'#C8E6C9'},{color:'#A5D6A7'},{color:'#81C784'},{color:'#66BB6A'},{color:'#4CAF50'},{color:'#43A047'},{color:'#388E3C'},{color:'#2E7D32'},{color:'#1B5E20'},{color:'#B9F6CA'},{color:'#69F0AE'},{color:'#00E676'},{color:'#00C853'}];
var lightGreens = [{color:'#F1F8E9'},{color:'#DCEDC8'},{color:'#C5E1A5'},{color:'#AED581'},{color:'#9CCC65'},{color:'#8BC34A'},{color:'#7CB342'},{color:'#689F38'},{color:'#558B2F'},{color:'#33691E'},{color:'#CCFF90'},{color:'#B2FF59'},{color:'#76FF03'},{color:'#64DD17'}];
var limes = [{color:'#F9FBE7'},{color:'#F0F4C3'},{color:'#E6EE9C'},{color:'#DCE775'},{color:'#D4E157'},{color:'#CDDC39'},{color:'#C0CA33'},{color:'#AFB42B'},{color:'#9E9D24'},{color:'#827717'},{color:'#F4FF81'},{color:'#EEFF41'},{color:'#C6FF00'},{color:'#AEEA00'}];
var yellows = [{color:'#FFFDE7'},{color:'#FFF9C4'},{color:'#FFF59D'},{color:'#FFF176'},{color:'#FFEE58'},{color:'#FFEB3B'},{color:'#FDD835'},{color:'#FBC02D'},{color:'#F9A825'},{color:'#F57F17'},{color:'#FFFF8D'},{color:'#FFFF00'},{color:'#FFEA00'},{color:'#FFD600'}];
var ambers = [{color:'#FFF8E1'},{color:'#FFECB3'},{color:'#FFE082'},{color:'#FFD54F'},{color:'#FFCA28'},{color:'#FFC107'},{color:'#FFB300'},{color:'#FFA000'},{color:'#FF8F00'},{color:'#FF6F00'},{color:'#FFE57F'},{color:'#FFD740'},{color:'#FFC400'},{color:'#FFAB00'}];
var oranges = [{color:'#FFF3E0'},{color:'#FFE0B2'},{color:'#FFCC80'},{color:'#FFB74D'},{color:'#FFA726'},{color:'#FF9800'},{color:'#FB8C00'},{color:'#F57C00'},{color:'#EF6C00'},{color:'#E65100'},{color:'#FFD180'},{color:'#FFAB40'},{color:'#FF9100'},{color:'#FF6D00'}];
var deepOranges = [{color:'#FBE9E7'},{color:'#FFCCBC'},{color:'#FFAB91'},{color:'#FF8A65'},{color:'#FF7043'},{color:'#FF5722'},{color:'#F4511E'},{color:'#E64A19'},{color:'#D84315'},{color:'#BF360C'},{color:'#FF9E80'},{color:'#FF6E40'},{color:'#FF3D00'},{color:'#DD2C00'}];
var browns = [{color:'#EFEBE9'},{color:'#D7CCC8'},{color:'#BCAAA4'},{color:'#A1887F'},{color:'#8D6E63'},{color:'#795548'},{color:'#6D4C41'},{color:'#5D4037'},{color:'#4E342E'},{color:'#3E2723'}];
var greys= [{color:'#FAFAFA'},{color:'#F5F5F5'},{color:'#EEEEEE'},{color:'#E0E0E0'},{color:'#BDBDBD'},{color:'#9E9E9E'},{color:'#757575'},{color:'#616161'},{color:'#424242'},{color:'#212121'}];
var blueGreys= [{color:'#ECEFF1'},{color:'#CFD8DC'},{color:'#B0BEC5'},{color:'#90A4AE'},{color:'#78909C'},{color:'#607D8B'},{color:'#546E7A'},{color:'#455A64'},{color:'#37474F'},{color:'#263238'}];

