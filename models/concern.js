var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;
var User = require('../models/user.js');
var DBRef = require('mongodb').DBRef;
function Concern(Concern){
	this.userId = Concern.userId;
	this.beCrnId = Concern.beCrnId,
	this.crnTime = Concern.crnTime,
	this.crnUpdateTime = Concern.crnUpdateTime,
	this.crnStetus = Concern.crnStetus
};

module.exports = Concern;
//存储用户信息
Concern.prototype.save = function(callback){
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
	var concern = {
		userId:this.userId,
		beCrnId:ObjectID(this.beCrnId),
		crnTime:time,
		crnUpdateTime:time,
		crnStetus:this.crnStetus
	};

	//打开数据库
	mongodb.open(function(err, db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取Concerns集合
		db.collection('concerns',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//将用户数据插入users集合
			collection.insert(concern,{
				safe:true
			},function(err,Concern){
				mongodb.close();
				if (err) {
					return callback(err);//错误返回err信息
				}
				callback(null,Concern[0]);//成功err为null，并返回存储后的用户文档
			});
		});
	});
};
//读取关注组信息，通过userId和beCrnId
Concern.getById = function(userId,beCrnId,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取users集合
		db.collection('concerns',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//查找用户名userId值为userId的一个文档
			collection.findOne({
				userId:userId,
				beCrnId:ObjectID(beCrnId)
			},function(err,concern){
				mongodb.close();
				if (err) {
					console.log(err);
					return callback(err);//失败，返回err信息
				}
				callback(null,concern);//成功，返回用户信息
			});
		});
	});
};
//读取关注者的信息，通过beCrnId，查看被多少人关注了
Concern.getFans = function(beCrnId,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取concerns集合
		db.collection('concerns',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//查找用户名userId值为userId的一个文档
			collection.find({
				beCrnId:ObjectID(beCrnId)
			}).toArray(function(err,fans){
				mongodb.close();
				if (err) {
					return callback(err);//失败，返回err信息
				}
				callback(null,fans);//成功，返回用户信息
			});
		});
	});
};
//读取关注组信息，通过userId
Concern.getByUserId = function(userId,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取users集合
		db.collection('concerns',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//查找用户名userId值为userId的一个文档
			collection.find({
				userId:userId
			},{
				beCrnId:1
			}).sort({
				talkTime:-1
			}).toArray(function(err,concern){
				mongodb.close();
				if (err) {
					return callback(err);//失败，返回err信息
				}
				callback(null,concern);//成功，返回用户信息
			});
		});
	});
};
//删除关注组，取消关注
Concern.remove = function(userId,beCrnId,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('concerns',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//根据query对象查询用户的talk
			collection.remove({
				userId:userId,
				beCrnId:ObjectID(beCrnId)
			},{
				w:1
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