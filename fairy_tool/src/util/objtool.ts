/**
 * Created by lxz on 2017/9/7.
 */
module objTool {
    /**
     *  获取对象的属性值
     *  没有该属性值时返回默认值
     */
    export function getValueByObjectKey(obj:any , key: string, defalut : any): any {
        return obj && obj[key] ?  obj[key] : defalut;
    }
    /**
     * 是否相等
     */
    export function hasSameObj < T > (item: T, obj: any): boolean {
        var keys = Object.keys(obj);
        return keys.every(k => {
            return item[k] == obj[k];
        });
    }

    /**
     * 是否拥有obj的属性
     */
    export function hasObjProperty < T > (item: T, obj: any): boolean {
        var keys = Object.keys(obj);
        return keys.every(k => {
            return definiton.hasProperty(item, k);
        });
    }

    /**
     * 映射赋值
     * dynamic 是否为item动态添加属性
     */
    export function mapObjProperty < T > (item: T, obj: any, dynamic: boolean = false): T {
        for (var key in obj) {
            if (dynamic) {
                item[key] = obj[key];
            } else {
                mapSingleProperty(item, obj, key);
            }
        }
        return item;
    }

    /**
     * 映射赋值
     * dynamic 是否为item动态添加属性
     */
    export function mapObjPropertyToNew < T > (itemClass: {
        new(): T;
    }, obj: any, dynamic: boolean = false): T {
        let item = new itemClass;
        mapObjProperty(item, obj, dynamic);
        return item;
    }

    export function mapSingleProperty(item, obj, key) {
        if (definiton.hasProperty(item, key)) {
            if (typeof item[key] == "number" && typeof obj[key] == "string") {
                item[key] = mathTool.parseNumber(obj[key]);
            } else {
                item[key] = obj[key];
            }
        }
    }
}