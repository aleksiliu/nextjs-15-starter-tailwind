import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create a test user
    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            name: 'Test User',
            posts: {
                create: [
                    {
                        title: 'First Post',
                        content: 'This is my first post',
                        published: true
                    },
                    {
                        title: 'Draft Post',
                        content: 'This is a draft',
                        published: false
                    }
                ]
            }
        }
    });

    console.log({ user });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
