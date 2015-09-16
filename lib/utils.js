var path = require('path');
var _ = require('underscore');
var semver = require('semver');//标准版本号格式检查
var conf = require('./config');

var utils = {};

//将.tpl后缀去掉，tpl模版在转换的过程中已经变成了js模块了
utils.otherExt2js = function(depsText) {
	return utils.safeUrl(depsText).replace(/\.tpl/g, '');
}

//安全化文件路径
utils.safeUrl = function(depsText) {
	//转换\为/，解决win下的路径BUG
	return depsText.replace(/\\/g, '/');
}

/***
* 解析出js中所有的依赖列表
*	@return 
*	[
		{ id: 'zepto', raw: './zepto.js', extName: '.js' },
		{ id: 'common', raw: './common.js', extName: '.js' }
	]
**/
utils.drawDependencies = function(reg, contents) {
	var deps = [], matches, results, fpath;
	reg.lastIndex = 0;
	while ((matches = reg.exec(contents)) !== null) {
		fpath = matches[2];
		if (fpath && fpath.slice(0, 4) !== 'http') {
			deps.push(utils.formatModId(fpath));
		}
	}
	return deps;
}

/*
 * 解析模块标识
 * modId { String } 模块标识
 * return { Object } 
 	id: 模块id
 	path: 过滤query和hash后的模块标识
 	ext: 模块后缀
 * @eg { id: 'zepto', raw: 'zepto', ext: '' }
 */
utils.formatModId = function(modId) {
	if(!modId){
		return modId;
	}
	// 过滤query(?)和hash(#)
	var format = modId = modId.replace(conf.reg.hash, '');
	var t = modId.match(conf.reg.modId);
	var id = t && t[1],
		ext = path.extname(modId);
	if (ext && (ext === '.js' || ext === '.tpl')) {
		id = id.replace(ext, '');
		format = modId.replace(ext,'');
	}
	return {
		id: id,
		raw: modId,
		format: format,
		ext: ext
	};
}

//将依赖（id）解析为真实（用户配置）的模块ID
utils.transferModIds2user = function(ops,formatedModId){
	if(_.isArray(formatedModId)){
		return _.map(formatedModId,function(depName){
			return utils.transferModId2user(ops,depName);
		});
	}else{
		return utils.transferModId2user(ops,formatedModId);
	}
}

//将一个依赖（id）解析为真实（用户配置）的模块ID
utils.transferModId2user = function(ops,formatedModId){
	var cfg = ops.alias[formatedModId];
	if(_.isEmpty(cfg)){
		return formatedModId;
	}else if(_.isString(cfg)){
		if (!semver.valid(cfg)) {//不是标准版本号
			return cfg;
		}else{
			//只给了一个版本号，则模块前缀默认与当前模块前缀一致
			return ops.id+'/'+formatedModId+'/'+cfg+'/index';
		}
	}else if(_.isArray(cfg) && cfg.length==2){
		return cfg[0]+'/'+formatedModId+'/'+cfg[1]+'/index';
	}
}

/**
* 去掉注释
* http://james.padolsey.com/javascript/javascript-comment-removal-revisted/
*/
utils.removeComments = function(str) {
	var uid = '_' + +new Date(),
	    primatives = [],
	    primIndex = 0;

	return (
	    str
	    /* Remove strings */
	    .replace(/(['"])(\\\1|.)+?\1/g, function(match){
	        primatives[primIndex] = match;
	        return (uid + '') + primIndex++;
	    })
	    
	    /* Remove Regexes */
	    .replace(/([^\/])(\/(?!\*|\/)(\\\/|.)+?\/[gim]{0,3})/g, function(match, $1, $2){
	        primatives[primIndex] = $2;
	        return $1 + (uid + '') + primIndex++;
	    })
	    
	    /*
	    - Remove single-line comments that contain would-be multi-line delimiters
	        E.g. // Comment /* <--
	    - Remove multi-line comments that contain would be single-line delimiters
	        E.g. /* // <-- 
	   */
	    .replace(/\/\/.*?\/?\*.+?(?=\n|\r|$)|\/\*[\s\S]*?\/\/[\s\S]*?\*\//g, '')
	    
	    /*
	    Remove single and multi-line comments,
	    no consideration of inner-contents
	   */
	    .replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g, '')
	    
	    /*
	    Remove multi-line comments that have a replace ending (string/regex)
	    Greedy, so no inner strings/regexes will stop it.
	   */
	    .replace(RegExp('\\/\\*[\\s\\S]+' + uid + '\\d+', 'g'), '')
	    
	    /* Bring back strings & regexes */
	    .replace(RegExp(uid + '(\\d+)', 'g'), function(match, n){
	        return primatives[n];
	    })
	);
};

module.exports = utils;