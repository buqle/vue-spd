const systemApi={
  DICTMGT_LIST:`/a/spd/dict/list`,
  DICTMGT_TYPELIST:`/a/spd/dict/typelist`,
  INTERFACELOG_LIST:`/a/interfacelog/list`,
  INTERFACELOG_GETALLMETHODTYPE:`/a/interfacelog/getAllMethodType`,
  INTERFACELOG_GETREQUESTMETHODS:`/a/interfacelog/getRequestMethods`,
  INTERFACELOG_GETRCOUNTBYDATE:`/a/interfacelog/getLogCountByDate`,
  SUPPLIER_LIST:`/a/depot/supplier/list`,
  GETDEPT_LIST:`/a/sys/sysdept/getDeptListInfo`,
  GETDEPT_TYPELIST:`/a/spd/dict/type`,
  FINDHISDEPT_LIST:`/a/sys/sysdept/findHisDept`,
  USER_FINDUSERLIST:`/a/his/findUserList`,
  USER_GET_ALL_DEPTBYCONDITION:`/a/his/dept/getAllDeptByCondition`,
  USER_GET_ALL_DEPTS:`/a/sys/sysdept/getAllDepts`,
  GETSTORE_LIST:`/a/dept/getBaseRoomLocation`,//设置货位列表
  GETETAIL:`/a/sys/sysdept/detail`,//部门管理编辑详情
  GET_All_DEPTS:`/a/sys/sysdept/getAllDepts`,//用户管理-新增-所属部门
  GET_All_DEPT_BYCON:`/a/his/dept/getAllDeptByCondition`,//用户管理-新增-所属科室
  GET_All_ROLE_LIST:`/a/his/getRoleInfo`,//用户管理-新增-查询分配角色
  GET_All_USER_INFO:`/a/his/findUserInfo`,//用户管理-新增-查询用户
  GET_MANAGEMENT_ROLE_LIST:`/a/spd/sys/role/list`,//角色管理-列表
  GET_MANAGEMENT_ROLE_EDIT_LIST:`/a/spd/sys/role/detail`,//角色管理-列表
  GET_All_USER_LIST:'/a/his/getFilterCareProv'//用户管理搜索账号
}
export  default  systemApi;
