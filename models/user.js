var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;
function User(user){
	this.userId = user.userId;
	this.userName = user.userName,
	this.password = user.password,
	this.userPic = user.userPic,
	this.sex = user.sex,
	this.identity = user.identity,
	this.birthday = user.birthday,
	this.phone = user.phone,
	this.email = user.email,
	this.fansNum=user.fansNum,
	this.CrnNum=user.CrnNum
};
function Pwd(pwd){
	this.password = user.password
};

module.exports = User;
//存储用户信息
User.prototype.save = function(callback){
	var date= new Date();
	var time = {
		date:date,
		year:date.getFullYear(),
		month:date.getFullYear()+"-"+(date.getMonth()+1),
		day:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
		minute:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+
		(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
	};
	//要存入数据库的用户文档
	var user = {
		userId:this.userId,
		userName:this.userName,
		password:this.password,
		userPic:this.userPic,
		sex:this.sex,
		identity:this.identity,
		birthday:this.birthday,
		phone:this.phone,
		email:this.email,
		fansNum:this.fansNum,
		CrnNum:this.CrnNum,
		regTime:time
	};

	//打开数据库
	mongodb.open(function(err, db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取users集合
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//将用户数据插入users集合
			collection.insert(user,{
				safe:true
			},function(err,user){
				mongodb.close();
				if (err) {
					return callback(err);//错误返回err信息
				}
				callback(null,user[0]);//成功err为null，并返回存储后的用户文档
			});
		});
	});
};
//读取用户信息，通过userId
User.get = function(userId,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取users集合
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//查找用户名userId值为userId的一个文档
			collection.findOne({
				userId:userId
			},function(err,user){
				mongodb.close();
				if (err) {
					return callback(err);//失败，返回err信息
				}
				callback(null,user);//成功，返回用户信息
			});
		});
	});
};

//读取用户信息,通过_id
User.getById = function(id,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取users集合
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//查找用户名userId值为userId的一个文档
			collection.findOne({
				_id : ObjectID(id)
			},function(err,user){
				mongodb.close();
				if (err) {
					console.log(err);
					return callback(err);//失败，返回err信息
				}
				callback(null,user);//成功，返回用户信息
			});
		});
	});
};
//读取用户信息,通过userName，模糊查询
User.getByUserName = function(userName,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取users集合
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//查找用户名userId值为userId的一个文档
			collection.find({
				userName:{$regex:userName,$options:'i'}
			}).toArray(function(err,user){
				mongodb.close();
				if (err) {
					return callback(err);//失败，返回err信息
				}
				callback(null,user);//成功，返回用户信息
			});
		});
	});
};
//读取一组用户信息,通过_id数组，获取关注组的信息列表，用于展示在home里talks
User.getByBeCrnId = function(concern,callback){
	var concernId = new Array();
	for (var i = 0; i < concern.length; i++) {
		if (concern[i].beCrnId) {
			concernId.push({"_id":ObjectID(concern[i].beCrnId)});
		}else if(concern[i].rep_id){
			concernId.push({"_id":ObjectID(concern[i].rep_id)});
		}else if(concern[i]._id){
			concernId.push({"_id":ObjectID(concern[i]._id)});
		}
	}

	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取users集合
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//查找用户名userId值为userId的一个文档
			collection.find({
				$or:concernId
			}).toArray(function(err,user){
				mongodb.close();
				if (err) {
					return callback(err);//失败，返回err信息
				}

				callback(null,user);//成功，返回用户信息
			});
		});
	});
};
//读取一组用户信息,通过userId数组，获取关注组的信息列表，用于展示在home里talks
//读取一组用户信息,通过userId数组,获取粉丝信息
User.getByUserIdcol = function(talks,callback){
	var talksUserId = new Array();
	for (var i = 0; i < talks.length; i++) {
		if (talks[i].userId) {
			talksUserId.push({"userId":talks[i].userId});
		}else if (talks[i].callId) {
			talksUserId.push({"_id":ObjectID(talks[i].callId)});
		}else if (talks[i].likeUserId) {
			talksUserId.push({"userId":talks[i].likeUserId});
		}
	}
	
	
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取users集合
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//查找用户名userId值为userId的一个文档
			collection.find({
				$or:talksUserId
			}).toArray(function(err,user){
				mongodb.close();
				if (err) {
					return callback(err);//失败，返回err信息
				}
				callback(null,user);//成功，返回用户信息
			});
		});
	});
};
//修改用户密码
User.updatePwd = function(userId,newPwd,callback){
	mongodb.open(function(err,db){
		if(err){
			console.log(err);
			return callback(err);//错误返回err信息
		};
		//读取users集合
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				console.log(err);
				return callback(err);//错误返回err信息
			};
			collection.update({
				"userId":userId
			},{
				$set:{"password":newPwd}
			},function(err){
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};
//修改用户信息
User.updateInfo = function(userId,userPic,userName,sex,identity,email,phone,callback){
	mongodb.open(function(err,db){
		if(err){
			console.log(err);
			return callback(err);//错误返回err信息
		};
		//读取users集合
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				console.log(err);
				return callback(err);//错误返回err信息
			};
			collection.update({
				"userId":userId
			},{
				$set:{
					"userPic":userPic,
					"userName":userName,
					"sex":sex,
					"identity":identity,
					"email":email,
					"phone":phone
				}
			},function(err){
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};
//修改用户信息
User.updateFansNum = function(userId,fans,callback){
	mongodb.open(function(err,db){
		if(err){
			console.log(err);
			return callback(err);//错误返回err信息
		};
		//读取users集合
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				console.log(err);
				return callback(err);//错误返回err信息
			};
			collection.update({
				"userId":userId
			},{
				$set:{
					"fansNum":fans
				}
			},function(err){
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};
//修改用户信息
User.updateCrnNum = function(userId,CrnNum,callback){
	mongodb.open(function(err,db){
		if(err){
			console.log(err);
			return callback(err);//错误返回err信息
		};
		//读取users集合
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				console.log(err);
				return callback(err);//错误返回err信息
			};
			collection.update({
				"userId":userId
			},{
				$set:{
					"CrnNum":CrnNum
				}
			},function(err){
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};
