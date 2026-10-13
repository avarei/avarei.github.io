import { useNavigate } from 'react-router-dom'
import { useBarcodeScanner } from './useBarcodeScanner'

export function BarcodeScannerView() {
  const navigate = useNavigate()
  const { state, start, readerElementId } = useBarcodeScanner((barcode) => {
    navigate(`/product/${barcode}`)
  })

  return (
    <div className="view scanner-view">
      <h2>Scan a barcode</h2>

      <div id={readerElementId} className="reader" />

      {state === 'idle' && (
        <button className="primary-button" onClick={start}>
          Enable camera
        </button>
      )}

      {state === 'starting' && <p>Starting camera…</p>}

      {state === 'scanning' && <p className="hint">Point the camera at a barcode</p>}

      {state === 'denied' && (
        <p className="notice">
          Camera access was denied. Enable it in Settings → Safari → Camera, then reload this
          page.
        </p>
      )}

      {state === 'unavailable' && (
        <p className="notice">
          No camera available.{' '}
          <button className="link-button" onClick={() => navigate('/add')}>
            Add the item manually instead
          </button>
          .
        </p>
      )}
    </div>
  )
}
