const express = require('express')
const router = express.Router()
const PersonData=require('../models/news')
const auth = require('../Middleware/auth')
const { userInfo } = require('os')



router.post('/signup',async(req,res)=>{
    try {
  // prints date & time in YYYY-MM-DD format
const timestamp = Date.now();
const dateObject = new Date(timestamp);
const date = dateObject.getDate();
const month = dateObject.getMonth() + 1;
const year = dateObject.getFullYear();


        const person=new PersonData(req.body)
        const token=await person.generateToken()
        await person.save()
        res.status(200).send({person,token})
    }
    catch(e)
    {
        res.status(400).send(e.message)
    }
})

// login
router.post('/login',async(req,res)=>{
    try{
        const person = await PersonData.findByCredentials(req.body.email,req.body.password)
        const token = await person.generateToken()
       console.log(token)
        res.status(200).send({person,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

//Get 
router.get('/users',auth,async(req,res)=>{
    PersonData.find({}).then((data)=>{
       res.status(200).send(data)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
//Get Profile
router.get('/profile',auth,async(req,res)=>{
    res.status(200).send(req.person)
    // console.log(req.name)

})

// Edit profile
router.patch('/edit',auth,async(req,res)=>{
    
    try{
        const updates = Object.keys(req.body)
        // console.log(updates)
        const allowedUpdates = ['name','age','email']
        
        const isValid = updates.every((el)=>allowedUpdates.includes(el))
        console.log(isValid)

        if(!isValid){
            return res.status(400).send("Can't update")
        }
        // console.log(req.person)
        updates.forEach((el)=>(req.person[el]=req.body[el]))
          await  req.person.save() 
        //   console.log(req.person)
         res.status(200).send(req.person) 
    }
    catch(e){
        res.status(400).send(e)
    }
    })
    //delete user profile

// router.delete('/delete',auth,async(req,res)=>{
//     try{
//         updates.forEach((el)=>(req.person[el]=req.body['']))
//         await  req.person.save() 
//         res.status(200).send('Deleted')
//     }
//     catch(e){
//         res.status(500).send(e)
//     }
// })

    // logout profile
    router.delete('/logout',auth,async(req,res)=>{
        try{
            // new array satisfy certain critira (condtion)
            req.person.tokens = req.person.tokens.filter((el)=>{
            
                return el !== req.token
            })
            await req.person.save()
            res.status(200).send()
    
        }
        catch(e){
            res.status(500).send(e)
        }
    })
module.exports=router