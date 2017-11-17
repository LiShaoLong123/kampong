var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;

function Comment(talks_id,userId,rep_id,comment,floor){
	this.talks_id = talks_id;
	this.userId = userId;
	this.rep_id = rep_id;
	this.comment = comment;
	this.floor = floor;
};

module.exports = Comment;
//存储一条微博以其相关信息
Comment.prototype.save = function(callback){
	var date= new Date();
	//存储各种时间格式，方便日后扩展
	var time = {
		date:date,
		year:date.getFullYear(),
		month:date.getFullYear()+"-"+(date.getMonth()+1),
		day:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
		minute:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+
		(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
	};
	//要存入数据库的文档
	var comment={
		userId :this.userId,
		rep_id : this.rep_id,
		comment: this.comment,
		commentTime : time,
		floor : this.floor,
		read:0,
	}
	var talks_id=this.talks_id;
	//打开数据库
	mongodb.open(function(err, db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//将文档数据插入talks集合
			collection.update({
				_id:ObjectID(talks_id)
			},{
				$push:{comments:comment }
			},function(err){
				mongodb.close();
				if (err) {
					return callback(err);//错误返回err信息
				}
				callback(null);//成功err为null
			});
		});
	});
};
// //回复评论
Comment.prototype.reComm = function(callback){
	var date= new Date();
	//存储各种时间格式，方便日后扩展
	var time = {
		date:date,
		year:date.getFullYear(),
		month:date.getFullYear()+"-"+(date.getMonth()+1),
		day:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
		minute:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+
		(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
	};
	//要存入数据库的文档
	var comment={
		userId :this.userId,
		rep_id : this.rep_id,
		comment: this.comment,
		commentTime : time,
		floor : this.floor,
		read:0
	}
	var talks_id=this.talks_id;
	var	floor = this.floor;
	//打开数据库
	mongodb.open(function(err, db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//将文档数据插入talks集合
			collection.update({
				_id:ObjectID(talks_id),
				"comment.floor":floor
			},{
				$push:{"comment.$.reCom":comment }
			},function(err){
				mongodb.close();
				if (err) {
					return callback(err);//错误返回err信息
				}
				callback(null);//成功err为null
			});
		});
	});
};
//存储微博点赞信息
Comment.saveLike = function(talks_id,userId,callback){
	var date= new Date();
	var time = {
		date:date,
		year:date.getFullYear(),
		month:date.getFullYear()+"-"+(date.getMonth()+1),
		day:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
		minute:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+
		(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
	};
	//要存入数据库的文档
	var like={
		likeUserId :userId,
		likeTime:time,
		read:0
	}
	//打开数据库
	mongodb.open(function(err, db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//将文档数据插入talks集合
			collection.update({
				_id:ObjectID(talks_id)
			},{
				$push:{like:like}
			},function(err){
				mongodb.close();
				if (err) {
					return callback(err);//错误返回err信息
				}
				callback(null);//成功err为null
			});
		});
	});
};
//取消微博点赞信息
Comment.unLike = function(talks_id,userId,callback){
	var date= new Date();

	//打开数据库
	mongodb.open(function(err, db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//将文档数据插入talks集合
			collection.update({
				_id:ObjectID(talks_id)
			},{
				$pull:{like:{likeUserId:userId}}
			},function(err){
				mongodb.close();
				if (err) {
					return callback(err);//错误返回err信息
				}
				callback(null);//成功err为null
			});
		});
	});
};