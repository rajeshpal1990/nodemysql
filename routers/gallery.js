var express = require('express');
var app = express();
var router = express.Router();


//Inserting image to gallery per product

router.post('/add',function(req,res){
    var pid = req.body.prod_id;
    var image_name  = req.body.txt_image_name;
    var path  = req.body.path;

    var img = image_name.split(',');

    for(var i=0; i<img.length; i++)
    {
      con.query("INSERT into tbl_prod_image SET ?", {int_prod_id : pid, txt_image_name	: img[i], path:path}, function(err,res,fields){                
      })
    }
    res.send({"status":true,"message":"Images Uploaded successfully"});
})

// getting all images from gallery

router.get('/get',function(req,res){
    var pid = req.params.id;
     con.query('SELECT * from tbl_prod_image', function(error_gs,results_gs,fields_gs){
       if(error_gs){
         res.send({"status":false,"message":"Error occured","error":error_gs,"results":results_gs});
       }else{
         res.send({"status":true,"message":"Get all images","error":error_gs,"results":results_gs});
       }
     })
   });

//images of single product

router.get('/get/:id',function(req,res){
    var pid = req.params.id;
     con.query('SELECT t1.*, t2.prod_name from tbl_prod_image as t1 INNER JOIN tbl_products as t2 ON (t1.int_prod_id = t2.id) where t1.int_prod_id=?',[req.params.id], function(error_gs,results_gs,fields_gs){
       if(error_gs){
         res.send({"status":false,"message":"Error occurred","error":error_gs,"results":results_gs});
       }else{
         res.send({"status":true,"message":"get single image","error":error_gs,"results":results_gs});
       }
     })
   });

//deleting image

router.delete('/delete/:id',function(req,res){
     con.query('DELETE from tbl_prod_image where int_img_id=?',[req.params.id], function(error_gs,results_gs,fields_gs){
       if(error_gs){
         res.send({"status":false,"message":"Error occurred","error":error_gs,"results":results_gs});
       }else{
         res.send({"status":true,"message":"Image deleted successfully!","error":error_gs,"results":results_gs});
       }
     })
   });


module.exports = router;
