var express = require('express');
var app = express();
var router = express.Router();

  router.put('/update', function(req,res){
    con.query('Update tbl_settings set Title=?, meta_title=?, meta_desc=?, meta_keywords=? where owner=?',[req.body.name, req.body.title, req.body.desc, req.body.key, 2], function(error, results, fields){
        if(error){
          res.send({"status":false,"message":"error ocurred","error":error,"results":results});
        }else{
          res.send({"status":true,"message":"Updated Successfully","error":error,"results":results});
        }
      })
  });

  router.get('/get', function(req,res){
    con.query('select * from tbl_settings where owner=?',[2], function(error, results, fields){
        if(error){
          res.send({"status":false,"message":"error ocurred","error":error,"results":results});
        }else{
          res.send({"status":true,"message":"Products list","error":error,"results":results});
        }
      })
  });

  module.exports = router;
