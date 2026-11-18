const router=require("express").Router();
const Reservation=require("../models/Reservation"),Book=require("../models/Book"),User=require("../models/User");
const auth=require("../middleware/auth"),roles=require("../middleware/roles"),mail=require("../utils/email");
router.use(auth);
router.get("/",async(req,res)=>{
 const filter=req.user.role==="admin"?{}:{student:req.user.id};
 res.json(await Reservation.find(filter).populate("book","title author isbn availableCopies").populate("student","name email studentId").sort({createdAt:-1}));
});
router.post("/",roles("student"),async(req,res)=>{
 const b=await Book.findById(req.body.bookId),s=await User.findById(req.user.id);
 if(!b)return res.status(404).json({message:"Book not found"});
 if(b.availableCopies>0)return res.status(400).json({message:"Book is available; reserve only when unavailable"});
 const duplicate=await Reservation.findOne({book:b._id,student:s._id,status:{$in:["Waiting","Ready"]}});
 if(duplicate)return res.status(400).json({message:"You already reserved this book"});
 const position=(await Reservation.countDocuments({book:b._id,status:"Waiting"}))+1;
 const r=await Reservation.create({book:b._id,student:s._id,position});
 res.status(201).json(r);
});
router.delete("/:id",async(req,res)=>{
 const r=await Reservation.findById(req.params.id);
 if(!r)return res.status(404).json({message:"Reservation not found"});
 if(req.user.role!=="admin"&&String(r.student)!==req.user.id)return res.status(403).json({message:"Access denied"});
 r.status="Cancelled";await r.save();res.json(r);
});
router.post("/:id/ready",roles("admin"),async(req,res)=>{
 const r=await Reservation.findById(req.params.id).populate("book").populate("student");
 if(!r)return res.status(404).json({message:"Reservation not found"});
 r.status="Ready";r.notifiedAt=new Date();await r.save();await mail.reservationEmail(r.student,r.book);res.json(r);
});
module.exports=router;
