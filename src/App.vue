<template>
  <div id="app"> 
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous"/>
    <link href="https://fonts.googleapis.com/css?family=Dancing+Script:400,700|Josefin+Sans:300,400,600,700|Nunito:300,400,600,700" rel="stylesheet"/>   
    <cabecera/>
    <router-view/> 
  </div>
</template>

<script>
import cabecera from './components/cabecera.vue'

export default {
  name: 'App',
  components: {
    cabecera
  }
}
</script>

<style lang="scss">
@import "~primevue/resources/primevue.min.css";
@import "~primevue/resources/themes/md-light-deeppurple/theme.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background: rgb(241, 243, 245);
  min-height: 100vh;
}
</style>
