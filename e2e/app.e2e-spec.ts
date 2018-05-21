import { RSSReaderPage } from './app.po';

describe('rss-reader App', function() {
  let page: RSSReaderPage;

  beforeEach(() => {
    page = new RSSReaderPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
