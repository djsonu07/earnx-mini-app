import fs from 'node:fs';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import admin from 'firebase-admin';

const rl = readline.createInterface({ input, output });
try {
  console.log('\nEARNX ADMIN SETUP\n');
  const email = (await rl.question('Firebase admin email: ')).trim();
  const keyPath = (await rl.question('Path to Firebase service-account JSON: ')).trim().replace(/^['"]|['"]$/g, '');
  if (!email || !keyPath) throw new Error('Email and service-account JSON path are required.');
  if (!fs.existsSync(keyPath)) throw new Error(`File not found: ${keyPath}`);
  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { ...(user.customClaims || {}), admin: true });
  console.log(`\nSUCCESS: ${email} is now an EARNX admin.`);
  console.log('Next: sign out of EARNX, sign in again, then open Admin Panel.\n');
} catch (e) {
  console.error(`\nERROR: ${e.message}\n`);
  process.exitCode = 1;
} finally {
  rl.close();
}
