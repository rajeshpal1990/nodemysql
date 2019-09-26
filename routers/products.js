
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

//starting crud for products
//adding products

router.post('/add',function(req, res){
  var prod_catid = req.body.category;
  var prod_name = req.body.name;
  var prod_desc = req.body.desc;
  var prod_img = req.body.path;
  var prod_price = req.body.price;
  var prod_status = req.body.status;
  var prod_createdon = presentDay();
  var prod_brandid = req.body.brand;
  var prod_userid = req.body.prod_userid;
  // var prod_meta_title = req.body.title;
  // var prod_meta_desc = req.body.metaDesc;
  // var prod_meta_keywords = req.body.metakeywords;


  var products = {
    prod_catid : prod_catid,
    prod_name : prod_name,
    prod_desc : prod_desc,
    prod_price : prod_price,
    prod_status : prod_status,
    prod_createdon : prod_createdon,
    prod_brandid : prod_brandid,
    prod_userid : prod_userid,
    prod_img : prod_img
    // prod_meta_title : prod_meta_title,
    // prod_meta_desc : prod_meta_desc,
    // prod_meta_keywords : prod_meta_keywords
  };
  
  //create product list
  if(!(prod_catid) || !(prod_name) || !(prod_desc) || !(prod_price) || !(prod_status)){
        res.send({"status":false, "message": "Please enter the Required fields", "error":'', "results":''});
      }else{
        con.query('INSERT into tbl_products SET ?',products,function(error_prodinrt, results_prodinrt, fields_prodinrt){
          console.log("error ocurred",error_prodinrt);
          if(error_prodinrt){
            res.send({"status":false,"message":"error ocurred","error":error_prodinrt,"results":results_prodinrt});
          }else{
            res.send({"status":true,"message":"Product added successfully","error":error_prodinrt,"results":results_prodinrt});
          }
        })
      }
})

//getting products

//getting all products

router.get('/list/:id',function(req,res){

  var userid = req.params.id;

  console.log(userid);

  if(userid==0)
  {
    var query='select Prod.*,user.first_name,user.last_name from tbl_products Prod, tbl_users user WHERE Prod.prod_userid=user.id';
  }
  else
  {
    var query='select Prod.*,user.first_name,user.last_name from tbl_products Prod, tbl_users user WHERE Prod.prod_userid=user.id AND Prod.prod_userid='+userid;
  }

  con.query(query, function(error_prget, results_prget, fields_prget){
    if(error_prget){
      res.send({"status":false,"message":"error ocurred","error":error_prget,"results":results_prget});
    }else{
      res.send({"status":true,"message":"Products list","error":error_prget,"results":results_prget});
    }
  })
});


router.post('/getlist',function(req,res){

  var listfor= req.body.listfor;
  var id= req.body.id;

  if(listfor=='brand')
  {
    var query='select Prod.*,brand.brand_name,brand.brand_img from tbl_products Prod, tbl_brands brand WHERE Prod.prod_brandid=brand.id AND Prod.prod_brandid='+id;
  }
  else if(listfor=='category')
  {
    var query='select Prod.*,cat.cat_name,cat.cat_img from tbl_products Prod, tbl_categories cat WHERE Prod.prod_catid=cat.id AND Prod.prod_catid='+id;
  }

  con.query(query, function(error_prget, results_prget, fields_prget){
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
  con.query('SELECT * from tbl_products where id=?',[req.params.id], function(error_gs,results_gs,fields_gs){
    if(error_gs){
      res.send({"status":false,"message":"error ocurred","error":error_gs,"results":results_gs});
    }else{
      res.send({"status":true,"message":"product list","error":error_gs,"results":results_gs});
    }
  })
});

//update product

router.put('/update/:id', function(req,res){

    con.query('UPDATE tbl_products SET prod_catid=?, prod_name=?, prod_desc=?, prod_price=?,prod_brandid=?,prod_img=? where id=?',[req.body.category, req.body.name, req.body.desc, req.body.price, req.body.brand,req.body.path, req.params.id],function(error, results, fields){
      console.log("error ocurred",error);
      if(error){
        res.send({"status":false,"message":"error ocurred","error":error,"results":results});
      }else{
        res.send({"status":true,"message":"Product updated successfully","error":error,"results":results});
      }
    })
});

//delete product

router.delete('/delete/:id' ,function(req,res){
  var pid = req.params.id;
  con.query('DELETE from tbl_products where id=?',pid, function(error, results, fields){
    if(error){
      res.send({"status":false,"message":pid,"error":error,"results":results});
    }else{
      res.send({"status":true,"message":pid,"error":error,"results":results});
    }
  })
})

router.put('/updatestatus/:id', function(req,res){
  var pid = req.params.id;
  con.query('UPDATE tbl_products set prod_status=? where id=?', [req.body.status, pid], function(err,results,fields){
    if(err){
      res.send({"status":false,"message":req.body.status,"error":err,"results":results});
    }else{
      res.send({"status":true,"message":req.body.status,"error":err,"results":results});
    }
  })
 // res.send({"status":false,"message":"hello","error":'err',"results":'results'});
});

router.get('/brands', function(req,res){
  con.query('select * from tbl_brands',function(error,results,fields){
    if(error){
      res.send({"status":false,"message":"Error","error":error,"results":results});
    }else{
      res.send({"status":true,"message":"Yipeee!","error":error,"results":results});
    }
  })
});



router.post('/manageaction',function(req,res){

var actiontype= req.body.actiontype;
var colid= req.body.colid;
var updcolstatus= req.body.colstatus;
if(updcolstatus==0)
{
  var updcolstatus2upd=1;
}
else
{
  var updcolstatus2upd=0;
}


  if(actiontype=='view' && colid >0)
  {

      var query=`select Prod.*,cat.cat_name,brand.brand_name,user.first_name,user.last_name FROM tbl_products Prod 
      LEFT JOIN tbl_users user ON Prod.prod_userid=user.id
      LEFT JOIN tbl_categories cat ON Prod.prod_catid=cat.id
      LEFT JOIN tbl_brands brand ON Prod.prod_brandid=brand.id WHERE Prod.id=?`;
      con.query(query,[colid],function(error,results,fields){
      if(error)
      {
        res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
      }
      else
      {
        res.send({"status":true,"message":"","error":error,"results":results});
      }
      
    });

  }
  else if(colid && actiontype)
  {
      
      var queryupd = 'UPDATE tbl_products SET prod_status=? WHERE id=?';
     con.query(queryupd,[updcolstatus2upd,colid],function(error,results,fields){

      if(error)
      {
        res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
      }
      else
      {
        res.send({"status":true,"message":"Product Status Updated","error":error,"results":results});
      }

    });

  }
  else
  {
    res.send({"status":false,"message":"Invalid Request","error":'',"results":''});
  }

   


});



//get zipcode

module.exports = router;