import https from 'https';

export class GetData {
  static getRequest(url: string) {
    try {
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
      });
    } catch (error) {
      console.warn('Error has occured!', error);
      return new Promise((_resolve, reject) => reject(error));
    }
  }
}