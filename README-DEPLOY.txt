EARNX deployment fix

IMPORTANT: This version does NOT use a catch-all Vercel rewrite. The previous rewrite could rewrite JS/CSS asset requests to index.html and make the page appear blank.

Deploy the project as a Vite app on Vercel:
Build command: npm run build
Output directory: dist
Install command: npm install

Do not add a vercel.json catch-all rewrite.
