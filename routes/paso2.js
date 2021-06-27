const express = require('express');
const router = express.Router();
const {
    mFetchSchedule,
    mUpdateAssignatures
} = require('../model/paso2');

router.get('/materias/:schedule/:assignature/:plan',
    mFetchSchedule
);

router.post('/inscribir',
    mUpdateAssignatures
)

module.exports = router;