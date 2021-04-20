const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json');

const User = require('../models/user')

const router = express.Router();

function generateToken(params = {}) {

    const token = jwt.sign(params, authConfig.secret,{

        //expira em 
        expiresIn: 86400,

    });

    return token;

}

router.post('/register', async  (req,res) => {
    try{
        const { email } = req.body;

        if(await User.findOne({ email })){
            return res.status(400).send({"error": "Email aready exists"});
        }

        const user = await User.create(req.body);

        user.password = undefined;
        
        
        return res.send({
            user,
            token: generateToken({id: user.id})
        })

    } catch (err){
        res.status(400).send({"error": "Registration failed"})
    }
})

router.post('/authenticate', async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password')

    if(!user){
        return res.status(400).send({error: "User not found"})    
    
    }

    if(!await bcrypt.compare(password, user.password)){
        return res.status(403).send({error: "Invalid Password"})
    };

    user.password = undefined;

    //gerando token
    const token = 

    res.send({
        user, 
        token: generateToken({id: user.id})
    });


})

module.exports = app => app.use('/auth', router);