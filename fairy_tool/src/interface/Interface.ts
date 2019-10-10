/**
 *
 * @author
 *
 */
module face {
    /**
     * 回收池对象专有方法
     * @author lxz
     * @version 2015-3-18
     */
    export interface IPoolObject {
        // 初始化对象
        initData(obj?: any);
        // 回收对象
        retrieve();
        hasInit: boolean;
    }

    /**
     * 时间器接口
     * @author lxz
     * @version 2015-3-18
     */
    export interface ITimer {
        // 开始
        start();
        // 停止
        reset();
        // 暂停
        pause();
        // 帧频刷新
        onFrame(time: number);
        // 时间器标志位(不允许修改)
        timerKey: number;

    }

    export interface ILoading {
        setProgress(itemsLoaded, itemsTotal);
    }
    /**
     * 限定数据列表
     */
    export class IMap<T> {
        [key: string]: T;
    }
    /**
     * 限定map列表
     */
    export interface IKeysToMap<T> {
        [key:string]:face.IMap<T[]>;
    }
    /**
     * map_list
     */
    export interface IMapList<T>{
        __map_list:T[];
    }
    /**
     * 无限定数据列表
     */
    export interface IMapInfo{
        [key:string] : any;
    }

    /**
     * 配置解析器
     */
    export interface IConfigParser{
        data: any;
        getRecords(): any[];
        decode():void;
        getType(p_fieldName:string):string;
    }
}

