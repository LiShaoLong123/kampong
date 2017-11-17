var express = require('express');
var router = express.Router();
var check = require('../models/checkLog');
var crypto = require('crypto');
var User = require('../models/user.js');
var Concern = require('../models/concern.js');
var upload = require('../models/multerUtil');
var Talk = require('../models/talk');

/* GET home page. */
router.get('/', check.checkLogin);
router.get('/', function(req, res, next) {
	res.render('info', {
		title: 'Weibo个人中心',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});
//获取粉丝、关注的人
router.get('/fansConcern', function(req, res, next) {
	if(req.query.value == 'concern') {
		Concern.getByUserId(req.session.user.userId, function(err, concern) {
			if(err || concern.length == 0) {
				req.flash('error', '没有关注的人立刻去<a href="search">关注</a>');
				concern = [];
			}
			User.getByBeCrnId(concern, function(err, user) {
				if(!user) {
					req.flash('error', '用户不存在');
					console.log("用户不存在")
					user = []; //用户不存在则跳转到登录页面
				}
				var concernUser = user;
				req.flash('success', '关注的人');
				// console.log(user);
				res.render('fansConcern', {
					title: 'Weibo个人中心',
					user: req.session.user,
					concernUser: concernUser,
					fansUser: null,
					success: req.flash('success').toString(),
					error: req.flash('error').toString()
				});
			});
		});
	};
	if(req.query.value == 'fans') {

		Concern.getFans(req.session.user._id, function(err, fans) {
			if(err || fans.length == 0) {
				req.flash('error', '没有粉丝');
				fans = [];
			}
			User.getByUserIdcol(fans, function(err, user) {
				if(!user) {
					req.flash('error', '用户不存在');
				 //用户不存在则跳转到登录页面
				}
				// console.log(user);
				var fansUser = user;
				req.flash('success', '我的粉丝');
				res.render('fansConcern', {
					title: 'Weibo个人中心',
					user: req.session.user,
					concernUser: null,
					fansUser: fansUser,
					success: req.flash('success').toString(),
					error: req.flash('error').toString()
				});
			});
		});

	}



});
router.get('/update', function(req, res, next) {
	res.render('update', {
		title: 'Weibo个人中心',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});
router.get('/message', function(req, res, next) {
	res.render('message', {
		title: 'Weibo个人中心',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});
//修改密码或用户名
router.post('/update', upload.single('userPic'), function(req, res, next) {
	if(req.body.userName) {
		var userName = req.body.userName;
		var sex = req.body.sex;
		var identity = req.body.identity;
		var email = req.body.email;
		var phone = req.body.phone;
		var userPic = req.session.user.userPic;
		if(req.file) {
			var userPic = "/uploads/" + req.session.user._id + "/" + req.file.filename;
		}
		// console.log(userPic);

		User.updateInfo(req.session.user.userId, userPic, userName, sex, identity, email, phone, function(err) {
			User.get(req.session.user.userId, function(err, user) {
				if(!user) {
					req.flash('error', '用户不存在');
					return res.redirect('/login'); //用户不存在则跳转到登录页面
				}
				req.session.user = user;
				// console.log(req.session.user.userName);
				req.flash('success', '信息修改成功！');
				res.redirect('/info?value=showUserinfo');
			});
		});

	}

	if(req.body.newPassword) {
		//生成密码的md5值
		var md5 = crypto.createHash('md5');
		var Oldmd5 = crypto.createHash('md5');
		var newPassword = md5.update(req.body.newPassword).digest('hex');
		var oldPassword = Oldmd5.update(req.body.oldPassword).digest('hex');
		var rePassword = req.body['rePassword'];
		User.updatePwd(req.session.user.userId, newPassword, function(err) {
			//检检查密码是否正确
			if(req.session.user.password != oldPassword) {
				req.flash('error', '密码错误');
				return res.redirect('/../info/update?value=changePwd');
			}
			//新密码不能与原密码相同
			if(req.session.user.password == newPassword) {
				req.flash('error', '新密码不能与原密码相同');
				return res.redirect('../info/update?value=changePwd');
			}

			//检验两次密码是否一致
			if(rePassword != req.body.newPassword) {
				req.flash('error', '两次输入的密码不一致');
				return res.redirect('../info/update?value=changePwd');
			}
			//用户名密码都匹配后，将用户信息存入session
			req.flash('success', '修改成功！');
			req.session.user = null;
			res.redirect('../info/update?value=updateSuccess');
		});
	}

});
//消息提醒
router.get('/:talk_id', check.checkLogin);
router.get('/:talk_id', function(req, res, next) {
	User.getById(req.session.user._id, function(err, user) {
		if(!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/login'); //用户不存在则跳转到登录页面
		}
		//用户名密码都匹配后，将用户信息存入talksUser
		var talksUser = user;
		Talk.getOne(talksUser.userId, function(err, talks) {
			if(err) {
				talks = [];
			}
			//获取关注组的_id数组
			Concern.getByUserId(talksUser.userId, function(err, crnUser) {

				//获取fans列表
				Concern.getFans(talksUser._id, function(err, fans) {
					if(!fans) {
						fans = [];
					}
					req.session.fans = fans;
					//获取消息提醒内容
					Talk.getBy_Id(req.params.talk_id, function(err, message) {
						if(err) {
							req.flash('error', err);
							return res.redirect('home');
						}
						 User.get(message.userId,function(err,msgUser){

			                if(err) {
			                  req.flash('error', err);
			                 return res.redirect('home');
			                }
			                message.msgInfo=msgUser;

		                // console.log(message);
				                Talk.udMsgC(req.session.user._id,function(err){
				                  if (err) {
				                  	console.log(err);
				                    req.flash('error', err);
				                    return res.redirect('../home');
				                  }
				                
					                Talk.udMsgCall(req.session.user._id,function(err){
					                    if (err) {
				                  	console.log(err);
					                      req.flash('error', err);
					                      return res.redirect('../home');
					                    }
					                    // console.log(req.session.user.userId);
						                Talk.udMsgLike(req.session.user.userId,function(err,msgUser){
						                    if (err) {
				                  	console.log(err);
						                      req.flash('error', err);
						                      return res.redirect('../home');
						                    }
							                  res.render('personal', {
							                    title: 'weibo-个人空间',
							                    user: req.session.user,
							                    talks: talks,
							                    fans: fans,
							                    crnUserlength: crnUser.length,
							                    talksUser: talksUser,
							                    msg:1,
							                    message: message,
							                    success: req.flash('success').toString(),
							                    error: req.flash('error').toString()

						                });
						            });
				                });
				            });
						});

					});

				});

			});
		});
	});
});
module.exports = router;