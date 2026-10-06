import mongoose from 'mongoose';
import { User } from './models/User.js';
import { Item } from './models/Item.js';

const seedData = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/role_based_db');
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});

    // Create Pre-seeded Users
    const adminUser = new User({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });

    const editorUser = new User({
      username: 'editor',
      password: 'editor123',
      role: 'editor'
    });

    const viewerUser = new User({
      username: 'viewer',
      password: 'viewer123',
      role: 'viewer'
    });

    await adminUser.save();
    await editorUser.save();
    await viewerUser.save();

    console.log('Seeded Users: admin/admin123, editor/editor123, viewer/viewer123');

    // Create Initial Sample Items
    const sampleItems = [
      {
        title: 'Project Roadmap 2026',
        description: 'System architectural blueprint for upcoming Q4 releases.',
        createdBy: adminUser._id
      },
      {
        title: 'Editor Content Draft',
        description: 'Drafted articles and blog documentation ready for publication.',
        createdBy: editorUser._id
      }
    ];

    await Item.insertMany(sampleItems);
    console.log('Seeded Initial Items successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
