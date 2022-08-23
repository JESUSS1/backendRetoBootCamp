import {tipoProcesos,listaComandos,dirRaiz,entornoVirtualPyton} from '../utils/variablesUtiles'
import ProcesosControler from '../controllers/procesos.controller'


class YoutubeController{
    
    async uploadVideo(ubicacionArchivo:any,title:string,description:string,keywords:string,category:string,privacyStatus:string){
        try {
            let args = [
               ''   
            ]
           ubicacionArchivo = ubicacionArchivo.replace(/\\/g,'\\\\')
           listaComandos.ejecucionArchivo = `${entornoVirtualPyton}activate`;

           ProcesosControler.procesoShell(listaComandos.ejecucionArchivo,args,tipoProcesos.test)
                .then(data =>{
                    console.log("fin "+data);
                    //D:\\cursos\\backendRetoBootCamp\\
                    let variablesInputs = `--file="${ubicacionArchivo}" --title="${title}" --description="${description}" --keywords="${keywords}" --category="${category}" --privacyStatus="${privacyStatus}"`
                    listaComandos.ejecucionArchivo = `${entornoVirtualPyton}python ${dirRaiz}\\simple_upload_video.py ${variablesInputs}`;
                    console.log(listaComandos.ejecucionArchivo)
                    let args = [
                        ''
                     ]
                     ProcesosControler.procesoShell(listaComandos.ejecucionArchivo,args,tipoProcesos.test).then(res=>{
                        console.log(res);
                     }).catch(e=>{console.log(e)})
                     
                })
                .catch(err =>{
                    console.log(err);
                });
            
        } catch (error) {
            console.log(error);
        }
    }   

}

export default new YoutubeController();