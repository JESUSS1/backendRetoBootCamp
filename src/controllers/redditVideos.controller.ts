import {tipoProcesos,listaComandos,videoSource,dirRaiz} from '../utils/variablesUtiles'
import ProcesosControler from '../controllers/procesos.controller'
import ReddidModel from '../datalayers/models/mongodb/reddidVideos.model';

class RedditVideosController{
    
    async getVideos(cantidadVideos:Number = 5){
        try {
            //var cadenaScrapping = `https://www.reddit.com/r/TikTok/top.json?limit=${cantidadVideos} | jq . | grep url_overridden_by_dest | grep -Eoh "https:\/\/v\.redd\.it\/\w{13}" > videosUrl.txt`;
            //console.log(cadenaScrapping);

            let args = [
                `-H "User-agent: 'your bot 0.1'" https://www.reddit.com/r/TikTokCringe/top.json?limit=${cantidadVideos} | jq . | grep url_overridden_by_dest"`,              
            ]
            //Descargarmos los enlaces de los videos
            ProcesosControler.procesoShell(listaComandos.curl,args,tipoProcesos.urls)
                .then(data =>{
                    //Guardamos los enlaces en la BD
                    let videoLink = data.toString().split(' ');
                    const reddidVideosSave = new  ReddidModel({videoLink})
                    reddidVideosSave.save().then(resp=>console.log(resp)).catch(err=>console.log(err));

                    let args = ['--config-location','youtube-dl.conf',data];
                    //Descargamos los videos
                    ProcesosControler.procesoShell(listaComandos.youtubedl,args,tipoProcesos.download).then(data =>{
                        this.rotateVideooBackgroundFilter()
                    });
                })
                .catch(err =>{
                    console.log(err);
                });
                
        } catch (error) {
            
        }
    }   

   async rotateVideooBackgroundFilter(){
    let args = [
        '/b',
        `${videoSource.srcVideo}*.mp4`];
    //obtenemos los nombres de los archivos .mp4
    ProcesosControler.procesoShell(listaComandos.dir,args,tipoProcesos.getNameVideos).then(result =>{
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

                ProcesosControler.procesoShell(listaComandos.ffmpeg,args,tipoProcesos.setFiltro).then(res=>{
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
    let args = [
        '/b',
        `${videoSource.srcVideoOutput}*.mp4`];
    
    //obtenemos los nombres de los archivos .mp4    
    ProcesosControler.procesoShell(listaComandos.dir,args,tipoProcesos.getNameVideos).then(nameV=>{
        //let listVideos = nameV.toString().split(',');
        if(nameV!=""){
            const nameListVideosC = `listaUbicacionVideosC.txt`;
            //let listVideos =  `-i srcConvert\\`+nameV.toString().replace(/,/g,` -i srcConvert\\`);
            //let listVideos =  `(echo file srcConvert\\`+nameV.toString().replace(/,/g,` & echo file srcConvert\\`)+`)`;
            let listVideos =  'file srcConvert\\\\'+nameV.toString().replace(/,/g,'\nfile srcConvert\\\\')
            //console.log(listVideos);
            
            ProcesosControler.createArchivoTxt(nameListVideosC,listVideos).then(errorCreation=>{
                if(errorCreation==null){
                    let args = [
                        '-f',
                        'concat',
                        '-safe 0',
                        `-i ${dirRaiz}\\${nameListVideosC}`,
                        '-threads 2',
                        `srcVideos\\${nameVideo}${extension}`];
                
                    ProcesosControler.procesoShell(listaComandos.ffmpeg,args,tipoProcesos.joinVideos).then(res=>{
                        console.log(res);
                    })
                  
                }
            });
  
        }else{
            console.log("No hay videos para unir");
        }
    })


   }

   async getLinkReddidVideos(){
        return ReddidModel.find();
   }

}

export default new RedditVideosController();