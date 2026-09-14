import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import {initializeApp} from "firebase/app";
import {getFirestore,doc,getDoc,setDoc,serverTimestamp} from "firebase/firestore";
import {Home,Target,PlayCircle,Users,Wallet,Headphones,Gift,ArrowUpRight,History,ChevronRight,ShieldCheck,Zap,Menu,X} from "lucide-react";
import "./styles.css";

const firebaseConfig={
 apiKey:"AIzaSyCh6JY-myXiqosLPd0x38TVqfOKeMzxb6A",
 authDomain:"earnx-e873d.firebaseapp.com",
 projectId:"earnx-e873d",
 storageBucket:"earnx-e873d.firebasestorage.app",
 messagingSenderId:"237247068603",
 appId:"1:237247068603:web:111cda0e4d9433c67cac9e",
 measurementId:"G-RS1Z0TCZN5"
};
const db=getFirestore(initializeApp(firebaseConfig));
const nav=[["home","Home",Home],["missions","Missions",Target],["earn","Earn",PlayCircle],["team","Team",Users],["wallet","Wallet",Wallet]];
const missions=[["Watch 5 ads","3 / 5",30],["Complete 3 tasks","1 / 3",50],["Invite 2 friends","0 / 2",100]];
const tx=[["Ad reward","+10 pts","Today"],["Task completed","+50 pts","Yesterday"],["Withdrawal","-₹25.00","12 Sep"]];

function telegramUser(){
 const u=window.Telegram?.WebApp?.initDataUnsafe?.user;
 return u||{id:"demo",first_name:"Guest",username:"guest"};
}
async function ensureUser(){
 const u=telegramUser(), id=String(u.id), ref=doc(db,"users",id), snap=await getDoc(ref);
 if(!snap.exists()) await setDoc(ref,{telegramId:id,firstName:u.first_name||"",lastName:u.last_name||"",username:u.username||"",points:0,balance:0,referralCode:"EX"+id.slice(-6).toUpperCase(),referredBy:null,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
 else await setDoc(ref,{updatedAt:serverTimestamp()},{merge:true});
 return (await getDoc(ref)).data();
}

function App(){
 const [page,setPage]=useState("home"),[menu,setMenu]=useState(false),[user,setUser]=useState(null);
 useEffect(()=>{window.Telegram?.WebApp?.ready?.();window.Telegram?.WebApp?.expand?.();ensureUser().then(setUser).catch(console.error)},[]);
 const go=p=>{setPage(p);setMenu(false)};
 return <div className="app"><header><div className="brand"><div className="logo">E</div><div><b>EARNX</b><span>Earn smarter</span></div></div><button className="icon" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header>
 {menu&&<div className="drawer"><button onClick={()=>go("bonus")}><Gift/>Daily Bonus</button><button onClick={()=>go("support")}><Headphones/>Customer Service</button><button onClick={()=>go("transactions")}><History/>Transactions</button></div>}
 <main>{page==="home"&&<HomePage go={go} user={user}/>} {page==="missions"&&<Missions/>} {page==="earn"&&<Earn/>} {page==="team"&&<Team/>} {page==="wallet"&&<WalletPage go={go}/>} {page==="transactions"&&<Transactions/>} {page==="bonus"&&<Bonus/>} {page==="support"&&<Support/>} {page==="withdraw"&&<Withdraw/>}</main>
 <nav className="bottom">{nav.map(([id,l,I])=><button className={page===id?"active":""} onClick={()=>go(id)} key={id}><I/><small>{l}</small></button>)}</nav></div>
}
function HomePage({go,user}){return <><section className="hero"><div className="hello">Welcome back {user?.firstName||"Guest"} 👋</div><h1>₹{Number(user?.balance||0).toFixed(2)}</h1><p>{user?.points||0} Points · 50 pts = ₹1</p><div className="streak">🔥 4 day earning streak</div></section><div className="grid2"><Card icon={<Zap/>} title="Quick Earn" text="Watch & complete" onClick={()=>go("earn")}/><Card icon={<Gift/>} title="Daily Bonus" text="Claim today's reward" onClick={()=>go("bonus")}/></div><section className="section"><div className="sectionHead"><h2>Today's Missions</h2><button onClick={()=>go("missions")}>View all <ChevronRight/></button></div>{missions.slice(0,2).map(m=><Mission m={m} key={m[0]}/>)}</section><section className="trust"><ShieldCheck/><div><b>Safe & transparent rewards</b><span>Track every earning and withdrawal.</span></div></section></>}
function Card({icon,title,text,onClick}){return <button className="card" onClick={onClick}><div className="cardIcon">{icon}</div><b>{title}</b><span>{text}</span><ArrowUpRight/></button>}
function Mission({m}){let a=+m[1].split(" / ")[0],b=+m[1].split(" / ")[1];return <div className="mission"><div className="micon"><Target/></div><div className="mtext"><b>{m[0]}</b><span>{m[1]} · +{m[2]} pts</span><div className="bar"><i style={{width:(a/b*100)+"%"}}/></div></div></div>}
function Page({title,sub,children}){return <section className="page"><h1>{title}</h1><p className="sub">{sub}</p>{children}</section>}
function Missions(){return <Page title="Missions" sub="Complete goals and collect points.">{missions.map(m=><Mission m={m} key={m[0]}/>)}<div className="notice">Rewards are credited only after eligible task completion.</div></Page>}
function Earn(){return <Page title="Watch & Earn" sub="Earn points from supported Monetag ad formats."><div className="earnbox"><PlayCircle size={54}/><h2>Ready to earn?</h2><p>Watch an eligible ad and receive the configured reward.</p><button className="primary">WATCH AD</button><small>Ad frequency and availability are controlled by the ad network.</small></div></Page>}
function Team(){return <Page title="My Team" sub="Invite friends and grow your rewards."><div className="stats"><div><b>12</b><span>Friends</span></div><div><b>₹48</b><span>Earned</span></div></div><div className="ref"><span>Your referral link</span><b>t.me/EARNXBot?start=EX123456</b><button className="primary">INVITE FRIENDS</button></div></Page>}
function WalletPage({go}){return <Page title="Wallet" sub="Your earnings at a glance."><div className="wallet"><span>Available balance</span><strong>₹124.50</strong><p>6,225 Points</p><button className="primary" onClick={()=>go("withdraw")}>WITHDRAW</button></div><button className="listBtn" onClick={()=>go("transactions")}><History/>Transaction history <ChevronRight/></button><div className="notice">Minimum withdrawal: ₹25 · UPI / Paytm / PayPal</div></Page>}
function Transactions(){return <Page title="Transactions" sub="Recent wallet activity.">{tx.map(x=><div className="tx" key={x[0]}><div><b>{x[0]}</b><span>{x[2]}</span></div><strong className={x[1][0]==="-"?"minus":""}>{x[1]}</strong></div>)}</Page>}
function Bonus(){return <Page title="Daily Bonus" sub="Come back every day to keep your streak."><div className="bonus"><Gift size={56}/><h2>🎁 Mystery Bonus</h2><p>Claim your daily reward.</p><button className="primary">CLAIM BONUS</button></div></Page>}
function Support(){return <Page title="Customer Service" sub="We're here to help.">{["Contact Support","Withdrawal Help","Task Help","Ads Help","FAQ"].map((t,i)=><button className="supportRow" key={t}><Headphones/><div><b>{t}</b><span>{["Chat with our support team","Issues with your withdrawal","Task or reward not received","Ad or reward issue","Common questions"][i]}</span></div><ChevronRight/></button>)}</Page>}
function Withdraw(){return <Page title="Withdraw" sub="Choose your payment method."><div className="form"><label>Amount (minimum ₹25)<input placeholder="₹25.00"/></label><label>Method<select><option>UPI</option><option>Paytm</option><option>PayPal</option></select></label><label>Payment ID<input placeholder="Enter payment ID"/></label><button className="primary">SUBMIT REQUEST</button></div></Page>}
createRoot(document.getElementById("root")).render(<App/>);