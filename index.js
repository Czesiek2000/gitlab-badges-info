const express = require('express');

const app = express();
const badge = require('./routes/badge');
const generate = require('./routes/generate');
const stats = require('./routes/stats');

app.get('/', (req, res) => {
    res.send('<h1>Go to /badge to get badge informations, or /generate to generate badge easily</h1>');
});

app.use('/badge', badge);
app.use('/generate', generate);
app.use('/stats', stats);

const port = process.env.PORT || 4001;

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
