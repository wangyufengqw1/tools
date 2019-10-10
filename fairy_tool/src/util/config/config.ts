/**
 * Created by lxz on 2017/10/25.
 */
module config {
    export class BaseConfig < T > extends egret.HashObject {
        protected typeDataClass: any;
        protected keyPropName: any;
        protected data: any;
        protected _dic: any;
        protected allDecoded: boolean;
        protected useByteSrc: boolean;
        protected config: face.IConfigParser;
        private _keys: any[];

        public constructor(p_typeDataClass: any, p_keyPropName: any) {
            super();
            this.typeDataClass = p_typeDataClass;
            this.keyPropName = p_keyPropName;
            this.allDecoded = false;
            this.useByteSrc = false;
        }

        /**
         * 获取类型数据
         */
        public getTypeData(key: any): T {
            if (this.useByteSrc) {
                // 字节文件配置
                if (!this._dic[key]) {
                    var dataSet: any = (this.config as BSV).parseItem(key);
                    var item: T;
                    if (dataSet) {
                        item = new this.typeDataClass();
                        this.transformItem(item, dataSet);
                        this._dic[key] = item;
                    }
                }
            } else {
                // csv文件配置
                this.parseAll();
            }
            return this._dic[key];
        }


        /**
         * 获取数据集合
         */
        public get dic(): Object {
            this.parseAll();
            return this._dic;
        }

        public parseAll(): void {
            if (this.allDecoded) {
                return;
            }
            this.config.decode();
            var dataSet: any[] = this.config.getRecords();
            var i: number;
            var len: number = dataSet.length;
            var item: T;
            var key: string;
            this._keys = [];
            for (i = 0; i < len; i++) {
                item = new this.typeDataClass();
                this.transformItem(item, dataSet[i]);
                key = this.getKeyValue(item);
                this._dic[key] = item;
                this._keys.push(key);
            }
            this.allDecoded = true;
        }

        /******************************************************************/
        protected transformItem(typeData: T, itemData: any): void {
            var proName: string;
            var type: string;
            for (proName in itemData) {
                type = this.config.getType(proName);
                if (type == "table") {
                    typeData[proName] = LuaObjUtil.parse(itemData[proName]);
                } else if (type == "int") {
                    typeData[proName] = isNaN(parseFloat(itemData[proName])) ? itemData[proName] : parseFloat(itemData[proName]);
                } else {
                    typeData[proName] = itemData[proName];
                }
            }
        }

        protected getKeyValue(item: T): string {
            if (typeof(this.keyPropName) != "string") {
                var idx: number;
                var len: number = this.keyPropName.length;
                var key: string = "";
                for (idx = 0; idx < len; idx++) {
                    key += item[this.keyPropName[idx]];
                    if (idx < len - 1) {
                        key += "&";
                    }
                }
                return key;
            }
            return item[this.keyPropName];
        }

        /******************************************************************/
        get keys(): any[] {
            if (this.useByteSrc) {
                return (this.config as BSV).keyList;
            }
            this.parseAll();
            return this._keys;
        }

        /**
         * 设置数据源
         */
        set dataSource(value: any) {
            this.data = value;
            this.useByteSrc = (typeof(this.data) != "string");
            this._dic = {};
            if (this.useByteSrc) {
                if (value["type"] == "big") { // 大数据
                    this.config = new BSV(true);
                    this.config.data = value["data"];
                } else if (value["type"] == "compress") { // 普通压缩数据
                    this.config = new BSV();
                    // zlib解压数据
                    var inflate = new Zlib.Inflate(new Uint8Array(value["data"]));
                    var outbuffer = inflate.decompress();
                    this.config.data = outbuffer.buffer;
                } else { // 普通数据
                    this.config = new BSV();
                    this.config.data = value;
                }
            } else {
                var csv: CSV = new CSV();
                this.config = csv;
                csv.headerLineNum = 0;
                csv.resolveHeaderType = true;
                this.config.data = value;
            }
            this.allDecoded = false;
        }

    }
}