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
var LoadViewBase = (function (_super) {
    __extends(LoadViewBase, _super);
    function LoadViewBase(name) {
        return _super.call(this, name) || this;
    }
    /**
     * 初始化
     */
    LoadViewBase.prototype.initView = function () {
        this.txt = this._ui.getChild("txt").asTextField;
        this.imag = this._ui.getChild("imag").asImage;
        this._initWidth = this.imag.width;
        this.imag.width = 0;
    };
    /**
     * 进度条加载
     */
    LoadViewBase.prototype.setProgress = function (current, total) {
        this.imag.width = current / total * this._initWidth;
        this.txt.text = "加载中：" + Math.floor(current * 100 / total) + "%";
    };
    return LoadViewBase;
}(loadUI.BaseLoadingUI));
__reflect(LoadViewBase.prototype, "LoadViewBase");
var PublicAPi = (function () {
    function PublicAPi() {
        /************************************************这个是热门区域*********************************************************/
        this.myId = [0, 1, 3, 2, 6, 4, 5, 99];
        this.nameArr = ["幸运福袋", "欢乐钓鱼", "大圣偷桃", "扫雷", "暗棋争霸", "飞刀挑战", "闯三关", "敬请期待"];
        this.mcArr = [0, 1, 3, 2, 4, 1, 1, 4]; //mc对应的颜色  
        this.gameEvebt = {};
        this.regedEvebt = {};
        this.initEvent();
    }
    /**
     * 全局监听的消息
     */
    PublicAPi.prototype.initEvent = function () {
        this.regedEvebt[GameEvent.kickout] = this.kickoutF.bind(this);
        //      this.regedEvebt[GameEvent.xiantao] = this.xiantao.bind(this);
        this.regedEvebt[GameEvent.diaoxian] = this.diaoxian.bind(this);
        this.regedEvebt[GameEvent.istanchuang] = this.isTanChuang.bind(this);
        this.eventInit();
    };
    /**
     *  弹窗显示
     */
    PublicAPi.prototype.isTanChuang = function (str) {
        this.openStr = str;
        notification.postNotification(GameEvent.istanchuang); //发送弹窗推送
    };
    /**
     * 后端掉线询问
     */
    PublicAPi.prototype.diaoxian = function () {
        api.GlobalAPI.webSocket.request(GameEvent.Getdiaoxianjiance, {});
    };
    // /**
    //  * 仙桃  全服仙桃推送
    //  */
    // private xiantao(str:string):void
    // {
    //     let item  = gameTool.poolList.getInstance(TipShowForAll,gameTool.stage.width,gameTool.stage.height/10,str);
    //     gui.addGComponentToStage(item,define.WindowType.TIP_LAYER);
    // }
    /**
     * 掉线通知
     */
    PublicAPi.prototype.kickoutF = function (data) {
        if (data == "账户已失效，请重新连接") {
            api.GlobalAPI.publicApi.isOnlie = 4;
            this.eventRemove();
            api.createAlert(data, 1, function (type) {
                gui.removeAllView();
            });
        }
        else if (data == "网络已断，请重新连接") {
            api.GlobalAPI.publicApi.isOnlie = 3;
            api.createAlert(data, 3);
        }
    };
    /**
    * 后端消息接听初始化
    */
    PublicAPi.prototype.eventInit = function () {
        if (this.regedEvebt != null) {
            for (var o in this.regedEvebt) {
                api.GlobalAPI.webSocket.on(o, this.regedEvebt[o]);
            }
        }
    };
    /**
     * 消息移除
     */
    PublicAPi.prototype.eventRemove = function () {
        if (this.regedEvebt != null) {
            for (var o in this.regedEvebt) {
                api.GlobalAPI.webSocket.off(o, this.regedEvebt[o]);
            }
        }
    };
    /**
     * 添加后端消息监控
     */
    PublicAPi.prototype.addGameEvebt = function (name, k, _fun, arg) {
        if (this.gameEvebt[name] == null) {
            this.gameEvebt[name] = [];
        }
        this.gameEvebt[name][k] = _fun.bind(arg);
    };
    /**
     * 游戏初始化
     */
    PublicAPi.prototype.gameEvebtInit = function (name) {
        if (this.gameEvebt[name] != null) {
            for (var o in this.gameEvebt[name]) {
                api.GlobalAPI.webSocket.on(o, this.gameEvebt[name][o]);
            }
        }
    };
    /**
     * 移除游戏中的消息
     */
    PublicAPi.prototype.removeGameEvbt = function (name) {
        if (this.gameEvebt[name] != null) {
            for (var o in this.gameEvebt[name]) {
                api.GlobalAPI.webSocket.off(o, this.gameEvebt[name][o]);
            }
        }
    };
    PublicAPi.prototype.allRemoveEvbt = function () {
        for (var name in this.gameEvebt) {
            for (var o in this.gameEvebt[name]) {
                api.GlobalAPI.webSocket.off(o, this.gameEvebt[name][o]);
            }
        }
    };
    PublicAPi.prototype.dispose = function () {
        this.allRemoveEvbt();
        this.eventRemove();
        this.regedEvebt = null;
        this.gameEvebt = null;
    };
    /**
     * 替换名字
     */
    PublicAPi.prototype.changeName = function (str) {
        var name = "";
        var len = str.length;
        for (var i = 0; i < len; i++) {
            if (i == Math.floor(len / 2 - 1) || i == Math.floor(len / 2) || i == Math.floor(len / 2 + 1)) {
                name += "*";
            }
            else {
                name += str.charAt(i);
            }
        }
        return name;
    };
    /**
    * 替换名字
    */
    PublicAPi.prototype.changeMoney = function (num) {
        var atr = "";
        var str = num.toString();
        for (var x = 0; x < str.length; x++) {
            atr += str.charAt(x);
            if ((str.length - x) % 3 == 1 && x != str.length - 1) {
                atr += ",";
            }
        }
        return atr;
    };
    /**
     * 交换位置 a是需要的 b是替换的
     */
    PublicAPi.prototype.sweepChangeCom = function (a, b) {
        a.x = b.x;
        a.y = b.y;
        if (b.parent) {
            var index = b.parent.getChildIndex(b);
            b.parent.addChildAt(a, index);
            b.parent.removeChild(b);
            b = null;
        }
    };
    /**
     * 登录界面继续游戏
     */
    PublicAPi.prototype.contineGame = function (data) {
        switch (data["which"]) {
            case 1://红包
                api.GlobalAPI.moduleManager.openModule("redProject");
                //     changeBackground(1,1);
                gameTool.stage.setContentSize(1920, 1080);
                gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
                break;
            case 4://扫雷
                //      changeBackground(1,1);
                gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
                gameTool.stage.setContentSize(1920, 1080);
                api.GlobalAPI.moduleManager.openModule("sweepGame");
                break;
            case 5://大圣
                //      changeBackground(3,1);
                api.GlobalAPI.moduleManager.openModule("gzHero");
                break;
            case 6://飞刀
                //     changeBackground(4,1);
                api.GlobalAPI.moduleManager.openModule("feidao");
                break;
        }
    };
    /**
     * 播放该物件下的所有动画
     */
    PublicAPi.prototype.playAllMc = function (value, callBack) {
        if (callBack === void 0) { callBack = null; }
        var callBackBoolean = false; //只用其中一个动画来回调
        for (var i = 0; i < value.numChildren; i++) {
            var sp = value.getChildAt(i);
            if (sp instanceof fairygui.GComponent) {
                if (sp.getTransition("t0")) {
                    if (!callBackBoolean && callBack != null) {
                        callBackBoolean = true;
                        sp.getTransition("t0").play(function () {
                            callBack.apply();
                        }, this);
                    }
                    else {
                        sp.getTransition("t0").play();
                    }
                }
            }
        }
    };
    /**
     * 播放动画
     */
    PublicAPi.prototype.playMc = function (value, callBack) {
        if (callBack === void 0) { callBack = null; }
        if (value.getTransition("t0")) {
            if (callBack != null) {
                value.getTransition("t0").play(function () {
                    callBack.apply();
                }, this);
            }
            else {
                value.getTransition("t0").play();
            }
        }
    };
    PublicAPi.prototype.comebackDoor = function () {
        if (isPc()) {
            gui.addScene(PcDoorView);
        }
        else {
            gui.addScene(DoorView);
        }
    };
    /**
    * 公告显示
    */
    PublicAPi.prototype.doorTipShow = function (str) {
        var restr = "<font color='#E5522E'>[公告]</font> 恭喜";
        var strs = str.split("-");
        restr += "<font color='#F7C538'>" + this.changeName(strs[1]) + "</font>" + "在";
        restr += "<font color='#E5522E'>" + strs[0] + strs[2] + "</font>";
        // for(let i : number = 0;i<strs.length-1;i++){
        //     restr+=strs[i];
        // }
        //如果最后一个字符串为""; 则获取皮肤
        if (strs[strs.length - 1] == "") {
            restr += "<font color='#F7C538'>获取皮肤</font>";
        }
        else {
            restr += "获得<font color='#F7C538'>" + strs[strs.length - 1] + "金币</font>";
        }
        return restr;
    };
    /**
     * 将玩家的信息排在第一位
     */
    PublicAPi.prototype.firstMyInfomation = function (value) {
        if (value && value.length > 0) {
            var t;
            for (var i = 0; i < value.length; i++) {
                if (value[i]["open_id"] == api.GlobalAPI.userData.getOpenId()) {
                    t = value[i];
                    value[i] = value[0];
                    value[0] = t;
                }
            }
        }
        return value;
    };
    return PublicAPi;
}());
__reflect(PublicAPi.prototype, "PublicAPi");
var commonBtn = (function (_super) {
    __extends(commonBtn, _super);
    function commonBtn() {
        return _super.call(this) || this;
    }
    commonBtn.prototype.constructFromResource = function () {
        _super.prototype.constructFromResource.call(this);
        this._txt = [];
        this.kong = this.getChild("kong").asCom;
        this._txt.push(this.getChild("txt0").asTextField);
        this._txt.push(this.getChild("txt1").asTextField);
        //		this._txt.push(this.getChild("txt2").asTextField);
        this.mc = this.getChild("mc").asCom;
        this.imag = new fairygui.GImage();
    };
    /**
     * 图片显示
     */
    commonBtn.prototype.myId = function (num) {
        this._myId = num;
        RES.getResByUrl("resource/assets/icon/" + (num + 100).toString() + ".png", this.imgLoadHandler, this, RES.ResourceItem.TYPE_IMAGE);
    };
    commonBtn.prototype.getMyId = function () {
        return this._myId + 1;
    };
    commonBtn.prototype.setMcShow = function (num) {
        this.mc.getController("c1").setSelectedIndex(num);
    };
    /**
     * 我的名字
     */
    commonBtn.prototype.myName = function (str) {
        this._txt[0].text = str.toString();
    };
    commonBtn.prototype.pNum = function (str) {
        if (str == "") {
            this._txt[1].text = "";
        }
        else {
            this._txt[1].text = str + "人在玩";
        }
    };
    commonBtn.prototype.wx = function (str) {
        this._txt[1].text = str.toString();
    };
    commonBtn.prototype.imgLoadHandler = function (texture, url) {
        this.imag.texture = texture;
        this.kong.addChild(this.imag);
    };
    return commonBtn;
}(fairygui.GButton));
__reflect(commonBtn.prototype, "commonBtn");
var headIcon = (function (_super) {
    __extends(headIcon, _super);
    function headIcon(_icon, setXy) {
        if (setXy === void 0) { setXy = false; }
        var _this = _super.call(this) || this;
        _this.mask = _icon.displayObject;
        _this.width = _icon.width;
        _this.height = _icon.height;
        _this._myid = -1;
        if (setXy) {
            _this.x = _icon.x;
            _this.y = _icon.y;
        }
        return _this;
    }
    Object.defineProperty(headIcon.prototype, "myId", {
        get: function () {
            return this._myid;
        },
        set: function (value) {
            if (value == 0) {
                value = 1;
            }
            if (value == this._myid && this.imag != null) {
                //相同编号不用再次加载
                return;
            }
            if (this.imag) {
                if (this.imag.parent) {
                    this.imag.parent.removeChild(this.imag);
                }
                this.imag = null;
            }
            this.imag = this.imag = new fairygui.GImage();
            this.addChild(this.imag);
            this._myid = value;
            RES.getResByUrl("resource/assets/icon/" + value.toString() + ".jpg", this.imgLoadHandler, this, RES.ResourceItem.TYPE_IMAGE);
        },
        enumerable: true,
        configurable: true
    });
    headIcon.prototype.imgLoadHandler = function (texture, url) {
        this.imag.texture = texture;
        this.imag.width = this.width + 10;
        this.imag.height = this.height + 10;
        this.imag.x = -5;
        this.imag.y = -5;
    };
    headIcon.prototype.clean = function () {
        if (this.imag) {
            if (this.imag.parent) {
                this.imag.parent.removeChild(this.imag);
            }
            this.imag = null;
        }
    };
    return headIcon;
}(fairygui.GComponent));
__reflect(headIcon.prototype, "headIcon");
var IconItem = (function (_super) {
    __extends(IconItem, _super);
    function IconItem() {
        return _super.call(this) || this;
    }
    IconItem.prototype.constructFromResource = function () {
        _super.prototype.constructFromResource.call(this);
        this.c1 = this.getController("c1");
        this._icon = this.getChild("icon");
        this._myid = -1;
        this.imag = new egret.Bitmap();
    };
    Object.defineProperty(IconItem.prototype, "myId", {
        get: function () {
            return this._myid;
        },
        set: function (value) {
            if (value == this._myid) {
                //相同编号不用再次加载
                return;
            }
            this._myid = value;
            RES.getResByUrl("resource/assets/icon/" + value.toString() + ".jpg", this.imgLoadHandler, this, RES.ResourceItem.TYPE_IMAGE);
        },
        enumerable: true,
        configurable: true
    });
    IconItem.prototype.imgLoadHandler = function (texture, url) {
        this.imag.texture = texture;
        this.displayObject.addChild(this.imag);
        this.imag.width = this.width + 10;
        this.imag.height = this.height + 10;
        this.imag.x = -5;
        this.imag.y = -5;
        this.imag.mask = this._icon.displayObject;
    };
    IconItem.prototype.choose = function (v) {
        if (v) {
            this.c1.setSelectedIndex(1);
        }
        else {
            this.c1.setSelectedIndex(0);
        }
    };
    return IconItem;
}(fairygui.GComponent));
__reflect(IconItem.prototype, "IconItem");
var IconSprite = (function (_super) {
    __extends(IconSprite, _super);
    function IconSprite(value) {
        var _this = _super.call(this) || this;
        _this.mainView = value;
        _this.c1 = _this.mainView.getController("c1");
        _this._icon = _this.mainView.getChild("icon");
        _this._myid = -1;
        _this.imag = new egret.Bitmap();
        _this.mainView.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.itemClick, _this);
        return _this;
    }
    IconSprite.prototype.itemClick = function (e) {
        this.dispatchEvent(new egret.Event(IconSprite.ONCLICK));
    };
    Object.defineProperty(IconSprite.prototype, "myId", {
        get: function () {
            return this._myid;
        },
        set: function (value) {
            if (value == this._myid) {
                //相同编号不用再次加载
                return;
            }
            this._myid = value;
            RES.getResByUrl("resource/assets/icon/" + value.toString() + ".jpg", this.imgLoadHandler, this, RES.ResourceItem.TYPE_IMAGE);
        },
        enumerable: true,
        configurable: true
    });
    IconSprite.prototype.imgLoadHandler = function (texture, url) {
        this.imag.texture = texture;
        this.mainView.displayObject.addChild(this.imag);
        this.imag.x = this._icon.x;
        this.imag.y = this._icon.y;
        this.imag.mask = this._icon.displayObject;
    };
    IconSprite.prototype.choose = function (v) {
        if (v) {
            this.c1.setSelectedIndex(1);
        }
        else {
            this.c1.setSelectedIndex(0);
        }
    };
    IconSprite.ONCLICK = "onClikc";
    return IconSprite;
}(fairygui.GComponent));
__reflect(IconSprite.prototype, "IconSprite");
var BaseConfig = (function () {
    function BaseConfig(clazz, id) {
        this._$clazz = clazz;
        this._$id = id;
        this.dic = [];
    }
    Object.defineProperty(BaseConfig.prototype, "dataSource", {
        /**
         * 初始化数据
         */
        set: function (value) {
            this._$name = this._$clazz.toString();
            this.analyseTxt(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 解析文本
     */
    BaseConfig.prototype.analyseTxt = function (data) {
        if (!data) {
            console.error("数据读取失败", this._$name);
        }
        var datas = data.split(/\r?\n/);
        var fields = {};
        var idBoolean = false;
        datas[1].split("\t").forEach(function (value, index) {
            if (value.length <= 0 || value.charAt(0) == "#") {
                return;
            }
            if (this._$id == value) {
                idBoolean = true;
            }
            fields[value] = index;
        }, this);
        // if(idBoolean){
        // 	console.error("没有唯一标识",this._$name);	
        // }
        datas.splice(0, 2);
        var result = {};
        for (var i = 0; i < datas.length; i++) {
            var item = new this._$clazz();
            item = this.mapData(fields, datas[i].split('\t'), item);
            result[item[this._$id]] = item;
        }
        this.dic = result;
    };
    /**
     * 数据解析
     */
    BaseConfig.prototype.mapData = function (fields, data, item) {
        var obj = {};
        for (var k in fields) {
            var va = data[fields[k]]; //读取信息
            // 解析成列表
            if (k.search("List$") != -1) {
                var temp = [];
                if (va.length > 0) {
                    va = va.split(';'); //里面的内容用;区分
                    for (var index = 0; index < va.length; index++) {
                        var value = va[index];
                        if (this.isNum(value)) {
                            value = Number(value);
                        }
                        temp.push(value);
                    }
                }
                va = temp;
            }
            else {
                if (this.isNum(va)) {
                    va = Number(va);
                }
                else if (va == "False" || va == "false") {
                    va = false;
                }
                else if (va == "True" || va == "true") {
                    va = true;
                }
            }
            item[k] = va;
        }
        return item;
    };
    BaseConfig.prototype.isNum = function (s) {
        if (typeof s == 'number')
            return true;
        if (typeof s != 'string')
            return false;
        if (s != null) {
            var r = void 0, re = void 0;
            re = /-?\d*\.?\d*/i; //\d表示数字,*表示匹配多个数字
            r = s.match(re);
            return (r == s) ? true : false;
        }
        return false;
    };
    /**
     * 获取类型数据
     */
    BaseConfig.prototype.getTypeData = function (key) {
        return this.dic[key];
    };
    return BaseConfig;
}());
__reflect(BaseConfig.prototype, "BaseConfig");
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
    GameEvent.GetAaminiAccountInfo = "miniGame.getaccountinfo";
    /**
     * 回到游戏大厅
     */
    GameEvent.GetRenshu = "miniGame.GetRenshu";
    /**
     * 选择头像
     */
    GameEvent.ChooseIcon = "miniGame.ChooseIcon";
    /**
     * 请求打开对应的游戏
     */
    GameEvent.getingame = "miniGame.getingame";
    /**
     * 回复是否掉线
     */
    GameEvent.Getdiaoxianjiance = "miniGame.Getdiaoxianjiance";
    GameEvent.kickout = "kickout"; //被顶号了
    GameEvent.Logout = "miniGame.Logout"; //退出
    GameEvent.AddCoins = "miniGame.AddCoins"; //金币加钱
    GameEvent.Loginbyurl = "miniGame.Loginbyurl"; //登录
    GameEvent.getxintiaobao = "miniGame.getxintiaobao"; //获取心跳包
    GameEvent.xiantao = "xiantao"; //仙桃
    GameEvent.connect = "connect"; //连接网络
    GameEvent.diaoxian = "diaoxian"; //后台询问是否掉线
    GameEvent.weihu = "weihu"; //维护
    GameEvent.loginTrue = "loginTrue"; //登录成功
    GameEvent.CMD_HF = "hengfu"; //横幅
    GameEvent.fenghao = "fenghao"; //横幅
    GameEvent.Yijianfankui = "miniGame.Yijianfankui"; //意见反馈
    GameEvent.istanchuang = "istanchuang"; //弹窗
    /***********前端********** */
    GameEvent.web_closeDoor = "closeDoor"; //关闭
    return GameEvent;
}());
__reflect(GameEvent.prototype, "GameEvent");
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
            return _super.call(this, "common", "alerView") || this;
        }
        Alert.OK = 1;
        Alert.CANCEL = 2;
        Alert.OK_CANCEL = 3;
        return Alert;
    }(gui.OvBase));
    api.Alert = Alert;
    __reflect(Alert.prototype, "api.Alert");
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
            this.publicApi = new PublicAPi();
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
var btnItem = (function (_super) {
    __extends(btnItem, _super);
    function btnItem() {
        return _super.call(this) || this;
    }
    btnItem.prototype.constructFromResource = function () {
        _super.prototype.constructFromResource.call(this);
        this._txt = [];
        this.kong = this.getChild("kong").asCom;
        this._txt.push(this.getChild("txt0").asTextField);
        this._txt.push(this.getChild("txt1").asTextField);
        this.tipShow = this.getChild("tipShow").asCom;
        this.mc = this.getChild("mc").asCom;
        this.imag = new fairygui.GImage();
    };
    /**
     * 图片显示
     */
    btnItem.prototype.myId = function (num) {
        this._myId = num;
        RES.getResByUrl("resource/assets/icon/" + (num + 100).toString() + ".png", this.imgLoadHandler, this, RES.ResourceItem.TYPE_IMAGE);
    };
    btnItem.prototype.getMyId = function () {
        return this._myId + 1;
    };
    /**
     * 招牌显示
     */
    btnItem.prototype.setTipShow = function (num) {
        this.tipShow.getController("c1").setSelectedIndex(num);
    };
    btnItem.prototype.setMcShow = function (num) {
        this.mc.getController("c1").setSelectedIndex(num);
    };
    /**
     * 我的名字
     */
    btnItem.prototype.myName = function (str) {
        this._txt[0].text = str.toString();
    };
    btnItem.prototype.pNum = function (str) {
        if (str == "") {
            this._txt[1].text = "";
        }
        else {
            this._txt[1].text = str + "人在玩";
        }
    };
    btnItem.prototype.wx = function (str) {
        this._txt[1].text = str.toString();
    };
    btnItem.prototype.imgLoadHandler = function (texture, url) {
        this.imag.texture = texture;
        this.kong.addChild(this.imag);
    };
    return btnItem;
}(fairygui.GButton));
__reflect(btnItem.prototype, "btnItem");
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
    SoundManagers.prototype.changeMusic = function (p_flag, str) {
        if (this._musicFlag != p_flag) {
            this._musicFlag = p_flag;
            if (this._musicFlag) {
                if (this.isInPlay) {
                    this.playRedBGM(true, str);
                }
                else {
                    this.playBGM(str);
                }
            }
            else {
                this.pauseBGM();
            }
        }
    };
    SoundManagers.prototype.playRedBGM = function (notRec, str) {
        if (notRec === void 0) { notRec = false; }
        this.playBGM(str);
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
        this.playBGM(this._lastMusic);
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
    var FishLoadUi = (function (_super) {
        __extends(FishLoadUi, _super);
        function FishLoadUi() {
            return _super.call(this, "fishGame") || this;
        }
        return FishLoadUi;
    }(LoadViewBase));
    base.FishLoadUi = FishLoadUi;
    __reflect(FishLoadUi.prototype, "base.FishLoadUi");
    var Xq = (function (_super) {
        __extends(Xq, _super);
        function Xq() {
            return _super.call(this, "xq") || this;
        }
        return Xq;
    }(LoadViewBase));
    base.Xq = Xq;
    __reflect(Xq.prototype, "base.Xq");
})(base || (base = {}));
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
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
var base;
(function (base) {
    var BaseAlert = (function (_super) {
        __extends(BaseAlert, _super);
        function BaseAlert(res, name, message, button, callback, context) {
            if (button === void 0) { button = 1; }
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            var args = [];
            for (var _i = 6; _i < arguments.length; _i++) {
                args[_i - 6] = arguments[_i];
            }
            var _this = _super.call(this, res, name) || this;
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
        BaseAlert.prototype.initView = function () {
            this.txt = this.getTextField("txt");
            this.select = this._ui.getController("select");
            if (this._button == BaseAlert.OK) {
                this.select.selectedPage = "1";
            }
            else {
                this.select.selectedPage = "2";
            }
            this.txt.text = this._message;
        };
        BaseAlert.prototype.onClick = function (e) {
            switch (e.currentTarget.name) {
                case "closeButton":
                case "cannel":
                    if (this._callback != null) {
                        this._callback.args = [BaseAlert.CANCEL].concat(this._callback.args);
                        this._callback.call();
                    }
                    this.dispose();
                    break;
                case "ok1":
                case "ok0":
                    if (this._callback != null) {
                        this._callback.args = [BaseAlert.OK].concat(this._callback.args);
                        this._callback.call();
                    }
                    this.dispose();
                    break;
            }
        };
        BaseAlert.prototype.dispose = function () {
            if (this._callback != null) {
                gameTool.poolList.remove(this._callback);
                this._callback = null;
            }
            _super.prototype.dispose.call(this);
        };
        BaseAlert.OK = 1;
        BaseAlert.CANCEL = 2;
        BaseAlert.OK_CANCEL = 3;
        return BaseAlert;
    }(gui.OvBase));
    base.BaseAlert = BaseAlert;
    __reflect(BaseAlert.prototype, "base.BaseAlert");
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
    base.FunctionInfo = FunctionInfo;
    __reflect(FunctionInfo.prototype, "base.FunctionInfo");
})(base || (base = {}));
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
            }, this, mathTool.pluck(this.getConfigs(), "parse"), this);
        };
        BaseModule.prototype.initData = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
        };
        BaseModule.prototype.open = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.isApplying = true;
        };
        BaseModule.prototype.close = function () {
            this.isApplying = false;
            this._moduleInfo.coreClass["data"]["dispose"]();
            this._moduleInfo.coreClass["dispose"]();
            this._groups = null;
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
    var BaseRuleView = (function (_super) {
        __extends(BaseRuleView, _super);
        function BaseRuleView(res, name) {
            var _this = _super.call(this, res, name) || this;
            _this._distance = new egret.Point(); //鼠标点击时，鼠标全局坐标与_bird的位置差
            return _this;
        }
        BaseRuleView.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        BaseRuleView.prototype.open = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
        };
        BaseRuleView.prototype.initView = function () {
            _super.prototype.initView.call(this);
            this.bar = [];
            this.btn = [];
            for (var i = 0; i < 6; i++) {
                this.btn.push(this.getButton("btn" + i));
                if (i < 2) {
                    this.bar.push(this._ui.getChild("myPress" + i));
                    this.bar[i].max = 100;
                }
            }
            this.btnShow(0, api.GlobalAPI.soundManager.volume);
            this.btnShow(1, api.GlobalAPI.soundManager.effvolume);
            this.c1 = this._ui.getController("c1");
            this.c2 = this._ui.getController("c2");
            if (api.GlobalAPI.soundManager._musicFlag) {
                this.c1.setSelectedIndex(0);
            }
            else {
                this.c1.setSelectedIndex(1);
                this.btnShow(0, 0);
            }
            if (api.GlobalAPI.soundManager._soundFlag) {
                this.c2.setSelectedIndex(0);
            }
            else {
                this.c2.setSelectedIndex(1);
                this.btnShow(1, 0);
            }
        };
        /**
         * 根据按钮显示声音大小
         */
        BaseRuleView.prototype.btnShow = function (index, volume) {
            if (index == 0) {
                api.GlobalAPI.soundManager.volume = volume;
            }
            else if (index == 1) {
                api.GlobalAPI.soundManager.effvolume = volume;
            }
            this.bar[index].value = volume * 100;
            this.btn[index + 4].x = volume * this.bar[index].width + this.bar[index].x - this._buttonList[4 + index].width / 2;
        };
        BaseRuleView.prototype.initEvent = function () {
            this.btn[4].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
            this.btn[4].addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
            this.btn[5].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
            this.btn[5].addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        };
        BaseRuleView.prototype.mouseDown = function (e) {
            this.curNum = this.btn.indexOf(e.currentTarget);
            this._touchStatus = true;
            if (this.curNum > -1) {
                this._distance.x = e.stageX - this.btn[this.curNum].x;
                this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
            }
        };
        BaseRuleView.prototype.mouseMove = function (e) {
            if (this._touchStatus) {
                if (e.stageX <= this.bar[0].x) {
                    this.btn[this.curNum].x = this.bar[0].x - this.btn[this.curNum].width / 2;
                }
                else if (e.stageX >= this.bar[0].x + this.bar[0].width - this.btn[this.curNum].width / 2) {
                    this.btn[this.curNum].x = this.bar[0].x + this.bar[0].width - this.btn[this.curNum].width / 2;
                }
                else {
                    this.btn[this.curNum].x = e.stageX - this.btn[this.curNum].width / 2;
                }
                var valueX = Math.floor(this.btn[this.curNum].x - this.bar[1].x + this.btn[this.curNum].width / 2);
                if (valueX <= this.btn[this.curNum].width / 2) {
                    valueX = 0;
                }
                else if (valueX >= this.bar[0].width) {
                    valueX = this.bar[0].width;
                }
                if (this.curNum == 4) {
                    api.GlobalAPI.soundManager.volume = valueX / this.bar[0].width;
                    this.bar[0].value = api.GlobalAPI.soundManager.volume * 100;
                    //	api.GlobalAPI.soundManager.resumeBGM();
                    if (api.GlobalAPI.soundManager.volume > 0) {
                        this.c1.setSelectedIndex(0);
                    }
                    else {
                        this.c1.setSelectedIndex(1);
                    }
                }
                else {
                    api.GlobalAPI.soundManager.effvolume = valueX / this.bar[1].width;
                    this.bar[1].value = api.GlobalAPI.soundManager.effvolume * 100;
                    if (api.GlobalAPI.soundManager.effvolume > 0) {
                        this.c2.setSelectedIndex(0);
                    }
                    else {
                        this.c2.setSelectedIndex(1);
                    }
                }
            }
        };
        BaseRuleView.prototype.mouseUp = function (e) {
            this._touchStatus = false;
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
        };
        BaseRuleView.prototype.onClick = function (e) {
            // api.GlobalAPI.soundManager.changeSound(true);
            api.GlobalAPI.soundManager.playEffect("click_mp3", api.GlobalAPI.soundManager.effvolume);
            switch (e.currentTarget.name) {
                case "closeButton":
                    this.dispose();
                    break;
            }
            var num = this.btn.indexOf(e.currentTarget);
            if (num > -1) {
                if (num < 4) {
                    if (num == 0) {
                        this.c1.setSelectedIndex(0);
                    }
                    else if (num == 1) {
                        this.c2.setSelectedIndex(0);
                        api.GlobalAPI.soundManager.changeSound(true);
                    }
                    else if (num == 2) {
                        this.c1.setSelectedIndex(1);
                        this.btnShow(0, 0);
                    }
                    else if (num == 3) {
                        this.c2.setSelectedIndex(1);
                        this.btnShow(1, 0);
                    }
                }
            }
        };
        return BaseRuleView;
    }(gui.OvBase));
    base.BaseRuleView = BaseRuleView;
    __reflect(BaseRuleView.prototype, "base.BaseRuleView");
})(base || (base = {}));
var base;
(function (base) {
    var SoundManager = (function () {
        function SoundManager() {
            this.allChannel = []; //所有音效的声道
            this.isComplete = [false, false]; //是否加载完成 
            this.soundUrl = [];
            //	this.soundInit();
        }
        /**
         * 声音初始化加载
         */
        SoundManager.prototype.soundInit = function () {
            var _this = this;
            if (this.allSound == null) {
                this.allSound = [];
                for (var i = 0; i < this.soundUrl.length; i++) {
                    this.isComplete[i] = false;
                    this.allSound.push(new egret.Sound());
                    var url = RES.getVirtualUrl(this.soundUrl[i]);
                    this.allSound[i].load(url);
                    this.allSound[i].addEventListener(egret.Event.COMPLETE, function (data) {
                        _this.isComplete[_this.allSound.indexOf(data.currentTarget)] = true;
                        if (_this.allReadly() && i >= _this.allSound.length) {
                            notification.postNotification("ready");
                        }
                    }, this);
                }
            }
        };
        /**
         * 清除音效
        */
        SoundManager.prototype.cleanChannel = function (num) {
            if (this.allChannel[num]) {
                this.allChannel[num].stop();
                this.allChannel[num] = null;
            }
        };
        /**
         * 创建音效
        */
        SoundManager.prototype.createChannel = function (num, n, m, w) {
            if (n === void 0) { n = 0; }
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
            this.allChannel[num].volume = api.GlobalAPI.soundManager.effvolume;
            this.allSound[num]["channel"] = this.allChannel[num];
        };
        /**
         * 删除所有音效
        */
        SoundManager.prototype.disposeAllSound = function () {
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
        SoundManager.prototype.allReadly = function () {
            for (var i = 0; i < this.isComplete.length; i++) {
                if (!this.isComplete[i]) {
                    return false;
                }
            }
            return true;
        };
        return SoundManager;
    }());
    base.SoundManager = SoundManager;
    __reflect(SoundManager.prototype, "base.SoundManager");
})(base || (base = {}));
var base;
(function (base) {
    var BaseTip = (function (_super) {
        __extends(BaseTip, _super);
        function BaseTip(skin, message) {
            var _this = _super.call(this) || this;
            _this._skinName = skin;
            _this._message = message;
            _this.initView();
            _this.touchable = false;
            gui.addGComponentToStage(_this, define.WindowType.TIP_LAYER);
            _this.start();
            return _this;
        }
        BaseTip.prototype.dispose = function () {
            this._animation = null;
            this._ui.dispose();
            this._ui = null;
            this._content = null;
            this.dispatchEvent(new egret.Event(egret.Event.CLOSE));
            _super.prototype.dispose.call(this);
        };
        /**
         * 开始飘窗
         */
        BaseTip.prototype.start = function () {
            if (this._animation) {
                this._animation.start(this.dispose, this);
            }
            else {
                this.dispose();
            }
        };
        /******************************************************************/
        BaseTip.prototype.initView = function () {
            this._ui = fairygui.UIPackage.createObject("common", "tip").asCom;
            this.addChild(this._ui);
            this._content = this._ui.getChild("content").asTextField;
            this._content.text = this._message;
        };
        Object.defineProperty(BaseTip.prototype, "animationType", {
            get: function () {
                return this._animationType;
            },
            set: function (value) {
                if (this._animationType == value) {
                    return;
                }
                if (this._animation) {
                    this._animation.dispose();
                }
                this._animationType = value;
                this._animation = gameTool.singleton(TipManagers).getAnimationClass(value);
                this._animation.component = this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseTip.prototype, "realHeight", {
            get: function () {
                return this._ui.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseTip.prototype, "realWidth", {
            get: function () {
                return this._ui.width;
            },
            enumerable: true,
            configurable: true
        });
        return BaseTip;
    }(fairygui.GComponent));
    base.BaseTip = BaseTip;
    __reflect(BaseTip.prototype, "base.BaseTip");
    /************************tip动画*************************/
    /******************************************************************/
    var TipAnimationBase = (function () {
        function TipAnimationBase() {
        }
        TipAnimationBase.prototype.start = function (callback, context) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.component.addEventListener(egret.Event.CLOSE, this.onGameTipClose, this);
            var info = gameTool.singleton(TipManagers).getInfo(this.component.animationType);
            info.itemList.push(this.component);
        };
        TipAnimationBase.prototype.dispose = function () {
            this.component.removeEventListener(egret.Event.CLOSE, this.onGameTipClose, this);
            this.component = null;
        };
        /******************************************************************/
        TipAnimationBase.prototype.onGameTipClose = function (event) {
            var item = event.currentTarget;
            var info = gameTool.singleton(TipManagers).getInfo(this.component.animationType);
            var index = info.itemList.indexOf(item);
            item.removeEventListener(egret.Event.CLOSE, this.onGameTipClose, this);
            if (index >= 0) {
                info.itemList.splice(index, 1);
            }
            if (info.itemList.length == 0) {
                this.resetInfo(info);
            }
        };
        TipAnimationBase.prototype.resetInfo = function (info) {
            info.textTipCurrentY = info.startY;
        };
        return TipAnimationBase;
    }());
    base.TipAnimationBase = TipAnimationBase;
    __reflect(TipAnimationBase.prototype, "base.TipAnimationBase");
    var TipManagers = (function () {
        function TipManagers() {
            this._infos = {};
            this._infos[base.ANIMATION1] = new ManagerInfo(NormalTipAnimation, gameTool.stage.stageHeight / 4);
            this._infos[base.ANIMATION2] = new ManagerInfo(SystemTipAnimation, gameTool.stage.stageHeight / 4);
        }
        TipManagers.prototype.getInfo = function (type) {
            return this._infos[type];
        };
        TipManagers.prototype.getAnimationClass = function (type) {
            return new this._infos[type].animationClass;
        };
        return TipManagers;
    }());
    base.TipManagers = TipManagers;
    __reflect(TipManagers.prototype, "base.TipManagers");
    /******************************************************************/
    /********************管理信息*******************************/
    /******************************************************************/
    var ManagerInfo = (function () {
        function ManagerInfo(animationClass, startY) {
            this.animationClass = animationClass;
            this.startY = startY;
            this.textTipCurrentY = startY;
            this.itemList = [];
        }
        return ManagerInfo;
    }());
    base.ManagerInfo = ManagerInfo;
    __reflect(ManagerInfo.prototype, "base.ManagerInfo");
    var NormalTipAnimation = (function (_super) {
        __extends(NormalTipAnimation, _super);
        function NormalTipAnimation() {
            return _super.call(this) || this;
        }
        NormalTipAnimation.prototype.start = function (callback, context) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            _super.prototype.start.apply(this, [callback, context].concat(args));
            var info = gameTool.singleton(TipManagers).getInfo(this.component.animationType);
            this.component.alpha = 0;
            this.component.x = gameTool.stage.stageWidth / 2 - 200;
            this.component.y = info.textTipCurrentY;
            egret.Tween.get(this.component).to({ y: info.textTipCurrentY - 50, alpha: 1 }, 200).wait(2000).to({ alpha: 0, y: info.textTipCurrentY - 100 }, 200).call(callback, context, args);
            if (info.textTipCurrentY > (gameTool.stage.stageHeight + 300)) {
                this.resetInfo(info);
            }
            else {
                info.textTipCurrentY += this.component.realHeight + 5;
            }
        };
        return NormalTipAnimation;
    }(TipAnimationBase));
    base.NormalTipAnimation = NormalTipAnimation;
    __reflect(NormalTipAnimation.prototype, "base.NormalTipAnimation");
    var SystemTipAnimation = (function (_super) {
        __extends(SystemTipAnimation, _super);
        function SystemTipAnimation() {
            return _super.call(this) || this;
        }
        SystemTipAnimation.prototype.start = function (callback, context) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            _super.prototype.start.apply(this, [callback, context].concat(args));
            var info = gameTool.singleton(TipManagers).getInfo(this.component.animationType);
            this.component.alpha = 1;
            this.component.x = gameTool.stage.stageWidth / 2;
            this.component.y = info.textTipCurrentY;
            info.textTipCurrentY += this.component.realHeight + 5;
            egret.Tween.get(this.component).wait(1000).to({
                y: this.component.y - 300,
                alpha: 0
            }, 1000).call(callback, context, args);
        };
        return SystemTipAnimation;
    }(TipAnimationBase));
    base.SystemTipAnimation = SystemTipAnimation;
    __reflect(SystemTipAnimation.prototype, "base.SystemTipAnimation");
    function showTextTips(message) {
        new TipItems(message);
    }
    base.showTextTips = showTextTips;
    var TipItems = (function (_super) {
        __extends(TipItems, _super);
        function TipItems(message) {
            return _super.call(this, "normalTipSkin", message) || this;
        }
        TipItems.prototype.initView = function () {
            _super.prototype.initView.call(this);
            this.animationType = base.ANIMATION1;
        };
        return TipItems;
    }(BaseTip));
    base.TipItems = TipItems;
    __reflect(TipItems.prototype, "base.TipItems");
    base.ANIMATION1 = 1;
    base.ANIMATION2 = 2;
})(base || (base = {}));
var ModuleManager = (function () {
    /**
     * 构造函数
     */
    function ModuleManager() {
        this._modules = [];
        this._moduleInfo = [];
    }
    /**
     * 打开模块
     */
    ModuleManager.prototype.openModule = function (p_moduleName, p_loadType, p_opendCallBack) {
        if (p_loadType === void 0) { p_loadType = 1; }
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        // var moduleInfo : ModuleInfo = this.getModuleInfo(p_moduleName);
        // if(!moduleInfo){
        // 	//如果模块信息不存在进行加载
        // 	loadUtil.loadGroup(p_moduleName,LoadType[p_moduleName],()=>{
        // 		moduleInfo = new ModuleInfo();
        // 		moduleInfo.moduleName = p_moduleName;  //名字赋值
        // 		let suffix = DEBUG?".js":".min.js";
        // 		let key    = "module_"+p_moduleName;   //模块的名字都是module_+p_moduleName;
        // 		var jsUrl : string = "resource/assets/module/"+p_moduleName+"/"+p_moduleName+suffix; //加载的js的路径
        // 		if(suffix == ".min.js"){
        // 			jsUrl = RES.getVirtualUrl("resource/assets/module/"+p_moduleName+"/"+p_moduleName+suffix)
        // 		}
        // 		var script: HTMLScriptElement = document.createElement("script");   //在html里创建一个script标签
        // 		script.src = jsUrl; //路径赋值
        // 		script.onload = ()=>
        // 		{
        // 			eval("moduleInfo.mainClass= " + key + ".Main");
        //       //      eval("moduleInfo.mediatorClass= " + key + ".Mediator");
        //             eval("moduleInfo.coreClass= " + key + ".Core");
        //             eval("moduleInfo.dataClass= " + key + ".Data");
        //             this._moduleInfo[p_moduleName] = moduleInfo;
        // 			this.applyModule(moduleInfo, p_opendCallBack, ...args);
        // 		}
        // 		 document.head.appendChild(script);  //将标签添加执行
        // 	},this);
        // }else
        // {
        // 	this.applyModule(moduleInfo, p_opendCallBack, ...args);
        // }
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
var timeUtils;
(function (timeUtils) {
    var TimeUtils = (function () {
        function TimeUtils() {
            this.TimeMin = 60;
            this.TimeHour = this.TimeMin * 60;
            this.TimeDay = this.TimeHour * 24;
            this.TimeWeek = this.TimeDay * 7;
            /* 添加定时器*/
            this.timerList = {};
            /**
             *  1970 到现在的获取时间戳
             */
            this.$timestamp = 0;
            /*
                初始化本地时间
            */
            this.severTime = 0;
            this.disServerTime = 0;
        }
        //初始化时间戳
        TimeUtils.prototype.initRefreshTime = function () {
            var _this = this;
            this.addTimerFunc(1000, function () {
                _this.timestamp0();
            }, this);
        };
        TimeUtils.prototype.addTimerFunc = function (key, timerfunc, thisObj) {
            var _this = this;
            var timerList = this.timerList[key];
            if (!timerList) {
                var timer = new egret.Timer(key);
                var func = function () {
                    var list = _this.timerList[key].list;
                    var len = list.length;
                    for (var i = 0; i < len; ++i) {
                        var list0 = list[i];
                        if (list0.func && list0.thisObj) {
                            list0.func.call(list0.thisObj);
                            if (list.length != len) {
                                len = list.length;
                                --i;
                            }
                        }
                    }
                };
                timerList = { timer: timer, func: func, list: [{ func: timerfunc, thisObj: thisObj }] };
                this.timerList[key] = timerList;
                timer.addEventListener(egret.TimerEvent.TIMER, func, this);
                timer.start();
            }
            else {
                var list = timerList.list;
                var len = list.length;
                for (var i = 0; i < len; ++i) {
                    var list0 = list[i];
                    if (list0.func == timerfunc && list0.thisObj == thisObj) {
                        return;
                    }
                }
                list.push({ func: timerfunc, thisObj: thisObj });
                if (list.length == 1) {
                    timerList.timer.start();
                }
            }
        };
        //删除定时器
        TimeUtils.prototype.removeTimerFunc = function (key, timerfunc, thisObj) {
            var timerList = this.timerList[key];
            if (!timerList)
                return;
            var list = this.timerList[key].list;
            var len = list.length;
            for (var i = 0; i < len; ++i) {
                var list0 = list[i];
                if (list0.func == timerfunc && list0.thisObj == thisObj) {
                    list.splice(i, 1);
                    len = list.length;
                    --i;
                }
            }
            if (list.length < 1) {
                timerList.timer.stop();
            }
        };
        TimeUtils.prototype.toFriendly = function (time) {
            var itl = this.getInterval(time);
            if (itl > this.TimeWeek) {
                return (itl / this.TimeWeek).toFixed() + '周前';
            }
            else if (itl > this.TimeDay) {
                return (itl / this.TimeDay).toFixed() + '天前';
            }
            else if (itl > this.TimeHour) {
                return (itl / this.TimeHour).toFixed() + '小时前';
            }
            else if (itl > this.TimeMin) {
                return (itl / this.TimeMin).toFixed() + '分钟前';
            }
            else {
                return '刚刚';
            }
        };
        TimeUtils.prototype.toTimeHour = function (time, isDate) {
            if (isDate === void 0) { isDate = true; }
            var itl = time;
            if (isDate) {
                itl = time - this.timestamp();
            }
            var str = '';
            if (itl > this.TimeHour) {
                str += Math.floor(itl / this.TimeHour) + ':';
                itl = itl - Math.floor(itl / this.TimeHour) * this.TimeHour;
            }
            if (itl > this.TimeMin || itl) {
                str += ('00' + Math.floor(itl / this.TimeMin)).slice(-2) + ':';
                itl = itl - Math.floor(itl / this.TimeMin) * this.TimeMin;
            }
            str += ('00' + itl).slice(-2);
            return str;
        };
        TimeUtils.prototype.toTimeHour2 = function (time) {
            var itl = time;
            var str = '';
            if (itl > this.TimeHour) {
                str += Math.floor(itl / this.TimeHour) + ':';
                itl = itl - Math.floor(itl / this.TimeHour) * this.TimeHour;
            }
            str += ('00' + Math.floor(itl / this.TimeMin)).slice(-2);
            itl = itl - Math.floor(itl / this.TimeMin) * this.TimeMin;
            if (itl > 0) {
                str += ':' + ('00' + itl).slice(-2);
            }
            return str;
        };
        TimeUtils.prototype.toTimeHour3 = function (time) {
            var itl = time;
            var str = '';
            if (itl > this.TimeHour) {
                var hour = Math.floor(itl / this.TimeHour);
                if (Math.floor(hour / 24) > 0) {
                    str = Math.floor(hour / 24) + '天 ';
                    itl = itl - Math.floor(hour / 24) * this.TimeDay;
                }
                str += Math.floor(itl / this.TimeHour) + ':';
                itl = itl - Math.floor(itl / this.TimeHour) * this.TimeHour;
            }
            str += ('00' + Math.floor(itl / this.TimeMin)).slice(-2);
            itl = itl - Math.floor(itl / this.TimeMin) * this.TimeMin;
            str += ':' + ('00' + itl).slice(-2);
            return str;
        };
        TimeUtils.prototype.toSeconds = function (time) {
            var index = time.indexOf(':');
            var hours = (Number)(time.substring(0, index));
            var minutes = (Number)(time.substring(index + 1, time.length));
            var seconds = hours * this.TimeHour + minutes * this.TimeMin;
            return seconds;
        };
        TimeUtils.prototype.timeToSeconds = function () {
            var time = new Date(this.timestamp() * 1000);
            var curTime = time.getHours() * this.TimeHour + time.getMinutes() * this.TimeMin + time.getSeconds();
            return curTime;
        };
        TimeUtils.prototype.format = function (time) {
            var t = new Date(time);
            var y = t.getFullYear();
            var m = t.getMonth() + 1;
            var d = t.getDate();
            return y + '年' + m + '月' + d + '日';
        };
        TimeUtils.prototype.toDayTime = function (time) {
            var str = '';
            var d = Math.floor(time / this.TimeDay);
            time -= d * this.TimeDay;
            if (d > 0) {
                str = str + d + '天';
            }
            var h = Math.floor(time / this.TimeHour);
            time -= h * this.TimeHour;
            str = h > 0 ? str + h + '小时' : str;
            var m = Math.floor(time / this.TimeMin);
            var s = time - m * this.TimeMin;
            str = m > 0 ? str + m + '分' : str;
            str = s > 0 ? str + s + '秒' : str;
            return str;
        };
        TimeUtils.prototype.timestamp = function () {
            return this.$timestamp;
        };
        TimeUtils.prototype.timestamp0 = function () {
            this.$timestamp = Math.floor(new Date().getTime() / 1000 + this.disServerTime);
            return this.$timestamp;
        };
        /**
         * 获取现在之前距离到现在的时间，单位秒
         */
        TimeUtils.prototype.getInterval = function (before) {
            return (this.timestamp() - before);
        };
        /**
         * 获取今天剩余的时间
         */
        TimeUtils.prototype.getSurplusTime = function () {
            var curTime = this.timestamp();
            var t = new Date(curTime * 1000);
            var surplusTime = this.TimeDay - ((t.getHours() + 1) * this.TimeHour + t.getMinutes() * this.TimeMin + t.getSeconds());
            return surplusTime;
        };
        /*
        *	将时间戳转为 2017-02-04 00:00:00 的形式
        */
        TimeUtils.prototype.timeToformat = function (time) {
            var t;
            if (time) {
                t = new Date(time);
            }
            else {
                t = new Date(this.timestamp());
            }
            var y = t.getFullYear();
            var m = ('00' + Math.floor(t.getMonth() + 1)).slice(-2);
            var d = ('00' + Math.floor(t.getDate())).slice(-2);
            var h = ('00' + Math.floor(t.getHours())).slice(-2);
            var mm = ('00' + Math.floor(t.getMinutes())).slice(-2);
            //let s = ('00' + Math.floor(t.getSeconds())).slice(-2);
            return y + '-' + m + '-' + d + ' ' + h + ':' + mm; //+ ':' + s;
        };
        /*
        *	将时间戳转为
        
            02-04
           00:00:00    的形式
        */
        TimeUtils.prototype.timeToformat2 = function (time) {
            var t;
            if (time) {
                t = new Date(time);
            }
            else {
                t = new Date(this.timestamp());
            }
            var m = t.getMonth() + 1;
            m = ('00' + m).slice(-2);
            var d = ('00' + Math.floor(t.getDate())).slice(-2);
            var h = ('00' + Math.floor(t.getHours())).slice(-2);
            var mm = ('00' + Math.floor(t.getMinutes())).slice(-2);
            var s = ('00' + Math.floor(t.getSeconds())).slice(-2);
            return m + '-' + d + '\n' + h + ':' + mm + ':' + s;
        };
        /*
        *	将时间戳转为
        
            2018-7-25   的形式
        */
        TimeUtils.prototype.timeToformat3 = function (time) {
            var t;
            if (time) {
                t = new Date(time);
            }
            else {
                t = new Date(this.timestamp());
            }
            var y = t.getFullYear();
            var m = ('00' + Math.floor(t.getMonth() + 1)).slice(-2);
            var d = ('00' + Math.floor(t.getDate())).slice(-2);
            return y + '-' + m + '-' + d;
        };
        TimeUtils.prototype.initTime = function (t) {
            t = t || 0;
            this.severTime = t;
            this.disServerTime = t - Math.floor(new Date().getTime() / 1000);
        };
        //判断是否是当天
        TimeUtils.prototype.isToday = function (time) {
            if (new Date(time * 1000).toDateString() === new Date(this.timestamp() * 1000).toDateString()) {
                return true;
            }
            return false;
        };
        return TimeUtils;
    }());
    timeUtils.TimeUtils = TimeUtils;
    __reflect(TimeUtils.prototype, "timeUtils.TimeUtils");
    timeUtils.time = new TimeUtils();
})(timeUtils || (timeUtils = {}));
var DoorView = (function (_super) {
    __extends(DoorView, _super);
    function DoorView() {
        var _this = _super.call(this, "hallDoor", "mainView") || this;
        _this.mathRadomBg = 0;
        _this.showNum = 18;
        _this.myId = [0, 1, 3, 2, 6, 4, 5, 99];
        _this.nameArr = ["幸运福袋", "欢乐钓鱼", "大圣偷桃", "扫雷", "暗棋争霸", "飞刀挑战", "闯三关", "敬请期待"];
        _this.mcArr = [0, 1, 3, 2, 4, 1, 1, 4]; //mc对应的颜色
        _this.tipsArr = [0, 0, 0, 0, 2, 0, 0, 0]; //tip对应的标签 0是没有1是最热2是最新
        _this._type = 0;
        _this._num = 0;
        _this._dataFlag = false;
        return _this;
    }
    DoorView.prototype.dispose = function () {
        this.remove();
        _super.prototype.dispose.call(this);
    };
    DoorView.prototype.open = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.item = [];
        this._textList = [];
        for (var i = 0; i < 4; i++) {
            if (i < 2) {
                this._textList.push(this.getTextField("txt" + i));
            }
        }
        for (var y = 0; y < this.showNum; y++) {
            this.item.push(new IconSprite(this._ui.getChild("item" + y).asCom));
            this.item[y].addEventListener(IconSprite.ONCLICK, this.itemClick, this);
            this.item[y].myId = y + 1;
        }
        this.btn100 = this._ui.getChild("btn100").asButton;
        if (api.GlobalAPI.publicApi.isRelease) {
            this.btn100.visible = false;
        }
        this.down = this._ui.getChild("down").asCom;
        this.createIcon();
        this.c1 = this._ui.getController("c1");
        this.mathRadomBg = Math.floor(Math.random() * 2) + 1;
        this.itemlist = this.getList("list");
        this.itemlist.itemRenderer = this.iteRenderer;
        this.itemlist.callbackThisObj = this;
        this.itemlist.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL, this.onChange, this);
        this.itemlist.addEventListener(fairygui.ItemEvent.CLICK, this.onItemClick, this);
        api.GlobalAPI.soundManager.changeMusic(false, "");
        api.GlobalAPI.webSocket.request(GameEvent.GetRenshu, {}, this.getRenshu.bind(this));
        api.GlobalAPI.webSocket.request(GameEvent.GetAaminiAccountInfo, {}, this.useDataUpdate.bind(this));
    };
    DoorView.prototype.onChange = function (e) {
        if (this.itemlist.scrollPane.posY + this.itemlist.height >= this.itemlist.scrollPane.contentHeight) {
            this.down.visible = false;
        }
        else {
            this.down.visible = true;
        }
    };
    DoorView.prototype.getListItemResource = function (index) {
        return fairygui.UIPackage.getItemURL("hallDoor", "publicBtn");
    };
    DoorView.prototype.iteRenderer = function (index, item) {
        item.myId(this.myId[index]);
        item.myName(this.nameArr[index]);
        item.setMcShow(this.mcArr[index]);
        item.setTipShow(this.tipsArr[index]);
        if (this.pNum[index] == "") {
            item.enabled = false;
            item.wx("正在维护中...");
        }
        else if (this.pNum[index] == "a") {
            item.wx("敬请期待..");
        }
        else {
            item.enabled = true;
            item.pNum(this.pNum[index]);
        }
    };
    DoorView.prototype.getRenshu = function (data) {
        this.pNum = [];
        var hot = [0, 0]; //热门
        for (var i = 0; i < this.nameArr.length; i++) {
            var atr = "";
            var str = String(data[this.nameArr[i]]);
            if (hot[0] < data[this.nameArr[i]]) {
                hot[0] = data[this.nameArr[i]];
                hot[1] = i;
            }
            if (str == "undefined") {
                atr = "-1";
            }
            else {
                for (var x = 0; x < str.length; x++) {
                    atr += str.charAt(x);
                    if ((str.length - x) % 3 == 1 && x != str.length - 1) {
                        atr += ",";
                    }
                }
            }
            if (Number(atr) == 0) {
                this.pNum.push("");
            }
            else if (Number(atr) == -1) {
                this.pNum.push("a");
            }
            else {
                this.pNum.push(atr);
            }
        }
        this.changeNum(hot[1]);
        this.itemlist.numItems = this.nameArr.length;
    };
    /**
     * 将热门放在第一位
     */
    DoorView.prototype.changeNum = function (num) {
        var t = this.myId[0];
        this.myId[0] = this.myId[num];
        this.myId[num] = t;
        var tt = this.nameArr[0];
        this.nameArr[0] = this.nameArr[num];
        this.nameArr[num] = tt;
        t = this.mcArr[0];
        this.mcArr[0] = this.mcArr[num];
        this.mcArr[num] = t;
        tt = this.pNum[0];
        this.pNum[0] = this.pNum[num];
        this.pNum[num] = tt;
        this.tipsArr[0] = 1;
    };
    DoorView.prototype.onItemClick = function (e) {
        var _this = this;
        var item = e.itemObject;
        switch (item.getMyId()) {
            case 1:
                //红包
                api.GlobalAPI.webSocket.request(GameEvent.getingame, { gameid: 1 }, function (data) {
                    if (data["errorCode"] == 0) {
                        gameTool.stage.setContentSize(1920, 1080);
                        gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
                        api.GlobalAPI.moduleManager.openModule("redProject");
                        _this.dispose();
                    }
                    else {
                        api.createAlert("游戏维护中");
                    }
                });
                //	MemoryLeakUtil.resetObj();
                break;
            case 2:
                //捕鱼
                api.GlobalAPI.webSocket.request(GameEvent.getingame, { gameid: 2 }, function (data) {
                    if (data["errorCode"] == 0) {
                        gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
                        gameTool.stage.setContentSize(1920, 1080);
                        api.GlobalAPI.moduleManager.openModule("fishGame");
                        _this.dispose();
                    }
                    else {
                        api.createAlert("游戏维护中");
                    }
                });
                //	MemoryLeakUtil.compare();
                break;
            case 3:
                //扫雷
                api.GlobalAPI.webSocket.request(GameEvent.getingame, { gameid: 4 }, function (data) {
                    if (data["errorCode"] == 0) {
                        gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
                        gameTool.stage.setContentSize(1920, 1080);
                        api.GlobalAPI.moduleManager.openModule("sweepGame");
                        _this.dispose();
                    }
                    else {
                        api.createAlert("游戏维护中");
                    }
                });
                break;
            case 4:
                api.GlobalAPI.webSocket.request(GameEvent.getingame, { gameid: 5 }, function (data) {
                    if (data["errorCode"] == 0) {
                        api.GlobalAPI.moduleManager.openModule("gzHero");
                        _this.dispose();
                    }
                    else {
                        api.createAlert("游戏维护中");
                    }
                });
                break;
            case 5:
                api.GlobalAPI.webSocket.request(GameEvent.getingame, { gameid: 6 }, function (data) {
                    if (data["errorCode"] == 0) {
                        api.GlobalAPI.moduleManager.openModule("feidao");
                        _this.dispose();
                    }
                    else {
                        api.createAlert("游戏维护中");
                    }
                });
                break;
            case 6:
                api.GlobalAPI.webSocket.request(GameEvent.getingame, { gameid: 7 }, function (data) {
                    if (data["errorCode"] == 0) {
                        api.GlobalAPI.moduleManager.openModule("rouge");
                        _this.dispose();
                    }
                    else {
                        api.createAlert("游戏维护中");
                    }
                });
                break;
            case 7:
                api.GlobalAPI.moduleManager.openModule("xq");
                this.dispose();
                break;
        }
    };
    /**
     * 创建头像
     */
    DoorView.prototype.createIcon = function () {
        this.headIcon = new headIcon(this._ui.getChild("iconKong"));
        this._ui.getChild("btn98").asButton.addChild(this.headIcon);
    };
    /**
     * 头像选择界面头像点击
     */
    DoorView.prototype.itemClick = function (e) {
        this.cleanChooseByItem();
        var curItem = e.currentTarget;
        curItem.choose(true);
        //头像一致就不发消息给后端
        if (this.headIcon.myId == curItem.myId) {
            return;
        }
        this.headIcon.myId = curItem.myId;
        api.GlobalAPI.webSocket.request(GameEvent.ChooseIcon, { icon: curItem.myId });
    };
    /**
     * 头像选择界面点击清空
     */
    DoorView.prototype.cleanChooseByItem = function () {
        for (var y = 0; y < this.showNum; y++) {
            this.item[y].choose(false);
        }
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
    DoorView.prototype.cleanButton = function () {
        for (var x = 0; x < this._buttonList.length; x++) {
            this._buttonList[x].setScale(1, 1);
        }
    };
    /**
     * 初始化监听
     */
    DoorView.prototype.initEvent = function () {
        this.regedEvebt = {};
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
        api.GlobalAPI.soundManager.playEffectBuYrl("resource/assets/common/click.mp3", 1);
        var num = this._buttonList.indexOf(e.currentTarget);
        if (num > -1) {
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
                if (data["a"]["username"]) {
                    api.GlobalAPI.userData.setUserName(data["a"]["username"]);
                }
                if (data["a"]["coins"]) {
                    api.GlobalAPI.userData.setUserCoins(data["a"]["coins"]);
                }
                else {
                    api.GlobalAPI.userData.setUserCoins(0);
                }
                this.iconShow(data["a"]["icon"]);
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
     * 头像展示
     */
    DoorView.prototype.iconShow = function (num) {
        if (num == 0) {
            num = 1;
        }
        this.cleanChooseByItem();
        this.item[num - 1].choose(true);
        this.headIcon.myId = num;
        api.GlobalAPI.userData.setUserIcon(this.headIcon.myId);
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
        _super.prototype.clickHandler.call(this, index);
        switch (index) {
            case 100:
                api.GlobalAPI.webSocket.request(GameEvent.AddCoins, {}, this.addCoinsBack.bind(this));
                break;
            case 99:
                this.c1.setSelectedIndex(0);
                break;
            case 98:
                this.c1.setSelectedIndex(1);
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
            api.GlobalAPI.userData.setUserCoins(data["a"]["coins"]);
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
        // for(var x :number = 0;x<this._buttonList.length;x++)
        // {
        // 	this._buttonList[x].removeEventListener(mouse.MouseEvent.ROLL_OVER, this.onRollOver, this);
        // 	this._buttonList[x].removeEventListener(mouse.MouseEvent.ROLL_OUT, this.onRollOut, this);
        // }
    };
    return DoorView;
}(gui.OvBase));
__reflect(DoorView.prototype, "DoorView");
var IconView = (function () {
    function IconView(v, myIcon) {
        this.mainView = v;
        this._myIcon = myIcon;
        this.initView();
    }
    IconView.prototype.initView = function () {
        this.itemlist = this.mainView.getChild("list").asList;
        this.itemlist.itemRenderer = this.iteRenderer;
        this.itemlist.callbackThisObj = this;
        this.itemlist.numItems = 18;
        this.itemlist.addEventListener(fairygui.ItemEvent.CLICK, this.onItemClick, this);
        this.btn = [];
        this.btn.push(this.mainView.getChild("btn0").asButton);
        this.btn.push(this.mainView.getChild("btn1").asButton);
        this.btn[0].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.btn[1].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    IconView.prototype.onClick = function (e) {
        var num = this.btn.indexOf(e.currentTarget);
        if (num > -1) {
            if (num == 0) {
                notification.postNotification(GameEvent.web_closeDoor);
            }
            else {
                //选择头像
                //头像一致就不发消息给后端
                if (api.GlobalAPI.userData.getUserIcon() == this.chooseId) {
                    return;
                }
                this._myIcon.myId = this.chooseId;
                api.GlobalAPI.webSocket.request(GameEvent.ChooseIcon, { icon: this.chooseId });
                notification.postNotification(GameEvent.web_closeDoor);
            }
        }
    };
    IconView.prototype.iteRenderer = function (index, item) {
        item.myId = index + 1;
    };
    IconView.prototype.onItemClick = function (e) {
        var item = e.itemObject;
        this.cleanChooseByItem();
        item.choose(true);
        this.chooseId = item.myId;
    };
    /**
     * 头像选择界面点击清空
     */
    IconView.prototype.cleanChooseByItem = function () {
        for (var y = 0; y < 18; y++) {
            var items = this.itemlist.getChildAt(y);
            items.choose(false);
        }
    };
    return IconView;
}());
__reflect(IconView.prototype, "IconView");
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
        api.GlobalAPI.soundManager.playEffectBuYrl("resource/assets/common/click.mp3", 1);
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
            api.GlobalAPI.webSocket.login(data["open_id"]);
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
var PcDoorView = (function (_super) {
    __extends(PcDoorView, _super);
    function PcDoorView() {
        var _this = _super.call(this, "pcDoor", "mainView") || this;
        //	private item :IconSprite[];
        _this.showNum = 18;
        _this.myId = [0, 1, 3, 2, 6, 4, 5, 99];
        _this.nameArr = ["幸运福袋", "欢乐钓鱼", "大圣偷桃", "扫雷", "暗棋争霸", "飞刀挑战", "闯三关", "敬请期待"];
        _this.mcArr = [0, 1, 3, 2, 4, 1, 1, 4]; //mc对应的颜色
        _this.tipsArr = [0, 0, 0, 0, 2, 0, 0, 0]; //tip对应的标签 0是没有1是最热2是最新
        return _this;
    }
    PcDoorView.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    PcDoorView.prototype.open = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._textList = [];
        for (var i = 0; i < 4; i++) {
            if (i < 2) {
                this._textList.push(this.getTextField("txt" + i));
            }
        }
        this.btn100 = this._ui.getChild("btn100").asButton;
        if (api.GlobalAPI.publicApi.isRelease) {
            this.btn100.visible = false;
        }
        this.createIcon();
        this.c1 = this._ui.getController("c1");
        this.iconView = new IconView(this._ui.getChild("iconView").asCom, this.headIcon);
        api.GlobalAPI.soundManager.changeMusic(false, "");
        api.GlobalAPI.webSocket.request(GameEvent.GetRenshu, {}, this.getRenshu.bind(this));
        api.GlobalAPI.webSocket.request(GameEvent.GetAaminiAccountInfo, {}, this.useDataUpdate.bind(this));
        notification.addNotification(GameEvent.web_closeDoor, this.closeIcon, this);
    };
    PcDoorView.prototype.closeIcon = function () {
        this.c1.setSelectedIndex(0);
    };
    PcDoorView.prototype.getRenshu = function (data) {
        this.pNum = [];
        var hot = [0, 0]; //热门
        for (var i = 0; i < this.nameArr.length; i++) {
            var atr = "";
            var str = String(data[this.nameArr[i]]);
            if (str == "undefined") {
                atr = "-1";
            }
            else {
                for (var x = 0; x < str.length; x++) {
                    atr += str.charAt(x);
                    if ((str.length - x) % 3 == 1 && x != str.length - 1) {
                        atr += ",";
                    }
                }
            }
            if (atr != "-1") {
                this._ui.getChild("btn" + (i + 1)).asButton.getChild("txt").text = atr + "人在玩";
            }
        }
    };
    /**
     * 创建头像
     */
    PcDoorView.prototype.createIcon = function () {
        this.headIcon = new headIcon(this._ui.getChild("iconKong"));
        this._ui.getChild("btn98").asButton.addChild(this.headIcon);
    };
    PcDoorView.prototype.onRollOver = function (e) {
        var num = this._buttonList.indexOf(e.currentTarget);
        if (num > -1) {
            this._buttonList[num].setScale(1.1, 1.1);
        }
    };
    PcDoorView.prototype.onRollOut = function (e) {
        var num = this._buttonList.indexOf(e.currentTarget);
        if (num > -1) {
            this._buttonList[num].setScale(1, 1);
        }
    };
    PcDoorView.prototype.cleanButton = function () {
        for (var x = 0; x < this._buttonList.length; x++) {
            this._buttonList[x].setScale(1, 1);
        }
    };
    /**
     * 初始化监听
     */
    PcDoorView.prototype.initEvent = function () {
        this.regedEvebt = {};
        this.eventInit();
    };
    PcDoorView.prototype.kickoutF = function () {
        var _this = this;
        api.createAlert("账户在别处登陆，请重新连接", 1, function (type) {
            _this.dispose();
            gui.addScene(LoginView);
        });
    };
    PcDoorView.prototype.eventInit = function () {
        if (this.regedEvebt != null) {
            for (var o in this.regedEvebt) {
                api.GlobalAPI.webSocket.on(o, this.regedEvebt[o]);
            }
        }
    };
    /**
     * 消息移除
     */
    PcDoorView.prototype.eventRemove = function () {
        if (this.regedEvebt != null) {
            for (var o in this.regedEvebt) {
                api.GlobalAPI.webSocket.off(o, this.regedEvebt[o]);
            }
        }
    };
    PcDoorView.prototype.onClick = function (e) {
        _super.prototype.onClick.call(this, e);
        api.GlobalAPI.soundManager.playEffectBuYrl("resource/assets/common/click.mp3", 1);
        var num = this._buttonList.indexOf(e.currentTarget);
        if (num > -1) {
            this._buttonList[num].setScale(1, 1);
        }
    };
    /**
     * 玩家数据更新
     */
    PcDoorView.prototype.useDataUpdate = function (data) {
        var _this = this;
        if (data["errorCode"] == 0) {
            //用户获取成功
            if (data["a"]) {
                if (data["a"]["username"]) {
                    api.GlobalAPI.userData.setUserName(data["a"]["username"]);
                }
                if (data["a"]["coins"]) {
                    api.GlobalAPI.userData.setUserCoins(data["a"]["coins"]);
                }
                else {
                    api.GlobalAPI.userData.setUserCoins(0);
                }
                this.iconShow(data["a"]["icon"]);
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
     * 头像展示
     */
    PcDoorView.prototype.iconShow = function (num) {
        if (num == 0) {
            num = 1;
        }
        //	this.cleanChooseByItem();
        //		this.item[num-1].choose(true);
        this.headIcon.myId = num;
        api.GlobalAPI.userData.setUserIcon(this.headIcon.myId);
    };
    /**
     * 界面更新
     */
    PcDoorView.prototype.update = function () {
        this.setText(0, api.GlobalAPI.userData.getUserName());
        this.setText(1, api.GlobalAPI.userData.getUserCoins());
    };
    /**********************************************************/
    PcDoorView.prototype.clickHandler = function (index) {
        var _this = this;
        _super.prototype.clickHandler.call(this, index);
        switch (index) {
            case 100:
                api.GlobalAPI.webSocket.request(GameEvent.AddCoins, {}, this.addCoinsBack.bind(this));
                break;
            case 1:
                //红包
                api.GlobalAPI.webSocket.request(GameEvent.getingame, { gameid: 1 }, function (data) {
                    if (data["errorCode"] == 0) {
                        gameTool.stage.setContentSize(1920, 1080);
                        gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
                        api.GlobalAPI.moduleManager.openModule("redProject");
                        _this.dispose();
                    }
                    else {
                        api.createAlert("游戏维护中");
                    }
                });
                //	MemoryLeakUtil.resetObj();
                break;
            case 2:
                //捕鱼
                api.GlobalAPI.webSocket.request(GameEvent.getingame, { gameid: 2 }, function (data) {
                    if (data["errorCode"] == 0) {
                        gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
                        gameTool.stage.setContentSize(1920, 1080);
                        api.GlobalAPI.moduleManager.openModule("fishGame");
                        _this.dispose();
                    }
                    else {
                        api.createAlert("游戏维护中");
                    }
                });
                //	MemoryLeakUtil.compare();
                break;
            case 3:
                //扫雷
                api.GlobalAPI.webSocket.request(GameEvent.getingame, { gameid: 4 }, function (data) {
                    if (data["errorCode"] == 0) {
                        gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
                        gameTool.stage.setContentSize(1920, 1080);
                        api.GlobalAPI.moduleManager.openModule("sweepGame");
                        _this.dispose();
                    }
                    else {
                        api.createAlert("游戏维护中");
                    }
                });
                break;
            case 4:
                api.GlobalAPI.webSocket.request(GameEvent.getingame, { gameid: 5 }, function (data) {
                    if (data["errorCode"] == 0) {
                        api.GlobalAPI.moduleManager.openModule("gzHero");
                        _this.dispose();
                    }
                    else {
                        api.createAlert("游戏维护中");
                    }
                });
                break;
            case 5:
                api.GlobalAPI.webSocket.request(GameEvent.getingame, { gameid: 6 }, function (data) {
                    if (data["errorCode"] == 0) {
                        api.GlobalAPI.moduleManager.openModule("feidao");
                        _this.dispose();
                    }
                    else {
                        api.createAlert("游戏维护中");
                    }
                });
                break;
            case 6:
                api.GlobalAPI.webSocket.request(GameEvent.getingame, { gameid: 7 }, function (data) {
                    if (data["errorCode"] == 0) {
                        api.GlobalAPI.moduleManager.openModule("rouge");
                        _this.dispose();
                    }
                    else {
                        api.createAlert("游戏维护中");
                    }
                });
                break;
            case 7:
                api.GlobalAPI.moduleManager.openModule("xq");
                this.dispose();
                break;
            case 98:
                this.c1.setSelectedIndex(1);
                break;
            default:
                break;
        }
    };
    PcDoorView.prototype.inRoom = function () {
        this.dispose();
        setTimeout(function () {
            var ip = "47.52.32.227";
            var port = 9994;
            api.GlobalAPI.webSocket.connectServer(ip + ":" + port, function () {
                gui.addScene(LoginView);
            });
        }, 500);
    };
    PcDoorView.prototype.addCoinsBack = function (data) {
        if (data["a"]) {
            this.setText(1, data["a"]["coins"]);
            api.GlobalAPI.userData.setUserCoins(data["a"]["coins"]);
        }
    };
    return PcDoorView;
}(gui.OvBase));
__reflect(PcDoorView.prototype, "PcDoorView");
