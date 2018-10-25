import puppeteer from 'puppeteer';
import JobFetcher from './back/jobs-scrapper/JobFetcher';

async function run() {
  const browser = await puppeteer.launch({
    // headless: false
    // devtools: true
  });

  await new JobFetcher(browser).start();
}

try {
  // run();
} catch (error) {
  console.warn('Error has been occured! ', error);
}