# Chauffeur Rapide

Plateforme ivoirienne de mise en relation entre chauffeurs et personnes
recherchant un chauffeur. MVP mobile-first, en français, pensé pour un
public parfois peu à l'aise avec le numérique.

## Stack & choix techniques

| Domaine | Choix | Pourquoi |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Un seul framework pour le front et le back (Server Actions + Route Handlers) |
| UI | Tailwind CSS v4 | Mobile-first rapide, pas de dépendance CSS lourde |
| Base de données | PostgreSQL | Relationnel, robuste, largement supporté (Supabase, Neon...) |
| ORM | Prisma 7 (`prisma-client` + `@prisma/adapter-pg`) | Typage bout en bout, migrations versionnées |
| Auth | Cookie httpOnly signé (JWT via `jose`) + `bcryptjs` | Plus simple et prévisible qu'un provider externe pour un MVP ; migration vers NextAuth/Clerk possible plus tard sans changer le reste du code (voir `lib/auth/`) |
| Formulaires | Server Actions + Zod | Moins de JS envoyé au client, marche même en connexion faible, validation partagée client/serveur |
| Fichiers | Stockage local abstrait (`lib/storage/`) | Interface `StorageProvider` prête à être remplacée par un provider S3 en production (voir TODO dans le fichier) |
| WhatsApp | Abstraction + machine à états (`lib/whatsapp/`) | Fonctionne dès maintenant en mode "mock" (log console), prête à recevoir une vraie intégration Meta Cloud API |

Toute la logique métier vit dans `lib/services/*` et est appelée à la fois
par les Server Actions (formulaires) et par les Route Handlers REST
(`app/api/**`), pour rester réutilisable par un futur client mobile ou par
le bot WhatsApp.

## Démarrer le projet

### 1. Prérequis

- Node.js 20+
- Une base PostgreSQL (Supabase, Neon, ou une instance locale)

### 2. Installation

```bash
npm install
cp .env.example .env
```

Renseignez `DATABASE_URL` dans `.env` avec votre chaîne de connexion
PostgreSQL, et générez un `AUTH_SECRET` aléatoire (`openssl rand -base64 32`).

### 3. Base de données

```bash
npx prisma migrate dev
npx prisma db seed
```

Le seed crée des catégories, des chauffeurs de démo et ces comptes de test :

| Rôle | Identifiant | Mot de passe |
|---|---|---|
| Admin | `admin@chauffeurrapide.ci` | `Admin123!` |
| Chauffeur (profil validé) | `+2250700000001` | `Chauffeur123!` |
| Client | `+2250100000000` | `Client123!` |

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
app/                    Pages (App Router) + Server Actions colocalisées (actions.ts)
  api/                   Route Handlers REST (recherche, contact, réservation, fichiers, webhook WhatsApp)
  admin/                 Espace administrateur (protégé, rôle ADMIN)
  chauffeur/             Inscription, dashboard chauffeur (protégé, rôle DRIVER)
  chauffeurs/[id]/       Profil public d'un chauffeur
components/             Composants UI réutilisables + composants métier
lib/
  auth/                  Sessions (JWT cookie), mots de passe, guards de rôle
  services/              Logique métier partagée (recherche, onboarding, contact, admin...)
  storage/               Abstraction de stockage de fichiers
  whatsapp/              Abstraction + machine à états de conversation
  billing/                Abstraction de monétisation (crédits de contact)
  validations/            Schémas Zod
prisma/                  Schéma, migrations, seed de démo
storage/uploads/         Fichiers uploadés (gitignored, jamais dans /public)
```

## Sécurité des documents

Les pièces d'identité et permis de conduire sont stockés **hors** de
`/public`, dans `storage/uploads/` (gitignored). Ils ne sont accessibles que
via `GET /api/files/[id]`, qui vérifie que l'appelant est soit le chauffeur
propriétaire du document, soit un administrateur. Seule la photo de profil
est publique.

## Validation des profils

Un chauffeur n'est affiché comme « ✓ Vérifié » qu'après validation de ses
documents par un administrateur (`app/admin/chauffeurs/[id]`). Avant cela,
son profil reste visible avec un statut « en attente » ou « en
vérification ».

## Tester le flux WhatsApp (abstraction)

Aucune vraie intégration Meta Cloud API n'est branchée, mais la machine à
états de conversation (`lib/whatsapp/onboarding.ts`) est fonctionnelle. Pour
la tester en local :

```bash
curl -X POST http://localhost:3000/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{"from":"+2250700009999","text":"Bonjour"}'
```

Répétez avec des réponses successives (même `from`) pour dérouler tout le
scénario (prénom, nom, commune, catégorie, expérience, disponibilité,
zones, confirmation). Les messages envoyés par le bot apparaissent dans les
logs du serveur (`[WhatsApp:mock] -> ...`). À la fin, un compte chauffeur
est créé avec un mot de passe temporaire communiqué dans le message final.

Pour brancher une vraie intégration : voir les `TODO` dans
`lib/whatsapp/service.ts`.

## Monétisation (architecture prête, non intégrée)

- `CreditWallet` accorde 3 mises en contact gratuites par client.
- Au-delà, une `ContactRequest` est créée mais marquée `unlocked: false`.
- `lib/billing/index.ts` isole cette logique avec des `TODO` détaillés pour
  brancher un vrai fournisseur de paiement (CinetPay, Wave, Stripe...).

## Hors scope du MVP (TODO explicites dans le code)

- Intégration réelle WhatsApp Business (Meta Cloud API) — `lib/whatsapp/service.ts`
- Paiement réel pour débloquer des contacts / abonnements — `lib/billing/index.ts`
- Stockage S3 en production — `lib/storage/index.ts`
- Vérification par SMS/OTP du numéro de téléphone à l'inscription
- Système de matching automatique chauffeur ↔ demande (la structure de
  données — catégories, zones, disponibilité — le permet déjà)

## Scripts utiles

```bash
npm run dev          # serveur de développement
npm run build         # build de production
npm run lint          # ESLint
npx prisma studio      # explorer la base de données
```
