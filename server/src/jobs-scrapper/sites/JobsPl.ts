import RenderedSite from '../RenderedSite';
import Job from '../Job';

export default class JobsPl extends RenderedSite {
  readonly name = 'Jobs.pl';
  readonly address = 'https://www.jobs.pl';
  readonly logoImage = 'https://www.jobs.pl/assets/images/jobs-logo.png';
  readonly endpointAddress =
    'https://www.jobs.pl/praca/it-rozwoj-oprogramowania/dolnoslaskie?locations[0]=8194&locations[1]=8198&locations[2]=8205&locations[3]=8206&locations[4]=8195&locations[5]=8200&locations[6]=8203&locations[7]=8202&locations[8]=8197&locations[9]=8207&locations[10]=8201&locations[11]=8199&locations[12]=8196&locations[13]=8204&locations[14]=8208';

  protected goToNextPage = async () => await this.goToNextPageViaLastPageLink(this.selectors.lastPage);

  protected async isLastPage() {
    return await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLAnchorElement;
      return element.innerText !== '>';
    }, this.selectors.lastPage);
  }

  protected async getJobsForThePage() {
    const listLength = await this.page.evaluate((selector: string) => {
      return document.querySelectorAll(selector).length;
    }, this.selectors.offersLength);

    let jobOffers: Job[] = [];
    for (let i = 1; i <= listLength; i++) {
      const [
        positionSelector,
        citySelector,
        companySelector,
        addedDateSelector,
        salarySelector,
        logoSelector
      ] = this.replaceTextToIndex(
        [
          this.selectors.listPosition,
          this.selectors.listCity,
          this.selectors.listCompany,
          this.selectors.listAddedDate,
          this.selectors.listSalary,
          this.selectors.listLogo
        ],
        i
      );

      const position = await this.page.evaluate((sel: string) => {
        const element = document.querySelector(sel) as HTMLAnchorElement;
        return element ? element.innerText : null;
      }, positionSelector);

      if (position) {
        const offerLink = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLAnchorElement;
          return element ? element.href : null;
        }, positionSelector);

        const location = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLParagraphElement;
          return element ? element.innerText.split('(')[0].trim() : null;
        }, citySelector);

        const salary = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLParagraphElement;
          return element ? element.innerText.trim() : null;
        }, salarySelector);

        const addedDate = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLParagraphElement;
          return element ? element.innerText : null;
        }, addedDateSelector);

        const company = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLParagraphElement;
          return element ? element.innerText : null;
        }, companySelector);

        const logo = await this.page.evaluate((sel: string) => {
            const element = document.querySelector(sel) as HTMLImageElement;
            return element ? element.src : null;
          }, logoSelector);

        jobOffers.push({
          addedDate: this.getDateObject(addedDate),
          dateCrawled: new Date(),
          link: offerLink,
          location: location,
          position: position,
          salary: this.getSalary(salary),
          company: company,
          companyLogo: logo,
          website: this.name,
          portalLogo: this.logoImage
        } as Job);
      }
    }
    return jobOffers;
  }

  private getDateObject(dateText: string) {
    if (dateText && dateText.split('.').length) {
      return new Date(
        dateText
          .split('.')
          .reverse()
          .join('-')
      );
    } else {
      return null;
    }
  }

  private getSalary(salaryText: string) {
    if (salaryText) {
      const splitted = salaryText
        .replace(' -', '')
        .split(' ');

      return {
        from: parseInt(splitted[0]),
        to: parseInt(splitted[1]),
        currency: splitted[2]
      };
    }
    else {
        return null;
    }
  }

  readonly selectors = {
    lastPage: '#subpage > div.right-23 > div.pagination > p > :last-child',
    offersLength: '#subpage > div.right-23 > div > div.offer',
    listPosition:
      '#subpage > div.right-23 > div > div.offer:nth-child(INDEX) > div.details > p.title > a',
    listCity:
      '#subpage > div.right-23 > div > div.offer:nth-child(INDEX) > div.details > p.localization',
    listCompany:
      '#subpage > div.right-23 > div > div.offer:nth-child(INDEX) > div.details > p.employer',
    listLogo:
      '#subpage > div.right-23 > div > div.offer:nth-child(INDEX) > div.logo > img',
    listAddedDate:
      '#subpage > div.right-23 > div > div.offer:nth-child(INDEX) > div.details > p.date',
    listSalary:
      '#subpage > div.right-23 > div > div.offer:nth-child(INDEX) > div.details > p.pay'
  };
}
