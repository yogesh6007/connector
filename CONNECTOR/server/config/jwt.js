import crypto from 'crypto';

let secret = process.env.JWT_SECRET;

if (!secret) {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL ERROR: JWT_SECRET environment variable is not defined in production!');
    process.exit(1);
  } else {
    console.warn('\n========================================================================');
    console.warn('WARNING: JWT_SECRET environment variable is missing.');
    console.warn('Generating a dynamic runtime key for local development:');
    console.warn('Note: All active user sessions will expire upon server restarts.');
    console.warn('========================================================================\n');
    secret = `dev-secret-${crypto.randomUUID()}`;
  }
}

export const JWT_SECRET = secret;
