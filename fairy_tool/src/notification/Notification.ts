module notification {
    /**
     * Created by silence on 2017/6/28.
     */
    export class Notification {
        private _listenerNames: any = {};

        /**
         * 添加一个通知监听
         * @param name  通知名称
         * @param sender    接收到后执行函数
         * @param context   上下文
         * @param priority  优先级，越大越优先
         * @returns {{name: string, sender: ((...args:any[])=>any), priority: number, context: any}}    返回当前监听器的NotificationInfo
         */
        addListener(name: __Key, sender: (...args) => any, context: any, priority: number = 0) {
            if (!this._listenerNames.hasOwnProperty(name)) {
                this._listenerNames[name] = {};
            }
            var typeId = gameTool.getTypeId(context);
            //console.log(gameTool.getClassNameByObject(context),context ,typeId);

            var listenerList = this._listenerNames[name];
            if (!listenerList.hasOwnProperty(typeId)) {
                listenerList[typeId] = [];
            }

            var info = {name, sender, priority, context};
            var list = listenerList[typeId];
            list.push(info);
            listenerList[typeId] = list.sort((a: NotificationInfo, b: NotificationInfo) => {
                return b.priority - a.priority;
            });
            return info;
        }

        /**
         * 是否拥有侦听
         * @param name
         * @param sender
         * @param context
         * @returns {boolean}
         */
        hasListener(name: __Key, sender: Function, context: any) {
            if (!this._listenerNames.hasOwnProperty(name)) {
                return false;
            }
            var listenerList = this._listenerNames[name];
            var typeId = gameTool.getTypeId(context);
            if (!listenerList.hasOwnProperty(typeId)) {
                return false;
            }
            var list = listenerList[typeId];
            let len = list.length;
            for (let i = 0; i < len; i++) {
                if(list[i].sender == sender){
                    return true;
                }
            }
            return false;
        }

        /**
         * 移除一个监听
         * @param name
         * @param sender
         * @param context
         */
        removeListener(name: __Key, sender: Function, context: any) {
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
        }

        /**
         * 移除一个对象的所有已注册的事件
         * @param context
         */
        removeListenerByObject(context) {
            let typeId = gameTool.hasTypeId(context);
            if (typeId) {
                for (let key in this._listenerNames) {
                    let listenerList = this._listenerNames[key];
                    if (listenerList.hasOwnProperty(typeId)) {
                        //console.log("移除一个对象的所有已注册的事件 key:" + key + " typeID:" + typeId +  " ClassName:" + gameTool.getClassNameByObject(context));
                        delete listenerList[typeId];
                    }
                }
            }
        }

        /**
         * 派发通知
         * @param name
         * @param args
         */
        dispatchListener(name: __Key, ...args): void {
            var listenerlist = this._listenerNames[name];
            if (listenerlist) {
                var list = [];
                for (var key in listenerlist) {
                    var arr = listenerlist[key];
                    //获取整个监听列表
                    list = list.concat(arr);
                }
                //按优先级排序
                list.sort((a: NotificationInfo, b: NotificationInfo) => {
                    return b.priority - a.priority;
                });

                var len = list.length;
                for (var i = 0; i < len; i++) {
                    var info = list[i];
                    info.sender.apply(info.context, args);
                }
            }
        }
    }
    /**
     * 添加一个通知监听
     * @param name  通知名称
     * @param sender    接收到后执行函数
     * @param context   上下文
     * @param priority  优先级，越大越优先
     */
    export function addNotification(name: __Key, sender: (...args) => void, context: any, priority: number = 0): void {
        gameTool.singleton(Notification).addListener(name, sender, context, priority);
    }

    /**
     * 派发通知
     * @param name
     * @param args
     */
    export function postNotification(name: __Key, ...args): void {
        let arr = [name].concat(args);
        gameTool.singleton(Notification).dispatchListener.apply(gameTool.singleton(Notification), arr);
    }

    /**
     * 移除一个监听
     * @param name
     * @param sender
     * @param context
     */
    export function removeNotification(name: __Key, sender: Function, context: any): void {
        gameTool.singleton(Notification).removeListener(name, sender, context);
    }

    /**
     * 移除一个对象的所有已注册的事件
     * @param context
     */
    export function removeNotificationByObject(context: any): void {
        gameTool.singleton(Notification).removeListenerByObject(context);
    }

}
