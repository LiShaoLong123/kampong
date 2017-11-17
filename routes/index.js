var express = require('express');
var router = express.Router();
var check= require('../models/checkLog');

/* GET home page. */
//检查是否登录
router.get('/', check.checkNotLogin);
router.get('/', function(req, res, next) {
  res.render('index', { 
  	title: 'Weibo主页',
  	user:req.session.user,
  	success:req.flash('success').toString(),
  	error:req.flash('error').toString()
  });
});

module.exports = router;
