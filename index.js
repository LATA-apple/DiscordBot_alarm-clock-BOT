const { Client, Intents, MessageEmbed } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');

const client = new Client({ 
  intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_MESSAGES
  ]
});

client.once('ready', () => {
  console.log('Bot is ready');
});

let player; // プレーヤーオブジェクトをグローバルに宣言
let currentUrl; // 現在再生中の動画のURL
let connection; // VoiceConnectionをグローバルに宣言
let video_durationSec = 0;
let nowPlayingMessage;

const videoUrls = [
  'https://youtu.be/T3bHj09v4wg',
  'https://youtu.be/1ev9iXcPNIc',
  'https://youtu.be/ZF2kVaQvzrk',
  'https://youtu.be/6Zl2Pqio8LY',
  'https://youtu.be/HgiRTGKXEPA',
  'https://youtu.be/JQ-UiP4WhaE',
  'https://youtu.be/V1ck0M2bcpo',
  'https://youtu.be/lIWB98ry5Uw',
  'https://youtu.be/VIbDk11ZqR8',
  'https://youtu.be/DOrS5lRDK9I',
  'https://youtu.be/yDHMUKWd1WY',
  'https://youtu.be/xMSmedFH0dg',
  'https://youtu.be/SEdY6-HrtBY',
  'https://youtu.be/rChYpqOuSbg',
  'https://youtu.be/Ost9uz9bslU',
  'https://youtu.be/yqTqVeYhul4',
  'https://youtu.be/RILxs56yDRU',
  'https://youtu.be/DEGCvacPcYI',
  'https://youtu.be/AkzJytxPB8A',
  'https://youtu.be/P5_VSLQklvo',
  'https://youtu.be/0CGEHRnK94I',
  'https://youtu.be/qDUF2j1gPgs',
  'https://youtu.be/2jxeMQSTkf8',
  'https://youtu.be/3QE8t90lQzE',
  'https://youtu.be/_ywtwkqXoxE',
  'https://youtu.be/j3FwDFSfm2I',
  'https://youtu.be/PzICFiabqYY',
  'https://youtu.be/4n_-Zr0_Xts',
  'https://youtu.be/hqIE5VHui30',
  'https://youtu.be/18YQp9-uJ9I',
  'https://youtu.be/Q2QF8zm36Go',
  'https://youtu.be/Nd5z6NM6mZA',
  'https://youtu.be/aaOSmzII8N4',
  'https://youtu.be/e8Wk0R1SS44',
  'https://youtu.be/-LQus3Qzt6Q',
  'https://youtu.be/kz6fwCS6sxE',
  'https://youtu.be/yZB10NT8Asc',
  'https://youtu.be/iSHWlvBRryg',
  'https://youtu.be/ElXLJZ_clEk',
  'https://youtu.be/XNOlzcAHwqo',
  'https://youtu.be/jWlbgmNzZpo',
  'https://youtu.be/VFeiuxDlokU',
  'https://youtu.be/EVdxE0fnKd8',
  'https://youtu.be/TyRZ1y0oOmA',
  'https://youtu.be/bfKwhuOxcIo',
  'https://youtu.be/NXodnfdzo40',
  'https://youtu.be/juJOncS53IQ'
    // 他の動画URLをここに追加
];

client.on('messageCreate', async (message) => {
  if (message.channel.id != '1209947489243893874' && message.channel.id != '1221440502352580758') return;
  if (!message.guild) return;
  if (message.author.bot) return;

  if (message.content === '再生') {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply('Please join a voice channel first!');
    }
    message.delete();
    const embed = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle('目覚ましボイス 再生')
      .setDescription('目覚ましボイスを再生します。')
      .addField('操作方法', '*再生* ：目覚ましボイスを再生します\n*一時停止* ：目覚ましボイスを一時停止します\n*再開* ：一時停止した目覚ましボイスを再開します\n*退出* ：VCから退出します');
    message.channel.send({ embeds: [embed] })

    connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    // リストからランダムに動画URLを選択
    currentUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
    const stream = ytdl(currentUrl, { filter: 'audioandvideo' }); // 音声と映像を含むストリームを取得
    const resource = createAudioResource(stream); // 映像も含めてリソースを作成
    player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
        volume: 0.5
    });

    connection.subscribe(player);

    player.play(resource);

    player.on('stateChange', (oldState, newState) => {
      if (newState.status === 'idle') {
        setTimeout(() => {
          // 再生が終了したら再び再生
          currentUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
          player.play(createAudioResource(ytdl(currentUrl, { filter: 'audioandvideo' })));
        }, 30000); // 再生終了後30秒後に再生を再開する
      }
    });
  } else if (message.content === '一時停止') {
    if (player) {
      message.delete();
      const embed1 = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('目覚ましボイス 一時停止')
        .setDescription('目覚ましボイスを一時停止しました。')
      message.channel.send({ embeds: [embed1] })
      player.pause();
    }
  } else if (message.content === '再開') {
    if (player) {
      message.delete();
      const embed2 = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('目覚ましボイス 再開')
        .setDescription('一時停止した目覚ましボイスを再開しました。')
      message.channel.send({ embeds: [embed2] })
      player.unpause();
    }
  } else if (message.content === '退出') {
    if (connection) {
      message.delete();
      const embed3 = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('目覚ましボイス 退出')
        .setDescription('VCから退出しました。')
      message.channel.send({ embeds: [embed3] })
      connection.destroy();
    }
  }else if ((message.content.includes('https://youtu'))||(message.content.includes('https://m.youtube.com/'))||(message.content.includes('https://www.youtube.com/'))) {
    if(message.content.includes('playlist?list=')){
      const voiceChannel = message.member.voice.channel;

      if (!voiceChannel) {
        return message.reply('Please join a voice channel first!');
      }

      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      message.delete();

      const playlistId = message.content.split('list=')[1].split('&')[0]; // 再生リストのIDを取得

      // 再生リストから動画の情報を取得
      const playlistInfo = await ytpl(playlistId);
      console.log(playlistInfo);
      for (let i = 0; i < playlistInfo.items.length; i++) {
        const videoInfo = playlistInfo.items[i];
        console.log(videoInfo.url);
        const stream = ytdl(videoInfo.url, { filter: 'audioandvideo' }); // 音声と映像を含むストリームを取得
        const resource = createAudioResource(stream); // 映像も含めてリソースを作成
        const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
          },
          volume: 0.5
        });
        
        const embed4 = new MessageEmbed()
          .setColor('RANDOM')
          .setTitle('YouTube再生リスト')
          .setDescription('送信されたYouTube再生リストを再生します。')
          .addField('再生リスト', message.content)
          .addField('再生インデックス',i+' / '+playlistInfo.estimatedItemCount)
          .addField('再生中の動画', videoInfo.title+'\n'+videoInfo.shortUrl)
        
        if (nowPlayingMessage) {
          nowPlayingMessage.edit({ embeds: [embed4] });
        } else {
          nowPlayingMessage = await message.channel.send({ embeds: [embed4] });
        }

        connection.subscribe(player);

        player.play(resource);

        // 次の動画を再生するためのイベントリスナーを設定
        player.once('stateChange', async (oldState, newState) => {
          if (newState.status === 'idle') {
            // 再生が停止した場合、次の動画を再生する
            const nextVideoInfo = playlistInfo.items[playlistInfo.items.indexOf(videoInfo) + 1];
            if (nextVideoInfo) {
              const nextStream = ytdl(nextVideoInfo.url, { filter: 'audioandvideo' });
              const nextResource = createAudioResource(nextStream);
                        
              // 現在のリソースの再生を停止してから、次のリソースを再生する
              player.stop();
              player.play(nextResource);
            }
          }
        });
        video_durationSec = 1000 * ((videoInfo.durationSec) + 2);

        // 次の動画の再生を開始する前に、一定時間待機する（例: 3秒）
        await new Promise(resolve => setTimeout(resolve, video_durationSec));
      }
      const embed5 = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('再生リスト終了')
        .addField('再生リスト', message.content)
        .setDescription('送信されたYouTube再生リストの再生が終了しました。')
      nowPlayingMessage.edit({ embeds: [embed5] })
      
    }else{
      const voiceChannel = message.member.voice.channel;

      if (!voiceChannel) {
        return message.reply('Please join a voice channel first!');
      }
      
      message.delete();
      const embed6 = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('YouTube再生')
        .setDescription('送信されたYouTubeの再生をします。')
        .addField('動画', message.content)
      nowPlayingMessage = await message.channel.send({ embeds: [embed6] })
      
      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      const stream = ytdl(message.content, { filter: 'audioandvideo' }); // 音声と映像を含むストリームを取得
      const resource = createAudioResource(stream); // 映像も含めてリソースを作成
      player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
        volume: 0.5
      });

      connection.subscribe(player);

      player.play(resource);

      player.on('stateChange', (oldState, newState) => {
        if (newState.status === 'idle') {
          const embed7 = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('再生終了')
            .addField('動画', message.content)
            .setDescription('送信されたYouTubeの再生が終了しました。')
          nowPlayingMessage.edit({ embeds: [embed7] })
          //connection.destroy();
        }
      });
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
