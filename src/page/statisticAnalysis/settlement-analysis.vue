<template>
	<div class="condition">  
		<div class="condition-row">
			<div class="condition-group">
				<label>供应商</label>
				<Select v-model="supplierCode" clearable class="big condition-group-ipt">
			        		<Option v-for="(sup,index) in supplierList" :value="sup.ctmaSupplierCode" :key="index">{{ sup.ctmaSupplierName}}</Option>
			    	</Select>
			</div> 
			<div class="condition-group">
				<label>结算时间</label>
				 <DatePicker type="daterange" v-model="launchDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-clear="clearLaunchDate"></DatePicker>
			</div> 
		</div>
 
	             <div class="condition-row">  
	             	<Button  type="default" class="l" @click="exportAsPrint()">导出</Button>
	             	<Button  type="default" icon="ios-search" class="r" @click='staticsListClick'>查询</Button>
	             	
	             </div>
	             <div id="main2" style="width: 100%;height:600px;"></div>
	</div>  
</template>
<script>
export default {
	data () {
        return {
        	startTime:'',
        	endTime:'',
        	launchDate:[],
        	supplierList:[],
        	supplierCode:'',
        	supplierCodeList:[],
        }
	},
	computed: {  

	},
	mounted(){
		const myDate = new Date();
		const year = myDate.getFullYear(); // 获取当前年份
		const month = myDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月所以要加1);
		const day = myDate.getDate(); // 获取当前日（1-31）
		// 日期格式：2019/07/29 - 2019/07/29
		this.launchDate = `${year}-${month - 1}-${day} - ${year}-${month}-${day}`;
		this.getChart();
	},
	methods: {
		// 导出
		async exportAsPrint(){
			this.supplierCodeList = [];
			this.supplierCodeList.push(this.supplierCode);
			let launchDate = this.launchDate;
			if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
				this.startTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
				this.endTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
			}
        			let datalist = await this.$api.druhStorage.getStaticsExportList({'supplierCodeList':this.supplierCodeList,'startTime':this.startTime,'endTime':this.endTime});
        			this.supplierCodeList = [];
			let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
			let fileName = `${this.getCurrentDate()}结算分析表详情.xls`;
			let objectUrl = URL.createObjectURL(blob); 
			const link = document.createElement('a')
			link.download = fileName;
			link.href = objectUrl;
			link.click();

			// let objectUrl = URL.createObjectURL(blob); 
			// // window.location.href = objectUrl;
			// window.open(objectUrl);
		},
		clearLaunchDate(){
			this.launchDate = [];
			this.startTime = "";
			this.endTime = "";
		},
		// 供应商
		async supplierAllListClick(){
			this.supplierCodeList = [];
			let datalist = await this.$api.publics.supplierAllList();
			this.supplierList=datalist.data;
			this.supplierCode = this.supplierList[0].ctmaSupplierCode;
			this.supplierCodeList.push(this.supplierList[0].ctmaSupplierCode);
			this.staticsListClick();
		},
		// 列表
		async staticsListClick(){
			this.supplierCodeList = [];
			this.supplierCodeList.push(this.supplierCode);
			let launchDate = this.launchDate;
			if(launchDate && Array.isArray(launchDate) && launchDate.length > 0 && launchDate[0] && launchDate[1]){
				this.startTime = this.$moment(launchDate[0]).format('YYYY-MM-DD');
				this.endTime = this.$moment(launchDate[1]).format('YYYY-MM-DD');
			}
			this.spinShow = true;
			let datalist = await this.$api.druhStorage.getStaticsList({'supplierCodeList':this.supplierCodeList,'startTime':this.startTime,'endTime':this.endTime});
			this.spinShow = false;
			if(datalist.code == 200){
				this.druhList=datalist.data.list;
				this.supplierCodeList = [];
			}
		},
		getChart: function(){
			console.log( this.echarts)
			var myChart = this.echarts.init(document.getElementById('main2'));
			// 绘制图表
			myChart.setOption({
			    title: {
			        text: '供应商结算分析（单位：万元）',
			        left: 'center'
			    },
			    tooltip: {},
			    xAxis: {
			        // data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
			    },
			    yAxis: {},
			    series: [{
			        name: '销量',
			        type: 'bar',
			        // data: [5, 20, 36, 10, 10, 20]
			    }]
			});
		}
	},
	route: {
      activate: function () {
       
      }
    },
	  created() {
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
		this.startTime = `${year}-${month1}-${day}`;
		this.endTime = `${year}-${month}-${day}`;
	    	this.supplierAllListClick();
	},

}
</script>
<style lang="less">

</style>
