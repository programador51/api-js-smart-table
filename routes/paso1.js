const express = require('express');
const router = express.Router();
const {fetchAssignatures,mFindStudentGET,mGetAssignatures} = require('../model/paso1');

router.get('/materias/:matricula',
    mFindStudentGET,
    fetchAssignatures
);

router.get('/materias',
    mGetAssignatures
)

module.exports = router;