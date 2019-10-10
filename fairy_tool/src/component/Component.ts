/**
 * Created by lxz on 2017/8/22.
 */
module component {
    export class Entity {
        private _components: any;

        public constructor() {
            this._components = {};
        }
        dispose(){
            this.removeAllComponent();
            this._components = null;
        }

        addComponent<T extends Component>(comCl: { new(): T; }): T {
            let type: string = definiton.getNameByClass(comCl);
            if (type in this._components) return;
            let com = gameTool.poolList.getInstance(comCl);
            if (com.type != type) {
                trace.error("组件类型不对应: ", [type, com.type]);
            }
            this._components[type] = com;
            return com;
        }

        removeComponent(type: string): void {
            gameTool.poolList.remove(this._components[type]);
            delete this._components[type];
        }

        getComponent<T extends Component>(comCl: { new(): T; }): T {
            let type: string = definiton.getNameByClass(comCl);
            if (!(type in this._components)) return null;
            return this._components[type];
        }

        containComponent<T extends Component>(comCl: { new(): T; }): boolean {
            let type: string = definiton.getNameByClass(comCl);
            return type in this._components;
        }

        removeAllComponent(): void {
            for (let type in this._components) {
                this.removeComponent(type);
            }
        }
    }

    export class Component {
        public constructor() {

        }

        public  get type(): string {
            return definiton.getClassNameByObject(this);
        }
    }

    export class BaseComponent extends Component implements face.IPoolObject {
        name: string;
        private _object: any;
        hasInit: boolean;

        public constructor() {
            super();
        }

        dispose() {
            if (this.hasInit) {
                this.retrieve();
            }
            this._object = null;
        }

        retrieve(): void {
            this._object = null;
        }

        initData(obj: any = null) {

        }

        /*  初始对象*/
        initObject(object: any) {
            this._object = object;
        }

        getObject<T>(cl:{new ():T;}): T {
            return this._object;
        }
        /***************************************************************************************/
    }
}