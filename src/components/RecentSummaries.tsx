'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ExternalLink, FileText, Languages } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BlogSummary {
  id: string;
  url: string;
  title: string;
  summary: string;
  summary_urdu: string;
  created_at: string;
}

export default function RecentSummaries() {
  const [summaries, setSummaries] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const response = await fetch('/api/summaries?limit=10');
      const data = await response.json();
      
      if (data.success) {
        setSummaries(data.data);
      }
    } catch (error) {
      console.error('Error fetching summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-2">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">No summaries yet</h3>
            <p className="text-muted-foreground">
              Start by scraping your first blog post!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recent Summaries</h2>
        <Badge variant="secondary">
          {summaries.length} summaries
        </Badge>
      </div>

      <div className="grid gap-4">
        {summaries.map((summary) => (
          <Card key={summary.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 mb-1">
                    {summary.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatDate(summary.created_at)}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(summary.url, '_blank')}
                  className="ml-3"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">English Summary</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {summary.summary}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Languages className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Urdu Translation</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3" dir="rtl">
                    {summary.summary_urdu}
                  </p>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground truncate">
                    <span className="font-medium">Source:</span> {summary.url}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
