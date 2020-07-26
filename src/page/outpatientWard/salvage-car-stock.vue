<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>抢救车货位</label>
				<Select v-model="page.rescuecarDeptCode" clearable class="big condition-group-ipt">
				        	<Option v-for="dep in DeptList" :value="dep.id" :key="dep.id">{{ dep.deptName }}</Option>
				</Select>
			</div> 
			<div class="condition-group">
				<label>关键字</label>
				<Select
			                v-model="goodsName"
			                filterable
			                clearable
			                remote
			                placeholder="请选择通用名/商品名"
			                :remote-method="queryDrugByListClick"
			                :loading="loading" @on-change="goodsClick(goodsName)" class="big condition-group-ipt">
			                <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
			            </Select>
			</div>
		</div>
	             <div class="condition-row">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="rescuecarMedicineListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="rescuecarMedicineListClick(false)" show-total show-elevator />
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
	                        title: '通用名',
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
	                                            this.$router.push({path: "/baseDrug/salvageCar/salvageCarStock/details", query:{bigDrugCode:params.row.bigDrugCode,drugCode:params.row.drugCode,deptCode:params.row.deptCode}})
	                                        }
	                                    }
	                                },params.row.ctmmGenericName)
	                            ]);
	                        }
	                    },
	                    {
	                        title: '商品名',
	                        key: 'ctmmTradeName',
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
			　　　　　　}, params.row.ctmmTradeName),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.ctmmTradeName)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '抢救车货位',
	                        key: 'rescuecarDeptCodeName',
	                        align: 'center'

	                    },
	                    {
	                        title: '规格',
	                        key: 'ctmmSpecification',
	                        align: 'center'
	                    },
	                    {
	                        title: '生产厂家',
	                        key: 'ctmmManufacturerName',
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
			　　　　　　}, params.row.ctmmManufacturerName),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.ctmmManufacturerName)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '包装规格',
	                        key: 'packageSpecification',
	                        align: 'center'
	                    },
	                    {
	                        title: '单位',
	                        key: 'replanUnit',
	                        align: 'center'
	                    },
	                    {
	                        title: '库存数量',
	                        key: 'totalStoreNum',
	                        align: 'center'
	                    },
	                    {
	                        title: '可用库存',
	                        key: 'usableQuantity',
	                        align: 'center'
	                    },
	                    {
	                        title: '剂型',
	                        key: 'ctmmDosageFormDesc',
	                        align: 'center'
	                    },
	                    {
	                        title: '批准文号',
	                        key: 'approvalNo',
	                        align: 'center'
	                    }
	                ],
	                loading:false,
	                goodsName:'',
	                goodsList:[], 
	                DeptList:[], 
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    rescuecarDeptCode:'',
		                 hisDrugCodeList:[],
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
		async rescuecarMedicineListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.rescuecarMedicineList(this.page);
			if(datalist.code == 200){
				this.spinShow = false;
			}
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
			this.page.hisDrugCodeList = [];
		},
		// 抢救车货位
		async findOriginDeptListClick(){
			let datalist = await this.$api.publics.rescuecarDetailList();
			this.DeptList=datalist.data;
		}, 
		// 药品
		async queryDrugByListClick(query){
			let item = {
				paramName:query,
				queryType:3,
			}
			this.loading = true;
			let datalist = await this.$api.publics.queryDrugByList(item);
			this.loading = false;
			this.goodsList=datalist.data;
		},
		// 药品检索
		goodsClick(name){
			for (let i = 0; i < this.goodsList.length; i++) {
				 if(name == this.goodsList[i].ctmmParam){
					this.page.hisDrugCodeList.push(this.goodsList[i].bigDrugCode);
				}
			}
			this.rescuecarMedicineListClick();
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect);
		// 来源部门
		this.findOriginDeptListClick();
		// 列表
		this.rescuecarMedicineListClick(false);
	}
}
</script>

