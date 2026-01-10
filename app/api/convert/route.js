import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const targetFormat = formData.get('format') || 'webp';
    const quality = parseInt(formData.get('quality') || '90');

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Process the image
    const convertedBuffer = await sharp(buffer)
      .toFormat(targetFormat, { quality })  // Remove the "as any" type assertion
      .withMetadata({})  // This strips all metadata
      .toBuffer();

    // Return as base64 for preview or binary as response
    const base64Image = `data:image/${targetFormat};base64,${convertedBuffer.toString('base64')}`;
    
    return NextResponse.json({
      success: true,
      image: base64Image,
      format: targetFormat,
      size: convertedBuffer.length
    });

  } catch (err) {
    console.error("Conversion Error:", err);
    return NextResponse.json({ error: "Conversion Failed" }, { status: 500 });
  }
}