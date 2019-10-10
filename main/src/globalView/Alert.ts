module api {
	export class Alert extends gui.OvBase{
		private _message:string;  //显示的文字
		private _button :number;  //1是只有确定 2有确定和取消
		private _callback: FunctionInfo;
		static OK: number = 1;
        static CANCEL: number = 2;
        static OK_CANCEL: number = 3;
		public constructor(message:string,button:number=1,callback:(...args)=>void=null,context:any=null,...args) {
			super("common","alerView");
		
		}

	}

	export function createAlert(message: string, buttons: number = 1, callback: (...args) => void = null, context: any = null, ...args) {
        var alert: Alert = new Alert(message, buttons, callback, context, ...args);
		gui.addBox(alert);
	 //	this.alert.addEventListener(GameEvent.DISPOSED,this.onAlertRemove,this);
        return alert;
    }
}