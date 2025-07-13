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
  const deleteUrls = useCallback(async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/urls/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      if (!res.ok) throw new Error('Failed to delete URLs');
      await fetchUrls();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [fetchUrls]);

  // Re-run analysis (bulk)
  const rerunAnalysis = useCallback(async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/urls/bulk-rerun`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      if (!res.ok) throw new Error('Failed to re-run analysis');
      await fetchUrls();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [fetchUrls]);

  // Start/Stop processing (bulk)
  const startProcessing = useCallback(async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/urls/bulk-start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      if (!res.ok) throw new Error('Failed to start processing');
      await fetchUrls();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [fetchUrls]);

  const stopProcessing = useCallback(async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/urls/bulk-stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      if (!res.ok) throw new Error('Failed to stop processing');
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
    deleteUrls,
    rerunAnalysis,
    startProcessing,
    stopProcessing,
  };
}
