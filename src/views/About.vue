<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
export default {
  name: "About",
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let users = await fetch("http://localhost:3000/users").then((res) =>
        res.json()
      );

      console.log(users);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>