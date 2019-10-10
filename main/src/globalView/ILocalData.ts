module api {
	export interface ILocalData {
		get(item:string):string;
		set(item:string,value:string);
		remove(item:string);
	}

	export class LocalData implements ILocalData
	{
		get(item:string):string
		{
			return egret.localStorage.getItem(item);
		}

		set(item:string,value)
		{
			egret.localStorage.setItem(item,value);
		} 

		remove(item:string)
		{
			egret.localStorage.removeItem(item);
		}
	}
}