import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// We try to use the service key to bypass RLS, fallback to anon key if not found
const supabaseKey = process.env.SUPABASE_SERVICE_KEY_CO || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('uploads')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filename);
    
    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file: ' + (error.message || String(error)) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 });
    }
    
    // If it's an old local URL (like /uploads/abc.pdf), we just ignore or try to delete locally (but we know it's read-only in production)
    if (url.startsWith('/uploads/')) {
      return NextResponse.json({ success: true, message: 'Skipped local file deletion in production' });
    }

    // Extract filename from Supabase public URL
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/');
    const filename = parts[parts.length - 1];

    if (!filename) {
      return NextResponse.json({ error: 'Could not extract filename from URL' }, { status: 400 });
    }
    
    const { error } = await supabase.storage
      .from('uploads')
      .remove([filename]);
      
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file: ' + (error.message || String(error)) }, { status: 500 });
  }
}
