const db = require("../db.js");




// find by id user


   



  

// up date users





const deleteUser = function(id, result){
    db.query("DELETE FROM users WHERE id = ?", [id], function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(null, err);
    }
    else{
      result(null, res);
    }
    });
    };
    
   
   module.exports={deleteUser}