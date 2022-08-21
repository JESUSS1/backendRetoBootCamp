import { spawn } from 'child_process'
import path from "path";
import fs from "fs";

const tipoProcesos = {
    'urls': 'urls',
    'download': 'download',
    'getNameVideos': 'getNameVideos',
    'setFiltro': 'setFiltro',
    'joinVideos': 'joinVideos',
    'createFileRutas': 'createFileRutas',
}

const listaComandos = {
    'curl': 'curl',
    'youtubedl': 'youtube-dl',
    'dir': 'dir',
    'ffmpeg':'ffmpeg',
    'default':'',
}

//path.join(__dirname, '..', 'test', 'karma.conf.js')  Ejemplo : (ruta,retroceso,carpeta,archivo)
const dirRaiz = path.join(__dirname, '../..');
const videoSource = {
    srcVideo: `${dirRaiz}\\srcvideos\\`,
    srcVideoOutput: `${dirRaiz}\\srcConvert\\`,
}

class RedditVideosController{
    
    async getVideos(cantidadVideos:Number = 5){
        try {
            //var cadenaScrapping = `https://www.reddit.com/r/TikTok/top.json?limit=${cantidadVideos} | jq . | grep url_overridden_by_dest | grep -Eoh "https:\/\/v\.redd\.it\/\w{13}" > videosUrl.txt`;
            //console.log(cadenaScrapping);

            let args = [
                `-H "User-agent: 'your bot 0.1'" https://www.reddit.com/r/TikTokCringe/top.json?limit=${cantidadVideos} | jq . | grep url_overridden_by_dest"`,              
            ]
            //Descargarmos los enlaces de los videos
            this.procesoShell(listaComandos.curl,args,tipoProcesos.urls)
                .then(data =>{
                    //console.log(data);

                    let args = ['--config-location','youtube-dl.conf',data];
                    //Descargamos los videos
                    this.procesoShell(listaComandos.youtubedl,args,tipoProcesos.download).then(data =>{
                        this.rotateVideooBackgroundFilter()
                    });
                })
                .catch(err =>{
                    console.log(err);
                });
                
        } catch (error) {
            
        }
    }   

   async procesoShell(comando:string,args:any,proceso:string){
    return new Promise((resolve, reject) => {
        const opts = { shell: true }

        var child = spawn(comando, (args), opts);
        console.log("INICIO");
        let resultados = '';

        //para saber lo que sale
        child.stdout.on('data', (data: any) => {         
            switch(proceso){
                case tipoProcesos.urls:
                    resultados += data.toString();
                    break;
                case tipoProcesos.getNameVideos:
                    resultados += data.toString();
                    break;
                default:
                    console.log(`stdout: ${data}`);
                break;    
            }      
        });

        //monitorear los errores
        child.stderr.on('data', (data: any) => {
            console.error(`stderr: ${data}`);
        });

        //para saber si se termino el proceso | cuando termina 
        child.on('close', (code: any) => {
            console.log(`child process exited with code ${code}`);
            switch(proceso){
                case tipoProcesos.urls:
                    const regEnlaces = /https:\/\/v\.redd\.it\/\w{13}/g;
                    resultados = resultados.toString().match(regEnlaces).toString().replace(/,/g," ");
                    resolve(resultados) //obtenemos las urls de los videos
                    break;
                case tipoProcesos.download:
                    resolve(`proceso download terminado => ${code}`)
                    break;
                case tipoProcesos.getNameVideos:
                    resultados = resultados.replace(/(\r\n|\n|\r)/gm, ",").slice(0, -1);
                    resolve(resultados) //obtenemos las nombres de los videos
                    break;
                default:
                    resolve(`proceso terminado => ${code}`)
                break;    
            }      
        });

        //si se produce un error   
        child.on('error', (code: any) => {
            reject(`proceso con errores => ${code}`)
        });
        //envia mensajes de regreso
        child.on('message', (code: any) => {
            console.log(`this is message from child.on =>`, code)
        });

    
    })
   }

   async rotateVideooBackgroundFilter(){
    let args = [
        '/b',
        `${videoSource.srcVideo}*.mp4`];
    //obtenemos los nombres de los archivos .mp4
    this.procesoShell(listaComandos.dir,args,tipoProcesos.getNameVideos)
    .then(result =>{

        let listVideos = result.toString().split(',');
        //Bucle Funciones recursivas
        const doNextPromise =(position:any=0)=>{
            let args = [
                '-i',
                `${videoSource.srcVideo}${listVideos[position]}`,
                '-threads 2',
                '-lavfi',
                '[0:v]scale=ih*16/9:-1,boxblur=luma_radius=min(h\\,w)/20:luma_power=1:chroma_radius=min(cw\\,ch)/20:chroma_power=1[bg];[bg][0:v]overlay=(W-w)/2:(H-h)/2,crop=h=iw*9/16',
                '-vb 800K',
                `${videoSource.srcVideoOutput}${listVideos[position]}`];

            this.procesoShell(listaComandos.ffmpeg,args,tipoProcesos.setFiltro).then(res=>{
                console.log(res);
            }).catch(err =>{console.log(err)});
            position++;
            if (position < listVideos.length)
                doNextPromise(position)
            else
                console.log("FIN DE CONVERSION DE FILTROS");
        }
    
        doNextPromise(0);


    }).catch(x=>{console.log(x)});
   }
   async unirVideos(nameVideo:any,extension:any=".mp4"){

    //console.log(nameArchivo);
    let args = [
        '/b',
        `${videoSource.srcVideoOutput}*.mp4`];
    
    //obtenemos los nombres de los archivos .mp4    
    this.procesoShell(listaComandos.dir,args,tipoProcesos.getNameVideos).then(nameV=>{
        //let listVideos = nameV.toString().split(',');
        if(nameV!=""){
            const nameListVideosC = `listaUbicacionVideosC.txt`;
            //let listVideos =  `-i srcConvert\\`+nameV.toString().replace(/,/g,` -i srcConvert\\`);
            //let listVideos =  `(echo file srcConvert\\`+nameV.toString().replace(/,/g,` & echo file srcConvert\\`)+`)`;
            let listVideos =  'file srcConvert\\\\'+nameV.toString().replace(/,/g,'\nfile srcConvert\\\\')
            //console.log(listVideos);
            
            this.createArchivoTxt(nameListVideosC,listVideos).then(errorCreation=>{
                if(errorCreation==null){
                    let args = [
                        '-f',
                        'concat',
                        '-safe 0',
                        `-i ${dirRaiz}\\${nameListVideosC}`,
                        '-threads 2',
                        `srcVideos\\${nameVideo}${extension}`];
                
                    this.procesoShell(listaComandos.ffmpeg,args,tipoProcesos.joinVideos).then(res=>{
                        console.log(res);
                    })
                  
                }
            });
  
        }else{
            console.log("No hay videos para unir");
        }
    })


   }

   async createArchivoTxt(nameArchivo:string,cadenaTexto:string){
    return new Promise((resolve, reject) =>{

        var stream = fs.createWriteStream(nameArchivo);
            stream.once('open', function(fd) {
            stream.write(cadenaTexto);
            stream.end();
            });
        resolve(null);
        
       /* const bucleEsperar =()=>{
            fs.stat(nameArchivo, function(err) {
                if (err == null) {
                    console.log("El archivo existe");
                    resolve(err);
                } else if (err.code == 'ENOENT') {
                    console.log("el archivo no existe");
                    setTimeout(bucleEsperar,500)  
                } else {
                    console.log(err); // ocurrió algún error
                    reject(err);
                }
            })    
        }  

        setTimeout(bucleEsperar,2000)  
*/
    });
    
  } 

}

export default new RedditVideosController();