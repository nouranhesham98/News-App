const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const newsroutes=require('./routers/news')
const news2routes=require('./routers/news2')
const multer=require('multer')
const PersonData=require('./models/news')

require('./db/mongoose')

//to parse automatically , accept data in JSON format
app.use(express.json())
app.use(newsroutes)
app.use(news2routes)
const uploads= multer({
    dest: 'image',

    fileFilter(req,file,cb){
        if(file.originalname.endsWith('.pdf'))
        {cb(new Error('Please Upload pdf file'))
    }
    cb(null,true)
    }
})

app.post('/image',uploads.single('Image'),(req,res)=>{
    res.send('File Uploaded')
})




app.listen(port,()=>{console.log('Server is running')})
