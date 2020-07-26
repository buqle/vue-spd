/**
 * @author QER
 * @date 2019/11/20
 * @Description: 部门管理-编辑
*/
<template>
  <div class="container container-warp">
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">基本信息</p>
      <p slot="extra" class="btn-style">
        <Button type="default" icon="md-checkmark" @click.native="handleSubmit('formValidate')">保存</Button>
      </p>
      <Row :gutter="20">
        <Col span="6">
          <span>类型：</span>
          <span>{{deptEdit.deptLabel||''}}</span>
        </Col>
        <Col span="6">
          <span>部门名称：</span>
          <span>{{deptEdit.deptName||''}}</span>
        </Col>
        <Col span="6">
          <span>科室名称：</span>
          <span>{{deptEdit.hisDeptName||''}}</span>
        </Col>
        <Col span="12">
          <span>内部编码：</span>
          <span>{{deptEdit.id||''}}</span>
        </Col>
        <Col span="6">
          <span>医院科室代码：</span>
          <span>{{deptEdit.hisDeptCode||''}}</span>
        </Col>
        <Col span="10" v-if="deptEdit.deptType!=6">
          <span>地址：</span>
          <span>
            <Input v-model="deptEdit.deptLocation" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
          </span>
        </Col>
        <Col span="10" v-if="deptEdit.dicts.length&&deptEdit.dicts.length>0">
          <span>货位设置：</span>
          <CheckboxGroup v-model="deptEdit.storeType">
            <Checkbox :label="item.value" v-for="(item,index) in deptEdit.dicts" :key="index">{{item.label}}</Checkbox>
          </CheckboxGroup>
        </Col>
      </Row>
    </Card>

  </div>
</template>
<script>
  import {mapState,mapActions} from 'vuex';
  export default {
    data () {
      return {
        deptEdit:{dicts:[]},
        searchArr:{
          url:this.$api.systemApi.GETETAIL,
          method:'get',
          id:this.$route.query.id,
          infoName:'deptEdit'
        },
        storeList:[],
        formValidate: {
          deptType:'',
          openDeptName: '',
          rescuecarCode:'',
          deptName:'',
          storeType:[],
          positionName: '',
          deptLocation:'',
          openDeptCode:'',
          parentId:'',
          baseDeptCode:''
        },
        ruleValidate: {
          deptType: [
            { required: true, message: '请选择部门性质',}
          ],
          openDeptName: [
            { required: true, message: '请选择科室名称'}
          ],
          rescuecarCode: [
            { required: true, message: '请输入编码'}
          ],
          deptName: [
            { required: true, message: '请输入部门名称'}
          ],
          storeType: [
            { required: true, message: '请选择货位设置'}
          ],
          positionName: [
            { required: true, message: '请设置货位'}
          ]
        },
      }
    },
    computed:{
      ...mapState(['spinsShow','totalPage',])
    },
    methods:{
      ...mapActions(['record_search_head']),

    },
    async created(){
      await  this.record_search_head(this.searchArr);
      this.deptEdit=this.$store.state[this.searchArr.infoName].data;
    }

  }
</script>

<style scoped>
.ivu-input-wrapper{width: 80%;}
</style>
