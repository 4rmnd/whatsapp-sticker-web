# WhatsApp Sticker Converter

Transform any image into a WhatsApp sticker instantly! This web app lets you upload images, convert them to the perfect WhatsApp sticker format, and copy them directly to your clipboard for easy sharing.

## ✨ Features

- **One-Click Conversion**: Upload any image and convert it to WhatsApp sticker format
- **Perfect Formatting**: Automatically resizes to 512×512px with proper margins
- **Optimized Compression**: Creates WebP files that meet WhatsApp requirements
- **Direct Clipboard Support**: Copy stickers directly to WhatsApp with one click
- **Download Option**: Save stickers to your device for later use

## 🚀 How It Works

1. **Upload Image**: Drag & drop or select any PNG or JPG image
2. **Convert**: The app automatically resizes to 512×512px and optimizes for WhatsApp
3. **Copy & Share**: Copy to clipboard and paste directly in WhatsApp

## 🛠️ Project Structure

```
whatsapp-sticker-main/
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── ConversionResult.tsx
│   │   ├── Header.tsx
│   │   ├── ImagePreview.tsx
│   │   ├── StatusIndicator.tsx
│   │   └── UploadZone.tsx
│   ├── hooks/
│   │   └── useImageConverter.ts
│   ├── index.css
│   ├── main.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── imageProcessor.ts
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🧰 Tech Stack

- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/4rmnd/whatsapp-sticker-web.git
   cd whatsapp-sticker-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 🙏 Thank You

Thank you for using or contributing to this project. Hope it's useful!