<div align="center">

# KEEP GROWING

<img width="300" src="./keep-growing/public/images/Yoga_Frau.jpg" alt="Keep Growing Yoga Frau" />

</div>

## Dein Set-up für mentales Wachstum

**Keep Growing** ist eine Web-App für Autogenes Training und mentale Selbstfürsorge: Stimmungs-Tagebuch, geführte Audio-Entspannungsübungen, Auswertung der eigenen Trainingsdaten und ein interaktiver Blumengarten als Gamification-Element. Die App ersetzt keine medizinische Behandlung, sondern unterstützt junge, digital affine Frauen dabei, bewusste Entspannungsroutinen in den Alltag zu integrieren und durch soziale Interaktion dranzubleiben.

Entstanden ist Keep Growing durch den Studiengang BWL–Gesundheitsmanagement (WGM 23) an der DHBW Ravensburg. Umgesetzt wurde dies als eine **responsive Webanwendung** für eine größtmögliche Unabhängigkeit von Drittanbietern.

## Inhalt

Funktionsüberblick
Technologie-Stack
Quick Start
Projektstruktur
Fachliche Konzepte
Supabase
Deployment
Design & Theming
Bekannte Einschränkungen
Debugging

## Funktionsüberblick

**Registrierung & Anmeldung.** Per E-Mail/Passwort mit vollständigem Passwort-vergessen-Ablauf und Bestätigungs-Modals. Bereits eingeloggte User werden automatisch zum Dashboard weitergeleitet.

**Dashboard & Tagebuch.** Tägliche Erfassung der eigenen Stimmung via Emoji (🤩, 😊, 😢, 😴) und ein Freitextfeld für Notizen. Diese "Daily Entries" können im Laufe des Tages jederzeit aktualisiert werden.

**Trainingsbereich.** Vier Methoden für Autogenes Training:

Übung	Inhalt
🌸 Creativity & warmth	Kreativität, Meditation und innere Energie
🪻 Imaginative training	Vorstellungskraft und geführte Atemübungen
🌼 Inner peace	Innere Ruhe und Selbstliebe
🌷 Self-empowerment	Entspannung und persönliche Stärkung

Das Training startet über eine "Hold to start"-Interaktion. Ein eigener Audio-Player ermöglicht das Pausieren und Spulen.

**Blumengarten (Gamification).** Nach jedem abgeschlossenen Training wird eine neue Blume freigeschaltet. Diese kann auf dem Wiesen-Canvas frei platziert und später via "Edit"-Modus verschoben werden.

**Freunde & Social.** Nutzer können nach E-Mail-Adressen suchen und Freundschaftsanfragen (Requests) versenden. Befreundete Nutzer können gegenseitig ihre Gärten besuchen, diese mit einem Herz (♥) liken und kleine Nachrichten hinterlassen.

**Insights.** Ein interaktives SVG-Diagramm auf dem Dashboard visualisiert die Trainingshäufigkeit der letzten acht Kalenderwochen im Vergleich zum individuellen Stimmungs-Score.

**Einstellungen.** *Account* (Passwort ändern, Logout), *Blumengarten* (Garten manuell zurücksetzen) und *Impressum* (AGB, Datenschutz, Team).

### Zusammenspiel der Hauptfunktionen

Die einzelnen Funktionen der Anwendung sind miteinander verbunden. Die täglichen Stimmungseinträge bilden die Grundlage für die Auswertung auf dem Dashboard. Abgeschlossene Trainingseinheiten werden protokolliert und können dadurch für die Insights sowie für die Freischaltung von Blumen verwendet werden.

Der Blumengarten stellt dabei die sichtbare Gamification-Komponente dar: Training wird nicht nur dokumentiert, sondern führt gleichzeitig zu neuem Wachstum im virtuellen Garten.

Die Social-Funktion erweitert dieses Konzept um eine soziale Komponente. Gärten können mit akzeptierten Freunden geteilt, besucht und mit Likes sowie Nachrichten versehen werden.

## Technologie-Stack

Bereich	Technologie
Framework	Next.js (App Router), React, TypeScript
Styling & UI	Tailwind CSS + Framer Motion (für flüssige UI-Übergänge)
Datenbank & Auth	Supabase (PostgreSQL), @supabase/supabase-js
Hosting	Vercel

Ein eigener Backend-Server existiert nicht: Das Frontend spricht über Next.js Server Actions und Client Components direkt mit Supabase. Der Zugriffsschutz liegt in den Datenbank-Policies (RLS).

### Architektur

Die Anwendung ist als Next.js-Webanwendung aufgebaut. Die Seiten und UI-Komponenten liegen innerhalb der app-Struktur. Für Authentifizierung und Datenbankzugriffe werden Supabase-Clients für unterschiedliche Ausführungskontexte verwendet.

Dabei kommen sowohl Client Components als auch Server-seitige Funktionen bzw. Server Actions zum Einsatz. Die Authentifizierung wird über Supabase umgesetzt, während die Session in Cookies gehalten und bei geschützten Bereichen geprüft wird.

Die Datenhaltung erfolgt zentral in PostgreSQL über Supabase. Ein separater eigener Backend-Server ist nicht Bestandteil der Anwendung.

## Quick Start

**Voraussetzungen:** Node.js 18+, npm und ein Supabase-Projekt.

git clone https://github.com/Florian565/Keep_Growing.git
cd Keep_Growing
npm install
cp .env.example .env.local   # Werte eintragen
npm run dev                  # http://localhost:3000

Das Repository ist auf GitHub verfügbar.

Ohne funktionierendes Supabase-Projekt und eingespielte Migrationen (z.B. blumengarten/freunde/supabase-migration.sql) schlagen Features wie die Freundesliste fehl.

### Lokale Entwicklung

Nach der Installation der Abhängigkeiten und der Konfiguration der Umgebungsvariablen kann die Anwendung mit npm run dev lokal gestartet werden. Die Entwicklungsanwendung ist anschließend unter http://localhost:3000 erreichbar.

Für die Nutzung der datenbankabhängigen Funktionen muss ein funktionierendes Supabase-Projekt vorhanden sein. Insbesondere die zusätzlichen Tabellen und Policies für die Freundesfunktion müssen im jeweiligen Supabase-Projekt eingerichtet sein.

## Projektstruktur

public/
  images/
    autogenes-training.png
    flower-1.png
    ...
    Yoga_Frau.jpg

src/
  middleware.ts
  app/
    actions.ts
    global-error.tsx
    globals.css
    layout.tsx
    page.tsx

    (auth)/
      forgot-password/
      login/
      register/
      reset-password/
        callback/
          route.ts

    (mainpage)/
      blumengarten/
        DashboardGardenButton.tsx
        flowers.ts
        HomeButton.tsx
        page.tsx
        auswahl_blume/

      freunde/
        AENDERUNGEN-AUSSERHALB.md
        DashboardFriends.tsx
        LikeNotifications.tsx
        page.tsx
        README.md
        supabase-migration.sql
        [friendId]/
          page.tsx

      dashboard/
      einstellungen/
      impressum/
      trainings/

  lib/
    supabase/
      client.ts
      middleware.ts
      server.ts

### Bereiche der Anwendung

public/images/ enthält statische Bilder und visuelle Assets der Anwendung, unter anderem Trainings- und Blumenbilder.
src/app/(auth)/ enthält die öffentlichen Authentifizierungsseiten für Login, Registrierung und Passwort-Wiederherstellung.
src/app/(mainpage)/ enthält den geschützten Hauptbereich der Anwendung.
blumengarten/ beinhaltet die Darstellung und Verwaltung des virtuellen Gartens sowie die verfügbaren Blumen.
freunde/ enthält die Social-Funktionen wie Freundschaftsanfragen, Freundesgärten, Likes und Benachrichtigungen.
dashboard/ bildet die zentrale Übersichtsseite.
trainings/ enthält den Trainingsbereich.
einstellungen/ und impressum/ stellen die entsprechenden Verwaltungs- und Informationsseiten bereit.
src/lib/supabase/ enthält die verschiedenen Supabase-Zugriffsschichten für Client-, Server- und Middleware-Kontext.

Die Datei src/app/(mainpage)/freunde/README.md enthält zusätzliche Informationen speziell zur Implementierung der Freundesfunktion.

## Fachliche Konzepte

### Garten-Reset und Monatszyklus

Die App archiviert Blumen automatisch. Im Blumengarten werden nur Blumen geladen, deren created_at nach dem Ersten des aktuellen Monats (oder nach dem Datum in garden_settings.last_reset_at) liegt.

Das Feld leert sich also regelmäßig, um Platz für neues Wachstum zu schaffen, ohne die historischen Daten zu löschen.

Der Reset betrifft damit die Darstellung bzw. den aktuell aktiven Gartenzyklus und nicht das vollständige Löschen historischer Daten.

Ein manueller Reset des Blumengartens ist zusätzlich über die Einstellungen möglich.

### Rotierendes Training

Wählt eine Nutzerin eine der vier Hauptkategorien, rotiert die App automatisch durch die verfügbaren Audios dieser Kategorie.

Der zuletzt gehörte Index wird im localStorage (last_training_index_...) gespeichert, sodass immer das nächste Training abgespielt wird, um Abwechslung zu garantieren.

Die Speicherung im localStorage betrifft damit die Auswahl bzw. Reihenfolge der lokal verwendeten Trainingsinhalte und nicht die dauerhafte Speicherung der Trainingshistorie in der Datenbank.

### Trainingsprotokoll und Blumen

Abgeschlossene Trainingseinheiten werden in trainings_log gespeichert. Dadurch kann nachvollzogen werden, welche Trainings absolviert wurden.

Das Abschließen eines Trainings ist gleichzeitig mit der Gamification des Blumengartens verbunden: Nach einem abgeschlossenen Training wird eine neue Blume freigeschaltet.

Die Blumen selbst werden anschließend im virtuellen Garten platziert. Für die Platzierung werden unter anderem die Position auf der Wiese und die Reihenfolge der Ebenen gespeichert.

### Benachrichtigungen (In-App & Browser)

Likes und Freundschaftsanfragen erzeugen In-App-Benachrichtigungen.

Zusätzlich können User native Browser-Benachrichtigungen (Push) aktivieren, die feuern, sobald ein Garten-Like eingeht.

Damit bestehen zwei Ebenen der Benachrichtigung: Die Anwendung kann Ereignisse innerhalb der Oberfläche anzeigen und – sofern aktiviert – zusätzlich über Browser-Benachrichtigungen darauf aufmerksam machen.

### Freundschaften und Zugriffslogik

Freundschaften werden über die Tabelle friendships verwaltet. Eine Freundschaft kann zunächst den Status pending besitzen und nach Annahme den Status accepted erhalten.

Der Zugriff auf fremde Gärten ist an diese akzeptierte Freundschaft gekoppelt. Dadurch können nicht beliebige Nutzer die privaten Gärten anderer Nutzer laden.

Weitere Informationen zur technischen Umsetzung befinden sich in src/app/(mainpage)/freunde/README.md sowie in der zugehörigen supabase-migration.sql.

### Insights

Das Dashboard stellt die Trainingsaktivität der letzten acht Kalenderwochen der individuellen Stimmung gegenüber.

Dafür werden die protokollierten Trainingsdaten und die täglichen Stimmungswerte gemeinsam visualisiert. Die Darstellung erfolgt als interaktives SVG-Diagramm.

## Supabase

Supabase ist Datenbank und Authentifizierung in einem.

### Datenmodell

Alle anwendungsbezogenen Tabellen hängen direkt oder indirekt an der auth.users Tabelle.

auth.users
   │
   ├── profiles
   │     Stammdaten (id, full_name, email)
   │
   ├── daily_entries
   │     Stimmung und Notizen pro Tag
   │
   ├── trainings_log
   │     Aufzeichnung absolvierter Audios
   │
   ├── flower_garden
   │     Platzierte Blumen
   │
   ├── friendships
   │     Soziale Verknüpfung
   │
   ├── notifications
   │     Benachrichtigungen
   │
   ├── garden_likes
   │     Likes für Gärten
   │
   └── garden_settings
         Einstellungen für den Garten

**profiles** – Stammdaten

id
full_name
email

**daily_entries** – Stimmung und Notizen pro Tag

user_id
created_at
score
note

Die täglichen Einträge bilden die Grundlage für das Stimmungstagebuch und werden außerdem für die Insights verwendet.

**trainings_log** – Aufzeichnung absolvierter Trainings

user_id
training_type
completed_at

Die Tabelle dokumentiert abgeschlossene Trainingseinheiten und stellt damit die dauerhafte Trainingshistorie dar.

**flower_garden** – Platzierte Blumen

user_id
flower_type
x
y
layer_order

Neben dem verwendeten Blumentyp werden die Position und die Ebenenreihenfolge gespeichert. Dadurch kann die individuelle Anordnung des Gartens wiederhergestellt werden.

**friendships** – Soziale Verknüpfung

requester_id
addressee_id
status: pending | accepted

Die Tabelle bildet sowohl ausstehende Freundschaftsanfragen als auch angenommene Freundschaften ab.

**notifications & garden_likes** – Für das Like- und Benachrichtigungssystem.

Diese Tabellen bilden die technische Grundlage für Likes auf fremden Gärten und die daraus entstehenden Benachrichtigungen.

**garden_settings** – Speichert den last_reset_at Timestamp.

Das Datum wird für den Monatszyklus des Blumengartens verwendet.

### Row Level Security

RLS ist auf den Tabellen aktiv.

Besonders bei den Fremd-Gärten greift die RLS massiv: Die Abfrage im Frontend (FriendGardenPage) und die Datenbank-Policies stellen sicher, dass der Garten eines Nutzers nur geladen wird, wenn in der Tabelle friendships der Status accepted zwischen beiden User-IDs steht.

Weitere Informationen zur Implementierung der Freundesfunktion befinden sich in src/app/(mainpage)/freunde/README.md und in der zugehörigen supabase-migration.sql.

Die RLS stellt damit eine zusätzliche Zugriffsebene neben der Prüfung in der Anwendung dar. Gerade bei sozialen Funktionen ist dies relevant, da ein Nutzer nicht allein durch Kenntnis einer anderen User-ID auf dessen Garten zugreifen können soll.

### Authentifizierung

**Verfahren:** E-Mail + Passwort (signUp, signInWithPassword).

**Session:** Die Session wird über Supabase in Cookies gehalten und in Next.js Server Components (await supabase.auth.getUser()) geprüft, um geschützte Routen (Dashboard, Garten etc.) abzusichern.

Die Authentifizierung und die geschützten Bereiche sind damit voneinander getrennt: Die Auth-Seiten befinden sich unter (auth), während die eigentlichen Anwendungsbereiche unter (mainpage) liegen.

### Supabase-Migrationen

Die zusätzlichen Tabellen für die Freundesfunktion werden über die Datei supabase-migration.sql eingerichtet.

Diese Migration enthält die für die Freundesfunktion benötigten Datenbankänderungen und Policies. Bei einer neuen Supabase-Instanz muss daher darauf geachtet werden, dass die entsprechenden SQL-Änderungen ebenfalls eingespielt werden.

Die zugehörige Datei befindet sich unter:

src/app/(mainpage)/freunde/supabase-migration.sql

## Deployment

Gehostet wird die Next.js-Applikation aktuell auf Vercel, was eine nahtlose CI/CD-Integration mit GitHub ermöglicht.

### Aktive Anwendung

Die aktuell bereitgestellte Version ist über die folgende Domain erreichbar:

Keep Growing – Live Demo

Der Login ist direkt erreichbar unter:

Keep Growing – Login

Das aktuelle Vercel-Deployment läuft unter:

Keep Growing – Vercel Deployment

### Deployment-Struktur

Die Anwendung wird als Next.js-Applikation auf Vercel betrieben. Das Repository liegt auf GitHub und bildet die Grundlage für die Bereitstellung der Anwendung.

Die Datenbank und Authentifizierung werden nicht von Vercel selbst bereitgestellt, sondern über das verbundene Supabase-Projekt realisiert.

Für einen vollständigen Betrieb müssen deshalb sowohl die Anwendung als auch das zugehörige Supabase-Projekt korrekt konfiguriert sein.

## Design & Theming

Das UI-Design ist gezielt beruhigend, minimalistisch und feminin aufgebaut:

**Farben:** Warme Beige-Töne (#fdfcfb, #f2f2eb) und beruhigendes Altrosa (#b57a84, #c08a95) dominieren das Bild.
**Typografie:** Es wird ein Mix aus klaren, serifenlosen Web-Fonts (--font-geist-sans) und einer geschwungenen Cursive-Font für emotionale Headlines ("hello user", "About us") genutzt.
**Hintergründe:** Die Blumenwiese ist kein statisches Bild, sondern wird durchgehend als inline-SVG mit weichen Farbverläufen (#f8f8f1 zu #e5edd5) und Texturen (feTurbulence) zur Laufzeit gerendert, um scharfe Darstellung auf allen Geräten zu sichern.

### Animationen und Interaktion

Für flüssige UI-Übergänge wird Framer Motion eingesetzt. Dadurch können Interaktionen innerhalb der Anwendung animiert dargestellt werden.

Ein besonderes interaktives Element ist die "Hold to start"-Interaktion beim Start eines Trainings.

Auch der Blumengarten ist interaktiv aufgebaut: Blumen können auf dem Wiesen-Canvas frei positioniert und im Edit-Modus verschoben werden.

## Bekannte Einschränkungen

Da es sich aktuell um einen MVP (Minimum Viable Product) handelt, gibt es noch Abweichungen vom anfänglichen Lastenheft:

**Keine PayPal-Integration:** Die Zahlungsabwicklung für In-App-Käufe oder reale Blühpatenschaften via PayPal ist im Code noch nicht aktiv implementiert.
**Kein Hetzner-Hosting:** Entgegen des Lastenhefts wird aktuell Vercel für das Frontend-Hosting genutzt.
**Keine Wearable-Anbindung:** Die automatische Datenübernahme aus Apple Health oder Google Fit fehlt in dieser Version noch.
**Fehlende automatische Tests:** Unit- und E2E-Tests wurden bisher nicht integriert.

### Weitere technische Grenzen

Die Anwendung ist aktuell auf die vorhandenen Funktionen des MVP ausgerichtet. Insbesondere die im Lastenheft vorgesehenen externen Integrationen wie Zahlungsabwicklung und Wearable-Datenübernahme sind noch nicht Bestandteil der produktiven Anwendung.

Auch die fehlenden automatisierten Unit- und E2E-Tests bedeuten, dass Änderungen derzeit nicht durch eine automatisierte Testsuite abgesichert werden.

## Debugging

Wo	Was
Terminal von npm run dev	Server-Logs, Next.js Fehlermeldungen
Browser-Konsole (F12)	Client-Fehler, Probleme mit localStorage (z.B. fehlerhafte Audio-Indizes)
Supabase Dashboard → Logs	Abgelehnte Queries, RLS-Blocks, fehlerhafte Authentifizierungen

**Freundesliste bleibt leer / wirft Fehler?**

Überprüfen, ob die SQL-Migration blumengarten/freunde/supabase-migration.sql im Supabase-Projekt ausgeführt wurde.

**Blumen setzen sich nicht zurück?**

Prüfen, ob die Server Action handleGardenReset die Tabelle garden_settings korrekt beschreiben darf.

**Trainingsrotation funktioniert nicht wie erwartet?**

Da der zuletzt verwendete Trainingsindex im localStorage gespeichert wird, sollte bei Problemen zunächst die Browser-Konsole überprüft und der lokale Speicher kontrolliert werden. Die relevanten Einträge beginnen mit last_training_index_....

**Daten werden nicht geladen oder gespeichert?**

Bei Problemen mit Datenbankzugriffen sollte zunächst geprüft werden, ob die Supabase-Verbindung korrekt konfiguriert ist. Anschließend können die Logs im Supabase Dashboard auf abgelehnte Queries oder RLS-Blocks überprüft werden.

**Geschützte Seiten sind nicht erreichbar?**

In diesem Fall sollte die Authentifizierung und die vorhandene Supabase-Session geprüft werden. Die Session wird über Cookies gehalten und für geschützte Bereiche über supabase.auth.getUser() geprüft.

## Lizenz

Entwickelt für das Programm WGM 23 (Angewandtes Präventionsmanagement) an der DHBW Ravensburg. Bitte vor kommerzieller Verwendung Rücksprache halten.

## Autoren

Konzept und Lastenheft: Johanna Beckmann und Victoria Stein.

Umsetzung & Entwicklung: Florian Trapp, Elias Huber und Marlon Brunner.

**Viel Erfolg beim persönlichen Wachsen! 🌸**



