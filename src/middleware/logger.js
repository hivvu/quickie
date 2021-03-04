const LoggerMiddleware = (req,res,next) =>{
    console.info(`[Logged] ${req.url}  ${req.method} -- ${new Date()}`);

    next();
}

module.exports = LoggerMiddleware;