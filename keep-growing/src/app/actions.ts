'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Leitet zurück zur Login-Seite und hängt einen Error-Parameter an
    return redirect('/login?error=true');
  }

  // Cache leeren, damit der Login-Status überall aktuell ist
  revalidatePath('/', 'layout');
  
  // Weiterleitung zum Dashboard nach erfolgreichem Login
  redirect('/dashboard');
}

export async function handleSignUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const name = formData.get('name') as string;

  if (password !== confirmPassword) {
    return { error: 'passwords-dont-match' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Wir geben Erfolg zurück, damit die Client-Komponente das Modal zeigen kann
  return { success: true };
}

// Falls du deine addNote Funktion behalten willst, kannst du sie hier drunter stehen lassen:
export async function addNote(formData: FormData) {
  const supabase = await createClient();
  const note = formData.get('note') as string;
  
  const { error } = await supabase.from('notes').insert({ content: note });
  
  if (error) {
    console.error('Fehler beim Speichern:', error.message);
    return;
  }
  
  revalidatePath('/dashboard');
}

// src/app/actions.ts
export async function saveDailyEntry(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const score = formData.get('score');
  const note = formData.get('note') as string;
  
  // Erzeugt das Datum im Format YYYY-MM-DD
  const today = new Date().toLocaleDateString('en-CA'); 

  const { error } = await supabase
    .from('daily_entries')
    .upsert({
      user_id: user.id,
      created_at: today, // Geändert von 'date' zu 'created_at' gemäß Screenshot
      score: score ? parseInt(score.toString()) : null,
      note: note,
    }, { 
      onConflict: 'user_id,created_at' // Muss exakt mit dem SQL Constraint übereinstimmen
    });

  if (error) {
    console.error('Fehler beim Speichern:', error.message);
    return;
  }

  revalidatePath('/dashboard');
}