const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const PASTA = path.join(__dirname, 'dados');

if (!fs.existsSync(PASTA)) fs.mkdirSync(PASTA);

app.get('/arquivos', (req, res) => {
    try {
        const itens = fs.readdirSync(PASTA).map(nome => {
            const info = fs.statSync(path.join(PASTA, nome));
            return { nome, tamanho: info.size };
        });
        res.json({ arquivos: itens });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

app.post('/mensagem', (req, res) => {
    try {
        const { texto, autor } = req.body;
        const conteudo = autor + ': ' + texto + '\n';
        fs.appendFileSync(path.join(PASTA, 'mensagens.txt'), conteudo);
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

app.get('/mensagem', (req, res) => {
    try {
        const arq = path.join(PASTA, 'mensagens.txt');
        if (!fs.existsSync(arq)) return res.json({ texto: '' });
        const texto = fs.readFileSync(arq, 'utf8');
        res.json({ texto });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

app.listen(PORT, () => {
    console.log('Servidor rodando em http://localhost:' + PORT);
    console.log('Pressione Ctrl+C para encerrar o servidor');
});