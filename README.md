# ⏱ MultiTimer

A modern, open-source web app to run multiple timers simultaneously — with saveable timer sets, custom notification sounds, and a clean dark UI. No login, no backend, no database required.

**[Live Demo →]([https://multitimer.vercel.app](https://multi-timer-nine-kappa.vercel.app/))** 

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red.svg)](https://github.com/USERNAME/multitimer)

---

## ✨ Features

- **Multiple Timers** — run as many timers as you need at the same time
- **Timer Sets** — group timers into sets, save them, and reuse anytime
- **CRUD Timer Sets** — create, rename, and delete sets with ease
- **CRUD Timers** — set custom name, duration, and notification sound per timer
- **Custom Notification Sounds** — upload your own audio file (.mp3, .wav, .ogg) or use built-in sounds (Beep, Bell, Chime, Alert)
- **Start / Pause / Reset** — control each timer individually or all at once
- **Persistent Storage** — all data saved locally via `localStorage`, survives page refresh
- **No Login Required** — fully accessible without any account
- **Fully Responsive** — works on desktop and mobile

---

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| [React](https://react.dev) + [Vite](https://vitejs.dev) | UI framework & build tool |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Lucide React](https://lucide.dev) | Icons |
| Web Audio API | Built-in notification sounds |
| localStorage | Client-side data persistence |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ — [nodejs.org](https://nodejs.org)
- Git — [git-scm.com](https://git-scm.com)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/FadhelRaihan/multi-timer.git

# 2. Masuk ke folder proyek
cd multitimer

# 3. Install dependencies
npm install

# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

### Build for Production

```bash
npm run build
```

Output akan ada di folder `dist/`.

---

## 📁 Project Structure

```
multitimer/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🌐 Deployment (Vercel)

Proyek ini di-host di [Vercel](https://vercel.com) secara gratis.

1. Push kode ke GitHub
2. Login ke [vercel.com](https://vercel.com) dengan akun GitHub
3. Klik **Add New → Project** → pilih repo `multitimer`
4. Framework Preset: **Vite**
5. Klik **Deploy**

Setiap `git push` ke branch `main` akan otomatis trigger deployment ulang.

---

## 🎵 Custom Sound Upload

1. Buka timer set → klik ✎ pada timer manapun
2. Scroll ke bagian **Custom Sound**
3. Klik area upload → pilih file audio (.mp3, .wav, .ogg, .m4a)
4. Sound langsung tersimpan dan bisa dipilih untuk timer tersebut

Custom sounds disimpan di `localStorage` browser sebagai base64.

---

## 🗺 Roadmap

- [ ] Browser notification (Notification API) saat tab tidak aktif
- [ ] Export / Import timer sets sebagai JSON
- [ ] Drag-and-drop reorder timer
- [ ] Dark / Light mode toggle
- [ ] PWA support (installable di mobile)
- [ ] Sound volume control

---

## 🤝 Contributing

MultiTimer adalah project open source dan **kontribusi dari siapapun sangat welcome!**
Baik itu bug fix, fitur baru, perbaikan dokumentasi, atau improvement UI — semuanya diterima.

### Cara Berkontribusi

```bash
# 1. Fork repo ini via tombol Fork di GitHub

# 2. Clone fork kamu
git clone https://github.com/FadhelRaihan/multi-timer.git
cd multitimer

# 3. Tambahkan upstream
git remote add upstream https://github.com/FadhelRaihan/multi-timer.git

# 4. Install dependencies & jalankan lokal
npm install
npm run dev

# 5. Buat branch baru
git checkout -b feat/nama-fitur

# 6. Kerjakan perubahan, lalu commit
git add .
git commit -m "feat: deskripsi perubahan"

# 7. Push & buat Pull Request
git push origin feat/nama-fitur
```

> Semua Pull Request akan di-review terlebih dahulu sebelum di-merge ke branch `main`.

### Tipe Kontribusi yang Diterima

| Tipe | Contoh |
|------|--------|
| 🐛 Bug fix | Perbaiki animasi ring timer |
| ✨ Fitur baru | Tambah notifikasi browser |
| 💄 UI improvement | Perbaiki tampilan mobile |
| 📝 Dokumentasi | Update README, tambah komentar kode |
| ⚡ Performa | Optimasi re-render komponen |
| ♻️ Refactor | Pisah komponen besar jadi lebih kecil |

### Commit Convention

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: tambah fitur drag-drop reorder timer
fix: ring tidak full saat timer baru dimulai
docs: update panduan custom sound di README
style: perbaiki spacing card di tampilan mobile
```

### Panduan Lengkap

Baca **[CONTRIBUTING.md](./CONTRIBUTING.md)** untuk panduan lengkap termasuk:
- Setup project lokal
- Standar kode yang digunakan
- Pull Request guidelines
- Cara melaporkan bug atau mengusulkan fitur

### Melaporkan Bug & Mengusulkan Fitur

- 🐛 **Bug?** → [Buat Bug Report](../../issues/new?template=bug_report.md)
- ✨ **Ide fitur?** → [Buat Feature Request](../../issues/new?template=feature_request.md)
- 💬 **Pertanyaan umum?** → [Buka Discussion](../../discussions)

---

## 📄 License

Distributed under the **MIT License** — lihat file [LICENSE](./LICENSE) untuk detail lengkapnya.

---

## 🙏 Acknowledgements

- Dibuat dengan bantuan [Claude](https://claude.ai) by Anthropic
- Icons by [Lucide](https://lucide.dev)
- Hosted on [Vercel](https://vercel.com)

---

<p align="center">Made with ❤️ — open source, free forever</p>
<p align="center">
  <a href="../../issues/new?template=bug_report.md">🐛 Report Bug</a> ·
  <a href="../../issues/new?template=feature_request.md">✨ Request Feature</a> ·
  <a href="./CONTRIBUTING.md">🤝 Contribute</a>
</p>
