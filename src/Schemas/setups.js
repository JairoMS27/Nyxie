const { Schema, model } = require("mongoose");


const schema = new Schema({
  guildID: { type: String, required: true },
  bienvenidas: { type: Object, default: {canal: "", fondo: "https://i.imgur.com/2EhFS7C.jpg", mensaje: "Bienvenido {usuario} a {servidor}\n Disfruta de tu estancia!"}},
});


/*const schema = new Schema({
  guildID: { type: String, required: true },
  bienvenidas: {
    canal: { type: String, required: true },
    fondo: {
      type: String,
      default: "https://i.imgur.com/2EhFS7C.jpg",
    },
    mensaje: {
      type: String,
      default: "Bienvenido {usuario} a {servidor}\n Disfruta de tu estancia!",
    },
  }
}); */

module.exports = model("Configuraciones", schema);