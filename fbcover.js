/**
 *	HTML5 KineticJS Facebook Cover Maker
 *	version 1.0
 *
 *	This library can be use as part as your project for making some Facebook cover
 *  using HTML5 Canvas property
 *
 *	See: http://khalidadisendjaja.web.id/2012/10/14/html5-kinectjs-facebook-cover-maker/
 *
 *	Copyright (C) 2012 by
 *	Khalid Adisendjaja
 *	www.khalidadisendjaja.web.id
 *
 *	Feel free to redistribute under the GPL
 *	http://www.gnu.org/copyleft/gpl.html
 */

 function Fbcover(canvasWidth,canvasHeight,covers){
   this.canvasWidth = canvasWidth || 851;
   this.canvasHeight = canvasHeight || 315;
   this.imageGroup = {};
   this.stage = new Kinetic.Stage({ container: "container", width: this.canvasWidth, height: this.canvasHeight });
   this.layer = new Kinetic.Layer();
   this.loadImage('cover','http://localhost/HTML5-KineticJS-Facebook-Cover-Maker/platform_cover.jpg',false);  
    
 }

 Fbcover.prototype = {

 'loadImage' : function (name,path,isDraggable) {
			        var imgObj, width, height,myself;
			        imgObj = new Image();
			        imgObj.src = path;
			        myself = this;
			        imgObj.onload = function() {

			          if(name == null){
			            name = 'id' +  Math.floor(Math.random()).toString(5) + (new Date()).getTime();        
			          }
			          
			          if(name != 'cover'){
			             var newSize = myself.adjustImageSize(imgObj,200);
			              width = newSize.width;
			              height = newSize.height;
			          }else{
			              width = imgObj.width;
			              height = imgObj.height;
			          }

			            myself.imageGroup[name] = new Kinetic.Group({
			                x: width/2,
			                y: height/2,
			                draggable: isDraggable,
			                offset:[width/2,height/2]
			            });

			            myself.layer.add(myself.imageGroup[name]);
			            myself.stage.add(myself.layer);

			              

			              var Img = new Kinetic.Image({
			                x: 0,
			                y: 0,
			                image: imgObj,
			                name: "image",
			                width: width,
			                height: height,
			                
			              });

			              myself.imageGroup[name].add(Img);

			              if(isDraggable){
			                myself.addAnchor(myself.imageGroup[name], 0, 0, "topLeft");
			                myself.addAnchor(myself.imageGroup[name], width, 0, "topRight");
			                myself.addAnchor(myself.imageGroup[name], width, height, "bottomRight");
			                myself.addAnchor(myself.imageGroup[name], 0, height, "bottomLeft");  
			                myself.addRotateAnchor(myself.imageGroup[name], width/2, height/2, "rotateBtn")  
			                myself.addDelAnchor(myself.imageGroup[name], width/5, height, "deleteBtn"); 

			                myself.imageGroup[name].on("dragstart", function() {
			                  this.moveToTop();
			                });

			                // add anchor toggle
			                myself.imageGroup[name].on("mouseover", function() {
			                   var layer = this.getLayer();
			                  myself.toggleAnchor(this,'show');   
			                  layer.draw()

			                });

			                myself.imageGroup[name].on("mouseout", function() {
			                   var layer = this.getLayer();
			                  myself.toggleAnchor(this,'hide');   
			                  layer.draw();

			                });
			             }else{
			              myself.imageGroup[name].moveToBottom();
			             }
			             myself.stage.draw();

			        }
			      },
 

 'update' : function (group, activeAnchor) {
        var topLeft = group.get(".topLeft")[0];
        var topRight = group.get(".topRight")[0];
        var bottomRight = group.get(".bottomRight")[0];
        var bottomLeft = group.get(".bottomLeft")[0];
        var deletebtn = group.get(".deleteBtn")[0];
        var rotatebtn = group.get(".rotateBtn")[0];
        var image = group.get(".image")[0];

        // update anchor positions
        switch (activeAnchor.getName()) {
          case "topLeft":
            topRight.attrs.y = activeAnchor.attrs.y;
            bottomLeft.attrs.x = activeAnchor.attrs.x;
            break;
          case "topRight":
            topLeft.attrs.y = activeAnchor.attrs.y;
            bottomRight.attrs.x = activeAnchor.attrs.x;
            break;
          case "bottomRight":
            bottomLeft.attrs.y = activeAnchor.attrs.y;
            topRight.attrs.x = activeAnchor.attrs.x;
            break;
          case "bottomLeft":
            bottomRight.attrs.y = activeAnchor.attrs.y;
            topLeft.attrs.x = activeAnchor.attrs.x;
            break;

        }

        image.setPosition(topLeft.attrs.x, topLeft.attrs.y);


        var width = topRight.attrs.x - topLeft.attrs.x;
        var height = bottomLeft.attrs.y - topLeft.attrs.y;

        deletebtn.setPosition(bottomLeft.attrs.x + (width/5),bottomLeft.attrs.y);
        rotatebtn.setPosition(topLeft.attrs.x + (width/2), topLeft.attrs.y + (height/2));
        group.setOffset(topLeft.attrs.x + (width/2),topLeft.attrs.y + (height/2));
        
       
        if(width && height) {
          image.setSize(width, height);
        }
      },

 'addAnchor' :  function (group, x, y, name) {
        var stage = group.getStage();
        var layer = group.getLayer();
        var myself = this;

        var anchor = new Kinetic.Circle({
          x: x,
          y: y,
          stroke: "#666",
          fill: "#ddd",
          strokeWidth: 2,
          radius: 8,
          name: name,
          draggable: true
        });

        anchor.on("dragmove", function() {
          myself.update(group, this);
          myself.layer.draw();
        });
        anchor.on("mousedown touchstart", function() {
          group.setDraggable(false);
          this.moveToTop();
        });
        anchor.on("dragend", function() {
          group.setDraggable(true);
          myself.layer.draw();
        });
        // add hover styling
        anchor.on("mouseover", function() {
          var layer = this.getLayer();
          document.body.style.cursor = "pointer";
          this.setStrokeWidth(4);
          layer.draw();
        });
        anchor.on("mouseout", function() {
          var layer = this.getLayer();
          document.body.style.cursor = "default";
          this.setStrokeWidth(2);
          layer.draw();
        });

        anchor.hide()

        group.add(anchor);
      },

  'addRotateAnchor' :    function (group, x, y, name) {
        var stage = group.getStage();
        var layer = group.getLayer();

        var anchor = new Kinetic.Circle({
          x: x,
          y: y,
          stroke: "#666",
          fill: "#fff",
          strokeWidth: 1,
          radius: 10,
          name: name,
          draggable: false
        });

        // add hover styling
        anchor.on("mouseover", function() {
          var layer = this.getLayer();
          document.body.style.cursor = "pointer";
          this.setStrokeWidth(2);
          layer.draw();
        });
        anchor.on("mouseout", function() {
          var layer = this.getLayer();
          document.body.style.cursor = "default";
          this.setStrokeWidth(1);
          layer.draw();
        });

        anchor.on("click", function() {
          group.rotate(Math.PI / 4);
        });

        anchor.hide()

        group.add(anchor);

      },

   'toggleAnchor' :  function (group,action){
        if(action == 'show'){
          group.get(".topLeft")[0].show();
          group.get(".topRight")[0].show();
          group.get(".bottomRight")[0].show();
          group.get(".bottomLeft")[0].show();
          group.get(".deleteBtn")[0].show();
          group.get(".rotateBtn")[0].show();
        }else if(action == 'hide'){
          group.get(".topLeft")[0].hide();
          group.get(".topRight")[0].hide();
          group.get(".bottomRight")[0].hide();
          group.get(".bottomLeft")[0].hide();
          group.get(".deleteBtn")[0].hide();
          group.get(".rotateBtn")[0].hide();  
        }
      },

    'addDelAnchor' :  function (group,x,y,name){
         var stage = group.getStage();
        var layer = group.getLayer();
        var anchor = new Kinetic.Text({
          x: x,
          y: y,
          text: '-Remove',
          fontSize: 10,
          fontFamily: 'Tahoma',
          textFill: '#555',
          fill:'#ddd',
          padding: 2,
          stroke:'#000',
          strokeWidth:'0.5',
          align: 'center',
          name:name
        });

         anchor.on("click", function() {
          group.off("mouseover");
          group.off("mouseout");
          group.off("dragstart");
          group.removeChildren();
          
          
        });

         // add hover styling
        anchor.on("mouseover", function() {
          var layer = this.getLayer();
          document.body.style.cursor = "pointer";
          this.setStrokeWidth(1);
          layer.draw();
        });
        anchor.on("mouseout", function() {
          var layer = this.getLayer();
          document.body.style.cursor = "default";
          this.setStrokeWidth(0);
          layer.draw();
        });

        anchor.hide();

         

         group.add(anchor);

      },

    'adjustImageSize': function (imgObj,max_side){
        var max_side = max_side || imgObj.width;
        var height = imgObj.height;
        var width = imgObj.width;

        if ( imgObj.width > imgObj.height ) {         
          var image_ratio = imgObj.width / max_side;
          width = max_side;
          height = imgObj.height / image_ratio;
        } else {
          var image_ratio = imgObj.height / max_side;
          height = max_side;
          width = imgObj.width / image_ratio;
        }

        return { 'width':width,'height':height }
      },

    'changeCover':  function (path){
        this.imageGroup.cover.removeChildren();
        this.loadImage('cover',path,false);
      },

    'saveCover':  function(){
         this.stage.toDataURL({
              callback: function(dataURL){
                // do something with the data url
                window.open(dataURL);
              },
              mimeType: 'image/jpeg'
            });
      } 


 }