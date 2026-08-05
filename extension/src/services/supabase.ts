import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Auth ---

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function verifyOtp(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// --- Resume Storage ---

export async function saveResume(name: string, content: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('resumes')
    .upsert(
      {
        user_id: session.user.id,
        name,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,name' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function loadResumes() {
  const { data, error } = await supabase
    .from('resumes')
    .select('id, name, created_at, updated_at')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function loadResume(id: string) {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteResume(id: string) {
  const { error } = await supabase.from('resumes').delete().eq('id', id);
  if (error) throw error;
}
