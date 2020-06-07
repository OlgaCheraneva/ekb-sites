const express = require('express');
const router = require('express').Router();
const path = require('path');
const fetch = require('node-fetch');
global.fetch = fetch;

const app = express();

router.post('/', async (req, res) => {
    try {
        fetch(
            `https://api.telegram.org/bot1176307202:AAFMfmvNmFVi2wy2A-2NsIjmgxgtPypsGT4/sendMessage?chat_id=-327278816&parse_mode=html&text=${encodeURI(
                JSON.stringify(req.body, null, '\t')
            )}`
        );
        return res.status(200).send();
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server Error');
    }
});
app.use(express.json({extended: false}));
app.use('/', router);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/dist'));
    app.get('*', (_req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
