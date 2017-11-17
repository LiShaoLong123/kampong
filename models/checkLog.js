
function checkLogin(req,res,next){
	
	if (!req.session.user) {
		req.flash('error','未登录，请您先的登录');
		return res.redirect('../login');
	}
	next();
}

function checkNotLogin(req,res,next){
	if (req.session.user) {
		req.flash('error','已登录');
		return res.redirect('../home');
	}
	next();
}

module.exports.checkLogin=checkLogin;
module.exports.checkNotLogin=checkNotLogin;
