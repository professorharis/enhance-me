import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    const buffer = Buffer.from(await file.arrayBuffer());
    // .withMetadata(false) removes all EXIF, GPS, and Camera data
    const processed = await sharp(buffer)
      .keepMetadata(false) 
      .toBuffer();

    return new NextResponse(processed, { headers: { 'Content-Type': 'image/jpeg' } });
  } catch (err) {
    return NextResponse.json({ error: "Privacy Scrub Failed" }, { status: 500 });
  }
}