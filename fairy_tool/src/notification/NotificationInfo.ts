/**
 * Created by silence on 2017/6/28.
 */
interface  NotificationInfo
{
    name:string;
    sender:(...args)=>any;
    context:any;
    priority:number;

}
