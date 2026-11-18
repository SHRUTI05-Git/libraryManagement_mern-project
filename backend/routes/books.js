const router=require("express").Router();
const Book=require("../models/Book"),Transaction=require("../models/Transaction"),Reservation=require("../models/Reservation");
const auth=require("../middleware/auth"),roles=require("../middleware/roles");
router.use(auth);
router.get("/",async(req,res)=>{
 const q=(req.query.q||"").trim(),cat=req.query.category;
 const filter={...(q?{$or:[{title:{$regex:q,$options:"i"}},{author:{$regex:q,$options:"i"}},{isbn:{$regex:q,$options:"i"}},{category:{$regex:q,$options:"i"}}]}:{}),...(cat&&cat!=="All"?{category:cat}:{})};
 res.json(await Book.find(filter).sort({createdAt:-1}));
});
router.get("/:id",async(req,res)=>res.json(await Book.findById(req.params.id)));
router.post("/",roles("admin"),async(req,res)=>{
 try{const b=await Book.create({...req.body,availableCopies:req.body.totalCopies});res.status(201).json(b)}
 catch(e){res.status(400).json({message:e.code===11000?"ISBN already exists":e.message})}
});
router.put("/:id",roles("admin"),async(req,res)=>{
 try{
  const old=await Book.findById(req.params.id),issued=old.totalCopies-old.availableCopies,total=Number(req.body.totalCopies);
  if(total<issued)return res.status(400).json({message:`At least ${issued} copies are currently issued`});
  res.json(await Book.findByIdAndUpdate(req.params.id,{...req.body,totalCopies:total,availableCopies:total-issued},{new:true,runValidators:true}));
 }catch(e){res.status(400).json({message:e.message})}
});
router.delete("/:id",roles("admin"),async(req,res)=>{
 const active=await Transaction.findOne({book:req.params.id,status:"Issued"});
 const reservations=await Reservation.findOne({book:req.params.id,status:{$in:["Waiting","Ready"]}});
 if(active||reservations)return res.status(400).json({message:"Book has active circulation or reservations"});
 await Book.findByIdAndDelete(req.params.id);res.json({message:"Book deleted"});
});
module.exports=router;
