import mongoose from 'mongoose'

const Player = new mongoose.Schema({
    username: {type: String, required: true},
    vehicleType: {type: Number, required: true},
    timeInsertingInLobby: {type: Date, required: true}
})

export default mongoose.model("Player", Player);