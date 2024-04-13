import dotenv from "dotenv";
dotenv.config();

import express, { request, response } from "express";
import Mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express()
app.use(express.json())

app.listen(3000)

app.get('/',(request, response) => {
  response.status(200).json({msg:'Bem vindo a nossa api!'})
})