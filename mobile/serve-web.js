const http=require('http'), fs=require('fs'), path=require('path');
const port = 19006;
const root = require('path').join(__dirname, 'dist-web');
http.createServer((req,res)=>{
  let url = req.url.split('?')[0];
  if(url === '/') url = '/index.html';
  // expo static routes are files like /payment -> /payment.html or /index.html handling via expo router static
  let fp = path.join(root, url);
  // fallback to index.html for SPA routes
  if(!fs.existsSync(fp) && !path.extname(fp)){
    // try .html
    if(fs.existsSync(fp + '.html')) fp = fp + '.html';
    else fp = path.join(root, 'index.html');
  }
  fs.readFile(fp,(e,d)=>{
    if(e){ res.writeHead(404,{'Content-Type':'text/html'}); return res.end('Not found: '+url+'<br><a href="/">Home</a>'); }
    const ext=path.extname(fp);
    const ct={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg'}[ext]||'text/html';
    res.writeHead(200,{'Content-Type':ct});
    res.end(d);
  });
}).listen(port,()=>console.log('mobile web on '+port));
