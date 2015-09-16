//默认配置
var conf = {
	wrap:{
		prefix:'define(function(require, exports, module) {',
		suffix:'});'
	},
	reg:{
		has_define:/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*define|(?:^|[^$])\b(def)(ine)\s*\(/g,
		define:/define\(\s*(['"](.+?)['"],)?/,
		require:/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,
		inner_require:/require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
		requireAsync:/(require\.async\(["'](.+)["'])/g,
		hash:/[\?#].*$/,
		modId:/([^\\\/?]+?)(\.(?:js))?([\?#].*)?$/
	},
	//压缩的选项
	options: {
		id: 'modules',
		uglify:true,
		// uglifyops
		//http://lisperator.net/uglifyjs/compress
		options: {
			global_defs: {
			}
		},
		//http://lisperator.net/uglifyjs/codegen 
		output: {
			indent_level: 2,
			ascii_only: true//unicode编码输出
		}
	}
};
module.exports = conf;