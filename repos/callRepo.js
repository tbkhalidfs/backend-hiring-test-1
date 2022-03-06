const mongoose = require('mongoose');
const Call = mongoose.model('Call');
const config = require('../config');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

class CallRepository {
    async getCallLogs(status){
        try{
            let logs = [];
            if(status){
                logs = await Call.find({status});
            }
            else{
                logs = await Call.find();
            }
            return logs;
        }
        catch(err){
            console.log("getCallLogs error: ", err);
            return err;
        }
    }

    async initiateCall(){
        // Use the Twilio Node.js SDK to build an XML response
        const twiml = new VoiceResponse();

        const gather = twiml.gather({
        numDigits: 1,
        action: '/gather',
        });
        gather.say('To connect to our agent, press 1. To leave a voicemail, press 2.');

        // If the user doesn't enter input, loop
        twiml.redirect('/voice');
        return twiml;
    }

    async gatherAction(req){
        // Use the Twilio Node.js SDK to build an XML response
        const twiml = new VoiceResponse();

        // If the user entered digits, process their req
        if (req.body.Digits) {
            console.log("req body", req.body);
            switch (req.body.Digits) {
            case '1':
                await this.connectToAgent(twiml);
                break;
            case '2':
                await this.recordCall(twiml);
                break;
            default:
                twiml.say("Please select one of the provided options.");
                twiml.pause();
                twiml.redirect('/voice');
                break;
            }
        } else {
            // If no input was sent, redirect to the /voice route
            twiml.redirect('/voice');
        }
        return twiml;
    }

    async connectToAgent(twiml){
        twiml.say("You selected 1. You'll be connected to our agent shortly.");
        const dial = twiml.dial({
            action: `/endCall?status=agent`,
            callerId: config.personalNumber,
          });
          dial.number(
            config.personalNumber
        );
        return twiml;
    }

    async recordCall(twiml){
        // Use <Record> to record the caller's message
        twiml.say('You selected 2. Please leave a message after the beep. Press hash to end call once you have recorded your message.');
        twiml.record({
            action: '/endCall?status=voicemail',
            finishOnKey: '#'
        });
        return twiml;
    }

    async endCall(req){
        let hangupResult = await this.hangup();
        let savedLog = await this.saveCallLog(req);
        console.log("savedLog", savedLog);
        return hangupResult;
    }

    async saveCallLog(req){
        console.log("request body", req.body);
        let {From, RecordingSid, RecordingUrl, RecordingDuration, CallerCity, CallerCountry, Direction, CallSid} = req.body;
        let {status} = req.query;
        let logObj = {
            msisdn: From,
            city: CallerCity,
            country: CallerCountry,
            direction: Direction,
            callerSid: CallSid,
            status,
            timestamp: new Date()
        }
        if(status == 'voicemail'){
            logObj.recordingSid = RecordingSid;
            logObj.recordingUrl = RecordingUrl;
            logObj.callDuration = Number(RecordingDuration);
        }
        try{
            let call = new Call(logObj);
            let result = await call.save();
            return result;
        }
        catch(err){
            console.log("saveCallLog err: ", err);
            return err;
        }
    }

    async hangup(){
        const twiml = new VoiceResponse();
        twiml.hangup();
        console.log("call end");
        return twiml;
    }
}

module.exports = CallRepository;