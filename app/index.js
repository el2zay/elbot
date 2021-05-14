const Discord = require("discord.js");
const client = new Discord.Client();
const fetch = require("node-fetch");
var prefix = "e!";
const ytdl = require('ytdl-core');
const ReactionRoleManager = require("discord-reaction-role");
const manager = new ReactionRoleManager(client, {
  storage: "./reaction-role.json"
});

require('dotenv').config();

// NOUVEAU
const queue = new Map();

client.reactionRoleManager = manager;

client.on("ready", () => {
  console.log(
    `Oh tiens je m'appelle ${client.user.tag} (ID : ${client.user.id})`
  );
  {
  client.user.setActivity("Chante tutititutu tout en changeant pour ubuntu", {
  type: "STREAMING",
  url: "https://www.twitch.tv/eli__zay"
});
    
  }
    // Auto Up
  setInterval(() => {
    fetch("https://ac-v2.glitch.me").catch(err => {});
    fetch("https://achost.tk").catch(err => {});
    fetch("https://rmxbot-test.glitch.me").catch(err => {});
    fetch("https://eliebot.glitch.me").catch(err => {});
  }, 70000);
});

let Database;
if (typeof window !== "undefined") {
    Discord = DiscordJS;
    Database = EasyDatabase;
} else {
    Database = require("easy-json-database");
}
const delay = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));
const s4d = {
    Discord,
    client: null,
    tokenInvalid: false,
    reply: null,
    joiningMember: null,
    database: new Database("./db.json"),
    checkMessageExists() {
        if (!s4d.client) throw new Error('You cannot perform message operations without a Discord.js client')
        if (!s4d.client.readyTimestamp) throw new Error('You cannot perform message operations while the bot is not connected to the Discord API')
    }
};
s4d.client = new s4d.Discord.Client({
    fetchAllMembers: true
});
s4d.client.on('raw', async (packet) => {
    if (['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) {
        const guild = s4d.client.guilds.cache.get(packet.d.guild_id);
        if (!guild) return;
        const member = guild.members.cache.get(packet.d.user_id) || guild.members.fetch(d.user_id).catch(() => {});
        if (!member) return;
        const channel = s4d.client.channels.cache.get(packet.d.channel_id);
        if (!channel) return;
        const message = channel.messages.cache.get(packet.d.message_id) || await channel.messages.fetch(packet.d.message_id).catch(() => {});
        if (!message) return;
        s4d.client.emit(packet.t, guild, channel, message, member, packet.d.emoji.name);
    }
});

function mathRandomInt(a, b) {
    if (a > b) {
        // Swap a and b to ensure a is smaller.
        var c = a;
        a = b;
        b = c;
    }
    return Math.floor(Math.random() * (b - a + 1) + a);
}


s4d.client.login(process.env.TOKEN).catch((e) => {
    s4d.tokenInvalid = true;
    s4d.tokenError = e;
});

s4d.client.on('message', async (s4dmessage) => {
    if ((s4dmessage.content) == 'Pain au chocolat ou chocolatine') {
        s4dmessage.channel.send(String('TG ON EST PLUS EN 2016 PTN'));
    }

});

s4d.client.on('message', async (s4dmessage) => {
    if ((s4dmessage.content) == 'e!number') {
        s4dmessage.channel.send(String((mathRandomInt(1, 100))));
    }

});

s4d.client.on('message', async (s4dmessage) => {
    if ((s4dmessage.content) == 'e!serverinfo') {
        s4dmessage.channel.send({
            embed: {
                title: 'Voici les informations sur ce serveur',
                color: '#33ffff',
                image: {
                    url: ((s4dmessage.guild).iconURL({
                        dynamic: true
                    }))
                },
                description: (['', '**Nom du seveur:**', '\n', (s4dmessage.guild).name, '\n', '**Nombre de personnes sur ce serveur:**', '\n', (s4dmessage.guild).memberCount, '\n', '**Propriétaire de ce serveur:**', '\n', (s4dmessage.guild).owner || await (s4dmessage.guild).members.fetch((s4dmessage.guild).ownerID), '\n', '**Niveau de boost sur ce serveur:**', '\n', (s4dmessage.guild).premiumTier].join(''))
            }
        });
    }

});
s4d.client.on('message', async (s4dmessage) => {
  if ((s4dmessage.content) == 'e!infoserver') {
      s4dmessage.channel.send({
          embed: {
              title: 'Voici les informations sur ce serveur',
              color: '#33ffff',
              image: {
                  url: ((s4dmessage.guild).iconURL({
                      dynamic: true
                  }))
              },
              description: (['', '**Nom du seveur:**', '\n', (s4dmessage.guild).name, '\n', '**Nombre de personnes sur ce serveur:**', '\n', (s4dmessage.guild).memberCount, '\n', '**Propriétaire de ce serveur:**', '\n', (s4dmessage.guild).owner || await (s4dmessage.guild).members.fetch((s4dmessage.guild).ownerID), '\n', '**Niveau de boost sur ce serveur:**', '\n', (s4dmessage.guild).premiumTier].join(''))
          }
      });
  }

});

'\n';

s4d;

async function execute(message, serverQueue) {
        const args = message.content.split(" "); // On récupère les arguments dans le message pour la suite

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
        {
                return message.channel.send(
                    "Vous devez être dans un salon vocal!"
                );
        }
        const permissions = voiceChannel.permissionsFor(message.client.user); // On récupère les permissions du bot pour le salon vocal
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) { // Si le bot n'a pas les permissions
                return message.channel.send(
                    "J'ai besoin des permissions pour rejoindre le salon et pour y jouer de la musique!"
                );
        }

        const songInfo = await ytdl.getInfo(args[1]);
        const song     = {
                title: songInfo.videoDetails.title,
                url  : songInfo.videoDetails.video_url,
        };

        if (!serverQueue) {
                const queueConstruct = {
                        textChannel : message.channel,
                        voiceChannel: voiceChannel,
                        connection  : null,
                        songs       : [],
                        volume      : 1,
                        playing     : true,
                };

                // On ajoute la queue du serveur dans la queue globale:
                queue.set(message.guild.id, queueConstruct);
                // On y ajoute la musique
                queueConstruct.songs.push(song);

                try {
                        // On connecte le bot au salon vocal et on sauvegarde l'objet connection
                        var connection           = await voiceChannel.join();
                        queueConstruct.connection = connection;
                        // On lance la musique
                        play(message.guild, queueConstruct.songs[0]);
                }
                catch (err) {
                        //On affiche les messages d'erreur si le bot ne réussi pas à se connecter, on supprime également la queue de lecture
                        console.log(err);
                        queue.delete(message.guild.id);
                        return message.channel.send(err);
                }
        }
        else {
                serverQueue.songs.push(song);
                console.log(serverQueue.songs);
                return message.channel.send(`${song.title} has been added to the queue!`);
        }

}

function skip(message, serverQueue) {
    if (!message.member.voice.channel) // on vérifie que l'utilisateur est bien dans un salon vocal pour skip
        {
                return message.channel.send(
                    "Vous devez être dans un salon vocal pour passer une musique!"
                );
        }
        if (!serverQueue) // On vérifie si une musique est en cours
        {
                return message.channel.send("Aucune lecture de musique en cours !");
        }
        serverQueue.connection.dispatcher.end(); // On termine la musique courante, ce qui lance la suivante grâce à l'écoute d'événement
                                                 // finish
}

function stop(message, serverQueue) {
        if (!message.member.voice.channel) // on vérifie que l'utilisateur est bien dans un salon vocal pour skip
        {
                return message.channel.send(
                    "Vous devez être dans un salon vocal pour stopper la lecture!"
                );
        }
        if (!serverQueue) // On vérifie si une musique est en cours
        {
                return message.channel.send("Aucune lecture de musique en cours !");
        }
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
}
function loop(message, serverQueue) {
  if (!message.member.voice.channel) // on vérifie que l'utilisateur est bien dans un salon vocal pour skip
  {
          return message.channel.send(
              "Vous devez être dans un salon vocal pour répéter la lecture!"
          );
  }
  if (!serverQueue) // On vérifie si une musique est en cours
  {
          return message.channel.send("Aucune lecture de musique en cours !");
  }
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.loop();
}

function play(guild, song) {
        console.log(song);
        const serverQueue = queue.get(guild.id); // On récupère la queue de lecture
        if (!song) { // Si la musique que l'utilisateur veux lancer n'existe pas on annule tout et on supprime la queue de lecture
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return;
        }
        // On lance la musique
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url, { filter: 'audioonly' }))
            .on("finish", () => { // On écoute l'événement de fin de musique
                    serverQueue.songs.shift(); // On passe à la musique suivante quand la courante se termine
                    play(guild, serverQueue.songs[0]);
            })
            .on("error", error => console.error(error));
        dispatcher.setVolume(1); // On définie le volume
        serverQueue.textChannel.send(`Démarrage de la musique: **${song.title}**`);
};

client.on("message", async message => {
        if (message.author.bot) {
                return;
        }
        if (!message.content.startsWith(prefix)) {
                return;
        }

        const serverQueue = queue.get(message.guild.id);

        if (message.content.startsWith(`e!play`)) {
                execute(message, serverQueue); // On appel execute qui soit initialise et lance la musique soit ajoute à la queue la musique
                return;
        }
        else if (message.content.startsWith(`e!skip`)) {
                skip(message, serverQueue); // Permettra de passer à la musique suivante
                return;
        }
        else if (message.content.startsWith(`e!stop`)) {
                stop(message, serverQueue); // Permettra de stopper la lecture
                return;
        }
        else if (message.content.startsWith(`e!loop`)) {
          loop(message, serverQueue); // Permettra de répéter la lecture
          return;
}});

client.on("message", message => {
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);
  const command = args.shift().toLowerCase();

  if (message.content === "e!reaction") {
    if (
      message.author.id !== "277825082334773251" &&
      message.author.id !== "727572859727380531"
    )
      return;

    /*
  var embed = new Discord.MessageEmbed()
  .setTitle("Role via réaction")
  .setDescription("**Quel OS utilisez vous ?**\niOS :apple:\nAndroid :robot:\nMacOS :desktop:\nWindows :window:\nLinux :penguin:\n\n**Qui êtes vous ?**\nAnti MEE6 :see_no_evil:\nFan de tutititutu :man_dancing:\nDéveloppeur :man_technologist:\n\n**Vous êtes**\nHomme :man:\nFemme :woman:\nStickman <:Stickman:836992390349979670>\n\n**Vous jouez à**\nAmongUS <:among:817444152307613706>\nMinecraft <:minecraft:836844843559944193>\nRocket league :red_car:\nJeu de course (Asphalt et tout) :race_car:")
  .setColor("BLURPLE")
  .setFooter("(Appuie sur les réactions)")
  message.channel.send(embed)
  */

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: "🍎",
      role: message.guild.roles.cache.get("836996246919970817")
    });

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: "🤖",
      role: message.guild.roles.cache.get("836996422519619606")
    });

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: "🖥",
      role: message.guild.roles.cache.get("836996521841000459")
    });

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: "🪟",
      role: message.guild.roles.cache.get("836996621157531689")
    });

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: "🐧",
      role: message.guild.roles.cache.get("836996726870900736")
    });

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: "🙈",
      role: message.guild.roles.cache.get("836996962754101299")
    });

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: "🕺",
      role: message.guild.roles.cache.get("836997066047750264")
    });

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: "👨‍💻",
      role: message.guild.roles.cache.get("836997155411066912")
    });

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: "👨",
      role: message.guild.roles.cache.get("836997456779935749")
    });

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: "👩",
      role: message.guild.roles.cache.get("836997555275563058")
    });

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: ":Stickman:836992390349979670",
      role: message.guild.roles.cache.get("836997632802422796")
    });

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: "<:among:817444152307613706>",
      role: message.guild.roles.cache.get("836997901929676810")
    });

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: "<:minecraft:836844843559944193>",
      role: message.guild.roles.cache.get("836998003206127687")
    });

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: "🤮",
      role: message.guild.roles.cache.get("836998089184378890")
    });

    client.reactionRoleManager.create({
      messageID: "836995213452115978",
      channel: message.channel,
      reaction: "🏎️",
      role: message.guild.roles.cache.get("836998154930225202")
    });
  }

  if (message.content.startsWith(prefix))
    message.react(":elbot:817423861158510633");

  if (message.content.startsWith("elbot"))
    message.react(":elbot:817423861158510633");

  if (message.content.toLowerCase().includes("ubuntu"))
    message.react("<:ubuntu:816654825248915487>");
  
  if (message.content.startsWith("Jannot Gaming"))
    message.channel.send(
      "https://tenor.com/view/potatoz-jano-gaming-nowagifs-gif-18818348"
    );

  if (message.content.toLowerCase().includes("ubuntu"))
    message.react(":ubuntu_dans_bassine:819657844940472421");


  if (message.content.toLowerCase().includes("merde"))
    message.react("<:bassinechrotte:816630077038264321>");
 
  if (message.content.toLowerCase().includes("merde"))
    message.react("💩");  
   
  if (message.content.startsWith("poubelle")) message.react("🚮");

  if (message.content.startsWith("Tu parles de ce bot chiant et inutile là ?"))
    message.channel.send("Va remix tes pantoufles toi");

  if (message.content.startsWith("Ah nan ça c'est mon connard de proprio... "))
    message.channel.send(
      "https://tenor.com/view/ferme-ta-gueule-ta-gueule-tg-julien-lepers-lepers-gif-13251519"
    );

  if (message.content.startsWith("Toi même"))
    message.channel.send(
      "https://tenor.com/view/nou-no-you-uno-uno-reverse-gif-21173861"
    );

  if (message.content.startsWith("bon")) message.channel.send("BONBON :candy:");

  if (message.content.startsWith("tutititutu"))
    message.react(":Brique_telecom:808798700142460970");

  if (message.content.startsWith("tutititutu"))
    message.channel.send(
      "https://cdn.discordapp.com/emojis/816728856823201813.png?v=1"
    );

  if (message.content.toLowerCase().includes("crotte"))
    message.react("<:bassinechrotte:816630077038264321>");

  if (message.content.toLowerCase().includes("crotte"))
    message.react("💩");  
  
  if (message.content.toLowerCase().includes("caca"))
    message.react("💩");  
  
  if (message.content.toLowerCase().includes("total"))
    message.react(":total:836981580157026304");

  if (message.content.startsWith("courgette")) message.channel.send("Counasse");

    function play() {
      const channel = client.channels.cache.get("817012298057121852");
      if (!channel)
        return console.log("[BriqueLoop] Variable salon/channel invalide.");

      let nombrelist = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
      let nombre = nombrelist[Math.floor(Math.random() * nombrelist.length)];

      let songList = [
        "https://cdn.discordapp.com/attachments/795288700594290698/840260770041823252/FullSizeRender.mp3"
      ];
      let song = songList[Math.floor(Math.random() * songList.length)];

      channel
        .join()
        .then(connection => {
          const dispatcher = connection.play(song, {
            volume: nombre
          });

          dispatcher.on("finish", () => {
            play();
          });
        })
        .catch(e => {
          console.log(
            "[BriqueLoop] Erreur lors de la connexion au salon vocal." + e
          );}
        );}

    if (message.content.toLowerCase().includes("ok")) message.react("🆗");
    
    if (message.content.toLowerCase().includes("minecraft")) message.react(":minecraft:836844843559944193");

    if (message.content.toLowerCase().includes("among")) message.react(":among:817444152307613706");

    if (message.content.toLowerCase().includes("parfait")) message.react("✅");

    if (message.content.toLowerCase().includes("juin"))
      message.channel.send("**TG FARÈS**");

      if (message.content.toLowerCase().includes("}"))
      message.channel.send("Connard de caractere de merde ");
      
if (message.content.startsWith("Nice"))
    message.channel.send(
      "https://tenor.com/view/noice-nice-click-gif-8843762")
   
    if (message.content.startsWith("Noice"))
    message.channel.send(
      "https://tenor.com/view/noice-nice-click-gif-8843762")

    if (message.content.toLowerCase().includes("scratch"))
      message.channel.send("Chat orange de merde");

    if (message.content === "oof") message.react(":oof:836989811897532457");

    if (message.content.toLowerCase().includes("bonjoir"))
      message.channel.send("Hachoir");
 
    if (message.content.toLowerCase().includes("rmxbot"))
      message.channel.send(
        "Ptdr il est plus inutile que moi mais je l'aime bien"
      );

    if (message.content.toLowerCase().includes("chromebook"))
      message.channel.send("Ubuntu>>>>>>>>>>");


    if (message.content === "issou")
      message.channel.send(
        "ISSOU DE SECOURS https://tenor.com/view/issou-de-secours-gif-14359921"
      );

    if (message.content === "Je le répète mais la place de la femme c'est où?")
      message.channel.send("Dans la kouisine ouais cousin");

    if (message.content === "Je le répète mais la place de l'homme c'est où?")
      message.channel.send("Devant le pc entrain de se br****");

    
      if (message.content === "e!say"){
      var contenu = args.join(" ");
      if (!contenu)
        return message.channel.send("T'es con ou quoi? **ECRIT FRÈRE**");
      message.channel.send(contenu);
      message.delete().catch();
    }
    
    if (message.content === "e!twitter")
var embed = new Discord.MessageEmbed()
.setTitle("**VOICI LE TWITTER PRINCIPAL DU SERVEUR CHANGEZ POUR UBUNTU**")
.setDescription(
"https://twitter.com/ubuntulebest")
.setColor("BLUE")
.setFooter("Abonne toi 👀")
message.channel.send(embed);


if (message.content === "e!uno")
      message.channel.send(
        "https://tenor.com/view/nou-no-you-uno-uno-reverse-gif-21173861"
      );

      if (message.content === "e!help") {
        var embed = new Discord.MessageEmbed()
          .setTitle("**VOICI TOUTES LES COMMANDES DE ELBOT**")
          .setDescription(


            "`pessi` Pour connaitre tous les mots de pessis \n`help` Pas besoins de le dire \n`say` Pour me faire dire tout et n'importe quoi \n`uno` Pour avoir la carte changement de sens \n`test` Pour savoir si je fonctionne \n`invite` Pour m'inviter dans un serveur 🙃\n`twitter` Pour connaitre le compte twitter de ce serveur\n`sondage` Pour faire un sondage \n`serverinfo` / `serverinfo` Pour connaitre toutes les informations sur ce serveur\n`number` Pour avoir un chiffre aléatoire entre 0 et 100.\n`heberger` Pour savoir sur quel hébergeur je suis héberger en ce moment!\n`restart` Pour que je redémarre. *en ce moment cette commande est HS*\n`github` Pour voir mon repo github\n`version` Pour connaitre sur quelle version je tourne en ce moment\n`ping` Pour connaitre mon ping. \n**COMMANDE MUSIQUE**\n`brique` pour que je chante TUTITITUTU \n`play` suivi d'un lien youtube pour que je chante la musique de ton choix \n`stop` Pour que j'arrête de chanter"
          )
          .setColor("BLURPLE")
          .setFooter("(En plus si tu dis mon nom ça enclenchera une guerre de bot 🙃) ah et mon prefix c'est e! mais je pense tu le sais déjà")
        message.channel.send(embed);
        
      }

    if (message.content === "e!test")
      message.channel.send("Y'a quoi zbi? Sinon moi je fonctionne.");

      if (message.content === "e!brique"){
      play();
      message.channel.send("let's go :bricks:");
    }

    if (message.content === "e!version")
    message.channel.send ("En ce moment je tourne sur la version 1.1.0")

    if (message.content === "e!heberger")
message.channel.send("Je suis en ce moment héberger sur Heroku!")

if (message.content === "e!github")
message.channel.send("Voici le lien de mon Github\nhttps://bit.ly/33sfsMv")

if (message.content === "e!invite") {
      message.channel.send(
        "https://discord.com/api/oauth2/authorize?client_id=809344905674489866&permissions=3152128&scope=bot"
      );
    }

  
    if (message.content === "e!pessi") {
      var embed = new Discord.MessageEmbed()
        .setTitle("**LES MOTS DES PESSI**")
        .setDescription(
          "culotté\npleure\nchiale\nchouine\ncouine\naboie\nmiaule\nboude\nbrûle\nhurle\ncrie\ncrève\npleurniche\nricane\njacasse\nagonise\nbeugle\nchuchote\nmurmure\nronfle\nsuffoque\nimplose\nexplose\nrugis\nsiffle\nronronne\ncaquette\nrenifle\nvis\nroucoule\nsouffre\nsoufle\ndort"
        )
        .setColor("BLURPLE");
      message.channel.send(embed);
    }

    s4d.client.on('message', async (s4dmessage) => {
      if (((s4dmessage.content) || '').startsWith('e!sondage' || '')) {
          s4dmessage.react('👍');
          s4dmessage.react('👎');
          s4dmessage.react('✋');
      }
  
  });


  

    if (message.content.toLowerCase().startsWith("siri"))
      message.channel.send("Je suis Siri votre assistant personnel ", {
        tts: true
      });

      if (message.content === "e!ping") {
    if (message.author.bot === true) return;
    message.channel.send(
      "Le ping pong c'est de la merde je préfère utiliser des briques comme raquettes mais en tout cas j'ai " +
        client.ws.ping +
        " ms"
    );
    
    }
});

client.login(process.env.TOKEN);
