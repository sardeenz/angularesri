import { ServicerequestPage } from './app.po';

describe('servicerequest App', () => {
  let page: ServicerequestPage;

  beforeEach(() => {
    page = new ServicerequestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
