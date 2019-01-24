import Job from '../Job';
import RenderedSite from '../RenderedSite';

export default class CrossWeb extends RenderedSite {
  readonly name = 'CrossWeb';
  readonly logoImage =
    'https://crossweb.pl/job/wp-content/themes/kariera/img/crossjob-logo-podstawowe.png';
  readonly address = 'https://crossweb.pl';
  readonly endpointAddress = 'https://crossweb.pl/job/oferty-pracy';
  private isLast = false;

  protected async goToNextPage() {
    this.isLast = true; // this portal has only one page with offers
    await this.page.goto(this.endpointAddress);
  }
  protected async isLastPage() {
    return this.isLast;
  }

  protected async getJobsForThePage() {
    const listLength: number = await this.page.evaluate((sel: string) => {
      return document.querySelectorAll(sel).length;
    }, this.selectors.lengthClass);
    let jobOffers: Job[] = [];

    for (let i = 1; i <= listLength; i++) {
      const [
        positionSelector,
        citySelector,
        companySelector,
        technologiesSelector
      ] = this.replaceTextToIndex([
        this.selectors.listPosition,
        this.selectors.listCity,
        this.selectors.listCompanyLogo,
        this.selectors.listTechnologies
      ], i);

      const position = await this.page.evaluate((sel: string) => {
        const element = document.querySelector(
          sel + ' > div'
        ) as HTMLDivElement;
        return element ? element.innerText : null;
      }, positionSelector);

      if (position) {
        const offerLink = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLAnchorElement;
          return element ? element.href : null;
        }, positionSelector);

        const location = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLDivElement;
          return element ? element.innerText.trim() : null;
        }, citySelector);

        const companyLogo = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLImageElement;
          return element ? element.src : null;
        }, companySelector);

        const technologies = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLDivElement;
          return element ? element.innerText : null;
        }, technologiesSelector);

        jobOffers.push({
          dateCrawled: new Date(),
          link: offerLink,
          location: location,
          position: position,
          company: this.getCompanyName(companyLogo),
          companyLogo: companyLogo,
          technologies: this.getTechnologies(technologies),
          website: this.name,
          portalLogo: this.logoImage
        } as Job);
      }
    }

    await this.fillOfferDetails(jobOffers);
    return jobOffers;
  }

  private getCompanyName(logoUrl: string) {
    if (logoUrl) {
      const regexPattern = /(?!Logo|logo)([A-Z^])\D+/g;
      const splitted = logoUrl.split('/');
      if (splitted.length) {
        const fileName = splitted[splitted.length - 1];
        const companyName = regexPattern.exec(fileName);
        if (companyName && companyName.length) {
          return companyName[0].replace('_', '');
        }
      }
    }

    return null;
  }

  private getTechnologies(technologiesText: string) {
    if (technologiesText) {
      return technologiesText.split(', ');
    }
    return [];
  }

  private async fillOfferDetails(jobOffers: Job[]) {
    for (let fetchedOffer of jobOffers) {
      if (fetchedOffer.link) {
        try {
          const detailsFromOfferPage = await this.getOfferDetails(
            fetchedOffer.link
          );

          if (detailsFromOfferPage) {
            fetchedOffer.addedDate = detailsFromOfferPage.addedDate;
            fetchedOffer.salary = detailsFromOfferPage.salary;
          }
        } catch (error) {
          console.warn('Upss...');
        }
      }
    }
  }

  private async getOfferDetails(
    offerLink: string
  ): Promise<{
    addedDate: Job['addedDate'];
    salary: Job['salary'] | undefined;
  }> {
    await this.page.goto(offerLink, {
      waitUntil: 'domcontentloaded'
    });

    const addedDateText: string = await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLDivElement;
      return element ? element.innerText : null;
    }, this.selectors.detailsAddedDate);
    const salaryText: string = await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLSpanElement;
      return element ? element.innerText : null;
    }, this.selectors.detailsSalary);

    return {
      addedDate: this.getAddedDateObject(addedDateText),
      salary: this.getSalaryArray(salaryText)
    };
  }

  private getAddedDateObject(addedDateText: string) {
    if (addedDateText) {
      const splittedText = addedDateText.split(' ');
      const today = new Date();

      if (splittedText.length > 3 && splittedText[2] === 'dni') {
        const days = splittedText[1];
        today.setDate(today.getDate() - parseInt(days));
        return today;
      } else {
        today.setMonth(today.getMonth() - 1);
        return today;
      }
    } else {
      return null;
    }
  }

  private getSalaryArray(salaryText: string): Job['salary'] {
    if (salaryText) {
      const money = salaryText
        .split('zł')[0]
        .trim()
        .split('-');

      return {
        from: !Number.isNaN(Number(money[0])) ? Number(money[0]) : undefined,
        to: !Number.isNaN(Number(money[1])) ? Number(money[1]) : undefined,
        currency: 'zł'
      };
    } else {
      return undefined;
    }
  }

  readonly selectors = {
    lengthClass: '#container > div.tabRow',
    listPosition: '#container > div.tabRow:nth-child(INDEX) > a',
    listCity: '#container > div.tabRow:nth-child(INDEX) > div.city',
    listCompanyLogo:
      '#container > div.tabRow:nth-child(INDEX) > div.logo > img',
    listTechnologies:
      '#container > div.tabRow:nth-child(INDEX) > div.technology',

    detailsAddedDate: '#content > div.param-add',
    detailsSalary:
      '#content > section:nth-child(11) > div.param > div:nth-child(2) > span'
  };
}
