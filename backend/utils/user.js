const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function findByEmail(emailInput) {
    const found = await prisma.user.findUnique({
        where: {
            email: emailInput,
        },
    });
    return found;
}

module.exports = {
    findByEmail,
};
