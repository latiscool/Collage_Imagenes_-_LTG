const express = require('express');
const app = express();
const fs = require('fs');
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: false })); //body-parser el contenido del payload lo transgorma .json
app.use(bodyParser.json());
const PORT = 3000;

app.listen(PORT, () => console.log(`Servidor ejecutandose en puerto ${PORT}`));

//*** MIDDLEWARES ---0---
//Configurado el upload el archivo
app.use(
  expressFileUpload({
    limits: { fieldSize: 5000000 }, //5MB
    abortOnLimit: true,
    responseOnLimit:
      'La el tamaño del archivo a cargar excede el limite permitido',
  })
);
//Acceso Publico
app.use(express.static('public'));
//--0--

//***RUTAS
//GET - Formulario
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/formulario.html`);
});

//POST - Cargar archivo en carpeta img(que es publica)
app.post('/imagen', (req, res) => {
  const { target_file } = req.files;
  const { posicion } = req.body;
  const name = `imagen-${posicion}`;
  //moviendo archivo cargado a la carpeta img y a la vez cambia el nombre y despues mostrar el collage.
  target_file.mv(`${__dirname}/public/imgs/${name}.jpg`, (err) => {
    res.redirect('/collage');
  });
});

// Ruta GET - visualizar el collage
app.get('/collage', (req, res) => {
  res.sendFile(`${__dirname}/collage.html`);
 });

//DELETE
app.get("/deleteImg/:nombre", (req, res) => {
  const { nombre } = req.params;
  fs.unlink(`${__dirname}/public/imgs/${nombre}`, (err) => {
     if(err){
       res.send("No existe archivo :" + err)
     }else{
      res.redirect("/collage")
     }
  });
});

//RUTA ERROR
app.get('*', (req, res) => {
  res.send(`<<center><h1>ERROR 404<br> Pagina no existes</h1></center>`);
});
