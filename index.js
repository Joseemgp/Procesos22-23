
const fs=require("fs");
const express = require('express');
const uuid = require('uuid/v4');
const app = express();
app.get('/', (req, res) => {
  res
    .status(200)
    .send("Hola")
    .end();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App esta escuchando en el puerto  ${PORT}`);
  console.log(' Ctrl+C pa salir.');
});
