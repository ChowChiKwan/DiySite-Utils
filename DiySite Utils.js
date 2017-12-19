/**
 * @class Diysite
 */
(function(Diysite, $, undefined) {
    /**
     * 用于定义命名空间/包
     *
     * @method Diysite.Module
     * @param {String}   path         命名空间/包路径
     * @param {Function} factory      命名空间/包函数
     * @param {Boolean}  [imediately] 立即执行标志
     */
    !Diysite && (function() {
        window.Diysite = Diysite = function() {
            var lib = {},
                typeOf = Object.prototype.toString;
            lib.Module = function(path, factory, immediately) {
                var pkgs, packageName, tmpLib = lib;
                if (typeOf.apply(path) != '[object String]' || typeOf.apply(factory) != '[object Function]')
                    throw new Error('Path not string or Factory not a function');
                pkgs = path.split('.');
                while (packageName = pkgs.shift()) {
                    if (pkgs.length) {
                        tmpLib[packageName] === undefined && (tmpLib[packageName] = {});
                        tmpLib = tmpLib[packageName];
                    } else if (tmpLib[packageName] === undefined) {
                        immediately ?
                            tmpLib[packageName] = factory.apply() :
                            tmpLib[packageName] = factory;
                    }
                }
            };
            return lib;
        }();
    })();
    /**
     * 用于判断数据类型, (ie8以下不能用于undefined)
     *
     * @method Diysite.core.type
     * @param  {Any}     obj  需要判断的任意数据
     * @param  {String}  type 数据类型
     * @return {Boolean}      判断结果
     */
    Diysite.Module('core.type', function(obj, type) {
        return Object.prototype.toString.apply(obj).toLowerCase().slice(8, -1) === type;
    });
    /**
     * 修复低版本ie中不支持es5的数组forEach方法, 不需要调用
     *
     * @method Diysite.core.forEach
     * @private
     */
    Diysite.Module('core.forEach', function() {
        if (Array.prototype.forEach === undefined) {
            Array.prototype.forEach = function(callback, context) {
                for (var index = 0, l = this.length; index < l; index++) {
                    if (Diysite.core.type(callback, 'function') && Object.prototype.hasOwnProperty.call(this, index)) {
                        /* param seq: (item, index, array) */
                        callback.call(context, this[index], index, this);
                    }
                }
            };
        }
    }, true);
    /**
     * Array map
     */
    Diysite.Module('core.ArrayMap', function() {
        // Production steps of ECMA-262, Edition 5, 15.4.4.19
        // Reference: http://es5.github.io/#x15.4.4.19
        if (!Array.prototype.map) {

            Array.prototype.map = function(callback, thisArg) {

                var T, A, k;

                if (this == null) {
                    throw new TypeError(' this is null or not defined');
                }

                // 1. Let O be the result of calling ToObject passing the |this| 
                //    value as the argument.
                var O = Object(this);

                // 2. Let lenValue be the result of calling the Get internal 
                //    method of O with the argument "length".
                // 3. Let len be ToUint32(lenValue).
                var len = O.length >>> 0;

                // 4. If IsCallable(callback) is false, throw a TypeError exception.
                // See: http://es5.github.com/#x9.11
                if (typeof callback !== 'function') {
                    throw new TypeError(callback + ' is not a function');
                }

                // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 1) {
                    T = thisArg;
                }

                // 6. Let A be a new array created as if by the expression new Array(len) 
                //    where Array is the standard built-in constructor with that name and 
                //    len is the value of len.
                A = new Array(len);

                // 7. Let k be 0
                k = 0;

                // 8. Repeat, while k < len
                while (k < len) {

                    var kValue, mappedValue;

                    // a. Let Pk be ToString(k).
                    //   This is implicit for LHS operands of the in operator
                    // b. Let kPresent be the result of calling the HasProperty internal 
                    //    method of O with argument Pk.
                    //   This step can be combined with c
                    // c. If kPresent is true, then
                    if (k in O) {

                        // i. Let kValue be the result of calling the Get internal 
                        //    method of O with argument Pk.
                        kValue = O[k];

                        // ii. Let mappedValue be the result of calling the Call internal 
                        //     method of callback with T as the this value and argument 
                        //     list containing kValue, k, and O.
                        mappedValue = callback.call(T, kValue, k, O);

                        // iii. Call the DefineOwnProperty internal method of A with arguments
                        // Pk, Property Descriptor
                        // { Value: mappedValue,
                        //   Writable: true,
                        //   Enumerable: true,
                        //   Configurable: true },
                        // and false.

                        // In browsers that support Object.defineProperty, use the following:
                        // Object.defineProperty(A, k, {
                        //   value: mappedValue,
                        //   writable: true,
                        //   enumerable: true,
                        //   configurable: true
                        // });

                        // For best browser support, use the following:
                        A[k] = mappedValue;
                    }
                    // d. Increase k by 1.
                    k++;
                }

                // 9. return A
                return A;
            };
        }
    }, true);
    /**
     * 修复低版本ie中不支持es5的数组indexOf方法, 不需要调用
     *
     * @method Diysite.core.indexOf
     * @private
     */
    Diysite.Module('core.indexOf', function() {
        if (Array.prototype.indexOf === undefined) {
            Array.prototype.indexOf = function(item) {
                for (var index = 0, l = this.length; index < l; index++) {
                    if (this[index] === item)
                        return index;
                }
                return -1;
            };
        }
    }, true);
    /**
     * 修复IE6-8不支持trim
     *
     * @method Diysite.core.trim
     * @private
     */
    Diysite.Module('core.trim', function() {
        if (String.prototype.trim === undefined) {
            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, '');
            }
        }
    }, true);
    /**
     * 扩展对象
     *
     * @method Diysite.core.extend
     * @param  {Object} defaultOptions 原对象
     * @param  {Object} options        新对象
     * @return {Object}                扩展后的对象
     */
    Diysite.Module('core.extend', function(defaultOptions, options) {
        // prevent error
        options = options || {};
        return $.extend({}, defaultOptions, options);
    });
    /**
     * 用于定时执行函数(因setInterval时间不精准)
     *
     * @method Diysite.core.timer
     * @param   {Function} callback 需要定时执行的函数
     * @param   {Number}   delay    执行间隔
     * @returns {Function} start    启动定时器,
     *                     stop     停止定时器
     */
    Diysite.Module('core.timer', function(callback, delay) {
        if (!Diysite.core.type(callback, 'function'))
            throw new Error('Need currect param');
        var handle, handler, isStop = !1;
        return new function() {
            var handler = function() {
                    if (isStop) {
                        clearTimeout(handle);
                    } else {
                        callback.apply();
                        handle = setTimeout(handler, delay);
                    }
                },
                timerStart = function() {
                    isStop = !1;
                    handle = setTimeout(handler, delay);
                },
                timerStop = function() {
                    isStop = !0;
                };
            return {
                start: timerStart,
                stop: timerStop
            }
        };
    });
    /**
     * 检测浏览器是否支持transition
     *
     * @return {Object|Boolean} 返回是否支持, 如支持, 返回带end属性对象, 否则返回false
     */
    Diysite.Module('core.supportTransition', function() {
        $.support.transition = (function() {
            var elem = document.createElement('div'),
                prefix = ['', 'webkit', 'moz', 'o'],
                name;
            while (prefix.length) {
                name = prefix.shift();
                name = name === '' ? 'transition' : name + 'Transition';
                if (elem.style[name] !== undefined) {
                    return {
                        end: name + ((name === 'transition') ? 'end' : 'End')
                    };
                }
            }
            return false;
        })();
    }, true);
    /**
     * 将字符串转换为html十进制形式
     *
     * @method Diysite.code.encode
     * @param  {String} str 需要转换的字符串
     * @return {String}     转换后的字符串
     */
    Diysite.Module('code.encode', function(str) {
        if (!Diysite.core.type(str, 'string'))
            throw new Error('Need string param');
        var ret = [];
        for (var i = 0, l = str.length; i < l; i++) {
            if (str.charCodeAt(i) < 256) {
                ret.push('&#' + str.charCodeAt(i));
            } else {
                ret.push(str.charAt(i));
            }
        };
        return ret.join('');
    });
    /**
     * 格式化可能xss的html标签
     *
     * @method Diysite.code.htmlEntities
     * @param  {String} str 需要格式化的html字符串
     * @return {String}     格式化后的html字符串
     */
    Diysite.Module('code.htmlEntities', function(str) {
        if (!Diysite.core.type(str, 'string'))
            throw new Error('Need string param');
        var codes = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;'
        }
        return str.replace(/<|>|&|\"/g, function(code) {
            return codes[code];
        });
    });
    /**
     * queryString转换为json,e.g: a=213&b=312 -> {a:213, b:312}
     *
     * @method Diysite.json.queryToJson
     * @param  {String}  queryString       需要转换json的字符串
     * @param  {Boolean} [isEncoded=false] 是否需要decodeURIComponent, 对应jsonToQuery的encodeURIComponent
     * @return {Object}                    转换后的json对象
     */
    Diysite.Module('json.queryToJson', function(queryString, isEncoded) {
        var query = queryString.trim().split('&'),
            ret = {},
            parse = function(value, isEncoded) {
                return isEncoded ? decodeURIComponent(value.replace(/\+/g, ' ')) : value;
            };
        query.forEach(function(item, i) {
            if (item !== undefined) {
                var part = item.split('='),
                    key = part[0],
                    value = part[1];
                if (part.length < 2) {
                    value = key;
                    key = 'emptyKey'; // set the key to 'emptyKey'
                }
                // if array
                key = key.replace('[]', '');
                if (!ret[key]) {
                    ret[parse(key, isEncoded)] = parse(value, isEncoded);
                } else {
                    if (!Diysite.core.type(ret[key], 'function')) {
                        if (!Diysite.core.type(ret[key], 'array')) {
                            ret[key] = [ret[key]];
                        }
                        ret[parse(key, isEncoded)].push(parse(value, isEncoded));
                    }
                }
            }
        });
        return ret;
    });
    /**
     * json对象转换为queryString字符串
     *
     * @method Diysite.json.jsonToQuery
     * @param  {Object}  obj               需要转换的json对象
     * @param  {Boolean} [isEncoded=false] 是否需要encodeURIComponent, 对应queryToJson的decodeURIComponent
     * @return {String}                    转换后的queryString
     */
    Diysite.Module('json.jsonToQuery', function(obj, isEncoded) {
        var parse = function(value, isEncoded) {
                value = value == null ? '' : value;
                value = value.toString().trim();
                return isEncoded ? encodeURIComponent(value).replace(/%20/g, '+') : value;
            },
            ret = [];
        if (Diysite.core.type(obj, 'object')) {
            for (var key in obj) {
                if (key === 'emptyKey') {
                    ret = ret.concat(obj[key]);
                    continue;
                }
                if (Diysite.core.type(obj[key], 'array')) {
                    obj[key].forEach(function(item) {
                        ret.push(key + '[]=' + parse(item, isEncoded));
                    });
                } else {
                    // check the value is function (xss)
                    !Diysite.core.type(obj[key], 'function') && ret.push(key + '=' + parse(obj[key], isEncoded));
                }
            }
        }
        return ret.length ? ret.join('&') : '';
    });
    /**
     * 字符串转换为Date类型
     *
     * @method Diysite.date.stringToDate
     * @param  {String} dateString 需要转换的字符串, 格式为Y-m-d H:i:s
     * @return {Object}            转换后的Date类型
     */
    Diysite.Module('date.stringToDate', function(dateString) {
        // parse Y-m-d H:i:s to date object
        dateString = dateString.replace(/[-|:]/g, ' ');
        var dateArray = dateString.split(' ');
        return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5])
    });
    /**
     * Date类型转换为字符串
     *
     * @method Diysite.date.dateToString
     * @param  {Object} date 需要转换的Date类型
     * @return {String}      转换后的字符串: 格式为Y-m-d H:i:s
     */
    Diysite.Module('date.dateToString', function(date) {
        // parse date object to Y-m-d H:i:s
        return date.getFullYear() + '-' + parseInt(+date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.toString().match(/\d{2}:\d{2}:\d{2}/);
    });
    /**
     * 比较两个时间之差
     *
     * @method Diysite.date.diff
     * @param  {String|Date} from            开始时间
     * @param  {String|Date} to              结束时间
     * @param  {String}      [type='day']    差值类型, 默认为'day', 可为'second', 'minute', 'hour'
     * @return {Number}                      差值
     */
    Diysite.Module('date.diff', function(from, to, type) {
        var fromDate = typeof from === 'string' ? Diysite.date.stringToDate(from) : from,
            toDate = typeof to === 'string' ? Diysite.date.stringToDate(to) : to,
            type = type ? type : 'day',
            typeMap = {
                'second': 1000, // ms
                'minute': 1000 * 60, // 60s
                'hour': 1000 * 60 * 60, // 60min
                'day': 1000 * 60 * 60 * 24 // 24h
            },
            diffs = 0;
        if (!(type in typeMap)) {
            throw new TypeError('type should be in ["second", "minute", "hour", "day"]');
        }
        fromDate = fromDate.getTime();
        toDate = toDate.getTime();
        diffs = parseFloat(((toDate - fromDate) / typeMap[type]).toFixed(2));
        return diffs;
    });
    /**
     * 如支持localstorage使用ls, 否则使用cookie
     *
     * @method Diysite.bom.storage
     * @return {Object}                 操作方法
     */
    Diysite.Module('bom.storage', function() {
        var _storage = {
            setItem: function(key, value) {
                var today = new Date(),
                    expire = new Date(),
                    DAYS = 3; // default save 3days;
                expire.setTime(today.getTime() + 1000 * 60 * 60 * 24 * DAYS);
                document.cookie = key + '=' + escape(value) + ';expires=' + expire.toGMTString();
            },
            getItem: function(key) {
                if (key === undefined)
                    throw new Error('getItem need key');
                var parts = document.cookie.split(key + '=');
                if (parts.length == 2) return unescape(parts.pop().split(';').shift());
            },
            removeItem: function(key) {
                if (key === undefined)
                    throw new Error('removeItem need key');
                document.cookie = key + '=removed; expires=' + new Date(0).toUTCString();
            }
        };
        try {
            if (window.localStorage === undefined) {
                return _storage;
            }
            return window.localStorage;
        } catch (e) {
            return _storage;
        }
    }, true);
    /**
     * 判断是否为ie6
     *
     * @property {Boolean} Diysite.bom.isIE6 是否为ie6
     */
    Diysite.Module('bom.isIE6', function() {
        return document.body.style.maxWidth === undefined;
    }, true);
    /**
     * 定义最大手机宽度像素
     *
     * @property {Number} Diysite.bom.MAXMOBILEWIDTH 最大手机宽度
     */
    Diysite.Module('bom.MAXMOBILEWIDTH', function() {
        return 480;
    }, true);
    /**
     * 定义最小平板宽度像素
     *
     * @property {Number} Diysite.bom.MINTABLETWIDTH 最小平板宽度像素
     */
    Diysite.Module('bom.MINTABLETWIDTH', function() {
        return 768;
    }, true);
    /**
     * 定义最大平板宽度像素
     *
     * @property {Number} Diysite.bom.MAXTABLETWIDTH 最大平板宽度像素
     */
    Diysite.Module('bom.MAXTABLETWIDTH', function() {
        return 1024;
    }, true);
    /**
     * 定义最小PC宽度像素
     *
     * @property {Number} Diysite.bom.MAXTABLETWIDTH 最小PC宽度像素
     */
    Diysite.Module('bom.MINPCWIDTH', function() {
        return 1200;
    }, true);
    /**
     * 重定向函数, 配合后台返回字符串作判断
     *
     * @method Diysite.bom.redirectURL
     * @param  {String} url 需要重定向的url
     */
    Diysite.Module('bom.redirectURL', function(url) {
        switch (url) {
            case '_BEFORE_':
                window.history.back();
                break;
            case '_CURRENT_':
                window.location.reload();
                break;
            default:
                url = url.replace(/[\\><]/g, '');
                window.location.href = url;
        }
    });
    /**
     * 加载script
     *
     * @method Diysite.dom.loadScript
     * @param  {Array}    scripts    脚本路径数组
     * @param  {Function} [callback] 加载成功后回调函数
     */
    Diysite.Module('dom.loadScript', function(scripts, callback) {
        if (!Diysite.core.type(scripts, 'array'))
            throw new Error('Need Array Param');
        setTimeout(function() {
            var tmpScript,
                docFragment = document.createDocumentFragment(),
                loadedHandle = function() {
                    if (this.readyState && this.readyState != 'loaded' && this.readyState != 'complete') return;
                    callback.apply();
                }
            scripts.forEach(function(scriptPath, i) {
                tmpScript = document.createElement('script');
                tmpScript.src = scriptPath;
                tmpScript.defer = true; // IE
                tmpScript.async = true;
                docFragment.appendChild(tmpScript);

            });
            if (Diysite.core.type(callback, 'function')) {
                if (tmpScript.onload !== undefined) {
                    tmpScript.onload = loadedHandle;
                } else {
                    tmpScript.onreadystatechange = loadedHandle;
                }
            }
            document.body.appendChild(docFragment);
            tmpScript = null;
        }, 1);
    });
    /**
     * 加载CSS
     *
     * @method Diysite.dom.loadCSS
     * @param  {Array}  paths CSS路径数组
     */
    Diysite.Module('dom.loadCSS', function(paths) {
            if (!Diysite.core.type(paths, 'array'))
                throw new Error('Need Array Param');
            setTimeout(function() {
                var tmpCSS,
                    fileName,
                    docFragment = document.createDocumentFragment();
                paths.forEach(function(cssPath, i) {
                    fileName = cssPath.substring(cssPath.lastIndexOf('/') + 1, cssPath.lastIndexOf('.css'));
                    if (document.getElementById(fileName)) return;
                    tmpCSS = document.createElement('link');
                    tmpCSS.id = fileName;
                    tmpCSS.rel = 'stylesheet';
                    tmpCSS.href = cssPath;
                    docFragment.appendChild(tmpCSS);
                })
                document.getElementsByTagName('head')[0].appendChild(docFragment);
            }, 1);
        })
        /**
         * 简单模板函数, 将data对象中{key: value}替换模板中<%key%>到value
         *
         * @method Diysite.dom.template
         * @param  {String} template 模板字符串
         * @param  {Object} data     模板数据
         * @return {String}          转换后的字符串
         */
    Diysite.Module('dom.template', function(template, data) {
        var dataParse = {
            setName: function(dataName) {
                return '<%' + dataName + '%>';
            },
            setData: function(data) {
                for (var dataKey in data) {
                    if (!Diysite.core.type(data[dataKey], 'object')) {
                        if (!Diysite.core.type(data[dataKey], 'function')) {
                            var regExp = new RegExp(this.setName(dataKey), 'g');
                            template = template.replace(regExp, data[dataKey] || '');
                        } else {
                            continue;
                        }
                    } else {
                        this.setData(data[dataKey]);
                    }
                }
            }
        };
        dataParse.setData(data);
        return template;
    });
    /**
     * 加载中的提示条
     *
     * @method Diysite.ui.loadingTip
     * @param   {String}   content                  显示内容
     * @param   {Object}   [options]                配置参数
     * @param   {Boolean}  [options.text=true]      显示文字标识, 默认true
     * @param   {Boolean}  [options.progress=false] 显示进度条标识, 默认false
     * @param   {Object}   [options.other]          CSS属性
     * @returns {Function} getTip    获取提示条
     *                     process   设置进度
     *                     done      加载完成
     */
    Diysite.Module('ui.loadingTip', function(content, options) {
        var tip = $('<div/>').addClass('loading-tip'),
            tipBar,
            defaultOptions = {
                width: 300,
                color: '#555',
                text: true,
                progress: false
            };
        options = Diysite.core.extend(defaultOptions, options);
        /* tip content */
        if (options.text) {
            tip.append('<span>' + content + '</span>');
        }
        /* tip progress */
        if (options.progress) {
            tip.append('<div class="loading-progress"><span class="loading-bar"/></div>');
            tipBar = tip.find('.loading-bar');
        }
        tip.css(options);
        return {
            getTip: function() {
                return tip;
            },
            process: function(percent) {
                if (!tipBar || isNaN(percent)) return;
                if (percent < 0) percent = 0;
                if (percent >= 100) {
                    this.done();
                    return;
                }
                tipBar.width(percent + '%');
            },
            done: function() {
                tip.remove();
            }
        };
    });
    /**
     * 消息框
     *
     * @method Diysite.ui.msgBox
     * @param  {Object}   options                  配置参数
     * @param  {String}   options.content          内容
     * @param  {String}   [options.title='']       标题, 默认为空
     * @param  {Boolean}  [options.type=info]      消息框类型, 默认info, ['info', 'error', 'success', 'warning']
     * @param  {Boolean}  [options.draggable=false] 可拖拽标识, 默认false
     * @param  {Function} [confirmCallback]        点击确定回调函数
     * @param  {Function} [cancelCallback]         点击取消回调函数
     * @return {Function} setContent               设置消息框内容
     */
    Diysite.Module('ui.msgBox', function() {
        var msgbox = {
            elem: undefined
        };
        return function(options, confirmCallback, cancelCallback) {
            if (msgbox.elem) return msgbox.elem;
            var domBody = $('body'),
                showCancelBtn = true;
            defaultOptions = {
                content: undefined,
                title: '',
                type: 'info',
                draggable: false
            };
            options = Diysite.core.extend(defaultOptions, options);
            if (options.content === undefined)
                throw new Error('Need content');
            /* check type in [info, error, success, warning] */
            if (!/\binfo\b|\berror\b|\bsuccess\b|\bwarning\b/.test(options.type))
                options.type = 'info';
            /* if confirmCallback != undefined && cancelCallback == undefined; */
            if (Diysite.core.type(confirmCallback, 'function')) {
                if (!Diysite.core.type(cancelCallback, 'function')) {
                    showCancelBtn = false;
                    cancelCallback = confirmCallback;
                }
            } else {
                showCancelBtn = false;
            }
            /* defined msgbox */
            msgbox.template = [
                '<div id="msgbox" class="modal">',
                '<div id="msgbox-header" class="clearfix">',
                '<button class="close msgbox-close">&times;</button>',
                '<h3><%title%></h3>',
                '</div>',
                '<div id="msgbox-body">',
                '<p><%content%></p>',
                '</div>',
                '<div id="msgbox-footer">',
                '<button id="msgbox-confirm" class="btn btn-<%type%>">确认</button> <button class="btn msgbox-close">取消</button>',
                '</div>',
                '</div>'
            ].join('');
            msgbox.show = function() {
                this.elem.show();
                this.mask.show();
                // focus for enter key
                this.elem.find('#msgbox-confirm').focus();
                if (options.draggable) {
                    Diysite.ui.drag(msgbox.elem, {
                        init: true,
                        dragElem: msgbox.elem.find('#msgbox-header'),
                        cursor: 'move'
                    });
                }
            };
            msgbox.destory = function() {
                if (options.draggable) {
                    Diysite.ui.drag(msgbox.elem, {
                        init: false
                    });
                }
                this.elem.remove();
                this.mask.remove();
                this.elem = this.mask = null; // avoid IE memory overflow;
                $(document).off('keyup.closeMsgbox');
            };
            /* for 'esc' key */
            msgbox.keyup = function(e) {
                if (e.keyCode == 27) {
                    if (Diysite.core.type(cancelCallback, 'function')) {
                        cancelCallback.apply(this, arguments);
                    }
                    msgbox.destory();
                }
            };
            // init msgbox
            msgbox.elem = $(Diysite.dom.template(msgbox.template, options));
            if (!showCancelBtn) {
                msgbox.elem.find('.msgbox-close').remove();
            }
            msgbox.mask = $('<div id="msgbox-mask"/>');
            // append to the dom
            domBody.append(msgbox.mask).append(msgbox.elem);
            msgbox.elem.css({
                'marginTop': document.documentElement.clientHeight / 3,
                'marginLeft': -msgbox.elem.width() / 2
            });
            msgbox.elem.find('.msgbox-close').on('click', function() {
                if (Diysite.core.type(cancelCallback, 'function')) {
                    cancelCallback.apply(this, arguments);
                }
                msgbox.destory();
            });
            msgbox.elem.find('#msgbox-confirm').on('click', function() {
                if (Diysite.core.type(confirmCallback, 'function')) {
                    confirmCallback.apply(this, arguments);
                }
                msgbox.destory();
            });
            $(document).on('keyup.closeMsgbox', msgbox.keyup);
            msgbox.show();
            return {
                setContent: function(content) {
                    msgbox.elem.find('#msgbox-body').html(content);
                }
            }
        };
    }, true);
    /**
     * 弹出消息提示
     *
     * @method Diysite.ui.popTips
     * @param  {Object} options                  配置参数
     * @param  {String} options.content          内容
     * @param  {String} [options.type=info]      提示类型, 默认info, ['info', 'error', 'success', 'warning']
     * @param  {Number} [options.delay=3000]     消失间隔, 默认3秒
     * @return {Object}                          包含destory函数的对象
     */
    Diysite.Module('ui.popTips', function(options) {
        var domBody = $('body'),
            popTip,
            popTipGroup,
            popTipOffset = 10,
            popTipDestory = function() {
                if (popTip != null) {
                    var popTipHeight = popTip.outerHeight();
                    popTip.remove();
                    popTip = null;
                    popTipGroup.css('bottom', '-=' + (popTipHeight + popTipOffset));
                }
            },
            defaultOptions = {
                content: undefined,
                type: 'info',
                delay: 3000
            };
        options = Diysite.core.extend(defaultOptions, options);
        if (options.content === undefined)
            throw new Error('Need content');
        // check type in [warning, error, success, info]
        if (!/\bwarning\b|\berror\b|\bsuccess\b|\binfo\b|\bdefault\b/.test(options.type))
            options.type = 'info';
        popTip = $('<div />').addClass('poptip alert').addClass('alert-' + options.type).html(options.content);
        popTipGroup = $('.poptip');
        domBody.append(popTip);
        popTipGroup.css('bottom', '+=' + (popTip.outerHeight() + popTipOffset));
        if (Diysite.bom.isIE6) {
            popTip.css({
                'position': 'absolute',
                'zoom': '1',
                'width': '300px'
            });
        }
        popTip.css('marginLeft', -popTip.outerWidth() / 2).fadeIn('slow');
        popTip.delay(options.delay).fadeOut(200, popTipDestory);
        return {
            destory: popTipDestory
        };
    });
    /**
     * 小提示标签, jQuery插件, 由jQ对象调用
     *
     * @method $.tips
     * @param {Object} options               配置参数
     * @param {String} options.content       内容
     * @param {String} [options.type=info]   标签类型, 默认info, ['info', 'error', 'success', 'warning']
     * @param {String} [options.direct=top]  标签显示位置, 基于调用dom元素, 默认top, ['top', 'right', 'bottom', 'left']
     */
    Diysite.Module('ui.tips', function() {
        $.fn.tips = function(options) {
            // if argument empty;
            var parent = this,
                parentInfo,
                tip,
                tipArrow,
                tipInfo = {},
                newOffset,
                newArrowOffset,
                tipsTemplate,
                arrowOffset = 11,
                defaultOptions = {
                    content: undefined,
                    type: 'info',
                    direct: 'top',
                    offset: 0,
                    width: 300,
                    maxWidth: true
                };
            options = Diysite.core.extend(defaultOptions, options);
            if (options.content === undefined)
                throw new Error('Need content');
            // hide the tip
            if (options.content == 'hide') {
                parent.next('.popover').remove();
                return;
            }
            // if popover exist, return;
            if (parent.next().hasClass('popover')) return;
            // check direct in [top, right, bottom, left]
            if (!/\btop\b|\bright\b|\bbottom\b|\bleft\b/.test(options.direct))
                options.direct = 'top';
            options.type = 'text-' + options.type;
            tipsTemplate = [
                '<div class="popover <%direct%>">',
                '<div class="arrow"></div>',
                '<div class="popover-content <%type%>"><%content%></div>',
                '</div>'
            ].join('');
            tip = $(Diysite.dom.template(tipsTemplate, options));
            tipArrow = tip.find('.arrow');
            parent.after(tip);
            /* fix css */
            if (!options.maxWidth) {
                tip.css({
                    display: 'block',
                    maxWidth: 'inherit',
                    width: options.width
                });
            } else {
                tip.css('display', 'block');
            }
            /* parent info */
            parentInfo = parent.offset();
            parentInfo.width = parent[0].offsetWidth;
            parentInfo.height = parent[0].offsetHeight;
            /* tip info */
            tipInfo = tip.offset();
            tipInfo.offsetWidth = tip[0].offsetWidth;
            tipInfo.offsetHeight = tip[0].offsetHeight;

            switch (options.direct) {
                case "bottom":
                    newOffset = {
                        top: parentInfo.top + parentInfo.height + arrowOffset,
                        left: (parentInfo.left + parentInfo.width / 2 - tipInfo.offsetWidth / 2) + options.offset
                    };
                    newArrowOffset = {
                        marginLeft: parseInt(tipArrow.css('marginLeft'), 10) - options.offset
                    };
                    break;
                case "top":
                    newOffset = {
                        top: parentInfo.top - tipInfo.offsetHeight - arrowOffset,
                        left: (parentInfo.left + parentInfo.width / 2 - tipInfo.offsetWidth / 2) + options.offset
                    };
                    newArrowOffset = {
                        marginLeft: parseInt(tipArrow.css('marginLeft'), 10) - options.offset
                    };
                    break;
                case "left":
                    newOffset = {
                        top: (parentInfo.top + parentInfo.height / 2 - tipInfo.offsetHeight / 2) + options.offset,
                        left: parentInfo.left - tipInfo.offsetWidth - arrowOffset
                    };
                    newArrowOffset = {
                        marginTop: parseInt(tipArrow.css('marginTop'), 10) - options.offset
                    };
                    break;
                case "right":
                    newOffset = {
                        top: (parentInfo.top + parentInfo.height / 2 - tipInfo.offsetHeight / 2) + options.offset,
                        left: parentInfo.left + parentInfo.width + arrowOffset
                    };
                    newArrowOffset = {
                        marginTop: parseInt(tipArrow.css('marginTop'), 10) - options.offset
                    };
            }
            tip.offset(newOffset);
            tipArrow.css(newArrowOffset);
            tip.one('mouseleave.remove', function() {
                tip.remove();
            });
            return tip;
        }
    }, true);
    /**
     * y轴滚动条
     *
     * @method Diysite.ui.scroller
     * @param  {Object} elem                      需要附加滚动条的dom对象
     * @param  {Object} [options]                 配置参数
     * @param  {Number} [options.height=200]      高度, 默认200
     * @param  {Number} [options.scrollerWidth=5] 滑动块宽度, 默认5
     */
    Diysite.Module('ui.scroller', function(elem, options) {
        var elemHeight,
            scroller = {},
            supportTouch = ('ontouchstart' in window),
            startEvent = supportTouch ? 'touchstart' : 'mousedown',
            moveEvent = supportTouch ? 'touchmove' : 'mousemove',
            endEvent = supportTouch ? 'touchend' : 'mouseup',
            isFirefox = /firefox/.test(navigator.userAgent.toLowerCase()),
            defaultOptions = {
                height: 200,
                scrollerWidth: 5
            };
        elem = $(elem);
        options = Diysite.core.extend(defaultOptions, options);
        /* get container origin height */
        elemHeight = elem.get(0).scrollHeight || elem.outerHeight(true);
        /* if not overflow */
        if (elemHeight < options.height) return;
        /* if exist the scroller */
        if (elem.find('.Diysite-scroller').length > 0) return;
        if (elem.css('position') == 'static')
            elem.css('position', 'relative');
        elem.css({
            'height': options.height,
            'overflow': 'hidden'
        });
        /* init scroller */
        scroller.elem = $('<div/>').addClass('Diysite-scroller');
        /* append scroller and set CSS */
        scroller.CSS = {
            'width': options.scrollerWidth,
            'height': options.height / elemHeight * options.height
        };
        elem.append(scroller.elem.css(scroller.CSS));
        /* defined scroller functions */
        scroller.move = function(elemScrollTop) {
            var scrollPercent;
            scrollPercent = elemScrollTop / (elemHeight - options.height);
            /* scroller range: 0-100% */
            scrollPercent < 0 && (scrollPercent = 0);
            scrollPercent > 1 && (scrollPercent = 1);
            scroller.elem[0].style.top = (elemHeight - scroller.CSS.height) * scrollPercent - Math.floor(scrollPercent) + 'px';
            elem[0].scrollTop = elemScrollTop;
        };
        scroller.onStart = function(e) {
            scroller.elem.addClass('Diysite-scroller-hover');
            scroller.originY = scroller.elem.position().top;
            scroller.startOffsetY = supportTouch ? e.originalEvent.changedTouches[0].pageY : e.pageY;
            scroller.moveStart = !0;
        };
        scroller.onMove = function(e) {
            if (!scroller.moveStart) return;
            var newOffsetY,
                pageY = supportTouch ? e.originalEvent.changedTouches[0].pageY : e.pageY;
            newOffsetY = (pageY - scroller.startOffsetY + scroller.originY) * (options.height / scroller.CSS.height);
            scroller.move(newOffsetY);
            e.preventDefault();
        };
        scroller.onStop = function(e) {
            scroller.elem.removeClass('Diysite-scroller-hover');
            scroller.moveStart = !1;
        };
        /* bind event */
        scroller.elem.on(startEvent, scroller.onStart);
        $(document).on(moveEvent, scroller.onMove).on(endEvent, scroller.onStop);
        elem.on('mousewheel DOMMouseScroll', function(e) {
            var wheelDelta = isFirefox ? e.originalEvent.detail * 40 : -e.originalEvent.wheelDelta,
                elemScrollTop;
            /* slow the scroll speed */
            wheelDelta = wheelDelta / 5;
            elemScrollTop = elem.get(0).scrollTop + wheelDelta;
            scroller.move(elemScrollTop);
            e.preventDefault();
        });
        return {
            scrollTo: scroller.move
        }
    });
    /**
     * 设置可拖动状态
     *
     * @method Diysite.ui.drag
     * @param {Object}  elem                     需要设置拖动的dom对象
     * @param {Object}  [options]                配置参数
     * @param {Boolean} [options.init=true]      初始化标识, false为销毁此功能
     * @param {Object}  [options.dragElem]       拖动点元素
     * @param {String}  [options.direct=both]    可拖动方向, 默认双向, ['both', 'x', 'y']
     * @param {String}  [options.cursor]         鼠标在拖动点时图标, 默认pointer
     * @param {Funtion} [options.startCallback]  开始拖动回调函数
     * @param {Funtion} [options.moveCallback]   拖动时回调函数
     * @param {Funtion} [options.stopCallback]   停止拖动回调函数
     */
    Diysite.Module('ui.drag', function() {
        var dragCache = {};
        return function(elem, options) {
            $(elem).each(function(index, elem) {
                var elem = $(elem),
                    elemOffset,
                    startOffset,
                    newOffset,
                    supportTouch = ('ontouchstart' in window),
                    startEvent = supportTouch ? 'touchstart' : 'mousedown',
                    moveEvent = supportTouch ? 'touchmove' : 'mousemove',
                    endEvent = supportTouch ? 'touchend' : 'mouseup',
                    start = !1,
                    dragCacheKey,
                    defaultOptions = {
                        init: true,
                        dragElem: undefined,
                        direct: 'both',
                        cursor: 'pointer',
                        startCallback: undefined,
                        moveCallback: undefined,
                        stopCallback: undefined
                    };
                if (elem.length <= 0)
                    throw new Error('Not found element');
                options = Diysite.core.extend(defaultOptions, options);
                /* define element function */
                elem.onStart = function(e) {
                    elemOffset = elem.offset();
                    startOffset = {
                        top: supportTouch ? e.originalEvent.changedTouches[0].pageY : e.pageY,
                        left: supportTouch ? e.originalEvent.changedTouches[0].pageX : e.pageX
                    };
                    elem.css({
                        'position': 'absolute',
                        'cursor': options.cursor
                    });
                    // fix firefox
                    elem.offset(elemOffset);
                    start = !0;
                    if (Diysite.core.type(options.startCallback, 'function'))
                        options.startCallback.call(elem, e);
                };
                elem.onMove = (function() {
                    switch (options.direct) {
                        case 'x':
                            return function(e) {
                                if (!start) return;
                                var pageX = supportTouch ? e.originalEvent.changedTouches[0].pageX : e.pageX;
                                newOffset = {
                                    left: pageX - startOffset.left + elemOffset.left
                                };
                                elem.offset(newOffset);
                                if (Diysite.core.type(options.moveCallback, 'function'))
                                    options.moveCallback.call(elem, e);
                                e.preventDefault();
                            };
                        case 'y':
                            return function(e) {
                                if (!start) return;
                                var pageY = supportTouch ? e.originalEvent.changedTouches[0].pageY : e.pageY;
                                newOffset = {
                                    top: pageY - startOffset.top + elemOffset.top
                                };
                                elem.offset(newOffset);
                                if (Diysite.core.type(options.moveCallback, 'function'))
                                    options.moveCallback.call(elem, e);
                                e.preventDefault();
                            };
                        case 'both':
                            return function(e) {
                                if (!start) return;
                                var pageX = supportTouch ? e.originalEvent.changedTouches[0].pageX : e.pageX,
                                    pageY = supportTouch ? e.originalEvent.changedTouches[0].pageY : e.pageY;
                                newOffset = {
                                    top: pageY - startOffset.top + elemOffset.top,
                                    left: pageX - startOffset.left + elemOffset.left
                                };
                                elem.offset(newOffset);
                                if (Diysite.core.type(options.moveCallback, 'function'))
                                    options.moveCallback.call(elem, e);
                                e.preventDefault();
                            };
                    }
                })();
                elem.onStop = function(e) {
                    start = !1;
                    elem.css('cursor', 'default');
                    if (Diysite.core.type(options.stopCallback, 'function'))
                        options.stopCallback.apply();
                };
                if (!options.init) {
                    if (elem.data('drag-move-cache') != undefined) {
                        $(document).off(moveEvent, dragCache[elem.data('drag-move-cache')]);
                        if (elem.data('drag-stop-cache') != undefined) {
                            if (options.dragElem) {
                                options.dragElem.off(endEvent, dragCache[elem.data('drag-stop-cache')]);
                            } else {
                                elem.off(endEvent, dragCache[elem.data('drag-stop-cache')]);
                            }
                        }
                        return;
                    } else {
                        throw new Error('Not draggable element');
                    }
                }
                if (options.dragElem) {
                    options.dragElem.on(startEvent, elem.onStart);
                    options.dragElem.on(endEvent, elem.onStop);
                } else {
                    elem.on(startEvent, elem.onStart);
                    elem.on(endEvent, elem.onStop);
                }
                $(document).on(moveEvent, elem.onMove);
                /* Set drag cache */
                dragCacheKey = new Date().getTime();
                dragCache[dragCacheKey] = elem.onMove;
                dragCache[dragCacheKey + 1] = elem.onStop;
                elem.data('drag-move-cache', dragCacheKey);
                elem.data('drag-stop-cache', dragCacheKey + 1);
            })
        }
    }, true);
    /**
     * 弹出层
     *
     * @method Diysite.ui.popLayer
     * @param  {Object}   options                       配置参数
     * @param  {String}   options.templateID            dom中作为模板的id, 若为空, 则content不能为空
     * @param  {String}   options.content               内容, 若为空, templateID不能为空
     * @param  {String}   [options.title=popLayer]      标题, 默认为popLayer
     * @param  {Number}   [options.width=300]           弹出层宽度, 默认300
     * @param  {Boolean}  [options.confirmButton=true]  显示确认按钮标识, 默认显示
     * @param  {Boolean}  [options.draggable=false]      可拖动标识, 默认false
     * @param  {Function} [shownCallback]               显示后回调函数
     * @param  {Function} [closeCallback]               关闭后回调函数
     * @return {Object}                                 popLayer操作函数
     */
    Diysite.Module('ui.popLayer', function(options, shownCallback, closeCallback) {
        var popLayer = {},
            defaultOptions = {
                title: 'popLayer',
                templateID: undefined,
                content: undefined,
                width: 300,
                confirmButton: true,
                draggable: false,
                mask: false
            };
        options = Diysite.core.extend(defaultOptions, options);
        if (options.templateID === undefined && options.content === undefined)
            throw new Error('Need templateID or content');
        popLayer.template = [
            '<div class="pop-layer">',
            '<div class="pop-layer-header clearfix">',
            '<h3 class="pop-layer-title"></h3>',
            '<button class="close popLayer-close">×</button>',
            '</div>',
            '<div class="pop-layer-body">',
            '</div>',
            '<div class="pop-layer-footer">',
            '<button class="btn btn-warning popLayer-close">确认</button>',
            '</div>',
            '</div>'
        ].join('');
        popLayer.elem = $(popLayer.template);
        popLayer.header = popLayer.elem.find('.pop-layer-header');
        popLayer.title = popLayer.elem.find('.pop-layer-title');
        popLayer.body = popLayer.elem.find('.pop-layer-body');
        popLayer.footerCloseBtn = popLayer.elem.find('.pop-layer-footer').find('.popLayer-close');
        /* set footer button */
        if (!options.confirmButton) {
            popLayer.footerCloseBtn.remove();
            popLayer.footerCloseBtn = null;
        }
        if (options.mask) {
            popLayer.mask = $('<div class="mask-screen"/>');
        }
        popLayer.closeBtn = popLayer.elem.find('.popLayer-close');
        popLayer.keyup = function(e) {
            if (e.keyCode == 27) popLayer.closeBtn.trigger('click');
            $(document).off('keyup.closePoplayer');
        };
        /* set content */
        popLayer.title.text(options.title);
        if (options.templateID) {
            popLayer.body.append($(options.templateID).val());
        } else {
            popLayer.body.append(options.content);
        }
        /* set CSS */
        popLayer.elem.css({
            'width': options.width,
            'marginTop': document.documentElement.clientHeight / 4 + $(window).scrollTop(),
            'marginLeft': -options.width / 2
        });
        /* bind events */
        $(document).on('keyup.closePoplayer', popLayer.keyup);
        popLayer.closeBtn.on('click', function(e) {
            if (options.draggable) {
                Diysite.ui.drag(popLayer.elem, {
                    init: false
                });
            }
            if (Diysite.core.type(closeCallback, 'function'))
                closeCallback.apply(this, arguments);
            popLayer.elem.remove();
            options.mask && popLayer.mask.remove();
            e.preventDefault();
        });
        /* append to dom */
        $('body').append(popLayer.elem).show();
        if (options.mask) {
            $('body').append(popLayer.mask);
            popLayer.mask.show();
        }
        /* set draggable */
        if (options.draggable) {
            Diysite.ui.drag(popLayer.elem, {
                init: true,
                dragElem: popLayer.header,
                cursor: 'move'
            });
        }
        /* callback */
        if (Diysite.core.type(shownCallback, 'function'))
            shownCallback.apply(popLayer, arguments);
        return {
            body: popLayer.body,
            title: function(title) {
                if (title === undefined) {
                    return popLayer.title.text();
                } else {
                    popLayer.title.text(title);
                }
            },
            setContent: function(content) {
                popLayer.body.html(content);
            },
            destory: function() {
                /* manual trigger destory, not trigger callback */
                if (options.draggable) {
                    Diysite.ui.drag(popLayer.elem, {
                        init: false
                    });
                }
                popLayer.elem.remove();
                options.mask && popLayer.mask.remove();
                $(document).off('keyup.closePoplayer');
            }
        }
    });
    /**
     * 修复requried检测
     * @return {Boolean}
     *
     */
    Diysite.Module('fixRequired', function() {
        $.fn.isRequired = function() {
            if (this.length === 1) {
                var ret = (this.prop('required') || this.attr('required') === 'required'); // attr for ie
                return ret;
            }
            return this;
        }
    }, true);
    /**
     * 验证表单
     *
     * @method Diysite.form.verify.addRules
     * @param  {Object}  rules                          验证规则
     * {
     *     reg: function|string,
     *     txt: error text
     * }
     * 1. 如需验证整form, 在form中加入data-verify="on"
     * 2. 整form验证时, 必须的字段加入required
     * 3. 单input验证时, 需要data-pattern="验证属性"
     * 4. 按特定需要, 使用Diysite.form.verify.addRules函数增加对应页面验证函数或正则
     * @return {Object}                                所有验证规则
     */
    Diysite.Module('form.verify', function() {
        var _body = $('body'),
            Validator = function() {
                var keyupProp = 'data-verify-keyup',
                    types = {
                        'uint': {
                            reg: function(value) {
                                return (!isNaN(value)) && (value >= 0);
                            },
                            txt: '输入类型应为正整数'
                        },
                        'int8': {
                            reg: function(value) {
                                return (value >= -128) && (value <= 127);
                            },
                            txt: '输入范围为-128~127'
                        },
                        'int16': {
                            reg: function(value) {
                                return (value >= -32768) && (value <= 32767);
                            },
                            txt: '输入范围为-32768~32767'
                        },
                        'uint8': {
                            reg: function(value) {
                                return (value >= 0) && (value <= 255);
                            },
                            txt: '输入范围为0~255'
                        },
                        'uint16': {
                            reg: function(value) {
                                return (value >= 0) && (value <= 65535);
                            },
                            txt: '输入范围为0~65535'
                        },
                        'money': {
                            reg: /^\-?\d+(\.\d{0,2})?$/,
                            txt: '输入类型应为整数或小数点后至多两位的小数'
                        },
                        'email': {
                            reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.(cn|com|net|org|biz|info|cc|tv|so|asia|me|name|co|mobi)$/,
                            txt: '输入类型应为邮箱地址'
                        },
                        'mobile': {
                            reg: /^1\d{10}$/,
                            txt: '输入类型应为手机号码'
                        },
                        'ip': {
                            reg: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/,
                            txt: '请输入正确的IP地址'
                        },
                        'en': {
                            reg: /^[a-zA-Z]+$/,
                            txt: '必须全部字符为英文'
                        },
                        'ename': {
                            reg: /^[a-zA-Z][a-zA-Z0-9\-]+$/,
                            txt: '必须以英文字符开始只包含字母数字和-连接符'
                        },
                        'phonefax': {
                            reg: /^[0-9]+(\-[0-9]+){1,2}$/,
                            txt: '请输入正确格式, 例如020-88888888'
                        },
                        'postcode': {
                            reg: /^[0-9]{6,6}$/,
                            txt: '请输入正确的邮政编码'
                        },
                        'domain': {
                            reg: function(value) {
                                return /^([^\.]?[\u4E00-\u9FA5a-z0-9\-]+\.)+[\u4E00-\u9FA5a-z0-9\-]+$/.test(value);
                            },
                            txt: '请输入正确的域名, 应不包含大写字母'
                        }
                    };
                return {
                    addRules: function(rules) {
                        // need object type
                        if (Diysite.core.type(rules, 'object')) {
                            $.extend(types, rules);
                        }
                        return types;
                    },
                    verify: function(elem) {
                        var _this = $(elem),
                            type = (_this.attr('data-pattern') || '').split(' '),
                            val = $.trim(_this.val()),
                            ret = true,
                            hideTip = function() {
                                _this.removeAttr(keyupProp).tips({
                                    content: 'hide'
                                });
                            }
                        while (type.length) {
                            var _type = type.shift();
                            if (types[_type] != undefined && _this.val() !== '') {
                                var _reg = types[_type].reg,
                                    _regRet = false;
                                if (Diysite.core.type(_reg, 'function')) {
                                    // only value for check
                                    _regRet = _reg.call(_this, val);
                                } else {
                                    _regRet = types[_type].reg.test(val);
                                }
                                if (!_regRet) {
                                    _this.attr(keyupProp, 'on').tips({
                                        content: types[_type].txt,
                                        direct: 'bottom',
                                        type: 'error'
                                    });
                                    ret = false;
                                    break;
                                } else {
                                    hideTip();
                                }
                            } else {
                                hideTip();
                            }
                        }
                        return ret;
                    },
                    verifyForm: function(e) {
                        var _form = $(e.currentTarget),
                            _elems = _form.find(':input').not(':disabled'),
                            submitable = true,
                            _invalidHandler = function() {
                                this.focus();
                                submitable = false;
                            };
                        for (var i = 0, l = _elems.length; i < l; i++) {
                            var _elem = _elems.eq(i);
                            // IE lte 9 need attr('required') === 'required' to check the required property
                            if (_elem.isRequired()) {
                                if (_elem.is('[type=checkbox]') && !_elem.prop('checked')) {
                                    var elemLabel = _elem.parents('.crs-label'),
                                        tipElem;
                                    if (elemLabel.length) {
                                        tipElem = elemLabel;
                                    } else {
                                        tipElem = _elem
                                    }
                                    tipElem.tips({
                                        content: '请选中该项',
                                        direct: 'bottom',
                                        type: 'error'
                                    });
                                    tipElem.one('click', function() {
                                        $(this).tips({
                                            content: 'hide'
                                        });
                                    });
                                    _invalidHandler.call(_elem);
                                } else if ($.trim(_elem.val()) === '') {
                                    _elem.tips({
                                        content: '该项不能为空',
                                        direct: 'bottom',
                                        type: 'error'
                                    });
                                    _elem.one('keyup', function() {
                                        $(this).tips({
                                            content: 'hide'
                                        });
                                    });
                                    _invalidHandler.call(_elem);
                                }
                            }
                            if ($.trim(_elem.val()) !== '' && _elem.attr('data-pattern')) {
                                if (!this.verify(_elem)) {
                                    _invalidHandler.call(_elem);
                                }
                            }
                        }
                        return submitable;
                    }
                }
            },
            validator;
        // init validator
        validator = new Validator();
        _body.on('blur', 'input[data-pattern]', function() {
            validator.verify(this);
        });
        _body.on('submit', 'form[data-verify]', function(e) {
            if (!validator.verifyForm(e)) {
                e.preventDefault();
                e.stopImmediatePropagation(); // for ajax form
            }
        });
        _body.on('keyup', 'input[data-verify-keyup=on]', function(e) {
            validator.verify(this);
        });
        // opera
        if (/Chrome.*?OPR/.test(navigator.userAgent)) {
            _body.on('click', 'form[data-verify] .btn-submit', function(e) {
                var _ = {
                    currentTarget: this.form
                }
                if (!validator.verifyForm(_)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            });
        }
        return validator;
    }, true);
})(window.Diysite, jQuery, undefined);
