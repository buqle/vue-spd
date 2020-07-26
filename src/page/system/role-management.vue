/**
 * @author QER
 * @date 2019/9/30
 * @Description:角色管理
*/
<template>
    <div>
      <Row  class="flex-button">
        <Col span="2-5">
          <Radius iconHref="icon-tianjiaanniu" iconText="新增角色" iconSize="20"  @upButton="add"></Radius>
        </Col>
      <!--  <Col span="2-5" style="margin: 0 8px;">
          <Radius  iconText="删除"  @upButton="deleteRole" buttonSize="0"></Radius>
        </Col>-->
      </Row>
      <div class="demo-spin-container">
        <Table :columns="columns" :data="roleList" @on-selection-change="selectionChangeRole" ></Table>
        <Spin size="large" fix v-if="spinsShow"></Spin>
      </div>
      <div class="r mt15">
        <Page :total="searchArr[0].dataCount" :page-size="searchArr[0].pageSize"  @on-change="changepage" show-total show-elevator />
      </div>
    </div>
</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions} from 'vuex'
    export default {
      data(){
        return{
          roleList:[],
          spinsShow:false,
          searchArr:[{
            pageNo:1,
            pageSize:10,
            dataCount:0,
            infoName:'roleList',
            url:this.$api.systemApi.GET_MANAGEMENT_ROLE_LIST,
          }
          ],
          columns: [
            {
              type: 'index',
              title: '序号',
              align: 'center'
            },
            {
              title: '角色名称',
              key: 'name',
              align: 'center'
            },
            {
              title: '备注',
              key: 'remarks',
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
                        this.edit({
                          id:params.row.id
                        })
                      }
                    }
                  }, '编辑')
                ]);
              }
            },
          ],
          selectRole:[]
        }
      },
      async created(){
        this.spinsShow=true;
        await this.record_search_head(this.searchArr[0]);
        this.searchArr[0].dataCount =this.$store.state[this.searchArr[0].infoName].data.length
        this.createPage(this.$store.state[this.searchArr[0].infoName].data,this.roleList,'roleList')
        //this.roleList=this.$store.state[this.searchArr[0].infoName].data;
        this.spinsShow=false;
      },
      methods:{
        ...mapActions(['record_search_head']),
        //分页
        changepage(index){
          let _start = ( index - 1 ) * this.searchArr[0].pageSize;
          let _end = index * this.searchArr[0].pageSize;
          this.roleList = this.$store.state.roleList.data.slice(_start,_end);
        },
        createPage(list,historyData,data){
          if(list.length < this.pageSize){
            historyData=list;
          }else{
            historyData =list.slice(0,this.pageSize);
          }
          this[data] = historyData;
        },
        add(){
          this.$skip.goAdd(this.$router, '/sys/role/roleMgt/add')
        },
        edit(query){
          this.$skip.goEdit(
            this.$router,'/sys/role/roleMgt/add',
            query
          )
        },
        //select
        selectionChangeRole(selection){
          this.selectRole=selection
        },
        async deleteRole(){
          if(this.selectRole.length==0){
            this.$Message.error('请选择要删除的数据');
            return
          }
          let roleList = [];
          this.selectRole.map(item=>roleList.push(item.id));
          let menuListSbumit= await this.$api.system.deleteRole({id:roleList});
          if(menuListSbumit.code==200){
            this.$Message.success('删除成功');
            this.record_search_head(this.searchArr[0]);
          }
        }
      }
    }
</script>

<style scoped>
  .flexcont-add{width:20%;justify-content: space-around;}
</style>
