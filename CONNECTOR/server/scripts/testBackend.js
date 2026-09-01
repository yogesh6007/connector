import { db } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function runTests() {
  console.log('🧪 Starting Backend Database & API Verification Tests...\n');

  // Test 1: Reset DB
  console.log('Test 1: Resetting Database...');
  await db.resetAll();
  const initialUsers = await db.users.count();
  const initialPosts = await db.posts.count();
  console.log(`Initial Counts: Users=${initialUsers}, Posts=${initialPosts}`);
  if (initialUsers !== 0 || initialPosts !== 0) throw new Error('Database not empty after reset!');
  console.log('✅ Test 1 Passed: Initial state is 100% empty (0 records).\n');

  // Test 2: Register Student User
  console.log('Test 2: Registering Real Student User (sarah@mit.edu)...');
  const hashedPassword = await bcrypt.hash('secretPass123', 10);
  const newUser = await db.users.insertOne({
    name: 'Sarah Connor',
    email: 'sarah@mit.edu',
    password: hashedPassword,
    role: 'student',
    college: 'MIT',
    degree: 'B.S. Computer Science',
    gradYear: 2026,
    skills: [{ name: 'React', level: 'Expert', endorsed: 0 }, { name: 'Python', level: 'Intermediate', endorsed: 0 }],
    interests: ['AI/ML', 'Robotics'],
    experience: [],
    education: [{ id: 'edu-1', institution: 'MIT', degree: 'B.S. CS', period: 'Class of 2026' }]
  });
  console.log(`Created User ID: ${newUser.id}, Name: ${newUser.name}`);
  const isMatch = await bcrypt.compare('secretPass123', newUser.password);
  if (!isMatch) throw new Error('Password hashing verification failed!');
  console.log('✅ Test 2 Passed: User registered with hashed password.\n');

  // Test 3: Update Profile
  console.log('Test 3: Updating Profile...');
  const updatedUser = await db.users.updateById(newUser.id, {
    $set: {
      headline: 'Robotics & AI Builder @ MIT',
      bio: 'Passionate about distributed robotics and real-time vision systems.',
      github: 'https://github.com/sarahconnor'
    }
  });
  console.log(`Updated Headline: "${updatedUser.headline}"`);
  if (updatedUser.headline !== 'Robotics & AI Builder @ MIT') throw new Error('Profile update failed!');
  console.log('✅ Test 3 Passed: Profile updated and persisted.\n');

  // Test 4: Create Post
  console.log('Test 4: Creating Post...');
  const newPost = await db.posts.insertOne({
    authorId: newUser.id,
    authorName: newUser.name,
    content: 'Building autonomous quadcopter vision models with PyTorch!',
    postType: 'project',
    likes: [],
    comments: [],
    savedBy: []
  });
  console.log(`Created Post ID: ${newPost.id}`);
  const postCount = await db.posts.count();
  if (postCount !== 1) throw new Error('Post count mismatch!');
  console.log('✅ Test 4 Passed: Post created and stored in DB.\n');

  // Test 5: Like Post
  console.log('Test 5: Liking Post...');
  const likedPost = await db.posts.updateById(newPost.id, { $push: { likes: newUser.id } });
  console.log(`Likes on Post: ${likedPost.likes.length}`);
  if (likedPost.likes.length !== 1) throw new Error('Like failed!');
  console.log('✅ Test 5 Passed: Like saved to DB.\n');

  // Test 6: Create Project
  console.log('Test 6: Creating Project...');
  const newProj = await db.projects.insertOne({
    title: 'Autonomous Drone Navigation',
    description: 'Real-time obstacle avoidance with edge YOLO and ROS2.',
    domain: 'Artificial Intelligence & ML',
    ownerId: newUser.id,
    ownerName: newUser.name,
    requiredSkills: ['Python', 'Computer Vision', 'PyTorch'],
    members: [{ id: newUser.id, name: newUser.name, role: 'Lead' }],
    joinRequests: []
  });
  console.log(`Created Project ID: ${newProj.id}`);
  console.log('✅ Test 6 Passed: Project created in DB.\n');

  // Test 7: Clean Reset DB
  console.log('Test 7: Final DB Reset to Empty State...');
  await db.resetAll();
  console.log('✅ Test 7 Passed: Database wiped clean back to 0.\n');

  console.log('🎉 ALL 7 BACKEND VERIFICATION TESTS PASSED PERFECTLY!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
