class CEvent extends egret.Event {
	/**
	 * 自定义参数
	 */
	protected _data: any;
	/**
	 * 构造
	 * @param	p_type			事件名
	 * @param	p_data			单元数据
	 * @param	p_bubbles		是否参与冒泡
	 * @param	p_cancelable	是否可以取消 Event 对象
	 */
	public constructor(p_type: string, p_data: any = null, p_bubbles: boolean = false, p_cancelable: boolean = false) {
		super(p_type, p_bubbles, p_cancelable);
		this._data = p_data;
	}

	/**
	 * 自定义数据.
	 * 发送事件时会将此数据一起发送出去，侦听事件的对象可以通过e.data来获得发送的数据。
	 */
	public get data(): any {
		return this._data;
	}
}