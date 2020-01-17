/**
 *
 * @author
 *
 */
declare module gameTool {
    class List {
        private _list;
        constructor();
        dispose(): void;
        /**
         * 批量导入列表
         */
        addBatch(list: gameTool.ListData[]): void;
        /**
         * 添加单个定义
         */
        addSingal(data: gameTool.ListData): void;
        getInstance<T>(keyClass: {
            new (): T;
        }, ...args: any[]): T;
        remove(obj: any): void;
        removeFrontObj(keyClass: any): void;
        removeBackObj(keyClass: any): void;
        getActivityObj<T>(keyClass: {
            new (): T;
        }): T[];
        play<T>(keyClass: {
            new (): T;
        }): void;
        playByMethod(key: string, method: __Function, args?: any[], fun?: (item) => boolean, context?: any): void;
        removeAll(keyClass: any): void;
        disposeAll(keyClass: any): void;
        /************************************************************************************************/
        private keyToCl(listData);
        private checkListData<T>(keyClass);
    }
}
/**
 * Created by lxz on 2017/10/16.
 */
declare module gui {
    class WindowManager {
        private _curScene;
        private _layers;
        private _layerIndexs;
        private _root;
        private _windowClassList;
        private _windowList;
        private _scenes;
        constructor();
        /**
         * 初始化舞台
         */
        initRootView(root: egret.DisplayObjectContainer): void;
        /**
         * 添加显示对象到舞台
         */
        addDisplayToStage(display: egret.DisplayObject, type: number): void;
        addGComponentToStage(com: fairygui.GComponent, type: number): void;
        /**
         * 是否是管理层级
         */
        inLayer(layer: egret.DisplayObjectContainer): any;
        /**
         * 添加场景
         * 场景是互斥的，此处添加一个场景，则会移除其他场景
         */
        addScene<T extends BaseWindow>(obj: {
            new (): T;
        } | T, ...args: any[]): T;
        /**
         * 显示一个弹窗，默认弹窗是可以多个叠加出现的，所以此处默认不会关闭其他窗口
         * @param viewCls
         * @param args
         * @returns {BaseComponent}
         */
        addBox<T extends BaseWindow>(obj: {
            new (): T;
        } | T, ...args: any[]): T;
        /**
         * 移除一个视图
         * @param view
         */
        remove(view: BaseWindow): void;
        addWindow<T extends BaseWindow>(obj: {
            new (): T;
        } | T, defaultUIType: number, ...args: any[]): T;
        /**
         * 是否在stage中已经存在该类型的window
         */
        hasWindowTypeInStage(cl: any): boolean;
        /**
         * 移除该类型的window
         */
        removeViewByClass(cl: any): void;
        /**
         * 移除stage所有窗口
         */
        removeAllView(): void;
        /**
         * 获取当前上一个场景
         */
        getPrevScene(): {
            new (): BaseWindow;
        };
        /**
         * 退回上一个场景
         */
        prevScene(): boolean;
        /**
         * 手动压入后续界面
         */
        pushScene(view: {
            new (): BaseWindow;
        }): void;
        /******************************************************************/
        /**
         * 移除一个视图
         * @param view
         */
        private removeView(view);
    }
    /**
     * 添加场景
     * 场景是互斥的，此处添加一个场景，则会移除其他场景
     */
    function addScene<T extends BaseWindow>(viewCls: {
        new (): T;
    } | T, ...args: any[]): T;
    /**
     * 显示一个弹窗，默认弹窗是可以多个叠加出现的，所以此处默认不会关闭其他窗口
     * @param viewCls
     * @param args
     * @returns {BaseComponent}
     */
    function addBox(viewCls: any, ...args: any[]): any;
    /**
     * 移除一个视图
     * @param view
     */
    function remove(view: BaseWindow): void;
    /**
     * 初始化舞台
     */
    function initRootView(root: egret.DisplayObjectContainer): void;
    /**
     * 添加显示对象到舞台
     */
    function addDisplayToStage(display: egret.DisplayObject, type: number): void;
    /**
     * 添加gui显示对象到舞台
     */
    function addGComponentToStage(com: fairygui.GComponent, type: number): void;
    /**
     * 是否在stage中已经存在该类型的window
     */
    function hasWindowTypeInStage(cl: any): boolean;
    /**
     * 移除stage所有窗口
     */
    function removeAllView(): void;
    /**
     * 移除该类型的window
     */
    function removeViewByClass(cl: any): void;
    /**
     * 获取当前上一个场景
     */
    function getPrevScene(): {
        new (): BaseWindow;
    };
    /**
     * 退回上一个场景
     */
    function prevScene(): boolean;
    /**
     * 手动压入后续界面
     */
    function pushScene(view: {
        new (): BaseWindow;
    }): void;
    /******************************************************************/
    /******************************************************************/
    /******************************************************************/
    /**
     * 窗口基类，虽说是继承fairygui的Window，
     * 但是它的资源加载无法添加进度条，于是在BaseWindow的子类URLWindow去做这个事情。
     * 继承它为了能接入fairygui的管理
     */
    class BaseWindow extends fairygui.Window {
        protected _ui: fairygui.GComponent;
        protected _buttonList: fairygui.GButton[];
        protected _isCenter: boolean;
        private _animation;
        private _uiType;
        inSceneQueue: boolean;
        inClose: boolean;
        private _viewData;
        protected mainView: fairygui.GComponent;
        protected _bg: fairygui.GComponent;
        constructor(modal?: boolean, center?: boolean);
        enter(...args: any[]): void;
        /**
         * 接收数据完成
         */
        updateViewData(): void;
        /**
         * 资源初始化完成
         */
        open(...args: any[]): void;
        /**
         * 窗口动画完成
         */
        show(): void;
        /**
         * 退出窗口
         */
        exit(): void;
        /**
         * 初始化窗口，4步操作
         * 1、初始化视图
         * 2、注册事件
         * 3、重新绘制窗口
         * 4、获得所有按钮并注册事件
         */
        onInit(): void;
        onResize(): void;
        dispose(): void;
        /******************************************************************/
        protected initView(): void;
        protected initEvent(): void;
        protected removeEvent(): void;
        protected onClick(e: egret.TouchEvent): void;
        /**************************component register***************************/
        /**
         * 注册按钮 在onClick里面，判断按钮的名字以区分点的是哪个按钮
         */
        protected registerButtons(container: fairygui.GComponent): void;
        protected getButton(resName: string, container?: fairygui.GComponent): fairygui.GButton;
        protected getComponent(resName: string, p_container?: fairygui.GComponent): fairygui.GObject;
        protected getTextField(resName: string, container?: fairygui.GComponent): fairygui.GTextField;
        protected getList(resName: string, container?: fairygui.GComponent): fairygui.GList;
        /**
         * 获得loader
         */
        protected getLoader(resName: string, container?: fairygui.GComponent): fairygui.GLoader;
        /******************************************************************/
        animation: UIAnimation;
        uiType: number;
        getViewData(): any;
        setViewData(value: any): void;
    }
}
/**
 * Created by lxz on 2017/10/17.
 */
declare module extendsUI {
    class BaseContainer extends egret.DisplayObjectContainer {
        protected _hitRect: egret.Rectangle;
        constructor();
        dispose(): void;
        /**
         * 是否与其他容器碰撞
         */
        intersectsByContainer(container: BaseContainer): boolean;
        /**
         * 是否包含了某个点
         */
        containsPoint(x: number, y: number): boolean;
        /******************************************************************/
        readonly hitRect: egret.Rectangle;
    }
}
declare module gui {
    class OvBase extends BaseWindow {
        protected _textList: fairygui.GTextField[];
        protected _ivs: ItemViewBase[];
        private _pkgName;
        private _resName;
        protected className: string;
        constructor(pkgName: string, resName: string, modal?: boolean, center?: boolean, loadingView?: {
            new (): loadUI.BaseLoadingUI;
        });
        dispose(): void;
        updateItemView(index: any, ...args: any[]): void;
        setText(index: number, text: any): void;
        getText(index: number): string;
        getTextFiled(index: number): fairygui.GTextField;
        onInit(): void;
        /******************************************************************/
        protected initView(): void;
        protected onClick(e: egret.TouchEvent): void;
        protected clickHandler(index: number): void;
        protected registerTexts(container: fairygui.GComponent): void;
        protected initUI(pkgName: any, resName: any): void;
        onResize(): void;
        /******************************************************************/
        private loadResComplete();
        private onTextSort(t1, t2);
    }
}
/**
 * Created by ASUS on 2017/6/25.
 */
declare module gameTool {
    import DisplayObjectContainer = egret.DisplayObjectContainer;
    /**
     * 返回指定类型的单例
     * @includeExample singleton.ts
     * @param type 需要单例化的类型
     * @returns {any} 类型的单例
     */
    function singleton<T>(type: {
        new (): T;
    }): T;
    /**
     * 返回指定分类的类型单例
     * @param name 分类名称
     * @param type 单例化的类型
     * @includeExample typesingleton.ts
     * @returns {any} 单例对象
     */
    function typeSingleton<T>(name: string, type: {
        new (): T;
    }): T;
    /**
     * 返回指定类型的类型编号
     * @param type 指定类型
     * @returns {any} 类型编号
     */
    function getTypeId(type: any): string;
    /**
     * 释放单例
     */
    function disposeSingle(context: any): void;
    /**
     * 指定类型是否存在类型编号
     * @param type 指定类型
     * @returns {boolean} 是否存在类型编号
     */
    function hasTypeId(type: any): number;
    /**
     * 获取一个文件的扩展名
     * @param path
     * @returns {string}
     */
    function getFileExtName(path: string): string;
    /**
     * 从父容器移除显示对象
     * @param child
     */
    function removeFromParent(child: egret.DisplayObject): void;
    /**
     * 销毁容器的所有子对象
     * @param container
     */
    function destoryChildren(container: any): void;
    /**
     * 销毁容器的所有子对象消息
     * @param container
     */
    function destoryChildrenNotice(container: any): void;
    /**
     * 游戏的一些初始化
     */
    function init(main: DisplayObjectContainer): void;
    var stage: egret.Stage;
    var main: DisplayObjectContainer;
    var gameContentWH: number[];
    var gameRotate: boolean;
    var pToLand: number;
    var isPc: boolean;
    /**
     * 回收列表
     */
    var poolList: List;
    /**
     * 根据容器发送其自身所携带的命令
     */
    function sendNoticoeByComponent(com: any): void;
    /**
     * 判断是否是 IOS
     * @returns {boolean}
     */
    function isIOS(): boolean;
    /**
     * 获取项目的地址前缀
     */
    function getHost(): string;
    /**
     * 移除容器
     * @param display
     * @param container
     */
    function removeStage(display: egret.DisplayObject): void;
    function inStage(display: egret.DisplayObject): boolean;
}
declare module gui {
    class NumSelect {
        private _com;
        private _reduceBtn;
        private _addBtn;
        private _minBtn;
        private _maxBtn;
        private _num;
        private _totalNum;
        private _numText;
        private _onChangeHandler;
        private _min;
        private _callThisObj;
        constructor(com: fairygui.GComponent, onChangeHandler: () => void, callThisObj: any);
        dispose(): void;
        /******************************************************************/
        private onTextChange(event);
        private onNumChange();
        private onPre();
        private onNext();
        private onMax();
        private onMin();
        /******************************************************************/
        oneChange: boolean;
        min: number;
        minBtn: boolean;
        maxBtn: boolean;
        max: number;
        num: number;
    }
}
/**
 * Created by lxz on 2017/10/18.
 */
declare module define {
    class UITypeDefine {
        static NONE: number;
        /**
         * 直接弹出
         */
        static IMMEDIATE: number;
        /**
         * 窗口
         */
        static SCENE: number;
        /**
         * 弹窗
         */
        static BOX: number;
    }
}
/**
 * Created by lxz on 2017/8/2.
 */
/**
 * 窗口类型定义
 */
declare module define {
    class WindowType {
        static SCENE_LAYER: number;
        static POP_LAYER: number;
        static TIP_LAYER: number;
        constructor();
    }
}
/**
 *
 * @author
 *
 */
declare module face {
    /**
     * 回收池对象专有方法
     * @author lxz
     * @version 2015-3-18
     */
    interface IPoolObject {
        initData(obj?: any): any;
        retrieve(): any;
        hasInit: boolean;
    }
    /**
     * 时间器接口
     * @author lxz
     * @version 2015-3-18
     */
    interface ITimer {
        start(): any;
        reset(): any;
        pause(): any;
        onFrame(time: number): any;
        timerKey: number;
    }
    interface ILoading {
        setProgress(itemsLoaded: any, itemsTotal: any): any;
    }
    /**
     * 限定数据列表
     */
    class IMap<T> {
        [key: string]: T;
    }
    /**
     * 限定map列表
     */
    interface IKeysToMap<T> {
        [key: string]: face.IMap<T[]>;
    }
    /**
     * map_list
     */
    interface IMapList<T> {
        __map_list: T[];
    }
    /**
     * 无限定数据列表
     */
    interface IMapInfo {
        [key: string]: any;
    }
    /**
     * 配置解析器
     */
    interface IConfigParser {
        data: any;
        getRecords(): any[];
        decode(): void;
        getType(p_fieldName: string): string;
    }
}
/**
 * Created by lxz on 2017/10/19.
 */
/**
 * map类型
 */
declare type __MapList<T> = face.IKeysToMap<T> & face.IMapList<T>;
/**
 * 数据键值映射
 */
declare type __KeyOf<T> = keyof T;
declare type __Key = string | number;
declare type __Function = string | ((...args) => any);
declare type __Map = {
    [key: string]: any;
};
/**
 * Created by lxz on 2017/8/22.
 */
declare module component {
    class Entity {
        private _components;
        constructor();
        dispose(): void;
        addComponent<T extends Component>(comCl: {
            new (): T;
        }): T;
        removeComponent(type: string): void;
        getComponent<T extends Component>(comCl: {
            new (): T;
        }): T;
        containComponent<T extends Component>(comCl: {
            new (): T;
        }): boolean;
        removeAllComponent(): void;
    }
    class Component {
        constructor();
        readonly type: string;
    }
    class BaseComponent extends Component implements face.IPoolObject {
        name: string;
        private _object;
        hasInit: boolean;
        constructor();
        dispose(): void;
        retrieve(): void;
        initData(obj?: any): void;
        initObject(object: any): void;
        getObject<T>(cl: {
            new (): T;
        }): T;
    }
}
/**
 *
 * @author
 *
 */
declare module gameTool {
    class ListData {
        private _key;
        private _cl;
        private _initObj;
        constructor(cl: any, initObj?: Object);
        getKey(): string;
        setKey(key: string): void;
        getCl(): any;
        setCl: any;
        getInitObj(): Object;
        setInitObj(initObj: Object): void;
    }
}
/**
 *
 * @author
 *
 */
declare module gameTool {
    class GamePool {
        private _list;
        private _arr;
        private _classRef;
        private _initObj;
        constructor(classRef: any, initObj?: Object);
        dispose(): void;
        /**
         * 获取一个空闲
         * @return
         *
         */
        getFreeObj(...args: any[]): any;
        /**
         * 回收
         * @param ro
         *
         */
        retrieve(ro: any): void;
        /************************************************************************************************************************/
        /**
         * 返回未回收的所有实例
         */
        getList(): any[];
        getClassRef(): any;
        /**
         * 回收池里未回收的所有实例
         */
        removePool(): void;
        /**
         * 回收池里未回收的所有实例并释放掉回收池里的所有实例
         */
        clearPool(): void;
    }
}
/**
 * Created by lxz on 2017/12/18.
 */
declare module audio1 {
    class Music {
        private _ac;
        private _analyser;
        private _gainnode;
        private _audio;
        private _processor;
        private _startTime;
        private _endTime;
        private _totalTime;
        private _loaded;
        private _complete;
        private _running;
        private _loop;
        constructor();
        /**
         * 播放音频
         * start        开始时间
         * end          0:播放到结束
         */
        play(start: number, end: number): void;
        pause(): void;
        /**
         * 设置音频地址
         */
        setMusicUrl(url: string): void;
        /**
         * 加载完音频
         */
        setLoaded(fun: (duration: number) => void, context?: any): void;
        /**
         * 播放一遍回调
         */
        setComplete(fun: () => void, context?: any): void;
        loop: boolean;
        readonly running: boolean;
        currentTime: number;
        readonly endTime: number;
    }
    /**
     * 播放音频
     * start        开始时间
     * end          0:播放到结束
     */
    function play(start: number, end: number): void;
    function pause(): void;
    /**
     * 设置音频地址
     */
    function setMusicUrl(url: string): void;
    /**
     * 加载完音频
     */
    function setLoaded(fun: (duration: number) => void, context?: any): void;
    /**
     * 播放一遍回调
     */
    function setComplete(fun: () => void, context?: any): void;
    function isRunning(): boolean;
    function setLoop(b: boolean): void;
    function getCurrentTime(): number;
    function setCurrentTime(time: any): void;
    function getEndTime(): number;
}
/**
 * Created by lxz on 2017/12/18.
 */
declare module audio {
    class Music {
        private _ac;
        private _audio;
        private _startTime;
        private _endTime;
        private _totalTime;
        private _loaded;
        private _complete;
        private _running;
        private _loop;
        private _timeID;
        constructor();
        /**
         * 播放音频
         * start        开始时间
         * end          0:播放到结束
         */
        play(start: number, end: number): void;
        pause(): void;
        /**
         * 设置音频地址
         */
        setMusicUrl(url: string): void;
        /**
         * 加载完音频
         */
        setLoaded(fun: (duration: number) => void, context?: any): void;
        /**
         * 播放一遍回调
         */
        setComplete(fun: () => void, context?: any): void;
        loop: boolean;
        readonly running: boolean;
        currentTime: number;
        readonly endTime: number;
    }
    /**
     * 播放音频
     * start        开始时间
     * end          0:播放到结束
     */
    function play(start: number, end: number): void;
    function pause(): void;
    /**
     * 设置音频地址
     */
    function setMusicUrl(url: string): void;
    /**
     * 加载完音频
     */
    function setLoaded(fun: (duration: number) => void, context?: any): void;
    /**
     * 播放一遍回调
     */
    function setComplete(fun: () => void, context?: any): void;
    function isRunning(): boolean;
    function setLoop(b: boolean): void;
    function getCurrentTime(): number;
    function setCurrentTime(time: any): void;
    function getEndTime(): number;
}
/**
 * Created by lxz on 2017/12/18.
 */
declare module music {
    class Music {
        private _ac;
        private _endTime;
        private _totalTime;
        private _loaded;
        private _complete;
        private _running;
        private _loop;
        private _buffer;
        private _sourceNode;
        private _currentTime;
        private _analyser;
        private _gainnode;
        private _isPause;
        private _acStartTime;
        private _startTime;
        private _pauseTime;
        constructor();
        dispose(): void;
        init(): void;
        /**
         * 播放音频
         * start        开始时间
         * end          0:播放到结束
         */
        play(start: number, end: number): void;
        pause(): void;
        /**
         * 设置音频地址
         */
        setMusicUrl(url: string): void;
        /**
         * 加载完音频
         */
        setLoaded(fun: (duration: number) => void, context?: any): void;
        /**
         * 播放一遍回调
         *
         */
        setComplete(fun: () => void, context?: any): void;
        /******************************************************************/
        private onError(e);
        private pauseMusic();
        /******************************************************************/
        loop: boolean;
        readonly running: boolean;
        currentTime: number;
        startTime: any;
        readonly endTime: number;
    }
    function init(): void;
    /**
     * 播放音频
     * start        开始时间
     * end          0:播放到结束
     */
    function play(start: number, end: number): void;
    function pause(): void;
    function dispose(): void;
    /**
     * 设置音频地址
     */
    function setMusicUrl(url: string): void;
    /**
     * 加载完音频
     */
    function setLoaded(fun: (duration: number) => void, context?: any): void;
    /**
     * 播放一遍回调
     */
    function setComplete(fun: () => void, context?: any): void;
    function isRunning(): boolean;
    function setLoop(b: boolean): void;
    function getCurrentTime(): number;
    function setCurrentTime(time: any): void;
    function setStartTime(time: any): void;
    function getEndTime(): number;
}
/**
 * Created by lxz on 2017/12/18.
 */
declare module music_test {
    class Music {
        private _ac;
        private _endTime;
        private _totalTime;
        private _loaded;
        private _complete;
        private _running;
        private _loop;
        private _buffer;
        private _sourceNode;
        private _currentTime;
        private _analyser;
        private _gainnode;
        private _isPause;
        private _acStartTime;
        private _pauseTime;
        private _resList;
        constructor();
        dispose(): void;
        init(): void;
        /**
         * 播放音频
         * start        开始时间
         * end          0:播放到结束
         */
        play(start: number, end: number): void;
        pause(): void;
        /**
         * 设置音频地址
         */
        setMusicUrl(url: string): void;
        /**
         * 加载完音频
         */
        setLoaded(fun: (duration: number) => void, context?: any): void;
        /**
         * 播放一遍回调
         */
        setComplete(fun: () => void, context?: any): void;
        /******************************************************************/
        private getBuffer(buffer);
        private onError(e);
        /******************************************************************/
        loop: boolean;
        readonly running: boolean;
        currentTime: number;
        readonly endTime: number;
    }
    /**
     * 播放音频
     * start        开始时间
     * end          0:播放到结束
     */
    function play(start: number, end: number): void;
    function pause(): void;
    function dispose(): void;
    /**
     * 设置音频地址
     */
    function setMusicUrl(url: string): void;
    /**
     * 加载完音频
     */
    function setLoaded(fun: (duration: number) => void, context?: any): void;
    /**
     * 播放一遍回调
     */
    function setComplete(fun: () => void, context?: any): void;
    function isRunning(): boolean;
    function setLoop(b: boolean): void;
    function getCurrentTime(): number;
    function setCurrentTime(time: any): void;
    function getEndTime(): number;
}
/**
 * Created by lxz on 2017/12/18.
 */
declare module video {
    class Music {
        private _ac;
        private _analyser;
        private _gainnode;
        private _audio;
        private _processor;
        private _startTime;
        private _endTime;
        private _totalTime;
        private _loaded;
        private _complete;
        private _running;
        private _loop;
        constructor();
        /**
         * 播放音频
         * start        开始时间
         * end          0:播放到结束
         */
        play(start: number, end: number): void;
        pause(): void;
        /**
         * 设置音频地址
         */
        setMusicUrl(url: string): void;
        /**
         * 加载完音频
         */
        setLoaded(fun: (duration: number) => void, context?: any): void;
        /**
         * 播放一遍回调
         */
        setComplete(fun: () => void, context?: any): void;
        loop: boolean;
        readonly running: boolean;
        currentTime: number;
    }
    /**
     * 播放音频
     * start        开始时间
     * end          0:播放到结束
     */
    function play(start: number, end: number): void;
    function pause(): void;
    /**
     * 设置音频地址
     */
    function setMusicUrl(url: string): void;
    /**
     * 加载完音频
     */
    function setLoaded(fun: (duration: number) => void, context?: any): void;
    /**
     * 播放一遍回调
     */
    function setComplete(fun: () => void, context?: any): void;
    function isRunning(): boolean;
    function setLoop(b: boolean): void;
    function getCurrentTime(): number;
    function setCurrentTime(time: any): void;
}
declare module notification {
    /**
     * Created by silence on 2017/6/28.
     */
    class Notification {
        private _listenerNames;
        /**
         * 添加一个通知监听
         * @param name  通知名称
         * @param sender    接收到后执行函数
         * @param context   上下文
         * @param priority  优先级，越大越优先
         * @returns {{name: string, sender: ((...args:any[])=>any), priority: number, context: any}}    返回当前监听器的NotificationInfo
         */
        addListener(name: __Key, sender: (...args) => any, context: any, priority?: number): {
            name: string | number;
            sender: (...args: any[]) => any;
            priority: number;
            context: any;
        };
        /**
         * 是否拥有侦听
         * @param name
         * @param sender
         * @param context
         * @returns {boolean}
         */
        hasListener(name: __Key, sender: Function, context: any): boolean;
        /**
         * 移除一个监听
         * @param name
         * @param sender
         * @param context
         */
        removeListener(name: __Key, sender: Function, context: any): void;
        /**
         * 移除一个对象的所有已注册的事件
         * @param context
         */
        removeListenerByObject(context: any): void;
        /**
         * 派发通知
         * @param name
         * @param args
         */
        dispatchListener(name: __Key, ...args: any[]): void;
    }
    /**
     * 添加一个通知监听
     * @param name  通知名称
     * @param sender    接收到后执行函数
     * @param context   上下文
     * @param priority  优先级，越大越优先
     */
    function addNotification(name: __Key, sender: (...args) => void, context: any, priority?: number): void;
    /**
     * 派发通知
     * @param name
     * @param args
     */
    function postNotification(name: __Key, ...args: any[]): void;
    /**
     * 移除一个监听
     * @param name
     * @param sender
     * @param context
     */
    function removeNotification(name: __Key, sender: Function, context: any): void;
    /**
     * 移除一个对象的所有已注册的事件
     * @param context
     */
    function removeNotificationByObject(context: any): void;
}
/**
 * Created by silence on 2017/6/28.
 */
interface NotificationInfo {
    name: string;
    sender: (...args) => any;
    context: any;
    priority: number;
}
/**
 * Created by silence on 2017/6/30.
 */
declare module define {
    class Data {
        static ERROR: number;
        static USER_INFO: number;
    }
}
/**
 * Created by lxz on 2017/10/17.
 */
declare module alert {
    class Alert extends gui.BaseWindow {
        static OK: number;
        static CANCEL: number;
        static OK_CANCEL: number;
        private _message;
        private _buttons;
        private _callback;
        private _content;
        private _buttonNumController;
        constructor(message: string, buttons?: number, callback?: (...args) => void, context?: any, ...args: any[]);
        /******************************************************************/
        protected initView(): void;
        protected onClick(e: egret.TouchEvent): void;
        dispose(): void;
    }
    function createAlert(message: string, buttons?: number, callback?: (...args) => void, context?: any, ...args: any[]): Alert;
}
/**
 * Created by lxz on 2017/11/18.
 */
declare module gui {
    import GComponent = fairygui.GComponent;
    class BindProperty {
        private _keys;
        constructor();
        bindGuiProperty(context: any, com: GComponent): void;
        removeBindGuiProperty(context: any): void;
    }
    function bindGuiProperty(context: any, com: GComponent): void;
    function removeBindGuiProperty(context: any): void;
}
/**
 * Created by lxz on 2017/11/13.
 */
declare module gui {
    /**
     * 图像
     */
    class BitmapImage extends egret.Bitmap {
        private _imgLoader;
        private _complete;
        private _context;
        constructor();
        dispose(): void;
        getImgByUrl(url: any, complete?: () => void, context?: any): void;
        /******************************************************************/
        private imgLoadHandler(evt);
    }
}
/**
 * Created by lxz on 2017/10/30.
 */
declare module gui {
    /**
     * 控制台
     */
    class ConsoleList {
        private _list;
        private _texts;
        private _oList;
        constructor(list: fairygui.GList, pkgName: string, resName: string);
        addText(str: string): void;
        clear(): void;
        /******************************************************************/
        private itemRenderer(index, item);
    }
    class ConsoleItem extends fairygui.GComponent {
        private _listIndex;
        constructor();
        dispose(): void;
        constructFromResource(): void;
        setListIndex(index: any, text: any): void;
    }
}
/**
 * Created by lxz on 2017/10/10.
 */
declare module filter_lib {
    /**
     * 剪影滤镜
     */
    var jianying: egret.ColorMatrixFilter;
}
/**
 * 常用列表
 */
declare module gui {
    class GListBase {
        private _itemClick;
        private _list;
        private _type;
        private _callbackThisObj;
        constructor(list: fairygui.GList, pkgName: string, resName: string, type: any, itemRenderer: (index, item) => void, callbackThisObj: any);
        dispose(): void;
        /******************************************************************/
        private onItemClick(event);
        /******************************************************************/
        itemClick: (item) => void;
        numItems: number;
    }
}
/**
 * Created by lxz on 2018/5/8.
 */
declare module gui {
    class InputText {
        private _text0;
        private _text1;
        /**
         *
         * @param {fairygui.GTextField} text0       提示文本
         * @param {fairygui.GTextField} text1       输入文本
         */
        constructor(prompt_text: fairygui.GTextField, input_text: fairygui.GTextField);
        /******************************************************************/
        dispose(): void;
        update(): void;
        /******************************************************************/
        private onTextChange();
    }
}
declare module gui {
    class ItemViewBase {
        protected _com: fairygui.GComponent;
        protected _buttonList: fairygui.GButton[];
        protected _textList: fairygui.GTextField[];
        protected _winList: OvBase[];
        constructor(com: fairygui.GComponent);
        dispose(): void;
        update(...args: any[]): void;
        setText(index: number, text: any): void;
        getText(index: number): string;
        getTextFiled(index: number): fairygui.GTextField;
        /******************************************************************/
        protected clickByName(name: string): void;
        protected getComponent(resName: string): fairygui.GObject;
        protected onClick(e: egret.TouchEvent): void;
        protected clickHandler(index: number): void;
        /******************************************************************/
        private registerButtons(container);
        private registerTexts(container);
        private getButton(resName);
        private onTextSort(t1, t2);
    }
}
/**
 * Created by lxz on 2017/8/5.
 */
declare module define {
    class LoadUIType {
        static NONE: number;
        static NORMAL: number;
        constructor();
    }
}
/**
 * Created by lxz on 2017/8/5.
 */
declare module loadUI {
    interface ILoadUI {
        setProgress(current: number, total: number): void;
    }
    class BaseLoadingUI extends gui.OvBase implements ILoadUI {
        constructor(resName: string, modal?: boolean, center?: boolean);
        open(moduleName: string): void;
        setProgress(current: number, total: number): void;
    }
}
/**
 * Created by lxz on 2017/7/13.
 */
/**
 * 方法携带数据
 */
declare class FunctionInfo {
    fun: __Function;
    context: any;
    args: any[];
    sleep: boolean;
    constructor();
    dispose(): void;
    call(): void;
    onceCall(): void;
}
declare module gui {
    class PageTurn {
        private _itemClick;
        private _com;
        private _list;
        private _type;
        private _preBtn;
        private _nextBtn;
        private _currentPage;
        private _totalPage;
        private _onTurnPage;
        private _pageText;
        private _itemRenderer;
        private _callbackThisObj;
        private _pageNum;
        private _length;
        /**
         *  翻页
         * @param com           翻页资源 （翻页列表父级显示对象，里面包含特定组件：list,prevBtn,nextBtn,pageTxt缺一不可）
         * @param pkgName       包名
         * @param resName       对应的物件名
         * @param type          物件类型
         * @param itemRenderer  渲染物件方法 function(当前页的index，所有列表的index，item对象)
         * @param onChange      翻页触发方法
         */
        constructor(com: fairygui.GComponent, pkgName: string, resName: string, type: any, itemRenderer: (relativeIndex, index, item) => void, onTurnPage: () => void, callbackThisObj: any);
        dispose(): void;
        /******************************************************************/
        private onPageChange();
        private onItemClick(event);
        private onPre();
        private onNext();
        private itemRenderer(index, item);
        itemClick: Function;
        length: number;
        private numItems;
        currentPage: number;
        readonly totalPage: number;
        pageNum: number;
    }
}
/**
 * Created by lxz on 2017/11/21.
 */
declare module gui {
    /**
     * 滚动面板
     */
    class ScrollPanel {
        private _show_num;
        private _length;
        private _render;
        private _sIndex;
        private _lIndex;
        private _types;
        private _container;
        private _com;
        private _running;
        private _pkgName;
        private _resName;
        private _time;
        constructor(com: fairygui.GComponent, show_num: number, pkgName: string, resName: string, typeClass: {
            new (): ScrollItem;
        }, time?: number);
        dispose(): void;
        /******************************************************************/
        private clearTypes();
        private draw();
        private start();
        private stop();
        private startScroll();
        private next();
        /******************************************************************/
        length: number;
        readonly render: gui.ScrollRender;
    }
    class ScrollItem extends fairygui.GComponent {
        listIndex: number;
        constructor();
        dispose(): void;
        constructFromResource(): void;
        setListIndex(index: any): void;
        change(): void;
    }
    class ScrollRender {
        tap: number;
        /**
         * 获取位置
         */
        getPosition(index: number): {
            x: number;
            y: number;
        };
    }
}
/**
 * Created by lxz on 2017/11/17.
 */
declare module gui {
    class Slider {
        private _com;
        private _slider;
        private _prevBtn;
        private _nextBtn;
        private _text;
        private _changeFun;
        private _changeContext;
        private _minNum;
        private _maxNum;
        private _rate;
        private _showRate;
        constructor(com: fairygui.GComponent, changeFun?: () => void, changeContext?: any);
        dispose(): void;
        /******************************************************************/
        private onPrev();
        private onNext();
        private onChange();
        private mathValues();
        private refreshText();
        /******************************************************************/
        max: number;
        value: number;
        minNum: number;
        maxNum: number;
        rate: number;
        showRate: number;
    }
}
/**
 * Created by lxz on 2017/10/17.
 */
declare module tip {
    class TipItem extends extendsUI.BaseContainer {
        private _message;
        private _ui;
        private _content;
        constructor(message: string);
        private initView();
        startScroll(): void;
        dispose(): void;
    }
    class TipManager {
        private GAME_TIP_START_Y;
        _textTipCurrentY: number;
        _itemList: TipItem[];
        constructor();
        showTextTip(message: string, v?: egret.DisplayObjectContainer): void;
        /******************************************************************/
        private onGameTipClose(event);
    }
    function showTextTip(message: string, v?: egret.DisplayObjectContainer): void;
}
/**
 * Created by silence on 2017/7/1.
 */
declare module gui {
    import GComponent = fairygui.GComponent;
    class UIAnimation {
        component: GComponent;
        inClose: boolean;
        show(callback: any, context: any, ...args: any[]): void;
        close(callback: any, context: any, ...args: any[]): void;
        dispose(): void;
    }
    /**
     * 弹窗模式(透明度渐变居中大小变化)
     */
    class BoxAnimation extends UIAnimation {
        dispose(): void;
        show(callback: any, context: any, ...args: any[]): void;
        close(callback: any, context: any, ...args: any[]): void;
        private lastScaleX;
        private lastScaleY;
    }
    /**
     * 主窗口模式(从左到右)
     */
    class SceneAnimation extends UIAnimation {
        private _orienX;
        show(callback: any, context: any, ...args: any[]): void;
        close(callback: any, context: any, ...args: any[]): void;
    }
}
declare module app_sound {
    /**
     * 播放特效音乐
     */
    function playEffect(res: any, volume?: number): void;
    /**
     * 播放背景音乐
     */
    function playBGM(name: string): void;
    /**
     * 暂停背景音乐
     */
    function pauseBGM(): void;
    /**
     * 继续背景音乐
     */
    function resumeBGM(): void;
    class SoundManager {
        /**
         * 背景音乐音量
         */
        volume: number;
        private _lastMusic;
        private _soundChannel;
        private _sound;
        constructor();
        init(stage: egret.Stage): void;
        /******************************************************************/
        /**
         * 播放特效音乐
         */
        playEffect(res: any, volume?: number): void;
        /**
         * 播放背景音乐
         */
        playBGM(name: string): void;
        /**
         * 暂停背景音乐
         */
        pauseBGM(): void;
        /**
         * 继续背景音乐
         */
        resumeBGM(): void;
        /**
         * 释放音乐资源
         */
        disposeSound(): void;
        /******************************************************************/
        private onBlur();
        private onFocus();
    }
}
/**
 * Created by lxz on 2017/11/2.
 */
declare module bind {
    class Binding {
        bindFunciotnNamePre: string;
        constructor();
        /**
         * 绑定一个对象的属性值到要监视的对象属性上。
         * @param host 用于承载要监视的属性或属性链的对象。
         * 当 <code>host</code>上<code>chain</code>所对应的值发生改变时，<code>target</code>上的<code>prop</code>属性将被自动更新。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 <code>host.a.b.c</code>，需按以下形式调用此方法：<code>bindProperty(host, ["a","b","c"], ...)。</code>
         * @param target 本次绑定要更新的目标对象。
         * @param prop 本次绑定要更新的目标属性名称。
         * @returns 如果已为 chain 参数至少指定了一个属性名称，则返回 Watcher 实例；否则返回 null。
         */
        bindProperty(host: any, chain: string[], target: any, prop: string): void;
        /**
         * 绑定一个回调函数到要监视的对象属性上。当 host上 chain 所对应的值发生改变时，handler 方法将被自动调用。
         * @param host 用于承载要监视的属性或属性链的对象。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 host.a.b.c，需按以下形式调用此方法：bindSetter(host, ["a","b","c"], ...)。
         * @param handler 在监视的目标属性链中任何属性的值发生改变时调用的事件处理函数。
         * @param thisObject handler 方法绑定的this对象
         */
        bindHandler(host: any, chain: string[], handler: (value: any) => void, thisObject: any): void;
        removeBind(host: any, chain: string[], target: any, prop: string | ((value: any) => void)): void;
        removeBindByObject(target: any): void;
        /**
         * 改变值
         */
        sendBind(context: any, prop: string): void;
        changeValue(context: any, prop: string, value: any): void;
        /******************************************************************/
        private getHostInfo(host, chain);
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
    function bindProperty(host: any, chain: string[], target: any, prop: string): void;
    /**
     * 绑定一个回调函数到要监视的对象属性上。当 host上 chain 所对应的值发生改变时，handler 方法将被自动调用。
     * @param host 用于承载要监视的属性或属性链的对象。
     * @param chain 用于指定要监视的属性链的值。例如，要监视属性 host.a.b.c，需按以下形式调用此方法：bindSetter(host, ["a","b","c"], ...)。
     * @param handler 在监视的目标属性链中任何属性的值发生改变时调用的事件处理函数。
     * @param thisObject handler 方法绑定的this对象
     */
    function bindHandler(host: any, chain: string[], handler: (value: any) => void, thisObject: any): void;
    /**
     * 改变值
     */
    function sendBind(context: any, prop: string): void;
    function changeValue(context: any, prop: string, value: any): void;
    /**
     * 解除对指定属性的指定绑定
     */
    function removeBind(host: any, chain: string[], target: any, prop: string | ((value: any) => void)): void;
    /**
     * 解除target身上的所有绑定
     * @param target
     */
    function removeBindByObject(target: any): void;
}
/**
 * Created by lxz on 2017/9/1.
 */
declare module gameTool {
    class CustomTimer extends egret.Timer {
        private _runFun;
        private _completeFun;
        constructor(delay: number, repeatCount?: number);
        dispose(): void;
        /******************************************************************/
        restart(): void;
        setRunCall(fun: (...args) => any, context: any, ...args: any[]): void;
        setRunArgs(...args: any[]): void;
        setCompleteCall(fun: (...args) => any, context: any, ...args: any[]): void;
        setCompleteArgs(...args: any[]): void;
        /******************************************************************/
        private onTimer();
        private onTimerComplete();
        /******************************************************************/
        readonly surplus: number;
    }
}
/**
 * Created by lxz on 2018/3/26.
 */
declare module dateTool {
    /**
     * 获取当年当月的天数
     * @param year      0:是当前年
     * @param month     0:是当前月
     * @returns {number}
     */
    function getCountDays(year?: number, month?: number): number;
    /**
     * 获取几分几秒
     * time 秒
     */
    function getTime0(time: number): string;
    /**
     * 获取几分几秒几毫秒
     * time 毫秒
     */
    function getTime1(time: number): string;
    /**
     * 由时间格式2000-1-1-6-30-30获取总的时间毫秒
     */
    function timestrToTime(timestr: string): number;
    /**
     * 由时间格式2000-1-1-6-30-30
     * 判断时间格式在不在当前时间范围内
     */
    function inTime(time: number, timestr1: string, timestr2: string): boolean;
}
/**
 * Created by lxz on 2017/6/28.
 */
declare module definiton {
    /**
     * 获取指定类的类型
     * @param name 类型名称
     * @param defaultType 默认类型
     * @returns {any}
     */
    function getDefinitionType<T>(name: string): T;
    /**
     * 获取指定类的实例
     * @param args 类型构造函数参数列表
     * @param name 类型名称
     * @param defaultType 默认类型
     * @param args 类型构造函数参数列表
     * @returns {null}
     */
    function getDefinitionInstance<T>(name: string, ...args: any[]): T;
    /**
     * 是否是class类型
     */
    function isClass(obj: any): boolean;
    /**
     * 根据实例获取类名称
     */
    function getClassNameByObject(obj: any): string;
    /**
     * 根据实例获取类
     */
    function getClassByObject(obj: any): any;
    /**
     * 根据类型获取类名
     */
    function getNameByClass(keyClass: any): any;
    /**
     * 判断是否拥有该方法
     */
    function hasProperty(obj: any, property: string): boolean;
    /**
     * 判断该类型是不是继承其他类型
     */
    function isExtends(parent: any, son: any): boolean;
    /**
     * 获取某个实例的属性value
     */
    function getProperty<T, K extends keyof T>(o: T, name: K): T[K];
    /**
     * 获取某个实例的属性value集合
     */
    function pluckPropertys<T, K extends keyof T>(o: T, names: K[]): T[K][];
}
/**
 * Created by lxz on 2017/11/15.
 */
declare module delay {
    class DelayTransactManager {
        private _delayMainList;
        private _delayTransactList;
        constructor();
        /**
         * 创建延迟事务主体
         */
        createDelayMain(context: any): void;
        /**
         * 是否拥有事务主体
         */
        hasDelayMain(context: any): boolean;
        /**
         * 创建延迟事务
         */
        addDelayTransact(context: any, fun: __Function, ...args: any[]): void;
        /**
         * 执行所有延迟事务
         */
        executeAllTransact(context: any): void;
        /**
         * 是否拥有延迟事务
         */
        hasTransact(context: any): boolean;
    }
    /******************************************************************/
    /******************************************************************/
    /******************************************************************/
    /**
     * 创建延迟事务主体
     */
    function createDelayMain(context: any): void;
    /**
     * 是否拥有事务主体
     */
    function hasDelayMain(context: any): boolean;
    /**
     * 创建延迟事务
     */
    function addDelayTransact(context: any, fun: __Function, ...args: any[]): void;
    /**
     * 执行所有延迟事务
     */
    function executeAllTransact(context: any): void;
    /**
     * 是否拥有延迟事务
     */
    function hasTransact(context: any): void;
}
/**
 * Created by brucex on 16/5/26.
 */
declare module gameTool {
    /**
     * 获取显示对象的base64
     * @param {egret.DisplayObject} obj
     * @returns {string}
     */
    function renderTexture(obj: egret.DisplayObject): string;
    interface Scale {
        x: number;
        y: number;
    }
    class display {
        /**
         * 设置显示对象的相对描点
         * @param disObj 需要设置描点的显示对象
         * @param anchorX X轴相对描点
         * @param anchorY Y轴相对描点
         */
        static setAnchor(disObj: egret.DisplayObject, anchorX: number, anchorY?: number): void;
        static readonly stageW: number;
        static readonly stageH: number;
        static pointInScreen(targetObj: egret.DisplayObject, x: number, y: number): boolean;
        static inScreen(displayObj: egret.DisplayObject): boolean;
        static setFullDisplay(display: egret.DisplayObject): void;
        static getStagePosition(anchorX: number, anchorY?: number): any;
        static setPositionFromStage(obj: egret.DisplayObject, anchorX?: number, anchorY?: number): void;
        static sort(container: egret.DisplayObjectContainer): void;
        static findTypeParent<T>(display: any, type: {
            new (): T;
        }): T;
        /**
         * 移除容器中的所有子显示对象
         * @param container 需要移除子显示对象的容器
         */
        static removeAllChildren(container: egret.DisplayObjectContainer): void;
        /**
         * 将源显示对象中的位置转换成目标对象中的位置
         * @param x 源显示对象x轴
         * @param y 源显示对象y轴
         * @param source 源显示对象
         * @param dist 目标显示对象
         * @returns {egret.Point}
         */
        static localTolocal(x: any, y: any, source: any, dist: any, p?: egret.Point): egret.Point;
        static getScale(obj: egret.DisplayObject): Scale;
    }
}
/**
 * Created by lxz on 2017/12/20.
 */
declare module gameTool {
    class Download {
        private _element;
        constructor();
        download(href: string, name?: string): void;
    }
    function copy(str: string): void;
    function download(href: string, name?: string): void;
}
/**
 * Created by lxz on 2017/8/10.
 */
declare module js_tool {
    class jsLoader {
        startApp(jscode: string[], complete: () => void, context: any): void;
        private static _instance;
        private importList;
        private importScriptsList;
        private totaltask;
        private _complete;
        private _process;
        static instance(): jsLoader;
        preload(complete: () => void, process?: (total: number, left: number) => void): void;
        /**
         * 卸载掉
         * @param complete
         * @param process
         */
        reload(complete: () => void, process?: (total: number, left: number) => void): void;
        addImportScript(path: string): void;
        /******************************************************************/
        private static getXHR();
        private onAllLoadComplete();
        private startLoadScript(e);
        private loadScriptError(e);
    }
    function startApp(jscode: string[], complete: () => void, context: any): void;
    function preload(complete: () => void, process?: (total: number, left: number) => void): void;
}
/**
 * 循环计时器
 */
declare module tick {
    class Loop {
        private _ticks;
        private _removeTicks;
        private _time;
        private _timer;
        constructor(delay: any);
        dispose(): void;
        start(delay?: number): void;
        stop(): void;
        startTick(fun: (...args) => any, context: any): void;
        stopTick(fun: (...args) => any, context: any): void;
        stopTickByContext(context: any): void;
        /************************************************************************************************************************/
        private onTicker();
        private getRemoveTicks(id);
        private removeTicks();
    }
}
/**
 * Created by lxz on 2017/10/19.
 */
declare module map {
    /**
     * mapinfo的data管理
     */
    class MapData<T extends face.IMapInfo> {
        private _keys;
        private _map;
        private _info;
        constructor(keys: __KeyOf<T>[]);
        dispose(): void;
        setValue(pro: keyof T, value: any): MapData<T>;
        /******************************************************************/
        info: T;
        map: map.MapList<T>;
    }
    /******************************************************************/
    /******************************************************************/
    /******************************************************************/
    class MapList<T extends face.IMapInfo> {
        private _mapList;
        private _infoClass;
        private _keys;
        /**
         * 指定数据的map列表(列表包含数据列表。可指定info键值获取一个map。map根据键值对应的值指向一个数据列表)
         * @param infoClass     数据类
         * @param keys          对应的value值需要初始化
         */
        constructor(infoClass: any, keys: __KeyOf<T>[]);
        dispose(): void;
        /**
         * 获取一个新的数据(变动的值要使用data的setValue赋值)
         */
        getNewMapData(): MapData<T>;
        /**
         * 添加map一个值
         */
        add(o: MapData<T>): void;
        /**
         * 移除map一个值
         */
        remove(o: MapData<T>): void;
        addByPro(o: MapData<T>, pro: keyof T): void;
        removeByPro(o: MapData<T>, pro: keyof T): void;
        /**
         * 根据索引获取数据
         */
        getMapData(index: number): MapData<T>;
        /**
         * 获取指定数据列表
         */
        getMapDatas(pro: keyof T, value: any): MapData<T>[];
        /**
         * 获取指定数据
         */
        getMapDataByPro(pro: keyof T, value: any): MapData<T>;
        /******************************************************************/
        private getValueKey(value);
        /******************************************************************/
        /**
         * 获取数据长度
         */
        readonly length: number;
    }
}
/**
 *
 * @author
 *
 */
declare module mathTool {
    /**
     *  根据限制内对数字上下取整
     */
    function getValueByLimit(value: number, limit?: number): number;
    /**
     * 高斯函数
     * 高斯函数的图形在形状上像一个倒悬着的钟。a是曲线的高度，b是曲线中心线在x轴的偏移，c是半峰宽度（函数峰值一半处相距的宽度）。
     */
    function gaussian(dist: any, a?: number, b?: number, c?: number): number;
    /**
     * 求和
     */
    function sum(arr: any[], propertyName?: string): number;
    /**
     * 获取number
     */
    function parseNumber(num: __Key): number;
    /**
     * 两个数组是否相等
     */
    function equalArray(array1: any[], array2: any[]): boolean;
    /**
     * 打乱数组
     */
    function shuffle<T>(array: T[]): T[];
    /**
     * 返回数组里的某个字段对应值得索引
     */
    function indexOfMap(arr: any[], propertyName: string, value: any): number;
    /**
     * 返回数组里的某个字段的列表
     */
    function pluck<T>(arr: T[], propertyName: string): any[];
    /**
     * 返回数组里符合方法判定的item
     */
    function find<T>(arr: T[], fun: (item: T, index: number) => boolean, context?: any): T;
    /**
     * 返回数组里符合方法判定的item列表
     */
    function findList<T>(arr: T[], fun: (item: T, index: number) => boolean, context?: any): T[];
    /**
     *  筛选数组里item与obj相等的item列表
     */
    function where<T>(arr: T[], obj: any): T[];
    /**
     *  筛选数组里item与obj相等的item
     */
    function findWhere<T>(arr: T[], obj: any): T;
    /**
     * 判断arr里是否有符合obj的item
     */
    function contains<T>(arr: T[], obj: (value: T, index: number, array: T[]) => boolean | T): boolean;
    function distance(x1: number, y1: number, x2: number, y2: number): number;
    function getBoolean(): boolean;
    function radianToAngle(num: number): number;
    function angleToRadian(num: number): number;
    function cutValueByArray(value: any, arr: any[]): boolean;
    function addValueByArray(value: any, arr: any[]): boolean;
    function getArrayRandom<T>(arr: T[]): T;
    function getArrayRandomValue<T>(arr: T[]): T;
    function randomValue(value1: number, value2: number): number;
    function randomArray<T>(arr: T[]): T[];
    function randomArrayCopy<T>(arr: T[]): T[];
    /**
     * 复制数组
     */
    function getArrCopy<T>(arr: T[]): T[];
    function handlerMath(value: number, limit: number, interval: number, isAdd: boolean): number;
    function randomRateValue(arr: number[], base?: number): number;
    function autoRandomRateValue(arr: number[]): number;
    function getAtaru(value: number): boolean;
    function getMeanNum(num: number): number;
    function randomSort(a: any, b: any): number;
    /**
     * 从数组中取n个数有多少种组合
     * @param arr       原始数组：int *arr
     * @param start     遍历的起始位置：int start
     * @param result    另一个存放下标的数组：int *result
     * @param index     数组result中的索引：int index(其实就是下一步要从数组里挑选几个数的意思)
     * @param n         取多少个数：int n
     * @param arr_len   原始数组的长度：int arr_len
     */
    function combineArrayByNum(arr: any[], start: number, result: number[], index: number, arr_len: number, combine: (result: any[]) => void, context: any): void;
}
/**
 * Created by lxz on 2017/9/7.
 */
declare module objTool {
    /**
     *  获取对象的属性值
     *  没有该属性值时返回默认值
     */
    function getValueByObjectKey(obj: any, key: string, defalut: any): any;
    /**
     * 是否相等
     */
    function hasSameObj<T>(item: T, obj: any): boolean;
    /**
     * 是否拥有obj的属性
     */
    function hasObjProperty<T>(item: T, obj: any): boolean;
    /**
     * 映射赋值
     * dynamic 是否为item动态添加属性
     */
    function mapObjProperty<T>(item: T, obj: any, dynamic?: boolean): T;
    /**
     * 映射赋值
     * dynamic 是否为item动态添加属性
     */
    function mapObjPropertyToNew<T>(itemClass: {
        new (): T;
    }, obj: any, dynamic?: boolean): T;
    function mapSingleProperty(item: any, obj: any, key: any): void;
}
/**
 * 伪随机数工具
 * Created by wjr on 16/4/23.
 */
declare class RandomUtil {
    private static M;
    /**
     * 获取一个伪随机数
     * @param seed  随机种子(固定的种子得到固定的数据)
     * @param index 最忌索引(需要第几个随机数)
     *  @param m     随机周期(必须是一个素数)
     */
    static getRandom(seed: number, index: number, m?: number): number;
    /**
     * 获取一个伪随机数
     * @param seed  随机种子
     * @param index 最忌索引(需要第几个随机数)
     * @param m     随机周期(必须是一个素数)
     */
    static getRandomRate(seed: number, index: number, m?: number): number;
    /**
     * 获取指定数量指定范围的随机数
     * @param seed  随机种子
     * @param m     随机因子(必须是素数)
     * @param num   随机数的数量
     * @param max   随机数的最大值
     * @returns {Array<number>}
     */
    static getRandomNum(seed: number, m: number, num: number, max: number, min?: number, except?: number): Array<number>;
    /**
     * 获取指定数量的素数
     * @param num1 起始个数
     * @param num2 终止个数
     */
    static getPrime(num1: number, num2: number): Array<number>;
    static getRandomInt(min: number, max: number): number;
}
declare module sound {
    /**
     *
     */
    /**
     * 播放特效音乐
     */
    function playSound(res: any, volume?: number): void;
    /**
     * 背景音乐是否开着
     */
    function isMusicOpen(): boolean;
    /**
     * 特效音乐是否开着
     */
    function isEffectOpen(): boolean;
    /**
     * 背景音乐开关切换
     */
    function switchMusic(): void;
    /**
     * 特效音乐开关切换
     */
    function switchEffect(): void;
    /**
     * 播放特效音乐
     */
    function playEffect(res: any, volume?: number): void;
    /**
     * 播放背景音乐
     */
    function playBGM(name: string): void;
    /**
     * 暂停背景音乐
     */
    function pauseBGM(): void;
    /**
     * 继续背景音乐
     */
    function resumeBGM(): void;
    class SoundManager {
        /**
         * 背景音乐音量
         */
        volume: number;
        private _lastMusic;
        private _soundChannel;
        private _sound;
        constructor();
        init(stage: egret.Stage): void;
        /******************************************************************/
        /**
         * 背景音乐是否开着
         */
        isMusicOpen(): boolean;
        /**
         * 特效音乐是否开着
         */
        isEffectOpen(): boolean;
        /**
         * 背景音乐开关切换
         */
        switchMusic(): void;
        /**
         * 特效音乐开关切换
         */
        switchEffect(): void;
        /**
         * 播放特效音乐
         */
        playEffect(res: any, volume?: number): void;
        /**
         * 播放背景音乐
         */
        playBGM(name: string): void;
        /**
         * 暂停背景音乐
         */
        pauseBGM(): void;
        /**
         * 继续背景音乐
         */
        resumeBGM(): void;
        /**
         * 释放音乐资源
         */
        disposeSound(): void;
        /******************************************************************/
        private onBlur();
        private onFocus();
        private playMusic();
        private soundLoaded();
    }
}
/**
 * Created by lxz on 2017/8/22.
 */
declare module tick {
    var running: boolean;
    class TickManager {
        private _ticks;
        private _removeTicks;
        private _time;
        constructor();
        start(): void;
        stop(): void;
        startTick(fun: (...args) => any, context: any): void;
        stopTick(fun: (...args) => any, context: any): void;
        stopTickByContext(context: any): void;
        /************************************************************************************************************************/
        private onTicker(time);
        private getRemoveTicks(id);
        private removeTicks();
    }
    /************************************************************************************************************************/
    function start(): void;
    function stop(): void;
    function startTick(fun: (...args) => any, context: any): void;
    function stopTick(fun: (...args) => any, context: any): void;
    function stopTickByContext(context: any): void;
}
/**
 * 全局消息定义
 * Created by silence on 2017/6/30.
 */
declare module define {
    class Notice {
        static DATA_UPDATE: string;
        static CHANGE_DATA: string;
        static OPEN_MODULE: string;
        static MAP_VALUE_ADD: string;
        static MAP_VALUE_REMOVE: string;
    }
}
/**
 *
 * @author
 *
 */
declare module trace {
    function error(txt: string, arr?: any[]): void;
    function traceData(arr: any[]): void;
    function parseData(arr: any[]): string;
    function parseObject(obj: any): string;
}
/**
 * Created by lxz on 2017/11/2.
 */
declare module twwentool {
    /**
     * 数字滚动
     * @param textfiled
     * @param startValue
     * @param endValue
     * @param time
     * @returns {Tween}
     */
    function playNum(textfiled: any, endValue: number, time?: number, startValue?: number): egret.Tween;
}
/**
 * Created by lxz on 2017/10/30.
 */
declare module config {
    class BSV implements face.IConfigParser {
        private _data;
        private _headerTypes;
        private _headers;
        private _headerList;
        private _flagBit;
        private _posDataList;
        private _keyList;
        private _items;
        private _isBig;
        constructor(big?: boolean);
        getType(p_fieldName: string): string;
        decode(): void;
        getRecords(): any[];
        parseItem(keyValue: any): {};
        /******************************************************************/
        /**
         * 解析数据
         */
        private parseBuffer();
        /******************************************************************/
        data: ArrayBuffer;
        readonly keyList: any[];
    }
}
/**
 * Created by lxz on 2017/10/25.
 */
declare module config {
    class BaseConfig<T> extends egret.HashObject {
        protected typeDataClass: any;
        protected keyPropName: any;
        protected data: any;
        protected _dic: any;
        protected allDecoded: boolean;
        protected useByteSrc: boolean;
        protected config: face.IConfigParser;
        private _keys;
        constructor(p_typeDataClass: any, p_keyPropName: any);
        /**
         * 获取类型数据
         */
        getTypeData(key: any): T;
        /**
         * 获取数据集合
         */
        readonly dic: Object;
        parseAll(): void;
        /******************************************************************/
        protected transformItem(typeData: T, itemData: any): void;
        protected getKeyValue(item: T): string;
        /******************************************************************/
        readonly keys: any[];
        /**
         * 设置数据源
         */
        dataSource: any;
    }
}
/**
 */
declare module config {
    class CSV implements face.IConfigParser {
        private FieldSeperator;
        private FieldEnclosureToken;
        private RecordsetDelimiter;
        private Header;
        private HeaderType;
        private EmbededHeader;
        private HeaderOverwrite;
        private ResolveHeaderType;
        private HeaderTypeDic;
        private _comment;
        private _headerLineNum;
        private SortField;
        private SortSequence;
        constructor();
        private _data;
        private content;
        decode(): void;
        /**
         * 获取字段类型
         */
        getType(p_fieldName: string): string;
        /**
         * 返回经过Object化的数据集，<b>header必须有值</b>
         */
        getRecords(): any[];
        /**
         *   TODO Public method description ...
         *
         *   @param needle String or Array
         *   @return Array
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        search(needle: any, removeDuplicates?: Boolean): any[];
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
        sort(fieldNameOrIndex?: any, sequence?: string): void;
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
        private fieldDetection(element, index, arr);
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
        private sort2DArray(a, b);
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
        private isValidRecord(element, index, arr);
        dump(): string;
        data: any;
        fieldSeperator: string;
        /**
         *   TODO Getter description ...
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        fieldEnclosureToken: string;
        /**
         *   TODO Setter description ...
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        recordsetDelimiter: string;
        /**
         *   是否有嵌入字段头部
         */
        /**
         *   是否有嵌入字段头部，默认为true
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        embededHeader: boolean;
        /**
         *   是否重写字段头部，默认为false
         */
        /**
         *   是否重写字段头部，默认为false
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        headerOverwrite: boolean;
        /**
         *   是否有解析字段类型，默认为false
         */
        /**
         *   是否有解析字段类型，默认为false
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        resolveHeaderType: boolean;
        /**
         * 注释标识
         */
        /**
         * 注释标识
         */
        comment: string;
        /**
         * 表示字段头部的基于有效记录的行号，默认为0
         */
        /**
         * 表示字段头部的基于有效记录的行号，默认为0
         */
        headerLineNum: number;
        /**
         *   字段头部
         */
        /**
         *   字段头部
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        header: any;
        readonly headerHasValues: boolean;
        readonly dataHasValues: boolean;
    }
}
/**
 * Created by lxz on 2017/10/25.
 */
declare module config {
    class LuaObjUtil {
        constructor();
        private static exp;
        private static valueRule;
        /**
         * 过滤引号范围内
         */
        private static quotationRule1;
        /**
         * 解析引号包围的字符串
         */
        private static quotationRule3;
        private static OBJECT_SIGN;
        /**
         * 解析Lua字串
         * 格式{a=123}
         */
        static parse(p_str: string): any;
        private static parseItem(p_str, p_dic);
        private static parseQuotation(p_str, exp, dic);
    }
}
/**
 * Created by lxz on 2017/10/25.
 */
declare module config {
    class StringUtil {
        constructor();
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
        static count(haystack: string, needle: string, offset?: number, length?: number): number;
        /**
         * 获取文件名
         * @param p_url 路径
         * @param p_suff 是否带后缀
         * @return
         */
        static getFileName(p_url: string, p_suff?: Boolean): string;
        /**
         * 获取URL的扩展名(以小写返回)
         */
        static getExtendsName(p_url: string): string;
        /**
         * 获得文件目录
         */
        static getSourcePath(p_url: string, p_sign?: Boolean): string;
        static trim(str: string): string;
        static getType(p_url: string): string;
    }
}
/**
 * Created by lxz on 2017/10/17.
 */
/**
 * Created by lxz on 2017/8/3.
 */
declare module loadUtil {
    var packName: any;
    class Loader {
        /**
         * 加载进度界面
         * loading process interface
         */
        private _loadingView;
        private _groupName;
        private _groupListens;
        private loadRes;
        constructor();
        /**
         * 加载资源组
         * @param group     资源组名称
         * @param fun       回调函数
         * @param context   上下文
         * @param args      参数
         */
        loadGroup(group: string, loadingView: {
            new (): loadUI.BaseLoadingUI;
        }, fun: (...args) => any, context: any, ...args: any[]): void;
        private desGroup(str);
        loadResource(path: string, dataFormat: string, complete: (res) => void, context: any): void;
        /******************************************************************/
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        private onItemLoadError(event);
        /**
         * 资源组加载出错
         * Resource group loading failed
         */
        private onResourceLoadError(event);
        /**
         * preload资源组加载进度
         * loading process of preload resource
         */
        private onResourceProgress(event);
    }
    /**
     * 加载资源组
     */
    function loadGroup(group: string, loadingView: {
        new (): loadUI.BaseLoadingUI;
    }, fun: (...args) => any, context: any, ...args: any[]): void;
    function loadResource(path: string, dataFormat: string, complete: (res) => void, context: any): void;
    /**
     * 加载一个配置文件
     */
    function loadConfigItem(path: string, complete: (res) => void, context: any): void;
    /**
     * 加载配置文件列表
     */
    function loadConfigItems(paths: string[], complete: () => void, context1: any, parses?: ((res) => void)[], context2?: any, index?: number): void;
}
/**
 * Created by lxz on 2017/8/5.
 */
declare module loadUtil {
    class LoadUIType {
        static NONE: number;
        static NORMAL: number;
        constructor();
    }
}
