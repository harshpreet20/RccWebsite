'use client';

import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type AdminAuthState = {
  user: User | null;
  isOrganizer: boolean;
  loading: boolean;
};

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    isOrganizer: false,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (mounted) setState({ user: null, isOrganizer: false, loading: false });
          return;
        }

        const { data: organizer } = await supabase
          .from('rcc_organizers')
          .select('user_id, name')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (mounted) {
          setState({
            user: session.user,
            isOrganizer: !!organizer,
            loading: false,
          });
        }
      } catch {
        if (mounted) setState({ user: null, isOrganizer: false, loading: false });
      }
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        if (mounted) setState({ user: null, isOrganizer: false, loading: false });
        return;
      }

      const { data: organizer } = await supabase
        .from('rcc_organizers')
        .select('user_id, name')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (mounted) {
        setState({
          user: session.user,
          isOrganizer: !!organizer,
          loading: false,
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
