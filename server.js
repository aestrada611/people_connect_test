const express = require("express");
const axios = require("axios");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const config = require("./webpack.config.js");

const compiler = webpack(config);
const app = express();

// Proxy requests to Star Wars API
app.use("/api/people/", async (req, res) => {
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

app.use("/api/films/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id, "this is id");
    const response = await axios.get(`https://swapi.dev/api/films/${id}/`);
    console.log(response, "this is response");
    const data = response.data.title;
    console.log(data, "this is data");
    // if (!data || !Array.isArray(data) || data.length === 0) {
    //   throw new Error('Empty or malformed response from Star Wars API');
    // }
    res.json(data);
  } catch (error) {
    res.status(500).send("Error accessing Star Wars API");
  }
});

app.use("/api/planets/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id, "this is id");
    const response = await axios.get(`https://swapi.dev/api/planets/${id}/`);
    console.log(response, "this is response");
    const data = response.data;
    console.log(data, "this is data");
    // if (!data || !Array.isArray(data) || data.length === 0) {
    //   throw new Error('Empty or malformed response from Star Wars API');
    // }
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
