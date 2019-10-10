module gui {
    export class PageTurn {
        private _itemClick: Function;
        private _com: fairygui.GComponent;
        private _list: fairygui.GList;
        private _type: any;
        private _preBtn: fairygui.GButton;
        private _nextBtn: fairygui.GButton;
        private _currentPage: number = 0;
        private _totalPage: number = 0;
        private _onTurnPage: () => void;
        private _pageText: fairygui.GTextField;
        private _itemRenderer: (relativeIndex, index, item) => void;
        private _callbackThisObj: any;
        private _pageNum: number = 0;
        private _length: number = 0;

        /**
         *  翻页
         * @param com           翻页资源 （翻页列表父级显示对象，里面包含特定组件：list,prevBtn,nextBtn,pageTxt缺一不可）
         * @param pkgName       包名
         * @param resName       对应的物件名
         * @param type          物件类型
         * @param itemRenderer  渲染物件方法 function(当前页的index，所有列表的index，item对象)
         * @param onChange      翻页触发方法
         */
        constructor(com: fairygui.GComponent, pkgName: string, resName: string, type: any, itemRenderer: (relativeIndex, index, item) => void, onTurnPage: () => void, callbackThisObj: any) {
            this._com = com;
            fairygui.UIObjectFactory.setPackageItemExtension(fairygui.UIPackage.getItemURL(pkgName, resName), type);
            this._list = this._com.getChild("list").asList;
            this._preBtn = this._com.getChild("prevBtn").asButton;
            this._nextBtn = this._com.getChild("nextBtn").asButton;
            if (this._com.getChild("pageTxt") != null) {
                this._pageText = this._com.getChild("pageTxt").asTextField;
            }
            this._itemRenderer = itemRenderer;
            this._callbackThisObj = callbackThisObj;
            this._list.itemRenderer = this.itemRenderer;
            this._list.callbackThisObj = this;
            this._type = type;
            this._preBtn.addClickListener(this.onPre, this);
            this._nextBtn.addClickListener(this.onNext, this);
            this._currentPage = 1;
            this._onTurnPage = onTurnPage;
        }

        dispose() {
            this._list.removeEventListener(fairygui.ItemEvent.CLICK, this.onItemClick, this);
            this._preBtn.removeClickListener(this.onPre, this);
            this._nextBtn.removeClickListener(this.onNext, this);
            this._com.dispose();
            this._com = null;
            this._list = null;
            this._type = null;
            this._itemClick = null;
            this._onTurnPage = null;
            this._itemRenderer = null;
            this._callbackThisObj = null;
        }

        /******************************************************************/
        private onPageChange() {
            if (this._currentPage > this._totalPage) {
                this._currentPage = 1;
            }
            this._preBtn.enabled = this._currentPage > 1;
            this._nextBtn.enabled = this._currentPage < this._totalPage;
            if (this._pageText) {
                this._pageText.text = String(this._currentPage) + "/" + this._totalPage;
            }
            this.numItems = this._pageNum;
            this._onTurnPage.call(this._callbackThisObj);
        }

        private onItemClick(event: fairygui.ItemEvent) {
            var item: any = event.itemObject;
            this._itemClick.call(this._callbackThisObj , item);
        }

        private onPre() {
            this._currentPage--;
            this.onPageChange();
        }

        private onNext() {
            this._currentPage++;
            this.onPageChange();
        }

        private itemRenderer(index: number, item: fairygui.GComponent) {
            this._itemRenderer.call(this._callbackThisObj, index, (this._currentPage - 1) * this._pageNum + index, item);
        }

        set itemClick(value: Function) {
            this._itemClick = value;
            if (value) {
                this._list.addEventListener(fairygui.ItemEvent.CLICK, this.onItemClick, this);
            }
            else {
                this._list.removeEventListener(fairygui.ItemEvent.CLICK, this.onItemClick, this);
            }
        }

        set length(value: number) {
            this._length = value;
            if (this._length == 0) {
                this._totalPage = 1;
            } else {
                this._totalPage = Math.floor((this._length - 1) / this._pageNum + 1);
            }
            this.onPageChange();
        }

        private set numItems(value: number) {
            this._list.numItems = value;
        }

        get currentPage(): number {
            return this._currentPage;
        }

        set currentPage(value: number) {
            this._currentPage = value;
            this.onPageChange();
        }

        get totalPage(): number {
            return this._totalPage;
        }

        get pageNum(): number {
            return this._pageNum;
        }

        set pageNum(value: number) {
            this._pageNum = value;
        }

    }
}

