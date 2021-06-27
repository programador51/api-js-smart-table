const {connection} = require('../config');

function mAddStudent(request,response,next){

    const {password,plan} = request.body;
    console.log(`Password ${password}, plan ${plan}`);

    console.log(`■ Adding user to siase...`);
    connection.query(`INSERT INTO alumno (password,plan) VALUES(?,?)`,
    [password,plan],
    (e,results,rows)=>{
        if(e){
            console.log(`There was an error adding the student: ${e}`);
        }
    });
    response.json({
        status:200,
        message:`Estudiante agregado al SIASE`
    });
}

function mFindUserById(request,response,next){
    const {matricula} = request.body;
   
    console.log(`■ Finding student with matricula ${matricula}`);
    connection.query(`SELECT * FROM alumno WHERE user = ?`,matricula,
    (e,results,row)=>{
        if(e){
            console.log(`■ There was an error finding ${matricula}`);
        }

        // console.log(results[0]);

        if(results[0]==undefined){
            console.log(`■ Student wasnt founded`);
            return response.json({
                status:404,
                message:`Alumno no encontrado`
            });
        };

        request.body.hashPass = results[0].password;
        request.body.user = results[0];

        console.log(`■ Student founded...`);
        next();
    })
}

function mValidateCredentials(request,response,next){
    console.log(`■ Validating credentials...`);
}

module.exports = {
    mAddStudent,
    mFindUserById,
    mValidateCredentials
}