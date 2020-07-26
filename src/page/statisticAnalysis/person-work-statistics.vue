<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>姓名</label>
				<Input placeholder="请输入姓名" v-model="page.userName" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>工号</label>
				<Input placeholder="请输入工号" v-model="page.userNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>起止时间</label>
				 <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
			</div> 
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>部门</label>
				<Select v-model="page.deptCode" clearable class="big condition-group-ipt">
				        	<Option v-for="(dep,index) in depList" :value="dep.id" :key="index">{{dep.deptname}}</Option>
				</Select>
			</div>
		</div>
	             <div class="condition-row">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="getUserWorkCountListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getUserWorkCountListClick(false)" show-total show-elevator />
	             </div>

	</div>
</template>
<script>
export default {
	data () {
	            return {
	            	spinShow:true,
	             columns: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center',
	                        width:'80',
	                    },
	                    {
	                        title: '姓名',
	                        key: 'userName',
	                        align: 'center'
	                    },
	                    {
	                        title: '工号',
	                        key: 'userNo',
	                        align: 'center'
	                    },
	                    {
	                        title: '补货单',
	                        key: 'orderCount',
	                        align: 'center',
	                        render: (h, params) => {
	                            return h('div', [
	                                h('div', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {color:'blue',cursor:'pointer'},
	                                    on: {
	                                        click: () => {
	                                            // this.show(params.row.guid)
	                                            // this.$router.replace('/warehousingAcceptanceDetail/'+params.row.ctmaSupplierName) 
	                                            this.$router.push({path: "/purchase/statisticAnalysis/tracing",query:{userId:params.row.userId,userNo:params.row.userNo,userName:params.row.userName,startTime:this.page.startTime,endTime:this.page.endTime}})
	                                        }
	                                    }
	                                },params.row.orderCount)
	                            ]);
	                        }
	                    },
	                    {
	                        title: '验收单明细',
	                        key: 'checkacceptDetailCount',
	                        align: 'center',
	                        render: (h, params) => {
	                            return h('div', [
	                                h('div', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {color:'blue',cursor:'pointer'},
	                                    on: {
	                                        click: () => {
	                                            // this.show(params.row.guid)
	                                            // this.$router.replace('/warehousingAcceptanceDetail/'+params.row.ctmaSupplierName) 
	                                            this.$router.push({path: "/purchase/statisticAnalysis/acceptanceTotalList", query:{'userId':params.row.userId,'startTime':params.row.startTime,'endTime':this.page.endTime}})
	                                        }
	                                    }
	                                },params.row.checkacceptDetailCount)
	                            ]);
	                        }
	                    },
	                    {
	                        title: '下架',
	                        key: 'pickingorderCount',
	                        align: 'center',
	                        render: (h, params) => {
	                            return h('div', [
	                                h('div', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {color:'blue',cursor:'pointer'},
	                                    on: {
	                                        click: () => {
	                                            // this.show(params.row.guid)
	                                            // this.$router.replace('/warehousingAcceptanceDetail/'+params.row.ctmaSupplierName) 
	                                            this.$router.push({path: "/purchase/statisticAnalysis/lowerShelf", query:{'userId':params.row.userId,'userNo':params.row.userNo,'startTime':this.page.startTime,'endTime':this.page.endTime,'userName':params.row.userName}})
	                                        }
	                                    }
	                                },params.row.pickingorderCount)
	                            ]);
	                        }
	                    },
	                    {
	                        title: '出库复核',
	                        key: 'storedetailCount',
	                        align: 'center',
	                        render: (h, params) => {
	                            return h('div', [
	                                h('div', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {color:'blue',cursor:'pointer'},
	                                    on: {
	                                        click: () => {
	                                            // this.show(params.row.guid)
	                                            // this.$router.replace('/warehousingAcceptanceDetail/'+params.row.ctmaSupplierName) 
	                                            this.$router.push({path: "/purchase/statisticAnalysis/outgoingReview",query:{'userId':params.row.userId,'userNo':params.row.userNo,'startTime':this.page.startTime,'endTime':this.page.endTime,'userName':params.row.userName}})
	                                        }
	                                    }
	                                },params.row.storedetailCount)
	                            ]);
	                        }
	                    },
	                    {
	                        title: '盘点',
	                        key: 'checkbillCount',
	                        align: 'center',
	                        render: (h, params) => {
	                            return h('div', [
	                                h('div', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {color:'blue',cursor:'pointer'},
	                                    on: {
	                                        click: () => {
	                                            // this.show(params.row.guid)
	                                            // this.$router.replace('/warehousingAcceptanceDetail/'+params.row.ctmaSupplierName) 
	                                            this.$router.push({path: "/purchase/statisticAnalysis/inventory",query:{'userId':params.row.userId,'userNo':params.row.userNo,'startTime':this.page.startTime,'endTime':this.page.endTime,'userName':params.row.userName}})
	                                        }
	                                    }
	                                },params.row.checkbillCount)
	                            ]);
	                        }
	                    },
	                    {
	                        title: '发药复核',
	                        key: 'hisCount',
	                        align: 'center',
	                        render: (h, params) => {
	                            return h('div', [
	                                h('div', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {color:'blue',cursor:'pointer'},
	                                    on: {
	                                        click: () => {
	                                            // this.show(params.row.guid)
	                                            // this.$router.replace('/warehousingAcceptanceDetail/'+params.row.ctmaSupplierName) 
	                                            this.$router.push({path: "/purchase/statisticAnalysis/drugRechecking", query:{userId:params.row.userId,userNo:params.row.userNo,startTime:this.page.startTime,endTime:this.page.endTime,userName:params.row.userName}})
	                                        }
	                                    }
	                                },params.row.hisCount)
	                            ]);
	                        }
	                    },
	                ],
	                depList:[],
	                druhList:[],
	                launchDate:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    startTime:'',
			    endTime:'',
			    userName:'',
			    userNo:'',
			    deptCode:''
		    },
	            }
	},
	 mounted() {
		const myDate = new Date();
		const year = myDate.getFullYear(); // 获取当前年份
		const month = myDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月所以要加1);
		const day = myDate.getDate(); // 获取当前日（1-31）
		// 日期格式：2019/07/29 - 2019/07/29
		this.launchDate = `${year}-${month - 1}-${day} - ${year}-${month}-${day}`;
	},
	methods:{
		clearLaunchDate(){
			this.launchDate = [];
			this.page.startTime = "";
			this.page.endTime = "";
		},
		// 列表
		async getUserWorkCountListClick(flag){
			let launchDate = this.launchDate;
			if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
				this.page.startTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
				this.page.endTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
			}
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getUserWorkCountList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
		},
		// 部门
		async getDeptClick(){
			let datalist = await this.$api.publics.reportFormDeptList();
			this.depList=datalist.data;
		},
	},
	created(){
		let myDate = new Date();
		let year = myDate.getFullYear(); // 获取当前年份
		let month = myDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月所以要加1);
		let month1 = myDate.getMonth(); // 获取当前月份(0-11,0代表1月所以要加1);
		if(month < 10){
			month = '0' + month
		}
		let day = myDate.getDate(); // 获取当前日（1-31）
		if(day < 10){
			day = '0' + day
		}
		if(month1 < 10){
			month1 = '0' + month1
		}
		// 日期格式：2019/07/29 - 2019/07/29
		this.page.startTime = `${year}-${month1}-${day}`;
		this.page.endTime = `${year}-${month}-${day}`;
		// console.log(this.$store.state.currentSelect);
		// 部门
		this.getDeptClick();
		// 列表
		this.getUserWorkCountListClick(false);
	}
}
</script>

