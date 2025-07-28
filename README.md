# 🚗 RentThis - Aplikasi Sewa Kendaraan Digital

![RentThis Screenshot](https://github.com/faisalalrico/rentthis-ionic-beta/blob/main/rentthis.png)

**RentThis** adalah aplikasi mobile berbasis **Ionic Angular** yang memudahkan pengguna untuk menyewa kendaraan secara digital. Proyek ini dikembangkan sebagai solusi modern untuk penyewaan kendaraan roda dua dan roda empat, serta mendukung sistem verifikasi dokumen pengguna sebelum transaksi.

---

## 📱 Fitur Utama

![RentThis Detail](https://github.com/faisalalrico/rentthis-ionic-beta/blob/main/rentthis-detail.jpeg)

- 🔐 **Registrasi & Login** (dengan JWT Authentication)
- 🪪 **Upload KTP, SIM A, dan SIM C** untuk verifikasi pengguna
- 🛒 **Keranjang Sewa**: Tambahkan kendaraan yang ingin disewa
- 💳 **Checkout Manual & Tripay**: Pembayaran fleksibel
- 🧾 **Upload Bukti Pembayaran**
- 🔔 **Notifikasi Transaksi**
- 📂 **Riwayat Transaksi & Status**
- 🛠️ Admin Panel Backend (Laravel) untuk manajemen kendaraan dan transaksi

---

## 🧑‍💻 Teknologi yang Digunakan

- **Frontend**: Ionic Angular, Capacitor
- **Backend**: Laravel 12 (REST API)
- **Database**: MySQL
- **Payment Gateway**: Tripay
- **PDF Export**: FPDF
- **Push Notification**: FCM (Capacitor Plugin)

---

## ⚙️ Cara Build Aplikasi

```bash
npm install
ionic build
npx cap sync
npx cap open android # atau ios
