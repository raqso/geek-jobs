import { Browser } from 'puppeteer';
import Job from '../jobs-scrapper/Job';
import Site from './Site';

abstract class RenderedSite implements Site {
  abstract name: string;
  abstract address: string;
  abstract logoImage: string;
  abstract endpointAddress: string;
  abstract selectors: Object;
  protected page: any;
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

    this.page.close();
    return jobOffers;
  }

  protected async goToNextPageViaLink(lastPageSelector: string) {
    const nextPageLink = await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLAnchorElement;
      return element ? element.href : null;
    }, lastPageSelector);

    await Promise.all([
      this.page.goto(nextPageLink, { waitUntil: 'networkidle0' }),
      this.page.waitForNavigation()
    ]);
  }

  protected replaceTextToIndex(selectors: string[], index: number) {
    let changedSelectors: string[] = [];

    selectors.forEach(selector =>
      changedSelectors.push(selector.replace('INDEX', index.toString()))
    );

    return changedSelectors;
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