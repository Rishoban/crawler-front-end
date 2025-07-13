export type CrawlStatus = 'queued' | 'running' | 'done' | 'error';

export interface BrokenLink {
  url: string;
  status: number;
}

export interface UrlAnalysis {
  id: string;
  url: string;
  htmlVersion: string;
  title: string;
  headings: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  internalLinks: number;
  externalLinks: number;
  inaccessibleLinks: number;
  hasLoginForm: boolean;
  status: CrawlStatus;
  brokenLinks: BrokenLink[];
  createdAt: string;
  updatedAt: string;
}
