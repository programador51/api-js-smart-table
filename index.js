require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const port = process.env.PORT || 4000;

app.use(express.json({extended:true}));

app.use('/api/usuarios/',require('./routes/users'));
app.use('/api/paso2/',require('./routes/paso2'));
app.use('/api/paso1/',require('./routes/paso1'));

app.listen(port,()=>{
    console.log(`Server connected on port ${port}`);
})