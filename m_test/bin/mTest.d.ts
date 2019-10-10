declare module module_mTest {
    class Core {
        constructor();
    }
}
declare module module_mTest {
    class Data {
        constructor();
    }
}
declare module m_test {
    class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {
        constructor();
        private textField;
        private createView();
        onProgress(current: number, total: number, any: any): void;
    }
}
declare module module_mTest {
    class Main extends base.BaseModule {
        constructor();
        open(): void;
        private textfield;
        /**
         * 创建游戏场景
         * Create a game scene
         */
        private createGameScene();
        private startGame();
    }
}
declare module module_mTest {
    class DoorView extends gui.OvBase {
        constructor();
        dispose(): void;
        open(...args: any[]): void;
    }
}
