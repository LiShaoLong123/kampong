var express = require('express');
var router = express.Router();
var check= require('../models/checkLog');
var Talk = require('../models/talk');
var User = require('../models/user.js');
var Concern = require('../models/concern.js');
var ObjectID = require('mongodb').ObjectID;

/* GET home page. */
//进入个人空间
router.get('/:Id', check.checkLogin);
router.get('/:Id', function(req, res, next) {
	User.getById(req.params.Id,function(err,user){
			if(!user){
				req.flash('error','用户不存在');
				return res.redirect('/login');//用户不存在则跳转到登录页面
			}
			//用户名密码都匹配后，将用户信息存入talksUser
			var talksUser = user;
			Talk.getOne(talksUser.userId,function(err,talks){
				if (err) {
					talks = [];
				}
				//检查关注组是否已经存在
				Concern.getById(req.session.user.userId,req.params.Id, function(err, concern) {
					var crnStetus;
					if(err) {
						req.flash('error', err);
						return res.redirect('/login');
					}
					if(concern) {
						req.flash('error', '关注组已存在');
						crnStetus=concern.crnStetus;
					}else{
						req.flash('error', '关注组不存在');
						crnStetus=0
					}
					req.flash('success','查询成功');
					//获取关注组的_id数组
					Concern.getByUserId(talksUser.userId, function(err, crnUser) {
						
						//获取fans列表
						Concern.getFans(talksUser._id,function(err,fans){
							if(!fans){
								fans=[];
							}
							req.session.fans = fans;
							// if (req.session.user._id==req.params.Id) {
							// 	User.updateFansNum(req.session.user.userId,fans.length,function(err){
							// 		User.updateCrnNum(req.session.user.userId,crnUser.length,function(err){
										
					 	// 			});
					 	// 		});
				 		// 	}
				 			
				 				res.render('personal', { 
							  		title: 'Weibo个人空间',
							  		user:req.session.user,
							  		talks:talks,
							  		fans:fans,
							  		msg:0,
								 	crnUserlength:crnUser.length,
							  		talksUser:talksUser,
									crnStetus:crnStetus,
							  		success:req.flash('success').toString(),
							  		error:req.flash('error').toString()
					 			});
				 			
						});
						
					});
					
				});
				
			});
	});
});
//删除微博
router.post('/remove', check.checkLogin);
router.post('/remove', function(req, res, next) {
	var talksId=req.body.talksId;
	Talk.remove(req.body.talksId,function(err){
		if (err) {
			req.flash('error',err);
			console.log(err);
			return res.redirect("/");
		}
		req.flash('success','删除成功');
		res.end();
	})
});
//关注用户
router.post('/concern', check.checkLogin);
router.post('/concern', function(req, res, next) {
	var userId=req.body.userId;
	var newConcern = new Concern({
		userId:req.body.userId,
		beCrnId:req.body.beCrnId,
		crnStetus:1
	});
	//检查关注组是否已经存在
	Concern.getById(userId,req.body.beCrnId, function(err, concern) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/login');
		}
		if(concern) {
			req.flash('error', '关注组已存在');
			return res.json({val:1}); //返回注册页面
		}
		//如果未关注，添加关注关系
		newConcern.save(function(err, concern) {
			if(err) {
				req.flash('error', err);
				return res.redirect('/register'); //注册失败返回注册页面
			}
			req.flash('success', '关注成功！');
			res.json({val:1});
		});
	});
});
//取消关注
router.post('/crnRemove', check.checkLogin);
router.post('/crnRemove', function(req, res, next) {
	//检查关注组是否已经存在
	Concern.getById(req.body.userId,req.body.beCrnId, function(err, concern) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/login');
		}
		if(concern) {
			req.flash('error', '关注组已存在');
			//如果未关注，添加关注关系
			Concern.remove(req.body.userId,req.body.beCrnId,function(err, concern) {
				if(err) {
					req.flash('error', err);
					return res.redirect('/register'); //注册失败返回注册页面
				}
				req.flash('success', '取消关注成功！');
				res.json({val:0});
			});
		}

	});
});


module.exports = router;
