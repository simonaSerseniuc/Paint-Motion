app.controller("homeController", function ($scope, $rootScope, $uibModal, $log ) {

  var color,
      canvasElement = document.getElementById('drawingCanvas'),
      hoveringCanvas = document.getElementById('hovering'),
      oldCanvas=[],
      freeStyleElements = [],
      drawAvailable = true,
      elements = [], step = -1, touched = false;

  $scope.freeStyle = true;
  $scope.dragElements = false;
  $scope.circle = false;
  $scope.star = false;  
  $scope.square = false;
  $scope.heart = false;
  $scope.baseThickness = 2;

  $scope.startX;
  $scope.startY;

  var stage = new createjs.Stage("drawingCanvas"),
      shape = new createjs.Shape(),
      color, oldX, oldY;

  var hoveringStage = new createjs.Stage("hovering"),
      hoveringShape = new createjs.Shape();

  hoveringStage.autoClear = true;  
  hoveringStage.addChild(hoveringShape);

  stage.enableDOMEvents(true);
  stage.addChild(shape);

  $scope.colorButton = function(){ 
    drawAvailable = false;  
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/colorModal.html',
      controller: 'colorsController',
      size: "lg",
      windowTopClass: "colorsModal",
      resolve: {
        items: function () {
          return $scope.selected;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
      drawAvailable = true;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
      drawAvailable = true;
    });

  } 
  
  var getViewportSize = function() {
      return {
          height: window.innerHeight,
          width:  window.innerWidth
      };
  };

  var init = function(){  
    var //canvas = document.getElementById('drawingCanvas'),
        displayArea = canvasElement.getContext("2d");
        viewportSize = getViewportSize();

    canvasElement.width = viewportSize.width;
    canvasElement.height = viewportSize.height;
    hoveringCanvas.width = viewportSize.width;
    hoveringCanvas.height = viewportSize.height;

    displayArea.fillStyle = "#fff";
    displayArea.fillRect(0, 0, canvasElement.width, canvasElement.height);
  }

  init();

  var getColor = function(){
    if(!$scope.selected){
      return "#000";
    } else{
      return $scope.selected.color;
    }
  }

  
  var oldHandId;
  var i = 0;
  Leap.loop({enableGestures: true, frameEventName: 'animationFrame '}, function(frame){ 
    
    i++;
    if(frame.pointables.length > 0  && drawAvailable){
      if($scope.freeStyle){
        freeStyling(frame, getColor());
      }
      else if($scope.dragElements){          
        var displayArea = hoveringCanvas.getContext('2d'),
            color = getColor(),              
            leftHand = isLeftHand(frame),    
            rightHand = isRightHand(frame),                      
            handRoll = 0,
            pointable, interactionBox, normalizedPosition, x, y, pinch;

        hoveringCanvas.width = hoveringCanvas.width;
        displayArea.strokeStyle = color;        

        if($scope.circle){          
          var size = 50;
      
          if(leftHand){
            displayArea.lineWidth = getDrawingSize(leftHand);
            handRoll = leftHand.roll();
            pointable = leftHand.pointables[0];
            interactionBox = frame.interactionBox;
            normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);
            x = canvasElement.width * normalizedPosition[0];
            y = canvasElement.height * (1 - normalizedPosition[1]);
          
            if(handRoll > 0){
              size = size * handRoll;
            } else {size = size/handRoll * (-1);}

            drawCircle(displayArea, x, y, size); 
          }

          if(rightHand){
            var pinch = rightHand.pinchStrength;

            if(pinch == 1){
              var ctx = canvasElement.getContext('2d');
              ctx.strokeStyle = color;
              ctx.lineWidth = $scope.baseThickness;

              drawCircle(ctx, x, y, size);

              step++;
              if(step < elements.length) elements.length = step;

              elements.push(document.getElementById('drawingCanvas').toDataURL());
                $scope.circle = false;
              }

          }
        } else if($scope.star){
            var length = 30;
            if(leftHand){
              displayArea.lineWidth = $scope.baseThickness;
              handRoll = leftHand.roll();
              pointable = leftHand.pointables[0];
              interactionBox = frame.interactionBox;
              normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);
              x = canvasElement.width * normalizedPosition[0];
              y = canvasElement.height * (1 - normalizedPosition[1]);
              pinch = leftHand.pinchStrength;
              
              if(handRoll > 0){
                length = length * handRoll;
              } else {length = length/handRoll * (-1);}
              
              drawStar(displayArea, x, y, length);              
            }

            if(rightHand){
              var pinch = rightHand.pinchStrength;

              if(pinch == 1){
                var ctx = canvasElement.getContext('2d');
                ctx.strokeStyle = color;
                ctx.lineWidth = $scope.baseThickness;
                ctx.moveTo(x,y);
                drawStar(ctx, x, y, length);
                step++;
                if(step < elements.length) elements.length = step;

                elements.push(document.getElementById('drawingCanvas').toDataURL());
                $scope.star = false;
              }
            }
        }else if($scope.square){
          var length = 50;
            if(leftHand){
              displayArea.lineWidth = $scope.baseThickness;
              handRoll = leftHand.roll();
              pointable = leftHand.pointables[0];
              interactionBox = frame.interactionBox;
              normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);
              x = canvasElement.width * normalizedPosition[0];
              y = canvasElement.height * (1 - normalizedPosition[1]);
              
              if(handRoll > 0){
                length = length * handRoll;
              } else {length = length/handRoll * (-1);}
              
              drawSquare(displayArea, x, y, length);              
            }

            if(rightHand){

              var pinch = rightHand.pinchStrength;
              console.log(pinch);
              if(pinch == 1){
                var ctx = canvasElement.getContext('2d');

                ctx.lineWidth = $scope.baseThickness;
                ctx.strokeStyle = color;

                drawSquare(ctx, x, y, length)

                step++;
                if(step < elements.length) elements.length = step;

                elements.push(document.getElementById('drawingCanvas').toDataURL());
                $scope.square = false;
              }
            }
        }else if($scope.heart){
          var length = 50;
            if(leftHand){
              displayArea.lineWidth = $scope.baseThickness;
              handRoll = leftHand.roll();
              pointable = leftHand.pointables[0];
              interactionBox = frame.interactionBox;
              normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);
              x = canvasElement.width * normalizedPosition[0];
              y = canvasElement.height * (1 - normalizedPosition[1]);
              
              if(handRoll > 0){
                length = length * handRoll;
              } else {length = length/handRoll * (-1);}
              
              drawHeart(displayArea, x, y, length);              
            }

            if(rightHand){

              var pinch = rightHand.pinchStrength;
             
              if(pinch == 1){
                var ctx = canvasElement.getContext('2d');

                ctx.lineWidth = $scope.baseThickness;
                ctx.strokeStyle = color;

                drawHeart(ctx, x, y, length)

                step++;
                if(step < elements.length) elements.length = step;

                elements.push(document.getElementById('drawingCanvas').toDataURL());
                $scope.heart = false;
              }
            }
        }

      } else if( $scope.erase){
        freeStyling(frame, "#fff");
      }
    
    }
  });

  drawCircle = function(displayArea, x, y, size){
    displayArea.moveTo(x,y);
    displayArea.beginPath();
    displayArea.arc(x, y, size , 0, 2 * Math.PI);
    displayArea.stroke();
  }

  drawStar = function(displayArea, x, y, length){
    displayArea.save();
    displayArea.translate(x,y);
    displayArea.beginPath();
    displayArea.rotate((Math.PI * 1 / 10));
    for (var i = 5; i--;) {
      displayArea.lineTo(0, length);
      displayArea.translate(0, length);
      displayArea.rotate((Math.PI * 2 / 10));
      displayArea.lineTo(0, -length);
      displayArea.translate(0, -length);
      displayArea.rotate(-(Math.PI * 6 / 10));
    }
    displayArea.lineTo(0, length);
    displayArea.closePath();
    displayArea.stroke();
    displayArea.restore();
  }

  drawSquare = function(displayArea, x, y, length){
    displayArea.rect(x, y, length, length);
    displayArea.stroke();
  }

  drawHeart = function(displayArea, x, y, length){    
    var d = length;
    displayArea.moveTo(x, y+d/4);
    displayArea.quadraticCurveTo(x, y, x + d / 4, y);
    displayArea.quadraticCurveTo(x + d / 2, y, x + d / 2, y + d / 4);
    displayArea.quadraticCurveTo(x + d / 2, y, x + d * 3/4, y);
    displayArea.quadraticCurveTo(x + d, y, x + d, y + d / 4);
    displayArea.quadraticCurveTo(x + d, y + d / 2, x + d * 3/4, y + d * 3/4);
    displayArea.lineTo(x + d / 2, y + d);
    displayArea.lineTo(x + d / 4, y + d * 3/4);
    displayArea.quadraticCurveTo(x, y + d / 2, x, y + d / 4);
    displayArea.stroke();
  }

  getDrawingSize = function(hand){
    var number = $scope.baseThickness;

    if(hand.thumb.extended) number ++;
    if(hand.indexFinger.extended) number ++;
    if(hand.middleFinger.extended) number ++;
    if(hand.ringFinger.extended) number ++;
    if(hand.pinky.extended) number ++;

    if(number - 1 == $scope.baseThickness)
      number = $scope.baseThickness;

    return number;
  };

  isLeftHand = function(frame){
    if(frame.hands.length > 0){
      for(var i = 0; i < frame.hands.length; i++){
        if(frame.hands[i].type == "left"){
          return frame.hands[i];
        }
      }
    }
    return false;
  };

  isRightHand = function(frame){
    if(frame.hands.length > 0){
      for(var i = 0; i < frame.hands.length; i++){
        if(frame.hands[i].type == "right"){
          return frame.hands[i];
        }
      }
    }
    return false;
  }
  
  distanceBetween = function(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  }

  angleBetween = function(point1, point2) {
    return Math.atan2( point2.x - point1.x, point2.y - point1.y );
  }

  getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  draw = function(_size, _color, _x, _y){    
    size = _size;
    color = _color;
    var displayArea = canvasElement.getContext('2d');

    displayArea.strokeStyle = color;
    displayArea.lineWidth = size;
    
    if(oldX){
      if(style == "pen"){      
        displayArea.lineJoin = displayArea.lineCap = 'round';       
        displayArea.shadowBlur = null;
        displayArea.shadowColor = null;

      }else if(style == "smooth-edge"){
        displayArea.lineJoin = displayArea.lineCap = 'round';
        displayArea.shadowBlur = size;
        displayArea.shadowColor = color;

      }else if(style == "brush"){
        var img = new Image(),
            lastPoint = {x: oldX, y: oldY},
            currentPoint = {x: _x, y: _y},
            dist = distanceBetween(lastPoint, currentPoint),
            angle = angleBetween(lastPoint, currentPoint);

        displayArea.shadowBlur = null;
        displayArea.shadowColor = null;
        img.src = '../img/brush2.png';   

        for (var i = 0; i < dist; i++) {
          x = lastPoint.x + (Math.sin(angle) * i) - 25;
          y = lastPoint.y + (Math.cos(angle) * i) - 25;

          displayArea.drawImage(img, x, y);
        }
        oldX = _x;
        oldY = _y;
      
        return;
      } else if(style == "spray"){
        drawSpray(displayArea, 10, size, color, _x, _y);
        oldX = _x;
        oldY = _y;
        return;
      }

      displayArea.beginPath();
      displayArea.moveTo(oldX, oldY)
      displayArea.lineTo(_x, _y);
      displayArea.stroke();
    }

    oldX = _x;
    oldY = _y;   
  }

  $scope.undo = function(){     
    if(step > 0){
      step--;
      drawImageOnCanvas(elements[step]);      
    }else if(step == 0){
      step--;
      canvasElement.width = canvasElement.width;
    }
  }

  $scope.redo = function(){  
    if(step < elements.length - 1){
      step++;
      drawImageOnCanvas(elements[step]);     
    }
  }

  $scope.erase = function(){  
    $scope.dragElements = false;
    $scope.freeStyle = false;
    $scope.erase = true;    
  }

  $scope.clearCanvas = function(){
    var displayArea = canvasElement.getContext("2d");
    
    canvasElement.width = canvasElement.width;

    displayArea.fillStyle = "#fff";
    displayArea.fillRect(0, 0, canvasElement.width, canvasElement.height);

  }

  $scope.fillBackground = function(){
    var displayArea = canvasElement.getContext("2d"),
        color = getColor();

    displayArea.fillStyle = color;
    displayArea.fillRect(0, 0, canvasElement.width, canvasElement.height);
  }

  $scope.saveCanvas = function(){

  }
 
  downloadCanvas = function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
  }

  document.getElementById('download').addEventListener('click', function() {
    downloadCanvas(this, 'drawingCanvas', 'painting.jpg');
  }, false);

  drawImageOnCanvas = function(image){
    var displayArea = canvasElement.getContext('2d'),
        canvasImage = new Image();

    canvasElement.width = canvasElement.width;

    canvasImage.src = image,
    canvasImage.onload = function(){displayArea.drawImage(canvasImage, 0, 0);}
  }
  
  $scope.changeToDragElements = function(shape){
    $scope.dragElements = true;
    $scope.freeStyle = false;
    clearHoveringStage();

    $scope.circle = false;
    $scope.star = false;
    $scope.square = false;
    $scope.heart = false;

    switch(shape){
      case "circle": $scope.circle = true; console.log($scope.circle); break;
      case "star": $scope.star = true; console.log($scope.star); break;
      case "square": $scope.square = true; break;
      case "heart": $scope.heart = true; break;
    }
  }

  var style = "pen";

  $scope.changeToFreeStyle = function(_style){
    console.log(_style);

    $scope.freeStyle = true;
    $scope.dragElements = false;

    style = _style;
  }

  var clearHoveringStage = function(){
    hoveringCanvas.width = canvasElement.width;
  }

  drawSpray = function(displayArea, density, size, color, x, y){
    displayArea.lineWidth = size;
    displayArea.lineJoin = displayArea.lineCap = "round";
    displayArea.moveTo(x, y);
    displayArea.fillStyle = color;

    for(var i = density; i--;){
      var radius = 20,
          offsetX = getRandomInt(-radius, radius),
          offsetY = getRandomInt(-radius, radius);

      displayArea.fillRect(x + offsetX, y + offsetY, 1, 1);
    }
  }

  freeStyling = function(frame, _color){
    var hand = frame.hands[0],
            handId = hand.id,
            pointable = frame.pointables[0],
            touchZone = pointable.touchZone,
            displayArea = canvasElement.getContext('2d'),
            color = _color,
            //color = getColor(),
            errorDiv = document.getElementById("errorDiv"),
            size;
      
        errorDiv.innerText = "";   
        //Get a pointable and normalize the tip position      
        var interactionBox = frame.interactionBox;
        var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);
        
        // Convert the normalized coordinates to span the canvas
        var canvasX = canvasElement.width * normalizedPosition[0];
        var canvasY = canvasElement.height * (1 - normalizedPosition[1]);

        if(touchZone == "hovering"){      
          clearHoveringStage();
          var x = hoveringCanvas.width * normalizedPosition[0],
              y = hoveringCanvas.height * (1 - normalizedPosition[1]),
              hoveringCtx = hoveringCanvas.getContext('2d');

          oldX = null; oldY = null;

          drawCircle(hoveringCtx, x, y, 10);   
       
          if(touched){
            step++;
            if(step < elements.length) elements.length = step;

            elements.push(document.getElementById('drawingCanvas').toDataURL());
           
            touched = false;
          }
        }else if(touchZone == "touching"){   
          clearHoveringStage();
          size = getDrawingSize(hand);
          if(size > 0){
            draw(5*size, color, canvasX, canvasY, handId);
            touched = true;
          }
        }else {
          clearHoveringStage();
          errorDiv.innerText = "You're out of leap motion area"
        }

        if(frame.gestures.length > 0){
          var gesture = frame.gestures[0],
              endX, endY;

          if(gesture.type == "swipe" && gesture.state === "start" ){
            console.log(gesture);
            console.log(frame.pointables[0])
            var pointable = frame.pointables[0],//gesture.startPosition,,
                ib = frame.interactionBox,
                np = ib.normalizePoint(gesture.startPosition, true);

                $scope.startX = canvasElement.width * np[0],
                $scope.startY = canvasElement.height * (1 - np[1]);

            console.log("start swipe", $scope.startX, $scope.startY);
          
          } else if(gesture.type == "swipe" && gesture.state == "stop"){
            console.log(gesture)
            var //pointable = gesture.position,//frame.pointables[0],
                ib = frame.interactionBox,
                np = ib.normalizePoint(gesture.position, true),
                endX = canvasElement.width * np[0],
                endY = canvasElement.height * (1 - np[1]);

                console.log("end swipe", endX, endY);
                displayArea.strokeStyle = getColor();
                displayArea.lineWidth = getDrawingSize(hand);
                console.log(getDrawingSize)

                console.log($scope.startX, $scope.startY)
                displayArea.beginPath();
                displayArea.moveTo($scope.startX, $scope.startY);
                displayArea.lineTo(endX, endY);
                displayArea.stroke();
          }
        }
  }
});