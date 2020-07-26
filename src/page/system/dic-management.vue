/**
 * @author QER
 * @date 2019/9/30
 * @Description: 字典管理
*/
<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>类型</label>
        <Select  placeholder="请选择类型" class="condition-group-ipt" v-model="searchArr[0].type">
          <Option  v-for="(item,index) in typeList" :value="item.type" :key="index">{{item.description}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>描述</label>
        <Input  placeholder="请输入描述" class="condition-group-ipt" v-model="searchArr[0].description"></Input>
      </div>
    </div>
    <div class="condition-row">
      <Button size="large" type="default" icon="ios-search" class="r" @click="record_search(searchArr[0])" >查询</Button>
    </div>
    <Row>
      <Col span="2-5">
        <Radius iconHref="icon-tianjiaanniu" iconText="新建字典" iconSize="20"  @upButton="add"></Radius>
      </Col>
    </Row>
    <div class="demo-spin-container">
      <Table :columns="columns" :data="historyData"></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="dataCount" :page-size="pageSize" show-total show-elevator @on-change="changepage"/>
    </div>

    <Modal v-model="modal" width="400" footer-hide @on-cancel="modalReset">
      <p slot="header" style="color:#f60;text-align:center">
        {{this.modalTit}}
      </p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Row v-if="formValidate.id">
          <Col span="20">
            <FormItem label="编码" prop="id">
              <Input v-model="formValidate.id" placeholder="请输入编码" disabled></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="键值" prop="value">
              <Input v-model="formValidate.value" placeholder="请输入键值"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="标签" prop="label">
              <Input v-model="formValidate.label" placeholder="请输入键值"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="类型" prop="type">
              <Input v-model="formValidate.type" placeholder="请输入类型"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="排序" prop="sort">
              <Input v-model="formValidate.sort" placeholder="请输入类型"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="描述" prop="description">
              <Input v-model="formValidate.description" placeholder="请输入描述"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
          </FormItem>
        </Row>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import {mapState,mapActions} from 'vuex'
  export default {
    data () {
      return {
        dataCount:0,
        // 每页显示多少条
        pageSize:10,
        historyData:[],
        modal:false,
        spinShow:true,
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center'
          },
          {
            title: '键值',
            key: 'value',
            align: 'center'
          },
          {
            title: '标签',
            key: 'label',
            align: 'center'

          },
          {
            title: '类型',
            key: 'type',
            align: 'center'

          },
          {
            title: '排序',
            key: 'sort',
            align: 'center'
          },
          {
            title: '描述',
            key: 'description',
            align: 'center'
          },
          {
            title: '操作',
            key: 'address',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    // size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.add(params.row)
                    }
                  }
                }, '编辑')
              ]);
            }
          },
        ],
        searchArr:[{
          pageNo:1,
          pageSize:10,
          totalPage:0,
          url:this.$api.systemApi.DICTMGT_LIST,
          type:'',
          description:''
        },{
          url:this.$api.systemApi.DICTMGT_TYPELIST,
          type:'',
          infoName:'typeList'
        }
        ],
        formValidate: {
          id:'',
          value: '',
          label:'',
          type:'',
          sort:'',
          description: ''
        },
        ruleValidate: {
          value: [
            { required: true, message: '请输入键值',trigger: 'blur'  }
          ],
          label: [
            { required: true, message: '请输入标签',trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请输入类型',trigger: 'blur' }
          ]
        },
        modalTit:'新增字典',
        typeList:[]
      }
    },
    computed:{
      ...mapState(['searchInfo','spinsShow','searchTab','totalPage'])
    },
    methods:{
      ...mapActions(['record_search','record_search_head']),
      add(record){
        if(record){
          this.formValidate.id=record.id;
          this.formValidate.value=record.value;
          this.formValidate.label=record.label;
          this.formValidate.type=record.type;
          this.formValidate.sort=record.sort;
          this.formValidate.description=record.description;
          this.modalTit='编辑字典'
        }

        this.modal=true;
      },
      //提交
      handleSubmit (name) {
        this.$refs[name].validate((valid,val) => {
          if (valid) {
            this.hadleSuccess()
          } else {
            this.$Message.error('请输入必填项');
          }
        })
      },
      async hadleSuccess(){
        let menuListSbumit= await this.$api.system.dictSave(this.formValidate);
        if(menuListSbumit.code==200){
          this.$Message.success('提交成功');
          this.modal=false;
          this.record_search(this.searchArr[0]);
          this.modalReset()
        }else {
          this.$Message.error(menuListSbumit.msg);
        }
      },
      //取消
      handleReset (name) {
        this.$refs[name].resetFields();
        this.modalReset()
      },
      modalReset(){
        this.modal=false;
        this.modalTit='新增字典';
        this.formValidate={}
      },
      changepage(index){
        var _start = ( index - 1 ) * this.pageSize;
        var _end = index * this.pageSize;
        this.historyData = this.searchTab.slice(_start,_end);
      }
    },
    async created(){
      await  this.record_search(this.searchArr[0]);
      this.dataCount = this.searchTab.length;
      if(this.searchTab.length < this.pageSize){
        this.historyData = this.searchTab;
      }else{
        this.historyData = this.searchTab.slice(0,this.pageSize);
      }
      await  this.record_search_head(this.searchArr[1]);
      this.typeList=this.$store.state[this.searchArr[1].infoName].data;

    }

  }
</script>

<style scoped>

</style>
