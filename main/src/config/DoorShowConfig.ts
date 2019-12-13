class DoorShowConfig extends config.BaseConfig<DoorShowTypeData>{
		public constructor() {
			super(DoorShowTypeData,"id");
		}

		static getInstance():DoorShowConfig
		{
			return gameTool.singleton(DoorShowConfig);
		}

		static init(dataSrc:any):void
		{
			DoorShowConfig.getInstance().dataSource = dataSrc;
		}

		/**
		 * 获取到排行榜
		 */
		static getRank():any
		{
			if(api.GlobalAPI.publicApi.isRelease){
				return DoorShowConfig.getInstance().getTypeData(1).rank;
			}else{
				return DoorShowConfig.getInstance().getTypeData(3).rank;
			}	
		}


		/**
		 * 获取横竖
		 */
		static getCow():any
		{
			return DoorShowConfig.getInstance().getTypeData(2).rank;
		}

		/**
		 * 开启的才算
		 */
		static getLen():number
		{
			var num : number = 0;
			for(let k in this.getInstance().dic)
			{
				if((this.getInstance().dic[k] as DoorShowTypeData).open == 1){
					num++;
				}
			}
			return num;
		}		
}

class DoorShowTypeData
{
	id         : number;            //唯一标识符
	name       : string;            //游戏名称
	state      : number;            //游戏状态 0无1hot2new
	free       : number;            //0无1试玩
	color      : number;            //0红1蓝色2绿色3姨妈红4咖啡色
	url        : string;            //手机端底图
	type       : number;            //分类类型
	moduleName : string;            //模块类型
	rank       : any;               //排行
	open       : number;            //游戏是否开启
}