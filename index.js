const SUPABASE_URL="https://ujnsqwefeilffsxefmbj.supabase.co";
const SUPABASE_KEY="sb_publishable_9h7gRWVjtTK-DAe1jdFujw_KD3bFeS2";
const AI_MODEL="@cf/meta/llama-3.1-8b-instruct";
const BOT_USERNAME="AnjezliAI_bot";
const DEVELOPER_USERNAME="apwonoaf4";
const FREE_DAILY_LIMIT=30;

const SYSTEM=`أنت "أنجز لي AI"، مساعد ذكاء اصطناعي عربي احترافي متعدد المهام، برمجك وطوّرك المهندس أبو نواف.
افهم طلب المستخدم كاملًا قبل الإجابة، وحافظ على جميع التفاصيل والشروط. أجب بالعربية افتراضيًا، إلا إذا طلب المستخدم لغة أخرى صراحة.
لا تخترع معلومات أو مصادر أو إمكانات غير متاحة. أعط نتيجة عملية واضحة ومتكاملة، وتجنب الحشو والتكرار.
إذا سأل المستخدم: من أنت؟ عرّف نفسك باسم "أنجز لي AI" واذكر أنك بُرمجت وطُورت بواسطة المهندس أبو نواف، وأنك تساعد في المحتوى والتصميم والبرومبتات والتسويق والبرمجة والدراسة والأعمال والتحليل.
إذا طلب التواصل مع المطور، وجّهه إلى Telegram: @apwonoaf4.
عند طلب برومبت: أنشئ برومبتًا احترافيًا جاهزًا للنسخ يحافظ على كل المتطلبات، ويضيف فقط التفاصيل المناسبة للمهمة.
في البرمجة: اكتب حلولًا صحيحة وواضحة ولا تخترع APIs. في التسويق: لا تضمن نتائج. في التعليم: اشرح بوضوح.
استخدم نص Telegram نظيفًا، ولا تستخدم Markdown مزخرفًا إلا عند الحاجة للكود.`;

const AGENTS={
 universal:["✨ المساعد العام","تعامل باحتراف مع الأسئلة والكتابة والتخطيط والتحليل والمهام العامة."],
 prompt:["🪄 مهندس البرومبتات","حوّل طلب المستخدم إلى برومبت احترافي متكامل جاهز للنسخ مع الحفاظ على كل شروطه."],
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

const s=v=>v==null?"":String(v);
const isAr=t=>/[\u0600-\u06FF]/.test(s(t));
const clean=t=>s(t).trim().replace(/\*\*(.*?)\*\*/gs,"$1").replace(/^#{1,6}\s+/gm,"").replace(/\n{4,}/g,"\n\n");
const parts=(t,n=3900)=>{t=s(t);const a=[];while(t.length>n){let i=t.lastIndexOf("\n",n);if(i<n*.55)i=t.lastIndexOf(" ",n);if(i<n*.55)i=n;a.push(t.slice(0,i).trim());t=t.slice(i).trim()}if(t)a.push(t);return a};

async function tg(env,method,body={}){
 const r=await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
 const d=await r.json().catch(()=>null);
 if(!r.ok||!d?.ok)throw new Error(`Telegram ${method}: ${r.status} ${JSON.stringify(d)}`);
 return d.result;
}
async function send(env,chat,text,reply_markup){
 const a=parts(text); for(let i=0;i<a.length;i++){const b={chat_id:chat,text:a[i],disable_web_page_preview:true};if(reply_markup&&i===a.length-1)b.reply_markup=reply_markup;await tg(env,"sendMessage",b)}
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
 if(!env.CLOUDFLARE_ACCOUNT_ID||!env.CLOUDFLARE_AI_TOKEN)throw new Error("AI configuration missing");
 const endpoint=`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${AI_MODEL}`;
 const r=await fetch(endpoint,{method:"POST",headers:{Authorization:`Bearer ${env.CLOUDFLARE_AI_TOKEN}`,"Content-Type":"application/json"},body:JSON.stringify({messages,max_tokens:1800,temperature:0.65})});
 const raw=await r.text(); let d=null; try{d=raw?JSON.parse(raw):null}catch{}
 if(!r.ok||d?.success===false){console.error("Workers AI HTTP",r.status,raw.slice(0,1200));throw new Error(`Workers AI HTTP ${r.status}`)}
 const out=d?.result?.response??d?.result?.text??d?.response??d?.text??(typeof d?.result==="string"?d.result:"");
 if(!out){console.error("Workers AI empty",raw.slice(0,1200));throw new Error("Empty AI output")}
 return clean(out);
}

const cb=(text,callback_data)=>({text,callback_data});
const urlb=(text,url)=>({text,url});
const home=()=>[cb("🏠 الرئيسية","home")];
const main=()=>({inline_keyboard:[
 [cb("✨ أنجز لي","assistant"),cb("🧠 المساعدون","agents")],
 [cb("🛠️ أدوات AI","tools"),cb("📁 مشاريعي","projects")],
 [cb("🎁 الهدية اليومية","gift"),cb("👥 دعوة واكسب","referral")],
 [cb("⭐ خطتي ورصيدي","credits"),cb("🌐 اللغة","language")],
 [cb("❓ المساعدة","help")],
 [cb("👨‍💻 المطور","developer"),urlb("📞 تواصل معي",`https://t.me/${DEVELOPER_USERNAME}`)]
]});
const agentKb=()=>({inline_keyboard:[
 [cb(AGENTS.universal[0],"agent:universal"),cb(AGENTS.prompt[0],"agent:prompt")],
 [cb(AGENTS.content[0],"agent:content"),cb(AGENTS.marketing[0],"agent:marketing")],
 [cb(AGENTS.ads[0],"agent:ads"),cb(AGENTS.design[0],"agent:design")],
 [cb(AGENTS.coding[0],"agent:coding"),cb(AGENTS.study[0],"agent:study")],
 [cb(AGENTS.business[0],"agent:business"),cb(AGENTS.analysis[0],"agent:analysis")],home()
]});
const toolsKb=()=>({inline_keyboard:[
 [cb("✨ تحسين النص","tool:improve"),cb("📝 تلخيص","tool:summarize")],
 [cb("🌐 ترجمة","tool:translate"),cb("💡 أفكار محتوى","tool:ideas")],
 [cb("🎯 هوكس","tool:hooks"),cb("📱 كابتشن","tool:captions")],
 [cb("👉 CTA","tool:cta"),cb("🛍 وصف منتج","tool:product")],
 [cb("🎬 سيناريو","tool:script"),cb("🪄 برومبت احترافي","tool:prompt")],home()
]});
const welcome=name=>`حياك ${name||""} 👋

أنا أنجز لي AI — مساعدك الذكي لإنجاز المهام.
تم برمجتي وتطويري بواسطة المهندس أبو نواف.

لديك ${FREE_DAILY_LIMIT} استخدامًا مجانيًا يوميًا.

أرسل طلبك مباشرة أو اختر من الأقسام بالأسفل.`;
const userOf=b=>b?.user&&typeof b.user==="object"?b.user:(b?.telegram_id?b:null);
const creditText=u=>{const used=Number(u?.daily_used||0),bal=Number(u?.credits_balance||0),rem=Math.max(0,FREE_DAILY_LIMIT-used),p=u?.plan||"free";return `⭐ خطتي ورصيدي

الخطة: ${p==="free"?"المجانية":p}
الاستخدام اليومي: ${used}/${FREE_DAILY_LIMIT}
المتبقي اليوم: ${rem}
الرصيد الإضافي: ${bal}`};

function sessionFromUser(u){return{agent:u?.active_agent||"universal",tool:u?.pending_tool||null,lang:u?.ui_language||"ar"}}
async function state(env,id,patch){
 try{return await rpc(env,"anjezli_worker_set_state",{p_telegram_id:id,p_active_agent:patch.agent??null,p_ui_language:patch.lang??null,p_pending_tool:patch.tool===undefined?null:patch.tool})}
 catch(e){console.error("set_state",e);return null}
}

async function ask(env,chat,f,text,b){
 const u=userOf(b)||{},m=sessionFromUser(u),agent=AGENTS[m.agent]||AGENTS.universal;
 await tg(env,"sendChatAction",{chat_id:chat,action:"typing"}).catch(()=>{});
 let q;try{q=await consume(env,f.id,m.agent)}catch(e){console.error("consume",e);return send(env,chat,"تعذر التحقق من رصيد الاستخدام. جرّب بعد قليل.",main())}
 if(q?.ok===false)return send(env,chat,"انتهت استخدامات اليوم المجانية ولا يوجد رصيد إضافي كافٍ.",main());
 const h=await recent(env,f.id);const hist=Array.isArray(h)?h.filter(x=>["user","assistant"].includes(x?.role)&&typeof x.content==="string").slice(-8).map(x=>({role:x.role,content:x.content})):[];
 const tool=m.tool&&TOOLS[m.tool]?TOOLS[m.tool]:"";
 const sys=SYSTEM+"\n\nالدور المتخصص: "+agent[1]+(tool?"\n\nالأداة الحالية: "+tool:"")+"\nأجب بالعربية إلا إذا طلب المستخدم غير ذلك صراحة.";
 await save(env,f.id,"user",text,m.agent,1);
 try{
  const out=await ai(env,[{role:"system",content:sys},...hist,{role:"user",content:text}]);
  await save(env,f.id,"assistant",out,m.agent,0); if(m.tool)await state(env,f.id,{tool:null});
  return send(env,chat,out,{inline_keyboard:[home()]});
 }catch(e){console.error("AI_REQUEST_FAILED",e?.message||e);return send(env,chat,"تعذر إكمال طلب الذكاء الاصطناعي حاليًا. تم تسجيل سبب الخطأ للمراجعة. جرّب مرة أخرى بعد قليل.",main())}
}

async function showProjects(env,chat,id,msgid){
 let p=[];try{const x=await projects(env,id);if(Array.isArray(x))p=x}catch(e){console.error("projects",e)}
 const text="📁 مشاريعي\n\n"+(p.length?p.slice(0,20).map((x,i)=>`${i+1}. ${s(x.title)}`).join("\n"):"ما عندك مشاريع حتى الآن.")+"\n\nلإنشاء مشروع استخدم الأمر:\n/newproject اسم المشروع";
 const k={inline_keyboard:[home()]};return msgid?edit(env,chat,msgid,text,k):send(env,chat,text,k);
}

async function callback(env,q){
 const f=q.from,chat=q.message?.chat?.id,msgid=q.message?.message_id,data=q.data||"";if(!chat)return;
 await tg(env,"answerCallbackQuery",{callback_query_id:q.id}).catch(()=>{});
 let b=null;try{b=await boot(env,f)}catch(e){console.error("callback bootstrap",e)}
 if(data==="home")return edit(env,chat,msgid,welcome(f.first_name),main());
 if(data==="assistant"){await state(env,f.id,{agent:"universal",tool:null});return edit(env,chat,msgid,"✨ تم اختيار المساعد العام. أرسل طلبك الآن.",{inline_keyboard:[home()]})}
 if(data==="agents")return edit(env,chat,msgid,"🧠 اختر المساعد المتخصص:",agentKb());
 if(data.startsWith("agent:")){const a=data.slice(6);if(!AGENTS[a])return;await state(env,f.id,{agent:a,tool:null});return edit(env,chat,msgid,`${AGENTS[a][0]}

تم الاختيار. أرسل طلبك الآن.`,{inline_keyboard:[[cb("🧠 تغيير المساعد","agents")],home()]})}
 if(data==="tools")return edit(env,chat,msgid,"🛠️ اختر الأداة ثم أرسل المحتوى.",toolsKb());
 if(data.startsWith("tool:")){const t=data.slice(5);if(!TOOLS[t])return;await state(env,f.id,{tool:t});return edit(env,chat,msgid,"✅ تم اختيار الأداة. أرسل طلبك الآن.",{inline_keyboard:[[cb("🛠️ تغيير الأداة","tools")],home()]})}
 if(data==="gift"){try{const g=await gift(env,f.id);const text=g?.ok?`🎁 حصلت على ${g.gift} أرصدة إضافية!
🔥 الاستمرار: ${g.streak} يوم
⭐ رصيدك: ${g.credits_balance}`:"🎁 استلمت هدية اليوم بالفعل.";return edit(env,chat,msgid,text,{inline_keyboard:[home()]})}catch(e){console.error("gift",e);return edit(env,chat,msgid,"تعذر استلام الهدية حاليًا.",{inline_keyboard:[home()]})}}
 if(data==="projects")return showProjects(env,chat,f.id,msgid);
 if(data==="credits"){try{const x=b||await boot(env,f);return edit(env,chat,msgid,creditText(userOf(x)),{inline_keyboard:[[cb("💎 الخطط","plans")],home()]})}catch{return edit(env,chat,msgid,"تعذر تحميل الرصيد.",{inline_keyboard:[home()]})}}
 if(data==="plans")return edit(env,chat,msgid,`💎 الخطط

🆓 المجانية: ${FREE_DAILY_LIMIT} استخدامًا يوميًا
✨ Plus: 700 رصيد — 250 نجمة تيليجرام
🚀 Pro: 2500 رصيد — 650 نجمة تيليجرام

لن يظهر الشراء إلا بعد تفعيل الدفع بالكامل.`,{inline_keyboard:[home()]});
 if(data==="referral"){try{const x=b||await boot(env,f),code=s(userOf(x)?.referral_code);if(!code)throw 0;const link=`https://t.me/${BOT_USERNAME}?start=${encodeURIComponent(code)}`;const share=`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent("جرّب أنجز لي AI 🤖")}`;return edit(env,chat,msgid,`👥 ادعُ مستخدمًا جديدًا واكسب 5 أرصدة إضافية.

${link}`,{inline_keyboard:[[urlb("📤 مشاركة الدعوة",share)],home()]})}catch{return edit(env,chat,msgid,"تعذر إنشاء رابط الدعوة.",{inline_keyboard:[home()]})}}
 if(data==="language")return edit(env,chat,msgid,"🌐 لغة الواجهة الحالية: العربية\n\nالواجهة العربية هي الافتراضية. ويمكنك طلب الإجابة بأي لغة داخل رسالتك.",{inline_keyboard:[home()]});
 if(data==="help")return edit(env,chat,msgid,"❓ طريقة الاستخدام\n\nأرسل طلبك مباشرة، أو اختر المساعد المتخصص أو إحدى أدوات AI.\n\nالأوامر:\n/start\n/help\n/plan\n/projects\n/newproject اسم المشروع\n/id\n\nللتواصل مع المطور: @apwonoaf4",{inline_keyboard:[[urlb("📞 تواصل مع أبو نواف",`https://t.me/${DEVELOPER_USERNAME}`)],home()]});
 if(data==="developer")return edit(env,chat,msgid,"👨‍💻 مطور أنجز لي AI\n\nتمت برمجة وتطوير البوت بواسطة المهندس أبو نواف.\n\nيهدف أنجز لي AI إلى جمع المساعدة الذكية للكتابة، البرومبتات، التسويق، التصميم، البرمجة، الدراسة، الأعمال والتحليل في بوت واحد سهل الاستخدام.\n\nTelegram: @apwonoaf4",{inline_keyboard:[[urlb("📞 تواصل مع أبو نواف",`https://t.me/${DEVELOPER_USERNAME}`)],home()]});
}

async function message(env,m){
 const f=m.from,chat=m.chat?.id,text=s(m.text).trim();if(!f||!chat)return;if(!text)return send(env,chat,"حاليًا أرسل طلبك كنص.",main());
 let ref=null;if(text.startsWith("/start"))ref=text.split(/\s+/)[1]||null;
 let b=null;try{b=await boot(env,f,ref)}catch(e){console.error("bootstrap",e);return send(env,chat,"تعذر الاتصال بقاعدة البيانات حاليًا. جرّب بعد قليل.",main())}
 if(text.startsWith("/start"))return send(env,chat,welcome(f.first_name),main());
 if(text==="/help")return send(env,chat,"أرسل أي طلب مباشرة أو اختر قسمًا من القائمة. للتواصل مع المطور: @apwonoaf4",main());
 if(text==="/id")return send(env,chat,`Telegram ID: ${f.id}`,{inline_keyboard:[home()]});
 if(text==="/plan"||text==="/credits")return send(env,chat,creditText(userOf(b)),{inline_keyboard:[home()]});
 if(text==="/projects")return showProjects(env,chat,f.id);
 if(text.startsWith("/newproject")){
  const title=text.replace(/^\/newproject\s*/,"").trim();if(!title)return send(env,chat,"اكتب اسم المشروع بعد الأمر، مثال:\n/newproject مشروع المحتوى",{inline_keyboard:[home()]});
  try{const p=await newProject(env,f.id,title);return send(env,chat,"✅ تم إنشاء المشروع: "+s(p?.title||title),{inline_keyboard:[[cb("📁 مشاريعي","projects")],home()]})}catch(e){console.error("new project",e);return send(env,chat,"تعذر إنشاء المشروع حاليًا.",{inline_keyboard:[home()]})}
 }
 return ask(env,chat,f,text,b);
}

async function update(env,u){if(u.callback_query)return callback(env,u.callback_query);if(u.message)return message(env,u.message)}

export default{
 async fetch(request,env,ctx){
  const u=new URL(request.url);
  if(request.method==="GET"&&u.pathname==="/")return new Response("ANJEZLI AI READY",{headers:{"content-type":"text/plain; charset=utf-8"}});
  if(request.method==="GET"&&u.pathname==="/health")return Response.json({ok:true,service:"anjezli-ai",model:AI_MODEL,telegram_token:!!env.TELEGRAM_BOT_TOKEN,worker_secret:!!env.ANJEZLI_WORKER_SECRET,cloudflare_ai_token:!!env.CLOUDFLARE_AI_TOKEN,cloudflare_account_id:!!env.CLOUDFLARE_ACCOUNT_ID,free_daily_limit:FREE_DAILY_LIMIT});
  if(request.method==="POST"&&u.pathname==="/telegram"){try{const body=await request.json();await update(env,body);return new Response("OK")}catch(e){console.error("TELEGRAM_UPDATE_FAILED",e?.stack||e);return new Response("OK")}}
  return new Response("Not Found",{status:404});
 }
};