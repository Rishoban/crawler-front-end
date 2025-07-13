  
import { useCallback, useEffect, useRef, useState } from 'react';
import type { UrlAnalysis, CrawlStatus } from '../types';


const API_BASE = 'http://localhost:8080';

export async function fetchUrlsApi(token?: string) {
  const res = await fetch(`${API_BASE}/crawler/all_data`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error('Failed to fetch URLs');
  const data = await res.json();
  return data.urls;
}

export async function addUrlApi(url: string) {
  const res = await fetch(`${API_BASE}/urls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  if (!res.ok) throw new Error('Failed to add URL');
  return true;
}

export async function deleteSelectedUrlsApi(urls: string[], token?: string) {
  const res = await fetch(`${API_BASE}/crawler/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ urls })
  });
  if (!res.ok) throw new Error('Failed to delete URLs');
  return true;
}

export async function bulkAnalysisApi(urls: string[], token?: string) {
  const res = await fetch(`${API_BASE}/crawler/bulk_analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ url: urls })
  });
  if (!res.ok) throw new Error('Failed to start bulk analysis');
  return true;
}

export async function stopAnalysisApi(urls: string[], token?: string) {
  const res = await fetch(`${API_BASE}/crawler/stop_analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ url: urls })
  });
  if (!res.ok) throw new Error('Failed to stop analysis');
  return true;
}

export async function fetchRecordByIdApi(id: string, token?: string) {
  const res = await fetch(`${API_BASE}/crawler/record/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error('Failed to fetch detail');
  return await res.json();
}

export function useCrawlApi() {
  const [urls, setUrls] = useState<UrlAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const urls = await fetchUrlsApi(token || undefined);
      setUrls(urls);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const addUrl = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      await addUrlApi(url);
      await fetchUrls();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [fetchUrls]);

  const deleteSelectedUrls = useCallback(async (urls: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      await deleteSelectedUrlsApi(urls, token || undefined);
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
      await bulkAnalysisApi(urls, token || undefined);
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
      await stopAnalysisApi(urls, token || undefined);
      await fetchUrls();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [fetchUrls]);

  const fetchRecordById = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem('authToken');
      return await fetchRecordByIdApi(id, token || undefined);
    } catch (e) {
      return null;
    }
  }, []);

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
    fetchRecordById,
  };
}
