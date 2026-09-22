"use client";

// Studio (content-agent) used to be a separate deployment with its own
// Supabase-based signup/approval flow (role + status columns on app_users).
// It now lives behind RccWebsite's existing /admin login instead -- the
// admin_users allowlist check already happened in app/admin/studio/layout.tsx
// before any of this tree renders, so every field here reports a single,
// already-approved admin rather than re-implementing that flow.

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { signOut as signOutAction } from "@/app/admin/login/actions";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  supabase: SupabaseClient | null;
  role: string | null;
  status: string | null;
  statusError: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isContent: boolean;
  signOut: () => Promise<void>;
  retryStatus: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  supabase: null,
  role: "admin",
  status: "approved",
  statusError: false,
  isAdmin: true,
  isStaff: true,
  isContent: true,
  signOut: async () => {},
  retryStatus: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [sb] = useState<SupabaseClient>(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sb.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
      })
      .finally(() => setLoading(false));

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [sb]);

  const signOut = async () => {
    await signOutAction();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        supabase: sb,
        role: "admin",
        status: "approved",
        statusError: false,
        isAdmin: true,
        isStaff: true,
        isContent: true,
        signOut,
        retryStatus: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
