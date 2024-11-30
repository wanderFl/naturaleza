<template>
  <div id="app">
    <div id="nav">
    <Navigation />
    </div>
  <router-view/>
</div>
</template>

<script>
import Navigation from '@/components/layout/Navigation'

import seedData from "@/utils/seedData";
seedData();

export default {
  components: {
    Navigation
  }
}
</script>
<style lang="scss">
@import 'bulma';
</style>