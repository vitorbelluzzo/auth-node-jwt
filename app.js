import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express()