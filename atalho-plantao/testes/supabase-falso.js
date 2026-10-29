(function(){
  const LS='fake-sb-db';
  const load=()=>{try{return JSON.parse(localStorage.getItem(LS))||{perfis:{},locais:[],plantoes:[],calls:[]}}catch(e){return {perfis:{},locais:[],plantoes:[],calls:[]}}};
  const save=d=>localStorage.setItem(LS,JSON.stringify(d));
  const UID='aaaaaaaa-0000-0000-0000-000000000001';
  window.__fake={load,save,UID};
  function liberado(p){const h=new Date().toISOString().slice(0,10);return (p.status==='teste'&&p.teste_ate>=h)||(p.pago_ate&&p.pago_ate>=h);}
  class Q{constructor(t){this.t=t;this.f=[];this.op='select';}
    select(){this.op=this.op==='select'?'select':this.op;return this}
    eq(k,v){this.f.push(r=>r[k]===v);return this} in(k,vs){this.f.push(r=>vs.includes(r[k]));return this}
    order(){return this} maybeSingle(){this.single=true;return this}
    update(o){this.op='update';this.val=o;return this} upsert(rows){this.op='upsert';this.val=rows;return this} delete(){this.op='delete';return this}
    then(ok,ko){return Promise.resolve(this.run()).then(ok,ko)}
    run(){const d=load();d.calls.push({t:this.t,op:this.op,n:Array.isArray(this.val)?this.val.length:1});
      const sess=JSON.parse(localStorage.getItem('fake-sess')||'null'); const uid=sess&&sess.user.id;
      if(this.t==='perfis'){const rows=Object.values(d.perfis).filter(r=>r.id===uid).filter(r=>this.f.every(f=>f(r)));
        if(this.op==='update'){const bad=Object.keys(this.val).some(k=>!['nome','iniciado'].includes(k)); if(bad){save(d);return {error:{code:'42501',message:'permission denied'}}} rows.forEach(r=>Object.assign(r,this.val)); save(d); return {error:null,data:null}}
        save(d); return {error:null,data:this.single?(rows[0]||null):rows}}
      const tab=d[this.t]; const mine=tab.filter(r=>r.user_id===uid);
      if(this.op==='select'){save(d);return {error:null,data:mine.filter(r=>this.f.every(f=>f(r)))}}
      if(this.op==='upsert'){ if(!liberado(d.perfis[uid])){save(d);return {error:{code:'42501',message:'new row violates row-level security policy'}}}
        if(window.__offline){save(d);return {error:{code:'',message:'Failed to fetch'}}}
        for(const r of this.val){const i=tab.findIndex(x=>x.user_id===r.user_id&&x.id===r.id); if(i>=0)tab[i]=r; else tab.push(r)} save(d); return {error:null}}
      if(this.op==='delete'){d[this.t]=tab.filter(r=>!(r.user_id===uid&&this.f.every(f=>f(r)))); save(d); return {error:null}}
    }}
  window.supabase={createClient(){const listeners=[];
    const emit=(ev,s)=>listeners.forEach(fn=>fn(ev,s));
    return {
      auth:{
        getSession:async()=>({data:{session:JSON.parse(localStorage.getItem('fake-sess')||'null')}}),
        onAuthStateChange(fn){listeners.push(fn);return {data:{subscription:{unsubscribe(){}}}}},
        signInWithOtp:async({email})=>{window.__otpEmail=email;return {error:null}},
        verifyOtp:async({email,token})=>{ if(token!=='123456')return {error:{message:'Token has expired or is invalid'}};
          const s={user:{id:UID,email}}; localStorage.setItem('fake-sess',JSON.stringify(s));
          const d=load(); if(!d.perfis[UID]){const t=new Date();t.setDate(t.getDate()+14);d.perfis[UID]={id:UID,nome:'',status:'teste',teste_ate:t.toISOString().slice(0,10),pago_ate:null,asaas_subscription_id:null,iniciado:false};save(d)}
          setTimeout(()=>emit('SIGNED_IN',s),0); return {data:{session:s},error:null}},
        signOut:async()=>{localStorage.removeItem('fake-sess');setTimeout(()=>emit('SIGNED_OUT',null),0);return {error:null}},
        signInWithOAuth:async()=>({error:null})
      },
      from:t=>new Q(t),
      rpc:async(fn,args)=>{const d=load();d.calls.push({fn,args});d.contas=d.contas||[];
        const sess=JSON.parse(localStorage.getItem('fake-sess')||'null');const admin=!!sess&&sess.user.email==='drfabioschmidt@gmail.com';
        if(fn==='eh_admin'){save(d);return {data:admin,error:null}}
        if(!admin){save(d);return {data:null,error:{code:'42501',message:'sem permissão'}}}
        if(fn==='listar_contas'){save(d);return {data:d.contas,error:null}}
        if(fn==='liberar_acesso'){const e=args.p_email;if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e))return {data:null,error:{message:'e-mail inválido'}};
          let c=d.contas.find(x=>x.email===e);if(!c){c={email:e,criado_em:new Date().toISOString(),teste_ate:null,liberado:false,pendente:true};d.contas.push(c)}
          c.liberado=args.p_liberar;if(sess.user.email===e){d.perfis[UID].pago_ate=args.p_liberar?'2999-12-31':null;d.perfis[UID].status=args.p_liberar?'ativa':'teste'}
          save(d);return {data:args.p_liberar?(c.pendente?'pendente':'liberado'):'retirado',error:null}}
        return {data:null,error:{message:'?'}}},
      functions:{invoke:async(nome,{body})=>{const d=load();d.calls.push({fn:nome,body});save(d);
        if(nome==='assinatura'&&body.acao==='assinar'){ if(!body.cpfCnpj)return {data:null,error:{context:{json:async()=>({erro:'Digite um CPF'})}}}; d.perfis[UID].asaas_subscription_id='sub_1';save(d);return {data:{url:'https://sandbox.asaas.com/i/abc'},error:null}}
        return {data:{ok:true},error:null}}}
    }}};
})();
