const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcryptjs = require('bcryptjs')


const PersonSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim:true,
        ref:'PersonData'
    },
    age: {
        required: true,
        trim:true,
        type: Number
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true, 
        validate(value){
            // value --> email
            if(!validator.isEmail(value)){
                throw new Error ('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,
        validate(value){
            let strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
           // 123456
            if(!strongPassword.test(value)){
                throw new Error('Password must include UpperCase ,char ,number')
            }
        }
    },
    phoneNumber:
    {
        type:String,
        
         validate(value)
         {
            let validNum= new RegExp("^01[0-2,5]\d{8}$")
                // /^01[0125][0-9]{8}$/)
            if(!validNum){
                throw new Error('Enter valid Phone Number')
            }
         }
    },
    image:
    {type:Buffer
    },
    tokens:[
        {
            type:String,
            required:true
        }
    ]

})
//////////////////////////////////////////////////
// password
// before save data --> hash password
PersonSchema.pre('save',async function(){
    // this --> document 
    const person = this
    // console.log(person.password)
    if(person.isModified('password'))
    person.password = await bcryptjs.hash(person.password,8)
})
// login
// statics --> call function on model
PersonSchema.statics.findByCredentials = async(email,password)=>{
    // first step
    const person = await PersonData.findOne({email})
    // console.log(person)
    if(!person){
        throw new Error ('Please check email ')
    }

    // password
    const passMatch = await bcryptjs.compare(password,person.password)
    console.log(password)
    console.log(person.password)
    console.log(passMatch)

    if(!passMatch)
    {
        throw new Error('Please check  password')
    }
    return (person)

}
/////////////////////////////////////////////////////////////////////
//Generation of Tokens
PersonSchema.methods.generateToken = async function(){
    const person = this
    const token = jwt.sign({_id:person._id.toString()},'node')
//    console.log(person.tokens.push(token))
    person.tokens = person.tokens.concat(token)
    await person.save()
    return token
}

////////////////////////////////////////////
//Senstive data handling
PersonSchema.methods.toJSON = function(){
    const person=this
    const personObject=person.toObject()

    delete personObject.password
    delete personObject.tokens

    return personObject
}

//Virtual relation
PersonSchema.virtual('news',{
    ref:'News2',
    localField:'_id',
    foreignField:'owner'
})

//////////////////////////
PersonSchema.pre('save',async function(){
    // this --> document 
    const person = this
    // console.log(user)
    // before hash
    // console.log(user.password)
    //user.password =Aa@123456 = jskh8392rgwuedjsfh
    if(person.isModified('password'))
    person.password = await bcryptjs.hash(person.password,8)
    // after hash
    // console.log(user.password)
})
//////////////////
const PersonData = mongoose.model('PersonData', PersonSchema)
module.exports=PersonData