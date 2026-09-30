# PM Prep Tracker

A six-week product management placement plan with accounts, daily goals and guided case practice.
Built with React (Vite) and Supabase, hosted on Vercel. Free tiers of both are enough.

## What's inside

- **Today**: daily goals split from what's left of the week, a daily habit, a streak and a practice pick
- **Plan**: the six weeks, with checklists, logs, targets and tips
- **Practice**: 300+ questions by type and difficulty; timed, step-by-step practice with a self-review checklist
- **Learn**: framework and tech concept cards, flashcards, 12 sector primers
- **Companies**: company primers, your notes and questions to practise
- **Your banks**: features, journeys, metrics, stories, deep dives and case logs in one searchable place
- **Tools**: RICE/ICE calculator, north star examples, counter metrics, guesstimate numbers

Without Supabase keys the site runs in preview mode, saving progress in the browser only.

---

## Deploy it (beginner guide, about 20 minutes)

You need three free accounts: GitHub, Supabase and Vercel.

### Step 1. Put the code on GitHub

1. Unzip `pm-prep.zip` on your computer. You'll get a folder called `pm-prep`.
2. Open your repository on github.com (for example `github.com/your-name/prod-prep`).
3. Click **Add file → Upload files** (or "uploading an existing file" on an empty repo).
4. Open the `pm-prep` folder, select **everything inside it** (not the folder itself), and drag it onto the GitHub page.
   `package.json` must end up at the top level of the repository.
5. Scroll down and click **Commit changes**. Wait until all files show up.

### Step 2. Set up the database in Supabase

1. In supabase.com, open your project (or create one: any name, Mumbai region, save the password).
2. In the left menu open **SQL Editor → New query**.
3. Open `supabase/schema.sql` from the unzipped folder, copy everything, paste it into the editor and click **Run**. You should see "Success".
4. Go to **Authentication → Sign In / Providers → Email** and turn **off** "Confirm email", then save.
   (Supabase's free email sender only sends a few emails an hour, so confirmation emails would get stuck when many people sign up.)
5. Go to **Project Settings → API** (sometimes called "Data API" / "API Keys"). Keep this tab open. You need:
   - **Project URL** (looks like `https://abcd1234.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`, or a "publishable" key starting with `sb_publishable_`)

### Step 3. Deploy on Vercel

1. In vercel.com click **Add New → Project**.
2. Find your repository in the list and click **Import**. (If you don't see it, click "Adjust GitHub App Permissions" and give Vercel access to it.)
3. Vercel detects **Vite** on its own. Don't change the build settings.
4. Open **Environment Variables** and add two:
   - Name `VITE_SUPABASE_URL`, value: your Project URL
   - Name `VITE_SUPABASE_ANON_KEY`, value: your anon public key
5. Click **Deploy**. After a minute you get a link like `https://prod-prep.vercel.app`.

### Step 4. Tell Supabase your site address

1. Back in Supabase: **Authentication → URL Configuration**.
2. Set **Site URL** to your Vercel link, for example `https://prod-prep.vercel.app`.
3. Under **Redirect URLs** click **Add URL** and add `https://prod-prep.vercel.app/**`. Save.

Without this, password reset links point to the wrong place.

### Step 5. Check it works

Open your Vercel link, create an account, and do one practice case. Then sign in from another device: your progress should be there. If you see "Preview mode" in the sidebar, the Vercel environment variables are missing or misspelled. Fix them in Vercel under **Settings → Environment Variables**, then **Deployments → ⋯ → Redeploy**.

---

## Optional extras

**Forum.** The forum needs its own tables. In Supabase open **SQL Editor → New query**, paste everything from `supabase/forum.sql` and click **Run**. To make someone a moderator (they can hide posts and see reports), run:
`insert into public.forum_admins (user_id) select id from auth.users where email = 'their@email.com';`
The question of the day is picked from the practice bank by date, so it needs no setup.

**Only allow your college email.** In Vercel add `VITE_ALLOWED_EMAIL_DOMAIN` (for example `yourcollege.edu`) and redeploy. Also run the optional block at the end of `schema.sql` in Supabase with your domain filled in, so the database enforces it too.

**Google sign-in.** In Google Cloud Console create an OAuth client (type: Web application) with the callback URL shown in Supabase under **Authentication → Providers → Google**. Paste the client ID and secret into Supabase and enable Google. Then add `VITE_ENABLE_GOOGLE=true` in Vercel and redeploy.

**Updating the site later.** Edit or re-upload files on GitHub. Vercel redeploys automatically after each commit.

## Editing content

All content lives in `src/content/`:

- `weeks.js`: the six weeks, targets and checklists
- `questions.js`: the practice question bank
- `caseTypes.js`: the step-by-step scaffolds, timers and self-review checklists
- `concepts.js`, `sectors.js`, `companies.js`, `reference.js`: learning material

Keep existing tracker `id`s unchanged once people have started logging, since saved entries are linked to them.

## Run it on your computer (optional)

```
npm install
cp .env.example .env.local   # fill in the keys, or leave blank for preview mode
npm run dev
```
