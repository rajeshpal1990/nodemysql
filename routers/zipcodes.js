var express = require('express');
var app = express();
var router = express.Router();

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function presentDay()
{
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate();

  var date = year + '-' + month + '-' + day;
  return date;
}



router.post('/add',function(req,res){
  var zip_address = req.body.addr;
  var zip_postcode = req.body.code;
  var zip_addedby = req.body.zip_addedby;
  var zip_createdon = presentDay();

    var zip = {
      zip_address : zip_address,
      zip_postcode : zip_postcode,
      zip_addedby : zip_addedby,
      zip_createdon : zip_createdon
    };
    if(!(zip_address) || !(zip_postcode))
    {
      res.send({"status":false, "message": "Please enter the Required fields", "error":'', "results":''});
    }
    else{
      con.query('INSERT into tbl_zipcodes SET ?',zip,function(error, results, fields){
        if(error){
          res.send({"status":false,"message":"error ocurred","error":error,"results":results});
        }else{
          res.send({"status":true,"message":"zip added successfully","error":error,"results":results}); 
        }
      })
    }
  });

//get all products

  router.get('/get', function(req,res){
    con.query('select * from tbl_zipcodes', function(error_prget, results_prget, fields_prget){
        if(error_prget){
          res.send({"status":false,"message":"error ocurred","error":error_prget,"results":results_prget});
        }else{
          res.send({"status":true,"message":"Products list","error":error_prget,"results":results_prget});
        }
      })
  });

  //getting single product

router.get('/get/:id',function(req,res){
    // var pid = req.body.id;
     con.query('SELECT * from tbl_zipcodes where id=?',[req.params.id], function(error_gs,results_gs,fields_gs){
       if(error_gs){
         res.send({"status":false,"message":"error ocurred","error":error_gs,"results":results_gs});
       }else{
         res.send({"status":true,"message":"product list","error":error_gs,"results":results_gs});
       }
     })
   });

   //update product

router.put('/update/:id', function(req,res){
    con.query('UPDATE tbl_zipcodes SET zip_address=?, zip_postcode=? where id=?',[req.body.addr, req.body.code, req.params.id],function(error, results, fields){
      console.log("error ocurred",error);
      if(error){
        res.send({"status":false,"message":"error ocurred","error":error,"results":results});
      }else{
        res.send({"status":true,"message":"Zip code updated successfully","error":error,"results":results});
      }
    })
});

//delete zipcodes

router.delete('/delete/:id' ,function(req,res){
    var pid = req.params.id;
    con.query('DELETE from tbl_zipcodes where id=?',pid, function(error, results, fields){
      if(error){
        res.send({"status":pid,"message":pid,"error":error,"results":results});
      }else{
        res.send({"status":pid,"message":pid,"error":error,"results":results});
      }
    })
  });

  router.put('/updatestatus/:id', function(req,res){
    var zid = req.params.id;
    con.query("update tbl_zipcodes set zip_status=? where id=?",[req.body.status,zid],function(error, results, fields){
      if(error){
        res.send({"status":zid,"message":"Error","error":error,"results":results});
      }else{
        res.send({"status":zid,"message":"Updated","error":error,"results":results});
      }
    })
  })

  module.exports = router;