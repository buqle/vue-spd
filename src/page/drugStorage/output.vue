<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>来源部门</label>
				<Select v-model="page.originDeptCode" clearable size="big condition-group-ipt">
				        	<Option v-for="dep in DeptList" :value="dep.id" :key="dep.id">{{ dep.deptName }}</Option>
				</Select>
			</div> 
			<div class="condition-group">
				<label>单号</label>
				<Input placeholder="请输入供应商" v-model="page.distributeCode" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>供应商</label>
				<Select v-model="page.supid" clearable size="big condition-group-ipt">
			        <Option v-for="sup in supplierList" :value="sup.ctmaSupplierCode" :key="sup.ctmaSupplierCode">{{ sup.ctmaSupplierName}}</Option>
			    </Select>
			</div> 
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>日期范围</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div>
			<div class="condition-group">
				<label>状态</label>
				<Select v-model="page.acceptanceType" clearable size="big condition-group-ipt">
				        	<Option v-for="sta in stateList" :value="sta.value" :key="sta.value">{{ sta.label }}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>类　型</label>
				<Select v-model="page.type" clearable size="big condition-group-ipt">
			        <Option v-for="type in typeList" :value="type.value" :key="type.value">{{ type.label}}</Option>
			    </Select>
			</div> 
			
			
		</div>
	             <div class="condition-row">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="druhStorageListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="druhStorageListClick(false)" show-total show-elevator />
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
	                        align: 'center'
	                    },
	                    {
	                        title: '配送单/验收单',
	                        // key: 'ctmaSupplierName',
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
	                                            this.$router.push({path: "/drugStorage/wareHouse/grounding", query:{id:params.row.distributeCode}})
	                                        }
	                                    }
	                                },params.row.distributeCode)
	                            ]);
	                        }
	                    },
	                    {
	                        title: '订单号',
	                        key: 'orderCode',
	                        align: 'center'

	                    },
	                    {
	                        title: '供应商/来源部门',
	                        key: 'supplierName',
	                        align: 'center'

	                    },
	                    {
	                        title: '状态',
	                        key: 'statusName',
	                        align: 'center'
	                    },
	                    {
	                        title: '类型',
	                        key: 'typeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '验收人',
	                        key: 'receptionUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '验收时间',
	                        key: 'receptionTime',
	                        align: 'center'
	                    },
	                    {
	                        title: '收货地址',
	                        key: 'deptAddress',
	                        align: 'center'
	                    }
	                ],
	                supplierList:[],
	                typeList:[],
	                DeptList:[],
	                stateList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:2,
			    totalPage:0,
			    checkType:1,
			    type:'',
			    shelfTime:'',
			    receptionStartTime:'',
			    receptionEndTime:'',
			    originDeptCode:'',
			    distributeCode:'',
		                supplierCodeList:[], 
		                acceptanceType:'',
		                supid:'',
		    }, 
	            }
	},
	methods:{
		getDateStartEnd(){
			let startdate = new Date(this.page.shelfTime[0]);
			let year = startdate.getFullYear();
			let month = startdate.getMonth() + 1;
			let data = startdate.getDate();
			this.page.receptionStartTime = year + '-' + month + '-' + data;

			var enddata = new Date(this.page.shelfTime[1]);
			let year1 = enddata.getFullYear();
			let month1 = enddata.getMonth() + 1;
			let data1 = enddata.getDate();
			this.page.receptionEndTime = year1 + '-' + month1 + '-' + data1;
			if(!this.page.shelfTime[0]){
				this.page.receptionStartTime = '';
				this.page.receptionEndTime = '';
			}
		},
		// 列表
		async druhStorageListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.page.supplierCodeList = [];
			if(this.page.supid){
				this.page.supplierCodeList.push(this.page.supid);
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.druhStorageList(this.page);
			if(datalist.data.list.length > 0 || datalist.data.list){
				this.spinShow = false;
			}
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
		},
		// 类型
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'depot_type'});
			this.typeList=datalist.data;
		}, 
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.supplierAllList();
			this.supplierList=datalist.data;
		}, 
		// 来源部门
		async findOriginDeptListClick(){
			let datalist = await this.$api.publics.findOriginDeptList({'deptCode':this.$store.state.currentSelect});
			this.DeptList=datalist.data;
		}, 
		// 状态
		async stateListClick(){
			let datalist = await this.$api.publics.typeList({'type':'acceptance_checkVo'});
			this.stateList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.typeListClick();
		// 供应商
		this.supplierAllListClick();
		// 来源部门
		this.findOriginDeptListClick();
		// 状态
		this.stateListClick();
		// 列表
		this.druhStorageListClick(false);
	}
}
</script>

