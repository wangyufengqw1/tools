module api {
	export class Tool {
		public constructor() {
		}

		/**
		 * 获取最大值
		 * @param arr 集合数组
		 * @param str 对比的属性
		 */
		getMaxByPro(arr:any,str:string):number
		{
			let max : number = 0;
			for(let i : number = 0;i<arr.length;i++){
				if(arr[max][str]<arr[i][str]){
					max = i;
				}
			}
			return max;
		}

		/**
		 * 获取最小值
		 * @param arr 集合数组
		 * @param str 对比的属性
		 */
		getMinByPro(arr:any,str:string):number
		{
			let min : number = 0;
			for(let i : number = 0;i<arr.length;i++){
				if(arr[min][str]>arr[i][str]){
					min = i;
				}
			}
			return min;
		}
	}
}