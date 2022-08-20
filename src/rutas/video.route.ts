import { Response, } from 'restify';
import { Router, } from 'restify-router';
import videoController from '../controllers/video.controller';

const router = new Router();


router.get('/test',(req, res)=> {

    return res.json({sucess:true}); 
});

router.get('/execute', async (req, res):Promise<Response> => {

    try {
        videoController.executeProcessToBuildReel();
        return res.json({sucess:true}); 
    } catch (error) {
        return res.json({sucess:false,error:error.stack});
    }
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


export default router;