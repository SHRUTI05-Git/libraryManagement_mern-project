require("dotenv").config();
const bcrypt=require("bcryptjs"),mongoose=require("mongoose"),connect=require("./config/db");
const User=require("./models/User"),Book=require("./models/Book"),Transaction=require("./models/Transaction"),Reservation=require("./models/Reservation");
(async()=>{
 await connect();await Promise.all([User.deleteMany(),Book.deleteMany(),Transaction.deleteMany(),Reservation.deleteMany()]);
 const password=(p)=>bcrypt.hash(p,10);
 const admin=await User.create({name:"Library Administrator",email:"admin@libracore.com",password:await password("Admin@123"),role:"admin",department:"Library"});
 const students=await User.create([
  {name:"Aarav Patil",email:"student1@libracore.com",password:await password("Student@123"),role:"student",studentId:"CSE001",department:"Computer Science",phone:"9876543210"},
  {name:"Ananya Kulkarni",email:"student2@libracore.com",password:await password("Student@123"),role:"student",studentId:"CSE002",department:"Computer Science",phone:"9876543211"},
  {name:"Rohan Deshmukh",email:"student3@libracore.com",password:await password("Student@123"),role:"student",studentId:"CSE003",department:"Information Technology",phone:"9876543212"}
 ]);
 const books=await Book.create([
  {title:"Clean Code",author:"Robert C. Martin",isbn:"9780132350884",category:"Programming",publisher:"Prentice Hall",year:2008,totalCopies:5,availableCopies:4,description:"A practical guide to writing maintainable software."},
  {title:"The Pragmatic Programmer",author:"Andrew Hunt",isbn:"9780135957059",category:"Programming",publisher:"Addison-Wesley",year:2019,totalCopies:4,availableCopies:4},
  {title:"Design Patterns",author:"Erich Gamma",isbn:"9780201633610",category:"Software Engineering",publisher:"Addison-Wesley",year:1994,totalCopies:3,availableCopies:2},
  {title:"Introduction to Algorithms",author:"Thomas H. Cormen",isbn:"9780262046305",category:"Algorithms",publisher:"MIT Press",year:2022,totalCopies:6,availableCopies:6},
  {title:"Database System Concepts",author:"Abraham Silberschatz",isbn:"9780078022159",category:"Database",publisher:"McGraw-Hill",year:2019,totalCopies:4,availableCopies:3},
  {title:"Artificial Intelligence: A Modern Approach",author:"Stuart Russell",isbn:"9780134610993",category:"AI",publisher:"Pearson",year:2021,totalCopies:5,availableCopies:5}
 ]);
 await Transaction.create({book:books[0]._id,student:students[0]._id,dueDate:new Date(Date.now()+7*86400000)});
 await Transaction.create({book:books[2]._id,student:students[1]._id,dueDate:new Date(Date.now()-3*86400000)});
 books[0].availableCopies=4;books[2].availableCopies=2;await books[0].save();await books[2].save();
 await Reservation.create({book:books[1]._id,student:students[2]._id,status:"Waiting",position:1});
 console.log("Seed completed.");process.exit();
})();
