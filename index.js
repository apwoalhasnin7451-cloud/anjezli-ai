const SUPABASE_URL="https://ujnsqwefeilffsxefmbj.supabase.co";
const SUPABASE_KEY="sb_publishable_9h7gRWVjtTK-DAe1jdFujw_KD3bFeS2";
const AI_MODEL="@cf/meta/llama-3.1-8b-instruct-fast";
const BOT_USERNAME="AnjezliAI_bot";
const FREE_DAILY_LIMIT=30;

const SYSTEM=`أنت "أنجز لي AI"، مساعد ذكاء اصطناعي عربي احترافي متعدد المهام.
افهم مقصد المستخدم قبل الإجابة، والتزم بجميع تفاصيله وشروطه. أجب بنفس لغة المستخدم ما لم يطلب غير ذلك. لا تخترع حقائق أو أرقامًا أو مصادر. أعط نتيجة عملية كاملة مباشرة، وتجنب الحشو والتكرار.
عند طلب برومبت: تصرف كمهندس برومبتات محترف، وأنشئ برومبتًا جاهزًا للنسخ يحافظ على كل متطلبات المستخدم، ويضيف فقط العناصر المناسبة مثل الهدف، الموضوع، البيئة، الأسلوب، التكوين، الكاميرا، العدسة، الإضاءة، الحركة، الواقعية، الجودة، المقاس، المدة، الصوت، النصوص والقيود حسب نوع المهمة.
في البرمجة: اكتب حلولًا صحيحة وواضحة ولا تخترع APIs. في التسويق: راعِ الجمهور والهدف والمنصة والـCTA ولا تضمن نتائج. في التعليم: اشرح بوضوح وبخطوات.
الرد داخل Telegram: استخدم نصًا نظيفًا، ولا تستخدم عناوين Markdown أو علامات ** إلا عند الضرورة البرمجية.`;

const AGENTS={
 universal:["✨ المساعد العام","تعامل باحتراف مع الأسئلة والكتابة والتخطيط والتحليل والمهام العامة."],
 prompt:["🪄 مهندس البرومبتات","حوّل طلب المستخدم إلى برومبت احترافي متكامل جاهز للنسخ، مع الحفاظ على كل شروطه."],
 content:["✍️ كاتب المحتوى","اكتب محتوى طبيعيًا مقنعًا مناسبًا للجمهور والمنصة والهدف."],
 marketing:["📈 خبير التسويق","حلل الهدف والجمهور والعرض والمنصة وقدم خطة أو محتوى تسويقيًا عمليًا."],
 ads:["📣 خبير الإعلانات","ركز على الهوك والقيمة والعرض والرسالة والـCTA دون ادعاءات مضللة."],
 design:["🎨 مساعد التصميم","قدم توجيهًا بصريًا احترافيًا للتكوين والخطوط والمساحات والألوان والمقاسات."],
 coding:["💻 مساعد البرمجة","اكتب كودًا واضحًا وآمنًا وشخّص الأخطاء دون اختراع مكتبات أو endpoints."],
 study:["📚 مساعد الدراسة","اشرح المفاهيم بطريقة واضحة تساعد المستخدم على الفهم."],
 business:["💼 الأعمال والعمل الحر","قدم مساعدة عملية في الخدمات والتسعير والعروض والعمل الحر دون ضمان أرباح."],
 analysis:["🧠 المحلل الذكي","حلل المشكلة والبدائل والافتراضات بموضوعية."]
};

const TOOLS={
 improve:"حسّن النص مع الحفاظ على معناه ومعلوماته واجعله أوضح وأكثر احترافية.",
 summarize:"لخص المحتوى مع الحفاظ على أهم المعلومات ودون إضافة معلومات غير موجودة.",
 translate:"ترجم النص ترجمة طبيعية دقيقة مع الحفاظ على المعنى والنبرة.",
 ideas:"أنشئ أفكار محتوى متنوعة وعملية بناء على موضوع المستخدم والجمهور والمنصة.",
 hooks:"اكتب هوكس قوية مناسبة للمحتوى دون ادعاءات مضللة.",
 captions:"اكتب كابتشن طبيعيًا وجاهزًا للنشر ومناسبًا للمنصة والجمهور.",
 cta:"اكتب CTA مناسبًا للهدف والسياق.",
 product:"اكتب وصف منتج احترافيًا اعتمادًا فقط على المعلومات التي يقدمها المستخدم.",
 script:"اكتب سيناريو متكاملًا مناسبًا للمدة والمنصة والهدف، مع تنظيم المشاهد والتوقيت عند الحاجة.",
 prompt:"أنشئ برومبت احترافيًا متكاملًا جاهزًا للنسخ ويحافظ على كل متطلبات المستخدم."
};

const modes=new Map();
const mode=id=>modes.get(String(id))||{agent:"universal",tool:null,lang:"auto"};
const setMode=(id,p)=>modes.set(String(id),{...mode(id),...p});
const s=v=>v==null?"":String(v);
const isAr=t=>/[\u0600-\u06FF]/.test(s(t));
const lang=(id,t="")=>{const l=mode(id).lang;return l==="ar"||l==="en"?l:(isAr(t)?"ar":"en")};
const clean=t=>s(t).trim().replace(/\*\*(.*?)\*\*/gs,"$1").replace(/^#{1,6}\s+/gm,"").replace(/^\s*[-*]\s+/gm,"• ").replace(/\n{4,}/g,"\n\n");
const parts=(t,n=3900)=>{t=s(t);const a=[];while(t.length>n){let i=t.lastIndexOf("\n",n);if(i<n*.55)i=t.lastIndexOf(" ",n);if(i<n*.55)i=n;a.push(t.slice(0,i).trim());t=t.slice(i).trim()}if(t)a.push(t);return a};

async function tg(env,method,body={}){
 const r=await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
 const d=await r.json().catch(()=>null);
 if(!r.ok||!d?.ok)throw new Error(`Telegram ${method}: ${JSON.stringify(d)}`);
 return d.result;
}
async function send(env,chat,text,reply_markup){
 const a=parts(text);for(let i=0;i<a.length;i++){const b={chat_id:chat,text:a[i],disable_web_page_preview:true};if(reply_markup&&i===a.length-1)b.reply_markup=reply_markup;await tg(env,"sendMessage",b)}
}
async function edit(env,chat,message_id,text,reply_markup){
 try{return await tg(env,"editMessageText",{chat_id:chat,message_id,text,disable_web_page_preview:true,...(reply_markup?{reply_markup}:{})})}
 catch{return send(env,chat,text,reply_markup)}
}
async function rpc(env,name,body={}){
 const r=await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`,{method:"POST",headers:{apikey:SUPABASE_KEY,authorization:`Bearer ${SUPABASE_KEY}`,"content-type":"application/json",accept:"application/json"},body:JSON.stringify({p_worker_secret:env.ANJEZLI_WORKER_SECRET,...body})});
 const x=await r.text();let d;try{d=x?JSON.parse(x):null}catch{d=x}
 if(!r.ok)throw new Error(`Supabase ${name}: ${r.status} ${x}`);return d;
}
const boot=(env,f,ref=null)=>rpc(env,"anjezli_worker_bootstrap",{p_telegram_id:f.id,p_username:f.username||null,p_first_name:f.first_name||null,p_language_code:f.language_code||null,p_referral_code:ref});
const consume=(env,id,a)=>rpc(env,"anjezli_worker_consume_credit",{p_telegram_id:id,p_agent:a});
const save=(env,id,role,content,agent,cost=0)=>rpc(env,"anjezli_worker_save_message",{p_telegram_id:id,p_role:role,p_content:content,p_agent:agent,p_credits_cost:cost}).catch(()=>null);
const recent=(env,id)=>rpc(env,"anjezli_worker_recent_messages",{p_telegram_id:id,p_limit:10}).catch(()=>[]);
const gift=(env,id)=>rpc(env,"anjezli_worker_claim_daily_gift",{p_telegram_id:id});
const projects=(env,id)=>rpc(env,"anjezli_worker_list_projects",{p_telegram_id:id});
const newProject=(env,id,title)=>rpc(env,"anjezli_worker_create_project",{p_telegram_id:id,p_title:title,p_type:"general"});

async function ai(env,messages){
 const r=await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${AI_MODEL}`,{method:"POST",headers:{authorization:`Bearer ${env.CLOUDFLARE_AI_TOKEN}`,"content-type":"application/json"},body:JSON.stringify({messages,max_tokens:1800,temperature:.65})});
 const d=await r.json().catch(()=>null);
 if(!r.ok||d?.success===false)throw new Error("Workers AI failed");
 const out=d?.result?.response??d?.result?.text??d?.response??d?.text??(typeof d?.result==="string"?d.result:"");
 if(!out)throw new Error("Empty AI output");return clean(out);
}

const cb=(text,callback_data)=>({text,callback_data});
const urlb=(text,url)=>({text,url});
const home=l=>[cb(l==="en"?"🏠 Home":"🏠 الرئيسية","home")];
function main(l="ar"){return{inline_keyboard:l==="en"?[
 [cb("✨ Ask Anjezli","assistant"),cb("🧠 Assistants","agents")],[cb("🛠 AI Tools","tools"),cb("📁 Projects","projects")],[cb("🎁 Daily Gift","gift"),cb("👥 Invite & Earn","referral")],[cb("⭐ Plan & Credits","credits"),cb("🌐 Language","language")],[cb("❓ Help","help")]
]:[
 [cb("✨ أنجز لي","assistant"),cb("🧠 المساعدون","agents")],[cb("🛠️ أدوات AI","tools"),cb("📁 مشاريعي","projects")],[cb("🎁 الهدية اليومية","gift"),cb("👥 دعوة واكسب","referral")],[cb("⭐ خطتي ورصيدي","credits"),cb("🌐 اللغة","language")],[cb("❓ المساعدة","help")]
]}}
function agentKb(l){const z=(id)=>cb(l==="en"?AGENTS[id][0].replace(/[\u0600-\u06FF\s]+/g,"").trim()||id:AGENTS[id][0],`agent:${id}`);return{inline_keyboard:[[z("universal"),z("prompt")],[z("content"),z("marketing")],[z("ads"),z("design")],[z("coding"),z("study")],[z("business"),z("analysis")],home(l)]}}
function toolsKb(l){const en=l==="en";return{inline_keyboard:[[cb(en?"✨ Improve":"✨ تحسين النص","tool:improve"),cb(en?"📝 Summarize":"📝 تلخيص","tool:summarize")],[cb(en?"🌐 Translate":"🌐 ترجمة","tool:translate"),cb(en?"💡 Ideas":"💡 أفكار محتوى","tool:ideas")],[cb(en?"🎯 Hooks":"🎯 هوكس","tool:hooks"),cb(en?"📱 Captions":"📱 كابتشن","tool:captions")],[cb("👉 CTA","tool:cta"),cb(en?"🛍 Product":"🛍 وصف منتج","tool:product")],[cb(en?"🎬 Script":"🎬 سيناريو","tool:script"),cb(en?"🪄 Prompt":"🪄 برومبت احترافي","tool:prompt")],home(l)]}}
function welcome(name,l){return l==="en"?`Welcome ${name||""} 👋\n\nI'm Anjezli AI. You get ${FREE_DAILY_LIMIT} free AI uses every day. Send your request or choose a section below.`:`حياك ${name||""} 👋\n\nأنا أنجز لي AI — مساعدك الذكي لإنجاز المهام.\n\nلديك ${FREE_DAILY_LIMIT} استخدامًا مجانيًا يوميًا.\n\nأرسل طلبك مباشرة أو اختر من الأقسام بالأسفل.`}
function userOf(b){return b?.user&&typeof b.user==="object"?b.user:(b?.telegram_id?b:null)}
function creditText(u,l){const used=Number(u?.daily_used||0),bal=Number(u?.credits_balance||0),rem=Math.max(0,FREE_DAILY_LIMIT-used),p=u?.plan||"free";return l==="en"?`⭐ Plan & Credits\n\nPlan: ${p}\nDaily usage: ${used}/${FREE_DAILY_LIMIT}\nRemaining today: ${rem}\nBonus credits: ${bal}`:`⭐ خطتي ورصيدي\n\nالخطة: ${p==="free"?"المجانية":p}\nالاستخدام اليومي: ${used}/${FREE_DAILY_LIMIT}\nالمتبقي اليوم: ${rem}\nالرصيد الإضافي: ${bal}`}

async function ask(env,chat,f,text){
 const m=mode(f.id),l=lang(f.id,text);await tg(env,"sendChatAction",{chat_id:chat,action:"typing"}).catch(()=>{});
 let q;try{q=await consume(env,f.id,m.agent)}catch{await send(env,chat,l==="en"?"Couldn't verify your usage. Try again shortly.":"تعذر التحقق من رصيد الاستخدام. جرّب بعد قليل.",main(l));return}
 if(q?.ok===false){await send(env,chat,l==="en"?"Today's free allowance is finished and there are no bonus credits.":"انتهت استخدامات اليوم المجانية ولا يوجد رصيد إضافي كافٍ.",main(l));return}
 const h=await recent(env,f.id);const hist=Array.isArray(h)?h.filter(x=>["user","assistant"].includes(x?.role)&&typeof x.content==="string").slice(-10).map(x=>({role:x.role,content:x.content})):[];
 const tool=m.tool&&TOOLS[m.tool]?TOOLS[m.tool]:"";const agent=AGENTS[m.agent]||AGENTS.universal;
 const sys=SYSTEM+"\n\nالدور المتخصص: "+agent[1]+"\n"+tool+(m.lang==="ar"?"\nأجب بالعربية ما لم يطلب المستخدم غير ذلك.":m.lang==="en"?"\nReply in English unless asked otherwise.":"");
 await save(env,f.id,"user",text,m.agent,1);
 try{const out=await ai(env,[{role:"system",content:sys},...hist,{role:"user",content:text}]);await save(env,f.id,"assistant",out,m.agent,0);await send(env,chat,out,{inline_keyboard:[home(l)]});if(m.tool)setMode(f.id,{tool:null})}
 catch(e){console.error(e);await send(env,chat,l==="en"?"AI couldn't complete the request. Please try again.":"تعذر إكمال الطلب حاليًا. جرّب مرة أخرى.",main(l))}
}

async function showProjects(env,chat,id,l,msgid){
 let p=[];try{const x=await projects(env,id);if(Array.isArray(x))p=x}catch{}
 const text=(l==="en"?"📁 My Projects\n\n":"📁 مشاريعي\n\n")+(p.length?p.slice(0,20).map((x,i)=>`${i+1}. ${s(x.title)}`).join("\n"):(l==="en"?"No projects yet.":"ما عندك مشاريع حتى الآن."))+"\n\n"+(l==="en"?"Tap below to create a project.":"اضغط بالأسفل لإنشاء مشروع.");
 const k={inline_keyboard:[[cb(l==="en"?"➕ New Project":"➕ مشروع جديد","project:new")],home(l)]};return msgid?edit(env,chat,msgid,text,k):send(env,chat,text,k)
}

async function callback(env,q){
 const f=q.from,chat=q.message?.chat?.id,msgid=q.message?.message_id,data=q.data||"";if(!chat)return;await tg(env,"answerCallbackQuery",{callback_query_id:q.id}).catch(()=>{});const l=lang(f.id);
 if(data==="home")return edit(env,chat,msgid,welcome(f.first_name,l),main(l));
 if(data==="assistant"){setMode(f.id,{agent:"universal",tool:null});return edit(env,chat,msgid,l==="en"?"✨ General assistant selected. Send your request.":"✨ تم اختيار المساعد العام. أرسل طلبك الآن.",{inline_keyboard:[home(l)]})}
 if(data==="agents")return edit(env,chat,msgid,l==="en"?"🧠 Choose a specialized assistant:":"🧠 اختر المساعد المتخصص:",agentKb(l));
 if(data.startsWith("agent:")){const a=data.slice(6);if(!AGENTS[a])return;setMode(f.id,{agent:a,tool:null});return edit(env,chat,msgid,`${AGENTS[a][0]}\n\n${l==="en"?"Selected. Send your request now.":"تم الاختيار. أرسل طلبك الآن."}`,{inline_keyboard:[[cb(l==="en"?"🧠 Change":"🧠 تغيير المساعد","agents")],home(l)]})}
 if(data==="tools")return edit(env,chat,msgid,l==="en"?"🛠 Choose a tool, then send your content.":"🛠️ اختر الأداة ثم أرسل المحتوى.",toolsKb(l));
 if(data.startsWith("tool:")){const t=data.slice(5);if(!TOOLS[t])return;setMode(f.id,{tool:t});return edit(env,chat,msgid,l==="en"?"✅ Tool selected. Send your request now.":"✅ تم اختيار الأداة. أرسل طلبك الآن.",{inline_keyboard:[[cb(l==="en"?"🛠 Change Tool":"🛠️ تغيير الأداة","tools")],home(l)]})}
 if(data==="gift"){try{const g=await gift(env,f.id);const text=g?.ok?(l==="en"?`🎁 You received ${g.gift} bonus credits!\n🔥 Streak: ${g.streak}\n⭐ Balance: ${g.credits_balance}`:`🎁 حصلت على ${g.gift} أرصدة إضافية!\n🔥 الاستمرار: ${g.streak} يوم\n⭐ رصيدك: ${g.credits_balance}`):(l==="en"?"🎁 You've already claimed today's gift.":"🎁 استلمت هدية اليوم بالفعل.");return edit(env,chat,msgid,text,{inline_keyboard:[home(l)]})}catch{return edit(env,chat,msgid,l==="en"?"Couldn't claim the gift now.":"تعذر استلام الهدية حاليًا.",{inline_keyboard:[home(l)]})}}
 if(data==="projects")return showProjects(env,chat,f.id,l,msgid);
 if(data==="project:new"){setMode(f.id,{tool:"__create_project"});return edit(env,chat,msgid,l==="en"?"➕ Send the project name now.":"➕ أرسل اسم المشروع الآن.",{inline_keyboard:[home(l)]})}
 if(data==="credits"){try{const b=await boot(env,f);return edit(env,chat,msgid,creditText(userOf(b),l),{inline_keyboard:[[cb(l==="en"?"💎 Plans":"💎 الخطط","plans")],home(l)]})}catch{return edit(env,chat,msgid,l==="en"?"Couldn't load credits.":"تعذر تحميل الرصيد.",{inline_keyboard:[home(l)]})}}
 if(data==="plans")return edit(env,chat,msgid,l==="en"?`💎 Plans\n\n🆓 Free: ${FREE_DAILY_LIMIT} uses/day\n✨ Plus: 700 credits — 250 Telegram Stars\n🚀 Pro: 2500 credits — 650 Telegram Stars\n\nPurchasing appears only after payment is fully enabled.`:`💎 الخطط\n\n🆓 المجانية: ${FREE_DAILY_LIMIT} استخدامًا يوميًا\n✨ Plus: 700 رصيد — 250 نجمة تيليجرام\n🚀 Pro: 2500 رصيد — 650 نجمة تيليجرام\n\nلن يظهر الشراء إلا بعد تفعيل الدفع بالكامل.`,{inline_keyboard:[home(l)]});
 if(data==="referral"){try{const b=await boot(env,f),code=s(userOf(b)?.referral_code);if(!code)throw 0;const link=`https://t.me/${BOT_USERNAME}?start=${encodeURIComponent(code)}`;const share=`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(l==="en"?"Try Anjezli AI 🤖":"جرّب أنجز لي AI 🤖")}`;return edit(env,chat,msgid,(l==="en"?"👥 Invite a new user and earn 5 bonus credits.":"👥 ادعُ مستخدمًا جديدًا واكسب 5 أرصدة إضافية.")+`\n\n${link}`,{inline_keyboard:[[urlb(l==="en"?"📤 Share":"📤 مشاركة الدعوة",share)],home(l)]})}catch{return edit(env,chat,msgid,l==="en"?"Couldn't create your invite link.":"تعذر إنشاء رابط الدعوة.",{inline_keyboard:[home(l)]})}}
 if(data==="language")return edit(env,chat,msgid,"🌐 Language / اللغة",{inline_keyboard:[[cb("🇸🇦 العربية","lang:ar"),cb("🇬🇧 English","lang:en")],[cb("🌐 تلقائي / Auto","lang:auto")],home(l)]});
 if(data.startsWith("lang:")){const x=data.slice(5);if(!["ar","en","auto"].includes(x))return;setMode(f.id,{lang:x});const nl=x==="en"?"en":"ar";return edit(env,chat,msgid,x==="en"?"✅ Language changed to English.":x==="ar"?"✅ تم تغيير اللغة إلى العربية.":"✅ تم تفعيل اختيار اللغة تلقائيًا.",main(nl))}
 if(data==="help")return edit(env,chat,msgid,l==="en"?"❓ Send any request directly, or choose Assistants, AI Tools, Projects, Daily Gift, Invite & Earn, or Credits.\n\nCommands: /start /help /plan /projects /id":"❓ أرسل أي طلب مباشرة، أو استخدم المساعدين وأدوات AI والمشاريع والهدية والدعوات والرصيد.\n\nالأوامر: /start /help /plan /projects /id",{inline_keyboard:[home(l)]});
}

async function message(env,m){
 const f=m.from,chat=m.chat?.id,text=s(m.text).trim();if(!f||!chat)return;if(!text)return send(env,chat,"حاليًا أرسل طلبك كنص.",main("ar"));
 let ref=null;if(text.startsWith("/start"))ref=text.split(/\s+/)[1]||null;let b=null;try{b=await boot(env,f,ref)}catch(e){console.error("bootstrap",e)}
 const l=lang(f.id,text);
 if(text.startsWith("/start"))return send(env,chat,welcome(f.first_name,l),main(l));
 if(text==="/help")return send(env,chat,l==="en"?"Send any request directly or choose a section from the menu.":"أرسل أي طلب مباشرة أو اختر قسمًا من القائمة.",main(l));
 if(text==="/id")return send(env,chat,`Telegram ID: ${f.id}`,{inline_keyboard:[home(l)]});
 if(text==="/plan"||text==="/credits")return send(env,chat,creditText(userOf(b),l),{inline_keyboard:[home(l)]});
 if(text==="/projects")return showProjects(env,chat,f.id,l);
 const md=mode(f.id);if(md.tool==="__create_project"){try{const p=await newProject(env,f.id,text);setMode(f.id,{tool:null});return send(env,chat,(l==="en"?"✅ Project created: ":"✅ تم إنشاء المشروع: ")+s(p?.title||text),{inline_keyboard:[[cb(l==="en"?"📁 Projects":"📁 مشاريعي","projects")],home(l)]})}catch{return send(env,chat,l==="en"?"Couldn't create the project.":"تعذر إنشاء المشروع.",{inline_keyboard:[home(l)]})}}
 return ask(env,chat,f,text);
}

async function update(env,u){if(u.callback_query)return callback(env,u.callback_query);if(u.message)return message(env,u.message)}

export default{
 async fetch(request,env,ctx){
  const u=new URL(request.url);
  if(request.method==="GET"&&u.pathname==="/")return new Response("ANJEZLI AI READY",{headers:{"content-type":"text/plain; charset=utf-8"}});
  if(request.method==="GET"&&u.pathname==="/health")return Response.json({ok:true,service:"anjezli-ai",model:AI_MODEL,telegram_token:!!env.TELEGRAM_BOT_TOKEN,worker_secret:!!env.ANJEZLI_WORKER_SECRET,cloudflare_ai_token:!!env.CLOUDFLARE_AI_TOKEN,cloudflare_account_id:!!env.CLOUDFLARE_ACCOUNT_ID,free_daily_limit:FREE_DAILY_LIMIT});
  if(request.method==="POST"&&u.pathname==="/telegram"){try{const body=await request.json();ctx.waitUntil(update(env,body).catch(console.error));return new Response("OK")}catch(e){console.error(e);return new Response("OK")}}
  return new Response("Not Found",{status:404});
 }
};