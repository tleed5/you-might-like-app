const user = require('../models/user');
const spotifyService = require('../services/spotifyService');

module.exports = {
    //Return new User
    async CreateUser(username,auth,refresh){
        let newUser = new user({
            username:username,
            access_token:auth,
            refresh_token:refresh,
        });
        try{
            let foundUser = await user.findOne({username:username})
            if(!foundUser){
                await newUser.save();
                return newUser;
            }else{
                return foundUser;
            }
        }catch(err){
            console.error('failed to create user',err);
        }
    },
    //Return user found
    async GetUser(token){
        let foundUser = await user.findOne({access_token:token})
        return foundUser;
    },
    async UpdateUser(id,params){

    },
    async DestroyUser(id){

    },
    async AuthenticateUser(){

    },
}