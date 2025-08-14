import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

import http from "http";
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on('connection',(socket)=>{
  console.log("user connected");
  console.log(socket.id);

  socket.on('disconnect',()=>{
    console.log("user disconnected");
  })
})

app.use(express.json());
app.use(express.static(path.join(path.resolve(), "public")));

import bcrypt from "bcrypt";

import prisma from "./db/dbconfig.js";  

import cors from "cors";
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_jwt_secret_key';

passport.use(new LocalStrategy({
  usernameField: 'mail',
  passwordField: 'pass'
}, async (mail, pass, done) => {
  const user = await prisma.user.findUnique({ where: { mail: mail } });  
  if (!user) return done(null, false, { message: 'Incorrect username.' });
  const hashedpass = await bcrypt.compare(pass, user.pass);
  if (!hashedpass) return done(null, false, { message: 'Incorrect password.' });
  return done(null, user);
}));

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  const user = await prisma.user.findUnique({ where: { id: jwt_payload.id } });

  if (user) {
    return done(null, user);
  } else {
    return done(null, false);
  }
}));

app.use(passport.initialize());

import multer from "multer";
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads");
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now()+file.originalname);
    }
})
const upload = multer({storage:storage});

app.use('/uploads', express.static('uploads'));

app.post('/signin', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info.message || 'Login failed' });
    }
    const payload = { id: user.id, name: user.name };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    return res.json({ message: 'Login successful', token });

  })(req, res, next); 

});

app.post('/signup', async (req, res) => {
  try { 
    const { name,pass,mail } = req.body;
    const hashedpass = await bcrypt.hash(pass, 10);
   
    const user = await prisma.user.create({
      data: {
        name,
        mail,
        pass: hashedpass
      }
    });
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ error: err.message, msg:false }); 
  }
});

server.listen(3001,()=>{ console.log("server started"); })
