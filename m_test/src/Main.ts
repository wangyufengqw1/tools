module module_mTest {
	export class Main extends base.BaseModule{
		public constructor() {
        	super();
   		 }

		open():void
		{
			this.createGameScene();
		}	
		

		private textfield: egret.TextField;
		/**
		 * 创建游戏场景
		 * Create a game scene
		 */
		private createGameScene() {
			fairygui.UIConfig.defaultFont = "宋体";                  //设置字体
			// this.stage.addChild(fairygui.GRoot.inst.displayObject);  //fairygui需要加入到舞台上 
			// this.stage.setContentSize(1080,1920);
			// this.stage.frameRate = 60;
			//gameTool.init(this);
			this.startGame();
		}

	

		private startGame():void
		{     
			// var url = window.document.location.href.toString();
			// let ip: string = "192.168.2.101";
			// if(url.indexOf("47.244.208.140")>-1){
			// 	ip = "47.52.32.227";
			// }
			// let port: number = 9994;
			// api.GlobalAPI.webSocket.connectServer(ip + ":" + port, () => {
				
			// });
			gameTool.stage.setContentSize(1920,1080);
			gui.addScene(DoorView)
		}

	}
		
}