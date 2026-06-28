# CSE Academic Nexus

Production-ready Next.js App Router portal for BSc CSE academic resources.

## Features

- Firebase Authentication: Google, email/password, forgot password, email verification.
- Role-based access: students read content, admins manage content.
- Firestore collections: `users`, `roles`, `semesters`, `subjects`, `courseDetails`, `resources`, `settings`.
- Routine and notice image links managed from the Admin CMS without paid Firebase Storage.
- Semester dashboard, course details pages, instant course search, profile and recent courses.
- Admin CMS for homepage text, routine images, subject details, Google Drive links, deletion, and user roles.
- Firestore and Storage security rules included.
- Responsive light UI with dark mode.

## Setup

1. Create a Firebase project.
2. Enable Authentication providers: Email/Password and Google.
3. Create Firestore Database. Firebase Storage is optional and not required for the free setup.
4. Copy `.env.example` to `.env.local` and fill in the Firebase web app values.
5. Install and run:

```bash
pnpm install
pnpm dev
```

## Seed Firestore

Create a Firebase service account in Project Settings, then run:

```bash
$env:FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
$env:SEED_ADMIN_EMAIL='shazidsaharia21@gmail.com'
pnpm seed
```

The seed uses the supplied BSc CSE syllabus for all eight semesters. Google Drive links are intentionally empty so they are never hardcoded in the frontend; add them from the Admin Dashboard.

After `shazidsaharia21@gmail.com` signs up once, promote that account:

```bash
$env:FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
$env:ADMIN_EMAIL='shazidsaharia21@gmail.com'
pnpm promote-admin
```

## Deploy Rules

```bash
firebase deploy --only firestore:rules,storage
```

Deploy the Next.js app to Vercel or Firebase App Hosting after adding the same environment variables there.
