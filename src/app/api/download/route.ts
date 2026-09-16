import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getClient(site: string) {
  const SITE_CONFIG: Record<string, { url: string; key: string }> = {
    com: { url: process.env.SUPABASE_URL_COM || '', key: process.env.SUPABASE_SERVICE_KEY_COM || '' },
    co: { url: process.env.SUPABASE_URL_CO || '', key: process.env.SUPABASE_SERVICE_KEY_CO || '' },
    ai: { url: process.env.SUPABASE_URL_AI || '', key: process.env.SUPABASE_SERVICE_KEY_AI || '' },
  };
  const config = SITE_CONFIG[site];
  if (!config?.url || !config?.key) return null;
  return createClient(config.url, config.key);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const site = searchParams.get('site') || 'co'; // default to co
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  const client = getClient(site);
  
  if (client) {
    try {
      // Find the document by URL to increment its download counter
      const { data } = await client.from('pdf_documents').select('id, downloads').eq('url', targetUrl).single();
      
      if (data) {
        // Increment download count
        await client.from('pdf_documents').update({ downloads: (data.downloads || 0) + 1 }).eq('id', data.id);
      }
    } catch (e) {
      console.error('Error tracking download:', e);
      // We don't fail the download if tracking fails, just log it.
    }
  }

  // Determine the redirect URL
  let redirectUrl = targetUrl;
  
  // If it's a Supabase storage URL, we can force a download by appending ?download=
  // (Assuming it doesn't already have query parameters)
  if (targetUrl.includes('supabase.co/storage') && !targetUrl.includes('?download')) {
    redirectUrl = targetUrl.includes('?') ? `${targetUrl}&download=` : `${targetUrl}?download=`;
  }

  return NextResponse.redirect(redirectUrl);
}
