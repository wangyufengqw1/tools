/**
 * Created by lxz on 2017/10/25.
 */
module config {
    export class StringUtil {
        constructor() {
        }

        /**
         * Counts the occurrences of needle in haystack. <br />
         * {@code trace (stringUtils.count ('hello world!', 'o')); // 2
         * }
         * @param haystack :string
         * @param needle :string
         * @param offset :Number (optional)
         * @param length :Number (optional)
         * @return The number of times the needle substring occurs in the
         * haystack string. Please note that needle is case sensitive.
         */
        static count(haystack: string, needle: string, offset: number = 0, length: number = 0): number {
            if (length === 0)
                length = haystack.length;
            var result: number = 0;
            haystack = haystack.slice(offset, length);
            while (haystack.length > 0 && haystack.indexOf(needle) != -1) {
                haystack = haystack.slice((haystack.indexOf(needle) + needle.length));
                result++;
            }
            return result;
        }

        /**
         * 获取文件名
         * @param p_url 路径
         * @param p_suff 是否带后缀
         * @return
         */
        static getFileName(p_url: string, p_suff: Boolean = true): string {
            if (!p_url) return "";
            var base: string = (p_url.indexOf('?') > 0) ? p_url.split('?')[0] : p_url;
            var endIndex: number = 2147483647;
            if (p_suff == false) {
                endIndex = base.lastIndexOf(".");
            }
            if (endIndex == -1) endIndex = 2147483647;
            if (base.indexOf("\\") > -1) {
                return p_url.substring(base.lastIndexOf("\\") + 1, endIndex);
            }
            else {
                return p_url.substring(base.lastIndexOf("/") + 1, endIndex);
            }
        }

        /**
         * 获取URL的扩展名(以小写返回)
         */
        static getExtendsName(p_url: string): string {
            var base: string = (p_url.indexOf('?') > 0) ? p_url.split('?')[0] : p_url;
            var lastIndex: number = base.lastIndexOf('.');
            var extension: string = "";
            if (lastIndex > -1) {
                extension = base.substr(lastIndex + 1).toLowerCase();
            }
            return extension;
        }

        /**
         * 获得文件目录
         */
        static getSourcePath(p_url: string, p_sign: Boolean = true): string {
            if (!p_url) return "";
            var lastIndex: number = p_url.lastIndexOf("/");
            if (lastIndex == -1) {
                lastIndex = p_url.lastIndexOf("\\");
            }
            if (p_sign) {
                lastIndex = lastIndex + 1;
            }
            return p_url.substring(0, lastIndex);
        }

        public static trim(str: string): string {
            let startPos: number;
            let endPos: number;
            for (startPos = 0; startPos < length; ++startPos) {
                if (str.charCodeAt(startPos) > 0x20) break;
            }
            for (endPos = str.length - 1; endPos >= startPos; --endPos) {
                if (str.charCodeAt(endPos) > 0x20) break;
            }
            return str.substring(startPos, endPos + 1);
        }

        static getType(p_url: string): string {
            var exd: string = StringUtil.getExtendsName(p_url);
            switch (exd) {
                case "png":
                case "jpg":
                case "png":
                    return "image"
                case "txt":
                case "csv":
                    return "text";
                case "json":
                    return "json"
                case "zip":
                    return "zip";
                case "dbp":
                    return "dragonbones";
                default:
                    return "bin"
            }
        }
    }
}