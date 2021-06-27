const express = require('express');
const router = express.Router();
const {
    mAddStudent,
    mFindUserById,
    mValidateCredentials
} = require('../model/users');

const {
    cHashPassword,
    cDesencryptPassword
} = require('../middlewares/hash');

///////////////////////////////////////////////////////////////////////////////

router.post('/registrar',
    cHashPassword,
    mAddStudent
);

router.post('/login',
    mFindUserById,
    cDesencryptPassword
);


module.exports = router;