/**
   * 数据脱敏
   * @param {string} type      加密类型(name,idno,phone)
   * @param {string} str       加密的字符
   * @return {string} string
   */
// import useUserStore from '@/store/user';
// import useCommonStore from '@/store/common';

const dataMask = ({ type, str }) => {
  if (str == null && str !== undefined) return '';
  if (type === 'name') {
    return `*${str.substring(1, str.length)}`;
  } if (type === 'idno') {
    return str.replace(str.slice(6, 14), '********');
  } if (type === 'phone') {
    return `${str.slice(0, 3)}****${str.slice(7)}`;
  } return '';
};

const urlSearchParam = (key, url = window.location.href.split('?')[1]) => {
  const params = new URLSearchParams(url);
  return params.get(key);
};

const getDecimalNum = (data) => Number(data.toString().split('.')[1]);

const randomNum = (min, max, decimal) => {
  const minZ = Math.trunc(min); // 最小值的整数部分
  const maxZ = Math.trunc(max); // 最大值的整数部分
  // 判断是否存在小数部分，不存在的话为0
  const minX = Number.isNaN(getDecimalNum(min)) ? 0 : getDecimalNum(min); // 最小值的小数部分
  const maxX = Number.isNaN(getDecimalNum(max)) ? 0 : getDecimalNum(max); // 最大值的小数部分

  // 区分有小数和没小数的情况
  if (minX > 0 || maxX > 0 || decimal > 0) {
    // 整数部分随机数
    const z = Math.floor(Math.random() * (maxZ - minZ + 1) + minZ);
    // 小数部分随机数
    let x = 0;
    // 小数部分随机数最大位数
    let maxDecimal = minX.toString().length > maxX.toString().length ? minX.toString().length : maxX.toString().length;
    maxDecimal = decimal > maxDecimal ? decimal : maxDecimal;
    // 判断随机出的整数部分，是否等于最小值或者最大值
    if (z === minZ || z === maxZ) {
      if (z === minZ) {
        // 整数部分随机数等于最小值，那么应该从最小值的小数部分开始，到小数位数的最大值随机就可以
        x = Math.floor(Math.random() * (10 ** maxDecimal - minX) + minX);
      } else {
        // 整数部分随机数等于最大值，那么应该从0开始，到最大值小数部分
        x = Math.floor(Math.random() * (maxX + 1));
      }
    } else {
      // 整数部分在最大最小值区间的，就从0到小数位数的最大值随机就可以
      x = Math.floor(Math.random() * (10 ** maxDecimal));
    }
    return Number(`${z}.${x}`).toString();
  }
  return (Math.floor(Math.random() * (maxZ - minZ + 1) + minZ)).toString();
};

const queryInfoByIdno = (idno, type) => {
  if (!idno || typeof idno === 'undefined' || idno.length !== 18) return null;
  // 获取出生日期
  if (type === 'birth') {
    return `${idno.substring(6, 10)}-${idno.substring(10, 12)}-${idno.substring(12, 14)}`;
  }
  // 获取性别
  if (type === 'sex') {
    return parseInt(idno.substr(16, 1), 10) % 2 === 1 ? '男' : '女';
  }
  if (type === 'age') {
    // 获取年龄
    const ageDate = new Date();
    const month = ageDate.getMonth() + 1;
    const day = ageDate.getDate();
    let age = ageDate.getFullYear() - Number(idno.substring(6, 10)) - 1;
    if ((Number(idno.substring(10, 12)) < month || Number(idno.substring(10, 12)) === month) && Number(idno.substring(12, 14)) <= day) {
      age += 1;
    }
    if (age <= 0) {
      age = 1;
    }
    return age;
  }
  return null;
};

const checkMobile = (mobile) => /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57]|19[8])[0-9]{8}$/.test(mobile);

const isFormData = (e) => typeof FormData !== 'undefined' && e instanceof FormData;
const isString = (e) => typeof e === 'string';
const isNumber = (e) => typeof e === 'number';
const isFunction = (e) => typeof e === 'function';
const isPlainObject = (e) => Object.prototype.toString.call(e) === '[object Object]';
const isEmptyObject = (obj) => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object;
const isArray = (e) => Object.prototype.toString.call(e) === '[object Array]';
const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
// 检查当前选项卡是否在后台
const isTabActive = () => !document.hidden;
// 检测元素是否处于焦点
const elementIsInFocus = (el) => (el === document.activeElement);
// 检查设备类型
const judgeDeviceType = () => (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(navigator.userAgent) ? 'Mobile' : 'PC');
// 文字复制到剪贴板
const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
  return true;
};
// 获取随机颜色
const getRandomColor = () => `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;

const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

// 过滤富文本内容，richText富文本字符串，return 过滤标签后的文本
const filtration = (richText) => richText.replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '');
const getImageUrl = (name) => new URL(`../assets/${name}.png`, import.meta.url).href;

const getPreview = (url) => {
  window.open(`https://oa.wifizs.cn/preview/onlinePreview?url=${encodeURIComponent(btoa(url))}`);
};

const hasPermission = (value, def = true) => {
  // 不传值，默认视为有权限，不做鉴权
  if (!value) {
    return def;
  }
  const allCodeList = useUserStore().permissions;
  // console.log('here', allCodeList.includes(value), value);
  // 如果不是数组，直接判断pinia里的权限数组有没有相同的元素即可
  // const allPathList = useCommonStore().menuPaths;
  // return allCodeList.includes(value) || allPathList.includes(value);
  return allCodeList.includes(value);
};

const exportFile = (data, fileName, type = 'application/octet-stream;charset=utf-8') => {
  const blob = new Blob([data]);
  const elink = document.createElement('a');// 创建一个隐藏的a标签
  elink.download = fileName;
  elink.style.display = 'none';
  elink.target = ' blank';
  elink.href = URL.createObjectURL(blob, { type });
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href);// 释放URL 对象document .body.removechild(elink);d
};
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) {
    return '凌晨好';
  }
  if (hour < 9) {
    return '早上好';
  }
  if (hour < 12) {
    return '上午好';
  }
  if (hour < 14) {
    return '中午好';
  }
  if (hour < 17) {
    return '下午好';
  }
  if (hour < 19) {
    return '傍晚好';
  }
  if (hour < 22) {
    return '晚上好';
  }
  return '深夜好';
};
export {
  dataMask,
  urlSearchParam,
  randomNum,
  checkMobile,
  isFormData,
  isNumber,
  isFunction,
  isPlainObject,
  isEmptyObject,
  isString,
  isArray,
  queryInfoByIdno,
  isiOS,
  deepCopy,
  filtration,
  getImageUrl, getPreview,
  hasPermission,
  exportFile,
  getGreeting,
};
