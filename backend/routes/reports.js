const router=require("express").Router();
const PDFDocument=require("pdfkit"),Book=require("../models/Book"),Transaction=require("../models/Transaction");
const auth=require("../middleware/auth"),roles=require("../middleware/roles");
function pdf(res,title,rows){
 const doc=new PDFDocument({margin:45});res.setHeader("Content-Type","application/pdf");res.setHeader("Content-Disposition",`attachment; filename="${title.replace(/\s/g,"_")}.pdf"`);doc.pipe(res);
 doc.fontSize(20).text(title,{align:"center"});doc.moveDown();doc.fontSize(9).fillColor("#555").text(`Generated: ${new Date().toLocaleString()}`);doc.moveDown();
 rows.forEach((r,i)=>{doc.fillColor("#111").fontSize(11).text(`${i+1}. ${r}`);doc.moveDown(.45)});
 doc.end();
}
router.get("/books",auth,roles("admin"),async(req,res)=>{
 const books=await Book.find().sort({title:1});pdf(res,"Library_Book_Catalogue",books.map(b=>`${b.title} | ${b.author} | ${b.isbn} | ${b.category} | ${b.availableCopies}/${b.totalCopies} available`));
});
router.get("/transactions",auth,roles("admin"),async(req,res)=>{
 const ts=await Transaction.find().populate("book","title").populate("student","name studentId").sort({createdAt:-1});
 pdf(res,"Library_Transaction_Report",ts.map(t=>`${t.book?.title||"Book"} | ${t.student?.name||"Student"} (${t.student?.studentId||""}) | ${t.status} | Fine ₹${t.fine} | ${t.finePaid?"Paid":"Unpaid"}`));
});
module.exports=router;
