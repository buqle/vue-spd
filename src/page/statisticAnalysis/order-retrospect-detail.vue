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
	                          供应商：{{comlist.supplierName}}
	                        </Col>
	                        <Col span="6">
	                          订单单号：{{comlist.orderCode}}
	                        </Col>
	                        <Col span="6">
	                          订单状态：{{comlist.orderStatusName}}
	                        </Col>
	                    </Row>
	                    <Row :gutter="30" class="mt10"> 
	                        <Col span="6">
	                          下单日期：{{comlist.orderDate}}
	                        </Col>
	                    </Row>  
	            </div>
	        </Card>
	             <div class="sum-style">
			<h3>订单信息</h3>
		</div>
	             <div v-for="druh in druhList">
	             	—— 订单单号: {{druh.orderFlowNo}}　　下单日期:{{druh.orderStr}}
	             </div>
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
	            }
	},
	methods: {
		// 头部
		async getOrderTraceExecuteDetailListClick(){
			let datalist = await this.$api.druhStorage.getOrderTraceExecuteDetailList({'orderCode':this.$router.history.current.query.id});
			this.comlist=datalist.data;
			this.getOrderTraceExecuteOrderFlowListClick();
		},
		// 列表
		async getOrderTraceExecuteOrderFlowListClick(){
			this.druhList = [];
			let datalist = await this.$api.druhStorage.getOrderTraceExecuteOrderFlowList({'orderCode':this.$router.history.current.query.id});
			this.druhList=datalist.data;
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
		this.getOrderTraceExecuteDetailListClick();
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
