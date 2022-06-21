<template>
  <div>
    <h1>MI PERFIL</h1>
    <div class="p-fluid grid">
      <div class="field col-0 md:col-1"></div>

      <Accordion :activeIndex="0" class="field col-12 md:col-10">
        <AccordionTab header="Información personal">
          <Card v-if="!usuario()">
            <template #header>
              <img
                :alt="trabajador.foto"
                :src="trabajador.foto"
                id="imagen"
              />
            </template>
            <template #title>
              {{ trabajador.nombre +' '+trabajador.apellidos}}
            </template>
            <template #content>
              <ul>
                <li><b>Nombre:</b>{{ trabajador.nombre }}</li>
                <li><b>Apellidos:</b>{{ trabajador.apellidos }}</li>
                <li><b>DNI:</b>{{ trabajador.DNI }}</li>
              </ul>
            </template>
            <template #footer> </template>
          </Card>
          <Card v-if="usuario()">            
            <template #title>
              {{ cliente.nombre+' '+cliente.apellidos }}
            </template>
            <template #content>
              <ul>
                <li><b>Email:</b>&nbsp;{{ cliente.email }}</li>
                <li><b>DNI:</b>&nbsp;{{ cliente.DNI }}</li>
                <li><b>Sexo:</b>&nbsp;{{ cliente.sexo }}</li>
              </ul>
            </template>
            <template #footer> </template>
          </Card>
        </AccordionTab>

        <AccordionTab v-if="!usuario()" header="Información del contacto">
          <Card> 
            <template #content>
              <ul>
                <li><b> Rol:</b>&nbsp;{{ datos.rol }}</li>
                <li><b>Email:</b>&nbsp;{{ trabajador.email }}</li>
                <li><b>Sueldo:</b>&nbsp;{{ trabajador.sueldo }}</li>
              </ul>
            </template>
            <template #footer> </template>
          </Card>          
        </AccordionTab>
      </Accordion>
      <div class="field col-0 md:col-1"></div>
    </div>
  </div>
</template>

<script>
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Card from "primevue/card";
import Firebase from "../db.js";
//import firebase from 'firebase/app';
import { db } from "../db.js";

export default {
  name: "inicio",
  data() {
    return {
      cliente: [],
      trabajador: [],
      datos: {
        rol: "",
      },
    };
  },
  components: {
    Accordion,
    AccordionTab,
    Card,
  },
  methods: {
    comprobarRol(email) {
      db.collection("trabajadores")
        .where("email", "==", email)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size < 1) {
            this.datos.rol = "usuario";
            this.cargarCliente(email);
          } else {
            this.cargarTrabajador(email);
            querySnapshot.forEach((doc) => {
              console.log(doc.data().esAdmin);
              if (doc.data().esAdmin) {
                this.datos.rol = "admin";
              } else {
                this.datos.rol = "trabajador";
              }
            });
          }
          console.log(this.datos.rol);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    cargarTrabajador(email) {
      db.collection("trabajadores")
        .where("email", "==", email)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            this.trabajador = [];
          }
          querySnapshot.forEach((doc) => {
            this.trabajador=doc.data();
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },

    cargarCliente(email) {
      db.collection("clientes")
        .where("email", "==", email)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            this.cliente = [];
          }
          querySnapshot.forEach((doc) => {
            this.cliente=doc.data();
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    usuario(){
      return this.datos.rol=='usuario';
    }
  },
  mounted: function () {
    Firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        this.comprobarRol(user.email);
      }
    });
  },
};
</script>

<style>
#imagen {
  height: 20vh;
  width: auto;
}
li {
  list-style: none;
  text-align: left;
}
</style>