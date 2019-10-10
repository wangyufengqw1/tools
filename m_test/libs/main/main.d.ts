declare module api {
    interface IUserData {
        setUserName(value: string): void;
        getUserName(): string;
        setUserCoins(value: number): any;
        getUserCoins(): number;
        setUserIcon(value: string): void;
        getUserIcon(): void;
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
        setUserIcon(value: string): void;
        getUserIcon(): string;
        getOpenId(): string;
        setOpenId(value: string): void;
    }
}
declare class AssetAdapter implements eui.IAssetAdapter {
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    getAsset(source: string, compFunc: Function, thisObject: any): void;
}
declare class Main extends eui.UILayer {
    protected createChildren(): void;
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
declare module api {
    class Alert extends gui.OvBase {
        private _message;
        private _button;
        private _callback;
        static OK: number;
        static CANCEL: number;
        static OK_CANCEL: number;
        constructor(message: string, button?: number, callback?: (...args) => void, context?: any, ...args: any[]);
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
    function createAlert(message: string, buttons?: number, callback?: (...args) => void, context?: any, ...args: any[]): Alert;
}
declare module api {
    class GlobalAPI {
        static localData: ILocalData;
        static webSocket: INetWork;
        static userData: IUserData;
        static soundManager: SoundManagers;
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
declare class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {
    constructor();
    private textField;
    private createView();
    onProgress(current: number, total: number): void;
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
    changeMusic(p_flag: boolean): void;
    /**
     * 游戏界面音乐
     */
    private isInPlay;
    playRedBGM(notRec?: boolean): void;
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
    class BaseModuleCore {
        constructor();
    }
}
declare module loadUtil {
    /**
     * 进度条界面
     */
    class LoadingUI extends gui.OvBase {
        private _title;
    }
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
declare class DoorView extends gui.OvBase {
    constructor();
    dispose(): void;
    open(...args: any[]): void;
    private onRollOver(e);
    private onRollOut(e);
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
    static kickout: string;
    static Logout: string;
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
