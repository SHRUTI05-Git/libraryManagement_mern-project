const nodemailer=require("nodemailer");
function configured(){return process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS}
async function sendEmail({to,subject,text,html}){
 if(!configured()){console.log(`[EMAIL MOCK] To: ${to} | ${subject}`);return}
 const transporter=nodemailer.createTransport({
  host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),
  secure:Number(process.env.SMTP_PORT||587)===465,
  auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}
 });
 await transporter.sendMail({from:process.env.MAIL_FROM||process.env.SMTP_USER,to,subject,text,html});
}
exports.issueEmail=(student,book,due)=>sendEmail({
 to:student.email,subject:`Book issued: ${book.title}`,
 text:`Hello ${student.name}, "${book.title}" has been issued to you. Due date: ${new Date(due).toLocaleDateString()}.`,
 html:`<h2>Book issued</h2><p>Hello ${student.name},</p><p><b>${book.title}</b> is issued to you.</p><p>Due: ${new Date(due).toLocaleDateString()}</p>`
});
exports.returnEmail=(student,book,fine)=>sendEmail({
 to:student.email,subject:`Book returned: ${book.title}`,
 text:`${book.title} was returned. Fine: ₹${fine}.`,
 html:`<h2>Return confirmation</h2><p>${book.title} was returned.</p><p>Fine: ₹${fine}</p>`
});
exports.reservationEmail=(student,book)=>sendEmail({
 to:student.email,subject:`Reservation ready: ${book.title}`,
 text:`Your reserved book "${book.title}" is now available.`,
 html:`<h2>Reservation ready</h2><p>Your reserved book <b>${book.title}</b> is now available.</p>`
});
