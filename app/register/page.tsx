'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Code2, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Register the user
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Registration failed', { style: { background: '#18181b', color: '#fafafa', border: '1px solid #27272a' } });
        setLoading(false);
        return;
      }

      // 2. Sign in immediately after successful registration
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        toast.error('Registered, but automatic login failed. Please sign in.', { style: { background: '#18181b', color: '#fafafa', border: '1px solid #27272a' } });
        router.push('/login');
      } else {
        toast.success('Account created successfully!', { style: { background: '#18181b', color: '#fafafa', border: '1px solid #27272a' } });
        router.push('/editor');
        router.refresh();
      }
    } catch (error) {
      toast.error('An error occurred during registration');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <Link href="/" className="flex items-center justify-center gap-2 group mb-8">
          <div className="w-10 h-10 rounded-xl bg-green-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(52,211,153,0.3)]">
            <Code2 className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
          </div>
          <span className="text-3xl font-bold text-zinc-100 tracking-tight">Reviewly<span className="text-green-400">.ai</span></span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-green-400 hover:text-green-300 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-[#0a0a0c] py-8 px-4 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/5 sm:rounded-2xl sm:px-10 backdrop-blur-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-zinc-800 rounded-xl shadow-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 bg-zinc-900/50 text-white sm:text-sm transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-zinc-800 rounded-xl shadow-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 bg-zinc-900/50 text-white sm:text-sm transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-zinc-800 rounded-xl shadow-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 bg-zinc-900/50 text-white sm:text-sm transition-all"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.2)] text-sm font-bold text-zinc-950 bg-green-400 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 focus:ring-offset-[#09090b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
