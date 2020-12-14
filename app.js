const Discord = require('discord.js');
const client = new Discord.Client();
const moment = require('moment');
const işaret= require ('./işaret.json');

var prefix = işaret.prefix

client.on('ready', () => {
  client.user.setStatus("dnd");
  console.log("Discord'a bağlantı kuruldu.");
  client.user.setActivity("🎉c!yardım Bot Hazır 🎉  ", {
    type: "WATCHING",
    url: "https://www.twitch.tw/mybutton"

  });
  });





client.on('message', message =>{
  if(message.content.startsWith(prefix + 'oylama')){
    const args = message.content.split(' ').slice(1)
    const botmesajı = args.join(" ")
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('Oylama Yapmak İçin YÖNETİCİ Rolüne Sahip Olmanız Gerekir.');
     if(!botmesajı) return message.reply('Oyllamanın Ne Olacağını Yazmadınız.');
     message.delete(message.author)
     const embed = new MessageEmbed()
     .setTitle('OYLAMA')
     .setDescription(botmesajı)
     .setFooter('CYBER BOT ');
     message.channel.send({ embed : embed }).then( embedMessage =>{
      embedMessage.react("✔️")
      embedMessage.react("❌");
     })
  }
})
client.on('message',message => {
if(message.content.startsWith(prefix + 'duyur')){
  const kanal = message.mentions.channels.first();
  const args = message.content.split(' ').slice(2)
  const botmesajı = args.join(" ")
  if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('Duyuru Yapmak İçin YÖNETİCİ  Olmanız Gerekir.');
   if(!botmesajı) return message.reply('Duyurunun Ne Olacağını Yazmadınız.');
    if(!kanal) return message.reply('Kanalı Tanımlamadınız ');
    message.delete(message.author)
    kanal.send(botmesajı);

}
})
client.on('message',message => {
  if(message.content.startsWith(prefix + 'özelduyur')){
    const kişi = message.mentions.users.first();
    const args = message.content.split(' ').slice(2)
    const botmesajı = args.join(" ")
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('Duyuru Yapmak İçin YÖNETİCİ  Olmanız Gerekir.');
     if(!botmesajı) return message.reply('Duyurunun Ne Olacağını Yazmadınız.');
      if(!kişi) return message.reply('Kişiyi Tanımlamadınız ');
      message.delete(message.author)
      kişi.send(botmesajı);
  }
})
  client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === '🚪・oto-rol');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Sunucuya Hoşgeldin, ${member} Bizde Seni BekLiyorduk `);
  });

  client.on("message", (message) => {
    if (message.content.startsWith(prefix+"veteran.ekle")) {
        if (message.member.hasPermission(['ADMINISTRATOR'])) {
          //Rest of your code
        // returns true if the member has the role
            // allowed access to command
            var veteram = message.mentions.members.first();
            message.reply("Lütfen Bekleyin, Bilgileriniz kontrol ediliyor...");
            message.reply(`${veteram} adlı kullanıcı veteran yapıldı.<Nehir_of_legend 👑#8512 geliştirdi > !`);
  } else {
    message.reply("Olamaz! :X: senin bu komutu kullanmaya yetkin yok.");
  }
}
})









  client.on('message', message => {
    // Ignore messages that aren't from a guild
    if (!message.guild) return;

    // If the message content starts with "!kick"
    if (message.content.startsWith(prefix+'kick')) {
      // Assuming we mention someone in the message, this will return the user
      // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
      const user = message.mentions.users.first();
      // If we have a user mentioned
      if (user) {
        // Now we get the member from the user
        const member = message.guild.member(user);
        // If the member is in the guild
        if (member) {
          /**
           * Kick the member
           * Make sure you run this on a member, not a user!
           * There are big differences between a user and a member
           */
          member
            .kick('Optional reason that will display in the audit logs')
            .then(() => {
              // We let the message author know we were able to kick the person
              message.reply(`Başarı ile atıldı ${user.tag}`);
            })
            .catch(err => {
              // An error happened
              // This is generally due to the bot not being able to kick the member,
              // either due to missing permissions or role hierarchy
              message.reply('Bu kullanıcıyı atamaszın ');
              // Log the error
              console.error(err);
            });
        } else {
          // The mentioned user isn't in this guild
          message.reply("Kullanıcı bu sunucuda değil");
        }
        // Otherwise, if no user was mentioned
      } else {
        message.reply("Bu kulanıcıyı atamazsın!");
      }
    }
  });


  const ytdl=require('ytdl-core')

  const servers={

  }
  let server=undefined;

  const play=async(connection,message)=>{
      const server=servers[message.guild.id];
      const stream=ytdl(server.queue[0],{
          filter:"audioonly",
          quality:"highestaudio"
      })
      server.dispatcher = connection.play(stream);
      let song=await (await ytdl.getInfo(server.queue[0])).videoDetails.title;
      server.dispatcher.on("finish",()=>{
          server.queue.shift();
          if(server.queue[0]){
              message.channel.send("Şarkı çalınıyor: "+song)
              play(connection,message)
          }
          else connection.disconnect();
      })
  }

  client.on("message",message=>{
      console.log("gelen mesaj: "+message.content)

      const parsedMessage=message.content.split(" ") //!oynat URL

      switch (parsedMessage[0]) {
          case "c!oynat":
              if(!parsedMessage[1]){
              message.channel.send("Link girmelisiniz!")
              return;
              }

              if(!message.member.voice.channel){
              message.channel.send("Ses kanalı olmalıdır!")
                  return;
              }

              if(!servers[message.guild.id])
              servers[message.guild.id]={
                  queue:[]
              }

              server=servers[message.guild.id]
              server.queue.push(parsedMessage[1])

              if(server.queue.length<=1)
              try{
                  message.member.voice.channel.join().then(connection=>{
                      play(connection,message)
                  })
              }catch(e){
                  console.log("hata oluştu"+e)
              }
              break;
          case "c!gec":
              if(server.dispatcher)server.dispatcher.end();
              break;
          case "c!dur":
              if(message.guild.voice.channel){
                  server.dispatcher.end()
                  console.log("kuyruk durduruldu")
              }
              if(message.guild.connection)
              message.guild.voice.connection.disconnect();
              break;
          default:
              break;
      }
  })






   client.on("message", (message) => {
    if (message.content.startsWith(prefix + "premiumbasic")) {
      message.reply("Cyber Bot 2.0 / Cyber Bot Worldwide / Cyber Bot Basic | Premium Fiyatları");
      message.channel.send(" ▬▬▬▬▬▬▬▬● Cyber Bot Basic  ●▬▬▬▬▬▬▬▬");
      message.channel.send("c!premium komutlarını açar");
      message.channel.send("Arda Demir Demirci #Host Tarafından Çalıştırılır.");
      message.channel.send("Yüksek Yetki Gerektirir.");
      message.channel.send("kazanmak için Cyber Bot Veteran Kartına sahip olman gerekir.");

          }
        }
  )









client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {

  if (!message.guild) return;


  if (message.content.startsWith(prefix +'ban')) {

    const user = message.mentions.users.first();

    if (user) {

      const member = message.guild.member(user);

      if (member) {

        member
          .ban({
            reason: 'Banladım!',
          })
          .then(() => {

            message.reply(`Başarı ile Banlandı ${user.tag}`);
          })
          .catch(err => {

            message.reply('Kullanıcı banlanamadı!');

            console.error(err);
          });
      } else {

        message.reply("Kullanıcı bu sunucuda Değil!");
      }
    } else {

      message.reply("Hangi kullanıcının yasaklanacağını söylemedin!");
    }
  }
});

client.on('message', (msg) => {
    console.log("BİR MESAJ ATILDI")

  }
);

client.on('message', (msg) => {
 if(msg.content.toLocaleLowerCase()==="selam"){
   msg.reply("Aleyküm selam !")
 }

}
);
client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="sa"){
    msg.reply("Aleyküm selam (as) Nasılsın!")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="günaydın"){
    msg.reply("Sanada!")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="iyi akşmalar"){
    msg.reply("Sanada !")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="aq"){
    msg.reply("**SUNUCUDA KÜFÜR YASAKTIR** !")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="mal"){
    msg.reply("**SUNUCUDA KÜFÜR YASAKTIR** !")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="amk"){
    msg.reply("**SUNUCUDA KÜFÜR YASAKTIR** !")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="sik"){
    msg.reply("**SUNUCUDA KÜFÜR YASAKTIR** !")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="siktir"){
    msg.reply("**SUNUCUDA KÜFÜR YASAKTIR** !")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="oç"){
    msg.reply("**SUNUCUDA KÜFÜR YASAKTIR **!")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="göt"){
    msg.reply("**SUNUCUDA KÜFÜR YASAKTIR** !")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="bok"){
    msg.reply("**SUNUCUDA KÜFÜR YASAKTIR **!")
  }

 }
 );
client.on('message', msg => {
  if (msg.content === prefix +'yardım') {
    msg.reply('c!ban ,c!oylama,c!duyur,c!rolver,c!reklam,c!insta,c!davetyardım,c!premiumbasic,c!botinvite,,c!zulafan,c!dalgageç,=<<< ARDA DEMİR DEMİRCİ#6479 ve Nehir_of_legend 👑#8512!=>>> yeni kodlar ekleyecek ');
  }
});
client.on('message', msg => {
  if (msg.content === prefix + 'davetyardım') {
    msg.reply('https://discord.gg/wSv3yy6zGD <==BURAYA GİDİP ARDA DEMİR DEMİRCİ#6479 VE Nehir_of_legend #8512 İLE KONUŞ YARDIM EDECEKLER MERAK ETME>');
  }
});


client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()===prefix + "arda"){
    msg.reply(" https://www.youtube.com/channel/UCCeJDhRhNx4GQyQfCf5riUQ  <==youtube kanalı> ===https://discord.gg/UxxxpasfVS <==buda discord sunucusu>>!")
  }

 }
 );

client.on('message', msg => {
  if (msg.content === prefix+ "botinvite") {
    msg.reply('https://discord.com/oauth2/authorize?client_id=780745074484314132&scope=bot&permissions=2147483647 <bu şekilde>');
  }
});


client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()===prefix + "nehir"){
    msg.reply(" https://discord.gg/BpAzckesG4<Nehir_of_legend 👑#8512 discord sunucusu kodlama eğitimi veriyor bence katıl >!")
  }

 }
 );

client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()===prefix + "zulafan"){
    msg.reply(" https://discord.gg/nwxPHTJHQw<zula tr fan sunucusu  >!")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="naber"){
    msg.reply(" iyilik güzellik senden naber")
  }

 }
 );

 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()===prefix + "insta"){
    msg.reply("https://www.instagram.com/ademirdemirci/<==insta adresi ==>  ")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="iyi"){
    msg.reply("Ne mutlu bana :D!")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="bb"){
    msg.reply("Görüşürüz!")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()===prefix + "ali"){
    msg.reply("https://discord.gg/ksWWHM8dkW<<== discord sunucusu==>> https://www.youtube.com/channel/UC1oNCLzxUnEj74TkoL1LyuQ <<==buda youtube kanalı==>>  !")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="c!ice"){
    msg.reply("https://discord.gg/7EpBVw4E9p <== discord sunucusu katılırsanız sevinirim  == > https://www.youtube.com/channel/UCgYu2U8JZhJVT4Ew42kidDw <== buda youtube kanalı ab ==>> !")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="kaka"){
    msg.reply("**SUNUCUDA KÜFÜR YASAKTIR** !")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="yarrak"){
    msg.reply("**SUNUCUDA KÜFÜR YASAKTIR** !")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="yarraq"){
    msg.reply("**SUNUCUDA KÜFÜR YASAKTIR** !")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="taşak"){
    msg.reply("**SUNUCUDA KÜFÜR YASAKTIR** !")
  }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="nah"){
    msg.reply("**SUNUCUDA KÜFÜR YASAKTIR** !")
  }

 }
 );

 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="pezeveng"){
    msg.reply("**SUNUCUDA KÜFÜR YASAKTIR !**") }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="c!eren"){
    msg.reply("**https://discord.gg/ukr4Ypa5ga <= discord sunucusu bence katıl =>!**") }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="iyiğim  sen"){
    msg.reply("**çok sağol !**") }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="fuck"){
    msg.reply("**SUNUCUDA KÜFÜR YASAK !**") }

 }
 );
 client.on('message', (msg) => {
  if(msg.content.toLocaleLowerCase()==="slm"){
    msg.reply("Aleyküm Selam (as) Nasılsın Ben Çok İyim Sağol") }

 }
 );

 client.on("guildMemberAdd", member => {
  try {
  let role = member.guild.roles.cache.find(role => role.name === '👥 | Üye')
  member.roles.add(role);
} catch(e) {
  console.log(e)
}
});



client.on("message", message => {
  if (message.content.startsWith('c!rolver')) {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Bunu yapamazsın')
    let role = message.mentions.roles.first();
    let member = message.mentions.members.first();
    member.roles.add(role)
  }
});



try {
// yazacağınız komut
} catch(e) {
console.log(e)
}


client.on('guildMemberAdd', member => {
const girişçıkış = member.guild.channels.cache.find(channel => channel.name === '🚪・giriş-çıkış');
girişçıkış.send(`Aramıza hoş geldin, ${member}`);
  member.send(`${member} sunucumuza hoş geldin. Kuralları okuyup eğlenceye katılabilirsin !`);
});
client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(ch => ch.name === '✅・sayaç');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Sunucuya Hoşgeldin, ${member} Arkadaşlarını çağırmayı unutma Hedef **100** kişi unutma  `);
});




client.login('NzgwNzQ1MDc0NDg0MzE0MTMy.X7zjgw.9bT_kxPTL6D9ATkSz43W1Gjg7dE');
