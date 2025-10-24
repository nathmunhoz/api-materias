const { Pool } = require('pg');
const readlineSync = require('readline-sync');

const dbConfig = {
    user: 'aluno',
    host: 'localhost',
    database: 'db_profedu',
    password: '102030',
    port: 5432,
};

const pool = new Pool(dbConfig);

async function inserirDados() {
    console.log("--- Cadastro de Aluno ---");

    const nome = readlineSync.question('Digite o nome: ');
    const serie = readlineSync.question('Digite a série: ');
    const idade = readlineSync.questionInt('Digite a idade: ');

    let matematica: number[] = [];
    for (let i: number = 1; i <= 8; i++) {
        let nota = readlineSync.questionFloat(`Digite a nota ${i} de matematica: `);
        matematica.push(nota);
    }

    let geografia: number[] = [];
    for (let i: number = 1; i <= 8; i++) {
        let nota = readlineSync.questionFloat(`Digite a nota ${i} de geografia: `);
        geografia.push(nota);
    }

    let historia: number[] = [];
    for (let i: number = 1; i <= 8; i++) {
        let nota = readlineSync.questionFloat(`Digite a nota ${i} de história: `);
        historia.push(nota);
    }

    const somaM = matematica.reduce((total, n) => total + n, 0);
    const mediaM = somaM / matematica.length;

    const somaG = geografia.reduce((total, n) => total + n, 0);
    const mediaG = somaG / geografia.length;

    const somaH = historia.reduce((total, n) => total + n, 0);
    const mediaH = somaH / historia.length;


    if (!nome || !idade || !serie || !historia || !geografia || !matematica) {
        console.error("Erro: Todos os campos são obrigatórios! Operação cancelada.");
        await pool.end();
        return;
    }

    try {
        console.log("\nConectando ao banco de dados...");
        const client = await pool.connect();
        console.log("Conexão bem-sucedida! Inserindo dados...");

        const insertQuery = `
            INSERT INTO public.alunos (nome, idade, serie, matematica, geografia, historia)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [nome, idade, serie, mediaM, mediaG, mediaH];

        await client.query(insertQuery, values);
        client.release();

        console.log("-----------------------------------------");
        console.log(`Dados inseridos com sucesso!`);
        console.log(`Nome: ${nome}, Idade: ${idade}, Série: ${serie}, Matematica: ${mediaM}, Geografia: ${mediaG}, História: ${mediaH}`);
        console.log("-----------------------------------------");

    } catch (error) {
        console.error("Ocorreu um erro ao interagir com o banco de dados:", error);
    } finally {
        await pool.end();
        console.log("Conexão com o banco de dados encerrada.");
    }
}

inserirDados();
