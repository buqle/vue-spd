<template>
	<div class="condition">
		<div class="condition-row">
			<div class="condition-group">
				<label>供应商</label>
				<Select v-model="page.supplierCode" clearable class="big condition-group-ipt">
			        		<Option v-for="sup in supplierList" :value="sup.ctmaSupplierCode" :key="sup.ctmaSupplierCode">{{ sup.ctmaSupplierName}}</Option>
			    	</Select>
			</div> 
			<div class="condition-group">
				<label>资源类型</label>
				<Select v-model="page.licType" clearable class="big condition-group-ipt">
				        	<Option v-for="fac in factorList" :value="fac.value" :key="fac.value">{{ fac.label }}</Option>
				</Select>
			</div> 
			<div class="condition-group">
				<label>药品名称</label>
				<Select
			                v-model="goodsName1"
			                filterable
			                clearable
			                remote
			                placeholder="请选择通用名/商品名"
			                :remote-method="queryDrugByListClick1"
			                :loading="loading" @on-change="goodsClick1(goodsName1)" class="big condition-group-ipt">
			                <Option v-for="(option, index) in goodsList1" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
			            </Select>
			</div> 
		</div>
		<div class="condition-row">
			<div class="condition-group">
				<label>临效期</label>
				<Select v-model="page.expiryDate" clearable class="big condition-group-ipt">
				        	<Option v-for="per in periodList" :value="per.value" :key="per.value">{{ per.label }}</Option>
				</Select>
			</div>
			<div class="condition-group">
				<label>生产厂家</label>
				<Input placeholder="请输入供应商" v-model="page.producerName" class="condition-group-ipt"></Input>
			</div>
		</div> 
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" v-if="this.$store.state.currentName == '西药库'" @click="add()">上传证照</Button>
	             	<Button type="default" size="large" class="l ml10" v-if="this.$store.state.currentName == '西药库'" @click="batchDeleteListClick()">删除</Button>
	             	<Button type="default" size="large" icon="ios-search" class="r" @click="depotlicinfoListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
			<Table ref="selection" :columns="columns" :data="depotlicinfoList" @on-selection-change="handleSelectionChange" v-if="this.$store.state.currentName == '西药库'"></Table>
		             <Table ref="selection" :columns="columns1" :data="depotlicinfoList" @on-selection-change="handleSelectionChange" v-else></Table>
		             <Spin size="large" fix v-if="spinShow1"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="depotlicinfoListClick(false)" show-total show-elevator />
	             </div>

	             <Modal v-model="modal" width="1200" footer-hide @on-cancel="modalReset">
	             <Spin size="large" fix v-if="spinShow"></Spin>
		      <p slot="header" style="color:#4fa1a4; text-align:center; font-size: 16px;">上传药品资质</p>
		      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
		      <div style="width:1150px;height:120px;">
			      <div class="l" style="width: 400px;">
			        <Row>
			          <Col span="20">
			            <FormItem label="供应商名称" prop="supplierCode"> 
			              	<Select v-model="formValidate.supplierCode" clearable style="width: 300px">
				        		<Option v-for="sup in supplierList" :value="sup.ctmaSupplierCode" :key="sup.ctmaSupplierCode">{{ sup.ctmaSupplierName}}</Option>
				    	</Select>
			            </FormItem>
			          </Col>
			        </Row>   
			        <Row>
			          <Col span="20">
			            <FormItem label="药品名称" prop="goodsName">
			              	<Select
				                v-model="formValidate.goodsName"
				                filterable
				                clearable
				                remote
				                :remote-method="queryDrugByListClick"
				                :loading="loading"  style="width: 300px" @on-change="goodsClick(formValidate.goodsName)">
				                <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
				            </Select>
			            </FormItem>
			          </Col>
			        </Row>
			        </div>
			        <div class="l" style="width: 600px; margin-left: 100px;margin-top: 65px;">
				        <p class="l" style="width: 400px;"><b>生产厂家:</b>{{formValidate.producerName}}</p>
				        <p class="l"><b>批准文号:</b>{{formValidate.registKey}}</p>
			        </div>
		        </div>
			<Tabs v-model="nameShow" :animated="false" @on-click="handleTab">
				<TabPane label="药品注册证" name="1" >
					<div class="l" style="width:400px;">
					        <Row>
					          <Col span="20">
					            <FormItem label="发证日期" prop="productTime" ><!--    :rules="{required: true, message: '请选择发证日期！'}" -->
					              	<DatePicker type="date" v-model="formValidate.productTime" placeholder="发证日期" style="width: 300px"></DatePicker>
					            </FormItem>
					          </Col>
					        </Row>
					        <Row>
					          <Col span="20">
					            <FormItem label="有效期至" prop="validEndDate">
					              	<DatePicker type="date" v-model="formValidate.validEndDate" placeholder="有效期至" style="width: 300px"></DatePicker>
					            </FormItem>
					          </Col>
					        </Row>
					        <Row>
					          <Col span="20">
					            <FormItem label="证件编号" prop="licCode">
					              	<Input v-model="formValidate.licCode"  placeholder="证件编号" style="width: 300px" />
					            </FormItem>
					          </Col>
					        </Row>
					        </div>
					       <div class="l ml10">
					        	 <div class="demo-upload-list" v-for="(item,index) in uploadList" style="width: 150px; height: 150px;">
						        <template v-if="item.status === 'finished'" >
						            <img :src="item.url">
						            <div class="demo-upload-list-cover">
						                <Icon type="ios-eye-outline" style="margin-top: 65px;" @click.native="handleView(item.url,item.name)"></Icon>
						                <Icon type="ios-trash-outline" style="margin-top: 65px;" @click.native="handleRemove(item,index)"></Icon>
						            </div>
						        </template>
						        <template v-else>
						            <Progress v-if="item.showProgress" :percent="percentage" hide-info></Progress>
						        </template>
						    </div>
						    <Upload
						        ref="upload"
						        :show-upload-list="false"
						        :default-file-list="defaultList"
						        :on-success="handleSuccess"
						        :format="['jpg','jpeg','png']"
						        :max-size="2048"
						        :on-format-error="handleFormatError"
						        :on-exceeded-size="handleMaxSize"
						       :before-upload="handleBeforeUpload"
						        multiple
						        type="drag"
						        :action="url"
						        style="display: inline-block;width:150px;">
						        <div style="width: 150px;height:150px;line-height: 150px;">
						            <Icon type="ios-camera" size="20"></Icon>
						        </div>
						    </Upload>
						    <Modal :title="imgName" v-model="visible">
						        <img :src="imgUrl" v-if="visible" style="width: 100%">
						    </Modal>
					        </div>
				</TabPane>
				<TabPane label="药品质检报告" name="2" class="mb10">
					<div class="l" style="width:400px;">
						<Row>
					          <Col span="20">
					            <FormItem label="批号" prop="lot">
					              	<Input v-model="formValidate.lot"  placeholder="批号" style="width: 300px" />
					            </FormItem>
					          </Col>
					        </Row>
					        <Row>
					          <Col span="20">
					            <FormItem label="生产日期" prop="productTime">
					              	<DatePicker type="date" v-model="formValidate.productTime" placeholder="生产日期" style="width: 300px"></DatePicker>
					            </FormItem>
					          </Col>
					        </Row>
					        <Row>
					          <Col span="20">
					            <FormItem label="有效期至" prop="validEndDate">
					              	<DatePicker type="date" v-model="formValidate.validEndDate" placeholder="有效期至" style="width: 300px"></DatePicker>
					            </FormItem>
					          </Col>
					        </Row>
					        <Row>
					          <Col span="20">
					            <FormItem label="入库单" prop="inStoreCode">
					              	<Input v-model="formValidate.inStoreCode"  placeholder="入库单" style="width: 300px" />
					            </FormItem>
					          </Col>
					        </Row>
					        <Row>
					          <Col span="20">
					            <FormItem label="入库日期" prop="inStoreDate">
					              	<DatePicker type="date" v-model="formValidate.inStoreDate" placeholder="入库日期" style="width: 300px"></DatePicker>
					            </FormItem>
					          </Col>
					        </Row>
					        </div>
					       <div class="l ml10">
					        	 <div class="demo-upload-list" v-for="(item,index) in uploadList" style="width: 150px; height: 150px;">
						        <template v-if="item.status === 'finished'" >
						            <img :src="item.url">
						            <div class="demo-upload-list-cover">
						                <Icon type="ios-eye-outline" style="margin-top: 65px;" @click.native="handleView(item.url,item.name)"></Icon>
						                <Icon type="ios-trash-outline" style="margin-top: 65px;" @click.native="handleRemove(item,index)"></Icon>
						            </div>
						        </template>
						        <template v-else>
						            <Progress v-if="item.showProgress" :percent="percentage" hide-info></Progress>
						        </template>
						    </div>
						    <Upload
						        ref="upload"
						        :show-upload-list="false"
						        :default-file-list="defaultList"
						        :on-success="handleSuccess"
						        :format="['jpg','jpeg','png']"
						        :max-size="2048"
						        :on-format-error="handleFormatError"
						        :on-exceeded-size="handleMaxSize"
						       :before-upload="handleBeforeUpload"
						        multiple
						        type="drag"
						        :action="url"
						        style="display: inline-block;width:150px;">
						        <div style="width: 150px;height:150px;line-height: 150px;">
						            <Icon type="ios-camera" size="20"></Icon>
						        </div>
						    </Upload>
						    <Modal :title="imgName" v-model="visible">
						        <img :src="imgUrl" v-if="visible" style="width: 100%">
						    </Modal>
					        </div>
				</TabPane>
				<TabPane label="药品说明书" name="3" class="mb10">
				<div class="l" style="width:400px;">
						<Row>
					          <Col span="20">
					            <FormItem label="核准日期" prop="productTime">
					              	<DatePicker type="date" v-model="formValidate.productTime" placeholder="核准日期" style="width: 300px"></DatePicker>
					            </FormItem>
					          </Col>
					        </Row>
					        <Row>
					          <Col span="20">
					            <FormItem label="修订日期" prop="validEndDate">
					              	<DatePicker type="date" v-model="formValidate.validEndDate" placeholder="修订日期" style="width: 300px"></DatePicker>
					            </FormItem>
					          </Col>
					        </Row>
					        </div>
					        <div class="l ml10">
					        	 <div class="demo-upload-list" v-for="(item,index) in uploadList" style="width: 150px; height: 150px;">
						        <template v-if="item.status === 'finished'" >
						            <img :src="item.url">
						            <div class="demo-upload-list-cover">
						                <Icon type="ios-eye-outline" style="margin-top: 65px;" @click.native="handleView(item.url,item.name)"></Icon>
						                <Icon type="ios-trash-outline" style="margin-top: 65px;" @click.native="handleRemove(item,index)"></Icon>
						            </div>
						        </template>
						        <template v-else>
						            <Progress v-if="item.showProgress" :percent="percentage" hide-info></Progress>
						        </template>
						    </div>
						    <Upload
						        ref="upload"
						        :show-upload-list="false"
						        :default-file-list="defaultList"
						        :on-success="handleSuccess"
						        :format="['jpg','jpeg','png']"
						        :max-size="2048"
						        :on-format-error="handleFormatError"
						        :on-exceeded-size="handleMaxSize"
						       :before-upload="handleBeforeUpload"
						        multiple
						        type="drag"
						        :action="url"
						        style="display: inline-block;width:150px;">
						        <div style="width: 150px;height:150px;line-height: 150px;">
						            <Icon type="ios-camera" size="20"></Icon>
						        </div>
						    </Upload>
						    <Modal :title="imgName" v-model="visible">
						        <img :src="imgUrl" v-if="visible" style="width: 100%">
						    </Modal>
					        </div>
				</TabPane>
				<TabPane label="进口药品通关单" name="4" class="mb10">
						<div class="l" style="width:400px;">
							<Row>
							          <Col span="20">
							            <FormItem label="提运单号" prop="deliveryCode">
							              	<Input v-model="formValidate.deliveryCode"  placeholder="提运单号" style="width: 300px" />
							            </FormItem>
							          </Col>
							        </Row>
							        <Row>
							          <Col span="20">
							            <FormItem label="批件号" prop="lot">
							              	<Input v-model="formValidate.lot"  placeholder="批件号" style="width: 300px" />
							            </FormItem>
							          </Col>
							        </Row>
					        </div>
					          <div class="l ml10">
					        	 <div class="demo-upload-list" v-for="(item,index) in uploadList" style="width: 150px; height: 150px;">
						        <template v-if="item.status === 'finished'" >
						            <img :src="item.url">
						            <div class="demo-upload-list-cover">
						                <Icon type="ios-eye-outline" style="margin-top: 65px;" @click.native="handleView(item.url,item.name)"></Icon>
						                <Icon type="ios-trash-outline" style="margin-top: 65px;" @click.native="handleRemove(item,index)"></Icon>
						            </div>
						        </template>
						        <template v-else>
						            <Progress v-if="item.showProgress" :percent="percentage" hide-info></Progress>
						        </template>
						    </div>
						    <Upload
						        ref="upload"
						        :show-upload-list="false"
						        :default-file-list="defaultList"
						        :on-success="handleSuccess"
						        :format="['jpg','jpeg','png']"
						        :max-size="2048"
						        :on-format-error="handleFormatError"
						        :on-exceeded-size="handleMaxSize"
						       :before-upload="handleBeforeUpload"
						        multiple
						        type="drag"
						        :action="url"
						        style="display: inline-block;width:150px;">
						        <div style="width: 150px;height:150px;line-height: 150px;">
						            <Icon type="ios-camera" size="20"></Icon>
						        </div>
						    </Upload>
						    <Modal :title="imgName" v-model="visible">
						        <img :src="imgUrl" v-if="visible" style="width: 100%">
						    </Modal>
					        </div>
				</TabPane> 
				<TabPane label="再注册受理通知书" name="5" class="mb10">
					<div class="l" style="width:400px;">
					        <Row>
					          <Col span="20">
					            <FormItem label="发证日期" prop="productTime">
					              	<DatePicker type="date" v-model="formValidate.productTime" placeholder="发证日期" style="width: 300px"></DatePicker>
					            </FormItem>
					          </Col>
					        </Row>
					        <Row>
					          <Col span="20">
					            <FormItem label="有效期至" prop="validEndDate">
					              	<DatePicker type="date" v-model="formValidate.validEndDate" placeholder="有效期至" style="width: 300px"></DatePicker>
					            </FormItem>
					          </Col>
					        </Row>
					        <Row>
					          <Col span="20">
					            <FormItem label="证件编号" prop="licCode">
					              	<Input v-model="formValidate.licCode"  placeholder="证件编号" style="width: 300px" />
					            </FormItem>
					          </Col>
					        </Row>
					        </div>
					       <div class="l ml10">
					        	 <div class="demo-upload-list" v-for="(item,index) in uploadList" style="width: 150px; height: 150px;">
						        <template v-if="item.status === 'finished'" >
						            <img :src="item.url">
						            <div class="demo-upload-list-cover">
						                <Icon type="ios-eye-outline" style="margin-top: 65px;" @click.native="handleView(item.url,item.name)"></Icon>
						                <Icon type="ios-trash-outline" style="margin-top: 65px;" @click.native="handleRemove(item,index)"></Icon>
						            </div>
						        </template>
						        <template v-else>
						            <Progress v-if="item.showProgress" :percent="percentage" hide-info></Progress>
						        </template>
						    </div>
						    <Upload
						        ref="upload"
						        :show-upload-list="false"
						        :default-file-list="defaultList"
						        :on-success="handleSuccess"
						        :format="['jpg','jpeg','png']"
						        :max-size="2048"
						        :on-format-error="handleFormatError"
						        :on-exceeded-size="handleMaxSize"
						       :before-upload="handleBeforeUpload"
						        multiple
						        type="drag"
						        :action="url"
						        style="display: inline-block;width:150px;">
						        <div style="width: 150px;height:150px;line-height: 150px;">
						            <Icon type="ios-camera" size="20"></Icon>
						        </div>
						    </Upload>
						    <Modal :title="imgName" v-model="visible">
						        <img :src="imgUrl" v-if="visible" style="width: 100%">
						    </Modal>
					        </div>
				</TabPane>
				<TabPane label="再注册批件" name="6" class="mb10">
					<div class="l" style="width:400px;">
					        <Row>
					          <Col span="20">
					            <FormItem label="发证日期" prop="productTime">
					              	<DatePicker type="date" v-model="formValidate.productTime" placeholder="发证日期" style="width: 300px"></DatePicker>
					            </FormItem>
					          </Col>
					        </Row>
					        <Row>
					          <Col span="20">
					            <FormItem label="有效期至" prop="validEndDate">
					              	<DatePicker type="date" v-model="formValidate.validEndDate" placeholder="有效期至" style="width: 300px"></DatePicker>
					            </FormItem>
					          </Col>
					        </Row>
					        <Row>
					          <Col span="20">
					            <FormItem label="证件编号" prop="licCode">
					              	<Input v-model="formValidate.licCode"  placeholder="证件编号" style="width: 300px" />
					            </FormItem>
					          </Col>
					        </Row>
					        </div>
					       <div class="l ml10">
					        	 <div class="demo-upload-list" v-for="(item,index) in uploadList" style="width: 150px; height: 150px;">
						        <template v-if="item.status === 'finished'" >
						            <img :src="item.url">
						            <div class="demo-upload-list-cover">
						                <Icon type="ios-eye-outline" style="margin-top: 65px;" @click.native="handleView(item.url,item.name)"></Icon>
						                <Icon type="ios-trash-outline" style="margin-top: 65px;" @click.native="handleRemove(item,index)"></Icon>
						            </div>
						        </template>
						        <template v-else>
						            <Progress v-if="item.showProgress" :percent="percentage" hide-info></Progress>
						        </template>
						    </div>
						    <Upload
						        ref="upload"
						        :show-upload-list="false"
						        :default-file-list="defaultList"
						        :on-success="handleSuccess"
						        :format="['jpg','jpeg','png']"
						        :max-size="2048"
						        :on-format-error="handleFormatError"
						        :on-exceeded-size="handleMaxSize"
						       :before-upload="handleBeforeUpload"
						        multiple
						        type="drag"
						        :action="url"
						        style="display: inline-block;width:150px;">
						        <div style="width: 150px;height:150px;line-height: 150px;">
						            <Icon type="ios-camera" size="20"></Icon>
						        </div>
						    </Upload>
						    <Modal :title="imgName" v-model="visible">
						        <img :src="imgUrl" v-if="visible" style="width: 100%">
						    </Modal>
					        </div>
				</TabPane> 
			</Tabs>  
		      </Form>
		      <footer style="text-align: right;">
		      	<Button @click="modalReset()" style="margin-left: 8px">取消</Button>
		            <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
		          </footer>
		    </Modal>
		    <Modal v-model="imgBig" footer-hide> 
		    		<p slot="header" style="text-align:center">图片预览</p>
				    <Carousel loop>
				        <CarouselItem v-for="(index,imgs) in uploadImgList" :key="index">
				           	<img :src="imgs.url" style="width: 100%;">
				        </CarouselItem>
				    </Carousel> 
		   </Modal>
	</div>
</template>
<script>
import {route}  from '@/api/apiRoute';
export default {
	data () { 
	            return {
                	url:`${route}/public/file/upload`,
	            	defaultList: [
		// {
		// 	'name': 'a42bdcc1178e62b4694c830f028db5c0',
		// 	'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
		// },
		// {
		// 	'name': 'bc7521e033abdd1e92222d733590f104',
		// 	'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
		// }
		],
		percentage:100,
		imgName: '',
		imgUrl: '',
		visible: false,
		nameShow:'',
		uploadList:[],
		uploadImgList:[],
	             factorList: [
			{value: "", label: "全部"},
			{value: "1", label: "药品注册证"},
			{value: "2", label: "药品质检报告"},
			{value: "3", label: "药品说明书"},
			{value: "4", label: "进口药品通关单"},
			{value: "5", label: "再注册受理通知书"},
			{value: "6", label: "再注册批件"}
		],
		periodList:[
			{value: "", label: "全部"},
			{value: "30", label: "30天"},
			{value: "60", label: "60天"},
			{value: "90", label: "90天"},
			{value: "180", label: "180天"}
		],
	            	spinShow:false,
	            	spinShow1:false,
	            	columns1: [
	                    {
	                        type: 'index',
	                        title: '序号',
	                        align: 'center'
	                    },
	                     {
	                        title: '供应商',
	                        key: 'ctmaSupplierName',
	                        align: 'center',
	                    }, 
	                    {
	                        title: '药品名称',
	                        key: 'goodsName',
	                        align: 'center' 
	                    },
	                    {
	                        title: '生产厂家',
	                        key: 'producerName',
	                        align: 'center' 
	                    },
	                    {
	                        title: '批准文号',
	                        key: 'registKey',
	                        align: 'center' 
	                    },
	                    {
	                        title: '资质类型',
	                        // key: 'type',
	                        align: 'center',
	                        render: (h, params) => {
	                        	if(this.$store.state.currentName == "西药库"){
	                        	  return h('div', [
	                                h('div', {
	                                    props: {
	                                        // licType: params.row.licType,
	                                        // size: 'small'
	                                    },
	                                    style: {color:'blue',cursor:'pointer'},
	                                    on: {
	                                        click: () => {
	                                        	this.modal = true;
	                                        	// this.handleTab(params.row.licType);
	                                        	this.nameShow = params.row.licType.toString()
	                                        	this.queryDrugByListClick();
	                                        	this.formValidate.pictcontents = [];
	                                        	this.uploadList = [];
	                                        	this.formValidate.id = params.row.id;
	                                        	this.formValidate.supplierCode = params.row.supplierCode.toString();
	                                        	if(params.row.licCode){
	                                        		this.formValidate.licCode = params.row.licCode.toString();
	                                        	}
	                                            	this.formValidate.goodsCode = params.row.goodsCode.toString();
					this.formValidate.goodsName = params.row.goodsName.toString();
					if(params.row.inStoreCode){
						this.formValidate.inStoreCode = params.row.inStoreCode.toString();
					}
					if(params.row.deliveryCode){
						this.formValidate.deliveryCode = params.row.deliveryCode.toString();
					}
					this.formValidate.producerName = params.row.producerName;
					if(params.row.lot){
						this.formValidate.lot = params.row.lot.toString();
					}
					if(params.row.productTime){
						this.formValidate.productTime = this.$moment(params.row.productTime).format('YYYY-MM-DD');
					}
					if(params.row.validEndDate){
						this.formValidate.validEndDate = this.$moment(params.row.validEndDate).format('YYYY-MM-DD');
					}
					if(params.row.inStoreDate){
						this.formValidate.inStoreDate = this.$moment(params.row.inStoreDate).format('YYYY-MM-DD');
					}
					this.formValidate.registKey = params.row.registKey;
					if(params.row.pictcontents){
						for (let i = 0; i < params.row.pictcontents.length; i++) {
							if(params.row.pictcontents[i].pictcontent){
								this.formValidate.pictcontents.push(params.row.pictcontents[i].pictcontent); 
							}
							console.log("222",JSON.parse(params.row.pictcontents[i].pictcontent));
							let picimg = JSON.parse(params.row.pictcontents[i].pictcontent);
							let jsonStr='';
							console.log("dd",picimg.original.path);
							let path=picimg.original.path+picimg.original.name;
							jsonStr+=''+path+',';
							// jsonStr = jsonStr.substring(0,jsonStr.length-1); 
							console.log(jsonStr);
							let item = {};
							item.url = jsonStr;
							item.showProgress = true;
							item.percentage = 100;
							item.showProgress = true;
							item.status = 'finished';
							this.uploadList.push(item);
							console.log("ff",this.uploadList);  
							// console.log("ff",this.getBase64(jsonStr));  
						}
					}
	                                        }
	                                    }
	                                },params.row.type)
	                            ]);
	                        	}else{
	                        		return h('div',params.row.type);
	                        	}
	                        }
	                    },
	                    {
	                        title: '发证日期',
	                        key: 'productTime',
	                        align: 'center', 
	                          // 过滤器
	  		// render: (h, params) => {
				// return h("div",this.$options.filters.getDateStartEnd(params.row.productTime))
			// }
			// 处理时间
	                         render: (h, params) => {
				return h("div",this.$moment(params.row.productTime).format('YYYY-MM-DD'))
			} 
	                    },
	                    {
	                        title: '有效期至',
	                        key: 'validEndDate',
	                        align: 'center',
	                        render: (h, params) => {
				return h("div",this.$moment(params.row.validEndDate).format('YYYY-MM-DD'))
			} 
	                    },
	                    {
	                        title: '预览',
	                        key: '暂无图片',
	                        align: 'center',
	                        render: (h, params) => {
	                        	  if(params.row.pictcontents){
	                        	  	return h('div', [
		                                h('Button', {
		                                    props: {
		                                        type: 'primary',
		                                        size: 'small'
		                                    },
		                                    on: {
		                                        click: () => {
						this.imgBig = true;
						this.uploadImgList = [];
						for (let i = 0; i < params.row.pictcontents.length; i++) {  
							let picimg = JSON.parse(params.row.pictcontents[i].pictcontent);
							let jsonStr='';
							console.log("dd",picimg.original.path);
							let path=picimg.original.path+picimg.original.name;
							jsonStr+=''+path+',';
							// jsonStr = jsonStr.substring(0,jsonStr.length-1); 
							console.log(jsonStr);
							let item = {};
							item.url = jsonStr; 
							this.uploadImgList.push(item);
							console.log("ii",this.uploadImgList);  
							// console.log("ff",this.getBase64(jsonStr));  
						}
		                                        }
		                                    }
		                                }, '图片')
		                            ]);
	                        	  }else{
	                        	  	return h('div','暂无图片');
	                        	  }
	                            
	                        }
	                    }
	                ],
	             columns: [
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
	                        title: '供应商',
	                        key: 'ctmaSupplierName',
	                        align: 'center',
	                    }, 
	                    {
	                        title: '药品名称',
	                        key: 'goodsName',
	                        align: 'center' 
	                    },
	                    {
	                        title: '生产厂家',
	                        key: 'producerName',
	                        align: 'center' 
	                    },
	                    {
	                        title: '批准文号',
	                        key: 'registKey',
	                        align: 'center' 
	                    },
	                    {
	                        title: '资质类型',
	                        // key: 'type',
	                        align: 'center',
	                        render: (h, params) => {
	                        	if(this.$store.state.currentName == "西药库"){
	                        	  return h('div', [
	                                h('div', {
	                                    props: {
	                                        // licType: params.row.licType,
	                                        // size: 'small'
	                                    },
	                                    style: {color:'blue',cursor:'pointer'},
	                                    on: {
	                                        click: () => {
	                                        	this.modal = true;
	                                        	// this.handleTab(params.row.licType);
	                                        	this.nameShow = params.row.licType.toString()
	                                        	this.queryDrugByListClick();
	                                        	this.formValidate.pictcontents = [];
	                                        	this.uploadList = [];
	                                        	this.formValidate.id = params.row.id;
	                                        	this.formValidate.supplierCode = params.row.supplierCode.toString();
	                                        	if(params.row.licCode){
	                                        		this.formValidate.licCode = params.row.licCode.toString();
	                                        	}
	                                            	this.formValidate.goodsCode = params.row.goodsCode.toString();
					this.formValidate.goodsName = params.row.goodsName.toString();
					if(params.row.inStoreCode){
						this.formValidate.inStoreCode = params.row.inStoreCode.toString();
					}
					if(params.row.deliveryCode){
						this.formValidate.deliveryCode = params.row.deliveryCode.toString();
					}
					this.formValidate.producerName = params.row.producerName;
					if(params.row.lot){
						this.formValidate.lot = params.row.lot.toString();
					}
					if(params.row.productTime){
						this.formValidate.productTime = this.$moment(params.row.productTime).format('YYYY-MM-DD');
					}
					if(params.row.validEndDate){
						this.formValidate.validEndDate = this.$moment(params.row.validEndDate).format('YYYY-MM-DD');
					}
					if(params.row.inStoreDate){
						this.formValidate.inStoreDate = this.$moment(params.row.inStoreDate).format('YYYY-MM-DD');
					}
					this.formValidate.registKey = params.row.registKey;
					if(params.row.pictcontents){
						for (let i = 0; i < params.row.pictcontents.length; i++) {
							if(params.row.pictcontents[i].pictcontent){
								this.formValidate.pictcontents.push(params.row.pictcontents[i].pictcontent); 
							}
							console.log("222",JSON.parse(params.row.pictcontents[i].pictcontent));
							let picimg = JSON.parse(params.row.pictcontents[i].pictcontent);
							let jsonStr='';
							console.log("dd",picimg.original.path);
							let path=picimg.original.path+picimg.original.name;
							jsonStr+=''+path+',';
							// jsonStr = jsonStr.substring(0,jsonStr.length-1); 
							console.log(jsonStr);
							let item = {};
							item.url = jsonStr;
							item.showProgress = true;
							item.percentage = 100;
							item.showProgress = true;
							item.status = 'finished';
							this.uploadList.push(item);
							console.log("ff",this.uploadList);  
							// console.log("ff",this.getBase64(jsonStr));  
						}
					}
	                                        }
	                                    }
	                                },params.row.type)
	                            ]);
	                        	}else{
	                        		return h('div',params.row.type);
	                        	}
	                        }
	                    },
	                    {
	                        title: '发证日期',
	                        key: 'productTime',
	                        align: 'center', 
	                          // 过滤器
	  		// render: (h, params) => {
				// return h("div",this.$options.filters.getDateStartEnd(params.row.productTime))
			// }
			// 处理时间
	                         render: (h, params) => {
				return h("div",this.$moment(params.row.productTime).format('YYYY-MM-DD'))
			} 
	                    },
	                    {
	                        title: '有效期至',
	                        key: 'validEndDate',
	                        align: 'center',
	                        render: (h, params) => {
				return h("div",this.$moment(params.row.validEndDate).format('YYYY-MM-DD'))
			} 
	                    },
	                    {
	                        title: '预览',
	                        key: '暂无图片',
	                        align: 'center',
	                        render: (h, params) => {
	                        	  if(params.row.pictcontents){
	                        	  	return h('div', [
		                                h('Button', {
		                                    props: {
		                                        type: 'primary',
		                                        size: 'small'
		                                    },
		                                    on: {
		                                        click: () => {
						this.imgBig = true;
						this.uploadImgList = [];
						for (let i = 0; i < params.row.pictcontents.length; i++) {  
							let picimg = JSON.parse(params.row.pictcontents[i].pictcontent);
							let jsonStr='';
							console.log("dd",picimg.original.path);
							let path=picimg.original.path+picimg.original.name;
							jsonStr+=''+path+',';
							// jsonStr = jsonStr.substring(0,jsonStr.length-1); 
							console.log(jsonStr);
							let item = {};
							item.url = jsonStr; 
							this.uploadImgList.push(item);
							console.log("ii",this.uploadImgList);  
							// console.log("ff",this.getBase64(jsonStr));  
						}
		                                        }
		                                    }
		                                }, '图片')
		                            ]);
	                        	  }else{
	                        	  	return h('div','暂无图片');
	                        	  }
	                            
	                        }
	                    }
	                ],
	                supplierList:[],
	                goodsList:[],
	                typeList:[],
	                DeptList:[],
	                stateList:[],
	                depotlicinfoList:[],
	                ids:[],
	                goodsName1:'',
	                goodsList1:[], 
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    licType:'',
			    expiryDate:'',
			    supplierCode:'',
			    producerName:'',
			    goodsName:'',
			    goodsCode:'',
			    flag:'',
		    },
		    modal:false,
		    imgBig:false,
		    loading:false,
		    formValidate:{
		    	id:'',
		    	// 药品名称
		    	goodsName:'',
		    	// 供应商编码
		    	supplierCode:'',
		    	// 类型
		    	licType:'',
		    	// 生产厂商
		    	producerName:'',
		    	// 注册证
		    	registKey:'',
		    	// 商品编码
		    	goodsCode:'',

		    	// 发证日期
		    	productTime:'',
		    	// 有效期至
		    	validEndDate:'',
		    	// 证件编号
		    	licCode:'',

		    	//批号
		    	lot:'',
		    	// 入库号
		    	inStoreCode:'',
		    	// 入库日期
		    	// inStoreDate:'',
		    	// 提运单号
		    	deliveryCode:'',
		    	// 图片集合
		    	pictcontents:[],
		    },
		    ruleValidate:{},
		  //   ruleValidate:{
		  //           supplierCode: [
		  //             { required: true, message: '请选择供应商名称'}
		  //           ],
		  //           goodsName: [
		  //             { required: true, message: '请选择药品名称'}
		  //           ],
		  //           supplierCode: [
		  //             { required: true, message: '请选择供应商名称'}
		  //           ],
		  //           goodsName: [
		  //             { required: true, message: '请选择药品名称'}
		  //           ],
		  //           productTime: [
		  //             { required: true, message: '请选择日期',}
		  //           ],
		  //           validEndDate: [
		  //             { required: true, message: '请选择日期'}
		  //           ],
		  //           licCode: [
		  //             { required: true, message: '请填写证件编号',trigger: 'blur'}
		  //           ],
		  //           lot: [
		  //             { required: true, message: '批号',trigger: 'blur'}
		  //           ],
		  //           inStoreDate: [
		  //             { required: true, message: '请选择日期',}
		  //           ],
		  //           deliveryCode: [
		  //             { required: true, message: '请填写提运单号',trigger: 'blur'}
		  //           ],
		  // },
	            }
	},
	methods:{
		getBase64(imgUrl){
			window.URL = window.URL || window.webkitURL;
			var xhr = new XMLHttpRequest();
			xhr.open("get", imgUrl, true);
			xhr.responseType = "blob";
			xhr.onload = function () {
				if (this.status == 200) {
				  //得到一个blob对象
				  var blob = this.response;
				  let oFileReader = new FileReader();
				  oFileReader.onloadend = function (e) {
				    let base64 = e.target.result;
				    console.log( base64)
				  };
				  oFileReader.readAsDataURL(blob); 
				  let src = window.URL.createObjectURL(blob);
				  console.log(src)
				}
			}
			xhr.send();
		},
		handleSelectionChange(selection) {
			for (var i = 0; i < selection.length; i++) {
				this.ids.push(selection[i].id);
			}
		    // this.multipleSelection = val;
		    console.log(selection);
		    },
		 handleView (url,name) { 
			this.imgUrl = url;
			this.imgName = name;
			this.visible = true;
		},
		handleRemove (file,index) {
			console.log(file);
			this.uploadList.splice(this.uploadList.indexOf(file), 1);
			this.formValidate.pictcontents.splice(index,1);
			console.log(this.formValidate.pictcontents);
		},
		// handleProgress (event, file, fileList) {
		// 	// 调用监听 上传进度 的事件
		// 	this.uploadList = fileList; 
		// 	event.target.onprogress = (event) => {
		// 	    let uploadPercent = parseFloat(((event.loaded / event.total) * 100).toFixed(2));	// 保留两位小数，具体根据自己需求做更改
		// 		    // 手动设置显示上传进度条 以及上传百分比
		// 		    file.showProgress = true;
		// 		    file.percentage = uploadPercent;
		// 	}
		// 	// this.handleBeforeUpload(file);
		// 	// console.log(this.uploadList);
		// },
		handleSuccess (res,file) {
			console.log(res.data);
			if(res.data){
				this.formValidate.pictcontents.push(res.data);
				this.spinShow = false;
			}
			console.log("11",this.formValidate.pictcontents);
		},
		handleFormatError (file) {
			this.$Notice.warning({
				title: 'The file format is incorrect',
				desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
			});
		},
		handleMaxSize (file) {
			this.$Notice.warning({
				title: 'Exceeding file size limit',
				desc: 'File  ' + file.name + ' is too large, no more than 2M.'
			});
		},
		handleBeforeUpload (file) {
			const _this = this;
			this.spinShow = true;
			if (_this.uploadList.length > 2) {
				 this.$Message.error("只能上传3张图片！");
				 return;
			} 
			console.log(file);
			let reader = new FileReader();
			reader.readAsDataURL(file); 
			reader.onloadend = function (e){
				file.url = reader.result;
				file.showProgress = true;
				file.percentage = 100;
				file.showProgress = true;
				file.status = 'finished';
				_this.uploadList.push(file)//将_base64赋值给图片的src，实现图片预览
			}
			// console.log("1",_this.uploadList);
		    },
		// handleBeforeUpload () {
		// 	const check = this.uploadList.length < 5;
		// 	if (!check) {
		// 		this.$Notice.warning({
		// 			title: 'Up to five pictures can be uploaded.'
		// 		});
		// 	}
		// 	return check;
		// },
		add(){
			this.modal=true;
			this.handleTab(1);
		},
		handleTab(name){
			this.formValidate.licType = name;
			this.nameShow = name.toString();
			this.uploadList = [];
			this.formValidate.licCode = '';
			this.formValidate.productTime = '';
			this.formValidate.validEndDate = '';
			this.formValidate.lot = '';
			this.formValidate.inStoreCode = '';
			this.formValidate.inStoreDate = '';
			this.formValidate.deliveryCode = '';
			this.formValidate.pictcontents = [];
			this.ruleValidate = {};
			if(name == 1 || name == 5 || name == 6){
				this.ruleValidate = {
				  supplierCode: [
			              { required: true, message: '请选择供应商名称'}
			            ],
			            goodsName: [
			              { required: true, message: '请选择药品名称'}
			            ], 
			            productTime: [
			              { required: true, message: '请选择发证日期',}
			            ],
			            validEndDate: [
			              { required: true, message: '请选择有效期至'}
			            ],
			            licCode: [
			              { required: true, message: '请填写证件编号'}
			            ],
			  }
			}else if(name == 2){
				this.ruleValidate = {
					supplierCode: [
				              { required: true, message: '请选择供应商名称'}
				            ],
				            goodsName: [
				              { required: true, message: '请选择药品名称'}
				            ],
				            productTime: [
				              { required: true, message: '请选择生产日期',}
				            ],
				            validEndDate: [
				              { required: true, message: '请选择有效期至'}
				            ],
				            inStoreDate: [
				              { required: true, message: '请选择入库日期',}
				            ],
				  }
			  }else if(name == 3){ 
				this.ruleValidate = {
					supplierCode: [
				              { required: true, message: '请选择供应商名称'}
				            ],
				            goodsName: [
				              { required: true, message: '请选择药品名称'}
				            ],
				            productTime: [
				              { required: true, message: '请选择生产日期',}
				            ],
				            validEndDate: [
				              { required: true, message: '请选择有效期至'}
				            ],
				  }
			  }else{ 
				this.ruleValidate = {
					supplierCode: [
				              { required: true, message: '请选择供应商名称'}
				            ],
				            goodsName: [
				              { required: true, message: '请选择药品名称'}
				            ],
				            lot: [
				              { required: true, message: '请填写批号'}
				            ], 
				            deliveryCode: [
				              { required: true, message: '请填写提运单号'}
				            ],
				  }
			  }
			  if(this.formValidate.id){
			  	this.page.pageSize = 1;
				  this.page.flag = 'changeTab';
				  this.page.licType = name;
				  this.page.goodsCode = this.formValidate.goodsCode;
				  this.depotlicinfoListIdClick(true);
			  }
		},
		async depotlicinfoListIdClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.spinShow = true;
			let datalist = await this.$api.factorSearch.depotdruglicinfoList(this.page);
			if(datalist.data.list.length > 0 || datalist.data.list){
				this.spinShow = false;
			}
			this.queryDrugByListClick();
			if(datalist.data.list[0]){
	                                    	this.formValidate.supplierCode = datalist.data.list[0].supplierCode.toString();
	                                    	if(datalist.data.list[0].licCode){
	                                    		this.formValidate.licCode = datalist.data.list[0].licCode.toString();
	                                    	}
	                                       this.formValidate.goodsCode = datalist.data.list[0].goodsCode.toString();
				this.formValidate.goodsName = datalist.data.list[0].goodsName.toString();
				if(datalist.data.list[0].inStoreCode){
					this.formValidate.inStoreCode = datalist.data.list[0].inStoreCode.toString();
				}
				if(datalist.data.list[0].deliveryCode){
					this.formValidate.deliveryCode = datalist.data.list[0].deliveryCode.toString();
				}
				this.formValidate.producerName = datalist.data.list[0].producerName;
				if(datalist.data.list[0].lot){
					this.formValidate.lot = datalist.data.list[0].lot.toString();
				}
				if(datalist.data.list[0].productTime){
					this.formValidate.productTime = this.$moment(datalist.data.list[0].productTime).format('YYYY-MM-DD');
				}
				if(datalist.data.list[0].validEndDate){
					this.formValidate.validEndDate = this.$moment(datalist.data.list[0].validEndDate).format('YYYY-MM-DD');
				}
				if(datalist.data.list[0].inStoreDate){
					this.formValidate.inStoreDate = this.$moment(datalist.data.list[0].inStoreDate).format('YYYY-MM-DD');
				}
				this.formValidate.registKey = datalist.data.list[0].registKey;
				if(datalist.data.list[0].pictcontents){
					for (let i = 0; i < datalist.data.list[0].pictcontents.length; i++) {
						if(datalist.data.list[0].pictcontents[i].pictcontent){
							this.formValidate.pictcontents.push(datalist.data.list[0].pictcontents[i].pictcontent); 
						}
						console.log("222",JSON.parse(datalist.data.list[0].pictcontents[i].pictcontent));
						let picimg = JSON.parse(datalist.data.list[0].pictcontents[i].pictcontent);
						let jsonStr='';
						console.log("dd",picimg.original.path);
						let path=picimg.original.path+picimg.original.name;
						jsonStr+=''+path+',';
						// jsonStr = jsonStr.substring(0,jsonStr.length-1); 
						console.log(jsonStr);
						let item = {};
						item.url = jsonStr;
						item.showProgress = true;
						item.percentage = 100;
						item.showProgress = true;
						item.status = 'finished';
						this.uploadList.push(item);
						console.log("ff",this.uploadList);  
						// console.log("ff",this.getBase64(jsonStr));  
					}
				}
			}
		},
		modalReset(){
			this.modal=false;
			this.uploadList = [];
			this.page.licType = '';
			this.formValidate.licCode = '';
			this.formValidate.productTime = '';
			this.formValidate.supplierCode = '';
			this.formValidate.validEndDate = '';
			this.formValidate.lot = '';
			this.formValidate.inStoreCode = '';
			this.formValidate.inStoreDate = '';
			this.formValidate.deliveryCode = '';
			this.formValidate.pictcontents = [];
			this.ruleValidate = {};
		},
		// 列表
		async depotlicinfoListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			if(!this.goodsName1){
				this.page.goodsName = '';
			}
			this.spinShow1 = true;
			let datalist = await this.$api.factorSearch.depotdruglicinfoList(this.page);
			if(datalist.data.list.length > 0 || datalist.data.list){
				this.spinShow1 = false;
			}
			this.depotlicinfoList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
		},
		handleSubmit(name){
			this.$refs[name].validate((valid) => {
				console.log(valid);
				if (valid) { 
					this.saveLicListClick();
				}else{
					this.$Message.error('请输入必填信息!');
					return;
				}
			})
		},
		// 图片保存
		async saveLicListClick(){
			this.page.flag = '';
			this.page.goodsCode = '';
			this.formValidate.productTime = this.$options.filters.getDateStartEnd(this.formValidate.productTime);
			this.formValidate.validEndDate = this.$options.filters.getDateStartEnd(this.formValidate.validEndDate);
			this.formValidate.inStoreDate = this.$options.filters.getDateStartEnd(this.formValidate.inStoreDate);
			console.log(this.formValidate);
			this.spinShow = true;
			let datalist = await this.$api.factorSearch.saveDrugLicList(this.formValidate);
			if(datalist.data > 0){
				this.spinShow = false;
				this.$Message.success("保存成功！");
				this.modal=false; 
				this.uploadList = [];
				this.page.licType = '';
				this.formValidate.licCode = '';
				this.formValidate.productTime = '';
				this.formValidate.supplierCode = '';
				this.formValidate.validEndDate = '';
				this.formValidate.lot = '';
				this.formValidate.inStoreCode = '';
				this.formValidate.inStoreDate = '';
				this.formValidate.deliveryCode = '';
				this.formValidate.pictcontents = [];
				this.ruleValidate = {};
				this.page.pageSize = 10;
				this.page.flag = '';
				this.page.licType = '';
				this.page.goodsCode = '';
				this.formValidate.id = '';
				this.depotlicinfoListClick(true);
			}else{
				this.spinShow = false;
			}
		},
		// 删除供应商
		async batchDeleteListClick(){
			let datalist = await this.$api.factorSearch.batchDeleteLicList({'ids':this.ids});
			if(datalist.code == 200){
				this.ids =[];
				this.$Message.success("删除成功！");
				this.depotlicinfoListClick(true);
				this.spinShow = false;
			} 
		},
		// 供应商
		async supplierAllListClick(){
			let datalist = await this.$api.publics.supplierAllList();
			this.supplierList=datalist.data;
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
		// 生产厂家、批准文号
		goodsClick(name){
			for (let i = 0; i < this.goodsList.length; i++) {
				 if(name == this.goodsList[i].ctmmParam){
					this.formValidate.producerName = this.goodsList[i].ctmmManufacturerName;
					this.formValidate.registKey = this.goodsList[i].registKey;
					this.formValidate.goodsCode = this.goodsList[i].bigDrugCode;
				}
			}
		},
		// 药品
		async queryDrugByListClick1(query){
			let item = {
				paramName:query,
				queryType:3,
			}
			this.loading = true;
			let datalist = await this.$api.publics.queryDrugByList(item);
			this.loading = false;
			this.goodsList1=datalist.data;
		},
		// 药品检索
		goodsClick1(name){
			for (let i = 0; i < this.goodsList1.length; i++) {
				 if(name == this.goodsList1[i].ctmmParam){
					this.page.goodsName = this.goodsList1[i].bigDrugCode;
				}
			}
		},	
	}, 
	// mounted(){
	// 	console.log(this.$refs.upload);
	// 	this.uploadList = this.$refs.upload.fileList;
	// 	console.log(this.uploadList);
	// 	// uploadList(){
	// 	// 	// console.log("11",this.$refs.upload.fileList);
	// 	// 	return this.$refs.upload ? this.$refs.upload.fileList : [];
	// 	// }
	// },
	created(){
		// console.log(this.$store.state.currentSelect);
		// 供应商
		this.supplierAllListClick();
		// 列表
		this.depotlicinfoListClick(false);
	}
}
</script>
<style scoped>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
      .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    .ivu-tabs {
    	overflow: inherit !important;
}
</style>
