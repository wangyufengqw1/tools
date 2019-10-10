module timeUtils {
	export class TimeUtils {
		public TimeMin = 60;
		public TimeHour = this.TimeMin * 60;
		public TimeDay = this.TimeHour * 24;
		public TimeWeek = this.TimeDay * 7;

		//初始化时间戳
		public initRefreshTime() {
			this.addTimerFunc(1000, () => {
				this.timestamp0();
			}, this);
		}

		/* 添加定时器*/
		private timerList: { [key: number]: { timer: egret.Timer, func: Function, list: { func: Function, thisObj: egret.DisplayObject }[] } } = {};
		public addTimerFunc(key: number, timerfunc: Function, thisObj: any) {
			let timerList = this.timerList[key];
			if (!timerList) {
				let timer = new egret.Timer(key);
				let func = () => {
					let list = this.timerList[key].list;
					let len = list.length;
					for (let i = 0; i < len; ++i) {
						let list0 = list[i];
						if (list0.func && list0.thisObj) {
							list0.func.call(list0.thisObj);
							if (list.length != len) {
								len = list.length;
								--i;
							}
						}
					}
				}
				timerList = { timer: timer, func: func, list: [{ func: timerfunc, thisObj: thisObj }] };
				this.timerList[key] = timerList;
				timer.addEventListener(egret.TimerEvent.TIMER, func, this);
				timer.start();
			} else {
				let list = timerList.list;
				let len = list.length;
				for (let i = 0; i < len; ++i) {
					let list0 = list[i];
					if (list0.func == timerfunc && list0.thisObj == thisObj) {
						return;
					}
				}
				list.push({ func: timerfunc, thisObj: thisObj });
				if (list.length == 1) {
					timerList.timer.start();
				}
			}
		}
		//删除定时器
		public removeTimerFunc(key: number, timerfunc: Function, thisObj: any) {
			let timerList = this.timerList[key];
			if (!timerList) return;
			let list = this.timerList[key].list;
			let len = list.length;
			for (let i = 0; i < len; ++i) {
				let list0 = list[i];
				if (list0.func == timerfunc && list0.thisObj == thisObj) {
					list.splice(i, 1);
					len = list.length;
					--i;
				}
			}
			if (list.length < 1) {
				timerList.timer.stop();
			}
		}

		public toFriendly(time: number): string {
			let itl = this.getInterval(time);
			if (itl > this.TimeWeek) {
				return (itl / this.TimeWeek).toFixed() + '周前';
			} else if (itl > this.TimeDay) {
				return (itl / this.TimeDay).toFixed() + '天前';
			} else if (itl > this.TimeHour) {
				return (itl / this.TimeHour).toFixed() + '小时前';
			} else if (itl > this.TimeMin) {
				return (itl / this.TimeMin).toFixed() + '分钟前';
			} else {
				return '刚刚';
			}
		}

		public toTimeHour(time: number, isDate: boolean = true): string {
			let itl = time;
			if (isDate) {
				itl = time - this.timestamp();
			}
			let str = '';
			if (itl > this.TimeHour) {
				str += Math.floor(itl / this.TimeHour) + ':';
				itl = itl - Math.floor(itl / this.TimeHour) * this.TimeHour;
			}
			if (itl > this.TimeMin || itl) {
				str += ('00' + Math.floor(itl / this.TimeMin)).slice(-2) + ':';
				itl = itl - Math.floor(itl / this.TimeMin) * this.TimeMin;
			}
			str += ('00' + itl).slice(-2);
			return str;
		}

		public toTimeHour2(time: number): string {
			let itl = time;
			let str = '';
			if (itl > this.TimeHour) {
				str += Math.floor(itl / this.TimeHour) + ':';
				itl = itl - Math.floor(itl / this.TimeHour) * this.TimeHour;
			}
			str += ('00' + Math.floor(itl / this.TimeMin)).slice(-2);
			itl = itl - Math.floor(itl / this.TimeMin) * this.TimeMin;
			if (itl > 0) {
				str += ':' + ('00' + itl).slice(-2);
			}
			return str;
		}
		public toTimeHour3(time: number): string {
			let itl = time;
			let str = '';
			if (itl > this.TimeHour) {
				let hour = Math.floor(itl / this.TimeHour);
				if (Math.floor(hour / 24) > 0) {
					str = Math.floor(hour / 24) + '天 ';
					itl = itl - Math.floor(hour / 24) * this.TimeDay;
				}
				str += Math.floor(itl / this.TimeHour) + ':';
				itl = itl - Math.floor(itl / this.TimeHour) * this.TimeHour;
			}
			str += ('00' + Math.floor(itl / this.TimeMin)).slice(-2);
			itl = itl - Math.floor(itl / this.TimeMin) * this.TimeMin;
			str += ':' + ('00' + itl).slice(-2);
			return str;
		}

		public toSeconds(time: string): number {
			let index = time.indexOf(':');
			let hours = (Number)(time.substring(0, index));
			let minutes = (Number)(time.substring(index + 1, time.length));
			let seconds = hours * this.TimeHour + minutes * this.TimeMin
			return seconds;
		}

		public timeToSeconds(): number {
			let time = new Date(this.timestamp() * 1000);
			let curTime = time.getHours() * this.TimeHour + time.getMinutes() * this.TimeMin + time.getSeconds();
			return curTime;
		}

		public format(time: number) {
			let t = new Date(time);
			let y = t.getFullYear();
			let m = t.getMonth() + 1;
			let d = t.getDate();
			return y + '年' + m + '月' + d + '日';
		}

		public toDayTime(time: number) {
			let str = '';
			let d = Math.floor(time / this.TimeDay);
			time -= d * this.TimeDay;
			if (d > 0) {
				str = str + d + '天';
			}
			let h = Math.floor(time / this.TimeHour);
			time -= h * this.TimeHour;
			str = h > 0 ? str + h + '小时' : str;
			let m = Math.floor(time / this.TimeMin);
			let s = time - m * this.TimeMin;
			str = m > 0 ? str + m + '分' : str;
			str = s > 0 ? str + s + '秒' : str;
			return str;
		}

		/** 
		 *  1970 到现在的获取时间戳
		 */
		private $timestamp: number = 0;
		public timestamp(): number {
			return this.$timestamp;
		}

		private timestamp0(): number {
			this.$timestamp = Math.floor(new Date().getTime() / 1000 + this.disServerTime);
			return this.$timestamp;
		}

		/**
		 * 获取现在之前距离到现在的时间，单位秒
		 */
		public getInterval(before: number): number {
			return (this.timestamp() - before);
		}

		/**
		 * 获取今天剩余的时间
		 */
		public getSurplusTime(): number {
			let curTime = this.timestamp();
			let t = new Date(curTime * 1000);
			let surplusTime = this.TimeDay - ((t.getHours() + 1) * this.TimeHour + t.getMinutes() * this.TimeMin + t.getSeconds());
			return surplusTime;
		}

		/*
		*	将时间戳转为 2017-02-04 00:00:00 的形式
		*/
		public timeToformat(time?: number): string {
			let t;
			if (time) {
				t = new Date(time);
			} else {
				t = new Date(this.timestamp());
			}
			let y = t.getFullYear();
			let m = ('00' + Math.floor(t.getMonth() + 1)).slice(-2);
			let d = ('00' + Math.floor(t.getDate())).slice(-2);
			let h = ('00' + Math.floor(t.getHours())).slice(-2);
			let mm = ('00' + Math.floor(t.getMinutes())).slice(-2);
			//let s = ('00' + Math.floor(t.getSeconds())).slice(-2);
			return y + '-' + m + '-' + d + ' ' + h + ':' + mm;//+ ':' + s;
		}

		/*
		*	将时间戳转为 
		
			02-04 
		   00:00:00    的形式
		*/
		public timeToformat2(time?: number): string {
			let t;
			if (time) {
				t = new Date(time);
			} else {
				t = new Date(this.timestamp());
			}
			let m = t.getMonth() + 1;
			m = ('00' + m).slice(-2);
			let d = ('00' + Math.floor(t.getDate())).slice(-2);
			let h = ('00' + Math.floor(t.getHours())).slice(-2);
			let mm = ('00' + Math.floor(t.getMinutes())).slice(-2);
			let s = ('00' + Math.floor(t.getSeconds())).slice(-2);
			return m + '-' + d + '\n' + h + ':' + mm + ':' + s;
		}
		/*
		*	将时间戳转为 
		
			2018-7-25   的形式
		*/
		public timeToformat3(time?: number): string {
			let t;
			if (time) {
				t = new Date(time);
			} else {
				t = new Date(this.timestamp());
			}
			let y = t.getFullYear();
			let m = ('00' + Math.floor(t.getMonth() + 1)).slice(-2);
			let d = ('00' + Math.floor(t.getDate())).slice(-2);
			return y + '-' + m + '-' + d;
		}

		/*
			初始化本地时间
		*/
		private severTime: number = 0;
		private disServerTime: number = 0;
		public initTime(t: number) {
			t = t || 0;
			this.severTime = t;
			this.disServerTime = t - Math.floor(new Date().getTime() / 1000);
		}

		//判断是否是当天
		public isToday(time: number) {
			if (new Date(time * 1000).toDateString() === new Date(this.timestamp() * 1000).toDateString()) {
				return true;
			}
			return false;
		}
	}
	export const time: TimeUtils = new TimeUtils();
}
