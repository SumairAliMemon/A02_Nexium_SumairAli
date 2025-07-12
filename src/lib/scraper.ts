import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedContent {
  title: string;
  content: string;
  url: string;
}

export async function scrapeWebpage(url: string): Promise<ScrapedContent> {
  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!urlObj.protocol.startsWith('http')) {
      throw new Error('Invalid URL protocol. Only HTTP and HTTPS are supported.');
    }

    // Fetch the webpage
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 10000, // 10 second timeout
      validateStatus: status => status < 500 // Accept 4xx for custom handling
    });

    // Check for forbidden or not found
    if (response.status === 403) {
      throw new Error('Access forbidden (403)');
    }
    if (response.status === 404) {
      throw new Error('Page not found (404)');
    }
    if (!response.data) {
      throw new Error('No content received');
    }

    // Parse HTML with Cheerio
    const $ = cheerio.load(response.data);

    // Extract title
    let title = $('meta[property="og:title"]').attr('content') || $('title').text().trim();
    if (!title) {
      title = $('h1').first().text().trim();
    }
    if (!title) {
      title = 'Untitled Page';
    }

    // Remove script, style, nav, footer, header, aside, ads, sidebar
    $('script, style, nav, footer, header, aside, .advertisement, .ads, .sidebar').remove();

    // Try to extract main content from <article>, <main>, or <section>
    let content = $('article').text().trim();
    if (!content) {
      content = $('main').text().trim();
    }
    if (!content) {
      content = $('section').text().trim();
    }
    // Fallback: get all paragraphs
    if (!content) {
      content = $('p').map((i, el) => $(el).text()).get().join(' ');
    }
    // Fallback: get all text
    if (!content) {
      content = $.root().text().trim();
    }

    // Clean up excessive whitespace
    content = content.replace(/\s+/g, ' ').trim();

    return {
      title,
      content,
      url
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Page not found (404)');
      } else if (error.response?.status === 403) {
        throw new Error('Access forbidden (403)');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout');
      } else {
        throw new Error(`Network error: ${error.message}`);
      }
    } else if (error instanceof TypeError && error.message.includes('Invalid URL')) {
      throw new Error('Invalid URL format');
    } else {
      throw new Error(`Failed to scrape webpage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
