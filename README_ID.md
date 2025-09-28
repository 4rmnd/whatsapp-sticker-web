# Konverter Stiker WhatsApp

Ubah gambar apa saja menjadi stiker WhatsApp dalam sekejap! Aplikasi web ini memungkinkan kamu mengunggah gambar, mengubahnya ke format stiker WhatsApp yang sempurna, dan menyalinnya langsung ke clipboard untuk dibagikan dengan mudah.

## ✨ Fitur Unggulan

- **Konversi Sekali Klik**: Unggah gambar apa saja dan ubah menjadi format stiker WhatsApp
- **Format Sempurna**: Otomatis mengubah ukuran menjadi 512×512px dengan margin yang tepat
- **Kompresi Optimal**: Membuat file WebP yang memenuhi persyaratan WhatsApp
- **Dukungan Clipboard Langsung**: Salin stiker langsung ke WhatsApp dengan satu klik
- **Opsi Unduh**: Simpan stiker ke perangkatmu untuk digunakan nanti

## 🚀 Cara Kerja

1. **Unggah Gambar**: Seret & lepas atau pilih gambar PNG atau JPG
2. **Konversi**: Aplikasi secara otomatis mengubah ukuran menjadi 512×512px dan mengoptimalkan untuk WhatsApp
3. **Salin & Bagikan**: Salin ke clipboard dan tempel langsung di WhatsApp

## 🛠️ Struktur Proyek

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

## 🧰 Teknologi yang Digunakan

- **React**: Framework UI
- **TypeScript**: JavaScript dengan keamanan tipe
- **Tailwind CSS**: Framework CSS berbasis utilitas
- **Vite**: Alat build cepat dan server pengembangan

## 🚀 Memulai

1. Kloning repositori:
   ```bash
   git clone https://github.com/4rmnd/whatsapp-sticker-web.git
   cd whatsapp-sticker-main
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```

4. Buka browser dan akses `http://localhost:5173`

## 🤝 Kontribusi

Kontribusi sangat diterima! Jangan ragu untuk membuka issue atau mengirimkan pull request.

1. Fork repositori
2. Buat branch fitur: `git checkout -b fitur/fitur-keren`
3. Commit perubahan: `git commit -m 'Menambahkan fitur keren'`
4. Push ke branch: `git push origin fitur/fitur-keren`
5. Buka pull request

## 🙏 Terima Kasih

Terima kasih telah menggunakan atau berkontribusi pada proyek ini. Semoga bermanfaat!