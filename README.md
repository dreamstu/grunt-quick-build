#grunt-quick-build

> 构建seajs模块。提取替换ID，压缩混淆。

This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-quick-build --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-quick-build');
```

## The "build" task

### Overview

```{js}
grunt.initConfig({
	build: {
		options: {
			uglify: true
		},
		main: {
			id: "modules",
			expand: true,
			cwd: "./src/modules",
			src: ["*/src/**/*.js", "*/src/**/*.tpl", "*/index.js","!*/test/"],
			dest: "./dest",
		}
	}
});
```

### Options

#### options.id
类型   : `String`
默认值 : `"modules"`

模块id前缀。

#### options.uglify
类型   : `Boolean`
默认值 : `"true"`

是否开启压缩混淆。

#### options.options
类型   : `Object`
默认值 : `"{}"`

压缩混淆options选项，详情请参考_http://lisperator.net/uglifyjs/compress_

#### options.output
类型   : `Object`
默认值 : `"{
	indent_level: 2, //tab为2个空格
	ascii_only: true//unicode编码输出
}"`

压缩混淆options选项，详情请参考_http://lisperator.net/uglifyjs/codegen_

#### options.output
类型   : `Object`
默认值 : `"{
	indent_level: 2, //tab为2个空格
	ascii_only: true//unicode编码输出
}"`

压缩混淆options选项，详情请参考_http://lisperator.net/uglifyjs/codegen_

### Target

### id
类型   : `String`
默认值 : `""`

代表模块模块id前缀，若设置将会覆盖options中的id属性。就近原则












