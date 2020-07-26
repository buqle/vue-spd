<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>收货部门</label>
				<Select v-model="page.deptCode" clearable class="condition-group-ipt">
				        	<Option v-for="(dep,index) in deptList" :value="dep.id" :key="index">{{ dep.deptName }}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>状　态</label>
				<Select v-model="page.backStatus" clearable class="condition-group-ipt">
			        <Option v-for="(type,index) in statusList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div> 
			<div class="condition-group">
				<label>出库分类</label>
				<Select v-model="page.backType" clearable class="condition-group-ipt">
			        <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>出库时间</label>
				 <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
			</div>
			<div class="condition-group">
				<label>单据号</label>
				<Input placeholder="出库单/拣货单" v-model="page.orderNo" class="condition-group-ipt"></Input>
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
	                        title: '出库单',
	                        key: 'backNo',
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
	                                            this.$router.push({path: "/purchase/supplementDoc/outReceiptMgt/details", query:{id:params.row.backNo,state:params.row.outStoreStatus}})
	                                        }
	                                    }
	                                },params.row.backNo), 
	                                h('p', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'7%',borderRadius:'20px'},
	                                },params.row.outstoreDetailItemsCount),
	                            ]);
	                        }
	                    },
	                    {
	                        title: '拣货单',
	                        key: 'pickingNo',
	                        align: 'center'
	                    },
	                    {
	                        title: '出库分类',
	                        key: 'backType',
	                        align: 'center'
	                    },
	                    {
	                        title: '状态',
	                        key: 'status',
	                        align: 'center'
	                    },
	                    {
	                        title: '收货部门',
	                        key: 'deptName',
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
	                        title: '复核人',
	                        key: 'checkUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '复核时间',
	                        key: 'checkDate',
	                        align: 'center'
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
					    deptType:3,
					    deptCode:'',
					    backStatus:'',
					    backType:'',
					    startTime:'',
					    endTime:'',
					    orderNo:'',
				    },
	            }
	},
	methods:{
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
			let datalist = await this.$api.druhStorage.outstoreList(this.page);
			this.spinShow = false;
			if(datalist.data.list.length > 0){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
			
		},
		// 申领部门
		async applyDeptListClick(){
			let datalist = await this.$api.publics.findAllDeptsList({'deptType':3});
			this.deptList=datalist.data;
		},
		// 状态
		async statusListClick(){
			let datalist = await this.$api.publics.typeList({'type':'out_store_status'});
			this.statusList=datalist.data;
		},
		// 出库分类
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'depot_out_store_type'});
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

