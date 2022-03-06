const CallRepository = require('../repos/CallRepo');
const callRepo = new CallRepository();

exports.getCallLogs = async (req,res) =>  {
    let result = await callRepo.getCallLogs(req.query.status);
    res.send({result});
}
exports.voice = async (req,res) =>  {
    let result = await callRepo.initiateCall();
    res.type('text/xml');
    res.send(result.toString());
}

exports.gather = async (req,res) =>  {
    let result = await callRepo.gatherAction(req);
    res.type('text/xml');
    res.send(result.toString());
}

exports.endCall = async (req,res) =>  {
    let result = await callRepo.endCall(req);
    res.type('text/xml');
    res.send(result.toString());
}