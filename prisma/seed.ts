import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  await createRoles();

  await createUser();

  console.log('Seed completed!');
}

async function createRoles() {
    const roles = [
        {
          id: 'clhz2eex8000008l6g0wd3p1q',
          name: 'Admin',
          description: 'Full system access with all privileges'
        },
        {
          id: 'clhz2fmk9000208md5hj36f2r',
          name: 'User',
          description: 'Regular user with standard access'
        },
        {
          id: 'clhz2fmk9000308mda2xc1p4q',
          name: 'Visitor',
          description: 'Limited access for viewing public content'
        }
    ];

    const anyRolesExist = await prisma.role.findFirst();

    if (anyRolesExist) {
        console.log('Roles already exist, skipping...');
        return;
    }

    for (const role of roles) {
        await prisma.role.create({
            data: role
        });
        console.log(`Created role: ${role.name}`);
    }
}


async function createUser() {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const user = {
        id: 'clhz2eex8000008l6g0wd3p1q',
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword
    };

    const anyUserExist = await prisma.user.findFirst();

    if (anyUserExist) {
        console.log('User already exists, skipping...');
        return;
    }

    await prisma.user.create({
        data: user
    });

    console.log(`Created user: ${user.name}`);

    await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: 'clhz2eex8000008l6g0wd3p1q'
        }
    });

    console.log('Assigned Admin role to user');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 