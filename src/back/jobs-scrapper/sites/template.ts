export default class Template implements Site {
    name = 'Template';
    address = 'https://template.com';
    endpointAddress = 'https://template.com/api/offers';
  getJobs() {
      return [];
  }
}