import React, {useState, useEffect, useRef, useCallback} from 'react'
import {Html5Qrcode} from 'html5-qrcode'
import {ScanLine, RotateCcw, CheckCircle2, AlertCircle, Camera} from 'lucide-react'

export type ScanPhase = 'idle' | 'scanning' | 'loading' | 'success' | 'error'

interface QRScannerProps {
  onScanned: (driverId: string) => Promise<void>
  onReset: () => void
  phase: ScanPhase
  setPhase: (p: ScanPhase) => void
  errorMsg?: string
}

const SCANNER_ID = 'cma-qr-reader'

const QRScanner: React.FC<QRScannerProps> = ({onScanned, onReset, phase, setPhase, errorMsg}) => {
  const html5QrRef = useRef<Html5Qrcode | null>(null)
  const [scannerReady, setScannerReady] = useState(false)

  const startScanner = useCallback(async () => {
    setPhase('scanning')
    setScannerReady(false)
    await new Promise<void>((r) => setTimeout(r, 50))

    const scanner = new Html5Qrcode(SCANNER_ID)
    html5QrRef.current = scanner

    try {
      await scanner.start(
        {facingMode: 'environment'},
        {fps: 10, qrbox: {width: 220, height: 220}},
        async (decodedText) => {
          await scanner.stop().catch(() => {})
          html5QrRef.current = null
          setPhase('loading')
          try {
            await onScanned(decodedText.trim())
          } catch {
            setPhase('error')
          }
        },
        () => {}
      )
      setScannerReady(true)
    } catch (err: any) {
      console.error('QR Scanner start error', err)
      setPhase('error')
    }
  }, [onScanned, setPhase])

  useEffect(() => {
    return () => {
      html5QrRef.current?.stop().catch(() => {})
      html5QrRef.current = null
    }
  }, [])

  useEffect(() => {
    if (phase !== 'scanning') {
      html5QrRef.current?.stop().catch(() => {})
      html5QrRef.current = null
      setScannerReady(false)
    }
  }, [phase])

  const handleReset = () => {
    onReset()
  }

  if (phase === 'idle') {
    return (
      <div className='d-flex flex-column align-items-center justify-content-center py-16'>
        {/* Icon ring */}
        <div
          className='d-flex align-items-center justify-content-center rounded-circle mb-6'
          style={{
            width: 96,
            height: 96,
            background: 'var(--bs-primary-light, #e9f0ff)',
            border: '2px dashed var(--bs-primary, #3E97FF)',
          }}
        >
          <ScanLine size={42} strokeWidth={1.4} className='text-primary' />
        </div>

        <h3 className='fw-bolder text-gray-800 mb-2'>Start Dispatch</h3>
        <p className='text-muted fs-6 mb-7 text-center' style={{maxWidth: 320}}>
          Scan the driver's QR code to begin the dispatch process.
        </p>

        <button
          className='btn btn-primary btn-lg d-flex align-items-center gap-2'
          onClick={startScanner}
        >
          <Camera size={18} />
          Open Camera &amp; Scan
        </button>
      </div>
    )
  }

  if (phase === 'scanning') {
    return (
      <div className='d-flex flex-column align-items-center py-6'>
        <h4 className='fw-bolder text-gray-800 mb-1'>Scan Driver QR Code</h4>
        <p className='text-muted fs-7 mb-5'>Point the camera at the driver's QR code.</p>

        {/* Camera viewfinder container */}
        <div
          className='position-relative rounded-3 overflow-hidden border border-dashed border-primary mb-5'
          style={{width: '100%', maxWidth: 360, minHeight: 280, background: '#0a0a0a'}}
        >
          {/* html5-qrcode mounts here */}
          <div id={SCANNER_ID} style={{width: '100%'}} />

          {/* Overlay corner brackets */}
          {scannerReady && (
            <div
              className='position-absolute top-50 start-50 translate-middle pe-none'
              style={{width: 200, height: 200}}
            >
              {/* top-left */}
              <span style={cornerStyle('top-left')} />
              {/* top-right */}
              <span style={cornerStyle('top-right')} />
              {/* bottom-left */}
              <span style={cornerStyle('bottom-left')} />
              {/* bottom-right */}
              <span style={cornerStyle('bottom-right')} />
              {/* scan line */}
              <ScanLine
                size={190}
                strokeWidth={1}
                className='position-absolute top-0 start-0'
                style={{opacity: 0.35, color: '#3E97FF'}}
              />
            </div>
          )}
        </div>

        <button
          className='btn btn-sm btn-light-secondary d-flex align-items-center gap-1'
          onClick={() => {
            html5QrRef.current?.stop().catch(() => {})
            html5QrRef.current = null
            setPhase('idle')
          }}
        >
          <RotateCcw size={13} />
          Cancel
        </button>
      </div>
    )
  }

  if (phase === 'loading') {
    return (
      <div className='d-flex flex-column align-items-center justify-content-center py-16'>
        <div
          className='spinner-border text-primary mb-4'
          role='status'
          style={{width: 52, height: 52}}
        >
          <span className='visually-hidden'>Loading…</span>
        </div>
        <h5 className='fw-bold text-gray-700 mb-1'>Creating Dispatch…</h5>
        <span className='text-muted fs-7'>Please wait while we process the QR code.</span>
      </div>
    )
  }

  if (phase === 'success') {
    return (
      <div className='d-flex flex-column align-items-center justify-content-center py-10'>
        <div
          className='d-flex align-items-center justify-content-center rounded-circle mb-5'
          style={{width: 80, height: 80, background: '#e6f9f0'}}
        >
          <CheckCircle2 size={40} strokeWidth={1.6} className='text-success' />
        </div>
        <h4 className='fw-bolder text-gray-800 mb-1'>Dispatch Created!</h4>
        <p className='text-muted fs-7 mb-6'>Scroll down to view the driver's dispatch details.</p>
        <button
          className='btn btn-sm btn-light-primary d-flex align-items-center gap-2'
          onClick={handleReset}
        >
          <RotateCcw size={14} />
          Start Scan Again
        </button>
      </div>
    )
  }

  return (
    <div className='d-flex flex-column align-items-center justify-content-center py-14'>
      <div
        className='d-flex align-items-center justify-content-center rounded-circle mb-5'
        style={{width: 80, height: 80, background: '#fff0f0'}}
      >
        <AlertCircle size={38} strokeWidth={1.6} className='text-danger' />
      </div>
      <h5 className='fw-bolder text-danger mb-1'>Scan Failed</h5>
      <p className='text-muted fs-7 mb-5 text-center' style={{maxWidth: 300}}>
        {errorMsg ?? 'Could not process the QR code. Please try again.'}
      </p>
      <button
        className='btn btn-sm btn-light-primary d-flex align-items-center gap-2'
        onClick={() => {
          setPhase('idle')
          handleReset()
        }}
      >
        <RotateCcw size={14} />
        Try Again
      </button>
    </div>
  )
}

function cornerStyle(
  pos: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
): React.CSSProperties {
  const size = 22
  const thickness = 3
  const color = '#3E97FF'
  const base: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    borderColor: color,
    borderStyle: 'solid',
  }
  switch (pos) {
    case 'top-left':
      return {...base, top: 0, left: 0, borderWidth: `${thickness}px 0 0 ${thickness}px`}
    case 'top-right':
      return {...base, top: 0, right: 0, borderWidth: `${thickness}px ${thickness}px 0 0`}
    case 'bottom-left':
      return {...base, bottom: 0, left: 0, borderWidth: `0 0 ${thickness}px ${thickness}px`}
    case 'bottom-right':
      return {...base, bottom: 0, right: 0, borderWidth: `0 ${thickness}px ${thickness}px 0`}
  }
}

export default QRScanner
