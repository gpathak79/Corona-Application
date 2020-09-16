
//Registration
exports.Registration = (req, res) => {
    try {
        //Check mobile no. in database
        const mobileCheck = new Promise( (resolve, reject) => {
            User.find({'mobile': req.body.mobile}, (err, results) => {
                if(err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage })
                } else {

                    results.length ? reject({ 'message': 'Mobile Number already Registered', 'code': 210,"httpCode":200}): resolve(1) 
                }

            });
        });
        //check email in database
        const emailCheck = new Promise( (resolve, reject) => {
            User.find({'email': req.body.email}, (err, results) => {
                if(err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage })
                } else {
                    results.length ?  reject({ 'message': 'Email already Registered', 'code': 210,"httpCode":200}):resolve(1)
                }
            });
        });
        Promise.all([mobileCheck, emailCheck]).then(() => {
            //Generate Hash Password ANd Compare When Login
            bcrypt.hash(req.body.password,10, (err, hash) => {
              
                if(err) {
                    res.send({'code':400,'message':'User Error.','data':""});
                } else {
                    User.create({
                        "name": req.body.name,
                        "email": req.body.email,
                        "password": hash,
                        "gender":req.body.gender,
                        "mobile":req.body.mobile,
                        "countryCode": req.body.countryCode,
                    }, (err, results) => {
                        if(err) {
                            if(err) 
                            {
                            return res.send({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage })
                            }
                        } else {
                            res.send({'code':200,'message':'Sucess.','data':results});
                        }
                    });
                }
            })
        }).catch(function (err) {
                        console.log('errerrerrerr', err)
                        res.status(err.httpCode).json(err);
                    }); 
    } catch (err) {
        res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
        console.log('catch login', err);
    }
}

//Login User
exports.Login = (req, res) => {
    try {
        /* check user email in database*/
        var emailCheck = new Promise(function (resolve, reject) {
            User.find( { 'email':req.body.email  }, function (err, results) {
                if (err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage })
                } else {

                    !results.length ? reject({ 'message': "Your login information is incorrect.Please try again", 'code': CodesAndMessages.notFoundCode, "httpCode": CodesAndMessages.HttpCode }) : resolve(results[0]);
                }
            })
        });
        Promise.all([emailCheck]).then(function (results) {

            //Compare Bcrypt With Password And Database Pssword
            bcrypt.compare(req.body.password, results[0].password, (err, result) => {
                if (err) {
                    return res.status(CodesAndMessages.serviceUnavailableCode).json({ code: CodesAndMessages.serviceUnavailableCode, httpCode: CodesAndMessages.serviceUnavailableHttpCode, message: CodesAndMessages.serviceUnavailableMessage });
                } else {
                    if (result) {
                        //signing-jwt-token
                        var token = jwt.sign({
                            id: results[0]._id
                        }, process.env.JWTPASS, {
                            expiresIn: process.env.JWTEXPIRETIME
                        });
                        //Update The Is Logout Key After Logout User Will Login
                        User.findOneAndUpdate({ '_id': results[0]._id }, {
                            $set: {
                                "isLogout": false
                            }
                        }, { new: true }, (err, result) => {

                            if (err) {
                                return res.send({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
                            }
                            else {
                                res.send({
                                    "code": CodesAndMessages.code,
                                    "message": CodesAndMessages.sucessmessage,
                                    "httpcode": CodesAndMessages.HttpCode,
                                    'data': { "_id": result._id, "image": result.image, "name": result.name, "username": result.username, "email": result.email, "countryCode": result.countryCode, "mobile": result.mobile, "licenceImage": result.licenceImage, "medicalImage": result.medicalImage, "dateOfBirth": result.dateOfBirth, "gender": result.gender }, "token": token
                                });
                            }
                        })
                    } else {
                        res.send({ code: CodesAndMessages.invalidCode, httpCode: 200, message: "Your login information is incorrect.Please try again" });
                    }
                }
            });
        }).catch((err) => {
            console.log(err)
            res.status(200).json(err);
        });
    }
    catch (err) {
        res.status(200).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        })
    }
}

//Logout
exports.Logout = (req, res) => {
    try {
         User.findOneAndUpdate({ '_id': req.userId }, {
        $set: {
            "isLogout": true
        }
    }, { new: true }, (err, result) => {
        if (err) {
            return res.send({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
        }
        else {
            res.send({
                "code": CodesAndMessages.code,
                "message": CodesAndMessages.logoutMessage,
                "httpcode": CodesAndMessages.HttpCode,
                'data': result
            });
        }
    })
}
catch (err) {
    res.status(200).json({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
}
}

//World Cases
exports.WorldCases = (req, res) => {
    try {
        //Find User In The Database
        var userCheck = new Promise(function (resolve, reject) {
            User.find({'_id': req.userId}, function (err, results) {
                console.log(results);
                if (err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage })
                } else {
                    !results.length ? reject({ 'message': "User Not Found", 'code': CodesAndMessages.notFoundCode, "httpCode": CodesAndMessages.HttpCode }) : resolve(results[0]);
                }   
            })
        });
       
        //Get Data From Corona Api
        var GetDataCoronaApi = new Promise(function (resolve, reject) {
               let url = `https://api.covid19api.com/summary`;
               let options = { json: true };
               request(url, options, (error, res, body) => {
                   
                   if (error) {
                       return console.log(error)
                   };
                   if (!error && res.statusCode == 200) {
                       console.log(body)
                    if(body)
                    {

                       resolve(body)
                    }
                    else
                    {
                        resolve([])
                    }
                   };
               });
        });
        Promise.all([userCheck,GetDataCoronaApi]).then(function (results) {
            let totalactive=results[1].Global.TotalConfirmed-results[1].Global.TotalRecovered-results[1].Global.TotalDeaths;
            res.send({"code":CodesAndMessages.code,'httpcode':CodesAndMessages.HttpCode,"message":CodesAndMessages.sucessmessage,"WorldCasesReport":{'TotalActiveCases':totalactive,'TotalCases':results[1].Global.TotalConfirmed,'TotalDeaths':results[1].Global.TotalDeaths}})
            console.log(totalactive)
      
        }).catch(function (err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });        
    } catch (e) {
        res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
        console.log('catch login', e);
    }
}

//CountryCases
exports.CountryCases = (req, res) => {
    try {
        //Find User In The Database
        var userCheck = new Promise(function (resolve, reject) {
            User.find({'_id': req.userId}, function (err, results) {
                console.log(results);
                if (err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage })
                } else {
                    !results.length ? reject({ 'message': "User Not Found", 'code': CodesAndMessages.notFoundCode, "httpCode": CodesAndMessages.HttpCode }) : resolve(results[0]);
                }   
            })
        });
       
        //Get Data From Corona Api
        var GetDataCoronaApi = new Promise(function (resolve, reject) {
               let url = `https://api.covid19api.com/summary`;
               let options = { json: true };
               request(url, options, (error, res, body) => {
                   
                   if (error) {
                       return console.log(error)
                   };
                   if (!error && res.statusCode == 200) {
                    if(body)
                    {

                       resolve(body)
                    }
                    else
                    {
                        resolve([])
                    }
                   };
               });
        });
        Promise.all([userCheck,GetDataCoronaApi]).then(function (results) {
          //Sort Data 
            var WorldData=CommonService.sortData(results[1]);
          res.send({"code":CodesAndMessages.code,'httpcode':CodesAndMessages.HttpCode,"message":CodesAndMessages.sucessmessage,"WorldCases":WorldData});
        }).catch(function (err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });        
    } catch (e) {
        res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
        console.log('catch login', e);
    }
}



