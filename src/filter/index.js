/**
 * @param time 传入的时间字符串"2019-09-19 17:55:06"
 * @param type 要返回的时间字符串的格式类型
 * @param noformat 是否格式化时间为标准时间
 * @returns {string}
 */
import moment from "moment"

const getDate = (time, type, noformat) => {
  let d = time;
  if(!noformat){
    d = new Date(time);
  }
  const year = d.getFullYear()
  const month = getHandledValue(d.getMonth() + 1)
  const date = getHandledValue(d.getDate())
  const hour = getHandledValue(d.getHours())
  const minute = getHandledValue(d.getMinutes())
  const second = getHandledValue(d.getSeconds())
  let resStr = ''
  switch (type) {
    case 'yearSecond':
      resStr = `${year}-${month}-${date}  ${hour}:${minute}:${second}`;
      break;
    case 'yearDate':
      resStr = `${year}-${month}-${date}`;
      break;
    case 'monthMinute':
      resStr = `${month}-${date}  ${hour}:${minute}`;
      break;
    default:
      resStr = `${year}-${month}-${date}  ${hour}:${minute}:${second}`;
      break;
  }
  return resStr
}
const getHandledValue = num => {
  return num < 10 ? '0' + num : num
}
// 调用样例：{{mydate | getDateStartEnd}}
// getDateStartEnd   年月日   YY-MM-DD
const getDateStartEnd = val => {
	 if(val=='' || val ==null){
		return '';
	}else{  
		return moment(val).format('YYYY-MM-DD');
	}
};



export {
  getDate,
  getDateStartEnd
}

// Vue.filter('getDateStartEnd', function(val) {
// 	if(val=='' || val ==null){
// 		return '';
// 	}else{
// 		let startdate = new Date(val);
// 		let year = startdate.getFullYear();
// 		let month = startdate.getMonth() + 1;
// 		let data = startdate.getDate();
// 		let startTime = year + '-' + month + '-' + data;
// 		return startTime;
// 	}
// });

