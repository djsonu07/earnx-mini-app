import admin from 'firebase-admin';
const email=process.argv[2];
if(!email){console.error('Usage: node scripts/set-admin-claim.mjs ADMIN_EMAIL');process.exit(1)}
if(!process.env.GOOGLE_APPLICATION_CREDENTIALS){console.error('Set GOOGLE_APPLICATION_CREDENTIALS to your Firebase service-account JSON path.');process.exit(1)}
admin.initializeApp({credential:admin.credential.applicationDefault()});
const user=await admin.auth().getUserByEmail(email);
await admin.auth().setCustomUserClaims(user.uid,{...(user.customClaims||{}),admin:true});
console.log(`Admin claim added to ${email}. Sign out/in to refresh the ID token.`);
