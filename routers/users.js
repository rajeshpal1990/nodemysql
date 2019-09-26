
var express = require('express');
var multer = require('multer');
var path = require('path');
var app = express();
var router = express.Router();

var md5 = require('md5');
var generator = require('generate-password');


var storage = multer.diskStorage({
  // destino del fichero
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  // renombrar fichero
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

router.post("/upload", upload.array("uploads[]", 12), function (req, res) {
  console.log('files', req.files);

  res.send(req.files);
});


/* Register the user */

router.post('/register', function(req, res){
  

    var password = generator.generate({length: 10,numbers: true});
    var useremail = req.body.email;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var mobile = req.body.mobile;
    var user_type = req.body.user_type;

    var users={
      "oauth_provider":req.body.oauth_provider,
      "email":useremail,
      "first_name":first_name,
      "last_name":last_name,
      "mobile":mobile,
      "username":useremail,
      "user_type":user_type,
      "password":md5(password)
    }

    /* check for dublicate users */

    if(!(useremail) || !(first_name) || !(last_name) || !(mobile))
    {
      res.send({"status":false,"message":"Please enter the Required fields","error":'',"results":''});
    }
    else
    {

        con.query('SELECT count(email) as cntemail FROM tbl_users WHERE email = ?',req.body.email, function (error, results, fields){
      
      console.log(results[0]['cntemail']);
      var cntuser = results[0]['cntemail'];
      if(cntuser==0)
      {
          con.query('INSERT INTO tbl_users SET ?',users, function (error_inrt, results_inrt, fields_inrt){

          if (error_inrt)
          {
            console.log("error ocurred",error_inrt);
            res.send({"status":false,"message":"error ocurred","error":error_inrt,"results":results_inrt});
          }
          else
          {
            console.log('The solution is: ', results_inrt);

            /* send welcome email with user name and password */

              var welcometext = `Welcome `+first_name+` `+last_name+`,`+`

              You have Recently registered with Bodyscanapp . Please find your login details ....

              Username : `+useremail+`
              password : `+password+`

               `+Constant.EMAIL_SIGNATURE+`

              `;

              var mailOptions = {from:Constant.FROM_EMAIL,to: useremail,
                subject: 'Registration - '+Constant.WEBSITE_TITLE,text: welcometext};




              /*

              transporter.sendMail(mailOptions, function(emailerror, info){
              if (error)
              {
                var emailerrormsg = emailerror;
                var emailsend='';

                res.send({"status":true,"message":"User has registered succefully!...","error":error_inrt,"results":results_inrt,'emailerror':emailerrormsg,'emailsend':emailsend});
              }
              else
              {
                var emailerrormsg = emailerror;
                var emailsend=info.response;

                res.send({"status":true,"message":"User has registered succefully!...","error":error_inrt,"results":results_inrt,'emailerror':emailerrormsg,'emailsend':emailsend});
              }

            }); */


            res.send({"status":true,"message":"User has registered succefully!...","error":error_inrt,"results":results_inrt,'emailerror':'','emailsend':''});
            
          }

          });
      }
      else
      {
        res.send({"status":false,"message":"User has already Exist.","error":error,"results":results});
      }

     });

    }

     

});

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


/* Retailers  list */

router.get('/retailers',function(req,res){
	
	var usertype= req.query.user;
	
	var query='SELECT * from tbl_users Where user_type=?';
	con.query(query,[usertype],function(error,results,fields){
		
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


/* Website Settings */

 router.get('/settings/:id',function(req,res){
  
  var settingid= req.params.id;

  console.log("settingid:"+settingid);
  
  var query='SELECT * from tbl_settings Where id=?';
  con.query(query,[settingid],function(error,results,fields){
    if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"Settings details","error":error,"results":results});
    }
    
  });
  
});


/* Update the Setting data*/

router.post('/settings/:id',function(req,res){

  var settingid= req.params.id;

  console.log("Update Setting:"+req.body);

  var Title= req.body.Title;
  var meta_title = req.body.meta_title;
  var meta_desc = req.body.meta_desc;
  var meta_keywords = req.body.meta_keywords;
  var logo = req.body.logo;

  var updateinfo = {"Title":Title,"meta_title":meta_title,"meta_desc":meta_desc,"meta_keywords":meta_keywords,"logo":logo}

  var queryupd='Update tbl_settings SET ? WHERE id=?';
  con.query(queryupd,[updateinfo,settingid],function(error,results,fields){

    if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"Settings Updated...","error":error,"results":results});
    }
  });

});


/* Get the user  */

router.get('/getdata/:id',function(req,res){
  
  var userid= req.params.id;

  console.log("userid:"+userid);
  
  var query='SELECT * from tbl_users Where id=?';
  con.query(query,[userid],function(error,results,fields){
    if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"User details","error":error,"results":results});
    }
    
  });
  
});


/* Update the user info */

router.post('/updateinfo/:id',function(req,res){

  var userid= req.params.id;

  console.log("PUT userid:"+userid);

  var first_name= req.body.first_name;
  var last_name = req.body.last_name;
  var email = req.body.email;
  var mobile = req.body.mobile;

  var updateinfo = {"first_name":first_name,"last_name":last_name,"email":email,"mobile":mobile}


  /* Check for dublicate */

   var chkquery = 'SELECT count(email) as cntemail FROM tbl_users WHERE email = ? AND id NOT IN(?)';

   con.query(chkquery,[email,userid],function(errorchk,resultschk,fieldschk){

    var cntuser = resultschk[0]['cntemail'];

     if(cntuser==0)
     {

        var queryupd='Update tbl_users SET ? WHERE id=?';
         con.query(queryupd,[updateinfo,userid],function(error,results,fields){

          if(error)
          {
            res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
          }
          else
          {
            res.send({"status":true,"message":"User info  Updated...","error":error,"results":results});
          }
        });
     }
     else
     {
       res.send({"status":false,"message":"This User is already Exist..","error":errorchk,"results":''});
     }

   });


   


});

/* Change password  */

router.post('/Profile/:id',function(req,res){

  var settingid= req.params.id;

  console.log("Profile:"+settingid);

  var oldPwd= req.body.oldPwd;

  var oldpass2check = md5(oldPwd);

  var userorgpass= req.body.user_code;
  var newPwd = req.body.newPwd;
  var password2upd = md5(newPwd);

  if(oldpass2check==userorgpass)
  {

      var updateinfo = {"password":password2upd}

     var queryupd='Update tbl_users SET ? WHERE id=?';
    con.query(queryupd,[updateinfo,settingid],function(error,results,fields){

      if(error)
      {
        res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
      }
      else
      {
        res.send({"status":true,"message":"Your password has  Updated...","error":error,"results":results});
      }
    });

  }
  else
  {
     res.send({"status":false,"message":"Old password does not matched..","error":'',"results":''});
  }

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
  var querydel = 'DELETE FROM tbl_users WHERE id=?';
  con.query(querydel,[colid],function(error,results,fields){

    if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"User deleted succefully","error":error,"results":results});
    }

  });

}
else if(colid && actiontype)
{
   var queryupd = 'UPDATE tbl_users SET status=? WHERE id=?';
   con.query(queryupd,[updcolstatus,colid],function(error,results,fields){

    if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"User Status Updated","error":error,"results":results});
    }

  });

}
else
{
   res.send({"status":false,"message":"Invalid Request","error":'',"results":''});
}


});

router.get('/dashboard',function(req,res){
  
  var usertype= req.query.usertype;

  var totalorder=0;
  
  var query='SELECT count(ord.order_number) as totalorder FROM tbl_orders ord';
  con.query(query,function(error,results,fields){

   if(error)
    {
      res.send({"status":false,"message":"Error ocurred","error":error,"results":''});
    }
    else
    {
      res.send({"status":true,"message":"User Status Updated","error":error,"results":results});
    }

  });


  
});


module.exports = router;