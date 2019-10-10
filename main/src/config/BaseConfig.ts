class BaseConfig<T>{
	private _$clazz : any;
	private _$name  : string;
	private _$id    : string;
	dic     : any;
	public constructor(clazz:any,id:string) {
		this._$clazz = clazz;
		this._$id    = id;
		this.dic     = [];
	}

	/**
	 * 初始化数据
	 */
	set dataSource(value : string)
	{
		this._$name = this._$clazz.toString();
		this.analyseTxt(value);
	}

	/**
	 * 解析文本
	 */
	private analyseTxt(data:string):void
	{
		if(!data){
			console.error("数据读取失败",this._$name);
		}
		let datas  = data.split(/\r?\n/);
		let fields : {[k:number]:string} = {};
		let idBoolean : boolean = false;
		datas[1].split("\t").forEach(function(value,index)
		{
			if(value.length<=0 || value.charAt(0) == "#"){
				return;
			}
			if(this._$id == value){
				idBoolean = true;
			}
			fields[value] = index;
		},this)

		// if(idBoolean){
		// 	console.error("没有唯一标识",this._$name);	
		// }

		datas.splice(0,2);
		let result : any = {};
		for(var i : number = 0;i<datas.length;i++){
			var item  = new this._$clazz();
			item = this.mapData(fields,datas[i].split('\t'),item);
			result[item[this._$id]] = item;
		}

		this.dic = result;
	}


	/**
	 * 数据解析
	 */
	private mapData(fields: { [k: number]: string },data,item) {
		let obj = {};
		for (let k in fields) {
			let va = data[fields[k]];    //读取信息
			// 解析成列表
			if (k.search("List$") != -1) {  //数组用List名字区分
				let temp = [];
				if (va.length > 0) {
					va = va.split(';');   //里面的内容用;区分
					for (let index = 0; index < va.length; index++) {
						let value = va[index];
						if (this.isNum(value)) {
							value = Number(value);
						}
						temp.push(value);
					}
				}
				va = temp;
			} else {
				if (this.isNum(va)) {
					va = Number(va);
				} else if (va == "False" || va == "false") {
					va = false;
				} else if (va == "True" || va == "true") {
					va = true;
				}
			}
			item[k] = va;
		}
		return item;
	}

	private isNum(s) {
		if (typeof s == 'number')
			return true;
		if (typeof s != 'string')
			return false;

		if (s != null) {
			let r, re;
			re = /-?\d*\.?\d*/i; //\d表示数字,*表示匹配多个数字
			r = s.match(re);
			return (r == s) ? true : false;
		}
		return false;
	}


	/**
	 * 获取类型数据
	 */
	getTypeData(key: any): T
	{
		return this.dic[key];
	}
}
