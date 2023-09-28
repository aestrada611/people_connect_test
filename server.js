const express = require("express");
const axios = require("axios");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const config = require("./webpack.config.js");

const compiler = webpack(config);
const app = express();

// Proxy requests to Star Wars API
app.use("/api/people/", async (req, res) => {
  // For this request I used the public api to get the first page of characters and then used the count to determine how many pages there were.
  // The I used a for loop to get the rest of the pages and then concatenated them all together to get all the characters.
  // I know this is not the most efficient way to do this, but the SWAPI returns things paginated.
  try {
    const response = await axios.get("https://swapi.dev/api/people/");
    const data = response.data;
    const pageCount = Math.ceil(data.count / data.results.length);
    const pagePromises = [];

    for (let i = 2; i <= pageCount; i++) {
      pagePromises.push(axios.get(`https://swapi.dev/api/people/?page=${i}`));
    }

    const pageResponses = await Promise.all(pagePromises);
    const pageData = pageResponses.map((response) => response.data);

    const results = data.results.concat(
      ...pageData.map((data) => data.results)
    );

    res.json(results);
  } catch (error) {
    res.status(500).send("Error accessing Star Wars API");
  }
});

// This is used to get the film titles by hitting the public api
app.use("/api/films/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(`https://swapi.dev/api/films/${id}/`);
    const data = response.data.title;
    res.json(data);
  } catch (error) {
    res.status(500).send("Error accessing Star Wars API");
  }
});

// This is used to get the planet names by hitting the public api
app.use("/api/planets/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(`https://swapi.dev/api/planets/${id}/`);
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).send("Error accessing Star Wars API");
  }
});

// This is used to get the starships names by hitting the public api
app.use("/api/starships/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(`https://swapi.dev/api/starships/${id}/`);
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).send("Error accessing Star Wars API");
  }
});

// This is used to get the vehicles names by hitting the public api
app.use("/api/vehicles/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(`https://swapi.dev/api/vehicles/${id}/`);
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).send("Error accessing Star Wars API");
  }
});

// Serve static assets
app.use(webpackDevMiddleware(compiler));

const cors = require("cors");

app.use(cors());

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
