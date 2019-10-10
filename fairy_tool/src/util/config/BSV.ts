/**
 * Created by lxz on 2017/10/30.
 */
module config {
    export class BSV implements face.IConfigParser {
        private _data: egret.ByteArray;
        // 键值类型（int string table）
        private _headerTypes: string[];
        // 键值
        private _headers: string[];
        private _headerList: any;
        // 存取判断值的有效性的数值
        private _flagBit: number;
        // 存储id键值对应的数据位置和长度
        private _posDataList: any;
        private _keyList: any[];
        private _items: any[];
        private _isBig: boolean;

        public constructor(big: boolean = false) {
            this._headerList = {};
            this._posDataList = {};
            this._keyList = [];
            this._isBig = big;
        }

        getType(p_fieldName: string): string {
            return this._headerList[p_fieldName];
        }

        decode(): void {
            this._items = [];
            for (var key in this._posDataList) {
                this._items.push(this.parseItem(key));
            }
        }

        getRecords(): any[] {
            return this._items;
        }

        parseItem(keyValue) {
            this._data.position = this._posDataList[keyValue];
            let flag;
            let maxFlag;
            if (this._flagBit < 5) {
                switch (this._flagBit) {
                    case 1:
                        flag = this._data.readUnsignedByte();
                        break;
                    case 2:
                        flag = this._data.readUnsignedShort();
                        break;
                    default:
                        flag = this._data.readUnsignedInt();
                        break;
                }
            } else {
                flag = this._data.readUnsignedInt();
                maxFlag = this._data.readUnsignedByte();
            }
            //trace.traceData(["位数:", flag, maxFlag, this._flagBit]);
            let len = this._headerTypes.length;
            let item = {};
            for (let i = 0; i < len; i++) {
                let b: boolean;
                if (i < 32) {
                    b = (Math.pow(2, i) & flag) != 0;
                } else {
                    b = (Math.pow(2, i - 32) & maxFlag) != 0;
                }
                if (b) { //值有效
                    switch (this._headerTypes[i]) {
                        case "int":
                            item[this._headers[i]] = this._data.readFloat();
                            //trace.traceData(["int:", item[this._headers[i]], this._headers[i]]);
                            break;
                        case "string":
                            let cl1 = this._data.readUnsignedShort();
                            item[this._headers[i]] = this._data.readUTFBytes(cl1);
                            //trace.traceData(["string:", item[this._headers[i]], this._headers[i], cl1]);
                            break;
                        default:
                            let cl2 = this._data.readUnsignedShort();
                            let str = this._data.readUTFBytes(cl2);
                            //console.log("解析数据:" + i + "--" + this._headers[i] + "--" + str + "--" + len + "--" + this._headers.length);
                            item[this._headers[i]] = str;
                            // item[this._headers[i]] = config.LuaObjUtil.parse(str);
                            break;
                    }
                }
            }
            return item;
        }
        /******************************************************************/
        /**
         * 解析数据
         */
        private parseBuffer() {
            // 解析buffer
            let type = this._data.readUnsignedByte();
            this._headerTypes = [];
            this._headers = [];
            while (type != 0) {
                switch (type) {
                    case 1:
                        this._headerTypes.push("int");
                        break;
                    case 2:
                        this._headerTypes.push("string");
                        break;
                    default:
                        this._headerTypes.push("table");
                        break;
                }
                let len = this._data.readUnsignedByte();
                //console.log("键长度:" + len);
                let key = this._data.readUTFBytes(len);
                this._headers.push(key);
                this._headerList[key] = this._headerTypes[this._headerTypes.length - 1];
                type = this._data.readUnsignedByte();
            }
            this._flagBit = Math.floor((this._headers.length - 1) / 8) + 1;
            if (this._flagBit == 3) {
                this._flagBit = 4;
            }
            let contentlen = this._isBig ? this._data.readUnsignedInt() : this._data.readUnsignedShort();
            //console.log("内容总长度:" + contentlen);
            for (let i = 0; i < contentlen; i++) {
                let itemLen = this._data.readUnsignedShort();
                let keyValue = this._data.readUnsignedShort();
                if (this._posDataList[keyValue]) { // 暂时这样处理(这种情况是不是以id int类型为键值。以字符串为为唯一键值)
                    keyValue = this._keyList[this._keyList.length - 1] + 1;
                }
                this._posDataList[keyValue] = this._data.position;
                this._keyList.push(keyValue);
                //console.log("位置值:" + this._posDataList[keyValue]);
                this._data.position += itemLen;
            }
        }

        /******************************************************************/
        set data(value: ArrayBuffer) {
            this._data = new egret.ByteArray(value);
            this.parseBuffer();
        }

        get keyList(): any[] {
            return this._keyList;
        }
    }
}