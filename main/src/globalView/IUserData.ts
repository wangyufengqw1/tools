module api {
	export interface IUserData {
		setUserName(value:string):void;
		getUserName():string;
		setUserCoins(value:number);
		getUserCoins():number;
		setUserIcon(value:number):void;
		getUserIcon():number;
		getOpenId():string;
		setOpenId(value:string):void;
	}

	export class UserData implements IUserData
	{
		private $userName : string;
		private $coins    : number = 0;
		private $icon     : number;
		private $openId   : string;
		//玩家名称
		setUserName(value:string):void
		{
			this.$userName = value;
		};  
		getUserName():string
		{
			return this.$userName;
		}; 
		//玩家金币           
		setUserCoins(value:number):void
		{
			this.$coins = value;
		};
		getUserCoins():number{
			return this.$coins;
		};
		//玩家头像
		setUserIcon(value:number):void{
			this.$icon = value
		};  
		getUserIcon():number{
			return this.$icon;
		};

		getOpenId():string
		{
			return this.$openId;
		};    
		setOpenId(value:string):void
		{
			this.$openId = value
		};
	}
}