import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    firstTeam: {type: Array, required: true},
    secondTeam: {type: Array, required: true}
})

export default mongoose.model("TeamSchema", TeamSchema);