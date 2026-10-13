import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { BarcodeScannerView } from './features/scanner/BarcodeScannerView'
import { ManualEntryForm } from './features/product-lookup/ManualEntryForm'
import { ProductConfirmView } from './features/product-lookup/ProductConfirmView'
import { DiaryView } from './features/diary/DiaryView'
import { SettingsView } from './features/settings/SettingsView'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <h1>Callo</h1>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<DiaryView />} />
            <Route path="/scan" element={<BarcodeScannerView />} />
            <Route path="/product/:barcode" element={<ProductConfirmView />} />
            <Route path="/add" element={<ManualEntryForm />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </main>

        <nav className="bottom-nav">
          <Link to="/">Diary</Link>
          <Link to="/scan">Scan</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </div>
    </BrowserRouter>
  )
}

export default App
