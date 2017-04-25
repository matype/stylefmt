'use strict'

var postcss = require('postcss')
var valueParser = require('postcss-value-parser')

// 老式方向关键字转换
var directionMap = {
	'top': 'bottom',
	'bottom': 'top',
	'left': 'right',
	'right': 'left',
}

// 需要转换的旧关键字
var keyWordMap = {
	cover: 'farthest-corner',
	contain: 'closest-side',
}

// 各种角度单位与deg之间的换算关系 https://developer.mozilla.org/zh-CN/docs/Web/CSS/angle
var angleUnitMap = {
	grad: 400,
	rad: 2 * Math.PI,
	turn: 1,
}

// 各种长度单位与deg之间的换算关系 https://developer.mozilla.org/en-US/docs/Web/CSS/length
var lengthUnitMap = {
	'%': 1,
	'in': 96,
	ch: 6,
	cm: 37.79527559055118,
	em: 12,
	ex: 5.4376,
	mm: 3.7795275590551185,
	pc: 16,
	pt: 1.3333333333333333,
	q: 0.9448818897637796,
	rem: 16,
	vh: 960,
	vm: 640,
	vmax: 960,
	vmin: 640,
	vw: 640,
}

// 角度转为关键字
var degMap = {
	0: 'top',
	90: 'right',
	180: 'bottom',
	270: 'left',
}

/**
 * 将字符串转为数字与其单位
 * @param  {String} string 含有数字的字符串
 * @returns {Float} num    解析好的数字
 * @returns {Float} unit   原有的单位
 */
function parseNum (string) {
	var unit
	var num = parseFloat(string.replace(/(\D+)$/, function (s) {
		unit = s
		return ''
	}))
	if (!isNaN(num)) {
		return {
			num: num,
			unit: unit || '',
		}
	}
}

/**
 * 将字符串转为px为单位长度数值
 * @param  {String}    string 含有长度信息的字符串
 * @return {Float}     换算成像素的数值
 */
function parseLength (string) {
	var value = parseNum(string)
	if (value) {
		if (value.num === 0 || !value.unit || value.unit === 'px') {
			// 没有长度单位，或数值为0，或长度单位为像素，则无需换算
			return value.num
		} else if (lengthUnitMap[value.unit]) {
			// 不同长度单位间的换算
			return value.num * lengthUnitMap[value.unit]
		}
	}
}

/**
 * 将字符串转为长度与其单位
 * @param   {String} string 含有数字的字符串
 * @returns {Float}  deg    换算成度的数字
 * @returns {Float}  num    解析好的数字
 * @returns {Float}  unit   原有的单位
 */
function parseAngle (string) {
	var value = parseNum(string)
	if (value) {
		if (value.num === 0 || !value.unit || value.unit === 'deg') {
			// 没有角度单位，或数值为0，或角度单位为度，则无需换算
			value.deg = value.num
		} else if (angleUnitMap[value.unit]) {
			// 不同角度单位间的换算
			value.deg = value.num * 360 / angleUnitMap[value.unit]
		} else {
			return
		}
		// 修正为w3c语法的角度。0°为上方而非右方
		value.deg = require('normalize-range').wrap(0, 360, 90 - value.deg)
		return value
	}
}

/**
 * 将解析后的数字对象转换为字符串
 * @param  {Object} angleObj 数字对象
 * @param  {Object} angleObj.deg 以度为单位的角度
 * @param  {Object} angleObj.unit 希望使用的单位
 * @return {String}          按格式输出的字符串
 */
function angle2String (angleObj) {
	var deg = angleObj.deg
	if (angleObj.unit && angleObj.unit !== 'deg') {
		// 单位不为度是，需要换算
		deg = (deg * angleUnitMap[angleObj.unit] / 360)
	}

	// 修正浮点数精度
	deg = parseFloat(deg.toFixed(4))
	if (deg === 0) {
		// 结果等于0时，直接转换为字符串输出，不要单位
		deg = '0'
	} else {
		// 结果不为0时，补上单位
		deg += angleObj.unit || 'deg'
	}
	return deg
}

/**
 * 分析css参数中的坐标信息
 * @param   {String[]} args  包含坐标信息的两个字符串组成的数组
 * @returns {Int} x          [x轴坐标]
 * @returns {Int} y          [y轴坐标]
 */
function normalizePos (args) {
	var point = {}
	args.forEach(function (arg, i) {
		if (arg === 'top') {
			point.y = 0
		} else if (arg === 'right') {
			point.x = 100
		} else if (arg === 'bottom') {
			point.y = 100
		} else if (arg === 'left') {
			point.x = 0
		} else {
			// 将长度单位转换为坐标
			point[i ? 'y' : 'x'] = parseLength(arg)
		}
	})
	return point
}

/**
 * 将长度字符串转换为以px为单位的字符串
 * @param  {String} val 表示长度的css表达式字符串
 * @return {String}     以px为单位的数字字符串
 */
function px (val) {
	try {
		val = parseFloat(parseLength(val).toFixed(4))
		if (val === 0) {
			return '0'
		} else {
			return val + 'px'
		}
	} catch (ex) {
		return val
	}
}

/**
 * `-webkit-gradient(linear, `根据参数位置与尺寸，返回修正顺序与语法的这两个参数
 * @param  {Array} args -webkit-gradient的参数，去除第一个参数type和所有color-stop
 * @return {Array}      `[ '90px', 'at', '0px', '150px' ]`
 */
function fixOldRadialGradient (args) {
	var position = args[0]
	if (position && position[0] && position[1]) {
		// 第一个参数为坐标，则将这个参数中的值的单位转换为px
		position = position.map(px)
		// 在坐标参数最前面添加`at`关键字
		position.unshift('at')

		var size = args[3] && args[3][0]
		if (size != null) {
			// 将尺寸信息加入结果集
			position.unshift(px(size))
		}
		// 返回结果
		return position
	}
}

/**
 * `-webkit-gradient(linear, `根据传入的参数计算角度，返回角度参摄
 * @param  {Array} args -webkit-gradient的参数，去除第一个参数type和所有color-stop
 * @return {String|undefined}      角度值表达式，当角度正好180°时，返回undefined
 */
function fixOldLinearGradient (args) {
	var angle
	// 从args[0]中获取起始点信息
	var start = normalizePos(args[0])
	// 从args[1]中获取终止点信息
	var end = normalizePos(args[1])


	// 根据起始点和终止点计算角度
	angle = 180 - Math.atan2(end.x - start.x, end.y - start.y) * (180 / Math.PI)
	// 将角度进行坐标系变换
	angle = require('normalize-range').wrap(0, 360, angle)
	// 如果角度不等于180°，将其转换为字符串后返回
	if (angle !== 180) {
		angle = angle2String({
			deg: angle,
		})
		return angle
	}
}

/**
 * `-webkit-gradient`转`radial-gradient`或`linear-gradient`
 * @param  {Array} args      修正前的参数
 * @param  {Node}  gradient  原始的node对象
 * @return {Array}           修正后的参数
 */
function fixOldGradient (args, gradient) {
	var type = args[0][0]
	var colorStops = []
	var from
	var to

	// 将参数中的`color-stop`,`from`,`to`三种信息剔除出args并单独存放，剩下的存起来
	args = args.slice(1).filter(function (arg) {
		var fnName = arg.value
		if (fnName === 'from') {
			from = arg
		} else if (fnName === 'to') {
			to = arg
		} else if (fnName === 'color-stop') {
			colorStops.push(arg)
		} else {
			return true
		}
		return false
	})

	if (from) {
		// 将from信息放入colorStops头部
		colorStops.unshift(from)
	}
	if (to) {
		// 将from信息放入colorStops尾部
		colorStops.push(to)
	}

	// 将数组colorStops中的元素都转换为标准形式
	colorStops = colorStops.map(function parseColorStop (colorStop, i) {
		// 获取colorStop的参数
		colorStop = colorStop.nodes
		// 如果不知一个参数
		if (colorStop.length > 1) {
			// 计算位置信息的浏览器默认值
			var posVal = i * 100 / (colorStops.length - 1)
			colorStop = colorStop.filter(function (val) {
				// 如果位置信息与浏览器默认值相同，去除它
				return parseFloat(val) !== posVal
			})

			if (colorStop.length > 1) {
				// 参数重新排列，位置信息放在后面，以便符合新语法
				colorStop.sort(function (word) {
					return isNaN(parseFloat(word)) ? -1 : 1
				})
			}
		}
		return colorStop
	})

	if (type === 'radial') {
		// 按照圆形渐变语法处理剩下的参数
		args = fixOldRadialGradient(args)
	} else {
		// 按照线性渐变语法处理剩下的参数
		args = fixOldLinearGradient(args)
	}

	if (args && args.length) {
		// 将`fixOldRadialGradient`或`fixOldLinearGradient`的返回结果插入colorStops
		colorStops.unshift(args)
	}
	// 将css属性名名称转换为标准的
	gradient.value = type + '-gradient'
	return colorStops
}

/**
 * 修正`linear-gradient`的参数
 * @param  {Array} args linear-gradient的所有参数
 * @return {Array}      修正后的参数
 */
function fixLinearGradient (args) {
	var angle = parseAngle(args[0][0])

	if (angle) {
		// 如果第一参数是角度，修正角度
		var deg = Math.round(angle.deg)
		if (deg === 180) {
			// 180°正是浏览器默认值，所以抛弃，减少生成的css的体积
			args.shift()
		} else {
			if (degMap[deg]) {
				// 如果角度是0、90、180、270等特殊值，将第一参变为方位信息
				args[0] = ['to', degMap[deg]]
			} else {
				// 其他角度值，直接转换第一参即可
				args[0] = angle2String(angle)
			}
		}
	} else {
		var position
		// 遍历第一参中的值，
		args[0].forEach(function (arg, i) {
			if (directionMap[arg]) {
				// 将top、left、bottom、right取反义词，并记录position
				args[0][i] = directionMap[arg]
				position = args[0]
			}
		})
		if (position) {
			if (position.length === 1 && position[0] === 'bottom') {
				// `to bottom`正是浏览器默认值，所以抛弃，减少生成的css的体积
				args.shift()
			} else {
				// 将方位信息最前面添加一个"to"二级参数
				position.unshift('to')
			}
		}
	}

	return args
}

/**
 * 圆形渐变处理
 * @param  {Array} args linear-gradient的所有参数
 * @return {Array}      修正后的参数
 */
function fixRadialGradient (args) {

	var firstArg = []
	var position

	// 分析所有参数，将坐标参数和关键字剔除出args并单独保存
	args = args.filter(function (subArg) {
		var hasKeyWord
		subArg.forEach(function (word, i) {
			if (keyWordMap[word]) {
				// 查找需要转换的关键字
				subArg[i] = keyWordMap[word]
				hasKeyWord = true
			} else if (/^(?:circle|ellipse|\w+-\w+)$/.test(word)) {
				// 查找是否有其他的关键字
				hasKeyWord = true
			}
		})
		if (hasKeyWord) {
			// subArg中如果有关键字，将它存入firstArg
			firstArg = firstArg.concat(subArg)
			return false
		} else if (subArg.every(function (word) {
			return word === 'center' || directionMap[word] || parseNum(word)
		})) {
			// 如果subArg是坐标信息将它存入position
			position = subArg
			return false
		}
		return true
	})

	if (position) {
		// 在坐标参数最前面添加`at`关键字
		position.unshift('at')
		firstArg = firstArg.concat(position)
	}

	if (firstArg.length) {
		// 如果收集到了firstArg，将其加入args的最前面
		args.unshift(firstArg)
	}

	return args
}

/**
 * `radial-gradient`或`linear-gradient`去前缀并转换语法
 * @param  {Node} gradient   `postcss-value-parser`插件转换后的-webkit-gradient
 * @param  {String} type   `radial`或`linear`
 * @return {Array}      修正后的参数
 */
function fixGradient (gradient, type) {
	if (type === 'radial') {
		// 圆形渐变处理
		return fixRadialGradient(gradient)
	} else {
		// 线性渐变处理
		return fixLinearGradient(gradient)
	}
}

/**
 * 将语法树中的function节点转换为便于处理的形式
 * 返回值二维数组
 * @param  {Node} node 语法树节点，type必须为function
 * @return {Array}     二维数组
 */
function parseFunction (node) {
	var args = []
	var index = 0
	node.nodes.forEach(function (subNode) {
		if (subNode.type === 'div' && subNode.value === ',') {
			// 遇到`,`下标自加1
			index++
			return
		} else if (subNode.type === 'function') {
			// 将参数中的`color-stop`,`from`,`to`三种function特殊处理
			if ((subNode.value === 'from' || subNode.value === 'to' || subNode.value === 'color-stop')) {
				var colorStop = subNode.nodes.filter(function (colorStopInfo) {
					// colorStop的子节点，除function和word外，都丢去
					return colorStopInfo.type === 'function' || colorStopInfo.type === 'word'
				}).map(function (colorStopInfo) {
					// colorStop的子节点，转换为字符串
					return valueParser.stringify(colorStopInfo)
				})

				// 组装新的对象传递出去
				colorStop = {
					nodes: colorStop,
					type: 'function',
					value: subNode.value,
				}

				// 不使用第三个数组维度，而是将其存在最上面的维度上
				return args[index] = colorStop
			}
		} else if (subNode.type !== 'word') {
			return
		}

		if (!args[index]) {
			// 如果未初始化该数组维度，对其初始化
			args[index] = []
		}
		// 未特殊处理的function，还有普通的word，将其转字符串
		args[index].push(valueParser.stringify(subNode))
	})
	// 返回转换后的数组
	return args
}

// 将二维数组降维，并转换为字符串
function stringifyArg (arg) {
	if (Array.isArray(arg)) {
		// 递归方式处理数组的更高维度
		return arg.map(stringifyArg).join(' ')
	} else {
		return String(arg)
	}
}

/**
 * 将二维数组作为参数，重写type为function的语法树节点，type会变为word
 * @param  {Node} gradient 语法树节点
 * @param  {Node} args     修正后的参数
 */
function stringifyGradient (gradient, args) {
	// 将参数还原成节点
	gradient.value = gradient.value + '(' + args.map(stringifyArg).join(', ') + ')'
	gradient.type = 'word'
	delete gradient.nodes
}

module.exports = function (node) {
    if (node.type === 'function') {
      if (/^-\w+-gradient$/.test(node.value)) {
        // 修复老式webkit语法的gradient
        stringifyGradient(node, fixOldGradient(parseFunction(node), node))
      } else if (/^-\w+-(?:\w+-)?(\w+)-gradient$/.test(node.value)) {
        var type = RegExp.$1
        // 修复gradient的前缀
        node.value = postcss.vendor.unprefixed(node.value)
        // 修复gradient的值
        stringifyGradient(node, fixGradient(parseFunction(node), type))
      } else {
        return
      }
      return node
    }
}
