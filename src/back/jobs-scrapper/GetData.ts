import https from 'https';

export class GetData {
  static getRequest(url: string) {
    return new Promise(function(resolve, reject) {
      https
        .get(url, resp => {
          let data = '';

          resp.on('data', chunk => {
            data += chunk;
          });

          resp.on('end', () => {
            resolve(data);
          });
        })
        .on('error', err => {
          reject(err);
        });
    }).catch(error => {
      console.warn('Error has occured!', error);
      return new Promise((_resolve, reject) => reject(error));
    });
  }

  static getOfferDate(created: string) {
    let todayDate = new Date();

    if (GetData.isOfferNew(created)) {
      return todayDate;
    } else if (created) {
      const howMany = Number(created.split(' ')[0]);
      const unit: OfferDateUnit | string = created.split(' ')[1];

      if (hours.includes(unit)) {
        todayDate.setHours(todayDate.getHours() - howMany);
        return todayDate;
      } else if (days.includes(unit)) {
        todayDate.setDate(todayDate.getDate() - howMany);
        return todayDate;
      } else if (weeks.includes(unit)) {
        todayDate.setDate(todayDate.getDate() - howMany * 7);
        return todayDate;
      } else if (months.includes(unit)) {
        todayDate.setMonth(todayDate.getMonth() - howMany);
        return todayDate;
      }
    }

    return null;
  }

  private static isOfferNew(created: string) {
    return (
      created &&
      (created.toUpperCase() === 'Nowe'.toUpperCase() ||
        created.toUpperCase() === 'Nowe'.toUpperCase())
    );
  }
}

type OfferDateUnit =
  | 'godziny'
  | 'h'
  | 'hour'
  | 'hours'
  | 'godzin'
  | 'godzinę'
  | 'dni'
  | 'dzień'
  | 'd'
  | 'day'
  | 'days'
  | 'tygodnie'
  | 'tygodni'
  | 'tydzień'
  | 'w'
  | 'weeks'
  | 'miesiąc'
  | 'miesiące'
  | 'miesięcy'
  | 'm'
  | 'months';
const hours = ['godziny', 'h', 'hour', 'hours', 'godzin', 'godzinę'];
const days = ['dni', 'dzień', 'd', 'day', 'days'];
const weeks = ['tygodnie', 'tygodni', 'tydzień', 'w', 'weeks'];
const months = ['miesiąc', 'miesiące', 'miesięcy', 'm', 'months'];
