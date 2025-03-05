<template>
  <div class="menu-wrapper">
    <!-- 遍历 routes -->
    <template v-for="item in routes" :key="item?.name || item?.path">
      <template v-if="item && !item.hidden && item.children">
        <router-link
          v-if="
            hasOneShowingChildren(item.children) &&
            item.children[0] &&
            !item.children[0].children &&
            !item.alwaysShow
          "
          :to="`${item.path}/${item.children[0].path}`"
          :key="item.children[0]?.name"
        >
          <el-menu-item
            :index="`${item.path}/${item.children[0].path}`"
            :class="{ 'submenu-title-noDropdown': !isNest }"
          >
            <svg-icon
              v-if="item.children[0]?.meta?.icon"
              :icon-class="item.children[0].meta.icon"
            ></svg-icon>
            <span v-if="item.children[0]?.meta?.title">{{
              item.children[0].meta.title
            }}</span>
          </el-menu-item>
        </router-link>

        <el-submenu v-else :index="item?.name || item?.path" :key="item?.name">
          <template #title>
            <svg-icon
              v-if="item?.meta?.icon"
              :icon-class="item.meta.icon"
            ></svg-icon>
            <span v-if="item?.meta?.title">{{ item.meta.title }}</span>
          </template>

          <template v-for="child in item.children" :key="child?.path">
            <sidebar-item
              v-if="child?.children?.length > 0"
              :routes="[child]"
              class="nest-menu"
              :is-nest="true"
            ></sidebar-item>
            <a
              v-else-if="child?.path?.startsWith('http')"
              :href="child.path"
              target="_blank"
            >
              <el-menu-item :index="`${item.path}/${child.path}`">
                <svg-icon
                  v-if="child?.meta?.icon"
                  :icon-class="child.meta.icon"
                ></svg-icon>
                <span v-if="child?.meta?.title">{{ child.meta.title }}</span>
              </el-menu-item>
            </a>
            <router-link v-else :to="`${item.path}/${child.path}`">
              <el-menu-item :index="`${item.path}/${child.path}`">
                <svg-icon
                  v-if="child?.meta?.icon"
                  :icon-class="child.meta.icon"
                ></svg-icon>
                <span v-if="child?.meta?.title">{{ child.meta.title }}</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "SidebarItem",
  props: {
    routes: {
      type: Array,
      default: () => [],
    },
    isNest: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    hasOneShowingChildren(children) {
      if (!children) return false;
      const showingChildren = children.filter((item) => item && !item.hidden);
      return showingChildren.length === 1;
    },
  },
};
</script>
