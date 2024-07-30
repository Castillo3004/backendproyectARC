const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 9000;
const graphDBEndpoint = process.env.GRAPHDB_ENDPOINT;

app.use(cors({
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/graphdb/query', async (req, res) => {
    const query = req.query.query;
    try {
        const response = await axios.get(graphDBEndpoint, {
            params: { query },
            headers: { 'Accept': 'application/json' }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send(`Query Error: ${error.toString()}`);
    }
});

app.post('/graphdb/data', async (req, res) => {
    const data = req.body.data;
    try {
        const response = await axios.post(graphDBEndpoint, data, {
            headers: {
                'Content-Type': 'application/sparql-update'
            }
        });
        res.send('Data inserted successfully');
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            res.status(error.response.status).send(`Server Error: ${error.response.data}`);
        } else if (error.request) {
            // No response received
            res.status(500).send('No response received from the server');s
        } else {
            // Error setting up the request
            res.status(500).send(`Request Error: ${error.message}`);
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
