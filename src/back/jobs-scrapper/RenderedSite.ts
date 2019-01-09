import { Browser } from 'puppeteer';
import Job from '../jobs-scrapper/Job';
import Site from './Site';

abstract class RenderedSite implements Site {
  abstract name: string;
  abstract address: string;
  abstract logoImage: string;
  abstract endpointAddress: string;
  abstract page: any;
  abstract selectors: Object;
  protected abstract isLastPage(): Promise<boolean>;
  protected abstract getJobsForThePage(): Promise<Job[]>;
  protected abstract goToNextPage(): Promise<void>;

  browser: Browser;

  constructor(browserObject: Browser) {
    this.browser = browserObject;
  }

  public async getJobs() {
    let jobOffers: Job[] = [];

    await this.openNewBrowserPage();
    await this.page.goto(this.endpointAddress);

    let isLast = await this.isLastPage();
    while (!isLast) {
      jobOffers.push(
          ...(await this.getJobsForThePage()
          ));

      const [] = await Promise.all([
        this.page.waitForNavigation(),
        this.goToNextPage()
      ]);
      isLast = await this.isLastPage();
    }

    return jobOffers;
  }

  private async openNewBrowserPage() {
    this.page = await this.browser.newPage();
    await this.setFetchingHtmlOnly();
  }

  private async setFetchingHtmlOnly() {
    await this.page.setRequestInterception(true);
    this.page.on('request', (request: any) => {
      if (request.resourceType() === 'document') {
        request.continue();
      } else {
        request.abort();
      }
    });
  }
}

export default RenderedSite;