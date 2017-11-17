var express = require('express');
var router = express.Router();
var check= require('../models/checkLog');
var Talk = require('../models/talk');
var User = require('../models/user');
var Concern = require('../models/concern');

/* GET home page. */

// router.get('/all', function(req, res, next) {
// 	res.render('search', { 
// 					  	title: 'Kampong-搜索',
// 		user:req.session.user,
// 		talksUser:user,
// 		topicError:req.flash('topicError').toString(),
// 		userError:req.flash('userError').toString(),
// 	});
// }
router.get('/', check.checkLogin);
router.get('/', function(req, res, next) {
// console.log(req.query.searchKey);
  User.getByUserName(req.query.searchKey,function(err,user){
		if (err||user.length==0) {
			req.flash('userError','没有相关用户');
			req.session.userError = req.flash('userError').toString();
		}

		if (err||user.length==0||req.query.userError==1) {
				req.session.userError='没有相关用户';
		}else{
			req.session.userError=null;
		}

		var searchTalks;
		if(req.query.topicError==1){
			searchTalks="";
		}else{
			searchTalks=req.query.searchKey;
		}
		Talk.getTalk(searchTalks,function(err,talks){
			if ((err||talks.length==0)&&req.query.topicError!=1) {
				req.flash('topicError','没有相关话题');
				req.session.topicError = req.flash('topicError').toString();
				if (req.session.userError) {
					return res.redirect("/search?searchKey=&topicError=1&userError=1");
				}else{
					var str1 = "/search?searchKey="+req.query.searchKey+"&topicError=1"
					var str2 = encodeURI(str1);
					return res.redirect(str2);
				}
			}else{
			req.flash('success','查询成功');
			User.getByUserIdcol(talks,function(err,talksUser){
					if(!talksUser){
						req.flash('error','相关话题用户不存在');
						return res.redirect('search');//用户不存在则跳转到登录页面
					}
					for (var i = 0; i < user.length; i++) {
							user[i].userInfo=user[i];
						}
					for (var i = 0; i < talks.length; i++) {
						for (var j = 0; j < talksUser.length; j++) {
							if(talks[i].userId==talksUser[j].userId){
								talks[i].userInfo = talksUser[j];
							}
						}
						user.push(talks[i]);
					}
					user.sort(function(a,b){
           				 return b.userInfo.fansNum-a.userInfo.fansNum;
           			});
		
					if (!req.query.topicError) {
						req.session.topicError=null;
					}
					
					
					// console.log(req.searchKey.userError);
					req.flash('success','查询成功');
					res.render('search', { 
					  	title: 'Weibo搜索',
					  	user:req.session.user,
					  	talksUser:user,
					  	topicError:req.session.topicError,
					  	userError:req.session.userError
					});

				})
			}
		})
	})
});

//检查关注组是否存在
router.post('/checkCrn', check.checkLogin);
router.post('/checkCrn', function(req, res, next) {
	var userId=req.body.userId;
	var beCrnId = req.body.beCrnId;
	//检查关注组是否已经存在
	Concern.getById(userId,req.body.beCrnId, function(err, concern) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/login');
		}
		if(concern) {
			req.flash('success', '关注组已存在');
			return res.json({val:1}); //返回1
		}else{
			req.flash('success', '关注组不存在');
			return res.json({val:0}); //返回0
		}

	});
	
	
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
