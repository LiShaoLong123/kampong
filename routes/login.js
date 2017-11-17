var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var check= require('../models/checkLog');
/* GET users listing. */
router.get('/', check.checkNotLogin);
router.get('/', function(req, res, next) {
	res.render('login', { 
	  	title: '登录',
	  	success:req.flash('success').toString(),
	  	error:req.flash('error').toString()
	});
});
//登录
router.post('/', check.checkNotLogin);
router.post('/',function(req,res,next){
	//生成密码的md5值
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex');
	//检车用户是否存在
	User.get(req.body.userId,function(err,user){
		if(!user){
			req.flash('error','用户不存在');
			return res.redirect('/login');//用户不存在则跳转到登录页面
		}
		//检检查密码是否一致
		if (user.password!=password){
			req.flash('error','账号或密码错误');
			return res.redirect('/login');//密码错误跳转到登录页面
		}
		//用户名密码都匹配后，将用户信息存入session
		req.session.user = user;
		req.flash('success','登录成功！');
		// console.log(req.session.user);

		return res.redirect('../home');
	});
});
//登出
router.get('/logout', function(req, res, next) {
  req.session.user=null;
  req.flash('success','登出成功');
  res.redirect('/');
});


module.exports = router;
