<template>
	<div class="condition">   
	<Card dis-hover :bordered="false">
	            <p slot="title">
	                单据信息
	            </p>
	            <p slot="extra" class="btn-style">
	                <!-- <Button type="primary" icon="printer" @click="print()">打印</Button> -->
	            </p> 
	            <div> 
	                    <Row :gutter="30">
	                        <Col span="6">
	                          工号：{{comlist.userNo}}
	                        </Col>
	                        <Col span="6">
	                          姓名：{{comlist.userName}}
	                        </Col>
	                    </Row>
	            </div>
	        </Card>
	        <div class="sum-style">
			<h3>列表信息</h3>
			</div>
		<Table :columns="columns" :data="druhList"></Table> 
		<Spin size="large" fix v-if="spinShow"></Spin>
		<div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getPurchaseOrderListClick()" show-total show-elevator />
	             </div>
	</div>  
</template>
<script> 
import {route}  from '@/api/apiRoute';
export default {
	data () {
	            return { 
	            	url:`${route}/a/instoredetail/print/printInstoreDetail`,
	             comlist:{
	             	userNo:this.$router.history.current.query.userNo,
	             	userName:this.$router.history.current.query.userName,
	             },
	             druhList:[],
	             spinShow:false,
		columns:[ 
				{
					type: 'index',
					title: '序号',
					align: 'center'
				},
				{ 
					title: '姓名',
					key: 'userName',
					align: 'center'
				},
				{
					title: '工号',
					key: 'userNo',
					align: 'center'
				},
				{ 
					title: '单据类型',
					key: 'orderType',
					align: 'center'
				},
				{	 
					title: '单据号',
					key: 'orderNo',
					align: 'center'
				},
				{	 
					title: '供应商名称',
					key: 'supplierName',
					align: 'center'
				},
				{
					title: '品规数',
					key: 'count',
					align: 'center'
				},
				{
					title: '单据状态',
					key: 'statusName',
					align: 'center'
				},
				{
			                        title: '操作',
			                        key: 'vacuumNum',
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
			                                            this.$router.push({path: "/purchase/statisticAnalysis/tracing/details",query:{'orderNo':params.row.orderNo}})
			                                        }
			                                    }
			                                },'详情')
			                            ]);
			                        }
			                    },
	                	],
	                	page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    startTime:'',
			    endTime:'',
			    userId:''
		    	},
	            }
	},
	methods: {
		// 列表
		async getPurchaseOrderListClick(){
			this.druhList = [];
			this.spinShow = true;
			this.page.userId = this.$router.history.current.query.userId;
			let datalist = await this.$api.druhStorage.getPurchaseOrderList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
		},
		// 打印
		async print(){
			window.open(`${this.url}?inStoreCode=${this.$router.history.current.query.id}`, '_blank');
		},
		// // 导出
		// async exportAsPrint(){ 
		// 	let item ={
		// 		distributeCode:this.$router.history.current.query.id,
		// 		status:this.page.status
		// 	}
  //       			let datalist = await this.$api.druhStorage.exportAsPrintList(item);
		// 	let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
		// 	let fileName = `${this.getCurrentDate()}配送商详情.xls`;
		// 	let objectUrl = URL.createObjectURL(blob); 
		// 	const link = document.createElement('a')
		// 	link.download = fileName;
		// 	link.href = objectUrl;
		// 	link.click();

		// 	// let objectUrl = URL.createObjectURL(blob); 
		// 	// // window.location.href = objectUrl;
		// 	// window.open(objectUrl);
		// },
	}, 
	created(){
		// console.log(this.$router.history.current.query.id);
		// 列表
		this.getPurchaseOrderListClick();
	},
	watch: { 
	 
	},


}
</script> 
<style scoped>
	.c_green_tit {
        color: #2d8cf0;
    }
</style>
