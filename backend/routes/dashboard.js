const router=require("express").Router();
const Book=require("../models/Book"),User=require("../models/User"),Transaction=require("../models/Transaction"),Reservation=require("../models/Reservation");
const auth=require("../middleware/auth"),roles=require("../middleware/roles");
router.get("/admin",auth,roles("admin"),async(req,res)=>{
 const [books,students,issued,returned,reservations,fines]=await Promise.all([
  Book.find(),User.countDocuments({role:"student",active:true}),Transaction.countDocuments({status:"Issued"}),Transaction.countDocuments({status:"Returned"}),Reservation.countDocuments({status:{$in:["Waiting","Ready"]}}),Transaction.aggregate([{$match:{fine:{$gt:0}}},{$group:{_id:null,total:{$sum:"$fine"},unpaid:{$sum:{$cond:["$finePaid",0,"$fine"]}}}}])
 ]);
 const totalCopies=books.reduce((a,b)=>a+b.totalCopies,0),available=books.reduce((a,b)=>a+b.availableCopies,0);
 const categories=await Book.aggregate([{$group:{_id:"$category",count:{$sum:1}}},{$sort:{count:-1}}]);
 res.json({titles:books.length,totalCopies,available,issued,returned,students,reservations,fines:fines[0]||{total:0,unpaid:0},categories});
});
router.get("/student",auth,roles("student"),async(req,res)=>{
 const [issued,returned,reservations,fines]=await Promise.all([
  Transaction.countDocuments({student:req.user.id,status:"Issued"}),Transaction.countDocuments({student:req.user.id,status:"Returned"}),
  Reservation.countDocuments({student:req.user.id,status:{$in:["Waiting","Ready"]}}),
  Transaction.aggregate([{$match:{student:require("mongoose").Types.ObjectId.createFromHexString(req.user.id),fine:{$gt:0}}},{$group:{_id:null,total:{$sum:"$fine"},unpaid:{$sum:{$cond:["$finePaid",0,"$fine"]}}}}])
 ]);
 res.json({issued,returned,reservations,fines:fines[0]||{total:0,unpaid:0}});
});
module.exports=router;
