import app from './api/Api';
import express = require('express');
import config from './config';

const PORT = config.port;

app.use(express.static('./dist/front'));
app.listen(PORT, '0.0.0.0', () => {
  console.log('Express server listening on port ' + PORT);
});
