const mongoose = require('mongoose')
const news2Schema = mongoose.Schema({
    title:{
  type:String
    // required:true,
},
description:{
    type:String,
    trim:true,
    // required:true
},
owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'PersonData'  
},
image: {
    type:Buffer
}
}
)

news2Schema.methods.toJSON=function(){
    const news=this
    const newsObject=news.toObject()

    return newsObject
}
const News2=mongoose.model('News2',news2Schema)
module.exports=News2