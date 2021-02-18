var cron = require('node-cron');
 
//  For more informations, please visit this link  
//  Link : https://www.npmjs.com/package/node-cron

cron.schedule('*/2 * * * *', () => {
  // your code here ....
  console.log('running a task every two minutes');
});