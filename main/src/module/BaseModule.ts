module base {
	export class BaseModule extends egret.EventDispatcher{
		/**
		 * 是否缓存
		 */
		protected isCache: boolean = true;
		/**
		 * 模块名字
		 */
		protected _moduleName: string;
		/**
		 * 模块包名
		 */
		protected _packageName: string;

		protected _groups: string[];
	//	protected _mediator: BaseMediator;

		protected _moduleInfo: ModuleInfo

		public constructor() {
			super();
		}

		enter(p_moduleInfo: ModuleInfo, ...args) {
			this._moduleInfo = p_moduleInfo;
			loadUtil.loadConfigItems(mathTool.pluck(this.getConfigs(), "path"), () => {
				p_moduleInfo.coreClass["data"] = new p_moduleInfo.dataClass;
				this.open(...args);
				this.initData(...args);
			}, this, mathTool.pluck(this.getConfigs(), "parse"), this);
		}

		public initData(...args): void {
		}

		public isApplying:boolean = false;
		open(...args) {
			this.isApplying = true;
		}

		close() {
			this.isApplying = false;
			this._moduleInfo.coreClass["data"]["dispose"]();
			this._moduleInfo.coreClass["dispose"]();
			this._groups = null;
		}



		/**
		 * 加载配置
		 */
		getConfigs(): __ConfigItem[] {
			return [];
		}

		/**
		 * 加载资源组
		 */
		loadGroup(group: string, loadingType: number = 0, fun: (...args) => any, context: any, ...args) {
			loadUtil.loadGroup(group, null, fun, context, ...args);
			mathTool.addValueByArray(group, this._groups);
		}


		/******************************************************************/
		/**
		 * 销毁缓存
		 */
		protected destroyCache() {
			// let len = this._groups.length;
			// for (let i = 0; i < len; i++) {
			//     let arr = RES.getGroupByName(this._groups[i]);
			//     let len = arr.length;
			//     for (let j = 0; j < len; j++) {
			//        RES.destroyRes(arr[j].name);
			//     }
			// }
		}

		/******************************************************************/
		get moduleName(): string {
			return this._moduleName;
		}

		set moduleName(value: string) {
			this._moduleName = value;
			this._packageName = "module_" + this._moduleName;
			this._groups = [value];
		}
	}
}

type __ConfigItem = {
    path: string;
    parse: (res) => void;
}