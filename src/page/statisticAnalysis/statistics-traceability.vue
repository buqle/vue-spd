<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>科室</label>
				<Input placeholder="请输入科室" v-model="page.ctddesc" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>患者名称</label>
				<Input placeholder="请输入患者名称" v-model="page.patpatientname" class="condition-group-ipt"></Input>
			</div>
			<div class="condition-group">
				<label>起止时间</label>
				 <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
			</div> 
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>部门</label>
				<Select v-model="page.deptCode" clearable class="big condition-group-ipt">
				        	<Option v-for="(dep,index) in depList" :value="dep.id" :key="index">{{dep.deptname}}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>退药来源</label>
				<Select v-model="page.backSource" clearable class="big condition-group-ipt">
				        	<Option v-for="(sou,index) in backSourceList" :value="sou.value" :key="index">{{sou.lable}}</Option>
				</Select>
			</div>
		</div>
	             <div class="condition-row">
	             	<Button size="large" type="default" icon="ios-search" class="r" @click="getSickBackReportFormListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table :columns="columns" :data="druhList" style="width:100%"></Table>
		             <Spin size="large" fix v-if="spinShow"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getSickBackReportFormListClick(false)" show-total show-elevator />
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
	                        title: '退药部门',
	                        key: 'ctddesc',
	                        align: 'center',
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
	                                            this.$router.push({path: "/purchase/statisticAnalysis/statisticsTraceability/detailsList", query:{'deptCode':params.row.deptCode,'backDeptCode':params.row.backDeptCode,'startTime':this.page.startTime,'endTime':this.page.endTime}})
	                                        }
	                                    }
	                                },params.row.ctddesc)
	                            ]);
	                        }
	                    },
	                    {
	                        title: '接收部门',
	                        key: 'deptname',
	                        width:'100',
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
			　　　　　　}, params.row.deptname),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.deptname)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '退货单',
	                        key: 'backcount',
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '上月同期',
	                        key: 'monthlybackcount',
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
			　　　　　　}, params.row.monthlybackcount),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.monthlybackcount)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '去年同期',
	                        key: 'yearbackcount',
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
			　　　　　　}, params.row.yearbackcount),
			　　　　　　h('div', {
			　　　　　　　　slot: 'content',
			　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
			　　　　　　},params.row.yearbackcount)
			　　　　])
			　　])
			}
	                    },
	                    {
	                        title: '环比变化',
	                        key: 'monthlybackchange',
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '同比变化',
	                        key: 'yearbackchange',
	                        align: 'center',
	                        width:'150',
	                    },
	                    {
	                        title: '退货品种数',
	                        key: 'goodscount',
	                        align: 'center',
	                        width:'150',
	                    },
	                    {
	                        title: '上月同期',
	                        key: 'monthlygoodscount',
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '去年同期',
	                        key: 'yeargoodscount',
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '环比变化',
	                        key: 'monthlygoodschange',
	                        width:'150',
	                        align: 'center'
	                    },
	                    {
	                        title: '同比变化',
	                        key: 'yeargoodschange',
	                        width:'150',
	                        align: 'center'
	                    }
	                ],
	                depList:[],
	                druhList:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    startTime:'',
			    endTime:'',
			    ctddesc:'',
			    patpatientname:'',
			    deptCode:'',
			    backSource:''
		    },
		    launchDate:[],
		    backSourceList:[
		          {value:1,lable:'基数药退药'},
		          {value:2,lable:'患者退药'},
		      ]
	            }
	},
	 mounted() {
		const myDate = new Date();
		const year = myDate.getFullYear(); // 获取当前年份
		const month = myDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月所以要加1);
		const day = myDate.getDate(); // 获取当前日（1-31）
		// 日期格式：2019/07/29 - 2019/07/29
		this.launchDate = `${year}-${month - 1}-${day} - ${year}-${month}-${day}`;
	},
	methods:{
		// 列表
		async getSickBackReportFormListClick(flag){
			let launchDate = this.launchDate;
			if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
				this.page.startTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
				this.page.endTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
			}
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getSickBackReportFormList(this.page);
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.page.totalPage = datalist.data.count;
			}
		},
		clearLaunchDate(){
			this.launchDate = [];
			this.page.startTime = "";
			this.page.endTime = "";
		},
		// 部门
		async getDeptClick(){
			let datalist = await this.$api.publics.reportFormDeptList();
			this.depList=datalist.data;
		},
	},
	created(){
		let myDate = new Date();
		let year = myDate.getFullYear(); // 获取当前年份
		let month = myDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月所以要加1);
		let month1 = myDate.getMonth(); // 获取当前月份(0-11,0代表1月所以要加1);
		if(month < 10){
			month = '0' + month
		}
		let day = myDate.getDate(); // 获取当前日（1-31）
		if(day < 10){
			day = '0' + day
		}
		if(month1 < 10){
			month1 = '0' + month1
		}
		// 日期格式：2019/07/29 - 2019/07/29
		this.page.startTime = `${year}-${month1}-${day}`;
		this.page.endTime = `${year}-${month}-${day}`;
		// console.log(this.$store.state.currentSelect);
		// 部门
		this.getDeptClick();
		// 列表
		this.getSickBackReportFormListClick(false);
	}
}
</script>

