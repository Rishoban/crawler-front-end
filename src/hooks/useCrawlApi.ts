import { useCallback, useEffect, useRef, useState } from 'react';
import type { UrlAnalysis, CrawlStatus } from '../types';

const API_BASE = 'http://localhost:8080';

export function useCrawlApi() {
  const [urls, setUrls] = useState<UrlAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all URLs
  const fetchUrls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE}/crawler/all_data`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error('Failed to fetch URLs');
      const data = await res.json();
      setUrls(data.urls);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new URL
  const addUrl = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/urls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (!res.ok) throw new Error('Failed to add URL');
      await fetchUrls();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [fetchUrls]);

  // Delete URLs (bulk)
 // Bulk delete selected URLs (for /crawler/delete endpoint)
  const deleteSelectedUrls = useCallback(async (urls: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE}/crawler/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ urls })
      });
      if (!res.ok) throw new Error('Failed to delete URLs');
      await fetchUrls();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [fetchUrls]);

  

   const bulkAnalysis = useCallback(async (urls: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE}/crawler/bulk_analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ url: urls })
      });
      if (!res.ok) throw new Error('Failed to start bulk analysis');
      await fetchUrls();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [fetchUrls]);

  const stopAnalysis = useCallback(async (urls: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE}/crawler/stop_analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ url: urls })
      });
      if (!res.ok) throw new Error('Failed to stop analysis');
      await fetchUrls();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [fetchUrls]);

  // Polling for real-time status
  useEffect(() => {
    fetchUrls();
    const interval = setInterval(fetchUrls, 3000);
    return () => clearInterval(interval);
  }, [fetchUrls]);

  return {
    urls,
    loading,
    error,
    fetchUrls,
    addUrl,
    bulkAnalysis,
    stopAnalysis,
    deleteSelectedUrls,
  };
}
