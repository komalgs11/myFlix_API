const express = require("express");
const morgan = require("morgan");
const app = express();

let topMovies = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    year: "2001",
  },
  {
    title: "Lord of the Rings",
    year: "2002",
  },
  {
    title: "Twilight",
    year: "2008",
  },
  {
    title: "Spider-Man: Across the Spider-Verse",
    year: "2023",
  },
  {
    title: "Inception",
    year: "2010",
  },
  {
    title: "Avengers: Infinity War",
    year: "2018",
  },
];

// GET requests
app.get("/movies", (req, res) => {
  res.json(topMovies); // Send the topMovies array as JSON response
});

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.use(morgan("common"));

app.use(express.static("public"));

// Error-handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
