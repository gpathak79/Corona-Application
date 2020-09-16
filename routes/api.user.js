'use strict'

module.exports = (router) => {
    //requiring-api-auth-file-for-authetication
    const auth = require('../helpers/api-auth');

    const UserVal=require("../helpers/joi_validator");

    const UsrCtrl=require('../controllers/controller.user');

    const UsrUpld = require('../helpers/common-service');

    //Login 
    router.post('/login', auth.isAuthenticated, UsrCtrl.Login);

    //Signup
    router.post('/register', auth.isAuthenticated, UsrCtrl.Registration);

    //Logout
    router.post('/logout',auth.isAuthenticated,auth.checkToken,auth.userExist,UsrCtrl.Logout);

    //World Cases
    router.get('/world-cases',auth.isAuthenticated,auth.checkToken,UsrCtrl.WorldCases)

    //CountryCases
    
      router.get('/country-cases',auth.isAuthenticated,auth.checkToken,UsrCtrl.CountryCases)

    return router;
}