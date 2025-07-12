
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ScrapeResult {
  title: string;
  summary: string;
  summary_urdu: string;
  full_text: string;
}

interface Summary {
  id: string;
  url: string;
  title: string;
  summary: string;
  summary_urdu: string;
  created_at: string;
}

interface FullText {
  _id: string;
  url: string;
  title: string;
  content: string;
  scraped_at: string;
}

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState('');
  
  // View states
  const [viewMode, setViewMode] = useState<'scraper' | 'summaries' | 'full-texts'>('scraper');
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [fullTexts, setFullTexts] = useState<FullText[]>([]);
  const [summaryPagination, setSummaryPagination] = useState<PaginationData | null>(null);
  const [fullTextPagination, setFullTextPagination] = useState<PaginationData | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaries = async (page: number = 1) => {
    setLoadingData(true);
    try {
      const response = await fetch(`/api/summaries?page=${page}`);
      const data = await response.json();
      if (data.success) {
        setSummaries(data.data.summaries);
        setSummaryPagination(data.data.pagination);
      }
    } catch (err) {
      setError('Failed to fetch summaries');
    } finally {
      setLoadingData(false);
    }
  };

  const fetchFullTexts = async (page: number = 1) => {
    setLoadingData(true);
    try {
      const response = await fetch(`/api/full-texts?page=${page}`);
      const data = await response.json();
      if (data.success) {
        setFullTexts(data.data.full_texts);
        setFullTextPagination(data.data.pagination);
      }
    } catch (err) {
      setError('Failed to fetch full texts');
    } finally {
      setLoadingData(false);
    }
  };

  const handleViewChange = (mode: 'scraper' | 'summaries' | 'full-texts') => {
    setViewMode(mode);
    setError('');
    setResult(null);
    
    if (mode === 'summaries') {
      fetchSummaries();
    } else if (mode === 'full-texts') {
      fetchFullTexts();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          Blog Scraper & AI Summarizer
        </h1>
        
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            variant={viewMode === 'scraper' ? 'default' : 'outline'}
            onClick={() => handleViewChange('scraper')}
          >
            Scraper
          </Button>
          <Button 
            variant={viewMode === 'summaries' ? 'default' : 'outline'}
            onClick={() => handleViewChange('summaries')}
          >
            Get Summaries
          </Button>
          <Button 
            variant={viewMode === 'full-texts' ? 'default' : 'outline'}
            onClick={() => handleViewChange('full-texts')}
          >
            Get Full Texts
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-4 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Scraper View */}
        {viewMode === 'scraper' && (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Enter Blog URL</CardTitle>
                <CardDescription>
                  Paste any blog URL to extract, summarize, and translate content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="url"
                    placeholder="https://example.com/blog-post"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Scrape & Summarize'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>English Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-2">{result.title}</h3>
                    <p className="text-gray-700">{result.summary}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Urdu Translation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-2" dir="rtl">{result.title}</h3>
                    <p className="text-gray-700" dir="rtl">{result.summary_urdu}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}

        {/* Summaries View */}
        {viewMode === 'summaries' && (
          <>
            {loadingData ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {summaries.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">No summaries found</p>
                    </CardContent>
                  </Card>
                ) : (
                  summaries.map((summary) => (
                    <Card key={summary.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{summary.title}</CardTitle>
                        <CardDescription>
                          <a href={summary.url} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline">
                            {summary.url}
                          </a>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-semibold mb-2">English Summary</h4>
                            <p className="text-gray-700 text-sm">{summary.summary}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Urdu Translation</h4>
                            <p className="text-gray-700 text-sm" dir="rtl">{summary.summary_urdu}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
                
                {/* Pagination for Summaries */}
                {summaryPagination && summaryPagination.total_pages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: summaryPagination.total_pages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={summaryPagination.current_page === i + 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => fetchSummaries(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Full Texts View */}
        {viewMode === 'full-texts' && (
          <>
            {loadingData ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {fullTexts.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">No full texts found</p>
                    </CardContent>
                  </Card>
                ) : (
                  fullTexts.map((fullText) => (
                    <Card key={fullText._id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{fullText.title}</CardTitle>
                        <CardDescription>
                          <a href={fullText.url} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline">
                            {fullText.url}
                          </a>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="max-h-96 overflow-y-auto">
                          <p className="text-gray-700 text-sm whitespace-pre-wrap">{fullText.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
                
                {/* Pagination for Full Texts */}
                {fullTextPagination && fullTextPagination.total_pages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: fullTextPagination.total_pages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={fullTextPagination.current_page === i + 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => fetchFullTexts(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
  