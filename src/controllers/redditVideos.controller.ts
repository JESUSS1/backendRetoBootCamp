import { spawn } from 'child_process'
import path from "path";

const tipoProcesos = {
    urls: 'urls',
    download: 'download'
}

const listaComandos = {
    'curl': 'curl',
    'youtubedl': 'youtube-dl'
}


class RedditVideosController{
    dirVideos: string;
    constructor(){
        //path.join(__dirname, '..', 'test', 'karma.conf.js')  Ejemplo : (ruta,retroceso,carpeta,archivo)
        this.dirVideos = path.join(__dirname, '../..', 'srcvideos');
    }
    
    async getVideos(cantidadVideos:Number = 5){
        try {
           // var cadenaScrapping = `https://www.reddit.com/r/TikTokCringe/top.json?limit=${cantidadVideos} | jq . | grep url_overridden_by_dest | grep -Eoh "https:\/\/v\.redd\.it\/\w{13}" > videosUrl.txt`;
            var cadenaScrapping = `https://www.reddit.com/r/TikTok/top.json?limit=${cantidadVideos} | jq . | grep url_overridden_by_dest | grep -Eoh "https:\/\/v\.redd\.it\/\w{13}" > videosUrl.txt`;
            console.log(cadenaScrapping);

            let args = [
                `-H "User-agent: 'your bot 0.1'" https://www.reddit.com/r/TikTokCringe/top.json?limit=${cantidadVideos} | jq . | grep url_overridden_by_dest"`,              
            ]
            //this.getEnlacesVideoScrapping(args)
            this.procesoShell(listaComandos.curl,args,tipoProcesos.urls)
                .then(data =>{
                    console.log(data);

                    let args = ['--config-location','youtube-dl.conf',data];
                    //this.downloadVideoScrapping(args)
                    this.procesoShell(listaComandos.youtubedl,args,tipoProcesos.download)
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
        const child = spawn(comando, (args), opts);
        let resultados = '';

        //para saber lo que sale
        child.stdout.on('data', (data: any) => {
            if(proceso === tipoProcesos.urls){
                const regEnlaces = /https:\/\/v\.redd\.it\/\w{13}/g;
                resultados = data.toString().match(regEnlaces).toString().replace(/,/g," ");
            }else{
                console.log(`stdout: ${data}`);
            }
        });

        //monitorear los errores
        child.stderr.on('data', (data: any) => {
            console.error(`stderr: ${data}`);
        });

        //para saber si se termino el proceso
        child.on('close', (code: any) => {
            console.log(`child process exited with code ${code}`);
            switch(proceso){
                case tipoProcesos.urls:
                    resolve(resultados)
                    break;
                case tipoProcesos.download:
                    resolve(resultados)
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

export default new RedditVideosController();