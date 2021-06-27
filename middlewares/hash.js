const bcrypt = require('bcrypt');
const { response, request } = require('express');

const saltRounds = parseInt(process.env.SALT_ROUNDS,10);


function cHashPassword(request,response,next){
    const {password} = request.body;
    console.log(`■ Hashing text...`);
    bcrypt.hash(password,saltRounds,(e,hash)=>{
        if(e){
             console.log(`There was an error hashing: ${e}`);
             return response.json({
                 status:500,
                 message:"There was an error hashing the password"
             })
        }
        request.body.password = hash;
        next();
    })
}

function cDesencryptPassword(request,response,next){

    const {password,hashPass} = request.body;

    bcrypt.compare(password,hashPass,(error,result)=>{
        if(error){
            console.log(`There was an error to desencrypt the passowrd: ${error}`);
            return response.json({
                status:500,
                message:`Hubo un error en el servidor`
            })
        }
        if(result===true){
            return response.json({
                status:200,
                message:`Credenciales correctas`,
                user:request.body.user
            });
        }else{
            return response.json({
                status:403,
                message:`Credenciales incorrectas`
            });
        }
    });

}

module.exports = {
    cHashPassword,
    cDesencryptPassword
};