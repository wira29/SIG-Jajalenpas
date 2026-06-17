# Alur Aplikasi (Flow)

## 1. Alur Visualisasi Peta
1. Pengguna membuka halaman utama.
2. `Home` component memicu fetch data melalui Zustand stores (`loadLayers`, `loadRoads`, `loadProject`) berdasarkan `selectedYear`.
3. `DynamicMap` merender layer-layer tersebut di atas peta Leaflet.
4. Pengguna bisa mengaktifkan/menonaktifkan layer melalui `LayerSidebar`.

## 2. Alur Manajemen Data Jalan (Admin)
1. Admin mengunggah file GeoJSON melalui form import.
2. `saveGeoJSON` atau `saveRuasGeoJSON` (Server Action) menerima file.
3. `GeoJSONImporter` atau `RuasImporter` memproses file, melakukan validasi tipe geometri, dan menyimpannya ke database via Prisma.
4. Data baru langsung tersedia untuk divisualisasikan.

## 3. Alur Pengaduan Masyarakat
1. Pengguna (masyarakat) memilih ruas jalan di peta.
2. Membuka form pengaduan di `RoadConditionSidebar`.
3. Mengisi detail keluhan dan mengunggah foto.
4. Data disimpan di tabel `aduans` dan dapat dipantau statusnya oleh Admin.

## 4. Alur Monitoring Proyek
1. Data proyek diinputkan atau diimpor ke sistem.
2. Lokasi proyek ditampilkan di peta sebagai layer khusus.
3. Klik pada proyek menampilkan detail progres fisik dan keuangan.

## 5. Alur Statistik
1. Sistem mengagregasi data dari tabel `sta` (kondisi dan perkerasan).
2. Data ditampilkan dalam bentuk Chart (Pie/Bar) di halaman `app/statistik` menggunakan Chart.js.
