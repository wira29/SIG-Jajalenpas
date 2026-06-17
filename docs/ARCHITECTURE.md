# Arsitektur & Tech Stack

## Tech Stack Utama
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Bahasa:** TypeScript
- **Database:** MySQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **State Management:** [Zustand](https://docs.pmnd.rs/zustand/)
- **Styling:** Tailwind CSS & [shadcn/ui](https://ui.shadcn.com/)
- **Peta:** [Leaflet](https://leafletjs.org/) & [React Leaflet](https://react-leaflet.js.org/)
- **Autentikasi:** [NextAuth.js](https://next-auth.js.org/)

## Struktur Proyek
- `app/`: Berisi route, page, layout, dan komponen spesifik App Router.
  - `api/`: Endpoint API untuk operasi CRUD.
  - `actions/`: Server Actions untuk form submission dan import data.
  - `components/`: Komponen UI (Map, Sidebar, Navbar, dll).
  - `stores/`: Store Zustand untuk manajemen state global.
  - `services/`: Logika bisnis berat seperti importer GeoJSON.
- `prisma/`: Definisi schema database dan migrasi.
- `libs/`: Inisialisasi library (Prisma client, Auth options).
- `public/`: Asset statis (logo, gambar, upload).

## Manajemen State (Zustand)
Aplikasi menggunakan beberapa store untuk mengelola data yang sering diakses:
- `useLayersStore`: Mengelola layer GeoJSON (Jembatan, Jalan, Area).
- `useJalanStore`: Mengelola data jaringan jalan (Jalan utama).
- `useSelectedRuasStore`: Melacak ruas jalan yang sedang dipilih.
- `useYearStore`: Mengelola filter tahun data.
- `useProjectStore`: Mengelola data proyek infrastruktur.
