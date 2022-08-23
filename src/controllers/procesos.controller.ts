import { spawn } from 'child_process'
import {tipoProcesos,listaComandos,videoSource} from '../utils/variablesUtiles'
import fs from "fs";

class ProcesosControler{
    
    async procesoShell(comando:string,args:any,proceso:string){
        return new Promise((resolve, reject) => {
            const opts = { shell: true }
    
            var child = spawn(comando, (args), opts);
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
                if(tipoProcesos.verificarDirectorios = proceso){
                    console.log(`Verificancion de Directorio ${args[0]} existente : true`);
                }else{
                    console.error(`stderr: ${data}`);
                }
    
            });
    
            //para saber si se termino el proceso | cuando termina 
            child.on('close', (code: any) => {
                //console.log(`child process exited with code ${code}`);
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
                    case tipoProcesos.verificarDirectorios:
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

    async clearDirectorios(){
        //borramos los archivos de la carpeta srcVideos y srcConvert
        let args = [
            `srcvideos/*` //no funciona ¿? ${videoSource.srcVideo}*
        ];
        await this.procesoShell(listaComandos.rm,args,tipoProcesos.eliminarArchivos).then(resulDelete1=>{
            console.log(resulDelete1);
            let args = [
                `srcConvert/*` //no funciona ¿? ${videoSource.srcVideoOutput}*
            ];
            this.procesoShell(listaComandos.rm,args,tipoProcesos.eliminarArchivos).then(resulDelete2=>{
                console.log(resulDelete2);
            }).catch(err =>{console.log(err)})
        
        }).catch(err =>{console.log(err)})
    }
    async verificarDirectorios(){
        //verificamos que existan los directorios srcVideos y srcConvert
        let args = [
            `srcvideos` 
        ];
        await this.procesoShell(listaComandos.mkdir,args,tipoProcesos.verificarDirectorios).then(resVerificacion=>{
            console.log(resVerificacion);
            let args = [
                `srcConvert` 
            ];
            this.procesoShell(listaComandos.mkdir,args,tipoProcesos.verificarDirectorios).then(resVerificacion=>{
                console.log(resVerificacion);
                console.log("-------------------------------------")
            }).catch(err =>{console.log(err)})
        
        }).catch(err =>{console.log(err)})
    }


}
export default new ProcesosControler();