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
    // 1. Verify organization membership with Clerk REST API
    const orgRes = await fetch(`https://api.clerk.com/v1/users/${userId}/organization_memberships`, {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!orgRes.ok) {
      const errData = await orgRes.json().catch(() => ({}));
      console.error('Clerk Org check failed:', errData);
      return res.status(403).json({ error: 'Failed to verify Clerk user organization memberships' });
    }

    const orgData = await orgRes.json();
    const memberships = orgData.data || [];
    const isMember = memberships.some(m => m.organization?.id === REQUIRED_ORG_ID);

    if (!isMember) {
      return res.status(403).json({ 
        error: 'Forbidden: You must be a member of Journey Office Builders LLC to access this tool.' 
      });
    }

    // 2. Generate Firebase Custom Token
    const auth = getFirebaseAdmin();
    const emailToUse = userEmail || 'user@excellentjob.com';
    const firebaseToken = await auth.createCustomToken(userId, {
      email: emailToUse,
      email_verified: true,
      org_id: REQUIRED_ORG_ID
    });

    return res.status(200).json({ firebaseToken });
  } catch (error) {
    console.error('Error in clerk-firebase-token handler:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
