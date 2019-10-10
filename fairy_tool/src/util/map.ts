/**
 * Created by lxz on 2017/10/19.
 */
module map {
    /**
     * mapinfo的data管理
     */
    export class MapData<T extends face.IMapInfo> {
        private _keys: __KeyOf<T>[] = [];
        private _map: MapList<T>;
        private _info: T;

        constructor(keys: __KeyOf<T>[]) {
            this._keys = keys;
        }

        dispose() {
            this._keys = null;
            this._map = null;
            this._info = null;
        }

        setValue(pro: keyof T, value: any): MapData<T> {
            let b = this._keys.indexOf(pro) > -1;
            if (b) {
                this._map.removeByPro(this, pro);
            }
            this._info[pro] = value;
            if (b) {
                this._map.addByPro(this, pro);
            }
            return this;
        }

        /******************************************************************/
        get info(): T {
            return this._info;
        }

        set info(value: T) {
            this._info = value;
        }

        set map(value: map.MapList<T>) {
            this._map = value;
        }
    }
    /******************************************************************/
    /******************************************************************/
    /******************************************************************/
    /*
     用法
     let mapList = new map.MapList<Info>(Info , ["id","name" , "value"]);
     mapList.getNewMapData();
     mapList.getNewMapData().setValue("id" , 2);
     mapList.getNewMapData().setValue("id" , 3).setValue("name" , "aaa");
     mapList.getNewMapData().setValue("value" , 100);

     console.log(mapList.length);
     console.log(mapList.getMapDataByPro("id",2));
     console.log(mapList.getMapDatas("id",1));
     console.log(mapList.getMapDataByPro("name","aaa"));

     class Info implements face.IMapInfo{
     id: number = 1;
     name: string = "xxx";
     value: number = 1;
     }
     */
    export class MapList<T extends face.IMapInfo> {
        private _mapList: __MapList<MapData<T>>;
        private _infoClass: any;
        private _keys: __KeyOf<T>[];

        /**
         * 指定数据的map列表(列表包含数据列表。可指定info键值获取一个map。map根据键值对应的值指向一个数据列表)
         * @param infoClass     数据类
         * @param keys          对应的value值需要初始化
         */
        constructor(infoClass: any, keys: __KeyOf<T>[]) {
            this._mapList = {} as __MapList<MapData<T>>;
            this._infoClass = infoClass;
            this._mapList.__map_list = [];
            this._keys = keys;
        }

        dispose() {
            for (let i = 0; i < this.length; i++) {
                this.getMapData(i).dispose();
            }
            this._mapList = null;
            this._infoClass = null;
            this._keys = null;
        }

        /**
         * 获取一个新的数据(变动的值要使用data的setValue赋值)
         */
        getNewMapData(): MapData<T> {
            let data: MapData<T> = new MapData<T>(this._keys);
            data.info = new this._infoClass;
            data.map = this;
            this.add(data);
            return data;
        }

        /**
         * 添加map一个值
         */
        add(o: MapData<T>) {
            mathTool.addValueByArray(o, this._mapList.__map_list);
            let len = this._keys.length;
            for (let i = 0; i < len; i++) {
                if (definiton.hasProperty(o.info, this._keys[i])) {
                    this.addByPro(o, this._keys[i]);
                } else {
                    trace.error("规定的类型与key映射有问题或未初始化" + this._keys[i]);
                }
            }
        }

        /**
         * 移除map一个值
         */
        remove(o: MapData<T>) {
            mathTool.cutValueByArray(o, this._mapList.__map_list);
            let len = this._keys.length;
            for (let i = 0; i < len; i++) {
                if (definiton.hasProperty(o.info, this._keys[i])) {
                    this.removeByPro(o, this._keys[i]);
                } else {
                    trace.error("规定的类型与key映射有问题或未初始化" + this._keys[i]);
                }
            }
        }

        addByPro(o: MapData<T>, pro: keyof T) {
            if (!definiton.hasProperty(this._mapList, pro)) {
                this._mapList[pro] = {};
            }
            let value = o.info[pro];
            if(value == null){
                return;
            }
            let key = this.getValueKey(value);
            if (!definiton.hasProperty(this._mapList[pro], key)) {
                this._mapList[pro][key] = [];
            }
            mathTool.addValueByArray(o, this._mapList[pro][key]);
        }

        removeByPro(o: MapData<T>, pro: keyof T) {
            if (definiton.hasProperty(this._mapList, pro)) {
                let value = o.info[pro];
                if(value == null){
                    return;
                }
                let key = this.getValueKey(value);
                if (definiton.hasProperty(this._mapList[pro], key)) {
                    mathTool.cutValueByArray(o, this._mapList[pro][key]);
                }
            }
        }

        /**
         * 根据索引获取数据
         */
        getMapData(index: number): MapData<T> {
            return this._mapList.__map_list[index];
        }

        /**
         * 获取指定数据列表
         */
        getMapDatas(pro: keyof T, value: any): MapData<T>[] {
            let key = this.getValueKey(value);
            return this._mapList[pro][key];
        }

        /**
         * 获取指定数据
         */
        getMapDataByPro(pro: keyof T, value: any): MapData<T> {
            let key = this.getValueKey(value);
            let list = this._mapList[pro][key];
            if (list && list.length > 0) {
                return list[0];
            }
            return null;
        }

        /******************************************************************/
        private getValueKey(value: any): string {
            switch (typeof value) {
                case "string":
                    return value;
                case "boolean":
                    return value ? "1" : "0";
                case "number":
                    return value.toString();
                default:
                    return gameTool.getTypeId(value);
            }
        }

        /******************************************************************/
        /**
         * 获取数据长度
         */
        get length(): number {
            return this._mapList.__map_list.length;
        }
    }
}