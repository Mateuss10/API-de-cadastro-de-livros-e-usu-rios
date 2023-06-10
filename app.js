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

})
//login User
app.post("/auth/login",async (req,res) => {
     
    const { email, password }= req.body

//validations
    if(!email){
        return res.status(422).json({msg:'O email e obrigatório!'})
    }
        if(!password){
            return res.status(422).json({msg:'A senha e obrigatório!'})
        }
    
        //check if user exists
    const user= await User.findOne({ email: email})

    if(!user){
        return res.status(404).json({msg:'Usuario não encontrado!'})
    }

    
    //check if password match
    const checkPassword =await bcrypt.compare(password,user.password)

    if(!checkPassword){
        return res.status(422).json({msg:'Senha inválida!'})
    }


})



app.post("/models/book",async(req,res)=>{
    const {title,author,publisher,pages} =req.body

    if(!title){
        return res.status(422).json({msg:'O titulo e obrigatório!'})
    }
    if(!author){
        return res.status(422).json({msg:'O autor e obrigatório!'})
    }if(!publisher){
        return res.status(422).json({msg:'O editor e obrigatório!'})
    }if(!pages){
        return res.status(422).json({msg:'As paginas e obrigatório!'})
    }
    
    const book = new bookSchema({
        title,
        author,
        pages,
    
    })
    
    try {
        await book.save()
    
      res.status(201).json({msg:'livro criando com sucesso!'})
    }catch(err){
        console.log(err)
    
        res
        .status(500)
        .json({
            msg:'Aconteceu um error no servidor,tente novamente mais tarde!',
    
        })
    }
    console.dir(req)
    
        
})
    app.get("/book/:id",async(req,res)=>{
    const id = req.params.id
    
    //check if user exists
const book = await bookSchema.findById(id)

if(!book){
    return res.status(404).json({msg:'livro na encontrado!'})
}
res.status(200).json({book})
})

// credencials

const dbUser = process.env.DB_USER  
const dbPasword = process.env.DB_PASS  


//mongoose

mongoose.connect('mongodb+srv://reismateus1041:silva123@mateusprjeto1.znk0rxz.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    console.log('Conectou ao banco!')

})

.catch((err)=> console.log(err))


app.listen(3000)

