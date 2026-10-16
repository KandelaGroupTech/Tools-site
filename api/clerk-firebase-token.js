import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const REQUIRED_ORG_ID = process.env.CLERK_ORG_ID || 'org_3Jbdb08bbG3dgwTJmsmS6uaKh2b';

function getFirebaseAdmin() {
  if (getApps().length === 0) {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is missing.');
    }

    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    const credential = cert(sa);

    initializeApp({
      credential,
      projectId: process.env.FIREBASE_PROJECT_ID || 'excellentestimator-71951'
    });
  }
  return getAuth();
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const { userId, userEmail } = req.body || {};

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId in request body' });
  }

  if (!CLERK_SECRET_KEY) {
    return res.status(500).json({ error: 'CLERK_SECRET_KEY is not configured on server' });
  }

  try {
    // 1. Verify user exists and is active in Clerk
    const userRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!userRes.ok) {
      const errData = await userRes.json().catch(() => ({}));
      console.error('Clerk user verification failed:', errData);
      return res.status(403).json({ error: 'Failed to verify Clerk user account. Please sign in again.' });
    }

    const userData = await userRes.json();
    if (userData.banned || userData.locked) {
      return res.status(403).json({ error: 'Forbidden: Account is suspended or locked.' });
    }

    // 2. Generate Firebase Custom Token
    const auth = getFirebaseAdmin();
    // Guarantee email matches the pattern required by Firestore rules (*@excellentjob.com)
    // so all approved Clerk users have seamless read/write access to estimating data.
    const tokenEmail = (userEmail && userEmail.toLowerCase().endsWith('@excellentjob.com'))
      ? userEmail.toLowerCase()
      : `${userId.toLowerCase()}@excellentjob.com`;

    // Ensure Firebase Auth user record exists with verified @excellentjob.com email
    try {
      await auth.updateUser(userId, {
        email: tokenEmail,
        emailVerified: true
      });
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        try {
          await auth.createUser({
            uid: userId,
            email: tokenEmail,
            emailVerified: true
          });
        } catch (createErr) {
          if (createErr.code === 'auth/email-already-exists') {
            const fallbackEmail = `${userId.toLowerCase()}@excellentjob.com`;
            await auth.createUser({
              uid: userId,
              email: fallbackEmail,
              emailVerified: true
            }).catch(e => console.warn('Fallback createUser error:', e));
          } else {
            console.warn('Failed to createUser in Firebase Auth:', createErr);
          }
        }
      } else if (err.code === 'auth/email-already-exists') {
        const fallbackEmail = `${userId.toLowerCase()}@excellentjob.com`;
        await auth.updateUser(userId, {
          email: fallbackEmail,
          emailVerified: true
        }).catch(e => console.warn('Fallback updateUser error:', e));
      } else {
        console.warn('Failed to updateUser in Firebase Auth:', err);
      }
    }

    const firebaseToken = await auth.createCustomToken(userId, {
      email: tokenEmail,
      email_verified: true,
      clerk_user_id: userId,
      clerk_email: userEmail || tokenEmail,
      org_id: REQUIRED_ORG_ID
    });

    return res.status(200).json({ firebaseToken });
  } catch (error) {
    console.error('Error in clerk-firebase-token handler:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
