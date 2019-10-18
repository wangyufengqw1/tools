declare class LoadViewBase extends loadUI.BaseLoadingUI {
    constructor(name: string);
    private txt;
    private imag;
    private _initWidth;
    /**
     * 初始化
     */
    initView(): void;
    /**
     * 进度条加载
     */
    setProgress(current: number, total: number): void;
}
declare module base {
    class BaseAlert extends gui.OvBase {
        private _message;
        private _button;
        private _callback;
        static OK: number;
        static CANCEL: number;
        static OK_CANCEL: number;
        constructor(res: string, name: string, message: string, button?: number, callback?: (...args) => void, context?: any, ...args: any[]);
        private btn;
        private bar;
        private txt;
        private select;
        protected initView(): void;
        protected onClick(e: egret.TouchEvent): void;
        dispose(): void;
    }
    class FunctionInfo {
        fun: string | ((...args) => any);
        context: any;
        args: any[];
        sleep: boolean;
        dispose(): void;
        call(): void;
        onceCall(): void;
    }
}
declare class CallBackVo {
    handeler: Function;
    thisObj: any;
    arg: any;
    once: boolean;
    constructor(_handler?: Function, _thisObj?: any, ..._arg: any[]);
    apply(...arg: any[]): any;
    free(): void;
}
declare class CEvent extends egret.Event {
    /**
     * 自定义参数
     */
    protected _data: any;
    /**
     * 构造
     * @param	p_type			事件名
     * @param	p_data			单元数据
     * @param	p_bubbles		是否参与冒泡
     * @param	p_cancelable	是否可以取消 Event 对象
     */
    constructor(p_type: string, p_data?: any, p_bubbles?: boolean, p_cancelable?: boolean);
    /**
     * 自定义数据.
     * 发送事件时会将此数据一起发送出去，侦听事件的对象可以通过e.data来获得发送的数据。
     */
    readonly data: any;
}
declare class GameEvent {
    /**************************前后端交互信息*****************************/
    /**
     * (登陆) (open_id)  (是否登陆成功的msg)
     */
    static Login: string;
    /**
     * 登陆验证
     */
    static AaAccountVerify: string;
    /**
     * 注册
     */
    static CreateAaminiAccount: string;
    /**
     * （获取用户信息） (openId)  (errorCode（0.ok,1用户不存在，2，其他错误）)
     */
    static GetAaminiAccountInfo: string;
    /**
     * 回到游戏大厅
     */
    static GetRenshu: string;
    /**
     * 选择头像
     */
    static ChooseIcon: string;
    /**
     * 请求打开对应的游戏
     */
    static getingame: string;
    /**
     * 回复是否掉线
     */
    static Getdiaoxianjiance: string;
    static kickout: string;
    static Logout: string;
    static AddCoins: string;
    static Loginbyurl: string;
    static getxintiaobao: string;
    static xiantao: string;
    static connect: string;
    static diaoxian: string;
    static weihu: string;
    static loginTrue: string;
    /***********前端********** */
    static web_closeDoor: string;
}
declare module api {
    class Alert extends gui.OvBase {
        private _message;
        private _button;
        private _callback;
        static OK: number;
        static CANCEL: number;
        static OK_CANCEL: number;
        constructor(message: string, button?: number, callback?: (...args) => void, context?: any, ...args: any[]);
    }
    function createAlert(message: string, buttons?: number, callback?: (...args) => void, context?: any, ...args: any[]): Alert;
}
declare module api {
    class GlobalAPI {
        static localData: ILocalData;
        static webSocket: INetWork;
        static userData: IUserData;
        static soundManager: SoundManagers;
        static publicApi: PublicAPi;
        /**
         * 模块管理
         */
        static moduleManager: ModuleManager;
        static initView(value: egret.Stage): void;
    }
}
declare module api {
    interface ILocalData {
        get(item: string): string;
        set(item: string, value: string): any;
        remove(item: string): any;
    }
    class LocalData implements ILocalData {
        get(item: string): string;
        set(item: string, value: any): void;
        remove(item: string): void;
    }
}
declare module api {
    interface INetWork {
        login(parm?: any): any;
        connectServer(host: string, callback: (msg: any) => void, param?: any): any;
        notify(event: string, param: any): any;
        request(op: string, param?: any, calllback?: (msg: any) => void, err?: (event: string, code: number, msg: string) => void): any;
        on(op: string, callback: (msg: any) => void, err?: (event: string, code: number, msg: string) => void): any;
        off(op: string, callback?: (msg: any) => void): any;
        connected(host: string, port: number): boolean;
        requestLost(): void;
        close(): void;
    }
    class Network implements INetWork {
        private webSocket;
        private host;
        private port;
        private callbacks;
        private requests;
        private losts;
        private showMessage;
        private loginparam;
        private loginCallback;
        private reconnect;
        private timer;
        private handledMsg;
        private requestid;
        /**
         * 登陆
         */
        login(p: {
            openId: string;
        }): void;
        /**
         * 连接服务器
         */
        connectServer(host: string, callback: (msg: any) => void, param?: any): void;
        notify(event: string, param: any): void;
        request(op: string, param?: any, calllback?: (msg: any) => void, err?: (event: string, code: number, msg: string) => void): void;
        /**
         * 添加消息监听
         */
        on(op: string, callback: (msg: any) => void, err?: (event: string, code: number, msg: string) => void): void;
        /**
         * 移除消息监听
         */
        off(op: string, callback?: (msg: any) => void): void;
        /**
         * 是否连接服务器
         */
        connected(host: string, port: number): boolean;
        requestLost(): void;
        close(): void;
        private connect(host, port);
        private onReceiveMessage();
        private timeCheck();
        private write(head, message);
        private onSocketOpen();
        private onClosed();
        private onError(error);
        private defaultErrCb(event, code, msg);
    }
}
declare module api {
    interface IUserData {
        setUserName(value: string): void;
        getUserName(): string;
        setUserCoins(value: number): any;
        getUserCoins(): number;
        setUserIcon(value: number): void;
        getUserIcon(): number;
        getOpenId(): string;
        setOpenId(value: string): void;
    }
    class UserData implements IUserData {
        private $userName;
        private $coins;
        private $icon;
        private $openId;
        setUserName(value: string): void;
        getUserName(): string;
        setUserCoins(value: number): void;
        getUserCoins(): number;
        setUserIcon(value: number): void;
        getUserIcon(): number;
        getOpenId(): string;
        setOpenId(value: string): void;
    }
}
declare class PublicAPi {
    constructor();
    /**
     * 全局监听的消息
     */
    private initEvent();
    /**
     * 后端掉线询问
     */
    private diaoxian();
    /**
     * 掉线通知
     */
    private kickoutF(data);
    private regedEvebt;
    /**
    * 后端消息接听初始化
    */
    private eventInit();
    /**
     * 消息移除
     */
    private eventRemove();
    private gameEvebt;
    /**
     * 添加后端消息监控
     */
    addGameEvebt(name: string, k: string, _fun: Function, arg: any): void;
    /**
     * 游戏初始化
     */
    gameEvebtInit(name: string): void;
    /**
     * 移除游戏中的消息
     */
    removeGameEvbt(name: string): void;
    private allRemoveEvbt();
    dispose(): void;
    /**
     * 替换名字
     */
    changeName(str: string): string;
    /**
     * 登录界面继续游戏
     */
    contineGame(data: any): void;
    /**
     * 播放该物件下的所有动画
     */
    playAllMc(value: fairygui.GComponent, callBack?: CallBackVo): void;
    /**
     * 播放动画
     */
    playMc(value: fairygui.GComponent, callBack?: CallBackVo): void;
    comebackDoor(): void;
    isOnlie: number;
    isRelease: boolean;
}
declare class SoundManagers {
    /**
     * 背景音乐音量
     */
    volume: number;
    effvolume: number;
    private _lastMusic;
    private _soundChannel;
    private _sound;
    constructor(stage: egret.Stage);
    /********************************音效*********************************** */
    _soundFlag: boolean;
    changeSound(p_flag: boolean): void;
    /**
     * 播放特效音乐
     */
    playEffect(res: any, volume?: number): void;
    playEffectBuYrl(p_url: string, p_loop?: number, p_volume?: number): egret.Sound;
    /*****************************音乐*******************************/
    _musicFlag: boolean;
    changeMusic(p_flag: boolean, str: string): void;
    /**
     * 游戏界面音乐
     */
    private isInPlay;
    playRedBGM(notRec: boolean, str: string): void;
    /**
     * 播放音乐
     */
    playBGM(name: string, notRec?: boolean): void;
    /**
     * 暂停背景音乐
     */
    private isPause;
    private pauseMusic;
    pauseBGM(): void;
    /**
     * 继续播放音乐
     */
    resumeBGM(): void;
    /*************************************************************************/
    private onBlur();
    private onFocus();
    /**
     * 播放上一条BGM
     */
    preBGM: string;
    playPreBGM(): void;
    /**
     * 重置BGM
     */
    resetBGM(): void;
    /**
     * 音乐加载
     */
    private soundLoaded();
    /**
     * 释放音乐资源
     */
    private disposeSound();
    /********************************************删除音乐*************************************************/
    private allSound;
    private allChannel;
    private isComplete;
    /**
     * 声音初始化加载
     */
    soundInit(): void;
    /**
     * 清除音效
    */
    cleanChannel(num: number): void;
    /**
     * 创建音效
    */
    createChannel(num: number, n: number, m?: number, w?: number): void;
    /**
     * 删除所有音效
    */
    disposeAllSound(): void;
    /**
     * 都准备好了
    */
    allReadly(): boolean;
}
declare module base {
    class FishLoadUi extends LoadViewBase {
        constructor();
    }
    class Xq extends LoadViewBase {
        constructor();
    }
}
declare class Main extends egret.DisplayObjectContainer {
    constructor();
    private onAddToStage(event);
}
declare class BaseConfig<T> {
    private _$clazz;
    private _$name;
    private _$id;
    dic: any;
    constructor(clazz: any, id: string);
    /**
     * 初始化数据
     */
    dataSource: string;
    /**
     * 解析文本
     */
    private analyseTxt(data);
    /**
     * 数据解析
     */
    private mapData(fields, data, item);
    private isNum(s);
    /**
     * 获取类型数据
     */
    getTypeData(key: any): T;
}
declare module base {
    class BaseModule extends egret.EventDispatcher {
        /**
         * 是否缓存
         */
        protected isCache: boolean;
        /**
         * 模块名字
         */
        protected _moduleName: string;
        /**
         * 模块包名
         */
        protected _packageName: string;
        protected _groups: string[];
        protected _moduleInfo: ModuleInfo;
        constructor();
        enter(p_moduleInfo: ModuleInfo, ...args: any[]): void;
        initData(...args: any[]): void;
        isApplying: boolean;
        open(...args: any[]): void;
        close(): void;
        /**
         * 加载配置
         */
        getConfigs(): __ConfigItem[];
        /**
         * 加载资源组
         */
        loadGroup(group: string, loadingType: number, fun: (...args) => any, context: any, ...args: any[]): void;
        /******************************************************************/
        /**
         * 销毁缓存
         */
        protected destroyCache(): void;
        /******************************************************************/
        moduleName: string;
    }
}
declare type __ConfigItem = {
    path: string;
    parse: (res) => void;
};
declare module base {
    class BaseRuleView extends gui.OvBase {
        constructor(res: string, name: string);
        dispose(): void;
        open(...arg: any[]): void;
        private btn;
        private bar;
        private c1;
        private c2;
        initView(): void;
        /**
         * 根据按钮显示声音大小
         */
        private btnShow(index, volume);
        protected initEvent(): void;
        private mouseDown(e);
        private mouseMove(e);
        private mouseUp(e);
        private curNum;
        private _touchStatus;
        private _distance;
        protected onClick(e: egret.TouchEvent): void;
    }
}
declare module base {
    class SoundManager {
        private allSound;
        private allChannel;
        private isComplete;
        protected soundUrl: string[];
        constructor();
        /**
         * 声音初始化加载
         */
        soundInit(): void;
        /**
         * 清除音效
        */
        cleanChannel(num: number): void;
        /**
         * 创建音效
        */
        createChannel(num: number, n?: number, m?: number, w?: number): void;
        /**
         * 删除所有音效
        */
        disposeAllSound(): void;
        /**
         * 都准备好了
        */
        private allReadly();
    }
}
declare module base {
    class BaseTip extends fairygui.GComponent {
        private _message;
        protected _ui: fairygui.GComponent;
        private _content;
        private _animationType;
        private _skinName;
        private _animation;
        constructor(skin: string, message: string);
        dispose(): void;
        /**
         * 开始飘窗
         */
        start(): void;
        /******************************************************************/
        protected initView(): void;
        animationType: number;
        readonly realHeight: number;
        readonly realWidth: number;
    }
    /************************tip动画*************************/
    /******************************************************************/
    class TipAnimationBase {
        component: BaseTip;
        constructor();
        start(callback: any, context: any, ...args: any[]): void;
        dispose(): void;
        /******************************************************************/
        protected onGameTipClose(event: egret.Event): void;
        protected resetInfo(info: ManagerInfo): void;
    }
    class TipManagers {
        private _infos;
        constructor();
        getInfo(type: any): ManagerInfo;
        getAnimationClass(type: any): TipAnimationBase;
    }
    /******************************************************************/
    /********************管理信息*******************************/
    /******************************************************************/
    class ManagerInfo {
        itemList: BaseTip[];
        textTipCurrentY: number;
        startY: number;
        animationClass: any;
        constructor(animationClass: any, startY: any);
    }
    class NormalTipAnimation extends TipAnimationBase {
        constructor();
        start(callback: any, context: any, ...args: any[]): void;
    }
    class SystemTipAnimation extends TipAnimationBase {
        constructor();
        start(callback: any, context: any, ...args: any[]): void;
    }
    function showTextTips(message: string): void;
    class TipItems extends BaseTip {
        constructor(message: string);
        protected initView(): void;
    }
    var ANIMATION1: number;
    var ANIMATION2: number;
}
declare class ModuleManager {
    /**
     * 构造函数
     */
    constructor();
    /**
     * 打开模块
     */
    openModule(p_moduleName: string, p_loadType?: number, p_opendCallBack?: CallBackVo, ...args: any[]): void;
    /**
     * 执行模块
     */
    private applyModule(p_moduleInfo, p_opendCallBack?, ...args);
    private onModuleClosed(e);
    /**
     * 通过模块名获取模块信息
     */
    getModuleInfo(p_moduleName: string): ModuleInfo;
    getModule(p_moduleName: string): base.BaseModule;
    private _moduleInfo;
    private _modules;
    static MODULE_CLOSED: string;
    static MODULE_OPENED: string;
}
declare class ModuleInfo {
    moduleName: string;
    mainClass: any;
    coreClass: any;
    dataClass: any;
}
declare module timeUtils {
    class TimeUtils {
        TimeMin: number;
        TimeHour: number;
        TimeDay: number;
        TimeWeek: number;
        initRefreshTime(): void;
        private timerList;
        addTimerFunc(key: number, timerfunc: Function, thisObj: any): void;
        removeTimerFunc(key: number, timerfunc: Function, thisObj: any): void;
        toFriendly(time: number): string;
        toTimeHour(time: number, isDate?: boolean): string;
        toTimeHour2(time: number): string;
        toTimeHour3(time: number): string;
        toSeconds(time: string): number;
        timeToSeconds(): number;
        format(time: number): string;
        toDayTime(time: number): string;
        /**
         *  1970 到现在的获取时间戳
         */
        private $timestamp;
        timestamp(): number;
        private timestamp0();
        /**
         * 获取现在之前距离到现在的时间，单位秒
         */
        getInterval(before: number): number;
        /**
         * 获取今天剩余的时间
         */
        getSurplusTime(): number;
        timeToformat(time?: number): string;
        timeToformat2(time?: number): string;
        timeToformat3(time?: number): string;
        private severTime;
        private disServerTime;
        initTime(t: number): void;
        isToday(time: number): boolean;
    }
    const time: TimeUtils;
}
declare class btnItem extends fairygui.GButton {
    constructor();
    constructFromResource(): void;
    /**
     * 图片显示
     */
    myId(num: number): void;
    getMyId(): number;
    private _myId;
    /**
     * 招牌显示
     */
    setTipShow(num: number): void;
    setMcShow(num: number): void;
    /**
     * 我的名字
     */
    myName(str: string): void;
    pNum(str: string): void;
    wx(str: string): void;
    private imgLoadHandler(texture, url);
    private kong;
    private _txt;
    private tipShow;
    private mc;
    private imag;
}
declare class DoorView extends gui.OvBase {
    constructor();
    dispose(): void;
    private mathRadomBg;
    private c1;
    private item;
    private showNum;
    private headIcon;
    private itemlist;
    private btn100;
    private down;
    open(...args: any[]): void;
    private onChange(e);
    private getListItemResource(index);
    private iteRenderer(index, item);
    private myId;
    private nameArr;
    private mcArr;
    private tipsArr;
    private pNum;
    private getRenshu(data);
    /**
     * 将热门放在第一位
     */
    private changeNum(num);
    private onItemClick(e);
    /**
     * 创建头像
     */
    private createIcon();
    /**
     * 头像选择界面头像点击
     */
    private itemClick(e);
    /**
     * 头像选择界面点击清空
     */
    private cleanChooseByItem();
    private onRollOver(e);
    private onRollOut(e);
    private cleanButton();
    /**
     * 初始化监听
     */
    initEvent(): void;
    private kickoutF();
    /**
     * 后端消息接听初始化
     */
    private regedEvebt;
    private eventInit();
    /**
     * 消息移除
     */
    private eventRemove();
    protected onClick(e: egret.TouchEvent): void;
    /**
     * 玩家数据更新
     */
    private useDataUpdate(data);
    /**
     * 头像展示
     */
    private iconShow(num);
    /**
     * 界面更新
     */
    private update();
    /**********************************************************/
    protected clickHandler(index: number): void;
    private inRoom();
    private addCoinsBack(data);
    private _type;
    /**
     * 进入房间
     */
    private clickInRoom(num);
    private _data;
    private _num;
    private _dataFlag;
    private inRoomBack(data);
    private remove();
}
declare class headIcon extends fairygui.GComponent {
    private imag;
    constructor(_icon: fairygui.GObject, setXy?: boolean);
    /**
     * 头像编号
     */
    private _myid;
    myId: number;
    private imgLoadHandler(texture, url);
    clean(): void;
}
declare class IconItem extends fairygui.GComponent {
    private mainView;
    private c1;
    private _icon;
    private imag;
    constructor();
    constructFromResource(): void;
    /**
     * 头像编号
     */
    private _myid;
    myId: number;
    private imgLoadHandler(texture, url);
    choose(v: boolean): void;
}
declare class IconSprite extends fairygui.GComponent {
    private mainView;
    private c1;
    private _icon;
    private imag;
    static ONCLICK: string;
    constructor(value: fairygui.GComponent);
    private itemClick(e);
    /**
     * 头像编号
     */
    private _myid;
    myId: number;
    private imgLoadHandler(texture, url);
    choose(v: boolean): void;
}
declare class IconView {
    constructor(v: fairygui.GComponent, myIcon: headIcon);
    private initView();
    private onClick(e);
    private iteRenderer(index, item);
    private onItemClick(e);
    /**
     * 头像选择界面点击清空
     */
    private cleanChooseByItem();
    private mainView;
    private itemlist;
    private btn;
    private chooseId;
    private _myIcon;
}
declare class LoginView extends gui.OvBase {
    constructor();
    dispose(): void;
    private login;
    /**
     * 初始化界面 传入参数
     */
    open(...args: any[]): void;
    /**********************************************************/
    protected clickHandler(index: number): void;
    /**
     * 前往登录
     */
    private gotoLogin();
    /**
     * 登录回调
     */
    private callbackByAaA(data);
    /**
     * 注册
     */
    private createUserName();
    private userNameBack(data);
}
declare class PcDoorView extends gui.OvBase {
    constructor();
    dispose(): void;
    private c1;
    private showNum;
    private headIcon;
    private btn100;
    open(...args: any[]): void;
    private closeIcon();
    private myId;
    private nameArr;
    private mcArr;
    private tipsArr;
    private pNum;
    private getRenshu(data);
    /**
     * 创建头像
     */
    private createIcon();
    private onRollOver(e);
    private onRollOut(e);
    private cleanButton();
    /**
     * 初始化监听
     */
    initEvent(): void;
    private kickoutF();
    /**
     * 后端消息接听初始化
     */
    private regedEvebt;
    private eventInit();
    /**
     * 消息移除
     */
    private eventRemove();
    protected onClick(e: egret.TouchEvent): void;
    /**
     * 玩家数据更新
     */
    private useDataUpdate(data);
    /**
     * 头像展示
     */
    private iconShow(num);
    /**
     * 界面更新
     */
    private update();
    /**********************************************************/
    protected clickHandler(index: number): void;
    private inRoom();
    private addCoinsBack(data);
    private iconView;
}
