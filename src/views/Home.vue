<template>
  <div class="home">

    <!-- 动态组件渲染容器 -->
    <div class="components-conrtainer"
         v-if="componentConfig.length">

      <!-- 动态组件渲染 -->
      <div class="component-item"
           v-for="(componentName, index) in componentConfig"
           :key="index">

        <!-- 动态组件 -->
        <component class="home-item"
                   :is="componentName"></component>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Home",

  data() {
    return {
      timer: null,
      componentConfig: [],
    };
  },

  async mounted() {
    this.timer = setInterval(() => {
      this.$ws.send("client");
    }, 5000);

    let componentConfig = await fetch("http://localhost:3000/page-config").then(
      (res) => res.json()
    );

    this.componentConfig = componentConfig;
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: "100%";
  height: "100%";
  background: steelblue;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  padding-top: 10px;

  .home-item {
    width: 300px;
    height: 200px;
    margin-bottom: 10px;
  }
}
</style>
