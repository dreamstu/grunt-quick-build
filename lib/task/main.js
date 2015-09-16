var path = require('path');
var fs = require('fs');

var uglify2 = require('../uglify2');
var _ = require('underscore');
var utils = require('../utils');
var qsobj = require('../qsobj');
var config = require('../config');
var fileparser = require('../fileparser');

module.exports = function(grunt) {
	
	var Log = grunt.log;

	grunt.registerMultiTask('build', 'build your cmd modules.', function() {
		//合并默认配置
		var options = this.options(config.options);
		var targetData = this.data;

		Log.debug('gruntfile config:',options);
		
		this.files.forEach(function(file) {
			this._obj_ = {};
			//规范cwd路径，去掉./开头，以/结尾。
			file.orig.cwd = path.normalize(file.orig.cwd+'/');

			var contents = file.src.filter(function(filepath) {
				if (!grunt.file.exists(filepath)) {
					Log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function(filepath) {
				var content = grunt.file.read(filepath);

				this._obj_ = qsobj.format(file,filepath);
				var pkgUrl = path.join(this._obj_.modulePath,'package.json');
				var pkg = JSON.parse(fs.readFileSync(pkgUrl,'utf8'));
				this._obj_.pkg = pkg;
				//默认使用options中配置的id
				var idleading = options.id;
				if(targetData.id){//target中配置了id就使用target中的，就近原则
					idleading = targetData.id;
				}
				this._obj_.idleading = [idleading,pkg.name,pkg.version,this._obj_.fileInnerPath].join('/')	
				.replace('//','/')
				.replace(this._obj_.ext,'');

				//混入用户alias配置
				var ops = {
					alias:this._obj_.pkg.alias || {},
					id:options.id
				};
				Log.debug('混入用户配置ops:',ops);

				//文件内容转换
				content = fileparser.parse(this._obj_.ext,content);
				//自动包装
				this._obj_.hasDefine = false;
    			content.replace( config.reg.has_define, function(m, m1, m2){ if(m2) { this._obj_.hasDefine = true; } return m; });
				if(!this._obj_.hasDefine){
					content = [config.wrap.prefix, content, config.wrap.suffix].join('\n');
    			}

    			//解析依赖数组

				var deps = utils.drawDependencies(config.reg.require, content);
				Log.debug('deps:',deps);

				//解析出异步加载的依赖数组，并于同步的合并在一起
				deps = deps.concat(utils.drawDependencies(config.reg.requireAsync, content));
				Log.debug('depsAsync:',deps);

				//deps中存在所有依赖mod信息

				deps = _.map(deps,function(dep){
					dep.idleading = utils.transferModId2user(ops,dep.format);
					return dep;
				});

				//先将代码中的注释去掉，防止正则出错
				content = utils.removeComments(content);

				//解析依赖关系id数组
				var idleadings = deps.map(function(dep) {
					return dep.idleading;
				});
				
				//define
				content = content.replace(config.reg.define, function() {
					var id = this._obj_.idleading;
					depNames = utils.transferModIds2user(ops,idleadings);
					Log.debug('解释自定义id列表：',depNames);
					return "define('" + id + "',"+ (idleadings.length ? ("['"+idleadings.join("','")+"'],"):(""));
				});

				//提取的所有的modobj raw-->idleading
				var maps = {};
				_.each(deps,function(dep){
					maps[dep.raw] = dep.idleading;
				});

				Log.debug('raw-->idleading：',depNames);

				//替换同步加载的 modId
				content = content.replace(config.reg.inner_require, function(rawStr, rawId) {
					return "require('" + maps[rawId] + "')";
				});

				//替换异步加载的 modId
				content = content.replace(config.reg.requireAsync, function($not1, $not2, rawId) {
					return "require.async('" + maps[rawId] + "'";
				});

				//返回处理结果
				return content;
			}).join('\n');

			//文件的路径相对与cwd的路径
			var dest = path.normalize(path.join(
				file.orig.dest,
				this._obj_.idleading+this._obj_.ext
			));

			//压缩混淆
			if (options.uglify) {
				try {
					contents = uglify2.min(contents,options).code;
				} catch (e) {
					Log.error('ERROR：（配置可能有误）压缩代码失败：' + e);
				}
			}
			
			switch (_obj_.ext) {
				case '.tpl':
					dest = dest.replace(this._obj_.ext, '.js');
					break;
			}
			grunt.file.write(dest, contents);
			Log.writeln('File "' + dest + '" created.');
		});
	});

	return grunt;
}