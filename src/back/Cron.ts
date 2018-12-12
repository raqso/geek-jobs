import cron from 'node-cron';
import launchScrapping from './jobs-scrapper/LaunchScrapping';

async function startTasks() {
  console.log(
    `${new Date().toLocaleString()} First fetching launched.`
  );
  await launchScrapping();

  console.log(`${new Date().toLocaleString()} Cron task added`);
  cron.schedule('0 */6 * * *', async () => {
    try {
      console.log(
        `${new Date().toLocaleString()} Scheudled fetching launched.`
      );
      await launchScrapping();
    } catch (error) {
      console.warn('Error during scrapping! ' + error);
    }
  });
}

startTasks();