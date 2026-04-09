import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: '100px',
        }}
      >
        <div
          style={{
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            backgroundColor: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '12px solid #d97706',
          }}
        >
          <span
            style={{
              fontSize: '220px',
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
