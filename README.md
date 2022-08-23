# Introducción
### Reto backend

Proyecto realiado con node, typescript y mongo db que optimiza el proceso de obtencion de videos de reddid, transformación de los mismos, union de videos y subida de videos a la plataforma de youtube usando **YouTube Data API** y **FFmpeg** inspirado en el video de youtube de **[BugsWriter]**. Este proyecto funciona inicialmente para windows, no se aun probando en linux y puede que halla problemas con las rutas si se ejecuta en linux.
El archivo **simple_upload_video.py** que nos permite poder subir el video a youtube usa el codigo de ejemplo de **YouTube Data API**. pero fue modificado ligeramente para poder trabajar con python3.

### Requerimientos

- Node, version de node usado  v14.20.0
- Instalar las herramientas de **[JQ]** y **[Youtube-dl]**
- Seguir el procedimiento de la documentacion de **[YouTube Data API]**
- Tener un entorno virtualizado de python con el nombre **v_youtube_upload** , en mi caso use **[Virtualenv]** para la virtualización y la version de python que use es la 3,10.5 .
- Instalar las **[Bibliotecas de Google]** requeridas según la documentación en el entrorno virtual de python e instalar tambien en el entorno **oauth2client**
- Renombrar el archivo **client_secretsEjemplo.json** por **client_secrets.json** y colocar su client_id y client_secret obtenidos despues de haber cumplido los requisitos de  **[YouTube Data API]**
- Verificar su cuenta de youtube que uso para cumplir con los requisitos de Youtube API **https://www.youtube.com/verify**
- Instalar mongo DB y configurar el archivo de **.env** modificando la conexción a su base de datos
- Tener encendido el servidor de mongo antes de arrancar el proyecto

## Installation

Instalamos las dependencias e iniciamos el servidor

```sh
npm install
npm run dev
```
## License

MIT

**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)
    
   [BugsWriter]: <https://www.youtube.com/watch?v=PS5vBJELtj4>
   [Bibliotecas de Google]: <https://developers.google.com/youtube/v3/quickstart/python>
   [JQ]:<https://community.chocolatey.org/packages/jq>
   [Youtube-dl]:<https://youtube-dl.org>

   [Virtualenv]: <https://sectorgeek.com/instalar-python-pip-y-virtualenv-en-windows-10/>
   [YouTube Data API]:<https://developers.google.com/youtube/v3/guides/uploading_a_video?hl=es-419>
