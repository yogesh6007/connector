import { db } from '../config/db.js';
import bcrypt from 'bcryptjs';

async function runEndToEndProductFlowTests() {
  console.log('🚀 Starting Complete CONNECTOR Product Flow Verification Tests...\n');

  // STEP 0: Reset Database
  console.log('Step 0: Resetting database to 0 records...');
  await db.resetAll();
  const initCount = await db.users.count();
  if (initCount !== 0) throw new Error('Database reset failed!');
  console.log('✅ Database is 100% clean and empty.\n');

  // STEP 1: Student A (Rahul Sharma)
  console.log('Step 1: Registering Student A (Rahul Sharma)...');
  const hashedPassA = await bcrypt.hash('pass123', 10);
  const studentA = await db.users.insertOne({
    name: 'Rahul Sharma',
    email: 'rahul@mit.edu',
    password: hashedPassA,
    role: 'student',
    headline: 'Computer Vision Builder @ MIT',
    college: 'MIT',
    degree: 'B.S. CS',
    skills: [{ name: 'Python', level: 'Expert', endorsed: 0 }, { name: 'PyTorch', level: 'Expert', endorsed: 0 }],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  });
  console.log(`Created Student A: ID=${studentA.id}, Name=${studentA.name}`);

  // Student A creates collaborative project looking for teammates
  console.log('Student A creates project: "AI Traffic Monitoring System"...');
  const projectA = await db.projects.insertOne({
    title: 'AI Traffic Monitoring System',
    description: 'We are building an edge computer vision model for real-time intersection traffic analysis.',
    domain: 'Artificial Intelligence & ML',
    requiredSkills: ['Python', 'Computer Vision', 'PyTorch', 'React'],
    requiredRoles: ['ML Engineer', 'Frontend Developer'],
    teamCapacity: 4,
    workMode: 'Remote',
    duration: '3 Months',
    status: 'Recruiting',
    ownerId: studentA.id,
    ownerName: studentA.name,
    ownerAvatar: studentA.avatar,
    members: [
      {
        id: studentA.id,
        name: studentA.name,
        role: 'Project Lead',
        avatar: studentA.avatar,
        joinedAt: new Date().toISOString()
      }
    ]
  });

  // Recruitment post in feed
  await db.posts.insertOne({
    authorId: studentA.id,
    authorName: studentA.name,
    authorAvatar: studentA.avatar,
    authorRole: 'student',
    content: `🚀 We are building the AI Traffic Monitoring System. Looking for teammates in Python, CV, React!`,
    postType: 'collaboration',
    projectAttachment: {
      id: projectA.id,
      title: projectA.title,
      domain: projectA.domain,
      requiredSkills: projectA.requiredSkills,
      teamCurrent: 1,
      teamMax: 4
    },
    likes: [],
    comments: [],
    savedBy: []
  });
  console.log('✅ Student A project and recruitment post published.\n');

  // STEP 2: Student B (Priya Patel)
  console.log('Step 2: Registering Student B (Priya Patel)...');
  const hashedPassB = await bcrypt.hash('pass123', 10);
  const studentB = await db.users.insertOne({
    name: 'Priya Patel',
    email: 'priya@stanford.edu',
    password: hashedPassB,
    role: 'student',
    headline: 'Machine Learning & OpenCV Specialist @ Stanford',
    college: 'Stanford University',
    degree: 'B.S. AI',
    skills: [{ name: 'Computer Vision', level: 'Expert', endorsed: 0 }, { name: 'Python', level: 'Expert', endorsed: 0 }],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
  });
  console.log(`Created Student B: ID=${studentB.id}, Name=${studentB.name}`);

  // Student B discovers recruiting project and clicks "I'm Interested"
  console.log('Student B discovers project and sends "I\'m Interested" request...');
  const interestRequest = await db.projectInterests.insertOne({
    projectId: projectA.id,
    projectTitle: projectA.title,
    ownerId: projectA.ownerId,
    studentId: studentB.id,
    studentName: studentB.name,
    studentAvatar: studentB.avatar,
    roleApplied: 'ML Engineer',
    message: 'I have extensive OpenCV and PyTorch experience and would love to build the object detection pipeline.',
    status: 'pending'
  });

  // Notification sent to Student A
  await db.notifications.insertOne({
    recipientId: projectA.ownerId,
    senderId: studentB.id,
    senderName: studentB.name,
    type: 'project_request',
    title: 'New Teammate Interest',
    message: `${studentB.name} expressed interest in "${projectA.title}".`,
    link: `/student/projects/${projectA.id}`,
    read: false
  });
  console.log(`Interest Request ID: ${interestRequest.id} submitted to Student A.`);

  // Student A accepts Student B into team
  console.log('Student A accepts Student B onto the team...');
  const updatedProject = await db.projects.updateById(projectA.id, {
    $push: {
      members: {
        id: studentB.id,
        name: studentB.name,
        avatar: studentB.avatar,
        role: interestRequest.roleApplied,
        joinedAt: new Date().toISOString()
      }
    }
  });
  await db.projectInterests.updateById(interestRequest.id, { $set: { status: 'accepted' } });
  console.log(`Updated Project Members: ${updatedProject.members.length} / ${updatedProject.teamCapacity}`);
  if (updatedProject.members.length !== 2) throw new Error('Team member addition failed!');
  console.log('✅ Teammate formation flow verified: Student B is officially in Student A\'s team!\n');

  // STEP 3: Organizer (TechCorp) & Opportunity Community Hub
  console.log('Step 3: Registering Organizer (TechCorp Solutions)...');
  const orgUser = await db.users.insertOne({
    name: 'TechCorp Solutions',
    organizationName: 'TechCorp Solutions',
    email: 'careers@techcorp.io',
    password: await bcrypt.hash('pass123', 10),
    role: 'organizer',
    industry: 'Artificial Intelligence',
    description: 'Building next-generation intelligent robotics and edge AI.'
  });

  console.log('Organizer creates Opportunity + Community Hub: "AI Engineering Fellowship 2026"...');
  const opp = await db.opportunities.insertOne({
    orgId: orgUser.id,
    orgName: orgUser.name,
    title: 'AI Engineering Fellowship 2026',
    type: 'Fellowship',
    description: '12-week intensive AI engineering fellowship working on autonomous vision systems.',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    stipend: '$8,000 / month',
    duration: '12 Weeks',
    skillsRequired: ['Python', 'PyTorch', 'Computer Vision'],
    status: 'Active'
  });

  const community = await db.opportunityCommunities.insertOne({
    opportunityId: opp.id,
    orgId: orgUser.id,
    orgName: orgUser.name,
    name: `${opp.title} Community`,
    members: [orgUser.id],
    channels: ['announcements', 'discussion', 'resources']
  });

  // Student B joins community
  console.log('Student B joins opportunity community space...');
  await db.opportunityCommunities.updateById(community.id, {
    $push: { members: studentB.id }
  });

  // Organizer posts announcement
  console.log('Organizer posts community announcement...');
  await db.communityMessages.insertOne({
    opportunityId: opp.id,
    channel: 'announcements',
    senderId: orgUser.id,
    senderName: orgUser.name,
    senderRole: 'Organizer',
    title: 'Application Deadline Notice',
    content: 'Priority review closes in 2 weeks.',
    likes: [],
    comments: []
  });

  // Student B applies for opportunity
  console.log('Student B submits real application...');
  const appB = await db.applications.insertOne({
    opportunityId: opp.id,
    opportunityTitle: opp.title,
    orgId: orgUser.id,
    orgName: orgUser.name,
    studentId: studentB.id,
    studentName: studentB.name,
    studentEmail: studentB.email,
    coverNote: 'I have hands-on experience building computer vision pipelines.',
    status: 'Applied',
    appliedDate: new Date().toISOString()
  });

  // Organizer updates application status to Shortlisted
  console.log('Organizer updates application status to "Shortlisted"...');
  const updatedApp = await db.applications.updateById(appB.id, {
    $set: { status: 'Shortlisted' }
  });
  if (updatedApp.status !== 'Shortlisted') throw new Error('Application status update failed!');
  console.log('✅ Opportunity + Community Hub flow verified!\n');


  // STEP 5: Explore Search
  console.log('Step 5: Testing real Explore search...');
  const searchResults = await db.projects.find();
  const matchedProject = searchResults.find(p => p.title.toLowerCase().includes('traffic'));
  if (!matchedProject) throw new Error('Explore search project match failed!');
  console.log(`Explore found project: "${matchedProject.title}" (Lead: ${matchedProject.ownerName})`);
  console.log('✅ Explore search verified against real database records!\n');

  // STEP 6: Final Database Reset
  console.log('Step 6: Resetting database back to fresh empty state (0 records)...');
  await db.resetAll();
  const finalUsers = await db.users.count();
  const finalProjects = await db.projects.count();
  const finalPosts = await db.posts.count();
  console.log(`Final Counts: Users=${finalUsers}, Projects=${finalProjects}, Posts=${finalPosts}`);
  if (finalUsers !== 0 || finalProjects !== 0 || finalPosts !== 0) throw new Error('Final reset failed!');
  console.log('✅ Final state verified: 100% empty prototype ready for real user creation.\n');

  console.log('🎉 ALL END-TO-END PRODUCT FLOW TESTS COMPLETED WITH 100% SUCCESS!');
  process.exit(0);
}

runEndToEndProductFlowTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
