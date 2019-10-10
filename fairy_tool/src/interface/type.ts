/**
 * Created by lxz on 2017/10/19.
 */
/**
 * map类型
 */
type __MapList<T> = face.IKeysToMap<T> & face.IMapList<T>;
/**
 * 数据键值映射
 */
type __KeyOf<T> = keyof T;
type __Key = string | number;
type __Function = string | ((...args)=>any);
type __Map = {[key: string]: any};