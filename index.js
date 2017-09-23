var http = require("http");
var fs = require("fs");

var server = http.createServer(function(req, res){
    console.log(req.method, req.url);

    var info = []

    switch(req.method) {
        case "GET":{            
            fs.readFile("./file.txt", function(err, data){
                if(err) {
                    console.error(err)
                    res.writeHead(500, {
                        "Content-Type": "application/json"
                    });
                    res.write(JSON.stringify({
                        err: err
                    }));
                }else{                
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                res.write(JSON.stringify({
                    data: data
                }));
            }
                res.end(data);
            });
            break
        }   
        case "POST":{
            var chunks = []
            req
                .on("data", function (chunk) {
                        chunks.push(chunk);
                })
                .on("end", function () {
                    var data = Buffer.concat(chunks).toString();                  
                    res.writeHead(200, {
                      "Content-type": "application/json"  
                    });                   
                    res.write(JSON.stringify({
                        data: data
                    }));
                    res.end();
                })
                .on("error", function (err) {
                    console.error(err)
                })            
            break
        }
        case "PUT":{
            var chunks = [];           
            req
                .on("data", function (chunk) {                    
                        chunks.push(chunk);
                })
                .on("end", function () {                    
                    var data = Buffer.concat(chunks).toString();
                    fs.appendFileSync("./file.txt", " ; " + data)
                    fs.readFile("./file.txt", function (err, data){
                      if(err) {
                        console.error(err)};
                      var info = data.toString()
                      res.writeHead(200, {
                          "Content-Type": "application/json"
                      });
                   
                    res.write(JSON.stringify({
                        data: info
                    }));
                    res.end();
                })})
                        
            break
        }
        case "DELETE":{
            fs.readFile("./file.txt", function(err, data){
                if(err) {
                    console.error(err) }
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "plain/text");
                    res.end("")
                })
        }
     }}
);

var host = "127.0.0.4";
var port = 3000;
server.listen(port, host, function(){
    console.log("Server is running at http://"+host+":"+port);
});