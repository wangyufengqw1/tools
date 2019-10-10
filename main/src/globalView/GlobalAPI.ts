module api {
	export class GlobalAPI {
		//本地存储
		static localData : ILocalData;
		//网络连接
		static webSocket : INetWork;
		//玩家信息
		static userData  : IUserData;
		//音乐
		static soundManager : SoundManagers;
		//
		static publicApi : PublicAPi
		/**
		 * 模块管理
		 */
		static moduleManager: ModuleManager;

		static initView(value:egret.Stage):void
		{ 
			this.localData = new LocalData();
			this.webSocket = new Network();
			this.userData  = new UserData();
			this.moduleManager = new ModuleManager();
			this.soundManager = new SoundManagers(value);
			this.publicApi = new PublicAPi();
		}
	}
}