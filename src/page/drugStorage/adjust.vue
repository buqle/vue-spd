<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>单据号</label>
				<Input placeholder="请输入单据号" v-model="page.locAdjustNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>日期范围</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div>
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="add()">新建移库</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="roomLocadJustListClick(true)">查询</Button>
	             </div>
		<Modal v-model="modal" fullscreen title="新建移库" :loading="loading1"  @on-ok="submit">
			<div class="condition">
				<div class="condition-row mb15">
					<Button type="default" size="large" class="l" @click="addGoods()">添加产品</Button>
			             	<Button type="default" size="large" class="l ml10" @click="deleteGoodsListClick()">移除</Button>
				</div>
				 <h3 class="f16 green-h3 mb10">产品信息</h3>
				 <Table :columns="columns2" :data="backGoodsLists" style="width: 100%;"  @on-selection-change="handleGoodsChange">
					 <template slot-scope="{row,index }" slot="goalLoc">
					              <Select
					               v-model="queryTarget[index]"
					                filterable
					                clearable
					                remote
					                placeholder="请选择货位"
					                :loading="loading"  style="width: 120px" @on-change="queryTargetClick(index,queryTarget[index],row.queryTargetList)">
					                <Option v-for="(option, index) in row.queryTargetList" :value="option.id" :key="index">{{option.targetLocName}}</Option>
					            </Select>
				            </template>
				 </Table>
		             </div>
		</Modal>
		<Modal v-model="modalGoods" title="添加产品" width="1200" @on-cancel="modalReset"  @on-ok="asyncOK">
			<div class="condition">
				<div class="condition-row mb15">
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
				</div>
		             </div>
			 <Table :columns="columns1" :data="goodsLists" style="width: 100%;" @on-selection-change="handleSelectionChange"></Table> 
			 <Spin size="large" fix v-if="spinShow"></Spin>
		             <div class="mt15" style="text-align: right;">
		             	<Page :total="page1.totalPage" :page-size="page1.pageSize" :current.sync="page1.pageNo" @on-change="backdetailListClick(true)" show-total show-elevator />
		             </div> 
		</Modal>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="roomLocadJustListClick(false)" show-total show-elevator />
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
	             remarksSh:false,
	             queryTarget:[],
	             columns2:[
	            		{
				type: 'selection',
				align: 'center',
				width:'80'
			},
			{
				type: 'index',
				title: '序号',
				align: 'center',
				width:'80'
			},
			{ 
				title: '药品名称',
				key: 'ctmmTradeName',
				align: 'center',
				width:'150',
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
				width:'150',
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
				title: '移动数量',
				key: 'adjustNum',
				align: 'center',
				width:'100',
				render: (h, params) => {
			                return h('InputNumber', {
			                    props: {
			                    	min:0,
			                    	max:params.index.usableQuantity,
			                          type: 'text',
			                          // value: this.backGoodsLists[params.index].usableQuantity,
			                    },
			                    on: {
						'on-change':(event)=>{
				                      		this.backGoodsLists[params.index].adjustNum = event;
				                    	}
					},
			                });
			            }, 
			},
			{
				title: '移动单位',
				key: 'replanUnit',
				width:'100',
				align: 'center'
			},
			{
				title: '原库存',
				key: 'usableQuantity',
				width:'100',
				align: 'center'
			},
			{	 
				title: '原货位',
				key: 'goodsName',
				width:'150',
				align: 'center'
			},
			{
				title: '原货位类型',
				key: 'positionTypeName',
				width:'150',
				align: 'center'
			},
			{
				title: '目的货位',
				key: 'goalLocCode',
				width:'150',
				width:'150',
				 // render: (h, params) => {
				 //        return h('Select', {
				 //            props:{  
				 //                value: this.backGoodsLists[params.index].goalLocCode,
				 //                filterable:true,
				 //                remote:true,
				 //                clearable:true,
				 //            },  
				 //            on: {
				 //                'on-change':(value) => {
				 //                    this.backGoodsLists[params.index].goalLocCode = value;
				 //                    console.log();
				 //                }
				 //            },  
				 //        },
				 //        console.log('111',this.backGoodsLists[params.index].queryTargetList),
				 //        this.backGoodsLists[params.index].queryTargetList.map((obj)=>{
				 //            return h('Option', {
				 //                props: {value: obj.targetLocName}  
				 //            });  
				 //        })
				 //        );  
				 //    }
				slot: 'goalLoc', 
			},
			{
				title: '同步修改补货指示货位',
				key: 'isEditLoc',
				align: 'center',
				width:'200',
				render: (h, params) => {
			                return h('Checkbox', {
			                    props: { 
			                          value:'',
			                    },
			                    on: {
						'on-change':(event)=>{
							console.log(event);
							if(event){
								this.backGoodsLists[params.index].isEditLoc = 1;
							}else{
								this.backGoodsLists[params.index].isEditLoc = 0;
							}
				                      		
				                    	}
					},
			                });
			            }, 
			},
			{
				title: '目的货位单位',
				key: 'targetUnit',
				width:'150',
				align: 'center'
			},
			{
				title: '目的货位类型',
				key: 'targetTypeName',
				width:'150',
				align: 'center'
			},
			{	 
				title: '转换系数',
				key: 'conversionRate',
				width:'150',
				align: 'center'
			},
			{
				title: '生产批号',
				key: 'lot',
				width:'150',
				align: 'center'
			},
			{
				title: '包装规格',
				key: 'packageSpecification',
				align: 'center',
				width:'150',
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
				align: 'center',
				width:'80'
			},
			{
				title: '货位',
				key: 'goodsName',
				align: 'center',
				width:'200'
			},
			{
				title: '货位类型',
				key: 'positionTypeName',
				align: 'center',
				width:'150'
			},
			{ 
				title: '药品名称',
				key: 'ctmmTradeName',
				align: 'center',
				width:'100',
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
				title: '剂型',
				key: 'ctmmDosageFormDesc',
				align: 'center',
				width:'100'
			},
			{
				title: '包装规格',
				key: 'packageSpecification',
				align: 'center',
				width:'150',
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
				align: 'center',
				width:'100'
			}, 
			{
				title: '单位',
				key: 'replanUnit',
				align: 'center',
				width:'100'
			},
			{
				title: '生产日期',
				key: 'productDate',
				align: 'center',
				width:'100'
			},
			{
				title: '有效期至',
				key: 'validEndDate',
				align: 'center',
				width:'100'
			}, 
			{
				title: '数量',
				key: 'usableQuantity',
				align: 'center',
				width:'100'
			},
			{ 
				title: '生产厂家',
				key: 'ctmmManufacturerName',
				align: 'center', 
				width:'100',
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
				title: '批准文号',
				key: 'approvalNo',
				align: 'center',
				width:'150'
			},
                	],
	             columns: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center'
	                    },
	                    {
	                        title: '移库单号',
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
	                                            this.$router.push({path: "/drugStorage/goodsAdjust/adjust/details", query:{id:params.row.locAdjustNo}})
	                                        }
	                                    }
	                                },params.row.locAdjustNo), 
	                                h('p', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'8%',borderRadius:'20px'},
	                                },params.row.roomLocAdjustDetailVoListCount),
	                            ]);
	                        }
	                    },
	                    {
	                        title: '状态',
	                        key: 'statusName',
	                        align: 'center'

	                    },
	                    {
	                        title: '部门',
	                        key: 'deptName',
	                        align: 'center'
	                    },
	                    {
	                        title: '移库人',
	                        key: 'createName',
	                        align: 'center'
	                    },
	                    {
	                        title: '移库时间',
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
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0, 
			    shelfTime:'',
			    startTime:'',
			    endTime:'',
		                 locAdjustNo:'',
		    }, 
		 page1:{
			pageNo:1,
			pageSize:10,
			totalPage:0,
			hisDrugCodeList:[],
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
			let datalist = await this.$api.druhStorage.roomDrugList(this.page1);
			this.spinShow = false;
			this.goodsLists=datalist.data.list;
			this.page1.totalPage = datalist.data.count;
		},
		handleSelectionChange(selection) {
			this.backGoodsList = [];
			for (let i = 0; i < selection.length; i++) {
				let item = {
					drugCode:selection[i].drugCode,
					locCode:selection[i].goodsCode,
					lot:selection[i].lot
				}
				this.backGoodsList.push(item);
			}
		},
		// asyncOK(){
		// 	this.backGoodsLists = [];
		// 	this.backGoodsLists = this.backGoodsList;
		// 	this.backGoodsList = [];
		// },
		async asyncOK(){
			if(this.backGoodsList.length == 0){
				this.$Message.error('请勾选商品!');
				this.loadingSh();
				return
			}
			let item = {
				locType:1,
				detailList:this.backGoodsList
			}
			let datalist = await this.$api.druhStorage.drugInformationList(item);
			if(datalist.data.length > 0){
				this.modalGoods = false;
				for (let i = 0; i < datalist.data.length; i++) {
					 let item = {
						drugCode:datalist.data[i].drugCode,
						goodsCode:datalist.data[i].goodsCode,
						goodsName:'',
						id:datalist.data[i].id,
						lot:datalist.data[i].lot
					}
					 let datalistT = await this.$api.publics.queryTargetLocationList(item);
					 datalist.data[i].queryTargetList = datalistT.data;
					 datalist.data[i].goalLot = '';
					 datalist.data[i].goalLocCode = '';
					 datalist.data[i].goalBigDrugCode = '';
					 datalist.data[i].goalDrugCode = '';
					 datalist.data[i].targetUnit = '';
					 datalist.data[i].targetUnitCode = '';
					 datalist.data[i].targetTypeName = '';
					 datalist.data[i].conversionRate = '';
					 datalist.data[i].targetType = '';
					 datalist.data[i].adjustNum = 1;
					 datalist.data[i].isEditLoc = 0;
				}
				this.backGoodsLists = datalist.data;
				console.log(this.backGoodsLists);
				this.backGoodsList = [];
			}else{
				this.$Message.error('请选择召回异常!');
			}
			
		},
		handleGoodsChange(selection) {
			this.goodsSumList = [];
			for (let i = 0; i < selection.length; i++) {
				let item = {
					adjustNum:selection[i].adjustNum,
					batchNo:selection[i].batchNo,
					conversionRate:selection[i].conversionRate,
					drugCode:selection[i].drugCode,
					goalBigDrugCode:selection[i].goalBigDrugCode,
					goalDrugCode:selection[i].goalDrugCode,
					goalLocCode:selection[i].goalLocCode,
					goalLot:selection[i].goalLot,
					goalUnit:selection[i].targetUnitCode,
					isEditLoc:selection[i].isEditLoc,
					lot:selection[i].lot,
					originLocName:selection[i].goodsName,
					originalBigDrugCode:selection[i].bigDrugCode,
					originalLocCode:selection[i].goodsCode,
					originalStore:selection[i].usableQuantity,
					originalUnit:selection[i].replanUnitCode,
					productDate:selection[i].productDate,
					supplierCode:selection[i].supplierCode,
					validEndDate:selection[i].validEndDate,
					id:selection[i].id,
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
			if(this.goodsSumList.length == 0){
				this.$Message.error('请勾选商品!');
				this.loadingSh();
				return
			}
			this.$Modal.confirm({
				title: '提示',
				content:'是否确认移库？',
				onOk: () => {
					this.backSubmit(); 
				},
			});
		},
		async backSubmit(){
			let item = {
				goodsLocationDetailDtoList:this.goodsSumList
			}
			console.log(item);
			let datalist = await this.$api.druhStorage.confirmAdjustList(item);
			if(datalist.data == 1){
				this.$Message.success('移库成功！');
				this.modal=false;
				this.goodsSumList = [];
				this.backGoodsLists = [];
				this.backGoodsList = [];
				this.roomLocadJustListClick(true); 
			}else{
				this.$Message.error('移库异常!');
			}
			
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
		// 目标货位
		// async queryTargetLocationListClick(drugCode,goodsCode,id,lot){
		// 	let item = {
		// 		drugCode:drugCode,
		// 		goodsCode:goodsCode,
		// 		goodsName:'',
		// 		id:id,
		// 		lot:lot
		// 	}
		// 	this.loading = true;
		// 	let datalist = await this.$api.publics.queryTargetLocationList(item);
		// 	this.loading = false;
		// },
		queryTargetClick(index,item,list) {
			for (let i = 0; i < list.length; i++) {
				if(item == list[i].id){
					console.log(item,list);
					this.backGoodsLists[index].goalLot = list[i].goalLot;
					this.backGoodsLists[index].goalLocCode = list[i].id;
					this.backGoodsLists[index].goalBigDrugCode = list[i].goalBigDrugCode;
					this.backGoodsLists[index].goalDrugCode = list[i].goalDrugCode;
					this.backGoodsLists[index].targetUnit = list[i].targetUnit;
					this.backGoodsLists[index].targetUnitCode = list[i].targetUnitCode;
					this.backGoodsLists[index].targetTypeName = list[i].targetTypeName;
					this.backGoodsLists[index].conversionRate = list[i].conversionRate;
					this.backGoodsLists[index].targetType = list[i].targetType;
					if(this.backGoodsLists[index].targetType!=1){
					            this.$Message.success('此商品不能修改补货指示货位');
					}
				}
			}
			console.log(this.backGoodsLists);
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
		async roomLocadJustListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.roomLocadJustList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				for (let i = 0; i < this.druhList.length; i++) {
					if (this.druhList[i].recallStatus != '3') {
						this.druhList[i]['_disabled'] = true
					}
				}
				this.page.totalPage = datalist.data.count;
			}
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 列表
		this.roomLocadJustListClick(false);
	}
}
</script>
<style lang="less" scoped>
    /deep/.ivu-table-wrapper {
    position: relative;
    border: 1px solid #dcdee2;
    border-bottom: 0;
    border-right: 0;
    overflow: inherit;
}
</style>

