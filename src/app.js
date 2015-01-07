var UI = require('ui');
// var Vibe = require('ui/vibe');
var ajax = require('ajax');

var mainMenuItems = [
  {
    title: "HUDS Menu",
    subtitle: "Yum!"
  },
  {
    title: "Shuttle Tracker",
    subtitle: "Gotta run!"
  },
  {
    title: "About",
    subtitle: "Feature Requests"
  }
];

var foodMenuItems = [
  {
    title: "Breakfast"
  },
  {
    title: "Lunch"
  },
  {
    title: "Dinner"
  }
];

var MEALS = ["BREAKFAST", "LUNCH", "DINNER"];

function displayMenu(data){
  var entrees = [];
  var soups = [];
  var desserts = [];
  
  for(var i = 0; i < data.length; i++){
    var item = data[i];
    if(item.category.indexOf("ENTREE") > -1){
      entrees.push({title: item.name, subtitle: item.category, recipe: item.recipe, portion: item.portion, unit: item.unit});
    }
    
    if(item.category.indexOf("SOUP") > -1){
      soups.push({title: item.name, recipe: item.recipe, portion: item.portion, unit: item.unit});
    }

    if(item.category.indexOf("DESSERT") > -1){
      desserts.push({title: item.name, recipe: item.recipe, portion: item.portion, unit: item.unit});
    }
    
  }

  var foodItems = new UI.Menu({
    sections: [{
      title: 'Entrees',
      items: entrees
    },
    {
      title: 'Desserts',
      items: desserts
    },
    {
      title: 'Soups',
      items: soups
    }]
  });
  
  foodItems.on('select', function(e){
    var recipe = e.item.recipe;
    ajax(
      {
        url: "http://api.cs50.net/food/3/facts?key=955da9c5409ca55def9a5f7db973432b&output=json&recipe=" + recipe,
        type: "json"
      },
      function(data){
        var portion = e.item.portion + " " + e.item.unit;
        
        var text = "";
        text += "Calories: " + ~~data[1].amount + "\n";
        text += "Protein: " + ~~data[6].amount + "g\n";
        text += "Carbs: " + ~~data[10].amount + "g\n";
        text += "Fat: " + ~~data[11].amount + "g\n";
        text += "Sugar: " + ~~data[9].amount + "g\n";
        text += "Fiber: " + ~~data[4].amount + "g\n";
        
        var factCard = new UI.Card({
          title: e.item.title,
          subtitle: portion,
          body: text,
          scrollable: true
        });
        factCard.show();
      },
      function(error){
        // Failure!
        var errorCard = new UI.Card({
          title: 'Error',
          subtitle: 'Error getting data. Please try again.'
        });
        
        errorCard.show();
      }
    
    );
  });
  
  return foodItems;
}

function createFoodMenu(){
  var foodMenu = new UI.Menu({
    sections: [{
      title: 'Meals',
      items: foodMenuItems
    }]
  });

  foodMenu.on('select', function(e){
    var meal = MEALS[e.itemIndex];
    ajax(
      {
        url: "http://api.cs50.net/food/3/menus?key=955da9c5409ca55def9a5f7db973432b&sdt=2012-03-21&output=json&meal=" + meal,
        type: 'json'
      },
      function(data) {
        // Success!
        console.log(data);
        var foodItems = displayMenu(data);
        foodItems.show();
      },
      function(error) {
        // Failure!
        var errorCard = new UI.Card({
          title: 'Error',
          subtitle: 'Error getting data. Please try again.'
        });
        
        errorCard.show();
      }
    );
  });
  
  return foodMenu;
}

var mainMenu = new UI.Menu({
  sections: [{
    title: 'Utilities',
    items: mainMenuItems
  }]
});

mainMenu.show();

mainMenu.on('select', function(event) {
  
  switch(event.itemIndex){
      
    // HUDS Menu
    case 0:
      var foodMenu = createFoodMenu();
      foodMenu.show();
      break;
      
    // Shuttletracker
    case 1:
      var newItem = new UI.Card({
        title: 'Shuttle Tracker',
        body: 'Shuttletracker is coming soon!',
        scrollable: true
      });
      newItem.show();
      break;
      
    case 2:
      var aboutCard = new UI.Card({
        title: "About",
        body: "This app is maintained by Ved Topkar (vedtopkar@gmail.com). To say thanks, report a bug, or make a feature request, feel free to email me!",
        scrollable: true
      });
      aboutCard.show();
      break;
  }

});