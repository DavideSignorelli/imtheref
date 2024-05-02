const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

async function ottieniCategoriaDaNome(nome) {
    //console.log(nome);
    const categoria = await prisma.categoria.findMany({
        where: {
            nome
        }
    });
    if (categoria.length == 0) {
        return null;
    }
    //console.log(categoria);
    return categoria;
}

function ottieniCategoriaDaId(id) {
    const categoria = prisma.categoria.findUnique({
        where: {
            id
        }
    });
    if (categoria.length == 0) {
        return null;
    }
    return categoria;
}

function creaCategoria(nome) {
    const categoria = prisma.categoria.create({
        data: {
            nome
        }
    });
    return categoria;
}

module.exports = {
    ottieniCategoriaDaNome,
    ottieniCategoriaDaId,
    creaCategoria
};