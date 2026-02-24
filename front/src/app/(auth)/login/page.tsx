"use client";

import React, { useState } from 'react';
import { googleProvider, githubProvider, signInWithProvider } from '../../../lib/firebase';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (provider: 'google' | 'github') => {
    setLoading(true);
    try {
      const providerObj = provider === 'google' ? googleProvider : githubProvider;
      const { idToken } = await signInWithProvider(providerObj);
      console.log('[LOGIN] idToken length=', idToken ? idToken.length : 0);

      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message || 'Failed to create session');
      }

      // redirect to home after successful session creation
      window.location.href = '/';
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || 'Sign in failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 border rounded-md">
        <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
        <button
          onClick={() => handleSignIn('google')}
          disabled={loading}
          className="w-full py-2 mb-4 bg-blue-500 text-white rounded"
        >
          Sign in with Google
        </button>

        <button
          onClick={() => handleSignIn('github')}
          disabled={loading}
          className="w-full py-2 bg-gray-800 text-white rounded"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
