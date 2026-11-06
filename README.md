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

## Tahap pengujian 

### Fitur post

- Jika kolom nama dan price tidak diisi:
    
<img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/9d3c436c-c11a-4970-9f68-5ee90e510363" />

- Jika price pakai tanda kutip

<img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/1e5ef059-a5e7-4b16-90e6-1f85197444a0" />

- Jika berhasil

<img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/a18cba83-3948-456a-8e17-1082fd5d2a98" />  

<img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/72389fa2-c098-4845-acfa-70944a9378b7" />


### Fitur Get

- Menampilkan semua product

<img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/7df3ef16-6dc1-4e8b-8108-e60396502bd9" />

### Fitur Put 

- Jika input update tidak sesuai format dan belum lengkap

<img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/618e5ab4-9ab7-46be-988f-26477d5b2ebc" />

<img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/738a27b6-4757-4ec6-b862-f45ab41fba48" />

- Mengupdate product

  <img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/9e66b86a-ec70-4385-8486-133c018594db" />

  <img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/cab3af9c-dffe-4a9f-b801-f96cc5753a39" />

### Fitur Delete

- Jika id yang diinput tidak ada

  <img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/32fed98a-c9f1-4cc1-844a-92976a378827" />

- Jika berhasil menghapus product

  <img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/a253fb65-9491-43ba-ae74-4bdbbadb5a63" />

  <img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/29501124-2a0b-423c-b42f-b9c9d2c54993" />

### Hasil akhir di table 

<img width="900" height="auto" alt="image" src="https://github.com/user-attachments/assets/a7052d4d-44fb-464f-80bc-00616ce11990" />



