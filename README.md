Raider Portal

Hosting
- Code lives on GitHub. Vercel builds and runs it from the main branch.
- Vercel: import the repo, framework "Other", no build command. public/ is served, api/ becomes serverless functions.

Environment variables (Vercel > Settings > Environment Variables)
- ADMIN_PASSWORD: the admin login password. Use a long passphrase.
- SESSION_SECRET: random string, 32+ characters.
- GITHUB_TOKEN: fine-grained token limited to this one repo with Contents: read and write.
- GITHUB_REPO: owner/name, like yourname/raider-portal.
- GITHUB_BRANCH (optional, default main) and CONFIG_PATH (optional, default config/site.json).

Admin
- Open /admin on your Vercel domain. Settings save to config/site.json in GitHub and reach visitors in about 15 seconds without a redeploy.
- Every save is a commit, so History in the admin can roll anything back.
- API checks in the admin verify the environment, GitHub access, the settings endpoint, the live site, scripts and security headers, and can check any links.
- Add a Vercel Firewall rate limit rule for /api/admin/login.

Editing the site
- Edit src/app.html, then run: node tools/build.js
- The build repacks the site into public/ with new chunk names, SRI hashes and key, and regenerates public/admin.html and api/_schema.json.
- To add a new setting, add it to the CONFIG object in src/app.html and to tools/schema.json, then rebuild.
- Commit the result.
