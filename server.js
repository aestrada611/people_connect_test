const express = require('express');
const axios = require('axios');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config.js');

const compiler = webpack(config);
const app = express();


// Proxy requests to Star Wars API
app.use('/api/people/', async (req, res) => {

    try {
         const response = await axios.get('https://swapi.dev/api/people/');
    const data = response.data;
    const pageCount = Math.ceil(data.count / data.results.length);
    const pagePromises = [];

    for (let i = 2; i <= pageCount; i++) {
      pagePromises.push(axios.get(`https://swapi.dev/api/people/?page=${i}`));
    }

    const pageResponses = await Promise.all(pagePromises);
    const pageData = pageResponses.map(response => response.data);

    const results = data.results.concat(...pageData.map(data => data.results));

    res.json(results);
    // let results = [];
    // let nextURL = 'https://swapi.dev/api/people/' + req.url;

    // while (nextURL) {
    //     const response = await axios.get(nextURL);
    //     console.log(response.data, "this is response.data", response.data.results, "this is response.data.results", response);

    //     // Push the results to the array
    //     results = results.concat(response.data.results);

    //     // Update the nextURL for the next loop iteration
    //     nextURL = response.data.next;
    // }

    // // Send the combined results back to the client
    // res.json(results);
} catch (error) {
    res.status(500).send('Error accessing Star Wars API');
}
});

app.use('/api/film/:id', async (req, res) => {
    try {
    const id = req.params.id;
    const response = await axios.get(`https://swapi.dev/api/films/${id}/`);
    const data = response.data.results;
    res.json(data);
  } catch (error) {
    res.status(500).send('Error accessing Star Wars API');
  }
});

// Serve static assets
app.use(webpackDevMiddleware(compiler));

const cors = require('cors');

app.use(cors());


app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
