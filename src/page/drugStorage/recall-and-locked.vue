<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>单据号</label>
				<Input placeholder="请输入单据号" v-model="page.recallNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>原因</label>
				<Select v-model="page.recallReasonType" clearable class="big condition-group-ipt">
				        	<Option v-for="(sta,index) in stateList" :value="sta.value" :key="index">{{ sta.label }}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>发起时间</label>
				 <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
			</div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>供应商</label>
				<Input placeholder="请输入供应商" v-model="page.supplierName" class="condition-group-ipt"></Input>
			</div> 
			<div class="condition-group">
				<label>状态</label>
				<Select v-model="page.recallStatus" clearable class="big condition-group-ipt">
			        <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label}}</Option>
			    </Select>
			</div>
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="add()">新建召回</Button>
	             	<Button type="default" size="large" class="l ml10" @click="deleteListClick()">移除</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="backListClick(true)">查询</Button>
	             </div>
		<Modal v-model="modal" fullscreen title="新建退货" :loading="loading1"  @on-ok="backSubmit">
			<div class="condition">
				<div class="condition-row mb15">
					<Button type="default" size="large" class="l" @click="addGoods()">添加产品</Button>
			             	<Button type="default" size="large" class="l ml10" @click="deleteGoodsListClick()">移除</Button>
					<div class="condition-group ml130">
						<label>召回原因</label>
						 <Select v-model="recallReasonType" clearable class="big condition-group-ipt" @on-change="recallReasonTypeClick(recallReasonType)">
						        	<Option v-for="(sta,index) in stateList" :value="sta.value" :key="index">{{ sta.label }}</Option>
						</Select>
					</div>
					<div class="condition-group ml130" v-if="remarksSh">
						<label>原因</label>
						 <Input placeholder="请输入原因" v-model="remarks" class="condition-group-ipt"></Input>
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
						<label>供应商</label>
						 <Input placeholder="请输入供应商" v-model="page1.manufacturerName" class="condition-group-ipt"></Input>
					</div> 
				</div> 
			             <div class="condition-row mb15">
			             	<Button size="large" type="default" icon="ios-search" class="r" @click="backdetailListClick(true)">查询</Button>
			             </div>
		             </div>
			 <Table :columns="columns1" :data="goodsLists" @on-selection-change="handleSelectionChange"></Table> 
			 <Spin size="large" fix v-if="spinShow"></Spin>
		             <div class="mt15" style="text-align: right;">
		             	<Page :total="page1.totalPage" :page-size="page1.pageSize" :current.sync="page1.pageNo" @on-change="backdetailListClick(true)" show-total show-elevator />
		             </div> 
		</Modal>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList" @on-selection-change="handleListChange"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="backListClick(false)" show-total show-elevator />
	             </div>
	</div>
</template>
<script>
export default {
	data () {
	            return { 
	            	spinShow:false,
	            	modal:false,
	            	modalGoods:false,
	            	loading:false,
	            	loading1:true,
	             goodsName:'',
	             goodsList:[],
	             recallReasonType:'',
	             remarks:'',
	             remarksSh:false,
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
				key: 'packageSpecification',
				align: 'center'
			},
			{
				title: '批准文号',
				key: 'approvalNo',
				align: 'center'
			}
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
				title: '剂型',
				key: 'ctmmDosageFormDesc',
				align: 'center'
			},
			{
				title: '包装规格',
				key: 'packageSpecification',
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
				　　　　　　}, params.row.packageSpecification),
				　　　　　　h('div', {
				　　　　　　　　slot: 'content',
				　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
				　　　　　　},params.row.packageSpecification)
				　　　　])
				　　])
				}
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
				title: '批准文号',
				key: 'approvalNo',
				align: 'center'
			},
                	],
	             columns: [
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
	                        title: '召回单号',
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
	                                            this.$router.push({path: "/drugStorage/outStorage/recallAndLocked/details", query:{id:params.row.recallNo}})
	                                        }
	                                    }
	                                },params.row.recallNo), 
	                                h('p', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'7%',borderRadius:'20px'},
	                                },params.row.roomReCallDetailItemCount),
	                            ]);
	                        }
	                    },
	                    {
	                        title: '状态',
	                        key: 'recallStatusName',
	                        align: 'center'

	                    },
	                    {
	                        title: '类型',
	                        key: 'recallTypeName',
	                        align: 'center'
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
	                    {
	                        title: '召回原因',
	                        key: 'remarks',
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
	                    }
	                ],
	                supplierList:[],
	                typeList:[],
	                stateList:[],
	                druhList:[],
	                goodsLists:[],
	                backGoodsList:[],
	                backGoodsLists:[],
	                goodsSumList:[],
	                recallNos:[],
	                launchDate:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    recallStatus:'',
			    startTime:'',
			    endTime:'',
			    recallReasonType:'',
			    supplierName:'',
		                 recallNo:'',
		    }, 
		 page1:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			hisDrugCodeList:[],
			lot:'',
			remarks:'',
			manufacturerName:'',
		},
	            }
	},
	methods:{
		add(){
			this.modal=true;
		},
		addGoods(){
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
			let datalist = await this.$api.druhStorage.selectProductList(this.page1);
			this.spinShow = false;
			this.goodsLists=datalist.data.list;
			this.page1.totalPage = datalist.data.count;
		},
		handleSelectionChange(selection) {
			this.backGoodsList = [];
			this.backGoodsList = selection;
		},
		handleListChange(selection) {
			 for (let i = 0; i < selection.length; i++) {
				this.recallNos.push(selection[i].recallNo);
			}
		},
		// 删除
		async deleteListClick(){
			if(this.recallNos.length == 0){
				this.$Message.error('请勾选单据!');
				return
			}
			let datalist = await this.$api.druhStorage.roomrecallDeleteList({'recallNos':this.recallNos});
			this.backListClick(true);
		},
		asyncOK(){
			this.backGoodsLists = [];
			this.backGoodsLists = this.backGoodsList;
			this.backGoodsList = [];
		},
		handleGoodsChange(selection) {
			this.goodsSumList = [];
			for (let i = 0; i < selection.length; i++) {
				let item = {
					bigDrugCode:selection[i].bigDrugCode,
					lot:selection[i].lot,
					recallNum:selection[i].recallNum,
					refrigerateType:selection[i].refrigerateType,
					supplierCode:selection[i].supplierCode,
					uuid:selection[i].uuid,
				}
				this.goodsSumList.push(item);
			}
			console.log(this.goodsSumList);
		},
		deleteGoodsListClick(){
			if(this.goodsSumList.length == 0){
				this.$Message.error('请勾选商品!');
				return
			}
			for (var i = 0; i < this.backGoodsLists.length; i++) {
				 for (var j = 0; j < this.goodsSumList.length; j++) {
				 	if(this.backGoodsLists[i].uuid == this.goodsSumList[j].uuid){
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
		async backSubmit(){
			if(this.goodsSumList.length == 0){
				this.$Message.error('请勾选商品!');
				this.loadingSh();
				return
			}
			if(!this.recallReasonType){
				this.$Message.error('请选择召回原因!');
				this.loadingSh();
				return
			}else{
				if(this.recallReasonType == '4'){
					if(!this.remarks){
						this.$Message.error('请填写原因!');
						this.loadingSh();
						return
					}
				}
				let item = {
					recallReasonType:this.recallReasonType,
					recallType:1,
					remarks:this.remarks,
					detailList:this.goodsSumList
				}
				console.log(item);
				let datalist = await this.$api.druhStorage.roomrecallCreateList(item);
				if(datalist.data == 1){
					this.$Message.success('召回成功！');
					this.modal=false;
					this.recallReasonType = '';
					this.remarks = '';
					this.goodsSumList = [];
					this.backGoodsLists = [];
					this.backGoodsList = [];
					this.backListClick(true); 
				}else{
					this.$Message.error('请选择召回异常!');
				}
				
			}
			
		},
		backModal(){
			this.modal=false;
		},
		modalReset(){
			this.modalGoods=false;
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
		// 选择召回原因
		recallReasonTypeClick(name){
			if(name == '4'){
				this.remarksSh = true;
			}else{
				this.remarksSh = false;
				this.remarks = '';
			}
		},
		clearLaunchDate(){
			this.launchDate = [];
			this.page.startTime = "";
			this.page.endTime = "";
		},
		// 列表
		async backListClick(flag){
			let launchDate = this.launchDate;
			if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
				this.page.startTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
				this.page.endTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
			}
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.roomrecallList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				for (var i = 0; i < this.druhList.length; i++) {
					if (this.druhList[i].recallStatus != '3') {
						this.druhList[i]['_disabled'] = true
					}
				}
				this.page.totalPage = datalist.data.count;
			}
			
		},
		// 状态
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'recall_status','values':'1,2,3,4'});
			this.typeList=datalist.data;
		}, 
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.supplierAllList();
			this.supplierList=datalist.data;
		},
		// 原因
		async stateListClick(){
			let datalist = await this.$api.publics.typeList({'type':'recall_reason'});
			this.stateList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 类型
		this.typeListClick();
		// 供应商
		this.supplierAllListClick();
		// 原因
		this.stateListClick();
		// 列表
		this.backListClick(false);
	}
}
</script>

