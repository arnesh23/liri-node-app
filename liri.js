// Require Dependency 
require("dotenv").config();
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);


//Assign Command line argument to variable
var liriFirstPrompt = process.argv[2];
var liriSecondPrompt = ""

// Get Movie Name/Song Name where the Names are more than One Word
for(var i = 3; i < process.argv.length; i++){
     liriSecondPrompt = liriSecondPrompt + " "+process.argv[i];
}

// Conditional Statements to choose either Spotify or Movie
if(liriFirstPrompt === 'spotify-this-song')
{
    music();
    log(liriFirstPrompt);
}
if(liriFirstPrompt === 'movie-this')
{
    movie();
    log(liriFirstPrompt);
}
if(liriFirstPrompt === 'do-what-it-says'){
        log(liriFirstPrompt);

        fs.readFile("random.txt", "utf8", function(error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
              return console.log(error);
            }
          
            // We will then print the contents of data
            console.log(data);
          
            // Then split it by commas (to make it more readable)
            var dataArr = data.split(",");
          
            // We will then re-display the content as an array for later use.
            liriFirstPrompt = dataArr[0];
            liriSecondPrompt = dataArr[1];
            music();  
          });
    }

// Music Function which Spotifies a song
function music(){

    if(liriSecondPrompt === "")
    liriSecondPrompt = "The Sign"

    spotify.search({ type: 'track', query: liriSecondPrompt }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       // console.log(data);

        //console.log(data);
        console.log(data.tracks.items[0].artists[0].name);
        console.log(data.tracks.items[0].name)
        console.log(data.tracks.items[0].external_urls.spotify)
        console.log(data.tracks.items[0].album.name);
});
}


// Movie Function which Gives movie information
function movie(){
    //The Notebook
    //[The,Notebook]
    //['','The','Notebook']

    if(liriSecondPrompt === "")
        liriSecondPrompt = "Mr. Nobody";
    console.log("MOVIE:"+liriSecondPrompt);
    

    axios.get("http://www.omdbapi.com/?t="+liriSecondPrompt+"=&plot=short&apikey=trilogy").then(
  function(response) {

    console.log(response);
    console.log("Title:"+response.data.Title+"\n");
    console.log("Year:"+response.data.Year+"\n");
    console.log("IMBD Rating:"+response.data.Ratings[0].Value+"\n");
    if(response.data.Ratings[1])
    console.log("Rotten Tomatoes Rating:"+response.data.Ratings[1].Value+"\n");
    else
    console.log("Rotten Tomatoes Rating:"+"No Rotten Tomatoes Rating\n");
    console.log("Country of production:"+response.data.Country+"\n");
    console.log("Language:"+response.data.Language+"\n");
    console.log("Plot:"+response.data.Plot+"\n");
    console.log("Actors:"+response.data.Actors+"\n");
  });
}
  

//log function that logs the commands to the file log.txt
function log(command){
    fs.appendFile("log.txt", command+"\n", function(err) {

        // If an error was experienced we will log it.
        if (err) {
          console.log(err);
        }
      
        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
          console.log("Command logged!");
        }
})
}

    
    //console.log("The movie's rating is: " + //response.data.imdbRating);
   

    /*

function checkPrompt(){
if(liriPrompt != 'concert-this'          ||
   liriPrompt != 'spotify-this-song'     ||
   liriPrompt != 'movie-this'            ||
   liriPrompt != 'do-what-it-says')
   {
inquirer
  .prompt([
{
    type: "checkbox",
    message: "Please choose from the options below",
    name: "liriPrompt",
    default: "",
    choices:['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says']
}
])
.then(function(inquirerResponse){

});
 }
}
checkPrompt();





/*
// Create a "Prompt" with a series of questions.
inquirer
  .prompt([
    // Here we create a basic text prompt.
    {
      type: "input",
      message: "What is your name?",
      name: "username"
    },
    {
        type: "input",
        message: "You are having a sandwich for lunch!! What type of sandwich would you like to have?",
        name: "lunch"
      },
    {
      type: "confirm",
      message: "Are you sure:",
      name: "confirm",
      default: true
    },
    // Here we create a basic password-protected text prompt.
    {
      type: "password",
      message: "Set your password",
      name: "password"
    },
    {
      type: "confirm",
      message: "Are you sure:",
      name: "confirm",
      default: true
    },
    // Here we give the user a list to choose from.
    {
      type: "list",
      message: "Why not other sandwich",
      choices: ["Tuna", "BLT", "Roast Beef","Turkey"],
      name: "sandwich"
    },
    // Here we ask the user to confirm.
    {
      type: "confirm",
      message: "Are you sure:",
      name: "confirm",
      default: true
    },
    {
        type: "checkbox",
        message: "What is your favorite sandwich",
        name: "favsandwich",
        default: "Grilled Cheese",
        choices:['PBJ', 'Grilled Cheese', 'Roasted Chicken', 'Salami', 'Ham', 'Italian']
    },
    {
        type: "confirm",
        message: "Are you sure:",
        name: "confirm",
        default: true
      }
  ])
  .then(function(inquirerResponse) {
    if (inquirerResponse.confirm) {
        console.log("\nWelcome " + inquirerResponse.username);
        console.log("Your " + inquirerResponse.sandwich + " sandwich is ready to be consumed!\n");
        console.log("But WHYY?? Your favorite Sandwich is " + inquirerResponse.favsandwich);
      }
      else {
        console.log("\nThat's okay " + inquirerResponse.username + ", come again when you hungry.\n");
      }
    });
    */