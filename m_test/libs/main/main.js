var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var api;
(function (api) {
    var UserData = (function () {
        function UserData() {
            this.$coins = 0;
        }
        //玩家名称
        UserData.prototype.setUserName = function (value) {
            this.$userName = value;
        };
        ;
        UserData.prototype.getUserName = function () {
            return this.$userName;
        };
        ;
        //玩家金币           
        UserData.prototype.setUserCoins = function (value) {
            this.$coins = value;
        };
        ;
        UserData.prototype.getUserCoins = function () {
            return this.$coins;
        };
        ;
        //玩家头像
        UserData.prototype.setUserIcon = function (value) {
            this.$icon = value;
        };
        ;
        UserData.prototype.getUserIcon = function () {
            return this.$icon;
        };
        ;
        UserData.prototype.getOpenId = function () {
            return this.$openId;
        };
        ;
        UserData.prototype.setOpenId = function (value) {
            this.$openId = value;
        };
        ;
        return UserData;
    }());
    api.UserData = UserData;
    __reflect(UserData.prototype, "api.UserData", ["api.IUserData"]);
})(api || (api = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var AssetAdapter = (function () {
    function AssetAdapter() {
    }
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
        function onGetRes(data) {
            compFunc.call(thisObject, data, source);
        }
        if (RES.hasRes(source)) {
            var data = RES.getRes(source);
            if (data) {
                onGetRes(data);
            }
            else {
                RES.getResAsync(source, onGetRes, this);
            }
        }
        else {
            RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
        }
    };
    return AssetAdapter;
}());
__reflect(AssetAdapter.prototype, "AssetAdapter", ["eui.IAssetAdapter"]);
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        // egret.lifecycle.onPause = () => {
        //     egret.ticker.pause();
        // }
        // egret.lifecycle.onResume = () => {
        //     egret.ticker.resume();
        // }
        // this.runGame().catch(e => {
        //     console.log(e);
        // })
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
var CallBackVo = (function () {
    function CallBackVo(_handler, _thisObj) {
        if (_handler === void 0) { _handler = null; }
        if (_thisObj === void 0) { _thisObj = null; }
        var _arg = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            _arg[_i - 2] = arguments[_i];
        }
        this.once = false;
        this.handeler = _handler;
        this.thisObj = _thisObj;
        this.arg = _arg;
    }
    CallBackVo.prototype.apply = function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        if (arg && arg.length > 0) {
            this.arg = arg;
        }
        return this.handeler.apply(this.thisObj, this.arg);
    };
    CallBackVo.prototype.free = function () {
        this.handeler = null;
        this.thisObj = null;
        this.arg = null;
        this.once = null;
    };
    return CallBackVo;
}());
__reflect(CallBackVo.prototype, "CallBackVo");
var CEvent = (function (_super) {
    __extends(CEvent, _super);
    /**
     * 构造
     * @param	p_type			事件名
     * @param	p_data			单元数据
     * @param	p_bubbles		是否参与冒泡
     * @param	p_cancelable	是否可以取消 Event 对象
     */
    function CEvent(p_type, p_data, p_bubbles, p_cancelable) {
        if (p_data === void 0) { p_data = null; }
        if (p_bubbles === void 0) { p_bubbles = false; }
        if (p_cancelable === void 0) { p_cancelable = false; }
        var _this = _super.call(this, p_type, p_bubbles, p_cancelable) || this;
        _this._data = p_data;
        return _this;
    }
    Object.defineProperty(CEvent.prototype, "data", {
        /**
         * 自定义数据.
         * 发送事件时会将此数据一起发送出去，侦听事件的对象可以通过e.data来获得发送的数据。
         */
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    return CEvent;
}(egret.Event));
__reflect(CEvent.prototype, "CEvent");
var api;
(function (api) {
    var Alert = (function (_super) {
        __extends(Alert, _super);
        function Alert(message, button, callback, context) {
            if (button === void 0) { button = 1; }
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            var _this = _super.call(this, "common", "alerView") || this;
            _this._message = message;
            _this._button = button;
            if (callback != null) {
                _this._callback = gameTool.poolList.getInstance(FunctionInfo);
                _this._callback.sleep = false;
                _this._callback.fun = callback;
                _this._callback.context = context;
                _this._callback.args = args;
            }
            if (_this.txt) {
                _this.txt.text = _this._message;
            }
            return _this;
        }
        Alert.prototype.initView = function () {
            this.txt = this.getTextField("txt");
            this.select = this._ui.getController("select");
            if (this._button == Alert.OK) {
                this.select.selectedPage = "1";
            }
            else {
                this.select.selectedPage = "2";
            }
            this.txt.text = this._message;
        };
        Alert.prototype.onClick = function (e) {
            switch (e.currentTarget.name) {
                case "closeButton":
                case "cannel":
                    if (this._callback != null) {
                        this._callback.args = [Alert.CANCEL].concat(this._callback.args);
                        this._callback.call();
                    }
                    this.dispose();
                    break;
                case "ok1":
                case "ok0":
                    if (this._callback != null) {
                        this._callback.args = [Alert.OK].concat(this._callback.args);
                        this._callback.call();
                    }
                    this.dispose();
                    break;
            }
        };
        Alert.prototype.dispose = function () {
            if (this._callback != null) {
                gameTool.poolList.remove(this._callback);
                this._callback = null;
            }
            _super.prototype.dispose.call(this);
        };
        Alert.OK = 1;
        Alert.CANCEL = 2;
        Alert.OK_CANCEL = 3;
        return Alert;
    }(gui.OvBase));
    api.Alert = Alert;
    __reflect(Alert.prototype, "api.Alert");
    var FunctionInfo = (function () {
        function FunctionInfo() {
        }
        FunctionInfo.prototype.dispose = function () {
            this.fun = null;
            this.context = null;
            this.args = null;
        };
        FunctionInfo.prototype.call = function () {
            if (this.sleep) {
                return;
            }
            if (typeof this.fun == "string") {
                this.context[this.fun] = this.args ? this.args[0] : null;
            }
            else {
                this.fun.apply(this.context, this.args);
            }
        };
        FunctionInfo.prototype.onceCall = function () {
            this.call();
            gameTool.poolList.remove(this);
            this.dispose();
        };
        return FunctionInfo;
    }());
    api.FunctionInfo = FunctionInfo;
    __reflect(FunctionInfo.prototype, "api.FunctionInfo");
    function createAlert(message, buttons, callback, context) {
        if (buttons === void 0) { buttons = 1; }
        if (callback === void 0) { callback = null; }
        if (context === void 0) { context = null; }
        var args = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            args[_i - 4] = arguments[_i];
        }
        var alert = new (Alert.bind.apply(Alert, [void 0, message, buttons, callback, context].concat(args)))();
        gui.addBox(alert);
        //	this.alert.addEventListener(GameEvent.DISPOSED,this.onAlertRemove,this);
        return alert;
    }
    api.createAlert = createAlert;
})(api || (api = {}));
var api;
(function (api) {
    var GlobalAPI = (function () {
        function GlobalAPI() {
        }
        GlobalAPI.initView = function (value) {
            this.localData = new api.LocalData();
            this.webSocket = new api.Network();
            this.userData = new api.UserData();
            this.moduleManager = new ModuleManager();
            this.soundManager = new SoundManagers(value);
        };
        return GlobalAPI;
    }());
    api.GlobalAPI = GlobalAPI;
    __reflect(GlobalAPI.prototype, "api.GlobalAPI");
})(api || (api = {}));
var api;
(function (api) {
    var LocalData = (function () {
        function LocalData() {
        }
        LocalData.prototype.get = function (item) {
            return egret.localStorage.getItem(item);
        };
        LocalData.prototype.set = function (item, value) {
            egret.localStorage.setItem(item, value);
        };
        LocalData.prototype.remove = function (item) {
            egret.localStorage.removeItem(item);
        };
        return LocalData;
    }());
    api.LocalData = LocalData;
    __reflect(LocalData.prototype, "api.LocalData", ["api.ILocalData"]);
})(api || (api = {}));
var api;
(function (api) {
    var Request = (function () {
        function Request() {
        }
        Request.prototype.Request = function () {
        };
        return Request;
    }());
    __reflect(Request.prototype, "Request");
    var MessageType;
    (function (MessageType) {
        MessageType[MessageType["None"] = 0] = "None";
        MessageType[MessageType["Response"] = 1] = "Response";
        MessageType[MessageType["Request"] = 2] = "Request";
        MessageType[MessageType["Notify"] = 3] = "Notify"; //向其他服务器发送监控信息,无需回包
    })(MessageType || (MessageType = {}));
    var Network = (function () {
        function Network() {
            this.callbacks = {}; //注册的消息
            this.requests = {}; //装消息的数组 k值得出
            this.losts = []; //保持请求的消息
            this.showMessage = true; //debug下发送打印
            this.reconnect = -1; //在指定的延迟（以毫秒为单位）后运行指定的函数。 用于清除 
            this.timer = null; //用于清除
            this.handledMsg = [];
            this.requestid = egret.getTimer() % 20000;
        }
        /**
         * 登陆
         */
        Network.prototype.login = function (p) {
            var openId = p;
            api.GlobalAPI.webSocket.request(GameEvent.Login, { open_id: openId }, function (data) {
                if (data["msg"] == "登陆成功" || data["msg"] == "游戏已结束") {
                    //账号登录成功、进入游戏
                    //		api.GlobalAPI.soundManager.changeMusic(true);
                    gui.addScene(DoorView);
                }
                else if (data["msg"] == "游戏未开始") {
                }
                else if (data["msg"] == "游戏界面") {
                }
            }, function (event, code, msg) {
                console.error("无法连接游戏服务器,请确认网络连接无异常.[code:%s,msg:%s]", code, msg);
            });
        };
        /**
         * 连接服务器
         */
        Network.prototype.connectServer = function (host, callback, param) {
            var ip = host.substr(0, host.indexOf(":"));
            var port = parseInt(host.substr(host.indexOf(":") + 1, host.length));
            this.loginCallback = callback;
            if (this.connect(ip, port)) {
                callback && callback(param);
                this.loginCallback = null;
            }
            if (this.timer != null) {
                this.timer = egret.setInterval(this.timeCheck, this, 1000);
            }
        };
        Network.prototype.notify = function (event, param) {
            event = event.toLocaleLowerCase();
            var head = {
                messageType: MessageType.Notify,
                event: event,
                sequence: 0
            };
            if (!this.host && this.port) {
                return;
            }
            if (!this.webSocket || !this.webSocket.connected) {
                this.losts.push({ head: head, param: param });
                this.connect(this.host, this.port);
                return;
            }
            if (true) {
                if (this.showMessage) {
                    console.log('[send]: %s:%s', event, JSON.stringify(param));
                }
            }
            this.write(head, param);
        };
        Network.prototype.request = function (op, param, calllback, err) {
            op = op.toLocaleLowerCase();
            //发送消息
            var req = new Request();
            req.id = this.requestid++;
            req.event = op;
            req.param = param || {};
            req.callback = calllback;
            req.errcb = err;
            this.requests[req.id] = req; //记录请求
            //调整requestid
            if (this.requestid >= 30000) {
                this.requestid = 1;
            }
            var head = {
                messageType: MessageType.Request,
                event: op,
                sequence: req.id
            };
            if (!this.webSocket || !this.webSocket.connected) {
                this.losts.push({ head: head, param: param });
                this.connect(this.host, this.port);
                return;
            }
            if (true) {
                if (this.showMessage) {
                    console.log('[send]: %s:%s', op, JSON.stringify(param));
                }
            }
            this.write(head, param);
            req.sendTime = egret.getTimer() / 1000;
            //timeUtils.time.timestamp();    //记录发送消息给后端的时间点
        };
        ;
        /**
         * 添加消息监听
         */
        Network.prototype.on = function (op, callback, err) {
            op = op.toLocaleLowerCase();
            //发起对event的监听
            var list = this.callbacks[op] || (this.callbacks[op] = []);
            if (err) {
                callback['errcb'] = err;
            }
            if (list.indexOf(callback) == -1) {
                list.push(callback);
            }
        };
        ;
        /**
         * 移除消息监听
         */
        Network.prototype.off = function (op, callback) {
            op = op.toLocaleLowerCase();
            //取消对event的监听
            var list = this.callbacks[op];
            if (!list) {
                return;
            }
            if (!callback) {
                this.callbacks[op] = [];
                return;
            }
            for (var i = list.length - 1; i >= 0; i--) {
                if (list[i] === callback) {
                    list.splice(i, 1);
                }
            }
        };
        ;
        /**
         * 是否连接服务器
         */
        Network.prototype.connected = function (host, port) {
            return this.webSocket && this.webSocket.connected;
        };
        ;
        Network.prototype.requestLost = function () {
            var _this = this;
            this.losts.forEach(function (req) {
                if (true) {
                    if (_this.showMessage) {
                        console.log('[send]: %s:[%s]', req.head.event, JSON.stringify(req.param));
                    }
                }
                _this.write(req.head, req.param);
            });
            this.losts = [];
        };
        ;
        Network.prototype.close = function () {
            this.webSocket && this.webSocket.close();
        };
        ;
        Network.prototype.connect = function (host, port) {
            if (this.webSocket && this.webSocket.connected && this.host == host && this.port == port) {
                //有webSocket 有连接服务器 host 端口号一致
                return true;
            }
            if (api.GlobalAPI.localData.get("ShowDebugMessage") == "ON") {
                //是否显示debug的消息
                this.showMessage = true;
            }
            this.host = host;
            this.port = port;
            if (!this.webSocket) {
                //创建webSocket对象
                this.webSocket = new egret.WebSocket();
                //设置数据格式为二进制,默认认为字符串
                this.webSocket.type = egret.WebSocket.TYPE_BINARY;
                //添加收到数据侦听,收到数据会调用此方法
                this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
                //添加链接打开侦听,连接成功会调用此方法
                this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
                //添加链接关闭侦听,手动关闭或者服务器关闭连接会调用此方法
                this.webSocket.addEventListener(egret.Event.CLOSE, this.onClosed, this);
                //添加异常侦听，出现异常会调用此方法
                this.webSocket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
            }
            try {
                this.webSocket.close();
                var hostList = host.split(".");
                var isHttps = false;
                for (var k in hostList) {
                    if (!Number(hostList[k])) {
                        isHttps = true;
                        break;
                    }
                }
                if (!isHttps) {
                    egret.setTimeout(this.webSocket.connect, this.webSocket, 0, host, port);
                }
                else {
                    egret.setTimeout(this.webSocket.connectByUrl, this.webSocket, 0, 'wss://' + host);
                }
            }
            catch (error) {
                this.onError(error);
            }
        };
        Network.prototype.onReceiveMessage = function () {
            //创建 ByteArray 对象
            var byte = new egret.ByteArray();
            //读取数据
            this.webSocket.readBytes(byte);
            var head = {
                messageType: 0,
                srcType: 0,
                srcId: 0,
                descType: 0,
                descId: 0,
                event: "",
                sequence: 0,
                errcode: 0,
            };
            head.messageType = byte.readByte();
            head.srcType = byte.readByte();
            head.srcId = (byte.readInt() << 32) + byte.readInt();
            head.descType = byte.readByte();
            head.descId = (byte.readInt() << 32) + byte.readInt();
            head.event = byte.readUTF().toLocaleLowerCase();
            head.sequence = byte.readShort();
            head.errcode = byte.readShort();
            var msghash = head.event + '@' + head.sequence;
            if (head.messageType == MessageType.Response && this.handledMsg.indexOf(msghash) > -1) {
                //消息处理过
                return;
            }
            var body = head.errcode != 0 ? byte.readUTF : JSON.parse(byte.readUTF());
            if (true) {
                if (this.showMessage) {
                    console.log('[receive]: %s:%s', head.event, JSON.stringify(body));
                }
            }
            var list = this.callbacks[head.event];
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    var fn = list[i];
                    if (!fn) {
                        continue;
                    }
                    if (head.errcode) {
                        var errcb = fn['errcb'] || this.defaultErrCb;
                        errcb(head.event, head.errcode, body);
                    }
                    else {
                        fn(body);
                    }
                }
            }
            var req = null;
            if (head.sequence != 0 && (req = this.requests[head.sequence])) {
                delete this.requests[head.sequence];
                if (head.errcode) {
                    var errcb0 = req.errcb || this.defaultErrCb;
                    errcb0(head.event, head.errcode, body);
                }
                else {
                    if (req.callback) {
                        req.callback(body);
                    }
                }
            }
            if (!list && !req) {
                console.error('未监听服务端[%s]消息', head.event);
            }
            if (head.messageType == MessageType.Response) {
                this.handledMsg.unshift(msghash);
                if (this.handledMsg.length > 30) {
                    this.handledMsg.pop();
                }
            }
        };
        Network.prototype.timeCheck = function () {
            var now = egret.getTimer() / 1000;
            //timeUtils.time.timestamp();     //1970 到现在的获取时间戳
            for (var key in this.requests) {
                var req = this.requests[key];
                if (req.sendTime < now - 15000) {
                    req.sendTime = now;
                    var head = {
                        messageType: MessageType.Request,
                        event: req.event,
                        sequence: req.id
                    };
                    if (!this.webSocket || this.webSocket.connected) {
                        //没有webSocket 或者 没有连接服务器 记录 请求数据重新连接
                        this.losts.push({ 'head': head, 'param': req.param });
                        this.connect(this.host, this.port);
                        return;
                    }
                    console.log('消息重发：%s, %s', req.event, req.id);
                    this.write(head, req.param);
                }
            }
        };
        Network.prototype.write = function (head, message) {
            //创建 ByteArray 对象
            var byte = new egret.ByteArray();
            byte.writeByte(head.messageType); //消息类型
            byte.writeShort(head.sequence); //消息序列号
            byte.writeUTF(head.event); //数据类型
            byte.writeUTF(JSON.stringify(message)); //消息体
            byte.position = 0;
            //发送数据
            this.webSocket.writeBytes(byte, 0, byte.bytesAvailable);
        };
        Network.prototype.onSocketOpen = function () {
            if (true) {
                console.log("The connection is successful, : " + this.host + ":" + this.port);
            }
            if (this.loginCallback) {
                this.loginCallback(this.loginparam);
                this.loginCallback = null;
            }
            else {
                this.login(this.loginparam);
            }
        };
        Network.prototype.onClosed = function () {
            this.webSocket.close();
        };
        Network.prototype.onError = function (error) {
            var _this = this;
            if (this.reconnect != -1) {
                return;
            }
            api.createAlert('网络连接失败3秒后重试', 1);
            //在指定的延迟（以毫秒为单位）后运行指定的函数。 用于清除
            this.reconnect = egret.setTimeout(function () {
                _this.connect(_this.host, _this.port);
                _this.reconnect = -1;
            }, this, 3000);
        };
        Network.prototype.defaultErrCb = function (event, code, msg) {
            console.log("消息[%s]处理失败, 错误码:%s, 附加消息:%s", event, code, msg);
        };
        return Network;
    }());
    api.Network = Network;
    __reflect(Network.prototype, "api.Network", ["api.INetWork"]);
})(api || (api = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    LoadingUI.prototype.createView = function () {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        this.textField.text = "Loading..." + current + "/" + total;
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
var SoundManagers = (function () {
    function SoundManagers(stage) {
        /**
         * 背景音乐音量
         */
        this.volume = 0.2;
        this.effvolume = 0.2;
        this._lastMusic = "resource/sounds/bgmusic.mp3";
        /********************************音效*********************************** */
        this._soundFlag = false;
        /*****************************音乐*******************************/
        this._musicFlag = false; //背景音乐是否播放
        /**
         * 游戏界面音乐
         */
        this.isInPlay = false;
        this.allChannel = []; //所有音效的声道
        this.isComplete = [false, false]; //是否加载完成 
        stage.addEventListener(egret.Event.DEACTIVATE, this.onBlur, this);
        stage.addEventListener(egret.Event.ACTIVATE, this.onFocus, this);
    }
    SoundManagers.prototype.changeSound = function (p_flag) {
        if (this._soundFlag != p_flag) {
            this._soundFlag = p_flag;
        }
    };
    /**
     * 播放特效音乐
     */
    SoundManagers.prototype.playEffect = function (res, volume) {
        if (!this._soundFlag) {
            return;
        }
        RES.getResAsync(res, function () {
            var effect = RES.getRes(res);
            effect.type = egret.Sound.EFFECT;
            var channel = effect.play(0, 1);
            channel.volume = volume ? volume : this.effvolume;
        }, this);
    };
    SoundManagers.prototype.playEffectBuYrl = function (p_url, p_loop, p_volume) {
        var _this = this;
        if (!this._soundFlag) {
            return;
        }
        var effect = new egret.Sound();
        effect.load(p_url);
        effect.addEventListener(egret.Event.COMPLETE, function () {
            var channel = effect.play(0, p_loop ? p_loop : 0);
            channel.volume = p_volume ? p_volume : _this.effvolume;
            effect["channel"] = channel;
        }, this);
        return effect;
    };
    SoundManagers.prototype.changeMusic = function (p_flag) {
        if (this._musicFlag != p_flag) {
            this._musicFlag = p_flag;
            if (this._musicFlag) {
                if (this.isInPlay) {
                    this.playRedBGM(true);
                }
                else {
                    this.playBGM("resource/sounds/bgmusic.mp3");
                }
            }
            else {
                this.pauseBGM();
            }
        }
    };
    SoundManagers.prototype.playRedBGM = function (notRec) {
        if (notRec === void 0) { notRec = false; }
        this.playBGM("resource/sounds/bgmusic.mp3");
        this.isInPlay = true;
    };
    /**
     * 播放音乐
     */
    SoundManagers.prototype.playBGM = function (name, notRec) {
        var _this = this;
        if (notRec === void 0) { notRec = false; }
        if (!notRec) {
            this.preBGM = this._lastMusic; //记录上一次的音乐
        }
        this._lastMusic = name; //这次的音乐赋值
        if (!this._musicFlag) {
            return;
        }
        if (this.isPause && this.pauseMusic == name) {
            this.resumeBGM();
            return;
        }
        this.disposeSound(); //释放音乐资源
        RES.getResByUrl(this._lastMusic, function (p_sound) {
            _this._sound = p_sound;
            _this._sound.type = egret.Sound.MUSIC;
            if (_this._soundChannel) {
                _this._soundChannel.stop();
            }
            _this._soundChannel = _this._sound.play(0, -1);
            _this._soundChannel.volume = _this.volume * 0.2;
        }, this, "sound");
    };
    SoundManagers.prototype.pauseBGM = function () {
        if (this._soundChannel && !this._soundChannel["isStopped"]) {
            this._soundChannel.volume = 0;
            this.pauseMusic = this._lastMusic;
            this.isPause = true;
        }
    };
    /**
     * 继续播放音乐
     */
    SoundManagers.prototype.resumeBGM = function () {
        if (this._musicFlag) {
            if (this._soundChannel && !this._soundChannel["isStopped"]) {
                this._soundChannel.volume = this.volume * 0.2;
                this.isPause = false;
            }
        }
    };
    /*************************************************************************/
    SoundManagers.prototype.onBlur = function () {
        this.pauseBGM(); //暂停背景音乐
    };
    SoundManagers.prototype.onFocus = function () {
        this.resumeBGM(); //继续背景音乐
    };
    SoundManagers.prototype.playPreBGM = function () {
        this.playBGM(this.preBGM);
        this.isInPlay = false;
    };
    /**
     * 重置BGM
     */
    SoundManagers.prototype.resetBGM = function () {
        this.playBGM("resource/sounds/bgmusic.mp3");
        this.isInPlay = false;
    };
    /**
     * 音乐加载
     */
    SoundManagers.prototype.soundLoaded = function () {
        if (!this._musicFlag) {
            return;
        }
        this._sound = RES.getRes(this._lastMusic);
        this._sound.type = egret.Sound.MUSIC;
        this._soundChannel = this._sound.play(0, -1);
        this._soundChannel.volume = this.volume;
    };
    /**
     * 释放音乐资源
     */
    SoundManagers.prototype.disposeSound = function () {
        if (this._soundChannel) {
            this._soundChannel.stop();
            this._soundChannel = null;
        }
        if (this._sound) {
            this._sound.removeEventListener(egret.Event.COMPLETE, this.soundLoaded, this);
        }
    };
    /**
     * 声音初始化加载
     */
    SoundManagers.prototype.soundInit = function () {
        var _this = this;
        if (this.allSound == null) {
            this.allSound = [];
            var arr = ['resource/sounds/shootApp_1.mp3', 'resource/sounds/shootApp_2.mp3',
                'resource/sounds/shootApp_3.mp3', 'resource/sounds/shootBla_1.mp3',
                'resource/sounds/shootBla_2.mp3', 'resource/sounds/shootBla_3.mp3',
                'resource/sounds/shoot_1.mp3', 'resource/sounds/shoot_2.mp3',
                'resource/sounds/shoot_3.mp3', 'resource/sounds/shoot_4.mp3',
                'resource/sounds/ps_1.mp3', 'resource/sounds/ps_2.wav',
                'resource/sounds/ps_3.mp3', 'resource/sounds/ps_4.mp3'];
            for (var i = 0; i < arr.length; i++) {
                this.isComplete[i] = false;
                this.allSound.push(new egret.Sound());
                this.allSound[i].load(arr[i]);
                this.allSound[i].addEventListener(egret.Event.COMPLETE, function (data) {
                    _this.isComplete[_this.allSound.indexOf(data.currentTarget)] = true;
                    if (_this.allReadly() && i >= arr.length) {
                        notification.postNotification("ready");
                    }
                }, this);
            }
        }
    };
    /**
     * 清除音效
    */
    SoundManagers.prototype.cleanChannel = function (num) {
        if (this.allChannel[num]) {
            this.allChannel[num].stop();
            this.allChannel[num] = null;
        }
    };
    /**
     * 创建音效
    */
    SoundManagers.prototype.createChannel = function (num, n, m, w) {
        if (m === void 0) { m = 0; }
        if (w === void 0) { w = 1; }
        if (!this.isComplete[num]) {
            return;
        }
        this.cleanChannel(num);
        if (!api.GlobalAPI.soundManager._soundFlag) {
            return;
        }
        this.allChannel[num] = this.allSound[num].play(m, w);
        this.allChannel[num].volume = n;
        this.allSound[num]["channel"] = this.allChannel[num];
    };
    /**
     * 删除所有音效
    */
    SoundManagers.prototype.disposeAllSound = function () {
        if (this.allSound != null) {
            for (var i = 0; i < this.allSound.length; i++) {
                if (this.allChannel[i]) {
                    this.allChannel[i].stop();
                    this.allChannel[i] = null;
                }
                if (this.allSound[i]) {
                    this.allSound[i] = null;
                }
                this.isComplete[i] = false;
            }
            this.allSound = null;
        }
    };
    /**
     * 都准备好了
    */
    SoundManagers.prototype.allReadly = function () {
        for (var i = 0; i < this.isComplete.length; i++) {
            if (!this.isComplete[i]) {
                return false;
            }
        }
        return true;
    };
    return SoundManagers;
}());
__reflect(SoundManagers.prototype, "SoundManagers");
var base;
(function (base) {
    var BaseModule = (function (_super) {
        __extends(BaseModule, _super);
        function BaseModule() {
            var _this = _super.call(this) || this;
            /**
             * 是否缓存
             */
            _this.isCache = true;
            _this.isApplying = false;
            return _this;
        }
        BaseModule.prototype.enter = function (p_moduleInfo) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this._moduleInfo = p_moduleInfo;
            loadUtil.loadConfigItems(mathTool.pluck(this.getConfigs(), "path"), function () {
                p_moduleInfo.coreClass["data"] = new p_moduleInfo.dataClass;
                _this.open.apply(_this, args);
                _this.initData.apply(_this, args);
                //		FWFacade.inst.sendNotification(ModuleManager.MODULE_OPENED, { moduleName: this._moduleName });
            }, this, mathTool.pluck(this.getConfigs(), "parse"), this);
        };
        BaseModule.prototype.initData = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            //	this._mediator.initData.apply(this._mediator, args);
        };
        BaseModule.prototype.open = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // fairygui.UIPackage.addPackage(this.moduleName);
            //		this._mediator.open.apply(this._mediator, args);
            this.isApplying = true;
        };
        BaseModule.prototype.close = function () {
            this.isApplying = false;
            //		FWFacade.inst.removeMediator(this._mediator.mediatorName);
            this._moduleInfo.coreClass["data"]["dispose"]();
            this._moduleInfo.coreClass["dispose"]();
            //		this._mediator.dispose();
            this._groups = null;
            // this._mediator = null;
            // this.dispatchEvent(new CEvent(ModuleManager.MODULE_CLOSED));
            // FWFacade.inst.sendNotification(ModuleManager.MODULE_CLOSED, { moduleName: this._moduleName });
        };
        /**
         * 加载配置
         */
        BaseModule.prototype.getConfigs = function () {
            return [];
        };
        /**
         * 加载资源组
         */
        BaseModule.prototype.loadGroup = function (group, loadingType, fun, context) {
            if (loadingType === void 0) { loadingType = 0; }
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            loadUtil.loadGroup.apply(loadUtil, [group, null, fun, context].concat(args));
            mathTool.addValueByArray(group, this._groups);
        };
        /******************************************************************/
        /**
         * 销毁缓存
         */
        BaseModule.prototype.destroyCache = function () {
            // let len = this._groups.length;
            // for (let i = 0; i < len; i++) {
            //     let arr = RES.getGroupByName(this._groups[i]);
            //     let len = arr.length;
            //     for (let j = 0; j < len; j++) {
            //        RES.destroyRes(arr[j].name);
            //     }
            // }
        };
        Object.defineProperty(BaseModule.prototype, "moduleName", {
            /******************************************************************/
            get: function () {
                return this._moduleName;
            },
            set: function (value) {
                this._moduleName = value;
                this._packageName = "module_" + this._moduleName;
                this._groups = [value];
            },
            enumerable: true,
            configurable: true
        });
        return BaseModule;
    }(egret.EventDispatcher));
    base.BaseModule = BaseModule;
    __reflect(BaseModule.prototype, "base.BaseModule");
})(base || (base = {}));
var base;
(function (base) {
    var BaseModuleCore = (function () {
        function BaseModuleCore() {
        }
        return BaseModuleCore;
    }());
    base.BaseModuleCore = BaseModuleCore;
    __reflect(BaseModuleCore.prototype, "base.BaseModuleCore");
})(base || (base = {}));
// module loadUtil {
// 	export class Load {
// 		public constructor() {
// 			this._groupListens = [];
// 		}
// 		/**
// 		 * 加载资源组
// 		 * @param group 资源组名称
// 		 * @param fun   回调函数
// 		 * @param context 上下文
// 		 * @param args  参数
// 		 */
// 		loadGroup(group:string,loadingType:number=LoadUIType.NORMAL,fun:(...args)=>any,context:any,...args)
// 		{
// 			this._groupName = group;
// 			if(RES.isGroupLoaded(this._groupName)){
// 				//判断是否有加载这个资源组
// 				this._loadingView = null;
// 				fun.apply(context,args);
// 			}else{
// 				if(loadingType != LoadUIType.NONE){
// 					//显示进度条
// 					switch(loadingType)
// 					{
// 						case LoadUIType.NORMAL:
// 							if(!this._loadingView){
// 								gui.addBox(this._loadingView);
// 							}else if(!this._loadingView.isShowing)
// 							{
// 								this._loadingView.show();
// 							}
// 							break;
// 					}
// 				}
// 			}
// 			var callBack : CallBackVo = new CallBackVo(fun,context,args);
// 			this._groupListens[this._groupName] = callBack;
// 			RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupComplete, this);
// 			RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
// 			RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
// 			RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
// 			RES.loadGroup(this._groupName);
// 		}
// 		/**
// 		 * 资源组加载完成
// 		 */
// 		private onGroupComplete(e: RES.ResourceEvent): void {
//             if (this._loadingView) {
//                 this._loadingView.hide();
//             }
//             var callBack: CallBackVo = this._groupListens[e.groupName];
//             if (callBack) {
//                 callBack.apply();
//                 this._groupListens[e.groupName] = null;
//                 delete this._groupListens[e.groupName];
//             }
//         }
// 		 /******************************************************************/
//         /**
//          * 资源组加载出错
//          *  The resource group loading failed
//          */
//         private onItemLoadError(event: RES.ResourceEvent): void {
//             console.warn("资源组加载项加载出错 Url:" + event.resItem.url + " has failed to load");
//         }
//         /**
//          * 资源组加载出错
//          * Resource group loading failed
//          */
//         private onResourceLoadError(event: RES.ResourceEvent): void {
//             //TODO
//             console.warn("资源组加载出错 Group:" + event.groupName + " has failed to load");
//             //忽略加载失败的项目
//         }
//         /**
//          * preload资源组加载进度
//          * loading process of preload resource
//          */
//         private onResourceProgress(event: RES.ResourceEvent): void {
//         //    this._loadingView && this._loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
//         }
// 		private _groupName : string;         //资源组名字
// 		private _groupListens: CallBackVo[]; //回调方法
// 		private _loadingView : LoadingUI;   //进度条界面
// 	}
// 	/***********************************************方法******************************************** */
// 	/**
// 	 * 加载资源组
// 	 */
// 	export function loadGroup(group: string, loadingType: number = LoadUIType.NORMAL, fun: (...args) => any, context: any, ...args)
// 	{
// 		gameTool.singleton(Load).loadGroup(group, loadingType, fun, context, ...args);
// 	}
// 	class LoadUIType
// 	{
// 		//不需要加载界面
// 		static NONE:number = 0;
// 		//默认加载界面
// 		static NORMAL:number = 1;
// 	}
// } 
var loadUtil;
(function (loadUtil) {
    /**
     * 进度条界面
     */
    var LoadingUI = (function (_super) {
        __extends(LoadingUI, _super);
        function LoadingUI() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return LoadingUI;
    }(gui.OvBase));
    loadUtil.LoadingUI = LoadingUI;
    __reflect(LoadingUI.prototype, "loadUtil.LoadingUI");
})(loadUtil || (loadUtil = {}));
var ModuleManager = (function () {
    /**
     * 构造函数
     */
    function ModuleManager() {
        this._moduleInfo = [];
    }
    /**
     * 打开模块
     */
    ModuleManager.prototype.openModule = function (p_moduleName, p_loadType, p_opendCallBack) {
        var _this = this;
        if (p_loadType === void 0) { p_loadType = 1; }
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var moduleInfo = this.getModuleInfo(p_moduleName);
        if (!moduleInfo) {
            //如果模块信息不存在进行加载
            loadUtil.loadGroup(p_moduleName, null, function () {
                moduleInfo = new ModuleInfo();
                moduleInfo.moduleName = p_moduleName; //名字赋值
                var suffix = true ? ".js" : "min.js";
                var key = "module_" + p_moduleName; //模块的名字都是module_+p_moduleName;
                var jsUrl = "resource/assets/module/" + p_moduleName + "/" + p_moduleName + suffix; //加载的js的路径
                var script = document.createElement("script"); //在html里创建一个script标签
                script.src = jsUrl; //路径赋值
                script.onload = function () {
                    eval("moduleInfo.mainClass= " + key + ".Main");
                    //      eval("moduleInfo.mediatorClass= " + key + ".Mediator");
                    eval("moduleInfo.coreClass= " + key + ".Core");
                    eval("moduleInfo.dataClass= " + key + ".Data");
                    _this._moduleInfo[p_moduleName] = moduleInfo;
                    _this.applyModule.apply(_this, [moduleInfo, p_opendCallBack].concat(args));
                };
                document.head.appendChild(script); //将标签添加执行
            }, this);
        }
        else {
            this.applyModule.apply(this, [moduleInfo, p_opendCallBack].concat(args));
        }
    };
    /**
     * 执行模块
     */
    ModuleManager.prototype.applyModule = function (p_moduleInfo, p_opendCallBack) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var currentModule = this.getModule(p_moduleInfo.moduleName);
        if (!currentModule) {
            currentModule = new p_moduleInfo.mainClass();
            p_moduleInfo.coreClass["main"] = currentModule;
            currentModule.moduleName = p_moduleInfo.moduleName;
            this._modules[p_moduleInfo.moduleName] = currentModule;
            currentModule.enter.apply(currentModule, [p_moduleInfo].concat(args));
            currentModule.addEventListener(ModuleManager.MODULE_CLOSED, this.onModuleClosed, this);
        }
        else {
            currentModule.open.apply(currentModule, args);
        }
        if (p_opendCallBack) {
            p_opendCallBack.apply();
        }
    };
    ModuleManager.prototype.onModuleClosed = function (e) {
        var p_moduleName = e.target.moduleName;
        this._modules[p_moduleName] = null;
        delete this._modules[p_moduleName];
    };
    /**
     * 通过模块名获取模块信息
     */
    ModuleManager.prototype.getModuleInfo = function (p_moduleName) {
        return this._moduleInfo[p_moduleName];
    };
    ModuleManager.prototype.getModule = function (p_moduleName) {
        return this._modules[p_moduleName];
    };
    ModuleManager.MODULE_CLOSED = "moduleClosed"; //关闭模块
    ModuleManager.MODULE_OPENED = "moduleOpened"; //打开模块
    return ModuleManager;
}());
__reflect(ModuleManager.prototype, "ModuleManager");
var ModuleInfo = (function () {
    function ModuleInfo() {
    }
    return ModuleInfo;
}());
__reflect(ModuleInfo.prototype, "ModuleInfo");
var DoorView = (function (_super) {
    __extends(DoorView, _super);
    function DoorView() {
        var _this = _super.call(this, "hallDoor", "mainView") || this;
        _this._type = 0;
        _this._num = 0;
        _this._dataFlag = false;
        return _this;
    }
    DoorView.prototype.dispose = function () {
        this.remove();
        _super.prototype.dispose.call(this);
    };
    //private _list : fairygui.GList;
    DoorView.prototype.open = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        for (var i = 0; i < 4; i++) {
            if (i < 2) {
                this._textList.push(this.getTextField("txt" + i));
            }
        }
        for (var x = 0; x < this._buttonList.length; x++) {
            this._buttonList[x].addEventListener(mouse.MouseEvent.ROLL_OVER, this.onRollOver, this);
            this._buttonList[x].addEventListener(mouse.MouseEvent.ROLL_OUT, this.onRollOut, this);
        }
        api.GlobalAPI.webSocket.request(GameEvent.GetAaminiAccountInfo, { open_id: api.GlobalAPI.userData.getOpenId }, this.useDataUpdate.bind(this));
    };
    DoorView.prototype.onRollOver = function (e) {
        var num = this._buttonList.indexOf(e.currentTarget);
        if (num > -1) {
            this._buttonList[num].setScale(1.1, 1.1);
        }
    };
    DoorView.prototype.onRollOut = function (e) {
        var num = this._buttonList.indexOf(e.currentTarget);
        if (num > -1) {
            this._buttonList[num].setScale(1, 1);
        }
    };
    /**
     * 初始化监听
     */
    DoorView.prototype.initEvent = function () {
        this.regedEvebt = {};
        this.regedEvebt[GameEvent.kickout] = this.kickoutF.bind(this);
        //	this.regedEvebt[GameEvent.data] = this.databack.bind(this);
        this.eventInit();
    };
    DoorView.prototype.kickoutF = function () {
        var _this = this;
        api.createAlert("账户在别处登陆，请重新连接", 1, function (type) {
            _this.dispose();
            gui.addScene(LoginView);
        });
    };
    DoorView.prototype.eventInit = function () {
        if (this.regedEvebt != null) {
            for (var o in this.regedEvebt) {
                api.GlobalAPI.webSocket.on(o, this.regedEvebt[o]);
            }
        }
    };
    /**
     * 消息移除
     */
    DoorView.prototype.eventRemove = function () {
        if (this.regedEvebt != null) {
            for (var o in this.regedEvebt) {
                api.GlobalAPI.webSocket.off(o, this.regedEvebt[o]);
            }
        }
    };
    DoorView.prototype.onClick = function (e) {
        _super.prototype.onClick.call(this, e);
        var num = this._buttonList.indexOf(e.currentTarget);
        if (num >= -1) {
            this._buttonList[num].setScale(1, 1);
        }
    };
    /**
     * 玩家数据更新
     */
    DoorView.prototype.useDataUpdate = function (data) {
        var _this = this;
        if (data["errorCode"] == 0) {
            //用户获取成功
            if (data["a"]) {
                if (data["a"]["id"]) {
                    api.GlobalAPI.userData.setUserName(data["a"]["id"]);
                }
                if (data["a"]["coins"]) {
                    api.GlobalAPI.userData.setUserCoins(data["a"]["coins"]);
                }
            }
        }
        else if (data["errorCode"] == 1) {
            //用户不存在
            api.createAlert("用户不存在,返回登录界面", 1, function (type) {
                if (type == 1) {
                    _this.dispose();
                    gui.addScene(LoginView);
                }
            });
        }
        else if (data["errorCode"] == 2) {
            //其他错误返回登录界面
            api.createAlert("其他错误返回登录界面", 1, function (type) {
                if (type == 1) {
                    _this.dispose();
                    gui.addScene(LoginView);
                }
            });
        }
        this.update();
    };
    /**
     * 界面更新
     */
    DoorView.prototype.update = function () {
        this.setText(0, api.GlobalAPI.userData.getUserName());
        this.setText(1, api.GlobalAPI.userData.getUserCoins());
    };
    /**********************************************************/
    DoorView.prototype.clickHandler = function (index) {
        var _this = this;
        _super.prototype.clickHandler.call(this, index);
        //		api.GlobalAPI.soundManager.changeSound(true);
        //		api.GlobalAPI.soundManager.playEffectBuYrl("resource/sounds/click.mp3",1);
        switch (index) {
            case 1://关闭界面
                api.GlobalAPI.webSocket.request(GameEvent.Logout, {}, function (data) {
                    if (data["msg"] == "退出登陆成功") {
                        _this.inRoom();
                    }
                });
                break;
            case 6://快速游戏
                this.clickInRoom(5);
                ModuleManager;
                //	this.dispose();
                //this.clickInRoom(3);
                break;
            case 2:
                this.dispose();
                window.open("");
                break;
            default:
                break;
        }
    };
    DoorView.prototype.inRoom = function () {
        this.dispose();
        setTimeout(function () {
            var ip = "47.52.32.227";
            var port = 9994;
            api.GlobalAPI.webSocket.connectServer(ip + ":" + port, function () {
                gui.addScene(LoginView);
            });
        }, 500);
    };
    DoorView.prototype.addCoinsBack = function (data) {
        if (data["a"]) {
            this.setText(1, data["a"]["coins"]);
        }
    };
    /**
     * 进入房间
     */
    DoorView.prototype.clickInRoom = function (num) {
    };
    DoorView.prototype.inRoomBack = function (data) {
    };
    DoorView.prototype.remove = function () {
        this._dataFlag = false;
        for (var x = 0; x < this._buttonList.length; x++) {
            this._buttonList[x].removeEventListener(mouse.MouseEvent.ROLL_OVER, this.onRollOver, this);
            this._buttonList[x].removeEventListener(mouse.MouseEvent.ROLL_OUT, this.onRollOut, this);
        }
    };
    return DoorView;
}(gui.OvBase));
__reflect(DoorView.prototype, "DoorView");
var GameEvent = (function () {
    function GameEvent() {
    }
    /**************************前后端交互信息*****************************/
    /**
     * (登陆) (open_id)  (是否登陆成功的msg)
     */
    GameEvent.Login = "miniGame.Login";
    /**
     * 登陆验证
     */
    GameEvent.AaAccountVerify = "miniGame.AaAccountVerify";
    /**
     * 注册
     */
    GameEvent.CreateAaminiAccount = "miniGame.CreateAaminiAccount";
    /**
     * （获取用户信息） (openId)  (errorCode（0.ok,1用户不存在，2，其他错误）)
     */
    GameEvent.GetAaminiAccountInfo = "miniGame.GetAaminiAccountInfo";
    GameEvent.kickout = "kickout"; //被顶号了
    GameEvent.Logout = "miniGame.Logout"; //退出
    return GameEvent;
}());
__reflect(GameEvent.prototype, "GameEvent");
var LoginView = (function (_super) {
    __extends(LoginView, _super);
    function LoginView() {
        return _super.call(this, "common", "loginView") || this;
    }
    LoginView.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    /**
     * 初始化界面 传入参数
     */
    LoginView.prototype.open = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.login = this._ui.getController("login");
        this.login.setSelectedIndex(0);
        for (var i = 0; i < 5; i++) {
            this._textList.push(this.getTextField("txt" + i));
        }
    };
    /**********************************************************/
    LoginView.prototype.clickHandler = function (index) {
        _super.prototype.clickHandler.call(this, index);
        //	api.GlobalAPI.soundManager.changeSound(true);
        //	api.GlobalAPI.soundManager.playEffect("click_mp3");
        switch (index) {
            case 1://开始游戏
                this.gotoLogin();
                break;
            case 2://前往注册
                this.setText(3, '');
                this.setText(4, '');
                this.setText(2, '');
                this.login.setSelectedIndex(1);
                break;
            case 3://注册
                this.createUserName();
                break;
            case 4: //关闭注册
            case 5:
                this.setText(0, '');
                this.setText(1, '');
                this.login.setSelectedIndex(0);
                break;
            default:
                break;
        }
    };
    /**
     * 前往登录
     */
    LoginView.prototype.gotoLogin = function () {
        if (this.getText(0) == '' || this.getText(1) == '') {
            api.createAlert("账号或密码不能为空");
            return;
        }
        api.GlobalAPI.webSocket.request(GameEvent.AaAccountVerify, { userName: this.getText(0), pwd: this.getText(1) }, this.callbackByAaA.bind(this), function (event, code, msg) {
            console.error("无法连接游戏服务器.请确认网络连接无异常.[code:%s, msg:%s]", code, msg);
            //	kernel.event.dispatchEventWith('ConnectLoaginError', false, msg);
        });
    };
    /**
     * 登录回调
     */
    LoginView.prototype.callbackByAaA = function (data) {
        if (data["errorCode"] == 0) {
            this.dispose();
            //账号登录成功、进入游戏
            api.GlobalAPI.userData.setOpenId(data["open_id"]);
            //		GlobalAPI.localData.set("open_id", data["open_id"]);
            api.GlobalAPI.webSocket.login(data["open_id"]);
            //	this.dispose();
        }
        else if (data["errorCode"] == 1) {
            //用户不成功
            api.createAlert("用户不存在");
        }
        else if (data["errorCode"] == 2) {
            //密码错误
            api.createAlert("/密码错误");
        }
        else if (data["errorCode"] == 3) {
            //其他错误登录失败
            api.createAlert("其他错误登录失败");
        }
    };
    /**
     * 注册
     */
    LoginView.prototype.createUserName = function () {
        api.GlobalAPI.webSocket.request(GameEvent.CreateAaminiAccount, { userName: this.getText(3), pwd: this.getText(4), email: this.getText(2) }, this.userNameBack.bind(this), function (event, code, msg) {
            console.error("无法连接游戏服务器.请确认网络连接无异常.[code:%s, msg:%s]", code, msg);
            //	kernel.event.dispatchEventWith('ConnectLoaginError', false, msg);
        });
    };
    LoginView.prototype.userNameBack = function (data) {
        if (data["errorCode"] == 0) {
            if (data["open_id"]) {
                api.GlobalAPI.userData.setOpenId(data["open_id"]);
                //	GlobalAPI.localData.set("open_id",data["open_id"]);
                this.setText(0, this.getText(3));
                this.setText(1, this.getText(4));
                this.gotoLogin();
            }
        }
        else if (data["errorCode"] == 1) {
            //用户已经存在
            api.createAlert("用户已经存在");
        }
        else if (data["errorCode"] == 2) {
            //用户名太长
            api.createAlert("用户名太长");
        }
        else if (data["errorCode"] == 3) {
            //用户名太短
            api.createAlert("用户名太短");
        }
        else if (data["errorCode"] == 4) {
            //用密码太短
            api.createAlert("密码太短太短");
        }
        else if (data["errorCode"] == 5) {
            //密码太长
            api.createAlert("密码太长");
        }
        else if (data["errorCode"] == 6) {
            //账号密码只能是字母或数字
            api.createAlert("账号密码只能是字母或数字");
        }
        else if (data["errorCode"] == 7) {
            //其他错误
            api.createAlert("其他错误");
        }
    };
    return LoginView;
}(gui.OvBase));
__reflect(LoginView.prototype, "LoginView");
