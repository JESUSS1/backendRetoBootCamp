import { spawn } from 'child_process'
import path from "path";
import {tipoProcesos} from '../utils/variablesUtiles'
import fs from "fs";

class ProcesosControler{
    
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

    async createArchivoTxt(nameArchivo:string,cadenaTexto:string){
        return new Promise((resolve, reject) =>{
    
            var stream = fs.createWriteStream(nameArchivo);
                stream.once('open', function(fd) {
                stream.write(cadenaTexto);
                stream.end();
                });
            resolve(null);
        });
        
      } 

}
export default new ProcesosControler();