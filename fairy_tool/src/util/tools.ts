/**
 * Created by ASUS on 2017/6/25.
 */
module gameTool {
    import DisplayObjectContainer = egret.DisplayObjectContainer;
    var _singletonMap: any = {};       //所有单例的集合  通过typeId取出 每个单例都会创建一个_type_key_name存放typeId

    /**
     * 返回指定类型的单例
     * @includeExample singleton.ts
     * @param type 需要单例化的类型
     * @returns {any} 类型的单例
     */
    export function singleton < T > (type: {
        new(): T;
    }): T {
        var typeId = getTypeId(type);
        if (!_singletonMap.hasOwnProperty(typeId)) {
            _singletonMap[typeId] = new( < any > type)();
            _singletonMap[typeId][_type_key_name] = typeId;
        }
        return <any > _singletonMap[typeId];
    }

    /**
     * 返回指定分类的类型单例
     * @param name 分类名称
     * @param type 单例化的类型
     * @includeExample typesingleton.ts
     * @returns {any} 单例对象
     */
    export function typeSingleton < T > (name: string, type: {
        new(): T;
    }): T {
        var typeId = name + getTypeId(type);
        if (!_singletonMap.hasOwnProperty(typeId)) {
            _singletonMap[typeId] = new( < any > type)();
        }
        return <any > _singletonMap[typeId];
    }

    var _type_id = 1;
    var _type_key_name = "__object_type_id__";

    /**
     * 返回指定类型的类型编号
     * @param type 指定类型
     * @returns {any} 类型编号
     */
    export function getTypeId(type: any): string {
        if (!type.hasOwnProperty(_type_key_name)) {
            _type_id++;
            type[_type_key_name] = "__type_id_" + _type_id;
        }
        return type[_type_key_name];
    }

    /**
     * 释放单例
     */
    export function disposeSingle(context: any) {
        if (context.hasOwnProperty(_type_key_name)) {
            let typeId = context[_type_key_name];
            // delete context[_type_key_name];
            if (_singletonMap.hasOwnProperty(typeId)) {
                delete _singletonMap[typeId][_type_key_name];
                delete _singletonMap[typeId];
            }
        }
    }


    /**
     * 指定类型是否存在类型编号
     * @param type 指定类型
     * @returns {boolean} 是否存在类型编号
     */
    export function hasTypeId(type: any): number {
        if (type && type.hasOwnProperty(_type_key_name)) {
            return type[_type_key_name];
        }
        return 0;
    }

    /**
     * 获取一个文件的扩展名
     * @param path
     * @returns {string}
     */
    export function getFileExtName(path: string): string {
        var arr: Array < string > = path.split('/');
        var fileName = arr[arr.length - 1];
        arr = fileName.split('.');
        return arr[0];
    }

    /**
     * 从父容器移除显示对象
     * @param child
     */
    export function removeFromParent(child: egret.DisplayObject): void {
        if (child && child.parent) {
            child.parent.removeChild(child);
        }
    }

    /**
     * 销毁容器的所有子对象
     * @param container
     */
    export function destoryChildren(container: any): void {
        container.parent && container.parent.removeChild(container);
        disposeSingle(container);
        notification.removeNotificationByObject(container);
        while (container.numChildren) {
            var item = container.getChildAt(0);
            this.destoryChildren(item);
        }
    }

    /**
     * 销毁容器的所有子对象消息
     * @param container
     */
    export function destoryChildrenNotice(container: any): void {
        disposeSingle(container);
        notification.removeNotificationByObject(container);
        let len = container.numChildren;
        for (let i = len-1; i>0; i--) {
            var item = container.getChildAt(i);
            this.destoryChildren(item);
        }
    }

    /**
     * 游戏的一些初始化
     */
    export function init(main: DisplayObjectContainer): void {
        gameTool.main = main;
        gameTool.stage = main.stage;
        singleton(sound.SoundManager).init(gameTool.stage);
        singleton(app_sound.SoundManager).init(gameTool.stage);
        gui.initRootView(gameTool.main);
        gameTool.display.setFullDisplay(main);
        gameTool.display.setFullDisplay(fairygui.GRoot.inst.displayObject);
        fairygui.UIPackage.addPackage("common");
        notification.addNotification(define.Data.ERROR, (data) => {
            console.log("请求错误:" + data["des"] + "  code: " + data["num"]);
        }, this);
    }

    export var stage:egret.Stage;
    export var main:DisplayObjectContainer;
    export var gameContentWH:number[];   //游戏内容长宽
    export var gameRotate:boolean;       //1代表旋转
    export var pToLand   :boolean;       //竖屏用作横屏显示 
    /**
     * 回收列表
     */
    export var poolList = gameTool.singleton(List);

    /**
     * 根据容器发送其自身所携带的命令
     */
    export function sendNoticoeByComponent(com: any) {
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

    /**
     * 判断是否是 IOS
     * @returns {boolean}
     */
    export function isIOS() {
        //tip.showTextTip(egret.Capabilities.os);
        return egret.Capabilities.os == "iOS";
    }
    /**
     * 获取项目的地址前缀
     */
    export function getHost() {
        var host = window.location.href.split("?")[0];
        if (host.indexOf("/#")) {
            host = host.replace("/#", "");
        }
        return host;
    }
    /**
     * 移除容器
     * @param display
     * @param container
     */
    export function removeStage(display: egret.DisplayObject) {
        display.parent && display.parent.removeChild(display);
    }

    export function inStage(display: egret.DisplayObject) {
        while (display.parent && display.parent != main && display.parent != stage) {
            display = display.parent;
        }
        return display.parent != null;
    }
}