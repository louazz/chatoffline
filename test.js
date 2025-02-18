const db = require('electron-db');
const fs = require('fs');

const location = "./extraResources/"
/*
const arg = {users: ['1739447609200', "1739447609200"]}

db.getAll("ips", location,async (succ, result)=>{
      const user = arg.user;
      var res = []
      //console.log(result.length)
      for(let i in result){
        //console.log(i)
        if(result[i].users.includes(user)){
          res.push(result[i])
        }
      }
      //console.log(res)
    
  })
db.insertTableContent("ips",location, arg, async (succ, msg)=>{  
      var res = [];
      db.getAll('ips', location, async(succ, result)=>{
        for (let i in result){
          if (result[i].users.includes(arg.users[0])){
            res.push(result[i])
          }
        }
        console.log(res)
      })
    })
*/

const arg = {ip: ["10.81.14.190", "10.81.14.190"], users: ['1739203304744', '1739203304744'], sharedId: "123"}
 db.insertTableContent("conversation", location, arg, async(succ, msg)=>{
      db.getAll("conversation", location, async(succ, result)=>{
        var res = []
        console.log(result)
        for (let i in result){
          const users = result[i].users
          if( arg.users.includes(users[0]) || arg.users.includes(users[1])){
            res.push(result[i])
          }
        }
        console.log(res)
      })
    })