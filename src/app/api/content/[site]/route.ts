import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getClient(site: string) {
  const SITE_CONFIG: Record<string, { url: string; key: string }> = {
    com: {
      url: process.env.SUPABASE_URL_COM || '',
      key: process.env.SUPABASE_SERVICE_KEY_COM || '',
    },
    co: {
      url: process.env.SUPABASE_URL_CO || '',
      key: process.env.SUPABASE_SERVICE_KEY_CO || '',
    },
    ai: {
      url: process.env.SUPABASE_URL_AI || '',
      key: process.env.SUPABASE_SERVICE_KEY_AI || '',
    },
  };

  const config = SITE_CONFIG[site];
  if (!config?.url || !config?.key) return null;
  
  // Ignore dummy credentials used in .env.example
  if (config.url.includes('xxx.supabase') || config.url.includes('zzz.supabase')) return null;

  return createClient(config.url, config.key);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ site: string }> }) {
  try {
    const { site } = await params;
    const { searchParams } = new URL(req.url);
    const table = searchParams.get('table') || 'page_content';
    const id = searchParams.get('id');

    const client = getClient(site);
    if (!client) {
      // If no client is configured, return an empty response so the editor can gracefully load defaults
      return NextResponse.json({ data: null, message: `Missing credentials for ${site}` }, { status: 200 });
    }

    let query = client.from(table).select('*');
    if (id) query = query.eq('id', id);
    if (table === 'pdf_documents') query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("API GET Error:", err);
    return NextResponse.json({ error: `Internal API Error: ${err.message}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ site: string }> }) {
  try {
    const { site } = await params;
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const { table = 'page_content', record } = body;

    const client = getClient(site);
    if (!client) return NextResponse.json({ error: 'Supabase credentials missing for this site.' }, { status: 400 });

    const { data, error } = await client.from(table).upsert(record).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("API POST Error:", err);
    return NextResponse.json({ error: `Internal API Error: ${err.message}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;
  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table');
  const id = searchParams.get('id');

  if (!table || !id) return NextResponse.json({ error: 'Missing table or id' }, { status: 400 });

  const client = getClient(site);
  if (!client) return NextResponse.json({ error: 'Supabase credentials missing for this site.' }, { status: 400 });

  const { data, error } = await client.from(table).delete().eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
