const router=require("express").Router();
const User=require("../models/User"),Transaction=require("../models/Transaction");
const auth=require("../middleware/auth"),roles=require("../middleware/roles");
router.use(auth,roles("admin"));
router.get("/",async(req,res)=>{
 const q=req.query.q||"",filter=q?{$or:[{name:{$regex:q,$options:"i"}},{email:{$regex:q,$options:"i"}},{studentId:{$regex:q,$options:"i"}},{department:{$regex:q,$options:"i"}}]}:{};
 res.json(await User.find({...filter,role:"student"}).select("-password").sort({createdAt:-1}));
});
router.post("/",async(req,res)=>{
 try{
  const u=await User.create({...req.body,role:"student",password:await require("bcryptjs").hash(req.body.password||"Student@123",10)});
  res.status(201).json(u);
 }catch(e){res.status(400).json({message:e.message})}
});
router.put("/:id",async(req,res)=>res.json(await User.findOneAndUpdate({_id:req.params.id,role:"student"},{name:req.body.name,email:req.body.email,phone:req.body.phone,department:req.body.department,studentId:req.body.studentId,active:req.body.active},{new:true}).select("-password")));
router.delete("/:id",async(req,res)=>{
 const active=await Transaction.findOne({student:req.params.id,status:"Issued"});
 if(active)return res.status(400).json({message:"Student has active books"});
 await User.findOneAndDelete({_id:req.params.id,role:"student"});res.json({message:"Student deleted"});
});
module.exports=router;
