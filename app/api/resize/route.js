import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const width = parseInt(formData.get('width'));
    const height = parseInt(formData.get('height'));

    const buffer = Buffer.from(await file.arrayBuffer());
    const processed = await sharp(buffer)
      .resize(width, height, { fit: 'cover' })
      .toBuffer();

    return new NextResponse(processed, { headers: { 'Content-Type': 'image/png' } });
  } catch (err) {
    return NextResponse.json({ error: "Resize Failed" }, { status: 500 });
  }
}