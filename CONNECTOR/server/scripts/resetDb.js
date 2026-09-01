import { db } from '../config/db.js';

async function main() {
  console.log('🔄 Resetting CONNECTOR Database...');
  await db.resetAll();
  console.log('✅ Success: Database has 0 records across all collections.');
  console.log({
    users: await db.users.count(),
    posts: await db.posts.count(),
    projects: await db.projects.count(),
    opportunities: await db.opportunities.count(),
    applications: await db.applications.count(),
    conversations: await db.conversations.count(),
    messages: await db.messages.count(),
    notifications: await db.notifications.count()
  });
  process.exit(0);
}

main().catch(err => {
  console.error('Error resetting database:', err);
  process.exit(1);
});
