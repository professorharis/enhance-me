import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req) {  // Remove the ": NextRequest" type annotation
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const quality = parseInt(formData.get('quality') || '80');
    const format = formData.get('format') || 'webp';

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let sharpInstance = sharp(buffer);

    // Dynamic Compression based on format
    if (format === 'jpeg' || format === 'jpg') {
      sharpInstance = sharpInstance.jpeg({ quality, mozjpeg: true });
    } else if (format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality, effort: 6 });
    } else if (format === 'png') {
      // PNG uses palette for compression
      sharpInstance = sharpInstance.png({ palette: true });
    } else if (format === 'avif') {
      sharpInstance = sharpInstance.avif({ quality, effort: 4 });
    }

    // Privacy Guard: Strip Metadata
    const compressedBuffer = await sharpInstance
      .withMetadata({}) // This strips all metadata
      .toBuffer();
    
    // Return Base64 to frontend for instant preview
    const base64Image = `data:image/${format};base64,${compressedBuffer.toString('base64')}`;
    const compressedSize = compressedBuffer.length;

    return NextResponse.json({ 
      success: true, 
      image: base64Image,
      size: compressedSize 
    });

  } catch (error) {
    console.error("Compression Error:", error);
    return NextResponse.json({ error: "Failed to compress image" }, { status: 500 });
  }
}