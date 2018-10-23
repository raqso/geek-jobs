import puppeteer from 'puppeteer';
import JobFetcher from './JobFetcher';

async function run() {
  const browser = await puppeteer.launch({
    // headless: false,
    // devtools: true
  });

  new JobFetcher(browser).start();
}

run();
