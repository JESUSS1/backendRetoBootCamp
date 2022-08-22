import { spawn } from 'child_process'
import path from "path";
import fs from "fs";

//path.join(__dirname, '..', 'test', 'karma.conf.js')  Ejemplo : (ruta,retroceso,carpeta,archivo)
const dirRaiz = path.join(__dirname, '../..');
const entornoVirtualPyton = "C:\\Windows\\SysWOW64\\v_youtube_upload\\Scripts\\"
const videoSource = {
    srcVideo: `${dirRaiz}\\srcvideos\\`,
    srcVideoOutput: `${dirRaiz}\\srcConvert\\`,
}

const tipoProcesos = {
    'urls': 'urls',
    'download': 'download',
    'getNameVideos': 'getNameVideos',
    'setFiltro': 'setFiltro',
    'joinVideos': 'joinVideos',
    'createFileRutas': 'createFileRutas',
    'reubicando':'reubicando',
    'test':'test',
}

const listaComandos = {
    'curl': 'curl',
    'youtubedl': 'youtube-dl',
    'dir': 'dir',
    'ffmpeg':'ffmpeg',
    'default':'',
    'ejecucionArchivo':'',
}

class YoutubeController{
    
    async uploadVideo(ubicacionArchivo:any,title:string,description:string,keywords:string,category:string,privacyStatus:string){
        try {
            let args = [
               ''   
            ]
           ubicacionArchivo = ubicacionArchivo.replace(/\\/g,'\\\\')
           listaComandos.ejecucionArchivo = `${entornoVirtualPyton}activate`;

            this.procesoShell(listaComandos.ejecucionArchivo,args,tipoProcesos.test)
                .then(data =>{
                    console.log("fin "+data);
                    listaComandos.ejecucionArchivo = `${entornoVirtualPyton}python D:\\cursos\\backendRetoBootCamp\\simple_upload_video.py --file="${ubicacionArchivo}" --title="${title}" --description="${description}" --keywords="${keywords}" --category="${category}" --privacyStatus="${privacyStatus}"`;
                    console.log(listaComandos.ejecucionArchivo)
                    let args = [
                        ''
                     ]
                     this.procesoShell(listaComandos.ejecucionArchivo,args,tipoProcesos.test).then(res=>{
                        console.log(res);
                     })
                     

                })
                .catch(err =>{
                    console.log(err);
                });

            
                
        } catch (error) {
            console.log(error);
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
            console.log("ab  " +data);   
            switch(proceso){
                case tipoProcesos.urls:
                    resultados += data.toString();
                    break;
                case tipoProcesos.getNameVideos:
                    resultados += data.toString();
                    break;
                case tipoProcesos.test:
                    console.log("ab  " +data);
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
                case tipoProcesos.test:
                    resolve(`proceso terminado => ${code}`)
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
}

export default new YoutubeController();