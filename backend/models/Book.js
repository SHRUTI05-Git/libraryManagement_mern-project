const mongoose=require("mongoose");
const schema=new mongoose.Schema({
 title:{type:String,required:true,trim:true},
 author:{type:String,required:true},
 isbn:{type:String,required:true,unique:true},
 category:{type:String,default:"General"},
 publisher:{type:String,default:""},
 year:Number,
 description:{type:String,default:""},
 coverUrl:{type:String,default:""},
 totalCopies:{type:Number,min:1,required:true},
 availableCopies:{type:Number,min:0,required:true}
},{timestamps:true});
module.exports=mongoose.model("Book",schema);
