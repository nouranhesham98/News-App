const jwt = require('jsonwebtoken')
const PersonData =require('../models/news')

const auth=async(req,res,next)=> {
try{
    // Bearer token   -(replace)-> token
    const token = req.header('Authentication').replace('Bearer ','')
    // console.log(token)
    const decode = await (jwt.verify(token,'node'))
    // console.log(decode)
    const person = await PersonData.findOne({_id_:decode._id_,tokens:token})
    console.log(person)
    if(!person){
         console.log('No user is found')
        throw new Error()
    }
    req.person = person
    req.name=person.name
    // current token 
    req.token = token

    next()
}
catch(e){
    res.status(401).send({error:'Please authenticate'})
}
}


module.exports = auth