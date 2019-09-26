var express = require('express');
var app = express();
var router = express.Router();

function presentDay()
{
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate();

  var date = year + '-' + month + '-' + day;
  return date;
}
//create offers

router.post('/add',function(req,res){

  var offer_name = req.body.name;
  var offer_code = req.body.code;
  var offer_discount = req.body.discount;
  var offer_createdon = presentDay();
  var offer_expiredon = req.body.expiry;
  var offer_addedby = req.body.offer_addedby;

    var offer = {
      offer_name : offer_name,
      offer_code : offer_code,
      offer_discount : offer_discount,
      offer_createdon : offer_createdon,
      offer_expiredon : offer_expiredon,
      offer_addedby : offer_addedby
    };
    if(!(offer_name) || !(offer_code) || !(offer_discount) || !(offer_createdon) || !(offer_expiredon))
    {
      res.send({"status":false, "message": "Please enter the Required fields", "error":'', "results":''});
    }
    else{
      con.query('INSERT into tbl_offers SET ?',offer,function(error, results, fields){
        if(error){
          res.send({"status":false,"message":"error ocurred","error":error,"results":results});
        }else{
          res.send({"status":true,"message":"Offer added successfully","error":error,"results":results}); 
        }
      })
    }
  });

//get all offers

  router.get('/get', function(req,res){
    con.query('select * from tbl_offers', function(error_prget, results_prget, fields_prget){
        if(error_prget){
          res.send({"status":false,"message":"error ocurred","error":error_prget,"results":results_prget});
        }else{
          res.send({"status":true,"message":"Products list","error":error_prget,"results":results_prget});
        }
      })
  });

  //getting single offer

router.get('/get/:id',function(req,res){
    // var pid = req.body.id;
     con.query('SELECT * from tbl_offers where id=?',[req.params.id], function(error_gs,results_gs,fields_gs){
       if(error_gs){
         res.send({"status":false,"message":"error ocurred","error":error_gs,"results":results_gs});
       }else{
         res.send({"status":true,"message":"offers list","error":error_gs,"results":results_gs});
       }
     })
   });

   //update offer

router.put('/update/:id', function(req,res){
    con.query('UPDATE tbl_offers SET offer_name=?, offer_code=?, offer_discount=?, offer_expiredon=? where id=?',[req.body.name, req.body.code, req.body.discount, req.body.expiry, req.params.id],function(error, results, fields){
      console.log("error ocurred",error);
      if(error){
        res.send({"status":false,"message":"error ocurred","error":error,"results":results});
      }else{
        res.send({"status":true,"message":"Offers updated successfully","error":error,"results":results});
      }
    })
});

//delete offer

router.delete('/delete/:id' ,function(req,res){
    var pid = req.params.id;
    con.query('DELETE from tbl_offers where id=?',pid, function(error, results, fields){
      if(error){
        res.send({"status":pid,"message":pid,"error":error,"results":results});
      }else{
        res.send({"status":pid,"message":pid,"error":error,"results":results});
      }
    })
  });

 router.put('/updatestatus/:id', function(req,res){
   var oid = req.params.id;
   con.query('Update tbl_offers set offer_status=? where id=?',[req.body.status, oid],function(error, results, fields){
    if(error){
      res.send({"status":false,"message":"Error","error":error,"results":results});
    }else{
      res.send({"status":true,"message":"Updated","error":error,"results":results});
    }
   });
 }) 

  module.exports = router;
