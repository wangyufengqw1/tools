/**
 */
module config{
    export class CSV implements face.IConfigParser {
        //字段分隔符
        private FieldSeperator: string;
        //字段包围符
        private FieldEnclosureToken: string;
        //记录分隔符
        private RecordsetDelimiter: string;

        //头部信息
        private Header: any;
        private HeaderType: any;
        private EmbededHeader: boolean;
        private HeaderOverwrite: boolean;
        private ResolveHeaderType: boolean;
        private HeaderTypeDic: Object = {};
        // 注释标识
        private _comment: string;
        private _headerLineNum: number;

        private SortField: any;
        private SortSequence: String;

        public constructor() {
            this.fieldSeperator = ',';
            this.fieldEnclosureToken = '"';
            this.recordsetDelimiter = '\n';
            this.comment = "#";
            this.headerLineNum = 0;

            this.header = new Array();
            this.embededHeader = true;
            this.headerOverwrite = false;
            this.resolveHeaderType = false;
        }

        private _data: any;
        private content: string;

        public decode(): void {
            var count: number = 0;
            var result: any[] = [];
            var lineContent: string;
            this.data = this._data.split(this.recordsetDelimiter);
            for (var i: number = 0; i < this._data.length; i++) {
                lineContent = this._data[i];
                if ((count % 2) == 0) {
                    // 偶数个"符号
                    result.push(lineContent);
                } else {
                    // 奇数个"符号
                    result[result.length - 1] += lineContent;
                }
                count += StringUtil.count(lineContent, this.fieldEnclosureToken);
            }
            result.forEach(this.fieldDetection, this);
            result = result.filter(this.isValidRecord, this);
            // 将表示字段的行前面的行丢弃
            result = result.slice(this.headerLineNum);

            if (this.resolveHeaderType) {
                this.HeaderType = result.shift();
            }

            if (this.embededHeader && this.headerOverwrite) {
                result.shift();
            } else if (this.embededHeader && this.headerHasValues) {
                result.shift();
            } else if (this.embededHeader) {
                this.Header = result.shift();
            }
            this.data = result;

            for (var i: number = 0; i < this.Header.length; i++) {
                this.HeaderTypeDic[this.Header[i]] = this.HeaderType[i];
            }
        }

        /**
         * 获取字段类型
         */
        public getType(p_fieldName: string): string {
            return this.HeaderTypeDic[p_fieldName];
        }


        /**
         * 返回经过Object化的数据集，<b>header必须有值</b>
         */
        public getRecords(): any[] {
            var dataArr: any[] = this.data;
            if (this.Header == null || dataArr == null) {
                return null;
            }
            var propCount: number = this.Header.length;
            var dataItem: any[];
            var recordItem: Object;
            var recordset: any[] = new Array();
            var i: number;
            var j: number;
            var L: number = dataArr.length;
            for (i = 0; i < L; i++) {
                dataItem = dataArr[i];
                recordItem = new Object();
                for (j = 0; j < propCount; j++) {
                    recordItem[this.Header[j]] = dataItem[j];
                }
                recordset.push(recordItem);
            }
            return recordset;
        }

        /**
         *   TODO Public method description ...
         *
         *   @param needle String or Array
         *   @return Array
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        public search(needle: any, removeDuplicates: Boolean = true): any[] {
            var result: any[] = new Array();
            this.data.forEach((i, idx, array) => {
                if (typeof (needle) != "string") {
                    needle.forEach((j: string, idx, array) => {
                        if (i.indexOf(String(j)) >= 0) {
                            result.push(i);
                        }
                    });
                } else if (i.indexOf(String(needle)) >= 0) {
                    result.push(i);
                }
            });
            if (removeDuplicates && result.length > 2) {
                var k: number = result.length - 1;
            }
            while (k--) {
                var l: number = result.length;
                while (--l > k)
                    if (result[k] == result[l]) {
                        result.splice(l, 1);
                    }
            }
            return result;
        }


        /**
         *   TODO Private method description ...
         *
         *   @param fieldNameOrIndex *
         *   @param sequence String
         *   @return no
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        public sort(fieldNameOrIndex: any = 0, sequence: string = 'ASC'): void {
            this.SortSequence = sequence;
            if (this.headerHasValues && this.header.indexOf(fieldNameOrIndex) >= 0) {
                this.SortField = this.header.indexOf(fieldNameOrIndex);
            } else {
                this.SortField = fieldNameOrIndex;
            }
            if (this.dataHasValues) {
                this.data.sort(this.sort2DArray);
            }
        }

        // -> private methods


        /**
         *   分割一条记录的字段值
         *   @param element *
         *   @param index int
         *   @param arr Array
         *   @return Boolean true if recordset has values, false if not
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        private fieldDetection(element: any, index: number, arr: Array<any>): void {
            var count: number = 0;
            var result: string[] = new Array();
            var tmp: string[] = element.split(this.fieldSeperator);
            var regExp: RegExp = /\"(.*)\"/;
            var searchResult: string[];
            for (var i: number = 0; i < tmp.length; i++) {
                if (!Boolean(count % 2)) {
                    result.push(tmp[i].trim());
                } else {
                    result[result.length - 1] += this.fieldSeperator + tmp[i];
                }
                count += StringUtil.count(tmp[i], this.fieldEnclosureToken);
                if (!Boolean(count % 2)) {
                    // 将已经有前后双引号的字段的双引号移除
                    searchResult = regExp.exec(result[result.length - 1]);
                    if (searchResult) {
                        result[result.length - 1] = searchResult[1];
                    }
                }
            }
            arr[index] = result;
        }


        /**
         *   TODO Private method description ...
         *
         *   @param a Array
         *   @param b Array
         *   @return Number
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        private sort2DArray(a, b): number {
            var n: number = 0;
            var r: number = this.SortSequence == 'ASC' ? -1 : 1;
            if (a[this.SortField] < b[this.SortField]) {
                n = r;
            } else if (a[this.SortField] > b[this.SortField]) {
                n = -r;
            } else {
                n = 0;
            }
            return n;
        }


        /**
         *   有效行筛选
         *   @param element *
         *   @param index int
         *   @param arr Array
         *   @return Boolean true if recordset has values, false if not
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        private isValidRecord(element: any, index: number, arr: Array<any>): boolean {
            var valid: boolean = true;
            var str: string = element.toString();
            //这一行是空的就忽略
            if (str.trim() == "") {
                valid = false;
            }
            //如果一行头部发现注释符则忽略
            if (str.indexOf(this._comment) == 0) {
                valid = false;
            }
            return valid;
        }


        // -> deprecated / helper methods, not inside final release
        public dump(): string {
            var result: string = 'data:Array -> [\r';
            for (var i: number = 0; i < this.data.length; i++) {
                result += '\t[' + i + ']:Array -> [\r';
                for (var j: number = 0; j < this.data[i].length; j++) result += '\t\t[' + j + ']:String -> ' + this.data[i][j] + '\r';
                result += ('\t]\r');
            }
            result += ']\r';
            return result;
        }


        // -> setter


        public set data(p_data: any) {
            this._data = p_data;
        }

        public set fieldSeperator(value: string) {
            this.FieldSeperator = value;
        }


        /**
         *   TODO Getter description ...
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        public set fieldEnclosureToken(value: string) {
            this.FieldEnclosureToken = value;
        }


        /**
         *   TODO Setter description ...
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        public set recordsetDelimiter(value: string) {
            this.RecordsetDelimiter = value;
        }


        /**
         *   是否有嵌入字段头部，默认为true
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        public set embededHeader(value: boolean) {
            this.EmbededHeader = value;
        }


        /**
         *   是否重写字段头部，默认为false
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        public set headerOverwrite(value: boolean) {
            this.HeaderOverwrite = value;
        }

        /**
         *   是否有解析字段类型，默认为false
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        public set resolveHeaderType(value: boolean) {
            this.ResolveHeaderType = value;
        }

        /**
         * 注释标识
         */
        public get comment(): string {
            return this._comment;
        }

        /**
         * 注释标识
         */
        public set comment(value: string) {
            this._comment = value;
        }

        /**
         * 表示字段头部的基于有效记录的行号，默认为0
         */
        public get headerLineNum(): number {
            return this._headerLineNum;
        }

        /**
         * 表示字段头部的基于有效记录的行号，默认为0
         */
        public set headerLineNum(value: number) {
            this._headerLineNum = value;
        }


        /**
         *   字段头部
         *
         *   @langversion ActionScript 3.0
         *   @tiptext
         */
        public set header(value: any) {
            if ((!this.embededHeader && !this.headerHasValues) || (!this.embededHeader && this.headerHasValues && this.headerOverwrite) || this.headerOverwrite) {
                this.Header = value;
            }
        }


        // -> getter

        public get data(): any {
            return this._data;
        }

        public get fieldSeperator(): string {
            return this.FieldSeperator;
        }


        public get fieldEnclosureToken(): string {
            return this.FieldEnclosureToken;
        }


        public get recordsetDelimiter(): string {
            return this.RecordsetDelimiter;
        }


        /**
         *   是否有嵌入字段头部
         */
        public get embededHeader(): boolean {
            return this.EmbededHeader;
        }


        /**
         *   是否重写字段头部，默认为false
         */
        public get headerOverwrite(): boolean {
            return this.HeaderOverwrite;
        }

        /**
         *   是否有解析字段类型，默认为false
         */
        public get resolveHeaderType(): boolean {
            return this.ResolveHeaderType;
        }


        /**
         *   字段头部
         */
        public get header(): any {
            return this.Header;
        }

        public get headerHasValues(): boolean {
            var check: boolean;
            try {
                if (this.Header.length > 0) check = true;
            } catch (e) {
                check = false;
            } finally {
                return check;
            }
        }

        public get dataHasValues(): boolean {
            var check: boolean;
            try {
                if (this.content.length > 0) check = true;
            } catch (e) {
                check = false;
            } finally {
                return check;
            }
        }
    }
}