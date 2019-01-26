import Job from '../Job';
import RenderedSite from '../RenderedSite';

export default class ForProgrammers extends RenderedSite {
  readonly name = '4Programmers.net';
  readonly logoImage = 'https://static.4programmers.net/img/logo.png';
  readonly address = 'https://4programmers.net';
  readonly endpointAddress = 'https://4programmers.net/Praca';

  protected goToNextPage = async () => await this.goToNextPageViaLastPageLink(this.selectors.lastPageButton + ' > a');

  protected async isLastPage() {
    const lastButtonValue = await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLUListElement;
      return element ? element.innerText : '';
    }, this.selectors.lastPageButton);

    return lastButtonValue !== '»';
  }

  protected async getJobsForThePage() {
    const listLength = await this.page.evaluate((sel: string) => {
      return document.querySelectorAll(sel).length;
    }, this.selectors.lengthClass);

    let jobOffers: Job[] = [];
    for (let i = 1; i <= listLength; i++) {
      const [positionSelector, companySelector, companyLogoSelector, citySelector, technologiesSelector, salarySelector, addedDateSelector] = this.replaceTextToIndex([
        this.selectors.listPosition,
        this.selectors.listCompany,
        this.selectors.listCompanyLogo,
        this.selectors.listCity,
        this.selectors.listTechnologies,
        this.selectors.listSalary,
        this.selectors.listAddedDate
      ] , i);

      const position = await this.page.evaluate((sel: string) => {
        const element = document.querySelector(sel) as HTMLAnchorElement;
        return element ? element.innerText : null;
      }, positionSelector);

      if (position) {
        const offerLink = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLAnchorElement;
          return element ? element.href : null;
        }, positionSelector);

        const company = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLAnchorElement;
          return element ? element.innerText : null;
        }, companySelector);

        const companyLogo = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLImageElement;
          return element ? element.src : null;
        }, companyLogoSelector);

        const location = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLAnchorElement;
          return element ? element.innerText : null;
        }, citySelector);

        const salary = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLElement;
          return element ? element.innerText : null;
        }, salarySelector);

        const technologies = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLUListElement;
          return element ? element.innerText : null;
        }, technologiesSelector);

        const addedDate = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(
            sel
          ) as HTMLTableDataCellElement;
          return element ? element.innerText.trim() : null;
        }, addedDateSelector);

        jobOffers.push({
          addedDate: this.getOfferDate(addedDate),
          company: company,
          companyLogo: companyLogo,
          dateCrawled: new Date(),
          link: offerLink,
          location: location,
          position: position,
          technologies: this.getTechnologiesArray(technologies),
          salary: this.getSalary(salary),
          website: this.name,
          portalLogo: this.logoImage
        } as Job);
      }
    }
    return jobOffers;
  }

  private getSalary(salaryText: string): Job['salary'] {
    if (salaryText && salaryText.split(' - ').length === 2) {
      const splittedText = salaryText.split(' - ');
      return {
        from: Number(this.clearSalaryString(splittedText[0])),
        to: Number(this.clearSalaryString(splittedText[1].split(' ')[0])),
        currency: this.clearSalaryString(splittedText[1].split(' ')[1])
      };
    } else {
      return undefined;
    }
  }

  private clearSalaryString(salaryText: string) {
    if (salaryText) {
      return salaryText.replace(/( |\r\n\t|\n|\r\t )/gm, '');
    } else {
      return '';
    }
  }

  private getTechnologiesArray(technologies: string) {
    if (technologies) {
      return technologies.split(' ');
    } else {
      return [];
    }
  }

  private getOfferDate(created: string) {
    if (created === 'Nowe') {
      return new Date();
    } else if (created && typeof created === 'string') {
      const howMany = Number(created.split(' ')[0]);
      const unit: 'godziny' | 'dni' | 'tygodnie' | string = created.split(
        ' '
      )[1];
      let todayDate = new Date();

      switch (unit) {
        case 'godziny':
        case 'godzinę': {
          todayDate.setHours(todayDate.getHours() - howMany);
          return todayDate;
          break;
        }
        case 'dni':
        case 'dzień': {
          todayDate.setDate(todayDate.getDate() - howMany);
          return todayDate;
          break;
        }
        case 'tydzień':
        case 'tygodnie': {
          todayDate.setDate(todayDate.getDate() - howMany * 7);
          return todayDate;
          break;
        }
        default: {
          return null;
          break;
        }
      }
    } else {
      return null;
    }
  }

  readonly selectors = {
    lastPageButton:
      '#job-main-content > main > nav.pull-left > ul > li:last-child',
    lengthClass: '#box-jobs > table > tbody > tr',
    listPosition:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-body > h2 > a',
    listCompany:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-body > p:nth-child(3) > a',
    listCompanyLogo:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-logo > a > img',
    listCity:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-body > p:nth-child(3) > small > a',
    listSalary:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-salary.hidden-xs.hidden-xxs > p > strong',
    listAddedDate:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-time',
    listTechnologies:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-body > ul'
  };
}
