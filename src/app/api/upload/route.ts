import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    
    // Save to public/uploads
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Create dir if it doesn't exist
    try {
      const fs = await import('fs/promises');
      await fs.mkdir(uploadDir, { recursive: true });
    } catch(e) {}
    
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);
    
    const url = `/uploads/${filename}`;
    
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file: ' + (error.message || String(error)) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || !url.startsWith('/uploads/')) {
      return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 });
    }
    
    const filename = url.replace('/uploads/', '');
    const filePath = join(process.cwd(), 'public', 'uploads', filename);
    
    await unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
