import dotenv from "dotenv";
dotenv.config();

import express, { request, response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { User } from './models/user.js'
const app = express()
app.use(express.json())


app.get('/',(request, response) => {
  response.status(200).json({msg:'Bem vindo a nossa api!'})
})

function checkToken(request, response, next) {
  const authHeader = request.headers['authorization']; 
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return response.status(401).json({msg: 'Acesso negado!'});}  
  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    response.status(400).json({msg:"Token inválido"});
  }
}

app.get('/user/:id', checkToken, async (request, response) => { 
  const id = request.params.id;
  const user = await User.findById(id, '-password');

  !user ? response.status(404).json({msg:"Usuário não encontrado"}) : response.status(200).json({ user });
});


  
app.post('/auth/register', async (request, response) => {
  const { name, email, password, confirmPassword } = request.body
  if (!name) {
    response.status(422).json({ msg: 'O nome é obrigatório!'})
  }
  if (!email) {
    response.status(422).json({ msg: 'O email é obrigatório!'})
  }
  if (!password) {
    response.status(422).json({ msg: 'A senha é obrigatório!'})
  }
  if (password !== confirmPassword)  {
    response.status(422).json({ msg: 'As senhas não coincidem!'})
  }
  const userExists = await User.findOne({ email: email })

  if (userExists){
     return response.status(422).json({msg: 'Email já utilizado' })
  }
  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = new User({
    name,
    email, 
    password: passwordHash,
  })

  try {
    await user.save()
    response.status(201).json({ msg: 'Usuário criado com sucesso!' })
  } catch (error) {
    console.log(error);
    response.status(500).json({msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!',
    })
  }
})


app.post('/auth/login', async (request,response) => {
  const { email, password } = request.body;
  if (!email || !password) { 
    return response.status(422).json({ msg: 'O email e a senha são obrigatórios!'});
  }

  const user = await User.findOne({ email });

  if (!user){
    return response.status(404).json({msg: 'Usuário não encontrado' });
  }

  const checkpassword = await bcrypt.compare(password, user.password);

  if (!checkpassword) {
    return response.status(401).json({msg: 'Credenciais inválidas!'}); 
  }

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign({
      id: user._id
    }, secret);
    response.status(200).json({msg:"Autenticação realizada com sucesso", token});

  } catch (error) {
    response.status(500).json({msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'});
  }
});



const dbUser = process.env.dbUser
const dbPass = process.env.dbPass

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.lcuvo3i.mongodb.net/`).then(() => {
  app.listen(3000)
  console.log("conectado");
}).catch(((error) => 
{ console.log(error)
}))