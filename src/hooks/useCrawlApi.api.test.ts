import {
  fetchUrlsApi,
  addUrlApi,
  deleteSelectedUrlsApi,
  bulkAnalysisApi,
  stopAnalysisApi,
  fetchRecordByIdApi
} from './useCrawlApi';

describe('Crawl API functions', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches all URLs', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ urls: [{ id: '3', url: 'http://books.toscrape.com/' }] })
    });
    const urls = await fetchUrlsApi();
    expect(urls).toEqual([{ id: '3', url: 'http://books.toscrape.com/' }]);
  });

  it('adds a URL', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    const result = await addUrlApi('http://books.toscrape.com/');
    expect(result).toBe(true);
  });

  it('deletes selected URLs', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    const result = await deleteSelectedUrlsApi(['1']);
    expect(result).toBe(true);
  });

  it('bulk analysis', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    const result = await bulkAnalysisApi(['1']);
    expect(result).toBe(true);
  });

  it('stop analysis', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    const result = await stopAnalysisApi(['1']);
    expect(result).toBe(true);
  });

  it('fetches record by id', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '3', url: 'http://books.toscrape.com/' })
    });
    const record = await fetchRecordByIdApi('1');
    expect(record).toEqual({ id: '3', url: 'http://books.toscrape.com/' });
  });
});
