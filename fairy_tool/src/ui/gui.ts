/**
 * Created by lxz on 2017/10/16.
 */
module gui {
    export class WindowManager {
        private _curScene: BaseWindow;
        private _layers: any;
        private _layerIndexs: number[];
        private _root: egret.DisplayObjectContainer;
        private _windowClassList: { [className: string]: BaseWindow[] };
        private _windowList: any;
        private _scenes: { new(): BaseWindow; }[];

        constructor() {
            this._windowClassList = {};
            this._windowList = {};
            this._scenes = [];
        }

        /**
         * 初始化舞台
         */
        initRootView(root: egret.DisplayObjectContainer) {
            this._root = root;
            this._layers = {};
            this._layerIndexs = [];
            this.addDisplayToStage(fairygui.GRoot.inst.displayObject, define.WindowType.POP_LAYER);
        }

        /**
         * 添加显示对象到舞台
         */
        addDisplayToStage(display: egret.DisplayObject, type: number) {
            if (this._layers[type] == null) {
                let container = new egret.DisplayObjectContainer();
                this._layers[type] = container;
                this._layers[gameTool.getTypeId(container)] = true;
                this._layerIndexs.push(type);
                this._layerIndexs.sort((a, b) => {
                    return a - b
                });
                let n = this._layerIndexs.indexOf(type);
                gameTool.display.setFullDisplay(container);
                this._root.addChildAt(this._layers[type], n);
            }
            this._layers[type].addChild(display);
        }

        addGComponentToStage(com: fairygui.GComponent, type: number) {
            this.addDisplayToStage(com.displayObject, type);
        }

        /**
         * 是否是管理层级
         */
        inLayer(layer: egret.DisplayObjectContainer) {
            return this._layers[gameTool.getTypeId(layer)];
        }

        /**
         * 添加场景
         * 场景是互斥的，此处添加一个场景，则会移除其他场景
         */
        addScene<T extends BaseWindow>(obj: { new(): T; } | T, ...args): T {
            if (definiton.isClass(obj)) {
                if (this._curScene && definiton.getClassByObject(this._curScene) == obj) return;//同一个场景不处理
            }
            if (this._curScene) {
                this.remove(this._curScene);
            }
            this._curScene = this.addWindow(obj, define.UITypeDefine.SCENE, ...args);
            this._curScene.inSceneQueue = true;
            return <T>this._curScene;
        }

        /**
         * 显示一个弹窗，默认弹窗是可以多个叠加出现的，所以此处默认不会关闭其他窗口
         * @param viewCls
         * @param args
         * @returns {BaseComponent}
         */
        addBox<T extends BaseWindow>(obj: { new(): T; } | T, ...args): T {
            return <T>this.addWindow(obj, define.UITypeDefine.BOX, ...args);
        }

        /**
         * 移除一个视图
         * @param view
         */
        remove(view: BaseWindow): void {
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
                if (ani.inClose) {    //已经正处于关闭状态
                    return;
                }
                //视图作为参数传入，视为防止再关闭动画期间，视图指针变化导致空指针异常
                ani.close((v) => {
                    this.removeView(v);
                }, this, view);
            } else {
                this.removeView(view);
            }
        }

        addWindow<T extends BaseWindow>(obj: { new(): T; } | T, defaultUIType: number, ...args): T {
            let window;
            if (definiton.isClass(obj)) {
                let cl: any = <any>obj;
                window = new cl;
            } else {
                window = obj;
            }
            window.inClose = false;
            if (window.uiType == define.UITypeDefine.NONE) {
                window.uiType = defaultUIType;
            }
            fairygui.GRoot.inst.showWindow(window);
            window.enter(...args);
            let str = definiton.getClassNameByObject(window);
            if (this._windowClassList[str] == null) {
                this._windowClassList[str] = [window];
            } else {
                this._windowClassList[str].push(window);
            }
            this._windowList[gameTool.getTypeId(window)] = window;
            return window;
        }

        /**
         * 是否在stage中已经存在该类型的window
         */
        hasWindowTypeInStage(cl: any): boolean {
            let arr = this._windowClassList[definiton.getNameByClass(cl)];
            return arr != null && arr.length > 0;
        }

        /**
         * 移除该类型的window
         */
        removeViewByClass(cl: any) {
            let arr = this._windowClassList[definiton.getNameByClass(cl)];
            for (var key in arr) {
                this.remove(arr[key]);
            }
        }

        /**
         * 移除stage所有窗口
         */
        removeAllView() {
            for (var typeID in this._windowList) {
                this.remove(this._windowList[typeID]);
            }
        }

        /**
         * 获取当前上一个场景
         */
        getPrevScene(): { new(): BaseWindow; } {
            return this._scenes.length > 0 ? this._scenes[this._scenes.length - 1] : null;
        }

        /**
         * 退回上一个场景
         */
        prevScene() {
            if (!this.getPrevScene()) {
                return false;
            }
            var cur = this._curScene;
            var b = cur.inSceneQueue;
            cur.inSceneQueue = false;
            gui.addScene(this._scenes.pop());
            cur.inSceneQueue = b;
            return true;
        }

        /**
         * 手动压入后续界面
         */
        pushScene(view: { new(): BaseWindow; }) {
            this._scenes.push(view);
        }

        /******************************************************************/
        /**
         * 移除一个视图
         * @param view
         */
        private removeView(view: BaseWindow): void {
            let typeID = gameTool.getTypeId(view);
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
        }

        /******************************************************************/
    }

    /**
     * 添加场景
     * 场景是互斥的，此处添加一个场景，则会移除其他场景
     */
    export function addScene<T extends BaseWindow>(viewCls: { new(): T; } | T, ...args): T {
        return gameTool.singleton(WindowManager).addScene(viewCls, ...args);
    }

    /**
     * 显示一个弹窗，默认弹窗是可以多个叠加出现的，所以此处默认不会关闭其他窗口
     * @param viewCls
     * @param args
     * @returns {BaseComponent}
     */
    export function addBox(viewCls: any, ...args): any {
        return gameTool.singleton(WindowManager).addBox(viewCls, ...args);
    }

    /**
     * 移除一个视图
     * @param view
     */
    export function remove(view: BaseWindow): void {
        gameTool.singleton(WindowManager).remove(view);
    }

    /**
     * 初始化舞台
     */
    export function initRootView(root: egret.DisplayObjectContainer) {
        gameTool.singleton(WindowManager).initRootView(root);
    }

    /**
     * 添加显示对象到舞台
     */
    export function addDisplayToStage(display: egret.DisplayObject, type: number) {
        gameTool.singleton(WindowManager).addDisplayToStage(display, type);
    }

    /**
     * 添加gui显示对象到舞台
     */
    export function addGComponentToStage(com: fairygui.GComponent, type: number) {
        gameTool.singleton(WindowManager).addGComponentToStage(com, type);
    }


    /**
     * 是否在stage中已经存在该类型的window
     */
    export function hasWindowTypeInStage(cl: any): boolean {
        return gameTool.singleton(WindowManager).hasWindowTypeInStage(cl);
    }

    /**
     * 移除stage所有窗口
     */
    export function removeAllView() {
        return gameTool.singleton(WindowManager).removeAllView();
    }

    /**
     * 移除该类型的window
     */
    export function removeViewByClass(cl: any) {
        return gameTool.singleton(WindowManager).removeViewByClass(cl);
    }

    /**
     * 获取当前上一个场景
     */
    export function getPrevScene(): { new(): BaseWindow; } {
        return gameTool.singleton(WindowManager).getPrevScene();
    }

    /**
     * 退回上一个场景
     */
    export function prevScene(): boolean {
        return gameTool.singleton(WindowManager).prevScene();
    }

    /**
     * 手动压入后续界面
     */
    export function pushScene(view: { new(): BaseWindow; }) {
        gameTool.singleton(WindowManager).pushScene(view);
    }

    /******************************************************************/
    /******************************************************************/

    /******************************************************************/

    /**
     * 窗口基类，虽说是继承fairygui的Window，
     * 但是它的资源加载无法添加进度条，于是在BaseWindow的子类URLWindow去做这个事情。
     * 继承它为了能接入fairygui的管理
     */
    export class BaseWindow extends fairygui.Window {
        protected _ui: fairygui.GComponent;
        protected _buttonList: fairygui.GButton[];
        private _isCenter: boolean;
        private _animation: UIAnimation;
        private _uiType: number;
        // 是否处于场景队列
        inSceneQueue: boolean;
        // 是否处于关闭状态
        inClose: boolean;
        private _viewData: any;
        protected mainView : fairygui.GComponent;
        protected _bg : fairygui.GComponent;

        constructor(modal: boolean = true, center: boolean = true) {
            super();
            this.modal = modal;
            this._isCenter = center;
            this._buttonList = [];
            this._uiType = define.UITypeDefine.NONE;
            delay.createDelayMain(this);
        }

        enter(...args) {
            if (delay.hasDelayMain(this)) {
                delay.addDelayTransact(this, this.enter, ...args)
                return;
            }
            switch (this._uiType) {
                case define.UITypeDefine.SCENE:
                    this.animation = new SceneAnimation();
                    break;
                case define.UITypeDefine.BOX:
                    this.animation = new BoxAnimation();
                    break;
            }
            if (this._animation) {
                this._animation.show(this.show, this);
            }
            // if (this.getViewData()) {
            //     this.updateViewData();
            // }
            this.open(...args);
        }

        /**
         * 接收数据完成
         */
        updateViewData() {

        }

        /**
         * 资源初始化完成
         */
        open(...args) {

        }

        /**
         * 窗口动画完成
         */
        show() {

        }

        /**
         * 退出窗口
         */
        exit() {
            bind.removeBindByObject(this);
        }

        /**
         * 初始化窗口，4步操作
         * 1、初始化视图
         * 2、注册事件
         * 3、重新绘制窗口
         * 4、获得所有按钮并注册事件
         */
        onInit(): void {
            super.onInit();
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
        }

        onResize():void
        {

        }

        dispose(): void {
            gameTool.destoryChildrenNotice(this);
            if (this._buttonList) {
                var btnLen: number = this._buttonList.length;
                for (var i: number = 0; i < btnLen; i++) {
                    var btn: fairygui.GButton = this._buttonList[i];
                    btn.removeClickListener(this.onClick, this);
                }
                this._buttonList.length = 0;
            }
            if(this._bg){
                this._bg.dispose();
                this._bg = null;
            }
            if (this._ui) {
                this._ui.dispose();
                this._ui = null;
            }
            if(this.mainView)
            {
                this.mainView.dispose();
                this.mainView = null;
            }
            if (this._animation) {
                this._animation.dispose();
                this._animation = null;
            }
            super.dispose();
        }

        /******************************************************************/
        protected initView(): void {

        }

        protected initEvent(): void {

        }

        protected removeEvent(): void {

        }

        protected onClick(e: egret.TouchEvent): void {

        }

        /**************************component register***************************/
        /**
         * 注册按钮 在onClick里面，判断按钮的名字以区分点的是哪个按钮
         */
        protected registerButtons(container: fairygui.GComponent): void {
            if (container == null) {
                throw new Error("窗口不存在，不能注册按钮");
            }
            var childLen: number = container.numChildren;
            for (var i: number = 0; i < childLen; i++) {
                var child: fairygui.GObject = container.getChildAt(i);
                if (child instanceof fairygui.GButton) {
                    this.getButton(child.name, container);
                }
            }
        }

        //获得按钮 第一次获得会注册点击事件
        protected getButton(resName: string, container: fairygui.GComponent = null): fairygui.GButton {
            var btn: fairygui.GButton = this.getComponent(resName, container) as fairygui.GButton;
            if (this._buttonList.indexOf(btn) >= 0) {
                return btn;
            }
            this._buttonList.push(btn);
            btn.addClickListener(this.onClick, this);
            return btn;
        }

        //获得对象
        protected getComponent(resName: string, p_container: fairygui.GComponent = null): fairygui.GObject {
            var container: fairygui.GComponent;
            if (p_container == null) {
                container = this._ui;
            } else {
                container = p_container;
            }
            if (container == null) throw new Error("父容器是空的");
            return container.getChild(resName);
        }

        //获得文本
        protected getTextField(resName: string, container: fairygui.GComponent = null): fairygui.GTextField {
            return this.getComponent(resName, container).asTextField;
        }

        //获得列表
        protected getList(resName: string, container: fairygui.GComponent = null): fairygui.GList {
            return this.getComponent(resName, container) as fairygui.GList;
        }

        /**
         * 获得loader
         */
        protected getLoader(resName: string, container: fairygui.GComponent = null): fairygui.GLoader {
            return this.getComponent(resName, container).asLoader;
        }

        /******************************************************************/
        set animation(ani: UIAnimation) {
            if (this._animation) {
                this._animation.dispose();
            }
            this._animation = ani;
            ani.component = this._ui;
        }

        get animation(): UIAnimation {
            return this._animation;
        }

        get uiType(): number {
            return this._uiType;
        }

        set uiType(value: number) {
            if (this._uiType == value) {
                return;
            }
            this._uiType = value;
        }

        getViewData(): any {
            return this._viewData;
        }

        setViewData(value: any) {
            if (delay.hasDelayMain(this)) {
                delay.addDelayTransact(this, this.setViewData, value)
                return;
            }
            this._viewData = value;
            this.updateViewData();
        }
    }
}