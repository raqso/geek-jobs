import Job from '../Job';
import RenderedSite from '../RenderedSite';

export default class Pracuj extends RenderedSite {
  readonly categoryIdItAdministration = '5015';
  readonly categoryIdSoftwareDevelopment = '5016';

  readonly name = 'Pracuj.pl';
  readonly logoImage =
    'data:image/svg+xml;base64,PHN2ZyBjbGFzcz0ibG9nbyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1heCBtZWV0IiB2aWV3Qm94PSIwIDAgMTc5LjU4Mzc2IDUzLjMzMzEyNiIgd2lkdGg9IjE1NSIgaGVpZ2h0PSI0NiI+PGRlZnM+PGNsaXBQYXRoIGlkPSJhIj48cGF0aCBkPSJNMTkuMTU5IDM4LjQ2Yy04LjExNyAwLTE2LjgwOS02Ljk3Mi0xNi44MDktMTcuMzUxIDAtOS41NjYgNy41MzktMTcuMzQ4IDE2LjgwOS0xNy4zNDhoMTA1LjEwM2M5LjI0NyAwIDE2Ljc3MiA3Ljc4MiAxNi43NzIgMTcuMzQ4IDAgMTAuMzc5LTguNjczIDE3LjM1MS0xNi43NzIgMTcuMzUxSDE5LjE1OXoiLz48L2NsaXBQYXRoPjxsaW5lYXJHcmFkaWVudCB4Mj0iMSIgaWQ9ImIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEzOC42ODM1OSAwIDAgLTEzOC42ODM1OSAyLjM1IDIxLjExKSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMWM3NWJjIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMjYyMjYyIi8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGggaWQ9ImMiPjxwYXRoIGQ9Ik0wIDQyLjY2N2gxNDMuNjY3VjBIMHY0Mi42Njd6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIiB0cmFuc2Zvcm09Im1hdHJpeCgxLjI1IDAgMCAtMS4yNSAwIDUzLjMzMykiPjxwYXRoIGQ9Ik0xOS4xNTkgMzguNDZjLTguMTE3IDAtMTYuODA5LTYuOTcyLTE2LjgwOS0xNy4zNTEgMC05LjU2NiA3LjUzOS0xNy4zNDggMTYuODA5LTE3LjM0OGgxMDUuMTAzYzkuMjQ3IDAgMTYuNzcyIDcuNzgyIDE2Ljc3MiAxNy4zNDggMCAxMC4zNzktOC42NzMgMTcuMzUxLTE2Ljc3MiAxNy4zNTFIMTkuMTU5eiIgZmlsbD0idXJsKCNiKSIvPjwvZz48ZyBjbGlwLXBhdGg9InVybCgjYykiIHRyYW5zZm9ybT0ibWF0cml4KDEuMjUgMCAwIC0xLjI1IDAgNTMuMzMzKSI+PHBhdGggZD0iTTIzLjUyIDI2LjE0MmMtMy4zNzMgMC00LjY3NC0yLjUxNi00LjY3NC01LjAwNiAwLTIuNjE3IDEuMzYtNS4wMyA0LjgyMi01LjAzIDMuNDMyIDAgNC41ODUgMi41NCA0LjU4NSA1LjEzNCAwIDIuNDg5LTEuNDc4IDQuOTAyLTQuNzMzIDQuOTAybS03LjEgMS42MTdoMi41MTV2LTEuNzk3aC4wNmMuODI4IDEuNDYzIDIuNzggMi4xMDUgNC44OCAyLjEwNSA0LjcwNSAwIDcuMDQxLTMuMjM0IDcuMDQxLTYuOTgzIDAtMy43NDctMi4zMDctNi45MDQtNi45ODItNi45MDQtMS41NjggMC0zLjgxNi41MTQtNC45NCAyLjA3OWgtLjA1OVY5LjQwNkgxNi40MnYxOC4zNTN6TTMzLjc5IDI3Ljc1OWgyLjM2NnYtMi44aC4wNmMxLjIxMiAyLjEzMiAyLjg5OCAzLjE4NSA1LjYyIDMuMTA4di0yLjMxYy00LjA1MyAwLTUuNTMyLTIuMDAzLTUuNTMyLTUuMzY1di01LjkwNEgzMy43OXYxMy4yN3pNNTMuMTk4IDIxLjM0MmMtLjk3Ny0uNjE2LTIuODctLjY0My00LjU1Ni0uODk4LTEuNjU3LS4yNTctMy4wNzctLjc3MS0zLjA3Ny0yLjM4OCAwLTEuNDM3IDEuNDItMS45NSAyLjk1OC0xLjk1IDMuMzE1IDAgNC42NzUgMS43OTcgNC42NzUgMy4wMDN2Mi4yMzN6bTQuMDgzLTYuODAzYy0uNDQzLS4yMy0xLjAwNi0uMzYtMS44MDUtLjM2LTEuMzAyIDAtMi4xMy42MTYtMi4xMyAyLjA1NS0xLjM5LTEuNDEzLTMuMjU0LTIuMDU0LTUuMzg1LTIuMDU0LTIuNzggMC01LjA1OSAxLjA3OC01LjA1OSAzLjcyMyAwIDMuMDAyIDIuNTc0IDMuNjQ0IDUuMTc4IDQuMDggMi43ODEuNDYzIDUuMTQ4LjMwOCA1LjE0OCAxLjk1IDAgMS45LTEuODA1IDIuMjA5LTMuNDAzIDIuMjA5LTIuMTMgMC0zLjY5OC0uNTY2LTMuODE3LTIuNTE2aC0yLjUxNGMuMTQ4IDMuMjg1IDMuMDc3IDQuNDQgNi40OCA0LjQ0IDIuNzUgMCA1Ljc0LS41MzcgNS43NC0zLjY0NXYtNi44MjdjMC0xLjAyNyAwLTEuNDg4Ljc5Ny0xLjQ4OC4yMDggMCAuNDQ0LjAyNS43Ny4xMjh2LTEuNjk1ek03MC4wMDQgMjMuNDk3Yy0uMzg0IDEuNjctMS43MTYgMi42NDUtMy43ODUgMi42NDUtMy42NDEgMC00Ljc2NS0yLjQ5LTQuNzY1LTUuMTg2IDAtMi40MzggMS4yNzMtNC44NSA0LjQ2OC00Ljg1IDIuNDI2IDAgMy44NzUgMS4yMzEgNC4yIDMuMjM0aDIuNTc1Yy0uNTYzLTMuMjM1LTIuOS01LjE2LTYuNzQ2LTUuMTYtNC42NzQgMC03LjE2IDIuODI0LTcuMTYgNi43NzYgMCAzLjk4IDIuMzY3IDcuMTEgNy4yMiA3LjExIDMuNDYgMCA2LjI0My0xLjQxIDYuNTk3LTQuNTY5aC0yLjYwNHpNODguMTcgMTQuNDg4aC0yLjM2NnYyLjEwNGgtLjA2Yy0xLjA2MS0xLjY0Mi0yLjc3OC0yLjQxMy00Ljk3LTIuNDEzLTQuMDIyIDAtNS4yNjQgMi4wMDItNS4yNjQgNC44NTJ2OC43MjhoMi41MTV2LTguOTg1YzAtMS42MTYgMS4xODItMi42NjkgMy4xMDYtMi42NjkgMy4wNDggMCA0LjUyNiAxLjc3MSA0LjUyNiA0LjE1OHY3LjQ5NmgyLjUxNFYxNC40OXpNOTQuNjI0IDMwLjE0NmgtMi41MTZ2Mi42NjloMi41MTZ2LTIuNjY5em0wLTE3LjM1M2MwLTIuMzYtMS40NS0zLjM4OC0zLjY2OS0zLjM4OC0uNDE0IDAtLjg1Ny4wMjYtMS4zMDIuMTAzdjEuODc0Yy4zNTUtLjA1MS42OC0uMDUxIDEuMDM2LS4wNTEgMS4wOTMgMCAxLjQxOS40NjEgMS40MTkgMS44MjJ2MTQuNjA2aDIuNTE2VjEyLjc5M3pNOTkuMDkxIDE3LjMzN2gzLjI4M3YtMi44NDloLTMuMjgzdjIuODQ5ek0xMTMuOTQ1IDI2LjE0MmMtMy4zNzQgMC00LjY3Ni0yLjUxNi00LjY3Ni01LjAwNiAwLTIuNjE3IDEuMzYyLTUuMDMgNC44MjQtNS4wMyAzLjQzMSAwIDQuNTg1IDIuNTQgNC41ODUgNS4xMzQgMCAyLjQ4OS0xLjQ3OSA0LjkwMi00LjczMyA0LjkwMm0tNy4xMDIgMS42MTdoMi41MTR2LTEuNzk3aC4wNmMuODI4IDEuNDYzIDIuNzgyIDIuMTA1IDQuODgyIDIuMTA1IDQuNzA0IDAgNy4wNDItMy4yMzQgNy4wNDItNi45ODMgMC0zLjc0Ny0yLjMwOS02LjkwNC02Ljk4My02LjkwNC0xLjU2NyAwLTMuODE2LjUxNC00Ljk0IDIuMDc5aC0uMDZWOS40MDZoLTIuNTE1djE4LjM1M3pNMTI0LjQ0OSAzMi44MTVoMi41MTZWMTQuNDg4aC0yLjUxNnYxOC4zMjd6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==';
  readonly address = 'https://pracuj.pl';
  readonly endpointAddress =
    `https://www.pracuj.pl/praca?cc=${this.categoryIdItAdministration}%2c${this.categoryIdSoftwareDevelopment}`;

  protected async isLastPage() {
    const lastButtonText = await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLAnchorElement;
      return element ? element.innerText : '';
    }, this.selectors.lastPageButton);

    return lastButtonText !== '';
  }

  protected goToNextPage = async () => await this.goToNextPageViaLastPageLink(this.selectors.lastPageButton + ' > a');

  protected async getJobsForThePage() {
    let jobOffers: Job[] = [];

    const listLength = await this.page.evaluate((sel: string) => {
      return document.querySelectorAll(sel).length;
    }, this.selectors.lengthClass);

    for (let i = 1; i <= listLength; i++) {
      const [positionSelector, companySelector, companyLogoSelector, citySelector, addedDateSelector] = this.replaceTextToIndex([
        this.selectors.listPosition,
        this.selectors.listCompany,
        this.selectors.listCompanyLogo,
        this.selectors.listCity,
        this.selectors.listAddedDate,
      ], i);

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
          const element = document.querySelector(sel) as HTMLLIElement;
          return element ? element.innerText : null;
        }, citySelector);

        const addedDate = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, addedDateSelector);

        jobOffers.push({
          addedDate: this.getDateObject(addedDate),
          company: company,
          companyLogo: companyLogo,
          dateCrawled: new Date(),
          link: offerLink,
          location: this.getCity(location),
          position: position,
          website: this.name,
          portalLogo: this.logoImage
        } as Job);
      }
    }
    return jobOffers;
  }

  private getDateObject(stringDate: string) {
    if (stringDate) {
      const splittedDate = stringDate.trim().split(' ');
      const year = parseInt(splittedDate[3]);
      const month = parseInt( this.getMonthNumberByName(splittedDate[2]) ) - 1;
      const day = parseInt(splittedDate[1]);

      const date = new Date(year, month, day);

      if (this.isDatevalid(date)) {
        return date;
      }
    }
    return null;
  }

  private getMonthNumberByName(month: string) {
    const months: any = {
      'stycznia': 1,
      'lutego': 2,
      'marca': 3,
      'kwietnia': 4,
      'maja': 5,
      'czerwca': 6,
      'lipca': 7,
      'sierpnia': 8,
      'września': 9,
      'października': 10,
      'listopada': 11,
      'grudnia': 12,
    };
    return months[month];
  }

  private isDatevalid(dateObj: Date) {
    return !isNaN(dateObj.getTime());
  }

  private getCity(location: string) {
    if (location) {
      return location.split(',')[0];
    } else {
      return '';
    }
  }

  readonly selectors = {
    lengthClass: '#results > ul > li',
    lastPageButton:
      '#content > div.page > div.pagination > ul > li:last-child',
    listPosition:
      '#results > ul > li:nth-child(INDEX) > div > div.offer__info > div.offer-details > div.offer-details__text > h3 > a',
    listCompany:
      '#results > ul > li:nth-child(INDEX) > div > div.offer__info > div.offer-details > div.offer-details__text > p > span.offer-company__wrapper > a',
    listCompanyLogo:
      '#results > ul > li:nth-child(INDEX) > div > div.offer__info > div.offer-details > div.offer-logo > a > img',
    listCity:
      '#results > ul > li:nth-child(INDEX) > div > div.offer__info > div.offer-labels__wrapper > ul > li',
    listAddedDate:
      '#results > ul > li:nth-child(INDEX) > div > div.offer-actions > span'
  };
}