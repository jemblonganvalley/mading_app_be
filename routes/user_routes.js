const express  = require("express")
const path = require("path")
const fs = require("fs")
require("dotenv").config()
const bcryptjs = require("bcryptjs")
const salt = bcryptjs.genSaltSync(10)
const cryptojs = require("crypto-js")
const conn = require("../prisma/conn")
const { v4: uuidv4 } = require('uuid');
const jwt  = require("jsonwebtoken")
const moment = require("moment")

const user_route = express.Router()

//create user / register
user_route.post("/user_create", async(req,res)=>{
    try {
        const {email , password} = await req.body
        const checkEmail = await conn.users.findUnique({
            where : {
                email : email
            }
        })

        if(checkEmail){
            res.status(401).json({
                success : false,
                msg : "email sudah di gunakan"
            })
            return
        }

        const createNewUser = await conn.users.create({
            data : {
                email : email,
                password : bcryptjs.hashSync(password, salt),
                uuid : uuidv4()
            }
        })

        res.status(201).json({
            success : true,
            msg : "Registrasi Berhasil"
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

// login system
user_route.post("/user_login", async(req,res)=>{
    try {
        const {email,password} = await req.body

        //check email
        const checkEmail = await conn.users.findUnique({
            where : {email : email}
        })

        if(!checkEmail){
            res.status(404).json({
                success : false,
                msg : "Email tidak ditemukan"
            })
            return
        }

        // check password
        const checkPassword = await bcryptjs.compareSync(password, checkEmail.password)

        if(!checkPassword){
            res.status(401).json({
                success : false,
                msg : "Password salah"
            })
            return
        }

        // generated token
        const generateToken = await jwt.sign({
            app_name : "madingapp",
            user_email : checkEmail.email,
            user_id : checkEmail.uuid,
            created_at : moment().format("DD-MM-YYYY hh:mm:ss")
        }, process.env.API_SECRET , {
            expiresIn : "1d"
        })

        conn.$disconnect()

        res.status(200).json({
            success : true,
            token : generateToken
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})



module.exports = user_route