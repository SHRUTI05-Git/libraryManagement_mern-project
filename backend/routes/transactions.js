const router=require("express").Router();
const Transaction=require("../models/Transaction"),Book=require("../models/Book"),User=require("../models/User");
const Reservation=require("../models/Reservation"),auth=require("../middleware/auth"),roles=require("../middleware/roles");
const {calculateFine}=require("../utils/fine"),mail=require("../utils/email");
router.use(auth);
router.get("/",async(req,res)=>{
 const filter=req.user.role==="admin"?{}:{student:req.user.id};
 res.json(await Transaction.find(filter).populate("book","title isbn").populate("student","name email studentId").sort({createdAt:-1}));
});
router.post("/issue",roles("admin"),async(req,res)=>{
 try{
  const {bookId,studentId,dueDate,notes}=req.body,b=await Book.findById(bookId),s=await User.findOne({_id:studentId,role:"student"});
  if(!b||!s)return res.status(404).json({message:"Book or student not found"});
  if(b.availableCopies<1)return res.status(400).json({message:"No copies available"});
  const duplicate=await Transaction.findOne({book:bookId,student:studentId,status:"Issued"});
  if(duplicate)return res.status(400).json({message:"Student already has this book"});
  const t=await Transaction.create({book:bookId,student:studentId,dueDate,notes});
  b.availableCopies--;await b.save();await mail.issueEmail(s,b,dueDate);
  await Reservation.findOneAndUpdate({book:bookId,student:studentId,status:"Ready"},{status:"Fulfilled"});
  res.status(201).json(await t.populate([{path:"book",select:"title isbn"},{path:"student",select:"name email studentId"}]));
 }catch(e){res.status(400).json({message:e.message})}
});
router.put("/:id/return",async(req,res)=>{
 try{
  const t=await Transaction.findById(req.params.id).populate("book").populate("student");
  if(!t)return res.status(404).json({message:"Transaction not found"});
  if(req.user.role==="student"&&String(t.student._id)!==req.user.id)return res.status(403).json({message:"Access denied"});
  if(t.status==="Returned")return res.status(400).json({message:"Already returned"});
  t.status="Returned";t.returnDate=new Date();t.fine=calculateFine(t.dueDate,t.returnDate);t.finePaid=Boolean(req.body.finePaid);
  await t.save();t.book.availableCopies=Math.min(t.book.totalCopies,t.book.availableCopies+1);await t.book.save();
  await mail.returnEmail(t.student,t.book,t.fine);
  res.json(t);
 }catch(e){res.status(500).json({message:e.message})}
});
router.put("/:id/pay-fine",roles("admin"),async(req,res)=>{
 const t=await Transaction.findByIdAndUpdate(req.params.id,{finePaid:true},{new:true});res.json(t);
});
module.exports=router;
