<template>
  <header class="co-header p-sticky"> 
    <Menubar :model="itemsNavbar" class="pt-3 pb-1 text-lg">  
      <template #start>
        <router-link to="/inicio">
        <div>
          <img alt="logo" src="../assets/logo.png" height="40" class="p-mr-2" />           
        </div>                   
        </router-link>
      </template>   
    </Menubar>
    
  </header>
</template>
  

<script>
import Menubar from "primevue/menubar";
import {db} from'../db.js';
import firebase from 'firebase/app';
export default {
  name: "cabecera",
  components: {
    Menubar,
  },
  data() {
    return {
      admin: false,
      trabajador: false,
      itemsNavbar: [
        { label: "Mi perfil", icon: "pi pi-fw pi-home", to: "/inicio", visible: "this.trabajador" },
        { label: "Clientes", icon: "pi pi-fw pi-users", to:"/cliente", visible: "" },
        { label: "Trabajadores", icon: "pi pi-fw pi-id-card", to:"/trabajadores",visible: "" },
        { label: "Medicinas", icon: "pi pi-fw pi-shopping-bag", to:"/medicinas" },        
        { label: "Utilidades", icon: "pi pi-fw pi-list", to:"/utilidades", visible: "" },        
        { label: "Inicio sesión", icon: "pi pi-fw pi-user", to:"/iniciarsesion" }
      ],
    };
  },
  methods:{    
    getRol(email){
        db.collection('usuarios').doc(email).get()
        .then((doc) => { 
          if (doc.exists) {
            console.log(doc.data().rol) 
            if(doc.data().rol=='admin'){
              this.admin = true; 
              this.trabajador = true;           
            }else if(doc.data().rol=='trabajador'){
              this.admin = false;
              this.trabajador = true;
            }else{
              this.admin = false;
              this.trabajador = false;
            }  
            this.setNavBar();           
          }else{
            console.log("No such document!");
          } 
                  
        })
        .catch((error) => {
            console.log("Error getting document: ", error);
        });             
      },
    setNavBar(){
      this.itemsNavbar[1].visible = this.trabajador
      this.itemsNavbar[2].visible = this.admin && this.trabajador
      this.itemsNavbar[4].visible = this.trabajador
    }
  },
  mounted(){ 
    let user = firebase.auth().currentUser;
     if(firebase.auth().currentUser){       
       this.getRol(user.email)             
     }
     
  }
}
</script>

<style lang="css" >
.co-header {
  top: 0.02px;
  position: sticky;
  z-index: 9999;
}
.p-menubar .p-menuitem-link:focus {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: inset 0 0 0 0.15rem #f8b3057a !important;
}
.p-menubar .p-menubar-button:focus {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: 0 0 0 0.2rem #f8b3057a !important;
}
.p-menubar,
.p-submenu-list {
  background-color: #fffcf6 !important;
  background-color: #ffffff !important;
}
.p-menubar {
  background-color: #ffffff9c !important;
  font-weight: bold !important;
}
.p-menubar:hover,
.p-menubar:active {
  background-color: #ffffff !important;
}
.p-menubar-root-list {
  margin-left: auto !important;
  margin-right: 3rem !important;
}
.p-menuitem {
  height: 100% !important;
  width: fit-content;
  white-space: nowrap;
}
.p-menuitem:hover {
  background-color: #fffcf6 !important;
}
.p-menuitem-link:hover {
  border: dotted;
  border-width: 1px;
  border-color: #409455;
  color: #409455 !important;
}
.p-menubar .p-menuitem.p-menuitem-active > .p-menuitem-link {
  background: #fffcf6 !important;
}
.p-menuitem-link:hover > *,
.router-link-exact-active > * {
  color: #eb0303 !important;
  font-weight: 100;
}
.btn-header-outlined-bottom {
  border-color: #04d9b5 !important;
  border-bottom: solid;
  border-bottom-width: 2px;
  padding: 0% !important;
}
.btn-header-outlined-top {
  border-color: #04d9b5 !important;
  border-top: solid;
  border-top-width: 2px;
  padding: 0% !important;
}
.btn-header-outlined-right {
  border-color: #04d9b5 !important;
  border-right: solid;
  border-right-width: 2px;
  padding: 0% !important;
}
.btn-header-outlined-bottom *,
.btn-header-outlined-top * {
  color: #04d9b5 !important;
  font-weight: 600;
}
</style>