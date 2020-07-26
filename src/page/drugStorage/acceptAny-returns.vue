<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>状　态</label>
				<Select v-model="page.pickingStatus" clearable class="condition-group-ipt">
			        <Option v-for="(type,index) in statusList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div> 
			<div class="condition-group">
				<label>申领部门</label>
				<Select v-model="page.deptCode" clearable class="condition-group-ipt">
				        	<Option v-for="(dep,index) in deptList" :value="dep.id" :key="index">{{ dep.deptName }}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>类型</label>
				<Select v-model="page.pickingType" clearable class="condition-group-ipt">
			        <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>单据号</label>
				<Input placeholder="申领单/拣货单" v-model="page.applyOrderNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>发起时间</label>
				 <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
			</div>
		</div>
	             <div class="condition-row">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="pickingOrderListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="pickingOrderListClick(false)" show-total show-elevator />
	             </div>
	</div>
</template>
<script>
import {route}  from '@/api/apiRoute';
export default {
	data () {
	            return { 
	            	url:`${route}/a/pickingDetail/print/printDetail`,
	            	spinShow:true,
	             columns: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center'
	                    },
	                    {
	                        title: '拣货单',
	                        key: 'pickingOrderNo',
	                        align: 'left',
	                        render: (h, params) => {
	                            return h('div', [
	                                h('div', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {color:'blue',cursor:'pointer',float:'left',},
	                                    on: {
	                                        click: () => {
	                                            // this.show(params.row.guid)
	                                            // this.$router.replace('/warehousingAcceptanceDetail/'+params.row.ctmaSupplierName) 
	                                            this.$router.push({path: "/drugStorage/outStorage/acceptAnyReturns/details", query:{id:params.row.pickingOrderNo}})
	                                        }
	                                    }
	                                },params.row.pickingOrderNo), 
	                                h('p', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'7%',borderRadius:'20px'},
	                                },params.row.pickingDetailItemCount),
	                            ]);
	                        }
	                    },
	                    {
	                        title: '申领部门',
	                        key: 'deptName',
	                        align: 'center'
	                    },
	                    {
	                        title: '状态',
	                        key: 'statusName',
	                        align: 'center'
	                    },
	                    {
	                        title: '类型',
	                        key: 'type',
	                        align: 'center'
	                    },
	                    {
	                        title: '发起人',
	                        key: 'createUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '发起时间',
	                        key: 'createDate',
	                        align: 'center'
	                    },
	                    {
	                        title: '拣货时间',
	                        key: 'updateDate',
	                        align: 'center'
	                    },
	                    {
	                        title: '操作',
	                        key: 'createDate',
	                        align: 'center',
	                        render: (h, params) => {
	                        	  	return h('div', [
		                                h('Button', {
		                                    props: {
		                                        type: 'primary',
		                                        size: 'small'
		                                    },
		                                    on: {
		                                        click: () => {
						 window.open(`${this.url}?pickingOrderNo=${params.row.pickingOrderNo}`, '_blank');
		                                        }
		                                    }
		                                }, '打印')
		                            ]); 
	                        }
	                    },
	                ],
	                statusList:[],
	                typeList:[],
	                deptList:[],
	                druhList:[],
	                launchDate:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    queryType:1,
			    deptCode:'',
			    pickingStatus:'',
			    pickingType:'',
			    startTime:'',
			    endTime:'',
			    applyOrderNo:'',
		    },
	            }
	},
	methods:{
		getDateStartEnd(){
			let startdate = new Date(this.page.shelfTime[0]);
			let year = startdate.getFullYear();
			let month = startdate.getMonth() + 1;
			let data = startdate.getDate();
			this.page.startTime = year + '-' + month + '-' + data;

			var enddata = new Date(this.page.shelfTime[1]);
			let year1 = enddata.getFullYear();
			let month1 = enddata.getMonth() + 1;
			let data1 = enddata.getDate();
			this.page.endTime = year1 + '-' + month1 + '-' + data1;
			if(!this.page.shelfTime[0]){
				this.page.startTime = '';
				this.page.endTime = '';
			}
		},
		clearLaunchDate(){
			this.launchDate = [];
			this.page.startTime = "";
			this.page.endTime = "";
		},
		// 列表
		async pickingOrderListClick(flag){
			let launchDate = this.launchDate;
			if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
				this.page.startTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
				this.page.endTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
			}
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.pickingOrderList(this.page);
			this.spinShow = false;
			if(datalist.code = 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
		},
		// 申领部门
		async applyDeptListClick(){
			let datalist = await this.$api.publics.pickFindAllDeptsList();
			this.deptList=datalist.data;
		},
		// 状态
		async statusListClick(){
			let datalist = await this.$api.publics.typeList({'type':'picking_status'});
			this.statusList=datalist.data;
		},
		// 类型
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'dept_picking_type'});
			this.typeList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.typeListClick(); 
		// 状态
		this.statusListClick();
		// 申领部门
		this.applyDeptListClick();
		// 列表
		this.pickingOrderListClick(false);
	}
}
</script>

