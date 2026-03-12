# Contributing to MultiTimer ⏱

Terima kasih sudah tertarik untuk berkontribusi ke MultiTimer!
Dokumen ini menjelaskan cara yang benar untuk berkontribusi ke project ini.

---

## Daftar Isi

- [Code of Conduct](#code-of-conduct)
- [Cara Melaporkan Bug](#cara-melaporkan-bug)
- [Cara Mengusulkan Fitur](#cara-mengusulkan-fitur)
- [Setup Project Lokal](#setup-project-lokal)
- [Workflow Kontribusi](#workflow-kontribusi)
- [Commit Convention](#commit-convention)
- [Standar Kode](#standar-kode)
- [Pull Request Guidelines](#pull-request-guidelines)

---

## Code of Conduct

Dengan berkontribusi, kamu setuju untuk menjaga lingkungan yang respectful dan inklusif.
Jangan gunakan bahasa yang kasar, melecehkan, atau diskriminatif dalam issue, PR, atau komentar manapun.

---

## Cara Melaporkan Bug

1. Cek dulu di [tab Issues](../../issues) — pastikan bug belum pernah dilaporkan sebelumnya
2. Kalau belum ada, buka issue baru menggunakan template **Bug Report**
3. Isi semua informasi yang diminta: langkah reproduksi, hasil yang diharapkan, hasil aktual, screenshot

---

## Cara Mengusulkan Fitur

1. Cek dulu di [tab Issues](../../issues) — pastikan fitur belum diusulkan sebelumnya
2. Buka issue baru menggunakan template **Feature Request**
3. Jelaskan dengan jelas: masalah apa yang dipecahkan, bagaimana fitur bekerja, kenapa fitur ini penting

---

## Setup Project Lokal

### Prerequisites
- Node.js v18 atau lebih baru → [nodejs.org](https://nodejs.org)
- Git → [git-scm.com](https://git-scm.com)

### Langkah-langkah

```bash
# 1. Fork repo ini via tombol Fork di GitHub

# 2. Clone fork kamu
git clone https://github.com/USERNAME_KAMU/multitimer.git
cd multitimer

# 3. Tambahkan upstream (repo asli)
git remote add upstream https://github.com/USERNAME/multitimer.git

# 4. Install dependencies
npm install

# 5. Jalankan development server
npm run dev
# Buka http://localhost:5173
```

---

## Workflow Kontribusi

```
1. Sync fork kamu dengan repo terbaru
2. Buat branch baru dari main
3. Kerjakan perubahan
4. Test perubahan kamu secara lokal
5. Commit dengan pesan yang jelas
6. Push ke fork kamu
7. Buat Pull Request ke repo ini
```

### Sync fork sebelum mulai kerja

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### Buat branch baru

```bash
# Format: tipe/deskripsi-singkat
git checkout -b feat/drag-drop-timer
git checkout -b fix/ring-animation-bug
git checkout -b docs/update-readme
```

### Push dan buat PR

```bash
git add .
git commit -m "feat: tambah drag-drop reorder timer"
git push origin feat/drag-drop-timer
# Lalu buka GitHub dan buat Pull Request
```

---

## Commit Convention

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipe>: <deskripsi singkat>
```

| Tipe | Kapan digunakan |
|------|----------------|
| `feat` | Menambah fitur baru |
| `fix` | Memperbaiki bug |
| `docs` | Perubahan dokumentasi saja |
| `style` | Perubahan formatting/styling (bukan logic) |
| `refactor` | Refactor kode tanpa tambah fitur atau fix bug |
| `perf` | Peningkatan performa |
| `chore` | Update dependency, config, dll |

**Contoh yang benar:**
```
feat: tambah notifikasi browser saat timer selesai
fix: ring tidak full saat timer baru dimulai
docs: tambah panduan custom sound di README
style: perbaiki spacing card timer di mobile
refactor: pisah logic playSound ke utils/audio.js
```

**Contoh yang salah:**
```
update kode
fix bug
WIP
asdfgh
```

---

## Standar Kode

- **Bahasa**: JavaScript (React + JSX)
- **Framework**: React dengan Vite
- **Styling**: Tailwind CSS / CSS-in-JS inline styles
- **Tidak perlu** TypeScript atau testing framework untuk kontribusi dasar

### Hal yang wajib diperhatikan:

- ✅ Jalankan `npm run build` sebelum submit PR — pastikan tidak ada error build
- ✅ Tidak ada `console.log` yang tertinggal di kode produksi
- ✅ Komponen React harus fungsional (function component), bukan class component
- ✅ State management menggunakan React hooks (`useState`, `useEffect`, dll)
- ✅ Data persistence tetap menggunakan `localStorage` — tidak perlu backend
- ❌ Jangan tambah library besar tanpa diskusi di issue terlebih dahulu
- ❌ Jangan ubah struktur data `localStorage` tanpa migration logic

---

## Pull Request Guidelines

- Satu PR fokus pada satu perubahan / satu fitur saja
- Judul PR mengikuti format commit convention
- Isi deskripsi PR dengan lengkap menggunakan template yang tersedia
- Sertakan screenshot / GIF jika ada perubahan tampilan UI
- PR yang mengandung API key, credential, atau data sensitif **langsung akan ditolak**
- Pastikan tidak ada conflict dengan branch main sebelum submit

---

Kalau ada pertanyaan, buka saja [Discussion](../../discussions) atau tambahkan komentar di issue yang relevan.

Terima kasih atas kontribusinya! 🙌
