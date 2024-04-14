import dotenv from "dotenv";
dotenv.config();

import express, { request, response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const app = express()
app.use(express.json())

app.get('/',(request, response) => {
  response.status(200).json({msg:'Bem vindo a nossa api!'})
})

const dbUser = process.env.dbUser
const dbPass = process.env.dbPass

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.lcuvo3i.mongodb.net/`).then(() => {
  app.listen(3000)
  console.log("conectado");
}).catch(((error) => 
{ console.log(error)
}))