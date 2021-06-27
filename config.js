const mysql = require('mysql');

const URL_FETCH = `https://demo-js-smart-table.herokuapp.com`;

/* Toggle the comments when the code its released to
production */
// export const URL_FETCH = `URL_PRODUCTION`;

const connection = mysql.createConnection(process.env.URI_CONNECTION);

connection.connect(e=>{
    if(e){
        console.log(`${e}`);
        return
    }
    console.log(`■ Connection to DB Success`);
})

module.exports = {connection,URL_FETCH};