import { Response, } from 'restify';
import { Router, } from 'restify-router';
import videoController from '../controllers/video.controller';
import RedditVideosController from '../controllers/redditVideos.controller';
import YoutubeController from '../controllers/youtube.controller';
import editorVideosController from '../controllers/editorVideos.controller';
import procesosController from '../controllers/procesos.controller';
import redditVideosController from '../controllers/redditVideos.controller';

const router = new Router();

procesosController.verificarDirectorios();

router.get('/test',(req, res)=> {
    return res.json({sucess:true}); 
});

router.get('/ffmpeg', async (req, res):Promise<Response> => {

    try {
        await videoController.testingFFmpef();
        return res.json({sucess:true}); 
    } catch (error) {
        return res.json({sucess:false,error:error.stack});
    }
});

router.post('/cutvideo', async (req, res): Promise<Response> => {
    try {
      const {nameVideo, startTime, endTime, numberCpusAvailables} = req.body
      console.log("🚀 ~ file: video.routes.ts ~ line 28 ~ router.get ~ nameVideo", nameVideo)
      await videoController.cutVideo(nameVideo, startTime, endTime, numberCpusAvailables)
      return res.json({ success: true, });
    } catch (error) {
      return res.json({succes: false, error: error.stack})
    }
  });

router.post('/getVideosBgFilter', async (req, res): Promise<Response> => {
    try {
        const {cantidadVideos} = req.body;
        
        await RedditVideosController.getVideos(cantidadVideos);
        return res.json({ success: true, });
      } catch (error) {
        return res.json({succes: false, error: error.stack})
      }
});

router.post('/unirVideos', async (req, res):Promise<Response> => {
  try {
      const {nameVideo,extension} = req.body;
      await RedditVideosController.unirVideos(nameVideo,extension);  

      return res.json({sucess:true}); 
  } catch (error) {
      return res.json({sucess:false,error:error.stack});
  }
});

router.post('/unirVideosv2', async (req, res):Promise<Response> => {
  try {
      const {ubicacionCarpetaVideos,nameVideoFinal,extensionInput,extensionOutput,cantidadThreads} = req.body;
      await editorVideosController.joinVideosV2(ubicacionCarpetaVideos,nameVideoFinal,extensionInput,extensionOutput,cantidadThreads);  

      return res.json({sucess:true}); 
  } catch (error) {
      return res.json({sucess:false,error:error.stack});
  }
});

router.post('/uploadVideoYoutube', async (req, res):Promise<Response> => {
  try {
      const {ubicacionArchivo,title,description,keywords,category,privacyStatus} = req.body;
      await YoutubeController.uploadVideo(ubicacionArchivo,title,description,keywords,category,privacyStatus);  

      return res.json({sucess:true}); 
  } catch (error) {
      return res.json({sucess:false,error:error.stack});
  }
});

router.get('/clearDirectorios',async (req,res):Promise<Response> => {
  try {
    await procesosController.clearDirectorios();
    return res.json({sucess:true}); 
  } catch (error) {
    return res.json({sucess:false,error:error.stack});
  }

});

router.get('/listarLinksVideosReddid',async (req,res):Promise<Response> => {
  try {
    await redditVideosController.getLinkReddidVideos().then(data=>{
      return res.json({sucess:true,data:data}); 
    });
  } catch (error) {
    return res.json({sucess:false,error:error.stack});
  }

});


export default router;