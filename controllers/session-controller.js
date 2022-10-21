//var session;

//Parent based imports of middleware things for param and stuff via/and express i think?
const sessionController = (app) => {
    app.get('/app/test', (req,res) => {res.send('La Vie est belle')});
    app.get('/api/session/reset', resetSession);
    app.get('/api/session/set/:name/:value', setSession);
    app.get('/api/session/get', getSessionAll);
    app.get('/api/session/get/:name', getSession);
}

const setSession = (req, res) => {
    var name = req.params['name'];
    var value = req.params['value'];
    req.session[name] = value;
    //session = req.session;
    res.send(req.session);
}

const getSession = (req, res) => {
    var name = req.params['name'];
    var value = req.session[name];
    res.send(value);
}

const getSessionAll = (req,res) => {
    console.log(req.body);
    res.send(req.session);
}

const resetSession = (req, res) => {
    req.session.destroy();
    //Send ok it is done status
    res.send(200);
}


export default sessionController;