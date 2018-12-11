// Require Dependency 
require("dotenv").config();
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var keys = require("./keys.js");
var axios = require("axios");
var Rest = require("node-rest-client").Client;
var fs = require("fs");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);
var rest = new Rest();


//Assign Command line argument to variable
var liriFirstPrompt = process.argv[2];
var liriSecondPrompt = ""

// Get Movie Name/Song Name where the Names are more than One Word
for (var i = 3; i < process.argv.length; i++) {
  liriSecondPrompt = liriSecondPrompt + " " + process.argv[i];
}

// Conditional Statements to choose either Concert/Spotify/Movie/DoWhatItSays
if (liriFirstPrompt === 'concert-this') {
  bands();
  log(liriFirstPrompt);
}
if (liriFirstPrompt === 'spotify-this-song') {
  music();
  log(liriFirstPrompt);
}
if (liriFirstPrompt === 'movie-this') {
  movie();
  log(liriFirstPrompt);
}
if (liriFirstPrompt === 'do-what-it-says') {
  doWhatItSays();
  log(liriFirstPrompt);
}

//doWhatItSays(): Spotifies a song from random.txt file
function doWhatItSays() {

  //Read file from random.txt file
  fs.readFile("random.txt", "utf8", function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    // Assign Spotify prompt and music from random.txt file
    liriFirstPrompt = dataArr[0];
    liriSecondPrompt = dataArr[1];
    music();
  });
}

// music(): Spotifies a song the user prompts, 
//If no song, then defaults to a song called "The Sign"
function music() {

  if (liriSecondPrompt === "")
    liriSecondPrompt = "The Sign"

  spotify.search({ type: 'track', query: liriSecondPrompt }, function (err, data) {
    // If the code experiences any errors it will log the error to the console.
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    
    console.log("Artist:"+data.tracks.items[0].artists[0].name);
    console.log("Track Name:"+data.tracks.items[0].name)
    console.log("URL:"+data.tracks.items[0].external_urls.spotify)
    console.log("Album Name:"+data.tracks.items[0].album.name);
  });
}


// movie(): Gives movie information the user prompts,
//If no moive, then defaults to a movie called "Mr. Nobody"
function movie() {

  //If No movie is specified, default to "Mr. Nobody"
  if (liriSecondPrompt === "")
    liriSecondPrompt = "Mr. Nobody";

  //axios API Call to retrieve movie Information
  axios.get("http://www.omdbapi.com/?t=" + liriSecondPrompt + "=&plot=short&apikey=trilogy").then(
    function (response) {

      console.log("Title:" + response.data.Title + "\n");
      console.log("Year:" + response.data.Year + "\n");
      console.log("IMBD Rating:" + response.data.Ratings[0].Value + "\n");
      if (response.data.Ratings[1])
        console.log("Rotten Tomatoes Rating:" + response.data.Ratings[1].Value + "\n");
      else
        console.log("Rotten Tomatoes Rating:" + "No Rotten Tomatoes Rating\n");
      console.log("Country of production:" + response.data.Country + "\n");
      console.log("Language:" + response.data.Language + "\n");
      console.log("Plot:" + response.data.Plot + "\n");
      console.log("Actors:" + response.data.Actors + "\n");
    });
}

// bands(): Gives information on Bands that are in town,
// Prefers Ariana Grande
function bands() {

  liriSecondPrompt = liriSecondPrompt.trim();

  rest.get("https://rest.bandsintown.com/artists/" + liriSecondPrompt + "/events?app_id=codingbootcamp", function (response) {
    // parsed response body as js object
    // console.log(response);

    console.log("Name of the venue: " + response[1].venue.name);
    console.log("Venue Location: " + response[1].venue.city + ", " + response[1].venue.region + ", " + response[1].venue.country);

    var dateAndTime = response[1].datetime;
    dateAndTime = dateAndTime.split("T");

    var date = moment(dateAndTime[0]).format("MM/DD/YYYY");

    console.log("Date:"+date);
    var time = dateAndTime[1];
    console.log("Time:"+time);
  });
}

//log(): Logging function that keeps track of prompt used
//       Writes to "log.txt" file
function log(command) {
  fs.appendFile("log.txt", command + "\n", function (err) {

    // If an error was experienced we will log it.
    if (err) {
      console.log(err);
    }
  })
}

// If prompt is mis-spelled then prompt the user again.
if (liriFirstPrompt === "spotify-this-song" || liriFirstPrompt === "concert-this" || liriFirstPrompt === "movie-this" || liriFirstPrompt === "do-what-it-says")
  ;
else {
  inquirer
    .prompt([
      {
        type: "checkbox",
        message: "ERROR!! Please choose from the options below",
        name: "liriPrompt",
        default: "khoi",
        choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says']
      },
    ])
    .then(function (inquirerResponse1) {

      console.log("Choosen:" + inquirerResponse1.liriPrompt);

      if (inquirerResponse1.liriPrompt == "concert-this") {
        console.log("hello");
        inquirer.prompt([
          {
            type: "input",
            message: "Name of Band?",
            name: "nameOfBand"
          },
        ])
          .then(function (inquirerResponse2) {
            console.log("Name of Band:" + inquirerResponse2.nameOfBand);
            liriFirstPrompt = "concert-this";
            liriSecondPrompt = inquirerResponse2.nameOfBand;
            bands();

          });
      }

      if (inquirerResponse1.liriPrompt == "spotify-this-song") {
        console.log("hello");
        inquirer.prompt([
          {
            type: "input",
            message: "Name of Song?",
            name: "nameOfSong"
          },
        ])
          .then(function (inquirerResponse2) {
            console.log("Name of Song:" + inquirerResponse2.nameOfSong);
            liriFirstPrompt = "spotify-this-song";
            liriSecondPrompt = inquirerResponse2.nameOfSong;
            music();
          });

      }
      if (inquirerResponse1.liriPrompt == "movie-this") {
        console.log("hello");
        inquirer.prompt([
          {
            type: "input",
            message: "Name of Movie?",
            name: "nameOfMovie"
          },
        ])
          .then(function (inquirerResponse2) {
            console.log("Name of Movie:" + inquirerResponse2.nameOfMovie);
            liriFirstPrompt = "movie-this";
            liriSecondPrompt = inquirerResponse2.nameOfMovie;

            console.log(liriFirstPrompt);
            console.log(liriSecondPrompt);
            movie();
          });
      }
      if (inquirerResponse1.liriPrompt == "do-what-it-says") {
        liriFirstPrompt = "do-what-it-says";
        doWhatItSays();
      }
    });
}
