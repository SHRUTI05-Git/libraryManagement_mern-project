exports.calculateFine=function(dueDate,returnDate=new Date()){
 const due=new Date(dueDate),ret=new Date(returnDate);
 const grace=0;
 const ms=Math.max(0,ret-due);
 const days=Math.ceil(ms/(1000*60*60*24));
 const billable=Math.max(0,days-grace);
 return billable*Number(process.env.FINE_PER_DAY||5);
};
