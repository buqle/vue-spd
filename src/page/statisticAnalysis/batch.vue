<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>药品名称</label>
				<Input placeholder="请输入药品名称" v-model="page.paramName" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>批号</label>
				<Input placeholder="请输入批号" v-model="page.lot" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>起止时间</label>
				 <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
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
	            	spinShow:true,
	             columns: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center'
	                    },
	                    {
	                        title: '药品名称',
	                        key: 'ctmmTradeName',
	                        align: 'center'
	                    },
	                    {
	                        title: '生产厂家',
	                        key: 'ctmmManufacturerName',
	                        align: 'center'
	                    },
	                    {
	                        title: '批号',
	                        key: 'lot',
	                        align: 'center'
	                    },
	                    {
	                        title: '使用追溯',
	                        key: 'ctmmdeil',
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
	                                            this.$router.push({path: "/purchase/statisticAnalysis/batch/details", query:{bigDrugCode:params.row.bigDrugCode,drugCode:params.row.drugCode,hisDrugCode:params.row.hisDrugCode,lot:params.row.lot}})
	                                        }
	                                    }
	                                },'追溯')
	                            ]);
	                        }
	                    }
	                ],
	                DeptList:[],
	                druhList:[],
	                launchDate:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    startTime:'',
			    endTime:'',
			    paramName:'',
			    lot:''
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
		async operationLogListClick(flag){
			let launchDate = this.launchDate;
			if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
				this.page.startTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
				this.page.endTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
			}
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.tracePageList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
		}
	},
	created(){
		// console.log(this.$store.state.currentSelect);
		// 列表
		this.operationLogListClick(false);
	}
}
</script>

