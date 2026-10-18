const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const adminInit = `
import * as admin from 'firebase-admin';
const serviceAccount = require('./firebase-applet-config.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount) // fallback if needed, better to use default
  });
}
const db = admin.firestore();
// Use the databaseId if provided in config
if (serviceAccount.firestoreDatabaseId) {
    // Note: admin SDK handles named databases differently, but we can default to project default for now
    // Actually, in newer Firebase Admin, you can pass databaseId.
}
`;

// Replace Mongoose
code = code.replace(/import mongoose from 'mongoose';/g, "import * as admin from 'firebase-admin';");
code = code.replace(/import { MongoMemoryServer } from 'mongodb-memory-server';/g, "");

fs.writeFileSync('server.ts', code);
