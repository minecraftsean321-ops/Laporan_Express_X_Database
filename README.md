# Laporan_Express_X_Database

## Instal PostgreSQL di lokal 

```bash
# Update package list & install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib -y

# Jalankan service PostgreSQL
sudo service postgresql start

# Masuk ke CLI PostgreSQL untuk set password & buat database
sudo -u postgres psql
```

### Set up password & nama database

```sql
-- Ganti 'password_kamu' dengan password yang kamu inginkan
ALTER USER postgres WITH PASSWORD 'password_kamu';

-- Buat database baru untuk project kamu
CREATE DATABASE nama_database;

-- Keluar dari psql
\q
```

## Inisialisasi prisma di Project Express

```bash
# Install Prisma Client dan Prisma CLI
npm install @prisma/client
npm install prisma --save-dev

# Inisialisasi setup Prisma
npx prisma init
```

Akan muncul file-file seperti di gambar ini:  

<img width="auto" height="300" alt="image" src="https://github.com/user-attachments/assets/8afa7ebd-5bc1-418d-af80-3f9621e9695a" />

## Konfigurasi connection string di file .env

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/nama_database?schema=public"
```

Ubah password dan nama_database sesuai dengan set up yang telah di lakukan di CLI PostgreSQL tadi.

## Buat schema model di `prisma/schema.prisma`

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model product {
  id    int    @id    @default(autoincrement())
  name  string
  price int 
}
```

Setelah itu jalankan migrasi database:

```
npx prisma migrate dev --name init
```

Lalu coba lihat hasilnya 

```
npx prisma studio
```

<img width="950" height="auto" alt="image" src="https://github.com/user-attachments/assets/d3f76f13-d7c3-46dd-8b53-03cee1a6e8f5" />
