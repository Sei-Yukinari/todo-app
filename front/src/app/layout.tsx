import './globals.css'
import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const serverConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const firebaseConfigScript = `(function(){
    try {
      // set server-provided values if present
      window.__FIREBASE_CONFIG = ${JSON.stringify(serverConfig)} || {};
    } catch(e) { window.__FIREBASE_CONFIG = window.__FIREBASE_CONFIG || {}; }
    // then attempt to fetch a runtime copy from the server to ensure values are available
    try {
      fetch('/api/firebase-config').then(function(r){ if(!r.ok) return; return r.json(); }).then(function(j){ if(j && j.data){ window.__FIREBASE_CONFIG = Object.assign(window.__FIREBASE_CONFIG||{}, j.data); } }).catch(function(){ /* ignore */ });
  })();`;

  return (
    <html>
      <head>
        <script dangerouslySetInnerHTML={{ __html: firebaseConfigScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}

