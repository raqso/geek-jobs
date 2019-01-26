import puppeteer from 'puppeteer';
import JobFetcher from './JobFetcher';
import Linkedin from './sites/Linkedin';

export default async function launchScrapping() {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: false,
        devtools: false
    });

    await new JobFetcher(browser, [new Linkedin(browser)]).start();
    browser.close();
  } catch (error) {
    console.warn('Error has been occured! ', error);
  }
}