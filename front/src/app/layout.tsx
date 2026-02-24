import './globals.css'
import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const firebaseConfigScript = `window.__FIREBASE_CONFIG = ${JSON.stringify({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  })}`;

  return (
    <html>
      <head>
        <script dangerouslySetInnerHTML={{ __html: firebaseConfigScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}

