import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <html>
      <body>
        <main>
          <h1>TODO App - Frontend</h1>
          <p>This is a minimal Next.js App Router placeholder.</p>
          <p>
            <Link href="/login">Sign in</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
