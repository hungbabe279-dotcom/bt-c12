# SQL Gateway Demo

This small demo reproduces three pages shown in your screenshots:

- `/emailList` - an email subscription form
- `/thankyou` - a confirmation page showing submitted values
- `/sqlGateway` - a simple SQL entry UI that executes read-only SELECT queries against a local SQLite DB

Quick start (Windows PowerShell):

```powershell
# 1) install dependencies
npm install

# 2) initialize local SQLite database (creates ./data/app.db and seeds sample rows)
npm run init-db

# 3) start server
npm start

# Then open http://localhost:3000 in your browser
```

Notes:
- The SQL gateway only accepts SELECT queries (basic safety for demo).
- Data are stored in `./data/app.db` (SQLite). You can inspect with the `sqlite3` CLI.
Deploying to Render (quick guide)
1) Create a Git repository and push this project to GitHub (or Git provider of choice).
2) In Render dashboard, click "New" → "Web Service" and connect your repo.
	- Build command: `npm install`
	- Start command: `npm start`
	- Environment: `Node`
	- Port: Render provides `PORT` automatically; the app reads `process.env.PORT`.
3) Optionally add a `render.yaml` to this repo (included) and replace `repo` value with your repo URL to use Render's Infrastructure as Code flow.

Notes about production
- This demo stores data in a local SQLite file (`data/app.db`). On Render, use a managed database (Postgres) for persistent storage — currently the app writes to the local filesystem which is ephemeral on some platforms.
- To switch to Postgres, update `server.js` to use `pg` and connection from ENV (e.g. `DATABASE_URL`).

Pushing to Git and deploying to Render (quick checklist)

1) Initialize git and push to your GitHub repo (example):

```bash
git init
git add .
git commit -m "Initial Node email-list demo"
git branch -M main
git remote add origin https://github.com/<youruser>/<yourrepo>.git
git push -u origin main
```

2) Create a new Web Service on Render and connect the repo.
	- Build command: `npm install`
	- Start command: `npm start`
	- Port: leave default (app reads `process.env.PORT`).

3) (Optional) Use `render.yaml` in repo to configure service via IaC.

Admin page
- After app runs, visit `/admin` to see a table of subscribed emails (this hits `/api/emails`).

