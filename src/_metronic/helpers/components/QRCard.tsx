import {FC, useState, useCallback} from 'react'
import {createPortal} from 'react-dom'
import {QRCodeSVG} from 'qrcode.react'
import {Download} from 'lucide-react'

const QR_COLOR = '#1a1a2e'
const QR_BG = 'transparent'

const CmaLabel: FC<{large?: boolean}> = ({large = false}) => (
  <div className='position-absolute bg-white border rounded shadow-sm pe-none px-2 py-1'>
    <span
      className='fw-bold text-uppercase'
      style={{fontSize: large ? '13px' : '9px', letterSpacing: '0.14em', color: QR_COLOR}}
    >
      CMA
    </span>
  </div>
)

const QrBlock: FC<{value: string; size: number; modalAttr?: boolean}> = ({
  value,
  size,
  modalAttr,
}) => (
  <div
    className='position-relative d-inline-flex align-items-center justify-content-center'
    {...(modalAttr ? {'data-cma-qr-modal': ''} : {})}
  >
    <QRCodeSVG value={value || 'N/A'} size={size} level='H' fgColor={QR_COLOR} bgColor={QR_BG} />
    <CmaLabel large={size > 200} />
  </div>
)

function saveQrAsPng(value: string) {
  const padding = 48
  const qrSize = 360
  const canvasW = qrSize + padding * 2
  const canvasH = qrSize + padding * 2 + 56

  const canvas = document.createElement('canvas')
  canvas.width = canvasW
  canvas.height = canvasH

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvasW, canvasH)

  const svgEl = document.querySelector('[data-cma-qr-modal] svg') as SVGElement | null
  if (!svgEl) return

  const svgBlob = new Blob([new XMLSerializer().serializeToString(svgEl)], {
    type: 'image/svg+xml;charset=utf-8',
  })
  const url = URL.createObjectURL(svgBlob)
  const img = new Image()

  img.onload = () => {
    ctx.drawImage(img, padding, padding, qrSize, qrSize)
    URL.revokeObjectURL(url)

    const cx = canvasW / 2
    const baseY = padding + qrSize + 28

    ctx.textAlign = 'center'
    ctx.fillStyle = '#6b7280'
    ctx.font = '600 13px monospace'
    ctx.fillText('CMA', cx, baseY)

    ctx.fillStyle = QR_COLOR
    ctx.font = 'bold 16px monospace'
    ctx.fillText(value || 'N/A', cx, baseY + 24)

    const link = document.createElement('a')
    link.download = 'cma-qrcode.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  img.src = url
}

const QrModal: FC<{value: string; onClose: () => void}> = ({value, onClose}) => (
  <div
    className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
    style={{zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)'}}
    onClick={onClose}
  >
    <div
      className='bg-white rounded-3 p-6 d-flex flex-column align-items-center gap-4 shadow-lg'
      style={{width: 'min(90vw, 340px)'}}
      onClick={(e) => e.stopPropagation()}
    >
      <div className='d-flex justify-content-end w-100'>
        <button type='button' className='btn-close' onClick={onClose} aria-label='Close' />
      </div>

      <QrBlock value={value} size={240} modalAttr />

      <div className='text-center lh-base'>
        <div className='text-muted text-uppercase fw-semibold fs-9 ls-1'>CMA ID</div>
        <div
          className='fw-bold text-dark fs-7'
          style={{fontFamily: 'monospace', wordBreak: 'break-all'}}
        >
          {value || 'N/A'}
        </div>
      </div>

      <button
        type='button'
        className='btn btn-sm btn-light-dark d-flex align-items-center gap-1'
        onClick={() => saveQrAsPng(value)}
      >
        <Download size={13} />
        <span className='fw-semibold fs-8 text-uppercase'>Save Image</span>
      </button>
    </div>
  </div>
)

const CmaQRCode: FC<{value?: any}> = ({value = ''}) => {
  const [fullscreen, setFullscreen] = useState(false)

  const handleSave = useCallback(() => saveQrAsPng(value), [value])

  return (
    <>
      <div className='d-inline-flex flex-column align-items-center gap-2'>
        <div
          className='cursor-pointer'
          role='button'
          title='Click to view fullscreen'
          onClick={() => setFullscreen(true)}
        >
          <QrBlock value={value} size={140} />
        </div>
        <span className='text-muted text-uppercase fw-semibold fs-9'>Scan to Dispatch</span>
        <button
          type='button'
          className='btn btn-sm btn-link text-dark fw-semibold fs-9 text-uppercase p-0 d-flex align-items-center gap-1'
          onClick={handleSave}
        >
          <Download size={12} />
          Save QR
        </button>
      </div>
      {fullscreen &&
        createPortal(<QrModal value={value} onClose={() => setFullscreen(false)} />, document.body)}
    </>
  )
}

export default CmaQRCode
