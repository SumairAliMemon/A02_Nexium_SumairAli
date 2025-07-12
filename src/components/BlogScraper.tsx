'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileText, Globe, Languages, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ScrapeResult {
  id: string;
  url: string;
  title: string;
  summary: string;
  summary_urdu: string;
  mongo_id: string;
}

export default function BlogScraper() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
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
        throw new Error(data.error || 'Failed to scrape the webpage');
      }

      setResult(data.data);
      toast({
        title: "Success!",
        description: "Blog content has been scraped and summarized successfully",
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to scrape the webpage",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Blog Scraper & Summarizer
        </h1>
        <p className="text-lg text-muted-foreground">
          Extract, summarize, and translate blog content with AI
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Enter Blog URL
          </CardTitle>
          <CardDescription>
            Paste the URL of any blog post to extract, summarize, and translate its content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Blog URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/blog-post"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scraping & Processing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Scrape & Summarize
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                English Summary
              </CardTitle>
              <CardDescription>
                AI-generated summary of the blog content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{result.title}</h3>
                  <p className="text-sm text-muted-foreground break-all">
                    {result.url}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed">{result.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Urdu Translation
              </CardTitle>
              <CardDescription>
                Translated summary in Urdu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg mb-2" dir="rtl">
                    {result.title}
                  </h3>
                  <p className="text-sm text-muted-foreground break-all">
                    {result.url}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed" dir="rtl">
                    {result.summary_urdu}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">1. Scrape</h3>
              <p className="text-sm text-muted-foreground">
                Extract content from the blog URL
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold">2. Summarize</h3>
              <p className="text-sm text-muted-foreground">
                Generate AI-powered summary
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Languages className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">3. Translate</h3>
              <p className="text-sm text-muted-foreground">
                Translate summary to Urdu
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold">4. Store</h3>
              <p className="text-sm text-muted-foreground">
                Save in database for future access
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
