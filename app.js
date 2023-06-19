require('dotenv').config()

const express = require ('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')


const app = express()
//Config JSON response
app.use(express.json())
//models
const User =require('./models/User')
// book models
const bookSchema = require('./models/book.model')

// Open Router -Public Route

app.get('/',(req,res)=>{
res.status(200).json({msg:'Bem vindo a nossa API'})

})

//Private Route
app.get("/user/:id",async(req,res)=>{
    const id = req.params.id
    
    //check if user exists
const user = await User.findById(id,'-password')

if(!user){
    return res.status(404).json({msg:'Usuario não encontrado!'})
}
res.status(200).json({user})
})


// Register
app.post('/auth/register',async(req,res)=>{

    const {name,email,password,confirmpassword} =req.body

    //validations
    if(!name){
        return res.status(422).json({msg:'O nome e obrigatório!'})
    }
    if(!email){
        return res.status(422).json({msg:'O email e obrigatório!'})
    }
        if(!password){
            return res.status(422).json({msg:'A senha e obrigatório!'})
        }
        if(password !==confirmpassword){
            return res.status(422).json({msg:'As senha não conferem!'})
        }

//check if user exists
    const userExists= await User.findOne({ email: email})

    if(userExists){
        return res.status(422).json({msg:'Por favor,utilizar outro e-mail ,esse e-mail ja esta sendo utilizando!'})
    }
//create password
const salt = await bcrypt.genSalt(12)
const passwordHash = await bcrypt.hash(password,salt)


//create user
const user = new User({
    name,
    email,
    password:passwordHash,

})


try {
    await user.save()

  res.status(201).json({msg:'Usuário criando com sucesso!'})
}catch(error){
    console.log(error)

    res
    .status(500)
    .json({
        msg:'Aconteceu um error no servidor,tente novamente mais tarde!',
})
}
