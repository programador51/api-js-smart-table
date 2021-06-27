const {connection} = require('../config');

function mFetchSchedule(request,response,next){
    console.log(`■ Fetching assignatures for schedule...`);
    const schedule = request.params.schedule;
    const assignature = request.params.assignature;
    const plan = request.params.plan;

    let beginSchedule,endSchedule;

    if(schedule>=0&&schedule<=5){
        beginSchedule = 0;
        endSchedule = 5;
        console.log(`■ Requesting matutine schedule`);
    }

    if(schedule>=6&&schedule<=11){
        beginSchedule = 6;
        endSchedule = 11;
        console.log(`■ Requesting vespertin schedule`);
    }

    if(schedule>=12&&schedule<=17){
        beginSchedule = 12;
        endSchedule = 17;
        console.log(`■ Requesting night schedule`);
    }

    const data = [{
        assignatureRequested:[],
        otherAssignatures:[]
    }]

    connection.query(`
    SELECT * FROM materias
        WHERE 
            plan = '${plan}' AND 
            nombreMateria = '${assignature}' AND
            hora = '${schedule}' 
        `,
    (error,results,rows)=>{
        if(error){
            console.log(`■ There was an error fetching the schedule - ${error}`);
            return;
        }
        data[0].assignatureRequested = results;
    });

    connection.query(`
    SELECT * FROM materias
        WHERE
            plan = '${plan}' AND 
            nombreMateria != '${assignature}' AND
            hora > '${beginSchedule}' AND
            hora < '${endSchedule}'
    `,(error,results,rows)=>{
        if(error){
            console.log(`■ There was an error fetching the schedule - ${error}`);
        }

        data[0].otherAssignatures = results;

        return response.json({
            status:200,
            data
        });
    })
}

function mUpdateAssignatures(request,response,next){   
    const {inscription,student} = request.body;

    console.log(`■ Updating capacity of the assignatures...`);

    inscription.map(assignature=>{
        if(assignature.actualCapacity<20){
            connection.query(`UPDATE materias 
            SET actualCapacity = actualCapacity + 1
            WHERE idAssignature = ${assignature.idAssignature}`,(error,result,rows)=>{
                if(error){
                    return response.json({
                        status:500,
                        msg:'Error'
                    });
                }
            });
        }
    });

    console.log(`■ Saving schedule of student...`);

    inscription.map(assignature=>{
        if(assignature.actualCapacity<20){
            connection.query(`INSERT INTO inscription (id,student,asignature)
            VALUES(${null},${student.user},${assignature.idAssignature})`,(error,result,columns)=>{
                if(error){
                    console.log(`■ There was an error saving the schedule`);
                    return response.json({
                        status:500,
                        msg:'Error'
                    });
                }
            });
        }
    });

    return response.json({
        status:200,
        msg:`Horario guardado`
    });
}

module.exports = {
    mFetchSchedule,
    mUpdateAssignatures
};