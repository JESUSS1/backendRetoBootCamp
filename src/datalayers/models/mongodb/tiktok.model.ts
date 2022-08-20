import mongoose,{Schema} from "mongoose";
import { connectDBProcess } from "../../databases/mongo";

const TikTokSchema = new Schema({
    videoLink: {type: String},
    srcLink: {type: String}
}, {timestamps: true});

const TikToModel = connectDBProcess.model('TikTok',TikTokSchema);

export default TikToModel;