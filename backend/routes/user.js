import express from "express"
import zod from "zod"
import {User} from "../db.js";
import { JWT_SECRET } from "../config.js" // The JWT Secret used to sign with userId
import pkg from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Used for hashing the password before storing in db
const { sign } = pkg;
const router=express.Router();

const signupbody=zod.object({ // Zod Schema for signup body
email:zod.string().email(),
fullName:zod.string(),
password:zod.string(),
role:zod.string()
})

router.post("/signup",async (req,res)=>{
    const validationResult = signupbody.safeParse(req.body); //Cheks if the sigup body is same as defined in zod
    if(!req.body.email || !req.body.password || !req.body.fullName)
        {
            return res.status(400).json({
                message:"All fields are required"
            })
        }
        if (!validationResult.success) { // If not same as zod schema then gives error
            return res.status(400).json({
                message: "Invalid input",
                errors: validationResult.error.format()
            });
        }
if(req.body.password.length<6)
{
    return res.status(400).json({
        message:"Password should be of atleast 6 characters"
    })
}
const existinguser=await User.findOne({  // checks if user already exists in db
    email:req.body.email,
})
if(existinguser)
{
    return res.status(411).json(
        {
            message:"User Already Exists"
        }
    )
}
const salt=await bcrypt.genSalt(11) // Gives the value of salt used for hashing
const hashedpassword=await bcrypt.hash(req.body.password,salt) // gies the hashed password
const user=await User.create({ // Creates the user
    email:req.body.email,
    password:hashedpassword,
    fullName:req.body.fullName,
    role:req.body.role
})
const userId=user._id
    const token=sign({ // gves the jwt token after signing the userId iwth the JWT Secret
        userId
    },JWT_SECRET)
    res.json({ // Sends message,token,userId,role in res which helps in storing these in localstorage
        message:"User Created Successfully",
        token:token,
        userId:userId,
        role:req.body.role
    })
})

const signinbody=zod.object({ // Zod Schema for signin body
    email:zod.string().email(),
    password:zod.string()
})

router.post("/signin",async (req,res)=>{
    const validationResult = signinbody.safeParse(req.body); //Cheks if the sigin body is same as defined in zod
if(!req.body.email || !req.body.password)
{
    return res.status(400).json({
        message:"All fields are required"
    })
}
if (!validationResult.success) { // If not same as zod schema then gives error
    return res.status(400).json({
        message: "Invalid input",
        errors: validationResult.error.format()
    });
}
const user=await User.findOne({ // Checks if the user exists in db or not
    email:req.body.email
})
if(user) // If the user exists
{
    const isCorrect=await bcrypt.compare(req.body.password,user.password) // checks whether the hashed password is same as the password input by the user or not
    if(!isCorrect)
    {
        return res.status(400).json({
            message:"Invalid Credentials"
        })
    }
    const token=sign({ // gves the jwt token after signing the userId iwth the JWT Secret
        userId:user._id
    },JWT_SECRET)
    res.json({ // Sends message,token,userId,role in res which helps in storing these in localstorage
        token:token,
        userId:user._id,
        role:user.role
    })
    return
}
return res.status(411).json({
    message:"Error While Signing"
})
});

router.post("/details",async (req,re)=>{
    try {
        const user=await User.findById(req.body.id)
        return res.status(200).json(user)   
    } catch (error) {
        return res.status(400).json({
            message:"Error while fetching user details"
        })
    }
})
export default router