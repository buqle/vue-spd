<template>
	<div class="condition">

		<div class="condition-row"> 
			<div class="condition-group">
				<label>退库单号</label>
				<Input placeholder="请输入退货单号" v-model="page.backNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>退库原因</label>
				<Select v-model="page.backCause" clearable class="big condition-group-ipt">
				        	<Option v-for="(sta,index) in stateList" :value="sta.label" :key="index">{{ sta.label }}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>抢救车货位</label>
				<Select v-model="page.backDeptCode" clearable class="big condition-group-ipt">
					<Option v-for="dep in DeptList" :value="dep.id" :key="dep.id">{{ dep.deptName }}</Option>
				</Select>
			</div>
		</div> 
		<div class="condition-row">
			<div class="condition-group">
				<label>退库时间</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div> 
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="add()">新建退库</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="rescuecarBackListClick(true)">查询</Button>
	             </div>
		<Modal v-model="modal" fullscreen title="新建退货" :loading="loading1"  @on-ok="submit()">
			<div class="condition">
        <Spin size="large" fix v-if="spinsShow"></Spin>
				<div class="condition-row mb15">
					<Button type="default" size="large" class="l" @click="addGoods()">添加产品</Button>
			             	<Button type="default" size="large" class="l ml10" @click="batchDeleteListClick()">移除</Button> 
					<div class="condition-group ml10">
						<label>抢救车货位</label>
						<Select v-model="page1.deptCode" clearable class="big condition-group-ipt">
							<Option v-for="dep in DeptList" :value="dep.id" :key="dep.id">{{ dep.deptName }}</Option>
						</Select>
					</div>
					<div class="condition-group ml130">
						<label>退货原因</label>
						 <Select v-model="page1.backcause" clearable class="big condition-group-ipt">
						        	<Option v-for="(sta,index) in stateList" :value="sta.label" :key="index">{{ sta.label }}</Option>
						</Select>
					</div>
				</div>
				 <h3 class="f16 green-h3 mb10">产品信息</h3>
				 <Table :columns="columns2" :data="backGoodsLists"  @on-selection-change="handleGoodsChange"></Table>
		             </div>
		</Modal>
		<Modal v-model="modalGoods" title="添加产品" width="1200" @on-cancel="modalReset"  @on-ok="asyncOK">
			<div class="condition">
				<div class="condition-row">
					<div class="condition-group">
						<label>药品名称</label>
						<Select
					                v-model="goodsName"
					                filterable
					                clearable
					                remote
					                placeholder="请选择药品"
					                :remote-method="queryDrugByListClick"
					                :loading="loading"  style="width: 300px" @on-change="goodsClick(goodsName)">
					                <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
					            </Select>
					</div>
					<div class="condition-group">
						<label>生产批号</label> 
						<Input placeholder="请输入生产批号" v-model="page1.lot" class="condition-group-ipt"></Input>
					</div>
					<div class="condition-group">
						<label>入库单号</label>
						<Input placeholder="请输入入库单号" v-model="page1.inStoreCode" class="condition-group-ipt"></Input>
					</div>
				</div>
				<div class="condition-row"> 
					 <div class="condition-group">
						<label>供应商</label>
						<Select v-model="page1.supplierCode" clearable class="big condition-group-ipt">
					        <Option v-for="(sup,index) in supplierList" :value="sup.ctmaSupplierCode" :key="index">{{ sup.ctmaSupplierName}}</Option>
					    </Select>
					</div> 
				</div>
			             <div class="condition-row mb15">
			             	<Button size="large" type="default" icon="ios-search" class="r" @click="backdetailListClick(true)">查询</Button>
			             </div>
		             </div>
			 <Table :columns="columns1" :data="goodsLists" @on-selection-change="handleSelectionChange"></Table> 
			 <Spin size="large" fix v-if="spinShow"></Spin>
		             <div class="mt15" style="text-align: right;">
		             	<Page :total="page1.totalPage" :page-size="page1.pageSize" :current.sync="page1.pageNo" @on-change="backdetailListClick(false)" show-total show-elevator />
		             </div> 
		</Modal>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="rescuecarBackListClick(false)" show-total show-elevator />
	             </div>
	</div>
</template>
<script>
export default {
	data () {
	            return {
                spinsShow:false,
	            	spinShow:false,
	            	modal:false,
	            	modalGoods:false,
	            	loading:false,
	            	loading1:true,
	             goodsName:'',
	             goodsList:[],
	             backcause:'',
	             columns2:[
	            		{
				type: 'selection',
				align: 'center',
				width:'100'
			},
			{
				type: 'index',
				title: '序号',
				align: 'center'
			},
			{ 
				title: '退库数量',
				key: 'backNum',
				align: 'center',
				 render: (h, params) => {
			                return h('InputNumber', {
			                    props: {
			                    	min:1,
			                    	max:this.backGoodsLists[params.index].usableQuantity,
			                         type: 'text',
			                         value: this.backGoodsLists[params.index].usableQuantity,
			                    },
			                    on: { 
						'on-change':(event)=>{
				                      		this.backGoodsLists[params.index].backNum = event;
				                    	}
					},
			                });
			            }, 
			},
			{ 
				title: '当前库存',
				key: 'usableQuantity',
				align: 'center'
			},
			{ 
				title: '单位',
				key: 'unit',
				align: 'center'
			},
			{
				title: '包装规格',
				key: 'packageSpecification',
				align: 'center'
			},
			{
				title: '有效期至',
				key: 'validEndDate',
				align: 'center'
			},
			{ 
				title: '通用名称',
				key: 'ctmmGenericName',
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
				　　　　　　}, params.row.ctmmGenericName),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.ctmmGenericName)
				　　　　])
				　　])
				}
			},
			{ 
				title: '药品名称',
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
				title: '规格',
				key: 'packageSpecification',
				align: 'center'
			},
			{	 
				title: '剂型',
				key: 'ctmmDosageFormDesc',
				align: 'center'
			},
			{
				title: '生产批号',
				key: 'lot',
				align: 'center'
			},
			{
				title: '生产日期',
				key: 'productDate',
				align: 'center'
			}, 
			{
				title: '批准文号',
				key: 'approvalNo',
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
				title: '供应商',
				key: 'supplierName',
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
				　　　　　　}, params.row.supplierName),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.supplierName)
				　　　　])
				　　])
				}
			},
                	],
	             columns1:[
	             	{
				type: 'selection',
				align: 'center',
				width:'50'
			},
			{
				type: 'index',
				title: '序号',
				align: 'center'
			},
			{ 
				title: '通用名称',
				key: 'ctmmGenericName',
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
				　　　　　　}, params.row.ctmmGenericName),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.ctmmGenericName)
				　　　　])
				　　])
				}
			},
			{ 
				title: '规格',
				key: 'packageSpecification',
				align: 'center'
			},
			{ 
				title: '入库单号',
				key: 'inStoreCode',
				align: 'center'
			},
			{ 
				title: '生产批号',
				key: 'lot',
				align: 'center'
			},
			{	 
				title: '生产日期',
				key: 'productDate',
				align: 'center'
			},
			{
				title: '有效期至',
				key: 'validEndDate',
				align: 'center'
			},
			{
				title: '剂型',
				key: 'ctmmDosageFormDesc',
				align: 'center'
			},
			{
				title: '包装单位',
				key: 'unit',
				align: 'center'
			},
			{
				title: '批准文号',
				key: 'approvalNo',
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
				　　　　　　}, params.row.approvalNo),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.approvalNo)
				　　　　])
				　　])
				}
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
				title: '供应商',
				key: 'supplierName',
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
				　　　　　　}, params.row.supplierName),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.supplierName)
				　　　　])
				　　])
				}
			},
			
                	],
	             columns: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center'
	                    },
	                    {
	                        title: '退库单',
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
	                                            this.$router.push({path: "/baseDrug/salvageCar/refund/details", query:{id:params.row.backNo}})
	                                        }
	                                    }
	                                },params.row.backNo)
	                            ]);
	                        }
	                    },
	                    {
	                        title: '退库抢救车',
	                        key: 'backDpetName',
	                        align: 'center'

	                    },
	                    {
	                        title: '退库原因',
	                        key: 'backCause',
	                        align: 'center'
	                    },
	                    {
	                        title: '退库人',
	                        key: 'createUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '退库时间',
	                        key: 'createDate',
	                        align: 'center'
	                    }
	                ], 
	                stateList:[],
	                supplierList:[],
	                druhList:[],
	                DeptList:[],
	                goodsLists:[],
	                backGoodsList:[],
	                backGoodsLists:[],
	                goodsSumList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    backDeptCode:'',
			    backNo:'',
			    backCause:'', 
			    shelfTime:'',
			    startTime:'',
			    endTime:'',
		    }, 
		 page1:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			deptCode:'',
			hisDrugCodeList:[],
			lot:'',
			supplierCode:'',
			inStoreCode:'',
			backcause:'',
		},
	            }
	},
	methods:{
		add(){
			this.modal=true;
		},
		addGoods(){
			if(!this.page1.deptCode){
				this.$Message.error('请选择退库抢救车!');
				return
			}
			this.modalGoods=true;
			this.backdetailListClick();
		},
		// 列表
		async backdetailListClick(flag){
			if(flag){
				this.page1.pageNo = 1;
			}
			this.goodsLists = [];
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.rescuecarBackAddList(this.page1);
			this.spinShow = false;
			this.goodsLists=datalist.data.list;
			this.page1.totalPage = datalist.data.count;
		},
		handleSelectionChange(selection) {
			this.backGoodsList = [];
			this.backGoodsList = selection;
			for (let i = 0; i < selection.length; i++) {
				 this.backGoodsList[i].backNum = selection[i].usableQuantity;
			}
		},
		asyncOK(){
			this.backGoodsLists = [];
			this.backGoodsLists = this.backGoodsList;
			this.backGoodsList = [];
		},
		handleGoodsChange(selection) {
			this.goodsSumList =selection;
		},
		batchDeleteListClick(){
			for (let i = 0; i < this.backGoodsLists.length; i++) {
				 for (let j = 0; j < this.goodsSumList.length; j++) {
				 	if(this.backGoodsLists[i].id == this.goodsSumList[j].id){
				 		this.backGoodsLists.splice(i, 1);
				 	}
				}
			}
		},
		loadingSh(){
			setTimeout(() => {
				this.loading1 = false;
				this.$nextTick(() => {
					this.loading1 = true;
				})
			}, 500)
		},
		submit(){
			if(!this.page1.backcause){
				this.$Message.error('请选择退货原因!');
				this.loadingSh();
				return
			}
			this.$Modal.confirm({
				title: '提示',
				content:'是否确定退库？',
				onOk: () => {
					this.backSubmit(); 
				},
			});
		},
		async backSubmit(){
		      let backDrugList=[];
		      backDrugList=this.goodsSumList.map(item=>{
		        return {
		          backNum: item.backNum,
		          drugCode: item.drugCode,
		          inStoreCode: item.inStoreCode,
		          lot: item.lot,
		          supplierCode: item.supplierCode
		        }
		      });
		      if(backDrugList.length == 0){
		      	this.$Message.error('请勾选药品数据!');
			this.loadingSh();
			return
		      }
				let item = {
					backcause:this.page1.backcause,
					deptCode:this.page1.deptCode,
          backDrugList
				}
        this.spinsShow=true;
				let datalist = await this.$api.druhStorage.rescuecarBackSubmitList(item);
				if(datalist.code==200){
          this.$Message.success('新建退货成功');
        }
      this.spinsShow=false;
				this.modal=false;
				this.page1.backcause = '';
				this.page1.deptCode = '';
				this.goodsSumList = [];
				this.backGoodsLists = [];
				this.backGoodsList = [];
				this.rescuecarBackListClick(true); 
		},
		backModal(){
			this.modal=false;
		},
		modalReset(){
			this.modalGoods=false;
		},
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
			this.page1.hisDrugCodeList = [];
			for (let i = 0; i < this.goodsList.length; i++) {
				 if(name == this.goodsList[i].ctmmParam){
					this.page1.hisDrugCodeList.push(this.goodsList[i].bigDrugCode);
				}
			}
			this.backdetailListClick(true);
		},
		// 列表
		async rescuecarBackListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.rescuecarBackList(this.page);
			if(datalist.code == 200){
				this.spinShow = false;
			}
			this.druhList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
		},
		// 抢救车货位
		async findOriginDeptListClick(){
			let datalist = await this.$api.publics.rescuecarDetailList();
			this.DeptList=datalist.data;
		},
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.supplierAllList();
			this.supplierList=datalist.data;
		},
		// 退货原因
		async stateListClick(){
			let datalist = await this.$api.publics.typeList({'type':'back_cause_car'});
			this.stateList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		 // 抢救车货位
		this.findOriginDeptListClick();	
		// 类型
		this.stateListClick();
		// 供应商
		this.supplierAllListClick();
		// 列表
		this.rescuecarBackListClick(false);
	}
}
</script>

