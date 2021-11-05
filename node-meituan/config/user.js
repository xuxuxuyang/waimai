// 密码加密
const bcrypt = require('bcryptjs');
// token
const jwt = require('jsonwebtoken');
// 引入token配置
const security = require('./tokentime.js').security

// 密码加密
function pWd(password){ 
	const salt = bcrypt.genSaltSync(10);
	const hashpass = bcrypt.hashSync(password, salt);
	return hashpass
}

// 密码比对
// compareSync('提交的密码','加密的密码')。正确返回true
function contrast(password,dbpass){
	const passcont = bcrypt.compareSync(password,dbpass)
	return passcont
}

// token生成
function gentoken(uid,scope=2){
	const secretkey = security.secretkey
	const expiresIn = security.expiresIn
	const token = jwt.sign({uid,scope},secretkey,{expiresIn})
	return token
}

module.exports = {
	pWd,
	contrast,
	gentoken
}