/**
 * Created by lxz on 2017/10/25.
 */

module config {
    export class LuaObjUtil {
        public constructor() {
        }

        private static exp: RegExp = /\{([^\{\}])*\}/g;
        private static valueRule: RegExp = /[^,=\{\}'"]+/g;
        /**
         * 过滤引号范围内
         */
        private static quotationRule1: RegExp = /'([^'"])*'/g;
        // private static quotationRule2: RegExp = /"([^'"])*"/g;
        /**
         * 解析引号包围的字符串
         */
        private static quotationRule3: RegExp = /&[\s\S]*&/g;
        private static OBJECT_SIGN: string = "&lua";

        /**
         * 解析Lua字串
         * 格式{a=123}
         */
        public static parse(p_str: string): any {
            var dic: Object = {};
            var list: any[];
            var result: any;
            var increase: number = 0;
            var key: string;

            var ridx: number = -10000;
            var lidx: number = -1;
            var parseStr: string;
            while (1) {
                //JS里是正则比较快速
                list = p_str.match(LuaObjUtil.exp);
                if (!list || list.length <= 0) {
                    break;
                }
                for (var i: number = 0; i < list.length; i++) {
                    result = this.parseItem(list[i], dic);
                    key = LuaObjUtil.OBJECT_SIGN + (increase++);
                    dic[key] = result;
                    p_str = p_str.replace(list[i], key);
                }

            }
            return result;
        }

        private static parseItem(p_str: string, p_dic: Object): any {
            var result: any;
            var i: number;
            var len: number;
            if (p_str == "{}") {
                return {};
            }
            var list: any[];
            var value: any;
            var num: number;
            if (p_str.indexOf("=") > -1) {
                let dic = [];
                p_str = LuaObjUtil.parseQuotation(p_str , LuaObjUtil.quotationRule1 , dic);
                // p_str = LuaObjUtil.parseSemicolon(p_str , LuaObjUtil.quotationRule2 , dic);
                list = p_str.match(LuaObjUtil.valueRule);
                result = {};
                len = list.length;
                for (i = 0; i < len; i += 2) {
                    value = p_dic[list[i + 1]];
                    if (!value) {
                        value = list[i + 1];
                        let strs = value.match(LuaObjUtil.quotationRule3);
                        if(strs && strs.length){
                            value = dic[parseInt(strs[0].substring(1 , strs[0].length - 1))];
                        }else{
                            if (!isNaN(value)) {
                                value = parseFloat(value);
                            }
                        }
                    }
                    result[list[i]] = value;
                }
            }
            else {
                list = p_str.match(LuaObjUtil.valueRule);
                result = list;
                len = list.length;
                for (i = 0; i < len; i++) {
                    value = p_dic[list[i]];
                    if (!value) {
                        value = list[i];
                        num = Number(value);
                        if (!isNaN(num)) {
                            value = num;
                        }
                    }
                    result[i] = value;
                }
            }
            return result;
        }

        private static parseQuotation(p_str: string, exp: RegExp , dic:string[]) {
            let list = p_str.match(exp);
            if(!list || list.length == 0){
                return p_str;
            }
            let len = list.length;
            for (let i = 0; i < len; i++) {
                p_str = p_str.replace(list[i] , `&${dic.length}&`);
                dic.push(list[i].substring(1 , list[i].length - 1));
            }
            return p_str;
        }
    }

}