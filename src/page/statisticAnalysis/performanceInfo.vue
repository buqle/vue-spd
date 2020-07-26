<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>统计时间</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div> 
			<div class="condition-group">
				<label>部门</label>
				<Select v-model="page.deptCode" clearable class="big condition-group-ipt" @on-change="changeMenu(page.deptCode)">
				        	<Option v-for="dep in DeptList" :value="dep.id" :key="dep.id">{{dep.deptName}}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>人员</label>
				<Input placeholder="请输入人员" v-model="page.operatorName" class="condition-group-ipt"></Input>
			</div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>一级菜单</label>
				<Select v-model="menuCode" clearable class="big condition-group-ipt" @on-change="changeSecMenu(menuCode)">
				        	<Option v-for="men in menuList" :value="men.id" :key="men.id">{{men.name}}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>业务菜单</label>
				<Select v-model="page.secMenuCode" clearable class="big condition-group-ipt">
				        <Option v-for="sec in secMenuList" :value="sec.shortNameValue" :key="sec.shortNameValue">{{ sec.name}}</Option>
				</Select>
			</div>
		</div>
	             <div class="condition-row">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="operationLogListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="operationLogListClick(false)" show-total show-elevator />
	             </div>

	</div>
</template>
<script>
export default {
	data () {
	            return {
	            	menuList:[],
	            	secMenuList:[],
	            	spinShow:true,
	            	menuCode:'',
	             columns: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center'
	                    },
	                    {
	                        title: '操作时间',
	                        key: 'operationTime',
	                        align: 'center'
	                    },
	                    {
	                        title: '部门',
	                        key: 'deptName',
	                        align: 'center'
	                    },
	                    {
	                        title: '人员',
	                        key: 'operatorName',
	                        align: 'center'
	                    },
	                    {
	                        title: '一级菜单',
	                        key: 'menuName',
	                        align: 'center'
	                    },
	                    {
	                        title: '业务菜单',
	                        key: 'secMenuName',
	                        align: 'center'
	                    },
	                    {
	                        title: '业务操作',
	                        key: 'business',
	                        align: 'center',
	                        render: (h, params) => {
			　　return h('div', [
			　　　　h('Tooltip', {
			　　　　props: { placement: 'top' }
			　　　　}, [
			　　　　h('div', {
			　　　　　　style: {
			　　　　　　　　width: '80px',
			　　　　　　　　overflow: 'hidden',
			　　　　　　　　textOverflow: 'ellipsis',
			　　　　　　　　whiteSpace: 'nowrap',
			　　　　　　},
			　　　　　　}, params.row.business),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.business)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '业务单号',
	                        key: 'businessCode',
	                        align: 'center'
	                    }
	                ],
	                DeptList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    menuCode:'',
			    secMenuCode:'',
			    shelfTime:'',
			    startDate:'',
			    endDate:'',
			    deptCode:'',
			    operatorName:''
		    }, 
	            }
	},
	methods:{
		getDateStartEnd(){
			let startdate = new Date(this.page.shelfTime[0]);
			let year = startdate.getFullYear();
			let month = startdate.getMonth() + 1;
			let data = startdate.getDate();
			this.page.startDate = year + '-' + month + '-' + data;

			var enddata = new Date(this.page.shelfTime[1]);
			let year1 = enddata.getFullYear();
			let month1 = enddata.getMonth() + 1;
			let data1 = enddata.getDate();
			this.page.endDate = year1 + '-' + month1 + '-' + data1;
			if(!this.page.shelfTime[0]){
				this.page.startDate = '';
				this.page.endDate = '';
			}
		},
		// 列表
		async operationLogListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.operationLogList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
		},
		// 部门
		async operationLogDeptListClick(){
			let datalist = await this.$api.publics.operationLogDeptList();
			this.DeptList=datalist.data;
		},
		changeMenu(deptCode){
			let deptType ='';
			for (var i = 0; i < this.DeptList.length; i++) {
				if(this.DeptList[i].id == deptCode){
					deptType = this.DeptList[i].deptType;
				}
			}
			if(deptType){
				// 业务菜单
				this.operationLogMenuListClick(deptType);
			}
			
		},
		changeSecMenu(menuCode){
			let item ='';
			// alert(menuCode);
			for (var i = 0; i < this.menuList.length; i++) {
				if(this.menuList[i].id == menuCode){
					item = this.menuList[i].id;
					this.page.menuCode = this.menuList[i].shortNameValue;
				}
			}
			// 业务菜单
			this.operationLogSecMenuListClick(item);
		},
		// 一级菜单
		async operationLogMenuListClick(deptType){
			let datalist = await this.$api.druhStorage.operationLogMenuList({'deptType':deptType});
			this.menuList=datalist.data;
		},
		// 业务菜单
		async operationLogSecMenuListClick(code){
			let datalist = await this.$api.druhStorage.operationLogSecMenuList({'parentId':code});
			this.secMenuList=datalist.data;
		}
	},
	created(){
		// console.log(this.$store.state.currentSelect);
		// 部门
		this.operationLogDeptListClick();
		// 列表
		this.operationLogListClick(false);
	}
}
</script>

