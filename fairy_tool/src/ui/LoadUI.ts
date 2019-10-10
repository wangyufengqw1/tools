/**
 * Created by lxz on 2017/8/5.
 */
///<reference path="OvBase.ts"/>
module loadUI {
    export interface ILoadUI {
        setProgress(current: number, total: number): void;
    }
    export class BaseLoadingUI extends gui.OvBase implements ILoadUI {
        public constructor(resName: string, modal: boolean = true, center: boolean = true) {
            super("load_ui", resName, modal, center);
            this.uiType = define.UITypeDefine.NONE;
        }

        open(moduleName:string) {
            super.open(moduleName);
        }

        setProgress(current: number, total: number): void {
        }
        /******************************************************************/
    }
    // export class LoadingUI extends BaseLoadingUI {
    //     private progress: fairygui.GProgressBar;
    //
    //     public constructor() {
    //         super("loading_ui");
    //     }
    //
    //     createView(): void {
    //
    //     }
    //
    //     setProgress(current: number, total: number): void {
    //         this.progress.value = current;
    //         this.progress.max = total;
    //         //console.log(`Loading...${current}/${total}`);
    //     }
    // }
}