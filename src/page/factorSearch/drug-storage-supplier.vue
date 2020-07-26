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
				<label>资质类型</label>
				<Select v-model="page.licType" clearable class="big condition-group-ipt">
				        	<Option v-for="fac in factorList" :value="fac.value" :key="fac.value">{{ fac.label }}</Option>
				</Select>
			</div> 
			<div class="condition-group">
				<label>临效期</label>
				<Select v-model="page.expiryDate" clearable class="big condition-group-ipt">
				        	<Option v-for="per in periodList" :value="per.value" :key="per.value">{{ per.label }}</Option>
				</Select>
			</div> 
		</div> 
	             <div class="condition-row mb15">
	             	<Button type="default" size="large" class="l" v-if="this.$store.state.currentName == '西药库'" @click="add()">上传证照</Button>
	             	<Button type="default" size="large" class="l ml10" v-if="this.$store.state.currentName == '西药库'" @click="batchDeleteListClick()">删除</Button>
	             	<Button type="default" size="large" icon="ios-search" class="r" @click="depotlicinfoListClick(true)">查询</Button>
	             </div>
		<h3 class="f16 green-h3 mb10">列表查询</h3>
		<div class="demo-spin-container">
		             <Table ref="selection" :columns="columns" :data="depotlicinfoList" @on-selection-change="handleSelectionChange"></Table>
		             <Spin size="large" fix v-if="spinShow1"></Spin>
	             </div>
	             <div class="r mt15">
	             	<Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="depotlicinfoListClick(false)" show-total show-elevator />
	             </div>

	             <Modal v-model="modal" width="1200" footer-hide @on-cancel="modalReset">
	             <Spin size="large" fix v-if="spinShow"></Spin>
		      <p slot="header" style="color:#4fa1a4; text-align:center; font-size: 14px;">上传企业资质</p>
		      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" style="height: 350px;">
		      <div class="l" style="width:400px;">
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
		            <FormItem label="资质类型" prop="licType">
		              	<Select v-model="formValidate.licType" clearable style="width: 300px">
				        	<Option v-for="fac in factorList" :value="fac.value" :key="fac.value">{{ fac.label }}</Option>
				</Select>
		            </FormItem>
		          </Col>
		        </Row>
		        <Row>
		          <Col span="20">
		            <FormItem label="发证日期" prop="productTime">
		              	<DatePicker type="date" v-model="formValidate.productTime" format="yyyy-MM-dd" placeholder="发证日期" style="width: 300px"></DatePicker>
		            </FormItem>
		          </Col>
		        </Row>
		        <Row>
		          <Col span="20">
		            <FormItem label="有效期至" prop="validEndDate">
		              	<DatePicker type="date" v-model="formValidate.validEndDate" format="yyyy-MM-dd" placeholder="有效期至" style="width: 300px"></DatePicker>
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
		        <Row>
		          <FormItem>
		            <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
		            <Button @click="modalReset()" style="margin-left: 8px">取消</Button>
		          </FormItem>
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
		      </Form>
		    </Modal>
		    <Modal v-model="imgBig" footer-hide> 
		    		<p slot="header" style="color:#4fa1a4; text-align:center; font-size: 14px;">图片预览</p>
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
		uploadList:[],
		uploadImgList:[],
	             factorList: [
			{value: "", label: "全部"},
			{value: "1", label: "营业执照"},
			{value: "2", label: "药品经营许可证"},
			{value: "3", label: "业务员授权书"},
			{value: "4", label: "开票资料"},
			{value: "5", label: "开户许可证"},
			{value: "6", label: "药品经营质量管理规范认证书"}
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
	                    //  {
	                    //     title: '供应商',
	                    //     key: 'ctmaSupplierName',
	                    //     align: 'center',
	                    // },
	                     {
	                        title: '供应商',
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
	                                        	this.formValidate.pictcontents = [];
	                                        	this.uploadList = [];
	                                        	this.formValidate.supplierCode = params.row.supplierCode.toString();
	                                            	this.formValidate.licCode = params.row.licCode.toString();
					this.formValidate.licType = params.row.licType.toString();
					this.formValidate.productTime = this.$moment(params.row.productTime).format('YYYY-MM-DD');
					this.formValidate.validEndDate = this.$moment(params.row.validEndDate).format('YYYY-MM-DD');
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
	                                },params.row.ctmaSupplierName)
	                            ]);
	                        	}else{
	                        		return h('div',params.row.ctmaSupplierName);
	                        	}
	                        }
	                    },
	                    {
	                        title: '资质类型',
	                        key: 'type',
	                        align: 'center'

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
	                        title: '证照编号',
	                        key: 'licCode',
	                        align: 'center'
	                    },
	                    {
	                        title: '维护日期',
	                        key: 'createDate',
	                        align: 'center'
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
	                typeList:[],
	                DeptList:[],
	                stateList:[],
	                depotlicinfoList:[],
	                ids:[],
	                page:{
			    pageNo:1,
			    pageSize:10,
			    totalPage:0,
			    licType:'',
			    expiryDate:'',
			    supplierCode:'',
		    },
		    modal:false,
		    imgBig:false,
		    formValidate:{
		    	licCode:'',
		    	licType:'',
		    	productTime:'',
		    	supplierCode:'',
		    	validEndDate:'',
		    	pictcontents:[],
		    },
		    ruleValidate:{
		            supplierCode: [
		              { required: true, message: '请选择供应商名称'}
		            ],
		            licType: [
		              { required: true, message: '请选择资质类型'}
		            ],
		            productTime: [
		              { required: true, message: '请选择发证日期',}
		            ],
		            validEndDate: [
		              { required: true, message: '请选择有效期至'}
		            ],
		            licCode: [
		              { required: true, message: '请填写证件编号',trigger: 'blur'}
		            ],
		  },
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
			this.uploadList = [];
			this.formValidate.licCode = '';
			this.formValidate.licType = '';
			this.formValidate.productTime = '';
			this.formValidate.supplierCode = '';
			this.formValidate.validEndDate = '';
			this.formValidate.pictcontents = [];
		},
		modalReset(){
			this.modal=false; 
			this.formValidate.pictcontents = [];
			this.uploadList = [];
		},
		// 列表
		async depotlicinfoListClick(flag){
			if(flag){
				this.page.pageNo = 1;
			}
			this.page.supplierCodeList = [];
			if(this.page.supid){
				this.page.supplierCodeList.push(this.page.supid);
			}
			this.spinShow1 = true;
			let datalist = await this.$api.factorSearch.depotlicinfoList(this.page);
			if(datalist.data.list.length > 0 || datalist.data.list){
				this.spinShow1 = false;
			}
			this.depotlicinfoList=datalist.data.list;
			this.page.totalPage = datalist.data.count;
		},
		handleSubmit(name){
			this.$refs[name].validate((valid) => {
				if (valid) {
					this.saveLicListClick();
				}else{
					this.$Message.error('请输入必填信息!');
				}
			})
		},
		// 图片保存
		async saveLicListClick(){
			this.formValidate.productTime = this.$options.filters.getDateStartEnd(this.formValidate.productTime);
			this.formValidate.validEndDate = this.$options.filters.getDateStartEnd(this.formValidate.validEndDate);
			this.spinShow = true;
			let datalist = await this.$api.factorSearch.saveLicList(this.formValidate);
			if(datalist.data > 0){
				this.spinShow = false;
				this.$Message.success("保存成功！");
				this.modal=false; 
				this.formValidate= {};
				this.uploadList = [];
				this.depotlicinfoListClick(true);
			} 
		},
		// 删除供应商
		async batchDeleteListClick(){
			let datalist = await this.$api.factorSearch.batchDeleteList({'ids':this.ids});
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
</style>
