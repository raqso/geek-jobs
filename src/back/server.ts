import app from './api/Api';
import cron from 'node-cron';
import express = require('express');
import launchScrapping from './jobs-scrapper/LaunchScrapping';

const PORT = 80; 

app.use(express.static('./dist/front'));
app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
  launchScrapping();
});

cron.schedule('20 * * * *', () => {
  console.log('running scrapping every hour');
  try {
    // launchScrapping();
  }
  catch (error) {
    console.warn('Error during scrapping! ' + error);
  }
});