'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import { Trophy, FileText, LogOut, Loader2 } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) setError(authError.message);
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#C21818] to-[#D4AF37] mb-4">
            <span className="text-white font-black text-lg tracking-wider">RCC</span>
          </div>
          <h1 className="text-white font-black text-2xl tracking-widest uppercase">Admin Login</h1>
          <p className="text-white/40 text-sm mt-2 tracking-wide">Authorized organizers only</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0A0E1A] border border-white/10 rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-[#C21818]/10 border border-[#C21818]/30 rounded-lg px-4 py-3 text-[#C21818] text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-white/60 text-xs tracking-widest uppercase mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#0F1520] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none w-full"
              placeholder="admin@rcc.com"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs tracking-widest uppercase mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#0F1520] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none w-full"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-bold rounded-lg tracking-widest uppercase text-sm transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Signing In…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminHeader() {
  const pathname = usePathname();

  const links = [
    { href: '/admin/tournament', label: 'Tournament', icon: Trophy },
    { href: '/admin/forms', label: 'Forms', icon: FileText },
  ];

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <header className="bg-[#0A0E1A] border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <span className="text-white font-black text-sm tracking-widest uppercase text-[#D4AF37]">
            RCC Admin
          </span>
          <nav className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200 ${
                  pathname?.startsWith(href)
                    ? 'bg-[#C21818]/20 text-[#C21818] border border-[#C21818]/30'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={13} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isOrganizer, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-[#C21818]" />
          <p className="text-white/40 text-sm tracking-widest uppercase">Checking auth…</p>
        </div>
      </div>
    );
  }

  if (!user || !isOrganizer) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-[#050810]">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}
