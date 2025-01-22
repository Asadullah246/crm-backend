// const express = require('express');
// const { checkToken } = require('../../middlewares/checkToken');
// const { signIn, signUp, getUserByToken, changePassword } = require('./auth.controller');


import express from 'express';
// import { checkToken } from '../../middleware/checkToken.js';
import { signIn, signUp,
     getUserByToken,
     changePassword
    } from './auth.controller.js';
// import { upload } from '../../config/multerConfig.js';


const authRouter = express.Router();
// const { upload } = require('../../config/multerConfig');

// writes the user router

authRouter.post('/signIn', signIn);
authRouter.post('/signUp',
    //  upload.single("fileUploads"),
     signUp);
authRouter.get('/getUserByToken',
    //  checkToken,
     getUserByToken);
authRouter.put('/changePassword', 
    //  checkToken,
     changePassword);

// module.exports = {
//     authRouter
// };
export default authRouter;
