# Panduan Submission: Forum API — Automation Testing & Clean Architecture

---

## Daftar Isi

1. [Pengantar](#1-pengantar)
2. [Kriteria Proyek](#2-kriteria-proyek)
3. [Tips Dalam Mengerjakan Submission](#3-tips-dalam-mengerjakan-submission)

---

## 1. Pengantar

Selamat! Anda telah menyelesaikan pembelajaran pada Modul **Automation Testing dan Clean Architecture**. Sejauh ini, Anda telah:

- Menuliskan automation testing dengan kultur TDD.
- Menguji aplikasi mulai dari tahapan unit, integration, hingga functional.
- Menerapkan Test Double seperti dummy, stub, mock, dan spy.
- Mengenkapsulasi logika bisnis dari framework atau teknologi luar dengan menerapkan Clean Architecture.

Anda juga sudah mengerjakan seluruh latihan yang diberikan pada modul ini dengan baik.

Untuk menuju ke modul selanjutnya, ada tugas yang harus dikerjakan yakni membuat proyek **Forum API** sesuai kriteria yang ditentukan. Tim Reviewer akan memeriksa pekerjaan Anda dan memberikan review pada proyek yang Anda buat.

### Studi Kasus — Forum API

**Garuda Game** (perusahaan fiktif) merupakan sebuah perusahaan paling sukses dalam menjalankan bisnis di bidang online game. Perusahaan tersebut memiliki ratusan game yang dimainkan oleh jutaan pengguna di seluruh dunia. Salah satu kunci keberhasilannya adalah kedekatan dengan para pemainnya — mereka berhasil membangun komunitas yang aktif.

Untuk menjaga kualitas layanan terhadap komunitas, Garuda Game berinisiatif membangun aplikasi diskusi atau forum untuk para pemain. Dengan hadirnya platform diskusi yang resmi, para pemain akan sangat terbantu dan merasa nyaman untuk berdiskusi perihal game yang mereka mainkan. Aplikasi forum akan tersedia di platform web maupun mobile native.

Garuda Game ingin aplikasi forum didesain secara matang — menerapkan automation testing dan clean architecture agar aplikasi terhindar dari bug, mudah beradaptasi pada perubahan teknologi, dan mudah dikembangkan.

Anda ditugaskan untuk membangun Back-End API guna mendukung fungsionalitas dari aplikasi Front-End. Aplikasi forum dikembangkan secara bertahap dan saat ini diharapkan sudah memiliki fitur:

- Registrasi Pengguna
- Login dan Logout
- Menambahkan Thread
- Melihat Thread
- Menambahkan dan Menghapus Komentar pada Thread
- Menambahkan dan Menghapus Balasan Komentar Thread *(opsional)*

### Starter Project Forum API

Authentication merupakan salah satu fitur yang harus dimiliki Forum API. Namun karena pada latihan Anda sudah membangun Auth API, fitur tersebut tidak dijadikan sebagai syarat atau kriteria. Anda dapat menggunakan Auth API sebagai starter project atau mengunduhnya pada tautan yang sudah disediakan.

Beberapa catatan mengenai starter project:

- Starter project kurang lebih sama seperti proyek Auth API pada latihan modul Clean Architecture.
- Starter project sudah mencakup fitur: Registrasi Pengguna, Login, Refresh Access Token, dan Logout.
- Starter project sudah memiliki pengujian yang lengkap dan menerapkan **100% Test Coverage**.
- Sudah tersedia berkas `.env` dan konfigurasi untuk melakukan pengujian database. Anda boleh menyesuaikan nilai environment variable sesuai kebutuhan bila diperlukan.
- Starter project bersifat **opsional**. Bila Anda ingin mengerjakan submission dari awal, pastikan Forum API memiliki fitur yang sudah disebutkan di atas.

---

## 2. Kriteria Proyek

### Kriteria Utama (Wajib)

Terdapat **6 kriteria utama** yang harus Anda penuhi dalam membuat proyek Forum API.

#### Kriteria 1 — Menambahkan Thread

API harus dapat menambahkan thread melalui route:

- **Method:** `POST`
- **Path:** `/threads`
- **Body Request:**
  ```json
  {
      "title": "string",
      "body": "string"
  }
  ```
- **Response:**
  ```json
  {
      "status": "success",
      "data": {
          "addedThread": {
              "id": "thread-h_W1Plfpj0TY7wyT2PUPX",
              "title": "sebuah thread",
              "owner": "user-DWrT3pXe1hccYkV1eIAxS"
          }
      }
  }
  ```
  Status Code: **201**

**Ketentuan:**

- Menambahkan thread merupakan resource yang dibatasi (restrict) — membutuhkan access token untuk mengetahui siapa yang membuat thread.
- Jika properti body request tidak lengkap atau tidak sesuai, kembalikan status code **400** dengan body `status: "fail"` dan `message` apapun selama tidak kosong.

#### Kriteria 2 — Menambahkan Komentar pada Thread

API harus dapat menambahkan komentar pada thread melalui route:

- **Method:** `POST`
- **Path:** `/threads/{threadId}/comments`
- **Body Request:**
  ```json
  {
      "content": "string"
  }
  ```
- **Response:**
  ```json
  {
      "status": "success",
      "data": {
          "addedComment": {
              "id": "comment-_pby2_tmXV6bcvcdev8xk",
              "content": "sebuah comment",
              "owner": "user-CrkY5iAgOdMqv36bIvys2"
          }
      }
  }
  ```
  Status Code: **201**

**Ketentuan:**

- Membutuhkan access token (restrict).
- Jika thread tidak ditemukan atau tidak valid, kembalikan status code **404** dengan `status: "fail"` dan `message` apapun selama tidak kosong.
- Jika properti body request tidak lengkap atau tidak sesuai, kembalikan status code **400** dengan `status: "fail"` dan `message` apapun selama tidak kosong.

#### Kriteria 3 — Menghapus Komentar pada Thread

API harus dapat menghapus komentar pada thread melalui route:

- **Method:** `DELETE`
- **Path:** `/threads/{threadId}/comments/{commentId}`
- **Response:**
  ```json
  {
      "status": "success"
  }
  ```
  Status Code: **200**

**Ketentuan:**

- Membutuhkan access token (restrict).
- Hanya pemilik komentar yang dapat menghapus komentar. Bila bukan pemilik, kembalikan status code **403** dengan `status: "fail"` dan `message` apapun selama tidak kosong.
- Jika thread atau komentar tidak ditemukan atau tidak valid, kembalikan status code **404** dengan `status: "fail"` dan `message` apapun selama tidak kosong.
- Komentar dihapus secara **soft delete** — tidak benar-benar dihapus dari database. Gunakan kolom seperti `is_delete` sebagai indikator.

#### Kriteria 4 — Melihat Detail Thread

API harus dapat melihat detail thread melalui route:

- **Method:** `GET`
- **Path:** `/threads/{threadId}`
- **Response:**
  ```json
  {
      "status": "success",
      "data": {
          "thread": {
              "id": "thread-h_2FkLZhtgBKY2kh4CC02",
              "title": "sebuah thread",
              "body": "sebuah body thread",
              "date": "2021-08-08T07:19:09.775Z",
              "username": "dicoding",
              "comments": [
                  {
                      "id": "comment-_pby2_tmXV6bcvcdev8xk",
                      "username": "johndoe",
                      "date": "2021-08-08T07:22:33.555Z",
                      "content": "sebuah comment"
                  },
                  {
                      "id": "comment-yksuCoxM2s4MMrZJO-qVD",
                      "username": "dicoding",
                      "date": "2021-08-08T07:26:21.338Z",
                      "content": "**komentar telah dihapus**"
                  }
              ]
          }
      }
  }
  ```
  Status Code: **200**

**Ketentuan:**

- Mendapatkan detail thread merupakan resource **terbuka** — tidak memerlukan access token.
- Jika thread tidak ditemukan atau tidak valid, kembalikan status code **404** dengan `status: "fail"` dan `message` apapun selama tidak kosong.
- Wajib menampilkan seluruh komentar yang terdapat pada thread.
- Komentar yang dihapus ditampilkan dengan konten `**komentar telah dihapus**`.
- Komentar diurutkan secara **ascending** berdasarkan waktu berkomentar.

#### Kriteria 5 — Menerapkan Automation Testing

Proyek Forum API wajib menerapkan automation testing dengan ketentuan berikut:

- **Unit Testing:** Wajib menerapkan unit testing pada bisnis logika yang ada, baik di Entities maupun di Use Case.
- **Integration Test:** Wajib menerapkan integration test dalam menguji interaksi database dengan Repository.

#### Kriteria 6 — Menerapkan Clean Architecture

Proyek Forum API wajib menerapkan Clean Architecture dengan source code yang terdiri dari **4 layer**:

| Layer | Deskripsi |
|-------|-----------|
| **Entities** *(jika dibutuhkan)* | Tempat penyimpanan data entitas bisnis utama. Jika suatu bisnis butuh mengelola struktur data yang kompleks, buatlah entities. |
| **Use Case** | Digunakan sebagai tempat menuliskan flow atau alur bisnis logika. |
| **Interface Adapter** *(Repository & Handler)* | Mediator atau penghubung antara layer framework dengan layer use case. |
| **Frameworks** *(Database & HTTP server)* | Level paling luar — bagian yang berhubungan langsung dengan framework. |

---

### Kriteria Opsional

Selain kriteria utama, terdapat kriteria opsional yang dapat Anda penuhi agar mendapat nilai yang lebih baik.

#### Opsional 1 — Menambahkan Balasan pada Komentar Thread

- **Method:** `POST`
- **Path:** `/threads/{threadId}/comments/{commentId}/replies`
- **Body Request:**
  ```json
  {
      "content": "string"
  }
  ```
- **Response:**
  ```json
  {
      "status": "success",
      "data": {
          "addedReply": {
              "id": "reply-BErOXUSefjwWGW1Z10Ihk",
              "content": "sebuah balasan",
              "owner": "user-CrkY5iAgOdMqv36bIvys2"
          }
      }
  }
  ```
  Status Code: **201**

**Ketentuan:**

- Membutuhkan access token (restrict).
- Jika thread atau komentar tidak ditemukan, kembalikan status code **404** dengan `status: "fail"` dan `message` apapun selama tidak kosong.
- Jika properti body request tidak lengkap atau tidak sesuai, kembalikan status code **400** dengan `status: "fail"` dan `message` apapun selama tidak kosong.
- Balasan harus ditampilkan di dalam setiap item `comments` ketika mengakses detail thread. Contoh response:
  ```json
  {
      "status": "success",
      "data": {
          "thread": {
              "id": "thread-AqVg2b9JyQXR6wSQ2TmH4",
              "title": "sebuah thread",
              "body": "sebuah body thread",
              "date": "2021-08-08T07:59:16.198Z",
              "username": "dicoding",
              "comments": [
                  {
                      "id": "comment-q_0uToswNf6i24RDYZJI3",
                      "username": "dicoding",
                      "date": "2021-08-08T07:59:18.982Z",
                      "replies": [
                          {
                              "id": "reply-BErOXUSefjwWGW1Z10Ihk",
                              "content": "**balasan telah dihapus**",
                              "date": "2021-08-08T07:59:48.766Z",
                              "username": "johndoe"
                          },
                          {
                              "id": "reply-xNBtm9HPR-492AeiimpfN",
                              "content": "sebuah balasan",
                              "date": "2021-08-08T08:07:01.522Z",
                              "username": "dicoding"
                          }
                      ],
                      "content": "sebuah comment"
                  }
              ]
          }
      }
  }
  ```
- Balasan yang dihapus ditampilkan dengan konten `**balasan telah dihapus**`.
- Balasan diurutkan secara **ascending** berdasarkan waktu berkomentar.

#### Opsional 2 — Menghapus Balasan pada Komentar Thread

- **Method:** `DELETE`
- **Path:** `/threads/{threadId}/comments/{commentId}/replies/{replyId}`
- **Response:**
  ```json
  {
      "status": "success"
  }
  ```
  Status Code: **200**

**Ketentuan:**

- Membutuhkan access token (restrict).
- Hanya pemilik balasan yang dapat menghapus. Bila bukan pemilik, kembalikan status code **403** dengan `status: "fail"` dan `message` apapun selama tidak kosong.
- Jika thread, komentar, atau balasan tidak ditemukan, kembalikan status code **404** dengan `status: "fail"` dan `message` apapun selama tidak kosong.
- Balasan dihapus secara **soft delete** menggunakan kolom seperti `is_delete` sebagai indikator.

---

### Pengujian API

Kami sudah menyediakan berkas Postman Collection dan Environment untuk pengujian. Silakan unduh pada tautan: **Forum API V1 Postman Collection + Environment Test**.

**Cara import ke Postman:**

1. Unduh dan ekstrak berkas ZIP hingga menghasilkan dua berkas JSON.
2. Buka Postman, klik tombol **Import** di atas panel kiri.
3. Klik **Upload Files**, pilih kedua berkas JSON hasil ekstraksi, lalu klik **Open** → **Import**.
4. Forum API V1 Collection dan Environment akan tersedia di Postman Anda.
5. Jangan lupa untuk **menggunakan Environment** yang sudah diimpor.

**Tips menjalankan pengujian:**

- Jalankan pengujian secara **berurutan** karena beberapa request membutuhkan nilai dari request sebelumnya. Contoh: folder Authentications membutuhkan folder Users dijalankan terlebih dahulu.
- Gunakan fitur **Collection Runner** untuk menjalankan seluruh request sekaligus secara berurutan.
- Kerjakan proyek **fitur demi fitur** agar pengujian lebih mudah dijalankan.
- Jika semua fitur terasa benar namun pengujian selalu gagal, kemungkinan database kotor dengan data pengujian sebelumnya. Solusinya: truncate seluruh tabel melalui psql.

---

### Kriteria Penilaian Submission

Submission Anda akan dinilai oleh Reviewer guna menentukan kebenaran submission yang dikerjakan. Agar dapat melanjutkan pembelajaran, proyek Forum API harus **memenuhi seluruh pengujian otomatis** pada semua Postman Request, terkecuali request yang bertanda `[optional]`. Bila salah satu pengujian gagal, proyek akan ditolak.

Submission dinilai dengan skala **1–5 bintang**. Untuk mendapatkan nilai tinggi, Anda bisa menerapkan saran berikut:

- Menyelesaikan kriteria opsional (fitur balasan komentar thread).
- Menerapkan functional test (server test) untuk resource thread dan comment.
- Menerapkan 100% Test Coverage.
- Menuliskan kode dengan bersih dan mematuhi style guide yang Anda tetapkan.

| Bintang | Ketentuan |
|---------|-----------|
| ⭐ | Semua ketentuan wajib terpenuhi, namun terdapat indikasi kecurangan dalam mengerjakan submission. |
| ⭐⭐ | Semua ketentuan wajib terpenuhi, namun terdapat kekurangan pada penulisan kode (tidak modular atau gaya penulisan tidak konsisten). |
| ⭐⭐⭐ | Semua ketentuan wajib terpenuhi, namun tidak terdapat improvisasi atau persyaratan opsional yang dipenuhi. |
| ⭐⭐⭐⭐ | Semua ketentuan wajib terpenuhi dan menerapkan minimal dua saran di atas. |
| ⭐⭐⭐⭐⭐ | Semua ketentuan wajib terpenuhi dan menerapkan seluruh saran di atas. |

> **Catatan:** Jika submission ditolak maka tidak ada penilaian. Kriteria penilaian bintang di atas hanya berlaku jika submission Anda lulus.

---

### Ketentuan Berkas Submission

- Berkas submission yang dikirim merupakan folder proyek Forum API dalam bentuk **ZIP**.
- Pastikan di dalam folder proyek terdapat berkas `package.json`.
- Anda diperbolehkan **tidak melampirkan berkas `.env`** selama penamaan variable environment sesuai dengan starter project yang disediakan.
- **Hapus folder `node_modules`** sebelum mengompresi dalam bentuk ZIP.

### Submission Anda akan Ditolak Bila

- Kriteria wajib Forum API tidak terpenuhi.
- Ketentuan berkas submission tidak terpenuhi.
- Proyek tidak dapat dijalankan dengan baik (Reviewer menggunakan **Node.js LTS v22**).
- Menggunakan database selain **PostgreSQL**.
- Menggunakan bahasa pemrograman selain **JavaScript atau TypeScript** dan **Node.js**.
- Menggunakan framework Node.js selain **Express**.

---

## 3. Tips Dalam Mengerjakan Submission

Berikut adalah kumpulan tips untuk menanggulangi kendala yang paling sering ditemui saat mengerjakan submission ini.

---

### Tips 1 — Jangan Gunakan Expected Value sebagai Nilai Kembalian Fungsi yang Di-mock

Ketika melakukan testing, jangan gunakan `expectedValue` sebagai nilai kembalian fungsi yang di-mock. Perhatikan contoh berikut:

**❌ Kode testing yang salah:**

```js
// GetPreparedEngineUseCase.test.js
it('should fill fuel engine to 100 and start engine', function () {
    const expectedEngine = {
        name: 'engine1',
        fuel: 100,
        start: true
    };

    const mockEngineRepository = {}
    mockEngineRepository.getEngine = vi.fn(() => expectedEngine); // ❌ menggunakan expectedEngine

    const getPreparedEngineUseCase = new GetPreparedEngineUseCase(mockEngineRepository);

    console.log(expectedEngine) // { name: 'engine1', fuel: 100, start: true }
    const engine = getPreparedEngineUseCase.execute()
    console.log(expectedEngine) // { name: 'engine1', fuel: 50, start: false } ← BERUBAH!

    expect(engine).toStrictEqual(expectedEngine)
});
```

```js
// GetPreparedEngineUseCase.js (use case yang salah)
execute() {
    let engine = this.engineRepository.getEngine();
    engine.fuel = 50;    // ← seharusnya 100
    engine.start = false; // ← seharusnya true
    return engine;
}
```

Masalahnya: variabel `expectedEngine` berubah nilainya setelah `execute()` dipanggil karena object di JavaScript bersifat reference. Test akan tetap lolos padahal use case-nya salah!

**✅ Kode testing yang benar:**

```js
// GetPreparedEngineUseCase.test.js
it('should fill fuel engine to 100 and should start engine', function () {
    const expectedEngine = {
        name: 'engine1',
        fuel: 100,
        start: true
    };

    const engineRepository = {}
    engineRepository.getEngine = vi.fn(() => ({  // ✅ kembalikan objek baru yang netral
        name: 'engine1',
        fuel: 0,
        start: false
    }));

    const getPreparedEngineUseCase = new GetPreparedEngineUseCase(engineRepository);
    const engine = getPreparedEngineUseCase.execute()

    expect(engine).toStrictEqual(expectedEngine)
});
```

```js
// GetPreparedEngineUseCase.js (use case yang benar)
execute() {
    let engine = this.engineRepository.getEngine();
    engine.fuel = 100;  // ✅
    engine.start = true; // ✅
    return engine;
}
```

Nilai kembalian pada fungsi yang di-mock bersifat **netral** dan biasanya berbeda dengan expected result. Dengan ini, jika use case salah, test akan melempar error yang jelas dan membantu Anda mendeteksi bug sedini mungkin.

---

### Tips 2 — Verifikasi Semua Fungsi yang Di-mock

Saat melakukan mock pada sebuah fungsi, pastikan fungsi tersebut diverifikasi bahwa memang benar-benar dipanggil. Tanpa verifikasi, test bisa lolos meskipun ada kode penting yang dihapus.

**❌ Test tanpa verifikasi pemanggilan:**

```js
// AddEngineUseCase.test.js
it('should return the engine properly', async () => {
    const expectedEngine = { name: 'Faster Speed 3000', manufacture: 'Faster Speed Inc', maxFuel: 200 };

    const engineRepository = {}
    const manufacturerRepository = {}
    const getEngineUseCase = new GetEngineUseCase(engineRepository, manufacturerRepository);

    engineRepository.add = vi.fn(() => Promise.resolve())
    manufacturerRepository.verifyManufactureIsRegistered = vi.fn(() => Promise.resolve())

    const engine = await getEngineUseCase.execute('Faster Speed 3000', 'Faster Speed Inc', 200);

    expect(engine).toStrictEqual(expectedEngine)
    // ❌ tidak ada verifikasi bahwa fungsi-fungsi di atas dipanggil
});
```

Jika developer lain menghapus semua pemanggilan repository dari use case, test di atas **tetap lolos** padahal ada bug serius. Di production, ini akan menjadi error atau anomali yang sulit ditelusuri.

**✅ Test dengan verifikasi pemanggilan:**

```js
// AddEngineUseCase.test.js
it('should return the engine properly', async () => {
    const expectedEngine = { name: 'Faster Speed 3000', manufacture: 'Faster Speed Inc', maxFuel: 200 };

    const engineRepository = {}
    const manufacturerRepository = {}
    const getEngineUseCase = new GetEngineUseCase(engineRepository, manufacturerRepository);

    engineRepository.add = vi.fn(() => Promise.resolve())
    manufacturerRepository.verifyManufactureIsRegistered = vi.fn(() => Promise.resolve())

    const engine = await getEngineUseCase.execute('Faster Speed 3000', 'Faster Speed Inc', 200);

    expect(engine).toStrictEqual(expectedEngine)
    expect(engineRepository.add).toHaveBeenCalledWith('Faster Speed 3000', 'Faster Speed Inc', 200) // ✅
    expect(manufacturerRepository.verifyManufactureIsRegistered).toHaveBeenCalledWith('Faster Speed Inc') // ✅
});
```

Selain `toHaveBeenCalledWith()`, Anda juga bisa menggunakan `toBeCalled()`, `toBeCalledTimes()`, dan fungsi verifikasi lainnya.

---

### Tips 3 — Logika Bisnis Hanya Boleh Ada di Use Case atau Entity

Menurut Clean Architecture, logika bisnis **hanya boleh** didefinisikan di dalam domain (Entity) atau Use Case. Jangan letakkan logika bisnis di dalam Repository.

**❌ Logika bisnis di Repository (salah):**

```js
// EngineRepository.js
async getEngines() {
    const result = await this.pool.query('SELECT * FROM engine')
    const engine = result.row[0]

    // ❌ logika bisnis seharusnya tidak ada di sini
    if (engine.speed > 1000) {
        engine.type = 'Super Engine'
    } else if (engine.speed > 500) {
        engine.type = 'Moderate Engine'
    } else {
        engine.type = 'Light Engine'
    }

    return engine
}
```

**✅ Logika bisnis di Use Case (benar):**

```js
// GetEngineUseCase.js
async execute() {
    const engine = await this.engineRepository.get();

    // ✅ logika bisnis ada di use case
    if (engine.speed > 1000) {
        engine.type = 'Super Engine'
    } else if (engine.speed > 500) {
        engine.type = 'Moderate Engine'
    } else {
        engine.type = 'Light Engine'
    }

    return engine
}
```

---

### Tips 4 — Verifikasi Perubahan ke External Agency pada Integration Test

Ketika melakukan integration test yang bersifat perubahan (insert, update, atau delete), pastikan database atau external agency lainnya juga diverifikasi perubahannya.

**❌ Integration test tanpa verifikasi database:**

```js
// EngineRepository.test.js
describe('AddEngineRepositoryTest', () => {
    it('should return added engine correctly', function () {
        const engine = { name: 'Faster Speed 3000', manufacture: 'Faster Speed Inc', maxFuel: 200 };
        const engineRepository = new EngineRepository();
        const addedEngine = engineRepository.add(engine);
        expect(addedEngine).toStrictEqual(engine); // ❌ hanya cek return value, database tidak diverifikasi
    });
})
```

**✅ Integration test dengan verifikasi database:**

```js
// EngineRepository.test.js
describe('AddEngineRepositoryTest', () => {
    it('should return added engine correctly', function () {
        const engine = { name: 'Faster Speed 3000', manufacture: 'Faster Speed Inc', maxFuel: 200 };
        const engineRepository = new EngineRepository();
        const addedEngine = engineRepository.add(engine);
        expect(addedEngine).toStrictEqual(engine);
    });

    it('should persist add engine', function () { // ✅ test tambahan untuk verifikasi database
        const enginePayload = { name: 'Faster Speed 3000', manufacture: 'Faster Speed Inc', maxFuel: 200 };
        const engineRepository = new EngineRepository();
        engineRepository.add(enginePayload);

        const engine = EnginesTableTestHelper.findEngineByName('Faster Speed 3000')
        expect(engine).toHaveLength(1)
    });
})
```

```js
// EnginesTableTestHelper.js — helper untuk mengambil data dari database saat testing
const EnginesTableTestHelper = {
    findEngineByName: function(name) {
        const query = {
            text: 'SELECT * FROM engines WHERE name = $1',
            values: [name]
        }
        const result = pool.query(query)
        return result.rows[0]
    },
}
```

Buat object helper seperti `EnginesTableTestHelper` untuk membantu jalannya testing — fungsi di dalamnya digunakan untuk mengambil data dari database sebagai validasi.

---

### Tips 5 — Lakukan Autentikasi di Level Interface, Bukan Use Case

Jika autentikasi berada di level use case, use case tersebut menjadi tidak dapat digunakan kembali apabila aplikasi bermigrasi ke platform lain (misalnya CLI) karena cara autentikasinya bisa berbeda.

**✅ Autentikasi di level Interface (Handler) — benar:**

```js
// handler.js
addEngineHandler(request) {
    const { id: userId } = request.auth.credentials // ✅ autentikasi diselesaikan di handler

    AddEngineUseCase.execute(userId, request.payload)
}
```

```js
// AddEngineUseCase.js
execute(userId, useCasePayload) {
    engineRepository.addEngine(userId, useCasePayload) // ✅ use case hanya terima userId, tidak tahu soal auth
}
```

Dengan cara ini, use case tetap bersih dari detail implementasi autentikasi dan dapat digunakan kembali di konteks apapun.
