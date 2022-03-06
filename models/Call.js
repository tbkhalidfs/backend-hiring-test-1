const mongoose = require('mongoose');
const {Schema} = mongoose;

const CallSchema = new Schema({
    msisdn: {type: String, required: true}, // phone number
    recordingSid: {type: String},
    recordingUrl: {type: String},
    callDuration: {type: Number},
    city: {type: String},
    country: {type: String},
    direction: {type: String},
    callerSid: {type: String},
    status: {type: String},
    timestamp: {type: Date, required: true}
}, { strict: true });

module.exports = mongoose.model('Call', CallSchema);