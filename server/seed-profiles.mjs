import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

// Get the first user (owner) ID
const [users] = await connection.query('SELECT id FROM users LIMIT 1');
if (!users || users.length === 0) {
  console.error('No users found. Please create a user first.');
  process.exit(1);
}

const userId = users[0].id;

// Delete existing test profiles
await connection.query("DELETE FROM profiles WHERE name LIKE 'Test Profile%' OR name LIKE '%Example%'");

// Sample profiles for different platforms
const sampleProfiles = [
  {
    userId,
    name: 'Instagram Marketing',
    platform: 'instagram',
    proxyHost: 'proxy.example.com',
    proxyPort: 8080,
    credentials: JSON.stringify({ username: 'marketing_pro', password: 'encrypted' }),
    status: 'active',
    lastUsedAt: new Date()
  },
  {
    userId,
    name: 'Facebook Business Page',
    platform: 'facebook',
    proxyHost: 'proxy.example.com',
    proxyPort: 8081,
    credentials: JSON.stringify({ username: 'business_page', password: 'encrypted' }),
    status: 'active',
    lastUsedAt: new Date()
  },
  {
    userId,
    name: 'TikTok Creator',
    platform: 'tiktok',
    proxyHost: 'proxy.example.com',
    proxyPort: 8082,
    credentials: JSON.stringify({ username: 'creator_account', password: 'encrypted' }),
    status: 'active',
    lastUsedAt: new Date()
  },
  {
    userId,
    name: 'YouTube Channel',
    platform: 'youtube',
    proxyHost: 'proxy.example.com',
    proxyPort: 8083,
    credentials: JSON.stringify({ username: 'youtube_channel', password: 'encrypted' }),
    status: 'active',
    lastUsedAt: new Date()
  },
  {
    userId,
    name: 'Twitter/X Account',
    platform: 'twitter',
    proxyHost: 'proxy.example.com',
    proxyPort: 8085,
    credentials: JSON.stringify({ username: 'twitter_handle', password: 'encrypted' }),
    status: 'active',
    lastUsedAt: new Date()
  }
];

// Insert sample profiles
for (const profile of sampleProfiles) {
  await connection.query(
    `INSERT INTO profiles (userId, name, platform, proxyHost, proxyPort, credentials, status, lastUsedAt, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      profile.userId,
      profile.name,
      profile.platform,
      profile.proxyHost,
      profile.proxyPort,
      profile.credentials,
      profile.status,
      profile.lastUsedAt
    ]
  );
}

console.log(`✅ Successfully seeded ${sampleProfiles.length} diverse sample profiles`);

await connection.end();
