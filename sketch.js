//Create variables here
var dog, database, foodS, foodStock, dog1, dog2, button1, button2, gameState;
var foodObj, hour, fedTime, lastFed, readState, bedroom, washroom, garden, currentTime;
function preload()
{
  dog2=loadImage("images/dogImg.png")
  dog1=loadImage("images/dogImg1.png")
  bedroom=loadImage("images/Bed Room.png")
  washroom=loadImage("images/Wash Room.png")
  garden=loadImage("images/Garden.png")

}

function setup() {
  database=firebase.database();
  createCanvas(500, 500);
  foodObj=new food();
  dog=createSprite(400,300,5,5)
  dog.scale=0.2
  dog.addImage(dog1)
  foodStock=database.ref("Food")
  foodStock.on("value",readStock)
 
  
  button1=createButton("Feed")
  button2=createButton("Add Food")
  button1.position(500,100)
  button2.position(600,100)
  button1.mousePressed(feedDog)
  button2.mousePressed(addFood)
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })

}


function draw() {  
  background(46,139,87)
  //foodObj.display();
  fedTime=database.ref('FeedTime')
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  
  textSize(15)
  fill("white")
  text("Food Remaining : " + foodS,180,120)
  if(lastFed>12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
   currentTime=hour();
   if(currentTime==(lastFed+1)){
     update("playing")
     foodObj.garden();
   }
   else if(currentTime==(lastFed+2)){
     update("sleeping")
     foodObj.bedroom()
   }
   else if(currentTime>(lastFed+2) && currentTime<(lastFed+4)){
     update("bathing")
     foodObj.washroom();
   }
   else{
     update("hungry")
     foodObj.display();
   }
   if(gameState!="hungry"){
    button1.hide();
    button2.hide();
    dog.remove();
  }
  else{
    button1.show();
    button2.show();
    //dog.addImage(dog1)
  }
  drawSprites();
}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}

function feedDog(){
  dog.addImage(dog2);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function addFood(){
  foodS++
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  });
}
