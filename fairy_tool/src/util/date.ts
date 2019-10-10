/**
 * Created by lxz on 2018/3/26.
 */
module dateTool{
    /**
     * 获取当年当月的天数
     * @param year      0:是当前年
     * @param month     0:是当前月
     * @returns {number}
     */
    export function getCountDays(year?:number , month?:number) {
        let curDate = new Date();
        if(year){
            if(month){
                curDate.setFullYear(year , month - 1);
            }else{
                curDate.setFullYear(year);
            }
        }
        /* 获取当前月份 */
        let curMonth = curDate.getMonth();
        /*  设置成下个月 */
        curDate.setMonth(curMonth + 1);
        /* 将日期设置为0, 则该日期变为上个月的最后一天 */
        curDate.setDate(0);
        /* 返回当月的天数 */
        return curDate.getDate();
    }

    /**
     * 获取几分几秒
     * time 秒
     */
    export function getTime0(time:number):string {
        return `${Math.floor(time / 60)}分${Math.floor(time % 60)}秒`;
    }
    /**
     * 获取几分几秒几毫秒
     * time 毫秒
     */
    export function getTime1(time:number):string {
        let ntime = Math.floor(time * .001);
        return `${Math.floor(ntime / 60)}分${Math.floor(ntime % 60)}秒${Math.floor((time % 1000) * .1)}毫秒`;
    }
    /**
     * 由时间格式2000-1-1-6-30-30获取总的时间毫秒
     */
    export function timestrToTime(timestr:string):number{
        let arr = timestr.split("-");
        let date = new Date();
        date.setFullYear(parseInt(arr[0]), parseInt(arr[1]) - 1, parseInt(arr[2]));
        date.setHours(arr.length > 3 ? parseInt(arr[3]) : 0);
        date.setMinutes(arr.length > 4 ? parseInt(arr[4]) : 0);
        date.setSeconds(arr.length > 5 ? parseInt(arr[5]) : 0);
        return date.getTime();
    }
    /**
     * 由时间格式2000-1-1-6-30-30
     * 判断时间格式在不在当前时间范围内
     */
    export function inTime(time:number , timestr1:string , timestr2:string):boolean{
        return time > timestrToTime(timestr1) && time < timestrToTime(timestr2);
    }
}