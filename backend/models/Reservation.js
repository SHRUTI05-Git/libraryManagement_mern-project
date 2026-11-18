const mongoose=require("mongoose");
const schema=new mongoose.Schema({
 book:{type:mongoose.Schema.Types.ObjectId,ref:"Book",required:true},
 student:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
 status:{type:String,enum:["Waiting","Ready","Fulfilled","Cancelled"],default:"Waiting"},
 position:{type:Number,default:1},
 reservedAt:{type:Date,default:Date.now},
 notifiedAt:{type:Date,default:null}
},{timestamps:true});
schema.index({book:1,student:1,status:1});
module.exports=mongoose.model("Reservation",schema);
