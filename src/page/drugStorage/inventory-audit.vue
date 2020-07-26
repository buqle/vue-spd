<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>单号</label>
				<Input placeholder="请输入单号" v-model="page.checkBillNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>状态</label>
				<Select v-model="page.filterStatus" clearable class="big condition-group-ipt">
				        	<Option v-for="(sta,index) in stateList" :value="sta.value" :key="index">{{ sta.label }}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>盘点时间</label>
				 <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
			</div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>类型</label>
				<Select v-model="page.checkBillType" clearable class="big condition-group-ipt">
			        <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div>
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="exportAsPrint()">导出</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="sheveListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="sheveListClick(false)" show-total show-elevator />
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
	                        title: '盘点单',
	                        // key: 'ctmaSupplierName',
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
	                                            this.$router.push({path: "/drugStorage/checkDecrease/inventoryAudit/details", query:{id:params.row.checkBillNo}})
	                                        }
	                                    }
	                                },params.row.checkBillNo), 
	                                h('p', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'8%',borderRadius:'20px'},
	                                },params.row.commonCheckBillDetailListCount),
	                            ]);
	                        }
	                    },
	                    {
	                        title: '状态',
	                        key: 'checkStatusName',
	                        align: 'center'
	                    },
	                    {
	                        title: '盘点类型',
	                        key: 'checkBillTypeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '盘点子类型',
	                        key: 'checkBillSubTypeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '药品特征',
	                        key: 'drugFeatureCodeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '盈亏总金额',
	                        key: 'excessiveTotalMoney',
	                        align: 'center'
	                    },
	                    {
	                        title: '部门',
	                        key: 'checkBillDeptName',
	                        align: 'center'
	                    },
	                    {
	                        title: '盘点责任人',
	                        key: 'createUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '制单时间',
	                        key: 'createDate',
	                        align: 'center'
	                    },
	                    {
	                        title: '盘点时间',
	                        key: 'checkTime',
	                        align: 'center'
	                    },
	                    {
	                        title: '备注',
	                        key: 'remarks',
	                        align: 'center'
	                    }
	                ],
	                typeList:[],
	                stateList:[],
	                druhList:[],
	                launchDate:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    checkBillNo:'',
			    filterStatus:'3,4,5,6',
			    checkBillType:'',
			    checkStartTime:'',
			    checkEndTime:'',
			    sheveType:1
		    },
	            }
	},
	methods:{
		// 导出
		async exportAsPrint(){
        			let datalist = await this.$api.druhStorage.checkBillSheveExportList();
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}盘点审核.xls`;
			let objectUrl = URL.createObjectURL(blob); 
			const link = document.createElement('a')
			link.download = fileName;
			link.href = objectUrl;
			link.click();

			// let objectUrl = URL.createObjectURL(blob); 
			// // window.location.href = objectUrl;
			// window.open(objectUrl);
		},
		clearLaunchDate(){
			this.launchDate = [];
			this.page.checkStartTime = "";
			this.page.checkEndTime = "";
		},
		// 列表
		async sheveListClick(flag){
			let launchDate = this.launchDate;
			if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
				this.page.checkStartTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
				this.page.checkEndTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
			}
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.sheveList(this.page);
			if(datalist.code == 200){
				this.spinShow = false;
			}
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
		},
		// 类型
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'check_bill_type'});
			this.typeList=datalist.data;
		},
		// 状态
		async stateListClick(){
			let datalist = await this.$api.publics.typeList({'type':'check_status','values':'3,4,5,6'});
			this.stateList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.typeListClick();
		// 状态
		this.stateListClick();
		// 列表
		this.sheveListClick(false);
	}
}
</script>

