var path = require('path');
var fs = require('fs');

var _ = {};

/***
// 当cwd设置为：app/modules
// path.parse('app/modules/module/src/file.txt')
// {
//     root : "",
//     dir : "app/modules/module/src",
//     base : "file.txt",
//     ext : ".txt",
//     name : "file",
//	   realpath: "module/src/file.txt"
//	   moduleName: "module"
//	   modulePath: "app/modules/module",
//	   innerPath: "src"
// }
**/
_.format = function(file,filepath){
	var obj = path.parse(filepath);
	obj.realpath = filepath.replace(file.orig.cwd,'');
	obj.moduleName = obj.realpath.split('/')[0];
	obj.modulePath = path.join(file.orig.cwd,obj.moduleName);
	obj.inner = path.relative(obj.modulePath,obj.dir);
	obj.fileInnerPath = path.relative(obj.modulePath,file.src[0]);
	obj.depsMap = {};
	obj.idMap = {};
	return obj;
}

module.exports = _;

