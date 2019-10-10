/**
 * 全局消息定义
 * Created by silence on 2017/6/30.
 */
module define{
    export class Notice {
        static DATA_UPDATE: string = "DATA_UPDATE";  //收到后端数据，更新
        static CHANGE_DATA: string = "CHANGE_DATA";  //数据更新，写入缓存前派发，原来缓存的数据，和新数据会传入
        static OPEN_MODULE: string = "OPEN_MODULE";  //打开模块
        static MAP_VALUE_ADD: string = "MAP_VALUE_ADD";  //map值添加
        static MAP_VALUE_REMOVE: string = "MAP_VALUE_REMOVE";  //map值移除


    }

}
