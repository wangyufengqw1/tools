/**
 *
 * @author
 *
 */
module mathTool {
    /**
     *  根据限制内对数字上下取整
     */
    export function getValueByLimit(value: number, limit: number = .1): number {
        let n = value % 1;
        let min = .5 - limit;
        let max = .5 + limit;
        return (n >> 0) + ((n > min && n < max) ? 1 : 0);
    }

    /**
     * 高斯函数
     * 高斯函数的图形在形状上像一个倒悬着的钟。a是曲线的高度，b是曲线中心线在x轴的偏移，c是半峰宽度（函数峰值一半处相距的宽度）。
     */
    export function gaussian(dist, a = 1, b = 0, c = 10): number {
        return a * Math.pow(Math.E, -(dist - b) * (dist - b) / (2 * c * c));
    }

    /**
     * 求和
     */
    export function sum(arr: any[], propertyName ?: string): number {
        let n = 0;
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            n += parseNumber(propertyName ? arr[i][propertyName] : arr[i]);
        }
        return n;
    }

    /**
     * 获取number
     */
    export function parseNumber(num: __Key): number {
        if (typeof num == "string") {
            return isNaN(parseFloat(num)) ? 0 : parseFloat(num);
        }
        return num;
    }

    /**
     * 两个数组是否相等
     */
    export function equalArray(array1: any[], array2: any[]): boolean {
        if (array1.length != array2.length) {
            return false;
        }
        let len = array1.length;
        for (let i = 0; i < len; i++) {
            if (array2.indexOf(array1[i]) == -1) {
                return false;
            }
        }
        return true;
    }

    /**
     * 打乱数组
     */
    export function shuffle<T>(array: T[]): T[] {
        return array.sort(() => {
            var r = Math.random();
            return r > 0.5 ? 1 : -1;
        });
    }

    /**
     * 返回数组里的某个字段对应值得索引
     */
    export function indexOfMap(arr: any[], propertyName: string, value: any): number {
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            if (arr[i][propertyName] == value) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 返回数组里的某个字段的列表
     */
    export function pluck<T>(arr: T[], propertyName: string): any[] {
        return arr.map(item => {
            return item[propertyName];
        });
    }

    /**
     * 返回数组里符合方法判定的item
     */
    export function find<T>(arr: T[], fun: (item: T,index:number) => boolean, context = null): T {
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (fun && fun.call(context, item,i)) {
                return item;
            }
        }
        return null;
    }

    /**
     * 返回数组里符合方法判定的item列表
     */
    export function findList<T>(arr: T[], fun: (item: T,index:number) => boolean, context = null): T[] {
        let list = [];
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (fun && fun.call(context, item,i)) {
                list.push(item);
            }
        }
        return list;
    }

    /**
     *  筛选数组里item与obj相等的item列表
     */
    export function where<T>(arr: T[], obj: any): T[] {
        var keys = Object.keys(obj);
        var ret = [];
        for (var i = 0; i < arr.length; i++) {
            var item: T = arr[i];
            var ok = keys.every(k => {
                return item[k] == obj[k];
            });
            if (ok) {
                ret.push(item);
            }
        }
        return ret;
    }

    /**
     *  筛选数组里item与obj相等的item
     */
    export function findWhere<T>(arr: T[], obj: any): T {
        var items = mathTool.where(arr, obj);
        if (items.length > 0) {
            return items[0];
        }
        return null;
    }

    /**
     * 判断arr里是否有符合obj的item
     */
    export function contains<T>(arr: T[], obj: (value: T, index: number, array: T[]) => boolean | T): boolean {
        if (!arr || arr.length == 0) {
            return false;
        }
        if (definiton.getClassNameByObject(obj) == definiton.getNameByClass(arr[0])) {
            var idx = arr.indexOf(<any>obj);
            if (idx > -1) {
                return true;
            }
        } else {
            var fun: any = <any>obj;
            var some = arr.some(fun);
            return some;
        }
        return false;
    }

    /*两点距离*/
    export function distance(x1: number, y1: number, x2: number, y2: number): number {
        var dx: number = x1 - x2;
        var dy: number = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /*随机布尔值*/
    export function getBoolean(): boolean {
        return (Math.random() >= .5) ? true : false;
    }

    /*弧度值转为角度值*/
    export function radianToAngle(num: number): number {
        return num * 180 / Math.PI;
    }

    /*角度值转为弧度值*/
    export function angleToRadian(num: number): number {
        return num * Math.PI / 180;
    }

    /*减去数组的某个值*/
    export function cutValueByArray(value: any, arr: any[]): boolean {
        var index: number = arr.indexOf(value);
        if (index != -1) {
            arr.splice(index, 1);
            return true;
        }
        return false;
    }

    /*加进去数组的某个值*/
    export function addValueByArray(value: any, arr: any[]): boolean {
        var index: number = arr.indexOf(value);
        if (index == -1) {
            arr["push"](value);
            return true;
        }
        return false;
    }

    /*随机数组不同的值(会改变数组)*/
    export function getArrayRandom<T>(arr: T[]): T {
        return arr.splice((Math.random() * arr.length) >> 0, 1)[0];
    }

    /*随机数组不同的值(不会改变数组)*/
    export function getArrayRandomValue<T>(arr: T[]): T {
        return arr[(Math.random() * arr.length) >> 0];
    }

    /*返回两个值中间的值*/
    export function randomValue(value1: number, value2: number): number {
        return Math.random() * (value2 - value1) + value1;
    }

    /*返回一个打乱过后的数组(会改变原先的数组顺序)*/
    export function randomArray<T>(arr: T[]): T[] {
        arr.sort(randomSort);
        return arr;
    }

    /*返回一个打乱过后的数组(不会改变原先的数组顺序)*/
    export function randomArrayCopy<T>(arr: T[]): T[] {
        var list: T[] = getArrCopy(arr);
        list.sort(randomSort);
        return list;
    }

    /**
     * 复制数组
     */
    export function getArrCopy<T>(arr: T[]): T[] {
        var curArr: any[] = [];
        for (var i: number = 0; i < arr.length; i++) {
            curArr.push(arr[i]);
        }
        return curArr;
    }

    /*加减某个值的增量
     * value		要计算的值
     * limit		临界值
     * interval		差值
     * isAdd		加减
     */
    export function handlerMath(value: number, limit: number, interval: number, isAdd: boolean): number {
        var pointer: number = isAdd ? 1 : -1;
        if (value * pointer < limit * pointer) {
            value += interval * pointer;
        }
        else {
            value = limit;
        }
        return value;
    }

    /*
     * 随机数组里面概率的索引值(即数组里载着各个概率值)
     */
    export function randomRateValue(arr: number[], base: number = 10000): number {
        var temp: number = Math.random() * base;
        var len: number = arr.length;
        var i: number = 0;
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

    /*
     * 自动随机数组里面概率的索引值(即数组里载着各个概率值)
     */
    export function autoRandomRateValue(arr: number[]): number {
        var len: number = arr.length;
        var i: number = 0;
        var base: number = 0;
        for (i = 0; i < len; i++) {
            base += arr[i];
        }
        var temp: number = Math.random() * base;
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

    /*返回单个概率是否中了 基数10000*/
    export function getAtaru(value: number): boolean {
        return randomValue(1, 10000) < value;
    }

    /* 随机一个平均概率的值*/
    export function getMeanNum(num: number): number {
        var mean: number = 1 / num;
        var temp: number = Math.ceil(Math.random() / mean);
        return 0 == temp ? 1 : temp;
    }

    export function randomSort(a: any, b: any): number {
        return getBoolean() ? 1 : -1;
    }

    /**
     * 从数组中取n个数有多少种组合
     * @param arr       原始数组：int *arr
     * @param start     遍历的起始位置：int start
     * @param result    另一个存放下标的数组：int *result
     * @param index     数组result中的索引：int index(其实就是下一步要从数组里挑选几个数的意思)
     * @param n         取多少个数：int n
     * @param arr_len   原始数组的长度：int arr_len
     */
    export function combineArrayByNum(arr: any[], start: number, result: number[], index: number, arr_len: number, combine: (result: any[]) => void, context: any) {
        for (let ct = start; ct < arr_len - index + 1; ct++) {
            result[index - 1] = ct;
            if (index - 1 == 0) {
                let len = result.length;
                let arrCopy = [];
                for (let i = 0; i < len; i++) {
                    arrCopy.push(arr[result[i]]);
                }
                combine.apply(context, [arrCopy]);
            } else {
                combineArrayByNum(arr, ct + 1, result, index - 1, arr_len, combine, context);
            }
        }
    }
}

