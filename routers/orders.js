
var express = require('express');
var app = express();
var router = express.Router();
var Promise = require("bluebird");
var mysql = require('promise-mysql');


/* Orders  list */


router.get('/orderlist',function(req,res){

 var userid= req.query.user;
  if(userid > 0)
  {
    var strquery=' AND ord.userid='+userid;
  }
  else
  {
     var strquery='';
  }

   var queryString='SELECT ord.*,user.first_name,user.last_name,user.email from tbl_orders ord,tbl_users user WHERE ord.userid=user.id'+strquery;


    Promise.map(con.query(queryString), function(item) {
        return Promise.all([
            con.query('SELECT * FROM tbl_orderinfo WHERE orderid='+item.id).then(function(local) {
                 item.products = local;
            })
        ]).then(function() {
            // make the return value from `Promise.all()` be the item
            // we were iterating
            return item;
        });
    }).then(function(results) {
        // array of results here
        //console.log(results);
        res.send({"status":true,"message":"list of orders","error":'',"results":results});
    }).catch(function(err) {
        // error here
         res.send({"status":true,"message":"Error occured","error":err,"results":''});
    });

});




router.get('/list',function(req,res){

	var userid= req.query.user;
  if(userid > 0)
  {
    var strquery=' AND ord.userid='+userid;
  }
  else
  {
     var strquery='';
  }

	var query='SELECT ord.*,user.first_name,user.last_name,user.email from tbl_orders ord,tbl_users user WHERE ord.userid=user.id'+strquery;
	con.query(query,function(error,results,fields){

		if(error)
		{
			res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
		}
		else
		{
			res.send({"status":true,"message":"list of orders","error":error,"results":results});
		}

	});

});

router.get('/list/retailers',function(req,res){

  var userid= req.query.user;
  if(userid > 0)
  {
    var strquery=` AND FIND_IN_SET(`+userid+`,ord.retailer_ids);`
  }
  else
  {
     var strquery='';
  }

  var query='SELECT ord.*,user.first_name,user.last_name,user.email from tbl_orders ord,tbl_users user WHERE ord.userid=user.id'+strquery;
  con.query(query,function(error,results,fields){

    if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"list of retailers","error":error,"results":results});
    }

  });

});

router.post('/retailers/manageaction',function(req,res){

var actiontype= req.body.actiontype;
var colid= req.body.colid;
var updcolstatus= req.body.colstatus;
var retailerid= req.body.retailerid;


  if(actiontype=='view' && colid >0 && retailerid > 0)
  {

      var query=`select ord.order_number,ord.price,ord.Currency,ord.billing_address,ord.shipping_address,ordinfo.Product_name,ordinfo.product_amount,ordinfo.product_qty,ordinfo.total_amount,user.first_name,user.last_name,user.email,payment.pay_amount,payment.transaction_id,payment.payment_status,payment.payment_method,payment.payment_date
       FROM tbl_orderinfo ordinfo
       LEFT JOIN tbl_payments payment ON ordinfo.orderid=payment.order_id
       LEFT JOIN tbl_users user ON ordinfo.userid=user.id
       LEFT JOIN tbl_orders ord ON ordinfo.orderid=ord.id
       JOIN tbl_products prod ON ordinfo.productid=prod.id AND prod.prod_userid=?
       WHERE ord.id=?`;
       console.log(query);
      con.query(query,[retailerid,colid],function(error,results,fields){
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
  else
  {
     res.send({"status":false,"message":"Invalid Request","error":'',"results":''});
  }


});


/* for status and delete */

router.post('/manageaction',function(req,res){

var actiontype= req.body.actiontype;
var colid= req.body.colid;
var updcolstatus= req.body.colstatus;


  if(actiontype=='view' && colid >0)
  {

      var query=`select ord.order_number,ord.price,ord.Currency,ord.billing_address,ord.shipping_address,ordinfo.Product_name,ordinfo.product_amount,ordinfo.product_qty,ordinfo.total_amount,user.first_name,user.last_name,user.email,payment.pay_amount,payment.transaction_id,payment.payment_status,payment.payment_method,payment.payment_date
       FROM tbl_orderinfo ordinfo
       LEFT JOIN tbl_payments payment ON ordinfo.orderid=payment.order_id
       LEFT JOIN tbl_users user ON ordinfo.userid=user.id
       LEFT JOIN tbl_orders ord ON ordinfo.orderid=ord.id WHERE ord.id=?`;
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
      var queryupd = 'UPDATE tbl_orders SET status=? WHERE id=?';
     con.query(queryupd,[updcolstatus,colid],function(error,results,fields){

      if(error)
      {
        res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
      }
      else
      {
        res.send({"status":true,"message":"Order Status Updated","error":error,"results":results});
      }

    });
  }
  else
  {
     res.send({"status":false,"message":"Invalid Request","error":'',"results":''});
  }


});


router.get('/transactions',function(req,res){

  var userid= req.query.user;
  if(userid > 0)
  {
    var strquery=' AND ord.userid='+userid;
  }
  else
  {
     var strquery='';
  }

  var query='SELECT payment.*,ord.order_number,user.first_name,user.last_name,user.email from tbl_orders ord,tbl_users user, tbl_payments payment WHERE ord.userid=user.id AND payment.order_id=ord.id'+strquery;
  con.query(query,function(error,results,fields){

    if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"list of retailers","error":error,"results":results});
    }

  });

});


module.exports = router;
