
var express = require('express');
var app = express();
var router = express.Router();

var slugify = require('slugify');

/* Add the Brand */

router.post('/addbrand', function(req, res){
  
    var brand_parentid = 0;
    var brand_name = req.body.brand_name;
    var brand_desc = req.body.brand_desc;
    var brand_img = req.body.brand_img;

    if(brand_name)
    {
      var brandslug=slugify(brand_name);
    }
    else
    {
      var brandslug="";
    }

    var catinfo={
      "brand_name":brand_name,
      "brand_desc":brand_desc,
      "brand_slug":brandslug,
      "brand_img":brand_img
    }

    /* check for dublicate Brands */

    if(!(brand_name) || !(brand_desc))
    {
      res.send({"status":false,"message":"Please enter the Required fields","error":'',"results":''});
    }
    else
    {

        con.query('SELECT count(brand_name) as cnt_catname FROM tbl_brands WHERE brand_name = ?',[brand_name], function (error, results, fields){
      
      console.log(results);
      var cntcat = results[0]['cnt_catname'];
      if(cntcat==0)
      {
          con.query('INSERT INTO tbl_brands SET ?',catinfo, function (error_inrt, results_inrt, fields_inrt){

          if (error_inrt)
          {
            console.log("error ocurred",error_inrt);
            res.send({"status":false,"message":"error ocurred","error":error_inrt,"results":results_inrt});
          }
          else
          {
            console.log('The solution is: ', results_inrt);

            res.send({"status":true,"message":"Brand has Added succefully!...","error":error_inrt,"results":results_inrt});

            
          }

          });
      }
      else
      {
        res.send({"status":false,"message":"Brand has already Exist.","error":error,"results":results});
      }

     });

    }

});




/* Brands  list */

router.get('/list',function(req,res){
	
	var query='SELECT * from tbl_brands Where (brand_status=? OR brand_status=?)';
	con.query(query,[1,0],function(error,results,fields){
		
		if(error)
		{
			res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
		}
		else
		{
			res.send({"status":true,"message":"list of Brands","error":error,"results":results});
		}
		
	});
	
});





/* Get Single Brand Info */

router.get('/getdata/:id',function(req,res){
  
  var brandid= req.params.id;

  console.log("brandid:"+brandid);
  
  var query='SELECT * from tbl_brands Where id=?';
  con.query(query,[brandid],function(error,results,fields){
    if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"Brands details","error":error,"results":results});
    }
    
  });
  
});


/* Update the Brand info */

router.post('/updateinfo/:id',function(req,res){

  var userid= req.params.id;

  console.log("PUT userid:"+userid);

  var cat_parentid=0;
  var cat_name = req.body.cat_name;
  var cat_desc = req.body.cat_desc;
  var brand_img = req.body.brand_img;


  var updateinfo = {"brand_parentid":cat_parentid,"brand_name":cat_name,"brand_desc":cat_desc,"brand_img":brand_img}

  /* Check for dublicate */

   var chkquery = 'SELECT count(brand_name) as cntcat FROM tbl_brands WHERE brand_name = ? AND id NOT IN(?)';

   con.query(chkquery,[cat_name,userid],function(errorchk,resultschk,fieldschk){

    var cntcat = resultschk[0]['cntcat'];

    if(cntcat==0)
    {

          var queryupd='Update tbl_brands SET ? WHERE id=?';
          con.query(queryupd,[updateinfo,userid],function(error,results,fields){

          if(error)
          {
            res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
          }
          else
          {
            res.send({"status":true,"message":"Brands info  Updated...","error":error,"results":results});
          }
        });

    }
    else
    {
      res.send({"status":false,"message":"This Brands is already Exist..","error":errorchk,"results":''});
    }

    });

  

});


/* for status and delete */

router.post('/manageaction',function(req,res){

var actiontype= req.body.actiontype;
var colid= req.body.colid;
var colstatus= req.body.colstatus;
if(colstatus==1)
{
  var updcolstatus =0;
}
else
{
  var updcolstatus =1;
}

if(actiontype=='delete' && colid >0)
{
  var querydel = 'DELETE FROM tbl_brands WHERE id=?';
  con.query(querydel,[colid],function(error,results,fields){

    if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"Brands deleted succefully","error":error,"results":results});
    }

  });

}
else if(updcolstatus && colid && actiontype)
{
   var queryupd = 'UPDATE tbl_brands SET brand_status=? WHERE id=?';
   con.query(queryupd,[updcolstatus,colid],function(error,results,fields){

    if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"Brands Status Updated","error":error,"results":results});
    }

  });

}
else
{
  res.send({"status":false,"message":"Invalid Request","error":'',"results":''});
}


});




module.exports = router;