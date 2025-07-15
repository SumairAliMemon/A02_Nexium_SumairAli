
'use client';

import ScrambledText from '@/components/ScrambledText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FullTextCardSkeleton, SummaryCardSkeleton } from '@/components/ui/card-skeleton';
import { Input } from '@/components/ui/input';
import { fetchFullTexts } from '@/store/fullTextsSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSummaries } from '@/store/summariesSlice';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ScrapeResult {
  title: string;
  summary: string;
  summary_urdu: string;
  full_text: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState('');
  
  // Redux state and actions
  const dispatch = useAppDispatch();
  const summariesState = useAppSelector((state) => state.summaries);
  const fullTextsState = useAppSelector((state) => state.fullTexts);
  
  // View states
  const [viewMode, setViewMode] = useState<'scraper' | 'summaries' | 'full-texts'>('scraper');

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

  const handleViewChange = (mode: 'scraper' | 'summaries' | 'full-texts') => {
    setViewMode(mode);
    setError('');
    setResult(null);
    
    if (mode === 'summaries') {
      // Only fetch if we haven't fetched before or if we need to refresh
      if (!summariesState.lastFetchedPage) {
        dispatch(fetchSummaries(1));
      }
    } else if (mode === 'full-texts') {
      // Only fetch if we haven't fetched before or if we need to refresh
      if (!fullTextsState.lastFetchedPage) {
        dispatch(fetchFullTexts(1));
      }
    }
  };

  const handleSummariesPageChange = (page: number) => {
    dispatch(fetchSummaries(page));
  };

  const handleFullTextsPageChange = (page: number) => {
    dispatch(fetchFullTexts(page));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#21262d] font-inter p-2 md:p-6 transition-colors duration-700">
      <div className="max-w-4xl mx-auto">
        <ScrambledText
          className="text-4xl md:text-5xl font-extrabold text-center mb-10 tracking-tight"
          radius={120}
          duration={1.2}
          speed={0.5}
          scrambleChars={'.:'}
        >
          BlogBriefBot
        </ScrambledText>
        {/* GitHub-style Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Button 
            variant={viewMode === 'scraper' ? 'default' : 'outline'}
            size="lg"
            className={`rounded-md px-6 py-2 font-semibold border border-[#30363d] shadow-lg transition-all duration-300 ${viewMode === 'scraper' ? 'bg-gradient-to-r from-[#238636] to-[#2ea043] text-white scale-105 hover:scale-110 hover:shadow-xl' : 'bg-[#161b22] text-[#c9d1d9] hover:bg-[#21262d] hover:scale-105'}`}
            onClick={() => handleViewChange('scraper')}
          >
            Scraper
          </Button>
          <Button 
            variant={viewMode === 'summaries' ? 'default' : 'outline'}
            size="lg"
            className={`rounded-md px-6 py-2 font-semibold border border-[#30363d] shadow-lg transition-all duration-300 ${viewMode === 'summaries' ? 'bg-gradient-to-r from-[#0969da] to-[#218bff] text-white scale-105 hover:scale-110 hover:shadow-xl' : 'bg-[#161b22] text-[#c9d1d9] hover:bg-[#21262d] hover:scale-105'}`}
            onClick={() => handleViewChange('summaries')}
          >
            Get Summaries
          </Button>
          <Button 
            variant={viewMode === 'full-texts' ? 'default' : 'outline'}
            size="lg"
            className={`rounded-md px-6 py-2 font-semibold border border-[#30363d] shadow-lg transition-all duration-300 ${viewMode === 'full-texts' ? 'bg-gradient-to-r from-[#8250df] to-[#a371f7] text-white scale-105 hover:scale-110 hover:shadow-xl' : 'bg-[#161b22] text-[#c9d1d9] hover:bg-[#21262d] hover:scale-105'}`}
            onClick={() => handleViewChange('full-texts')}
          >
            Get Full Texts
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-4 border-red-300 bg-red-100 animate-pulse">
            <CardContent className="pt-6">
              <p className="text-red-700 text-center font-semibold">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Scraper View */}
        {viewMode === 'scraper' && (
          <>
            <Card className="mb-10 shadow-xl border-2 border-indigo-400/30">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-bold text-gray-100">Enter Blog URL</CardTitle>
                <CardDescription className="text-base text-gray-300">
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
                    className="rounded-lg border-2 border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
                  />
                  <Button type="submit" disabled={loading} className="w-full py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md hover:scale-105 transition-transform">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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
              <div className="grid gap-8 md:grid-cols-2">
                <Card className="shadow-lg border-2 border-indigo-300/30 bg-white/80">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-indigo-700">English Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-2 text-indigo-900">{result.title}</h3>
                    <p className="text-gray-800 text-base leading-relaxed">{result.summary}</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-2 border-pink-300/30 bg-white/80">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-pink-700">Urdu Translation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-2 text-pink-900" dir="rtl">{result.title}</h3>
                    <p className="text-gray-800 text-base leading-relaxed" dir="rtl">{result.summary_urdu}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}

        {/* Summaries View */}
        {viewMode === 'summaries' && (
          <>
            {summariesState.loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SummaryCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {summariesState.summaries.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-400">No summaries found</p>
                    </CardContent>
                  </Card>
                ) : (
                  summariesState.summaries.map((summary) => (
                    <Card key={summary.id}>
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-100">{summary.title}</CardTitle>
                        <CardDescription>
                          <a href={summary.url} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-400 hover:text-blue-300 hover:underline">
                            {summary.url}
                          </a>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-semibold mb-2 text-gray-200">English Summary</h4>
                            <p className="text-gray-300 text-sm">{summary.summary}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 text-gray-200">Urdu Translation</h4>
                            <p className="text-gray-300 text-sm" dir="rtl">{summary.summary_urdu}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
                
                {/* Pagination for Summaries */}
                {summariesState.pagination && summariesState.pagination.total_pages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: summariesState.pagination.total_pages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={summariesState.pagination?.current_page === i + 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleSummariesPageChange(i + 1)}
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
            {fullTextsState.loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <FullTextCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {fullTextsState.fullTexts.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-400">No full texts found</p>
                    </CardContent>
                  </Card>
                ) : (
                  fullTextsState.fullTexts.map((fullText) => (
                    <Card key={fullText._id}>
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-100">{fullText.title}</CardTitle>
                        <CardDescription>
                          <a href={fullText.url} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-400 hover:text-blue-300 hover:underline">
                            {fullText.url}
                          </a>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="max-h-96 overflow-y-auto">
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">{fullText.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
                
                {/* Pagination for Full Texts */}
                {fullTextsState.pagination && fullTextsState.pagination.total_pages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: fullTextsState.pagination.total_pages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={fullTextsState.pagination?.current_page === i + 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFullTextsPageChange(i + 1)}
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
  