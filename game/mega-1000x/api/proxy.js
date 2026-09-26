export default async function handler(req,res){
  const upstream=process.env.TGG_FROZEN_BASE||'https://tgg-world-play.vercel.app';
  const target=new URL(req.url||'/',upstream);
  target.searchParams.delete('_vercel_share');
  try{
    const r=await fetch(target,{headers:{'user-agent':req.headers['user-agent']||'TGG-Overlay/209'}});
    const type=r.headers.get('content-type')||'';
    let body=Buffer.from(await r.arrayBuffer());
    if(type.includes('text/html')){
      let html=body.toString('utf8');
      const build='<script>window.__TGG_BUILD__={overlay:"1000x-v209",graphics:"57",masterCss:"1000x-v209",masterJs:"1000x-v209",cleanerCss:"193",cleanerJs:"193"};<\/script>';
      const assets=[
        '<link rel="stylesheet" href="/tgg-graphics/tgg-1000x-master.css?v=1000x-v209">',
        '<link rel="stylesheet" href="/tgg-graphics/tgg-screen-cleaner-2026.css?v=193">',
        build,
        '<script defer src="/tgg-graphics/tgg-1000x-master.js?v=1000x-v209"><\/script>',
        '<script defer src="/tgg-graphics/tgg-screen-cleaner-2026.js?v=193"><\/script>'
      ].join('');
      html=html.replace(/<\/head>/i,assets+'</head>');
      body=Buffer.from(html,'utf8');
    }
    res.statusCode=r.status;
    for(const [k,v] of r.headers.entries()){
      if(!['content-length','content-encoding','transfer-encoding','content-security-policy'].includes(k.toLowerCase()))res.setHeader(k,v);
    }
    res.setHeader('x-tgg-overlay','1000x-v209');
    res.setHeader('cache-control','no-store');
    res.end(body);
  }catch(err){
    res.statusCode=502;
    res.setHeader('content-type','application/json');
    res.end(JSON.stringify({ok:false,error:'TGG upstream unavailable',detail:String(err?.message||err)}));
  }
}
