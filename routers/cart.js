var express = require('express');
var app = express();
var router = express.Router();

var slugify = require('slugify');

function presentDay(type)
{
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate();

  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();

  if(type=='date')
  {
    var date = year + '-' + month + '-' + day;
  }
  else
  {
    var date = year + '-' + month + '-' + day + ' '+h+':'+m+':'+s;
  }
  
  return date;
}


/* addtocart */

router.post('/addcart',function(req,res)
{
    var user_id = req.body.userId;
    var prod_id = req.body.prodId;
    var cart_qty = req.body.cart_qty;
    if(!cart_qty)
    {
      var cart_qty =1;
    }

    var cart_info = {
        cart_user_id : user_id,
        cart_prod_id : prod_id,
        cart_qty : cart_qty,
        dt_prod_added : presentDay('date')
    }
    
    if(!(user_id) || !(prod_id))
    {
        res.send({"status":false, "message": "Please enter the Required fields", "error":'', "results":''});
    }
    else
    {
         var query = "select cart_prod_id from tbl_user_cart where cart_user_id=? AND cart_prod_id=?";
         con.query(query,[user_id,prod_id],function(err,resu,field){
            if(err){
                res.send({"status":false,"message":"error ocurred","error":err,"results":resu});
              }else{
                  if(resu.length < 1)
                  {
                    con.query('INSERT into tbl_user_cart SET ?', cart_info, function(error,results,fields){
                        if(error){
                            res.send({"status":false,"message":"error ocurred","error":error,"results":results});
                          }else{
                            res.send({"status":true,"message":"Product added successfully to cart","error":error,"results":results});
                          }
                    })
                  }
                  else{
                    res.send({"status":true,"message":"Product already available in cart","error":err,"results":resu});
                }
              }
         })
    } 
});


/* Get Cart detail  */

router.get('/getcart/:id', function(req,res)
{
  var uid = req.params.id;
  var query = "select a.cart_prod_id,a.cart_qty, b.prod_name, b.prod_desc, b.prod_img, b.prod_price, c.brand_name, c.brand_slug, c.brand_desc, c.brand_img from tbl_user_cart as a INNER JOIN tbl_products as b ON (a.cart_prod_id = b.id) INNER JOIN tbl_brands as c ON (b.prod_brandid = c.id) where a.cart_user_id="+uid;
  con.query(query,function(error,results,fields){
    if(error)
    {
        res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else{
        res.send({"status":true,"message":"list of cart","error":error,"results":results});
    }
  })
})


/* Delete from cart */

router.post('/deletecart',function(req,res){
    var user_id = req.body.userId;
    var prod_id = req.body.prodId;

    if(!(user_id) || !(prod_id)){
        res.send({"status":false, "message": "Please enter the Required fields", "error":'', "results":''});
    }
    else{
        var query = "DELETE from tbl_user_cart where cart_user_id=? AND cart_prod_id=?";
        con.query(query, [user_id,prod_id], function(error,results,fields){
            if(error){
                res.send({"status":false,"message":"error ocurred","error":error,"results":results});
              }else{
                res.send({"status":true,"message":"Product deleted successfully from cart","error":error,"results":results});
              }
        })
    } 
});


/* Update cart data */


router.post('/update_cart',function(req,res){
    var user_id = req.body.userId;
    var cart_data = req.body.cart_data;

    if(!(user_id) || (cart_data.length==0))
    {
        res.send({"status":false, "message": "Invalid Request...", "error":'', "results":''});
    }
    else
    {
       var cartlen = cart_data.length;
       
       var errorlist='';
       for(var i=0; i<cartlen;i++)
       {
          var prod_id = cart_data[i]['prod_id'];
          var prod_qty = cart_data[i]['qty'];
          var updateinfo = {"cart_qty":prod_qty}

          console.log(prod_qty);

           var queryupd='Update tbl_user_cart SET ? WHERE (cart_prod_id=? AND cart_user_id=?)';
          con.query(queryupd,[updateinfo,prod_id,user_id],function(error,results,fields){

          if(error)
          {
            errorlist =error;
          }
          else
          {
            
          }

        });

       }
       if(errorlist)
       {
         res.send({"status":false,"message":"Error Occured","error":errorlist,"results":''});
       }
       else
       {
         res.send({"status":true,"message":"Cart  Updated...","error":'',"results":''});
       }
       

    } 
});


/* Go to checkout */


router.post('/create_order',function(req,res)
{
    var user_id = req.body.userId;
    var price = req.body.price;
    var Currency = req.body.Currency;
    var payment_mode = req.body.payment_mode;
    var address = req.body.bill_address;
    var city = req.body.bill_city;
    var postcode = req.body.bill_postcode;
    var state = req.body.bill_state;
    var country = req.body.bill_country;

    var ship_address = req.body.ship_address;
    var ship_city = req.body.ship_city;
    var ship_postcode = req.body.ship_postcode;
    var ship_state = req.body.ship_state;
    var ship_country = req.body.ship_country;


    /* Braintree response data start */

    var transaction_id = req.body.transaction_id;
    var pay_amount = req.body.pay_amount;
    var payment_id = req.body.payment_id;
    var payment_status = req.body.payment_status; /* 0=>failed , 1=>Success , 3=>Cancel , 4 => Pending */
    var payment_method = 'paypal';
    var payment_date = presentDay('datetime');
    var payment_message = req.body.payment_message;
    var tokenid = req.body.tokenid;
    var payerId = req.body.payerId;
    var payment_type = 'instant';


    /* Braintree response data end  */


    if(address && city && postcode && state && country)
    {
      var billing_address = address+','+city+','+state+','+postcode+','+country;
    }
    else
    {
       var billing_address='';
    }

    if(ship_address && ship_city && ship_postcode && ship_state && ship_country)
    {
      var shipping_address = ship_address+','+ship_city+','+ship_state+','+ship_postcode+','+ship_country;
    }
    else
    {
       var shipping_address=billing_address;
    }

    var cart_info = {
        userid : user_id,
        price : price,
        Currency : Currency,
        payment_mode : payment_mode,
        address : address,
        city : city,
        postcode : postcode,
        state : state,
        country : country,
        billing_address : billing_address,
        shipping_address : shipping_address,
        createdon : presentDay('datetime')
    }
    
    if(!(user_id) || !(price) || !(Currency) || !(payment_mode) || !(address) || !(city) || !(postcode) || !(state) || !(country))
    {
        res.send({"status":false, "message": "Please enter the Required fields", "error":'', "results":''});
    }
    else
    {
         
                /* check the cart data */

                var chkquery = 'SELECT count(cart_prod_id) as cntcart FROM  tbl_user_cart WHERE cart_user_id = ?';

                 con.query(chkquery,[user_id],function(errorchk,resultschk,fieldschk){


                  var cntcart = resultschk[0]['cntcart'];

                  if(cntcart >0)
                  {
                      
                        con.query('INSERT into tbl_orders SET ?', cart_info, function(error,results,fields){
                        if(error){
                            res.send({"status":false,"message":"error ocurred","error":error,"results":results});
                          }
                          else
                          {

                            if(results)
                            {
                                
                                /* Update Order number */

                                console.log(results);

                                var orderid = results.insertId;
                                console.log(orderid);
                                var ordernumber = 'BODYSCAN'+String("00000" + orderid).slice(-5); 
                                if(payment_status==0)
                                {
                                  var order_sts = 0;
                                }
                                else if(payment_status==3)
                                {
                                  var order_sts = 0;
                                }
                                else
                                {
                                   var order_sts = 1;
                                }
                                var updateinfo = {"order_number":ordernumber,"status":order_sts}
                                var queryupd='Update tbl_orders SET ? WHERE id=?';
                                con.query(queryupd,[updateinfo,orderid],function(error,results,fields){

                                if(error)
                                {
                                  res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
                                }
                                else
                                {
                                    /* Insert data into order table */ 

                                  var query = "select a.cart_prod_id,a.cart_qty, b.prod_name, b.prod_desc, b.prod_img, b.prod_price, c.brand_name, c.brand_slug, c.brand_desc, c.brand_img from tbl_user_cart as a INNER JOIN tbl_products as b ON (a.cart_prod_id = b.id) INNER JOIN tbl_brands as c ON (b.prod_brandid = c.id) where a.cart_user_id="+user_id;
                                  con.query(query,function(error,results,fields){
                                    if(error)
                                    {
                                        res.send({"status":false,"message":"Error ocurred while getting product info from cart ","error":error,"results":''});
                                    }
                                    else
                                    {
                                         var prodlen = results.length;

                                         var orderinfo=[];

                                         for(var i=0; i<prodlen; i++)
                                         {

                                            /* Insert into order info */

                                            var userid = user_id;
                                            var productid = results[i]['cart_prod_id'];;
                                            var Product_name = results[i]['prod_name'];
                                            var prod_img = results[i]['prod_img'];
                                            var product_amount = results[i]['prod_price'];
                                            var product_qty = results[i]['cart_qty'];
                                            var total_amount = product_amount * product_qty;
                                            var addeddate = presentDay('datetime');
                                            order_info=[userid,orderid,productid,Product_name,prod_img,product_amount,product_qty,total_amount,addeddate];
                                            orderinfo.push(order_info);

                                         }

                                            con.query('INSERT into tbl_orderinfo (userid,orderid,productid,Product_name,product_img,product_amount,product_qty,total_amount,createdon) VALUES ?', [orderinfo], function(error,results,fields){
                                            if(error)
                                            {
                                              res.send({"status":true,"message":"Error Occured","error":error,"results":results});
                                            }
                                            else
                                            {
                                                
                                                 


                                                 /* insert payment history */

                                                var paymentinfo={
                                                    "order_id":orderid,
                                                    "payment_by":user_id,
                                                    "pay_amount":pay_amount,
                                                    "pay_currency":Currency,
                                                    "transaction_id":transaction_id,
                                                    "payment_id":payment_id,
                                                    "payment_status":payment_status,
                                                    "payment_method":payment_method,
                                                    "payment_date":payment_date,
                                                    "payment_message":payment_message,
                                                    "tokenid":tokenid,
                                                    "payerId":payerId,
                                                    "payment_type":payment_type,
                                                  }


                                                   con.query('SELECT count(order_id) as cnt_order_id FROM tbl_payments WHERE order_id = ?',[orderid], function (error, results, fields){
                                                  console.log(results[0]['cnt_order_id']);
                                                  var cntcat = results[0]['cnt_order_id'];
                                                  if(cntcat==0)
                                                  {
                                                      con.query('INSERT INTO tbl_payments SET ?',paymentinfo, function (error_inrt, results_inrt, fields_inrt){

                                                      if (error_inrt)
                                                      {
                                                        console.log("error ocurred",error_inrt);
                                                        res.send({"status":false,"message":"error ocurred","error":error_inrt,"results":results_inrt});
                                                      }
                                                      else
                                                      {
                                                        console.log('The solution is: ', results_inrt);

                                                        /* delete the cart data */

                                                       var querydel = "DELETE from tbl_user_cart where cart_user_id=?";
                                                         con.query(querydel, [user_id], function(error,results,fields){
                                                       });

                                                        res.send({"status":true,"message":"Payment has Done succefully !...","error":error_inrt,"results":results_inrt});

                                                        
                                                      }

                                                      });
                                                  }
                                                  else
                                                  {
                                                    res.send({"status":false,"message":"Payment has already made for this order","error":error,"results":results});
                                                  }

                                                 });


                                                
                                            }

                                          });
                                    }

                                  })


                                }

                              });

                            }
                            
                          }
                    });

                  }
                  else
                  {
                    res.send({"status":false,"message":"Your Cart is Empty Now...","error":errorchk,"results":''});
                  }


                 });      

    } 


});




module.exports = router;