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
})

const dbUser = process.env.dbUser
const dbPass = process.env.dbPass

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.lcuvo3i.mongodb.net/`).then(() => {
  app.listen(3000)
  console.log("conectado");
}).catch(((error) => 
{ console.log(error)
}))