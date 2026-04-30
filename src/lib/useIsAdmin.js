import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const ADMIN_EMAILS = ['barak@vppsolarclub.com', 'liav@vppsolarclub.com'];

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(u => {
        setUser(u);
        setIsAdmin(u?.role === 'admin' || ADMIN_EMAILS.includes(u?.email));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { isAdmin, user, loading };
}