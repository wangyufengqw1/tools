/**
 * Created by lxz on 2017/11/2.
 */
module bind {
    export class Binding {
        bindFunciotnNamePre: string = "__bind_fun__";

        constructor() {

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
        bindProperty(host: any, chain: string[], target: any, prop: string) {
            let key = this.getHostInfo(host, chain);
            let funKey = this.bindFunciotnNamePre + key + "_" + prop;
            target[funKey] = (value) => {
                target[prop] = value;
            };
            notification.addNotification(key, target[funKey], target);
        }

        /**
         * 绑定一个回调函数到要监视的对象属性上。当 host上 chain 所对应的值发生改变时，handler 方法将被自动调用。
         * @param host 用于承载要监视的属性或属性链的对象。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 host.a.b.c，需按以下形式调用此方法：bindSetter(host, ["a","b","c"], ...)。
         * @param handler 在监视的目标属性链中任何属性的值发生改变时调用的事件处理函数。
         * @param thisObject handler 方法绑定的this对象
         */
        bindHandler(host: any, chain: string[], handler: (value: any) => void, thisObject: any) {
            let key = this.getHostInfo(host, chain);
            let funKey = this.bindFunciotnNamePre + key + "_" + gameTool.getTypeId(handler);
            thisObject[funKey] = handler;
            notification.addNotification(key, thisObject[funKey], thisObject);
        }

        removeBind(host: any, chain: string[], target: any, prop: string | ((value: any) => void)) {
            let key = this.getHostInfo(host, chain);
            let funKey = this.bindFunciotnNamePre + key + "_" + (typeof prop == "string" ? prop : gameTool.getTypeId(prop));
            notification.removeNotification(key, target[funKey], target);
            delete target[funKey];
        }

        removeBindByObject(target: any) {
            let keys = Object.keys(target);
            let len = keys.length;
            for (let i = 0; i < len; i++) {
                if (keys[i].indexOf(this.bindFunciotnNamePre) > -1) {
                    let key = keys[i].substring(this.bindFunciotnNamePre.length, keys[i].lastIndexOf("_"));
                    notification.removeNotification(key, target[keys[i]], target);
                    delete target[keys[i]];
                }
            }
        }

        /**
         * 改变值
         */
        sendBind(context: any, prop: string) {
            let id = gameTool.getTypeId(context);
            notification.postNotification(id + "__" + prop, context[prop]);
        }

        changeValue(context: any, prop: string, value: any) {
            context[prop] = value;
            let id = gameTool.getTypeId(context);
            notification.postNotification(id + "__" + prop, value);
        }


        /******************************************************************/
        private getHostInfo(host, chain): string {
            let prototype = host;
            if (chain.length > 1) {
                let len = chain.length;
                for (let i = 0; i < len - 1; i++) {
                    prototype = prototype[chain[i]];
                }
            }
            let id = gameTool.getTypeId(prototype);
            let key = chain[chain.length - 1];
            return id + "__" + key;
        }
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
    export function bindProperty(host: any, chain: string[], target: any, prop: string) {
        gameTool.singleton(Binding).bindProperty(host, chain, target, prop);
    }

    /**
     * 绑定一个回调函数到要监视的对象属性上。当 host上 chain 所对应的值发生改变时，handler 方法将被自动调用。
     * @param host 用于承载要监视的属性或属性链的对象。
     * @param chain 用于指定要监视的属性链的值。例如，要监视属性 host.a.b.c，需按以下形式调用此方法：bindSetter(host, ["a","b","c"], ...)。
     * @param handler 在监视的目标属性链中任何属性的值发生改变时调用的事件处理函数。
     * @param thisObject handler 方法绑定的this对象
     */
    export function bindHandler(host: any, chain: string[], handler: (value: any) => void, thisObject: any) {
        gameTool.singleton(Binding).bindHandler(host, chain, handler, thisObject);
    }

    /**
     * 改变值
     */
    export function sendBind(context: any, prop: string) {
        gameTool.singleton(Binding).sendBind(context, prop);
    }

    export function changeValue(context: any, prop: string, value: any) {
        gameTool.singleton(Binding).changeValue(context, prop, value);
    }

    /**
     * 解除对指定属性的指定绑定
     */
    export function removeBind(host: any, chain: string[], target: any, prop: string | ((value: any) => void)) {
        gameTool.singleton(Binding).removeBind(host, chain, target , prop);
    }

    /**
     * 解除target身上的所有绑定
     * @param target
     */
    export function removeBindByObject(target: any) {
        gameTool.singleton(Binding).removeBindByObject(target);
    }
}