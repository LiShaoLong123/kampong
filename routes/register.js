var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var check= require('../models/checkLog');

/* GET users listing. */
router.get('/', check.checkNotLogin);
router.get('/', function(req, res) {
	res.render('register', {
		title: '注册',
	  	user:req.session.user,
	  	success:req.flash('success').toString(),
	  	error:req.flash('error').toString()
	});
});
router.post('/', check.checkNotLogin);
router.post('/', function(req, res) {
	var userId = req.body.userId;
	var userName = req.body.userId;
	var password = req.body.password;
	var re_password = req.body['re_password'];

	//检验两次密码是否一致
	if(re_password != password) {
		req.flash('error', '两次输入的密码不一致');
		return res.redirect('/register');
	}

	//生成密码的md5值
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex');
	var newUser = new User({
		userId: req.body.userId,
		userName: "weibo用户",
		password:password,
		identity:"为了部落",
		userPic:"/img/logo2.png",
		birthday:null,
		sex:null,
		phone:null,
		email:null,
		fansNum:0,
		CrnNum:0
	});

	//检查用户名是否已经存在
	User.get(newUser.userId, function(err, user) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/login');
		}
		if(user) {
			req.flash('error', '用户已存在');
			return res.redirect('/register'); //返回注册页面
		}
		//如果不存在注册新用户
		newUser.save(function(err, user) {
			if(err) {
				req.flash('error', err);
				return res.redirect('/register'); //注册失败返回注册页面
			}
			req.session.user = user; //用户信息存入session
			req.flash('success', '注册成功！');
			res.redirect('/register/registerSuccess');
		});
	});
});
//表单验证
router.post('/checkUserId', check.checkNotLogin);
router.post('/checkUserId', function(req, res) {
	User.get(req.body.userId, function(err, user) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/login');
		}
		if(user) {
			return res.send("用户已存在"); //返回注册页面
		}else{
			return res.send("帐号可使用");
		}
	})
});
//注册成功
router.get('/registerSuccess', check.checkNotLogin);
router.get('/registerSuccess', function(req, res) {
	res.render('registerSuccess', {
		title: '注册成功',
		user:req.session.user,
	  	success:req.flash('success').toString(),
	  	error:req.flash('error').toString()
	});
});
module.exports = router;