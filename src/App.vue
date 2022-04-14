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