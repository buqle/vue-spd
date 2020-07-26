/**
 * @author QER
 * @date 2019/11/28 
 * @Description: 气泡提示
*/
<template>
  <div>
    <Poptip :title="title" :placement="placement" :trigger="trigger">
      <p v-if="content&&content.length>=length">{{content|readMore(length,'...')}}</p>
      <p v-else>{{content}}</p>
    </Poptip>
  </div>
</template>

<script>
    export default {
      //props: ['content','trigger','title','placement','length'],
      props:{
        content:{

        },
        trigger:{
          type:String
        },
        title:{
          type:String
        },
        placement:{
          type:String
        },
        length:{
          type:Number,
          default:12
        }
      },
      filters: {
        readMore(text, length, suffix){
          return text.substring(0, length) + suffix
        }
      },

      }
</script>

<style scoped>

</style>
