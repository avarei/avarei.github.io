import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'

export type ScannerState = 'idle' | 'starting' | 'scanning' | 'denied' | 'unavailable'

const READER_ELEMENT_ID = 'barcode-reader'

export function useBarcodeScanner(onDecode: (code: string) => void) {
  const [state, setState] = useState<ScannerState>('idle')
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const lastDecodeRef = useRef<{ code: string; at: number }>({ code: '', at: 0 })

  useEffect(() => {
    return () => {
      scannerRef.current
        ?.stop()
        .then(() => scannerRef.current?.clear())
        .catch(() => {})
    }
  }, [])

  async function start() {
    setState('starting')
    try {
      const scanner = new Html5Qrcode(READER_ELEMENT_ID, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
        ],
        verbose: false,
      })
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          const now = Date.now()
          const last = lastDecodeRef.current
          if (last.code === decodedText && now - last.at < 2000) return
          lastDecodeRef.current = { code: decodedText, at: now }
          onDecode(decodedText)
        },
        undefined,
      )
      setState('scanning')
    } catch (err) {
      console.error('Camera start failed', err)
      const name = (err as { name?: string })?.name
      setState(name === 'NotAllowedError' ? 'denied' : 'unavailable')
    }
  }

  return { state, start, readerElementId: READER_ELEMENT_ID }
}
