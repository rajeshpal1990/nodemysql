
var express = require('express');
var app = express();
var router = express.Router();

var md5 = require('md5');
var generator = require('generate-password');
  
/* login user*/

router.post('/login', function(req, res){

  var email= req.body.email;
  var password = req.body.password;
  var user_type = req.body.user_type;

  if(!(email) || !(password))
  {
    res.send({"status":false,"message":"Please enter the email and password","error":'',"results":''});
  }
  else
  {

    con.query('SELECT * FROM tbl_users WHERE (email = ? AND user_type=?)',[email,user_type], function (error, results, fields) {
    if (error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":results});
    }
    else
    {
      if(results.length >0)
      {
        if(results[0].password == md5(password))
        {
          if(results[0].status ==0)
          {
            res.send({"status":false,"message":"Sorry! Your Profile is disabled....","error":error,"results":''});
          }
          else
          {
            res.send({"status":true,"message":"Welcome! you have Login succefully...","error":error,"results":results});
          }
          
        }
        else
        {
          res.send({"status":false,"message":"Email and password does not match","error":error,"results":''});
        }
      }
      else
      {
         res.send({"status":false,"message":"Sorry! you don`t have permission to access this panel..","error":error,"results":results});
      }
    }

    });

  }
  

});

/* Forgot password */

router.post('/forgotpassword',function(req,res){

  var email = req.body.email;

  if(email)
  {
    var query ='SELECT * from tbl_users WHERE (email=? AND status=?)';
    con.query(query,[email,1],function(error,results,fields){

      if(error)
      {
        res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
      }
      else
      {
         console.log(results.length);
          if(results.length >0)
          {
             /* send email for password */

             var first_name = results[0]['first_name'];
             var last_name = results[0]['last_name'];

             var password = generator.generate({length: 10,numbers: true});

              var welcometext = `Hi  `+first_name+` `+last_name+`,`+`

              Please Find your password ....

              password : `+password+`

              `+Constant.EMAIL_SIGNATURE+`

              `;

              /* Uodate the password */

              con.query('Update tbl_users set password=? WHERE email=?',[md5(password),email],function(error_upd,results_upd,fields_upd){

                if(!error_upd)
                {

                    var mailOptions = {from:Constant.FROM_EMAIL,to: email,
                      subject: 'forgotpassword - '+Constant.WEBSITE_TITLE,text: welcometext};


                    transporter.sendMail(mailOptions, function(emailerror, info){
                    if (error)
                    {
                      var emailerrormsg = emailerror;
                      var emailsend='';

                      res.send({"status":true,"message":"Error in sendMail","error":error,"results":'','emailerror':emailerrormsg,'emailsend':emailsend});
                    }
                    else
                    {
                      var emailerrormsg = emailerror;
                      var emailsend=info.response;

                      res.send({"status":true,"message":"Your password has send over your email..","error":error,"results":results,'emailerror':emailerrormsg,'emailsend':emailsend});
                    }

                  });

                }
                else
                {
                  res.send({"status":false,"message":"Error Occured","error":error_upd,"results":''});
                }

              });

             

          }
          else
          {
            res.send({"status":false,"message":"Email does not exist or your Profile is disabled..","error":error,"results":''});
          }
      }

    });
  }
  else
  {
    res.send({"status":false,"message":"Please Enter the Email id","error":'',"results":''});
  }

  
});

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

module.exports = router;