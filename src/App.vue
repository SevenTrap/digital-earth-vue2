<template>
  <div id="app">
    <label>{{wsState}}</label>
    <router-view></router-view>
  </div>
</template>

<script>
import store from "@/store/index";
export default {
  computed: {
    wsState() {
      return store.state.wsState;
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>