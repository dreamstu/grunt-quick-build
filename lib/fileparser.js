var parser = {};

parser.parse = function(ext,content){
	switch (ext) {
		case '.tpl':
			content = "return '" + content.replace(/\s/g, ' ') + "'";
			break;
		default:
			break;
	}
	return content;
}

module.exports = parser;