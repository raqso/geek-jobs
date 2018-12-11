import app from './api/Api';
import express = require('express');

const PORT = 80;

app.use(express.static('./dist/front'));
app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
});