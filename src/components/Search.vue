<template>
  <div :style="{width:size,marginLeft:ml+'px'}" class="search-box">
    <AutoComplete
      v-model="value"
      @on-search="handleSearch"
      icon="ios-search"
      placeholder="请输入关键字"
      style="width:340px"
      clearable
      ref="myButton"
    >
      <div v-for="(item,index) in searchData"  :key="index">
        <Option :value="item.ctmmParam" :key="item.bigDrugCode" :id="item.bigDrugCode" >
          <span class="demo-auto-complete-title" @click="selectInfo(item)">{{ item.ctmmParam }}</span>
        </Option>
      </div>
    </AutoComplete>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex';
    export default {
        name: "Search",
      props:{
          size:{
            type:String,
            default:'440px'
          },
          ml:{
            size:{
              type:Number,
              default:0
            }
          }
      },
        data(){
          return{
            searchData:[],
            value:'',
            search:{
              url:this.$api.pharmacyApi.SEARCH_DRUG_LIST,
              paramName: '',
              infoName:'searchData',
              queryType: 3
            },
            selectObj:''
          }
      },
      computed:{
        ...mapState(['modalBack'])
      },
      methods:{
        ...mapActions(['record_search_head']),
        async handleSearch(e){
          this.value=e;
          if(this.value){
            this.search.paramName=this.value;
            await this.record_search_head(this.search);
            this.searchData=this.$store.state[this.search.infoName].data;
          }
        },
        selectInfo (item) {
          this.$emit('upAdd',item.bigDrugCode);
        },

      },
      watch:{
          value(v){
            if(v==''){
              this.$emit('upAdd','');
            }
          }
      }
    }
</script>

<style scoped>
  .ivu-select{width: 100% !important;}
.demo-auto-complete-title{display: block;width: 100%;}
</style>
