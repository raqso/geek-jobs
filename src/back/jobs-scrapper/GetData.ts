import https from 'https';

export class GetData {
  static getRequest(url: string) {
    try {
      return new Promise(function(resolve, reject) {
        https
          .get(url, resp => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', chunk => {
              data += chunk;
            });

            // The whole response has been received. Print out the result.
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