const sessionController = (app) => {
    app.get('/app/test', (req,res) => {res.send('La Vie est belle')});
}
export default sessionController;