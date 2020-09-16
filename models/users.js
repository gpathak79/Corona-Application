var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    "name": {type: String, default:''},
    "email": {type: String, default:''},
    "password":{type: String, default:''},
    "countryCode": {type: String, default:'+1'},
    "mobile": {type: String, default:''}, 
    "gender":{type:String,default:''},
    "isLogout": {type: Boolean, default:false},
    "created":{type: Date, default: Date.now},
    "updated":{type: Date},
},{ collection: 'users'});
module.exports = mongoose.model('users', schema); 
