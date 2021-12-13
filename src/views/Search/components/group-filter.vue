<template>
  <div class="group-filter" v-if="filterList && filterList.length > 0">
    <template v-for="(filter, filterIndex) in filterList">
      <div
        class="filter-item"
        v-if="filter.items && filter.items.length > 0"
        :key="filterIndex"
      >
        <div class="filter-item_title">
          <span>{{ filter.title }}</span>
        </div>
        <div class="filter-item_options">
          <div class="filter-item_option" v-for="(item,itemIndex) in filter.items" :key="item.id + item.name">
            <el-checkbox
              v-model="item.selected"
              @change="onFilterChange(filterIndex, itemIndex, $event)"
              >{{ item.name }}</el-checkbox
            >
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "group-filter",
  props: {
    filterList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    onFilterChange(filterIndex, itemIndex, event) {
      this.$emit("onFilterChange", {filterIndex, itemIndex, event});
    },
  },
};
</script>

<style lang='scss' scoped>
.group-filter {
  .filter-item {
    margin-bottom: 10px;
    .filter-item_title {
      margin-bottom: 10px;
      font-weight: bold;
    }
    .filter-item_options {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .filter-item_option {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>