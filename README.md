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
DATABASE_URL="postgresql://postgres:password_kamu@localhost:5432/nama_database?schema=public"
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

Lalu coba lihat hasilnya:

```
npx prisma studio
```

<img width="950" height="auto" alt="image" src="https://github.com/user-attachments/assets/d3f76f13-d7c3-46dd-8b53-03cee1a6e8f5" />

## Laporan Implementasi Fitur Produk

Semua endpoint di bawah tersedia setelah router dipasang di `src/index.ts`:

```typescript
import productRoutes from "./routes/productRoutes.js";

app.use(express.json());
app.use(productRoutes);
```

### 1. GET — Menampilkan semua produk

Endpoint: `GET /product`

```typescript
const getAllItems: RequestHandler = async (_request, response) => {
  try {
    const items = await prisma.product.findMany();

    response.status(200).json({
      success: true,
      message: "Berhasil mengambil data",
      data: items,
    });
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    response.status(500).json({
      success: false,
      message: "Gagal mengambil data",
    });
  }
};

router.get("/product", getAllItems);
```

### 2. POST — Menambahkan produk

Endpoint: `POST /product`

Body JSON:

```json
{
  "name": "Buku",
  "price": 15000
}
```

```typescript
const createProduct: RequestHandler = async (request, response) => {
  const { name, price } = request.body ?? {};

  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    typeof price !== "number" ||
    !Number.isSafeInteger(price) ||
    price < 0 ||
    price > 2_147_483_647
  ) {
    response.status(400).json({
      success: false,
      message: "Nama produk dan harga berupa bilangan bulat non-negatif wajib diisi.",
    });
    return;
  }

  try {
    const product = await prisma.product.create({
      data: { name: name.trim(), price },
    });

    response.status(201).json({
      success: true,
      message: "Berhasil menambahkan produk",
      data: product,
    });
  } catch (error) {
    console.error("Gagal menambahkan produk:", error);
    response.status(500).json({
      success: false,
      message: "Gagal menambahkan produk",
    });
  }
};

router.post("/product", createProduct);
```

### 3. PUT — Mengubah produk berdasarkan ID

Endpoint: `PUT /product`

Body JSON:

```json
{
  "id": 1,
  "name": "Buku Baru",
  "price": 20000
}
```

```typescript
const updateProduct: RequestHandler = async (request, response) => {
  const { id, name, price } = request.body ?? {};

  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    typeof name !== "string" ||
    name.trim().length === 0 ||
    typeof price !== "number" ||
    !Number.isSafeInteger(price) ||
    price < 0 ||
    price > 2_147_483_647
  ) {
    response.status(400).json({
      success: false,
      message: "ID, nama produk, dan harga yang valid wajib diisi.",
    });
    return;
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { name: name.trim(), price },
    });

    response.status(200).json({
      success: true,
      message: "Berhasil mengupdate produk",
      data: product,
    });
  } catch (error) {
    console.error("Gagal mengupdate produk:", error);
    response.status(500).json({
      success: false,
      message: "Gagal mengupdate produk",
    });
  }
};

router.put("/product", updateProduct);
```

### 4. DELETE — Menghapus produk berdasarkan ID

Endpoint: `DELETE /product/1` (ganti `1` dengan ID produk).

```typescript
const deleteProduct: RequestHandler = async (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    response.status(400).json({
      success: false,
      message: "ID produk harus berupa bilangan bulat positif.",
    });
    return;
  }

  try {
    await prisma.product.delete({ where: { id } });

    response.status(200).json({
      success: true,
      message: "Berhasil menghapus produk",
    });
  } catch (error) {
    console.error("Gagal menghapus produk:", error);
    response.status(500).json({
      success: false,
      message: "Gagal menghapus produk",
    });
  }
};

router.delete("/product/:id", deleteProduct);
```
