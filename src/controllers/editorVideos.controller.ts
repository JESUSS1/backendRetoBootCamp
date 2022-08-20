import { spawn } from 'child_process'
import uuid4 from "uuid4";
import path from "path";


class ImitandoSonyVegas{
    dirVideos: string;
    constructor(){
        //path.join(__dirname, '..', 'test', 'karma.conf.js')  Ejemplo : (ruta,retroceso,carpeta,archivo)
        this.dirVideos = path.join(__dirname, '../..', 'srcvideos');
    }

    async ffmpeg(argsFF: any) {
        try {
            return new Promise((resolve, reject) => {
                const opts = { shell: true }
                
                console.log("🚀 ~ file: sonyvegas.controller.ts ~ line 13 ~ SonyVegasByBootcamp ~ ffmpeg ~ argsFfmpeg", this.dirVideos)
                const child = spawn('ffmpeg', (argsFF), opts)
            
                //para saber lo que sale
                child.stdout.on('data', (data: any) => {
                    console.log(`stdout: ${data}`);
                });

                //monitorear los errores
                child.stderr.on('data', (data: any) => {
                    console.error(`stderr: ${data}`);
                });

                //para saber si se termino el proceso
                child.on('close', (code: any) => {
                    console.log(`child process exited with code ${code}`);
                    resolve(`proceso terminado => ${code}`)
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
        } catch (error) {
        console.log("🚀 ~ file: sonyvegas.controller.ts ~ line 43 ~ SonyVegasByBootcamp ~ ffmpeg ~ error", error)

        }
    }

    async cutVideo(nameVideo: string, startTime: string, endTime: string, numberCpusAvailables = 4) {
        try {
            let extensionVideo = '.mp4'
            let videoSource = {
                srcVideo: `${this.dirVideos}/${nameVideo}${extensionVideo}`,
                srcVideoOutput: `${this.dirVideos}/${nameVideo}-${uuid4()}${extensionVideo}`
            }
            // ffmpeg -y -i video_5.mp4 -threads 4 -ss 00:00:00 -to 00:00:20 -async 1 video_5_cut.mp4
            console.log("🚀 ~ file: sonyvegas.controller.ts ~ line 53 ~ SonyVegasByBootcamp ~ cutVideo ~ videoSource", videoSource)
            let args = [
                '-y',
                '-i',
                videoSource?.srcVideo,
                `-threads ${numberCpusAvailables}`,
                `-ss ${startTime}`,
                `-to ${endTime}`,
                '-async 1',
                videoSource?.srcVideoOutput
            ]

            await this.ffmpeg(args)
        } catch (error) {
            console.log("🚀 ~ file: sonyvegas.controller.ts ~ line 67 ~ SonyVegasByBootcamp ~ cutVideo ~ error", error)
            throw error
        }
    }

    

    /*
    async cutVideos(arrVideos:any []){}
    async joinVideos(arrVideos:any[]){}
    async addFilterVideos(arrVideos:any[]){}
    async addImageToVideos(arrVideos:any[]){}
    */

}

export default new ImitandoSonyVegas()