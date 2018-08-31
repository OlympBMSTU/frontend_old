/* eslint no-console: 0 */
'use strict';

const express = require('express');
const app = express();

app.use(express.static('public'));
app.get('*', (req, res) => {
    res.sendFile('public/register.html', {root: '.'});
});

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Server listening on port now: ${port}`);
});