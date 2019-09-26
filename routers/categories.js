
var express = require('express');
var app = express();
var router = express.Router();

var slugify = require('slugify');

/* Add the category */

router.post('/addcategory', function(req, res){
  
    var cat_parentid = req.body.cat_parentid;
    var cat_name = req.body.cat_name;
    var cat_desc = req.body.cat_desc;
    var cat_img = req.body.cat_img;

    if(cat_name)
    {
      var catslug=slugify(cat_name);
    }
    else
    {
      var catslug="";
    }

    var catinfo={
      "cat_parentid":req.body.cat_parentid,
      "cat_name":cat_name,
      "cat_desc":cat_desc,
      "cat_slug":catslug,
      "cat_img":cat_img
    }

    /* check for dublicate Category */

    if(!(cat_name) || !(cat_desc))
    {
      res.send({"status":false,"message":"Please enter the Required fields","error":'',"results":''});
    }
    else
    {

        con.query('SELECT count(cat_name) as cnt_catname FROM tbl_categories WHERE cat_name = ?',[cat_name], function (error, results, fields){
      
      console.log(results[0]['cnt_catname']);
      var cntcat = results[0]['cnt_catname'];
      if(cntcat==0)
      {
          con.query('INSERT INTO tbl_categories SET ?',catinfo, function (error_inrt, results_inrt, fields_inrt){

          if (error_inrt)
          {
            console.log("error ocurred",error_inrt);
            res.send({"status":false,"message":"error ocurred","error":error_inrt,"results":results_inrt});
          }
          else
          {
            console.log('The solution is: ', results_inrt);

            res.send({"status":true,"message":"Category has Added succefully!...","error":error_inrt,"results":results_inrt});

            
          }

          });
      }
      else
      {
        res.send({"status":false,"message":"Category has already Exist.","error":error,"results":results});
      }

     });

    }

});




/* Category  list */

router.get('/categories/:parenttype',function(req,res){
	
  var parenttype= req.params.parenttype;
  if(parenttype=='all')
  {
    var query='SELECT * from tbl_categories Where (cat_status=? OR cat_status=?)';
  }
  else
  {
    var query='SELECT * from tbl_categories Where (cat_status=? OR cat_status=?) AND (cat_parentid='+parenttype+')';
  }
	
	con.query(query,[1,0],function(error,results,fields){
		
		if(error)
		{
			res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
		}
		else
		{
			res.send({"status":true,"message":"list of Category","error":error,"results":results});
		}
		
	});
	
});


router.get('/list/brand/:id',function(req,res){
  
  var brandid= req.params.id;

  var query='SELECT cat.* from tbl_categories cat, tbl_products prod Where (cat.cat_status=?) AND (prod.prod_catid=cat.id AND prod.prod_brandid=?) GROUP BY prod.prod_catid';
  con.query(query,[1,brandid],function(error,results,fields){
    
    if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"list of category by brand id","error":error,"results":results});
    }
    
  });
  
});


/* Get Single Category Info */

router.get('/getdata/:id',function(req,res){
  
  var catid= req.params.id;

  console.log("catid:"+catid);
  
  var query='SELECT * from tbl_categories Where id=?';
  con.query(query,[catid],function(error,results,fields){
    if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"Category details","error":error,"results":results});
    }
    
  });
  
});


/* Update the Category info */

router.post('/updateinfo/:id',function(req,res){

  var userid= req.params.id;

  console.log("PUT userid:"+userid);

  var cat_parentid= req.body.cat_parentid;
  var cat_name = req.body.cat_name;
  var cat_desc = req.body.cat_desc;
  var cat_img = req.body.cat_img;

  var updateinfo = {"cat_parentid":cat_parentid,"cat_name":cat_name,"cat_desc":cat_desc,"cat_img":cat_img}

  /* Check for dublicate */

   var chkquery = 'SELECT count(cat_name) as cntcat FROM tbl_categories WHERE cat_name = ? AND id NOT IN(?)';

   con.query(chkquery,[cat_name,userid],function(errorchk,resultschk,fieldschk){

    var cntcat = resultschk[0]['cntcat'];

    if(cntcat==0)
    {

          var queryupd='Update tbl_categories SET ? WHERE id=?';
          con.query(queryupd,[updateinfo,userid],function(error,results,fields){

          if(error)
          {
            res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
          }
          else
          {
            res.send({"status":true,"message":"Category info  Updated...","error":error,"results":results});
          }
        });

    }
    else
    {
      res.send({"status":false,"message":"This Category is already Exist..","error":errorchk,"results":''});
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
  var querydel = 'DELETE FROM tbl_categories WHERE id=?';
  con.query(querydel,[colid],function(error,results,fields){

    if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"Category deleted succefully","error":error,"results":results});
    }

  });

}
else if(colid && actiontype)
{
   var queryupd = 'UPDATE tbl_categories SET cat_status=? WHERE id=?';
   con.query(queryupd,[updcolstatus,colid],function(error,results,fields){

    if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"Category Status Updated","error":error,"results":results});
    }

  });

}
else
{
   res.send({"status":false,"message":"Invalid Request","error":'',"results":''});
}


});




module.exports = router;