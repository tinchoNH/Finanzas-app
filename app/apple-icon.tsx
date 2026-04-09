import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          borderRadius: '36px',
        }}
      >
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #d97706',
          }}
        >
          <span
            style={{
              fontSize: '76px',
              fontWeight: 'bold',
              color: '#0f172a',
              lineHeight: 1,
            }}
          >
            $
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
