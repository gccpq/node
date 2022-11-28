/*
抓lljb.yichengwangluo.net中请求包的Authorization和device

青龙格式export lljbapp='Authorization#device'

cron: 1 6 * * *

*/
const $ = new Env("乐乐计步");   // 1.名字改了
const ckName = "lljbapp";           // 2. 英文名字改一下
const { log } = console;
//-------------------- 一般不动变量区域 -------------------------------------      // 3. 不用管 
const notify = $.isNode() ? require("./sendNotify") : ""
const Notify = 1		 //0为关闭通知,1为打开通知,默认为1
let envSplitor = ["@", "\n"];
let ck = msg = ''
let hosts='https://lljb.yichengwangluo.net'
let userCookie = process.env[ckName];
let userList = []
let userIdx = 0
let userCount = 0
const debug = 0; 
//---------------------------------------------------------

// 6. 一整个class   就是完整的任务 
class UserInfo {
	constructor(str) { 			// 7. 构造函数  处理变量等    用 this 挂在对象上
		this.index = ++userIdx
    let info = str.split('#')
    this.token=info[0]
    this.oaid=info[1]
    this.herget={
                "accept": "application/json",
                "device": this.oaid,
                "oaid": this.oaid,
                "store": "qiliang",
                "version": "2",
                "platform": "1",
                "Authorization": this.token,
                "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 12; M2007J3SC Build/SKQ1.211006.001)",
                "Host": "lljb.yichengwangluo.net",
                "Connection": "Keep-Alive",
                "Accept-Encoding": "gzip"
    }
    this.herpost={
      "accept": "application/json",
                "device": this.oaid,
                "oaid": this.oaid,
                "store": "qiliang",
                "version": "2",
                "platform": "1",
                "Authorization": this.token,
                "Content-Type":"application/x-www-form-urlencoded",
                "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 12; M2007J3SC Build/SKQ1.211006.001)",
                "Host": "lljb.yichengwangluo.net",
                "Connection": "Keep-Alive",
                "Accept-Encoding": "gzip",
                "Content-Length":"0"
    }
       
}
async start(){
  try {
    console.log(`\n============= 账号[${this.index}] =============`)
    await this.user();
} catch(e) {
    console.log(e)
} finally {
}

}
async startt(){
  try {
    console.log(`开始执行任务：`)
    await this.indx();
    console.log(`开始执行闯关任务：`)
    await this.barrier();
    console.log(`领取气泡红包：`)
await this.qp()
    console.log(`开始执行提现任务：`)
    await this.exchange();
} catch(e) {
    console.log(e)
} finally {
}

}
async qp(){
  let qi=`${randomString2(2)}000.0`
  await this.load1();
  await wait(1);
  await this.showed1(qi);
  await wait(30)
  await this.completed1(qi);
await this.bubble();
}
async qp1(){
  let qi=`${randomString2(2)}000.0`
  await this.load1();
  await wait(1);
  await this.showed1(qi);
  await wait(30)
  await this.completed1(qi);
await this.bubble1()
}
async reward() {
  let path=`/api/v2/reward/sign`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              //body:``
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
             if(result.result.days>=result.result.ext_items[0].days){
              let id=result.result.ext_items[0].id
              await wait(1);
              await this.envelope(id)
             }
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async envelope(id) {
  let path=`/api/v2/reward/sign/red_envelope`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herpost,
              body:`id=${id}&lat=&lng=&root=0&sim=1&debug=0&model=M2007J3SC&power=0&vpn=0`
          }
          let result = await httpPost(urlobj)
          if(result.code ==0){
            console.log(`账号[${this.name}]：${result.result.message}`)
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async user() {
  let path=`/api/v2/member/profile`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
           this.name=result.result.nickname
       this.userid=result.result.uuid
              log(`用户名：${this.name} 用户id：${result.result.uuid} 金币：${result.result.point} 提现券：${result.result.ticket}`)
              if(result.result.point>=10000&&result.result.ticket>=1000){
                console.log(`账号[${this.name}]：金币，提现券足够开始签到提现`)
                await this.sign()
                await wait(2)
                await this.exchange();
              }else{
                await wait(2)
                await this.startt()
              }
         
          }else{
              console.log(`账号${this.index}：${result.message}`)
          }		
  }
async barrier() {
  let path=`/api/v2/reward/barrier/index`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
             // body:`type=1`
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
            let barr=result.result.barrier
             for(let num=0;num<barr.length;num++){
              if(barr[num].state==0){
                await wait(30)
                await this.barrier1(num+1)
              }
             }
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async barrier1(num) {
  let path=`/api/v2/reward/barrier/index`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herpost,
              body:`no=${num}&ticket=`
          }
          let result = await httpPost(urlobj)
          if(result.code ==0){
            log(`账号[${this.name}]：获得${result.result.coin}金币，${result.result.coupon}提现券`)
             
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async load1() {
  let path=`/api/v2/ads/action/load?class=10000&&channel=2&type=23`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              //body:``
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
             this.tid=result.result.tid
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async showed1(qi) {
  let path=`/api/v2/ads/action/showed?class=10000&channel=2&type=23&ecpm=${qi}&tid=${this.tid}`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              //body:``
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async completed1(qi) {
  let path=`/api/v2/ads/action/completed?class=10000&type=23&ticket=&ecpm=${qi}&tid=${this.tid}`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              //body:``
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
            
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async bubble() {
  let path=`/api/v2/reward/bubble2`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herpost,
              body:``
          }
          let result = await httpPost(urlobj)
          if(result.code ==0){
            log(`账号[${this.name}]：获得${result.result.coin}金币，${result.result.coupon}提现券`)
            await wait(90)
             await this.qp()
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async bubble1() {
  let path=`/api/v2/reward/bubble`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herpost,
              body:``
          }
          let result = await httpPost(urlobj)
          if(result.code ==0){
            log(`账号[${this.name}]：获得${result.result.coin}金币，${result.result.coupon}提现券`)
            await wait(90)
            await this.qp1()
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}

async indx() {
  let path=`/api/v2/zhuan/coupon`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herpost,
              body:``
          }
          let result = await httpPost(urlobj)
          if(result.code ==0){
            let it = result.result.items
            if(it[0].id==10&&it[0].st==0){
                console.log(`账号[${this.name}]：${it[0].text}`)
                await wait(2);
                await this.sign()
                await this.indx()
             }else if(it[1].id==9&&it[1].st==0){
              console.log(`账号[${this.name}]：${it[1].title}`)
              let qq = it[1].title
              let lo = qq.substring(25,26)
              let ll = qq.substring(34,36)
              for(let num=0;num<ll-lo;num++){
                let qi=`${randomString2(2)}000.0`
                await wait(91)
                await this.video();
                await wait(3);
                await this.load()
                await wait(1)
                await this.showed(qi)
                await wait(30)
                await this.completed(qi)
              }await this.indx()
             }else if(it[2].id==8&&it[2].st==0){
              console.log(`账号[${this.name}]：${it[2].title}`)
              let qq = it[2].rate
              let lo = qq.substring(0,1)
              let ll = qq.substring(2,4)
              for(let num=0;num<ll-lo;num++){
                await this.newscoin()
                await wait(15)
                await this.newscoin1()
                await wait(2)
              }
              console.log(`账号[${this.name}]：看资讯完成`)
              await this.indx()
             }else if(it[3].id==7&&it[3].st==0){
              console.log(`账号[${this.name}]：${it[3].title}`)
              let qq = it[3].rate
              let lo = qq.substring(0,1)
              let ll = qq.substring(2,4)
              for(let num=0;num<ll-lo;num++){
                await this.videocoin()
                await wait(15)
                await this.videocoin1()
                await wait(2)
              }
              console.log(`账号[${this.name}]：刷视频完成`)
              await this.indx()
             }else if(it[4].id==24&&it[4].st==0){
              console.log(`账号[${this.name}]：${it[4].title}`)
              let qq = it[4].rate
              let lo = qq.substring(0,1)
              let ll = qq.substring(2,4)
              for(let num=0;num<ll-lo;num++){
                await this.count()
                await wait(30)
              
              }
              console.log(`账号[${this.name}]：阅读文章完成`)
              await this.indx()
             }else if(it[5].id==21&&it[5].st==0){
              console.log(`账号[${this.name}]：${it[5].title}`)
                await this.kan()
              await this.indx()
              console.log(`账号[${this.name}]：看看赚完成`)
             }
                else if(it[2].id==8&&it[2].st==1){
             
              await this.done('8')
              console.log(`账号[${this.name}]：领取看资讯奖励完成`)
              await wait(3)
              await this.indx()
             }else if(it[3].id==7&&it[3].st==1){
              await this.done('7')
              console.log(`账号[${this.name}]：领取刷视频奖励完成`)
              await wait(3)
              await this.indx()
             }else if(it[4].id==24&&it[4].st==1){
              await this.done('24')
              console.log(`账号[${this.name}]：领取阅读文章奖励完成`)
              await wait(3)
              await this.indx()
             }else if(it[5].id==21&&it[5].st==1){
              await this.done('21')
              console.log(`账号[${this.name}]：领取看看赚奖励完成`)
              await wait(3)
              await this.indx()
             }else{
              console.log(`账号[${this.name}]：日常任务已完成`)
             }
              
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async sign() {
  let path=`/api/v2/reward/sign`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herpost,
              body:``
          }
          let result = await httpPost(urlobj)
          if(result.code ==0){
              log(`账号[${this.name}]：${result.result.message},获得${result.result.coin}金币，${result.result.coupon}提现券`)
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async done(id) {
  let path=`/api/v2/zhuan/done`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herpost,
              body:`id=${id}`
          }
          let result = await httpPost(urlobj)
          if(result.code ==0){
              log(`账号[${this.name}]：${result.result.message},获得${result.result.coin}金币，${result.result.coupon}提现券`)
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async video() {
  let path=`/api/v2/zhuan/video`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herpost,
              body:`type=1`
          }
          let result = await httpPost(urlobj)
          if(result.code ==0){
              this.ticket = result.result.ticket
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async load() {
  let path=`/api/v2/ads/action/load?class=10000&&channel=2&type=9`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              //body:``
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
             this.tid=result.result.tid
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async showed(qi) {
  let path=`/api/v2/ads/action/showed?class=10000&channel=2&type=9&ecpm=${qi}&tid=${this.tid}`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              //body:``
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async completed(qi) {
  let path=`/api/v2/ads/action/completed?class=10000&type=9&ticket=${this.ticket}&ecpm=${qi}&tid=${this.tid}`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              //body:``
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
            console.log(`账号[${this.name}]：获得${result.result.reward}金币，${result.result.coupon}提现券`)
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async newscoin() {
  let path=`/api/v2/news/coin`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              //body:``
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
             this.ticket=result.result.ticket
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async newscoin1() {
  let path=`/api/v2/news/coin?ticket=${this.ticket}`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              //body:``
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
             
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async user1() {
  let path=`/api/v2/member/profile`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
           this.jb=result.result.point
       this.txz=result.result.ticket
             
          }else{
              console.log(`账号${this.index}：${result.message}`)
          }		
}
async user2() {
  let path=`/api/v2/member/profile`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
           this.jb1=result.result.point
       this.txq1=result.result.ticket
             
          }else{
              console.log(`账号${this.index}：${result.message}`)
          }		
}
async videocoin() {
  let path=`/api/v2/video/coin`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              //body:``
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
             this.ticket=result.result.ticket
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async videocoin1() {
  let path=`/api/v2/video/coin?ticket=${this.ticket}`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              //body:``
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
             
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async count() {
  let path=`/api/v2/news/sdk/zhuan/count?isfirstopen=0`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              //body:``
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
             
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async kan() {
    let path=`/api/v2/kan/index?page=1&per_page=200`
            let urlobj = {
                url: `${hosts}${path}`,
                headers: this.herget,
                //body:``
            }
            let result = await httpGet(urlobj)
            if(result.code ==0){
               let da = result.result.data
            for(let num=0;num<da.length;num++){
            if(da[num].is_ok==0){
                let id= da[num].id
                await this.click(id)
                await wait(61)
                await this.kan1(id)
                await wait(3)
            }}
            }else{
                console.log(`账号[${this.name}]：${result.message}`)
            }		
}
async click(id) {
    let path=`/api/v2/kan/click?id=${id}`
            let urlobj = {
                url: `${hosts}${path}`,
                headers: this.herget,
                //body:``
            }
            let result = await httpGet(urlobj)
            if(result.code ==0){
               this.ticket=result.result.ticket
            
            }else{
                console.log(`账号[${this.name}]：${result.message}`)
            }		
}
async kan1(id) {
    let path=`/api/v2/kan/index`
            let urlobj = {
                url: `${hosts}${path}`,
                headers: this.herget,
                body:`ticket=${this.ticket}&id=${id}`
            }
            let result = await httpPost(urlobj)
            if(result.code ==0){
              console.log(`账号[${this.name}]：${result.result.message}`)
            
            }else{
                console.log(`账号[${this.name}]：${result.message}`)
            }		
}
async voiceindex() {
  let path=`/api/v2/voice/index`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              //body:``
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
             this.ticket=result.result.ticket
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async login() {
  let qo = wordsCount(`${this.body}${randomUUID()}%22%7D`)
  let path=`https://voiceapi.xinliangxiang.com/v1/user/login`
          let urlobj = {
              url: `${path}`,
              headers: {
              "Host": "voiceapi.xinliangxiang.com",
             "user-agent": this.ua,
              "content-type": "application/x-www-form-urlencoded",
              "content-length": qo,
              "accept-encoding": "gzip"},
              body:`${this.body}${randomUUID()}%22%7D`
          }
          let result = await httpPost(urlobj)
          if(result.code ==200){
            this.token1=result.data.token
          
          }else{
              console.log(`账号[${this.name}]：${result.msg}`)
          }		
}
async distribute() {
  let path=`${this.dabd}&data=%7B%22extra%22%3A%22%22%2C%22hasInstallLogId%22%3A%220%22%2C%22mediaUserId%22%3A%22%22%2C%22resourceId%22%3A%221913514664%22%2C%22rewardAmount%22%3A0%2C%22userId%22%3A%22${this.userid}%22%2C%22x5ImportStatus%22%3A0%7D`
          let qo = wordsCount(path)
  let urlobj = {
              url: `https://voiceapi.xinliangxiang.com/v1/ad/advert-distribute`,
              headers: {
              "Host": "voiceapi.xinliangxiang.com",
              "authorization": `Bearer ${this.token1}`,
              "user-agent": this.ua,
              "content-type": "application/x-www-form-urlencoded",
              "content-length": qo,
              "accept-encoding": "gzip"},
              body:path
          }
          let result = await httpPost(urlobj)
          if(result.code ==200){
            if(result.data.advertType==7){
              this.logid=result.data.logId
              this.tid=result.data.openLogId
              this.icpm=result.data.ecpm
              await wait(44)
              await this.voicesuccess()
              await wait(1)
              await this.voiceindex1()
            }else if(result.data.advertType==4){
              this.logid=result.data.logId
              this.tid=result.data.openLogId
              this.icpm=result.data.ecpm
              let url1 =result.data.advertInteract.interacts[0].url
              this.url = url1.replace(/[\s\S]/g, function(m){
                return '\\u' + ('000' + m.charCodeAt().toString(16)).slice(-4);
                });
              await wait(1)
              for(let num=0;num<3;num++){
                await this.interactsuccess()
                await wait(3)
              }
              await this.voiceindex2()
              
            }
            else{
              this.logid=result.data.logId
              this.tid=result.data.openLogId
              this.icpm=result.data.ecpm
              await wait(18)
              await this.opensuccess()
              await wait(2)
              await this.success()
              await wait(1)
              await this.voiceindex2()
            }
           
          
          }else{
              console.log(`账号[${this.name}]：${result.msg}`)
          }		
}
async interactsuccess() {

  let path=`${this.dabd}&data=%7B%22logId%22%3A%22${this.logid}%22%2C%22url%22%3A%22${this.url}%22%7D`
  let qo = wordsCount(path)
          let urlobj = {
              url: `https://voiceapi.xinliangxiang.com/v1/ad/interact-success`,
              headers: {
              "Host": "voiceapi.xinliangxiang.com",
              "authorization": `Bearer ${this.token1}`,
              "user-agent": this.ua,
              "content-type": "application/x-www-form-urlencoded",
              "content-length": qo,
              "accept-encoding": "gzip"},
              body:path
          }
          let result = await httpPost(urlobj)
          if(result.code ==200){
          
          }else{
              console.log(`账号[${this.name}]：${result.msg}`)
          }		
}
async opensuccess() {

  let path=`${this.dabd}&data=%7B%22logId%22%3A%22${this.logid}%22%7D`
  let qo = wordsCount(path)
          let urlobj = {
              url: `https://voiceapi.xinliangxiang.com/v1/ad/click-open-success`,
              headers: {
              "Host": "voiceapi.xinliangxiang.com",
              "authorization": `Bearer ${this.token1}`,
              "user-agent": this.ua,
              "content-type": "application/x-www-form-urlencoded",
              "content-length": qo,
              "accept-encoding": "gzip"},
              body:path
          }
          let result = await httpPost(urlobj)
          if(result.code ==200){
          
          }else{
              console.log(`账号[${this.name}]：${result.msg}`)
          }		
}
async success() {

  let path=`${this.dabd}&data=%7B%22logId%22%3A%22${this.logid}%22%7D`
  let qo = wordsCount(path)
          let urlobj = {
              url: `https://voiceapi.xinliangxiang.com/v1/ad/landing-success`,
              headers: {
              "Host": "voiceapi.xinliangxiang.com",
              "authorization": `Bearer ${this.token1}`,
              "user-agent": this.ua,
              "content-type": "application/x-www-form-urlencoded",
              "content-length": qo,
              "accept-encoding": "gzip"},
              body:path
          }
          let result = await httpPost(urlobj)
          if(result.code ==200){
          
          }else{
              console.log(`账号[${this.name}]：${result.msg}`)
          }		
}
async voicesuccess() {
  let path=`${this.dabd}&data=%7B%22logId%22%3A%22${this.logid}%22%7D`
  let qo = wordsCount(path)
          let urlobj = {
              url: `https://voiceapi.xinliangxiang.com/v1/live/live-in-voice-success`,
              headers: {
              "Host": "voiceapi.xinliangxiang.com",
              "authorization": `Bearer ${this.token1}`,
              "user-agent": this.ua,
              "content-type": "application/x-www-form-urlencoded",
              "content-length": qo,
              "accept-encoding": "gzip"},
              body:path
          }
          let result = await httpPost(urlobj)
          if(result.code ==200){
          
          }else{
              
          }		
}
async voiceindex1() {
 
  let sign=MD5Encrypt(`${this.logid}${this.icpm}43514689`)
  let path=`/api/v2/voice/index`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              body:`stepnum=1&tagid=${this.logid}&icpm=${this.icpm}&ticket=${this.ticket}&sign=${sign}`
          }
          let result = await httpPost(urlobj)
          if(result.code ==0){
            console.log(`账号[${this.name}]：${result.result.message}，获得${result.result.coin}金币，${result.result.coupon}提现券`)
            this.cg=1
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
              this.cg=0
          }		
}
async voiceindex2() {
 
  let sign=MD5Encrypt(`${this.tid}${this.icpm}43514689`)
  let path=`/api/v2/voice/index`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              body:`stepnum=1&tagid=${this.tid}&icpm=${this.icpm}&ticket=${this.ticket}&sign=${sign}`
          }
          let result = await httpPost(urlobj)
          if(result.code ==0){
            console.log(`账号[${this.name}]：${result.result.message}，获得${result.result.coin}金币，${result.result.coupon}提现券`)
            this.cg=1
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
              this.cg=0
          }		
}
async exchange() {
  let path=`/api/v2/cash/exchange`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herget,
              //body:``
          }
          let result = await httpGet(urlobj)
          if(result.code ==0){
             if(result.result.items[1].jine==1&&result.result.items[1].is_ok==1){
              console.log(`账号[${this.name}]：开始提现`)
              await wait(2);
              await this.exchange1()
             }else  if(result.result.items[0].jine==1&&result.result.items[0].is_ok==1){
              console.log(`账号[${this.name}]：开始提现`)
              await this.exchange1()
             }else{
              console.log(`账号[${this.name}]：条件不足`)
             }
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
async exchange1() {
  let path=`/api/v2/cash/exchange`
          let urlobj = {
              url: `${hosts}${path}`,
              headers: this.herpost,
              body:`gate=wechat&amount=1&lat=&lng=&root=0&sim=1&debug=0&model=M2007J3SC&power=0&vpn=0`
          }
          let result = await httpPost(urlobj)
          if(result.code ==0){
            console.log(`账号[${this.name}]：${result.result.message}`)
          
          }else{
              console.log(`账号[${this.name}]：${result.message}`)
          }		
}
}

function wordsCount(str) {
  if (str == null || str == '') return 0;
  return str.match(/\w?|\W?/g).length - 1;
}
!(async () => {
	if (!(await checkEnv())) return;
	for (let user of userList) {
    await user.start()
  }
	
	await SendMsg(msg);
})()
	.catch((e) => console.log(e))
	.finally(() => $.done())
	async function SendMsg(message) {
		if (!message) return;
	  
		if (Notify > 0) {
		  if ($.isNode()) {
			var notify = require("./sendNotify");
			await notify.sendNotify($.name, message);
		  } else {
			$.msg(message);
		  }
		} else {
		  log(message);
		}
	  }

      function local_hours() {
        let myDate = new Date();
        let h = myDate.getHours();
        return h;
    }
    function timestampS() {
        return Date.parse(new Date());
      }

      function randomInt(min, max) {
        return Math.round(Math.random() * (max - min) + min);
      }
      function randomUUID() {
        return randomPattern('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
    }

   function randomPattern(pattern,charset='abcdef0123456789') {
        let str = ''
        for(let chars of pattern) {
            if(chars == 'x') {
                str += charset.charAt(Math.floor(Math.random()*charset.length));
            } else if(chars == 'X') {
                str += charset.charAt(Math.floor(Math.random()*charset.length)).toUpperCase();
            } else {
                str += chars
            }
        }
        return str
    }
    async function httpPost(urlobj){
	
        return new Promise((resolve) => {
            let url = urlobj;
            if (debug) {
              log(`\n【debug】=============== 这是  请求 url ===============`);
              log(JSON.stringify(url));
            }
            
            $.post(
              url,
              async (error, response, data) => {
                try {
                  if (debug) {
                    log(
                      `\n\n【debug】===============这是  返回data==============`
                    );
                    log(data);
                  }
                  
            let result = JSON.parse(data);
            resolve(result);
            
        } catch (e) {
            log(e);
          } finally {
            resolve();
          }
        },
        
      );
      });
    }
    async function httpGet(urlobj){
        
        return new Promise((resolve) => {
            let url = urlobj;
            if (debug) {
              log(`\n【debug】=============== 这是  请求 url ===============`);
              log(JSON.stringify(url));
            }
            
            $.get(
              url,
              async (error, response, data) => {
                try {
                  if (debug) {
                    log(
                      `\n\n【debug】===============这是  返回data==============`
                    );
                    log(data);
                  }
                  
            let result = JSON.parse(data);
            resolve(result);
            
        } catch (e) {
            log(e);
          } finally {
            resolve();
          }
        },
        
      );
      });
    }
    function phone_num(phone_num) {
        if (phone_num.length == 11) {
            let data = phone_num.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
            return data;
        } else {
            return phone_num;
        }
    }
     //时间差
     function getCurrTime() {
        const curDate = new Date();
        let T = {
            Y: curDate.getFullYear(), // 年
            M: curDate.getMonth() + 1, // 月
            D: curDate.getDate(), // 日
            H: curDate.getHours(), // 时
            Mi: curDate.getMinutes(), // 分
            S: curDate.getSeconds() // 秒
        };
        if (T.H < 10) T.H = '0' + T.H;
        if (T.Mi < 10) T.Mi = '0' + T.Mi;
        if (T.S < 10) T.S= '0' + T.S;
         curTime = T.Y + '-' + T.M + '-' + T.D + ' ' + T.H + ':' + T.Mi + ':' + T.S;
         curTime1 = T.Y + '-' + T.M + '-' + T.D 
      }
      function diffSecond(start, end) {
        const startTime = new Date(start);
        const endTime = new Date(end);
        const second_time = Math.abs(startTime - endTime) / 1000; // 得到相差的秒数
        return second_time;
      }
      function wait(n) {
        return new Promise(function (resolve) {
            setTimeout(resolve, n * 1000);
        });
    }
 //MD5
 function MD5Encrypt(a) { function b(a, b) { return a << b | a >>> 32 - b } function c(a, b) { var c, d, e, f, g; return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f } function d(a, b, c) { return a & b | ~a & c } function e(a, b, c) { return a & c | b & ~c } function f(a, b, c) { return a ^ b ^ c } function g(a, b, c) { return b ^ (a | ~c) } function h(a, e, f, g, h, i, j) { return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e) } function i(a, d, f, g, h, i, j) { return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d) } function j(a, d, e, g, h, i, j) { return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d) } function k(a, d, e, f, h, i, j) { return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d) } function l(a) { for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++; return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g } function m(a) { var b, c, d = "", e = ""; for (c = 0; 3 >= c; c++)b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2); return d } function n(a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", c = 0; c < a.length; c++) { var d = a.charCodeAt(c); 128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128)) } return b } var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21; for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16)p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s); var O = m(t) + m(u) + m(v) + m(w); return O.toLowerCase() }
      
// 下面的不用管了   全默认就行   记得装 yml2213-utils 依赖
// #region ********************************************************  固定代码  ********************************************************




function randomString1(e) {
    e = e || 32;
    var t = "123456789",
      a = t.length,
      n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
  }
  function randomString2(e) {
    e = e || 32;
    var t = "1234567890",
      a = t.length,
      n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
  }
 function randomString(e) {
   e = e || 32;
   var t = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890",
     a = t.length,
     n = "";
   for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
   return n;
 }

// 变量检查与处理
async function checkEnv() {
	if (userCookie) {
		// console.log(userCookie);
		let e = envSplitor[0];
		for (let o of envSplitor)
			if (userCookie.indexOf(o) > -1) {
				e = o;
				break;
			}
		for (let n of userCookie.split(e)) n && userList.push(new UserInfo(n));
		userCount = userList.length;
	} else {
		console.log("未找到CK");
		return;
	}
	return console.log(`共找到${userCount}个账号`), !0;
}

// =========================================== 不懂不要动 =========================================================
function Env(t, e) {
    class s {
      constructor(t) {
        this.env = t
      }
      send(t, e = "GET") {
        t = "string" == typeof t ? {
          url: t
        } : t;
        let s = this.get;
        return "POST" === e && (s = this.post), new Promise((e, i) => {
          s.call(this, t, (t, s, r) => {
            t ? i(t) : e(s)
          })
        })
      }
      get(t) {
        return this.send.call(this.env, t)
      }
      post(t) {
        return this.send.call(this.env, t, "POST")
      }
    }
    return new class {
      constructor(t, e) {
        this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
      }
      isNode() {
        return "undefined" != typeof module && !!module.exports
      }
      isQuanX() {
        return "undefined" != typeof $task
      }
      isSurge() {
        return "undefined" != typeof $httpClient && "undefined" == typeof $loon
      }
      isLoon() {
        return "undefined" != typeof $loon
      }
      toObj(t, e = null) {
        try {
          return JSON.parse(t)
        } catch {
          return e
        }
      }
      toStr(t, e = null) {
        try {
          return JSON.stringify(t)
        } catch {
          return e
        }
      }
      getjson(t, e) {
        let s = e;
        const i = this.getdata(t);
        if (i) try {
          s = JSON.parse(this.getdata(t))
        } catch {}
        return s
      }
      setjson(t, e) {
        try {
          return this.setdata(JSON.stringify(t), e)
        } catch {
          return !1
        }
      }
      getScript(t) {
        return new Promise(e => {
          this.get({
            url: t
          }, (t, s, i) => e(i))
        })
      }
      runScript(t, e) {
        return new Promise(s => {
          let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
          i = i ? i.replace(/\n/g, "").trim() : i;
          let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
          r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
          const [o, h] = i.split("@"), a = {
            url: `http://${h}/v1/scripting/evaluate`,
            body: {
              script_text: t,
              mock_type: "cron",
              timeout: r
            },
            headers: {
              "X-Key": o,
              Accept: "*/*"
            }
          };
          this.post(a, (t, e, i) => s(i))
        }).catch(t => this.logErr(t))
      }
      loaddata() {
        if (!this.isNode()) return {}; {
          this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
          const t = this.path.resolve(this.dataFile),
            e = this.path.resolve(process.cwd(), this.dataFile),
            s = this.fs.existsSync(t),
            i = !s && this.fs.existsSync(e);
          if (!s && !i) return {}; {
            const i = s ? t : e;
            try {
              return JSON.parse(this.fs.readFileSync(i))
            } catch (t) {
              return {}
            }
          }
        }
      }
      writedata() {
        if (this.isNode()) {
          this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
          const t = this.path.resolve(this.dataFile),
            e = this.path.resolve(process.cwd(), this.dataFile),
            s = this.fs.existsSync(t),
            i = !s && this.fs.existsSync(e),
            r = JSON.stringify(this.data);
          s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
        }
      }
      lodash_get(t, e, s) {
        const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
        let r = t;
        for (const t of i)
          if (r = Object(r)[t], void 0 === r) return s;
        return r
      }
      lodash_set(t, e, s) {
        return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
      }
      getdata(t) {
        let e = this.getval(t);
        if (/^@/.test(t)) {
          const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
          if (r) try {
            const t = JSON.parse(r);
            e = t ? this.lodash_get(t, i, "") : e
          } catch (t) {
            e = ""
          }
        }
        return e
      }
      setdata(t, e) {
        let s = !1;
        if (/^@/.test(e)) {
          const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
          try {
            const e = JSON.parse(h);
            this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
          } catch (e) {
            const o = {};
            this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
          }
        } else s = this.setval(t, e);
        return s
      }
      getval(t) {
        return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
      }
      setval(t, e) {
        return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
      }
      initGotEnv(t) {
        this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
      }
      get(t, e = (() => {})) {
        t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
          "X-Surge-Skip-Scripting": !1
        })), $httpClient.get(t, (t, s, i) => {
          !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
        })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
          hints: !1
        })), $task.fetch(t).then(t => {
          const {
            statusCode: s,
            statusCode: i,
            headers: r,
            body: o
          } = t;
          e(null, {
            status: s,
            statusCode: i,
            headers: r,
            body: o
          }, o)
        }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
          try {
            if (t.headers["set-cookie"]) {
              const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
              this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
            }
          } catch (t) {
            this.logErr(t)
          }
        }).then(t => {
          const {
            statusCode: s,
            statusCode: i,
            headers: r,
            body: o
          } = t;
          e(null, {
            status: s,
            statusCode: i,
            headers: r,
            body: o
          }, o)
        }, t => {
          const {
            message: s,
            response: i
          } = t;
          e(s, i, i && i.body)
        }))
      }
      post(t, e = (() => {})) {
        if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
          "X-Surge-Skip-Scripting": !1
        })), $httpClient.post(t, (t, s, i) => {
          !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
        });
        else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
          hints: !1
        })), $task.fetch(t).then(t => {
          const {
            statusCode: s,
            statusCode: i,
            headers: r,
            body: o
          } = t;
          e(null, {
            status: s,
            statusCode: i,
            headers: r,
            body: o
          }, o)
        }, t => e(t));
        else if (this.isNode()) {
          this.initGotEnv(t);
          const {
            url: s,
            ...i
          } = t;
          this.got.post(s, i).then(t => {
            const {
              statusCode: s,
              statusCode: i,
              headers: r,
              body: o
            } = t;
            e(null, {
              status: s,
              statusCode: i,
              headers: r,
              body: o
            }, o)
          }, t => {
            const {
              message: s,
              response: i
            } = t;
            e(s, i, i && i.body)
          })
        }
      }
      time(t) {
        let e = {
          "M+": (new Date).getMonth() + 1,
          "d+": (new Date).getDate(),
          "H+": (new Date).getHours(),
          "m+": (new Date).getMinutes(),
          "s+": (new Date).getSeconds(),
          "q+": Math.floor(((new Date).getMonth() + 3) / 3),
          S: (new Date).getMilliseconds()
        };
        /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
        return t
      }
      msg(e = t, s = "", i = "", r) {
        const o = t => {
          if (!t) return t;
          if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
            "open-url": t
          } : this.isSurge() ? {
            url: t
          } : void 0;
          if ("object" == typeof t) {
            if (this.isLoon()) {
              let e = t.openUrl || t.url || t["open-url"],
                s = t.mediaUrl || t["media-url"];
              return {
                openUrl: e,
                mediaUrl: s
              }
            }
            if (this.isQuanX()) {
              let e = t["open-url"] || t.url || t.openUrl,
                s = t["media-url"] || t.mediaUrl;
              return {
                "open-url": e,
                "media-url": s
              }
            }
            if (this.isSurge()) {
              let e = t.url || t.openUrl || t["open-url"];
              return {
                url: e
              }
            }
          }
        };
        this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
        let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
        h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h)
      }
      log(...t) {
        t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
      }
      logErr(t, e) {
        const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
        s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
      }
      wait(t) {
        return new Promise(e => setTimeout(e, t))
      }
      done(t = {}) {
        const e = (new Date).getTime(),
          s = (e - this.startTime) / 1e3;
        this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
      }
    }(t, e)
  }