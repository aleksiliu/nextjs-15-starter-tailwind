import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create users
    const alice = await prisma.user.upsert({
        where: { email: 'alice@example.com' },
        update: {},
        create: {
            email: 'alice@example.com',
            name: 'Alice Johnson',
            password: 'hashed_password_here',
            bio: 'Full-stack developer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
        }
    });

    const bob = await prisma.user.upsert({
        where: { email: 'bob@example.com' },
        update: {},
        create: {
            email: 'bob@example.com',
            name: 'Bob Smith',
            password: 'hashed_password_here',
            bio: 'Frontend enthusiast',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
        }
    });

    // Create posts
    const post1 = await prisma.post.create({
        data: {
            title: 'Getting Started with Next.js and Prisma',
            content: 'This is a comprehensive guide to building applications with Next.js and Prisma...',
            published: true,
            author: { connect: { id: alice.id } },
            views: 156
        }
    });

    const post2 = await prisma.post.create({
        data: {
            title: 'TypeScript Best Practices',
            content: 'Learn about TypeScript best practices and patterns...',
            published: true,
            author: { connect: { id: bob.id } },
            views: 243
        }
    });

    // Create comments
    await prisma.comment.create({
        data: {
            content: 'Great article! Very helpful.',
            post: { connect: { id: post1.id } },
            author: { connect: { id: bob.id } }
        }
    });

    const parentComment = await prisma.comment.create({
        data: {
            content: 'Thanks for sharing!',
            post: { connect: { id: post2.id } },
            author: { connect: { id: alice.id } }
        }
    });

    await prisma.comment.create({
        data: {
            content: "You're welcome!",
            post: { connect: { id: post2.id } },
            author: { connect: { id: bob.id } },
            parent: { connect: { id: parentComment.id } }
        }
    });

    // Create likes
    await prisma.like.create({
        data: {
            post: { connect: { id: post1.id } },
            user: { connect: { id: bob.id } }
        }
    });

    await prisma.like.create({
        data: {
            post: { connect: { id: post2.id } },
            user: { connect: { id: alice.id } }
        }
    });

    // Create follows
    await prisma.follows.create({
        data: {
            follower: { connect: { id: bob.id } },
            following: { connect: { id: alice.id } }
        }
    });

    console.log('Database has been seeded! 🌱');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
