<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>单据号</label>
				<Input placeholder="请输入单号" v-model="page.recallNo" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>状态</label>
				<Select v-model="page.recallStatus" clearable class="big condition-group-ipt">
				        	<Option v-for="sta in stateList" :value="sta.value" :key="sta.value">{{ sta.label }}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>发起时间</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div> 
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>供应商</label> 
				<Input placeholder="请输入供应商" v-model="page.supplierName" class="condition-group-ipt"></Input>
			</div> 
			<div class="condition-group">
				<label>原因</label>
				<Select v-model="page.remarks" clearable class="big condition-group-ipt">
			        <Option v-for="type in typeList" :value="type.value" :key="type.value">{{ type.label}}</Option>
			    </Select>
			</div>
		</div>
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" @click="batchThroughAuditListClick()">批量通过</Button>
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="druhStorageListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList" @on-selection-change="handleListChange"></Table>
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
	                                            this.$router.push({path: "/drugStorage/outStorage/recallAndLockedCheck/details", query:{id:params.row.recallNo}})
	                                        }
	                                    }
	                                },params.row.recallNo), 
	                                h('p', {
	                                    props: {
	                                        // type: 'primary',
	                                        // size: 'small'
	                                    },
	                                    style: {float:'left',color:'#ffffff',padding:'0 5px',backgroundColor: 'red',position:'absolute',marginLeft:'8%',borderRadius:'20px'},
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
	                    },
	                    {
	                        title: '审核人',
	                        key: 'updateUserName',
	                        align: 'center'
	                    },
	                    {
	                        title: '审核时间',
	                        key: 'updateDate',
	                        align: 'center'
	                    }
	                ],
	                recallNo:[],
	                typeList:[],
	                DeptList:[],
	                stateList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0, 
			    recallNo:'',
			    supplierName:'',
			    shelfTime:'',
			    startTime:'',
			    endTime:'',
			    recallStatus:'',
 			    remarks:''
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
		handleListChange(selection) {
			 for (let i = 0; i < selection.length; i++) {
			 	let item ={
			 		recallNo:selection[i].recallNo
			 	}
				this.recallNo.push(item);
			}
		},
		async batchThroughAuditListClick(){
			if(this.recallNo.length == 0){
				this.$Message.error('请勾选单据!');
				return
			}
		 	this.modal=true;
			let datalist = await this.$api.druhStorage.batchThroughAuditList({'detailList':this.recallNo});
			this.recallNo = [];
			this.modal=false;
			this.druhStorageListClick(true);
		},
		// 列表
		async druhStorageListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.roomrecallDetailsList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				for (var i = 0; i < this.druhList.length; i++) {
					if (this.druhList[i].recallStatus != '1') {
						this.druhList[i]['_disabled'] = true
					}
				}
				this.page.totalPage = datalist.data.count;
			}
		},
		// 类型
		async typeListClick(){
			let datalist = await this.$api.publics.typeList({'type':'recall_reason'});
			this.typeList=datalist.data;
		},
		// 状态
		async stateListClick(){
			let datalist = await this.$api.publics.typeList({'type':'recall_status','values':'1,2,4'});
			this.stateList=datalist.data;
		},
	},
	created(){
		// console.log(this.$store.state.currentSelect); 
		// 原因
		this.typeListClick();
		// 状态
		this.stateListClick();
		// 列表
		this.druhStorageListClick(false);
	}
}
</script>

