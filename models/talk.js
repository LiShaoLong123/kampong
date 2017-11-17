var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;

function Talk(userId,talk,talkPic,share,comment,like,call){
	this.userId = userId;
	this.talk = talk;
	this.talkPic = talkPic;
	this.share = share;
	this.comment = comment;
	this.like = like;
	this.call = call;
};

module.exports = Talk;
//存储一条微博以其相关信息
Talk.prototype.save = function(callback){
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
	var talk={
		userId :this.userId,
		talk : this.talk,
		talkPic: this.talkPic,
		talkTime : time,
		share : this.share,
		comments : [],
		like : this.like,
		call : this.call
	}

	//打开数据库
	mongodb.open(function(err, db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取Talk集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//将文档数据插入talks集合
			collection.insert(talk,{
				safe:true
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
//读取发表的talk以其相关信息
Talk.getOne = function(userId,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			var query = {};
			if (userId) {
				query.userId = userId;
			}
			//根据query对象查询用户的talk
			collection.find(query).sort({
				talkTime:-1
			}).toArray(function(err,docs){
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回err
				}
				callback(null,docs);//成功！以数组形式返回查询结果
			});
		});
	});
};
//读取发表的talk以其相关信息,根据talk查询
Talk.getTalk = function(talkKey,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			
			//根据query对象查询用户的talk
			collection.find({
				talk:{$regex:talkKey,$options:"i" }
			}).sort({
				talkTime:1
			}).toArray(function(err,docs){
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回err
				}
				callback(null,docs);//成功！以数组形式返回查询结果
			});
		});
	});
};
//读取关注组和自己的talk以其相关信息
Talk.getAll = function(concernUser,callback){
	var concernUserId = new Array();
	for (var i = 0; i < concernUser.length; i++) {
		concernUserId.push({"userId":concernUser[i].userId});
	}
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//根据query对象查询用户的talk
			collection.find({
				$or:concernUserId
			}).sort({
				talkTime:-1
			}).toArray(function(err,docs){
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回err
				}
				callback(null,docs);//成功！以数组形式返回查询结果
			});
		});
	});
};
//读取发表的talk以其相关信息,根据talk_id查询
Talk.getBy_Id = function(talks_id,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			
			//根据query对象查询用户的talk
			collection.findOne({
				_id:ObjectID(talks_id)
			},function(err,talk){
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回err
				}
				callback(null,talk);//成功！以数组形式返回查询结果
			});
		});
	});
};
//读取发表的talk以其相关信息,根据talk_id查询
Talk.getLike = function(talks_id,userId,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			
			//根据query对象查询用户的talk
			collection.findOne({
				_id:ObjectID(talks_id),
				"like.likeUserId":userId
			},function(err,talk){
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回err
				}
				callback(null,talk);//成功！以数组形式返回查询结果
			});
		});
	});
};
//读取发表的talk以其相关信息,根据talk_id查询
Talk.getMessage = function(msg_id,userId,callback){

	var msg_id=[
		{"comments.rep_id":msg_id},
		{"userId":userId},
		{"call.callId":msg_id}]
	// var msg_id=[
	// 	{"comment.rep_id":msg_id,"comment.read":0},
	// 	{"comment.reCom.rep_id":msg_id,"comment.reCom.read":0},
	// 	{"userId":userId,"like.read":0},
	// 	{"call.callId":msg_id,"call.read":0} ]

	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			
			//根据query对象查询用户的talk
			collection.find({
				$or:msg_id
			}).sort({
				talkTime:-1
			}).toArray(function(err,docs){
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回err
				}
				callback(null,docs);//成功！以数组形式返回查询结果
			});
		});
	});
};
// //将评论回复标记为已读,根据talk_id查询
// Talk.udMsgRC = function(rep_id,callback){
// 	var rep_id={"comment.0.reCom.0.rep_id":rep_id,"comment.0.reCom.0.read":0};
// 	mongodb.open(function(err,db){
// 		if(err){
// 			return callback(err);//错误返回err信息
// 		};
// 		//读取talks集合
// 		db.collection('talks',function(err,collection){
// 			if(err){
// 				mongodb.close();
// 				return callback(err);//错误返回err信息
// 			};
			
// 			//根据query对象查询用户的talk
// 			collection.update(rep_id,{
// 				$set:{"comment.0.reCom.0.read":1}
// 			},{multi:true},function(err,docs){
// 				mongodb.close();
// 				if (err) {
// 					return callback(err);//失败！返回err
// 				}
// 				callback(null,docs);//成功！以数组形式返回查询结果
// 			});
// 		});
// 	});
// };
//将评论标记为已读,根据talk_id查询
Talk.udMsgC = function(rep_id,callback){
	var rep_id={"comments.rep_id":rep_id,"comments.read":0};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};

			//根据query对象查询用户的talk
			collection.update(rep_id,{
				$inc:{"comments.$.read":1}
			},{multi:true},function(err,docs){
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回err
				}
			// console.log(docs);
				callback(null,docs);//成功！以数组形式返回查询结果
			});
		});
	});
};
//将@ 标记为已读,根据talk_id查询
Talk.udMsgCall = function(msg_id,callback){
	var msg_id={"call.callId":msg_id,"call.read":0};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			
			//根据query对象查询用户的talk
			collection.update(msg_id,{
				$set:{"call.$.read":1}
			},{multi:true},function(err,docs){
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回err
				}
				callback(null,docs);//成功！以数组形式返回查询结果
			});
		});
	});
};
//将点赞 标记为已读,根据talk_id查询
Talk.udMsgLike = function(userId,callback){
	var msg_id={"userId":userId,"like.read":0};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			
			//根据query对象查询用户的talk
			collection.update(msg_id,{
				$set:{"like.$.read":1}
			},{multi:true},function(err,docs){
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回err
				}
				callback(null,docs);//成功！以数组形式返回查询结果
			});
		});
	});
};
//删除微博
Talk.remove = function(id,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误返回err信息
		};
		//读取talks集合
		db.collection('talks',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误返回err信息
			};
			//根据query对象查询用户的talk
			collection.remove({
				_id : ObjectID(id)
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