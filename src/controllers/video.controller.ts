import VideoReelModel,{VideoStatusProcess} from '../datalayers/models/mongodb/videoReel.model'
import editorVideosController from './editorVideos.controller';
class VideoController{

    async testingFFmpef(){
        try {
            await editorVideosController.ffmpeg({})
        } catch (error) {
            throw error
        }
    }

    async executeProcessToBuildReel(){
        const videoId:any = null;
        try {
            //proceso al iniciar 
            await this.setStatusOfProcess({
                videoId:videoId,
                status:VideoStatusProcess.INIT
            })
            //proceso al finalizar
            await this.setStatusOfProcess({
                videoId:videoId,
                status:VideoStatusProcess.END
            })


        } catch (error) {
            //al Obtemer un error
            await this.setStatusOfProcess({
                videoId:videoId,
                status:VideoStatusProcess.ERR
            })
        }
    }
    async getStatusOfProcess({}:any){

    }
    private async setStatusOfProcess({}:any){

    }

    private async createVideoReel(){
        VideoReelModel
    }
    async testMongoDB(){
        try {
            const data = await VideoReelModel.findOne({}).lean();
            console.log("🚀 ~ file: video.controller.ts ~ line 39 ~ VideoController ~ testMongoDB ~ data", data)
            return data
        } catch (error) {
            throw error;
        }
    }

    async cutVideo(nameVideo: string, startTime: string, endTime: string, numberCpusAvailables: number) {
        try {
            await editorVideosController.cutVideo(nameVideo, startTime, endTime, numberCpusAvailables)
        } catch (error) {
            throw error
        }
    }

}

export default new VideoController();