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

- Set up password & nama database

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
