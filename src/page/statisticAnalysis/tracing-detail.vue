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
	                          单号：{{comlist.orderNo}}
	                        </Col>
	                        <Col span="6">
	                          单据类型：{{comlist.orderType}}
	                        </Col>
	                        <Col span="6">
	                          操作人：{{comlist.operationUser}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30">
	                        <Col span="6">
	                          操作时间：{{comlist.operationDate}}
	                        </Col>
	                        <Col span="6">
	                          部门：{{comlist.deptName}}
	                        </Col>
	                    </Row>
	            </div>
	        </Card>
		        <div class="sum-style">
			<h3>列表信息</h3>
			</div>
		<Table :columns="columns" :data="druhList"></Table> 
		<Spin size="large" fix v-if="spinShow"></Spin>
		<!-- <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getPurchaseOrderListClick()" show-total show-elevator />
	             </div> -->
	</div>  
</template>
<script> 
import {route}  from '@/api/apiRoute';
export default {
	data () {
	            return { 
	            	url:`${route}/a/instoredetail/print/printInstoreDetail`,
	             comlist:'',
	             druhList:[],
	             spinShow:false,
		columns:[ 
				{
					type: 'index',
					title: '序号',
					align: 'center'
				},
				{ 
					title: '商品名称',
					key: 'ctmmTradeName',
					align: 'center'
				},
				{
					title: '规格',
					key: 'ctmmSpecification',
					align: 'center'
				},
				{ 
					title: '生产厂商',
					key: 'ctmmManufacturerName',
					align: 'center'
				},
				{	 
					title: '单位',
					key: 'unit',
					align: 'center'
				},
				{	 
					title: '数量',
					key: 'quantity',
					align: 'center'
				},
	                	],
	            }
	},
	methods: {
		// 列表
		async getPurchaseOrderDetailListClick(){
			this.druhList = [];
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getPurchaseOrderDetailList({'orderCode':this.$router.history.current.query.orderNo});
			this.spinShow = false;
			if(datalist.code == 200){
				this.comlist = datalist.data;
				this.druhList=datalist.data.planDetailList.list;
				// this.page.totalPage = datalist.data.planDetailList.count;
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
		this.getPurchaseOrderDetailListClick();
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
