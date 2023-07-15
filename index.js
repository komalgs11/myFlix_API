const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const uuid = require("uuid");

const app = express();

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    username: "Komal",
    favoriteMovies: [],
  },
  {
    id: 2,
    username: "Bob",
    favoriteMovies: ["Lord of the Rings"],
  },
];

let movies = [
  {
    Title: "Harry Potter and the Sorcerer's Stone",
    Year: 2001,
    Genre: {
      Name: "Fantasy",
      Description:
        "Fantasy is a genre of speculative fiction involving magical elements, typically set in a fictional universe and usually inspired by mythology and folklore. ",
    },
    Director: {
      Name: "Chris Columbus",
      Born: 1958,
    },

    Description:
      "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.",
    imageURL:
      "https://en.wikipedia.org/wiki/File:Harry_Potter_and_the_Philosopher%27s_Stone_banner.jpg",
    featured: false,
  },
  {
    Title: "Lord of the Rings",
    Year: 2002,
    Genre: {
      Name: "Advanture",
      Description:
        "Adventure fiction is a type of fiction that usually presents danger, or gives the reader a sense of excitement.",
    },
    Director: {
      Name: "Peter Jackson",
      Born: 1961,
    },

    Description:
      "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    imageURL:
      "https://en.wikipedia.org/wiki/File:First_Single_Volume_Edition_of_The_Lord_of_the_Rings.gif",
    featured: false,
  },
  {
    Title: "Spider-Man: Across the Spider-Verse",
    Year: 2023,
    Genre: {
      Name: "Animation",
      Description:
        "Animation is the process used for digitally generating animations.",
    },
    Director: {
      Name: "Joaquim Dos",
      Born: 1977,
    },
    Description:
      "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
    imageURL:
      "https://en.wikipedia.org/wiki/File:Spider-Man-_Across_the_Spider-Verse_poster.jpg",
    featured: false,
  },
  {
    Title: "Inception",
    Year: 2010,
    Genre: {
      Name: "sci-fi",
      Description:
        "sci-fi is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science.",
    },
    Director: {
      Name: "Christopher Nolan",
      Born: 1970,
    },
    Description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    imageURL:
      "https://en.wikipedia.org/wiki/File:Inception_(2010)_theatrical_poster.jpg",
    featured: false,
  },
  {
    Title: "Avengers: Infinity War",
    Year: 2018,
    Genre: {
      Name: "Action",
      Description:
        "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
    },
    Director: {
      Name: "Anthony Russo",
      Born: 1970,
    },
    Description:
      "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.",
    imageURL:
      "https://en.wikipedia.org/wiki/File:Avengers_Infinity_War_poster.jpg",
    featured: false,
  },
];

// Gets the list of data about ALL movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies); // Send the topMovies array as JSON response
}); 

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

// Gets the data about a single movie, by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("no such movie");
  }
});

// Gets the data about a Genre of movie
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such genre");
  }
});

// Gets the data about a Director of movie
app.get("/movies/director/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find((movie) => movie.Director.Name === directorName)
    .Director;
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("no such director");
  }
});

// adds new users
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  } else {
    res.status(400).send("name is required");
  }
});

// update their user info
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.username = updatedUser.username;
    res.status(200).json(user);
  } else {
    res.status(400).send("user not found");
  }
});

// Add favoritemovie  
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added`);
  } else {
    res.status(400).send("user not found");
  }
});

//remove a movie from their favorites
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed`);
  } else {
    res.status(400).send("user not found");
  }
});

// Allow existing users to deregister
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter(user => user.id != id);
    res.status(200).send(`ID ${id} has been removed`)
  } else {
    res.status(400).send("user not found");
  }
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
