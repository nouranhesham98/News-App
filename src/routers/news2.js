const express = require('express')
const router = express.Router()
const News2 = require('../models/news2')
const auth = require('../Middleware/auth')
const multer = require('multer')


router.post('/news',auth,async(req,res)=>{
    try{
        const news =new News2({...req.body,owner:req.person._id})
        news.populate('owner')
        await news.save()
        res.status(200).send(news)
        // current timestamp in milliseconds
const timestamp = Date.now();
 
const dateObject = new Date(timestamp);
const date = dateObject.getDate();
const month = dateObject.getMonth() + 1;
const year = dateObject.getFullYear();
 
// prints date & time in YYYY-MM-DD format
res.send((`Time stamp : ${year}-${month}-${date}`));
    }
    catch(e)
    {res.status(200).send(e.message)}
})

router.get('/news',auth,async(req,res)=>{
    try{
    // prints date & time in YYYY-MM-DD format
const timestamp = Date.now();
const dateObject = new Date(timestamp);
const date = dateObject.getDate();
const month = dateObject.getMonth() + 1;
const year = dateObject.getFullYear();
 

res.send((`Time stamp : ${year}-${month}-${date}`));
       await req.person.populate('news')
        res.status(200).send(req.person.news)
    }
    catch(e){
        res.status(500).send(e.message)
    }

})
//patch by id
router.patch('/editnews/:id',auth,async(req,res)=>{
    try{
const updated=await News2.findOneAndUpdate({
    _id:req.params.id,
    owner:req.person._id
},
req.body,
{
    new:true,
    runValidators:true,
}
)
if(!updated)
{
    return res.status(404).send("No News Found ")
}
res.status(200).send(updated)
    }
    catch(e)
    {res.status(400).send(e.message)}
})


// router.patch('/editnews' , auth,async(req,res)=>{
//     try 
//     {
//     await req.person.populate('news')
//     const update=req.person.news
//     console.log(update)
//     const allowedUpdates = ['title','description','image']   
//     const isValid = update.every((el)=>allowedUpdates.includes(el))
//         console.log(isValid)

//         if(!isValid){
//             return res.status(400).send("Can't update")
//         }
//         // console.log(req.person.news)
//         update.forEach((el)=>(update[el]=req.body[el]))
//           await  update.save() 
//         //   console.log(req.person)
//          res.status(200).send(update) 
//     }
//     catch(e)
//     {res.status(400).send(e)}
// })

// Delete by id
router.delete('/deletenew/:id',auth,async(req,res)=>{
    try{
        const news = await News2.findOneAndDelete({_id:req.params.id,
            owner:req.person._id})
        if(!news){
            return res.status(404).send('No task is found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})



const uploads=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/))
        {return cb (new Error('Please upload an imagee'))
    }
    cb(null,true)
    }
})


router.post('/newsimage',auth,uploads.single('avatar'),async(req,res)=>{
    try{
        // spread operator (copy of data) ....
        const image = new News2({...req.body,owner:req.person._id})
        image.image = req.file.buffer
        await image.save()
        res.status(200).send(image)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})


module.exports=router