<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>就诊卡号</label>
				<Input placeholder="请输入就诊卡号" v-model="page.patpatientid" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>患者姓名</label>
				<Input placeholder="请输入患者姓名" v-model="page.patpatientname" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>发药单号</label>
				<Input placeholder="请输入发药单号" v-model="page.dispensingno" class="condition-group-ipt"></Input>
			</div>
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>起止时间</label>
				 <DatePicker type="daterange" v-model="page.shelfTime" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
			</div> 
		</div>
	             <div class="condition-row">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="getSickGoodsLotReviewListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList" style="width:100%"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getSickGoodsLotReviewListClick(false)" show-total show-elevator />
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
	                        align: 'center',
	                        width:'80',
	                    },
	                    {
	                        title: '姓名',
	                        key: 'patpatientname',
	                        width:'100',
	                        align: 'center'
	                    },
	                    {
	                        title: '就诊卡号',
	                        key: 'patpatientid',
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '发药确认单号',
	                        key: 'dispensingno',
	                        width:'150',
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
			　　　　　　}, params.row.dispensingno),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.dispensingno)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '商品名称',
	                        key: 'drugname',
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
			　　　　　　}, params.row.drugname),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.drugname)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '规格',
	                        key: 'specification',
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
			　　　　　　}, params.row.specification),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.specification)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '发药数量',
	                        key: 'quantity',
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '发药单位',
	                        key: 'drugdosuom',
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '执行人',
	                        key: 'username',
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '执行时间',
	                        key: 'dispensingdate',
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '生产厂家',
	                        key: 'ctmmmanufacturername',
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
			　　　　　　}, params.row.ctmmmanufacturername),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.ctmmmanufacturername)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '批号',
	                        key: 'batch',
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '流向追溯',
	                        key: 'ctmmdeil',
	                        align: 'center',
	                        fixed:'right',
	                        width:'150',
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
	                                            this.$router.push({path: "/purchase/statisticAnalysis/patientTracing/details", query:params.row})
	                                        }
	                                    }
	                                },'追溯')
	                            ]);
	                        }
	                    }
	                ],
	                DeptList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    shelfTime:'',
			    starttime:'',
			    endtime:'',
			    patpatientid:'',
			    patpatientname:'',
			    dispensingno:'',
		    }, 
	            }
	},
	methods:{
		getDateStartEnd(){
			let startdate = new Date(this.page.shelfTime[0]);
			let year = startdate.getFullYear();
			let month = startdate.getMonth() + 1;
			let data = startdate.getDate();
			this.page.starttime = year + '-' + month + '-' + data;

			var enddata = new Date(this.page.shelfTime[1]);
			let year1 = enddata.getFullYear();
			let month1 = enddata.getMonth() + 1;
			let data1 = enddata.getDate();
			this.page.endtime = year1 + '-' + month1 + '-' + data1;
			if(!this.page.shelfTime[0]){
				this.page.starttime = '';
				this.page.endtime = '';
			}
		},
		// 列表
		async getSickGoodsLotReviewListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getSickGoodsLotReviewList(this.page);
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
		this.getSickGoodsLotReviewListClick(false);
	}
}
</script>

