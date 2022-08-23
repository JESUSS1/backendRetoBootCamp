import {Schema} from "mongoose";
import { connectDBProcess } from "../../databases/mongo";

const Reddidchema = new Schema({
    videoLink: {type:Array},
}, {timestamps: true});

const ReddidModel = connectDBProcess.model('Reddid',Reddidchema);

export default ReddidModel;