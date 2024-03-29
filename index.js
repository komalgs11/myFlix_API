const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Models = require("./models.js");
const passport = require("passport");
const { check, validationResult } = require("express-validator");

/**
 * Define models for Movies and Users
 */
const Movies = Models.Movie;
const Users = Models.User;

/**
 * Connect to the MongoDB database using the connection URI
 */
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 *  connect mongoose to local database
 *  mongoose.connect("mongodb://localhost:27017/cfDB", {
 *  useNewUrlParser: true,
 *  useUnifiedTopology: true,
 *  });
 */

/**
 * Create an Express application
 */
const app = express();
app.use(express.json());

/**
 * Configure CORS (Cross-Origin Resource Sharing) to allow specific origins
 */

const cors = require("cors");
let allowedOrigins = [
  "https://movies-myflix.netlify.app",
  "http://localhost:4200",
  "https://mymoviesflix-415489b92353.herokuapp.com",
  "https://komalgs11.github.io/myFlix-Angular-client/welcome",
  "https://komalgs11.github.io",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn’t allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

/**
 * Configure body parsing middleware
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Configure authentication and login endpoints
 */
let auth = require("./auth")(app);
require("./passport");

/**
 * Define a route for the root URL that returns a welcome message
 */

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

/**
 * Returns the list of data about ALL movies to the user.
 * URL --> https://mymoviesflix-415489b92353.herokuapp.com/movies
 * @param  movies {string}
 * Response JSON format
 */

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Returns data about a single movie based on its title.
 * URL --> https://mymoviesflix-415489b92353.herokuapp.com/movies/{title}
 * @param {string} title - The title of the movie to retrieve.
 */

app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Returns data about movies of a specific genre.
 * URL --> https://mymoviesflix-415489b92353.herokuapp.com/movies/genre/{genreName}
 * @param {string} genreName
 */

app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.genreName })
      .then((movie) => {
        res.status(200).json(movie.Genre);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Returns data about movies directed by a specific director.
 * URL --> https://mymoviesflix-415489b92353.herokuapp.com/movies/director/{directorName}
 * @param {string} directorName
 */

app.get(
  "/movies/director/:directorName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.directorName })
      .then((movie) => {
        res.status(200).json(movie.Director);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Returns a list of all users registered in the system.
 * URL --> https://mymoviesflix-415489b92353.herokuapp.com/users
 * Authentication is required.
 * Response JSON format
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(200).json(users); // Send the topMovies array as JSON response
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Returns data about a user based on their username.
 * URL --> https://mymoviesflix-415489b92353.herokuapp.com/users/{Username}
 * @param {string} Username - The username of the user to retrieve.
 * Response JSON format
 */

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

/**
 * Registers a new user in the system.
 * URL --> https://mymoviesflix-415489b92353.herokuapp.com/users
 * Request format: JSON body with user registration data.
 * Authentication is required.
 */
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    let errors = validationResult(req); // check the validation object for errors
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) //Search to see if a user with the requested username already exists.
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
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
  }
);

/**
 * Updates user information based on their username.
 * URL --> https://mymoviesflix-415489b92353.herokuapp.com/users/{Username}
 * @param {string} Username - The username of the user to update.
 * Request format: JSON body with updated user data.
 * Authentication is required.
 */
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    //check validation errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          BirthDate: req.body.BirthDate,
        },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: No user was found");
        } else {
          res.json(updatedUser);
        }
      })

      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Adds a movie to a user's list of favorite movies.
 * URL --> https://mymoviesflix-415489b92353.herokuapp.com/users/{Username}/movies/{MovieID}
 * @param {string} Username - The username of the user.
 * @param {string} MovieID - The ID of the movie to add to favorites.
 */

app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

/**
 * Removes a movie from a user's list of favorite movies.
 * URL --> https://mymoviesflix-415489b92353.herokuapp.com/users/{Username}/movies/{MovieID}
 * @param {string} Username - The username of the user.
 * @param {string} MovieID - The ID of the movie to remove from favorites.
 */

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

/**
 * Deletes a user's registration based on their username.
 * URL --> https://mymoviesflix-415489b92353.herokuapp.com/users/{Username}
 * @param {string} Username - The username of the user to delete.
 * Authentication is required.
 * Response JSON format
 */

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

// Define a route for serving API documentation (HTML file)
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

// Configure request logging using Morgan
app.use(morgan("common"));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Error-handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
