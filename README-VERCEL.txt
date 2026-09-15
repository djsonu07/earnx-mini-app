EARNX - VERCEL DEPLOYMENT

IMPORTANT: This ZIP is FLAT. The files package.json, index.html, src/, and vite.config.js are directly at the project root.

GitHub repository root must look like:
package.json
index.html
vite.config.js
src/main.jsx
src/styles.css

Vercel:
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Root Directory: ./

Do NOT put these files inside another earnx_fixed/ folder.
Do NOT add a catch-all vercel.json rewrite.

After pushing to GitHub, Redeploy the latest commit on Vercel.
