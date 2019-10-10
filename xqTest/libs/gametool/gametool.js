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
/**
 *
 * @author
 *
 */
var gameTool;
(function (gameTool) {
    var List = (function () {
        // 池列表
        function List() {
            this._list = {};
        }
        /* 释放*/
        List.prototype.dispose = function () {
            for (var key in this._list) {
                this._list[key].dispose();
                this._list[key] = null;
                delete this._list[key];
            }
        };
        /**
         * 批量导入列表
         */
        List.prototype.addBatch = function (list) {
            var len = list.length;
            var i = 0;
            for (i = 0; i < len; i++) {
                this.keyToCl(list[i]);
            }
        };
        /**
         * 添加单个定义
         */
        List.prototype.addSingal = function (data) {
            this.keyToCl(data);
        };
        /*获取实例*/
        List.prototype.getInstance = function (keyClass) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var key = definiton.getNameByClass(keyClass);
            this.checkListData(keyClass);
            var obj = (_a = this._list[key]).getFreeObj.apply(_a, args);
            return obj;
            var _a;
        };
        /*回收实例*/
        List.prototype.remove = function (obj) {
            this._list[definiton.getClassNameByObject(obj)].retrieve(obj);
        };
        /*回收最早实例化的对象*/
        List.prototype.removeFrontObj = function (keyClass) {
            var key = definiton.getNameByClass(keyClass);
            var pool = this._list[key];
            if (pool.getList().length) {
                this._list[key].retrieve(pool.getList()[0]);
            }
        };
        /*回收最晚实例化的对象*/
        List.prototype.removeBackObj = function (keyClass) {
            var key = definiton.getNameByClass(keyClass);
            var pool = this._list[key];
            if (pool.getList().length) {
                this._list[key].retrieve(pool.getList()[pool.getList().length - 1]);
            }
        };
        /*获取未回收的所有对象*/
        List.prototype.getActivityObj = function (keyClass) {
            var key = definiton.getNameByClass(keyClass);
            this.checkListData(keyClass);
            return this._list[key].getList();
        };
        /*播放对应的IPlay*/
        List.prototype.play = function (keyClass) {
            this.checkListData(keyClass);
            this.playByMethod(definiton.getNameByClass(keyClass), "play");
        };
        /*
         * 播放对应的方法
         * key			键值
         * method		要执行的方法
         * args			方法参数
         * fun		    限制条件
         */
        List.prototype.playByMethod = function (key, method, args, fun, context) {
            var pool = this._list[key];
            var list = pool.getList();
            var arr = fun ? mathTool.findList(list, fun, context) : list;
            for (var i in arr) {
                if (typeof method == "string") {
                    if (args && typeof args[0] == typeof arr[i][method]) {
                        arr[i][method] = args[0];
                    }
                    else {
                        arr[i][method].apply(arr[i], args);
                    }
                }
                else {
                    method.apply(arr[i], args);
                }
            }
        };
        /*回收全部活动实例*/
        List.prototype.removeAll = function (keyClass) {
            var arr = this.getActivityObj(keyClass);
            while (arr.length) {
                // 是为了让先出来的实例回收之后也是先出来
                this.remove(arr[arr.length - 1]);
            }
        };
        /* 销毁全部活动实例*/
        List.prototype.disposeAll = function (keyClass) {
            var arr = this.getActivityObj(keyClass);
            while (arr.length) {
                // 是为了让先出来的实例回收之后也是先出来
                var obj = arr[arr.length - 1];
                this.remove(obj);
            }
            var key = definiton.getNameByClass(keyClass);
            this._list[key].clearPool();
        };
        /************************************************************************************************/
        /*生成池对象*/
        List.prototype.keyToCl = function (listData) {
            if (!this._list[listData.getKey()]) {
                this._list[listData.getKey()] = new gameTool.GamePool(listData.getCl(), listData.getInitObj());
            }
        };
        List.prototype.checkListData = function (keyClass) {
            var key = definiton.getNameByClass(keyClass);
            if (this._list[key] == null) {
                this.keyToCl(new gameTool.ListData(keyClass));
            }
        };
        return List;
    }());
    gameTool.List = List;
    __reflect(List.prototype, "gameTool.List");
})(gameTool || (gameTool = {}));
/**
 * Created by lxz on 2017/10/16.
 */
var gui;
(function (gui) {
    var WindowManager = (function () {
        function WindowManager() {
            this._windowClassList = {};
            this._windowList = {};
            this._scenes = [];
        }
        /**
         * 初始化舞台
         */
        WindowManager.prototype.initRootView = function (root) {
            this._root = root;
            this._layers = {};
            this._layerIndexs = [];
            this.addDisplayToStage(fairygui.GRoot.inst.displayObject, define.WindowType.POP_LAYER);
        };
        /**
         * 添加显示对象到舞台
         */
        WindowManager.prototype.addDisplayToStage = function (display, type) {
            if (this._layers[type] == null) {
                var container = new egret.DisplayObjectContainer();
                this._layers[type] = container;
                this._layers[gameTool.getTypeId(container)] = true;
                this._layerIndexs.push(type);
                this._layerIndexs.sort(function (a, b) {
                    return a - b;
                });
                var n = this._layerIndexs.indexOf(type);
                gameTool.display.setFullDisplay(container);
                this._root.addChildAt(this._layers[type], n);
            }
            this._layers[type].addChild(display);
        };
        WindowManager.prototype.addGComponentToStage = function (com, type) {
            this.addDisplayToStage(com.displayObject, type);
        };
        /**
         * 是否是管理层级
         */
        WindowManager.prototype.inLayer = function (layer) {
            return this._layers[gameTool.getTypeId(layer)];
        };
        /**
         * 添加场景
         * 场景是互斥的，此处添加一个场景，则会移除其他场景
         */
        WindowManager.prototype.addScene = function (obj) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (definiton.isClass(obj)) {
                if (this._curScene && definiton.getClassByObject(this._curScene) == obj)
                    return; //同一个场景不处理
            }
            if (this._curScene) {
                this.remove(this._curScene);
            }
            this._curScene = this.addWindow.apply(this, [obj, define.UITypeDefine.SCENE].concat(args));
            this._curScene.inSceneQueue = true;
            return this._curScene;
        };
        /**
         * 显示一个弹窗，默认弹窗是可以多个叠加出现的，所以此处默认不会关闭其他窗口
         * @param viewCls
         * @param args
         * @returns {BaseComponent}
         */
        WindowManager.prototype.addBox = function (obj) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return this.addWindow.apply(this, [obj, define.UITypeDefine.BOX].concat(args));
        };
        /**
         * 移除一个视图
         * @param view
         */
        WindowManager.prototype.remove = function (view) {
            var _this = this;
            if (view.inClose) {
                return;
            }
            view.inClose = true;
            if (view.inSceneQueue) {
                mathTool.addValueByArray(definiton.getClassByObject(view), this._scenes);
            }
            if (this._curScene == view) {
                this._curScene = null;
            }
            var ani = view.animation;
            notification.removeNotificationByObject(view);
            if (ani) {
                if (ani.inClose) {
                    return;
                }
                //视图作为参数传入，视为防止再关闭动画期间，视图指针变化导致空指针异常
                ani.close(function (v) {
                    _this.removeView(v);
                }, this, view);
            }
            else {
                this.removeView(view);
            }
        };
        WindowManager.prototype.addWindow = function (obj, defaultUIType) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var window;
            if (definiton.isClass(obj)) {
                var cl = obj;
                window = new cl;
            }
            else {
                window = obj;
            }
            window.inClose = false;
            if (window.uiType == define.UITypeDefine.NONE) {
                window.uiType = defaultUIType;
            }
            fairygui.GRoot.inst.showWindow(window);
            window.enter.apply(window, args);
            var str = definiton.getClassNameByObject(window);
            if (this._windowClassList[str] == null) {
                this._windowClassList[str] = [window];
            }
            else {
                this._windowClassList[str].push(window);
            }
            this._windowList[gameTool.getTypeId(window)] = window;
            return window;
        };
        /**
         * 是否在stage中已经存在该类型的window
         */
        WindowManager.prototype.hasWindowTypeInStage = function (cl) {
            var arr = this._windowClassList[definiton.getNameByClass(cl)];
            return arr != null && arr.length > 0;
        };
        /**
         * 移除该类型的window
         */
        WindowManager.prototype.removeViewByClass = function (cl) {
            var arr = this._windowClassList[definiton.getNameByClass(cl)];
            for (var key in arr) {
                this.remove(arr[key]);
            }
        };
        /**
         * 移除stage所有窗口
         */
        WindowManager.prototype.removeAllView = function () {
            for (var typeID in this._windowList) {
                this.remove(this._windowList[typeID]);
            }
        };
        /**
         * 获取当前上一个场景
         */
        WindowManager.prototype.getPrevScene = function () {
            return this._scenes.length > 0 ? this._scenes[this._scenes.length - 1] : null;
        };
        /**
         * 退回上一个场景
         */
        WindowManager.prototype.prevScene = function () {
            if (!this.getPrevScene()) {
                return false;
            }
            var cur = this._curScene;
            var b = cur.inSceneQueue;
            cur.inSceneQueue = false;
            gui.addScene(this._scenes.pop());
            cur.inSceneQueue = b;
            return true;
        };
        /**
         * 手动压入后续界面
         */
        WindowManager.prototype.pushScene = function (view) {
            this._scenes.push(view);
        };
        /******************************************************************/
        /**
         * 移除一个视图
         * @param view
         */
        WindowManager.prototype.removeView = function (view) {
            var typeID = gameTool.getTypeId(view);
            this._windowList[typeID] = null;
            delete this._windowList[typeID];
            mathTool.cutValueByArray(view, this._windowClassList[definiton.getClassNameByObject(view)]);
            view.exit();
            var uiType = view.uiType;
            switch (uiType) {
                case define.UITypeDefine.SCENE:
                    view.dispose();
                    break;
                case define.UITypeDefine.BOX:
                    view.dispose();
                    break;
                default:
                    view.dispose();
                    break;
            }
        };
        return WindowManager;
    }());
    gui.WindowManager = WindowManager;
    __reflect(WindowManager.prototype, "gui.WindowManager");
    /**
     * 添加场景
     * 场景是互斥的，此处添加一个场景，则会移除其他场景
     */
    function addScene(viewCls) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (_a = gameTool.singleton(WindowManager)).addScene.apply(_a, [viewCls].concat(args));
        var _a;
    }
    gui.addScene = addScene;
    /**
     * 显示一个弹窗，默认弹窗是可以多个叠加出现的，所以此处默认不会关闭其他窗口
     * @param viewCls
     * @param args
     * @returns {BaseComponent}
     */
    function addBox(viewCls) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (_a = gameTool.singleton(WindowManager)).addBox.apply(_a, [viewCls].concat(args));
        var _a;
    }
    gui.addBox = addBox;
    /**
     * 移除一个视图
     * @param view
     */
    function remove(view) {
        gameTool.singleton(WindowManager).remove(view);
    }
    gui.remove = remove;
    /**
     * 初始化舞台
     */
    function initRootView(root) {
        gameTool.singleton(WindowManager).initRootView(root);
    }
    gui.initRootView = initRootView;
    /**
     * 添加显示对象到舞台
     */
    function addDisplayToStage(display, type) {
        gameTool.singleton(WindowManager).addDisplayToStage(display, type);
    }
    gui.addDisplayToStage = addDisplayToStage;
    /**
     * 添加gui显示对象到舞台
     */
    function addGComponentToStage(com, type) {
        gameTool.singleton(WindowManager).addGComponentToStage(com, type);
    }
    gui.addGComponentToStage = addGComponentToStage;
    /**
     * 是否在stage中已经存在该类型的window
     */
    function hasWindowTypeInStage(cl) {
        return gameTool.singleton(WindowManager).hasWindowTypeInStage(cl);
    }
    gui.hasWindowTypeInStage = hasWindowTypeInStage;
    /**
     * 移除stage所有窗口
     */
    function removeAllView() {
        return gameTool.singleton(WindowManager).removeAllView();
    }
    gui.removeAllView = removeAllView;
    /**
     * 移除该类型的window
     */
    function removeViewByClass(cl) {
        return gameTool.singleton(WindowManager).removeViewByClass(cl);
    }
    gui.removeViewByClass = removeViewByClass;
    /**
     * 获取当前上一个场景
     */
    function getPrevScene() {
        return gameTool.singleton(WindowManager).getPrevScene();
    }
    gui.getPrevScene = getPrevScene;
    /**
     * 退回上一个场景
     */
    function prevScene() {
        return gameTool.singleton(WindowManager).prevScene();
    }
    gui.prevScene = prevScene;
    /**
     * 手动压入后续界面
     */
    function pushScene(view) {
        gameTool.singleton(WindowManager).pushScene(view);
    }
    gui.pushScene = pushScene;
    /******************************************************************/
    /******************************************************************/
    /******************************************************************/
    /**
     * 窗口基类，虽说是继承fairygui的Window，
     * 但是它的资源加载无法添加进度条，于是在BaseWindow的子类URLWindow去做这个事情。
     * 继承它为了能接入fairygui的管理
     */
    var BaseWindow = (function (_super) {
        __extends(BaseWindow, _super);
        function BaseWindow(modal, center) {
            if (modal === void 0) { modal = true; }
            if (center === void 0) { center = true; }
            var _this = _super.call(this) || this;
            _this.modal = modal;
            _this._isCenter = center;
            _this._buttonList = [];
            _this._uiType = define.UITypeDefine.NONE;
            delay.createDelayMain(_this);
            return _this;
        }
        BaseWindow.prototype.enter = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (delay.hasDelayMain(this)) {
                delay.addDelayTransact.apply(delay, [this, this.enter].concat(args));
                return;
            }
            switch (this._uiType) {
                case define.UITypeDefine.SCENE:
                    this.animation = new gui.SceneAnimation();
                    break;
                case define.UITypeDefine.BOX:
                    this.animation = new gui.BoxAnimation();
                    break;
            }
            if (this._animation) {
                this._animation.show(this.show, this);
            }
            // if (this.getViewData()) {
            //     this.updateViewData();
            // }
            this.open.apply(this, args);
        };
        /**
         * 接收数据完成
         */
        BaseWindow.prototype.updateViewData = function () {
        };
        /**
         * 资源初始化完成
         */
        BaseWindow.prototype.open = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
        };
        /**
         * 窗口动画完成
         */
        BaseWindow.prototype.show = function () {
        };
        /**
         * 退出窗口
         */
        BaseWindow.prototype.exit = function () {
            bind.removeBindByObject(this);
        };
        /**
         * 初始化窗口，4步操作
         * 1、初始化视图
         * 2、注册事件
         * 3、重新绘制窗口
         * 4、获得所有按钮并注册事件
         */
        BaseWindow.prototype.onInit = function () {
            _super.prototype.onInit.call(this);
            this.initView();
            this.initEvent();
            this.registerButtons(this._ui);
            this.setSize(gameTool.display.stageW, gameTool.display.stageH);
            this.addRelation(this._ui, fairygui.RelationType.Size);
            if (this._isCenter) {
                this._ui.x = (gameTool.stage.stageWidth - this._ui.width) * .5;
                this._ui.y = (gameTool.stage.stageHeight - this._ui.height) * .5;
                //this.centerOn(fairygui.GRoot.inst, true);
            }
            this._ui.setPivot(0.5, 0.5);
            delay.executeAllTransact(this);
            if (window) {
                window.onresize = this.onResize.bind(this);
            }
        };
        BaseWindow.prototype.onResize = function () {
        };
        BaseWindow.prototype.dispose = function () {
            gameTool.destoryChildrenNotice(this);
            if (this._buttonList) {
                var btnLen = this._buttonList.length;
                for (var i = 0; i < btnLen; i++) {
                    var btn = this._buttonList[i];
                    btn.removeClickListener(this.onClick, this);
                }
                this._buttonList.length = 0;
            }
            if (this._bg) {
                this._bg.dispose();
                this._bg = null;
            }
            if (this._ui) {
                this._ui.dispose();
                this._ui = null;
            }
            if (this.mainView) {
                this.mainView.dispose();
                this.mainView = null;
            }
            if (this._animation) {
                this._animation.dispose();
                this._animation = null;
            }
            _super.prototype.dispose.call(this);
        };
        /******************************************************************/
        BaseWindow.prototype.initView = function () {
        };
        BaseWindow.prototype.initEvent = function () {
        };
        BaseWindow.prototype.removeEvent = function () {
        };
        BaseWindow.prototype.onClick = function (e) {
        };
        /**************************component register***************************/
        /**
         * 注册按钮 在onClick里面，判断按钮的名字以区分点的是哪个按钮
         */
        BaseWindow.prototype.registerButtons = function (container) {
            if (container == null) {
                throw new Error("窗口不存在，不能注册按钮");
            }
            var childLen = container.numChildren;
            for (var i = 0; i < childLen; i++) {
                var child = container.getChildAt(i);
                if (child instanceof fairygui.GButton) {
                    this.getButton(child.name, container);
                }
            }
        };
        //获得按钮 第一次获得会注册点击事件
        BaseWindow.prototype.getButton = function (resName, container) {
            if (container === void 0) { container = null; }
            var btn = this.getComponent(resName, container);
            if (this._buttonList.indexOf(btn) >= 0) {
                return btn;
            }
            this._buttonList.push(btn);
            btn.addClickListener(this.onClick, this);
            return btn;
        };
        //获得对象
        BaseWindow.prototype.getComponent = function (resName, p_container) {
            if (p_container === void 0) { p_container = null; }
            var container;
            if (p_container == null) {
                container = this._ui;
            }
            else {
                container = p_container;
            }
            if (container == null)
                throw new Error("父容器是空的");
            return container.getChild(resName);
        };
        //获得文本
        BaseWindow.prototype.getTextField = function (resName, container) {
            if (container === void 0) { container = null; }
            return this.getComponent(resName, container).asTextField;
        };
        //获得列表
        BaseWindow.prototype.getList = function (resName, container) {
            if (container === void 0) { container = null; }
            return this.getComponent(resName, container);
        };
        /**
         * 获得loader
         */
        BaseWindow.prototype.getLoader = function (resName, container) {
            if (container === void 0) { container = null; }
            return this.getComponent(resName, container).asLoader;
        };
        Object.defineProperty(BaseWindow.prototype, "animation", {
            get: function () {
                return this._animation;
            },
            /******************************************************************/
            set: function (ani) {
                if (this._animation) {
                    this._animation.dispose();
                }
                this._animation = ani;
                ani.component = this._ui;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseWindow.prototype, "uiType", {
            get: function () {
                return this._uiType;
            },
            set: function (value) {
                if (this._uiType == value) {
                    return;
                }
                this._uiType = value;
            },
            enumerable: true,
            configurable: true
        });
        BaseWindow.prototype.getViewData = function () {
            return this._viewData;
        };
        BaseWindow.prototype.setViewData = function (value) {
            if (delay.hasDelayMain(this)) {
                delay.addDelayTransact(this, this.setViewData, value);
                return;
            }
            this._viewData = value;
            this.updateViewData();
        };
        return BaseWindow;
    }(fairygui.Window));
    gui.BaseWindow = BaseWindow;
    __reflect(BaseWindow.prototype, "gui.BaseWindow");
})(gui || (gui = {}));
/**
 * Created by lxz on 2017/10/17.
 */
var extendsUI;
(function (extendsUI) {
    var BaseContainer = (function (_super) {
        __extends(BaseContainer, _super);
        function BaseContainer() {
            var _this = _super.call(this) || this;
            _this._hitRect = new egret.Rectangle();
            return _this;
        }
        BaseContainer.prototype.dispose = function () {
            notification.removeNotificationByObject(this);
            this.parent && this.parent.removeChild(this);
            this._hitRect = null;
        };
        /**
         * 是否与其他容器碰撞
         */
        BaseContainer.prototype.intersectsByContainer = function (container) {
            return this.hitRect.intersects(container.hitRect);
        };
        /**
         * 是否包含了某个点
         */
        BaseContainer.prototype.containsPoint = function (x, y) {
            return this.hitRect.contains(x, y);
        };
        Object.defineProperty(BaseContainer.prototype, "hitRect", {
            /******************************************************************/
            get: function () {
                var dx = this.scaleX * (this.scaleX < 0 ? (this.anchorOffsetX - this.width) : this.anchorOffsetX);
                var dy = this.scaleY * (this.scaleY < 0 ? (this.anchorOffsetY - this.height) : this.anchorOffsetY);
                this._hitRect.x = this.x - dx;
                this._hitRect.y = this.y - dy;
                this._hitRect.width = Math.abs(this.width * this.scaleX);
                this._hitRect.height = Math.abs(this.height * this.scaleY);
                return this._hitRect;
            },
            enumerable: true,
            configurable: true
        });
        return BaseContainer;
    }(egret.DisplayObjectContainer));
    extendsUI.BaseContainer = BaseContainer;
    __reflect(BaseContainer.prototype, "extendsUI.BaseContainer");
})(extendsUI || (extendsUI = {}));
///<reference path="gui.ts" />
var gui;
(function (gui) {
    var OvBase = (function (_super) {
        __extends(OvBase, _super);
        function OvBase(pkgName, resName, modal, center, loadingView) {
            if (modal === void 0) { modal = true; }
            if (center === void 0) { center = true; }
            if (loadingView === void 0) { loadingView = null; }
            var _this = _super.call(this, modal, center) || this;
            _this._pkgName = pkgName;
            _this._resName = resName;
            _this.className = pkgName + "_" + resName;
            if (fairygui.UIPackage.getByName(pkgName) == null) {
                if (RES.getRes(pkgName) || RES.getRes(pkgName + "_fui")) {
                    fairygui.UIPackage.addPackage(pkgName);
                    _this.initUI(pkgName, resName);
                }
                else {
                    if (RES.getGroupByName(pkgName)) {
                        loadUtil.loadGroup(pkgName, loadingView, _this.loadResComplete, _this);
                    }
                    else {
                        throw new Error("\u6CA1\u6709\u5BF9\u5E94\u7684" + pkgName + "\u8D44\u6E90\u7EC4");
                    }
                }
            }
            else {
                _this.initUI(pkgName, resName);
            }
            return _this;
        }
        OvBase.prototype.dispose = function () {
            gui.removeBindGuiProperty(this);
            if (this._textList) {
                var len = this._textList.length;
                for (var i = 0; i < len; i++) {
                    this._textList[i].dispose();
                }
                this._textList = null;
            }
            if (this._ivs) {
                var len = this._ivs.length;
                for (var i = 0; i < len; i++) {
                    this._ivs[i].dispose();
                }
                this._ivs = null;
            }
            _super.prototype.dispose.call(this);
        };
        OvBase.prototype.updateItemView = function (index) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            (_a = this._ivs[index]).update.apply(_a, args);
            var _a;
        };
        OvBase.prototype.setText = function (index, text) {
            this._textList[index].text = text.toString();
        };
        OvBase.prototype.getText = function (index) {
            return this._textList[index].text;
        };
        OvBase.prototype.getTextFiled = function (index) {
            return this._textList[index];
        };
        /**
         * 设置设配
         */
        OvBase.prototype.fullWindow = function (width, height) {
            if (width === void 0) { width = 750; }
            if (height === void 0) { height = 1334; }
            // let w = document.body.clientWidth;
            // let h = document.body.clientHeight;
            var h = gameTool.stage.stageHeight;
            var w = gameTool.stage.stageWidth;
            var scaleX = width / w;
            var scaleY = height / h;
            if (scaleX < scaleY) {
                this._ui.setSize(width, h * scaleX);
            }
            else {
                this._ui.setSize(w * scaleY, height);
            }
            this._ui.setXY(0, 0);
        };
        OvBase.prototype.onInit = function () {
            if (fairygui.UIPackage.getByName(this._pkgName) == null) {
                return;
            }
            _super.prototype.onInit.call(this);
        };
        /******************************************************************/
        OvBase.prototype.initView = function () {
            _super.prototype.initView.call(this);
            this._textList = [];
            this._ivs = [];
            this.registerTexts(this._ui);
        };
        OvBase.prototype.onClick = function (e) {
            var name = e.currentTarget.name;
            var pre = "btn";
            var index = name.indexOf(pre);
            if (index < 0) {
                return;
            }
            index = parseInt(name.substr(pre.length));
            switch (index) {
                case 0:
                    gui.remove(this);
                    break;
            }
            this.clickHandler(index);
        };
        OvBase.prototype.clickHandler = function (index) {
        };
        OvBase.prototype.registerTexts = function (container) {
            if (container == null) {
                throw new Error("窗口不存在，不能注册按钮").message;
            }
            var childLen = container.numChildren;
            for (var i = 0; i < childLen; i++) {
                var child = container.getChildAt(i);
                if (child instanceof fairygui.GTextField) {
                    if (child.name.indexOf("text") > -1) {
                        this._textList.push(child);
                    }
                }
            }
            this._textList.sort(this.onTextSort);
        };
        OvBase.prototype.initUI = function (pkgName, resName) {
            this.mainView = fairygui.UIPackage.createObject(pkgName, resName).asCom;
            this._ui = this.mainView.getChild("ui").asCom;
            this._bg = this.mainView.getChild("bg").asCom;
            //   this.resize();
            this.onResize();
            gui.bindGuiProperty(this, this._ui);
            this.init();
            this.addChild(this.mainView);
        };
        OvBase.prototype.onResize = function () {
            if (!this._ui) {
                return;
            }
            var clientHeight = document.documentElement.clientHeight;
            var clientWidth = document.documentElement.clientWidth;
            var h = gameTool.stage.stageHeight;
            var w = gameTool.stage.stageWidth;
            var scaleX = this.mainView.width / w;
            var scaleY = this.mainView.height / h;
            if (scaleX < scaleY) {
                this._ui.setScale(h / this.mainView.height, h / this.mainView.height);
            }
            if (this._ui.y > 0) {
                this._ui.setXY(this._ui.x, 0);
            }
            if (this._ui.x > 0) {
                this._ui.setXY(0, this._ui.y);
            }
        };
        /******************************************************************/
        OvBase.prototype.loadResComplete = function () {
            var _this = this;
            // 需要延迟处理gui包,res加载完组直接addPackage会再次调用res的加载导致报错
            var k = egret.setTimeout(function () {
                egret.clearTimeout(k);
                _this._inited = false;
                fairygui.UIPackage.addPackage(_this._pkgName);
                _this.initUI(_this._pkgName, _this._resName);
            }, this, 100);
        };
        OvBase.prototype.onTextSort = function (t1, t2) {
            var index1 = parseInt(t1.name.substr(4));
            var index2 = parseInt(t2.name.substr(4));
            if (index1 < index2) {
                return -1;
            }
            if (index1 > index2) {
                return 1;
            }
            return 0;
        };
        return OvBase;
    }(gui.BaseWindow));
    gui.OvBase = OvBase;
    __reflect(OvBase.prototype, "gui.OvBase");
})(gui || (gui = {}));
/**
 * Created by ASUS on 2017/6/25.
 */
var gameTool;
(function (gameTool) {
    var _singletonMap = {}; //所有单例的集合  通过typeId取出 每个单例都会创建一个_type_key_name存放typeId
    /**
     * 返回指定类型的单例
     * @includeExample singleton.ts
     * @param type 需要单例化的类型
     * @returns {any} 类型的单例
     */
    function singleton(type) {
        var typeId = getTypeId(type);
        if (!_singletonMap.hasOwnProperty(typeId)) {
            _singletonMap[typeId] = new type();
            _singletonMap[typeId][_type_key_name] = typeId;
        }
        return _singletonMap[typeId];
    }
    gameTool.singleton = singleton;
    /**
     * 返回指定分类的类型单例
     * @param name 分类名称
     * @param type 单例化的类型
     * @includeExample typesingleton.ts
     * @returns {any} 单例对象
     */
    function typeSingleton(name, type) {
        var typeId = name + getTypeId(type);
        if (!_singletonMap.hasOwnProperty(typeId)) {
            _singletonMap[typeId] = new type();
        }
        return _singletonMap[typeId];
    }
    gameTool.typeSingleton = typeSingleton;
    var _type_id = 1;
    var _type_key_name = "__object_type_id__";
    /**
     * 返回指定类型的类型编号
     * @param type 指定类型
     * @returns {any} 类型编号
     */
    function getTypeId(type) {
        if (!type.hasOwnProperty(_type_key_name)) {
            _type_id++;
            type[_type_key_name] = "__type_id_" + _type_id;
        }
        return type[_type_key_name];
    }
    gameTool.getTypeId = getTypeId;
    /**
     * 释放单例
     */
    function disposeSingle(context) {
        if (context.hasOwnProperty(_type_key_name)) {
            var typeId = context[_type_key_name];
            // delete context[_type_key_name];
            if (_singletonMap.hasOwnProperty(typeId)) {
                delete _singletonMap[typeId][_type_key_name];
                delete _singletonMap[typeId];
            }
        }
    }
    gameTool.disposeSingle = disposeSingle;
    /**
     * 指定类型是否存在类型编号
     * @param type 指定类型
     * @returns {boolean} 是否存在类型编号
     */
    function hasTypeId(type) {
        if (type && type.hasOwnProperty(_type_key_name)) {
            return type[_type_key_name];
        }
        return 0;
    }
    gameTool.hasTypeId = hasTypeId;
    /**
     * 获取一个文件的扩展名
     * @param path
     * @returns {string}
     */
    function getFileExtName(path) {
        var arr = path.split('/');
        var fileName = arr[arr.length - 1];
        arr = fileName.split('.');
        return arr[0];
    }
    gameTool.getFileExtName = getFileExtName;
    /**
     * 从父容器移除显示对象
     * @param child
     */
    function removeFromParent(child) {
        if (child && child.parent) {
            child.parent.removeChild(child);
        }
    }
    gameTool.removeFromParent = removeFromParent;
    /**
     * 销毁容器的所有子对象
     * @param container
     */
    function destoryChildren(container) {
        container.parent && container.parent.removeChild(container);
        disposeSingle(container);
        notification.removeNotificationByObject(container);
        while (container.numChildren) {
            var item = container.getChildAt(0);
            this.destoryChildren(item);
        }
    }
    gameTool.destoryChildren = destoryChildren;
    /**
     * 销毁容器的所有子对象消息
     * @param container
     */
    function destoryChildrenNotice(container) {
        disposeSingle(container);
        notification.removeNotificationByObject(container);
        var len = container.numChildren;
        for (var i = len - 1; i > 0; i--) {
            var item = container.getChildAt(i);
            this.destoryChildren(item);
        }
    }
    gameTool.destoryChildrenNotice = destoryChildrenNotice;
    /**
     * 游戏的一些初始化
     */
    function init(main) {
        gameTool.main = main;
        gameTool.stage = main.stage;
        singleton(sound.SoundManager).init(gameTool.stage);
        singleton(app_sound.SoundManager).init(gameTool.stage);
        gui.initRootView(gameTool.main);
        gameTool.display.setFullDisplay(main);
        gameTool.display.setFullDisplay(fairygui.GRoot.inst.displayObject);
        fairygui.UIPackage.addPackage("common");
        notification.addNotification(define.Data.ERROR, function (data) {
            console.log("请求错误:" + data["des"] + "  code: " + data["num"]);
        }, this);
    }
    gameTool.init = init;
    /**
     * 回收列表
     */
    gameTool.poolList = gameTool.singleton(gameTool.List);
    /**
     * 根据容器发送其自身所携带的命令
     */
    function sendNoticoeByComponent(com) {
        // let parent = gameTool.getParent(com);
        // let data = com.data;
        // if (data == null) { //要是本身没有数据就传窗口容器的数据
        //     if (parent.hasOwnProperty("data")) {
        //         data = parent.data;
        //     }
        // }
        // // 按顺序是容器数据-按钮本身-按钮所属的窗口容器
        // notification.postNotification(com.notice, data, com, parent);
    }
    gameTool.sendNoticoeByComponent = sendNoticoeByComponent;
    /**
     * 判断是否是 IOS
     * @returns {boolean}
     */
    function isIOS() {
        //tip.showTextTip(egret.Capabilities.os);
        return egret.Capabilities.os == "iOS";
    }
    gameTool.isIOS = isIOS;
    /**
     * 获取项目的地址前缀
     */
    function getHost() {
        var host = window.location.href.split("?")[0];
        if (host.indexOf("/#")) {
            host = host.replace("/#", "");
        }
        return host;
    }
    gameTool.getHost = getHost;
    /**
     * 移除容器
     * @param display
     * @param container
     */
    function removeStage(display) {
        display.parent && display.parent.removeChild(display);
    }
    gameTool.removeStage = removeStage;
    function inStage(display) {
        while (display.parent && display.parent != gameTool.main && display.parent != gameTool.stage) {
            display = display.parent;
        }
        return display.parent != null;
    }
    gameTool.inStage = inStage;
})(gameTool || (gameTool = {}));
var gui;
(function (gui) {
    var NumSelect = (function () {
        function NumSelect(com, onChangeHandler, callThisObj) {
            this._num = 0;
            this._totalNum = 0;
            this._min = 0;
            this._com = com;
            this._numText = this._com.getChild("num").asTextField;
            this._numText.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.num = 0;
            this._onChangeHandler = onChangeHandler;
            this._callThisObj = callThisObj;
        }
        NumSelect.prototype.dispose = function () {
            if (this._reduceBtn) {
                this._reduceBtn.removeClickListener(this.onPre, this);
                this._addBtn.removeClickListener(this.onNext, this);
            }
            this._numText.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            if (this._maxBtn) {
                this._maxBtn.removeClickListener(this.onMax, this);
            }
            if (this._minBtn) {
                this._minBtn.removeClickListener(this.onMin, this);
            }
            this._com.dispose();
            this._com = null;
            this._callThisObj = null;
            this._minBtn = null;
            this._maxBtn = null;
            this._reduceBtn = null;
            this._addBtn = null;
            this._onChangeHandler = null;
        };
        /******************************************************************/
        NumSelect.prototype.onTextChange = function (event) {
            if (this._numText.text == "") {
                this._num = 0;
                this.onNumChange();
                return;
            }
            this.num = parseInt(this._numText.text);
        };
        NumSelect.prototype.onNumChange = function () {
            if (this._reduceBtn) {
                this._reduceBtn.enabled = this._num > 0;
                this._addBtn.enabled = this._num < this._totalNum;
            }
            if (this._onChangeHandler) {
                this._onChangeHandler.call(this._callThisObj);
            }
        };
        NumSelect.prototype.onPre = function () {
            this.num--;
        };
        NumSelect.prototype.onNext = function () {
            this.num++;
        };
        NumSelect.prototype.onMax = function () {
            this.num = this._totalNum;
        };
        NumSelect.prototype.onMin = function () {
            this.num = this._min;
        };
        Object.defineProperty(NumSelect.prototype, "oneChange", {
            /******************************************************************/
            set: function (value) {
                if (value) {
                    this._reduceBtn = this._com.getChild("reduce").asButton;
                    this._addBtn = this._com.getChild("add").asButton;
                    this._reduceBtn.addClickListener(this.onPre, this);
                    this._addBtn.addClickListener(this.onNext, this);
                    this.onNumChange();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NumSelect.prototype, "min", {
            set: function (value) {
                this._min = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NumSelect.prototype, "minBtn", {
            set: function (value) {
                if (value) {
                    this._minBtn = this._com.getChild("min").asButton;
                    this._minBtn.addClickListener(this.onMin, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NumSelect.prototype, "maxBtn", {
            set: function (value) {
                if (value) {
                    this._maxBtn = this._com.getChild("max").asButton;
                    this._maxBtn.addClickListener(this.onMax, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NumSelect.prototype, "max", {
            get: function () {
                return this._totalNum;
            },
            set: function (value) {
                this._totalNum = value;
                if (this._addBtn) {
                    this._addBtn.enabled = this._num < this._totalNum;
                }
                if (this._num > this._totalNum) {
                    this._num = this._totalNum;
                }
                if (this._num < this._min) {
                    this._num = this._min;
                }
                this._numText.text = this._num.toString();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NumSelect.prototype, "num", {
            get: function () {
                return this._num;
            },
            set: function (value) {
                this._num = value;
                if (this._num < 0) {
                    this._num = 0;
                }
                if (this._num > this._totalNum) {
                    this._num = this._totalNum;
                }
                if (this._num < this._min) {
                    this._num = this._min;
                }
                this.onNumChange();
                this._numText.text = String(this._num);
            },
            enumerable: true,
            configurable: true
        });
        return NumSelect;
    }());
    gui.NumSelect = NumSelect;
    __reflect(NumSelect.prototype, "gui.NumSelect");
})(gui || (gui = {}));
/**
 * Created by lxz on 2017/10/18.
 */
var define;
(function (define) {
    var UITypeDefine = (function () {
        function UITypeDefine() {
        }
        UITypeDefine.NONE = -1;
        /**
         * 直接弹出
         */
        UITypeDefine.IMMEDIATE = 0;
        /**
         * 窗口
         */
        UITypeDefine.SCENE = 1;
        /**
         * 弹窗
         */
        UITypeDefine.BOX = 2;
        return UITypeDefine;
    }());
    define.UITypeDefine = UITypeDefine;
    __reflect(UITypeDefine.prototype, "define.UITypeDefine");
})(define || (define = {}));
/**
 * Created by lxz on 2017/8/2.
 */
/**
 * 窗口类型定义
 */
var define;
(function (define) {
    var WindowType = (function () {
        function WindowType() {
        }
        // 基础层
        WindowType.SCENE_LAYER = 0;
        // 弹出层
        WindowType.POP_LAYER = 1;
        // tip层
        WindowType.TIP_LAYER = 2;
        return WindowType;
    }());
    define.WindowType = WindowType;
    __reflect(WindowType.prototype, "define.WindowType");
})(define || (define = {}));
/**
 *
 * @author
 *
 */
var face;
(function (face) {
    /**
     * 限定数据列表
     */
    var IMap = (function () {
        function IMap() {
        }
        return IMap;
    }());
    face.IMap = IMap;
    __reflect(IMap.prototype, "face.IMap");
})(face || (face = {}));
/**
 * Created by lxz on 2017/8/22.
 */
var component;
(function (component) {
    var Entity = (function () {
        function Entity() {
            this._components = {};
        }
        Entity.prototype.dispose = function () {
            this.removeAllComponent();
            this._components = null;
        };
        Entity.prototype.addComponent = function (comCl) {
            var type = definiton.getNameByClass(comCl);
            if (type in this._components)
                return;
            var com = gameTool.poolList.getInstance(comCl);
            if (com.type != type) {
                trace.error("组件类型不对应: ", [type, com.type]);
            }
            this._components[type] = com;
            return com;
        };
        Entity.prototype.removeComponent = function (type) {
            gameTool.poolList.remove(this._components[type]);
            delete this._components[type];
        };
        Entity.prototype.getComponent = function (comCl) {
            var type = definiton.getNameByClass(comCl);
            if (!(type in this._components))
                return null;
            return this._components[type];
        };
        Entity.prototype.containComponent = function (comCl) {
            var type = definiton.getNameByClass(comCl);
            return type in this._components;
        };
        Entity.prototype.removeAllComponent = function () {
            for (var type in this._components) {
                this.removeComponent(type);
            }
        };
        return Entity;
    }());
    component.Entity = Entity;
    __reflect(Entity.prototype, "component.Entity");
    var Component = (function () {
        function Component() {
        }
        Object.defineProperty(Component.prototype, "type", {
            get: function () {
                return definiton.getClassNameByObject(this);
            },
            enumerable: true,
            configurable: true
        });
        return Component;
    }());
    component.Component = Component;
    __reflect(Component.prototype, "component.Component");
    var BaseComponent = (function (_super) {
        __extends(BaseComponent, _super);
        function BaseComponent() {
            return _super.call(this) || this;
        }
        BaseComponent.prototype.dispose = function () {
            if (this.hasInit) {
                this.retrieve();
            }
            this._object = null;
        };
        BaseComponent.prototype.retrieve = function () {
            this._object = null;
        };
        BaseComponent.prototype.initData = function (obj) {
            if (obj === void 0) { obj = null; }
        };
        /*  初始对象*/
        BaseComponent.prototype.initObject = function (object) {
            this._object = object;
        };
        BaseComponent.prototype.getObject = function (cl) {
            return this._object;
        };
        return BaseComponent;
    }(Component));
    component.BaseComponent = BaseComponent;
    __reflect(BaseComponent.prototype, "component.BaseComponent", ["face.IPoolObject"]);
})(component || (component = {}));
/**
 *
 * @author
 *
 */
var gameTool;
(function (gameTool) {
    var ListData = (function () {
        function ListData(cl, initObj) {
            if (initObj === void 0) { initObj = null; }
            this._key = cl.prototype["__class__"];
            this._cl = cl;
            this._initObj = initObj;
        }
        ListData.prototype.getKey = function () {
            return this._key;
        };
        ListData.prototype.setKey = function (key) {
            this._key = key;
        };
        ListData.prototype.getCl = function () {
            return this._cl;
        };
        Object.defineProperty(ListData.prototype, "setCl", {
            set: function (cl) {
                this._cl = cl;
            },
            enumerable: true,
            configurable: true
        });
        ListData.prototype.getInitObj = function () {
            return this._initObj;
        };
        ListData.prototype.setInitObj = function (initObj) {
            this._initObj = initObj;
        };
        return ListData;
    }());
    gameTool.ListData = ListData;
    __reflect(ListData.prototype, "gameTool.ListData");
})(gameTool || (gameTool = {}));
/**
 *
 * @author
 *
 */
var gameTool;
(function (gameTool) {
    var GamePool = (function () {
        function GamePool(classRef, initObj) {
            if (initObj === void 0) { initObj = null; }
            this._arr = [];
            this._list = [];
            this._classRef = classRef;
            this._initObj = initObj;
        }
        /* 释放*/
        GamePool.prototype.dispose = function () {
            this._list = null;
            this._arr = null;
            this._classRef = null;
            this._initObj = null;
        };
        /**
         * 获取一个空闲
         * @return
         *
         */
        GamePool.prototype.getFreeObj = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var o;
            if (this._arr.length <= 0) {
                o = new this._classRef;
                this._arr.push(o);
            }
            o = this._arr.pop();
            this._list.push(o);
            if (definiton.hasProperty(o, "initData")) {
                o.initData.apply(o, args);
                o.hasInit = true;
            }
            else {
                //trace.error("该类型不是池回收对象要实现IPoolObject",[this._classRef]);
            }
            return o;
        };
        /**
         * 回收
         * @param ro
         *
         */
        GamePool.prototype.retrieve = function (ro) {
            var index = this._list.indexOf(ro);
            if (-1 != index) {
                this._list.splice(index, 1);
            }
            index = this._arr.indexOf(ro);
            if (-1 == index) {
                if (definiton.hasProperty(ro, "retrieve")) {
                    ro.retrieve();
                    ro.hasInit = false;
                }
                else {
                    //trace.error("该类型不是池回收对象要实现IPoolObject",[this._classRef]);
                }
                this._arr.push(ro);
            }
        };
        /************************************************************************************************************************/
        /**
         * 返回未回收的所有实例
         */
        GamePool.prototype.getList = function () {
            return this._list;
        };
        GamePool.prototype.getClassRef = function () {
            return this._classRef;
        };
        /**
         * 回收池里未回收的所有实例
         */
        GamePool.prototype.removePool = function () {
            while (this._list.length) {
                this.retrieve(this._list.pop());
            }
        };
        /**
         * 回收池里未回收的所有实例并释放掉回收池里的所有实例
         */
        GamePool.prototype.clearPool = function () {
            this.removePool();
            while (this._arr.length) {
                var object = this._arr.pop();
                if (definiton.hasProperty(object, "dispose")) {
                    object["dispose"]();
                }
            }
        };
        return GamePool;
    }());
    gameTool.GamePool = GamePool;
    __reflect(GamePool.prototype, "gameTool.GamePool");
})(gameTool || (gameTool = {}));
/**
 * Created by lxz on 2017/12/18.
 */
var audio1;
(function (audio1) {
    var singleton = gameTool.singleton;
    var Music = (function () {
        function Music() {
            var _this = this;
            window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
            this._ac = new window["AudioContext"]();
            this._loaded = new FunctionInfo();
            this._complete = new FunctionInfo();
            this._audio = document.createElement("audio");
            this._audio.setAttribute("id", "__music__");
            this._audio.crossOrigin = "anonymous";
            document.head.appendChild(this._audio);
            this._analyser = this._ac.createAnalyser();
            this._gainnode = this._ac.createGain();
            this._gainnode.gain.value = 1;
            //如果arg是audio的dom对象，则转为相应的源
            var source = this._ac.createMediaElementSource(this._audio);
            // //连接analyserNode
            // source.connect(this._analyser);
            //
            // //再连接到gainNode
            // this._analyser.connect(this._gainnode);
            //
            // //最终输出到音频播放器
            // this._gainnode.connect(this._ac.destination);
            /* 创建一个1024长度的缓冲区 `bufferSize` */
            this._processor = this._ac.createScriptProcessor(1024);
            /* 将 this._processor 和 _audio 连接 */
            this._processor.connect(this._ac.destination);
            /* 将 this._processor 和 _analyser 连接 */
            this._analyser.connect(this._processor);
            /* 定义一个 Uint8Array 字节流去接收分析后的数据*/
            //出来的数组为8bit整型数组，即值为0~256，整个数组长度为1024，即会有1024个频率，只需要取部分进行显示
            // let bufferLength = this._analyser.frequencyBinCount;
            // let data = new Uint8Array(bufferLength);
            /* 连接到 _analyser. */
            source.connect(this._analyser);
            source.connect(this._ac.destination);
            this._processor.onaudioprocess = function () {
                /* 产生频率数据 */
                //将音频节点的数据拷贝到Uin8Array中
                //this._analyser.getByteFrequencyData(data);
                if (_this._endTime == 0 || !_this._running) {
                    return;
                }
                if (_this._audio.currentTime >= _this._endTime) {
                    if (_this._loop) {
                        _this.play(_this._startTime, _this._endTime);
                    }
                    else {
                        _this.pause();
                    }
                    if (_this._complete.fun) {
                        _this._complete.call();
                    }
                }
            };
            this._audio.addEventListener("loadeddata", function () {
                _this._totalTime = _this._audio.duration;
                if (_this._endTime == 0) {
                    _this._endTime = _this._totalTime;
                }
                _this._loaded.args = [_this._totalTime];
                if (_this._loaded.fun) {
                    _this._loaded.call();
                }
            });
        }
        /**
         * 播放音频
         * start        开始时间
         * end          0:播放到结束
         */
        Music.prototype.play = function (start, end) {
            var _this = this;
            var k = setTimeout(function () {
                clearTimeout(k);
                _this._audio.currentTime = start;
                _this._audio.play();
                _this._running = true;
                _this._startTime = start;
                if (end == 0) {
                    _this._endTime = _this._totalTime == 0 ? 0 : _this._totalTime;
                }
                else {
                    _this._endTime = end;
                }
            }, 200);
        };
        Music.prototype.pause = function () {
            this._running = false;
            this._audio.pause();
        };
        /**
         * 设置音频地址
         */
        Music.prototype.setMusicUrl = function (url) {
            this._endTime = 0;
            this._totalTime = 0;
            this._audio.src = url;
            this._audio.load();
        };
        /**
         * 加载完音频
         */
        Music.prototype.setLoaded = function (fun, context) {
            this._loaded.fun = fun;
            this._loaded.context = context;
        };
        /**
         * 播放一遍回调
         */
        Music.prototype.setComplete = function (fun, context) {
            this._complete.fun = fun;
            this._complete.context = context;
        };
        Object.defineProperty(Music.prototype, "loop", {
            get: function () {
                return this._loop;
            },
            set: function (value) {
                this._loop = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "running", {
            get: function () {
                return this._running;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "currentTime", {
            get: function () {
                return this._audio.currentTime;
            },
            set: function (time) {
                this._audio.currentTime = time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "endTime", {
            get: function () {
                return this._endTime;
            },
            enumerable: true,
            configurable: true
        });
        return Music;
    }());
    audio1.Music = Music;
    __reflect(Music.prototype, "audio1.Music");
    /**
     * 播放音频
     * start        开始时间
     * end          0:播放到结束
     */
    function play(start, end) {
        singleton(Music).play(start, end);
    }
    audio1.play = play;
    function pause() {
        singleton(Music).pause();
    }
    audio1.pause = pause;
    /**
     * 设置音频地址
     */
    function setMusicUrl(url) {
        singleton(Music).setMusicUrl(url);
    }
    audio1.setMusicUrl = setMusicUrl;
    /**
     * 加载完音频
     */
    function setLoaded(fun, context) {
        singleton(Music).setLoaded(fun, context);
    }
    audio1.setLoaded = setLoaded;
    /**
     * 播放一遍回调
     */
    function setComplete(fun, context) {
        singleton(Music).setComplete(fun, context);
    }
    audio1.setComplete = setComplete;
    function isRunning() {
        return singleton(Music).running;
    }
    audio1.isRunning = isRunning;
    function setLoop(b) {
        singleton(Music).loop = b;
    }
    audio1.setLoop = setLoop;
    function getCurrentTime() {
        return singleton(Music).currentTime;
    }
    audio1.getCurrentTime = getCurrentTime;
    function setCurrentTime(time) {
        singleton(Music).currentTime = time;
    }
    audio1.setCurrentTime = setCurrentTime;
    function getEndTime() {
        return singleton(Music).endTime;
    }
    audio1.getEndTime = getEndTime;
})(audio1 || (audio1 = {}));
/**
 * Created by lxz on 2017/12/18.
 */
var audio;
(function (audio) {
    var singleton = gameTool.singleton;
    var Music = (function () {
        function Music() {
            var _this = this;
            console.log("audio1");
            window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
            this._ac = new window["AudioContext"]();
            // this._ac = music.getAudioContext();
            this._loaded = new FunctionInfo();
            this._complete = new FunctionInfo();
            this._audio = document.createElement("audio");
            this._audio.setAttribute("id", "__music__");
            this._audio.crossOrigin = "anonymous";
            document.body.appendChild(this._audio);
            this._audio.onloadeddata = function () {
                console.log("onloadeddata");
                _this._totalTime = _this._audio.duration;
                if (_this._endTime == 0) {
                    _this._endTime = _this._totalTime;
                }
                _this._loaded.args = [_this._totalTime];
                if (_this._loaded.fun) {
                    _this._loaded.call();
                }
            };
            console.log("audio2");
            // this._audio.addEventListener("loadeddata", function () {
            //         console.log("xxxxxxxxxx");
            //     }
            // );
            // this._audio.addEventListener("loadstart", function (e) {
            //         console.log(e);
            //     }
            // );
            // this._audio.addEventListener("durationchange", function (e) {
            //         console.log(e);
            //     }
            // );
            // this._audio.addEventListener("error", function (e) {
            //         console.log(e);
            //     }
            // );
            // this._audio.onerror = (ev) => {
            //     console.log(ev);
            // }
            // this._audio.onloadstart = (ev) => {
            //     console.log(ev);
            // }
            // this._audio.ondurationchange = (ev) => {
            //     console.log(ev);
            // }
            // this._audio.onloadedmetadata = (ev) => {
            //     console.log(ev);
            // }
            // this._audio.onprogress = (ev) => {
            //     console.log(ev);
            // }
            // this._audio.oncanplay = (ev) => {
            //     console.log(ev);
            // }
            // this._audio.oncanplaythrough = (ev) => {
            //     console.log(ev);
            // }
            console.log("audio3");
        }
        /**
         * 播放音频
         * start        开始时间
         * end          0:播放到结束
         */
        Music.prototype.play = function (start, end) {
            var _this = this;
            var k = setTimeout(function () {
                clearTimeout(k);
                _this._audio.currentTime = start;
                _this._audio.play();
                _this._running = true;
                _this._startTime = start;
                if (end == 0) {
                    _this._endTime = _this._totalTime == 0 ? 0 : _this._totalTime;
                }
                else {
                    _this._endTime = end;
                }
                _this._timeID = egret.setInterval(function () {
                    if (_this._endTime == 0 || !_this._running) {
                        return;
                    }
                    if (_this._audio.currentTime >= _this._endTime) {
                        if (_this._loop) {
                            _this.play(_this._startTime, _this._endTime);
                        }
                        else {
                            _this.pause();
                        }
                        if (_this._complete.fun) {
                            _this._complete.call();
                        }
                    }
                }, _this, 200);
            }, 200);
        };
        Music.prototype.pause = function () {
            this._running = false;
            this._audio.pause();
            egret.clearInterval(this._timeID);
        };
        /**
         * 设置音频地址
         */
        Music.prototype.setMusicUrl = function (url) {
            this._endTime = 0;
            this._totalTime = 0;
            this._audio.src = url;
            if (url && url != "") {
                this._audio.load();
                console.log("设置音频地址");
            }
        };
        /**
         * 加载完音频
         */
        Music.prototype.setLoaded = function (fun, context) {
            this._loaded.fun = fun;
            this._loaded.context = context;
        };
        /**
         * 播放一遍回调
         */
        Music.prototype.setComplete = function (fun, context) {
            this._complete.fun = fun;
            this._complete.context = context;
        };
        Object.defineProperty(Music.prototype, "loop", {
            get: function () {
                return this._loop;
            },
            set: function (value) {
                this._loop = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "running", {
            get: function () {
                return this._running;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "currentTime", {
            get: function () {
                return this._audio.currentTime;
            },
            set: function (time) {
                this._audio.currentTime = time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "endTime", {
            get: function () {
                return this._endTime;
            },
            enumerable: true,
            configurable: true
        });
        return Music;
    }());
    audio.Music = Music;
    __reflect(Music.prototype, "audio.Music");
    /**
     * 播放音频
     * start        开始时间
     * end          0:播放到结束
     */
    function play(start, end) {
        singleton(Music).play(start, end);
    }
    audio.play = play;
    function pause() {
        singleton(Music).pause();
    }
    audio.pause = pause;
    /**
     * 设置音频地址
     */
    function setMusicUrl(url) {
        singleton(Music).setMusicUrl(url);
    }
    audio.setMusicUrl = setMusicUrl;
    /**
     * 加载完音频
     */
    function setLoaded(fun, context) {
        singleton(Music).setLoaded(fun, context);
    }
    audio.setLoaded = setLoaded;
    /**
     * 播放一遍回调
     */
    function setComplete(fun, context) {
        singleton(Music).setComplete(fun, context);
    }
    audio.setComplete = setComplete;
    function isRunning() {
        return singleton(Music).running;
    }
    audio.isRunning = isRunning;
    function setLoop(b) {
        singleton(Music).loop = b;
    }
    audio.setLoop = setLoop;
    function getCurrentTime() {
        return singleton(Music).currentTime;
    }
    audio.getCurrentTime = getCurrentTime;
    function setCurrentTime(time) {
        singleton(Music).currentTime = time;
    }
    audio.setCurrentTime = setCurrentTime;
    function getEndTime() {
        return singleton(Music).endTime;
    }
    audio.getEndTime = getEndTime;
})(audio || (audio = {}));
/**
 * Created by lxz on 2017/12/18.
 */
var music;
(function (music) {
    // export function getAudioContext():AudioContext {
    //     window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
    //     return gameTool.singleton(window["AudioContext"]) as AudioContext;
    // }
    var singleton = gameTool.singleton;
    var Music = (function () {
        function Music() {
            window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
            this.init();
        }
        Music.prototype.dispose = function () {
            this.pause();
            this._ac.close();
            this._ac = null;
            this._buffer = null;
            this._sourceNode = null;
        };
        Music.prototype.init = function () {
            this._ac = new window["AudioContext"]();
            // this._ac = getAudioContext();
            this._loaded = new FunctionInfo();
            this._complete = new FunctionInfo();
            this._analyser = this._ac.createAnalyser();
            this._gainnode = this._ac.createGain();
            // this._gainnode.gain.value = 1;
        };
        /**
         * 播放音频
         * start        开始时间
         * end          0:播放到结束
         */
        Music.prototype.play = function (start, end) {
            var _this = this;
            // this.pause();
            this.pauseMusic();
            if (this._pauseTime) {
                this._acStartTime += this._ac.currentTime - this._pauseTime;
                this._pauseTime = 0;
            }
            this._isPause = false;
            // if(this._sourceNode){
            this._sourceNode = this._ac.createBufferSource(); //创建一个音频源 相当于是装音频的容器
            //连接analyserNode
            this._sourceNode.connect(this._analyser);
            //再连接到gainNode
            this._analyser.connect(this._gainnode);
            //最终输出到音频播放器
            this._gainnode.connect(this._ac.destination);
            // }
            this._sourceNode.buffer = this._buffer; //  告诉音频源 播放哪一段音频
            // this._sourceNode.connect(this._ac.destination);// 连接到输出源
            this._running = true;
            if (end == 0) {
                this._sourceNode.start(0, start); //开始播放
            }
            else {
                this._sourceNode.start(0, start, end - start); //开始播放
            }
            this._sourceNode.onended = function (e) {
                if (_this._complete.fun) {
                    _this._complete.call();
                }
            };
        };
        Music.prototype.pause = function () {
            this._pauseTime = this._ac.currentTime;
            this._isPause = true;
            this._running = false;
            this._currentTime = this._ac.currentTime;
            this.pauseMusic();
            this._sourceNode = null;
        };
        /**
         * 设置音频地址
         */
        Music.prototype.setMusicUrl = function (url) {
            var _this = this;
            this._endTime = 0;
            this._totalTime = 0;
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            // console.log("设置音频地址" , url);
            //下面就是对音频文件的异步解析
            request.onload = function () {
                // console.log(request.response);
                _this._startTime = 0;
                _this._ac.decodeAudioData(request.response, function (buffer) {
                    // console.log(buffer);
                    _this._buffer = buffer;
                    _this._totalTime = _this._buffer.duration;
                    if (_this._endTime == 0) {
                        _this._endTime = _this._totalTime;
                    }
                    _this._loaded.args = [_this._totalTime];
                    _this._acStartTime = _this._ac.currentTime;
                    _this._pauseTime = 0;
                    if (_this._loaded.fun) {
                        _this._loaded.call();
                    }
                }, _this.onError);
            };
            request.onerror = function (e) {
                console.log(e);
            };
            request.upload.addEventListener("error", function (e) {
                console.log(e);
            });
            request.send();
        };
        /**
         * 加载完音频
         */
        Music.prototype.setLoaded = function (fun, context) {
            this._loaded.fun = fun;
            this._loaded.context = context;
        };
        /**
         * 播放一遍回调
         *
         */
        Music.prototype.setComplete = function (fun, context) {
            this._complete.fun = fun;
            this._complete.context = context;
        };
        /******************************************************************/
        Music.prototype.onError = function (e) {
            console.log(e);
        };
        // private pauseMusic() {
        //     if (this._sourceNode && ('stop' in this._sourceNode)) {
        //         try {
        //             this._sourceNode.stop();
        //         } catch (e) {
        //             console.log(e);
        //         }
        //     }
        //     if (this._sourceNode) {
        //         try {
        //             this._sourceNode.disconnect(this._analyser);
        //             this._analyser.disconnect(this._gainnode);
        //             this._gainnode.disconnect(this._ac.destination);
        //         } catch (e) {
        //             console.log(e);
        //         }
        //     }
        // }
        Music.prototype.pauseMusic = function () {
            if (this._sourceNode) {
                this._sourceNode.stop();
            }
            if (this._sourceNode) {
                this._sourceNode.disconnect(this._analyser);
                this._analyser.disconnect(this._gainnode);
                this._gainnode.disconnect(this._ac.destination);
            }
        };
        Object.defineProperty(Music.prototype, "loop", {
            /******************************************************************/
            get: function () {
                return this._loop;
            },
            set: function (value) {
                this._loop = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "running", {
            get: function () {
                return this._running;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "currentTime", {
            get: function () {
                // console.log((this._ac.currentTime - this._acStartTime));
                return this._isPause ? this._currentTime : (this._startTime + this._ac.currentTime - this._acStartTime);
            },
            set: function (time) {
                this._currentTime = time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "startTime", {
            set: function (time) {
                this._startTime = time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "endTime", {
            get: function () {
                return this._endTime;
            },
            enumerable: true,
            configurable: true
        });
        return Music;
    }());
    music.Music = Music;
    __reflect(Music.prototype, "music.Music");
    function init() {
        singleton(Music).init();
    }
    music.init = init;
    /**
     * 播放音频
     * start        开始时间
     * end          0:播放到结束
     */
    function play(start, end) {
        singleton(Music).play(start, end);
    }
    music.play = play;
    function pause() {
        singleton(Music).pause();
    }
    music.pause = pause;
    function dispose() {
        singleton(Music).dispose();
    }
    music.dispose = dispose;
    /**
     * 设置音频地址
     */
    function setMusicUrl(url) {
        singleton(Music).setMusicUrl(url);
    }
    music.setMusicUrl = setMusicUrl;
    /**
     * 加载完音频
     */
    function setLoaded(fun, context) {
        singleton(Music).setLoaded(fun, context);
    }
    music.setLoaded = setLoaded;
    /**
     * 播放一遍回调
     */
    function setComplete(fun, context) {
        singleton(Music).setComplete(fun, context);
    }
    music.setComplete = setComplete;
    function isRunning() {
        return singleton(Music).running;
    }
    music.isRunning = isRunning;
    function setLoop(b) {
        singleton(Music).loop = b;
    }
    music.setLoop = setLoop;
    function getCurrentTime() {
        return singleton(Music).currentTime;
    }
    music.getCurrentTime = getCurrentTime;
    function setCurrentTime(time) {
        singleton(Music).currentTime = time;
    }
    music.setCurrentTime = setCurrentTime;
    function setStartTime(time) {
        singleton(Music).startTime = time;
    }
    music.setStartTime = setStartTime;
    function getEndTime() {
        return singleton(Music).endTime;
    }
    music.getEndTime = getEndTime;
})(music || (music = {}));
/**
 * Created by lxz on 2017/12/18.
 */
var music_test;
(function (music_test) {
    // export function getAudioContext():AudioContext {
    //     window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
    //     return gameTool.singleton(window["AudioContext"]) as AudioContext;
    // }
    var singleton = gameTool.singleton;
    var Music = (function () {
        function Music() {
            window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
            this.init();
        }
        Music.prototype.dispose = function () {
            this._ac.close();
            this._ac = null;
            this._buffer = null;
            this._sourceNode = null;
            this._resList = null;
        };
        Music.prototype.init = function () {
            this._resList = {};
            this._ac = new window["AudioContext"]();
            // this._ac = getAudioContext();
            this._loaded = new FunctionInfo();
            this._complete = new FunctionInfo();
            this._gainnode = this._ac.createGain();
            this._gainnode.gain.value = 1;
        };
        /**
         * 播放音频
         * start        开始时间
         * end          0:播放到结束
         */
        Music.prototype.play = function (start, end) {
            var _this = this;
            // this.pause();
            if (this._pauseTime) {
                this._acStartTime += this._ac.currentTime - this._pauseTime;
                this._pauseTime = 0;
            }
            this._isPause = false;
            // if(!this._sourceNode){
            this._sourceNode = this._ac.createBufferSource(); //创建一个音频源 相当于是装音频的容器
            // }
            this._sourceNode.buffer = this._buffer; //  告诉音频源 播放哪一段音频
            var audioDestinationNode = this._ac.destination;
            this._sourceNode.connect(audioDestinationNode);
            this._sourceNode.start(0); //开始播放
            console.log(this._sourceNode);
            // if (end == 0) {
            //     this._sourceNode.start(0, start);//开始播放
            // } else {
            //     this._sourceNode.start(0, start, end - start);//开始播放
            // }
            this._sourceNode.onended = function (e) {
                tip.showTextTip("播放完毕");
                if (_this._complete.fun) {
                    _this._complete.call();
                }
            };
        };
        Music.prototype.pause = function () {
            this._pauseTime = this._ac.currentTime;
            this._isPause = true;
            this._running = false;
            this._currentTime = this._ac.currentTime;
            if (this._sourceNode && ('stop' in this._sourceNode)) {
                try {
                    this._sourceNode.stop();
                }
                catch (e) {
                    console.log(e);
                }
            }
            if (this._sourceNode) {
                try {
                    this._sourceNode.disconnect(this._analyser);
                    this._analyser.disconnect(this._gainnode);
                    this._gainnode.disconnect(this._ac.destination);
                }
                catch (e) {
                    console.log(e);
                }
            }
            this._sourceNode = null;
        };
        /**
         * 设置音频地址
         */
        Music.prototype.setMusicUrl = function (url) {
            var _this = this;
            this._endTime = 0;
            this._totalTime = 0;
            if (this._resList[url]) {
                this.getBuffer(this._resList[url]);
            }
            else {
                var request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.responseType = "arraybuffer";
                // console.log("设置音频地址" , url);
                //下面就是对音频文件的异步解析
                request.onload = function () {
                    // console.log(request.response);
                    _this._ac.decodeAudioData(request.response, function (buffer) {
                        _this.getBuffer(buffer);
                        _this._resList[url] = buffer;
                    }, _this.onError);
                };
                request.onerror = function (e) {
                    console.log(e);
                };
                request.upload.addEventListener("error", function (e) {
                    console.log(e);
                });
                request.send();
            }
        };
        /**
         * 加载完音频
         */
        Music.prototype.setLoaded = function (fun, context) {
            this._loaded.fun = fun;
            this._loaded.context = context;
        };
        /**
         * 播放一遍回调
         */
        Music.prototype.setComplete = function (fun, context) {
            this._complete.fun = fun;
            this._complete.context = context;
        };
        /******************************************************************/
        Music.prototype.getBuffer = function (buffer) {
            // console.log(buffer);
            this._buffer = buffer;
            this._totalTime = this._buffer.duration;
            if (this._endTime == 0) {
                this._endTime = this._totalTime;
            }
            this._loaded.args = [this._totalTime];
            this._acStartTime = this._ac.currentTime;
            this._pauseTime = 0;
            if (this._loaded.fun) {
                this._loaded.call();
            }
        };
        Music.prototype.onError = function (e) {
            console.log(e);
        };
        Object.defineProperty(Music.prototype, "loop", {
            /******************************************************************/
            get: function () {
                return this._loop;
            },
            set: function (value) {
                this._loop = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "running", {
            get: function () {
                return this._running;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "currentTime", {
            get: function () {
                // console.log((this._ac.currentTime - this._acStartTime));
                return this._isPause ? this._currentTime : (this._ac.currentTime - this._acStartTime);
            },
            set: function (time) {
                this._currentTime = time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "endTime", {
            get: function () {
                return this._endTime;
            },
            enumerable: true,
            configurable: true
        });
        return Music;
    }());
    music_test.Music = Music;
    __reflect(Music.prototype, "music_test.Music");
    /**
     * 播放音频
     * start        开始时间
     * end          0:播放到结束
     */
    function play(start, end) {
        singleton(Music).play(start, end);
    }
    music_test.play = play;
    function pause() {
        singleton(Music).pause();
    }
    music_test.pause = pause;
    function dispose() {
        singleton(Music).dispose();
    }
    music_test.dispose = dispose;
    /**
     * 设置音频地址
     */
    function setMusicUrl(url) {
        singleton(Music).setMusicUrl(url);
    }
    music_test.setMusicUrl = setMusicUrl;
    /**
     * 加载完音频
     */
    function setLoaded(fun, context) {
        singleton(Music).setLoaded(fun, context);
    }
    music_test.setLoaded = setLoaded;
    /**
     * 播放一遍回调
     */
    function setComplete(fun, context) {
        singleton(Music).setComplete(fun, context);
    }
    music_test.setComplete = setComplete;
    function isRunning() {
        return singleton(Music).running;
    }
    music_test.isRunning = isRunning;
    function setLoop(b) {
        singleton(Music).loop = b;
    }
    music_test.setLoop = setLoop;
    function getCurrentTime() {
        return singleton(Music).currentTime;
    }
    music_test.getCurrentTime = getCurrentTime;
    function setCurrentTime(time) {
        singleton(Music).currentTime = time;
    }
    music_test.setCurrentTime = setCurrentTime;
    function getEndTime() {
        return singleton(Music).endTime;
    }
    music_test.getEndTime = getEndTime;
})(music_test || (music_test = {}));
/**
 * Created by lxz on 2017/12/18.
 */
var video;
(function (video) {
    var singleton = gameTool.singleton;
    var Music = (function () {
        function Music() {
            var _this = this;
            window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
            this._ac = new window["AudioContext"]();
            this._loaded = new FunctionInfo();
            this._complete = new FunctionInfo();
            this._audio = document.createElement("video");
            this._audio.setAttribute("id", "__music__");
            this._audio.setAttribute("style", 'visibility:hidden');
            this._audio.setAttribute("webkit-playsinline", 'true');
            this._audio.setAttribute("playsinline", 'true');
            this._audio.controls = false;
            this._audio.autoplay = false;
            // this._audio.setAttribute("type", "audio/mpeg");
            this._audio.crossOrigin = "anonymous";
            document.head.appendChild(this._audio);
            this._analyser = this._ac.createAnalyser();
            this._gainnode = this._ac.createGain();
            this._gainnode.gain.value = 1;
            //如果arg是audio的dom对象，则转为相应的源
            var source = this._ac.createMediaElementSource(this._audio);
            // //连接analyserNode
            // source.connect(this._analyser);
            //
            // //再连接到gainNode
            // this._analyser.connect(this._gainnode);
            //
            // //最终输出到音频播放器
            // this._gainnode.connect(this._ac.destination);
            /* 创建一个1024长度的缓冲区 `bufferSize` */
            this._processor = this._ac.createScriptProcessor(1024);
            /* 将 this._processor 和 _audio 连接 */
            this._processor.connect(this._ac.destination);
            /* 将 this._processor 和 _analyser 连接 */
            this._analyser.connect(this._processor);
            /* 定义一个 Uint8Array 字节流去接收分析后的数据*/
            //出来的数组为8bit整型数组，即值为0~256，整个数组长度为1024，即会有1024个频率，只需要取部分进行显示
            // let bufferLength = this._analyser.frequencyBinCount;
            // let data = new Uint8Array(bufferLength);
            /* 连接到 _analyser. */
            source.connect(this._analyser);
            source.connect(this._ac.destination);
            this._processor.onaudioprocess = function () {
                /* 产生频率数据 */
                //将音频节点的数据拷贝到Uin8Array中
                //this._analyser.getByteFrequencyData(data);
                if (_this._endTime == 0 || !_this._running) {
                    return;
                }
                if (_this._audio.currentTime >= _this._endTime) {
                    if (_this._loop) {
                        _this.play(_this._startTime, _this._endTime);
                    }
                    else {
                        _this.pause();
                    }
                    if (_this._complete.fun) {
                        _this._complete.call();
                    }
                }
            };
            this._audio.addEventListener("loadeddata", function () {
                _this._totalTime = _this._audio.duration;
                if (_this._endTime == 0) {
                    _this._endTime = _this._totalTime;
                }
                _this._loaded.args = [_this._totalTime];
                if (_this._loaded.fun) {
                    _this._loaded.call();
                }
            });
        }
        /**
         * 播放音频
         * start        开始时间
         * end          0:播放到结束
         */
        Music.prototype.play = function (start, end) {
            var _this = this;
            var k = setTimeout(function () {
                clearTimeout(k);
                _this._audio.currentTime = start;
                _this._audio.play();
                _this._running = true;
                _this._startTime = start;
                if (end == 0) {
                    _this._endTime = _this._totalTime == 0 ? 0 : _this._totalTime;
                }
                else {
                    _this._endTime = end;
                }
            }, 200);
        };
        Music.prototype.pause = function () {
            this._running = false;
            this._audio.pause();
        };
        /**
         * 设置音频地址
         */
        Music.prototype.setMusicUrl = function (url) {
            this._endTime = 0;
            this._totalTime = 0;
            this._audio.src = url;
            this._audio.load();
        };
        /**
         * 加载完音频
         */
        Music.prototype.setLoaded = function (fun, context) {
            this._loaded.fun = fun;
            this._loaded.context = context;
        };
        /**
         * 播放一遍回调
         */
        Music.prototype.setComplete = function (fun, context) {
            this._complete.fun = fun;
            this._complete.context = context;
        };
        Object.defineProperty(Music.prototype, "loop", {
            get: function () {
                return this._loop;
            },
            set: function (value) {
                this._loop = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "running", {
            get: function () {
                return this._running;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Music.prototype, "currentTime", {
            get: function () {
                return this._audio.currentTime;
            },
            set: function (time) {
                this._audio.currentTime = time;
            },
            enumerable: true,
            configurable: true
        });
        return Music;
    }());
    video.Music = Music;
    __reflect(Music.prototype, "video.Music");
    /**
     * 播放音频
     * start        开始时间
     * end          0:播放到结束
     */
    function play(start, end) {
        singleton(Music).play(start, end);
    }
    video.play = play;
    function pause() {
        singleton(Music).pause();
    }
    video.pause = pause;
    /**
     * 设置音频地址
     */
    function setMusicUrl(url) {
        singleton(Music).setMusicUrl(url);
    }
    video.setMusicUrl = setMusicUrl;
    /**
     * 加载完音频
     */
    function setLoaded(fun, context) {
        singleton(Music).setLoaded(fun, context);
    }
    video.setLoaded = setLoaded;
    /**
     * 播放一遍回调
     */
    function setComplete(fun, context) {
        singleton(Music).setComplete(fun, context);
    }
    video.setComplete = setComplete;
    function isRunning() {
        return singleton(Music).running;
    }
    video.isRunning = isRunning;
    function setLoop(b) {
        singleton(Music).loop = b;
    }
    video.setLoop = setLoop;
    function getCurrentTime() {
        return singleton(Music).currentTime;
    }
    video.getCurrentTime = getCurrentTime;
    function setCurrentTime(time) {
        singleton(Music).currentTime = time;
    }
    video.setCurrentTime = setCurrentTime;
})(video || (video = {}));
var notification;
(function (notification) {
    /**
     * Created by silence on 2017/6/28.
     */
    var Notification = (function () {
        function Notification() {
            this._listenerNames = {};
        }
        /**
         * 添加一个通知监听
         * @param name  通知名称
         * @param sender    接收到后执行函数
         * @param context   上下文
         * @param priority  优先级，越大越优先
         * @returns {{name: string, sender: ((...args:any[])=>any), priority: number, context: any}}    返回当前监听器的NotificationInfo
         */
        Notification.prototype.addListener = function (name, sender, context, priority) {
            if (priority === void 0) { priority = 0; }
            if (!this._listenerNames.hasOwnProperty(name)) {
                this._listenerNames[name] = {};
            }
            var typeId = gameTool.getTypeId(context);
            //console.log(gameTool.getClassNameByObject(context),context ,typeId);
            var listenerList = this._listenerNames[name];
            if (!listenerList.hasOwnProperty(typeId)) {
                listenerList[typeId] = [];
            }
            var info = { name: name, sender: sender, priority: priority, context: context };
            var list = listenerList[typeId];
            list.push(info);
            listenerList[typeId] = list.sort(function (a, b) {
                return b.priority - a.priority;
            });
            return info;
        };
        /**
         * 是否拥有侦听
         * @param name
         * @param sender
         * @param context
         * @returns {boolean}
         */
        Notification.prototype.hasListener = function (name, sender, context) {
            if (!this._listenerNames.hasOwnProperty(name)) {
                return false;
            }
            var listenerList = this._listenerNames[name];
            var typeId = gameTool.getTypeId(context);
            if (!listenerList.hasOwnProperty(typeId)) {
                return false;
            }
            var list = listenerList[typeId];
            var len = list.length;
            for (var i = 0; i < len; i++) {
                if (list[i].sender == sender) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 移除一个监听
         * @param name
         * @param sender
         * @param context
         */
        Notification.prototype.removeListener = function (name, sender, context) {
            var listenerlist = this._listenerNames[name];
            for (var key in listenerlist) {
                var infoList = listenerlist[key];
                var len = infoList.length;
                for (var i = 0; i < len; i++) {
                    var info = infoList[i];
                    if (info.sender == sender && info.context == context) {
                        infoList.splice(i, 1);
                        return;
                    }
                }
            }
        };
        /**
         * 移除一个对象的所有已注册的事件
         * @param context
         */
        Notification.prototype.removeListenerByObject = function (context) {
            var typeId = gameTool.hasTypeId(context);
            if (typeId) {
                for (var key in this._listenerNames) {
                    var listenerList = this._listenerNames[key];
                    if (listenerList.hasOwnProperty(typeId)) {
                        //console.log("移除一个对象的所有已注册的事件 key:" + key + " typeID:" + typeId +  " ClassName:" + gameTool.getClassNameByObject(context));
                        delete listenerList[typeId];
                    }
                }
            }
        };
        /**
         * 派发通知
         * @param name
         * @param args
         */
        Notification.prototype.dispatchListener = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var listenerlist = this._listenerNames[name];
            if (listenerlist) {
                var list = [];
                for (var key in listenerlist) {
                    var arr = listenerlist[key];
                    //获取整个监听列表
                    list = list.concat(arr);
                }
                //按优先级排序
                list.sort(function (a, b) {
                    return b.priority - a.priority;
                });
                var len = list.length;
                for (var i = 0; i < len; i++) {
                    var info = list[i];
                    info.sender.apply(info.context, args);
                }
            }
        };
        return Notification;
    }());
    notification.Notification = Notification;
    __reflect(Notification.prototype, "notification.Notification");
    /**
     * 添加一个通知监听
     * @param name  通知名称
     * @param sender    接收到后执行函数
     * @param context   上下文
     * @param priority  优先级，越大越优先
     */
    function addNotification(name, sender, context, priority) {
        if (priority === void 0) { priority = 0; }
        gameTool.singleton(Notification).addListener(name, sender, context, priority);
    }
    notification.addNotification = addNotification;
    /**
     * 派发通知
     * @param name
     * @param args
     */
    function postNotification(name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var arr = [name].concat(args);
        gameTool.singleton(Notification).dispatchListener.apply(gameTool.singleton(Notification), arr);
    }
    notification.postNotification = postNotification;
    /**
     * 移除一个监听
     * @param name
     * @param sender
     * @param context
     */
    function removeNotification(name, sender, context) {
        gameTool.singleton(Notification).removeListener(name, sender, context);
    }
    notification.removeNotification = removeNotification;
    /**
     * 移除一个对象的所有已注册的事件
     * @param context
     */
    function removeNotificationByObject(context) {
        gameTool.singleton(Notification).removeListenerByObject(context);
    }
    notification.removeNotificationByObject = removeNotificationByObject;
})(notification || (notification = {}));
/**
 * Created by silence on 2017/6/30.
 */
var define;
(function (define) {
    var Data = (function () {
        function Data() {
        }
        Data.ERROR = 10000; //10000 {code:100,des:错误描述}
        Data.USER_INFO = 100; //登录时，用户信息
        return Data;
    }());
    define.Data = Data;
    __reflect(Data.prototype, "define.Data");
})(define || (define = {}));
/**
 * Created by lxz on 2017/10/17.
 */
///<reference path="gui.ts" />
var alert;
(function (alert_1) {
    var Alert = (function (_super) {
        __extends(Alert, _super);
        function Alert(message, buttons, callback, context) {
            if (buttons === void 0) { buttons = 1; }
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            var _this = _super.call(this) || this;
            _this._buttons = 0;
            _this._message = message;
            _this._buttons = buttons;
            if (callback != null) {
                _this._callback = gameTool.poolList.getInstance(FunctionInfo);
                _this._callback.fun = callback;
                _this._callback.context = context;
                _this._callback.args = args;
            }
            if (_this._content) {
                _this._content.text = _this._message;
            }
            return _this;
        }
        /******************************************************************/
        Alert.prototype.initView = function () {
            this._ui = fairygui.UIPackage.createObject("common", "alerView").asCom;
            this.addChild(this._ui);
            this._buttonNumController = this._ui.getController("select");
            this._content = this._ui.getChild("txt").asTextField;
            if (this._buttons == Alert.OK) {
                this._buttonNumController.selectedPage = "1";
            }
            else {
                this._buttonNumController.selectedPage = "2";
            }
            this._content.text = this._message;
        };
        Alert.prototype.onClick = function (e) {
            _super.prototype.onClick.call(this, e);
            switch (e.currentTarget.name) {
                case "okBtn":
                case "okBtn1": {
                    if (this._callback != null) {
                        this._callback.args = [Alert.OK].concat(this._callback.args);
                        this._callback.call();
                    }
                    this.dispose();
                    break;
                }
                case "cancelBtn": {
                    if (this._callback != null) {
                        this._callback.args = [Alert.CANCEL].concat(this._callback.args);
                        this._callback.call();
                    }
                    this.dispose();
                    break;
                }
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
    }(gui.BaseWindow));
    alert_1.Alert = Alert;
    __reflect(Alert.prototype, "alert.Alert");
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
        return alert;
    }
    alert_1.createAlert = createAlert;
})(alert || (alert = {}));
/**
 * Created by lxz on 2017/11/18.
 */
var gui;
(function (gui) {
    var BindProperty = (function () {
        function BindProperty() {
            this._keys = {};
        }
        BindProperty.prototype.bindGuiProperty = function (context, com) {
            var len = com.numChildren;
            var id = gameTool.getTypeId(context);
            if (this._keys[id] == null) {
                this._keys[id] = [];
            }
            for (var i = 0; i < len; i++) {
                var obj = com.getChildAt(i);
                var key = obj.name;
                if (definiton.hasProperty(context, key)) {
                    continue;
                }
                if (key.match(/^n[0-9]+$/g)) {
                    continue;
                }
                // if (key.indexOf("text") > -1 || key.indexOf("btn") > -1) { //按钮与文本不予设置(免得设置太多属性)
                //     continue;
                // }
                context[key] = obj;
                this._keys[id].push(key);
            }
        };
        BindProperty.prototype.removeBindGuiProperty = function (context) {
            var id = gameTool.getTypeId(context);
            if (this._keys[id]) {
                var len = this._keys[id].length;
                for (var i = 0; i < len; i++) {
                    context[this._keys[id][i]] = null;
                    delete context[this._keys[id][i]];
                }
                this._keys[id] = null;
                delete this._keys[id];
            }
        };
        return BindProperty;
    }());
    gui.BindProperty = BindProperty;
    __reflect(BindProperty.prototype, "gui.BindProperty");
    function bindGuiProperty(context, com) {
        gameTool.singleton(BindProperty).bindGuiProperty(context, com);
    }
    gui.bindGuiProperty = bindGuiProperty;
    function removeBindGuiProperty(context) {
        gameTool.singleton(BindProperty).removeBindGuiProperty(context);
    }
    gui.removeBindGuiProperty = removeBindGuiProperty;
})(gui || (gui = {}));
/**
 * Created by lxz on 2017/11/13.
 */
var gui;
(function (gui) {
    /**
     * 图像
     */
    var BitmapImage = (function (_super) {
        __extends(BitmapImage, _super);
        function BitmapImage() {
            var _this = _super.call(this) || this;
            _this._imgLoader = new egret.ImageLoader();
            _this._imgLoader.crossOrigin = "anonymous";
            _this._imgLoader.addEventListener(egret.Event.COMPLETE, _this.imgLoadHandler, _this);
            return _this;
        }
        BitmapImage.prototype.dispose = function () {
            this._imgLoader.removeEventListener(egret.Event.COMPLETE, this.imgLoadHandler, this);
            this._imgLoader.data = null;
            this._imgLoader = null;
            this._complete = null;
            this._context = null;
        };
        BitmapImage.prototype.getImgByUrl = function (url, complete, context) {
            if (url.indexOf("http") == -1) {
                return;
            }
            this._imgLoader.load(url);
            this._complete = complete;
            this._context = context;
        };
        /******************************************************************/
        BitmapImage.prototype.imgLoadHandler = function (evt) {
            var loader = evt.currentTarget;
            var bmd = loader.data;
            this.bitmapData = bmd;
            if (this._complete) {
                this._complete.call(this._context);
            }
        };
        return BitmapImage;
    }(egret.Bitmap));
    gui.BitmapImage = BitmapImage;
    __reflect(BitmapImage.prototype, "gui.BitmapImage");
})(gui || (gui = {}));
/**
 * Created by lxz on 2017/10/30.
 */
var gui;
(function (gui) {
    /**
     * 控制台
     */
    var ConsoleList = (function () {
        function ConsoleList(list, pkgName, resName) {
            this._oList = list;
            this._list = new gui.GListBase(list, pkgName, resName, ConsoleItem, this.itemRenderer, this);
            this.clear();
        }
        ConsoleList.prototype.addText = function (str) {
            this._texts.push(str);
            this._list.numItems = this._texts.length;
            this._oList.scrollToView(this._texts.length - 1);
        };
        ConsoleList.prototype.clear = function () {
            this._texts = [];
            this._list.numItems = this._texts.length;
        };
        /******************************************************************/
        ConsoleList.prototype.itemRenderer = function (index, item) {
            item.setListIndex(index, this._texts[index]);
        };
        return ConsoleList;
    }());
    gui.ConsoleList = ConsoleList;
    __reflect(ConsoleList.prototype, "gui.ConsoleList");
    var ConsoleItem = (function (_super) {
        __extends(ConsoleItem, _super);
        function ConsoleItem() {
            return _super.call(this) || this;
        }
        ConsoleItem.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        ConsoleItem.prototype.constructFromResource = function () {
            _super.prototype.constructFromResource.call(this);
        };
        ConsoleItem.prototype.setListIndex = function (index, text) {
            this._listIndex = index;
            this.getChild("text").text = text;
        };
        return ConsoleItem;
    }(fairygui.GComponent));
    gui.ConsoleItem = ConsoleItem;
    __reflect(ConsoleItem.prototype, "gui.ConsoleItem");
})(gui || (gui = {}));
/**
 * Created by lxz on 2017/10/10.
 */
var filter_lib;
(function (filter_lib) {
    /**
     * 剪影滤镜
     */
    filter_lib.jianying = new egret.ColorMatrixFilter([1, 0, 0, 0, -255, 0, 1, 0, 0, -255, 0, 0, 1, 0, -255, 0, 0, 0, 1, 0]);
})(filter_lib || (filter_lib = {}));
/**
 * 常用列表
 */
var gui;
(function (gui) {
    var GListBase = (function () {
        function GListBase(list, pkgName, resName, type, itemRenderer, callbackThisObj) {
            fairygui.UIObjectFactory.setPackageItemExtension(fairygui.UIPackage.getItemURL(pkgName, resName), type);
            this._list = list;
            this._list.itemRenderer = itemRenderer;
            this._list.callbackThisObj = callbackThisObj;
            this._callbackThisObj = callbackThisObj;
            this._type = type;
        }
        GListBase.prototype.dispose = function () {
            notification.removeNotificationByObject(this);
            this._list.removeEventListener(fairygui.ItemEvent.CLICK, this.onItemClick, this);
            this._list = null;
            this._type = null;
            this._itemClick = null;
        };
        /******************************************************************/
        GListBase.prototype.onItemClick = function (event) {
            var item = event.itemObject;
            this._itemClick.call(this._callbackThisObj, item);
        };
        Object.defineProperty(GListBase.prototype, "itemClick", {
            /******************************************************************/
            set: function (value) {
                this._itemClick = value;
                if (value) {
                    this._list.addEventListener(fairygui.ItemEvent.CLICK, this.onItemClick, this);
                }
                else {
                    this._list.removeEventListener(fairygui.ItemEvent.CLICK, this.onItemClick, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GListBase.prototype, "numItems", {
            set: function (value) {
                this._list.numItems = value;
            },
            enumerable: true,
            configurable: true
        });
        return GListBase;
    }());
    gui.GListBase = GListBase;
    __reflect(GListBase.prototype, "gui.GListBase");
})(gui || (gui = {}));
/**
 * Created by lxz on 2018/5/8.
 */
var gui;
(function (gui) {
    var InputText = (function () {
        /**
         *
         * @param {fairygui.GTextField} text0       提示文本
         * @param {fairygui.GTextField} text1       输入文本
         */
        function InputText(prompt_text, input_text) {
            this._text0 = prompt_text;
            this._text1 = input_text;
            this._text1.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }
        /******************************************************************/
        InputText.prototype.dispose = function () {
            this._text1.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this._text0 = null;
            this._text1 = null;
        };
        InputText.prototype.update = function () {
            this._text0.visible = this._text1.text == "";
        };
        /******************************************************************/
        InputText.prototype.onTextChange = function () {
            this._text0.visible = this._text1.text == "";
        };
        return InputText;
    }());
    gui.InputText = InputText;
    __reflect(InputText.prototype, "gui.InputText");
})(gui || (gui = {}));
var gui;
(function (gui) {
    var ItemViewBase = (function () {
        function ItemViewBase(com) {
            this._com = com;
            gui.bindGuiProperty(this, com);
            this._buttonList = [];
            this._textList = [];
            this._winList = [];
            this.registerButtons(this._com);
            this.registerTexts(this._com);
        }
        ItemViewBase.prototype.dispose = function () {
            gui.removeBindGuiProperty(this);
            notification.removeNotificationByObject(this);
            var len = this._buttonList.length;
            for (var i = 0; i < len; i++) {
                this._buttonList[i].removeClickListener(this.onClick, this);
                this._buttonList[i].dispose();
            }
            len = this._textList.length;
            for (var i = 0; i < len; i++) {
                this._textList[i].dispose();
            }
            len = this._winList.length;
            for (var i = 0; i < len; i++) {
                this._winList[0].dispose();
            }
            this._com.dispose();
            this._com = null;
            this._buttonList = null;
            this._textList = null;
            this._winList = null;
        };
        ItemViewBase.prototype.update = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
        };
        ItemViewBase.prototype.setText = function (index, text) {
            this._textList[index].text = text.toString();
        };
        ItemViewBase.prototype.getText = function (index) {
            return this._textList[index].text;
        };
        ItemViewBase.prototype.getTextFiled = function (index) {
            return this._textList[index];
        };
        /******************************************************************/
        ItemViewBase.prototype.clickByName = function (name) {
        };
        ItemViewBase.prototype.getComponent = function (resName) {
            return this._com.getChild(resName);
        };
        ItemViewBase.prototype.onClick = function (e) {
            e.stopImmediatePropagation();
            this.clickByName(e.target.name);
            var name = e.currentTarget.name;
            var pre = "btn";
            var index = name.indexOf(pre);
            if (index < 0) {
                return;
            }
            index = parseInt(name.substr(pre.length));
            this.clickHandler(index);
        };
        ItemViewBase.prototype.clickHandler = function (index) {
        };
        /******************************************************************/
        ItemViewBase.prototype.registerButtons = function (container) {
            var childLen = container.numChildren;
            for (var i = 0; i < childLen; i++) {
                var child = container.getChildAt(i);
                if (child instanceof fairygui.GButton) {
                    this.getButton(child.name);
                }
            }
        };
        ItemViewBase.prototype.registerTexts = function (container) {
            if (container == null) {
                throw new Error("窗口不存在，不能注册文本").message;
            }
            var childLen = container.numChildren;
            for (var i = 0; i < childLen; i++) {
                var child = container.getChildAt(i);
                if (child instanceof fairygui.GTextField) {
                    if (child.name.indexOf("text") > -1) {
                        this._textList.push(child);
                    }
                }
            }
            this._textList.sort(this.onTextSort);
        };
        ItemViewBase.prototype.getButton = function (resName) {
            var btn;
            btn = this.getComponent(resName);
            if (this._buttonList.indexOf(btn) >= 0) {
                return btn;
            }
            this._buttonList.push(btn);
            btn.addClickListener(this.onClick, this);
            return btn;
        };
        ItemViewBase.prototype.onTextSort = function (t1, t2) {
            var index1 = parseInt(t1["name"].substr(4));
            var index2 = parseInt(t2["name"].substr(4));
            if (index1 < index2) {
                return -1;
            }
            if (index1 > index2) {
                return 1;
            }
            return 0;
        };
        return ItemViewBase;
    }());
    gui.ItemViewBase = ItemViewBase;
    __reflect(ItemViewBase.prototype, "gui.ItemViewBase");
})(gui || (gui = {}));
/**
 * Created by lxz on 2017/8/5.
 */
var define;
(function (define) {
    var LoadUIType = (function () {
        function LoadUIType() {
        }
        // 不需要加载界面
        LoadUIType.NONE = 0;
        // 默认加载界面
        LoadUIType.NORMAL = 1;
        return LoadUIType;
    }());
    define.LoadUIType = LoadUIType;
    __reflect(LoadUIType.prototype, "define.LoadUIType");
})(define || (define = {}));
/**
 * Created by lxz on 2017/8/5.
 */
///<reference path="OvBase.ts"/>
var loadUI;
(function (loadUI) {
    var BaseLoadingUI = (function (_super) {
        __extends(BaseLoadingUI, _super);
        function BaseLoadingUI(resName, modal, center) {
            if (modal === void 0) { modal = true; }
            if (center === void 0) { center = true; }
            var _this = _super.call(this, "load_ui", resName, modal, center) || this;
            _this.uiType = define.UITypeDefine.NONE;
            return _this;
        }
        BaseLoadingUI.prototype.open = function (moduleName) {
            _super.prototype.open.call(this, moduleName);
        };
        BaseLoadingUI.prototype.setProgress = function (current, total) {
        };
        return BaseLoadingUI;
    }(gui.OvBase));
    loadUI.BaseLoadingUI = BaseLoadingUI;
    __reflect(BaseLoadingUI.prototype, "loadUI.BaseLoadingUI", ["loadUI.ILoadUI"]);
    // export class LoadingUI extends BaseLoadingUI {
    //     private progress: fairygui.GProgressBar;
    //
    //     public constructor() {
    //         super("loading_ui");
    //     }
    //
    //     createView(): void {
    //
    //     }
    //
    //     setProgress(current: number, total: number): void {
    //         this.progress.value = current;
    //         this.progress.max = total;
    //         //console.log(`Loading...${current}/${total}`);
    //     }
    // }
})(loadUI || (loadUI = {}));
/**
 * Created by lxz on 2017/7/13.
 */
/**
 * 方法携带数据
 */
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
__reflect(FunctionInfo.prototype, "FunctionInfo");
var gui;
(function (gui) {
    var PageTurn = (function () {
        /**
         *  翻页
         * @param com           翻页资源 （翻页列表父级显示对象，里面包含特定组件：list,prevBtn,nextBtn,pageTxt缺一不可）
         * @param pkgName       包名
         * @param resName       对应的物件名
         * @param type          物件类型
         * @param itemRenderer  渲染物件方法 function(当前页的index，所有列表的index，item对象)
         * @param onChange      翻页触发方法
         */
        function PageTurn(com, pkgName, resName, type, itemRenderer, onTurnPage, callbackThisObj) {
            this._currentPage = 0;
            this._totalPage = 0;
            this._pageNum = 0;
            this._length = 0;
            this._com = com;
            fairygui.UIObjectFactory.setPackageItemExtension(fairygui.UIPackage.getItemURL(pkgName, resName), type);
            this._list = this._com.getChild("list").asList;
            this._preBtn = this._com.getChild("prevBtn").asButton;
            this._nextBtn = this._com.getChild("nextBtn").asButton;
            if (this._com.getChild("pageTxt") != null) {
                this._pageText = this._com.getChild("pageTxt").asTextField;
            }
            this._itemRenderer = itemRenderer;
            this._callbackThisObj = callbackThisObj;
            this._list.itemRenderer = this.itemRenderer;
            this._list.callbackThisObj = this;
            this._type = type;
            this._preBtn.addClickListener(this.onPre, this);
            this._nextBtn.addClickListener(this.onNext, this);
            this._currentPage = 1;
            this._onTurnPage = onTurnPage;
        }
        PageTurn.prototype.dispose = function () {
            this._list.removeEventListener(fairygui.ItemEvent.CLICK, this.onItemClick, this);
            this._preBtn.removeClickListener(this.onPre, this);
            this._nextBtn.removeClickListener(this.onNext, this);
            this._com.dispose();
            this._com = null;
            this._list = null;
            this._type = null;
            this._itemClick = null;
            this._onTurnPage = null;
            this._itemRenderer = null;
            this._callbackThisObj = null;
        };
        /******************************************************************/
        PageTurn.prototype.onPageChange = function () {
            if (this._currentPage > this._totalPage) {
                this._currentPage = 1;
            }
            this._preBtn.enabled = this._currentPage > 1;
            this._nextBtn.enabled = this._currentPage < this._totalPage;
            if (this._pageText) {
                this._pageText.text = String(this._currentPage) + "/" + this._totalPage;
            }
            this.numItems = this._pageNum;
            this._onTurnPage.call(this._callbackThisObj);
        };
        PageTurn.prototype.onItemClick = function (event) {
            var item = event.itemObject;
            this._itemClick.call(this._callbackThisObj, item);
        };
        PageTurn.prototype.onPre = function () {
            this._currentPage--;
            this.onPageChange();
        };
        PageTurn.prototype.onNext = function () {
            this._currentPage++;
            this.onPageChange();
        };
        PageTurn.prototype.itemRenderer = function (index, item) {
            this._itemRenderer.call(this._callbackThisObj, index, (this._currentPage - 1) * this._pageNum + index, item);
        };
        Object.defineProperty(PageTurn.prototype, "itemClick", {
            set: function (value) {
                this._itemClick = value;
                if (value) {
                    this._list.addEventListener(fairygui.ItemEvent.CLICK, this.onItemClick, this);
                }
                else {
                    this._list.removeEventListener(fairygui.ItemEvent.CLICK, this.onItemClick, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageTurn.prototype, "length", {
            set: function (value) {
                this._length = value;
                if (this._length == 0) {
                    this._totalPage = 1;
                }
                else {
                    this._totalPage = Math.floor((this._length - 1) / this._pageNum + 1);
                }
                this.onPageChange();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageTurn.prototype, "numItems", {
            set: function (value) {
                this._list.numItems = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageTurn.prototype, "currentPage", {
            get: function () {
                return this._currentPage;
            },
            set: function (value) {
                this._currentPage = value;
                this.onPageChange();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageTurn.prototype, "totalPage", {
            get: function () {
                return this._totalPage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageTurn.prototype, "pageNum", {
            get: function () {
                return this._pageNum;
            },
            set: function (value) {
                this._pageNum = value;
            },
            enumerable: true,
            configurable: true
        });
        return PageTurn;
    }());
    gui.PageTurn = PageTurn;
    __reflect(PageTurn.prototype, "gui.PageTurn");
})(gui || (gui = {}));
/**
 * Created by lxz on 2017/11/21.
 */
var gui;
(function (gui) {
    /**
     * 滚动面板
     */
    var ScrollPanel = (function () {
        function ScrollPanel(com, show_num, pkgName, resName, typeClass, time) {
            if (time === void 0) { time = 1000; }
            /* 显示的滚动条目*/
            this._show_num = 2;
            /* 总的长度*/
            this._length = 0;
            /* 滚动位置开始索引(容器位置)*/
            this._sIndex = 0;
            /* 滚动边界索引(下一个的item位置)*/
            this._lIndex = 0;
            this._com = com;
            this._pkgName = pkgName;
            this._resName = resName;
            this._show_num = show_num;
            this._container = new fairygui.GComponent();
            this._com.addChild(this._container);
            fairygui.UIObjectFactory.setPackageItemExtension(fairygui.UIPackage.getItemURL(pkgName, resName), typeClass);
            this._render = new ScrollRender();
            this._time = time;
        }
        ScrollPanel.prototype.dispose = function () {
            this._running = false;
            if (delay.hasDelayMain(this)) {
                delay.addDelayTransact(this, this.dispose);
                return;
            }
            this.clearTypes();
            this._com = null;
            this._render = null;
            this._container = null;
        };
        /******************************************************************/
        ScrollPanel.prototype.clearTypes = function () {
            if (this._types) {
                var len = this._types.length;
                for (var i = 0; i < len; i++) {
                    this._types[i].dispose();
                }
                this._types = null;
            }
        };
        ScrollPanel.prototype.draw = function () {
            this._types = [];
            if (this._length > this._show_num) {
                var len = this._show_num + 1;
                for (var i = 0; i < len; i++) {
                    var obj = fairygui.UIPackage.createObject(this._pkgName, this._resName);
                    this._container.addChild(obj);
                    var position = this._render.getPosition(i);
                    obj.x = position.x;
                    obj.y = position.y;
                    obj.setListIndex(i);
                    this._types.push(obj);
                }
                this._sIndex = 0;
                this._lIndex = this._show_num;
                this._running = true;
                this.startScroll();
            }
            else {
                var len = this._length;
                for (var i = 0; i < len; i++) {
                    var obj = fairygui.UIPackage.createObject(this._pkgName, this._resName);
                    this._container.addChild(obj);
                    var position = this._render.getPosition(i);
                    obj.x = position.x;
                    obj.y = position.y;
                    obj.setListIndex(i);
                    this._types.push(obj);
                }
            }
        };
        ScrollPanel.prototype.start = function () {
            this._running = true;
            this.next();
        };
        ScrollPanel.prototype.stop = function () {
            this._running = false;
        };
        ScrollPanel.prototype.startScroll = function () {
            this._sIndex--;
            delay.createDelayMain(this);
            var position = this._render.getPosition(this._sIndex);
            egret.Tween.get(this._container).to(position, this._time).call(this.next, this);
        };
        ScrollPanel.prototype.next = function () {
            this._lIndex++;
            var obj = this._types.shift();
            var positon = this._render.getPosition(this._lIndex);
            obj.x = positon.x;
            obj.y = positon.y;
            var index = ++this._types[this._types.length - 1].listIndex;
            if (index >= this._length) {
                index = 0;
            }
            obj.setListIndex(index);
            this._types.push(obj);
            delay.executeAllTransact(this);
            if (!this._running) {
                return;
            }
            this.startScroll();
        };
        Object.defineProperty(ScrollPanel.prototype, "length", {
            /******************************************************************/
            set: function (value) {
                if (delay.hasDelayMain(this)) {
                    delay.addDelayTransact(this, "length", value);
                    return;
                }
                if (this._length == value) {
                    return;
                }
                if (this._length == 0) {
                    this._length = value;
                    this.draw();
                }
                else {
                    if (this._length <= this._show_num) {
                        this.clearTypes();
                        this._length = value;
                        this.draw();
                    }
                    else {
                        this._length = value;
                        if (this._length <= this._show_num) {
                            this.clearTypes();
                            this.draw();
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPanel.prototype, "render", {
            get: function () {
                return this._render;
            },
            enumerable: true,
            configurable: true
        });
        return ScrollPanel;
    }());
    gui.ScrollPanel = ScrollPanel;
    __reflect(ScrollPanel.prototype, "gui.ScrollPanel");
    var ScrollItem = (function (_super) {
        __extends(ScrollItem, _super);
        function ScrollItem() {
            var _this = _super.call(this) || this;
            delay.createDelayMain(_this);
            return _this;
        }
        ScrollItem.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        ScrollItem.prototype.constructFromResource = function () {
            _super.prototype.constructFromResource.call(this);
            delay.executeAllTransact(this);
        };
        ScrollItem.prototype.setListIndex = function (index) {
            this.listIndex = index;
            if (delay.hasDelayMain(this)) {
                delay.addDelayTransact(this, this.change);
                return;
            }
            this.change();
        };
        ScrollItem.prototype.change = function () {
        };
        return ScrollItem;
    }(fairygui.GComponent));
    gui.ScrollItem = ScrollItem;
    __reflect(ScrollItem.prototype, "gui.ScrollItem");
    var ScrollRender = (function () {
        function ScrollRender() {
        }
        /**
         * 获取位置
         */
        ScrollRender.prototype.getPosition = function (index) {
            return { x: 0, y: this.tap * index };
        };
        return ScrollRender;
    }());
    gui.ScrollRender = ScrollRender;
    __reflect(ScrollRender.prototype, "gui.ScrollRender");
})(gui || (gui = {}));
/**
 * Created by lxz on 2017/11/17.
 */
var gui;
(function (gui) {
    var Slider = (function () {
        function Slider(com, changeFun, changeContext) {
            this._minNum = 0;
            this._maxNum = 0;
            this._rate = 1;
            this._showRate = 1;
            this._com = com;
            this._slider = this._com.getChild("slider").asSlider;
            this._prevBtn = this._com.getChild("prev").asButton;
            this._nextBtn = this._com.getChild("next").asButton;
            if (this._com.getChild("text").asTextField) {
                this._text = this._com.getChild("text").asTextField;
                this._text.text = this._slider.value.toString();
            }
            this._prevBtn.addClickListener(this.onPrev, this);
            this._nextBtn.addClickListener(this.onNext, this);
            this._slider.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onChange, this);
            this._changeFun = changeFun;
            this._changeContext = changeContext;
            //this.onChange();
        }
        Slider.prototype.dispose = function () {
            this._slider.removeEventListener(fairygui.StateChangeEvent.CHANGED, this.onChange, this);
            this._prevBtn.removeClickListener(this.onPrev, this);
            this._nextBtn.removeClickListener(this.onNext, this);
            this._com = null;
            this._slider = null;
            this._prevBtn = null;
            this._nextBtn = null;
            this._text = null;
            this._changeFun = null;
            this._changeContext = null;
        };
        /******************************************************************/
        Slider.prototype.onPrev = function () {
            if (this._slider.value > 0) {
                this._slider.value--;
                this._slider.update();
                this.onChange();
            }
        };
        Slider.prototype.onNext = function () {
            if (this._slider.value < this._slider.max) {
                this._slider.value++;
                this._slider.update();
                this.onChange();
            }
        };
        Slider.prototype.onChange = function () {
            if (this._changeFun) {
                this._changeFun.apply(this._changeContext);
            }
            this.refreshText();
        };
        Slider.prototype.mathValues = function () {
            this._slider.max = (this._maxNum - this._minNum) / this.rate;
        };
        Slider.prototype.refreshText = function () {
            if (this._text) {
                this._text.text = (this._slider.value * this.rate / this.showRate + this._minNum / this.showRate).toString();
            }
            this._prevBtn.enabled = this._slider.value > 0;
            this._nextBtn.enabled = this._slider.value < this._slider.max;
        };
        Object.defineProperty(Slider.prototype, "max", {
            get: function () {
                return this._slider.max;
            },
            /******************************************************************/
            set: function (num) {
                this.maxNum = num;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "value", {
            get: function () {
                return this._slider.value * this.rate + this._minNum;
            },
            set: function (num) {
                this._slider.value = (num - this._minNum) / this.rate;
                this.onChange();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "minNum", {
            get: function () {
                return this._minNum;
            },
            set: function (value) {
                this._minNum = value;
                this.mathValues();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "maxNum", {
            get: function () {
                return this._maxNum;
            },
            set: function (value) {
                this._maxNum = value;
                this.mathValues();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "rate", {
            get: function () {
                return this._rate;
            },
            set: function (value) {
                this._rate = value;
                this.mathValues();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "showRate", {
            get: function () {
                return this._showRate;
            },
            set: function (value) {
                this._showRate = value;
                this.mathValues();
            },
            enumerable: true,
            configurable: true
        });
        return Slider;
    }());
    gui.Slider = Slider;
    __reflect(Slider.prototype, "gui.Slider");
})(gui || (gui = {}));
/**
 * Created by lxz on 2017/10/17.
 */
///<reference path="container.ts" />
var tip;
(function (tip) {
    var singleton = gameTool.singleton;
    var TipItem = (function (_super) {
        __extends(TipItem, _super);
        function TipItem(message) {
            var _this = _super.call(this) || this;
            _this._message = message;
            _this.initView();
            _this.touchEnabled = false;
            return _this;
        }
        TipItem.prototype.initView = function () {
            this._ui = fairygui.UIPackage.createObject("common", "tip").asCom;
            this.addChild(this._ui.displayObject);
            this._content = this._ui.getChild("content").asTextField;
            this._content.text = this._message;
        };
        TipItem.prototype.startScroll = function () {
            //   this._ui.getTransition("appear").play(this.dispose, this);
            setTimeout(this.dispose.bind(this), 1000);
        };
        TipItem.prototype.dispose = function () {
            this.dispatchEvent(new egret.Event(egret.Event.CLOSE));
            _super.prototype.dispose.call(this);
        };
        return TipItem;
    }(extendsUI.BaseContainer));
    tip.TipItem = TipItem;
    __reflect(TipItem.prototype, "tip.TipItem");
    var TipManager = (function () {
        function TipManager() {
            this.GAME_TIP_START_Y = 200;
            this._textTipCurrentY = gameTool.stage.stageHeight / 2 - this.GAME_TIP_START_Y;
            this._itemList = [];
        }
        TipManager.prototype.showTextTip = function (message) {
            var item = new TipItem(message);
            item.x = (gameTool.stage.stageWidth - item.width) / 2;
            item.y = this._textTipCurrentY;
            gui.addDisplayToStage(item, define.WindowType.TIP_LAYER);
            item.startScroll();
            this._textTipCurrentY += 50;
            this._itemList.push(item);
            item.addEventListener(egret.Event.CLOSE, this.onGameTipClose, this);
        };
        /******************************************************************/
        TipManager.prototype.onGameTipClose = function (event) {
            var item = event.currentTarget;
            var index = this._itemList.indexOf(item);
            item.removeEventListener(egret.Event.CLOSE, this.onGameTipClose, this);
            if (index >= 0) {
                this._itemList.splice(index, 1);
            }
            if (this._itemList.length == 0) {
                this._textTipCurrentY = gameTool.stage.stageHeight / 2 - this.GAME_TIP_START_Y;
            }
        };
        return TipManager;
    }());
    tip.TipManager = TipManager;
    __reflect(TipManager.prototype, "tip.TipManager");
    function showTextTip(message) {
        singleton(TipManager).showTextTip(message);
    }
    tip.showTextTip = showTextTip;
})(tip || (tip = {}));
/**
 * Created by silence on 2017/7/1.
 */
var gui;
(function (gui) {
    var UIAnimation = (function () {
        function UIAnimation() {
        }
        UIAnimation.prototype.show = function (callback, context) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.inClose = false;
            callback.apply(context, args);
        };
        UIAnimation.prototype.close = function (callback, context) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.inClose = true;
            callback.apply(context, args);
        };
        UIAnimation.prototype.dispose = function () {
            this.component = null;
        };
        return UIAnimation;
    }());
    gui.UIAnimation = UIAnimation;
    __reflect(UIAnimation.prototype, "gui.UIAnimation");
    /**
     * 弹窗模式(透明度渐变居中大小变化)
     */
    var BoxAnimation = (function (_super) {
        __extends(BoxAnimation, _super);
        function BoxAnimation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BoxAnimation.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        BoxAnimation.prototype.show = function (callback, context) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.lastScaleX = this.component.scaleX;
            this.lastScaleY = this.component.scaleY;
            this.component.scaleX = 0;
            this.component.scaleY = 0;
            egret.Tween.get(this.component).to({
                scaleX: this.lastScaleX,
                scaleY: this.lastScaleY
            }, 300, egret.Ease.backOut).wait(100).call(callback, context, args);
        };
        BoxAnimation.prototype.close = function (callback, context) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            egret.Tween.get(this.component).to({
                scaleX: 0,
                scaleY: 0
            }, 300, egret.Ease.backIn).call(callback, context, args);
        };
        return BoxAnimation;
    }(UIAnimation));
    gui.BoxAnimation = BoxAnimation;
    __reflect(BoxAnimation.prototype, "gui.BoxAnimation");
    /**
     * 主窗口模式(从左到右)
     */
    var SceneAnimation = (function (_super) {
        __extends(SceneAnimation, _super);
        function SceneAnimation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SceneAnimation.prototype.show = function (callback, context) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this._orienX = this.component.x;
            this.component.x = this._orienX - 720;
            egret.Tween.get(this.component).to({ x: this._orienX }, 200).wait(100).call(callback, context, args);
        };
        SceneAnimation.prototype.close = function (callback, context) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            egret.Tween.get(this.component).to({ x: this._orienX + 720 }, 300).call(callback, context, args);
        };
        return SceneAnimation;
    }(UIAnimation));
    gui.SceneAnimation = SceneAnimation;
    __reflect(SceneAnimation.prototype, "gui.SceneAnimation");
})(gui || (gui = {}));
var app_sound;
(function (app_sound) {
    var singleton = gameTool.singleton;
    /**
     * 播放特效音乐
     */
    function playEffect(res, volume) {
        singleton(SoundManager).playEffect(res, volume);
    }
    app_sound.playEffect = playEffect;
    /**
     * 播放背景音乐
     */
    function playBGM(name) {
        singleton(SoundManager).playBGM(name);
    }
    app_sound.playBGM = playBGM;
    /**
     * 暂停背景音乐
     */
    function pauseBGM() {
        singleton(SoundManager).pauseBGM();
    }
    app_sound.pauseBGM = pauseBGM;
    /**
     * 继续背景音乐
     */
    function resumeBGM() {
        singleton(SoundManager).resumeBGM();
    }
    app_sound.resumeBGM = resumeBGM;
    var SoundManager = (function () {
        function SoundManager() {
            /**
             * 背景音乐音量
             */
            this.volume = 0.45;
            this._lastMusic = "";
        }
        SoundManager.prototype.init = function (stage) {
            stage.addEventListener(egret.Event.DEACTIVATE, this.onBlur, this);
            stage.addEventListener(egret.Event.ACTIVATE, this.onFocus, this);
        };
        /******************************************************************/
        /**
         * 播放特效音乐
         */
        SoundManager.prototype.playEffect = function (res, volume) {
            var effect = RES.getRes(res);
            if (effect) {
                effect.type = egret.Sound.EFFECT;
                var channel = effect.play(0, 1);
                channel.volume = volume ? volume : this.volume;
            }
        };
        /**
         * 播放背景音乐
         */
        SoundManager.prototype.playBGM = function (name) {
            if (this._lastMusic == name) {
                this.disposeSound();
                this._soundChannel = this._sound.play();
                return;
            }
            this._lastMusic = name;
            this._sound = RES.getRes(this._lastMusic);
            if (this._sound) {
                this._sound.type = egret.Sound.MUSIC;
                this.disposeSound();
                this._soundChannel = this._sound.play();
            }
        };
        /**
         * 暂停背景音乐
         */
        SoundManager.prototype.pauseBGM = function () {
            if (this._soundChannel && !this._soundChannel["isStopped"]) {
                this._soundChannel.volume = 0;
            }
        };
        /**
         * 继续背景音乐
         */
        SoundManager.prototype.resumeBGM = function () {
            if (this._soundChannel && !this._soundChannel["isStopped"]) {
                this._soundChannel.volume = this.volume;
            }
        };
        /**
         * 释放音乐资源
         */
        SoundManager.prototype.disposeSound = function () {
            if (this._soundChannel) {
                this._soundChannel.stop();
                this._soundChannel = null;
            }
        };
        /******************************************************************/
        SoundManager.prototype.onBlur = function () {
            this.pauseBGM();
        };
        SoundManager.prototype.onFocus = function () {
            this.resumeBGM();
        };
        return SoundManager;
    }());
    app_sound.SoundManager = SoundManager;
    __reflect(SoundManager.prototype, "app_sound.SoundManager");
})(app_sound || (app_sound = {}));
/**
 * Created by lxz on 2017/11/2.
 */
var bind;
(function (bind) {
    var Binding = (function () {
        function Binding() {
            this.bindFunciotnNamePre = "__bind_fun__";
        }
        /**
         * 绑定一个对象的属性值到要监视的对象属性上。
         * @param host 用于承载要监视的属性或属性链的对象。
         * 当 <code>host</code>上<code>chain</code>所对应的值发生改变时，<code>target</code>上的<code>prop</code>属性将被自动更新。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 <code>host.a.b.c</code>，需按以下形式调用此方法：<code>bindProperty(host, ["a","b","c"], ...)。</code>
         * @param target 本次绑定要更新的目标对象。
         * @param prop 本次绑定要更新的目标属性名称。
         * @returns 如果已为 chain 参数至少指定了一个属性名称，则返回 Watcher 实例；否则返回 null。
         */
        Binding.prototype.bindProperty = function (host, chain, target, prop) {
            var key = this.getHostInfo(host, chain);
            var funKey = this.bindFunciotnNamePre + key + "_" + prop;
            target[funKey] = function (value) {
                target[prop] = value;
            };
            notification.addNotification(key, target[funKey], target);
        };
        /**
         * 绑定一个回调函数到要监视的对象属性上。当 host上 chain 所对应的值发生改变时，handler 方法将被自动调用。
         * @param host 用于承载要监视的属性或属性链的对象。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 host.a.b.c，需按以下形式调用此方法：bindSetter(host, ["a","b","c"], ...)。
         * @param handler 在监视的目标属性链中任何属性的值发生改变时调用的事件处理函数。
         * @param thisObject handler 方法绑定的this对象
         */
        Binding.prototype.bindHandler = function (host, chain, handler, thisObject) {
            var key = this.getHostInfo(host, chain);
            var funKey = this.bindFunciotnNamePre + key + "_" + gameTool.getTypeId(handler);
            thisObject[funKey] = handler;
            notification.addNotification(key, thisObject[funKey], thisObject);
        };
        Binding.prototype.removeBind = function (host, chain, target, prop) {
            var key = this.getHostInfo(host, chain);
            var funKey = this.bindFunciotnNamePre + key + "_" + (typeof prop == "string" ? prop : gameTool.getTypeId(prop));
            notification.removeNotification(key, target[funKey], target);
            delete target[funKey];
        };
        Binding.prototype.removeBindByObject = function (target) {
            var keys = Object.keys(target);
            var len = keys.length;
            for (var i = 0; i < len; i++) {
                if (keys[i].indexOf(this.bindFunciotnNamePre) > -1) {
                    var key = keys[i].substring(this.bindFunciotnNamePre.length, keys[i].lastIndexOf("_"));
                    notification.removeNotification(key, target[keys[i]], target);
                    delete target[keys[i]];
                }
            }
        };
        /**
         * 改变值
         */
        Binding.prototype.sendBind = function (context, prop) {
            var id = gameTool.getTypeId(context);
            notification.postNotification(id + "__" + prop, context[prop]);
        };
        Binding.prototype.changeValue = function (context, prop, value) {
            context[prop] = value;
            var id = gameTool.getTypeId(context);
            notification.postNotification(id + "__" + prop, value);
        };
        /******************************************************************/
        Binding.prototype.getHostInfo = function (host, chain) {
            var prototype = host;
            if (chain.length > 1) {
                var len = chain.length;
                for (var i = 0; i < len - 1; i++) {
                    prototype = prototype[chain[i]];
                }
            }
            var id = gameTool.getTypeId(prototype);
            var key = chain[chain.length - 1];
            return id + "__" + key;
        };
        return Binding;
    }());
    bind.Binding = Binding;
    __reflect(Binding.prototype, "bind.Binding");
    /**
     * 绑定一个对象的属性值到要监视的对象属性上。
     * @param host 用于承载要监视的属性或属性链的对象。
     * 当 <code>host</code>上<code>chain</code>所对应的值发生改变时，<code>target</code>上的<code>prop</code>属性将被自动更新。
     * @param chain 用于指定要监视的属性链的值。例如，要监视属性 <code>host.a.b.c</code>，需按以下形式调用此方法：<code>bindProperty(host, ["a","b","c"], ...)。</code>
     * @param target 本次绑定要更新的目标对象。
     * @param prop 本次绑定要更新的目标属性名称。
     * @returns 如果已为 chain 参数至少指定了一个属性名称，则返回 Watcher 实例；否则返回 null。
     */
    function bindProperty(host, chain, target, prop) {
        gameTool.singleton(Binding).bindProperty(host, chain, target, prop);
    }
    bind.bindProperty = bindProperty;
    /**
     * 绑定一个回调函数到要监视的对象属性上。当 host上 chain 所对应的值发生改变时，handler 方法将被自动调用。
     * @param host 用于承载要监视的属性或属性链的对象。
     * @param chain 用于指定要监视的属性链的值。例如，要监视属性 host.a.b.c，需按以下形式调用此方法：bindSetter(host, ["a","b","c"], ...)。
     * @param handler 在监视的目标属性链中任何属性的值发生改变时调用的事件处理函数。
     * @param thisObject handler 方法绑定的this对象
     */
    function bindHandler(host, chain, handler, thisObject) {
        gameTool.singleton(Binding).bindHandler(host, chain, handler, thisObject);
    }
    bind.bindHandler = bindHandler;
    /**
     * 改变值
     */
    function sendBind(context, prop) {
        gameTool.singleton(Binding).sendBind(context, prop);
    }
    bind.sendBind = sendBind;
    function changeValue(context, prop, value) {
        gameTool.singleton(Binding).changeValue(context, prop, value);
    }
    bind.changeValue = changeValue;
    /**
     * 解除对指定属性的指定绑定
     */
    function removeBind(host, chain, target, prop) {
        gameTool.singleton(Binding).removeBind(host, chain, target, prop);
    }
    bind.removeBind = removeBind;
    /**
     * 解除target身上的所有绑定
     * @param target
     */
    function removeBindByObject(target) {
        gameTool.singleton(Binding).removeBindByObject(target);
    }
    bind.removeBindByObject = removeBindByObject;
})(bind || (bind = {}));
/**
 * Created by lxz on 2017/9/1.
 */
var gameTool;
(function (gameTool) {
    var CustomTimer = (function (_super) {
        __extends(CustomTimer, _super);
        function CustomTimer(delay, repeatCount) {
            var _this = _super.call(this, delay, repeatCount) || this;
            _this._runFun = new FunctionInfo();
            _this._completeFun = new FunctionInfo();
            return _this;
        }
        CustomTimer.prototype.dispose = function () {
            this.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
            this.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
            this.reset();
            this._runFun.dispose();
            this._completeFun.dispose();
            this._runFun = null;
            this._completeFun = null;
        };
        /******************************************************************/
        CustomTimer.prototype.restart = function () {
            this.reset();
            this.start();
        };
        CustomTimer.prototype.setRunCall = function (fun, context) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this._runFun.fun = fun;
            this._runFun.context = context;
            this._runFun.args = args;
            this.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        };
        CustomTimer.prototype.setRunArgs = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._runFun.args = args;
        };
        CustomTimer.prototype.setCompleteCall = function (fun, context) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this._completeFun.fun = fun;
            this._completeFun.context = context;
            this._completeFun.args = args;
            this.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
        };
        CustomTimer.prototype.setCompleteArgs = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._completeFun.args = args;
        };
        /******************************************************************/
        CustomTimer.prototype.onTimer = function () {
            this._runFun.call();
        };
        CustomTimer.prototype.onTimerComplete = function () {
            this._completeFun.call();
        };
        Object.defineProperty(CustomTimer.prototype, "surplus", {
            /******************************************************************/
            get: function () {
                return this.repeatCount - this.currentCount;
            },
            enumerable: true,
            configurable: true
        });
        return CustomTimer;
    }(egret.Timer));
    gameTool.CustomTimer = CustomTimer;
    __reflect(CustomTimer.prototype, "gameTool.CustomTimer");
})(gameTool || (gameTool = {}));
/**
 * Created by lxz on 2018/3/26.
 */
var dateTool;
(function (dateTool) {
    /**
     * 获取当年当月的天数
     * @param year      0:是当前年
     * @param month     0:是当前月
     * @returns {number}
     */
    function getCountDays(year, month) {
        var curDate = new Date();
        if (year) {
            if (month) {
                curDate.setFullYear(year, month - 1);
            }
            else {
                curDate.setFullYear(year);
            }
        }
        /* 获取当前月份 */
        var curMonth = curDate.getMonth();
        /*  设置成下个月 */
        curDate.setMonth(curMonth + 1);
        /* 将日期设置为0, 则该日期变为上个月的最后一天 */
        curDate.setDate(0);
        /* 返回当月的天数 */
        return curDate.getDate();
    }
    dateTool.getCountDays = getCountDays;
    /**
     * 获取几分几秒
     * time 秒
     */
    function getTime0(time) {
        return Math.floor(time / 60) + "\u5206" + Math.floor(time % 60) + "\u79D2";
    }
    dateTool.getTime0 = getTime0;
    /**
     * 获取几分几秒几毫秒
     * time 毫秒
     */
    function getTime1(time) {
        var ntime = Math.floor(time * .001);
        return Math.floor(ntime / 60) + "\u5206" + Math.floor(ntime % 60) + "\u79D2" + Math.floor((time % 1000) * .1) + "\u6BEB\u79D2";
    }
    dateTool.getTime1 = getTime1;
    /**
     * 由时间格式2000-1-1-6-30-30获取总的时间毫秒
     */
    function timestrToTime(timestr) {
        var arr = timestr.split("-");
        var date = new Date();
        date.setFullYear(parseInt(arr[0]), parseInt(arr[1]) - 1, parseInt(arr[2]));
        date.setHours(arr.length > 3 ? parseInt(arr[3]) : 0);
        date.setMinutes(arr.length > 4 ? parseInt(arr[4]) : 0);
        date.setSeconds(arr.length > 5 ? parseInt(arr[5]) : 0);
        return date.getTime();
    }
    dateTool.timestrToTime = timestrToTime;
    /**
     * 由时间格式2000-1-1-6-30-30
     * 判断时间格式在不在当前时间范围内
     */
    function inTime(time, timestr1, timestr2) {
        return time > timestrToTime(timestr1) && time < timestrToTime(timestr2);
    }
    dateTool.inTime = inTime;
})(dateTool || (dateTool = {}));
/**
 * Created by lxz on 2017/6/28.
 */
var definiton;
(function (definiton) {
    /**
     * 获取指定类的类型
     * @param name 类型名称
     * @param defaultType 默认类型
     * @returns {any}
     */
    function getDefinitionType(name) {
        var t = egret.getDefinitionByName(name);
        return t;
    }
    definiton.getDefinitionType = getDefinitionType;
    /**
     * 获取指定类的实例
     * @param args 类型构造函数参数列表
     * @param name 类型名称
     * @param defaultType 默认类型
     * @param args 类型构造函数参数列表
     * @returns {null}
     */
    function getDefinitionInstance(name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var define = getDefinitionType(name);
        return new (define.bind.apply(define, [void 0].concat(args)))();
    }
    definiton.getDefinitionInstance = getDefinitionInstance;
    /**
     * 是否是class类型
     */
    function isClass(obj) {
        return obj.prototype != null;
    }
    definiton.isClass = isClass;
    /**
     * 根据实例获取类名称
     */
    function getClassNameByObject(obj) {
        if (!obj["__proto__"].hasOwnProperty("__class__")) {
            return egret.getQualifiedClassName(obj);
        }
        var str = obj["__proto__"]["__class__"];
        return str;
    }
    definiton.getClassNameByObject = getClassNameByObject;
    /**
     * 根据实例获取类
     */
    function getClassByObject(obj) {
        return obj["constructor"];
    }
    definiton.getClassByObject = getClassByObject;
    /**
     * 根据类型获取类名
     */
    function getNameByClass(keyClass) {
        return keyClass.prototype["__class__"];
    }
    definiton.getNameByClass = getNameByClass;
    /**
     * 判断是否拥有该方法
     */
    function hasProperty(obj, property) {
        return this.getProperty(obj, property) !== undefined;
    }
    definiton.hasProperty = hasProperty;
    /**
     * 判断该类型是不是继承其他类型
     */
    function isExtends(parent, son) {
        var arr = parent.prototype["__types__"];
        if (arr && arr.length > 0) {
            return arr.indexOf(getNameByClass(son)) > -1;
        }
        return false;
    }
    definiton.isExtends = isExtends;
    /**
     * 获取某个实例的属性value
     */
    function getProperty(o, name) {
        return o[name]; // o[name] is of type T[K]
    }
    definiton.getProperty = getProperty;
    /**
     * 获取某个实例的属性value集合
     */
    function pluckPropertys(o, names) {
        return names.map(function (n) { return o[n]; });
    }
    definiton.pluckPropertys = pluckPropertys;
})(definiton || (definiton = {}));
/**
 * Created by lxz on 2017/11/15.
 */
var delay;
(function (delay) {
    var DelayTransactManager = (function () {
        function DelayTransactManager() {
            this._delayMainList = {};
            this._delayTransactList = {};
        }
        /**
         * 创建延迟事务主体
         */
        DelayTransactManager.prototype.createDelayMain = function (context) {
            var id = gameTool.getTypeId(context);
            if (this._delayMainList[id] == null) {
                this._delayMainList[id] = context;
            }
        };
        /**
         * 是否拥有事务主体
         */
        DelayTransactManager.prototype.hasDelayMain = function (context) {
            var id = gameTool.getTypeId(context);
            return this._delayMainList[id] != null;
        };
        /**
         * 创建延迟事务
         */
        DelayTransactManager.prototype.addDelayTransact = function (context, fun) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var info = gameTool.poolList.getInstance(FunctionInfo);
            info.context = context;
            info.fun = fun;
            info.args = args;
            var id = gameTool.getTypeId(context);
            if (this._delayTransactList[id] == null) {
                this._delayTransactList[id] = [info];
            }
            else {
                this._delayTransactList[id].push(info);
            }
        };
        /**
         * 执行所有延迟事务
         */
        DelayTransactManager.prototype.executeAllTransact = function (context) {
            var id = gameTool.getTypeId(context);
            this._delayMainList[id] = null;
            delete this._delayMainList[id];
            if (this._delayTransactList[id]) {
                var len = this._delayTransactList[id].length;
                for (var i = 0; i < len; i++) {
                    this._delayTransactList[id][i].onceCall();
                }
                this._delayTransactList[id] = null;
                delete this._delayTransactList[id];
            }
        };
        /**
         * 是否拥有延迟事务
         */
        DelayTransactManager.prototype.hasTransact = function (context) {
            var id = gameTool.getTypeId(context);
            if (this._delayTransactList[id]) {
                return this._delayTransactList[id].length > 0;
            }
            return false;
        };
        return DelayTransactManager;
    }());
    delay.DelayTransactManager = DelayTransactManager;
    __reflect(DelayTransactManager.prototype, "delay.DelayTransactManager");
    /******************************************************************/
    /******************************************************************/
    /******************************************************************/
    /**
     * 创建延迟事务主体
     */
    function createDelayMain(context) {
        gameTool.singleton(DelayTransactManager).createDelayMain(context);
    }
    delay.createDelayMain = createDelayMain;
    /**
     * 是否拥有事务主体
     */
    function hasDelayMain(context) {
        return gameTool.singleton(DelayTransactManager).hasDelayMain(context);
    }
    delay.hasDelayMain = hasDelayMain;
    /**
     * 创建延迟事务
     */
    function addDelayTransact(context, fun) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        (_a = gameTool.singleton(DelayTransactManager)).addDelayTransact.apply(_a, [context, fun].concat(args));
        var _a;
    }
    delay.addDelayTransact = addDelayTransact;
    /**
     * 执行所有延迟事务
     */
    function executeAllTransact(context) {
        gameTool.singleton(DelayTransactManager).executeAllTransact(context);
    }
    delay.executeAllTransact = executeAllTransact;
    /**
     * 是否拥有延迟事务
     */
    function hasTransact(context) {
        gameTool.singleton(DelayTransactManager).hasTransact(context);
    }
    delay.hasTransact = hasTransact;
})(delay || (delay = {}));
/**
 * Created by brucex on 16/5/26.
 */
var gameTool;
(function (gameTool) {
    /**
     * 获取显示对象的base64
     * @param {egret.DisplayObject} obj
     * @returns {string}
     */
    function renderTexture(obj) {
        var rt = new egret.RenderTexture();
        var rect = new egret.Rectangle(0, 0, obj.width, obj.height);
        rt.drawToTexture(obj, rect);
        var base64 = rt.toDataURL("image/png");
        return base64;
    }
    gameTool.renderTexture = renderTexture;
    var display = (function () {
        function display() {
        }
        /**
         * 设置显示对象的相对描点
         * @param disObj 需要设置描点的显示对象
         * @param anchorX X轴相对描点
         * @param anchorY Y轴相对描点
         */
        display.setAnchor = function (disObj, anchorX, anchorY) {
            if (anchorY === void 0) { anchorY = anchorX; }
            disObj.anchorOffsetX = disObj.width * anchorX;
            disObj.anchorOffsetY = disObj.height * anchorY;
        };
        Object.defineProperty(display, "stageW", {
            get: function () {
                return gameTool.stage.stageWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(display, "stageH", {
            get: function () {
                return gameTool.stage.stageHeight;
            },
            enumerable: true,
            configurable: true
        });
        display.pointInScreen = function (targetObj, x, y) {
            var p = targetObj.localToGlobal(x, y);
            return (p.x > 0 &&
                p.y > 0 &&
                p.x < this.stageW &&
                p.y < this.stageH);
        };
        display.inScreen = function (displayObj) {
            var bounds = displayObj.getTransformedBounds(gameTool.stage);
            var w = this.stageW;
            var h = this.stageH;
            return (bounds.x >= -bounds.width &&
                bounds.x <= w &&
                bounds.y >= -bounds.height &&
                bounds.y <= h);
        };
        display.setFullDisplay = function (display) {
            display.width = this.stageW;
            display.height = this.stageH;
        };
        display.getStagePosition = function (anchorX, anchorY) {
            if (anchorY === void 0) { anchorY = anchorX; }
            var x = this.stageW * anchorX;
            var y = this.stageH * anchorY;
            return { x: x, y: y };
        };
        display.setPositionFromStage = function (obj, anchorX, anchorY) {
            if (anchorX === void 0) { anchorX = 0.5; }
            if (anchorY === void 0) { anchorY = anchorX; }
            var pos = this.getStagePosition(anchorX, anchorY);
            obj.x = pos.x;
            obj.y = pos.y;
        };
        display.sort = function (container) {
            var count = container.numChildren;
            var children = [];
            for (var i = 0; i < count; i++) {
                children.push(container.getChildAt(i));
            }
            children.sort(function (a, b) {
                return a.y - b.y;
            });
            children.forEach(function (v, idx) {
                container.setChildIndex(v, idx);
            });
        };
        display.findTypeParent = function (display, type) {
            var parent = display.parent;
            while (parent) {
                if (parent instanceof type) {
                    return parent;
                }
                parent = parent.parent;
            }
            return null;
        };
        /**
         * 移除容器中的所有子显示对象
         * @param container 需要移除子显示对象的容器
         */
        display.removeAllChildren = function (container) {
            while (container.numChildren > 0) {
                container.removeChildAt(0);
            }
        };
        /**
         * 将源显示对象中的位置转换成目标对象中的位置
         * @param x 源显示对象x轴
         * @param y 源显示对象y轴
         * @param source 源显示对象
         * @param dist 目标显示对象
         * @returns {egret.Point}
         */
        display.localTolocal = function (x, y, source, dist, p) {
            if (p === void 0) { p = new egret.Point(x, y); }
            p = source.localToGlobal(x, y, p);
            p = dist.globalToLocal(p.x, p.y, p);
            return p;
        };
        display.getScale = function (obj) {
            var ret = { x: obj.scaleX, y: obj.scaleY };
            while (obj.parent) {
                obj = obj.parent;
                ret.x *= obj.scaleX;
                ret.y *= obj.scaleY;
            }
            return ret;
        };
        return display;
    }());
    gameTool.display = display;
    __reflect(display.prototype, "gameTool.display");
})(gameTool || (gameTool = {}));
/**
 * Created by lxz on 2017/12/20.
 */
var gameTool;
(function (gameTool) {
    /**
     * 等先嵌入<script src="clipboard.min.js"></script>
     */
    var CopyUtil = (function () {
        function CopyUtil() {
            this._element = document.createElement("button");
            this._element.setAttribute("style", "visibility: hidden");
            document.body.appendChild(this._element);
            var data = document.createElement("h1");
            data.setAttribute("id", "copy_data");
            data.setAttribute("value", "");
            document.body.appendChild(data);
            eval("var clipboard = new Clipboard(this._element, {text: function() {return document.getElementById('copy_data').getAttribute('value');}}); \nclipboard.on('success', function(e) {console.log('success' + e);});\nclipboard.on('error', function(e) {console.log(e);});");
        }
        CopyUtil.prototype.copy = function (str) {
            this._element.focus();
            document.getElementById("copy_data").setAttribute("value", str);
            this._element.click();
        };
        return CopyUtil;
    }());
    __reflect(CopyUtil.prototype, "CopyUtil");
    var Download = (function () {
        function Download() {
            this._element = document.createElement("a");
            this._element.setAttribute("style", "visibility: hidden");
            document.body.appendChild(this._element);
        }
        Download.prototype.download = function (href, name) {
            this._element.setAttribute("href", href);
            if (name) {
                this._element.setAttribute("download", name);
            }
            this._element.click();
        };
        return Download;
    }());
    gameTool.Download = Download;
    __reflect(Download.prototype, "gameTool.Download");
    function copy(str) {
        gameTool.singleton(CopyUtil).copy(str);
    }
    gameTool.copy = copy;
    function download(href, name) {
        gameTool.singleton(Download).download(href, name);
    }
    gameTool.download = download;
})(gameTool || (gameTool = {}));
/**
 * Created by lxz on 2017/8/10.
 */
var js_tool;
(function (js_tool) {
    var jsLoader = (function () {
        function jsLoader() {
            this.importList = [];
            this.importScriptsList = [];
        }
        jsLoader.prototype.startApp = function (jscode, complete, context) {
            //console.log("startApp");
            for (var i = 0; i < jscode.length; i++) {
                jsLoader.instance().addImportScript(jscode[i]);
            }
            jsLoader.instance().preload(function () {
                complete.apply(context);
                //console.log("load all script done.")
            }, function (total, left) {
                // console.log("load script:total=" + total + "  left:" + left);
            });
        };
        jsLoader.instance = function () {
            if (!jsLoader._instance) {
                jsLoader._instance = new jsLoader();
            }
            return jsLoader._instance;
        };
        ///开始加载，脚本或者css
        ///complete: () => void,完成时回掉
        ///process: (total: number, left: number) => void，加载进度变化时回掉，总数和剩余任务数量，剩余0 就是完成了
        jsLoader.prototype.preload = function (complete, process) {
            var _this = this;
            if (process === void 0) { process = null; }
            this.totaltask = this.importList.length;
            this._process = process;
            this._complete = complete;
            requestAnimationFrame(function () {
                if (_this.importList.length > 0) {
                    _this.startLoadScript(null);
                }
                else {
                    _this.onAllLoadComplete();
                }
            });
        };
        /**
         * 卸载掉
         * @param complete
         * @param process
         */
        jsLoader.prototype.reload = function (complete, process) {
            if (process === void 0) { process = null; }
            //for (let i = 0; i < this.importScriptsList.length; i++)
            //{
            //    this.importList.push(this.importScriptsList[i].src);
            //    this.importScriptsList[i].remove();
            //}
            for (var i = document.head.childNodes.length - 1; i >= 0; i--) {
                var _node = document.head.childNodes[i];
                if (_node instanceof HTMLScriptElement) {
                    this.importList.push(_node.src);
                    _node.remove();
                }
            }
            this.preload(complete, process);
        };
        jsLoader.prototype.addImportScript = function (path) {
            this.importList.push(path);
        };
        /******************************************************************/
        jsLoader.getXHR = function () {
            var xhr = null;
            if (window["XMLHttpRequest"]) {
                xhr = new window["XMLHttpRequest"]();
            }
            else {
                xhr = new ActiveXObject("MSXML2.XMLHTTP");
            }
            return xhr;
        };
        jsLoader.prototype.onAllLoadComplete = function () {
            if (this._process) {
                this._process(this.totaltask, 0);
            }
            if (this._complete) {
                this.importList = [];
                this._complete();
            }
        };
        jsLoader.prototype.startLoadScript = function (e) {
            var _this = this;
            if (this._process) {
                this._process(this.totaltask, this.importList.length);
            }
            if (this.importList.length > 0) {
                var s = this.importList.shift();
                if (s.toLowerCase().indexOf(".js") >= 0) {
                    var script = document.createElement("script");
                    script.src = s;
                    script.onload = function (e) { return _this.startLoadScript(e); };
                    script.onerror = function (e) { return _this.loadScriptError(e); };
                    document.head.appendChild(script);
                    this.importScriptsList.push(script);
                }
                else if (s.toLowerCase().indexOf(".css") >= 0) {
                    var link = document.createElement("link");
                    link.rel = "stylesheet";
                    link.href = s;
                    link.onload = function (e) { return _this.startLoadScript(e); };
                    link.onerror = function (e) { return _this.loadScriptError(e); };
                    document.head.appendChild(link);
                }
            }
            else {
                //console.log(document.head);
                //console.log("all complete");
                this.onAllLoadComplete();
            }
        };
        jsLoader.prototype.loadScriptError = function (e) {
            var error = "load Script Error \r\n no file:" + e.srcElement.src;
            alert(error);
            this.startLoadScript(null);
        };
        return jsLoader;
    }());
    js_tool.jsLoader = jsLoader;
    __reflect(jsLoader.prototype, "js_tool.jsLoader");
    function startApp(jscode, complete, context) {
        jsLoader.instance().startApp(jscode, complete, context);
    }
    js_tool.startApp = startApp;
    ///开始加载，脚本或者css
    ///complete: () => void,完成时回掉
    ///process: (total: number, left: number) => void，加载进度变化时回掉，总数和剩余任务数量，剩余0 就是完成了
    function preload(complete, process) {
        if (process === void 0) { process = null; }
        jsLoader.instance().preload(complete, process);
    }
    js_tool.preload = preload;
})(js_tool || (js_tool = {}));
/**
 * 循环计时器
 */
var tick;
(function (tick) {
    var Loop = (function () {
        function Loop(delay) {
            this._time = 0;
            this._ticks = {};
            this._removeTicks = {};
            this._timer = new gameTool.CustomTimer(delay);
            this._timer.setRunCall(this.onTicker, this);
        }
        Loop.prototype.dispose = function () {
            this._timer.reset();
            this._timer = null;
            this._ticks = null;
            this._removeTicks = null;
        };
        /* 开始进程运作*/
        Loop.prototype.start = function (delay) {
            if (delay) {
                this._timer.delay = delay;
            }
            this._timer.restart();
        };
        /* 停止进程运作*/
        Loop.prototype.stop = function () {
            this._timer.reset();
        };
        Loop.prototype.startTick = function (fun, context) {
            var id = gameTool.getTypeId(context);
            var info = gameTool.poolList.getInstance(FunctionInfo);
            info.context = context;
            info.fun = fun;
            info.sleep = false;
            if (this._ticks.hasOwnProperty(id)) {
                mathTool.addValueByArray(info, this._ticks[id]);
            }
            else {
                this._ticks[id] = [info];
            }
        };
        Loop.prototype.stopTick = function (fun, context) {
            var id = gameTool.getTypeId(context);
            var arr = this._ticks[id];
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i].fun == fun) {
                    arr[i].sleep = true;
                    this.getRemoveTicks(id).push(arr[i]);
                    return;
                }
            }
        };
        Loop.prototype.stopTickByContext = function (context) {
            var id = gameTool.getTypeId(context);
            var arr = this._ticks[id];
            if (arr == null) {
                return;
            }
            var len = arr.length;
            var removes = this.getRemoveTicks(id);
            for (var i = 0; i < len; i++) {
                arr[i].sleep = true;
                removes.push(arr[i]);
            }
        };
        /************************************************************************************************************************/
        Loop.prototype.onTicker = function () {
            var time = egret.getTimer();
            if (this._time == 0) {
                this._time = time;
                return;
            }
            var interval = time - this._time;
            for (var id in this._ticks) {
                var arr = this._ticks[id];
                var len = arr.length;
                for (var i = 0; i < len; i++) {
                    arr[i].args = [interval];
                    arr[i].call();
                }
            }
            this.removeTicks();
            this._time = time;
            return false;
        };
        Loop.prototype.getRemoveTicks = function (id) {
            if (this._removeTicks[id] == null) {
                this._removeTicks[id] = [];
            }
            return this._removeTicks[id];
        };
        Loop.prototype.removeTicks = function () {
            for (var id in this._removeTicks) {
                var arr = this._removeTicks[id];
                var len = arr.length;
                var infos = this._ticks[id];
                for (var i = 0; i < len; i++) {
                    gameTool.poolList.remove(arr[i]);
                    mathTool.cutValueByArray(arr[i], infos);
                }
                if (infos.length == 0) {
                    this._ticks[id] = null;
                    delete this._ticks[id];
                }
            }
            this._removeTicks = {};
        };
        return Loop;
    }());
    tick.Loop = Loop;
    __reflect(Loop.prototype, "tick.Loop");
})(tick || (tick = {}));
/**
 * Created by lxz on 2017/10/19.
 */
var map;
(function (map) {
    /**
     * mapinfo的data管理
     */
    var MapData = (function () {
        function MapData(keys) {
            this._keys = [];
            this._keys = keys;
        }
        MapData.prototype.dispose = function () {
            this._keys = null;
            this._map = null;
            this._info = null;
        };
        MapData.prototype.setValue = function (pro, value) {
            var b = this._keys.indexOf(pro) > -1;
            if (b) {
                this._map.removeByPro(this, pro);
            }
            this._info[pro] = value;
            if (b) {
                this._map.addByPro(this, pro);
            }
            return this;
        };
        Object.defineProperty(MapData.prototype, "info", {
            /******************************************************************/
            get: function () {
                return this._info;
            },
            set: function (value) {
                this._info = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapData.prototype, "map", {
            set: function (value) {
                this._map = value;
            },
            enumerable: true,
            configurable: true
        });
        return MapData;
    }());
    map.MapData = MapData;
    __reflect(MapData.prototype, "map.MapData");
    /******************************************************************/
    /******************************************************************/
    /******************************************************************/
    /*
     用法
     let mapList = new map.MapList<Info>(Info , ["id","name" , "value"]);
     mapList.getNewMapData();
     mapList.getNewMapData().setValue("id" , 2);
     mapList.getNewMapData().setValue("id" , 3).setValue("name" , "aaa");
     mapList.getNewMapData().setValue("value" , 100);

     console.log(mapList.length);
     console.log(mapList.getMapDataByPro("id",2));
     console.log(mapList.getMapDatas("id",1));
     console.log(mapList.getMapDataByPro("name","aaa"));

     class Info implements face.IMapInfo{
     id: number = 1;
     name: string = "xxx";
     value: number = 1;
     }
     */
    var MapList = (function () {
        /**
         * 指定数据的map列表(列表包含数据列表。可指定info键值获取一个map。map根据键值对应的值指向一个数据列表)
         * @param infoClass     数据类
         * @param keys          对应的value值需要初始化
         */
        function MapList(infoClass, keys) {
            this._mapList = {};
            this._infoClass = infoClass;
            this._mapList.__map_list = [];
            this._keys = keys;
        }
        MapList.prototype.dispose = function () {
            for (var i = 0; i < this.length; i++) {
                this.getMapData(i).dispose();
            }
            this._mapList = null;
            this._infoClass = null;
            this._keys = null;
        };
        /**
         * 获取一个新的数据(变动的值要使用data的setValue赋值)
         */
        MapList.prototype.getNewMapData = function () {
            var data = new MapData(this._keys);
            data.info = new this._infoClass;
            data.map = this;
            this.add(data);
            return data;
        };
        /**
         * 添加map一个值
         */
        MapList.prototype.add = function (o) {
            mathTool.addValueByArray(o, this._mapList.__map_list);
            var len = this._keys.length;
            for (var i = 0; i < len; i++) {
                if (definiton.hasProperty(o.info, this._keys[i])) {
                    this.addByPro(o, this._keys[i]);
                }
                else {
                    trace.error("规定的类型与key映射有问题或未初始化" + this._keys[i]);
                }
            }
        };
        /**
         * 移除map一个值
         */
        MapList.prototype.remove = function (o) {
            mathTool.cutValueByArray(o, this._mapList.__map_list);
            var len = this._keys.length;
            for (var i = 0; i < len; i++) {
                if (definiton.hasProperty(o.info, this._keys[i])) {
                    this.removeByPro(o, this._keys[i]);
                }
                else {
                    trace.error("规定的类型与key映射有问题或未初始化" + this._keys[i]);
                }
            }
        };
        MapList.prototype.addByPro = function (o, pro) {
            if (!definiton.hasProperty(this._mapList, pro)) {
                this._mapList[pro] = {};
            }
            var value = o.info[pro];
            if (value == null) {
                return;
            }
            var key = this.getValueKey(value);
            if (!definiton.hasProperty(this._mapList[pro], key)) {
                this._mapList[pro][key] = [];
            }
            mathTool.addValueByArray(o, this._mapList[pro][key]);
        };
        MapList.prototype.removeByPro = function (o, pro) {
            if (definiton.hasProperty(this._mapList, pro)) {
                var value = o.info[pro];
                if (value == null) {
                    return;
                }
                var key = this.getValueKey(value);
                if (definiton.hasProperty(this._mapList[pro], key)) {
                    mathTool.cutValueByArray(o, this._mapList[pro][key]);
                }
            }
        };
        /**
         * 根据索引获取数据
         */
        MapList.prototype.getMapData = function (index) {
            return this._mapList.__map_list[index];
        };
        /**
         * 获取指定数据列表
         */
        MapList.prototype.getMapDatas = function (pro, value) {
            var key = this.getValueKey(value);
            return this._mapList[pro][key];
        };
        /**
         * 获取指定数据
         */
        MapList.prototype.getMapDataByPro = function (pro, value) {
            var key = this.getValueKey(value);
            var list = this._mapList[pro][key];
            if (list && list.length > 0) {
                return list[0];
            }
            return null;
        };
        /******************************************************************/
        MapList.prototype.getValueKey = function (value) {
            switch (typeof value) {
                case "string":
                    return value;
                case "boolean":
                    return value ? "1" : "0";
                case "number":
                    return value.toString();
                default:
                    return gameTool.getTypeId(value);
            }
        };
        Object.defineProperty(MapList.prototype, "length", {
            /******************************************************************/
            /**
             * 获取数据长度
             */
            get: function () {
                return this._mapList.__map_list.length;
            },
            enumerable: true,
            configurable: true
        });
        return MapList;
    }());
    map.MapList = MapList;
    __reflect(MapList.prototype, "map.MapList");
})(map || (map = {}));
/**
 *
 * @author
 *
 */
var mathTool;
(function (mathTool) {
    /**
     *  根据限制内对数字上下取整
     */
    function getValueByLimit(value, limit) {
        if (limit === void 0) { limit = .1; }
        var n = value % 1;
        var min = .5 - limit;
        var max = .5 + limit;
        return (n >> 0) + ((n > min && n < max) ? 1 : 0);
    }
    mathTool.getValueByLimit = getValueByLimit;
    /**
     * 高斯函数
     * 高斯函数的图形在形状上像一个倒悬着的钟。a是曲线的高度，b是曲线中心线在x轴的偏移，c是半峰宽度（函数峰值一半处相距的宽度）。
     */
    function gaussian(dist, a, b, c) {
        if (a === void 0) { a = 1; }
        if (b === void 0) { b = 0; }
        if (c === void 0) { c = 10; }
        return a * Math.pow(Math.E, -(dist - b) * (dist - b) / (2 * c * c));
    }
    mathTool.gaussian = gaussian;
    /**
     * 求和
     */
    function sum(arr, propertyName) {
        var n = 0;
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            n += parseNumber(propertyName ? arr[i][propertyName] : arr[i]);
        }
        return n;
    }
    mathTool.sum = sum;
    /**
     * 获取number
     */
    function parseNumber(num) {
        if (typeof num == "string") {
            return isNaN(parseFloat(num)) ? 0 : parseFloat(num);
        }
        return num;
    }
    mathTool.parseNumber = parseNumber;
    /**
     * 两个数组是否相等
     */
    function equalArray(array1, array2) {
        if (array1.length != array2.length) {
            return false;
        }
        var len = array1.length;
        for (var i = 0; i < len; i++) {
            if (array2.indexOf(array1[i]) == -1) {
                return false;
            }
        }
        return true;
    }
    mathTool.equalArray = equalArray;
    /**
     * 打乱数组
     */
    function shuffle(array) {
        return array.sort(function () {
            var r = Math.random();
            return r > 0.5 ? 1 : -1;
        });
    }
    mathTool.shuffle = shuffle;
    /**
     * 返回数组里的某个字段对应值得索引
     */
    function indexOfMap(arr, propertyName, value) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (arr[i][propertyName] == value) {
                return i;
            }
        }
        return -1;
    }
    mathTool.indexOfMap = indexOfMap;
    /**
     * 返回数组里的某个字段的列表
     */
    function pluck(arr, propertyName) {
        return arr.map(function (item) {
            return item[propertyName];
        });
    }
    mathTool.pluck = pluck;
    /**
     * 返回数组里符合方法判定的item
     */
    function find(arr, fun, context) {
        if (context === void 0) { context = null; }
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (fun && fun.call(context, item, i)) {
                return item;
            }
        }
        return null;
    }
    mathTool.find = find;
    /**
     * 返回数组里符合方法判定的item列表
     */
    function findList(arr, fun, context) {
        if (context === void 0) { context = null; }
        var list = [];
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (fun && fun.call(context, item, i)) {
                list.push(item);
            }
        }
        return list;
    }
    mathTool.findList = findList;
    /**
     *  筛选数组里item与obj相等的item列表
     */
    function where(arr, obj) {
        var keys = Object.keys(obj);
        var ret = [];
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            var ok = keys.every(function (k) {
                return item[k] == obj[k];
            });
            if (ok) {
                ret.push(item);
            }
        }
        return ret;
    }
    mathTool.where = where;
    /**
     *  筛选数组里item与obj相等的item
     */
    function findWhere(arr, obj) {
        var items = mathTool.where(arr, obj);
        if (items.length > 0) {
            return items[0];
        }
        return null;
    }
    mathTool.findWhere = findWhere;
    /**
     * 判断arr里是否有符合obj的item
     */
    function contains(arr, obj) {
        if (!arr || arr.length == 0) {
            return false;
        }
        if (definiton.getClassNameByObject(obj) == definiton.getNameByClass(arr[0])) {
            var idx = arr.indexOf(obj);
            if (idx > -1) {
                return true;
            }
        }
        else {
            var fun = obj;
            var some = arr.some(fun);
            return some;
        }
        return false;
    }
    mathTool.contains = contains;
    /*两点距离*/
    function distance(x1, y1, x2, y2) {
        var dx = x1 - x2;
        var dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }
    mathTool.distance = distance;
    /*随机布尔值*/
    function getBoolean() {
        return (Math.random() >= .5) ? true : false;
    }
    mathTool.getBoolean = getBoolean;
    /*弧度值转为角度值*/
    function radianToAngle(num) {
        return num * 180 / Math.PI;
    }
    mathTool.radianToAngle = radianToAngle;
    /*角度值转为弧度值*/
    function angleToRadian(num) {
        return num * Math.PI / 180;
    }
    mathTool.angleToRadian = angleToRadian;
    /*减去数组的某个值*/
    function cutValueByArray(value, arr) {
        var index = arr.indexOf(value);
        if (index != -1) {
            arr.splice(index, 1);
            return true;
        }
        return false;
    }
    mathTool.cutValueByArray = cutValueByArray;
    /*加进去数组的某个值*/
    function addValueByArray(value, arr) {
        var index = arr.indexOf(value);
        if (index == -1) {
            arr["push"](value);
            return true;
        }
        return false;
    }
    mathTool.addValueByArray = addValueByArray;
    /*随机数组不同的值(会改变数组)*/
    function getArrayRandom(arr) {
        return arr.splice((Math.random() * arr.length) >> 0, 1)[0];
    }
    mathTool.getArrayRandom = getArrayRandom;
    /*随机数组不同的值(不会改变数组)*/
    function getArrayRandomValue(arr) {
        return arr[(Math.random() * arr.length) >> 0];
    }
    mathTool.getArrayRandomValue = getArrayRandomValue;
    /*返回两个值中间的值*/
    function randomValue(value1, value2) {
        return Math.random() * (value2 - value1) + value1;
    }
    mathTool.randomValue = randomValue;
    /*返回一个打乱过后的数组(会改变原先的数组顺序)*/
    function randomArray(arr) {
        arr.sort(randomSort);
        return arr;
    }
    mathTool.randomArray = randomArray;
    /*返回一个打乱过后的数组(不会改变原先的数组顺序)*/
    function randomArrayCopy(arr) {
        var list = getArrCopy(arr);
        list.sort(randomSort);
        return list;
    }
    mathTool.randomArrayCopy = randomArrayCopy;
    /**
     * 复制数组
     */
    function getArrCopy(arr) {
        var curArr = [];
        for (var i = 0; i < arr.length; i++) {
            curArr.push(arr[i]);
        }
        return curArr;
    }
    mathTool.getArrCopy = getArrCopy;
    /*加减某个值的增量
     * value		要计算的值
     * limit		临界值
     * interval		差值
     * isAdd		加减
     */
    function handlerMath(value, limit, interval, isAdd) {
        var pointer = isAdd ? 1 : -1;
        if (value * pointer < limit * pointer) {
            value += interval * pointer;
        }
        else {
            value = limit;
        }
        return value;
    }
    mathTool.handlerMath = handlerMath;
    /*
     * 随机数组里面概率的索引值(即数组里载着各个概率值)
     */
    function randomRateValue(arr, base) {
        if (base === void 0) { base = 10000; }
        var temp = Math.random() * base;
        var len = arr.length;
        var i = 0;
        for (i = 0; i < len; i++) {
            if (temp < arr[i]) {
                return i;
            }
            else {
                temp -= arr[i];
            }
        }
        return -1;
    }
    mathTool.randomRateValue = randomRateValue;
    /*
     * 自动随机数组里面概率的索引值(即数组里载着各个概率值)
     */
    function autoRandomRateValue(arr) {
        var len = arr.length;
        var i = 0;
        var base = 0;
        for (i = 0; i < len; i++) {
            base += arr[i];
        }
        var temp = Math.random() * base;
        for (i = 0; i < len; i++) {
            if (temp < arr[i]) {
                return i;
            }
            else {
                temp -= arr[i];
            }
        }
        return -1;
    }
    mathTool.autoRandomRateValue = autoRandomRateValue;
    /*返回单个概率是否中了 基数10000*/
    function getAtaru(value) {
        return randomValue(1, 10000) < value;
    }
    mathTool.getAtaru = getAtaru;
    /* 随机一个平均概率的值*/
    function getMeanNum(num) {
        var mean = 1 / num;
        var temp = Math.ceil(Math.random() / mean);
        return 0 == temp ? 1 : temp;
    }
    mathTool.getMeanNum = getMeanNum;
    function randomSort(a, b) {
        return getBoolean() ? 1 : -1;
    }
    mathTool.randomSort = randomSort;
    /**
     * 从数组中取n个数有多少种组合
     * @param arr       原始数组：int *arr
     * @param start     遍历的起始位置：int start
     * @param result    另一个存放下标的数组：int *result
     * @param index     数组result中的索引：int index(其实就是下一步要从数组里挑选几个数的意思)
     * @param n         取多少个数：int n
     * @param arr_len   原始数组的长度：int arr_len
     */
    function combineArrayByNum(arr, start, result, index, arr_len, combine, context) {
        for (var ct = start; ct < arr_len - index + 1; ct++) {
            result[index - 1] = ct;
            if (index - 1 == 0) {
                var len = result.length;
                var arrCopy = [];
                for (var i = 0; i < len; i++) {
                    arrCopy.push(arr[result[i]]);
                }
                combine.apply(context, [arrCopy]);
            }
            else {
                combineArrayByNum(arr, ct + 1, result, index - 1, arr_len, combine, context);
            }
        }
    }
    mathTool.combineArrayByNum = combineArrayByNum;
})(mathTool || (mathTool = {}));
/**
 * Created by lxz on 2017/9/7.
 */
var objTool;
(function (objTool) {
    /**
     *  获取对象的属性值
     *  没有该属性值时返回默认值
     */
    function getValueByObjectKey(obj, key, defalut) {
        return obj && obj[key] ? obj[key] : defalut;
    }
    objTool.getValueByObjectKey = getValueByObjectKey;
    /**
     * 是否相等
     */
    function hasSameObj(item, obj) {
        var keys = Object.keys(obj);
        return keys.every(function (k) {
            return item[k] == obj[k];
        });
    }
    objTool.hasSameObj = hasSameObj;
    /**
     * 是否拥有obj的属性
     */
    function hasObjProperty(item, obj) {
        var keys = Object.keys(obj);
        return keys.every(function (k) {
            return definiton.hasProperty(item, k);
        });
    }
    objTool.hasObjProperty = hasObjProperty;
    /**
     * 映射赋值
     * dynamic 是否为item动态添加属性
     */
    function mapObjProperty(item, obj, dynamic) {
        if (dynamic === void 0) { dynamic = false; }
        for (var key in obj) {
            if (dynamic) {
                item[key] = obj[key];
            }
            else {
                mapSingleProperty(item, obj, key);
            }
        }
        return item;
    }
    objTool.mapObjProperty = mapObjProperty;
    /**
     * 映射赋值
     * dynamic 是否为item动态添加属性
     */
    function mapObjPropertyToNew(itemClass, obj, dynamic) {
        if (dynamic === void 0) { dynamic = false; }
        var item = new itemClass;
        mapObjProperty(item, obj, dynamic);
        return item;
    }
    objTool.mapObjPropertyToNew = mapObjPropertyToNew;
    function mapSingleProperty(item, obj, key) {
        if (definiton.hasProperty(item, key)) {
            if (typeof item[key] == "number" && typeof obj[key] == "string") {
                item[key] = mathTool.parseNumber(obj[key]);
            }
            else {
                item[key] = obj[key];
            }
        }
    }
    objTool.mapSingleProperty = mapSingleProperty;
})(objTool || (objTool = {}));
/**
 * 伪随机数工具
 * Created by wjr on 16/4/23.
 */
var RandomUtil = (function () {
    function RandomUtil() {
    }
    /**
     * 获取一个伪随机数
     * @param seed  随机种子(固定的种子得到固定的数据)
     * @param index 最忌索引(需要第几个随机数)
     *  @param m     随机周期(必须是一个素数)
     */
    RandomUtil.getRandom = function (seed, index, m) {
        if (m === void 0) { m = RandomUtil.M; }
        var d = 5; //指数可以是一个任意的素数(ps:d值越大,随机分布越平均,但是过大的指数较容易导致计算值溢出)
        var random = (seed + Math.pow(index, d)) % m;
        return random;
    };
    /**
     * 获取一个伪随机数
     * @param seed  随机种子
     * @param index 最忌索引(需要第几个随机数)
     * @param m     随机周期(必须是一个素数)
     */
    RandomUtil.getRandomRate = function (seed, index, m) {
        if (m === void 0) { m = RandomUtil.M; }
        var random = RandomUtil.getRandom(seed, index, m);
        var rate = random / m;
        return rate;
    };
    /**
     * 获取指定数量指定范围的随机数
     * @param seed  随机种子
     * @param m     随机因子(必须是素数)
     * @param num   随机数的数量
     * @param max   随机数的最大值
     * @returns {Array<number>}
     */
    RandomUtil.getRandomNum = function (seed, m, num, max, min, except) {
        if (min === void 0) { min = 0; }
        if (except === void 0) { except = -1; }
        var list = [];
        if (num == 0)
            return [];
        var count = 0;
        var index = 1;
        while (true) {
            // console.log("RandomUtil-getRandomNum");
            var random = RandomUtil.getRandom(seed, index, m);
            if (random <= max && random >= min && random != except && list.indexOf(random) == -1) {
                list.push(random);
                count++;
                // this.check(list);
            }
            index++;
            if (count == num)
                break;
        }
        return list;
    };
    /**
     * 获取指定数量的素数
     * @param num1 起始个数
     * @param num2 终止个数
     */
    RandomUtil.getPrime = function (num1, num2) {
        var primeList = [];
        var prime = 1;
        while (true) {
            var isPrime = true;
            for (var i = 2; i < prime; i++) {
                if (prime % i == 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime)
                primeList.push(prime);
            prime++;
            if (primeList.length >= num2) {
                return primeList.splice(num1, num2 - num1);
            }
        }
    };
    RandomUtil.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    //第十万个素数
    RandomUtil.M = 1299689;
    return RandomUtil;
}());
__reflect(RandomUtil.prototype, "RandomUtil");
var sound;
(function (sound) {
    var singleton = gameTool.singleton;
    /**
     *
     */
    /**
     * 播放特效音乐
     */
    function playSound(res, volume) {
        var effect = RES.getRes(res);
        effect.type = egret.Sound.EFFECT;
        var channel = effect.play(0, 1);
        channel.volume = volume ? volume : .5;
        // effect.play(0,1);
    }
    sound.playSound = playSound;
    /**
     * 背景音乐是否开着
     */
    function isMusicOpen() {
        return singleton(SoundManager).isMusicOpen();
    }
    sound.isMusicOpen = isMusicOpen;
    /**
     * 特效音乐是否开着
     */
    function isEffectOpen() {
        return singleton(SoundManager).isEffectOpen();
    }
    sound.isEffectOpen = isEffectOpen;
    /**
     * 背景音乐开关切换
     */
    function switchMusic() {
        singleton(SoundManager).switchMusic();
    }
    sound.switchMusic = switchMusic;
    /**
     * 特效音乐开关切换
     */
    function switchEffect() {
        singleton(SoundManager).switchEffect();
    }
    sound.switchEffect = switchEffect;
    /**
     * 播放特效音乐
     */
    function playEffect(res, volume) {
        singleton(SoundManager).playEffect(res, volume);
    }
    sound.playEffect = playEffect;
    /**
     * 播放背景音乐
     */
    function playBGM(name) {
        singleton(SoundManager).playBGM(name);
    }
    sound.playBGM = playBGM;
    /**
     * 暂停背景音乐
     */
    function pauseBGM() {
        singleton(SoundManager).pauseBGM();
    }
    sound.pauseBGM = pauseBGM;
    /**
     * 继续背景音乐
     */
    function resumeBGM() {
        singleton(SoundManager).resumeBGM();
    }
    sound.resumeBGM = resumeBGM;
    var SoundManager = (function () {
        function SoundManager() {
            /**
             * 背景音乐音量
             */
            this.volume = 0.45;
            this._lastMusic = "";
        }
        SoundManager.prototype.init = function (stage) {
            if (!egret.localStorage.getItem("music")) {
                this.switchMusic();
            }
            if (!egret.localStorage.getItem("effect")) {
                this.switchEffect();
            }
            stage.addEventListener(egret.Event.DEACTIVATE, this.onBlur, this);
            stage.addEventListener(egret.Event.ACTIVATE, this.onFocus, this);
        };
        /******************************************************************/
        /**
         * 背景音乐是否开着
         */
        SoundManager.prototype.isMusicOpen = function () {
            return egret.localStorage.getItem("music") == "1";
        };
        /**
         * 特效音乐是否开着
         */
        SoundManager.prototype.isEffectOpen = function () {
            return egret.localStorage.getItem("effect") == "1";
        };
        /**
         * 背景音乐开关切换
         */
        SoundManager.prototype.switchMusic = function () {
            if (this.isMusicOpen()) {
                egret.localStorage.setItem("music", "2");
            }
            else {
                egret.localStorage.setItem("music", "1");
            }
        };
        /**
         * 特效音乐开关切换
         */
        SoundManager.prototype.switchEffect = function () {
            if (this.isEffectOpen()) {
                egret.localStorage.setItem("effect", "2");
            }
            else {
                egret.localStorage.setItem("effect", "1");
            }
        };
        /**
         * 播放特效音乐
         */
        SoundManager.prototype.playEffect = function (res, volume) {
            if (!this.isEffectOpen()) {
                return;
            }
            // RES.getResAsync(res, ()=> {
            var effect = RES.getRes(res);
            effect.type = egret.Sound.EFFECT;
            var channel = effect.play(0, 1);
            channel.volume = volume ? volume : this.volume;
            // }, this);
        };
        /**
         * 播放背景音乐
         */
        SoundManager.prototype.playBGM = function (name) {
            if (this._lastMusic == name) {
                return;
            }
            this.disposeSound();
            this._lastMusic = name;
            this.playMusic();
        };
        /**
         * 暂停背景音乐
         */
        SoundManager.prototype.pauseBGM = function () {
            if (this.isMusicOpen()) {
                if (this._soundChannel && !this._soundChannel["isStopped"]) {
                    this._soundChannel.volume = 0;
                }
            }
        };
        /**
         * 继续背景音乐
         */
        SoundManager.prototype.resumeBGM = function () {
            if (this.isMusicOpen()) {
                if (this._soundChannel && !this._soundChannel["isStopped"]) {
                    this._soundChannel.volume = this.volume;
                }
            }
        };
        /**
         * 释放音乐资源
         */
        SoundManager.prototype.disposeSound = function () {
            if (this._soundChannel) {
                this._soundChannel.stop();
                this._soundChannel = null;
            }
            if (this._sound) {
                this._sound.removeEventListener(egret.Event.COMPLETE, this.soundLoaded, this);
            }
        };
        /******************************************************************/
        SoundManager.prototype.onBlur = function () {
            this.pauseBGM();
        };
        SoundManager.prototype.onFocus = function () {
            this.resumeBGM();
        };
        SoundManager.prototype.playMusic = function () {
            if (!this.isMusicOpen()) {
                return;
            }
            RES.getResAsync(this._lastMusic, this.soundLoaded, this);
        };
        SoundManager.prototype.soundLoaded = function () {
            if (!this.isMusicOpen()) {
                return;
            }
            this._sound = RES.getRes(this._lastMusic);
            this._sound.type = egret.Sound.MUSIC;
            this._soundChannel = this._sound.play(0, -1);
            this._soundChannel.volume = this.volume;
        };
        return SoundManager;
    }());
    sound.SoundManager = SoundManager;
    __reflect(SoundManager.prototype, "sound.SoundManager");
})(sound || (sound = {}));
/**
 * Created by lxz on 2017/8/22.
 */
var tick;
(function (tick) {
    tick.running = false;
    var TickManager = (function () {
        function TickManager() {
            this._time = 0;
            this._ticks = {};
            this._removeTicks = {};
        }
        /* 开始进程运作*/
        TickManager.prototype.start = function () {
            egret.startTick(this.onTicker, this);
            tick.running = true;
        };
        /* 停止进程运作*/
        TickManager.prototype.stop = function () {
            egret.stopTick(this.onTicker, this);
            tick.running = false;
        };
        TickManager.prototype.startTick = function (fun, context) {
            var id = gameTool.getTypeId(context);
            var info = gameTool.poolList.getInstance(FunctionInfo);
            info.context = context;
            info.fun = fun;
            info.sleep = false;
            if (this._ticks.hasOwnProperty(id)) {
                mathTool.addValueByArray(info, this._ticks[id]);
            }
            else {
                this._ticks[id] = [info];
            }
        };
        TickManager.prototype.stopTick = function (fun, context) {
            var id = gameTool.getTypeId(context);
            var arr = this._ticks[id];
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i].fun == fun) {
                    arr[i].sleep = true;
                    this.getRemoveTicks(id).push(arr[i]);
                    return;
                }
            }
        };
        TickManager.prototype.stopTickByContext = function (context) {
            var id = gameTool.getTypeId(context);
            var arr = this._ticks[id];
            if (arr == null) {
                return;
            }
            var len = arr.length;
            var removes = this.getRemoveTicks(id);
            for (var i = 0; i < len; i++) {
                arr[i].sleep = true;
                removes.push(arr[i]);
            }
        };
        /************************************************************************************************************************/
        TickManager.prototype.onTicker = function (time) {
            if (this._time == 0) {
                this._time = time;
                return;
            }
            var interval = time - this._time;
            for (var id in this._ticks) {
                var arr = this._ticks[id];
                var len = arr.length;
                for (var i = 0; i < len; i++) {
                    arr[i].args = [interval];
                    arr[i].call();
                }
            }
            this.removeTicks();
            this._time = time;
            return false;
        };
        TickManager.prototype.getRemoveTicks = function (id) {
            if (this._removeTicks[id] == null) {
                this._removeTicks[id] = [];
            }
            return this._removeTicks[id];
        };
        TickManager.prototype.removeTicks = function () {
            for (var id in this._removeTicks) {
                var arr = this._removeTicks[id];
                var len = arr.length;
                var infos = this._ticks[id];
                for (var i = 0; i < len; i++) {
                    gameTool.poolList.remove(arr[i]);
                    mathTool.cutValueByArray(arr[i], infos);
                }
                if (infos.length == 0) {
                    this._ticks[id] = null;
                    delete this._ticks[id];
                }
            }
            this._removeTicks = {};
        };
        return TickManager;
    }());
    tick.TickManager = TickManager;
    __reflect(TickManager.prototype, "tick.TickManager");
    /************************************************************************************************************************/
    /* 开始进程运作*/
    function start() {
        gameTool.singleton(TickManager).start();
    }
    tick.start = start;
    /* 停止进程运作*/
    function stop() {
        gameTool.singleton(TickManager).stop();
    }
    tick.stop = stop;
    function startTick(fun, context) {
        gameTool.singleton(TickManager).startTick(fun, context);
    }
    tick.startTick = startTick;
    function stopTick(fun, context) {
        gameTool.singleton(TickManager).stopTick(fun, context);
    }
    tick.stopTick = stopTick;
    function stopTickByContext(context) {
        gameTool.singleton(TickManager).stopTickByContext(context);
    }
    tick.stopTickByContext = stopTickByContext;
})(tick || (tick = {}));
/**
 * 全局消息定义
 * Created by silence on 2017/6/30.
 */
var define;
(function (define) {
    var Notice = (function () {
        function Notice() {
        }
        Notice.DATA_UPDATE = "DATA_UPDATE"; //收到后端数据，更新
        Notice.CHANGE_DATA = "CHANGE_DATA"; //数据更新，写入缓存前派发，原来缓存的数据，和新数据会传入
        Notice.OPEN_MODULE = "OPEN_MODULE"; //打开模块
        Notice.MAP_VALUE_ADD = "MAP_VALUE_ADD"; //map值添加
        Notice.MAP_VALUE_REMOVE = "MAP_VALUE_REMOVE"; //map值移除
        return Notice;
    }());
    define.Notice = Notice;
    __reflect(Notice.prototype, "define.Notice");
})(define || (define = {}));
/**
 *
 * @author
 *
 */
var trace;
(function (trace) {
    /*抛出异常*/
    function error(txt, arr) {
        if (arr === void 0) { arr = null; }
        var str = txt;
        if (arr != null) {
            var len = arr.length;
            var i = 0;
            for (i = 0; i < len; i++) {
                str += "******" + arr[i];
            }
        }
        throw new Error(str);
    }
    trace.error = error;
    /*输出到控制台*/
    function traceData(arr) {
        console.log(parseData(arr));
    }
    trace.traceData = traceData;
    function parseData(arr) {
        var str = "";
        var len = arr.length;
        var i = 0;
        for (i = 0; i < len; i++) {
            if (arr[i] instanceof Array) {
                str += "\n" + parseData(arr[i]) + "******";
            }
            else {
                str += parseObject(arr[i]) + "******";
            }
        }
        return str;
    }
    trace.parseData = parseData;
    function parseObject(obj) {
        if (obj == null) {
            return "NULL";
        }
        return obj.toString();
    }
    trace.parseObject = parseObject;
})(trace || (trace = {}));
/**
 * Created by lxz on 2017/11/2.
 */
var twwentool;
(function (twwentool) {
    /**
     * 数字滚动
     * @param textfiled
     * @param startValue
     * @param endValue
     * @param time
     * @returns {Tween}
     */
    function playNum(textfiled, endValue, time, startValue) {
        if (time === void 0) { time = 300; }
        //这里演示了一个数字变化的过程
        if (isNaN(startValue)) {
            startValue = parseInt(textfiled.text);
        }
        else {
            textfiled.text = startValue.toString();
        }
        var tweeObject = { value: startValue };
        var vars = {
            onChange: function () {
                textfiled.text = "" + Math.floor(tweeObject.value);
            },
            onChangeObj: this
        };
        return egret.Tween.get(tweeObject, vars).to({ value: endValue }, time);
    }
    twwentool.playNum = playNum;
})(twwentool || (twwentool = {}));
/**
 * Created by lxz on 2017/10/30.
 */
var config;
(function (config) {
    var BSV = (function () {
        function BSV(big) {
            if (big === void 0) { big = false; }
            this._headerList = {};
            this._posDataList = {};
            this._keyList = [];
            this._isBig = big;
        }
        BSV.prototype.getType = function (p_fieldName) {
            return this._headerList[p_fieldName];
        };
        BSV.prototype.decode = function () {
            this._items = [];
            for (var key in this._posDataList) {
                this._items.push(this.parseItem(key));
            }
        };
        BSV.prototype.getRecords = function () {
            return this._items;
        };
        BSV.prototype.parseItem = function (keyValue) {
            this._data.position = this._posDataList[keyValue];
            var flag;
            var maxFlag;
            if (this._flagBit < 5) {
                switch (this._flagBit) {
                    case 1:
                        flag = this._data.readUnsignedByte();
                        break;
                    case 2:
                        flag = this._data.readUnsignedShort();
                        break;
                    default:
                        flag = this._data.readUnsignedInt();
                        break;
                }
            }
            else {
                flag = this._data.readUnsignedInt();
                maxFlag = this._data.readUnsignedByte();
            }
            //trace.traceData(["位数:", flag, maxFlag, this._flagBit]);
            var len = this._headerTypes.length;
            var item = {};
            for (var i = 0; i < len; i++) {
                var b = void 0;
                if (i < 32) {
                    b = (Math.pow(2, i) & flag) != 0;
                }
                else {
                    b = (Math.pow(2, i - 32) & maxFlag) != 0;
                }
                if (b) {
                    switch (this._headerTypes[i]) {
                        case "int":
                            item[this._headers[i]] = this._data.readFloat();
                            //trace.traceData(["int:", item[this._headers[i]], this._headers[i]]);
                            break;
                        case "string":
                            var cl1 = this._data.readUnsignedShort();
                            item[this._headers[i]] = this._data.readUTFBytes(cl1);
                            //trace.traceData(["string:", item[this._headers[i]], this._headers[i], cl1]);
                            break;
                        default:
                            var cl2 = this._data.readUnsignedShort();
                            var str = this._data.readUTFBytes(cl2);
                            //console.log("解析数据:" + i + "--" + this._headers[i] + "--" + str + "--" + len + "--" + this._headers.length);
                            item[this._headers[i]] = str;
                            // item[this._headers[i]] = config.LuaObjUtil.parse(str);
                            break;
                    }
                }
            }
            return item;
        };
        /******************************************************************/
        /**
         * 解析数据
         */
        BSV.prototype.parseBuffer = function () {
            // 解析buffer
            var type = this._data.readUnsignedByte();
            this._headerTypes = [];
            this._headers = [];
            while (type != 0) {
                switch (type) {
                    case 1:
                        this._headerTypes.push("int");
                        break;
                    case 2:
                        this._headerTypes.push("string");
                        break;
                    default:
                        this._headerTypes.push("table");
                        break;
                }
                var len = this._data.readUnsignedByte();
                //console.log("键长度:" + len);
                var key = this._data.readUTFBytes(len);
                this._headers.push(key);
                this._headerList[key] = this._headerTypes[this._headerTypes.length - 1];
                type = this._data.readUnsignedByte();
            }
            this._flagBit = Math.floor((this._headers.length - 1) / 8) + 1;
            if (this._flagBit == 3) {
                this._flagBit = 4;
            }
            var contentlen = this._isBig ? this._data.readUnsignedInt() : this._data.readUnsignedShort();
            //console.log("内容总长度:" + contentlen);
            for (var i = 0; i < contentlen; i++) {
                var itemLen = this._data.readUnsignedShort();
                var keyValue = this._data.readUnsignedShort();
                if (this._posDataList[keyValue]) {
                    keyValue = this._keyList[this._keyList.length - 1] + 1;
                }
                this._posDataList[keyValue] = this._data.position;
                this._keyList.push(keyValue);
                //console.log("位置值:" + this._posDataList[keyValue]);
                this._data.position += itemLen;
            }
        };
        Object.defineProperty(BSV.prototype, "data", {
            /******************************************************************/
            set: function (value) {
                this._data = new egret.ByteArray(value);
                this.parseBuffer();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BSV.prototype, "keyList", {
            get: function () {
                return this._keyList;
            },
            enumerable: true,
            configurable: true
        });
        return BSV;
    }());
    config.BSV = BSV;
    __reflect(BSV.prototype, "config.BSV", ["face.IConfigParser"]);
})(config || (config = {}));
/**
 * Created by lxz on 2017/10/25.
 */
var config;
(function (config) {
    var BaseConfig = (function (_super) {
        __extends(BaseConfig, _super);
        function BaseConfig(p_typeDataClass, p_keyPropName) {
            var _this = _super.call(this) || this;
            _this.typeDataClass = p_typeDataClass;
            _this.keyPropName = p_keyPropName;
            _this.allDecoded = false;
            _this.useByteSrc = false;
            return _this;
        }
        /**
         * 获取类型数据
         */
        BaseConfig.prototype.getTypeData = function (key) {
            if (this.useByteSrc) {
                // 字节文件配置
                if (!this._dic[key]) {
                    var dataSet = this.config.parseItem(key);
                    var item;
                    if (dataSet) {
                        item = new this.typeDataClass();
                        this.transformItem(item, dataSet);
                        this._dic[key] = item;
                    }
                }
            }
            else {
                // csv文件配置
                this.parseAll();
            }
            return this._dic[key];
        };
        Object.defineProperty(BaseConfig.prototype, "dic", {
            /**
             * 获取数据集合
             */
            get: function () {
                this.parseAll();
                return this._dic;
            },
            enumerable: true,
            configurable: true
        });
        BaseConfig.prototype.parseAll = function () {
            if (this.allDecoded) {
                return;
            }
            this.config.decode();
            var dataSet = this.config.getRecords();
            var i;
            var len = dataSet.length;
            var item;
            var key;
            this._keys = [];
            for (i = 0; i < len; i++) {
                item = new this.typeDataClass();
                this.transformItem(item, dataSet[i]);
                key = this.getKeyValue(item);
                this._dic[key] = item;
                this._keys.push(key);
            }
            this.allDecoded = true;
        };
        /******************************************************************/
        BaseConfig.prototype.transformItem = function (typeData, itemData) {
            var proName;
            var type;
            for (proName in itemData) {
                type = this.config.getType(proName);
                if (type == "table") {
                    typeData[proName] = config.LuaObjUtil.parse(itemData[proName]);
                }
                else if (type == "int") {
                    typeData[proName] = isNaN(parseFloat(itemData[proName])) ? itemData[proName] : parseFloat(itemData[proName]);
                }
                else {
                    typeData[proName] = itemData[proName];
                }
            }
        };
        BaseConfig.prototype.getKeyValue = function (item) {
            if (typeof (this.keyPropName) != "string") {
                var idx;
                var len = this.keyPropName.length;
                var key = "";
                for (idx = 0; idx < len; idx++) {
                    key += item[this.keyPropName[idx]];
                    if (idx < len - 1) {
                        key += "&";
                    }
                }
                return key;
            }
            return item[this.keyPropName];
        };
        Object.defineProperty(BaseConfig.prototype, "keys", {
            /******************************************************************/
            get: function () {
                if (this.useByteSrc) {
                    return this.config.keyList;
                }
                this.parseAll();
                return this._keys;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseConfig.prototype, "dataSource", {
            /**
             * 设置数据源
             */
            set: function (value) {
                this.data = value;
                this.useByteSrc = (typeof (this.data) != "string");
                this._dic = {};
                if (this.useByteSrc) {
                    if (value["type"] == "big") {
                        this.config = new config.BSV(true);
                        this.config.data = value["data"];
                    }
                    else if (value["type"] == "compress") {
                        this.config = new config.BSV();
                        // zlib解压数据
                        var inflate = new Zlib.Inflate(new Uint8Array(value["data"]));
                        var outbuffer = inflate.decompress();
                        this.config.data = outbuffer.buffer;
                    }
                    else {
                        this.config = new config.BSV();
                        this.config.data = value;
                    }
                }
                else {
                    var csv = new config.CSV();
                    this.config = csv;
                    csv.headerLineNum = 0;
                    csv.resolveHeaderType = true;
                    this.config.data = value;
                }
                this.allDecoded = false;
            },
            enumerable: true,
            configurable: true
        });
        return BaseConfig;
    }(egret.HashObject));
    config.BaseConfig = BaseConfig;
    __reflect(BaseConfig.prototype, "config.BaseConfig");
})(config || (config = {}));
/**
 */
var config;
(function (config) {
    var CSV = (function () {
        function CSV() {
            this.HeaderTypeDic = {};
            this.fieldSeperator = ',';
            this.fieldEnclosureToken = '"';
            this.recordsetDelimiter = '\n';
            this.comment = "#";
            this.headerLineNum = 0;
            this.header = new Array();
            this.embededHeader = true;
            this.headerOverwrite = false;
            this.resolveHeaderType = false;
        }
        CSV.prototype.decode = function () {
            var count = 0;
            var result = [];
            var lineContent;
            this.data = this._data.split(this.recordsetDelimiter);
            for (var i = 0; i < this._data.length; i++) {
                lineContent = this._data[i];
                if ((count % 2) == 0) {
                    // 偶数个"符号
                    result.push(lineContent);
                }
                else {
                    // 奇数个"符号
                    result[result.length - 1] += lineContent;
                }
                count += config.StringUtil.count(lineContent, this.fieldEnclosureToken);
            }
            result.forEach(this.fieldDetection, this);
            result = result.filter(this.isValidRecord, this);
            // 将表示字段的行前面的行丢弃
            result = result.slice(this.headerLineNum);
            if (this.resolveHeaderType) {
                this.HeaderType = result.shift();
            }
            if (this.embededHeader && this.headerOverwrite) {
                result.shift();
            }
            else if (this.embededHeader && this.headerHasValues) {
                result.shift();
            }
            else if (this.embededHeader) {
                this.Header = result.shift();
            }
            this.data = result;
            for (var i = 0; i < this.Header.length; i++) {
                this.HeaderTypeDic[this.Header[i]] = this.HeaderType[i];
            }
        };
        /**
         * 获取字段类型
         */
        CSV.prototype.getType = function (p_fieldName) {
            return this.HeaderTypeDic[p_fieldName];
        };
        /**
         * 返回经过Object化的数据集，<b>header必须有值</b>
         */
        CSV.prototype.getRecords = function () {
            var dataArr = this.data;
            if (this.Header == null || dataArr == null) {
                return null;
            }
            var propCount = this.Header.length;
            var dataItem;
            var recordItem;
            var recordset = new Array();
            var i;
            var j;
            var L = dataArr.length;
            for (i = 0; i < L; i++) {
                dataItem = dataArr[i];
                recordItem = new Object();
                for (j = 0; j < propCount; j++) {
                    recordItem[this.Header[j]] = dataItem[j];
                }
                recordset.push(recordItem);
            }
            return recordset;
        };
        /**
         *   TODO Public method description ...
         *
         *   @param needle String or Array
         *   @return Array
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        CSV.prototype.search = function (needle, removeDuplicates) {
            if (removeDuplicates === void 0) { removeDuplicates = true; }
            var result = new Array();
            this.data.forEach(function (i, idx, array) {
                if (typeof (needle) != "string") {
                    needle.forEach(function (j, idx, array) {
                        if (i.indexOf(String(j)) >= 0) {
                            result.push(i);
                        }
                    });
                }
                else if (i.indexOf(String(needle)) >= 0) {
                    result.push(i);
                }
            });
            if (removeDuplicates && result.length > 2) {
                var k = result.length - 1;
            }
            while (k--) {
                var l = result.length;
                while (--l > k)
                    if (result[k] == result[l]) {
                        result.splice(l, 1);
                    }
            }
            return result;
        };
        /**
         *   TODO Private method description ...
         *
         *   @param fieldNameOrIndex *
         *   @param sequence String
         *   @return no
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        CSV.prototype.sort = function (fieldNameOrIndex, sequence) {
            if (fieldNameOrIndex === void 0) { fieldNameOrIndex = 0; }
            if (sequence === void 0) { sequence = 'ASC'; }
            this.SortSequence = sequence;
            if (this.headerHasValues && this.header.indexOf(fieldNameOrIndex) >= 0) {
                this.SortField = this.header.indexOf(fieldNameOrIndex);
            }
            else {
                this.SortField = fieldNameOrIndex;
            }
            if (this.dataHasValues) {
                this.data.sort(this.sort2DArray);
            }
        };
        // -> private methods
        /**
         *   分割一条记录的字段值
         *   @param element *
         *   @param index int
         *   @param arr Array
         *   @return Boolean true if recordset has values, false if not
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        CSV.prototype.fieldDetection = function (element, index, arr) {
            var count = 0;
            var result = new Array();
            var tmp = element.split(this.fieldSeperator);
            var regExp = /\"(.*)\"/;
            var searchResult;
            for (var i = 0; i < tmp.length; i++) {
                if (!Boolean(count % 2)) {
                    result.push(tmp[i].trim());
                }
                else {
                    result[result.length - 1] += this.fieldSeperator + tmp[i];
                }
                count += config.StringUtil.count(tmp[i], this.fieldEnclosureToken);
                if (!Boolean(count % 2)) {
                    // 将已经有前后双引号的字段的双引号移除
                    searchResult = regExp.exec(result[result.length - 1]);
                    if (searchResult) {
                        result[result.length - 1] = searchResult[1];
                    }
                }
            }
            arr[index] = result;
        };
        /**
         *   TODO Private method description ...
         *
         *   @param a Array
         *   @param b Array
         *   @return Number
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        CSV.prototype.sort2DArray = function (a, b) {
            var n = 0;
            var r = this.SortSequence == 'ASC' ? -1 : 1;
            if (a[this.SortField] < b[this.SortField]) {
                n = r;
            }
            else if (a[this.SortField] > b[this.SortField]) {
                n = -r;
            }
            else {
                n = 0;
            }
            return n;
        };
        /**
         *   有效行筛选
         *   @param element *
         *   @param index int
         *   @param arr Array
         *   @return Boolean true if recordset has values, false if not
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        CSV.prototype.isValidRecord = function (element, index, arr) {
            var valid = true;
            var str = element.toString();
            //这一行是空的就忽略
            if (str.trim() == "") {
                valid = false;
            }
            //如果一行头部发现注释符则忽略
            if (str.indexOf(this._comment) == 0) {
                valid = false;
            }
            return valid;
        };
        // -> deprecated / helper methods, not inside final release
        CSV.prototype.dump = function () {
            var result = 'data:Array -> [\r';
            for (var i = 0; i < this.data.length; i++) {
                result += '\t[' + i + ']:Array -> [\r';
                for (var j = 0; j < this.data[i].length; j++)
                    result += '\t\t[' + j + ']:String -> ' + this.data[i][j] + '\r';
                result += ('\t]\r');
            }
            result += ']\r';
            return result;
        };
        Object.defineProperty(CSV.prototype, "data", {
            // -> getter
            get: function () {
                return this._data;
            },
            // -> setter
            set: function (p_data) {
                this._data = p_data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSV.prototype, "fieldSeperator", {
            get: function () {
                return this.FieldSeperator;
            },
            set: function (value) {
                this.FieldSeperator = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSV.prototype, "fieldEnclosureToken", {
            get: function () {
                return this.FieldEnclosureToken;
            },
            /**
             *   TODO Getter description ...
             *
             *   @langversion ActionScript 3.0
             *   @tiptext
             */
            set: function (value) {
                this.FieldEnclosureToken = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSV.prototype, "recordsetDelimiter", {
            get: function () {
                return this.RecordsetDelimiter;
            },
            /**
             *   TODO Setter description ...
             *
             *   @langversion ActionScript 3.0
             *   @tiptext
             */
            set: function (value) {
                this.RecordsetDelimiter = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSV.prototype, "embededHeader", {
            /**
             *   是否有嵌入字段头部
             */
            get: function () {
                return this.EmbededHeader;
            },
            /**
             *   是否有嵌入字段头部，默认为true
             *
             *   @langversion ActionScript 3.0
             *   @tiptext
             */
            set: function (value) {
                this.EmbededHeader = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSV.prototype, "headerOverwrite", {
            /**
             *   是否重写字段头部，默认为false
             */
            get: function () {
                return this.HeaderOverwrite;
            },
            /**
             *   是否重写字段头部，默认为false
             *   @langversion ActionScript 3.0
             *   @tiptext
             */
            set: function (value) {
                this.HeaderOverwrite = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSV.prototype, "resolveHeaderType", {
            /**
             *   是否有解析字段类型，默认为false
             */
            get: function () {
                return this.ResolveHeaderType;
            },
            /**
             *   是否有解析字段类型，默认为false
             *   @langversion ActionScript 3.0
             *   @tiptext
             */
            set: function (value) {
                this.ResolveHeaderType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSV.prototype, "comment", {
            /**
             * 注释标识
             */
            get: function () {
                return this._comment;
            },
            /**
             * 注释标识
             */
            set: function (value) {
                this._comment = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSV.prototype, "headerLineNum", {
            /**
             * 表示字段头部的基于有效记录的行号，默认为0
             */
            get: function () {
                return this._headerLineNum;
            },
            /**
             * 表示字段头部的基于有效记录的行号，默认为0
             */
            set: function (value) {
                this._headerLineNum = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSV.prototype, "header", {
            /**
             *   字段头部
             */
            get: function () {
                return this.Header;
            },
            /**
             *   字段头部
             *
             *   @langversion ActionScript 3.0
             *   @tiptext
             */
            set: function (value) {
                if ((!this.embededHeader && !this.headerHasValues) || (!this.embededHeader && this.headerHasValues && this.headerOverwrite) || this.headerOverwrite) {
                    this.Header = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSV.prototype, "headerHasValues", {
            get: function () {
                var check;
                try {
                    if (this.Header.length > 0)
                        check = true;
                }
                catch (e) {
                    check = false;
                }
                finally {
                    return check;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSV.prototype, "dataHasValues", {
            get: function () {
                var check;
                try {
                    if (this.content.length > 0)
                        check = true;
                }
                catch (e) {
                    check = false;
                }
                finally {
                    return check;
                }
            },
            enumerable: true,
            configurable: true
        });
        return CSV;
    }());
    config.CSV = CSV;
    __reflect(CSV.prototype, "config.CSV", ["face.IConfigParser"]);
})(config || (config = {}));
/**
 * Created by lxz on 2017/10/25.
 */
var config;
(function (config) {
    var LuaObjUtil = (function () {
        function LuaObjUtil() {
        }
        /**
         * 解析Lua字串
         * 格式{a=123}
         */
        LuaObjUtil.parse = function (p_str) {
            var dic = {};
            var list;
            var result;
            var increase = 0;
            var key;
            var ridx = -10000;
            var lidx = -1;
            var parseStr;
            while (1) {
                //JS里是正则比较快速
                list = p_str.match(LuaObjUtil.exp);
                if (!list || list.length <= 0) {
                    break;
                }
                for (var i = 0; i < list.length; i++) {
                    result = this.parseItem(list[i], dic);
                    key = LuaObjUtil.OBJECT_SIGN + (increase++);
                    dic[key] = result;
                    p_str = p_str.replace(list[i], key);
                }
            }
            return result;
        };
        LuaObjUtil.parseItem = function (p_str, p_dic) {
            var result;
            var i;
            var len;
            if (p_str == "{}") {
                return {};
            }
            var list;
            var value;
            var num;
            if (p_str.indexOf("=") > -1) {
                var dic = [];
                p_str = LuaObjUtil.parseQuotation(p_str, LuaObjUtil.quotationRule1, dic);
                // p_str = LuaObjUtil.parseSemicolon(p_str , LuaObjUtil.quotationRule2 , dic);
                list = p_str.match(LuaObjUtil.valueRule);
                result = {};
                len = list.length;
                for (i = 0; i < len; i += 2) {
                    value = p_dic[list[i + 1]];
                    if (!value) {
                        value = list[i + 1];
                        var strs = value.match(LuaObjUtil.quotationRule3);
                        if (strs && strs.length) {
                            value = dic[parseInt(strs[0].substring(1, strs[0].length - 1))];
                        }
                        else {
                            if (!isNaN(value)) {
                                value = parseFloat(value);
                            }
                        }
                    }
                    result[list[i]] = value;
                }
            }
            else {
                list = p_str.match(LuaObjUtil.valueRule);
                result = list;
                len = list.length;
                for (i = 0; i < len; i++) {
                    value = p_dic[list[i]];
                    if (!value) {
                        value = list[i];
                        num = Number(value);
                        if (!isNaN(num)) {
                            value = num;
                        }
                    }
                    result[i] = value;
                }
            }
            return result;
        };
        LuaObjUtil.parseQuotation = function (p_str, exp, dic) {
            var list = p_str.match(exp);
            if (!list || list.length == 0) {
                return p_str;
            }
            var len = list.length;
            for (var i = 0; i < len; i++) {
                p_str = p_str.replace(list[i], "&" + dic.length + "&");
                dic.push(list[i].substring(1, list[i].length - 1));
            }
            return p_str;
        };
        LuaObjUtil.exp = /\{([^\{\}])*\}/g;
        LuaObjUtil.valueRule = /[^,=\{\}'"]+/g;
        /**
         * 过滤引号范围内
         */
        LuaObjUtil.quotationRule1 = /'([^'"])*'/g;
        // private static quotationRule2: RegExp = /"([^'"])*"/g;
        /**
         * 解析引号包围的字符串
         */
        LuaObjUtil.quotationRule3 = /&[\s\S]*&/g;
        LuaObjUtil.OBJECT_SIGN = "&lua";
        return LuaObjUtil;
    }());
    config.LuaObjUtil = LuaObjUtil;
    __reflect(LuaObjUtil.prototype, "config.LuaObjUtil");
})(config || (config = {}));
/**
 * Created by lxz on 2017/10/25.
 */
var config;
(function (config) {
    var StringUtil = (function () {
        function StringUtil() {
        }
        /**
         * Counts the occurrences of needle in haystack. <br />
         * {@code trace (stringUtils.count ('hello world!', 'o')); // 2
         * }
         * @param haystack :string
         * @param needle :string
         * @param offset :Number (optional)
         * @param length :Number (optional)
         * @return The number of times the needle substring occurs in the
         * haystack string. Please note that needle is case sensitive.
         */
        StringUtil.count = function (haystack, needle, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (length === 0)
                length = haystack.length;
            var result = 0;
            haystack = haystack.slice(offset, length);
            while (haystack.length > 0 && haystack.indexOf(needle) != -1) {
                haystack = haystack.slice((haystack.indexOf(needle) + needle.length));
                result++;
            }
            return result;
        };
        /**
         * 获取文件名
         * @param p_url 路径
         * @param p_suff 是否带后缀
         * @return
         */
        StringUtil.getFileName = function (p_url, p_suff) {
            if (p_suff === void 0) { p_suff = true; }
            if (!p_url)
                return "";
            var base = (p_url.indexOf('?') > 0) ? p_url.split('?')[0] : p_url;
            var endIndex = 2147483647;
            if (p_suff == false) {
                endIndex = base.lastIndexOf(".");
            }
            if (endIndex == -1)
                endIndex = 2147483647;
            if (base.indexOf("\\") > -1) {
                return p_url.substring(base.lastIndexOf("\\") + 1, endIndex);
            }
            else {
                return p_url.substring(base.lastIndexOf("/") + 1, endIndex);
            }
        };
        /**
         * 获取URL的扩展名(以小写返回)
         */
        StringUtil.getExtendsName = function (p_url) {
            var base = (p_url.indexOf('?') > 0) ? p_url.split('?')[0] : p_url;
            var lastIndex = base.lastIndexOf('.');
            var extension = "";
            if (lastIndex > -1) {
                extension = base.substr(lastIndex + 1).toLowerCase();
            }
            return extension;
        };
        /**
         * 获得文件目录
         */
        StringUtil.getSourcePath = function (p_url, p_sign) {
            if (p_sign === void 0) { p_sign = true; }
            if (!p_url)
                return "";
            var lastIndex = p_url.lastIndexOf("/");
            if (lastIndex == -1) {
                lastIndex = p_url.lastIndexOf("\\");
            }
            if (p_sign) {
                lastIndex = lastIndex + 1;
            }
            return p_url.substring(0, lastIndex);
        };
        StringUtil.trim = function (str) {
            var startPos;
            var endPos;
            for (startPos = 0; startPos < length; ++startPos) {
                if (str.charCodeAt(startPos) > 0x20)
                    break;
            }
            for (endPos = str.length - 1; endPos >= startPos; --endPos) {
                if (str.charCodeAt(endPos) > 0x20)
                    break;
            }
            return str.substring(startPos, endPos + 1);
        };
        StringUtil.getType = function (p_url) {
            var exd = StringUtil.getExtendsName(p_url);
            switch (exd) {
                case "png":
                case "jpg":
                case "png":
                    return "image";
                case "txt":
                case "csv":
                    return "text";
                case "json":
                    return "json";
                case "zip":
                    return "zip";
                case "dbp":
                    return "dragonbones";
                default:
                    return "bin";
            }
        };
        return StringUtil;
    }());
    config.StringUtil = StringUtil;
    __reflect(StringUtil.prototype, "config.StringUtil");
})(config || (config = {}));
/**
 * Created by lxz on 2017/10/17.
 */
/**
 * Created by lxz on 2017/8/3.
 */
var loadUtil;
(function (loadUtil) {
    var singleton = gameTool.singleton;
    var Loader = (function () {
        function Loader() {
            this._groupListens = {};
        }
        /**
         * 加载资源组
         * @param group     资源组名称
         * @param fun       回调函数
         * @param context   上下文
         * @param args      参数
         */
        Loader.prototype.loadGroup = function (group, loadingView, fun, context) {
            var _this = this;
            if (loadingView === void 0) { loadingView = null; }
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            this._groupName = group;
            if (RES.isGroupLoaded(this._groupName)) {
                this._loadingView = null;
                fun.apply(context, args);
            }
            else {
                if (loadingView) {
                    if (delay.hasDelayMain(this)) {
                        delay.addDelayTransact.apply(delay, [this, loadGroup, group, loadingView, fun, context].concat(args));
                        return;
                    }
                    if (fairygui.UIPackage.getByName("load_ui") == null) {
                        delay.createDelayMain(this);
                        delay.addDelayTransact.apply(delay, [this, loadGroup, group, loadingView, fun, context].concat(args));
                        loadUtil.loadGroup("load_ui", null, function () {
                            fairygui.UIPackage.addPackage("load_ui");
                            delay.executeAllTransact(_this);
                        }, this);
                        return;
                    }
                    this._loadingView = gui.addBox(loadingView, group);
                }
                this._groupListens[this._groupName] = function (e) {
                    if (_this._loadingView) {
                        gui.remove(_this._loadingView);
                        _this._loadingView = null;
                    }
                    fun.apply(context, args);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, _this._groupListens[e.groupName], _this);
                    _this._groupListens[e.groupName] = null;
                    delete _this._groupListens[e.groupName];
                };
                RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._groupListens[this._groupName], this);
                RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                RES.loadGroup(this._groupName);
            }
        };
        Loader.prototype.loadResource = function (path, dataFormat, complete, context) {
            var _this = this;
            var resourceLoader = new egret.URLLoader();
            var fun = function (evt) {
                var loader = evt.currentTarget;
                loader.removeEventListener(egret.Event.COMPLETE, fun, _this);
                complete.call(context, loader.data);
            };
            resourceLoader.addEventListener(egret.Event.COMPLETE, fun, this);
            resourceLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, function (err) {
                console.log(err);
            }, this);
            resourceLoader.dataFormat = dataFormat;
            var resourceRequest = new egret.URLRequest(path);
            // resourceRequest.url = path;
            resourceLoader.load(resourceRequest);
        };
        /******************************************************************/
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        Loader.prototype.onItemLoadError = function (event) {
            console.warn("资源组加载项加载出错 Url:" + event.resItem.url + " has failed to load");
        };
        /**
         * 资源组加载出错
         * Resource group loading failed
         */
        Loader.prototype.onResourceLoadError = function (event) {
            //TODO
            console.warn("资源组加载出错 Group:" + event.groupName + " has failed to load");
            //忽略加载失败的项目
            //ignore loading failed projects
        };
        /**
         * preload资源组加载进度
         * loading process of preload resource
         */
        Loader.prototype.onResourceProgress = function (event) {
            if (this._loadingView) {
                this._loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
            }
        };
        return Loader;
    }());
    loadUtil.Loader = Loader;
    __reflect(Loader.prototype, "loadUtil.Loader");
    /**
     * 加载资源组
     */
    function loadGroup(group, loadingView, fun, context) {
        if (loadingView === void 0) { loadingView = null; }
        var args = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            args[_i - 4] = arguments[_i];
        }
        (_a = gameTool.singleton(Loader)).loadGroup.apply(_a, [group, loadingView, fun, context].concat(args));
        var _a;
    }
    loadUtil.loadGroup = loadGroup;
    /*
     loadUtil.loadFastDragon("hero", () => {
     let hero = new animation.FastMovie();
     hero.movieKey = "hero";
     hero.x = 200;
     hero.y = 250;
     hero.movie.play("1");
     this.addChild(hero);
     }, this);
     */
    function loadResource(path, dataFormat, complete, context) {
        singleton(Loader).loadResource(path, dataFormat, complete, context);
    }
    loadUtil.loadResource = loadResource;
    /**
     * 加载一个配置文件
     */
    function loadConfigItem(path, complete, context) {
        if (path.indexOf(".data") > -1 || path.indexOf(".gz") > -1) {
            loadResource(path, egret.URLLoaderDataFormat.BINARY, complete, context);
        }
        else if (path.indexOf(".csv") > -1 || path.indexOf(".txt") > -1 || path.indexOf(".json") > -1) {
            loadResource(path, egret.URLLoaderDataFormat.TEXT, complete, context);
        }
        else {
            RES.getResAsync(path, complete, context);
        }
    }
    loadUtil.loadConfigItem = loadConfigItem;
    /*
     loadUtil.loadConfigItems(["monster_data"] , ()=>{
     console.log(MonsterConfig.getInstance().getTypeData(10005));
     console.log(MonsterConfig.getInstance().getTypeData(10007));
     console.log(MonsterConfig.getInstance().getTypeData(10001));
     },this , [MonsterConfig.init] , this);

     loadUtil.loadConfigItems(["monster_csv"] , ()=>{
     console.log(MonsterConfig.getInstance().getTypeData(10001));
     },this , [MonsterConfig.init] , this);
     */
    /**
     * 加载配置文件列表
     */
    function loadConfigItems(paths, complete, context1, parses, context2, index) {
        var _this = this;
        if (index === void 0) { index = 0; }
        if (paths.length == 0) {
            complete.call(context1);
            return;
        }
        this.loadConfigItem(paths[index], function (res) {
            // console.log("loadConfigItem");
            // console.log(res);
            if (res && parses) {
                parses[index].call(context2, res);
            }
            index++;
            if (paths.length == index) {
                complete.call(context1);
            }
            else {
                _this.loadConfigItems(paths, complete, context1, parses, context2, index);
            }
        }, this);
    }
    loadUtil.loadConfigItems = loadConfigItems;
})(loadUtil || (loadUtil = {}));
/**
 * Created by lxz on 2017/8/5.
 */
var loadUtil;
(function (loadUtil) {
    var LoadUIType = (function () {
        function LoadUIType() {
        }
        // 不需要加载界面
        LoadUIType.NONE = 0;
        // 默认加载界面
        LoadUIType.NORMAL = 1;
        return LoadUIType;
    }());
    loadUtil.LoadUIType = LoadUIType;
    __reflect(LoadUIType.prototype, "loadUtil.LoadUIType");
})(loadUtil || (loadUtil = {}));
