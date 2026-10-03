# Enhance Me

> A privacy-focused, browser-based image toolkit for everyday image processing.

**Enhance Me** is a collection of client-side image tools built with **Next.js**, React, and modern browser APIs. The application is designed around local processing, allowing users to edit, resize, compress, convert, and clean image metadata without sending files to a remote server.

## Features

| Tool               | Description                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Background Removal | AI-powered background removal using `@imgly/background-removal`, with processing performed locally through WebAssembly. |
| Smart Resize       | Resize images for web, social media, documents, and common passport/photo dimensions.                                   |
| Smart Compress     | Reduce image file size while balancing compression and visual quality.                                                  |
| Format Conversion  | Convert supported images and documents between common formats.                                                          |
| Privacy Guard      | Remove EXIF metadata such as GPS location and camera information from supported images.                                 |

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) — App Router
* **UI:** React, [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Background Removal:** [`@imgly/background-removal`](https://www.npmjs.com/package/@imgly/background-removal)
* **Document & File Processing:** `jspdf`, `mammoth`, `pdfjs-dist`, `docx`, `jszip`, `html2canvas`
* **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

* Node.js 18+
* npm, Yarn, or pnpm

### 1. Clone the repository

```bash
git clone https://github.com/professorharis/enhance-me.git
cd enhance-me
```

### 2. Install dependencies

```bash
npm install
```

Or use your preferred package manager:

```bash
yarn install
# or
pnpm install
```

### 3. Add background-removal assets

Background removal uses self-hosted **WASM and ONNX model assets** rather than relying on a third-party CDN.

Download and extract the project asset bundle into `public/bg-removal/`.

Expected structure:

```text
public/
└── bg-removal/
    ├── onnxruntime-web/
    ├── *.onnx
    └── ...
```

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Production Build

```bash
npm run build
npm start
```

## Project Structure

```text
enhance-me/
├── app/
│   ├── page.tsx                # Home / Background Removal
│   ├── resize/page.tsx         # Smart Resize
│   ├── compress/page.tsx       # Smart Compress
│   ├── convert/page.tsx        # Format Conversion
│   ├── privacy/page.tsx        # Privacy Guard
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── privacy-policy/page.tsx
│   ├── terms/page.tsx
│   └── faq/page.tsx
├── public/
│   ├── bg-removal/             # WASM and model assets
│   └── demo-images/             # Demo / preview images
├── package.json
└── README.md
```

## Privacy by Design

Enhance Me is designed for **client-side processing**:

* Images are processed in the browser where supported by the selected tool.
* Background removal runs locally using WebAssembly and model assets.
* The application does not require user accounts for its core image-processing workflow.
* Files are not intentionally uploaded to a backend for processing.

> Privacy behavior can depend on the implementation of individual tools and any third-party services added to the project in the future.

## Browser Support

Modern versions of the following browsers are recommended:

| Browser         | Support                       |
| --------------- | ----------------------------- |
| Chrome          | Latest                        |
| Edge            | Latest                        |
| Firefox         | Latest                        |
| Safari          | 16+                           |
| Mobile browsers | iOS / Android modern browsers |

Background removal requires browser support for **WebAssembly** and compatible graphics/runtime capabilities.

## Contributing

Contributions, bug reports, and feature requests are welcome.

1. Fork the repository.

2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add your feature"
   ```

4. Push the branch:

   ```bash
   git push origin feature/your-feature
   ```

5. Open a Pull Request.

## License

This project is intended to be released under the **MIT License**. Add the repository's `LICENSE` file before distributing the project.

## Author

**Muhammad Haris**
Computer Science Student — Khyber Pakhtunkhwa, Pakistan

* Email: [harishkm9899@gmail.com](mailto:harishkm9899@gmail.com)
* GitHub: [@professorharis](https://github.com/professorharis)

## Project Focus

Enhance Me was built as a practical project to explore:

* Client-side image processing
* WebAssembly-based AI inference
* File handling with browser APIs
* Responsive UI development with Next.js and Tailwind CSS
* Privacy-oriented web application design

<p align="center">
  Built by <strong>Muhammad Haris</strong>
</p>
