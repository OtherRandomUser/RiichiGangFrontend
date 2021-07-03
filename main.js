(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEBUG mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});




// HELPERS


function _Debugger_unsafeCoerce(value)
{
	return value;
}



// PROGRAMS


var _Debugger_element = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		A3($elm$browser$Debugger$Main$wrapInit, _Json_wrap(debugMetadata), _Debugger_popout(), impl.init),
		$elm$browser$Debugger$Main$wrapUpdate(impl.update),
		$elm$browser$Debugger$Main$wrapSubs(impl.subscriptions),
		function(sendToApp, initialModel)
		{
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			var currNode = _VirtualDom_virtualize(domNode);
			var currBlocker = $elm$browser$Debugger$Main$toBlockerType(initialModel);
			var currPopout;

			var cornerNode = _VirtualDom_doc.createElement('div');
			domNode.parentNode.insertBefore(cornerNode, domNode.nextSibling);
			var cornerCurr = _VirtualDom_virtualize(cornerNode);

			initialModel.popout.a = sendToApp;

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = A2(_VirtualDom_map, $elm$browser$Debugger$Main$UserMsg, view($elm$browser$Debugger$Main$getUserModel(model)));
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;

				// update blocker

				var nextBlocker = $elm$browser$Debugger$Main$toBlockerType(model);
				_Debugger_updateBlocker(currBlocker, nextBlocker);
				currBlocker = nextBlocker;

				// view corner

				var cornerNext = $elm$browser$Debugger$Main$cornerView(model);
				var cornerPatches = _VirtualDom_diff(cornerCurr, cornerNext);
				cornerNode = _VirtualDom_applyPatches(cornerNode, cornerCurr, cornerPatches, sendToApp);
				cornerCurr = cornerNext;

				if (!model.popout.b)
				{
					currPopout = undefined;
					return;
				}

				// view popout

				_VirtualDom_doc = model.popout.b; // SWITCH TO POPOUT DOC
				currPopout || (currPopout = _VirtualDom_virtualize(model.popout.b));
				var nextPopout = $elm$browser$Debugger$Main$popoutView(model);
				var popoutPatches = _VirtualDom_diff(currPopout, nextPopout);
				_VirtualDom_applyPatches(model.popout.b.body, currPopout, popoutPatches, sendToApp);
				currPopout = nextPopout;
				_VirtualDom_doc = document; // SWITCH BACK TO NORMAL DOC
			});
		}
	);
});


var _Debugger_document = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		A3($elm$browser$Debugger$Main$wrapInit, _Json_wrap(debugMetadata), _Debugger_popout(), impl.init),
		$elm$browser$Debugger$Main$wrapUpdate(impl.update),
		$elm$browser$Debugger$Main$wrapSubs(impl.subscriptions),
		function(sendToApp, initialModel)
		{
			var divertHrefToApp = impl.setup && impl.setup(function(x) { return sendToApp($elm$browser$Debugger$Main$UserMsg(x)); });
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			var currBlocker = $elm$browser$Debugger$Main$toBlockerType(initialModel);
			var currPopout;

			initialModel.popout.a = sendToApp;

			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view($elm$browser$Debugger$Main$getUserModel(model));
				var nextNode = _VirtualDom_node('body')(_List_Nil)(
					_Utils_ap(
						A2($elm$core$List$map, _VirtualDom_map($elm$browser$Debugger$Main$UserMsg), doc.body),
						_List_Cons($elm$browser$Debugger$Main$cornerView(model), _List_Nil)
					)
				);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);

				// update blocker

				var nextBlocker = $elm$browser$Debugger$Main$toBlockerType(model);
				_Debugger_updateBlocker(currBlocker, nextBlocker);
				currBlocker = nextBlocker;

				// view popout

				if (!model.popout.b) { currPopout = undefined; return; }

				_VirtualDom_doc = model.popout.b; // SWITCH TO POPOUT DOC
				currPopout || (currPopout = _VirtualDom_virtualize(model.popout.b));
				var nextPopout = $elm$browser$Debugger$Main$popoutView(model);
				var popoutPatches = _VirtualDom_diff(currPopout, nextPopout);
				_VirtualDom_applyPatches(model.popout.b.body, currPopout, popoutPatches, sendToApp);
				currPopout = nextPopout;
				_VirtualDom_doc = document; // SWITCH BACK TO NORMAL DOC
			});
		}
	);
});


function _Debugger_popout()
{
	return {
		b: undefined,
		a: undefined
	};
}

function _Debugger_isOpen(popout)
{
	return !!popout.b;
}

function _Debugger_open(popout)
{
	return _Scheduler_binding(function(callback)
	{
		_Debugger_openWindow(popout);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}

function _Debugger_openWindow(popout)
{
	var w = $elm$browser$Debugger$Main$initialWindowWidth,
		h = $elm$browser$Debugger$Main$initialWindowHeight,
	 	x = screen.width - w,
		y = screen.height - h;

	var debuggerWindow = window.open('', '', 'width=' + w + ',height=' + h + ',left=' + x + ',top=' + y);
	var doc = debuggerWindow.document;
	doc.title = 'Elm Debugger';

	// handle arrow keys
	doc.addEventListener('keydown', function(event) {
		event.metaKey && event.which === 82 && window.location.reload();
		event.key === 'ArrowUp'   && (popout.a($elm$browser$Debugger$Main$Up  ), event.preventDefault());
		event.key === 'ArrowDown' && (popout.a($elm$browser$Debugger$Main$Down), event.preventDefault());
	});

	// handle window close
	window.addEventListener('unload', close);
	debuggerWindow.addEventListener('unload', function() {
		popout.b = undefined;
		popout.a($elm$browser$Debugger$Main$NoOp);
		window.removeEventListener('unload', close);
	});

	function close() {
		popout.b = undefined;
		popout.a($elm$browser$Debugger$Main$NoOp);
		debuggerWindow.close();
	}

	// register new window
	popout.b = doc;
}



// SCROLL


function _Debugger_scroll(popout)
{
	return _Scheduler_binding(function(callback)
	{
		if (popout.b)
		{
			var msgs = popout.b.getElementById('elm-debugger-sidebar');
			if (msgs && msgs.scrollTop !== 0)
			{
				msgs.scrollTop = 0;
			}
		}
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


var _Debugger_scrollTo = F2(function(id, popout)
{
	return _Scheduler_binding(function(callback)
	{
		if (popout.b)
		{
			var msg = popout.b.getElementById(id);
			if (msg)
			{
				msg.scrollIntoView(false);
			}
		}
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});



// UPLOAD


function _Debugger_upload(popout)
{
	return _Scheduler_binding(function(callback)
	{
		var doc = popout.b || document;
		var element = doc.createElement('input');
		element.setAttribute('type', 'file');
		element.setAttribute('accept', 'text/json');
		element.style.display = 'none';
		element.addEventListener('change', function(event)
		{
			var fileReader = new FileReader();
			fileReader.onload = function(e)
			{
				callback(_Scheduler_succeed(e.target.result));
			};
			fileReader.readAsText(event.target.files[0]);
			doc.body.removeChild(element);
		});
		doc.body.appendChild(element);
		element.click();
	});
}



// DOWNLOAD


var _Debugger_download = F2(function(historyLength, json)
{
	return _Scheduler_binding(function(callback)
	{
		var fileName = 'history-' + historyLength + '.txt';
		var jsonString = JSON.stringify(json);
		var mime = 'text/plain;charset=utf-8';
		var done = _Scheduler_succeed(_Utils_Tuple0);

		// for IE10+
		if (navigator.msSaveBlob)
		{
			navigator.msSaveBlob(new Blob([jsonString], {type: mime}), fileName);
			return callback(done);
		}

		// for HTML5
		var element = document.createElement('a');
		element.setAttribute('href', 'data:' + mime + ',' + encodeURIComponent(jsonString));
		element.setAttribute('download', fileName);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
		callback(done);
	});
});



// POPOUT CONTENT


function _Debugger_messageToString(value)
{
	if (typeof value === 'boolean')
	{
		return value ? 'True' : 'False';
	}

	if (typeof value === 'number')
	{
		return value + '';
	}

	if (typeof value === 'string')
	{
		return '"' + _Debugger_addSlashes(value, false) + '"';
	}

	if (value instanceof String)
	{
		return "'" + _Debugger_addSlashes(value, true) + "'";
	}

	if (typeof value !== 'object' || value === null || !('$' in value))
	{
		return '…';
	}

	if (typeof value.$ === 'number')
	{
		return '…';
	}

	var code = value.$.charCodeAt(0);
	if (code === 0x23 /* # */ || /* a */ 0x61 <= code && code <= 0x7A /* z */)
	{
		return '…';
	}

	if (['Array_elm_builtin', 'Set_elm_builtin', 'RBNode_elm_builtin', 'RBEmpty_elm_builtin'].indexOf(value.$) >= 0)
	{
		return '…';
	}

	var keys = Object.keys(value);
	switch (keys.length)
	{
		case 1:
			return value.$;
		case 2:
			return value.$ + ' ' + _Debugger_messageToString(value.a);
		default:
			return value.$ + ' … ' + _Debugger_messageToString(value[keys[keys.length - 1]]);
	}
}


function _Debugger_init(value)
{
	if (typeof value === 'boolean')
	{
		return A3($elm$browser$Debugger$Expando$Constructor, $elm$core$Maybe$Just(value ? 'True' : 'False'), true, _List_Nil);
	}

	if (typeof value === 'number')
	{
		return $elm$browser$Debugger$Expando$Primitive(value + '');
	}

	if (typeof value === 'string')
	{
		return $elm$browser$Debugger$Expando$S('"' + _Debugger_addSlashes(value, false) + '"');
	}

	if (value instanceof String)
	{
		return $elm$browser$Debugger$Expando$S("'" + _Debugger_addSlashes(value, true) + "'");
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (tag === '::' || tag === '[]')
		{
			return A3($elm$browser$Debugger$Expando$Sequence, $elm$browser$Debugger$Expando$ListSeq, true,
				A2($elm$core$List$map, _Debugger_init, value)
			);
		}

		if (tag === 'Set_elm_builtin')
		{
			return A3($elm$browser$Debugger$Expando$Sequence, $elm$browser$Debugger$Expando$SetSeq, true,
				A3($elm$core$Set$foldr, _Debugger_initCons, _List_Nil, value)
			);
		}

		if (tag === 'RBNode_elm_builtin' || tag == 'RBEmpty_elm_builtin')
		{
			return A2($elm$browser$Debugger$Expando$Dictionary, true,
				A3($elm$core$Dict$foldr, _Debugger_initKeyValueCons, _List_Nil, value)
			);
		}

		if (tag === 'Array_elm_builtin')
		{
			return A3($elm$browser$Debugger$Expando$Sequence, $elm$browser$Debugger$Expando$ArraySeq, true,
				A3($elm$core$Array$foldr, _Debugger_initCons, _List_Nil, value)
			);
		}

		if (typeof tag === 'number')
		{
			return $elm$browser$Debugger$Expando$Primitive('<internals>');
		}

		var char = tag.charCodeAt(0);
		if (char === 35 || 65 <= char && char <= 90)
		{
			var list = _List_Nil;
			for (var i in value)
			{
				if (i === '$') continue;
				list = _List_Cons(_Debugger_init(value[i]), list);
			}
			return A3($elm$browser$Debugger$Expando$Constructor, char === 35 ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(tag), true, $elm$core$List$reverse(list));
		}

		return $elm$browser$Debugger$Expando$Primitive('<internals>');
	}

	if (typeof value === 'object')
	{
		var dict = $elm$core$Dict$empty;
		for (var i in value)
		{
			dict = A3($elm$core$Dict$insert, i, _Debugger_init(value[i]), dict);
		}
		return A2($elm$browser$Debugger$Expando$Record, true, dict);
	}

	return $elm$browser$Debugger$Expando$Primitive('<internals>');
}

var _Debugger_initCons = F2(function initConsHelp(value, list)
{
	return _List_Cons(_Debugger_init(value), list);
});

var _Debugger_initKeyValueCons = F3(function(key, value, list)
{
	return _List_Cons(
		_Utils_Tuple2(_Debugger_init(key), _Debugger_init(value)),
		list
	);
});

function _Debugger_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');
	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}



// BLOCK EVENTS


function _Debugger_updateBlocker(oldBlocker, newBlocker)
{
	if (oldBlocker === newBlocker) return;

	var oldEvents = _Debugger_blockerToEvents(oldBlocker);
	var newEvents = _Debugger_blockerToEvents(newBlocker);

	// remove old blockers
	for (var i = 0; i < oldEvents.length; i++)
	{
		document.removeEventListener(oldEvents[i], _Debugger_blocker, true);
	}

	// add new blockers
	for (var i = 0; i < newEvents.length; i++)
	{
		document.addEventListener(newEvents[i], _Debugger_blocker, true);
	}
}


function _Debugger_blocker(event)
{
	if (event.type === 'keydown' && event.metaKey && event.which === 82)
	{
		return;
	}

	var isScroll = event.type === 'scroll' || event.type === 'wheel';
	for (var node = event.target; node; node = node.parentNode)
	{
		if (isScroll ? node.id === 'elm-debugger-details' : node.id === 'elm-debugger-overlay')
		{
			return;
		}
	}

	event.stopPropagation();
	event.preventDefault();
}

function _Debugger_blockerToEvents(blocker)
{
	return blocker === $elm$browser$Debugger$Overlay$BlockNone
		? []
		: blocker === $elm$browser$Debugger$Overlay$BlockMost
			? _Debugger_mostEvents
			: _Debugger_allEvents;
}

var _Debugger_mostEvents = [
	'click', 'dblclick', 'mousemove',
	'mouseup', 'mousedown', 'mouseenter', 'mouseleave',
	'touchstart', 'touchend', 'touchcancel', 'touchmove',
	'pointerdown', 'pointerup', 'pointerover', 'pointerout',
	'pointerenter', 'pointerleave', 'pointermove', 'pointercancel',
	'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop',
	'keyup', 'keydown', 'keypress',
	'input', 'change',
	'focus', 'blur'
];

var _Debugger_allEvents = _Debugger_mostEvents.concat('wheel', 'scroll');




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.expect.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.expect.b, xhr)); });
		$elm$core$Maybe$isJust(request.tracker) && _Http_track(router, xhr, request.tracker.a);

		try {
			xhr.open(request.method, request.url, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.url));
		}

		_Http_configureRequest(xhr, request);

		request.body.a && xhr.setRequestHeader('Content-Type', request.body.a);
		xhr.send(request.body.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.headers; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.timeout.a || 0;
	xhr.responseType = request.expect.d;
	xhr.withCredentials = request.allowCookiesFromOtherDomains;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		url: xhr.responseURL,
		statusCode: xhr.status,
		statusText: xhr.statusText,
		headers: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			sent: event.loaded,
			size: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			received: event.loaded,
			size: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}

function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}var $author$project$Main$LinkClicked = function (a) {
	return {$: 'LinkClicked', a: a};
};
var $author$project$Main$UrlChanged = function (a) {
	return {$: 'UrlChanged', a: a};
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Debugger$Expando$ArraySeq = {$: 'ArraySeq'};
var $elm$browser$Debugger$Overlay$BlockMost = {$: 'BlockMost'};
var $elm$browser$Debugger$Overlay$BlockNone = {$: 'BlockNone'};
var $elm$browser$Debugger$Expando$Constructor = F3(
	function (a, b, c) {
		return {$: 'Constructor', a: a, b: b, c: c};
	});
var $elm$browser$Debugger$Expando$Dictionary = F2(
	function (a, b) {
		return {$: 'Dictionary', a: a, b: b};
	});
var $elm$browser$Debugger$Main$Down = {$: 'Down'};
var $elm$browser$Debugger$Expando$ListSeq = {$: 'ListSeq'};
var $elm$browser$Debugger$Main$NoOp = {$: 'NoOp'};
var $elm$browser$Debugger$Expando$Primitive = function (a) {
	return {$: 'Primitive', a: a};
};
var $elm$browser$Debugger$Expando$Record = F2(
	function (a, b) {
		return {$: 'Record', a: a, b: b};
	});
var $elm$browser$Debugger$Expando$S = function (a) {
	return {$: 'S', a: a};
};
var $elm$browser$Debugger$Expando$Sequence = F3(
	function (a, b, c) {
		return {$: 'Sequence', a: a, b: b, c: c};
	});
var $elm$browser$Debugger$Expando$SetSeq = {$: 'SetSeq'};
var $elm$browser$Debugger$Main$Up = {$: 'Up'};
var $elm$browser$Debugger$Main$UserMsg = function (a) {
	return {$: 'UserMsg', a: a};
};
var $elm$browser$Debugger$Main$Export = {$: 'Export'};
var $elm$browser$Debugger$Main$Import = {$: 'Import'};
var $elm$browser$Debugger$Main$Open = {$: 'Open'};
var $elm$browser$Debugger$Main$OverlayMsg = function (a) {
	return {$: 'OverlayMsg', a: a};
};
var $elm$browser$Debugger$Main$Resume = {$: 'Resume'};
var $elm$browser$Debugger$Main$isPaused = function (state) {
	if (state.$ === 'Running') {
		return false;
	} else {
		return true;
	}
};
var $elm$browser$Debugger$History$size = function (history) {
	return history.numMessages;
};
var $elm$browser$Debugger$Overlay$Accept = function (a) {
	return {$: 'Accept', a: a};
};
var $elm$browser$Debugger$Overlay$Choose = F2(
	function (a, b) {
		return {$: 'Choose', a: a, b: b};
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$browser$Debugger$Overlay$goodNews1 = '\nThe good news is that having values like this in your message type is not\nso great in the long run. You are better off using simpler data, like\n';
var $elm$browser$Debugger$Overlay$goodNews2 = '\nfunction can pattern match on that data and call whatever functions, JSON\ndecoders, etc. you need. This makes the code much more explicit and easy to\nfollow for other readers (or you in a few months!)\n';
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $elm$html$Html$code = _VirtualDom_node('code');
var $elm$browser$Debugger$Overlay$viewCode = function (name) {
	return A2(
		$elm$html$Html$code,
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text(name)
			]));
};
var $elm$browser$Debugger$Overlay$addCommas = function (items) {
	if (!items.b) {
		return '';
	} else {
		if (!items.b.b) {
			var item = items.a;
			return item;
		} else {
			if (!items.b.b.b) {
				var item1 = items.a;
				var _v1 = items.b;
				var item2 = _v1.a;
				return item1 + (' and ' + item2);
			} else {
				var lastItem = items.a;
				var otherItems = items.b;
				return A2(
					$elm$core$String$join,
					', ',
					_Utils_ap(
						otherItems,
						_List_fromArray(
							[' and ' + lastItem])));
			}
		}
	}
};
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$browser$Debugger$Overlay$problemToString = function (problem) {
	switch (problem.$) {
		case 'Function':
			return 'functions';
		case 'Decoder':
			return 'JSON decoders';
		case 'Task':
			return 'tasks';
		case 'Process':
			return 'processes';
		case 'Socket':
			return 'web sockets';
		case 'Request':
			return 'HTTP requests';
		case 'Program':
			return 'programs';
		default:
			return 'virtual DOM values';
	}
};
var $elm$browser$Debugger$Overlay$viewProblemType = function (_v0) {
	var name = _v0.name;
	var problems = _v0.problems;
	return A2(
		$elm$html$Html$li,
		_List_Nil,
		_List_fromArray(
			[
				$elm$browser$Debugger$Overlay$viewCode(name),
				$elm$html$Html$text(
				' can contain ' + ($elm$browser$Debugger$Overlay$addCommas(
					A2($elm$core$List$map, $elm$browser$Debugger$Overlay$problemToString, problems)) + '.'))
			]));
};
var $elm$browser$Debugger$Overlay$viewBadMetadata = function (_v0) {
	var message = _v0.message;
	var problems = _v0.problems;
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('The '),
					$elm$browser$Debugger$Overlay$viewCode(message),
					$elm$html$Html$text(' type of your program cannot be reliably serialized for history files.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Functions cannot be serialized, nor can values that contain functions. This is a problem in these places:')
				])),
			A2(
			$elm$html$Html$ul,
			_List_Nil,
			A2($elm$core$List$map, $elm$browser$Debugger$Overlay$viewProblemType, problems)),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text($elm$browser$Debugger$Overlay$goodNews1),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('https://guide.elm-lang.org/types/custom_types.html')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('custom types')
						])),
					$elm$html$Html$text(', in your messages. From there, your '),
					$elm$browser$Debugger$Overlay$viewCode('update'),
					$elm$html$Html$text($elm$browser$Debugger$Overlay$goodNews2)
				]))
		]);
};
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$browser$Debugger$Overlay$Cancel = {$: 'Cancel'};
var $elm$browser$Debugger$Overlay$Proceed = {$: 'Proceed'};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$browser$Debugger$Overlay$viewButtons = function (buttons) {
	var btn = F2(
		function (msg, string) {
			return A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-right', '20px'),
						$elm$html$Html$Events$onClick(msg)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(string)
					]));
		});
	var buttonNodes = function () {
		if (buttons.$ === 'Accept') {
			var proceed = buttons.a;
			return _List_fromArray(
				[
					A2(btn, $elm$browser$Debugger$Overlay$Proceed, proceed)
				]);
		} else {
			var cancel = buttons.a;
			var proceed = buttons.b;
			return _List_fromArray(
				[
					A2(btn, $elm$browser$Debugger$Overlay$Cancel, cancel),
					A2(btn, $elm$browser$Debugger$Overlay$Proceed, proceed)
				]);
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'height', '60px'),
				A2($elm$html$Html$Attributes$style, 'line-height', '60px'),
				A2($elm$html$Html$Attributes$style, 'text-align', 'right'),
				A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(50, 50, 50)')
			]),
		buttonNodes);
};
var $elm$browser$Debugger$Overlay$viewMessage = F4(
	function (config, title, details, buttons) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('elm-debugger-overlay'),
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'width', '100vw'),
					A2($elm$html$Html$Attributes$style, 'height', '100vh'),
					A2($elm$html$Html$Attributes$style, 'color', 'white'),
					A2($elm$html$Html$Attributes$style, 'pointer-events', 'none'),
					A2($elm$html$Html$Attributes$style, 'font-family', '\'Trebuchet MS\', \'Lucida Grande\', \'Bitstream Vera Sans\', \'Helvetica Neue\', sans-serif'),
					A2($elm$html$Html$Attributes$style, 'z-index', '2147483647')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'width', '600px'),
							A2($elm$html$Html$Attributes$style, 'height', '100vh'),
							A2($elm$html$Html$Attributes$style, 'padding-left', 'calc(50% - 300px)'),
							A2($elm$html$Html$Attributes$style, 'padding-right', 'calc(50% - 300px)'),
							A2($elm$html$Html$Attributes$style, 'background-color', 'rgba(200, 200, 200, 0.7)'),
							A2($elm$html$Html$Attributes$style, 'pointer-events', 'auto')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '36px'),
									A2($elm$html$Html$Attributes$style, 'height', '80px'),
									A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(50, 50, 50)'),
									A2($elm$html$Html$Attributes$style, 'padding-left', '22px'),
									A2($elm$html$Html$Attributes$style, 'vertical-align', 'middle'),
									A2($elm$html$Html$Attributes$style, 'line-height', '80px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(title)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('elm-debugger-details'),
									A2($elm$html$Html$Attributes$style, 'padding', ' 8px 20px'),
									A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
									A2($elm$html$Html$Attributes$style, 'max-height', 'calc(100vh - 156px)'),
									A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(61, 61, 61)')
								]),
							details),
							A2(
							$elm$html$Html$map,
							config.wrap,
							$elm$browser$Debugger$Overlay$viewButtons(buttons))
						]))
				]));
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$virtual_dom$VirtualDom$nodeNS = function (tag) {
	return _VirtualDom_nodeNS(
		_VirtualDom_noScript(tag));
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$browser$Debugger$Overlay$viewShape = F4(
	function (x, y, angle, coordinates) {
		return A4(
			$elm$virtual_dom$VirtualDom$nodeNS,
			'http://www.w3.org/2000/svg',
			'polygon',
			_List_fromArray(
				[
					A2($elm$virtual_dom$VirtualDom$attribute, 'points', coordinates),
					A2(
					$elm$virtual_dom$VirtualDom$attribute,
					'transform',
					'translate(' + ($elm$core$String$fromFloat(x) + (' ' + ($elm$core$String$fromFloat(y) + (') rotate(' + ($elm$core$String$fromFloat(-angle) + ')'))))))
				]),
			_List_Nil);
	});
var $elm$browser$Debugger$Overlay$elmLogo = A4(
	$elm$virtual_dom$VirtualDom$nodeNS,
	'http://www.w3.org/2000/svg',
	'svg',
	_List_fromArray(
		[
			A2($elm$virtual_dom$VirtualDom$attribute, 'viewBox', '-300 -300 600 600'),
			A2($elm$virtual_dom$VirtualDom$attribute, 'xmlns', 'http://www.w3.org/2000/svg'),
			A2($elm$virtual_dom$VirtualDom$attribute, 'fill', 'currentColor'),
			A2($elm$virtual_dom$VirtualDom$attribute, 'width', '24px'),
			A2($elm$virtual_dom$VirtualDom$attribute, 'height', '24px')
		]),
	_List_fromArray(
		[
			A4(
			$elm$virtual_dom$VirtualDom$nodeNS,
			'http://www.w3.org/2000/svg',
			'g',
			_List_fromArray(
				[
					A2($elm$virtual_dom$VirtualDom$attribute, 'transform', 'scale(1 -1)')
				]),
			_List_fromArray(
				[
					A4($elm$browser$Debugger$Overlay$viewShape, 0, -210, 0, '-280,-90 0,190 280,-90'),
					A4($elm$browser$Debugger$Overlay$viewShape, -210, 0, 90, '-280,-90 0,190 280,-90'),
					A4($elm$browser$Debugger$Overlay$viewShape, 207, 207, 45, '-198,-66 0,132 198,-66'),
					A4($elm$browser$Debugger$Overlay$viewShape, 150, 0, 0, '-130,0 0,-130 130,0 0,130'),
					A4($elm$browser$Debugger$Overlay$viewShape, -89, 239, 0, '-191,61 69,61 191,-61 -69,-61'),
					A4($elm$browser$Debugger$Overlay$viewShape, 0, 106, 180, '-130,-44 0,86  130,-44'),
					A4($elm$browser$Debugger$Overlay$viewShape, 256, -150, 270, '-130,-44 0,86  130,-44')
				]))
		]));
var $elm$core$String$length = _String_length;
var $elm$browser$Debugger$Overlay$viewMiniControls = F2(
	function (config, numMsgs) {
		var string = $elm$core$String$fromInt(numMsgs);
		var width = $elm$core$String$fromInt(
			2 + $elm$core$String$length(string));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'bottom', '2em'),
					A2($elm$html$Html$Attributes$style, 'right', '2em'),
					A2($elm$html$Html$Attributes$style, 'width', 'calc(42px + ' + (width + 'ch)')),
					A2($elm$html$Html$Attributes$style, 'height', '36px'),
					A2($elm$html$Html$Attributes$style, 'background-color', '#1293D8'),
					A2($elm$html$Html$Attributes$style, 'color', 'white'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
					A2($elm$html$Html$Attributes$style, 'pointer-events', 'auto'),
					A2($elm$html$Html$Attributes$style, 'z-index', '2147483647'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					$elm$html$Html$Events$onClick(config.open)
				]),
			_List_fromArray(
				[
					$elm$browser$Debugger$Overlay$elmLogo,
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'padding-left', 'calc(1ch + 6px)'),
							A2($elm$html$Html$Attributes$style, 'padding-right', '1ch')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(string)
						]))
				]));
	});
var $elm$browser$Debugger$Overlay$explanationBad = '\nThe messages in this history do not match the messages handled by your\nprogram. I noticed changes in the following types:\n';
var $elm$browser$Debugger$Overlay$explanationRisky = '\nThis history seems old. It will work with this program, but some\nmessages have been added since the history was created:\n';
var $elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						$elm$core$List$cons,
						sep,
						A2($elm$core$List$cons, x, rest));
				});
			var spersed = A3($elm$core$List$foldr, step, _List_Nil, tl);
			return A2($elm$core$List$cons, hd, spersed);
		}
	});
var $elm$browser$Debugger$Overlay$viewMention = F2(
	function (tags, verbed) {
		var _v0 = A2(
			$elm$core$List$map,
			$elm$browser$Debugger$Overlay$viewCode,
			$elm$core$List$reverse(tags));
		if (!_v0.b) {
			return $elm$html$Html$text('');
		} else {
			if (!_v0.b.b) {
				var tag = _v0.a;
				return A2(
					$elm$html$Html$li,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(verbed),
							tag,
							$elm$html$Html$text('.')
						]));
			} else {
				if (!_v0.b.b.b) {
					var tag2 = _v0.a;
					var _v1 = _v0.b;
					var tag1 = _v1.a;
					return A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(verbed),
								tag1,
								$elm$html$Html$text(' and '),
								tag2,
								$elm$html$Html$text('.')
							]));
				} else {
					var lastTag = _v0.a;
					var otherTags = _v0.b;
					return A2(
						$elm$html$Html$li,
						_List_Nil,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$text(verbed),
							_Utils_ap(
								A2(
									$elm$core$List$intersperse,
									$elm$html$Html$text(', '),
									$elm$core$List$reverse(otherTags)),
								_List_fromArray(
									[
										$elm$html$Html$text(', and '),
										lastTag,
										$elm$html$Html$text('.')
									]))));
				}
			}
		}
	});
var $elm$browser$Debugger$Overlay$viewChange = function (change) {
	return A2(
		$elm$html$Html$li,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'margin', '8px 0')
			]),
		function () {
			if (change.$ === 'AliasChange') {
				var name = change.a;
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '1.5em')
							]),
						_List_fromArray(
							[
								$elm$browser$Debugger$Overlay$viewCode(name)
							]))
					]);
			} else {
				var name = change.a;
				var removed = change.b.removed;
				var changed = change.b.changed;
				var added = change.b.added;
				var argsMatch = change.b.argsMatch;
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '1.5em')
							]),
						_List_fromArray(
							[
								$elm$browser$Debugger$Overlay$viewCode(name)
							])),
						A2(
						$elm$html$Html$ul,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'list-style-type', 'disc'),
								A2($elm$html$Html$Attributes$style, 'padding-left', '2em')
							]),
						_List_fromArray(
							[
								A2($elm$browser$Debugger$Overlay$viewMention, removed, 'Removed '),
								A2($elm$browser$Debugger$Overlay$viewMention, changed, 'Changed '),
								A2($elm$browser$Debugger$Overlay$viewMention, added, 'Added ')
							])),
						argsMatch ? $elm$html$Html$text('') : $elm$html$Html$text('This may be due to the fact that the type variable names changed.')
					]);
			}
		}());
};
var $elm$browser$Debugger$Overlay$viewReport = F2(
	function (isBad, report) {
		switch (report.$) {
			case 'CorruptHistory':
				return _List_fromArray(
					[
						$elm$html$Html$text('Looks like this history file is corrupt. I cannot understand it.')
					]);
			case 'VersionChanged':
				var old = report.a;
				var _new = report.b;
				return _List_fromArray(
					[
						$elm$html$Html$text('This history was created with Elm ' + (old + (', but you are using Elm ' + (_new + ' right now.'))))
					]);
			case 'MessageChanged':
				var old = report.a;
				var _new = report.b;
				return _List_fromArray(
					[
						$elm$html$Html$text('To import some other history, the overall message type must' + ' be the same. The old history has '),
						$elm$browser$Debugger$Overlay$viewCode(old),
						$elm$html$Html$text(' messages, but the new program works with '),
						$elm$browser$Debugger$Overlay$viewCode(_new),
						$elm$html$Html$text(' messages.')
					]);
			default:
				var changes = report.a;
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								isBad ? $elm$browser$Debugger$Overlay$explanationBad : $elm$browser$Debugger$Overlay$explanationRisky)
							])),
						A2(
						$elm$html$Html$ul,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'list-style-type', 'none'),
								A2($elm$html$Html$Attributes$style, 'padding-left', '20px')
							]),
						A2($elm$core$List$map, $elm$browser$Debugger$Overlay$viewChange, changes))
					]);
		}
	});
var $elm$browser$Debugger$Overlay$view = F5(
	function (config, isPaused, isOpen, numMsgs, state) {
		switch (state.$) {
			case 'None':
				return isOpen ? $elm$html$Html$text('') : (isPaused ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('elm-debugger-overlay'),
							A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
							A2($elm$html$Html$Attributes$style, 'top', '0'),
							A2($elm$html$Html$Attributes$style, 'left', '0'),
							A2($elm$html$Html$Attributes$style, 'width', '100vw'),
							A2($elm$html$Html$Attributes$style, 'height', '100vh'),
							A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
							A2($elm$html$Html$Attributes$style, 'pointer-events', 'auto'),
							A2($elm$html$Html$Attributes$style, 'background-color', 'rgba(200, 200, 200, 0.7)'),
							A2($elm$html$Html$Attributes$style, 'color', 'white'),
							A2($elm$html$Html$Attributes$style, 'font-family', '\'Trebuchet MS\', \'Lucida Grande\', \'Bitstream Vera Sans\', \'Helvetica Neue\', sans-serif'),
							A2($elm$html$Html$Attributes$style, 'z-index', '2147483646'),
							$elm$html$Html$Events$onClick(config.resume)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '80px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Click to Resume')
								])),
							A2($elm$browser$Debugger$Overlay$viewMiniControls, config, numMsgs)
						])) : A2($elm$browser$Debugger$Overlay$viewMiniControls, config, numMsgs));
			case 'BadMetadata':
				var badMetadata_ = state.a;
				return A4(
					$elm$browser$Debugger$Overlay$viewMessage,
					config,
					'Cannot use Import or Export',
					$elm$browser$Debugger$Overlay$viewBadMetadata(badMetadata_),
					$elm$browser$Debugger$Overlay$Accept('Ok'));
			case 'BadImport':
				var report = state.a;
				return A4(
					$elm$browser$Debugger$Overlay$viewMessage,
					config,
					'Cannot Import History',
					A2($elm$browser$Debugger$Overlay$viewReport, true, report),
					$elm$browser$Debugger$Overlay$Accept('Ok'));
			default:
				var report = state.a;
				return A4(
					$elm$browser$Debugger$Overlay$viewMessage,
					config,
					'Warning',
					A2($elm$browser$Debugger$Overlay$viewReport, false, report),
					A2($elm$browser$Debugger$Overlay$Choose, 'Cancel', 'Import Anyway'));
		}
	});
var $elm$browser$Debugger$Main$cornerView = function (model) {
	return A5(
		$elm$browser$Debugger$Overlay$view,
		{exportHistory: $elm$browser$Debugger$Main$Export, importHistory: $elm$browser$Debugger$Main$Import, open: $elm$browser$Debugger$Main$Open, resume: $elm$browser$Debugger$Main$Resume, wrap: $elm$browser$Debugger$Main$OverlayMsg},
		$elm$browser$Debugger$Main$isPaused(model.state),
		_Debugger_isOpen(model.popout),
		$elm$browser$Debugger$History$size(model.history),
		model.overlay);
};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$foldr = F3(
	function (func, initialState, _v0) {
		var dict = _v0.a;
		return A3(
			$elm$core$Dict$foldr,
			F3(
				function (key, _v1, state) {
					return A2(func, key, state);
				}),
			initialState,
			dict);
	});
var $elm$browser$Debugger$Main$getCurrentModel = function (state) {
	if (state.$ === 'Running') {
		var model = state.a;
		return model;
	} else {
		var model = state.b;
		return model;
	}
};
var $elm$browser$Debugger$Main$getUserModel = function (model) {
	return $elm$browser$Debugger$Main$getCurrentModel(model.state);
};
var $elm$browser$Debugger$Main$initialWindowHeight = 420;
var $elm$browser$Debugger$Main$initialWindowWidth = 900;
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$browser$Debugger$Main$cachedHistory = function (model) {
	var _v0 = model.state;
	if (_v0.$ === 'Running') {
		return model.history;
	} else {
		var history = _v0.e;
		return history;
	}
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$browser$Debugger$Main$DragEnd = {$: 'DragEnd'};
var $elm$browser$Debugger$Main$getDragStatus = function (layout) {
	if (layout.$ === 'Horizontal') {
		var status = layout.a;
		return status;
	} else {
		var status = layout.a;
		return status;
	}
};
var $elm$browser$Debugger$Main$Drag = function (a) {
	return {$: 'Drag', a: a};
};
var $elm$browser$Debugger$Main$DragInfo = F5(
	function (x, y, down, width, height) {
		return {down: down, height: height, width: width, x: x, y: y};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$browser$Debugger$Main$decodeDimension = function (field) {
	return A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['currentTarget', 'ownerDocument', 'defaultView', field]),
		$elm$json$Json$Decode$float);
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map5 = _Json_map5;
var $elm$browser$Debugger$Main$onMouseMove = A2(
	$elm$html$Html$Events$on,
	'mousemove',
	A2(
		$elm$json$Json$Decode$map,
		$elm$browser$Debugger$Main$Drag,
		A6(
			$elm$json$Json$Decode$map5,
			$elm$browser$Debugger$Main$DragInfo,
			A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float),
			A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float),
			A2(
				$elm$json$Json$Decode$field,
				'buttons',
				A2(
					$elm$json$Json$Decode$map,
					function (v) {
						return v === 1;
					},
					$elm$json$Json$Decode$int)),
			$elm$browser$Debugger$Main$decodeDimension('innerWidth'),
			$elm$browser$Debugger$Main$decodeDimension('innerHeight'))));
var $elm$html$Html$Events$onMouseUp = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseup',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$browser$Debugger$Main$toDragListeners = function (layout) {
	var _v0 = $elm$browser$Debugger$Main$getDragStatus(layout);
	if (_v0.$ === 'Static') {
		return _List_Nil;
	} else {
		return _List_fromArray(
			[
				$elm$browser$Debugger$Main$onMouseMove,
				$elm$html$Html$Events$onMouseUp($elm$browser$Debugger$Main$DragEnd)
			]);
	}
};
var $elm$browser$Debugger$Main$toFlexDirection = function (layout) {
	if (layout.$ === 'Horizontal') {
		return 'row';
	} else {
		return 'column-reverse';
	}
};
var $elm$browser$Debugger$Main$DragStart = {$: 'DragStart'};
var $elm$html$Html$Events$onMouseDown = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mousedown',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$browser$Debugger$Main$toPercent = function (fraction) {
	return $elm$core$String$fromFloat(100 * fraction) + '%';
};
var $elm$browser$Debugger$Main$viewDragZone = function (layout) {
	if (layout.$ === 'Horizontal') {
		var x = layout.b;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$browser$Debugger$Main$toPercent(x)),
					A2($elm$html$Html$Attributes$style, 'margin-left', '-5px'),
					A2($elm$html$Html$Attributes$style, 'width', '10px'),
					A2($elm$html$Html$Attributes$style, 'height', '100%'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'col-resize'),
					$elm$html$Html$Events$onMouseDown($elm$browser$Debugger$Main$DragStart)
				]),
			_List_Nil);
	} else {
		var y = layout.c;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$browser$Debugger$Main$toPercent(y)),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'margin-top', '-5px'),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'height', '10px'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'row-resize'),
					$elm$html$Html$Events$onMouseDown($elm$browser$Debugger$Main$DragStart)
				]),
			_List_Nil);
	}
};
var $elm$browser$Debugger$Main$TweakExpandoModel = function (a) {
	return {$: 'TweakExpandoModel', a: a};
};
var $elm$browser$Debugger$Main$TweakExpandoMsg = function (a) {
	return {$: 'TweakExpandoMsg', a: a};
};
var $elm$browser$Debugger$Main$toExpandoPercents = function (layout) {
	if (layout.$ === 'Horizontal') {
		var x = layout.b;
		return _Utils_Tuple2(
			$elm$browser$Debugger$Main$toPercent(1 - x),
			'100%');
	} else {
		var y = layout.c;
		return _Utils_Tuple2(
			'100%',
			$elm$browser$Debugger$Main$toPercent(y));
	}
};
var $elm$browser$Debugger$Main$toMouseBlocker = function (layout) {
	var _v0 = $elm$browser$Debugger$Main$getDragStatus(layout);
	if (_v0.$ === 'Static') {
		return 'auto';
	} else {
		return 'none';
	}
};
var $elm$browser$Debugger$Expando$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$browser$Debugger$Expando$Index = F3(
	function (a, b, c) {
		return {$: 'Index', a: a, b: b, c: c};
	});
var $elm$browser$Debugger$Expando$Key = {$: 'Key'};
var $elm$browser$Debugger$Expando$None = {$: 'None'};
var $elm$browser$Debugger$Expando$Toggle = {$: 'Toggle'};
var $elm$browser$Debugger$Expando$Value = {$: 'Value'};
var $elm$browser$Debugger$Expando$blue = A2($elm$html$Html$Attributes$style, 'color', 'rgb(28, 0, 207)');
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$browser$Debugger$Expando$leftPad = function (maybeKey) {
	if (maybeKey.$ === 'Nothing') {
		return _List_Nil;
	} else {
		return _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'padding-left', '4ch')
			]);
	}
};
var $elm$browser$Debugger$Expando$makeArrow = function (arrow) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'color', '#777'),
				A2($elm$html$Html$Attributes$style, 'padding-left', '2ch'),
				A2($elm$html$Html$Attributes$style, 'width', '2ch'),
				A2($elm$html$Html$Attributes$style, 'display', 'inline-block')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(arrow)
			]));
};
var $elm$browser$Debugger$Expando$purple = A2($elm$html$Html$Attributes$style, 'color', 'rgb(136, 19, 145)');
var $elm$browser$Debugger$Expando$lineStarter = F3(
	function (maybeKey, maybeIsClosed, description) {
		var arrow = function () {
			if (maybeIsClosed.$ === 'Nothing') {
				return $elm$browser$Debugger$Expando$makeArrow('');
			} else {
				if (maybeIsClosed.a) {
					return $elm$browser$Debugger$Expando$makeArrow('▸');
				} else {
					return $elm$browser$Debugger$Expando$makeArrow('▾');
				}
			}
		}();
		if (maybeKey.$ === 'Nothing') {
			return A2($elm$core$List$cons, arrow, description);
		} else {
			var key = maybeKey.a;
			return A2(
				$elm$core$List$cons,
				arrow,
				A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$span,
						_List_fromArray(
							[$elm$browser$Debugger$Expando$purple]),
						_List_fromArray(
							[
								$elm$html$Html$text(key)
							])),
					A2(
						$elm$core$List$cons,
						$elm$html$Html$text(' = '),
						description)));
		}
	});
var $elm$browser$Debugger$Expando$red = A2($elm$html$Html$Attributes$style, 'color', 'rgb(196, 26, 22)');
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$browser$Debugger$Expando$seqTypeToString = F2(
	function (n, seqType) {
		switch (seqType.$) {
			case 'ListSeq':
				return 'List(' + ($elm$core$String$fromInt(n) + ')');
			case 'SetSeq':
				return 'Set(' + ($elm$core$String$fromInt(n) + ')');
			default:
				return 'Array(' + ($elm$core$String$fromInt(n) + ')');
		}
	});
var $elm$core$String$slice = _String_slice;
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $elm$browser$Debugger$Expando$elideMiddle = function (str) {
	return ($elm$core$String$length(str) <= 18) ? str : (A2($elm$core$String$left, 8, str) + ('...' + A2($elm$core$String$right, 8, str)));
};
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === 'RBEmpty_elm_builtin') {
		return true;
	} else {
		return false;
	}
};
var $elm$browser$Debugger$Expando$viewExtraTinyRecord = F3(
	function (length, starter, entries) {
		if (!entries.b) {
			return _Utils_Tuple2(
				length + 1,
				_List_fromArray(
					[
						$elm$html$Html$text('}')
					]));
		} else {
			var field = entries.a;
			var rest = entries.b;
			var nextLength = (length + $elm$core$String$length(field)) + 1;
			if (nextLength > 18) {
				return _Utils_Tuple2(
					length + 2,
					_List_fromArray(
						[
							$elm$html$Html$text('…}')
						]));
			} else {
				var _v1 = A3($elm$browser$Debugger$Expando$viewExtraTinyRecord, nextLength, ',', rest);
				var finalLength = _v1.a;
				var otherHtmls = _v1.b;
				return _Utils_Tuple2(
					finalLength,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$text(starter),
						A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$span,
								_List_fromArray(
									[$elm$browser$Debugger$Expando$purple]),
								_List_fromArray(
									[
										$elm$html$Html$text(field)
									])),
							otherHtmls)));
			}
		}
	});
var $elm$browser$Debugger$Expando$viewTinyHelp = function (str) {
	return _Utils_Tuple2(
		$elm$core$String$length(str),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $elm$browser$Debugger$Expando$viewExtraTiny = function (value) {
	if (value.$ === 'Record') {
		var record = value.b;
		return A3(
			$elm$browser$Debugger$Expando$viewExtraTinyRecord,
			0,
			'{',
			$elm$core$Dict$keys(record));
	} else {
		return $elm$browser$Debugger$Expando$viewTiny(value);
	}
};
var $elm$browser$Debugger$Expando$viewTiny = function (value) {
	switch (value.$) {
		case 'S':
			var stringRep = value.a;
			var str = $elm$browser$Debugger$Expando$elideMiddle(stringRep);
			return _Utils_Tuple2(
				$elm$core$String$length(str),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[$elm$browser$Debugger$Expando$red]),
						_List_fromArray(
							[
								$elm$html$Html$text(str)
							]))
					]));
		case 'Primitive':
			var stringRep = value.a;
			return _Utils_Tuple2(
				$elm$core$String$length(stringRep),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[$elm$browser$Debugger$Expando$blue]),
						_List_fromArray(
							[
								$elm$html$Html$text(stringRep)
							]))
					]));
		case 'Sequence':
			var seqType = value.a;
			var valueList = value.c;
			return $elm$browser$Debugger$Expando$viewTinyHelp(
				A2(
					$elm$browser$Debugger$Expando$seqTypeToString,
					$elm$core$List$length(valueList),
					seqType));
		case 'Dictionary':
			var keyValuePairs = value.b;
			return $elm$browser$Debugger$Expando$viewTinyHelp(
				'Dict(' + ($elm$core$String$fromInt(
					$elm$core$List$length(keyValuePairs)) + ')'));
		case 'Record':
			var record = value.b;
			return $elm$browser$Debugger$Expando$viewTinyRecord(record);
		default:
			if (!value.c.b) {
				var maybeName = value.a;
				return $elm$browser$Debugger$Expando$viewTinyHelp(
					A2($elm$core$Maybe$withDefault, 'Unit', maybeName));
			} else {
				var maybeName = value.a;
				var valueList = value.c;
				return $elm$browser$Debugger$Expando$viewTinyHelp(
					function () {
						if (maybeName.$ === 'Nothing') {
							return 'Tuple(' + ($elm$core$String$fromInt(
								$elm$core$List$length(valueList)) + ')');
						} else {
							var name = maybeName.a;
							return name + ' …';
						}
					}());
			}
	}
};
var $elm$browser$Debugger$Expando$viewTinyRecord = function (record) {
	return $elm$core$Dict$isEmpty(record) ? _Utils_Tuple2(
		2,
		_List_fromArray(
			[
				$elm$html$Html$text('{}')
			])) : A3(
		$elm$browser$Debugger$Expando$viewTinyRecordHelp,
		0,
		'{ ',
		$elm$core$Dict$toList(record));
};
var $elm$browser$Debugger$Expando$viewTinyRecordHelp = F3(
	function (length, starter, entries) {
		if (!entries.b) {
			return _Utils_Tuple2(
				length + 2,
				_List_fromArray(
					[
						$elm$html$Html$text(' }')
					]));
		} else {
			var _v1 = entries.a;
			var field = _v1.a;
			var value = _v1.b;
			var rest = entries.b;
			var fieldLen = $elm$core$String$length(field);
			var _v2 = $elm$browser$Debugger$Expando$viewExtraTiny(value);
			var valueLen = _v2.a;
			var valueHtmls = _v2.b;
			var newLength = ((length + fieldLen) + valueLen) + 5;
			if (newLength > 60) {
				return _Utils_Tuple2(
					length + 4,
					_List_fromArray(
						[
							$elm$html$Html$text(', … }')
						]));
			} else {
				var _v3 = A3($elm$browser$Debugger$Expando$viewTinyRecordHelp, newLength, ', ', rest);
				var finalLength = _v3.a;
				var otherHtmls = _v3.b;
				return _Utils_Tuple2(
					finalLength,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$text(starter),
						A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$span,
								_List_fromArray(
									[$elm$browser$Debugger$Expando$purple]),
								_List_fromArray(
									[
										$elm$html$Html$text(field)
									])),
							A2(
								$elm$core$List$cons,
								$elm$html$Html$text(' = '),
								A2(
									$elm$core$List$cons,
									A2($elm$html$Html$span, _List_Nil, valueHtmls),
									otherHtmls)))));
			}
		}
	});
var $elm$browser$Debugger$Expando$view = F2(
	function (maybeKey, expando) {
		switch (expando.$) {
			case 'S':
				var stringRep = expando.a;
				return A2(
					$elm$html$Html$div,
					$elm$browser$Debugger$Expando$leftPad(maybeKey),
					A3(
						$elm$browser$Debugger$Expando$lineStarter,
						maybeKey,
						$elm$core$Maybe$Nothing,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[$elm$browser$Debugger$Expando$red]),
								_List_fromArray(
									[
										$elm$html$Html$text(stringRep)
									]))
							])));
			case 'Primitive':
				var stringRep = expando.a;
				return A2(
					$elm$html$Html$div,
					$elm$browser$Debugger$Expando$leftPad(maybeKey),
					A3(
						$elm$browser$Debugger$Expando$lineStarter,
						maybeKey,
						$elm$core$Maybe$Nothing,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[$elm$browser$Debugger$Expando$blue]),
								_List_fromArray(
									[
										$elm$html$Html$text(stringRep)
									]))
							])));
			case 'Sequence':
				var seqType = expando.a;
				var isClosed = expando.b;
				var valueList = expando.c;
				return A4($elm$browser$Debugger$Expando$viewSequence, maybeKey, seqType, isClosed, valueList);
			case 'Dictionary':
				var isClosed = expando.a;
				var keyValuePairs = expando.b;
				return A3($elm$browser$Debugger$Expando$viewDictionary, maybeKey, isClosed, keyValuePairs);
			case 'Record':
				var isClosed = expando.a;
				var valueDict = expando.b;
				return A3($elm$browser$Debugger$Expando$viewRecord, maybeKey, isClosed, valueDict);
			default:
				var maybeName = expando.a;
				var isClosed = expando.b;
				var valueList = expando.c;
				return A4($elm$browser$Debugger$Expando$viewConstructor, maybeKey, maybeName, isClosed, valueList);
		}
	});
var $elm$browser$Debugger$Expando$viewConstructor = F4(
	function (maybeKey, maybeName, isClosed, valueList) {
		var tinyArgs = A2(
			$elm$core$List$map,
			A2($elm$core$Basics$composeL, $elm$core$Tuple$second, $elm$browser$Debugger$Expando$viewExtraTiny),
			valueList);
		var description = function () {
			var _v7 = _Utils_Tuple2(maybeName, tinyArgs);
			if (_v7.a.$ === 'Nothing') {
				if (!_v7.b.b) {
					var _v8 = _v7.a;
					return _List_fromArray(
						[
							$elm$html$Html$text('()')
						]);
				} else {
					var _v9 = _v7.a;
					var _v10 = _v7.b;
					var x = _v10.a;
					var xs = _v10.b;
					return A2(
						$elm$core$List$cons,
						$elm$html$Html$text('( '),
						A2(
							$elm$core$List$cons,
							A2($elm$html$Html$span, _List_Nil, x),
							A3(
								$elm$core$List$foldr,
								F2(
									function (args, rest) {
										return A2(
											$elm$core$List$cons,
											$elm$html$Html$text(', '),
											A2(
												$elm$core$List$cons,
												A2($elm$html$Html$span, _List_Nil, args),
												rest));
									}),
								_List_fromArray(
									[
										$elm$html$Html$text(' )')
									]),
								xs)));
				}
			} else {
				if (!_v7.b.b) {
					var name = _v7.a.a;
					return _List_fromArray(
						[
							$elm$html$Html$text(name)
						]);
				} else {
					var name = _v7.a.a;
					var _v11 = _v7.b;
					var x = _v11.a;
					var xs = _v11.b;
					return A2(
						$elm$core$List$cons,
						$elm$html$Html$text(name + ' '),
						A2(
							$elm$core$List$cons,
							A2($elm$html$Html$span, _List_Nil, x),
							A3(
								$elm$core$List$foldr,
								F2(
									function (args, rest) {
										return A2(
											$elm$core$List$cons,
											$elm$html$Html$text(' '),
											A2(
												$elm$core$List$cons,
												A2($elm$html$Html$span, _List_Nil, args),
												rest));
									}),
								_List_Nil,
								xs)));
				}
			}
		}();
		var _v4 = function () {
			if (!valueList.b) {
				return _Utils_Tuple2(
					$elm$core$Maybe$Nothing,
					A2($elm$html$Html$div, _List_Nil, _List_Nil));
			} else {
				if (!valueList.b.b) {
					var entry = valueList.a;
					switch (entry.$) {
						case 'S':
							return _Utils_Tuple2(
								$elm$core$Maybe$Nothing,
								A2($elm$html$Html$div, _List_Nil, _List_Nil));
						case 'Primitive':
							return _Utils_Tuple2(
								$elm$core$Maybe$Nothing,
								A2($elm$html$Html$div, _List_Nil, _List_Nil));
						case 'Sequence':
							var subValueList = entry.c;
							return _Utils_Tuple2(
								$elm$core$Maybe$Just(isClosed),
								isClosed ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : A2(
									$elm$html$Html$map,
									A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$None, 0),
									$elm$browser$Debugger$Expando$viewSequenceOpen(subValueList)));
						case 'Dictionary':
							var keyValuePairs = entry.b;
							return _Utils_Tuple2(
								$elm$core$Maybe$Just(isClosed),
								isClosed ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : A2(
									$elm$html$Html$map,
									A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$None, 0),
									$elm$browser$Debugger$Expando$viewDictionaryOpen(keyValuePairs)));
						case 'Record':
							var record = entry.b;
							return _Utils_Tuple2(
								$elm$core$Maybe$Just(isClosed),
								isClosed ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : A2(
									$elm$html$Html$map,
									A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$None, 0),
									$elm$browser$Debugger$Expando$viewRecordOpen(record)));
						default:
							var subValueList = entry.c;
							return _Utils_Tuple2(
								$elm$core$Maybe$Just(isClosed),
								isClosed ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : A2(
									$elm$html$Html$map,
									A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$None, 0),
									$elm$browser$Debugger$Expando$viewConstructorOpen(subValueList)));
					}
				} else {
					return _Utils_Tuple2(
						$elm$core$Maybe$Just(isClosed),
						isClosed ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : $elm$browser$Debugger$Expando$viewConstructorOpen(valueList));
				}
			}
		}();
		var maybeIsClosed = _v4.a;
		var openHtml = _v4.b;
		return A2(
			$elm$html$Html$div,
			$elm$browser$Debugger$Expando$leftPad(maybeKey),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($elm$browser$Debugger$Expando$Toggle)
						]),
					A3($elm$browser$Debugger$Expando$lineStarter, maybeKey, maybeIsClosed, description)),
					openHtml
				]));
	});
var $elm$browser$Debugger$Expando$viewConstructorEntry = F2(
	function (index, value) {
		return A2(
			$elm$html$Html$map,
			A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$None, index),
			A2(
				$elm$browser$Debugger$Expando$view,
				$elm$core$Maybe$Just(
					$elm$core$String$fromInt(index)),
				value));
	});
var $elm$browser$Debugger$Expando$viewConstructorOpen = function (valueList) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		A2($elm$core$List$indexedMap, $elm$browser$Debugger$Expando$viewConstructorEntry, valueList));
};
var $elm$browser$Debugger$Expando$viewDictionary = F3(
	function (maybeKey, isClosed, keyValuePairs) {
		var starter = 'Dict(' + ($elm$core$String$fromInt(
			$elm$core$List$length(keyValuePairs)) + ')');
		return A2(
			$elm$html$Html$div,
			$elm$browser$Debugger$Expando$leftPad(maybeKey),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($elm$browser$Debugger$Expando$Toggle)
						]),
					A3(
						$elm$browser$Debugger$Expando$lineStarter,
						maybeKey,
						$elm$core$Maybe$Just(isClosed),
						_List_fromArray(
							[
								$elm$html$Html$text(starter)
							]))),
					isClosed ? $elm$html$Html$text('') : $elm$browser$Debugger$Expando$viewDictionaryOpen(keyValuePairs)
				]));
	});
var $elm$browser$Debugger$Expando$viewDictionaryEntry = F2(
	function (index, _v2) {
		var key = _v2.a;
		var value = _v2.b;
		switch (key.$) {
			case 'S':
				var stringRep = key.a;
				return A2(
					$elm$html$Html$map,
					A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$Value, index),
					A2(
						$elm$browser$Debugger$Expando$view,
						$elm$core$Maybe$Just(stringRep),
						value));
			case 'Primitive':
				var stringRep = key.a;
				return A2(
					$elm$html$Html$map,
					A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$Value, index),
					A2(
						$elm$browser$Debugger$Expando$view,
						$elm$core$Maybe$Just(stringRep),
						value));
			default:
				return A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$map,
							A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$Key, index),
							A2(
								$elm$browser$Debugger$Expando$view,
								$elm$core$Maybe$Just('key'),
								key)),
							A2(
							$elm$html$Html$map,
							A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$Value, index),
							A2(
								$elm$browser$Debugger$Expando$view,
								$elm$core$Maybe$Just('value'),
								value))
						]));
		}
	});
var $elm$browser$Debugger$Expando$viewDictionaryOpen = function (keyValuePairs) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		A2($elm$core$List$indexedMap, $elm$browser$Debugger$Expando$viewDictionaryEntry, keyValuePairs));
};
var $elm$browser$Debugger$Expando$viewRecord = F3(
	function (maybeKey, isClosed, record) {
		var _v1 = isClosed ? _Utils_Tuple3(
			$elm$browser$Debugger$Expando$viewTinyRecord(record).b,
			$elm$html$Html$text(''),
			$elm$html$Html$text('')) : _Utils_Tuple3(
			_List_fromArray(
				[
					$elm$html$Html$text('{')
				]),
			$elm$browser$Debugger$Expando$viewRecordOpen(record),
			A2(
				$elm$html$Html$div,
				$elm$browser$Debugger$Expando$leftPad(
					$elm$core$Maybe$Just(_Utils_Tuple0)),
				_List_fromArray(
					[
						$elm$html$Html$text('}')
					])));
		var start = _v1.a;
		var middle = _v1.b;
		var end = _v1.c;
		return A2(
			$elm$html$Html$div,
			$elm$browser$Debugger$Expando$leftPad(maybeKey),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($elm$browser$Debugger$Expando$Toggle)
						]),
					A3(
						$elm$browser$Debugger$Expando$lineStarter,
						maybeKey,
						$elm$core$Maybe$Just(isClosed),
						start)),
					middle,
					end
				]));
	});
var $elm$browser$Debugger$Expando$viewRecordEntry = function (_v0) {
	var field = _v0.a;
	var value = _v0.b;
	return A2(
		$elm$html$Html$map,
		$elm$browser$Debugger$Expando$Field(field),
		A2(
			$elm$browser$Debugger$Expando$view,
			$elm$core$Maybe$Just(field),
			value));
};
var $elm$browser$Debugger$Expando$viewRecordOpen = function (record) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		A2(
			$elm$core$List$map,
			$elm$browser$Debugger$Expando$viewRecordEntry,
			$elm$core$Dict$toList(record)));
};
var $elm$browser$Debugger$Expando$viewSequence = F4(
	function (maybeKey, seqType, isClosed, valueList) {
		var starter = A2(
			$elm$browser$Debugger$Expando$seqTypeToString,
			$elm$core$List$length(valueList),
			seqType);
		return A2(
			$elm$html$Html$div,
			$elm$browser$Debugger$Expando$leftPad(maybeKey),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($elm$browser$Debugger$Expando$Toggle)
						]),
					A3(
						$elm$browser$Debugger$Expando$lineStarter,
						maybeKey,
						$elm$core$Maybe$Just(isClosed),
						_List_fromArray(
							[
								$elm$html$Html$text(starter)
							]))),
					isClosed ? $elm$html$Html$text('') : $elm$browser$Debugger$Expando$viewSequenceOpen(valueList)
				]));
	});
var $elm$browser$Debugger$Expando$viewSequenceOpen = function (values) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		A2($elm$core$List$indexedMap, $elm$browser$Debugger$Expando$viewConstructorEntry, values));
};
var $elm$browser$Debugger$Main$viewExpando = F3(
	function (expandoMsg, expandoModel, layout) {
		var block = $elm$browser$Debugger$Main$toMouseBlocker(layout);
		var _v0 = $elm$browser$Debugger$Main$toExpandoPercents(layout);
		var w = _v0.a;
		var h = _v0.b;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'block'),
					A2($elm$html$Html$Attributes$style, 'width', 'calc(' + (w + ' - 4em)')),
					A2($elm$html$Html$Attributes$style, 'height', 'calc(' + (h + ' - 4em)')),
					A2($elm$html$Html$Attributes$style, 'padding', '2em'),
					A2($elm$html$Html$Attributes$style, 'margin', '0'),
					A2($elm$html$Html$Attributes$style, 'overflow', 'auto'),
					A2($elm$html$Html$Attributes$style, 'pointer-events', block),
					A2($elm$html$Html$Attributes$style, '-webkit-user-select', block),
					A2($elm$html$Html$Attributes$style, '-moz-user-select', block),
					A2($elm$html$Html$Attributes$style, '-ms-user-select', block),
					A2($elm$html$Html$Attributes$style, 'user-select', block)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', '#ccc'),
							A2($elm$html$Html$Attributes$style, 'padding', '0 0 1em 0')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('-- MESSAGE')
						])),
					A2(
					$elm$html$Html$map,
					$elm$browser$Debugger$Main$TweakExpandoMsg,
					A2($elm$browser$Debugger$Expando$view, $elm$core$Maybe$Nothing, expandoMsg)),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', '#ccc'),
							A2($elm$html$Html$Attributes$style, 'padding', '1em 0')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('-- MODEL')
						])),
					A2(
					$elm$html$Html$map,
					$elm$browser$Debugger$Main$TweakExpandoModel,
					A2($elm$browser$Debugger$Expando$view, $elm$core$Maybe$Nothing, expandoModel))
				]));
	});
var $elm$browser$Debugger$Main$Jump = function (a) {
	return {$: 'Jump', a: a};
};
var $elm$virtual_dom$VirtualDom$lazy = _VirtualDom_lazy;
var $elm$html$Html$Lazy$lazy = $elm$virtual_dom$VirtualDom$lazy;
var $elm$browser$Debugger$Main$toHistoryPercents = function (layout) {
	if (layout.$ === 'Horizontal') {
		var x = layout.b;
		return _Utils_Tuple2(
			$elm$browser$Debugger$Main$toPercent(x),
			'100%');
	} else {
		var y = layout.c;
		return _Utils_Tuple2(
			'100%',
			$elm$browser$Debugger$Main$toPercent(1 - y));
	}
};
var $elm$virtual_dom$VirtualDom$lazy3 = _VirtualDom_lazy3;
var $elm$html$Html$Lazy$lazy3 = $elm$virtual_dom$VirtualDom$lazy3;
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$browser$Debugger$History$idForMessageIndex = function (index) {
	return 'msg-' + $elm$core$String$fromInt(index);
};
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $elm$browser$Debugger$History$viewMessage = F3(
	function (currentIndex, index, msg) {
		var messageName = _Debugger_messageToString(msg);
		var className = _Utils_eq(currentIndex, index) ? 'elm-debugger-entry elm-debugger-entry-selected' : 'elm-debugger-entry';
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id(
					$elm$browser$Debugger$History$idForMessageIndex(index)),
					$elm$html$Html$Attributes$class(className),
					$elm$html$Html$Events$onClick(index)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$title(messageName),
							$elm$html$Html$Attributes$class('elm-debugger-entry-content')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(messageName)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('elm-debugger-entry-index')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(index))
						]))
				]));
	});
var $elm$browser$Debugger$History$consMsg = F3(
	function (currentIndex, msg, _v0) {
		var index = _v0.a;
		var rest = _v0.b;
		return _Utils_Tuple2(
			index + 1,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$elm$core$String$fromInt(index),
					A4($elm$html$Html$Lazy$lazy3, $elm$browser$Debugger$History$viewMessage, currentIndex, index, msg)),
				rest));
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $elm$browser$Debugger$History$maxSnapshotSize = 31;
var $elm$browser$Debugger$History$showMoreButton = function (numMessages) {
	var nextIndex = (numMessages - 1) - ($elm$browser$Debugger$History$maxSnapshotSize * 2);
	var labelText = 'View more messages';
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elm-debugger-entry'),
				$elm$html$Html$Events$onClick(nextIndex)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$title(labelText),
						$elm$html$Html$Attributes$class('elm-debugger-entry-content')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(labelText)
					])),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-debugger-entry-index')
					]),
				_List_Nil)
			]));
};
var $elm$browser$Debugger$History$styles = A3(
	$elm$html$Html$node,
	'style',
	_List_Nil,
	_List_fromArray(
		[
			$elm$html$Html$text('\n\n.elm-debugger-entry {\n  cursor: pointer;\n  width: 100%;\n  box-sizing: border-box;\n  padding: 8px;\n}\n\n.elm-debugger-entry:hover {\n  background-color: rgb(41, 41, 41);\n}\n\n.elm-debugger-entry-selected, .elm-debugger-entry-selected:hover {\n  background-color: rgb(10, 10, 10);\n}\n\n.elm-debugger-entry-content {\n  width: calc(100% - 40px);\n  padding: 0 5px;\n  box-sizing: border-box;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  display: inline-block;\n}\n\n.elm-debugger-entry-index {\n  color: #666;\n  width: 40px;\n  text-align: right;\n  display: block;\n  float: right;\n}\n\n')
		]));
var $elm$core$Basics$ge = _Utils_ge;
var $elm$browser$Debugger$History$viewSnapshot = F3(
	function (selectedIndex, index, _v0) {
		var messages = _v0.messages;
		return A3(
			$elm$html$Html$Keyed$node,
			'div',
			_List_Nil,
			A3(
				$elm$core$Array$foldr,
				$elm$browser$Debugger$History$consMsg(selectedIndex),
				_Utils_Tuple2(index, _List_Nil),
				messages).b);
	});
var $elm$browser$Debugger$History$consSnapshot = F3(
	function (selectedIndex, snapshot, _v0) {
		var index = _v0.a;
		var rest = _v0.b;
		var nextIndex = index + $elm$core$Array$length(snapshot.messages);
		var selectedIndexHelp = ((_Utils_cmp(nextIndex, selectedIndex) > 0) && (_Utils_cmp(selectedIndex, index) > -1)) ? selectedIndex : (-1);
		return _Utils_Tuple2(
			nextIndex,
			A2(
				$elm$core$List$cons,
				A4($elm$html$Html$Lazy$lazy3, $elm$browser$Debugger$History$viewSnapshot, selectedIndexHelp, index, snapshot),
				rest));
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $elm$browser$Debugger$History$viewAllSnapshots = F3(
	function (selectedIndex, startIndex, snapshots) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			A3(
				$elm$core$Array$foldl,
				$elm$browser$Debugger$History$consSnapshot(selectedIndex),
				_Utils_Tuple2(startIndex, _List_Nil),
				snapshots).b);
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.tail)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.tail, tail);
		return (notAppended < 0) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: $elm$core$Elm$JsArray$empty
		} : {nodeList: builder.nodeList, nodeListSize: builder.nodeListSize, tail: appended});
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (node.$ === 'SubTree') {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						nodeList: _List_Nil,
						nodeListSize: 0,
						tail: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (_v0.$ === 'SubTree') {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (_v0.$ === 'SubTree') {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $elm$browser$Debugger$History$viewRecentSnapshots = F3(
	function (selectedIndex, recentMessagesNum, snapshots) {
		var messagesToFill = $elm$browser$Debugger$History$maxSnapshotSize - recentMessagesNum;
		var arrayLength = $elm$core$Array$length(snapshots);
		var snapshotsToRender = function () {
			var _v0 = _Utils_Tuple2(
				A2($elm$core$Array$get, arrayLength - 2, snapshots),
				A2($elm$core$Array$get, arrayLength - 1, snapshots));
			if ((_v0.a.$ === 'Just') && (_v0.b.$ === 'Just')) {
				var fillerSnapshot = _v0.a.a;
				var recentSnapshot = _v0.b.a;
				return $elm$core$Array$fromList(
					_List_fromArray(
						[
							{
							messages: A3($elm$core$Array$slice, 0, messagesToFill, fillerSnapshot.messages),
							model: fillerSnapshot.model
						},
							recentSnapshot
						]));
			} else {
				return snapshots;
			}
		}();
		var startingIndex = ((arrayLength * $elm$browser$Debugger$History$maxSnapshotSize) - $elm$browser$Debugger$History$maxSnapshotSize) - messagesToFill;
		return A3($elm$browser$Debugger$History$viewAllSnapshots, selectedIndex, startingIndex, snapshotsToRender);
	});
var $elm$browser$Debugger$History$view = F2(
	function (maybeIndex, _v0) {
		var snapshots = _v0.snapshots;
		var recent = _v0.recent;
		var numMessages = _v0.numMessages;
		var recentMessageStartIndex = numMessages - recent.numMessages;
		var index = A2($elm$core$Maybe$withDefault, -1, maybeIndex);
		var newStuff = A3(
			$elm$html$Html$Keyed$node,
			'div',
			_List_Nil,
			A3(
				$elm$core$List$foldr,
				$elm$browser$Debugger$History$consMsg(index),
				_Utils_Tuple2(recentMessageStartIndex, _List_Nil),
				recent.messages).b);
		var onlyRenderRecentMessages = (!_Utils_eq(index, -1)) || ($elm$core$Array$length(snapshots) < 2);
		var oldStuff = onlyRenderRecentMessages ? A4($elm$html$Html$Lazy$lazy3, $elm$browser$Debugger$History$viewAllSnapshots, index, 0, snapshots) : A4($elm$html$Html$Lazy$lazy3, $elm$browser$Debugger$History$viewRecentSnapshots, index, recent.numMessages, snapshots);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('elm-debugger-sidebar'),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
					A2($elm$html$Html$Attributes$style, 'height', 'calc(100% - 72px)')
				]),
			A2(
				$elm$core$List$cons,
				$elm$browser$Debugger$History$styles,
				A2(
					$elm$core$List$cons,
					newStuff,
					A2(
						$elm$core$List$cons,
						oldStuff,
						onlyRenderRecentMessages ? _List_Nil : _List_fromArray(
							[
								$elm$browser$Debugger$History$showMoreButton(numMessages)
							])))));
	});
var $elm$browser$Debugger$Main$SwapLayout = {$: 'SwapLayout'};
var $elm$browser$Debugger$Main$toHistoryIcon = function (layout) {
	if (layout.$ === 'Horizontal') {
		return 'M13 1a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z M13 3h-10a1 1 0 0 0-1 1v5h12v-5a1 1 0 0 0-1-1z M14 10h-12v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1z';
	} else {
		return 'M0 4a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3z M2 4v8a1 1 0 0 0 1 1h2v-10h-2a1 1 0 0 0-1 1z M6 3v10h7a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1z';
	}
};
var $elm$browser$Debugger$Main$icon = function (path) {
	return A4(
		$elm$virtual_dom$VirtualDom$nodeNS,
		'http://www.w3.org/2000/svg',
		'svg',
		_List_fromArray(
			[
				A2($elm$virtual_dom$VirtualDom$attribute, 'viewBox', '0 0 16 16'),
				A2($elm$virtual_dom$VirtualDom$attribute, 'xmlns', 'http://www.w3.org/2000/svg'),
				A2($elm$virtual_dom$VirtualDom$attribute, 'fill', 'currentColor'),
				A2($elm$virtual_dom$VirtualDom$attribute, 'width', '16px'),
				A2($elm$virtual_dom$VirtualDom$attribute, 'height', '16px')
			]),
		_List_fromArray(
			[
				A4(
				$elm$virtual_dom$VirtualDom$nodeNS,
				'http://www.w3.org/2000/svg',
				'path',
				_List_fromArray(
					[
						A2($elm$virtual_dom$VirtualDom$attribute, 'd', path)
					]),
				_List_Nil)
			]));
};
var $elm$browser$Debugger$Main$viewHistoryButton = F3(
	function (label, msg, path) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'row'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'background', 'none'),
					A2($elm$html$Html$Attributes$style, 'border', 'none'),
					A2($elm$html$Html$Attributes$style, 'color', 'inherit'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					$elm$html$Html$Events$onClick(msg)
				]),
			_List_fromArray(
				[
					$elm$browser$Debugger$Main$icon(path),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'padding-left', '6px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						]))
				]));
	});
var $elm$browser$Debugger$Main$viewHistoryOptions = function (layout) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '36px'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-direction', 'row'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
				A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(50, 50, 50)')
			]),
		_List_fromArray(
			[
				A3(
				$elm$browser$Debugger$Main$viewHistoryButton,
				'Swap Layout',
				$elm$browser$Debugger$Main$SwapLayout,
				$elm$browser$Debugger$Main$toHistoryIcon(layout)),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'flex-direction', 'row'),
						A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between')
					]),
				_List_fromArray(
					[
						A3($elm$browser$Debugger$Main$viewHistoryButton, 'Import', $elm$browser$Debugger$Main$Import, 'M5 1a1 1 0 0 1 0 2h-2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1a1 1 0 0 1 2 0a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z M10 2a1 1 0 0 0 -2 0v6a1 1 0 0 0 1 1h6a1 1 0 0 0 0-2h-3.586l4.293-4.293a1 1 0 0 0-1.414-1.414l-4.293 4.293z'),
						A3($elm$browser$Debugger$Main$viewHistoryButton, 'Export', $elm$browser$Debugger$Main$Export, 'M5 1a1 1 0 0 1 0 2h-2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1 a1 1 0 0 1 2 0a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z M9 3a1 1 0 1 1 0-2h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-3.586l-5.293 5.293 a1 1 0 0 1-1.414-1.414l5.293 -5.293z')
					]))
			]));
};
var $elm$browser$Debugger$Main$SliderJump = function (a) {
	return {$: 'SliderJump', a: a};
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$browser$Debugger$Main$isPlaying = function (maybeIndex) {
	if (maybeIndex.$ === 'Nothing') {
		return true;
	} else {
		return false;
	}
};
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$core$String$toInt = _String_toInt;
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $elm$browser$Debugger$Main$viewPlayButton = function (playing) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background', '#1293D8'),
				A2($elm$html$Html$Attributes$style, 'border', 'none'),
				A2($elm$html$Html$Attributes$style, 'color', 'white'),
				A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
				A2($elm$html$Html$Attributes$style, 'width', '36px'),
				A2($elm$html$Html$Attributes$style, 'height', '36px'),
				$elm$html$Html$Events$onClick($elm$browser$Debugger$Main$Resume)
			]),
		_List_fromArray(
			[
				playing ? $elm$browser$Debugger$Main$icon('M2 2h4v12h-4v-12z M10 2h4v12h-4v-12z') : $elm$browser$Debugger$Main$icon('M2 2l12 7l-12 7z')
			]));
};
var $elm$browser$Debugger$Main$viewHistorySlider = F2(
	function (history, maybeIndex) {
		var lastIndex = $elm$browser$Debugger$History$size(history) - 1;
		var selectedIndex = A2($elm$core$Maybe$withDefault, lastIndex, maybeIndex);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'row'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'height', '36px'),
					A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(50, 50, 50)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$Lazy$lazy,
					$elm$browser$Debugger$Main$viewPlayButton,
					$elm$browser$Debugger$Main$isPlaying(maybeIndex)),
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('range'),
							A2($elm$html$Html$Attributes$style, 'width', 'calc(100% - 56px)'),
							A2($elm$html$Html$Attributes$style, 'height', '36px'),
							A2($elm$html$Html$Attributes$style, 'margin', '0 10px'),
							$elm$html$Html$Attributes$min('0'),
							$elm$html$Html$Attributes$max(
							$elm$core$String$fromInt(lastIndex)),
							$elm$html$Html$Attributes$value(
							$elm$core$String$fromInt(selectedIndex)),
							$elm$html$Html$Events$onInput(
							A2(
								$elm$core$Basics$composeR,
								$elm$core$String$toInt,
								A2(
									$elm$core$Basics$composeR,
									$elm$core$Maybe$withDefault(lastIndex),
									$elm$browser$Debugger$Main$SliderJump)))
						]),
					_List_Nil)
				]));
	});
var $elm$browser$Debugger$Main$viewHistory = F3(
	function (maybeIndex, history, layout) {
		var block = $elm$browser$Debugger$Main$toMouseBlocker(layout);
		var _v0 = $elm$browser$Debugger$Main$toHistoryPercents(layout);
		var w = _v0.a;
		var h = _v0.b;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'width', w),
					A2($elm$html$Html$Attributes$style, 'height', h),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'color', '#DDDDDD'),
					A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(61, 61, 61)'),
					A2($elm$html$Html$Attributes$style, 'pointer-events', block),
					A2($elm$html$Html$Attributes$style, 'user-select', block)
				]),
			_List_fromArray(
				[
					A2($elm$browser$Debugger$Main$viewHistorySlider, history, maybeIndex),
					A2(
					$elm$html$Html$map,
					$elm$browser$Debugger$Main$Jump,
					A2($elm$browser$Debugger$History$view, maybeIndex, history)),
					A2($elm$html$Html$Lazy$lazy, $elm$browser$Debugger$Main$viewHistoryOptions, layout)
				]));
	});
var $elm$browser$Debugger$Main$popoutView = function (model) {
	var maybeIndex = function () {
		var _v0 = model.state;
		if (_v0.$ === 'Running') {
			return $elm$core$Maybe$Nothing;
		} else {
			var index = _v0.a;
			return $elm$core$Maybe$Just(index);
		}
	}();
	var historyToRender = $elm$browser$Debugger$Main$cachedHistory(model);
	return A3(
		$elm$html$Html$node,
		'body',
		_Utils_ap(
			$elm$browser$Debugger$Main$toDragListeners(model.layout),
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'margin', '0'),
					A2($elm$html$Html$Attributes$style, 'padding', '0'),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'height', '100%'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2(
					$elm$html$Html$Attributes$style,
					'flex-direction',
					$elm$browser$Debugger$Main$toFlexDirection(model.layout))
				])),
		_List_fromArray(
			[
				A3($elm$browser$Debugger$Main$viewHistory, maybeIndex, historyToRender, model.layout),
				$elm$browser$Debugger$Main$viewDragZone(model.layout),
				A3($elm$browser$Debugger$Main$viewExpando, model.expandoMsg, model.expandoModel, model.layout)
			]));
};
var $elm$browser$Debugger$Overlay$BlockAll = {$: 'BlockAll'};
var $elm$browser$Debugger$Overlay$toBlockerType = F2(
	function (isPaused, state) {
		switch (state.$) {
			case 'None':
				return isPaused ? $elm$browser$Debugger$Overlay$BlockAll : $elm$browser$Debugger$Overlay$BlockNone;
			case 'BadMetadata':
				return $elm$browser$Debugger$Overlay$BlockMost;
			case 'BadImport':
				return $elm$browser$Debugger$Overlay$BlockMost;
			default:
				return $elm$browser$Debugger$Overlay$BlockMost;
		}
	});
var $elm$browser$Debugger$Main$toBlockerType = function (model) {
	return A2(
		$elm$browser$Debugger$Overlay$toBlockerType,
		$elm$browser$Debugger$Main$isPaused(model.state),
		model.overlay);
};
var $elm$browser$Debugger$Main$Horizontal = F3(
	function (a, b, c) {
		return {$: 'Horizontal', a: a, b: b, c: c};
	});
var $elm$browser$Debugger$Main$Running = function (a) {
	return {$: 'Running', a: a};
};
var $elm$browser$Debugger$Main$Static = {$: 'Static'};
var $elm$browser$Debugger$Metadata$Error = F2(
	function (message, problems) {
		return {message: message, problems: problems};
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$browser$Debugger$Metadata$Metadata = F2(
	function (versions, types) {
		return {types: types, versions: versions};
	});
var $elm$browser$Debugger$Metadata$Types = F3(
	function (message, aliases, unions) {
		return {aliases: aliases, message: message, unions: unions};
	});
var $elm$browser$Debugger$Metadata$Alias = F2(
	function (args, tipe) {
		return {args: args, tipe: tipe};
	});
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$browser$Debugger$Metadata$decodeAlias = A3(
	$elm$json$Json$Decode$map2,
	$elm$browser$Debugger$Metadata$Alias,
	A2(
		$elm$json$Json$Decode$field,
		'args',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
var $elm$browser$Debugger$Metadata$Union = F2(
	function (args, tags) {
		return {args: args, tags: tags};
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $elm$browser$Debugger$Metadata$decodeUnion = A3(
	$elm$json$Json$Decode$map2,
	$elm$browser$Debugger$Metadata$Union,
	A2(
		$elm$json$Json$Decode$field,
		'args',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'tags',
		$elm$json$Json$Decode$dict(
			$elm$json$Json$Decode$list($elm$json$Json$Decode$string))));
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$browser$Debugger$Metadata$decodeTypes = A4(
	$elm$json$Json$Decode$map3,
	$elm$browser$Debugger$Metadata$Types,
	A2($elm$json$Json$Decode$field, 'message', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'aliases',
		$elm$json$Json$Decode$dict($elm$browser$Debugger$Metadata$decodeAlias)),
	A2(
		$elm$json$Json$Decode$field,
		'unions',
		$elm$json$Json$Decode$dict($elm$browser$Debugger$Metadata$decodeUnion)));
var $elm$browser$Debugger$Metadata$Versions = function (elm) {
	return {elm: elm};
};
var $elm$browser$Debugger$Metadata$decodeVersions = A2(
	$elm$json$Json$Decode$map,
	$elm$browser$Debugger$Metadata$Versions,
	A2($elm$json$Json$Decode$field, 'elm', $elm$json$Json$Decode$string));
var $elm$browser$Debugger$Metadata$decoder = A3(
	$elm$json$Json$Decode$map2,
	$elm$browser$Debugger$Metadata$Metadata,
	A2($elm$json$Json$Decode$field, 'versions', $elm$browser$Debugger$Metadata$decodeVersions),
	A2($elm$json$Json$Decode$field, 'types', $elm$browser$Debugger$Metadata$decodeTypes));
var $elm$browser$Debugger$Metadata$ProblemType = F2(
	function (name, problems) {
		return {name: name, problems: problems};
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$String$contains = _String_contains;
var $elm$browser$Debugger$Metadata$hasProblem = F2(
	function (tipe, _v0) {
		var problem = _v0.a;
		var token = _v0.b;
		return A2($elm$core$String$contains, token, tipe) ? $elm$core$Maybe$Just(problem) : $elm$core$Maybe$Nothing;
	});
var $elm$browser$Debugger$Metadata$Decoder = {$: 'Decoder'};
var $elm$browser$Debugger$Metadata$Function = {$: 'Function'};
var $elm$browser$Debugger$Metadata$Process = {$: 'Process'};
var $elm$browser$Debugger$Metadata$Program = {$: 'Program'};
var $elm$browser$Debugger$Metadata$Request = {$: 'Request'};
var $elm$browser$Debugger$Metadata$Socket = {$: 'Socket'};
var $elm$browser$Debugger$Metadata$Task = {$: 'Task'};
var $elm$browser$Debugger$Metadata$VirtualDom = {$: 'VirtualDom'};
var $elm$browser$Debugger$Metadata$problemTable = _List_fromArray(
	[
		_Utils_Tuple2($elm$browser$Debugger$Metadata$Function, '->'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$Decoder, 'Json.Decode.Decoder'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$Task, 'Task.Task'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$Process, 'Process.Id'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$Socket, 'WebSocket.LowLevel.WebSocket'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$Request, 'Http.Request'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$Program, 'Platform.Program'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$VirtualDom, 'VirtualDom.Node'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$VirtualDom, 'VirtualDom.Attribute')
	]);
var $elm$browser$Debugger$Metadata$findProblems = function (tipe) {
	return A2(
		$elm$core$List$filterMap,
		$elm$browser$Debugger$Metadata$hasProblem(tipe),
		$elm$browser$Debugger$Metadata$problemTable);
};
var $elm$browser$Debugger$Metadata$collectBadAliases = F3(
	function (name, _v0, list) {
		var tipe = _v0.tipe;
		var _v1 = $elm$browser$Debugger$Metadata$findProblems(tipe);
		if (!_v1.b) {
			return list;
		} else {
			var problems = _v1;
			return A2(
				$elm$core$List$cons,
				A2($elm$browser$Debugger$Metadata$ProblemType, name, problems),
				list);
		}
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $elm$browser$Debugger$Metadata$collectBadUnions = F3(
	function (name, _v0, list) {
		var tags = _v0.tags;
		var _v1 = A2(
			$elm$core$List$concatMap,
			$elm$browser$Debugger$Metadata$findProblems,
			$elm$core$List$concat(
				$elm$core$Dict$values(tags)));
		if (!_v1.b) {
			return list;
		} else {
			var problems = _v1;
			return A2(
				$elm$core$List$cons,
				A2($elm$browser$Debugger$Metadata$ProblemType, name, problems),
				list);
		}
	});
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$browser$Debugger$Metadata$isPortable = function (_v0) {
	var types = _v0.types;
	var badAliases = A3($elm$core$Dict$foldl, $elm$browser$Debugger$Metadata$collectBadAliases, _List_Nil, types.aliases);
	var _v1 = A3($elm$core$Dict$foldl, $elm$browser$Debugger$Metadata$collectBadUnions, badAliases, types.unions);
	if (!_v1.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var problems = _v1;
		return $elm$core$Maybe$Just(
			A2($elm$browser$Debugger$Metadata$Error, types.message, problems));
	}
};
var $elm$browser$Debugger$Metadata$decode = function (value) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $elm$browser$Debugger$Metadata$decoder, value);
	if (_v0.$ === 'Err') {
		return $elm$core$Result$Err(
			A2($elm$browser$Debugger$Metadata$Error, 'The compiler is generating bad metadata. This is a compiler bug!', _List_Nil));
	} else {
		var metadata = _v0.a;
		var _v1 = $elm$browser$Debugger$Metadata$isPortable(metadata);
		if (_v1.$ === 'Nothing') {
			return $elm$core$Result$Ok(metadata);
		} else {
			var error = _v1.a;
			return $elm$core$Result$Err(error);
		}
	}
};
var $elm$browser$Debugger$History$History = F3(
	function (snapshots, recent, numMessages) {
		return {numMessages: numMessages, recent: recent, snapshots: snapshots};
	});
var $elm$browser$Debugger$History$RecentHistory = F3(
	function (model, messages, numMessages) {
		return {messages: messages, model: model, numMessages: numMessages};
	});
var $elm$browser$Debugger$History$empty = function (model) {
	return A3(
		$elm$browser$Debugger$History$History,
		$elm$core$Array$empty,
		A3($elm$browser$Debugger$History$RecentHistory, model, _List_Nil, 0),
		0);
};
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $elm$browser$Debugger$Expando$initHelp = F2(
	function (isOuter, expando) {
		switch (expando.$) {
			case 'S':
				return expando;
			case 'Primitive':
				return expando;
			case 'Sequence':
				var seqType = expando.a;
				var isClosed = expando.b;
				var items = expando.c;
				return isOuter ? A3(
					$elm$browser$Debugger$Expando$Sequence,
					seqType,
					false,
					A2(
						$elm$core$List$map,
						$elm$browser$Debugger$Expando$initHelp(false),
						items)) : (($elm$core$List$length(items) <= 8) ? A3($elm$browser$Debugger$Expando$Sequence, seqType, false, items) : expando);
			case 'Dictionary':
				var isClosed = expando.a;
				var keyValuePairs = expando.b;
				return isOuter ? A2(
					$elm$browser$Debugger$Expando$Dictionary,
					false,
					A2(
						$elm$core$List$map,
						function (_v1) {
							var k = _v1.a;
							var v = _v1.b;
							return _Utils_Tuple2(
								k,
								A2($elm$browser$Debugger$Expando$initHelp, false, v));
						},
						keyValuePairs)) : (($elm$core$List$length(keyValuePairs) <= 8) ? A2($elm$browser$Debugger$Expando$Dictionary, false, keyValuePairs) : expando);
			case 'Record':
				var isClosed = expando.a;
				var entries = expando.b;
				return isOuter ? A2(
					$elm$browser$Debugger$Expando$Record,
					false,
					A2(
						$elm$core$Dict$map,
						F2(
							function (_v2, v) {
								return A2($elm$browser$Debugger$Expando$initHelp, false, v);
							}),
						entries)) : (($elm$core$Dict$size(entries) <= 4) ? A2($elm$browser$Debugger$Expando$Record, false, entries) : expando);
			default:
				var maybeName = expando.a;
				var isClosed = expando.b;
				var args = expando.c;
				return isOuter ? A3(
					$elm$browser$Debugger$Expando$Constructor,
					maybeName,
					false,
					A2(
						$elm$core$List$map,
						$elm$browser$Debugger$Expando$initHelp(false),
						args)) : (($elm$core$List$length(args) <= 4) ? A3($elm$browser$Debugger$Expando$Constructor, maybeName, false, args) : expando);
		}
	});
var $elm$browser$Debugger$Expando$init = function (value) {
	return A2(
		$elm$browser$Debugger$Expando$initHelp,
		true,
		_Debugger_init(value));
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$browser$Debugger$Overlay$None = {$: 'None'};
var $elm$browser$Debugger$Overlay$none = $elm$browser$Debugger$Overlay$None;
var $elm$browser$Debugger$Main$wrapInit = F4(
	function (metadata, popout, init, flags) {
		var _v0 = init(flags);
		var userModel = _v0.a;
		var userCommands = _v0.b;
		return _Utils_Tuple2(
			{
				expandoModel: $elm$browser$Debugger$Expando$init(userModel),
				expandoMsg: $elm$browser$Debugger$Expando$init(_Utils_Tuple0),
				history: $elm$browser$Debugger$History$empty(userModel),
				layout: A3($elm$browser$Debugger$Main$Horizontal, $elm$browser$Debugger$Main$Static, 0.3, 0.5),
				metadata: $elm$browser$Debugger$Metadata$decode(metadata),
				overlay: $elm$browser$Debugger$Overlay$none,
				popout: popout,
				state: $elm$browser$Debugger$Main$Running(userModel)
			},
			A2($elm$core$Platform$Cmd$map, $elm$browser$Debugger$Main$UserMsg, userCommands));
	});
var $elm$browser$Debugger$Main$getLatestModel = function (state) {
	if (state.$ === 'Running') {
		var model = state.a;
		return model;
	} else {
		var model = state.c;
		return model;
	}
};
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$browser$Debugger$Main$wrapSubs = F2(
	function (subscriptions, model) {
		return A2(
			$elm$core$Platform$Sub$map,
			$elm$browser$Debugger$Main$UserMsg,
			subscriptions(
				$elm$browser$Debugger$Main$getLatestModel(model.state)));
	});
var $elm$browser$Debugger$Main$Moving = {$: 'Moving'};
var $elm$browser$Debugger$Main$Paused = F5(
	function (a, b, c, d, e) {
		return {$: 'Paused', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$browser$Debugger$History$Snapshot = F2(
	function (model, messages) {
		return {messages: messages, model: model};
	});
var $elm$browser$Debugger$History$addRecent = F3(
	function (msg, newModel, _v0) {
		var model = _v0.model;
		var messages = _v0.messages;
		var numMessages = _v0.numMessages;
		return _Utils_eq(numMessages, $elm$browser$Debugger$History$maxSnapshotSize) ? _Utils_Tuple2(
			$elm$core$Maybe$Just(
				A2(
					$elm$browser$Debugger$History$Snapshot,
					model,
					$elm$core$Array$fromList(messages))),
			A3(
				$elm$browser$Debugger$History$RecentHistory,
				newModel,
				_List_fromArray(
					[msg]),
				1)) : _Utils_Tuple2(
			$elm$core$Maybe$Nothing,
			A3(
				$elm$browser$Debugger$History$RecentHistory,
				model,
				A2($elm$core$List$cons, msg, messages),
				numMessages + 1));
	});
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $elm$browser$Debugger$History$add = F3(
	function (msg, model, _v0) {
		var snapshots = _v0.snapshots;
		var recent = _v0.recent;
		var numMessages = _v0.numMessages;
		var _v1 = A3($elm$browser$Debugger$History$addRecent, msg, model, recent);
		if (_v1.a.$ === 'Just') {
			var snapshot = _v1.a.a;
			var newRecent = _v1.b;
			return A3(
				$elm$browser$Debugger$History$History,
				A2($elm$core$Array$push, snapshot, snapshots),
				newRecent,
				numMessages + 1);
		} else {
			var _v2 = _v1.a;
			var newRecent = _v1.b;
			return A3($elm$browser$Debugger$History$History, snapshots, newRecent, numMessages + 1);
		}
	});
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$browser$Debugger$Overlay$BadImport = function (a) {
	return {$: 'BadImport', a: a};
};
var $elm$browser$Debugger$Overlay$RiskyImport = F2(
	function (a, b) {
		return {$: 'RiskyImport', a: a, b: b};
	});
var $elm$browser$Debugger$Report$VersionChanged = F2(
	function (a, b) {
		return {$: 'VersionChanged', a: a, b: b};
	});
var $elm$browser$Debugger$Report$MessageChanged = F2(
	function (a, b) {
		return {$: 'MessageChanged', a: a, b: b};
	});
var $elm$browser$Debugger$Report$SomethingChanged = function (a) {
	return {$: 'SomethingChanged', a: a};
};
var $elm$browser$Debugger$Report$AliasChange = function (a) {
	return {$: 'AliasChange', a: a};
};
var $elm$browser$Debugger$Metadata$checkAlias = F4(
	function (name, old, _new, changes) {
		return (_Utils_eq(old.tipe, _new.tipe) && _Utils_eq(old.args, _new.args)) ? changes : A2(
			$elm$core$List$cons,
			$elm$browser$Debugger$Report$AliasChange(name),
			changes);
	});
var $elm$browser$Debugger$Report$UnionChange = F2(
	function (a, b) {
		return {$: 'UnionChange', a: a, b: b};
	});
var $elm$browser$Debugger$Metadata$addTag = F3(
	function (tag, _v0, changes) {
		return _Utils_update(
			changes,
			{
				added: A2($elm$core$List$cons, tag, changes.added)
			});
	});
var $elm$browser$Debugger$Metadata$checkTag = F4(
	function (tag, old, _new, changes) {
		return _Utils_eq(old, _new) ? changes : _Utils_update(
			changes,
			{
				changed: A2($elm$core$List$cons, tag, changes.changed)
			});
	});
var $elm$browser$Debugger$Report$TagChanges = F4(
	function (removed, changed, added, argsMatch) {
		return {added: added, argsMatch: argsMatch, changed: changed, removed: removed};
	});
var $elm$browser$Debugger$Report$emptyTagChanges = function (argsMatch) {
	return A4($elm$browser$Debugger$Report$TagChanges, _List_Nil, _List_Nil, _List_Nil, argsMatch);
};
var $elm$browser$Debugger$Report$hasTagChanges = function (tagChanges) {
	return _Utils_eq(
		tagChanges,
		A4($elm$browser$Debugger$Report$TagChanges, _List_Nil, _List_Nil, _List_Nil, true));
};
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Debugger$Metadata$removeTag = F3(
	function (tag, _v0, changes) {
		return _Utils_update(
			changes,
			{
				removed: A2($elm$core$List$cons, tag, changes.removed)
			});
	});
var $elm$browser$Debugger$Metadata$checkUnion = F4(
	function (name, old, _new, changes) {
		var tagChanges = A6(
			$elm$core$Dict$merge,
			$elm$browser$Debugger$Metadata$removeTag,
			$elm$browser$Debugger$Metadata$checkTag,
			$elm$browser$Debugger$Metadata$addTag,
			old.tags,
			_new.tags,
			$elm$browser$Debugger$Report$emptyTagChanges(
				_Utils_eq(old.args, _new.args)));
		return $elm$browser$Debugger$Report$hasTagChanges(tagChanges) ? changes : A2(
			$elm$core$List$cons,
			A2($elm$browser$Debugger$Report$UnionChange, name, tagChanges),
			changes);
	});
var $elm$browser$Debugger$Metadata$ignore = F3(
	function (key, value, report) {
		return report;
	});
var $elm$browser$Debugger$Metadata$checkTypes = F2(
	function (old, _new) {
		return (!_Utils_eq(old.message, _new.message)) ? A2($elm$browser$Debugger$Report$MessageChanged, old.message, _new.message) : $elm$browser$Debugger$Report$SomethingChanged(
			A6(
				$elm$core$Dict$merge,
				$elm$browser$Debugger$Metadata$ignore,
				$elm$browser$Debugger$Metadata$checkUnion,
				$elm$browser$Debugger$Metadata$ignore,
				old.unions,
				_new.unions,
				A6($elm$core$Dict$merge, $elm$browser$Debugger$Metadata$ignore, $elm$browser$Debugger$Metadata$checkAlias, $elm$browser$Debugger$Metadata$ignore, old.aliases, _new.aliases, _List_Nil)));
	});
var $elm$browser$Debugger$Metadata$check = F2(
	function (old, _new) {
		return (!_Utils_eq(old.versions.elm, _new.versions.elm)) ? A2($elm$browser$Debugger$Report$VersionChanged, old.versions.elm, _new.versions.elm) : A2($elm$browser$Debugger$Metadata$checkTypes, old.types, _new.types);
	});
var $elm$browser$Debugger$Report$CorruptHistory = {$: 'CorruptHistory'};
var $elm$browser$Debugger$Overlay$corruptImport = $elm$browser$Debugger$Overlay$BadImport($elm$browser$Debugger$Report$CorruptHistory);
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$browser$Debugger$Report$Fine = {$: 'Fine'};
var $elm$browser$Debugger$Report$Impossible = {$: 'Impossible'};
var $elm$browser$Debugger$Report$Risky = {$: 'Risky'};
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$browser$Debugger$Report$some = function (list) {
	return !$elm$core$List$isEmpty(list);
};
var $elm$browser$Debugger$Report$evaluateChange = function (change) {
	if (change.$ === 'AliasChange') {
		return $elm$browser$Debugger$Report$Impossible;
	} else {
		var removed = change.b.removed;
		var changed = change.b.changed;
		var added = change.b.added;
		var argsMatch = change.b.argsMatch;
		return ((!argsMatch) || ($elm$browser$Debugger$Report$some(changed) || $elm$browser$Debugger$Report$some(removed))) ? $elm$browser$Debugger$Report$Impossible : ($elm$browser$Debugger$Report$some(added) ? $elm$browser$Debugger$Report$Risky : $elm$browser$Debugger$Report$Fine);
	}
};
var $elm$browser$Debugger$Report$worstCase = F2(
	function (status, statusList) {
		worstCase:
		while (true) {
			if (!statusList.b) {
				return status;
			} else {
				switch (statusList.a.$) {
					case 'Impossible':
						var _v1 = statusList.a;
						return $elm$browser$Debugger$Report$Impossible;
					case 'Risky':
						var _v2 = statusList.a;
						var rest = statusList.b;
						var $temp$status = $elm$browser$Debugger$Report$Risky,
							$temp$statusList = rest;
						status = $temp$status;
						statusList = $temp$statusList;
						continue worstCase;
					default:
						var _v3 = statusList.a;
						var rest = statusList.b;
						var $temp$status = status,
							$temp$statusList = rest;
						status = $temp$status;
						statusList = $temp$statusList;
						continue worstCase;
				}
			}
		}
	});
var $elm$browser$Debugger$Report$evaluate = function (report) {
	switch (report.$) {
		case 'CorruptHistory':
			return $elm$browser$Debugger$Report$Impossible;
		case 'VersionChanged':
			return $elm$browser$Debugger$Report$Impossible;
		case 'MessageChanged':
			return $elm$browser$Debugger$Report$Impossible;
		default:
			var changes = report.a;
			return A2(
				$elm$browser$Debugger$Report$worstCase,
				$elm$browser$Debugger$Report$Fine,
				A2($elm$core$List$map, $elm$browser$Debugger$Report$evaluateChange, changes));
	}
};
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $elm$browser$Debugger$Overlay$uploadDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (x, y) {
			return _Utils_Tuple2(x, y);
		}),
	A2($elm$json$Json$Decode$field, 'metadata', $elm$browser$Debugger$Metadata$decoder),
	A2($elm$json$Json$Decode$field, 'history', $elm$json$Json$Decode$value));
var $elm$browser$Debugger$Overlay$assessImport = F2(
	function (metadata, jsonString) {
		var _v0 = A2($elm$json$Json$Decode$decodeString, $elm$browser$Debugger$Overlay$uploadDecoder, jsonString);
		if (_v0.$ === 'Err') {
			return $elm$core$Result$Err($elm$browser$Debugger$Overlay$corruptImport);
		} else {
			var _v1 = _v0.a;
			var foreignMetadata = _v1.a;
			var rawHistory = _v1.b;
			var report = A2($elm$browser$Debugger$Metadata$check, foreignMetadata, metadata);
			var _v2 = $elm$browser$Debugger$Report$evaluate(report);
			switch (_v2.$) {
				case 'Impossible':
					return $elm$core$Result$Err(
						$elm$browser$Debugger$Overlay$BadImport(report));
				case 'Risky':
					return $elm$core$Result$Err(
						A2($elm$browser$Debugger$Overlay$RiskyImport, report, rawHistory));
				default:
					return $elm$core$Result$Ok(rawHistory);
			}
		}
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$browser$Debugger$Overlay$close = F2(
	function (msg, state) {
		switch (state.$) {
			case 'None':
				return $elm$core$Maybe$Nothing;
			case 'BadMetadata':
				return $elm$core$Maybe$Nothing;
			case 'BadImport':
				return $elm$core$Maybe$Nothing;
			default:
				var rawHistory = state.b;
				if (msg.$ === 'Cancel') {
					return $elm$core$Maybe$Nothing;
				} else {
					return $elm$core$Maybe$Just(rawHistory);
				}
		}
	});
var $elm$browser$Debugger$History$elmToJs = A2($elm$core$Basics$composeR, _Json_wrap, _Debugger_unsafeCoerce);
var $elm$browser$Debugger$History$encodeHelp = F2(
	function (snapshot, allMessages) {
		return A3($elm$core$Array$foldl, $elm$core$List$cons, allMessages, snapshot.messages);
	});
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $elm$browser$Debugger$History$encode = function (_v0) {
	var snapshots = _v0.snapshots;
	var recent = _v0.recent;
	return A2(
		$elm$json$Json$Encode$list,
		$elm$browser$Debugger$History$elmToJs,
		A3(
			$elm$core$Array$foldr,
			$elm$browser$Debugger$History$encodeHelp,
			$elm$core$List$reverse(recent.messages),
			snapshots));
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $elm$browser$Debugger$Metadata$encodeAlias = function (_v0) {
	var args = _v0.args;
	var tipe = _v0.tipe;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'args',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, args)),
				_Utils_Tuple2(
				'type',
				$elm$json$Json$Encode$string(tipe))
			]));
};
var $elm$browser$Debugger$Metadata$encodeDict = F2(
	function (f, dict) {
		return $elm$json$Json$Encode$object(
			$elm$core$Dict$toList(
				A2(
					$elm$core$Dict$map,
					F2(
						function (key, value) {
							return f(value);
						}),
					dict)));
	});
var $elm$browser$Debugger$Metadata$encodeUnion = function (_v0) {
	var args = _v0.args;
	var tags = _v0.tags;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'args',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, args)),
				_Utils_Tuple2(
				'tags',
				A2(
					$elm$browser$Debugger$Metadata$encodeDict,
					$elm$json$Json$Encode$list($elm$json$Json$Encode$string),
					tags))
			]));
};
var $elm$browser$Debugger$Metadata$encodeTypes = function (_v0) {
	var message = _v0.message;
	var unions = _v0.unions;
	var aliases = _v0.aliases;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'message',
				$elm$json$Json$Encode$string(message)),
				_Utils_Tuple2(
				'aliases',
				A2($elm$browser$Debugger$Metadata$encodeDict, $elm$browser$Debugger$Metadata$encodeAlias, aliases)),
				_Utils_Tuple2(
				'unions',
				A2($elm$browser$Debugger$Metadata$encodeDict, $elm$browser$Debugger$Metadata$encodeUnion, unions))
			]));
};
var $elm$browser$Debugger$Metadata$encodeVersions = function (_v0) {
	var elm = _v0.elm;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'elm',
				$elm$json$Json$Encode$string(elm))
			]));
};
var $elm$browser$Debugger$Metadata$encode = function (_v0) {
	var versions = _v0.versions;
	var types = _v0.types;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'versions',
				$elm$browser$Debugger$Metadata$encodeVersions(versions)),
				_Utils_Tuple2(
				'types',
				$elm$browser$Debugger$Metadata$encodeTypes(types))
			]));
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Debugger$Main$download = F2(
	function (metadata, history) {
		var historyLength = $elm$browser$Debugger$History$size(history);
		return A2(
			$elm$core$Task$perform,
			function (_v0) {
				return $elm$browser$Debugger$Main$NoOp;
			},
			A2(
				_Debugger_download,
				historyLength,
				_Json_unwrap(
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'metadata',
								$elm$browser$Debugger$Metadata$encode(metadata)),
								_Utils_Tuple2(
								'history',
								$elm$browser$Debugger$History$encode(history))
							])))));
	});
var $elm$browser$Debugger$Main$Vertical = F3(
	function (a, b, c) {
		return {$: 'Vertical', a: a, b: b, c: c};
	});
var $elm$browser$Debugger$Main$drag = F2(
	function (info, layout) {
		if (layout.$ === 'Horizontal') {
			var status = layout.a;
			var y = layout.c;
			return A3($elm$browser$Debugger$Main$Horizontal, status, info.x / info.width, y);
		} else {
			var status = layout.a;
			var x = layout.b;
			return A3($elm$browser$Debugger$Main$Vertical, status, x, info.y / info.height);
		}
	});
var $elm$browser$Debugger$History$Stepping = F2(
	function (a, b) {
		return {$: 'Stepping', a: a, b: b};
	});
var $elm$browser$Debugger$History$Done = F2(
	function (a, b) {
		return {$: 'Done', a: a, b: b};
	});
var $elm$browser$Debugger$History$getHelp = F3(
	function (update, msg, getResult) {
		if (getResult.$ === 'Done') {
			return getResult;
		} else {
			var n = getResult.a;
			var model = getResult.b;
			return (!n) ? A2(
				$elm$browser$Debugger$History$Done,
				msg,
				A2(update, msg, model).a) : A2(
				$elm$browser$Debugger$History$Stepping,
				n - 1,
				A2(update, msg, model).a);
		}
	});
var $elm$browser$Debugger$History$undone = function (getResult) {
	undone:
	while (true) {
		if (getResult.$ === 'Done') {
			var msg = getResult.a;
			var model = getResult.b;
			return _Utils_Tuple2(model, msg);
		} else {
			var $temp$getResult = getResult;
			getResult = $temp$getResult;
			continue undone;
		}
	}
};
var $elm$browser$Debugger$History$get = F3(
	function (update, index, history) {
		get:
		while (true) {
			var recent = history.recent;
			var snapshotMax = history.numMessages - recent.numMessages;
			if (_Utils_cmp(index, snapshotMax) > -1) {
				return $elm$browser$Debugger$History$undone(
					A3(
						$elm$core$List$foldr,
						$elm$browser$Debugger$History$getHelp(update),
						A2($elm$browser$Debugger$History$Stepping, index - snapshotMax, recent.model),
						recent.messages));
			} else {
				var _v0 = A2($elm$core$Array$get, (index / $elm$browser$Debugger$History$maxSnapshotSize) | 0, history.snapshots);
				if (_v0.$ === 'Nothing') {
					var $temp$update = update,
						$temp$index = index,
						$temp$history = history;
					update = $temp$update;
					index = $temp$index;
					history = $temp$history;
					continue get;
				} else {
					var model = _v0.a.model;
					var messages = _v0.a.messages;
					return $elm$browser$Debugger$History$undone(
						A3(
							$elm$core$Array$foldr,
							$elm$browser$Debugger$History$getHelp(update),
							A2($elm$browser$Debugger$History$Stepping, index % $elm$browser$Debugger$History$maxSnapshotSize, model),
							messages));
				}
			}
		}
	});
var $elm$browser$Debugger$History$getRecentMsg = function (history) {
	getRecentMsg:
	while (true) {
		var _v0 = history.recent.messages;
		if (!_v0.b) {
			var $temp$history = history;
			history = $temp$history;
			continue getRecentMsg;
		} else {
			var first = _v0.a;
			return first;
		}
	}
};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$browser$Debugger$Expando$mergeDictHelp = F3(
	function (oldDict, key, value) {
		var _v12 = A2($elm$core$Dict$get, key, oldDict);
		if (_v12.$ === 'Nothing') {
			return value;
		} else {
			var oldValue = _v12.a;
			return A2($elm$browser$Debugger$Expando$mergeHelp, oldValue, value);
		}
	});
var $elm$browser$Debugger$Expando$mergeHelp = F2(
	function (old, _new) {
		var _v3 = _Utils_Tuple2(old, _new);
		_v3$6:
		while (true) {
			switch (_v3.b.$) {
				case 'S':
					return _new;
				case 'Primitive':
					return _new;
				case 'Sequence':
					if (_v3.a.$ === 'Sequence') {
						var _v4 = _v3.a;
						var isClosed = _v4.b;
						var oldValues = _v4.c;
						var _v5 = _v3.b;
						var seqType = _v5.a;
						var newValues = _v5.c;
						return A3(
							$elm$browser$Debugger$Expando$Sequence,
							seqType,
							isClosed,
							A2($elm$browser$Debugger$Expando$mergeListHelp, oldValues, newValues));
					} else {
						break _v3$6;
					}
				case 'Dictionary':
					if (_v3.a.$ === 'Dictionary') {
						var _v6 = _v3.a;
						var isClosed = _v6.a;
						var _v7 = _v3.b;
						var keyValuePairs = _v7.b;
						return A2($elm$browser$Debugger$Expando$Dictionary, isClosed, keyValuePairs);
					} else {
						break _v3$6;
					}
				case 'Record':
					if (_v3.a.$ === 'Record') {
						var _v8 = _v3.a;
						var isClosed = _v8.a;
						var oldDict = _v8.b;
						var _v9 = _v3.b;
						var newDict = _v9.b;
						return A2(
							$elm$browser$Debugger$Expando$Record,
							isClosed,
							A2(
								$elm$core$Dict$map,
								$elm$browser$Debugger$Expando$mergeDictHelp(oldDict),
								newDict));
					} else {
						break _v3$6;
					}
				default:
					if (_v3.a.$ === 'Constructor') {
						var _v10 = _v3.a;
						var isClosed = _v10.b;
						var oldValues = _v10.c;
						var _v11 = _v3.b;
						var maybeName = _v11.a;
						var newValues = _v11.c;
						return A3(
							$elm$browser$Debugger$Expando$Constructor,
							maybeName,
							isClosed,
							A2($elm$browser$Debugger$Expando$mergeListHelp, oldValues, newValues));
					} else {
						break _v3$6;
					}
			}
		}
		return _new;
	});
var $elm$browser$Debugger$Expando$mergeListHelp = F2(
	function (olds, news) {
		var _v0 = _Utils_Tuple2(olds, news);
		if (!_v0.a.b) {
			return news;
		} else {
			if (!_v0.b.b) {
				return news;
			} else {
				var _v1 = _v0.a;
				var x = _v1.a;
				var xs = _v1.b;
				var _v2 = _v0.b;
				var y = _v2.a;
				var ys = _v2.b;
				return A2(
					$elm$core$List$cons,
					A2($elm$browser$Debugger$Expando$mergeHelp, x, y),
					A2($elm$browser$Debugger$Expando$mergeListHelp, xs, ys));
			}
		}
	});
var $elm$browser$Debugger$Expando$merge = F2(
	function (value, expando) {
		return A2(
			$elm$browser$Debugger$Expando$mergeHelp,
			expando,
			_Debugger_init(value));
	});
var $elm$browser$Debugger$Main$jumpUpdate = F3(
	function (update, index, model) {
		var history = $elm$browser$Debugger$Main$cachedHistory(model);
		var currentMsg = $elm$browser$Debugger$History$getRecentMsg(history);
		var currentModel = $elm$browser$Debugger$Main$getLatestModel(model.state);
		var _v0 = A3($elm$browser$Debugger$History$get, update, index, history);
		var indexModel = _v0.a;
		var indexMsg = _v0.b;
		return _Utils_update(
			model,
			{
				expandoModel: A2($elm$browser$Debugger$Expando$merge, indexModel, model.expandoModel),
				expandoMsg: A2($elm$browser$Debugger$Expando$merge, indexMsg, model.expandoMsg),
				state: A5($elm$browser$Debugger$Main$Paused, index, indexModel, currentModel, currentMsg, history)
			});
	});
var $elm$browser$Debugger$History$jsToElm = A2($elm$core$Basics$composeR, _Json_unwrap, _Debugger_unsafeCoerce);
var $elm$browser$Debugger$History$decoder = F2(
	function (initialModel, update) {
		var addMessage = F2(
			function (rawMsg, _v0) {
				var model = _v0.a;
				var history = _v0.b;
				var msg = $elm$browser$Debugger$History$jsToElm(rawMsg);
				return _Utils_Tuple2(
					A2(update, msg, model),
					A3($elm$browser$Debugger$History$add, msg, model, history));
			});
		var updateModel = function (rawMsgs) {
			return A3(
				$elm$core$List$foldl,
				addMessage,
				_Utils_Tuple2(
					initialModel,
					$elm$browser$Debugger$History$empty(initialModel)),
				rawMsgs);
		};
		return A2(
			$elm$json$Json$Decode$map,
			updateModel,
			$elm$json$Json$Decode$list($elm$json$Json$Decode$value));
	});
var $elm$browser$Debugger$History$getInitialModel = function (_v0) {
	var snapshots = _v0.snapshots;
	var recent = _v0.recent;
	var _v1 = A2($elm$core$Array$get, 0, snapshots);
	if (_v1.$ === 'Just') {
		var model = _v1.a.model;
		return model;
	} else {
		return recent.model;
	}
};
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$browser$Debugger$Main$loadNewHistory = F3(
	function (rawHistory, update, model) {
		var pureUserUpdate = F2(
			function (msg, userModel) {
				return A2(update, msg, userModel).a;
			});
		var initialUserModel = $elm$browser$Debugger$History$getInitialModel(model.history);
		var decoder = A2($elm$browser$Debugger$History$decoder, initialUserModel, pureUserUpdate);
		var _v0 = A2($elm$json$Json$Decode$decodeValue, decoder, rawHistory);
		if (_v0.$ === 'Err') {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{overlay: $elm$browser$Debugger$Overlay$corruptImport}),
				$elm$core$Platform$Cmd$none);
		} else {
			var _v1 = _v0.a;
			var latestUserModel = _v1.a;
			var newHistory = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						expandoModel: $elm$browser$Debugger$Expando$init(latestUserModel),
						expandoMsg: $elm$browser$Debugger$Expando$init(
							$elm$browser$Debugger$History$getRecentMsg(newHistory)),
						history: newHistory,
						overlay: $elm$browser$Debugger$Overlay$none,
						state: $elm$browser$Debugger$Main$Running(latestUserModel)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $elm$browser$Debugger$Main$scroll = function (popout) {
	return A2(
		$elm$core$Task$perform,
		$elm$core$Basics$always($elm$browser$Debugger$Main$NoOp),
		_Debugger_scroll(popout));
};
var $elm$browser$Debugger$Main$scrollTo = F2(
	function (id, popout) {
		return A2(
			$elm$core$Task$perform,
			$elm$core$Basics$always($elm$browser$Debugger$Main$NoOp),
			A2(_Debugger_scrollTo, id, popout));
	});
var $elm$browser$Debugger$Main$setDragStatus = F2(
	function (status, layout) {
		if (layout.$ === 'Horizontal') {
			var x = layout.b;
			var y = layout.c;
			return A3($elm$browser$Debugger$Main$Horizontal, status, x, y);
		} else {
			var x = layout.b;
			var y = layout.c;
			return A3($elm$browser$Debugger$Main$Vertical, status, x, y);
		}
	});
var $elm$browser$Debugger$Main$swapLayout = function (layout) {
	if (layout.$ === 'Horizontal') {
		var s = layout.a;
		var x = layout.b;
		var y = layout.c;
		return A3($elm$browser$Debugger$Main$Vertical, s, x, y);
	} else {
		var s = layout.a;
		var x = layout.b;
		var y = layout.c;
		return A3($elm$browser$Debugger$Main$Horizontal, s, x, y);
	}
};
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$browser$Debugger$Expando$updateIndex = F3(
	function (n, func, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			var x = list.a;
			var xs = list.b;
			return (n <= 0) ? A2(
				$elm$core$List$cons,
				func(x),
				xs) : A2(
				$elm$core$List$cons,
				x,
				A3($elm$browser$Debugger$Expando$updateIndex, n - 1, func, xs));
		}
	});
var $elm$browser$Debugger$Expando$update = F2(
	function (msg, value) {
		switch (value.$) {
			case 'S':
				return value;
			case 'Primitive':
				return value;
			case 'Sequence':
				var seqType = value.a;
				var isClosed = value.b;
				var valueList = value.c;
				switch (msg.$) {
					case 'Toggle':
						return A3($elm$browser$Debugger$Expando$Sequence, seqType, !isClosed, valueList);
					case 'Index':
						if (msg.a.$ === 'None') {
							var _v3 = msg.a;
							var index = msg.b;
							var subMsg = msg.c;
							return A3(
								$elm$browser$Debugger$Expando$Sequence,
								seqType,
								isClosed,
								A3(
									$elm$browser$Debugger$Expando$updateIndex,
									index,
									$elm$browser$Debugger$Expando$update(subMsg),
									valueList));
						} else {
							return value;
						}
					default:
						return value;
				}
			case 'Dictionary':
				var isClosed = value.a;
				var keyValuePairs = value.b;
				switch (msg.$) {
					case 'Toggle':
						return A2($elm$browser$Debugger$Expando$Dictionary, !isClosed, keyValuePairs);
					case 'Index':
						var redirect = msg.a;
						var index = msg.b;
						var subMsg = msg.c;
						switch (redirect.$) {
							case 'None':
								return value;
							case 'Key':
								return A2(
									$elm$browser$Debugger$Expando$Dictionary,
									isClosed,
									A3(
										$elm$browser$Debugger$Expando$updateIndex,
										index,
										function (_v6) {
											var k = _v6.a;
											var v = _v6.b;
											return _Utils_Tuple2(
												A2($elm$browser$Debugger$Expando$update, subMsg, k),
												v);
										},
										keyValuePairs));
							default:
								return A2(
									$elm$browser$Debugger$Expando$Dictionary,
									isClosed,
									A3(
										$elm$browser$Debugger$Expando$updateIndex,
										index,
										function (_v7) {
											var k = _v7.a;
											var v = _v7.b;
											return _Utils_Tuple2(
												k,
												A2($elm$browser$Debugger$Expando$update, subMsg, v));
										},
										keyValuePairs));
						}
					default:
						return value;
				}
			case 'Record':
				var isClosed = value.a;
				var valueDict = value.b;
				switch (msg.$) {
					case 'Toggle':
						return A2($elm$browser$Debugger$Expando$Record, !isClosed, valueDict);
					case 'Index':
						return value;
					default:
						var field = msg.a;
						var subMsg = msg.b;
						return A2(
							$elm$browser$Debugger$Expando$Record,
							isClosed,
							A3(
								$elm$core$Dict$update,
								field,
								$elm$browser$Debugger$Expando$updateField(subMsg),
								valueDict));
				}
			default:
				var maybeName = value.a;
				var isClosed = value.b;
				var valueList = value.c;
				switch (msg.$) {
					case 'Toggle':
						return A3($elm$browser$Debugger$Expando$Constructor, maybeName, !isClosed, valueList);
					case 'Index':
						if (msg.a.$ === 'None') {
							var _v10 = msg.a;
							var index = msg.b;
							var subMsg = msg.c;
							return A3(
								$elm$browser$Debugger$Expando$Constructor,
								maybeName,
								isClosed,
								A3(
									$elm$browser$Debugger$Expando$updateIndex,
									index,
									$elm$browser$Debugger$Expando$update(subMsg),
									valueList));
						} else {
							return value;
						}
					default:
						return value;
				}
		}
	});
var $elm$browser$Debugger$Expando$updateField = F2(
	function (msg, maybeExpando) {
		if (maybeExpando.$ === 'Nothing') {
			return maybeExpando;
		} else {
			var expando = maybeExpando.a;
			return $elm$core$Maybe$Just(
				A2($elm$browser$Debugger$Expando$update, msg, expando));
		}
	});
var $elm$browser$Debugger$Main$Upload = function (a) {
	return {$: 'Upload', a: a};
};
var $elm$browser$Debugger$Main$upload = function (popout) {
	return A2(
		$elm$core$Task$perform,
		$elm$browser$Debugger$Main$Upload,
		_Debugger_upload(popout));
};
var $elm$browser$Debugger$Overlay$BadMetadata = function (a) {
	return {$: 'BadMetadata', a: a};
};
var $elm$browser$Debugger$Overlay$badMetadata = $elm$browser$Debugger$Overlay$BadMetadata;
var $elm$browser$Debugger$Main$withGoodMetadata = F2(
	function (model, func) {
		var _v0 = model.metadata;
		if (_v0.$ === 'Ok') {
			var metadata = _v0.a;
			return func(metadata);
		} else {
			var error = _v0.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						overlay: $elm$browser$Debugger$Overlay$badMetadata(error)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $elm$browser$Debugger$Main$wrapUpdate = F3(
	function (update, msg, model) {
		wrapUpdate:
		while (true) {
			switch (msg.$) {
				case 'NoOp':
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 'UserMsg':
					var userMsg = msg.a;
					var userModel = $elm$browser$Debugger$Main$getLatestModel(model.state);
					var newHistory = A3($elm$browser$Debugger$History$add, userMsg, userModel, model.history);
					var _v1 = A2(update, userMsg, userModel);
					var newUserModel = _v1.a;
					var userCmds = _v1.b;
					var commands = A2($elm$core$Platform$Cmd$map, $elm$browser$Debugger$Main$UserMsg, userCmds);
					var _v2 = model.state;
					if (_v2.$ === 'Running') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									expandoModel: A2($elm$browser$Debugger$Expando$merge, newUserModel, model.expandoModel),
									expandoMsg: A2($elm$browser$Debugger$Expando$merge, userMsg, model.expandoMsg),
									history: newHistory,
									state: $elm$browser$Debugger$Main$Running(newUserModel)
								}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										commands,
										$elm$browser$Debugger$Main$scroll(model.popout)
									])));
					} else {
						var index = _v2.a;
						var indexModel = _v2.b;
						var history = _v2.e;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									history: newHistory,
									state: A5($elm$browser$Debugger$Main$Paused, index, indexModel, newUserModel, userMsg, history)
								}),
							commands);
					}
				case 'TweakExpandoMsg':
					var eMsg = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								expandoMsg: A2($elm$browser$Debugger$Expando$update, eMsg, model.expandoMsg)
							}),
						$elm$core$Platform$Cmd$none);
				case 'TweakExpandoModel':
					var eMsg = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								expandoModel: A2($elm$browser$Debugger$Expando$update, eMsg, model.expandoModel)
							}),
						$elm$core$Platform$Cmd$none);
				case 'Resume':
					var _v3 = model.state;
					if (_v3.$ === 'Running') {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var userModel = _v3.c;
						var userMsg = _v3.d;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									expandoModel: A2($elm$browser$Debugger$Expando$merge, userModel, model.expandoModel),
									expandoMsg: A2($elm$browser$Debugger$Expando$merge, userMsg, model.expandoMsg),
									state: $elm$browser$Debugger$Main$Running(userModel)
								}),
							$elm$browser$Debugger$Main$scroll(model.popout));
					}
				case 'Jump':
					var index = msg.a;
					return _Utils_Tuple2(
						A3($elm$browser$Debugger$Main$jumpUpdate, update, index, model),
						$elm$core$Platform$Cmd$none);
				case 'SliderJump':
					var index = msg.a;
					return _Utils_Tuple2(
						A3($elm$browser$Debugger$Main$jumpUpdate, update, index, model),
						A2(
							$elm$browser$Debugger$Main$scrollTo,
							$elm$browser$Debugger$History$idForMessageIndex(index),
							model.popout));
				case 'Open':
					return _Utils_Tuple2(
						model,
						A2(
							$elm$core$Task$perform,
							$elm$core$Basics$always($elm$browser$Debugger$Main$NoOp),
							_Debugger_open(model.popout)));
				case 'Up':
					var _v4 = model.state;
					if (_v4.$ === 'Running') {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var i = _v4.a;
						var history = _v4.e;
						var targetIndex = i + 1;
						if (_Utils_cmp(
							targetIndex,
							$elm$browser$Debugger$History$size(history)) < 0) {
							var $temp$update = update,
								$temp$msg = $elm$browser$Debugger$Main$SliderJump(targetIndex),
								$temp$model = model;
							update = $temp$update;
							msg = $temp$msg;
							model = $temp$model;
							continue wrapUpdate;
						} else {
							var $temp$update = update,
								$temp$msg = $elm$browser$Debugger$Main$Resume,
								$temp$model = model;
							update = $temp$update;
							msg = $temp$msg;
							model = $temp$model;
							continue wrapUpdate;
						}
					}
				case 'Down':
					var _v5 = model.state;
					if (_v5.$ === 'Running') {
						var $temp$update = update,
							$temp$msg = $elm$browser$Debugger$Main$Jump(
							$elm$browser$Debugger$History$size(model.history) - 1),
							$temp$model = model;
						update = $temp$update;
						msg = $temp$msg;
						model = $temp$model;
						continue wrapUpdate;
					} else {
						var index = _v5.a;
						if (index > 0) {
							var $temp$update = update,
								$temp$msg = $elm$browser$Debugger$Main$SliderJump(index - 1),
								$temp$model = model;
							update = $temp$update;
							msg = $temp$msg;
							model = $temp$model;
							continue wrapUpdate;
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					}
				case 'Import':
					return A2(
						$elm$browser$Debugger$Main$withGoodMetadata,
						model,
						function (_v6) {
							return _Utils_Tuple2(
								model,
								$elm$browser$Debugger$Main$upload(model.popout));
						});
				case 'Export':
					return A2(
						$elm$browser$Debugger$Main$withGoodMetadata,
						model,
						function (metadata) {
							return _Utils_Tuple2(
								model,
								A2($elm$browser$Debugger$Main$download, metadata, model.history));
						});
				case 'Upload':
					var jsonString = msg.a;
					return A2(
						$elm$browser$Debugger$Main$withGoodMetadata,
						model,
						function (metadata) {
							var _v7 = A2($elm$browser$Debugger$Overlay$assessImport, metadata, jsonString);
							if (_v7.$ === 'Err') {
								var newOverlay = _v7.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{overlay: newOverlay}),
									$elm$core$Platform$Cmd$none);
							} else {
								var rawHistory = _v7.a;
								return A3($elm$browser$Debugger$Main$loadNewHistory, rawHistory, update, model);
							}
						});
				case 'OverlayMsg':
					var overlayMsg = msg.a;
					var _v8 = A2($elm$browser$Debugger$Overlay$close, overlayMsg, model.overlay);
					if (_v8.$ === 'Nothing') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{overlay: $elm$browser$Debugger$Overlay$none}),
							$elm$core$Platform$Cmd$none);
					} else {
						var rawHistory = _v8.a;
						return A3($elm$browser$Debugger$Main$loadNewHistory, rawHistory, update, model);
					}
				case 'SwapLayout':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								layout: $elm$browser$Debugger$Main$swapLayout(model.layout)
							}),
						$elm$core$Platform$Cmd$none);
				case 'DragStart':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								layout: A2($elm$browser$Debugger$Main$setDragStatus, $elm$browser$Debugger$Main$Moving, model.layout)
							}),
						$elm$core$Platform$Cmd$none);
				case 'Drag':
					var info = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								layout: A2($elm$browser$Debugger$Main$drag, info, model.layout)
							}),
						$elm$core$Platform$Cmd$none);
				default:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								layout: A2($elm$browser$Debugger$Main$setDragStatus, $elm$browser$Debugger$Main$Static, model.layout)
							}),
						$elm$core$Platform$Cmd$none);
			}
		}
	});
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Session$Anonymus = function (a) {
	return {$: 'Anonymus', a: a};
};
var $author$project$Main$Home = function (a) {
	return {$: 'Home', a: a};
};
var $author$project$Main$Bracket = function (a) {
	return {$: 'Bracket', a: a};
};
var $author$project$Main$Club = function (a) {
	return {$: 'Club', a: a};
};
var $author$project$Main$Clubs = function (a) {
	return {$: 'Clubs', a: a};
};
var $author$project$Main$GotBracketMsg = function (a) {
	return {$: 'GotBracketMsg', a: a};
};
var $author$project$Main$GotClubMsg = function (a) {
	return {$: 'GotClubMsg', a: a};
};
var $author$project$Main$GotClubsMsg = function (a) {
	return {$: 'GotClubsMsg', a: a};
};
var $author$project$Main$GotLoginMsg = function (a) {
	return {$: 'GotLoginMsg', a: a};
};
var $author$project$Main$GotNewClubMsg = function (a) {
	return {$: 'GotNewClubMsg', a: a};
};
var $author$project$Main$GotNewTournamentMsg = function (a) {
	return {$: 'GotNewTournamentMsg', a: a};
};
var $author$project$Main$GotRulesetMsg = function (a) {
	return {$: 'GotRulesetMsg', a: a};
};
var $author$project$Main$GotSignUpMsg = function (a) {
	return {$: 'GotSignUpMsg', a: a};
};
var $author$project$Main$GotTournamentMsg = function (a) {
	return {$: 'GotTournamentMsg', a: a};
};
var $author$project$Main$GotTournamentsMsg = function (a) {
	return {$: 'GotTournamentsMsg', a: a};
};
var $author$project$Main$GotUserMsg = function (a) {
	return {$: 'GotUserMsg', a: a};
};
var $author$project$Main$Login = function (a) {
	return {$: 'Login', a: a};
};
var $author$project$Main$NewClub = function (a) {
	return {$: 'NewClub', a: a};
};
var $author$project$Main$NewTournament = function (a) {
	return {$: 'NewTournament', a: a};
};
var $author$project$Main$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $author$project$Main$Ruleset = function (a) {
	return {$: 'Ruleset', a: a};
};
var $author$project$Main$SignUp = function (a) {
	return {$: 'SignUp', a: a};
};
var $author$project$Main$Tournament = function (a) {
	return {$: 'Tournament', a: a};
};
var $author$project$Main$Tournaments = function (a) {
	return {$: 'Tournaments', a: a};
};
var $author$project$Main$User = function (a) {
	return {$: 'User', a: a};
};
var $elm$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			$elm$core$String$join,
			'&',
			A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var $elm$url$Url$Builder$absolute = F2(
	function (pathSegments, parameters) {
		return '/' + (A2($elm$core$String$join, '/', pathSegments) + $elm$url$Url$Builder$toQuery(parameters));
	});
var $author$project$Page$Bracket$Model = F3(
	function (session, error, state) {
		return {error: error, session: session, state: state};
	});
var $author$project$Page$Bracket$Uninitialized = {$: 'Uninitialized'};
var $author$project$Page$Bracket$GotBracket = function (a) {
	return {$: 'GotBracket', a: a};
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $webbhuset$elm_json_decode$Json$Decode$Field$require = F3(
	function (fieldName, valueDecoder, continuation) {
		return A2(
			$elm$json$Json$Decode$andThen,
			continuation,
			A2($elm$json$Json$Decode$field, fieldName, valueDecoder));
	});
var $author$project$Model$Player$decoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'seat',
	$elm$json$Json$Decode$string,
	function (seat) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'gameScore',
			$elm$json$Json$Decode$float,
			function (gameScore) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'runningTotal',
					$elm$json$Json$Decode$float,
					function (runningTotal) {
						return $elm$json$Json$Decode$succeed(
							{gameScore: gameScore, runningTotal: runningTotal, seat: seat});
					});
			});
	});
var $author$project$Model$Game$decoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'player1',
	$author$project$Model$Player$decoder,
	function (player1) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'player2',
			$author$project$Model$Player$decoder,
			function (player2) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'player3',
					$author$project$Model$Player$decoder,
					function (player3) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'player4',
							$author$project$Model$Player$decoder,
							function (player4) {
								return A3(
									$webbhuset$elm_json_decode$Json$Decode$Field$require,
									'playedAt',
									$elm$json$Json$Decode$string,
									function (playedAt) {
										return A3(
											$webbhuset$elm_json_decode$Json$Decode$Field$require,
											'log',
											$elm$json$Json$Decode$string,
											function (logLink) {
												return $elm$json$Json$Decode$succeed(
													{logLink: logLink, playedAt: playedAt, player1: player1, player2: player2, player3: player3, player4: player4});
											});
									});
							});
					});
			});
	});
var $author$project$Model$Series$decoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'id',
	$elm$json$Json$Decode$int,
	function (id) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'player1Name',
			$elm$json$Json$Decode$string,
			function (player1Name) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'player2Name',
					$elm$json$Json$Decode$string,
					function (player2Name) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'player3Name',
							$elm$json$Json$Decode$string,
							function (player3Name) {
								return A3(
									$webbhuset$elm_json_decode$Json$Decode$Field$require,
									'player4Name',
									$elm$json$Json$Decode$string,
									function (player4Name) {
										return A3(
											$webbhuset$elm_json_decode$Json$Decode$Field$require,
											'playedAt',
											$elm$json$Json$Decode$string,
											function (playedAt) {
												return A3(
													$webbhuset$elm_json_decode$Json$Decode$Field$require,
													'finishedAt',
													$elm$json$Json$Decode$string,
													function (finishedAt) {
														return A3(
															$webbhuset$elm_json_decode$Json$Decode$Field$require,
															'status',
															$elm$json$Json$Decode$string,
															function (status) {
																return A3(
																	$webbhuset$elm_json_decode$Json$Decode$Field$require,
																	'games',
																	$elm$json$Json$Decode$list($author$project$Model$Game$decoder),
																	function (games) {
																		return $elm$json$Json$Decode$succeed(
																			{finishedAt: finishedAt, gameForm: $elm$core$Maybe$Nothing, games: games, id: id, isFolded: true, playedAt: playedAt, player1Name: player1Name, player2Name: player2Name, player3Name: player3Name, player4Name: player4Name, status: status});
																	});
															});
													});
											});
									});
							});
					});
			});
	});
var $author$project$Model$Bracket$decoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'id',
	$elm$json$Json$Decode$int,
	function (id) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'tournamentId',
			$elm$json$Json$Decode$int,
			function (tournamentId) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'ownerId',
					$elm$json$Json$Decode$int,
					function (ownerId) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'name',
							$elm$json$Json$Decode$string,
							function (name) {
								return A3(
									$webbhuset$elm_json_decode$Json$Decode$Field$require,
									'createdAt',
									$elm$json$Json$Decode$string,
									function (createdAt) {
										return A3(
											$webbhuset$elm_json_decode$Json$Decode$Field$require,
											'startedAt',
											$elm$json$Json$Decode$string,
											function (startedAt) {
												return A3(
													$webbhuset$elm_json_decode$Json$Decode$Field$require,
													'finishedAt',
													$elm$json$Json$Decode$string,
													function (finishedAt) {
														return A3(
															$webbhuset$elm_json_decode$Json$Decode$Field$require,
															'sequence',
															$elm$json$Json$Decode$int,
															function (sequence) {
																return A3(
																	$webbhuset$elm_json_decode$Json$Decode$Field$require,
																	'description',
																	$elm$json$Json$Decode$string,
																	function (description) {
																		return A3(
																			$webbhuset$elm_json_decode$Json$Decode$Field$require,
																			'series',
																			$elm$json$Json$Decode$list($author$project$Model$Series$decoder),
																			function (series) {
																				return $elm$json$Json$Decode$succeed(
																					{createdAt: createdAt, description: description, finishedAt: finishedAt, id: id, name: name, ownerId: ownerId, sequence: sequence, series: series, startedAt: startedAt, tournamentId: tournamentId});
																			});
																	});
															});
													});
											});
									});
							});
					});
			});
	});
var $author$project$Api$BadBody = function (a) {
	return {$: 'BadBody', a: a};
};
var $author$project$Api$BadStatus = F2(
	function (a, b) {
		return {$: 'BadStatus', a: a, b: b};
	});
var $author$project$Api$BadUrl = function (a) {
	return {$: 'BadUrl', a: a};
};
var $author$project$Api$NetworkError = {$: 'NetworkError'};
var $author$project$Api$Timeout = {$: 'Timeout'};
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 'BadStatus_', a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 'BadUrl_', a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 'GoodStatus_', a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 'NetworkError_'};
var $elm$http$Http$Receiving = function (a) {
	return {$: 'Receiving', a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 'Sending', a: a};
};
var $elm$http$Http$Timeout_ = {$: 'Timeout_'};
var $elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $author$project$Api$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			function (response) {
				switch (response.$) {
					case 'BadUrl_':
						var url = response.a;
						return $elm$core$Result$Err(
							$author$project$Api$BadUrl(url));
					case 'Timeout_':
						return $elm$core$Result$Err($author$project$Api$Timeout);
					case 'NetworkError_':
						return $elm$core$Result$Err($author$project$Api$NetworkError);
					case 'BadStatus_':
						var metadata = response.a;
						var body = response.b;
						return $elm$core$Result$Err(
							A2($author$project$Api$BadStatus, metadata.statusCode, body));
					default:
						var body = response.b;
						var _v1 = A2($elm$json$Json$Decode$decodeString, decoder, body);
						if (_v1.$ === 'Ok') {
							var value = _v1.a;
							return $elm$core$Result$Ok(value);
						} else {
							var err = _v1.a;
							return $elm$core$Result$Err(
								$author$project$Api$BadBody(
									$elm$json$Json$Decode$errorToString(err)));
						}
				}
			});
	});
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$Request = function (a) {
	return {$: 'Request', a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {reqs: reqs, subs: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (cmd.$ === 'Cancel') {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 'Nothing') {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.tracker;
							if (_v4.$ === 'Nothing') {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.reqs));
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.subs)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 'Cancel', a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (cmd.$ === 'Cancel') {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					allowCookiesFromOtherDomains: r.allowCookiesFromOtherDomains,
					body: r.body,
					expect: A2(_Http_mapExpect, func, r.expect),
					headers: r.headers,
					method: r.method,
					timeout: r.timeout,
					tracker: r.tracker,
					url: r.url
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 'MySub', a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{allowCookiesFromOtherDomains: false, body: r.body, expect: r.expect, headers: r.headers, method: r.method, timeout: r.timeout, tracker: r.tracker, url: r.url}));
};
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{body: $elm$http$Http$emptyBody, expect: r.expect, headers: _List_Nil, method: 'GET', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $author$project$Api$backendUrl = 'https://localhost:5001/api';
var $author$project$Api$tournaments = $author$project$Api$backendUrl + '/tournaments';
var $author$project$Api$tournament = function (id) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				$author$project$Api$tournaments,
				'/',
				$elm$core$String$fromInt(id)
			]));
};
var $author$project$Api$tournamentBracket = F2(
	function (tournamentId, bracketId) {
		return $elm$core$String$concat(
			_List_fromArray(
				[
					$author$project$Api$tournament(tournamentId),
					'/brackets/',
					$elm$core$String$fromInt(bracketId)
				]));
	});
var $author$project$Page$Bracket$get = F2(
	function (tournamentId, bracketId) {
		return $elm$http$Http$get(
			{
				expect: A2($author$project$Api$expectJson, $author$project$Page$Bracket$GotBracket, $author$project$Model$Bracket$decoder),
				url: A2($author$project$Api$tournamentBracket, tournamentId, bracketId)
			});
	});
var $author$project$Page$Bracket$init = F3(
	function (session, tournamentId, bracketId) {
		return _Utils_Tuple2(
			A3($author$project$Page$Bracket$Model, session, $elm$core$Maybe$Nothing, $author$project$Page$Bracket$Uninitialized),
			A2($author$project$Page$Bracket$get, tournamentId, bracketId));
	});
var $author$project$Page$Club$Model = F3(
	function (session, error, state) {
		return {error: error, session: session, state: state};
	});
var $author$project$Page$Club$Uninitialized = {$: 'Uninitialized'};
var $author$project$Page$Club$GotClub = function (a) {
	return {$: 'GotClub', a: a};
};
var $author$project$Api$club = function (id) {
	return $author$project$Api$backendUrl + ('/clubs/' + $elm$core$String$fromInt(id));
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$UserShort$userShortDecoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'id',
	$elm$json$Json$Decode$int,
	function (id) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'createdAt',
			$elm$json$Json$Decode$string,
			function (createdAt) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'username',
					$elm$json$Json$Decode$string,
					function (username) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'totalTournaments',
							$elm$json$Json$Decode$int,
							function (totalTournaments) {
								return $elm$json$Json$Decode$succeed(
									{createdAt: createdAt, id: id, totalTournaments: totalTournaments, username: username});
							});
					});
			});
	});
var $author$project$Model$ClubMembership$decoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'user',
	$author$project$UserShort$userShortDecoder,
	function (user) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'createdAt',
			$elm$json$Json$Decode$string,
			function (createdAt) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'approved',
					$elm$json$Json$Decode$bool,
					function (approved) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'denied',
							$elm$json$Json$Decode$bool,
							function (denied) {
								return $elm$json$Json$Decode$succeed(
									{approved: approved, createdAt: createdAt, denied: denied, user: user});
							});
					});
			});
	});
var $author$project$Model$TournamentShort$decoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'id',
	$elm$json$Json$Decode$int,
	function (id) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'createdAt',
			$elm$json$Json$Decode$string,
			function (createdAt) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'name',
					$elm$json$Json$Decode$string,
					function (name) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'totalPlayers',
							$elm$json$Json$Decode$int,
							function (totalPlayers) {
								return A3(
									$webbhuset$elm_json_decode$Json$Decode$Field$require,
									'startDate',
									$elm$json$Json$Decode$string,
									function (startDate) {
										return A3(
											$webbhuset$elm_json_decode$Json$Decode$Field$require,
											'status',
											$elm$json$Json$Decode$string,
											function (status) {
												return $elm$json$Json$Decode$succeed(
													{createdAt: createdAt, id: id, name: name, startDate: startDate, status: status, totalPlayers: totalPlayers});
											});
									});
							});
					});
			});
	});
var $author$project$Club$clubDecoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'id',
	$elm$json$Json$Decode$int,
	function (id) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'createdAt',
			$elm$json$Json$Decode$string,
			function (createdAt) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'name',
					$elm$json$Json$Decode$string,
					function (name) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'website',
							$elm$json$Json$Decode$string,
							function (website) {
								return A3(
									$webbhuset$elm_json_decode$Json$Decode$Field$require,
									'contact',
									$elm$json$Json$Decode$string,
									function (contact) {
										return A3(
											$webbhuset$elm_json_decode$Json$Decode$Field$require,
											'localization',
											$elm$json$Json$Decode$string,
											function (localization) {
												return A3(
													$webbhuset$elm_json_decode$Json$Decode$Field$require,
													'owner',
													$author$project$UserShort$userShortDecoder,
													function (owner) {
														return A3(
															$webbhuset$elm_json_decode$Json$Decode$Field$require,
															'members',
															$elm$json$Json$Decode$list($author$project$Model$ClubMembership$decoder),
															function (members) {
																return A3(
																	$webbhuset$elm_json_decode$Json$Decode$Field$require,
																	'tournaments',
																	$elm$json$Json$Decode$list($author$project$Model$TournamentShort$decoder),
																	function (tournaments) {
																		return $elm$json$Json$Decode$succeed(
																			{contact: contact, createdAt: createdAt, id: id, localization: localization, members: members, name: name, owner: owner, tournaments: tournaments, website: website});
																	});
															});
													});
											});
									});
							});
					});
			});
	});
var $author$project$Page$Club$get = function (id) {
	return $elm$http$Http$get(
		{
			expect: A2($author$project$Api$expectJson, $author$project$Page$Club$GotClub, $author$project$Club$clubDecoder),
			url: $author$project$Api$club(id)
		});
};
var $author$project$Page$Club$init = F2(
	function (session, clubId) {
		return _Utils_Tuple2(
			A3($author$project$Page$Club$Model, session, $elm$core$Maybe$Nothing, $author$project$Page$Club$Uninitialized),
			$author$project$Page$Club$get(clubId));
	});
var $author$project$Page$Clubs$Model = F3(
	function (session, error, clubs) {
		return {clubs: clubs, error: error, session: session};
	});
var $author$project$Page$Clubs$GotClubs = function (a) {
	return {$: 'GotClubs', a: a};
};
var $author$project$ClubShort$clubShortDecoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'id',
	$elm$json$Json$Decode$int,
	function (id) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'createdAt',
			$elm$json$Json$Decode$string,
			function (createdAt) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'name',
					$elm$json$Json$Decode$string,
					function (name) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'website',
							$elm$json$Json$Decode$string,
							function (website) {
								return A3(
									$webbhuset$elm_json_decode$Json$Decode$Field$require,
									'contact',
									$elm$json$Json$Decode$string,
									function (contact) {
										return A3(
											$webbhuset$elm_json_decode$Json$Decode$Field$require,
											'localization',
											$elm$json$Json$Decode$string,
											function (localization) {
												return A3(
													$webbhuset$elm_json_decode$Json$Decode$Field$require,
													'totalPlayers',
													$elm$json$Json$Decode$int,
													function (totalPlayers) {
														return A3(
															$webbhuset$elm_json_decode$Json$Decode$Field$require,
															'totalTournaments',
															$elm$json$Json$Decode$int,
															function (totalTournaments) {
																return $elm$json$Json$Decode$succeed(
																	{contact: contact, createdAt: createdAt, id: id, localization: localization, name: name, totalPlayers: totalPlayers, totalTournaments: totalTournaments, website: website});
															});
													});
											});
									});
							});
					});
			});
	});
var $author$project$ClubShort$clubShortListDecoder = $elm$json$Json$Decode$list($author$project$ClubShort$clubShortDecoder);
var $author$project$Api$clubs = $author$project$Api$backendUrl + '/clubs';
var $author$project$Page$Clubs$get = $elm$http$Http$get(
	{
		expect: A2($author$project$Api$expectJson, $author$project$Page$Clubs$GotClubs, $author$project$ClubShort$clubShortListDecoder),
		url: $author$project$Api$clubs
	});
var $author$project$Page$Clubs$init = function (session) {
	return _Utils_Tuple2(
		A3($author$project$Page$Clubs$Model, session, $elm$core$Maybe$Nothing, _List_Nil),
		$author$project$Page$Clubs$get);
};
var $author$project$Page$Login$init = function (session) {
	return _Utils_Tuple2(
		{
			error: $elm$core$Maybe$Nothing,
			form: {email: '', password: ''},
			session: session
		},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Page$SignUp$init = function (session) {
	return _Utils_Tuple2(
		{
			error: $elm$core$Maybe$Nothing,
			form: {email: '', password: '', passwordAgain: '', username: ''},
			session: session
		},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Page$Tournament$Model = F4(
	function (session, error, state, rulesets) {
		return {error: error, rulesets: rulesets, session: session, state: state};
	});
var $author$project$Page$Tournament$Uninitialized = {$: 'Uninitialized'};
var $author$project$Page$Tournament$GotTournament = function (a) {
	return {$: 'GotTournament', a: a};
};
var $author$project$Model$BracketPlayerShort$decoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'userId',
	$elm$json$Json$Decode$int,
	function (userId) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'name',
			$elm$json$Json$Decode$string,
			function (name) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'placement',
					$elm$json$Json$Decode$int,
					function (placement) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'score',
							$elm$json$Json$Decode$float,
							function (score) {
								return $elm$json$Json$Decode$succeed(
									{name: name, placement: placement, score: score, userId: userId});
							});
					});
			});
	});
var $author$project$Model$BracketShort$decoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'id',
	$elm$json$Json$Decode$int,
	function (id) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'tournamentId',
			$elm$json$Json$Decode$int,
			function (tournamentId) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'sequence',
					$elm$json$Json$Decode$int,
					function (sequence) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'name',
							$elm$json$Json$Decode$string,
							function (name) {
								return A3(
									$webbhuset$elm_json_decode$Json$Decode$Field$require,
									'createdAt',
									$elm$json$Json$Decode$string,
									function (createdAt) {
										return A3(
											$webbhuset$elm_json_decode$Json$Decode$Field$require,
											'startedAt',
											$elm$json$Json$Decode$string,
											function (startedAt) {
												return A3(
													$webbhuset$elm_json_decode$Json$Decode$Field$require,
													'finishedAt',
													$elm$json$Json$Decode$string,
													function (finishedAt) {
														return A3(
															$webbhuset$elm_json_decode$Json$Decode$Field$require,
															'winCondition',
															$elm$json$Json$Decode$string,
															function (winCondition) {
																return A3(
																	$webbhuset$elm_json_decode$Json$Decode$Field$require,
																	'numberOfAdvancing',
																	$elm$json$Json$Decode$int,
																	function (numberOfAdvancing) {
																		return A3(
																			$webbhuset$elm_json_decode$Json$Decode$Field$require,
																			'numberOfSeries',
																			$elm$json$Json$Decode$int,
																			function (numberOfSeries) {
																				return A3(
																					$webbhuset$elm_json_decode$Json$Decode$Field$require,
																					'gamesPerSeries',
																					$elm$json$Json$Decode$int,
																					function (gamesPerSeries) {
																						return A3(
																							$webbhuset$elm_json_decode$Json$Decode$Field$require,
																							'finalScoreMultiplier',
																							$elm$json$Json$Decode$float,
																							function (finalScoreMultiplier) {
																								return A3(
																									$webbhuset$elm_json_decode$Json$Decode$Field$require,
																									'players',
																									$elm$json$Json$Decode$list($author$project$Model$BracketPlayerShort$decoder),
																									function (players) {
																										return $elm$json$Json$Decode$succeed(
																											{createdAt: createdAt, finalScoreMultiplier: finalScoreMultiplier, finishedAt: finishedAt, gamesPerSeries: gamesPerSeries, id: id, name: name, numberOfAdvancing: numberOfAdvancing, numberOfSeries: numberOfSeries, players: players, sequence: sequence, startedAt: startedAt, tournamentId: tournamentId, winCondition: winCondition});
																									});
																							});
																					});
																			});
																	});
															});
													});
											});
									});
							});
					});
			});
	});
var $author$project$Model$Ruleset$decoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'id',
	$elm$json$Json$Decode$int,
	function (id) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'createdAt',
			$elm$json$Json$Decode$string,
			function (createdAt) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'name',
					$elm$json$Json$Decode$string,
					function (name) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'mochiten',
							$elm$json$Json$Decode$int,
							function (mochiten) {
								return A3(
									$webbhuset$elm_json_decode$Json$Decode$Field$require,
									'genten',
									$elm$json$Json$Decode$int,
									function (genten) {
										return A3(
											$webbhuset$elm_json_decode$Json$Decode$Field$require,
											'uma',
											$elm$json$Json$Decode$string,
											function (uma) {
												return A3(
													$webbhuset$elm_json_decode$Json$Decode$Field$require,
													'oka',
													$elm$json$Json$Decode$int,
													function (oka) {
														return A3(
															$webbhuset$elm_json_decode$Json$Decode$Field$require,
															'atozuke',
															$elm$json$Json$Decode$string,
															function (atozuke) {
																return A3(
																	$webbhuset$elm_json_decode$Json$Decode$Field$require,
																	'kuitan',
																	$elm$json$Json$Decode$string,
																	function (kuitan) {
																		return A3(
																			$webbhuset$elm_json_decode$Json$Decode$Field$require,
																			'kuikae',
																			$elm$json$Json$Decode$string,
																			function (kuikae) {
																				return A3(
																					$webbhuset$elm_json_decode$Json$Decode$Field$require,
																					'uraDora',
																					$elm$json$Json$Decode$string,
																					function (uradora) {
																						return A3(
																							$webbhuset$elm_json_decode$Json$Decode$Field$require,
																							'kanDora',
																							$elm$json$Json$Decode$string,
																							function (kandora) {
																								return A3(
																									$webbhuset$elm_json_decode$Json$Decode$Field$require,
																									'kanUraDora',
																									$elm$json$Json$Decode$string,
																									function (kanuradora) {
																										return A3(
																											$webbhuset$elm_json_decode$Json$Decode$Field$require,
																											'akaDora',
																											$elm$json$Json$Decode$string,
																											function (akadora) {
																												return A3(
																													$webbhuset$elm_json_decode$Json$Decode$Field$require,
																													'agariYame',
																													$elm$json$Json$Decode$string,
																													function (agariyame) {
																														return A3(
																															$webbhuset$elm_json_decode$Json$Decode$Field$require,
																															'tenpaiYame',
																															$elm$json$Json$Decode$string,
																															function (tenpaiyame) {
																																return A3(
																																	$webbhuset$elm_json_decode$Json$Decode$Field$require,
																																	'tobi',
																																	$elm$json$Json$Decode$string,
																																	function (tobi) {
																																		return $elm$json$Json$Decode$succeed(
																																			{agariyame: agariyame, akadora: akadora, atozuke: atozuke, createdAt: createdAt, genten: genten, id: id, kandora: kandora, kanuradora: kanuradora, kuikae: kuikae, kuitan: kuitan, mochiten: mochiten, name: name, oka: oka, tenpaiyame: tenpaiyame, tobi: tobi, uma: uma, uradora: uradora});
																																	});
																															});
																													});
																											});
																									});
																							});
																					});
																			});
																	});
															});
													});
											});
									});
							});
					});
			});
	});
var $author$project$Model$TournamentPlayer$decoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'userId',
	$elm$json$Json$Decode$int,
	function (userId) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'username',
			$elm$json$Json$Decode$string,
			function (username) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'status',
					$elm$json$Json$Decode$string,
					function (status) {
						return $elm$json$Json$Decode$succeed(
							{status: status, userId: userId, username: username});
					});
			});
	});
var $author$project$Model$Tournament$decoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'id',
	$elm$json$Json$Decode$int,
	function (id) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'clubId',
			$elm$json$Json$Decode$int,
			function (clubId) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'createdAt',
					$elm$json$Json$Decode$string,
					function (createdAt) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'ownerId',
							$elm$json$Json$Decode$int,
							function (ownerId) {
								return A3(
									$webbhuset$elm_json_decode$Json$Decode$Field$require,
									'name',
									$elm$json$Json$Decode$string,
									function (name) {
										return A3(
											$webbhuset$elm_json_decode$Json$Decode$Field$require,
											'description',
											$elm$json$Json$Decode$string,
											function (description) {
												return A3(
													$webbhuset$elm_json_decode$Json$Decode$Field$require,
													'startDate',
													$elm$json$Json$Decode$string,
													function (startDate) {
														return A3(
															$webbhuset$elm_json_decode$Json$Decode$Field$require,
															'status',
															$elm$json$Json$Decode$string,
															function (status) {
																return A3(
																	$webbhuset$elm_json_decode$Json$Decode$Field$require,
																	'allowNonMembers',
																	$elm$json$Json$Decode$bool,
																	function (allowNonMembers) {
																		return A3(
																			$webbhuset$elm_json_decode$Json$Decode$Field$require,
																			'requirePermission',
																			$elm$json$Json$Decode$bool,
																			function (requirePermission) {
																				return A3(
																					$webbhuset$elm_json_decode$Json$Decode$Field$require,
																					'playerStatus',
																					$elm$json$Json$Decode$string,
																					function (playerStatus) {
																						return A3(
																							$webbhuset$elm_json_decode$Json$Decode$Field$require,
																							'ruleset',
																							$author$project$Model$Ruleset$decoder,
																							function (ruleset) {
																								return A3(
																									$webbhuset$elm_json_decode$Json$Decode$Field$require,
																									'players',
																									$elm$json$Json$Decode$list($author$project$Model$TournamentPlayer$decoder),
																									function (players) {
																										return A3(
																											$webbhuset$elm_json_decode$Json$Decode$Field$require,
																											'brackets',
																											$elm$json$Json$Decode$list($author$project$Model$BracketShort$decoder),
																											function (brackets) {
																												return $elm$json$Json$Decode$succeed(
																													{allowNonMembers: allowNonMembers, brackets: brackets, clubId: clubId, createdAt: createdAt, description: description, id: id, name: name, ownerId: ownerId, playerStatus: playerStatus, players: players, requirePermission: requirePermission, ruleset: ruleset, startDate: startDate, status: status});
																											});
																									});
																							});
																					});
																			});
																	});
															});
													});
											});
									});
							});
					});
			});
	});
var $author$project$Page$Tournament$get = function (id) {
	return $elm$http$Http$get(
		{
			expect: A2($author$project$Api$expectJson, $author$project$Page$Tournament$GotTournament, $author$project$Model$Tournament$decoder),
			url: $author$project$Api$tournament(id)
		});
};
var $author$project$Page$Tournament$init = F2(
	function (session, tournamentId) {
		return _Utils_Tuple2(
			A4($author$project$Page$Tournament$Model, session, $elm$core$Maybe$Nothing, $author$project$Page$Tournament$Uninitialized, _List_Nil),
			$author$project$Page$Tournament$get(tournamentId));
	});
var $author$project$Page$Tournaments$Model = F3(
	function (session, error, tournaments) {
		return {error: error, session: session, tournaments: tournaments};
	});
var $author$project$Page$Tournaments$GotTournaments = function (a) {
	return {$: 'GotTournaments', a: a};
};
var $author$project$Model$TournamentShort$listDecoder = $elm$json$Json$Decode$list($author$project$Model$TournamentShort$decoder);
var $author$project$Page$Tournaments$get = $elm$http$Http$get(
	{
		expect: A2($author$project$Api$expectJson, $author$project$Page$Tournaments$GotTournaments, $author$project$Model$TournamentShort$listDecoder),
		url: $author$project$Api$tournaments
	});
var $author$project$Page$Tournaments$init = function (session) {
	return _Utils_Tuple2(
		A3($author$project$Page$Tournaments$Model, session, $elm$core$Maybe$Nothing, _List_Nil),
		$author$project$Page$Tournaments$get);
};
var $author$project$Page$User$Model = F3(
	function (session, state, error) {
		return {error: error, session: session, state: state};
	});
var $author$project$Page$User$Uninitialized = {$: 'Uninitialized'};
var $author$project$Page$User$GotUser = function (a) {
	return {$: 'GotUser', a: a};
};
var $author$project$Api$user = function (id) {
	return $author$project$Api$backendUrl + ('/users/' + $elm$core$String$fromInt(id));
};
var $author$project$Model$Membership$decoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'club',
	$author$project$ClubShort$clubShortDecoder,
	function (club) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'createdAt',
			$elm$json$Json$Decode$string,
			function (createdAt) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'approved',
					$elm$json$Json$Decode$bool,
					function (approved) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'denied',
							$elm$json$Json$Decode$bool,
							function (denied) {
								return $elm$json$Json$Decode$succeed(
									{approved: approved, club: club, createdAt: createdAt, denied: denied});
							});
					});
			});
	});
var $author$project$Model$Notification$decoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'id',
	$elm$json$Json$Decode$int,
	function (id) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'createdAt',
			$elm$json$Json$Decode$string,
			function (createdAt) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'creator',
					$author$project$UserShort$userShortDecoder,
					function (creator) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'message',
							$elm$json$Json$Decode$string,
							function (message) {
								return $elm$json$Json$Decode$succeed(
									{createdAt: createdAt, creator: creator, id: id, message: message});
							});
					});
			});
	});
var $author$project$Model$Stats$statsDecoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'totalGames',
	$elm$json$Json$Decode$int,
	function (totalGames) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'totalRounds',
			$elm$json$Json$Decode$int,
			function (totalRounds) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'firstRate',
					$elm$json$Json$Decode$float,
					function (firstRate) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'secondRate',
							$elm$json$Json$Decode$float,
							function (secondRate) {
								return A3(
									$webbhuset$elm_json_decode$Json$Decode$Field$require,
									'thirdRate',
									$elm$json$Json$Decode$float,
									function (thirdRate) {
										return A3(
											$webbhuset$elm_json_decode$Json$Decode$Field$require,
											'fourthRate',
											$elm$json$Json$Decode$float,
											function (fourthRate) {
												return A3(
													$webbhuset$elm_json_decode$Json$Decode$Field$require,
													'bustingRate',
													$elm$json$Json$Decode$float,
													function (bustingRate) {
														return A3(
															$webbhuset$elm_json_decode$Json$Decode$Field$require,
															'winRate',
															$elm$json$Json$Decode$float,
															function (winRate) {
																return A3(
																	$webbhuset$elm_json_decode$Json$Decode$Field$require,
																	'tsumoRate',
																	$elm$json$Json$Decode$float,
																	function (tsumoRate) {
																		return A3(
																			$webbhuset$elm_json_decode$Json$Decode$Field$require,
																			'callRate',
																			$elm$json$Json$Decode$float,
																			function (callRate) {
																				return A3(
																					$webbhuset$elm_json_decode$Json$Decode$Field$require,
																					'riichiRate',
																					$elm$json$Json$Decode$float,
																					function (riichiRate) {
																						return A3(
																							$webbhuset$elm_json_decode$Json$Decode$Field$require,
																							'dealInRate',
																							$elm$json$Json$Decode$float,
																							function (dealInRate) {
																								return $elm$json$Json$Decode$succeed(
																									{bustingRate: bustingRate, callRate: callRate, dealInRate: dealInRate, firstRate: firstRate, fourthRate: fourthRate, riichiRate: riichiRate, secondRate: secondRate, thirdRate: thirdRate, totalGames: totalGames, totalRounds: totalRounds, tsumoRate: tsumoRate, winRate: winRate});
																							});
																					});
																			});
																	});
															});
													});
											});
									});
							});
					});
			});
	});
var $author$project$User$userDecoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'id',
	$elm$json$Json$Decode$int,
	function (id) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'createdAt',
			$elm$json$Json$Decode$string,
			function (createdAt) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'username',
					$elm$json$Json$Decode$string,
					function (username) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'email',
							$elm$json$Json$Decode$string,
							function (email) {
								return A3(
									$webbhuset$elm_json_decode$Json$Decode$Field$require,
									'stats',
									$author$project$Model$Stats$statsDecoder,
									function (stats) {
										return A3(
											$webbhuset$elm_json_decode$Json$Decode$Field$require,
											'ownedClubs',
											$elm$json$Json$Decode$list($author$project$ClubShort$clubShortDecoder),
											function (ownedClubs) {
												return A3(
													$webbhuset$elm_json_decode$Json$Decode$Field$require,
													'memberships',
													$elm$json$Json$Decode$list($author$project$Model$Membership$decoder),
													function (memberships) {
														return A3(
															$webbhuset$elm_json_decode$Json$Decode$Field$require,
															'tournaments',
															$elm$json$Json$Decode$list($author$project$Model$TournamentShort$decoder),
															function (tournaments) {
																return A3(
																	$webbhuset$elm_json_decode$Json$Decode$Field$require,
																	'notifications',
																	$elm$json$Json$Decode$list($author$project$Model$Notification$decoder),
																	function (notifications) {
																		return $elm$json$Json$Decode$succeed(
																			{createdAt: createdAt, email: email, id: id, memberships: memberships, notifications: notifications, ownedClubs: ownedClubs, stats: stats, tournaments: tournaments, username: username});
																	});
															});
													});
											});
									});
							});
					});
			});
	});
var $author$project$Page$User$get = function (id) {
	return $elm$http$Http$get(
		{
			expect: A2($author$project$Api$expectJson, $author$project$Page$User$GotUser, $author$project$User$userDecoder),
			url: $author$project$Api$user(id)
		});
};
var $author$project$Page$User$init = F2(
	function (session, id) {
		return _Utils_Tuple2(
			A3($author$project$Page$User$Model, session, $author$project$Page$User$Uninitialized, $elm$core$Maybe$Nothing),
			$author$project$Page$User$get(id));
	});
var $author$project$Page$Ruleset$Model = F3(
	function (session, error, state) {
		return {error: error, session: session, state: state};
	});
var $author$project$Page$Ruleset$Uninitialized = {$: 'Uninitialized'};
var $author$project$Page$Ruleset$GotRuleset = function (a) {
	return {$: 'GotRuleset', a: a};
};
var $author$project$Api$clubRulesets = function (clubId) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				$author$project$Api$club(clubId),
				'/rulesets'
			]));
};
var $author$project$Api$clubRuleset = F2(
	function (clubId, rulesetId) {
		return $elm$core$String$concat(
			_List_fromArray(
				[
					$author$project$Api$clubRulesets(clubId),
					'/',
					$elm$core$String$fromInt(rulesetId)
				]));
	});
var $author$project$Page$Ruleset$get = F2(
	function (clubId, rulesetId) {
		return $elm$http$Http$get(
			{
				expect: A2($author$project$Api$expectJson, $author$project$Page$Ruleset$GotRuleset, $author$project$Model$Ruleset$decoder),
				url: A2($author$project$Api$clubRuleset, clubId, rulesetId)
			});
	});
var $author$project$Page$Ruleset$initGet = F3(
	function (session, clubId, rulesetId) {
		return _Utils_Tuple2(
			A3($author$project$Page$Ruleset$Model, session, $elm$core$Maybe$Nothing, $author$project$Page$Ruleset$Uninitialized),
			A2($author$project$Page$Ruleset$get, clubId, rulesetId));
	});
var $author$project$Page$Club$Form = F4(
	function (name, website, contact, localization) {
		return {contact: contact, localization: localization, name: name, website: website};
	});
var $author$project$Page$Club$New = function (a) {
	return {$: 'New', a: a};
};
var $author$project$Page$Club$initNew = function (session) {
	return _Utils_Tuple2(
		A3(
			$author$project$Page$Club$Model,
			session,
			$elm$core$Maybe$Nothing,
			$author$project$Page$Club$New(
				A4($author$project$Page$Club$Form, '', '', '', ''))),
		$elm$core$Platform$Cmd$none);
};
var $author$project$Page$Tournament$Form = F7(
	function (ruleset, name, description, startDate, allowNonMembers, requirePermission, brackets) {
		return {allowNonMembers: allowNonMembers, brackets: brackets, description: description, name: name, requirePermission: requirePermission, ruleset: ruleset, startDate: startDate};
	});
var $author$project$Page$Tournament$New = function (a) {
	return {$: 'New', a: a};
};
var $author$project$Page$Tournament$GotRulesets = function (a) {
	return {$: 'GotRulesets', a: a};
};
var $author$project$Model$Ruleset$listDecoder = $elm$json$Json$Decode$list($author$project$Model$Ruleset$decoder);
var $author$project$Page$Tournament$requestRulesets = function (clubId) {
	return $elm$http$Http$get(
		{
			expect: A2($author$project$Api$expectJson, $author$project$Page$Tournament$GotRulesets, $author$project$Model$Ruleset$listDecoder),
			url: $author$project$Api$clubRulesets(clubId)
		});
};
var $author$project$Page$Tournament$initNew = F2(
	function (session, clubId) {
		return _Utils_Tuple2(
			A4(
				$author$project$Page$Tournament$Model,
				session,
				$elm$core$Maybe$Nothing,
				$author$project$Page$Tournament$New(
					A7($author$project$Page$Tournament$Form, $elm$core$Maybe$Nothing, '', '', '', false, false, _List_Nil)),
				_List_Nil),
			$author$project$Page$Tournament$requestRulesets(clubId));
	});
var $author$project$Session$navKey = function (session) {
	if (session.$ === 'LoggedIn') {
		var key = session.a;
		return key;
	} else {
		var key = session.a;
		return key;
	}
};
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $author$project$Page$Bracket$toSession = function (model) {
	return model.session;
};
var $author$project$Page$Club$toSession = function (model) {
	return model.session;
};
var $author$project$Page$Clubs$toSession = function (model) {
	return model.session;
};
var $author$project$Page$Login$toSession = function (model) {
	return model.session;
};
var $author$project$Page$Ruleset$toSession = function (model) {
	return model.session;
};
var $author$project$Page$SignUp$toSession = function (model) {
	return model.session;
};
var $author$project$Page$Tournament$toSession = function (model) {
	return model.session;
};
var $author$project$Page$Tournaments$toSession = function (model) {
	return model.session;
};
var $author$project$Page$User$toSession = function (model) {
	return model.session;
};
var $author$project$Main$toSession = function (model) {
	switch (model.$) {
		case 'Home':
			var session = model.a;
			return session;
		case 'NotFound':
			var session = model.a;
			return session;
		case 'Login':
			var login = model.a;
			return $author$project$Page$Login$toSession(login);
		case 'SignUp':
			var signup = model.a;
			return $author$project$Page$SignUp$toSession(signup);
		case 'Clubs':
			var clubs = model.a;
			return $author$project$Page$Clubs$toSession(clubs);
		case 'NewClub':
			var club = model.a;
			return $author$project$Page$Club$toSession(club);
		case 'Club':
			var club = model.a;
			return $author$project$Page$Club$toSession(club);
		case 'Ruleset':
			var ruleset = model.a;
			return $author$project$Page$Ruleset$toSession(ruleset);
		case 'Tournaments':
			var tournaments = model.a;
			return $author$project$Page$Tournaments$toSession(tournaments);
		case 'NewTournament':
			var tournament = model.a;
			return $author$project$Page$Tournament$toSession(tournament);
		case 'Tournament':
			var tournament = model.a;
			return $author$project$Page$Tournament$toSession(tournament);
		case 'Bracket':
			var bracket = model.a;
			return $author$project$Page$Bracket$toSession(bracket);
		default:
			var user = model.a;
			return $author$project$Page$User$toSession(user);
	}
};
var $author$project$Main$updateWith = F3(
	function (toModel, toMsg, _v0) {
		var subModel = _v0.a;
		var subCmd = _v0.b;
		return _Utils_Tuple2(
			toModel(subModel),
			A2($elm$core$Platform$Cmd$map, toMsg, subCmd));
	});
var $author$project$Main$changeRouteTo = F2(
	function (maybeRoute, model) {
		var session = $author$project$Main$toSession(model);
		if (maybeRoute.$ === 'Nothing') {
			return _Utils_Tuple2(
				$author$project$Main$NotFound(session),
				$elm$core$Platform$Cmd$none);
		} else {
			switch (maybeRoute.a.$) {
				case 'Home':
					var _v1 = maybeRoute.a;
					return _Utils_Tuple2(
						$author$project$Main$Home(session),
						$elm$core$Platform$Cmd$none);
				case 'Login':
					var _v2 = maybeRoute.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$Login,
						$author$project$Main$GotLoginMsg,
						$author$project$Page$Login$init(session));
				case 'Logout':
					var _v3 = maybeRoute.a;
					var navKey = $author$project$Session$navKey(session);
					return _Utils_Tuple2(
						$author$project$Main$Home(
							$author$project$Session$Anonymus(navKey)),
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							navKey,
							A2($elm$url$Url$Builder$absolute, _List_Nil, _List_Nil)));
				case 'SignUp':
					var _v4 = maybeRoute.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$SignUp,
						$author$project$Main$GotSignUpMsg,
						$author$project$Page$SignUp$init(session));
				case 'Clubs':
					var _v5 = maybeRoute.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$Clubs,
						$author$project$Main$GotClubsMsg,
						$author$project$Page$Clubs$init(session));
				case 'NewClub':
					var _v6 = maybeRoute.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$NewClub,
						$author$project$Main$GotNewClubMsg,
						$author$project$Page$Club$initNew(session));
				case 'Club':
					var clubId = maybeRoute.a.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$Club,
						$author$project$Main$GotClubMsg,
						A2($author$project$Page$Club$init, session, clubId));
				case 'Ruleset':
					var _v7 = maybeRoute.a;
					var clubId = _v7.a;
					var rulesetId = _v7.b;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$Ruleset,
						$author$project$Main$GotRulesetMsg,
						A3($author$project$Page$Ruleset$initGet, session, clubId, rulesetId));
				case 'Tournaments':
					var _v8 = maybeRoute.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$Tournaments,
						$author$project$Main$GotTournamentsMsg,
						$author$project$Page$Tournaments$init(session));
				case 'NewTournament':
					var clubId = maybeRoute.a.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$NewTournament,
						$author$project$Main$GotNewTournamentMsg,
						A2($author$project$Page$Tournament$initNew, session, clubId));
				case 'Tournament':
					var tournamentId = maybeRoute.a.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$Tournament,
						$author$project$Main$GotTournamentMsg,
						A2($author$project$Page$Tournament$init, session, tournamentId));
				case 'Bracket':
					var _v9 = maybeRoute.a;
					var tournamentId = _v9.a;
					var bracketId = _v9.b;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$Bracket,
						$author$project$Main$GotBracketMsg,
						A3($author$project$Page$Bracket$init, session, tournamentId, bracketId));
				default:
					var userId = maybeRoute.a.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$User,
						$author$project$Main$GotUserMsg,
						A2($author$project$Page$User$init, session, userId));
			}
		}
	});
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {frag: frag, params: params, unvisited: unvisited, value: value, visited: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.unvisited;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.value);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.value);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 'Nothing') {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 'Nothing') {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 'Nothing') {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 'Nothing') {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0.a;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.path),
					$elm$url$Url$Parser$prepareQuery(url.query),
					url.fragment,
					$elm$core$Basics$identity)));
	});
var $author$project$Route$Bracket = F2(
	function (a, b) {
		return {$: 'Bracket', a: a, b: b};
	});
var $author$project$Route$Club = function (a) {
	return {$: 'Club', a: a};
};
var $author$project$Route$Clubs = {$: 'Clubs'};
var $author$project$Route$Home = {$: 'Home'};
var $author$project$Route$Login = {$: 'Login'};
var $author$project$Route$Logout = {$: 'Logout'};
var $author$project$Route$NewClub = {$: 'NewClub'};
var $author$project$Route$NewTournament = function (a) {
	return {$: 'NewTournament', a: a};
};
var $author$project$Route$Ruleset = F2(
	function (a, b) {
		return {$: 'Ruleset', a: a, b: b};
	});
var $author$project$Route$SignUp = {$: 'SignUp'};
var $author$project$Route$Tournament = function (a) {
	return {$: 'Tournament', a: a};
};
var $author$project$Route$Tournaments = {$: 'Tournaments'};
var $author$project$Route$User = function (a) {
	return {$: 'User', a: a};
};
var $elm$url$Url$Parser$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$url$Url$Parser$custom = F2(
	function (tipe, stringToSomething) {
		return $elm$url$Url$Parser$Parser(
			function (_v0) {
				var visited = _v0.visited;
				var unvisited = _v0.unvisited;
				var params = _v0.params;
				var frag = _v0.frag;
				var value = _v0.value;
				if (!unvisited.b) {
					return _List_Nil;
				} else {
					var next = unvisited.a;
					var rest = unvisited.b;
					var _v2 = stringToSomething(next);
					if (_v2.$ === 'Just') {
						var nextValue = _v2.a;
						return _List_fromArray(
							[
								A5(
								$elm$url$Url$Parser$State,
								A2($elm$core$List$cons, next, visited),
								rest,
								params,
								frag,
								value(nextValue))
							]);
					} else {
						return _List_Nil;
					}
				}
			});
	});
var $elm$url$Url$Parser$int = A2($elm$url$Url$Parser$custom, 'NUMBER', $elm$core$String$toInt);
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.visited;
		var unvisited = _v0.unvisited;
		var params = _v0.params;
		var frag = _v0.frag;
		var value = _v0.value;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0.a;
		return $elm$url$Url$Parser$Parser(
			function (_v1) {
				var visited = _v1.visited;
				var unvisited = _v1.unvisited;
				var params = _v1.params;
				var frag = _v1.frag;
				var value = _v1.value;
				return A2(
					$elm$core$List$map,
					$elm$url$Url$Parser$mapState(value),
					parseArg(
						A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
			});
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return $elm$url$Url$Parser$Parser(
		function (state) {
			return A2(
				$elm$core$List$concatMap,
				function (_v0) {
					var parser = _v0.a;
					return parser(state);
				},
				parsers);
		});
};
var $elm$url$Url$Parser$s = function (str) {
	return $elm$url$Url$Parser$Parser(
		function (_v0) {
			var visited = _v0.visited;
			var unvisited = _v0.unvisited;
			var params = _v0.params;
			var frag = _v0.frag;
			var value = _v0.value;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				return _Utils_eq(next, str) ? _List_fromArray(
					[
						A5(
						$elm$url$Url$Parser$State,
						A2($elm$core$List$cons, next, visited),
						rest,
						params,
						frag,
						value)
					]) : _List_Nil;
			}
		});
};
var $elm$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0.a;
		var parseAfter = _v1.a;
		return $elm$url$Url$Parser$Parser(
			function (state) {
				return A2(
					$elm$core$List$concatMap,
					parseAfter,
					parseBefore(state));
			});
	});
var $elm$url$Url$Parser$top = $elm$url$Url$Parser$Parser(
	function (state) {
		return _List_fromArray(
			[state]);
	});
var $author$project$Route$parser = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2($elm$url$Url$Parser$map, $author$project$Route$Home, $elm$url$Url$Parser$top),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Login,
			$elm$url$Url$Parser$s('login')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Logout,
			$elm$url$Url$Parser$s('logout')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$SignUp,
			$elm$url$Url$Parser$s('signup')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Clubs,
			$elm$url$Url$Parser$s('clubs')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$NewClub,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('clubs'),
				$elm$url$Url$Parser$s('new'))),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Club,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('clubs'),
				$elm$url$Url$Parser$int)),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Ruleset,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('clubs'),
				A2(
					$elm$url$Url$Parser$slash,
					$elm$url$Url$Parser$int,
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s('rulesets'),
						$elm$url$Url$Parser$int)))),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Tournaments,
			$elm$url$Url$Parser$s('tournaments')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$NewTournament,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('tournaments'),
				A2(
					$elm$url$Url$Parser$slash,
					$elm$url$Url$Parser$s('new'),
					$elm$url$Url$Parser$int))),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Tournament,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('tournaments'),
				$elm$url$Url$Parser$int)),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Bracket,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('tournaments'),
				A2(
					$elm$url$Url$Parser$slash,
					$elm$url$Url$Parser$int,
					A2(
						$elm$url$Url$Parser$slash,
						$elm$url$Url$Parser$s('brackets'),
						$elm$url$Url$Parser$int)))),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$User,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('users'),
				$elm$url$Url$Parser$int))
		]));
var $author$project$Route$fromUrl = function (url) {
	return A2($elm$url$Url$Parser$parse, $author$project$Route$parser, url);
};
var $author$project$Main$init = F3(
	function (_v0, url, key) {
		return A2(
			$author$project$Main$changeRouteTo,
			$author$project$Route$fromUrl(url),
			$author$project$Main$Home(
				$author$project$Session$Anonymus(key)));
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 'Nothing') {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 'Nothing') {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.protocol;
		if (_v0.$ === 'Http') {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.fragment,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.query,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.port_,
					_Utils_ap(http, url.host)),
				url.path)));
};
var $author$project$Page$Bracket$Anonymus = {$: 'Anonymus'};
var $author$project$Page$Bracket$Owner = {$: 'Owner'};
var $author$project$Page$Bracket$View = F2(
	function (a, b) {
		return {$: 'View', a: a, b: b};
	});
var $author$project$Model$Series$GameForm = F5(
	function (logLink, player1Seat, player2Seat, player3Seat, player4Seat) {
		return {logLink: logLink, player1Seat: player1Seat, player2Seat: player2Seat, player3Seat: player3Seat, player4Seat: player4Seat};
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Page$Bracket$addGameForm = F2(
	function (bracket, series) {
		return _Utils_update(
			bracket,
			{
				series: A2(
					$elm$core$List$sortBy,
					function ($) {
						return $.id;
					},
					A2(
						$elm$core$List$append,
						_List_fromArray(
							[
								_Utils_update(
								series,
								{
									gameForm: $elm$core$Maybe$Just(
										A5($author$project$Model$Series$GameForm, '', 'East', 'East', 'East', 'East'))
								})
							]),
						A2(
							$elm$core$List$filter,
							function (s) {
								return !_Utils_eq(s.id, series.id);
							},
							bracket.series)))
			});
	});
var $author$project$Api$errorToString = function (error) {
	switch (error.$) {
		case 'BadUrl':
			var url = error.a;
			return 'Url inválida: ' + url;
		case 'Timeout':
			return 'Erro de timeout, tente novamente';
		case 'NetworkError':
			return 'Erro de rede, verifique a sua conexão e tente novamente';
		case 'BadStatus':
			var body = error.b;
			return body;
		default:
			var body = error.a;
			return 'Falha interna: ' + body;
	}
};
var $author$project$Page$Bracket$removeGameForm = F2(
	function (bracket, series) {
		return _Utils_update(
			bracket,
			{
				series: A2(
					$elm$core$List$sortBy,
					function ($) {
						return $.id;
					},
					A2(
						$elm$core$List$append,
						_List_fromArray(
							[
								_Utils_update(
								series,
								{gameForm: $elm$core$Maybe$Nothing})
							]),
						A2(
							$elm$core$List$filter,
							function (s) {
								return !_Utils_eq(s.id, series.id);
							},
							bracket.series)))
			});
	});
var $author$project$Page$Bracket$gameFormEncoder = function (form) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'logLink',
				$elm$json$Json$Encode$string(form.logLink)),
				_Utils_Tuple2(
				'player1Seat',
				$elm$json$Json$Encode$string(form.player1Seat)),
				_Utils_Tuple2(
				'player2Seat',
				$elm$json$Json$Encode$string(form.player2Seat)),
				_Utils_Tuple2(
				'player3Seat',
				$elm$json$Json$Encode$string(form.player3Seat)),
				_Utils_Tuple2(
				'player4Seat',
				$elm$json$Json$Encode$string(form.player4Seat))
			]));
};
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $elm$http$Http$Header = F2(
	function (a, b) {
		return {$: 'Header', a: a, b: b};
	});
var $elm$http$Http$header = $elm$http$Http$Header;
var $author$project$Api$privatePost = F2(
	function (r, viewer) {
		return $elm$http$Http$request(
			{
				body: r.body,
				expect: r.expect,
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'bearer ' + viewer.token)
					]),
				method: 'POST',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: r.url
			});
	});
var $author$project$Api$series = F3(
	function (tournamentId, bracketId, seriesId) {
		return $elm$core$String$concat(
			_List_fromArray(
				[
					A2($author$project$Api$tournamentBracket, tournamentId, bracketId),
					'/series/',
					$elm$core$String$fromInt(seriesId)
				]));
	});
var $author$project$Page$Bracket$requestPostGame = F4(
	function (viewer, bracket, series, form) {
		return A2(
			$author$project$Api$privatePost,
			{
				body: $elm$http$Http$jsonBody(
					$author$project$Page$Bracket$gameFormEncoder(form)),
				expect: A2($author$project$Api$expectJson, $author$project$Page$Bracket$GotBracket, $author$project$Model$Bracket$decoder),
				url: A3($author$project$Api$series, bracket.tournamentId, bracket.id, series.id)
			},
			viewer);
	});
var $author$project$Session$toViewer = function (session) {
	if (session.$ === 'LoggedIn') {
		var viewer = session.b;
		return $elm$core$Maybe$Just(viewer);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Page$Bracket$toggleSeries = F2(
	function (bracket, s) {
		return _Utils_update(
			bracket,
			{
				series: A2(
					$elm$core$List$sortBy,
					function ($) {
						return $.id;
					},
					A2(
						$elm$core$List$append,
						_List_fromArray(
							[
								_Utils_update(
								s,
								{isFolded: !s.isFolded})
							]),
						A2(
							$elm$core$List$filter,
							function (i) {
								return !_Utils_eq(i.id, s.id);
							},
							bracket.series)))
			});
	});
var $author$project$Page$Bracket$updateSeriesForm = F3(
	function (bracket, series, transform) {
		var _v0 = series.gameForm;
		if (_v0.$ === 'Just') {
			var form = _v0.a;
			return _Utils_Tuple2(
				_Utils_update(
					bracket,
					{
						series: A2(
							$elm$core$List$sortBy,
							function ($) {
								return $.id;
							},
							A2(
								$elm$core$List$append,
								_List_fromArray(
									[
										_Utils_update(
										series,
										{
											gameForm: $elm$core$Maybe$Just(
												transform(form))
										})
									]),
								A2(
									$elm$core$List$filter,
									function (s) {
										return !_Utils_eq(s.id, series.id);
									},
									bracket.series)))
					}),
				$elm$core$Maybe$Nothing);
		} else {
			return _Utils_Tuple2(
				bracket,
				$elm$core$Maybe$Just(
					'Tentativa de atualizar um form inexistente, série ' + $elm$core$String$fromInt(series.id)));
		}
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Page$Bracket$validateGameForm = function (form) {
	var seats = _List_fromArray(
		['East', 'South', 'West', 'North']);
	var formSeats = _List_fromArray(
		[form.player1Seat, form.player2Seat, form.player3Seat, form.player4Seat]);
	return $elm$core$String$isEmpty(form.logLink) ? $elm$core$Result$Err('Preencha o link para o log do jogo') : ((!A2($elm$core$List$member, form.player1Seat, seats)) ? $elm$core$Result$Err('Preencha o acento do jogador 1') : ((!A2($elm$core$List$member, form.player2Seat, seats)) ? $elm$core$Result$Err('Preencha o acento do jogador 2') : ((!A2($elm$core$List$member, form.player3Seat, seats)) ? $elm$core$Result$Err('Preencha o acento do jogador 3') : ((!A2($elm$core$List$member, form.player4Seat, seats)) ? $elm$core$Result$Err('Preencha o acento do jogador 4') : ((!A2($elm$core$List$member, 'East', formSeats)) ? $elm$core$Result$Err('Um jogador precisa ser o acento leste') : ((!A2($elm$core$List$member, 'South', formSeats)) ? $elm$core$Result$Err('Um jogador precisa ser o acento sul') : ((!A2($elm$core$List$member, 'West', formSeats)) ? $elm$core$Result$Err('Um jogador precisa ser o acento oeste') : ((!A2($elm$core$List$member, 'North', formSeats)) ? $elm$core$Result$Err('Um jogador precisa ser o acento norte') : $elm$core$Result$Ok(_Utils_Tuple0)))))))));
};
var $author$project$Page$Bracket$update = F2(
	function (msg, model) {
		var unwrapResult = F2(
			function (result, act) {
				if (result.$ === 'Ok') {
					var val = result.a;
					return act(val);
				} else {
					var error = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								error: $elm$core$Maybe$Just(
									$author$project$Api$errorToString(error))
							}),
						$elm$core$Platform$Cmd$none);
				}
			});
		var _v0 = _Utils_Tuple2(msg, model.state);
		_v0$0:
		while (true) {
			if (_v0.b.$ === 'Uninitialized') {
				if (_v0.a.$ === 'GotBracket') {
					break _v0$0;
				} else {
					var _v2 = _v0.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								error: $elm$core$Maybe$Just('Estado inválido')
							}),
						$elm$core$Platform$Cmd$none);
				}
			} else {
				switch (_v0.a.$) {
					case 'GotBracket':
						break _v0$0;
					case 'ToggleFold':
						var series = _v0.a.a;
						var _v3 = _v0.b;
						var _switch = _v3.a;
						var bracket = _v3.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									state: A2(
										$author$project$Page$Bracket$View,
										_switch,
										A2($author$project$Page$Bracket$toggleSeries, bracket, series))
								}),
							$elm$core$Platform$Cmd$none);
					case 'AddGame':
						var series = _v0.a.a;
						var _v4 = _v0.b;
						var _switch = _v4.a;
						var bracket = _v4.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									state: A2(
										$author$project$Page$Bracket$View,
										_switch,
										A2($author$project$Page$Bracket$addGameForm, bracket, series))
								}),
							$elm$core$Platform$Cmd$none);
					case 'PostGame':
						var series = _v0.a.a;
						var _v5 = _v0.b;
						var bracket = _v5.b;
						var _v6 = series.gameForm;
						if (_v6.$ === 'Just') {
							var form = _v6.a;
							var _v7 = $author$project$Page$Bracket$validateGameForm(form);
							if (_v7.$ === 'Ok') {
								var _v8 = $author$project$Session$toViewer(model.session);
								if (_v8.$ === 'Just') {
									var viewer = _v8.a;
									return _Utils_Tuple2(
										model,
										A4($author$project$Page$Bracket$requestPostGame, viewer, bracket, series, form));
								} else {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												error: $elm$core$Maybe$Just('De alguma forma, você não está logado')
											}),
										$elm$core$Platform$Cmd$none);
								}
							} else {
								var error = _v7.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											error: $elm$core$Maybe$Just(error)
										}),
									$elm$core$Platform$Cmd$none);
							}
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										error: $elm$core$Maybe$Just(
											'Série ' + ($elm$core$String$fromInt(series.id) + ' não está em modo de edição'))
									}),
								$elm$core$Platform$Cmd$none);
						}
					case 'CancelAddGame':
						var series = _v0.a.a;
						var _v9 = _v0.b;
						var _switch = _v9.a;
						var bracket = _v9.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									state: A2(
										$author$project$Page$Bracket$View,
										_switch,
										A2($author$project$Page$Bracket$removeGameForm, bracket, series))
								}),
							$elm$core$Platform$Cmd$none);
					case 'InputPlayer1Seat':
						var _v10 = _v0.a;
						var series = _v10.a;
						var seat = _v10.b;
						var _v11 = _v0.b;
						var _switch = _v11.a;
						var bracket = _v11.b;
						var _v12 = A3(
							$author$project$Page$Bracket$updateSeriesForm,
							bracket,
							series,
							function (s) {
								return _Utils_update(
									s,
									{player1Seat: seat});
							});
						var b = _v12.a;
						var error = _v12.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: error,
									state: A2($author$project$Page$Bracket$View, _switch, b)
								}),
							$elm$core$Platform$Cmd$none);
					case 'InputPlayer2Seat':
						var _v13 = _v0.a;
						var series = _v13.a;
						var seat = _v13.b;
						var _v14 = _v0.b;
						var _switch = _v14.a;
						var bracket = _v14.b;
						var _v15 = A3(
							$author$project$Page$Bracket$updateSeriesForm,
							bracket,
							series,
							function (s) {
								return _Utils_update(
									s,
									{player2Seat: seat});
							});
						var b = _v15.a;
						var error = _v15.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: error,
									state: A2($author$project$Page$Bracket$View, _switch, b)
								}),
							$elm$core$Platform$Cmd$none);
					case 'InputPlayer3Seat':
						var _v16 = _v0.a;
						var series = _v16.a;
						var seat = _v16.b;
						var _v17 = _v0.b;
						var _switch = _v17.a;
						var bracket = _v17.b;
						var _v18 = A3(
							$author$project$Page$Bracket$updateSeriesForm,
							bracket,
							series,
							function (s) {
								return _Utils_update(
									s,
									{player3Seat: seat});
							});
						var b = _v18.a;
						var error = _v18.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: error,
									state: A2($author$project$Page$Bracket$View, _switch, b)
								}),
							$elm$core$Platform$Cmd$none);
					case 'InputPlayer4Seat':
						var _v19 = _v0.a;
						var series = _v19.a;
						var seat = _v19.b;
						var _v20 = _v0.b;
						var _switch = _v20.a;
						var bracket = _v20.b;
						var _v21 = A3(
							$author$project$Page$Bracket$updateSeriesForm,
							bracket,
							series,
							function (s) {
								return _Utils_update(
									s,
									{player4Seat: seat});
							});
						var b = _v21.a;
						var error = _v21.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: error,
									state: A2($author$project$Page$Bracket$View, _switch, b)
								}),
							$elm$core$Platform$Cmd$none);
					default:
						var _v22 = _v0.a;
						var series = _v22.a;
						var logLink = _v22.b;
						var _v23 = _v0.b;
						var _switch = _v23.a;
						var bracket = _v23.b;
						var _v24 = A3(
							$author$project$Page$Bracket$updateSeriesForm,
							bracket,
							series,
							function (s) {
								return _Utils_update(
									s,
									{logLink: logLink});
							});
						var b = _v24.a;
						var error = _v24.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: error,
									state: A2($author$project$Page$Bracket$View, _switch, b)
								}),
							$elm$core$Platform$Cmd$none);
				}
			}
		}
		var result = _v0.a.a;
		return A2(
			unwrapResult,
			result,
			function (bracket) {
				var _switch = function () {
					var _v1 = $author$project$Session$toViewer(model.session);
					if (_v1.$ === 'Just') {
						var viewer = _v1.a;
						return _Utils_eq(bracket.ownerId, viewer.id) ? $author$project$Page$Bracket$Owner : $author$project$Page$Bracket$Anonymus;
					} else {
						return $author$project$Page$Bracket$Anonymus;
					}
				}();
				var series = A2(
					$elm$core$List$sortBy,
					function ($) {
						return $.id;
					},
					bracket.series);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							error: $elm$core$Maybe$Nothing,
							state: A2(
								$author$project$Page$Bracket$View,
								_switch,
								_Utils_update(
									bracket,
									{series: series}))
						}),
					$elm$core$Platform$Cmd$none);
			});
	});
var $author$project$Page$Club$Edit = F2(
	function (a, b) {
		return {$: 'Edit', a: a, b: b};
	});
var $author$project$Page$Club$Owner = {$: 'Owner'};
var $author$project$Page$Club$View = F2(
	function (a, b) {
		return {$: 'View', a: a, b: b};
	});
var $elm$browser$Browser$Navigation$back = F2(
	function (key, n) {
		return A2(_Browser_go, key, -n);
	});
var $author$project$Page$Club$Anonymus = {$: 'Anonymus'};
var $author$project$Page$Club$Member = function (a) {
	return {$: 'Member', a: a};
};
var $author$project$Page$Club$NonMember = {$: 'NonMember'};
var $elm_community$list_extra$List$Extra$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var first = list.a;
				var rest = list.b;
				if (predicate(first)) {
					return $elm$core$Maybe$Just(first);
				} else {
					var $temp$predicate = predicate,
						$temp$list = rest;
					predicate = $temp$predicate;
					list = $temp$list;
					continue find;
				}
			}
		}
	});
var $author$project$Page$Club$initState = F2(
	function (club, session) {
		var _v0 = $author$project$Session$toViewer(session);
		if (_v0.$ === 'Just') {
			var viewer = _v0.a;
			var isMember = function (m) {
				return _Utils_eq(m.user.id, viewer.id);
			};
			if (_Utils_eq(club.owner.id, viewer.id)) {
				return A2($author$project$Page$Club$View, club, $author$project$Page$Club$Owner);
			} else {
				var _v1 = A2($elm_community$list_extra$List$Extra$find, isMember, club.members);
				if (_v1.$ === 'Just') {
					var membership = _v1.a;
					return A2(
						$author$project$Page$Club$View,
						club,
						$author$project$Page$Club$Member(membership));
				} else {
					return A2($author$project$Page$Club$View, club, $author$project$Page$Club$NonMember);
				}
			}
		} else {
			return A2($author$project$Page$Club$View, club, $author$project$Page$Club$Anonymus);
		}
	});
var $author$project$Page$Club$DeleteClub = function (a) {
	return {$: 'DeleteClub', a: a};
};
var $author$project$Api$expectWhatever = function (toMsg) {
	return A2(
		$elm$http$Http$expectStringResponse,
		toMsg,
		function (response) {
			switch (response.$) {
				case 'BadUrl_':
					var url = response.a;
					return $elm$core$Result$Err(
						$author$project$Api$BadUrl(url));
				case 'Timeout_':
					return $elm$core$Result$Err($author$project$Api$Timeout);
				case 'NetworkError_':
					return $elm$core$Result$Err($author$project$Api$NetworkError);
				case 'BadStatus_':
					var metadata = response.a;
					var body = response.b;
					return $elm$core$Result$Err(
						A2($author$project$Api$BadStatus, metadata.statusCode, body));
				default:
					return $elm$core$Result$Ok(_Utils_Tuple0);
			}
		});
};
var $author$project$Api$privateDelete = F2(
	function (r, viewer) {
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$emptyBody,
				expect: r.expect,
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'bearer ' + viewer.token)
					]),
				method: 'DELETE',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: r.url
			});
	});
var $author$project$Page$Club$requestDelete = F2(
	function (club, viewer) {
		return A2(
			$author$project$Api$privateDelete,
			{
				expect: $author$project$Api$expectWhatever($author$project$Page$Club$DeleteClub),
				url: $author$project$Api$club(club.id)
			},
			viewer);
	});
var $author$project$Api$clubMembers = function (id) {
	return $author$project$Api$club(id) + '/members';
};
var $author$project$Api$clubInvite = function (id) {
	return $author$project$Api$clubMembers(id) + '/invite';
};
var $author$project$Page$Club$requestInvite = F2(
	function (club, viewer) {
		return A2(
			$author$project$Api$privatePost,
			{
				body: $elm$http$Http$emptyBody,
				expect: A2($author$project$Api$expectJson, $author$project$Page$Club$GotClub, $author$project$Club$clubDecoder),
				url: $author$project$Api$clubInvite(club.id)
			},
			viewer);
	});
var $author$project$Page$Club$requestLeave = F2(
	function (club, viewer) {
		return A2(
			$author$project$Api$privateDelete,
			{
				expect: A2($author$project$Api$expectJson, $author$project$Page$Club$GotClub, $author$project$Club$clubDecoder),
				url: $author$project$Api$clubMembers(club.id)
			},
			viewer);
	});
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Page$Club$patchEncoder = function (form) {
	var maybeNull = function (val) {
		return $elm$core$String$isEmpty(val) ? $elm$json$Json$Encode$null : $elm$json$Json$Encode$string(val);
	};
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				maybeNull(form.name)),
				_Utils_Tuple2(
				'website',
				maybeNull(form.website)),
				_Utils_Tuple2(
				'contact',
				maybeNull(form.contact)),
				_Utils_Tuple2(
				'localization',
				maybeNull(form.localization))
			]));
};
var $author$project$Api$privatePut = F2(
	function (r, viewer) {
		return $elm$http$Http$request(
			{
				body: r.body,
				expect: r.expect,
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'bearer ' + viewer.token)
					]),
				method: 'PUT',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: r.url
			});
	});
var $author$project$Page$Club$requestPatch = F3(
	function (club, form, viewer) {
		return A2(
			$author$project$Api$privatePut,
			{
				body: $elm$http$Http$jsonBody(
					$author$project$Page$Club$patchEncoder(form)),
				expect: A2($author$project$Api$expectJson, $author$project$Page$Club$GotClub, $author$project$Club$clubDecoder),
				url: $author$project$Api$club(club.id)
			},
			viewer);
	});
var $author$project$Page$Club$GotPostClub = function (a) {
	return {$: 'GotPostClub', a: a};
};
var $author$project$Page$Club$postEncoder = function (form) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(form.name)),
				_Utils_Tuple2(
				'website',
				$elm$json$Json$Encode$string(form.website)),
				_Utils_Tuple2(
				'contact',
				$elm$json$Json$Encode$string(form.contact)),
				_Utils_Tuple2(
				'localization',
				$elm$json$Json$Encode$string(form.localization))
			]));
};
var $author$project$Page$Club$requestPost = F2(
	function (form, viewer) {
		return A2(
			$author$project$Api$privatePost,
			{
				body: $elm$http$Http$jsonBody(
					$author$project$Page$Club$postEncoder(form)),
				expect: A2($author$project$Api$expectJson, $author$project$Page$Club$GotPostClub, $author$project$Club$clubDecoder),
				url: $author$project$Api$clubs
			},
			viewer);
	});
var $author$project$Api$clubMember = F2(
	function (clubId, userId) {
		return $author$project$Api$clubMembers(clubId) + ('/' + $elm$core$String$fromInt(userId));
	});
var $author$project$Page$Club$requestRemoveMember = F3(
	function (club, membership, viewer) {
		return A2(
			$author$project$Api$privateDelete,
			{
				expect: A2($author$project$Api$expectJson, $author$project$Page$Club$GotClub, $author$project$Club$clubDecoder),
				url: A2($author$project$Api$clubMember, club.id, membership.user.id)
			},
			viewer);
	});
var $author$project$Route$routeToPieces = function (route) {
	switch (route.$) {
		case 'Home':
			return _List_Nil;
		case 'Login':
			return _List_fromArray(
				['login']);
		case 'Logout':
			return _List_fromArray(
				['logout']);
		case 'SignUp':
			return _List_fromArray(
				['signup']);
		case 'Clubs':
			return _List_fromArray(
				['clubs']);
		case 'NewClub':
			return _List_fromArray(
				['clubs', 'new']);
		case 'Club':
			var id = route.a;
			return _List_fromArray(
				[
					'clubs',
					$elm$core$String$fromInt(id)
				]);
		case 'Ruleset':
			var clubId = route.a;
			var rulesetId = route.b;
			return _List_fromArray(
				[
					'clubs',
					$elm$core$String$fromInt(clubId),
					'rulesets',
					$elm$core$String$fromInt(rulesetId)
				]);
		case 'Tournaments':
			return _List_fromArray(
				['tournaments']);
		case 'NewTournament':
			var clubId = route.a;
			return _List_fromArray(
				[
					'tournaments',
					'new',
					$elm$core$String$fromInt(clubId)
				]);
		case 'Tournament':
			var tournamentId = route.a;
			return _List_fromArray(
				[
					'tournaments',
					$elm$core$String$fromInt(tournamentId)
				]);
		case 'Bracket':
			var tournamentId = route.a;
			var bracketId = route.b;
			return _List_fromArray(
				[
					'tournaments',
					$elm$core$String$fromInt(tournamentId),
					'brackets',
					$elm$core$String$fromInt(bracketId)
				]);
		default:
			var id = route.a;
			return _List_fromArray(
				[
					'users',
					$elm$core$String$fromInt(id)
				]);
	}
};
var $author$project$Page$Club$updateEditForm = F4(
	function (transform, club, form, model) {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					state: A2(
						$author$project$Page$Club$Edit,
						club,
						transform(form))
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Page$Club$updateNewForm = F3(
	function (transform, form, model) {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					state: $author$project$Page$Club$New(
						transform(form))
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Page$Club$validateNew = function (form) {
	return $elm$core$String$isEmpty(form.contact) ? $elm$core$Result$Err('Preencha o contato') : ($elm$core$String$isEmpty(form.localization) ? $elm$core$Result$Err('Preencha a localização') : ($elm$core$String$isEmpty(form.name) ? $elm$core$Result$Err('Preencha o nome do clube') : ($elm$core$String$isEmpty(form.website) ? $elm$core$Result$Err('Preencha o site do clube') : $elm$core$Result$Ok(_Utils_Tuple0))));
};
var $author$project$Page$Club$validatePatch = function (form) {
	return ($elm$core$String$isEmpty(form.contact) && ($elm$core$String$isEmpty(form.localization) && ($elm$core$String$isEmpty(form.name) && $elm$core$String$isEmpty(form.website)))) ? $elm$core$Result$Err('Preencha ao menos um campo para ser atualizado') : $elm$core$Result$Ok(_Utils_Tuple0);
};
var $author$project$Page$Club$update = F2(
	function (msg, model) {
		var makeRequest = function (request) {
			var _v34 = $author$project$Session$toViewer(model.session);
			if (_v34.$ === 'Just') {
				var viewer = _v34.a;
				return _Utils_Tuple2(
					model,
					request(viewer));
			} else {
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							error: $elm$core$Maybe$Just('De alguma forma, você não está logado')
						}),
					$elm$core$Platform$Cmd$none);
			}
		};
		var _v0 = _Utils_Tuple2(msg, model.state);
		_v0$21:
		while (true) {
			switch (_v0.a.$) {
				case 'GotClub':
					var result = _v0.a.a;
					if (result.$ === 'Ok') {
						var club = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Nothing,
									state: A2($author$project$Page$Club$initState, club, model.session)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var error = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Just(
										$author$project$Api$errorToString(error))
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 'GotPostClub':
					var result = _v0.a.a;
					if (result.$ === 'Ok') {
						var club = result.a;
						return _Utils_Tuple2(
							model,
							A2(
								$elm$browser$Browser$Navigation$pushUrl,
								$author$project$Session$navKey(model.session),
								A2(
									$elm$url$Url$Builder$absolute,
									$author$project$Route$routeToPieces(
										$author$project$Route$Club(club.id)),
									_List_Nil)));
					} else {
						var error = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Just(
										$author$project$Api$errorToString(error))
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 'EditClub':
					if ((_v0.b.$ === 'View') && (_v0.b.b.$ === 'Owner')) {
						var _v3 = _v0.a;
						var _v4 = _v0.b;
						var club = _v4.a;
						var _v5 = _v4.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Nothing,
									state: A2(
										$author$project$Page$Club$Edit,
										club,
										A4($author$project$Page$Club$Form, '', '', '', ''))
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						break _v0$21;
					}
				case 'CancelEdit':
					if (_v0.b.$ === 'Edit') {
						var _v6 = _v0.a;
						var _v7 = _v0.b;
						var club = _v7.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Nothing,
									state: A2($author$project$Page$Club$View, club, $author$project$Page$Club$Owner)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						break _v0$21;
					}
				case 'ConfirmEdit':
					if (_v0.b.$ === 'Edit') {
						var _v8 = _v0.a;
						var _v9 = _v0.b;
						var club = _v9.a;
						var form = _v9.b;
						var _v10 = $author$project$Page$Club$validatePatch(form);
						if (_v10.$ === 'Ok') {
							return makeRequest(
								function (viewer) {
									return A3($author$project$Page$Club$requestPatch, club, form, viewer);
								});
						} else {
							var err = _v10.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										error: $elm$core$Maybe$Just(err)
									}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						break _v0$21;
					}
				case 'CancelNew':
					if (_v0.b.$ === 'New') {
						var _v11 = _v0.a;
						return _Utils_Tuple2(
							model,
							A2(
								$elm$browser$Browser$Navigation$back,
								$author$project$Session$navKey(model.session),
								1));
					} else {
						break _v0$21;
					}
				case 'ConfirmNew':
					if (_v0.b.$ === 'New') {
						var _v12 = _v0.a;
						var form = _v0.b.a;
						var _v13 = $author$project$Page$Club$validateNew(form);
						if (_v13.$ === 'Ok') {
							return makeRequest(
								function (viewer) {
									return A2($author$project$Page$Club$requestPost, form, viewer);
								});
						} else {
							var err = _v13.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										error: $elm$core$Maybe$Just(err)
									}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						break _v0$21;
					}
				case 'ConfirmDelete':
					if ((_v0.b.$ === 'View') && (_v0.b.b.$ === 'Owner')) {
						var _v14 = _v0.a;
						var _v15 = _v0.b;
						var club = _v15.a;
						var _v16 = _v15.b;
						return makeRequest(
							function (viewer) {
								return A2($author$project$Page$Club$requestDelete, club, viewer);
							});
					} else {
						break _v0$21;
					}
				case 'DeleteClub':
					if ((_v0.b.$ === 'View') && (_v0.b.b.$ === 'Owner')) {
						var result = _v0.a.a;
						var _v17 = _v0.b;
						var _v18 = _v17.b;
						if (result.$ === 'Ok') {
							return _Utils_Tuple2(
								model,
								A2(
									$elm$browser$Browser$Navigation$pushUrl,
									$author$project$Session$navKey(model.session),
									A2($elm$url$Url$Builder$absolute, _List_Nil, _List_Nil)));
						} else {
							var error = result.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										error: $elm$core$Maybe$Just(
											$author$project$Api$errorToString(error))
									}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						break _v0$21;
					}
				case 'AskInvite':
					if ((_v0.b.$ === 'View') && (_v0.b.b.$ === 'NonMember')) {
						var _v20 = _v0.a;
						var _v21 = _v0.b;
						var club = _v21.a;
						var _v22 = _v21.b;
						return makeRequest(
							function (viewer) {
								return A2($author$project$Page$Club$requestInvite, club, viewer);
							});
					} else {
						break _v0$21;
					}
				case 'Leave':
					if ((_v0.b.$ === 'View') && (_v0.b.b.$ === 'Member')) {
						var _v23 = _v0.a;
						var _v24 = _v0.b;
						var club = _v24.a;
						return makeRequest(
							function (viewer) {
								return A2($author$project$Page$Club$requestLeave, club, viewer);
							});
					} else {
						break _v0$21;
					}
				case 'RemoveMember':
					if ((_v0.b.$ === 'View') && (_v0.b.b.$ === 'Owner')) {
						var membership = _v0.a.a;
						var _v25 = _v0.b;
						var club = _v25.a;
						var _v26 = _v25.b;
						return makeRequest(
							function (viewer) {
								return A3($author$project$Page$Club$requestRemoveMember, club, membership, viewer);
							});
					} else {
						break _v0$21;
					}
				case 'InputName':
					switch (_v0.b.$) {
						case 'New':
							var name = _v0.a.a;
							var form = _v0.b.a;
							return A3(
								$author$project$Page$Club$updateNewForm,
								function (f) {
									return _Utils_update(
										f,
										{name: name});
								},
								form,
								model);
						case 'Edit':
							var name = _v0.a.a;
							var _v27 = _v0.b;
							var club = _v27.a;
							var form = _v27.b;
							return A4(
								$author$project$Page$Club$updateEditForm,
								function (f) {
									return _Utils_update(
										f,
										{name: name});
								},
								club,
								form,
								model);
						default:
							break _v0$21;
					}
				case 'InputWebsite':
					switch (_v0.b.$) {
						case 'New':
							var website = _v0.a.a;
							var form = _v0.b.a;
							return A3(
								$author$project$Page$Club$updateNewForm,
								function (f) {
									return _Utils_update(
										f,
										{website: website});
								},
								form,
								model);
						case 'Edit':
							var website = _v0.a.a;
							var _v28 = _v0.b;
							var club = _v28.a;
							var form = _v28.b;
							return A4(
								$author$project$Page$Club$updateEditForm,
								function (f) {
									return _Utils_update(
										f,
										{website: website});
								},
								club,
								form,
								model);
						default:
							break _v0$21;
					}
				case 'InputContact':
					switch (_v0.b.$) {
						case 'New':
							var contact = _v0.a.a;
							var form = _v0.b.a;
							return A3(
								$author$project$Page$Club$updateNewForm,
								function (f) {
									return _Utils_update(
										f,
										{contact: contact});
								},
								form,
								model);
						case 'Edit':
							var contact = _v0.a.a;
							var _v29 = _v0.b;
							var club = _v29.a;
							var form = _v29.b;
							return A4(
								$author$project$Page$Club$updateEditForm,
								function (f) {
									return _Utils_update(
										f,
										{contact: contact});
								},
								club,
								form,
								model);
						default:
							break _v0$21;
					}
				case 'InputLocalization':
					switch (_v0.b.$) {
						case 'New':
							var localization = _v0.a.a;
							var form = _v0.b.a;
							return A3(
								$author$project$Page$Club$updateNewForm,
								function (f) {
									return _Utils_update(
										f,
										{localization: localization});
								},
								form,
								model);
						case 'Edit':
							var localization = _v0.a.a;
							var _v30 = _v0.b;
							var club = _v30.a;
							var form = _v30.b;
							return A4(
								$author$project$Page$Club$updateEditForm,
								function (f) {
									return _Utils_update(
										f,
										{localization: localization});
								},
								club,
								form,
								model);
						default:
							break _v0$21;
					}
				default:
					if ((_v0.b.$ === 'View') && (_v0.b.b.$ === 'Owner')) {
						var _v31 = _v0.a;
						var _v32 = _v0.b;
						var club = _v32.a;
						var _v33 = _v32.b;
						return _Utils_Tuple2(
							model,
							A2(
								$elm$browser$Browser$Navigation$pushUrl,
								$author$project$Session$navKey(model.session),
								A2(
									$elm$url$Url$Builder$absolute,
									$author$project$Route$routeToPieces(
										$author$project$Route$NewTournament(club.id)),
									_List_Nil)));
					} else {
						break _v0$21;
					}
			}
		}
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					error: $elm$core$Maybe$Just('Estado inválido')
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Page$Clubs$update = F2(
	function (msg, model) {
		var result = msg.a;
		if (result.$ === 'Ok') {
			var clubs = result.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{clubs: clubs, error: $elm$core$Maybe$Nothing}),
				$elm$core$Platform$Cmd$none);
		} else {
			var error = result.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						error: $elm$core$Maybe$Just(
							$author$project$Api$errorToString(error))
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Session$LoggedIn = F2(
	function (a, b) {
		return {$: 'LoggedIn', a: a, b: b};
	});
var $author$project$Page$Login$redirectHome = function (session) {
	return A2(
		$elm$browser$Browser$Navigation$pushUrl,
		$author$project$Session$navKey(session),
		A2($elm$url$Url$Builder$absolute, _List_Nil, _List_Nil));
};
var $author$project$Page$Login$UserLogin = function (a) {
	return {$: 'UserLogin', a: a};
};
var $author$project$Viewer$loginEncoder = function (form) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'email',
				$elm$json$Json$Encode$string(form.email)),
				_Utils_Tuple2(
				'password',
				$elm$json$Json$Encode$string(form.password))
			]));
};
var $elm$http$Http$post = function (r) {
	return $elm$http$Http$request(
		{body: r.body, expect: r.expect, headers: _List_Nil, method: 'POST', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $webbhuset$elm_json_decode$Json$Decode$Field$requireAt = F3(
	function (path, valueDecoder, continuation) {
		return A2(
			$elm$json$Json$Decode$andThen,
			continuation,
			A2($elm$json$Json$Decode$at, path, valueDecoder));
	});
var $author$project$Viewer$viewerDecoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$requireAt,
	_List_fromArray(
		['user', 'id']),
	$elm$json$Json$Decode$int,
	function (id) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$requireAt,
			_List_fromArray(
				['user', 'username']),
			$elm$json$Json$Decode$string,
			function (username) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$requireAt,
					_List_fromArray(
						['user', 'email']),
					$elm$json$Json$Decode$string,
					function (email) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$require,
							'token',
							$elm$json$Json$Decode$string,
							function (token) {
								return $elm$json$Json$Decode$succeed(
									{email: email, id: id, token: token, username: username});
							});
					});
			});
	});
var $author$project$Page$Login$requestLogin = function (form) {
	return $elm$http$Http$post(
		{
			body: $elm$http$Http$jsonBody(
				$author$project$Viewer$loginEncoder(form)),
			expect: A2($author$project$Api$expectJson, $author$project$Page$Login$UserLogin, $author$project$Viewer$viewerDecoder),
			url: $author$project$Api$backendUrl + '/users/login'
		});
};
var $author$project$Page$Login$updateForm = F2(
	function (transform, model) {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					form: transform(model.form)
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Page$Login$validateLogin = function (form) {
	return $elm$core$String$isEmpty(form.email) ? $elm$core$Result$Err('Preencha o Email') : ($elm$core$String$isEmpty(form.password) ? $elm$core$Result$Err('Preencha a Senha') : $elm$core$Result$Ok(_Utils_Tuple0));
};
var $author$project$Page$Login$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'RequestLogin':
				var _v1 = $author$project$Page$Login$validateLogin(model.form);
				if (_v1.$ === 'Ok') {
					return _Utils_Tuple2(
						model,
						$author$project$Page$Login$requestLogin(model.form));
				} else {
					var err = _v1.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								error: $elm$core$Maybe$Just(err)
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'UserLogin':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var user = result.a;
					var _v3 = model.session;
					if (_v3.$ === 'LoggedIn') {
						var key = _v3.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Nothing,
									session: A2($author$project$Session$LoggedIn, key, user)
								}),
							$author$project$Page$Login$redirectHome(
								$author$project$Page$Login$toSession(model)));
					} else {
						var key = _v3.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Nothing,
									session: A2($author$project$Session$LoggedIn, key, user)
								}),
							$author$project$Page$Login$redirectHome(
								$author$project$Page$Login$toSession(model)));
					}
				} else {
					var error = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								error: $elm$core$Maybe$Just(
									$author$project$Api$errorToString(error))
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'InputEmail':
				var email = msg.a;
				return A2(
					$author$project$Page$Login$updateForm,
					function (form) {
						return _Utils_update(
							form,
							{email: email});
					},
					model);
			default:
				var password = msg.a;
				return A2(
					$author$project$Page$Login$updateForm,
					function (form) {
						return _Utils_update(
							form,
							{password: password});
					},
					model);
		}
	});
var $author$project$Page$Ruleset$View = function (a) {
	return {$: 'View', a: a};
};
var $author$project$Page$Ruleset$update = F2(
	function (msg, model) {
		var result = msg.a;
		if (result.$ === 'Ok') {
			var ruleset = result.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						state: $author$project$Page$Ruleset$View(ruleset)
					}),
				$elm$core$Platform$Cmd$none);
		} else {
			var error = result.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						error: $elm$core$Maybe$Just(
							$author$project$Api$errorToString(error))
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$SignUp$redirectHome = function (session) {
	return A2(
		$elm$browser$Browser$Navigation$pushUrl,
		$author$project$Session$navKey(session),
		A2($elm$url$Url$Builder$absolute, _List_Nil, _List_Nil));
};
var $author$project$Page$SignUp$UserSignUp = function (a) {
	return {$: 'UserSignUp', a: a};
};
var $author$project$Viewer$signUpEncoder = function (form) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'username',
				$elm$json$Json$Encode$string(form.username)),
				_Utils_Tuple2(
				'email',
				$elm$json$Json$Encode$string(form.email)),
				_Utils_Tuple2(
				'password',
				$elm$json$Json$Encode$string(form.password)),
				_Utils_Tuple2(
				'passwordconfirmation',
				$elm$json$Json$Encode$string(form.passwordAgain))
			]));
};
var $author$project$Page$SignUp$requestSignUp = function (form) {
	return $elm$http$Http$post(
		{
			body: $elm$http$Http$jsonBody(
				$author$project$Viewer$signUpEncoder(form)),
			expect: A2($author$project$Api$expectJson, $author$project$Page$SignUp$UserSignUp, $author$project$Viewer$viewerDecoder),
			url: $author$project$Api$backendUrl + '/users/signup'
		});
};
var $author$project$Page$SignUp$updateForm = F2(
	function (transform, model) {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					form: transform(model.form)
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Page$SignUp$validateSignUp = function (form) {
	return $elm$core$String$isEmpty(form.email) ? $elm$core$Result$Err('Preencha o Email') : ($elm$core$String$isEmpty(form.username) ? $elm$core$Result$Err('Preencha o Nome de Usuário') : ($elm$core$String$isEmpty(form.password) ? $elm$core$Result$Err('Preencha a Senha') : ($elm$core$String$isEmpty(form.passwordAgain) ? $elm$core$Result$Err('Repita a Senha') : ((!_Utils_eq(form.password, form.passwordAgain)) ? $elm$core$Result$Err('As senhas não são iguais') : $elm$core$Result$Ok(_Utils_Tuple0)))));
};
var $author$project$Page$SignUp$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'RequestSignUp':
				var _v1 = $author$project$Page$SignUp$validateSignUp(model.form);
				if (_v1.$ === 'Ok') {
					return _Utils_Tuple2(
						model,
						$author$project$Page$SignUp$requestSignUp(model.form));
				} else {
					var err = _v1.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								error: $elm$core$Maybe$Just(err)
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'UserSignUp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var user = result.a;
					var _v3 = model.session;
					if (_v3.$ === 'LoggedIn') {
						var key = _v3.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Nothing,
									session: A2($author$project$Session$LoggedIn, key, user)
								}),
							$author$project$Page$SignUp$redirectHome(
								$author$project$Page$SignUp$toSession(model)));
					} else {
						var key = _v3.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Nothing,
									session: A2($author$project$Session$LoggedIn, key, user)
								}),
							$author$project$Page$SignUp$redirectHome(
								$author$project$Page$SignUp$toSession(model)));
					}
				} else {
					var error = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								error: $elm$core$Maybe$Just(
									$author$project$Api$errorToString(error))
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'InputUsername':
				var username = msg.a;
				return A2(
					$author$project$Page$SignUp$updateForm,
					function (form) {
						return _Utils_update(
							form,
							{username: username});
					},
					model);
			case 'InputEmail':
				var email = msg.a;
				return A2(
					$author$project$Page$SignUp$updateForm,
					function (form) {
						return _Utils_update(
							form,
							{email: email});
					},
					model);
			case 'InputPassword':
				var password = msg.a;
				return A2(
					$author$project$Page$SignUp$updateForm,
					function (form) {
						return _Utils_update(
							form,
							{password: password});
					},
					model);
			default:
				var passwordAgain = msg.a;
				return A2(
					$author$project$Page$SignUp$updateForm,
					function (form) {
						return _Utils_update(
							form,
							{passwordAgain: passwordAgain});
					},
					model);
		}
	});
var $author$project$Page$Tournament$Edit = F2(
	function (a, b) {
		return {$: 'Edit', a: a, b: b};
	});
var $author$project$Page$Tournament$Owner = function (a) {
	return {$: 'Owner', a: a};
};
var $author$project$Page$Tournament$View = F2(
	function (a, b) {
		return {$: 'View', a: a, b: b};
	});
var $author$project$Page$Tournament$BracketForm = F7(
	function (sequence, name, winCondition, numberOfAdvancing, numberOfSeries, gamesPerSeries, finalScoreMultiplier) {
		return {finalScoreMultiplier: finalScoreMultiplier, gamesPerSeries: gamesPerSeries, name: name, numberOfAdvancing: numberOfAdvancing, numberOfSeries: numberOfSeries, sequence: sequence, winCondition: winCondition};
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Page$Tournament$addBracket = function (brackets) {
	var nextSeq = function () {
		var _v0 = $elm$core$List$maximum(
			A2(
				$elm$core$List$map,
				function (b) {
					return b.sequence;
				},
				brackets));
		if (_v0.$ === 'Just') {
			var seq = _v0.a;
			return seq + 10;
		} else {
			return 0;
		}
	}();
	return _Utils_ap(
		brackets,
		_List_fromArray(
			[
				A7($author$project$Page$Tournament$BracketForm, nextSeq, '', 'None', 0, 1, 1, 0)
			]));
};
var $author$project$Page$Tournament$initForm = function (tournament) {
	var mapBracket = function (b) {
		return A7($author$project$Page$Tournament$BracketForm, b.sequence, b.name, b.winCondition, b.numberOfAdvancing, b.numberOfSeries, b.gamesPerSeries, b.finalScoreMultiplier);
	};
	return A7(
		$author$project$Page$Tournament$Form,
		$elm$core$Maybe$Just(tournament.ruleset),
		'',
		'',
		'',
		tournament.allowNonMembers,
		tournament.requirePermission,
		A2($elm$core$List$map, mapBracket, tournament.brackets));
};
var $author$project$Page$Tournament$Anonymus = {$: 'Anonymus'};
var $author$project$Page$Tournament$NonParticipant = {$: 'NonParticipant'};
var $author$project$Page$Tournament$Participant = {$: 'Participant'};
var $author$project$Page$Tournament$initState = F2(
	function (tournament, session) {
		var _v0 = $author$project$Session$toViewer(session);
		if (_v0.$ === 'Just') {
			var viewer = _v0.a;
			var isParticipant = function (p) {
				return _Utils_eq(p.userId, viewer.id);
			};
			var _v1 = A2($elm_community$list_extra$List$Extra$find, isParticipant, tournament.players);
			if (_v1.$ === 'Just') {
				return _Utils_eq(tournament.ownerId, viewer.id) ? A2(
					$author$project$Page$Tournament$View,
					$author$project$Page$Tournament$Owner(true),
					tournament) : A2($author$project$Page$Tournament$View, $author$project$Page$Tournament$Participant, tournament);
			} else {
				return _Utils_eq(tournament.ownerId, viewer.id) ? A2(
					$author$project$Page$Tournament$View,
					$author$project$Page$Tournament$Owner(false),
					tournament) : A2($author$project$Page$Tournament$View, $author$project$Page$Tournament$NonParticipant, tournament);
			}
		} else {
			return A2($author$project$Page$Tournament$View, $author$project$Page$Tournament$Anonymus, tournament);
		}
	});
var $author$project$Page$Tournament$removeBracket = F2(
	function (seq, brackets) {
		return A2(
			$elm$core$List$sortBy,
			function (b) {
				return b.sequence;
			},
			A2(
				$elm$core$List$filter,
				function (b) {
					return !_Utils_eq(b.sequence, seq);
				},
				brackets));
	});
var $author$project$Page$Tournament$GotDelete = function (a) {
	return {$: 'GotDelete', a: a};
};
var $author$project$Page$Tournament$requestDelete = F2(
	function (viewer, tournament) {
		return A2(
			$author$project$Api$privateDelete,
			{
				expect: $author$project$Api$expectWhatever($author$project$Page$Tournament$GotDelete),
				url: $author$project$Api$tournament(tournament.id)
			},
			viewer);
	});
var $author$project$Api$tournamentInit = function (id) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				$author$project$Api$tournament(id),
				'/init'
			]));
};
var $author$project$Page$Tournament$requestInit = F2(
	function (viewer, tournament) {
		return A2(
			$author$project$Api$privatePost,
			{
				body: $elm$http$Http$emptyBody,
				expect: A2($author$project$Api$expectJson, $author$project$Page$Tournament$GotTournament, $author$project$Model$Tournament$decoder),
				url: $author$project$Api$tournamentInit(tournament.id)
			},
			viewer);
	});
var $author$project$Api$tournamentPlayers = function (tournamentId) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				$author$project$Api$tournament(tournamentId),
				'/players'
			]));
};
var $author$project$Api$joinTournament = function (tournamentId) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				$author$project$Api$tournamentPlayers(tournamentId),
				'/invite'
			]));
};
var $author$project$Page$Tournament$requestJoin = F2(
	function (viewer, tournament) {
		return A2(
			$author$project$Api$privatePost,
			{
				body: $elm$http$Http$emptyBody,
				expect: A2($author$project$Api$expectJson, $author$project$Page$Tournament$GotTournament, $author$project$Model$Tournament$decoder),
				url: $author$project$Api$joinTournament(tournament.id)
			},
			viewer);
	});
var $author$project$Page$Tournament$requestLeave = F2(
	function (viewer, tournament) {
		return A2(
			$author$project$Api$privateDelete,
			{
				expect: A2($author$project$Api$expectJson, $author$project$Page$Tournament$GotTournament, $author$project$Model$Tournament$decoder),
				url: $author$project$Api$tournamentPlayers(tournament.id)
			},
			viewer);
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$json$Json$Encode$float = _Json_wrap;
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Page$Tournament$bracketEncoder = function (form) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'sequence',
				$elm$json$Json$Encode$int(form.sequence)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(form.name)),
				_Utils_Tuple2(
				'winCondition',
				$elm$json$Json$Encode$string(form.winCondition)),
				_Utils_Tuple2(
				'numberOfAdvancing',
				$elm$json$Json$Encode$int(form.numberOfAdvancing)),
				_Utils_Tuple2(
				'numberOfSeries',
				$elm$json$Json$Encode$int(form.numberOfSeries)),
				_Utils_Tuple2(
				'gamesPerSeries',
				$elm$json$Json$Encode$int(form.gamesPerSeries)),
				_Utils_Tuple2(
				'finalScoreMultiplier',
				$elm$json$Json$Encode$float(form.finalScoreMultiplier))
			]));
};
var $author$project$Page$Tournament$patchEncoder = function (form) {
	var maybeNull = function (val) {
		return $elm$core$String$isEmpty(val) ? $elm$json$Json$Encode$null : $elm$json$Json$Encode$string(val);
	};
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'rulesetId',
				function () {
					var _v0 = form.ruleset;
					if (_v0.$ === 'Just') {
						var ruleset = _v0.a;
						return $elm$json$Json$Encode$int(ruleset.id);
					} else {
						return $elm$json$Json$Encode$null;
					}
				}()),
				_Utils_Tuple2(
				'name',
				maybeNull(form.name)),
				_Utils_Tuple2(
				'description',
				maybeNull(form.description)),
				_Utils_Tuple2(
				'startDate',
				maybeNull(form.startDate)),
				_Utils_Tuple2(
				'allowNonMembers',
				$elm$json$Json$Encode$bool(form.allowNonMembers)),
				_Utils_Tuple2(
				'RequirePermission',
				$elm$json$Json$Encode$bool(form.requirePermission)),
				_Utils_Tuple2(
				'brackets',
				A2($elm$json$Json$Encode$list, $author$project$Page$Tournament$bracketEncoder, form.brackets))
			]));
};
var $author$project$Page$Tournament$requestPatch = F3(
	function (viewer, tournament, form) {
		return A2(
			$author$project$Api$privatePut,
			{
				body: $elm$http$Http$jsonBody(
					$author$project$Page$Tournament$patchEncoder(form)),
				expect: A2($author$project$Api$expectJson, $author$project$Page$Tournament$GotTournament, $author$project$Model$Tournament$decoder),
				url: $author$project$Api$tournament(tournament.id)
			},
			viewer);
	});
var $author$project$Page$Tournament$GotPostTournament = function (a) {
	return {$: 'GotPostTournament', a: a};
};
var $author$project$Page$Tournament$requestPost = F2(
	function (form, viewer) {
		return A2(
			$author$project$Api$privatePost,
			{
				body: $elm$http$Http$jsonBody(
					$author$project$Page$Tournament$patchEncoder(form)),
				expect: A2($author$project$Api$expectJson, $author$project$Page$Tournament$GotPostTournament, $author$project$Model$Tournament$decoder),
				url: $author$project$Api$tournaments
			},
			viewer);
	});
var $author$project$Api$tournamentPlayer = F2(
	function (tournamentId, playerId) {
		return $elm$core$String$concat(
			_List_fromArray(
				[
					$author$project$Api$tournamentPlayers(tournamentId),
					'/',
					$elm$core$String$fromInt(playerId)
				]));
	});
var $author$project$Page$Tournament$requestRemovePlayer = F3(
	function (viewer, tournament, player) {
		return A2(
			$author$project$Api$privateDelete,
			{
				expect: A2($author$project$Api$expectJson, $author$project$Page$Tournament$GotTournament, $author$project$Model$Tournament$decoder),
				url: A2($author$project$Api$tournamentPlayer, tournament.id, player.userId)
			},
			viewer);
	});
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$Page$Tournament$updateBracket = F3(
	function (transform, brackets, seq) {
		var _v0 = A2(
			$elm_community$list_extra$List$Extra$find,
			function (b) {
				return _Utils_eq(b.sequence, seq);
			},
			brackets);
		if (_v0.$ === 'Nothing') {
			return brackets;
		} else {
			var bracket = _v0.a;
			var rem = A2(
				$elm$core$List$filter,
				function (b) {
					return !_Utils_eq(b.sequence, seq);
				},
				brackets);
			return A2(
				$elm$core$List$sortBy,
				function (b) {
					return b.sequence;
				},
				A2(
					$elm$core$List$cons,
					transform(bracket),
					rem));
		}
	});
var $author$project$Page$Tournament$updateEditForm = F4(
	function (transform, tournament, form, model) {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					error: $elm$core$Maybe$Nothing,
					state: A2(
						$author$project$Page$Tournament$Edit,
						tournament,
						transform(form))
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Page$Tournament$updateNewForm = F2(
	function (form, model) {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					state: $author$project$Page$Tournament$New(form)
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Page$Tournament$validateNew = function (form) {
	var validateBracket = function (b) {
		return $elm$core$String$isEmpty(b.name) ? $elm$core$Result$Err('Preencha o nome da chave') : ($elm$core$String$isEmpty(b.winCondition) ? $elm$core$Result$Err('Preencha a condição de vitória da chave') : (((b.winCondition === 'TopX') && (b.numberOfAdvancing <= 0)) ? $elm$core$Result$Err('O número de jogadores a avançar para a próxima fase precisa ser maior que zero') : ((b.numberOfSeries <= 0) ? $elm$core$Result$Err('Cada chave precisa de ao menos uma série') : ((b.gamesPerSeries <= 0) ? $elm$core$Result$Err('Cada série precisa de ao menos um jogo') : ((b.finalScoreMultiplier < 0) ? $elm$core$Result$Err('O multiplicador de pontuação não pode ser negativo') : $elm$core$Result$Ok(_Utils_Tuple0))))));
	};
	if (_Utils_eq(form.ruleset, $elm$core$Maybe$Nothing)) {
		return $elm$core$Result$Err('Preencha o conjunto de regras');
	} else {
		if ($elm$core$String$isEmpty(form.name)) {
			return $elm$core$Result$Err('Preencha o nome do torneio');
		} else {
			if ($elm$core$String$isEmpty(form.description)) {
				return $elm$core$Result$Err('Preencha a descrição do torneio');
			} else {
				if ($elm$core$String$isEmpty(form.startDate)) {
					return $elm$core$Result$Err('Preencha a data de início do torneio');
				} else {
					if ($elm$core$List$isEmpty(form.brackets)) {
						return $elm$core$Result$Err('Crie ao menos uma chave');
					} else {
						var res = A2(
							$elm_community$list_extra$List$Extra$find,
							function (r) {
								return !_Utils_eq(
									r,
									$elm$core$Result$Ok(_Utils_Tuple0));
							},
							A2($elm$core$List$map, validateBracket, form.brackets));
						if (res.$ === 'Just') {
							var err = res.a;
							return err;
						} else {
							return $elm$core$Result$Ok(_Utils_Tuple0);
						}
					}
				}
			}
		}
	}
};
var $author$project$Page$Tournament$update = F2(
	function (msg, model) {
		var makeRequest = function (request) {
			var _v66 = $author$project$Session$toViewer(model.session);
			if (_v66.$ === 'Just') {
				var viewer = _v66.a;
				return _Utils_Tuple2(
					model,
					request(viewer));
			} else {
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							error: $elm$core$Maybe$Just('De alguma forma, você não está logado')
						}),
					$elm$core$Platform$Cmd$none);
			}
		};
		var _v0 = _Utils_Tuple2(msg, model.state);
		_v0$44:
		while (true) {
			switch (_v0.a.$) {
				case 'GotTournament':
					var result = _v0.a.a;
					if (result.$ === 'Ok') {
						var tournament = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Nothing,
									state: A2($author$project$Page$Tournament$initState, tournament, model.session)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var error = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Just(
										$author$project$Api$errorToString(error))
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 'GotPostTournament':
					var result = _v0.a.a;
					if (result.$ === 'Ok') {
						var tournament = result.a;
						return _Utils_Tuple2(
							model,
							A2(
								$elm$browser$Browser$Navigation$pushUrl,
								$author$project$Session$navKey(model.session),
								A2(
									$elm$url$Url$Builder$absolute,
									$author$project$Route$routeToPieces(
										$author$project$Route$Tournament(tournament.id)),
									_List_Nil)));
					} else {
						var error = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Just(
										$author$project$Api$errorToString(error))
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 'GotDelete':
					if ((_v0.b.$ === 'View') && (_v0.b.a.$ === 'Owner')) {
						var result = _v0.a.a;
						var _v3 = _v0.b;
						if (result.$ === 'Ok') {
							return _Utils_Tuple2(
								model,
								A2(
									$elm$browser$Browser$Navigation$pushUrl,
									$author$project$Session$navKey(model.session),
									A2($elm$url$Url$Builder$absolute, _List_Nil, _List_Nil)));
						} else {
							var error = result.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										error: $elm$core$Maybe$Just(
											$author$project$Api$errorToString(error))
									}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						break _v0$44;
					}
				case 'GotRulesets':
					var result = _v0.a.a;
					if (result.$ === 'Ok') {
						var rulesets = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{error: $elm$core$Maybe$Nothing, rulesets: rulesets}),
							$elm$core$Platform$Cmd$none);
					} else {
						var error = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Just(
										$author$project$Api$errorToString(error))
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 'RemovePlayer':
					if (_v0.b.$ === 'View') {
						var player = _v0.a.a;
						var _v6 = _v0.b;
						var tournament = _v6.b;
						return makeRequest(
							function (viewer) {
								return A3($author$project$Page$Tournament$requestRemovePlayer, viewer, tournament, player);
							});
					} else {
						break _v0$44;
					}
				case 'JoinTournament':
					if (_v0.b.$ === 'View') {
						switch (_v0.b.a.$) {
							case 'NonParticipant':
								var _v7 = _v0.a;
								var _v8 = _v0.b;
								var _v9 = _v8.a;
								var tournament = _v8.b;
								return makeRequest(
									function (viewer) {
										return A2($author$project$Page$Tournament$requestJoin, viewer, tournament);
									});
							case 'Owner':
								if (!_v0.b.a.a) {
									var _v10 = _v0.a;
									var _v11 = _v0.b;
									var tournament = _v11.b;
									return makeRequest(
										function (viewer) {
											return A2($author$project$Page$Tournament$requestJoin, viewer, tournament);
										});
								} else {
									break _v0$44;
								}
							default:
								break _v0$44;
						}
					} else {
						break _v0$44;
					}
				case 'LeaveTournament':
					if (_v0.b.$ === 'View') {
						switch (_v0.b.a.$) {
							case 'Participant':
								var _v12 = _v0.a;
								var _v13 = _v0.b;
								var _v14 = _v13.a;
								var tournament = _v13.b;
								return makeRequest(
									function (viewer) {
										return A2($author$project$Page$Tournament$requestLeave, viewer, tournament);
									});
							case 'Owner':
								if (_v0.b.a.a) {
									var _v15 = _v0.a;
									var _v16 = _v0.b;
									var tournament = _v16.b;
									return makeRequest(
										function (viewer) {
											return A2($author$project$Page$Tournament$requestLeave, viewer, tournament);
										});
								} else {
									break _v0$44;
								}
							default:
								break _v0$44;
						}
					} else {
						break _v0$44;
					}
				case 'InitTournament':
					if ((_v0.b.$ === 'View') && (_v0.b.a.$ === 'Owner')) {
						var _v17 = _v0.a;
						var _v18 = _v0.b;
						var tournament = _v18.b;
						return makeRequest(
							function (viewer) {
								return A2($author$project$Page$Tournament$requestInit, viewer, tournament);
							});
					} else {
						break _v0$44;
					}
				case 'ConfirmNew':
					if (_v0.b.$ === 'New') {
						var _v19 = _v0.a;
						var form = _v0.b.a;
						var _v20 = $author$project$Page$Tournament$validateNew(form);
						if (_v20.$ === 'Ok') {
							return makeRequest(
								function (viewer) {
									return A2($author$project$Page$Tournament$requestPost, form, viewer);
								});
						} else {
							var error = _v20.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										error: $elm$core$Maybe$Just(error)
									}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						break _v0$44;
					}
				case 'CancelNew':
					if (_v0.b.$ === 'New') {
						var _v21 = _v0.a;
						return _Utils_Tuple2(
							model,
							A2(
								$elm$browser$Browser$Navigation$back,
								$author$project$Session$navKey(model.session),
								1));
					} else {
						break _v0$44;
					}
				case 'EditTournament':
					if ((_v0.b.$ === 'View') && (_v0.b.a.$ === 'Owner')) {
						var _v22 = _v0.a;
						var _v23 = _v0.b;
						var tournament = _v23.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									state: A2(
										$author$project$Page$Tournament$Edit,
										tournament,
										$author$project$Page$Tournament$initForm(tournament))
								}),
							$author$project$Page$Tournament$requestRulesets(tournament.clubId));
					} else {
						break _v0$44;
					}
				case 'ConfirmEdit':
					if (_v0.b.$ === 'Edit') {
						var _v24 = _v0.a;
						var _v25 = _v0.b;
						var tournament = _v25.a;
						var form = _v25.b;
						return makeRequest(
							function (viewer) {
								return A3($author$project$Page$Tournament$requestPatch, viewer, tournament, form);
							});
					} else {
						break _v0$44;
					}
				case 'CancelEdit':
					if (_v0.b.$ === 'Edit') {
						var _v26 = _v0.a;
						var _v27 = _v0.b;
						var tournament = _v27.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Nothing,
									state: A2(
										$author$project$Page$Tournament$View,
										$author$project$Page$Tournament$Owner(false),
										tournament)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						break _v0$44;
					}
				case 'DeleteTournament':
					if ((_v0.b.$ === 'View') && (_v0.b.a.$ === 'Owner')) {
						var _v28 = _v0.a;
						var _v29 = _v0.b;
						var tournament = _v29.b;
						return makeRequest(
							function (viewer) {
								return A2($author$project$Page$Tournament$requestDelete, viewer, tournament);
							});
					} else {
						break _v0$44;
					}
				case 'InputName':
					switch (_v0.b.$) {
						case 'New':
							var name = _v0.a.a;
							var form = _v0.b.a;
							return A2(
								$author$project$Page$Tournament$updateNewForm,
								_Utils_update(
									form,
									{name: name}),
								model);
						case 'Edit':
							var name = _v0.a.a;
							var _v30 = _v0.b;
							var tournament = _v30.a;
							var form = _v30.b;
							return A4(
								$author$project$Page$Tournament$updateEditForm,
								function (f) {
									return _Utils_update(
										f,
										{name: name});
								},
								tournament,
								form,
								model);
						default:
							break _v0$44;
					}
				case 'InputDescription':
					switch (_v0.b.$) {
						case 'New':
							var description = _v0.a.a;
							var form = _v0.b.a;
							return A2(
								$author$project$Page$Tournament$updateNewForm,
								_Utils_update(
									form,
									{description: description}),
								model);
						case 'Edit':
							var description = _v0.a.a;
							var _v31 = _v0.b;
							var tournament = _v31.a;
							var form = _v31.b;
							return A4(
								$author$project$Page$Tournament$updateEditForm,
								function (f) {
									return _Utils_update(
										f,
										{description: description});
								},
								tournament,
								form,
								model);
						default:
							break _v0$44;
					}
				case 'InputStartDate':
					switch (_v0.b.$) {
						case 'New':
							var startDate = _v0.a.a;
							var form = _v0.b.a;
							return A2(
								$author$project$Page$Tournament$updateNewForm,
								_Utils_update(
									form,
									{startDate: startDate}),
								model);
						case 'Edit':
							var startDate = _v0.a.a;
							var _v32 = _v0.b;
							var tournament = _v32.a;
							var form = _v32.b;
							return A4(
								$author$project$Page$Tournament$updateEditForm,
								function (f) {
									return _Utils_update(
										f,
										{startDate: startDate});
								},
								tournament,
								form,
								model);
						default:
							break _v0$44;
					}
				case 'InputRuleset':
					switch (_v0.b.$) {
						case 'New':
							var name = _v0.a.a;
							var form = _v0.b.a;
							var ruleset = A2(
								$elm_community$list_extra$List$Extra$find,
								function (r) {
									return _Utils_eq(r.name, name);
								},
								model.rulesets);
							return A2(
								$author$project$Page$Tournament$updateNewForm,
								_Utils_update(
									form,
									{ruleset: ruleset}),
								model);
						case 'Edit':
							var name = _v0.a.a;
							var _v33 = _v0.b;
							var tournament = _v33.a;
							var form = _v33.b;
							var ruleset = A2(
								$elm_community$list_extra$List$Extra$find,
								function (r) {
									return _Utils_eq(r.name, name);
								},
								model.rulesets);
							return A4(
								$author$project$Page$Tournament$updateEditForm,
								function (f) {
									return _Utils_update(
										f,
										{ruleset: ruleset});
								},
								tournament,
								form,
								model);
						default:
							break _v0$44;
					}
				case 'InputAllow':
					switch (_v0.b.$) {
						case 'New':
							var allow = _v0.a.a;
							var form = _v0.b.a;
							return A2(
								$author$project$Page$Tournament$updateNewForm,
								_Utils_update(
									form,
									{allowNonMembers: allow}),
								model);
						case 'Edit':
							var allow = _v0.a.a;
							var _v34 = _v0.b;
							var tournament = _v34.a;
							var form = _v34.b;
							return A4(
								$author$project$Page$Tournament$updateEditForm,
								function (f) {
									return _Utils_update(
										f,
										{allowNonMembers: allow});
								},
								tournament,
								form,
								model);
						default:
							break _v0$44;
					}
				case 'InputPermission':
					switch (_v0.b.$) {
						case 'New':
							var permission = _v0.a.a;
							var form = _v0.b.a;
							return A2(
								$author$project$Page$Tournament$updateNewForm,
								_Utils_update(
									form,
									{requirePermission: permission}),
								model);
						case 'Edit':
							var permission = _v0.a.a;
							var _v35 = _v0.b;
							var tournament = _v35.a;
							var form = _v35.b;
							return A4(
								$author$project$Page$Tournament$updateEditForm,
								function (f) {
									return _Utils_update(
										f,
										{requirePermission: permission});
								},
								tournament,
								form,
								model);
						default:
							break _v0$44;
					}
				case 'AddBracket':
					switch (_v0.b.$) {
						case 'New':
							var _v36 = _v0.a;
							var form = _v0.b.a;
							return A2(
								$author$project$Page$Tournament$updateNewForm,
								_Utils_update(
									form,
									{
										brackets: $author$project$Page$Tournament$addBracket(form.brackets)
									}),
								model);
						case 'Edit':
							var _v37 = _v0.a;
							var _v38 = _v0.b;
							var tournament = _v38.a;
							var form = _v38.b;
							return A4(
								$author$project$Page$Tournament$updateEditForm,
								function (f) {
									return _Utils_update(
										f,
										{
											brackets: $author$project$Page$Tournament$addBracket(f.brackets)
										});
								},
								tournament,
								form,
								model);
						default:
							break _v0$44;
					}
				case 'RemoveBracket':
					switch (_v0.b.$) {
						case 'New':
							var seq = _v0.a.a;
							var form = _v0.b.a;
							return A2(
								$author$project$Page$Tournament$updateNewForm,
								_Utils_update(
									form,
									{
										brackets: A2($author$project$Page$Tournament$removeBracket, seq, form.brackets)
									}),
								model);
						case 'Edit':
							var seq = _v0.a.a;
							var _v39 = _v0.b;
							var tournament = _v39.a;
							var form = _v39.b;
							return A4(
								$author$project$Page$Tournament$updateEditForm,
								function (f) {
									return _Utils_update(
										f,
										{
											brackets: A2($author$project$Page$Tournament$removeBracket, seq, f.brackets)
										});
								},
								tournament,
								form,
								model);
						default:
							break _v0$44;
					}
				case 'InputBracketName':
					switch (_v0.b.$) {
						case 'New':
							var _v40 = _v0.a;
							var seq = _v40.a;
							var name = _v40.b;
							var form = _v0.b.a;
							return A2(
								$author$project$Page$Tournament$updateNewForm,
								_Utils_update(
									form,
									{
										brackets: A3(
											$author$project$Page$Tournament$updateBracket,
											function (b) {
												return _Utils_update(
													b,
													{name: name});
											},
											form.brackets,
											seq)
									}),
								model);
						case 'Edit':
							var _v41 = _v0.a;
							var seq = _v41.a;
							var name = _v41.b;
							var _v42 = _v0.b;
							var tournament = _v42.a;
							var form = _v42.b;
							return A4(
								$author$project$Page$Tournament$updateEditForm,
								function (f) {
									return _Utils_update(
										f,
										{
											brackets: A3(
												$author$project$Page$Tournament$updateBracket,
												function (b) {
													return _Utils_update(
														b,
														{name: name});
												},
												f.brackets,
												seq)
										});
								},
								tournament,
								form,
								model);
						default:
							break _v0$44;
					}
				case 'InputBracketWinCon':
					switch (_v0.b.$) {
						case 'New':
							var _v43 = _v0.a;
							var seq = _v43.a;
							var winCon = _v43.b;
							var form = _v0.b.a;
							return A2(
								$author$project$Page$Tournament$updateNewForm,
								_Utils_update(
									form,
									{
										brackets: A3(
											$author$project$Page$Tournament$updateBracket,
											function (b) {
												return _Utils_update(
													b,
													{winCondition: winCon});
											},
											form.brackets,
											seq)
									}),
								model);
						case 'Edit':
							var _v44 = _v0.a;
							var seq = _v44.a;
							var winCon = _v44.b;
							var _v45 = _v0.b;
							var tournament = _v45.a;
							var form = _v45.b;
							return A4(
								$author$project$Page$Tournament$updateEditForm,
								function (f) {
									return _Utils_update(
										f,
										{
											brackets: A3(
												$author$project$Page$Tournament$updateBracket,
												function (b) {
													return _Utils_update(
														b,
														{winCondition: winCon});
												},
												f.brackets,
												seq)
										});
								},
								tournament,
								form,
								model);
						default:
							break _v0$44;
					}
				case 'InputBracketNAdv':
					switch (_v0.b.$) {
						case 'New':
							var _v46 = _v0.a;
							var seq = _v46.a;
							var nadv = _v46.b;
							var form = _v0.b.a;
							var _v47 = $elm$core$String$toInt(nadv);
							if (_v47.$ === 'Just') {
								var i = _v47.a;
								return A2(
									$author$project$Page$Tournament$updateNewForm,
									_Utils_update(
										form,
										{
											brackets: A3(
												$author$project$Page$Tournament$updateBracket,
												function (b) {
													return _Utils_update(
														b,
														{numberOfAdvancing: i});
												},
												form.brackets,
												seq)
										}),
									model);
							} else {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											error: $elm$core$Maybe$Just('Falha na conversão de number of advancing players para inteiro')
										}),
									$elm$core$Platform$Cmd$none);
							}
						case 'Edit':
							var _v48 = _v0.a;
							var seq = _v48.a;
							var nadv = _v48.b;
							var _v49 = _v0.b;
							var tournament = _v49.a;
							var form = _v49.b;
							var _v50 = $elm$core$String$toInt(nadv);
							if (_v50.$ === 'Just') {
								var i = _v50.a;
								return A4(
									$author$project$Page$Tournament$updateEditForm,
									function (f) {
										return _Utils_update(
											f,
											{
												brackets: A3(
													$author$project$Page$Tournament$updateBracket,
													function (b) {
														return _Utils_update(
															b,
															{numberOfAdvancing: i});
													},
													f.brackets,
													seq)
											});
									},
									tournament,
									form,
									model);
							} else {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											error: $elm$core$Maybe$Just('Falha na conversão de number of advancing players para inteiro')
										}),
									$elm$core$Platform$Cmd$none);
							}
						default:
							break _v0$44;
					}
				case 'InputBracketNSeries':
					switch (_v0.b.$) {
						case 'New':
							var _v51 = _v0.a;
							var seq = _v51.a;
							var nseries = _v51.b;
							var form = _v0.b.a;
							var _v52 = $elm$core$String$toInt(nseries);
							if (_v52.$ === 'Just') {
								var i = _v52.a;
								return A2(
									$author$project$Page$Tournament$updateNewForm,
									_Utils_update(
										form,
										{
											brackets: A3(
												$author$project$Page$Tournament$updateBracket,
												function (b) {
													return _Utils_update(
														b,
														{numberOfSeries: i});
												},
												form.brackets,
												seq)
										}),
									model);
							} else {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											error: $elm$core$Maybe$Just('Falha na conversão de número de séries para inteiro')
										}),
									$elm$core$Platform$Cmd$none);
							}
						case 'Edit':
							var _v53 = _v0.a;
							var seq = _v53.a;
							var nseries = _v53.b;
							var _v54 = _v0.b;
							var tournament = _v54.a;
							var form = _v54.b;
							var _v55 = $elm$core$String$toInt(nseries);
							if (_v55.$ === 'Just') {
								var i = _v55.a;
								return A4(
									$author$project$Page$Tournament$updateEditForm,
									function (f) {
										return _Utils_update(
											f,
											{
												brackets: A3(
													$author$project$Page$Tournament$updateBracket,
													function (b) {
														return _Utils_update(
															b,
															{numberOfSeries: i});
													},
													f.brackets,
													seq)
											});
									},
									tournament,
									form,
									model);
							} else {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											error: $elm$core$Maybe$Just('Falha na conversão de número de séries para inteiro')
										}),
									$elm$core$Platform$Cmd$none);
							}
						default:
							break _v0$44;
					}
				case 'InputBracketNGames':
					switch (_v0.b.$) {
						case 'New':
							var _v56 = _v0.a;
							var seq = _v56.a;
							var ngames = _v56.b;
							var form = _v0.b.a;
							var _v57 = $elm$core$String$toInt(ngames);
							if (_v57.$ === 'Just') {
								var i = _v57.a;
								return A2(
									$author$project$Page$Tournament$updateNewForm,
									_Utils_update(
										form,
										{
											brackets: A3(
												$author$project$Page$Tournament$updateBracket,
												function (b) {
													return _Utils_update(
														b,
														{gamesPerSeries: i});
												},
												form.brackets,
												seq)
										}),
									model);
							} else {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											error: $elm$core$Maybe$Just('Falha na conversão de número de séries para ponto flutuante')
										}),
									$elm$core$Platform$Cmd$none);
							}
						case 'Edit':
							var _v58 = _v0.a;
							var seq = _v58.a;
							var ngames = _v58.b;
							var _v59 = _v0.b;
							var tournament = _v59.a;
							var form = _v59.b;
							var _v60 = $elm$core$String$toInt(ngames);
							if (_v60.$ === 'Just') {
								var i = _v60.a;
								return A4(
									$author$project$Page$Tournament$updateEditForm,
									function (f) {
										return _Utils_update(
											f,
											{
												brackets: A3(
													$author$project$Page$Tournament$updateBracket,
													function (b) {
														return _Utils_update(
															b,
															{gamesPerSeries: i});
													},
													f.brackets,
													seq)
											});
									},
									tournament,
									form,
									model);
							} else {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											error: $elm$core$Maybe$Just('Falha na conversão de número de séries para ponto flutuante')
										}),
									$elm$core$Platform$Cmd$none);
							}
						default:
							break _v0$44;
					}
				default:
					switch (_v0.b.$) {
						case 'New':
							var _v61 = _v0.a;
							var seq = _v61.a;
							var mul = _v61.b;
							var form = _v0.b.a;
							var _v62 = $elm$core$String$toFloat(mul);
							if (_v62.$ === 'Just') {
								var fl = _v62.a;
								return A2(
									$author$project$Page$Tournament$updateNewForm,
									_Utils_update(
										form,
										{
											brackets: A3(
												$author$project$Page$Tournament$updateBracket,
												function (b) {
													return _Utils_update(
														b,
														{finalScoreMultiplier: fl});
												},
												form.brackets,
												seq)
										}),
									model);
							} else {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											error: $elm$core$Maybe$Just('Falha na conversão de número de séries para inteiro')
										}),
									$elm$core$Platform$Cmd$none);
							}
						case 'Edit':
							var _v63 = _v0.a;
							var seq = _v63.a;
							var mul = _v63.b;
							var _v64 = _v0.b;
							var tournament = _v64.a;
							var form = _v64.b;
							var _v65 = $elm$core$String$toFloat(mul);
							if (_v65.$ === 'Just') {
								var fl = _v65.a;
								return A4(
									$author$project$Page$Tournament$updateEditForm,
									function (f) {
										return _Utils_update(
											f,
											{
												brackets: A3(
													$author$project$Page$Tournament$updateBracket,
													function (b) {
														return _Utils_update(
															b,
															{finalScoreMultiplier: fl});
													},
													f.brackets,
													seq)
											});
									},
									tournament,
									form,
									model);
							} else {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											error: $elm$core$Maybe$Just('Falha na conversão de número de séries para inteiro')
										}),
									$elm$core$Platform$Cmd$none);
							}
						default:
							break _v0$44;
					}
			}
		}
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					error: $elm$core$Maybe$Just('Estado inválido')
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Page$Tournaments$update = F2(
	function (msg, model) {
		var result = msg.a;
		if (result.$ === 'Ok') {
			var tournaments = result.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{error: $elm$core$Maybe$Nothing, tournaments: tournaments}),
				$elm$core$Platform$Cmd$none);
		} else {
			var error = result.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						error: $elm$core$Maybe$Just(
							$author$project$Api$errorToString(error))
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$User$EditProfile = F2(
	function (a, b) {
		return {$: 'EditProfile', a: a, b: b};
	});
var $author$project$Page$User$GotNotifications = function (a) {
	return {$: 'GotNotifications', a: a};
};
var $author$project$Page$User$UpdateForm = F4(
	function (username, email, password, passwordAgain) {
		return {email: email, password: password, passwordAgain: passwordAgain, username: username};
	});
var $author$project$Page$User$ViewProfile = function (a) {
	return {$: 'ViewProfile', a: a};
};
var $author$project$Page$User$ViewAnonymus = function (a) {
	return {$: 'ViewAnonymus', a: a};
};
var $author$project$Page$User$initState = F2(
	function (session, user) {
		if (session.$ === 'LoggedIn') {
			var viewer = session.b;
			return _Utils_eq(user.id, viewer.id) ? $author$project$Page$User$ViewProfile(user) : $author$project$Page$User$ViewAnonymus(user);
		} else {
			return $author$project$Page$User$ViewAnonymus(user);
		}
	});
var $author$project$Model$Notification$listDecoder = $elm$json$Json$Decode$list($author$project$Model$Notification$decoder);
var $author$project$Page$User$PatchUser = function (a) {
	return {$: 'PatchUser', a: a};
};
var $author$project$Page$User$patchEncoder = function (form) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'username',
				$elm$core$String$isEmpty(form.username) ? $elm$json$Json$Encode$null : $elm$json$Json$Encode$string(form.username)),
				_Utils_Tuple2(
				'email',
				$elm$core$String$isEmpty(form.email) ? $elm$json$Json$Encode$null : $elm$json$Json$Encode$string(form.email)),
				_Utils_Tuple2(
				'password',
				$elm$core$String$isEmpty(form.password) ? $elm$json$Json$Encode$null : $elm$json$Json$Encode$string(form.password)),
				_Utils_Tuple2(
				'passwordconfirmation',
				$elm$core$String$isEmpty(form.passwordAgain) ? $elm$json$Json$Encode$null : $elm$json$Json$Encode$string(form.passwordAgain))
			]));
};
var $author$project$Api$users = $author$project$Api$backendUrl + '/users';
var $author$project$Page$User$requestPatch = F3(
	function (_v0, form, viewer) {
		return A2(
			$author$project$Api$privatePut,
			{
				body: $elm$http$Http$jsonBody(
					$author$project$Page$User$patchEncoder(form)),
				expect: A2($author$project$Api$expectJson, $author$project$Page$User$PatchUser, $author$project$User$userDecoder),
				url: $author$project$Api$users
			},
			viewer);
	});
var $author$project$Page$User$updateForm = F4(
	function (transform, user, form, model) {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					state: A2(
						$author$project$Page$User$EditProfile,
						user,
						transform(form))
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Page$User$validatePatch = function (form) {
	return ($elm$core$String$isEmpty(form.email) && ($elm$core$String$isEmpty(form.username) && $elm$core$String$isEmpty(form.password))) ? $elm$core$Result$Err('Preencha ao menos um campo para ser atualizado') : (((!$elm$core$String$isEmpty(form.password)) && $elm$core$String$isEmpty(form.passwordAgain)) ? $elm$core$Result$Err('Preencha a confirmação da senha') : ((!_Utils_eq(form.password, form.passwordAgain)) ? $elm$core$Result$Err('As senhas não são iguais') : $elm$core$Result$Ok(_Utils_Tuple0)));
};
var $author$project$Page$User$update = F2(
	function (msg, model) {
		var _v0 = _Utils_Tuple2(msg, model.state);
		_v0$12:
		while (true) {
			switch (_v0.a.$) {
				case 'GotUser':
					var result = _v0.a.a;
					if (result.$ === 'Ok') {
						var user = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Nothing,
									state: A2($author$project$Page$User$initState, model.session, user)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var error = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Just(
										$author$project$Api$errorToString(error))
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 'GotNotifications':
					if (_v0.b.$ === 'ViewProfile') {
						var result = _v0.a.a;
						var user = _v0.b.a;
						if (result.$ === 'Ok') {
							var notifications = result.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										state: $author$project$Page$User$ViewProfile(
											_Utils_update(
												user,
												{notifications: notifications}))
									}),
								$elm$core$Platform$Cmd$none);
						} else {
							var error = result.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										error: $elm$core$Maybe$Just(
											$author$project$Api$errorToString(error))
									}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						break _v0$12;
					}
				case 'EditUser':
					if (_v0.b.$ === 'ViewProfile') {
						var _v3 = _v0.a;
						var user = _v0.b.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Nothing,
									state: A2(
										$author$project$Page$User$EditProfile,
										user,
										A4($author$project$Page$User$UpdateForm, '', '', '', ''))
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						break _v0$12;
					}
				case 'CancelEdit':
					if (_v0.b.$ === 'EditProfile') {
						var _v4 = _v0.a;
						var _v5 = _v0.b;
						var user = _v5.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Nothing,
									state: $author$project$Page$User$ViewProfile(user)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						break _v0$12;
					}
				case 'ConfirmEdit':
					if (_v0.b.$ === 'EditProfile') {
						var _v6 = _v0.a;
						var _v7 = _v0.b;
						var user = _v7.a;
						var form = _v7.b;
						var _v8 = $author$project$Page$User$validatePatch(form);
						if (_v8.$ === 'Ok') {
							var _v9 = model.session;
							if (_v9.$ === 'LoggedIn') {
								var viewer = _v9.b;
								return _Utils_Tuple2(
									model,
									A3($author$project$Page$User$requestPatch, user, form, viewer));
							} else {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											error: $elm$core$Maybe$Just('De alguma forma, você não está logado')
										}),
									$elm$core$Platform$Cmd$none);
							}
						} else {
							var err = _v8.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										error: $elm$core$Maybe$Just(err)
									}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						break _v0$12;
					}
				case 'PatchUser':
					if (_v0.b.$ === 'EditProfile') {
						var result = _v0.a.a;
						var _v10 = _v0.b;
						if (result.$ === 'Ok') {
							var user = result.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										error: $elm$core$Maybe$Nothing,
										state: $author$project$Page$User$ViewProfile(user)
									}),
								$elm$core$Platform$Cmd$none);
						} else {
							var error = result.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										error: $elm$core$Maybe$Just(
											$author$project$Api$errorToString(error))
									}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						break _v0$12;
					}
				case 'InputUsername':
					if (_v0.b.$ === 'EditProfile') {
						var username = _v0.a.a;
						var _v12 = _v0.b;
						var user = _v12.a;
						var form = _v12.b;
						return A4(
							$author$project$Page$User$updateForm,
							function (f) {
								return _Utils_update(
									f,
									{username: username});
							},
							user,
							form,
							model);
					} else {
						break _v0$12;
					}
				case 'InputEmail':
					if (_v0.b.$ === 'EditProfile') {
						var email = _v0.a.a;
						var _v13 = _v0.b;
						var user = _v13.a;
						var form = _v13.b;
						return A4(
							$author$project$Page$User$updateForm,
							function (f) {
								return _Utils_update(
									f,
									{email: email});
							},
							user,
							form,
							model);
					} else {
						break _v0$12;
					}
				case 'InputPassword':
					if (_v0.b.$ === 'EditProfile') {
						var password = _v0.a.a;
						var _v14 = _v0.b;
						var user = _v14.a;
						var form = _v14.b;
						return A4(
							$author$project$Page$User$updateForm,
							function (f) {
								return _Utils_update(
									f,
									{password: password});
							},
							user,
							form,
							model);
					} else {
						break _v0$12;
					}
				case 'InputPasswordAgain':
					if (_v0.b.$ === 'EditProfile') {
						var passwordAgain = _v0.a.a;
						var _v15 = _v0.b;
						var user = _v15.a;
						var form = _v15.b;
						return A4(
							$author$project$Page$User$updateForm,
							function (f) {
								return _Utils_update(
									f,
									{passwordAgain: passwordAgain});
							},
							user,
							form,
							model);
					} else {
						break _v0$12;
					}
				case 'NotificationAction':
					if (_v0.b.$ === 'ViewProfile') {
						var url = _v0.a.a;
						var _v16 = $author$project$Session$toViewer(model.session);
						if (_v16.$ === 'Just') {
							var viewer = _v16.a;
							return _Utils_Tuple2(
								model,
								A2(
									$author$project$Api$privatePost,
									{
										body: $elm$http$Http$emptyBody,
										expect: A2($author$project$Api$expectJson, $author$project$Page$User$GotNotifications, $author$project$Model$Notification$listDecoder),
										url: url
									},
									viewer));
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										error: $elm$core$Maybe$Just('You shouldn\'t be able to do this ')
									}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						break _v0$12;
					}
				default:
					var _v17 = _v0.a;
					return _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							$author$project$Session$navKey(model.session),
							A2(
								$elm$url$Url$Builder$absolute,
								$author$project$Route$routeToPieces($author$project$Route$NewClub),
								_List_Nil)));
			}
		}
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					error: $elm$core$Maybe$Just('Estado inválido')
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		var _v0 = _Utils_Tuple2(msg, model);
		switch (_v0.a.$) {
			case 'LinkClicked':
				var urlRequest = _v0.a.a;
				if (urlRequest.$ === 'Internal') {
					var url = urlRequest.a;
					return _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							$author$project$Session$navKey(
								$author$project$Main$toSession(model)),
							$elm$url$Url$toString(url)));
				} else {
					var href = urlRequest.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(href));
				}
			case 'UrlChanged':
				var url = _v0.a.a;
				return A2(
					$author$project$Main$changeRouteTo,
					$author$project$Route$fromUrl(url),
					model);
			case 'GotLoginMsg':
				if (_v0.b.$ === 'Login') {
					var subMsg = _v0.a.a;
					var login = _v0.b.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$Login,
						$author$project$Main$GotLoginMsg,
						A2($author$project$Page$Login$update, subMsg, login));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GotSignUpMsg':
				if (_v0.b.$ === 'SignUp') {
					var subMsg = _v0.a.a;
					var signUp = _v0.b.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$SignUp,
						$author$project$Main$GotSignUpMsg,
						A2($author$project$Page$SignUp$update, subMsg, signUp));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GotClubsMsg':
				if (_v0.b.$ === 'Clubs') {
					var subMsg = _v0.a.a;
					var clubs = _v0.b.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$Clubs,
						$author$project$Main$GotClubsMsg,
						A2($author$project$Page$Clubs$update, subMsg, clubs));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GotNewClubMsg':
				if (_v0.b.$ === 'NewClub') {
					var subMsg = _v0.a.a;
					var club = _v0.b.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$NewClub,
						$author$project$Main$GotNewClubMsg,
						A2($author$project$Page$Club$update, subMsg, club));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GotClubMsg':
				if (_v0.b.$ === 'Club') {
					var subMsg = _v0.a.a;
					var club = _v0.b.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$Club,
						$author$project$Main$GotClubMsg,
						A2($author$project$Page$Club$update, subMsg, club));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GotTournamentsMsg':
				if (_v0.b.$ === 'Tournaments') {
					var subMsg = _v0.a.a;
					var tournaments = _v0.b.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$Tournaments,
						$author$project$Main$GotTournamentsMsg,
						A2($author$project$Page$Tournaments$update, subMsg, tournaments));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GotNewTournamentMsg':
				if (_v0.b.$ === 'NewTournament') {
					var subMsg = _v0.a.a;
					var newTournament = _v0.b.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$NewTournament,
						$author$project$Main$GotNewTournamentMsg,
						A2($author$project$Page$Tournament$update, subMsg, newTournament));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GotTournamentMsg':
				if (_v0.b.$ === 'Tournament') {
					var subMsg = _v0.a.a;
					var tournament = _v0.b.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$Tournament,
						$author$project$Main$GotTournamentMsg,
						A2($author$project$Page$Tournament$update, subMsg, tournament));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GotRulesetMsg':
				if (_v0.b.$ === 'Ruleset') {
					var subMsg = _v0.a.a;
					var ruleset = _v0.b.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$Ruleset,
						$author$project$Main$GotRulesetMsg,
						A2($author$project$Page$Ruleset$update, subMsg, ruleset));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GotBracketMsg':
				if (_v0.b.$ === 'Bracket') {
					var subMsg = _v0.a.a;
					var bracket = _v0.b.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$Bracket,
						$author$project$Main$GotBracketMsg,
						A2($author$project$Page$Bracket$update, subMsg, bracket));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				if (_v0.b.$ === 'User') {
					var subMsg = _v0.a.a;
					var user = _v0.b.a;
					return A3(
						$author$project$Main$updateWith,
						$author$project$Main$User,
						$author$project$Main$GotUserMsg,
						A2($author$project$Page$User$update, subMsg, user));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $author$project$CommonHtml$errorCard = function (msg) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container rounded-lg bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded my-5 max-w-lg text-center')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$strong,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('font-bold')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Erro! ')
					])),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('block sm:inline')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(msg)
					]))
			]));
};
var $author$project$Page$Bracket$stateToTitle = function (state) {
	if (state.$ === 'Uninitialized') {
		return 'Chave';
	} else {
		var bracket = state.b;
		return 'Chave - ' + bracket.name;
	}
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $author$project$Page$Bracket$viewBracketCard = function (bracket) {
	var cardElement = F2(
		function (title, value) {
			return $elm$core$String$isEmpty(value) ? $elm$html$Html$text('') : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('block')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$strong,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('inline-block font-bold')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(title)
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('inline-block pl-2')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(value)
							]))
					]));
		});
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('font-bold text-xl')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(bracket.name)
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(bracket.description)
					])),
				A2(cardElement, 'Data de Início', bracket.startedAt),
				A2(cardElement, 'Data de Término', bracket.finishedAt)
			]));
};
var $author$project$Page$Bracket$AddGame = function (a) {
	return {$: 'AddGame', a: a};
};
var $author$project$Page$Bracket$CancelAddGame = function (a) {
	return {$: 'CancelAddGame', a: a};
};
var $author$project$Page$Bracket$InputLogLink = F2(
	function (a, b) {
		return {$: 'InputLogLink', a: a, b: b};
	});
var $author$project$Page$Bracket$InputPlayer1Seat = F2(
	function (a, b) {
		return {$: 'InputPlayer1Seat', a: a, b: b};
	});
var $author$project$Page$Bracket$InputPlayer2Seat = F2(
	function (a, b) {
		return {$: 'InputPlayer2Seat', a: a, b: b};
	});
var $author$project$Page$Bracket$InputPlayer3Seat = F2(
	function (a, b) {
		return {$: 'InputPlayer3Seat', a: a, b: b};
	});
var $author$project$Page$Bracket$InputPlayer4Seat = F2(
	function (a, b) {
		return {$: 'InputPlayer4Seat', a: a, b: b};
	});
var $author$project$Page$Bracket$PostGame = function (a) {
	return {$: 'PostGame', a: a};
};
var $author$project$Page$Bracket$ToggleFold = function (a) {
	return {$: 'ToggleFold', a: a};
};
var $elm$core$Debug$log = _Debug_log;
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$core$String$trim = _String_trim;
var $author$project$Model$Game$viewPlayer = F2(
	function (player, playerClass) {
		var valueClass = 'text-right';
		var seatClass = 'font-semibold text-right pr-1';
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(playerClass)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(seatClass)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(player.seat)
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(valueClass)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromFloat(player.gameScore))
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(valueClass)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromFloat(player.runningTotal))
						]))
				]));
	});
var $author$project$Model$Game$view = function (game) {
	var playerClass = 'flex-1';
	var labelClass = 'font-semibold';
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex bg-indigo-500 text-white rounded-xl px-5 py-2')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex-1 align-middle pt-6')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('#1')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(playerClass)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(labelClass)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Acento')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(labelClass)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Pontuação Final')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(labelClass)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Total')
							]))
					])),
				A2($author$project$Model$Game$viewPlayer, game.player1, playerClass),
				A2($author$project$Model$Game$viewPlayer, game.player2, playerClass),
				A2($author$project$Model$Game$viewPlayer, game.player3, playerClass),
				A2($author$project$Model$Game$viewPlayer, game.player4, playerClass),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex-1 pt-6')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('pl-8 hover:underline'),
								$elm$html$Html$Attributes$href(game.logLink)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Log')
							]))
					]))
			]));
};
var $author$project$Page$Bracket$viewSingleSeries = F2(
	function (_switch, series) {
		var visibleHeadingClass = 'flex-1 font-bold text-right';
		var invisibleHeadingClass = 'flex-1 font-bold text-right invisible';
		var heading = A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex px-5')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(invisibleHeadingClass)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('batata')
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(invisibleHeadingClass)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('batata')
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(visibleHeadingClass)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(series.player1Name)
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(visibleHeadingClass)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(series.player2Name)
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(visibleHeadingClass)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(series.player3Name)
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(visibleHeadingClass)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(series.player4Name)
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(invisibleHeadingClass)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('batata')
						]))
				]));
		var header = A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('list-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('inline-btn btn-indigo-500 px-2'),
							$elm$html$Html$Events$onClick(
							$author$project$Page$Bracket$ToggleFold(series))
						]),
					_List_fromArray(
						[
							series.isFolded ? $elm$html$Html$text('>') : $elm$html$Html$text('v')
						])),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$concat(
								_List_fromArray(
									[series.player1Name, ' vs ', series.player2Name, ' vs ', series.player3Name, ' vs ', series.player4Name])))
						])),
					A2(
					$elm$html$Html$span,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							_Utils_ap(
								series.playedAt,
								$elm$core$String$isEmpty(
									$elm$core$String$trim(series.finishedAt)) ? (' - ' + series.finishedAt) : ''))
						]))
				]));
		var seriesHtml = A2(
			$elm$core$List$cons,
			header,
			series.isFolded ? _List_Nil : ($elm$core$List$isEmpty(series.games) ? _List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Nenhum jogo adicionado até o momento')
						]))
				]) : A2(
				$elm$core$List$cons,
				heading,
				A2($elm$core$List$map, $author$project$Model$Game$view, series.games))));
		var formHtml = function () {
			if (_Utils_eq(
				A2($elm$core$Debug$log, 'current switch', _switch),
				$author$project$Page$Bracket$Owner)) {
				var _v0 = A2($elm$core$Debug$log, 'current form', series.gameForm);
				if (_v0.$ === 'Nothing') {
					return (A2($elm$core$Debug$log, 'current status', series.status) !== 'Encerrada') ? _List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('border-transparent btn btn-indigo-500 mt-4'),
									$elm$html$Html$Events$onClick(
									$author$project$Page$Bracket$AddGame(series))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Adicionar Jogo')
								]))
						]) : _List_Nil;
				} else {
					var selectSeat = function (onInputMsg) {
						return A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$placeholder('Acento'),
									$elm$html$Html$Attributes$class('flex-1 border-none rounded-sm bg-gray-100 text-gray-400'),
									$elm$html$Html$Events$onInput(onInputMsg)
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('East')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('東')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('South')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('南')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('West')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('西')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('North')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('北')
										]))
								]));
					};
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('space-y-2')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('list-item')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$p,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('flex-1 font-bold text-right invisible')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('batata')
												])),
											A2(
											$elm$html$Html$p,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('flex-1 font-bold text-right invisible')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('batata')
												])),
											selectSeat(
											$author$project$Page$Bracket$InputPlayer1Seat(series)),
											selectSeat(
											$author$project$Page$Bracket$InputPlayer2Seat(series)),
											selectSeat(
											$author$project$Page$Bracket$InputPlayer3Seat(series)),
											selectSeat(
											$author$project$Page$Bracket$InputPlayer4Seat(series)),
											A2(
											$elm$html$Html$input,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('text'),
													$elm$html$Html$Attributes$placeholder('Log Link'),
													$elm$html$Html$Attributes$class('flex-1 w-36 border-none rounded-sm bg-gray-100 text-gray-400 placeholder-gray-400'),
													$elm$html$Html$Events$onInput(
													$author$project$Page$Bracket$InputLogLink(series))
												]),
											_List_Nil)
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('border-none btn btn-green-500'),
											$elm$html$Html$Events$onClick(
											$author$project$Page$Bracket$PostGame(series))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Confirmar')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('border-none btn btn-red-500'),
											$elm$html$Html$Events$onClick(
											$author$project$Page$Bracket$CancelAddGame(series))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Cancelar')
										]))
								]))
						]);
				}
			} else {
				return _List_Nil;
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('m-2')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('container space-y-2 w-2/4')
						]),
					A2($elm$core$List$append, seriesHtml, formHtml))
				]));
	});
var $author$project$Page$Bracket$viewSeries = F2(
	function (bracket, _switch) {
		var seriesHtml = $elm$core$List$isEmpty(bracket.series) ? _List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('list-heading')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Chave ainda não inicializada')
					]))
			]) : _List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('list-heading')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Séries')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('space-y-4')
					]),
				A2(
					$elm$core$List$map,
					$author$project$Page$Bracket$viewSingleSeries(_switch),
					bracket.series))
			]);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('m-2')
				]),
			seriesHtml);
	});
var $author$project$Page$Bracket$viewBracket = function (model) {
	var _v0 = model.state;
	if (_v0.$ === 'Uninitialized') {
		return A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Carregando...')
				]));
	} else {
		var _switch = _v0.a;
		var bracket = _v0.b;
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					$author$project$Page$Bracket$viewBracketCard(bracket),
					A2($author$project$Page$Bracket$viewSeries, bracket, _switch)
				]));
	}
};
var $author$project$Viewer$getUrl = function (viewer) {
	return A2(
		$elm$url$Url$Builder$absolute,
		_List_fromArray(
			[
				'users',
				$elm$core$String$fromInt(viewer.id)
			]),
		_List_Nil);
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$CommonHtml$viewNav = function (session) {
	return A2(
		$elm$html$Html$nav,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('bg-indigo-700 flex flex-wrap items-center p-3')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex items-center flex-shrink-0 mr-2')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src('img/Nan2.svg'),
								$elm$html$Html$Attributes$class('h-12 w-12')
							]),
						_List_Nil),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-white text-xl font-bold')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Riichi Gang')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex-grow inline-flex justify-end mr-4')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('/clubs'),
								$elm$html$Html$Attributes$class('link-white')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Clubes')
							])),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('/tournaments'),
								$elm$html$Html$Attributes$class('link-white')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Torneios')
							]))
					])),
				function () {
				if (session.$ === 'LoggedIn') {
					var viewer = session.b;
					var userUrl = $author$project$Viewer$getUrl(viewer);
					var logoutUrl = A2(
						$elm$url$Url$Builder$absolute,
						_List_fromArray(
							['logout']),
						_List_Nil);
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('inline-flex')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href(userUrl),
										$elm$html$Html$Attributes$class('btn btn-indigo-800')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Perfil')
									])),
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href(logoutUrl),
										$elm$html$Html$Attributes$class('btn btn-indigo-800')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Logout')
									]))
							]));
				} else {
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('inline-flex')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href('/login'),
										$elm$html$Html$Attributes$class('btn btn-indigo-800')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Login')
									])),
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href('/signup'),
										$elm$html$Html$Attributes$class('btn btn-indigo-800')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Sign Up')
									]))
							]));
				}
			}()
			]));
};
var $author$project$Page$Bracket$view = function (model) {
	return {
		body: _List_fromArray(
			[
				$author$project$CommonHtml$viewNav(model.session),
				function () {
				var _v0 = model.error;
				if (_v0.$ === 'Just') {
					var error = _v0.a;
					return $author$project$CommonHtml$errorCard(error);
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				$author$project$Page$Bracket$viewBracket(model)
			]),
		title: $author$project$Page$Bracket$stateToTitle(model.state)
	};
};
var $author$project$Page$Club$stateToTitle = function (state) {
	switch (state.$) {
		case 'Uninitialized':
			return 'Clube';
		case 'View':
			var club = state.a;
			return 'Clube - ' + club.name;
		case 'Edit':
			var club = state.a;
			return 'Clube - ' + club.name;
		default:
			return 'Clube - Novo';
	}
};
var $author$project$Page$Club$AskInvite = {$: 'AskInvite'};
var $author$project$Page$Club$ConfirmDelete = {$: 'ConfirmDelete'};
var $author$project$Page$Club$EditClub = {$: 'EditClub'};
var $author$project$Page$Club$Leave = {$: 'Leave'};
var $author$project$Page$Club$clubCardElement = F2(
	function (title, value) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('block')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$strong,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('inline-block font-bold')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('inline-block pl-2')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(value)
						]))
				]));
	});
var $author$project$Model$ClubMembership$statusText = function (membership) {
	return membership.approved ? 'Aprovada' : (membership.denied ? 'Negada' : 'Pendente');
};
var $author$project$Page$Club$viewClubCard = F2(
	function (club, _switch) {
		var divClass = 'container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg';
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(divClass)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('font-bold text-xl')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(club.name)
						])),
					A2($author$project$Page$Club$clubCardElement, 'Localização', club.localization),
					A2($author$project$Page$Club$clubCardElement, 'Fundação', club.createdAt),
					A2($author$project$Page$Club$clubCardElement, 'Site', club.website),
					A2($author$project$Page$Club$clubCardElement, 'Contato', club.contact),
					function () {
					switch (_switch.$) {
						case 'Anonymus':
							return A2($elm$html$Html$div, _List_Nil, _List_Nil);
						case 'Owner':
							return A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn btn-indigo-500 mt-4'),
												$elm$html$Html$Events$onClick($author$project$Page$Club$EditClub)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Editar')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('border-none btn btn-red-500 mt-4'),
												$elm$html$Html$Events$onClick($author$project$Page$Club$ConfirmDelete)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Excluir')
											]))
									]));
						case 'Member':
							var membership = _switch.a;
							return A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$author$project$Page$Club$clubCardElement,
										'Status da Filiação',
										$author$project$Model$ClubMembership$statusText(membership)),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn btn-indigo-500 mt-4'),
												$elm$html$Html$Events$onClick($author$project$Page$Club$Leave)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Sair')
											]))
									]));
						default:
							return A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-indigo-500 mt-4'),
										$elm$html$Html$Events$onClick($author$project$Page$Club$AskInvite)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Pedir Convite')
									]));
					}
				}()
				]));
	});
var $author$project$Page$Club$CancelEdit = {$: 'CancelEdit'};
var $author$project$Page$Club$CancelNew = {$: 'CancelNew'};
var $author$project$Page$Club$ConfirmEdit = {$: 'ConfirmEdit'};
var $author$project$Page$Club$ConfirmNew = {$: 'ConfirmNew'};
var $author$project$Page$Club$InputContact = function (a) {
	return {$: 'InputContact', a: a};
};
var $author$project$Page$Club$InputLocalization = function (a) {
	return {$: 'InputLocalization', a: a};
};
var $author$project$Page$Club$InputName = function (a) {
	return {$: 'InputName', a: a};
};
var $author$project$Page$Club$InputWebsite = function (a) {
	return {$: 'InputWebsite', a: a};
};
var $author$project$Page$Club$viewClubCardEdit = function (newClub) {
	var divClass = 'container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg space-y-4';
	var confirmMsg = newClub ? $author$project$Page$Club$ConfirmNew : $author$project$Page$Club$ConfirmEdit;
	var cancelMsg = newClub ? $author$project$Page$Club$CancelNew : $author$project$Page$Club$CancelEdit;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(divClass)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Preencha os campos que deseja atualizar e pressione confirmar')
					])),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('text'),
						$elm$html$Html$Attributes$placeholder('Nome'),
						$elm$html$Html$Attributes$class('login-input'),
						$elm$html$Html$Events$onInput($author$project$Page$Club$InputName)
					]),
				_List_Nil),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('text'),
						$elm$html$Html$Attributes$placeholder('Localização'),
						$elm$html$Html$Attributes$class('login-input'),
						$elm$html$Html$Events$onInput($author$project$Page$Club$InputLocalization)
					]),
				_List_Nil),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('text'),
						$elm$html$Html$Attributes$placeholder('Site'),
						$elm$html$Html$Attributes$class('login-input'),
						$elm$html$Html$Events$onInput($author$project$Page$Club$InputWebsite)
					]),
				_List_Nil),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('text'),
						$elm$html$Html$Attributes$placeholder('Contato'),
						$elm$html$Html$Attributes$class('login-input'),
						$elm$html$Html$Events$onInput($author$project$Page$Club$InputContact)
					]),
				_List_Nil),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('border-none btn btn-green-500'),
						$elm$html$Html$Events$onClick(confirmMsg)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Confirmar')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('border-none btn btn-red-500'),
						$elm$html$Html$Events$onClick(cancelMsg)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Cancelar')
					]))
			]));
};
var $author$project$Page$Club$RemoveMember = function (a) {
	return {$: 'RemoveMember', a: a};
};
var $author$project$UserShort$getUrl = function (user) {
	return A2(
		$elm$url$Url$Builder$absolute,
		_List_fromArray(
			[
				'users',
				$elm$core$String$fromInt(user.id)
			]),
		_List_Nil);
};
var $author$project$Model$ClubMembership$view = F2(
	function (membership, removeMsg) {
		var user = membership.user;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('list-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(
							$author$project$UserShort$getUrl(user)),
							$elm$html$Html$Attributes$class('flex-grow hover:underline')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(user.username)
						])),
					membership.approved ? A2($elm$html$Html$span, _List_Nil, _List_Nil) : (membership.denied ? A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('font-bold')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Negada')
						])) : A2(
					$elm$html$Html$span,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Pendente')
						]))),
					A2(
					$elm$html$Html$span,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(user.totalTournaments) + ' Torneios')
						])),
					A2(
					$elm$html$Html$span,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(user.createdAt)
						])),
					function () {
					if (removeMsg.$ === 'Nothing') {
						return A2($elm$html$Html$div, _List_Nil, _List_Nil);
					} else {
						var msg = removeMsg.a;
						return A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('border-none btn btn-red-500'),
									$elm$html$Html$Events$onClick(msg)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Cancelar')
								]));
					}
				}()
				]));
	});
var $author$project$Page$Club$viewMembers = F2(
	function (club, isOwner) {
		var transform = isOwner ? function (m) {
			return A2(
				$author$project$Model$ClubMembership$view,
				m,
				$elm$core$Maybe$Just(
					$author$project$Page$Club$RemoveMember(m)));
		} : function (m) {
			return A2($author$project$Model$ClubMembership$view, m, $elm$core$Maybe$Nothing);
		};
		var filter = isOwner ? function (_v0) {
			return true;
		} : function (m) {
			return m.approved && (!m.denied);
		};
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('m-2')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('list-heading')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Membros')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('space-y-4')
						]),
					A2(
						$elm$core$List$map,
						transform,
						A2($elm$core$List$filter, filter, club.members)))
				]));
	});
var $author$project$UserShort$view = function (user) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('list-item')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(
						$author$project$UserShort$getUrl(user)),
						$elm$html$Html$Attributes$class('flex-grow hover:underline')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(user.username)
					])),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(user.totalTournaments) + ' Torneios')
					])),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(user.createdAt)
					]))
			]));
};
var $author$project$Page$Club$viewOwner = function (club) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('m-2')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('list-heading')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Dono do Clube')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('space-y-4')
					]),
				_List_fromArray(
					[
						$author$project$UserShort$view(club.owner)
					]))
			]));
};
var $author$project$Page$Club$NewTournament = {$: 'NewTournament'};
var $author$project$Model$TournamentShort$getUrl = function (tournament) {
	return A2(
		$elm$url$Url$Builder$absolute,
		_List_fromArray(
			[
				'tournaments',
				$elm$core$String$fromInt(tournament.id)
			]),
		_List_Nil);
};
var $author$project$Model$TournamentShort$view = function (tournament) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('list-item')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(
						$author$project$Model$TournamentShort$getUrl(tournament)),
						$elm$html$Html$Attributes$class('flex-grow hover:underline')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(tournament.name)
					])),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(tournament.totalPlayers) + ' Jogadores')
					])),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Inicio em ' + tournament.startDate)
					])),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(tournament.status)
					]))
			]));
};
var $author$project$Page$Club$viewTournaments = F2(
	function (club, isOwner) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('m-2')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('list-heading')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Torneios')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('space-y-4')
						]),
					A2($elm$core$List$map, $author$project$Model$TournamentShort$view, club.tournaments)),
					isOwner ? A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('border-transparent btn btn-indigo-500 mt-4'),
							$elm$html$Html$Events$onClick($author$project$Page$Club$NewTournament)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Novo')
						])) : A2($elm$html$Html$div, _List_Nil, _List_Nil)
				]));
	});
var $author$project$Page$Club$viewClub = function (model) {
	var _v0 = model.state;
	switch (_v0.$) {
		case 'Uninitialized':
			return A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Carregando...')
					]));
		case 'View':
			var club = _v0.a;
			var _switch = _v0.b;
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2($author$project$Page$Club$viewClubCard, club, _switch),
						$author$project$Page$Club$viewOwner(club),
						A2(
						$author$project$Page$Club$viewTournaments,
						club,
						_Utils_eq(_switch, $author$project$Page$Club$Owner)),
						A2(
						$author$project$Page$Club$viewMembers,
						club,
						_Utils_eq(_switch, $author$project$Page$Club$Owner))
					]));
		case 'Edit':
			var club = _v0.a;
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$author$project$Page$Club$viewClubCardEdit(false),
						$author$project$Page$Club$viewOwner(club),
						A2($author$project$Page$Club$viewTournaments, club, false),
						A2($author$project$Page$Club$viewMembers, club, true)
					]));
		default:
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$author$project$Page$Club$viewClubCardEdit(true)
					]));
	}
};
var $author$project$Page$Club$view = function (model) {
	return {
		body: _List_fromArray(
			[
				$author$project$CommonHtml$viewNav(model.session),
				function () {
				var _v0 = model.error;
				if (_v0.$ === 'Just') {
					var error = _v0.a;
					return $author$project$CommonHtml$errorCard(error);
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				$author$project$Page$Club$viewClub(model)
			]),
		title: $author$project$Page$Club$stateToTitle(model.state)
	};
};
var $author$project$ClubShort$getUrl = function (club) {
	return A2(
		$elm$url$Url$Builder$absolute,
		_List_fromArray(
			[
				'clubs',
				$elm$core$String$fromInt(club.id)
			]),
		_List_Nil);
};
var $author$project$ClubShort$view = function (club) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('list-item')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(
						$author$project$ClubShort$getUrl(club)),
						$elm$html$Html$Attributes$class('flex-grow hover:underline')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(club.name)
					])),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(club.localization)
					])),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(club.totalTournaments) + ' Torneios')
					])),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(club.totalPlayers) + ' Jogadores')
					])),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Fundado em ' + club.createdAt)
					]))
			]));
};
var $author$project$Page$Clubs$view = function (model) {
	return {
		body: _List_fromArray(
			[
				$author$project$CommonHtml$viewNav(model.session),
				function () {
				var _v0 = model.error;
				if (_v0.$ === 'Just') {
					var error = _v0.a;
					return $author$project$CommonHtml$errorCard(error);
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('m-2')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('list-heading')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Clubes')
							])),
						$elm$core$List$isEmpty(model.clubs) ? A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Nada ainda')
							])) : A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('space-y-4')
							]),
						A2($elm$core$List$map, $author$project$ClubShort$view, model.clubs))
					]))
			]),
		title: 'Clubes'
	};
};
var $author$project$Page$Login$InputEmail = function (a) {
	return {$: 'InputEmail', a: a};
};
var $author$project$Page$Login$InputPassword = function (a) {
	return {$: 'InputPassword', a: a};
};
var $author$project$Page$Login$RequestLogin = {$: 'RequestLogin'};
var $author$project$Page$Login$viewLoginCard = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('login-card')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card-heading')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Login')
				])),
			A2(
			$elm$html$Html$input,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$type_('email'),
					$elm$html$Html$Attributes$placeholder('Email'),
					$elm$html$Html$Attributes$class('login-input'),
					$elm$html$Html$Events$onInput($author$project$Page$Login$InputEmail)
				]),
			_List_Nil),
			A2(
			$elm$html$Html$input,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$type_('password'),
					$elm$html$Html$Attributes$placeholder('Senha'),
					$elm$html$Html$Attributes$class('login-input'),
					$elm$html$Html$Events$onInput($author$project$Page$Login$InputPassword)
				]),
			_List_Nil),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('btn btn-indigo-500'),
					$elm$html$Html$Events$onClick($author$project$Page$Login$RequestLogin)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Login')
				]))
		]));
var $author$project$Page$Login$view = function (model) {
	return {
		body: _List_fromArray(
			[
				$author$project$CommonHtml$viewNav(model.session),
				function () {
				var _v0 = model.error;
				if (_v0.$ === 'Just') {
					var error = _v0.a;
					return $author$project$CommonHtml$errorCard(error);
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				$author$project$Page$Login$viewLoginCard
			]),
		title: 'Login'
	};
};
var $author$project$Page$Ruleset$stateToTitle = function (state) {
	if (state.$ === 'Uninitialized') {
		return 'Ruleset';
	} else {
		var ruleset = state.a;
		return 'Ruleset - ' + ruleset.name;
	}
};
var $author$project$Model$Ruleset$agariyameDescr = 'Permite que o dealer decida terminar o jogo após ter ganho a última mão da partida';
var $author$project$Model$Ruleset$akadoraDescr = 'Cincos vermelhos';
var $author$project$Model$Ruleset$atozukeDescr = 'Permite a vitória por ron mesmo quando uma ou mais das peças pelas quais o jogador está esperando não nenhum yaku';
var $author$project$Model$Ruleset$gentenDescr = 'Quantidade mínima de pontos que o jogador em primeiro lugar precisa atingir ao fim da partida';
var $author$project$Model$Ruleset$kandoraDescr = 'Dora adicional mostrado quando um jogador declara kan';
var $author$project$Model$Ruleset$kanuradoraDescr = 'Dora adicional (um para cada kandora) mostrado quando uma mão ganha com riichi';
var $author$project$Model$Ruleset$kuikaeDescr = 'Permite fazer uma chamada e descartar uma peça que complete o mesmo bloco, por exemplo: chii 678 e descartar 9, ou pon 999 e descartar 9. Quando parcialmente permitido apenas não permite descartar a mesma peça chamada';
var $author$project$Model$Ruleset$kuitanDescr = 'Permite tanyao em mãos abertas';
var $author$project$Model$Ruleset$mochitenDescr = 'Quantidade de pontos que cada jogador possui no início da partida';
var $author$project$Model$Ruleset$okaDescr = 'Pontuação bônus dada ao jogador em primeiro lugar';
var $author$project$Model$Ruleset$tenpaiyameDescr = 'Permite que o dealer decida terminar o jogo após terminar em tenpai na última mão da partida';
var $author$project$Model$Ruleset$tobiDescr = 'Partida encerrada prematuramente caso algum jogador fique com pontos negativos';
var $author$project$Model$Ruleset$umaDescr = 'Pontuação adicional de cada colocação 1º/2º/3º/4º';
var $author$project$Model$Ruleset$uradoraDescr = 'Dora adicional mostrado quando uma mão ganha com riichi';
var $author$project$Model$Ruleset$viewRule = F3(
	function (rule, value, description) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('list-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('py-2 has-tooltip')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(rule),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('tooltip rounded shadow-lg p-1 bg-black text-white -mt-8')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(description)
								]))
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('py-2')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(value)
						]))
				]));
	});
var $author$project$Model$Ruleset$view = function (ruleset) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('m-2')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('list-heading')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Regras - ' + ruleset.name)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('space-y-4')
					]),
				_List_fromArray(
					[
						A3(
						$author$project$Model$Ruleset$viewRule,
						'mochiten',
						$elm$core$String$fromInt(ruleset.mochiten),
						$author$project$Model$Ruleset$mochitenDescr),
						A3(
						$author$project$Model$Ruleset$viewRule,
						'genten',
						$elm$core$String$fromInt(ruleset.genten),
						$author$project$Model$Ruleset$gentenDescr),
						A3($author$project$Model$Ruleset$viewRule, 'uma', ruleset.uma, $author$project$Model$Ruleset$umaDescr),
						A3(
						$author$project$Model$Ruleset$viewRule,
						'oka',
						$elm$core$String$fromInt(ruleset.oka),
						$author$project$Model$Ruleset$okaDescr),
						A3($author$project$Model$Ruleset$viewRule, 'atozuke', ruleset.atozuke, $author$project$Model$Ruleset$atozukeDescr),
						A3($author$project$Model$Ruleset$viewRule, 'kuitan', ruleset.kuitan, $author$project$Model$Ruleset$kuitanDescr),
						A3($author$project$Model$Ruleset$viewRule, 'kuikae', ruleset.kuikae, $author$project$Model$Ruleset$kuikaeDescr),
						A3($author$project$Model$Ruleset$viewRule, 'uradora', ruleset.uradora, $author$project$Model$Ruleset$uradoraDescr),
						A3($author$project$Model$Ruleset$viewRule, 'kandora', ruleset.kandora, $author$project$Model$Ruleset$kandoraDescr),
						A3($author$project$Model$Ruleset$viewRule, 'kanuradora', ruleset.kanuradora, $author$project$Model$Ruleset$kanuradoraDescr),
						A3($author$project$Model$Ruleset$viewRule, 'akadora', ruleset.akadora, $author$project$Model$Ruleset$akadoraDescr),
						A3($author$project$Model$Ruleset$viewRule, 'agariyame', ruleset.agariyame, $author$project$Model$Ruleset$agariyameDescr),
						A3($author$project$Model$Ruleset$viewRule, 'tenpaiyame', ruleset.tenpaiyame, $author$project$Model$Ruleset$tenpaiyameDescr),
						A3($author$project$Model$Ruleset$viewRule, 'tobi', ruleset.tobi, $author$project$Model$Ruleset$tobiDescr)
					]))
			]));
};
var $author$project$Page$Ruleset$view = function (model) {
	return {
		body: _List_fromArray(
			[
				$author$project$CommonHtml$viewNav(model.session),
				function () {
				var _v0 = model.error;
				if (_v0.$ === 'Just') {
					var error = _v0.a;
					return $author$project$CommonHtml$errorCard(error);
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				function () {
				var _v1 = model.state;
				if (_v1.$ === 'Uninitialized') {
					return A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Carregando...')
							]));
				} else {
					var ruleset = _v1.a;
					return $author$project$Model$Ruleset$view(ruleset);
				}
			}()
			]),
		title: $author$project$Page$Ruleset$stateToTitle(model.state)
	};
};
var $author$project$Page$SignUp$InputEmail = function (a) {
	return {$: 'InputEmail', a: a};
};
var $author$project$Page$SignUp$InputPassword = function (a) {
	return {$: 'InputPassword', a: a};
};
var $author$project$Page$SignUp$InputPasswordAgain = function (a) {
	return {$: 'InputPasswordAgain', a: a};
};
var $author$project$Page$SignUp$InputUsername = function (a) {
	return {$: 'InputUsername', a: a};
};
var $author$project$Page$SignUp$RequestSignUp = {$: 'RequestSignUp'};
var $author$project$Page$SignUp$viewSingInCard = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('login-card')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card-heading')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Sign Up')
				])),
			A2(
			$elm$html$Html$input,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$type_('email'),
					$elm$html$Html$Attributes$placeholder('Email'),
					$elm$html$Html$Attributes$class('login-input'),
					$elm$html$Html$Events$onInput($author$project$Page$SignUp$InputEmail)
				]),
			_List_Nil),
			A2(
			$elm$html$Html$input,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$type_('text'),
					$elm$html$Html$Attributes$placeholder('Nome de Usuário'),
					$elm$html$Html$Attributes$class('login-input'),
					$elm$html$Html$Events$onInput($author$project$Page$SignUp$InputUsername)
				]),
			_List_Nil),
			A2(
			$elm$html$Html$input,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$type_('password'),
					$elm$html$Html$Attributes$placeholder('Senha'),
					$elm$html$Html$Attributes$class('login-input'),
					$elm$html$Html$Events$onInput($author$project$Page$SignUp$InputPassword)
				]),
			_List_Nil),
			A2(
			$elm$html$Html$input,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$type_('password'),
					$elm$html$Html$Attributes$placeholder('Confirmação da Senha'),
					$elm$html$Html$Attributes$class('login-input'),
					$elm$html$Html$Events$onInput($author$project$Page$SignUp$InputPasswordAgain)
				]),
			_List_Nil),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('btn btn-indigo-500'),
					$elm$html$Html$Events$onClick($author$project$Page$SignUp$RequestSignUp)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Sign Up')
				]))
		]));
var $author$project$Page$SignUp$view = function (model) {
	return {
		body: _List_fromArray(
			[
				$author$project$CommonHtml$viewNav(model.session),
				function () {
				var _v0 = model.error;
				if (_v0.$ === 'Just') {
					var error = _v0.a;
					return $author$project$CommonHtml$errorCard(error);
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				$author$project$Page$SignUp$viewSingInCard
			]),
		title: 'Sign Up'
	};
};
var $author$project$Page$Tournament$stateToTitle = function (model) {
	var _v0 = model.state;
	switch (_v0.$) {
		case 'Uninitialized':
			return 'Tournament';
		case 'View':
			var tournament = _v0.b;
			return 'Tournament - ' + tournament.name;
		case 'Edit':
			var tournament = _v0.a;
			return 'Tournament - ' + tournament.name;
		default:
			return 'Tournament - Novo';
	}
};
var $author$project$UserShort$getUrlId = function (id) {
	return A2(
		$elm$url$Url$Builder$absolute,
		_List_fromArray(
			[
				'users',
				$elm$core$String$fromInt(id)
			]),
		_List_Nil);
};
var $author$project$Model$BracketPlayerShort$view = function (player) {
	var scoreTextPrefix = (player.score > 0) ? '+' : '';
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('list-item')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						'#' + $elm$core$String$fromInt(player.placement))
					])),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(
						$author$project$UserShort$getUrlId(player.userId)),
						$elm$html$Html$Attributes$class('flex-grow hover:underline')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(player.name)
					])),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						_Utils_ap(
							scoreTextPrefix,
							$elm$core$String$fromFloat(player.score)))
					]))
			]));
};
var $author$project$Model$BracketShort$view = function (bracket) {
	var junc = (bracket.finishedAt !== '') ? ' - ' : '';
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('m-2')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex space-x-2')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href(
								A2(
									$elm$url$Url$Builder$absolute,
									$author$project$Route$routeToPieces(
										A2($author$project$Route$Bracket, bracket.tournamentId, bracket.id)),
									_List_Nil)),
								$elm$html$Html$Attributes$class('list-heading')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(bracket.name)
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-indigo-500 pt-0.5')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$concat(
									_List_fromArray(
										[bracket.startedAt, junc, bracket.finishedAt])))
							]))
					])),
				$elm$core$List$isEmpty(bracket.players) ? A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Nada ainda')
					])) : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('space-y-4')
					]),
				A2($elm$core$List$map, $author$project$Model$BracketPlayerShort$view, bracket.players))
			]));
};
var $author$project$Page$Tournament$viewBrackets = function (tournament) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('space-y-4')
			]),
		A2($elm$core$List$map, $author$project$Model$BracketShort$view, tournament.brackets));
};
var $author$project$Page$Tournament$AddBracket = {$: 'AddBracket'};
var $author$project$Page$Tournament$InputBracketMul = F2(
	function (a, b) {
		return {$: 'InputBracketMul', a: a, b: b};
	});
var $author$project$Page$Tournament$InputBracketNAdv = F2(
	function (a, b) {
		return {$: 'InputBracketNAdv', a: a, b: b};
	});
var $author$project$Page$Tournament$InputBracketNGames = F2(
	function (a, b) {
		return {$: 'InputBracketNGames', a: a, b: b};
	});
var $author$project$Page$Tournament$InputBracketNSeries = F2(
	function (a, b) {
		return {$: 'InputBracketNSeries', a: a, b: b};
	});
var $author$project$Page$Tournament$InputBracketName = F2(
	function (a, b) {
		return {$: 'InputBracketName', a: a, b: b};
	});
var $author$project$Page$Tournament$InputBracketWinCon = F2(
	function (a, b) {
		return {$: 'InputBracketWinCon', a: a, b: b};
	});
var $author$project$Page$Tournament$RemoveBracket = function (a) {
	return {$: 'RemoveBracket', a: a};
};
var $elm$html$Html$Attributes$step = function (n) {
	return A2($elm$html$Html$Attributes$stringProperty, 'step', n);
};
var $author$project$Page$Tournament$viewBracketEdit = function (form) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('list-item')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('text'),
						$elm$html$Html$Attributes$placeholder('Nome'),
						$elm$html$Html$Attributes$class('border-none rounded-sm p-1 bg-gray-100 text-gray-400 placeholder-gray-400 w-1/12'),
						$elm$html$Html$Events$onInput(
						$author$project$Page$Tournament$InputBracketName(form.sequence))
					]),
				_List_Nil),
				A2(
				$elm$html$Html$select,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$placeholder('Condição de vitória'),
						$elm$html$Html$Attributes$class('border-none rounded-sm p-1 bg-gray-100 text-gray-400 w-2/12'),
						$elm$html$Html$Events$onInput(
						$author$project$Page$Tournament$InputBracketWinCon(form.sequence))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$option,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value('First')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Primeiro de cada Série')
							])),
						A2(
						$elm$html$Html$option,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value('FirstAndSecond')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Primeiro e Segundo de cada Série')
							])),
						A2(
						$elm$html$Html$option,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value('TopX')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Top X Jogadores')
							])),
						A2(
						$elm$html$Html$option,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value('None')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Chave Final')
							]))
					])),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('number'),
						$elm$html$Html$Attributes$placeholder('Número de Jogadores a Avançar'),
						$elm$html$Html$Attributes$min('4'),
						$elm$html$Html$Attributes$step('4'),
						$elm$html$Html$Attributes$class('border-none rounded-sm p-1 bg-gray-100 text-gray-400 placeholder-gray-400 w-2/12'),
						$elm$html$Html$Events$onInput(
						$author$project$Page$Tournament$InputBracketNAdv(form.sequence))
					]),
				_List_Nil),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('number'),
						$elm$html$Html$Attributes$placeholder('Número de Séries'),
						$elm$html$Html$Attributes$min('1'),
						$elm$html$Html$Attributes$step('1'),
						$elm$html$Html$Attributes$class('border-none rounded-sm p-1 bg-gray-100 text-gray-400 placeholder-gray-400 w-2/12'),
						$elm$html$Html$Events$onInput(
						$author$project$Page$Tournament$InputBracketNSeries(form.sequence))
					]),
				_List_Nil),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('number'),
						$elm$html$Html$Attributes$placeholder('Número de Jogos por Série'),
						$elm$html$Html$Attributes$min('1'),
						$elm$html$Html$Attributes$step('1'),
						$elm$html$Html$Attributes$class('border-none rounded-sm p-1 bg-gray-100 text-gray-400 placeholder-gray-400 w-2/12'),
						$elm$html$Html$Events$onInput(
						$author$project$Page$Tournament$InputBracketNGames(form.sequence))
					]),
				_List_Nil),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('number'),
						$elm$html$Html$Attributes$placeholder('Multiplicador de Pontuação'),
						$elm$html$Html$Attributes$min('0'),
						$elm$html$Html$Attributes$step('0.1'),
						$elm$html$Html$Attributes$class('border-none rounded-sm p-1 bg-gray-100 text-gray-400 placeholder-gray-400 w-2/12'),
						$elm$html$Html$Events$onInput(
						$author$project$Page$Tournament$InputBracketMul(form.sequence))
					]),
				_List_Nil),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('border px-3 inline-btn btn-indigo-500'),
						$elm$html$Html$Events$onClick(
						$author$project$Page$Tournament$RemoveBracket(form.sequence))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('X')
					]))
			]));
};
var $author$project$Page$Tournament$viewBracketsEdit = function (form) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('m-2')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('list-heading')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Chaves')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex space-x-4 px-5')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('font-bold w-1/12')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Nome')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('font-bold w-2/12')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Condição de Vitória')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('font-bold w-2/12')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Número de Jogadores a Avançar')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('font-bold w-2/12')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Número de Séries')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('font-bold w-2/12')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Número de Jogos por Série')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('font-bold w-2/12')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Multiplicador de Pontuação')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('space-y-4')
					]),
				A2($elm$core$List$map, $author$project$Page$Tournament$viewBracketEdit, form.brackets)),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('border-transparent btn btn-indigo-500 mt-4'),
						$elm$html$Html$Events$onClick($author$project$Page$Tournament$AddBracket)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Nova Chave')
					]))
			]));
};
var $author$project$Page$Tournament$RemovePlayer = function (a) {
	return {$: 'RemovePlayer', a: a};
};
var $author$project$Model$TournamentPlayer$view = F3(
	function (player, isOwner, remove) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('list-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(
							$author$project$UserShort$getUrlId(player.userId)),
							$elm$html$Html$Attributes$class('py-2 hover:underline')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(player.username)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('py-2')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(player.status)
						])),
					isOwner ? A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('p-2 inline-btn btn-red-500'),
							$elm$html$Html$Events$onClick(remove)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Remover')
						])) : $elm$html$Html$text('')
				]));
	});
var $author$project$Page$Tournament$viewPlayers = F2(
	function (tournament, isOwner) {
		if (tournament.status !== 'Agendado') {
			return $elm$html$Html$text('');
		} else {
			var transform = function (p) {
				return A3(
					$author$project$Model$TournamentPlayer$view,
					p,
					isOwner,
					$author$project$Page$Tournament$RemovePlayer(p));
			};
			var filter = isOwner ? function (_v0) {
				return true;
			} : function (m) {
				return m.status === 'Confirmado';
			};
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('m-2')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('list-heading')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Jogadores')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('space-y-4')
							]),
						A2(
							$elm$core$List$map,
							transform,
							A2($elm$core$List$filter, filter, tournament.players)))
					]));
		}
	});
var $author$project$Page$Tournament$DeleteTournament = {$: 'DeleteTournament'};
var $author$project$Page$Tournament$EditTournament = {$: 'EditTournament'};
var $author$project$Page$Tournament$InitTournament = {$: 'InitTournament'};
var $author$project$Page$Tournament$JoinTournament = {$: 'JoinTournament'};
var $author$project$Page$Tournament$LeaveTournament = {$: 'LeaveTournament'};
var $author$project$CommonHtml$cardElement = F2(
	function (title, value) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('block')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$strong,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('inline-block font-bold')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('inline-block pl-2')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(value)
						]))
				]));
	});
var $author$project$Model$Ruleset$getUrl = F2(
	function (clubId, ruleset) {
		return A2(
			$elm$url$Url$Builder$absolute,
			_List_fromArray(
				[
					'clubs',
					$elm$core$String$fromInt(clubId),
					'rulesets',
					$elm$core$String$fromInt(ruleset.id)
				]),
			_List_Nil);
	});
var $author$project$Page$Tournament$viewTournamentCard = F2(
	function (tournament, _switch) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('font-bold text-xl')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(tournament.name)
						])),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(tournament.description)
						])),
					A2($author$project$CommonHtml$cardElement, 'Data de Inicio', tournament.startDate),
					tournament.allowNonMembers ? A2($author$project$CommonHtml$cardElement, 'Participação', 'Qualquer usuário poderá participar') : A2($author$project$CommonHtml$cardElement, 'Participação', 'Somente membros do clube poderão participar'),
					tournament.requirePermission ? A2($author$project$CommonHtml$cardElement, 'Permissão', 'Será necessária a confirmação pelo dono do clube para a participação no torneio') : A2($author$project$CommonHtml$cardElement, 'Permissão', 'Não é necessário nenhum tipo de permissão para participar'),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(
							A2($author$project$Model$Ruleset$getUrl, tournament.clubId, tournament.ruleset)),
							$elm$html$Html$Attributes$class('hover:underline')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Regras - ' + tournament.ruleset.name)
						])),
					A2($author$project$CommonHtml$cardElement, 'Status', tournament.status),
					(tournament.playerStatus !== '') ? A2($author$project$CommonHtml$cardElement, 'Status do Jogador', tournament.playerStatus) : $elm$html$Html$text(''),
					function () {
					if (tournament.status !== 'Agendado') {
						return $elm$html$Html$text('');
					} else {
						switch (_switch.$) {
							case 'Anonymus':
								return $elm$html$Html$text('');
							case 'Owner':
								var isParticipant = _switch.a;
								return A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('btn btn-indigo-500 mt-4'),
													$elm$html$Html$Events$onClick($author$project$Page$Tournament$EditTournament)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Editar')
												])),
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('border-none btn btn-green-500 mt-4'),
													$elm$html$Html$Events$onClick($author$project$Page$Tournament$InitTournament)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Iniciar')
												])),
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('border-none btn btn-red-500 mt-4'),
													$elm$html$Html$Events$onClick($author$project$Page$Tournament$DeleteTournament)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Excluir')
												])),
											isParticipant ? A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('border-none btn btn-red-500 mt-4'),
													$elm$html$Html$Events$onClick($author$project$Page$Tournament$LeaveTournament)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Sair')
												])) : A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('btn btn-indigo-500 mt-4'),
													$elm$html$Html$Events$onClick($author$project$Page$Tournament$JoinTournament)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Participar')
												]))
										]));
							case 'Participant':
								return A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('border-none btn btn-red-500 mt-4'),
											$elm$html$Html$Events$onClick($author$project$Page$Tournament$LeaveTournament)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Sair')
										]));
							default:
								return A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-indigo-500 mt-4'),
											$elm$html$Html$Events$onClick($author$project$Page$Tournament$JoinTournament)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Participar')
										]));
						}
					}
				}()
				]));
	});
var $author$project$Page$Tournament$CancelEdit = {$: 'CancelEdit'};
var $author$project$Page$Tournament$CancelNew = {$: 'CancelNew'};
var $author$project$Page$Tournament$ConfirmEdit = {$: 'ConfirmEdit'};
var $author$project$Page$Tournament$ConfirmNew = {$: 'ConfirmNew'};
var $author$project$Page$Tournament$InputAllow = function (a) {
	return {$: 'InputAllow', a: a};
};
var $author$project$Page$Tournament$InputDescription = function (a) {
	return {$: 'InputDescription', a: a};
};
var $author$project$Page$Tournament$InputName = function (a) {
	return {$: 'InputName', a: a};
};
var $author$project$Page$Tournament$InputPermission = function (a) {
	return {$: 'InputPermission', a: a};
};
var $author$project$Page$Tournament$InputRuleset = function (a) {
	return {$: 'InputRuleset', a: a};
};
var $author$project$Page$Tournament$InputStartDate = function (a) {
	return {$: 'InputStartDate', a: a};
};
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $author$project$Page$Tournament$viewRuleset = function (ruleset) {
	return A2(
		$elm$html$Html$option,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$value(ruleset.name)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(ruleset.name)
			]));
};
var $author$project$Page$Tournament$viewTournamentEditCard = F2(
	function (model, isNew) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg space-y-4')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Preencha os campos que deseja atualizar e pressione confirmar')
						])),
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('text'),
							$elm$html$Html$Attributes$placeholder('Nome'),
							$elm$html$Html$Attributes$class('login-input'),
							$elm$html$Html$Events$onInput($author$project$Page$Tournament$InputName)
						]),
					_List_Nil),
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('text'),
							$elm$html$Html$Attributes$placeholder('Descrição'),
							$elm$html$Html$Attributes$class('login-input'),
							$elm$html$Html$Events$onInput($author$project$Page$Tournament$InputDescription)
						]),
					_List_Nil),
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('date'),
							$elm$html$Html$Attributes$placeholder('Data de Início'),
							$elm$html$Html$Attributes$class('login-input'),
							$elm$html$Html$Events$onInput($author$project$Page$Tournament$InputStartDate)
						]),
					_List_Nil),
					A2(
					$elm$html$Html$select,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('login-input'),
							$elm$html$Html$Events$onInput($author$project$Page$Tournament$InputRuleset)
						]),
					A2($elm$core$List$map, $author$project$Page$Tournament$viewRuleset, model.rulesets)),
					A2($elm$html$Html$br, _List_Nil, _List_Nil),
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('checkbox'),
							$elm$html$Html$Events$onCheck($author$project$Page$Tournament$InputAllow)
						]),
					_List_Nil),
					A2(
					$elm$html$Html$label,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Permitir a participação de não integrantes do clube?')
						])),
					A2($elm$html$Html$br, _List_Nil, _List_Nil),
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('checkbox'),
							$elm$html$Html$Events$onCheck($author$project$Page$Tournament$InputPermission)
						]),
					_List_Nil),
					A2(
					$elm$html$Html$label,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Exigir permissão para participar?')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('border-none btn btn-green-500'),
							$elm$html$Html$Events$onClick(
							isNew ? $author$project$Page$Tournament$ConfirmNew : $author$project$Page$Tournament$ConfirmEdit)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Confirmar')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('border-none btn btn-red-500'),
							$elm$html$Html$Events$onClick(
							isNew ? $author$project$Page$Tournament$CancelNew : $author$project$Page$Tournament$CancelEdit)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Cancelar')
						]))
				]));
	});
var $author$project$Page$Tournament$viewTournament = function (model) {
	var _v0 = model.state;
	switch (_v0.$) {
		case 'Uninitialized':
			return A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Carregando...')
					]));
		case 'View':
			var _switch = _v0.a;
			var tournament = _v0.b;
			var isOwner = function () {
				if (_switch.$ === 'Owner') {
					return true;
				} else {
					return false;
				}
			}();
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2($author$project$Page$Tournament$viewTournamentCard, tournament, _switch),
						A2($author$project$Page$Tournament$viewPlayers, tournament, isOwner),
						$author$project$Page$Tournament$viewBrackets(tournament)
					]));
		case 'Edit':
			var form = _v0.b;
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2($author$project$Page$Tournament$viewTournamentEditCard, model, false),
						$author$project$Page$Tournament$viewBracketsEdit(form)
					]));
		default:
			var form = _v0.a;
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2($author$project$Page$Tournament$viewTournamentEditCard, model, true),
						$author$project$Page$Tournament$viewBracketsEdit(form)
					]));
	}
};
var $author$project$Page$Tournament$view = function (model) {
	return {
		body: _List_fromArray(
			[
				$author$project$CommonHtml$viewNav(model.session),
				function () {
				var _v0 = model.error;
				if (_v0.$ === 'Just') {
					var error = _v0.a;
					return $author$project$CommonHtml$errorCard(error);
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				$author$project$Page$Tournament$viewTournament(model)
			]),
		title: $author$project$Page$Tournament$stateToTitle(model)
	};
};
var $author$project$Page$Tournaments$view = function (model) {
	return {
		body: _List_fromArray(
			[
				$author$project$CommonHtml$viewNav(model.session),
				function () {
				var _v0 = model.error;
				if (_v0.$ === 'Just') {
					var error = _v0.a;
					return $author$project$CommonHtml$errorCard(error);
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('m-2')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('list-heading')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Torneios')
							])),
						$elm$core$List$isEmpty(model.tournaments) ? A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Nada ainda')
							])) : A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('space-y-4')
							]),
						A2($elm$core$List$map, $author$project$Model$TournamentShort$view, model.tournaments))
					]))
			]),
		title: 'Torneios'
	};
};
var $author$project$Page$User$isOwnProfile = F2(
	function (maybeUser, maybeViewer) {
		if (maybeViewer.$ === 'Nothing') {
			return false;
		} else {
			var viewer = maybeViewer.a;
			if (maybeUser.$ === 'Nothing') {
				return false;
			} else {
				var user = maybeUser.a;
				return _Utils_eq(user.username, viewer.username);
			}
		}
	});
var $author$project$Page$User$stateToUser = function (state) {
	switch (state.$) {
		case 'Uninitialized':
			return $elm$core$Maybe$Nothing;
		case 'ViewAnonymus':
			var user = state.a;
			return $elm$core$Maybe$Just(user);
		case 'ViewProfile':
			var user = state.a;
			return $elm$core$Maybe$Just(user);
		default:
			var user = state.a;
			return $elm$core$Maybe$Just(user);
	}
};
var $author$project$Model$Membership$view = function (membership) {
	var club = membership.club;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('list-item')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(
						$author$project$ClubShort$getUrl(club)),
						$elm$html$Html$Attributes$class('flex-grow hover:underline')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(club.name)
					])),
				membership.approved ? A2($elm$html$Html$span, _List_Nil, _List_Nil) : (membership.denied ? A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('font-bold')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Negada')
					])) : A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Pendente')
					]))),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(club.localization)
					])),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(club.totalTournaments) + ' Torneios')
					])),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(club.totalPlayers) + ' Jogadores')
					])),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(club.createdAt)
					]))
			]));
};
var $author$project$Page$User$viewMemberships = function (maybeUser) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('m-2')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('list-heading')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Filiações')
					])),
				function () {
				if (maybeUser.$ === 'Nothing') {
					return A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Nada ainda')
							]));
				} else {
					var user = maybeUser.a;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('space-y-4')
							]),
						A2($elm$core$List$map, $author$project$Model$Membership$view, user.memberships));
				}
			}()
			]));
};
var $author$project$Page$User$NotificationAction = function (a) {
	return {$: 'NotificationAction', a: a};
};
var $author$project$Api$confirmNotification = function (notificationId) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				$author$project$Api$users,
				'/notifications/',
				$elm$core$String$fromInt(notificationId),
				'/confirm'
			]));
};
var $author$project$Model$Notification$getConfirmUrl = function (notification) {
	return $author$project$Api$confirmNotification(notification.id);
};
var $author$project$Api$denyNotification = function (notificationId) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				$author$project$Api$users,
				'/notifications/',
				$elm$core$String$fromInt(notificationId),
				'/deny'
			]));
};
var $author$project$Model$Notification$getDenyUrl = function (notification) {
	return $author$project$Api$denyNotification(notification.id);
};
var $author$project$Model$Notification$view = F3(
	function (notification, confirm, deny) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('list-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(
							$author$project$UserShort$getUrl(notification.creator)),
							$elm$html$Html$Attributes$class('py-2 hover:underline')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(notification.creator.username)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('py-2')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(notification.message)
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('p-2 inline-btn btn-green-500'),
							$elm$html$Html$Events$onClick(confirm)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Confirmar')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('p-2 inline-btn btn-red-500'),
							$elm$html$Html$Events$onClick(deny)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Recusar')
						]))
				]));
	});
var $author$project$Page$User$viewNotifications = function (maybeUser) {
	var transform = function (n) {
		return A3(
			$author$project$Model$Notification$view,
			n,
			$author$project$Page$User$NotificationAction(
				$author$project$Model$Notification$getConfirmUrl(n)),
			$author$project$Page$User$NotificationAction(
				$author$project$Model$Notification$getDenyUrl(n)));
	};
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('m-2')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('list-heading')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Notificações')
					])),
				function () {
				if (maybeUser.$ === 'Nothing') {
					return A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Nada ainda')
							]));
				} else {
					var user = maybeUser.a;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('space-y-4')
							]),
						A2($elm$core$List$map, transform, user.notifications));
				}
			}()
			]));
};
var $author$project$Page$User$NewClub = {$: 'NewClub'};
var $author$project$Page$User$viewOwnedClubs = F2(
	function (maybeUser, maybeViewer) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('m-2')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('list-heading')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Clubes do Usuário')
						])),
					function () {
					if (maybeUser.$ === 'Nothing') {
						return A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Nada ainda')
								]));
					} else {
						var user = maybeUser.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('space-y-4')
								]),
							A2($elm$core$List$map, $author$project$ClubShort$view, user.ownedClubs));
					}
				}(),
					A2($author$project$Page$User$isOwnProfile, maybeUser, maybeViewer) ? A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('border-transparent btn btn-indigo-500 mt-4'),
							$elm$html$Html$Events$onClick($author$project$Page$User$NewClub)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Novo')
						])) : A2($elm$html$Html$div, _List_Nil, _List_Nil)
				]));
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $myrho$elm_round$Round$addSign = F2(
	function (signed, str) {
		var isNotZero = A2(
			$elm$core$List$any,
			function (c) {
				return (!_Utils_eq(
					c,
					_Utils_chr('0'))) && (!_Utils_eq(
					c,
					_Utils_chr('.')));
			},
			$elm$core$String$toList(str));
		return _Utils_ap(
			(signed && isNotZero) ? '-' : '',
			str);
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$Char$fromCode = _Char_fromCode;
var $myrho$elm_round$Round$increaseNum = function (_v0) {
	var head = _v0.a;
	var tail = _v0.b;
	if (_Utils_eq(
		head,
		_Utils_chr('9'))) {
		var _v1 = $elm$core$String$uncons(tail);
		if (_v1.$ === 'Nothing') {
			return '01';
		} else {
			var headtail = _v1.a;
			return A2(
				$elm$core$String$cons,
				_Utils_chr('0'),
				$myrho$elm_round$Round$increaseNum(headtail));
		}
	} else {
		var c = $elm$core$Char$toCode(head);
		return ((c >= 48) && (c < 57)) ? A2(
			$elm$core$String$cons,
			$elm$core$Char$fromCode(c + 1),
			tail) : '0';
	}
};
var $elm$core$Basics$isInfinite = _Basics_isInfinite;
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)));
	});
var $elm$core$String$reverse = _String_reverse;
var $myrho$elm_round$Round$splitComma = function (str) {
	var _v0 = A2($elm$core$String$split, '.', str);
	if (_v0.b) {
		if (_v0.b.b) {
			var before = _v0.a;
			var _v1 = _v0.b;
			var after = _v1.a;
			return _Utils_Tuple2(before, after);
		} else {
			var before = _v0.a;
			return _Utils_Tuple2(before, '0');
		}
	} else {
		return _Utils_Tuple2('0', '0');
	}
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $myrho$elm_round$Round$toDecimal = function (fl) {
	var _v0 = A2(
		$elm$core$String$split,
		'e',
		$elm$core$String$fromFloat(
			$elm$core$Basics$abs(fl)));
	if (_v0.b) {
		if (_v0.b.b) {
			var num = _v0.a;
			var _v1 = _v0.b;
			var exp = _v1.a;
			var e = A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(
					A2($elm$core$String$startsWith, '+', exp) ? A2($elm$core$String$dropLeft, 1, exp) : exp));
			var _v2 = $myrho$elm_round$Round$splitComma(num);
			var before = _v2.a;
			var after = _v2.b;
			var total = _Utils_ap(before, after);
			var zeroed = (e < 0) ? A2(
				$elm$core$Maybe$withDefault,
				'0',
				A2(
					$elm$core$Maybe$map,
					function (_v3) {
						var a = _v3.a;
						var b = _v3.b;
						return a + ('.' + b);
					},
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$mapFirst($elm$core$String$fromChar),
						$elm$core$String$uncons(
							_Utils_ap(
								A2(
									$elm$core$String$repeat,
									$elm$core$Basics$abs(e),
									'0'),
								total))))) : A3(
				$elm$core$String$padRight,
				e + 1,
				_Utils_chr('0'),
				total);
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				zeroed);
		} else {
			var num = _v0.a;
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				num);
		}
	} else {
		return '';
	}
};
var $myrho$elm_round$Round$roundFun = F3(
	function (functor, s, fl) {
		if ($elm$core$Basics$isInfinite(fl) || $elm$core$Basics$isNaN(fl)) {
			return $elm$core$String$fromFloat(fl);
		} else {
			var signed = fl < 0;
			var _v0 = $myrho$elm_round$Round$splitComma(
				$myrho$elm_round$Round$toDecimal(
					$elm$core$Basics$abs(fl)));
			var before = _v0.a;
			var after = _v0.b;
			var r = $elm$core$String$length(before) + s;
			var normalized = _Utils_ap(
				A2($elm$core$String$repeat, (-r) + 1, '0'),
				A3(
					$elm$core$String$padRight,
					r,
					_Utils_chr('0'),
					_Utils_ap(before, after)));
			var totalLen = $elm$core$String$length(normalized);
			var roundDigitIndex = A2($elm$core$Basics$max, 1, r);
			var increase = A2(
				functor,
				signed,
				A3($elm$core$String$slice, roundDigitIndex, totalLen, normalized));
			var remains = A3($elm$core$String$slice, 0, roundDigitIndex, normalized);
			var num = increase ? $elm$core$String$reverse(
				A2(
					$elm$core$Maybe$withDefault,
					'1',
					A2(
						$elm$core$Maybe$map,
						$myrho$elm_round$Round$increaseNum,
						$elm$core$String$uncons(
							$elm$core$String$reverse(remains))))) : remains;
			var numLen = $elm$core$String$length(num);
			var numZeroed = (num === '0') ? num : ((s <= 0) ? _Utils_ap(
				num,
				A2(
					$elm$core$String$repeat,
					$elm$core$Basics$abs(s),
					'0')) : ((_Utils_cmp(
				s,
				$elm$core$String$length(after)) < 0) ? (A3($elm$core$String$slice, 0, numLen - s, num) + ('.' + A3($elm$core$String$slice, numLen - s, numLen, num))) : _Utils_ap(
				before + '.',
				A3(
					$elm$core$String$padRight,
					s,
					_Utils_chr('0'),
					after))));
			return A2($myrho$elm_round$Round$addSign, signed, numZeroed);
		}
	});
var $myrho$elm_round$Round$round = $myrho$elm_round$Round$roundFun(
	F2(
		function (signed, str) {
			var _v0 = $elm$core$String$uncons(str);
			if (_v0.$ === 'Nothing') {
				return false;
			} else {
				if ('5' === _v0.a.a.valueOf()) {
					if (_v0.a.b === '') {
						var _v1 = _v0.a;
						return !signed;
					} else {
						var _v2 = _v0.a;
						return true;
					}
				} else {
					var _v3 = _v0.a;
					var _int = _v3.a;
					return function (i) {
						return ((i > 53) && signed) || ((i >= 53) && (!signed));
					}(
						$elm$core$Char$toCode(_int));
				}
			}
		}));
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $author$project$Model$Stats$view = function (stats) {
	var headClass = 'text-right border-r-8 border-transparent font-bold';
	var formatRatio = function (ratio) {
		return A2($myrho$elm_round$Round$round, 2, ratio) + '%';
	};
	var dataClass = 'text-right border-r-8 border-transparent font-normal';
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card bg-indigo-500 text-white')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$table,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('table-fixed border-separate')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$th,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(headClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Número de Jogos')
									])),
								A2(
								$elm$html$Html$th,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(dataClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(stats.totalGames))
									])),
								A2(
								$elm$html$Html$th,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(headClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Taxa de 1º')
									])),
								A2(
								$elm$html$Html$th,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(dataClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										formatRatio(stats.firstRate))
									])),
								A2(
								$elm$html$Html$th,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(headClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Taxa de Vitória')
									])),
								A2(
								$elm$html$Html$th,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(dataClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										formatRatio(stats.winRate))
									]))
							])),
						A2(
						$elm$html$Html$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(headClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Número de Rounds')
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(dataClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(stats.totalRounds))
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(headClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Taxa de 2º')
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(dataClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										formatRatio(stats.secondRate))
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(headClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Taxa de Tsumo')
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(dataClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										formatRatio(stats.tsumoRate))
									]))
							])),
						A2(
						$elm$html$Html$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2($elm$html$Html$td, _List_Nil, _List_Nil),
								A2($elm$html$Html$td, _List_Nil, _List_Nil),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(headClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Taxa de 3º')
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(dataClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										formatRatio(stats.thirdRate))
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(headClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Taxa de Chamada')
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(dataClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										formatRatio(stats.callRate))
									]))
							])),
						A2(
						$elm$html$Html$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2($elm$html$Html$td, _List_Nil, _List_Nil),
								A2($elm$html$Html$td, _List_Nil, _List_Nil),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(headClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Taxa de 4º')
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(dataClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										formatRatio(stats.fourthRate))
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(headClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Taxa de Riichi')
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(dataClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										formatRatio(stats.riichiRate))
									]))
							])),
						A2(
						$elm$html$Html$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2($elm$html$Html$td, _List_Nil, _List_Nil),
								A2($elm$html$Html$td, _List_Nil, _List_Nil),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(headClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Taxa de Falência')
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(dataClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										formatRatio(stats.bustingRate))
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(headClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Taxa de Deal In')
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(dataClass)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										formatRatio(stats.dealInRate))
									]))
							]))
					]))
			]));
};
var $author$project$Page$User$viewStats = function (maybeUser) {
	if (maybeUser.$ === 'Nothing') {
		return A2($elm$html$Html$div, _List_Nil, _List_Nil);
	} else {
		var user = maybeUser.a;
		return $author$project$Model$Stats$view(user.stats);
	}
};
var $author$project$Page$User$viewTournaments = function (maybeUser) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('m-2')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('list-heading')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Torneios')
					])),
				function () {
				if (maybeUser.$ === 'Nothing') {
					return A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Nada ainda')
							]));
				} else {
					var user = maybeUser.a;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('space-y-4')
							]),
						A2($elm$core$List$map, $author$project$Model$TournamentShort$view, user.tournaments));
				}
			}()
			]));
};
var $author$project$Page$User$CancelEdit = {$: 'CancelEdit'};
var $author$project$Page$User$ConfirmEdit = {$: 'ConfirmEdit'};
var $author$project$Page$User$EditUser = {$: 'EditUser'};
var $author$project$Page$User$InputEmail = function (a) {
	return {$: 'InputEmail', a: a};
};
var $author$project$Page$User$InputPassword = function (a) {
	return {$: 'InputPassword', a: a};
};
var $author$project$Page$User$InputPasswordAgain = function (a) {
	return {$: 'InputPasswordAgain', a: a};
};
var $author$project$Page$User$InputUsername = function (a) {
	return {$: 'InputUsername', a: a};
};
var $author$project$Page$User$userCardElement = F2(
	function (title, value) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('block')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$strong,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('inline-block font-bold space-x-2')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('inline-block pl-2')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(value)
						]))
				]));
	});
var $author$project$Page$User$viewUserCard = function (state) {
	var divClass = 'container bg-indigo-500 rounded-lg text-white p-6 my-4 max-w-lg';
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				function () {
				switch (state.$) {
					case 'Uninitialized':
						return A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Carregando...')
								]));
					case 'ViewAnonymus':
						var user = state.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(divClass)
								]),
							_List_fromArray(
								[
									A2($author$project$Page$User$userCardElement, 'Usuário', user.username),
									A2($author$project$Page$User$userCardElement, 'Email', user.email)
								]));
					case 'ViewProfile':
						var user = state.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(divClass)
								]),
							_List_fromArray(
								[
									A2($author$project$Page$User$userCardElement, 'Usuário', user.username),
									A2($author$project$Page$User$userCardElement, 'Email', user.email),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-indigo-500 mt-4'),
											$elm$html$Html$Events$onClick($author$project$Page$User$EditUser)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Editar')
										]))
								]));
					default:
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(divClass + ' space-y-4')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Preencha os campos que deseja atualizar e pressione confirmar')
										])),
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('email'),
											$elm$html$Html$Attributes$placeholder('Email'),
											$elm$html$Html$Attributes$class('login-input'),
											$elm$html$Html$Events$onInput($author$project$Page$User$InputEmail)
										]),
									_List_Nil),
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('text'),
											$elm$html$Html$Attributes$placeholder('Nome de Usuário'),
											$elm$html$Html$Attributes$class('login-input'),
											$elm$html$Html$Events$onInput($author$project$Page$User$InputUsername)
										]),
									_List_Nil),
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('password'),
											$elm$html$Html$Attributes$placeholder('Senha'),
											$elm$html$Html$Attributes$class('login-input'),
											$elm$html$Html$Events$onInput($author$project$Page$User$InputPassword)
										]),
									_List_Nil),
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('password'),
											$elm$html$Html$Attributes$placeholder('Confirmação da Senha'),
											$elm$html$Html$Attributes$class('login-input'),
											$elm$html$Html$Events$onInput($author$project$Page$User$InputPasswordAgain)
										]),
									_List_Nil),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('border-none btn btn-green-500'),
											$elm$html$Html$Events$onClick($author$project$Page$User$ConfirmEdit)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Confirmar')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('border-none btn btn-red-500'),
											$elm$html$Html$Events$onClick($author$project$Page$User$CancelEdit)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Cancelar')
										]))
								]));
				}
			}()
			]));
};
var $author$project$Page$User$view = function (model) {
	var maybeViewer = $author$project$Session$toViewer(model.session);
	var maybeUser = $author$project$Page$User$stateToUser(model.state);
	return {
		body: _List_fromArray(
			[
				$author$project$CommonHtml$viewNav(model.session),
				function () {
				var _v0 = model.error;
				if (_v0.$ === 'Just') {
					var error = _v0.a;
					return $author$project$CommonHtml$errorCard(error);
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				$author$project$Page$User$viewUserCard(model.state),
				A2($author$project$Page$User$viewOwnedClubs, maybeUser, maybeViewer),
				$author$project$Page$User$viewMemberships(maybeUser),
				$author$project$Page$User$viewTournaments(maybeUser),
				A2($author$project$Page$User$isOwnProfile, maybeUser, maybeViewer) ? $author$project$Page$User$viewNotifications(maybeUser) : A2($elm$html$Html$div, _List_Nil, _List_Nil),
				$author$project$Page$User$viewStats(maybeUser)
			]),
		title: function () {
			if (maybeUser.$ === 'Just') {
				var user = maybeUser.a;
				return 'Usuário - ' + user.username;
			} else {
				return 'Usuário';
			}
		}()
	};
};
var $author$project$Main$viewWelcomeCard = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('card card-indigo-900')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card-heading')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Bem Vindo à Riichi Gang')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Introdução completa as ser elaborada posteriormente')
				]))
		]));
var $author$project$Main$viewHome = function (session) {
	return {
		body: _List_fromArray(
			[
				$author$project$CommonHtml$viewNav(session),
				$author$project$Main$viewWelcomeCard
			]),
		title: 'Riichi Gang'
	};
};
var $author$project$Main$viewNotFound = function (session) {
	return {
		body: _List_fromArray(
			[
				$author$project$CommonHtml$viewNav(session),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Not Found')
					]))
			]),
		title: 'Não Encontrado'
	};
};
var $author$project$Main$view = function (model) {
	switch (model.$) {
		case 'Home':
			var session = model.a;
			return $author$project$Main$viewHome(session);
		case 'NotFound':
			var session = model.a;
			return $author$project$Main$viewNotFound(session);
		case 'Login':
			var subModel = model.a;
			var page = $author$project$Page$Login$view(subModel);
			return {
				body: A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$GotLoginMsg),
					page.body),
				title: page.title
			};
		case 'SignUp':
			var subModel = model.a;
			var page = $author$project$Page$SignUp$view(subModel);
			return {
				body: A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$GotSignUpMsg),
					page.body),
				title: page.title
			};
		case 'Clubs':
			var subModel = model.a;
			var page = $author$project$Page$Clubs$view(subModel);
			return {
				body: A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$GotClubsMsg),
					page.body),
				title: page.title
			};
		case 'NewClub':
			var subModel = model.a;
			var page = $author$project$Page$Club$view(subModel);
			return {
				body: A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$GotNewClubMsg),
					page.body),
				title: page.title
			};
		case 'Club':
			var subModel = model.a;
			var page = $author$project$Page$Club$view(subModel);
			return {
				body: A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$GotClubMsg),
					page.body),
				title: page.title
			};
		case 'Ruleset':
			var subModel = model.a;
			var page = $author$project$Page$Ruleset$view(subModel);
			return {
				body: A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$GotRulesetMsg),
					page.body),
				title: page.title
			};
		case 'Tournaments':
			var subModel = model.a;
			var page = $author$project$Page$Tournaments$view(subModel);
			return {
				body: A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$GotTournamentsMsg),
					page.body),
				title: page.title
			};
		case 'NewTournament':
			var subModel = model.a;
			var page = $author$project$Page$Tournament$view(subModel);
			return {
				body: A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$GotNewTournamentMsg),
					page.body),
				title: page.title
			};
		case 'Tournament':
			var subModel = model.a;
			var page = $author$project$Page$Tournament$view(subModel);
			return {
				body: A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$GotTournamentMsg),
					page.body),
				title: page.title
			};
		case 'Bracket':
			var subModel = model.a;
			var page = $author$project$Page$Bracket$view(subModel);
			return {
				body: A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$GotBracketMsg),
					page.body),
				title: page.title
			};
		default:
			var subModel = model.a;
			var page = $author$project$Page$User$view(subModel);
			return {
				body: A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$GotUserMsg),
					page.body),
				title: page.title
			};
	}
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{init: $author$project$Main$init, onUrlChange: $author$project$Main$UrlChanged, onUrlRequest: $author$project$Main$LinkClicked, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))({"versions":{"elm":"0.19.1"},"types":{"message":"Main.Msg","aliases":{"Url.Url":{"args":[],"type":"{ protocol : Url.Protocol, host : String.String, port_ : Maybe.Maybe Basics.Int, path : String.String, query : Maybe.Maybe String.String, fragment : Maybe.Maybe String.String }"},"Model.Bracket.Bracket":{"args":[],"type":"{ id : Basics.Int, tournamentId : Basics.Int, ownerId : Basics.Int, name : String.String, createdAt : String.String, startedAt : String.String, finishedAt : String.String, sequence : Basics.Int, description : String.String, series : List.List Model.Series.Series }"},"Model.BracketPlayerShort.BracketPlayerShort":{"args":[],"type":"{ userId : Basics.Int, name : String.String, placement : Basics.Int, score : Basics.Float }"},"Model.BracketShort.BracketShort":{"args":[],"type":"{ id : Basics.Int, tournamentId : Basics.Int, sequence : Basics.Int, name : String.String, createdAt : String.String, startedAt : String.String, finishedAt : String.String, winCondition : String.String, numberOfAdvancing : Basics.Int, numberOfSeries : Basics.Int, gamesPerSeries : Basics.Int, finalScoreMultiplier : Basics.Float, players : List.List Model.BracketPlayerShort.BracketPlayerShort }"},"Club.Club":{"args":[],"type":"{ id : Basics.Int, createdAt : String.String, name : String.String, website : String.String, contact : String.String, localization : String.String, owner : UserShort.UserShort, members : List.List Model.ClubMembership.ClubMembership, tournaments : List.List Model.TournamentShort.TournamentShort }"},"Model.ClubMembership.ClubMembership":{"args":[],"type":"{ user : UserShort.UserShort, createdAt : String.String, approved : Basics.Bool, denied : Basics.Bool }"},"ClubShort.ClubShort":{"args":[],"type":"{ id : Basics.Int, createdAt : String.String, name : String.String, website : String.String, contact : String.String, localization : String.String, totalPlayers : Basics.Int, totalTournaments : Basics.Int }"},"Model.Game.Game":{"args":[],"type":"{ player1 : Model.Player.Player, player2 : Model.Player.Player, player3 : Model.Player.Player, player4 : Model.Player.Player, playedAt : String.String, logLink : String.String }"},"Model.Series.GameForm":{"args":[],"type":"{ logLink : String.String, player1Seat : String.String, player2Seat : String.String, player3Seat : String.String, player4Seat : String.String }"},"Model.Membership.Membership":{"args":[],"type":"{ club : ClubShort.ClubShort, createdAt : String.String, approved : Basics.Bool, denied : Basics.Bool }"},"Model.Notification.Notification":{"args":[],"type":"{ id : Basics.Int, createdAt : String.String, creator : UserShort.UserShort, message : String.String }"},"Model.Player.Player":{"args":[],"type":"{ seat : String.String, gameScore : Basics.Float, runningTotal : Basics.Float }"},"Model.Ruleset.Ruleset":{"args":[],"type":"{ id : Basics.Int, createdAt : String.String, name : String.String, mochiten : Basics.Int, genten : Basics.Int, uma : String.String, oka : Basics.Int, atozuke : String.String, kuitan : String.String, kuikae : String.String, uradora : String.String, kandora : String.String, kanuradora : String.String, akadora : String.String, agariyame : String.String, tenpaiyame : String.String, tobi : String.String }"},"Model.Series.Series":{"args":[],"type":"{ id : Basics.Int, player1Name : String.String, player2Name : String.String, player3Name : String.String, player4Name : String.String, playedAt : String.String, finishedAt : String.String, status : String.String, games : List.List Model.Game.Game, isFolded : Basics.Bool, gameForm : Maybe.Maybe Model.Series.GameForm }"},"Model.Stats.Stats":{"args":[],"type":"{ totalGames : Basics.Int, totalRounds : Basics.Int, firstRate : Basics.Float, secondRate : Basics.Float, thirdRate : Basics.Float, fourthRate : Basics.Float, bustingRate : Basics.Float, winRate : Basics.Float, tsumoRate : Basics.Float, callRate : Basics.Float, riichiRate : Basics.Float, dealInRate : Basics.Float }"},"Model.Tournament.Tournament":{"args":[],"type":"{ id : Basics.Int, clubId : Basics.Int, createdAt : String.String, ownerId : Basics.Int, name : String.String, description : String.String, startDate : String.String, status : String.String, allowNonMembers : Basics.Bool, requirePermission : Basics.Bool, playerStatus : String.String, ruleset : Model.Ruleset.Ruleset, players : List.List Model.TournamentPlayer.TournamentPlayer, brackets : List.List Model.BracketShort.BracketShort }"},"Model.TournamentPlayer.TournamentPlayer":{"args":[],"type":"{ userId : Basics.Int, username : String.String, status : String.String }"},"Model.TournamentShort.TournamentShort":{"args":[],"type":"{ id : Basics.Int, createdAt : String.String, name : String.String, totalPlayers : Basics.Int, startDate : String.String, status : String.String }"},"User.User":{"args":[],"type":"{ id : Basics.Int, createdAt : String.String, username : String.String, email : String.String, stats : Model.Stats.Stats, ownedClubs : List.List ClubShort.ClubShort, memberships : List.List Model.Membership.Membership, tournaments : List.List Model.TournamentShort.TournamentShort, notifications : List.List Model.Notification.Notification }"},"UserShort.UserShort":{"args":[],"type":"{ id : Basics.Int, createdAt : String.String, username : String.String, totalTournaments : Basics.Int }"},"Viewer.Viewer":{"args":[],"type":"{ id : Basics.Int, username : String.String, email : String.String, token : String.String }"}},"unions":{"Main.Msg":{"args":[],"tags":{"LinkClicked":["Browser.UrlRequest"],"UrlChanged":["Url.Url"],"GotLoginMsg":["Page.Login.Msg"],"GotSignUpMsg":["Page.SignUp.Msg"],"GotClubsMsg":["Page.Clubs.Msg"],"GotNewClubMsg":["Page.Club.Msg"],"GotClubMsg":["Page.Club.Msg"],"GotRulesetMsg":["Page.Ruleset.Msg"],"GotTournamentsMsg":["Page.Tournaments.Msg"],"GotNewTournamentMsg":["Page.Tournament.Msg"],"GotTournamentMsg":["Page.Tournament.Msg"],"GotBracketMsg":["Page.Bracket.Msg"],"GotUserMsg":["Page.User.Msg"]}},"Basics.Int":{"args":[],"tags":{"Int":[]}},"Maybe.Maybe":{"args":["a"],"tags":{"Just":["a"],"Nothing":[]}},"Page.Bracket.Msg":{"args":[],"tags":{"GotBracket":["Result.Result Api.ApiError Model.Bracket.Bracket"],"ToggleFold":["Model.Series.Series"],"AddGame":["Model.Series.Series"],"PostGame":["Model.Series.Series"],"CancelAddGame":["Model.Series.Series"],"InputPlayer1Seat":["Model.Series.Series","String.String"],"InputPlayer2Seat":["Model.Series.Series","String.String"],"InputPlayer3Seat":["Model.Series.Series","String.String"],"InputPlayer4Seat":["Model.Series.Series","String.String"],"InputLogLink":["Model.Series.Series","String.String"]}},"Page.Club.Msg":{"args":[],"tags":{"GotClub":["Result.Result Api.ApiError Club.Club"],"GotPostClub":["Result.Result Api.ApiError Club.Club"],"EditClub":[],"ConfirmEdit":[],"CancelEdit":[],"CancelNew":[],"ConfirmNew":[],"ConfirmDelete":[],"DeleteClub":["Result.Result Api.ApiError ()"],"AskInvite":[],"Leave":[],"RemoveMember":["Model.ClubMembership.ClubMembership"],"InputName":["String.String"],"InputWebsite":["String.String"],"InputContact":["String.String"],"InputLocalization":["String.String"],"NewTournament":[]}},"Page.Clubs.Msg":{"args":[],"tags":{"GotClubs":["Result.Result Api.ApiError (List.List ClubShort.ClubShort)"]}},"Page.Login.Msg":{"args":[],"tags":{"RequestLogin":[],"UserLogin":["Result.Result Api.ApiError Viewer.Viewer"],"InputEmail":["String.String"],"InputPassword":["String.String"]}},"Page.Ruleset.Msg":{"args":[],"tags":{"GotRuleset":["Result.Result Api.ApiError Model.Ruleset.Ruleset"]}},"Page.SignUp.Msg":{"args":[],"tags":{"RequestSignUp":[],"UserSignUp":["Result.Result Api.ApiError Viewer.Viewer"],"InputUsername":["String.String"],"InputEmail":["String.String"],"InputPassword":["String.String"],"InputPasswordAgain":["String.String"]}},"Page.Tournament.Msg":{"args":[],"tags":{"GotTournament":["Result.Result Api.ApiError Model.Tournament.Tournament"],"GotPostTournament":["Result.Result Api.ApiError Model.Tournament.Tournament"],"GotDelete":["Result.Result Api.ApiError ()"],"GotRulesets":["Result.Result Api.ApiError (List.List Model.Ruleset.Ruleset)"],"RemovePlayer":["Model.TournamentPlayer.TournamentPlayer"],"JoinTournament":[],"LeaveTournament":[],"InitTournament":[],"ConfirmNew":[],"CancelNew":[],"EditTournament":[],"ConfirmEdit":[],"CancelEdit":[],"DeleteTournament":[],"InputName":["String.String"],"InputDescription":["String.String"],"InputStartDate":["String.String"],"InputRuleset":["String.String"],"InputAllow":["Basics.Bool"],"InputPermission":["Basics.Bool"],"AddBracket":[],"RemoveBracket":["Basics.Int"],"InputBracketName":["Basics.Int","String.String"],"InputBracketWinCon":["Basics.Int","String.String"],"InputBracketNAdv":["Basics.Int","String.String"],"InputBracketNSeries":["Basics.Int","String.String"],"InputBracketNGames":["Basics.Int","String.String"],"InputBracketMul":["Basics.Int","String.String"]}},"Page.Tournaments.Msg":{"args":[],"tags":{"GotTournaments":["Result.Result Api.ApiError (List.List Model.TournamentShort.TournamentShort)"]}},"Page.User.Msg":{"args":[],"tags":{"GotUser":["Result.Result Api.ApiError User.User"],"GotNotifications":["Result.Result Api.ApiError (List.List Model.Notification.Notification)"],"EditUser":[],"CancelEdit":[],"ConfirmEdit":[],"PatchUser":["Result.Result Api.ApiError User.User"],"InputUsername":["String.String"],"InputEmail":["String.String"],"InputPassword":["String.String"],"InputPasswordAgain":["String.String"],"NotificationAction":["String.String"],"NewClub":[]}},"Url.Protocol":{"args":[],"tags":{"Http":[],"Https":[]}},"String.String":{"args":[],"tags":{"String":[]}},"Browser.UrlRequest":{"args":[],"tags":{"Internal":["Url.Url"],"External":["String.String"]}},"Api.ApiError":{"args":[],"tags":{"BadUrl":["String.String"],"Timeout":[],"NetworkError":[],"BadStatus":["Basics.Int","String.String"],"BadBody":["String.String"]}},"Basics.Bool":{"args":[],"tags":{"True":[],"False":[]}},"Basics.Float":{"args":[],"tags":{"Float":[]}},"List.List":{"args":["a"],"tags":{}},"Result.Result":{"args":["error","value"],"tags":{"Ok":["value"],"Err":["error"]}}}}})}});}(this));