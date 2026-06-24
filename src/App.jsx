import './App.css'

function App() {
  return (
    <div id="center">
      <div className="hero">
        <h1>Warehouse Management</h1>
        <p>Halaman sederhana untuk menampilkan ringkasan stok dan status sistem.</p>
      </div>

      <section className="page-cards" style={{display: 'grid', gap: '20px', width: '100%', maxWidth: '860px', margin: '0 auto'}}>
        <article className="card" style={{padding: '24px', borderRadius: '20px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.75)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}>
          <h2>Ringkasan Stok</h2>
          <p>Produk terdaftar: <strong>128</strong></p>
          <p>Barang masuk hari ini: <strong>26</strong></p>
          <p>Barang keluar hari ini: <strong>14</strong></p>
        </article>

        <article className="card" style={{padding: '24px', borderRadius: '20px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.75)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}>
          <h2>Status Sistem</h2>
          <p>Semua layanan berjalan normal.</p>
          <p>Tidak ada peringatan penting.</p>
        </article>
      </section>
    </div>
  )
}

export default App
