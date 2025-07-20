import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { Tables } from '../../../types/supabase';

type Profile = Tables<'profiles'>;

interface UseProfileCheckReturn {
  profile: Profile | null;
  isProfileComplete: boolean;
  loading: boolean;
  createProfile: (data: { name: string; username?: string }) => Promise<boolean>;
}

export const useProfileCheck = (): UseProfileCheckReturn => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  

  const checkProfile = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        return;
      }

      setProfile(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      checkProfile();
    } else {
      setLoading(false);
    }
  }, [user, checkProfile]);
  const createProfile = async (data: { name: string; username?: string }): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      
      const profileData = {
        id: user.id,
        email: user.email || null,
        name: data.name.trim(),
        username: data.username?.trim() || null,
        avatar_url: null,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) throw error;

      setProfile(profileData as Profile);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Un perfil está completo si tiene al menos el nombre, email y username
  const isProfileComplete = Boolean(profile?.name && profile?.email && profile?.username);

  return {
    profile,
    isProfileComplete,
    loading,
    createProfile
  };
}; 