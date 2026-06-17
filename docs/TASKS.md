# Daftar Tugas Perbaikan & Optimasi (TASKS)

Dokumen ini merinci temuan dari audit kode dan langkah-langkah yang diperlukan untuk meningkatkan stabilitas, keamanan, dan performa aplikasi Jajalen Pas.

## 1. Stabilitas & Race Condition
- [x] **Optimasi Zustand Fetching:** Implementasikan `AbortController` pada store Zustand (`layers_store.ts`, `jalan_store.ts`) untuk membatalkan permintaan API yang usang saat pengguna mengganti tahun dengan cepat.
- [x] **Synchronous Logic in Home:** Perbaiki urutan inisialisasi di `app/page.tsx` agar fetch data tidak saling tumpang tindih secara tidak teratur.

## 2. Performa Database (N+1 Queries)
- [x] **Refactor API Aduan:** Ubah logika `app/api/aduan/route.ts` agar tidak melakukan query `findUnique` di dalam loop. Gunakan query tunggal dengan operator `in` untuk mengambil data Ruas.
- [x] **Indexing:** Pastikan kolom yang sering digunakan untuk filter (seperti `tahun` dan `status`) memiliki index yang sesuai di `schema.prisma`.

## 3. Keamanan & Manajemen File
- [x] **Robust File Upload:** 
    - Ubah `fs.writeFile` menjadi `fs.promises.writeFile` dan gunakan `await` di `app/api/aduan/route.ts`.
    - Tambahkan validasi tipe file (*mime-type*) dan batas ukuran file di sisi server.
    - Implementasikan mekanisme *rollback* (hapus file jika entri database gagal dibuat).
- [x] **Path Security:** Gunakan library `path` untuk menggabungkan lokasi file guna mencegah potensi *path traversal*.

## 4. Performa Frontend & Peta
- [x] **Cleanup Render Loop:** Hapus `console.log` dan logika berat lainnya dari dalam fungsi render di `app/components/map.tsx`.
- [x] **Memoization:** Gunakan `useMemo` lebih ekstensif untuk komponen layer jembatan dan area yang memiliki banyak entitas untuk mengurangi *re-render* yang tidak perlu.

## 5. Integritas Data
- [x] **Data Importer Fix:** 
    - Perbaiki `ruas-importer.ts` agar mengambil koordinat asli dari GeoJSON alih-alih menggunakan nilai *hardcoded* `0`.
    - Tambahkan validasi schema GeoJSON sebelum proses impor dimulai untuk menghindari *crash* saat runtime.
- [x] **BigInt Standardization:** Pastikan penanganan `BigInt` konsisten di seluruh lapisan API untuk menghindari error serialisasi di masa mendatang.

## 6. Error Handling
- [x] **Global Error Boundary:** Tambahkan Error Boundary pada level aplikasi untuk menangani kegagalan render peta secara anggun.
- [x] **API Response Standard:** Standarisasi format error response dari semua endpoint API (misal: selalu mengembalikan `{ error: string, code: number }`).

## 7. Fitur Pencarian Ruas Jalan
- [x] **Search UI Component:** Buat komponen input pencarian yang intuitif (melayang di atas peta atau di sidebar).
- [x] **Search Logic:** Implementasikan logika filter untuk mencari berdasarkan `namaRuas` atau `nomorRuas` dari data yang sudah dimuat di `jalan_store`.
- [x] **Auto-Pan & Highlight:** Tambahkan fitur otomatis pindah fokus peta (*flyTo*) dan *highlighting* pada ruas yang terpilih dari hasil pencarian.

## 8. Refactor UI Halaman Utama
- [x] **Halaman Laporan (`app/laporan`)**:
    - Ubah tampilan tabel menjadi desain kartu (*Card Grid*) yang lebih modern atau tabel dengan desain *Clean & Minimalist*.
    - Tambahkan badge status yang menarik dan ikon visual untuk tipe laporan.
    - Perbaiki UI filter dan pencarian agar lebih menyatu dengan desain sistem.
- [x] **Halaman Detail Laporan (`app/laporan/[slug]`)**:
    - Refactor tampilan detail laporan agar lebih estetik dan profesional.
    - Implementasikan layout artikel/dokumen yang lebih terbaca dengan sidebar informasi metadata.
    - Tambahkan fitur pratinjau dokumen (PDF) yang terintegrasi jika memungkinkan.
- [x] **Halaman Statistik (`app/statistik`)**:
    - Implementasikan *Dashboard Layout* dengan ringkasan metrik (Total Panjang, Kondisi Baik, dll) dalam bentuk *Stat Cards*.
    - Tingkatkan palet warna grafik agar lebih profesional dan mudah dibaca.
    - Tambahkan interaktivitas pada grafik dan legenda yang lebih bersih.
- [x] **Halaman Pengguna/Akun (`app/users`)**:
    - Refactor tabel manajemen pengguna dengan desain yang lebih modern.
    - Gunakan komponen *Avatar* untuk profil pengguna and *Badge* berwarna untuk membedakan level akses (Superadmin, Operator, dll).
    - Perbaiki desain form (Add/Edit User) menggunakan dialog/modal yang lebih estetik.

## 9. Enhance UI Beranda & Peta Interaktif
- [x] **Modern Sidebar Layout**: Refactor `LayerSidebar` dan `FeatureSidebar` dengan desain *Glassmorphism* yang konsisten.
- [x] **Interactive Legend**: Buat legenda peta yang lebih visual dan mudah dipahami.
- [x] **Map Control Styling**: Kustomisasi kontrol Leaflet (Zoom, Layers, Locater).
- [x] **Information Tooltip/Popup**: Tingkatkan desain popup saat mengklik fitur di peta.
- [x] **Home Overlay Widgets**: Tambahkan widget ringkasan cepat.

## 10. Revisi & Finalisasi UI Beranda
- [x] **Sidebar Width & Scrollbar**: Perlebar `LayerSidebar` dan perbaiki gaya *scrollbar* agar lebih tipis dan minimalis.
- [x] **Toggle Legend Positioning**: Perbaiki logika posisi tombol *toggle legend* agar ikut bergeser ke samping saat *sidebar* muncul (tidak tertutup/menutup sidebar).
- [x] **Map Controls Consolidation**: Pindahkan tombol *Current Location* ke area yang sama dengan kontrol *Zoom* (Kanan Bawah) untuk menghindari tumpang tindih.
- [x] **Remove Overlay Widgets**: Hapus *card* Aduan Aktif dan Proyek Berjalan dari tampilan utama sesuai permintaan.

## 11. Perbaikan Bug & Finalisasi Tata Letak
- [x] **Fix Import Button**: Perbaiki tombol "Impor Data Baru" di Sidebar Legenda agar dapat diklik dan memicu form impor.
- [x] **Cleanup Sidebar Syntax**: Hapus sisa kode sintaks (`...` atau `& )}`) yang bocor/tampil secara visual di Sidebar Legenda.
- [x] **Align Map Controls**: Pastikan tombol *Current Position* (Auto Locate) benar-benar sejajar secara vertikal dengan tombol *Zoom In/Out* di pojok kanan bawah.

## 12. Koreksi Logika Statistik Ruas (Sidebar)
- [x] **Fix Length Calculation**: Perbaiki logika perhitungan panjang total berdasarkan tipe permukaan (Aspal, Beton, dll) dan tipe kondisi (Baik, Sedang, dll) di komponen `ConditionDetail`.
- [x] **STA Sequence Logic**: Pastikan perhitungan selisih jarak antar titik STA (Stationing) dilakukan dengan urutan yang benar untuk menghasilkan nilai panjang yang akurat.
- [x] **Data Reactive Update**: Pastikan angka statistik di sidebar segera diperbarui (reaktif) saat data ruas atau STA berubah.

## 13. Halaman Inventaris Data Jalan Lengkap
- [x] **Page & Route Setup**: Buat halaman baru `/data-jalan` dengan layout yang konsisten dengan desain sistem Jajalen Pas.
- [x] **Advanced Filtering**: Implementasikan filter berdasarkan **Tahun Anggaran** dan **Kategori Jalan** dan **Kecamatan**. Filter seperti pada halaman statistik.
- [x] **Comprehensive Technical Table**: Implementasikan tabel data dengan kolom:
    - Identitas: No Ruas, Nama Ruas, Jenis Ruas, Kecamatan.
    - Dimensi: Panjang (Km), Lebar (m).
    - Jenis Perkerasan (Km): Hotmix, Lapen/Makadam, Beton, Telford/Kerikil, dan Tanah. Berbentuk heading dan subheading, jadi masing-masing option ada nilainya. default nilai 0.
    - Kondisi Jalan: Nilai dan **Persentase (%)** untuk masing-masing kondisi Baik, Sedang, Rusak Ringan, dan Rusak Berat.
- [x] **Data Export**: Tambahkan fitur ekspor tabel ke format Excel atau PDF untuk kebutuhan pelaporan fisik.
- [x] **Performance Optimization**: Gunakan *server-side pagination* atau *virtual scrolling* jika jumlah ruas sangat banyak untuk menjaga performa rendering.
