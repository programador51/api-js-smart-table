const {connection} = require('../config');

function fetchAssignatures(request,response,next){
    const student = request.params.matricula;
    const plan = request.params.plan;

    connection.query(`SELECT * FROM materias WHERE plan = ? ORDER BY nombreMateria`,plan,(error,results,rows)=>{
        if(error){
            console.log(`■ There was an error fetching the assignatures...`);
            return;
        };

        return response.json({
            status:200,
            assignatures:results,
            plan:plan        
        });
    });
}

function mFindStudentGET(request,response,next){
    const student = request.params.matricula;
    
    connection.query(`SELECT * FROM alumno WHERE user = ?`,student,(error,response,rows)=>{
        if(error){
            console.log(`■ There was an error finding the student...`);
        }
        request.params.plan = response[0].plan;
        next();
    });

}

async function mGetAssignatures(request,response){

    const page = parseInt(request.query.pagina,10);
    const startIndex = (page-1) * 20;

    let data = [{
        "assignatures":[],
        "pages":0,
        "actualPage":page
    }];

    console.log(`Ordering by ${request.query.columna} ${request.query.orden}`);
    console.log(`'Hora':${request.query.hora} ■ 'Plan':${request.query.plan}`);

    await connection.query(`SELECT * FROM 
    materias
        WHERE 
            hora = ? AND
            plan = ?
        ORDER 
            BY ${request.query.columna} ${request.query.orden} 
        LIMIT 20 OFFSET ?`,
    [
        request.query.hora,
        request.query.plan,
        startIndex
    ],

    (error,result,fields)=>{

        if(error){
            return response.status(500).json({
                message:error
            });
        }
        data[0].assignatures = result;
    });

    await connection.query(`SELECT COUNT(*) FROM materias WHERE 
        hora = ? AND
        plan = ?`,
        [
            request.query.hora,
            request.query.plan
        ],
        (error,result,fields)=>{
        if(error){
            return response.status(500).json({
                message:error
            });
        }

        const noPages = Math.ceil(result[0]['COUNT(*)'] / 20);

        data[0].pages = noPages;

        console.log('Paginas',noPages);
        
        return response.status(200).json({
            data:data[0]
        });
    })
}

module.exports = {
    fetchAssignatures,
    mFindStudentGET,
    mGetAssignatures
};