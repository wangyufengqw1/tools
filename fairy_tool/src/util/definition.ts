/**
 * Created by lxz on 2017/6/28.
 */
module definiton {
    /**
     * 获取指定类的类型
     * @param name 类型名称
     * @param defaultType 默认类型
     * @returns {any}
     */
    export function getDefinitionType<T>(name: string): T {
        var t = egret.getDefinitionByName(name);
        return t;
    }

    /**
     * 获取指定类的实例
     * @param args 类型构造函数参数列表
     * @param name 类型名称
     * @param defaultType 默认类型
     * @param args 类型构造函数参数列表
     * @returns {null}
     */
    export function getDefinitionInstance<T>(name: string, ...args): T {
        var define: any = getDefinitionType(name);
        return new define(...args);
    }

    /**
     * 是否是class类型
     */
    export function isClass(obj: any) {
        return obj.prototype != null;
    }


    /**
     * 根据实例获取类名称
     */
    export function getClassNameByObject(obj: any) {
        if (!obj["__proto__"].hasOwnProperty("__class__")) {
            return egret.getQualifiedClassName(obj);
        }
        let str: string = obj["__proto__"]["__class__"];
        return str;
    }


    /**
     * 根据实例获取类
     */
    export function getClassByObject(obj: any) {
        return obj["constructor"];
    }

    /**
     * 根据类型获取类名
     */
    export function getNameByClass(keyClass: any) {
        return keyClass.prototype["__class__"];
    }

    /**
     * 判断是否拥有该方法
     */
    export function hasProperty(obj: any, property: string) {
        return this.getProperty(obj , property) !== undefined;
    }

    /**
     * 判断该类型是不是继承其他类型
     */
    export function isExtends(parent: any, son: any) {
        let arr = parent.prototype["__types__"];
        if(arr && arr.length > 0){
            return arr.indexOf(getNameByClass(son)) > -1;
        }
        return false;
    }

    /**
     * 获取某个实例的属性value
     */
    export function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
        return o[name]; // o[name] is of type T[K]
    }
    /**
     * 获取某个实例的属性value集合
     */
    export function pluckPropertys<T, K extends keyof T>(o: T, names: K[]): T[K][] {
        return names.map(n => o[n]);
    }
}