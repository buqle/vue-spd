<template>
	<div >
		<div class="f24 black">栏目按钮</div>  
		<div class="f20">高度 34 px</div>
		<div class="mt20">
			<a class="button-img modify-btn">修改</a> 
			<a class="button-img send-btn ml20">飞送</a>
			<a class="button-img change-btn ml20">显示变更内容</a>
			<!-- <button class="button-img send-btn ml20">飞送</button>
			<button class="button-img change-btn ml20">显示变更内容</button> -->
			<a class="button-img open-btn ml20"></a> 
			<a class="button-img check-btn ml20"></a>
			<a class="button-img-small time-btn ml20"></a>  
			<a class="button-img-small delete-btn ml20"></a> 
			<a class="button-img correct-btn ml20"></a> 
			<a class="button-img error-btn ml20"></a>
		</div> 


		<div class="f24 black mt20">表格按钮</div>
		<div class="f20">高度 24 px</div>
		 <div class="mt20">
			<button class="table-detaile-btn">明细</button> 
			<button class="table-delete-btn ml20">删除</button>
		</div>  


		<div class="f24 black mt20">筛选按钮</div> 
		<div class="f20">高度 24 px</div>
		<div class="mt20">
	                <a class="choice-btn" :class="{'active':choice==''}" href="javascript:void(0)" @click="choice=''">全部</a> 
	                <a class="choice-btn ml10" :class="{'active':choice=='J1'}" href="javascript:void(0)" @click="choice='J1'">近一周</a>
	                <a class="choice-btn ml10" :class="{'active':choice=='J2'}" href="javascript:void(0)" @click="choice='J2'">近一月</a>
	                <a class="choice-btn ml10" :class="{'active':choice=='J3'}" href="javascript:void(0)" @click="choice='J3'">近三月</a>
	                <a class="choice-btn ml10" :class="{'active':choice=='J4'}" href="javascript:void(0)" @click="choice='J4'">近六月</a>
	                <a class="choice-btn ml10" :class="{'active':choice=='J5'}" href="javascript:void(0)" @click="choice='J5'">近一年</a>
	                <a class="choice-btn ml10" :class="{'active':choice=='J6'}" href="javascript:void(0)" @click="choice='J6'">其他</a>   
	             </div>


	             <div class="f24 black mt20">选择按钮</div> 
	             <div class="f20">单选 / 多选</div>
	             <div class="mt20">
		             <RadioGroup class="l">
		             	<label class="l">三方经营资质</label>
				<Radio label="apple" class="l ml10"> 
					<span>有</span>
				</Radio>
				<Radio label="android" class="l"> 
					<span>无</span>
				</Radio> 
			</RadioGroup>
			<CheckboxGroup class="l">
				<Checkbox label="twitter"> 
					<span>长期有效</span>
				</Checkbox>
				<Checkbox label="facebook"> 
					<span>长期有效</span>
				</Checkbox> 
			</CheckboxGroup>
		</div><br> 


		<div class="f24 black mt20">搜索框</div> 
		<div class="f20 mb20">单行高度 34 px</div> 
		<Input class="l" placeholder="输入关键词" style="width: 515px;"><Button slot="append" icon="ios-search" style="width:65px;"></Button></Input>
		<div class="label-search-ipt l ml30">
			<label>商品名称</label>
			<Input placeholder="输入关键词" style="width: 215px;"><Button slot="append" icon="ios-search"></Button></Input>
		</div>
		<div class="label-search-del-ipt l ml30"> 
			<Input placeholder="输入关键词" v-model="del" style="width: 446px;"><Button slot="append" icon="ios-search"></Button></Input>
			<button class="del" style="margin-left: 375px;" @click="del=''"></button>
		</div>  
		<div class="label-search-ipt l ml30">
			<label>中转承运商</label>
			<Input placeholder="输入关键词" v-model="del1" style="width: 215px;"><Button slot="append" icon="ios-search"></Button></Input>
			<button class="del" style="margin-left: 145px;" @click="del1=''"></button>
		</div><br><br><br>



		<div class="f24">输入框</div>
		<div class="f20 mb20">单行高度 34 px</div>
		<div class="l">
			<label>公司名称</label>
			<Input placeholder="华海健业医疗器械有限公司" disabled v-model="del1" class="ml10" style="width: 455px;"></Input> 
		</div>
		<div class="l ml30">
			<label>公司简称</label>
			<Input placeholder="华海" v-model="del1" class="ml10" style="width: 455px;"></Input> 
		</div><br><br><br>
		<div class="l ">
			<label>详细地址</label>
			<Input placeholder="北京" v-model="del1" class="ml10" style="width: 455px;"></Input> 
		</div>
		<div class="l ml30">
			<label>法人代表</label>
			<Input placeholder="华海" v-model="del1" class="ml10" style="width: 455px;"></Input> 
		</div>
		<div class="label-mobile-ipt l ml10">
			<label>手机号</label>
			<input class="mobile-ipt-l br-none" placeholder="11111111111" v-model="del1" style="width: 226px;"></input>
			<input class="mobile-ipt-r bl-none" placeholder="22222222222" v-model="del1" style="width: 226px;"></input>
			<i>/</i>
		</div>
		<div class="label-address-ipt l mt20">
			<label>通讯地址</label>
			<div class="l ml10">
				<Input type="textarea" :rows="1" placeholder="北京"></Input>
			</div>
		</div>
		<div class="l ml30 mt20">
			<InputNumber :max="10" :min="1"></InputNumber>     元 / 每件
		</div><br><br><br><br><br><br><br>
		 
		<div class="f24 w500">表格内输入框</div>
		<div class="f18 w500 mb20">行单行高度24px</div>
		<input placeholder="华海" v-model="del1" class="input-24px" style="width: 112px;"></input>    元 / 车次

		<br><br>
		<div class="f24 mt20">下拉框</div>
		<div class="label-register-address-ipt mt20">
			<label class="l">注册地址</label>
			<Cascader :data="data" trigger="hover" class="l ml10" style="width: 460px;"></Cascader>
		</div>

		<div class="label-date-selection mt20">
			<label class="l">日期选择</label>
			<DatePicker type="date" placeholder="日期选择" class="ml10" style="width: 460px"></DatePicker>
		</div>

		<div class="label-date-range mt20">
			<label class="l">日期范围</label>
			<DatePicker type="daterange" placement="bottom-end" class="ml10" placeholder="日期范围" style="width: 460px"></DatePicker>
		</div> 
	</div>
</template>
<script>
export default {
	data () {
	            return {
	            	data: [{
	                    value: 'beijing',
	                    label: '北京',
	                    children: [
	                        {
	                            value: 'gugong',
	                            label: '故宫'
	                        },
	                        {
	                            value: 'tiantan',
	                            label: '天坛'
	                        },
	                        {
	                            value: 'wangfujing',
	                            label: '王府井'
	                        }
	                    ]
	                }, {
	                    value: 'jiangsu',
	                    label: '江苏',
	                    children: [
	                        {
	                            value: 'nanjing',
	                            label: '南京',
	                            children: [
	                                {
	                                    value: 'fuzimiao',
	                                    label: '夫子庙',
	                                }
	                            ]
	                        },
	                        {
	                            value: 'suzhou',
	                            label: '苏州',
	                            children: [
	                                {
	                                    value: 'zhuozhengyuan',
	                                    label: '拙政园',
	                                },
	                                {
	                                    value: 'shizilin',
	                                    label: '狮子林',
	                                }
	                            ]
	                        }
	                    ],
	                }],
	                buttonSize: 'small',
	                choice:'',
	                del:'',
	                del1:'',
	            }
	},
	methods: {  
	}
}
</script>
<style lang="less">

</style>

