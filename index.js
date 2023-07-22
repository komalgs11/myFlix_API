const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/cfDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = [
  {
    Username: "Komal",
    Password: "komal123",
    Email: "komal@gmail.com",
    BirthDate: "1996-08-11",
  },
  {
    Username: "bob",
    Password: "bob123",
    Email: "bob@gmail.com",
    BirthDate: "1991-05-08",
  },
  {
    Username: "jerry",
    Password: "jerry123",
    Email: "jerry@gmail.com",
    BirthDate: "1993-10-05",
  },
  {
    Username: "tom",
    Password: "tom123",
    Email: "tom@gmail.com",
    BirthDate: "1996-09-21",
  },
];

let movies = [
  {
    Title: "Harry Potter and the Sorcerer's Stone",
    Genre: {
      Name: "Fantasy",
      Description:
        "Fantasy is a genre of speculative fiction involving magical elements, typically set in a fictional universe and usually inspired by mythology and folklore. ",
    },
    Director: {
      Name: "Chris Columbus",
      Born: "1958 - 09 - 10",
      Bio:
        "An American filmmaker. Born in Spangler, Pennsylvania, Columbus. studied film at Tisch School of the Arts ",
    },

    Description:
      "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.",
    ImageURL:
      "https://en.wikipedia.org/wiki/File:Harry_Potter_and_the_Philosopher%27s_Stone_banner.jpg",
    Featured: true,
  },
  {
    Title: "Lord of the Rings",
    Genre: {
      Name: "Advanture",
      Description:
        "Adventure fiction is a type of fiction that usually presents danger, or gives the reader a sense of excitement.",
    },
    Director: {
      Name: "Peter Jackson",
      Born: "1961 - 10 - 31",
      Bio: "A New Zealand film director, screenwriter and producer.",
    },

    Description:
      "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    ImageURL:
      "https://www.imdb.com/title/tt0120737/mediaviewer/rm3592958976/?ref_=tt_ov_i",
    Featured: true,
  },
  {
    Title: "Spider-Man: Across the Spider-Verse",
    Genre: {
      Name: "Animation",
      Description:
        "Animation is the process used for digitally generating animations.",
    },
    Director: {
      Name: "Joaquim Dos",
      Born: "1977 - 07 - 22",
      Bio:
        "An American animator, storyboard artist, director, producer, and writer ",
    },
    Description:
      "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
    ImageURL:
      "https://en.wikipedia.org/wiki/File:Spider-Man-_Across_the_Spider-Verse_poster.jpg",
    Featured: true,
  },
  {
    Title: "Inception",
    Genre: {
      Name: "sci-fi",
      Description:
        "sci-fi is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science.",
    },
    Director: {
      Name: "Christopher Nolan",
      Born: "1970 - 07 - 30",
      Bio:
        " A British and American filmmaker. Known for his Hollywood blockbusters with complex storytelling. ",
    },
    Description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    ImageURL:
      "https://en.wikipedia.org/wiki/File:Inception_(2010)_theatrical_poster.jpg",
    Featured: true,
  },
  {
    Title: "Avengers: Infinity War",
    Genre: {
      Name: "Action",
      Description:
        "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
    },
    Director: {
      Name: "Anthony Russo",
      Born: "1970 - 02 - 03",
      Bio: "An American director, producer, and screenwriter. ",
    },
    Description:
      "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.",
    ImageURL:
      "https://en.wikipedia.org/wiki/File:Avengers_Infinity_War_poster.jpg",
    Featured: true,
  },

  {
    Title: "Interstellar",
    Genre: {
      Name: "sci-fi",
      Description:
        "sci-fi is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science.",
    },
    Director: {
      Name: "Christopher Nolan",
      Born: "1970 - 07 - 30",
      Bio:
        "A British and American filmmaker. Known for his Hollywood blockbusters with complex storytelling.",
    },
    Description:
      "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    ImageURL:
      "https://www.imdb.com/title/tt0816692/mediaviewer/rm4043724800/?ref_=tt_ov_i",
    Featured: true,
  },
  {
    Title: "King Kong",
    Genre: {
      Name: "Action",
      Description:
        "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
    },
    Director: {
      Name: "Peter Jackson",
      Born: "1961 - 01 - 31",
      Bio: "A New Zealand film director, screenwriter and producer.",
    },
    Description:
      "A greedy film producer assembles a team of moviemakers and sets out for the infamous Skull Island, where they find more than just cannibalistic natives.",
    ImageURL:
      "https://www.imdb.com/title/tt0360717/mediaviewer/rm2524386304/?ref_=tt_ov_i",
    Featured: true,
  },
  {
    Title: "Captain America: The Winter Soldier",
    Genre: {
      Name: "Advanture",
      Description:
        "Adventure fiction is a type of fiction that usually presents danger, or gives the reader a sense of excitement.",
    },
    Director: {
      Name: "Anthony Russo",
      Born: "1970 - 02 - 03",
      Bio: "An American director, producer, and screenwriter. ",
    },
    Description:
      "As Steve Rogers struggles to embrace his role in the modern world, he teams up with a fellow Avenger and S.H.I.E.L.D agent, Black Widow, to battle a new threat from history: an assassin known as the Winter Soldier.",
    ImageURL:
      "https://www.imdb.com/title/tt1843866/mediaviewer/rm3643984384/?ref_=tt_ov_i",
    Featured: true,
  },
];

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

// Gets the list of data about ALL movies
app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies); // Send the topMovies array as JSON response
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Gets the data about a single movie, by title
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Gets the data about a Genre of movie
app.get("/movies/genre/:genreName", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => {
      res.status(200).json(movie.Genre);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Gets the data about a Director of movie
app.get("/movies/director/:directorName", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      res.status(200).json(movie.Director);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Gets the list of data about ALL users
app.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users); // Send the topMovies array as JSON response
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Get a user by username
app.get("/users/:Username", (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// adds new users
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          BirthDate: req.body.BirthDate,
        })
          .then((user) => {
            res.status(200).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// update their user info
app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.body.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        BirthDate: req.body.BirthDate,
      },
    },
    { new: true }
  ) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Add favoritemovie
app.post("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $push: { favoriteMovies: req.params.MovieID } },
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//remove a movie from their favorites
app.delete("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { favoriteMovies: req.params.MovieID } },
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Allow existing users to delete the registration
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + " was not found");
    } else {
      res.status(200).send(req.params.Username + " was deleted.");
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
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
