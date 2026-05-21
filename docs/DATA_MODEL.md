# Model Data Utama

## Hierarki Jalan
1. **Jalan (`jalan`)**: Entitas induk jaringan jalan (misal: "Jalan Kabupaten").
2. **Ruas (`ruas`)**: Segmen spesifik dari suatu jalan (misal: "Ruas Bangil - Pandaan").
3. **STA (`sta`)**: Stationing atau titik-titik spesifik di sepanjang ruas jalan yang berisi informasi kondisi dan perkerasan.

## GIS & Layer
Data geografis disimpan dalam struktur FeatureCollection standar:
- **FeatureCollection (`featurecollection`)**: Kelompok layer (misal: "Jembatan 2023").
- **Feature (`feature`)**: Entitas individu dalam layer.
- **Geometry (`geometry`)**: Koordinat geografis (Point, LineString, Polygon).
- **Properties (`properties`)**: Data atribut dari feature tersebut.

## Pengaduan & Operasional
- **Aduan (`aduans`)**: Laporan dari masyarakat terkait kondisi jalan, terhubung ke `ruas` dan `users`.
- **Proyek (`executor_projects`, `consultant_projects`)**: Data pelaksanaan konstruksi atau pengawasan infrastruktur.
- **Service Providers (`service_providers`)**: Data kontraktor atau konsultan pelaksana proyek.

## Pengguna & Akses
- **Users (`users`)**: Data akun pengguna.
- **Roles (`roles`)**: Peran pengguna (Superadmin, Admin, User).
- **Permissions (`permissions`)**: Izin spesifik untuk tiap role.
