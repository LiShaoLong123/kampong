var express = require('express');
var router = express.Router();
var multer = require('multer');
// var upload = multer({dest: './public/upload_imgs'});
var upload = require('../models/multerUtil');

/* GET home page. */
//检查是否登录

router.get('/',function(req, res, next){
    res.render('test');
});
router.post('/',function(req, res, next){
    
    console.log(req.body.aa);
    console.log(req.body.bb);
    
    res.json({name:"111111"});
    
});

module.exports = router;
