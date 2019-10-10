/**
 *
 * @author
 *
 */
module trace {
    /*抛出异常*/
    export function error(txt: string, arr: any[] = null): void {
        var str: string = txt;
        if (arr != null) {
            var len = arr.length;
            var i = 0;
            for (i = 0; i < len; i++) {
                str += "******" + arr[i];
            }
        }
        throw new Error(str);
    }

    /*输出到控制台*/
    export function traceData(arr: any[]): void {
        console.log(parseData(arr));
    }

    export function parseData(arr: any[]): string {
        var str: string = "";
        var len = arr.length;
        var i = 0;
        for (i = 0; i < len; i++) {
            if (arr[i] instanceof Array) {
                str += "\n" + parseData(arr[i]) + "******";
            } else {
                str += parseObject(arr[i]) + "******";
            }
        }
        return str;
    }

    export function parseObject(obj: any): string {
        if(obj == null){
            return "NULL";
        }
        return obj.toString();
    }
}

