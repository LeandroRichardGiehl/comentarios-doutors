const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors'); // Importa o pacote cors

const app = express();
const PORT = 3000;

app.use(cors()); // Configura o middleware cors
app.use(bodyParser.json());
app.use(express.static('public'));

const filePath = path.join(__dirname, 'dados.json');

app.get('/comments', async (req, res) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const comments = JSON.parse(data);
        res.json(comments);
    } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Erro ao ler o arquivo');
    }
});

app.post('/comments', async (req, res) => {
    const { name, comment, rating } = req.body;
    
    // Validação básica
    if (!name || !comment || !rating) {
        return res.status(400).send('Dados de comentário incompletos');
    }
    
    const newComment = { name, comment, rating };

    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const comments = JSON.parse(data);
        comments.push(newComment);
        await fs.writeFile(filePath, JSON.stringify(comments, null, 2));
        res.json(comments);
    } catch (err) {
        console.error('Error writing file:', err);
        res.status(500).send('Erro ao escrever no arquivo');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});