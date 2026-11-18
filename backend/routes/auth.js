const router=require("express").Router();
const bcrypt=require("bcryptjs"),jwt=require("jsonwebtoken");
const User=require("../models/User"),auth=require("../middleware/auth");
const token=u=>jwt.sign({id:u._id,role:u.role,email:u.email},process.env.JWT_SECRET,{expiresIn:"7d"});
const safe=u=>({id:u._id,name:u.name,email:u.email,role:u.role,phone:u.phone,department:u.department,studentId:u.studentId,active:u.active,avatar:u.avatar});
router.post("/register",async(req,res)=>{
 try{
  const {name,email,password,studentId,department}=req.body;
  if(!name||!email||!password)return res.status(400).json({message:"Name, email and password are required"});
  if(await User.findOne({email}))return res.status(409).json({message:"Email already registered"});
  const u=await User.create({name,email,password:await bcrypt.hash(password,10),role:"student",studentId,department});
  res.status(201).json({token:token(u),user:safe(u)});
 }catch(e){res.status(400).json({message:e.message})}
});
router.post("/login",async(req,res)=>{
 try{
  const u=await User.findOne({email:req.body.email});
  if(!u||!await bcrypt.compare(req.body.password,u.password))return res.status(401).json({message:"Invalid email or password"});
  if(!u.active)return res.status(403).json({message:"Account is inactive"});
  res.json({token:token(u),user:safe(u)});
 }catch(e){res.status(500).json({message:e.message})}
});
router.get("/me",auth,async(req,res)=>res.json(safe(await User.findById(req.user.id))));
router.put("/profile",auth,async(req,res)=>{
 try{const u=await User.findByIdAndUpdate(req.user.id,{name:req.body.name,phone:req.body.phone,department:req.body.department,avatar:req.body.avatar},{new:true});res.json(safe(u))}
 catch(e){res.status(400).json({message:e.message})}
});
router.put("/password",auth,async(req,res)=>{
 const u=await User.findById(req.user.id);
 if(!await bcrypt.compare(req.body.currentPassword,u.password))return res.status(400).json({message:"Current password is incorrect"});
 u.password=await bcrypt.hash(req.body.newPassword,10);await u.save();res.json({message:"Password updated"});
});
module.exports=router;
