import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req) {  // Remove ": NextRequest"
  try {
    const formData = await req.formData();
    const file = formData.get('file');  // Remove "as Blob"
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Fix: .keepMetadata() doesn't exist, use .withMetadata({})
    const processedBuffer = await sharp(buffer)
      .png({ quality: 90 })
      .withMetadata({})  // Changed from .keepMetadata(false)
      .toBuffer();

    return NextResponse.json({ 
      success: true, 
      image: `data:image/png;base64,${processedBuffer.toString('base64')}` 
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}