  /**
   * 将平面的菜单格式化为嵌套数组
   * @param menuData  菜单数组
   * @param returnToggle 反转排序
   * @param returnIndex
   * @returns {Array}
   */
  export const menuFormat = (menuData,returnToggle,returnIndex) => {
    let menuIndex = returnIndex ? 1: 2;
    let menuList = returnIndex ? JSON.parse(JSON.stringify( menuData )) : menuData;
    for (let i=0; i<menuList.length; i++) {
      menuList[i].parentIds = menuList[i].parentIds.split(',')
      menuList[i].parentIds.pop();
      if(!menuList[i].children){
        delete menuList[i].children
      }
    }
    let tree = [];
    menuList.sort(function(a, b) {
      return a.parentIds.length - b.parentIds.length;
    })
    let max = menuList[menuList.length - 1].parentIds.length;
    function genRoot(keyNodes, target) {
      for (let i=0; i<target.length; i++) {
        if (target[i].id === keyNodes.parentId) {
          target[i].children = target[i].children || [];
          target[i].children = [ ...target[i].children, keyNodes ];
        } else if (target[i].children){
          genRoot(keyNodes, target[i].children)
        }
      }
    }
    function genTree(index) {
      for (let i=0; i<menuList.length; i++) {
        if (menuList[i].parentIds.length === index) {
          if (index === menuIndex) {
            tree.push(menuList[i])
          } else {
            genRoot(menuList[i], tree);
          }
        }
      }
    }
    // 排序
    function dabendan(tree) {
      tree.sort((a, b)=>a.sort - b.sort);
      for (var i in tree) {
        if(tree[i].children) {
          dabendan(tree[i].children)
        }
      }
    }
    let min = 1;
    while (min < max + 1) {
      genTree(min);
      min++;
    }
    if(returnToggle){
      dabendan(tree);
      return tree
    }
  }
  /**
   * 判断对象是否为空对象
   * @param e
   * @returns {boolean}
   */
  export const isEmptyObject = e => {
    let t;
    for (t in e){
      return !1;
    }
    return !0
  }
  /**
   * 判断值，除了为0返回true，其他为false的都返回false
   * @param v
   * @returns {boolean}
   */
  export const isEmpty = v =>{
    switch (typeof v){
      case 'undefined' :
        return false;
        break;
      case 'string' :
        if(v.trim().length == 0) {
          return false;
        }
        break;
      case 'boolean' :
        if(!v) {
          return false;
        }
        break;
      case 'number' :
        if(0 === v) {
          return true;
        }
        break;
      case 'object' :
        if(null === v) {
          return false;
        }
        if(undefined !== v.length && v.length==0) {
          return false;
        }
        break;
    }
    return true;
  }
  const getHandledValue = num => {
    return num < 10 ? '0' + num : num
  }
  export const getCurrentDate = () =>{
    let currentDate = new Date();
    let year = getHandledValue(currentDate.getFullYear());
    let month = getHandledValue(currentDate.getMonth() + 1);
    let day = getHandledValue(currentDate.getDate());
    let date = year + '-' + month + '-' + day;
    return date;
  }

