// Possible states:
// rock, paper, scissors, none
let playerMove = "none";
let computerMove = "none";
let playerScore = 0;
let computerScore = 0;

// states: playing, paused
let state = "playing";
let message = "Click to lock in selection";

// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/fRzh0Q5KK/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
    createCanvas(640, 240);

    // Create the video
    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();

    flippedVideo = ml5.flipImage(video);
    // Start classifying
    classifyVideo();
}

function draw() {
    background(222);
    // Draw the video
    image(flippedVideo, 0, 0);

    // only update move if currently playing
    if (state == "playing") {
        // updates player move based on key press
        if (label=="rock") {
            // R key pressed
            playerMove = "rock";
        } else if (label=="paper") {
            // P key pressed
            playerMove = "paper";
        } else if (label=="scissors") {
            // S key pressed
            playerMove = "scissors";
        }
    }

    // red dividing line between two sides
    strokeWeight(10);
    line(width / 2, 0, width / 2, height);

    // display emojis for player and computer moves
    strokeWeight(1);
    textSize(100);
    textAlign(CENTER, CENTER);
    // display emoji for player's move
    text(getMoveEmoji(playerMove), 0, 0, width / 2, height);
    // display emoji for computer's move
    text(getMoveEmoji(computerMove), width / 2, 0, width / 2, height);

    // display message to tell user next step
    textSize(12);
    stroke(0);
    strokeWeight(2);
    fill(255);
    text(message, 0, 200, width / 2, 40);

    // display scores
    textSize(35);
    text(playerScore, 20, 20);
    text(computerScore, width - 20, 20);
}

function mouseClicked() {
    // if mouse is clicked while in the playing state,
    // and a move is selected,
    // lock in player choice and determine winner
    if (state == "playing" && playerMove) {
        // selects a random move for the computer
        computerMove = random(["rock", "paper", "scissors"]);

        // Determine winner and perform action
        if (
            (playerMove == "rock" && computerMove == "scissors") ||
            (playerMove == "paper" && computerMove == "rock") ||
            (playerMove == "scissors" && computerMove == "paper")
        ) {
            // Case 1: Player beats computer
            playerScore++;
        } else if (
            (computerMove == "rock" && playerMove == "scissors") ||
            (computerMove == "paper" && playerMove == "rock") ||
            (computerMove == "scissors" && playerMove == "paper")
        ) {
            // Case 2: Computer beats player
            computerScore++;
        }
        // in the case of a tie, nothing happens to score

        // Pauses the game to give time to view the results
        state = "paused";
        message = "Click to resume";
    }
    // if game is currently paused, resume it
    else if (state == "paused") {
        state = "playing";
        computerMove = "none";
        message = "Click to lock in selection";
    }
    else {
        console.log("Error: Invalid state");
    }
}

// gets the emoji corresponding to a given move
function getMoveEmoji(move) {
    if (move == "rock") {
        return "🪨";
    } else if (move == "paper") {
        return "📝";
    } else if (move == "scissors") {
        return "✂️";
    } else if (move == "none") {
        return "";
    } else {
        return "invalid move";
    }
}

// Get a prediction for the current video frame
function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();

  }

  // When we get a result
  function gotResult(error, results) {
    // If there is an error
    if (error) {
      console.error(error);
      return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    label = results[0].label;
    // Classifiy again!
    classifyVideo();
  }