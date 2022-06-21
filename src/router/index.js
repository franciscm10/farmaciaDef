import Vue from "vue";
import VueRouter from "vue-router";
import cliente from "../components/cliente.vue";
import iniciarsesion from "../components/iniciarsesion.vue";
import inicio from "../components/inicio.vue";
import medicinas from "../components/medicinas.vue";
import trabajadores from "../components/trabajadores.vue";
import utilidades from "../components/utilidades.vue";

Vue.use(VueRouter)

const routes = [
    { path: "/", name: "/", component: iniciarsesion},
  { path: "/cliente", name: "c-cliente",component: cliente},
  { path: "/iniciarsesion", name: "c-iniciarsesion",component: iniciarsesion},
  { path: "/inicio", name: "c-inicio",component: inicio},
  { path: "/medicinas", name: "c-medicinas",component: medicinas},
  { path: "/trabajadores", name: "c-trabajadores",component: trabajadores},
  { path: "/utilidades", name: "c-utilidades",component: utilidades}
];

const router = new VueRouter({
  mode: "history",
  routes,
});
export default router;