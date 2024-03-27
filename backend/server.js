const express = require('express');
const app = express();
const port = 3000;
//const provaRouter = require('./routes/prova');
const userRouter = require('./routes/user');

app.use(express.json());

//app.use('/api/prova', provaRouter);
app.use('/api/user', userRouter)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});