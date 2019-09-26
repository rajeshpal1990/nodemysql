var express = require('express');
var app = express();
var router = express.Router();

  router.get('/getproducts', function(req,res){
    con.query('select count(*) as products from tbl_products', function(error, results, fields){
        if(error){
          res.send({"status":false,"message":"error ocurred","error":error,"results":results});
        }else{
          res.send({"status":true,"message":"Products list","error":error,"results":results});
        }
      })
  });

  router.get('/getzip', function(req,res){
    con.query('select count(*) as zip from tbl_zipcodes', function(error, results, fields){
        if(error){
          res.send({"status":false,"message":"error ocurred","error":error,"results":results});
        }else{
          res.send({"status":true,"message":"Products list","error":error,"results":results});
        }
      })
  });

  router.get('/getoffers', function(req,res){
    con.query('select count(*) as offers from tbl_offers', function(error, results, fields){
        if(error){
          res.send({"status":false,"message":"error ocurred","error":error,"results":results});
        }else{
          res.send({"status":true,"message":"Products list","error":error,"results":results});
        }
      })
  });

  module.exports = router;
