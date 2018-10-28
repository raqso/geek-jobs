export default class Template implements Site {
    name = 'Template';
    logoImage = 'https://template.com/image.png';
    address = 'https://template.com';
    endpointAddress = 'https://template.com/api/offers';
  getJobs() {
      return [];
  }
}