import { redirect } from 'next/navigation';

/**
 * Dies ist die Root-Seite deiner App.
 * Da die Login-Seite die Startseite sein soll, 
 * leiten wir jeden Besucher sofort nach /login weiter.
 */
export default function RootPage() {
  // Wichtig: Da deine Datei im Ordner (auth)/login/page.tsx liegt,
  // ist sie unter der URL "/login" erreichbar.
  redirect('/login');
}