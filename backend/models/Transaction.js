const mongoose=require("mongoose");
const schema=new mongoose.Schema({
 book:{type:mongoose.Schema.Types.ObjectId,ref:"Book",required:true},
 student:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
 issueDate:{type:Date,default:Date.now},
 dueDate:{type:Date,required:true},
 returnDate:{type:Date,default:null},
 status:{type:String,enum:["Issued","Returned"],default:"Issued"},
 fine:{type:Number,default:0},
 finePaid:{type:Boolean,default:false},
 notes:{type:String,default:""}
},{timestamps:true});
module.exports=mongoose.model("Transaction",schema);
