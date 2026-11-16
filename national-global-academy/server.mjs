import http from 'node:http';
import {readFile,stat,writeFile,mkdir,rename} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {dirname,extname,join,normalize} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {spawn} from 'node:child_process';
import {subcourses} from './src/subcourses-data.mjs';
const base=dirname(fileURLToPath(import.meta.url)),root=join(base,'dist'),port=Number(process.env.PORT||3000);
const dataFile=process.env.NGA_DATA_FILE || join(process.env.HOME||'/home/user','nga-private-data','content.json');
const configured=Boolean(process.env.NGA_ADMIN_EMAIL&&process.env.NGA_ADMIN_PASSWORD);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.mp4':'video/mp4'};
let sessions=new Map(),attempts=new Map();
function same(a,b){let x=Buffer.from(String(a||'')),y=Buffer.from(String(b||''));return x.length===y.length&&timingSafeEqual(x,y)}
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))}
async function readData(){try{return JSON.parse(await readFile(dataFile,'utf8'))}catch(e){if(e.code==='ENOENT')return {};throw e}}
async function saveData(data){await mkdir(dirname(dataFile),{recursive:true,mode:0o700});let tmp=dataFile+'.tmp';await writeFile(tmp,JSON.stringify(data,null,2),{mode:0o600});await rename(tmp,dataFile)}
async function body(req){let chunks=[],n=0;for await(const c of req){n+=c.length;if(n>300000)throw Error('Request too large');chunks.push(c)}return JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}')}
function sessionToken(req){return (req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('nga_session='))?.slice(12)}
function session(req){let token=sessionToken(req);let s=sessions.get(token);if(!s||s.until<Date.now()){sessions.delete(token);return false}return true}
function isSameOrigin(req){let o=req.headers.origin;try{return o&&new URL(o).host===req.headers.host}catch{return false}}
function rebuild(){return new Promise((resolve,reject)=>{let child=spawn(process.execPath,['build.mjs'],{cwd:base,env:{...process.env,NGA_DATA_FILE:dataFile},stdio:'ignore'});child.on('close',c=>c===0?resolve():reject(Error('Build failed')));child.on('error',reject)})}
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost'),path=decodeURIComponent(url.pathname);
 const redirects={'/courses/diploma-in-cruise-hospitality-management/':'/courses/diploma-in-cruise-and-hospitality-management-dchm/','/blog/':'/guides/','/blog/merchant-navy-after-12th-guide-2026/':'/guides/merchant-navy-after-12th/','/blog/cruise-ship-jobs-indians-salary-roles/':'/guides/cruise-ship-careers/','/blog/gp-rating-course-fees-eligibility-career-scope/':'/guides/gp-rating/'};
 if(redirects[path]){res.writeHead(308,{Location:redirects[path]});return res.end()}
 if(path.startsWith('/assets/videos/')&&/^\/assets\/videos\/[a-z0-9-]+\.mp4$/.test(path)){
  const file=join(root,path);let size;try{size=(await stat(file)).size}catch{return json(res,404,{error:'Not found'})}
  let start=0,end=size-1,range=req.headers.range;
  if(range){let m=/^bytes=(\d*)-(\d*)$/.exec(range);if(!m||(!m[1]&&!m[2])){res.writeHead(416,{'Content-Range':`bytes */${size}`});return res.end()}if(!m[1])start=Math.max(0,size-Number(m[2]));else start=Number(m[1]);if(m[2]&&m[1])end=Math.min(end,Number(m[2]));if(start>end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`});return res.end()}}
  res.writeHead(range?206:200,{'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Length':end-start+1,'Cache-Control':'public, max-age=3600',...(range?{'Content-Range':`bytes ${start}-${end}/${size}`}:{})});if(req.method==='HEAD')return res.end();return createReadStream(file,{start,end}).pipe(res)
 }

 if(path.startsWith('/api/')){
  if(req.method!=='GET'&&!isSameOrigin(req))return json(res,403,{error:'Origin not allowed'});
  if(path==='/api/admin/status'&&req.method==='GET')return json(res,200,{configured,authenticated:session(req)});
  if(path==='/api/admin/login'&&req.method==='POST'){
   if(!configured)return json(res,503,{error:'Staff access has not been configured.'});
   let ip=req.socket.remoteAddress||'unknown',a=attempts.get(ip)||{count:0,until:Date.now()+600000};if(Date.now()>a.until)a={count:0,until:Date.now()+600000};if(a.count>=8)return json(res,429,{error:'Please wait before trying again.'});
   let d=await body(req);if(!same(d.email,process.env.NGA_ADMIN_EMAIL)||!same(d.password,process.env.NGA_ADMIN_PASSWORD)){a.count++;attempts.set(ip,a);return json(res,401,{error:'Sign in failed.'})}attempts.delete(ip);let token=randomBytes(32).toString('hex');sessions.set(token,{until:Date.now()+4*3600000});let secure=req.headers['x-forwarded-proto']==='https'?'; Secure':'';res.setHeader('Set-Cookie',`nga_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=14400${secure}`);return json(res,200,{ok:true});
  }
  if(path==='/api/enquiries'&&req.method==='POST'){
   if(!configured)return json(res,503,{error:'Storage not configured'});let ip='enquiry:'+(req.socket.remoteAddress||'unknown'),rate=attempts.get(ip)||{count:0,until:Date.now()+600000};if(Date.now()>rate.until)rate={count:0,until:Date.now()+600000};if(++rate.count>25)return json(res,429,{error:'Please try again later.'});attempts.set(ip,rate);let d=await body(req),keys=['name','age','location','qualification','experience','stcw','mobile','email','interest','help','source'];if(keys.some(k=>d[k]!==undefined&&typeof d[k]!=='string'))return json(res,400,{error:'Invalid data'});if(!d.name||!d.age||!d.location||!d.qualification||!['Yes','No'].includes(d.stcw)||!/^\d{10}$/.test(d.mobile)||!['Cruise Industry','Merchant Navy','Aviation','Hospitality'].includes(d.interest))return json(res,400,{error:'Invalid data'});let x={};for(const k of keys)x[k]=(d[k]||'').slice(0,500);let state=await readData();state.enquiries=state.enquiries||[];state.enquiries.unshift({...x,id:randomBytes(12).toString('hex'),date:new Date().toISOString(),status:'New',notes:''});await saveData(state);return json(res,201,{ok:true});
  }
  if(!session(req))return json(res,401,{error:'Sign in required.'});
  if(path==='/api/admin/data'&&req.method==='GET'){let d=await readData();if(!d.courses)d.courses=subcourses;d.settings=d.settings||{};d.batch=d.batch||{name:'Upcoming Batch',seatsLeft:12};d.enquiries=d.enquiries||[];return json(res,200,d)}
  if(path==='/api/admin/data'&&req.method==='PUT'){let d=await body(req),old=await readData();let allowed=['courses','settings','batch','hero','why','industry','logos','homeFaq'];for(const k of allowed)if(k in d)old[k]=d[k];await saveData(old);await rebuild();return json(res,200,{ok:true})}
  if(path==='/api/admin/enquiry'&&req.method==='PUT'){let d=await body(req),old=await readData(),e=(old.enquiries||[]).find(x=>x.id===d.id);if(!e)return json(res,404,{error:'Enquiry not found'});if(!['New','Contacted','Counselling Done','Enrolled','Closed'].includes(d.status)||typeof d.notes!=='string')return json(res,400,{error:'Invalid update'});e.status=d.status;e.notes=d.notes.slice(0,2000);await saveData(old);return json(res,200,{ok:true})}
  if(path==='/api/admin/logout'&&req.method==='POST'){sessions.delete(sessionToken(req));res.setHeader('Set-Cookie','nga_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return json(res,200,{ok:true})}
  return json(res,404,{error:'Not found'});
 }
 let relative=normalize(path).replace(/^(\.\.(\/|\\|$))+/,'').replace(/^[/\\]+/,'');let file=join(root,relative);if(!file.startsWith(root))throw Error('Invalid path');try{if((await stat(file)).isDirectory())file=join(file,'index.html')}catch{file=join(root,relative,'index.html')};let content;try{content=await readFile(file)}catch{file=join(root,'404.html');content=await readFile(file);res.statusCode=404}res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control',extname(file)==='.html'?'no-cache':'public, max-age=60');res.end(content)
 }catch(error){console.error(error);if(!res.headersSent)json(res,500,{error:'Request could not be completed.'});else res.end()}});
server.listen(port,'0.0.0.0',()=>console.log(`National Global Academy running on port ${port}. Local admin ${configured?'configured':'disabled'}.`));
