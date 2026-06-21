# AIADS

Platformă AI self-serve de advertising pentru companii din România. Clientul își conectează conturile de social media, descrie campania dorită printr-un chat AI, iar platforma generează și lansează automat campania pe rețelele alese, via API-urile oficiale.

## Cum funcționează

1. Clientul își creează cont și conectează platformele dorite (Meta, TikTok, Google, LinkedIn) prin OAuth.
2. Clientul descrie campania în Chat AI (ex: *"reach pe TikTok, atașez clip, 2 zile, buget 40 RON, target București"*).
3. AI-ul extrage parametrii campaniei (obiectiv, buget, durată, targeting, creative) și o configurează automat.
4. Campania este lansată via API-ul platformei alese (Meta Marketing API, TikTok Marketing API, Google Ads API, LinkedIn Marketing API).
5. Clientul plătește în avans în contul AIADS; sistemul reține un comision de 10%, restul fiind credit informativ pentru campanii (plata reală către platforme se face din contul AIADS).

## Stack tehnic

- **Frontend/Backend:** Next.js
- **Bază de date & Auth:** Supabase
- **Hosting:** Vercel
- **AI:** Claude API (interpretare cereri client, configurare campanii)
- **Integrări publicitare:** Meta Marketing API, TikTok Marketing API, Google Ads API, LinkedIn Marketing API

## Structura aplicației

- **Splash** – ecran de pornire
- **Login / Sign-up** – autentificare
- **Chat AI** – hub central, interfața principală după login
- **Dashboard** – campanii active, statistici, istoric
- **Cont** – setări, conturi sociale conectate, facturare
- **GDPR**
- **Privacy**
- **Contract**

## Model de business

- Client plătește suma dorită + TVA către AIADS
- Comision AIADS: 10% din sumă
- Restul (90%) devine credit informativ în cont, folosit pentru a configura campanii; plata efectivă către platforme (Meta/TikTok/Google/LinkedIn) se face din contul de business AIADS

## Status

🚧 În dezvoltare
