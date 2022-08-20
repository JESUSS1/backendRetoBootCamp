import mongoose,{Schema} from "mongoose";
import { connectDBProcess } from "../../databases/mongo";
import {VideoStatusProcess} from './videoReel.model';

const StatusProcessSchema = new Schema({
    statusOfProcess: {type: String, enum: VideoStatusProcess}
}, {timestamps: true})


const StatusProcessModel = connectDBProcess.model('StatusProcess', StatusProcessSchema)

export default StatusProcessModel;

