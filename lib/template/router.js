exports.firstLevelRoute = `export default [
  {
    path: "/",
    redirect: "/firstLevel"
  },
  {
    path: "/firstLevel",
    name: "firstLevelName",
    component: () => import("@/views/firstLevel/firstLevelComponentName.index.vue"),
    meta: { requiresAuth: true },
    children: [
    ]
  }
]`
exports.secondLevelRoute = `
      {
        path: "secondLevel",
        name: "firstLevelName-secondLevelName",
        component: () => import("@/views/firstLevel/sub-pages/secondLevel/secondLevelComponentName.index.vue"),
        meta: { requiresAuth: true }
      },`
