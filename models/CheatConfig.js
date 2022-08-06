const mongoose = require("mongoose");
const Schema = mongoose.Schema

const CheatConfigSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    settings: {
        bhop: {
            type: Boolean,
            default: false
        },
    
        esp: {
            type: Boolean,
            default: false
        },
    
        box_esp: {
            type: Boolean,
            default: false
        },
    
        healthbar_esp: {
            type: Boolean,
            default: false
        },
    
        snaplines: {
            type: Boolean,
            default: false
        },
    
        fov_value: {
            type: Number,
            default: 90
        }
    }
});

const CheatConfig = mongoose.model("cheatConfig", CheatConfigSchema);
module.exports = CheatConfig