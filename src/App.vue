<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less" scoped>
  @co:#ddd;
  p{
    background:url(./assets/image/1.png) no-repeat ;
  }
  #app{
    height: 100%;
  }
</style>

