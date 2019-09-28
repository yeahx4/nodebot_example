const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')
const klog = require('korean-logger')
client.commands = new Discord.Collection()

fs.readdir('./commands/', (err, files) => {

  if(err) klog.error(err)

  let jsfile = files.filter(f => f.split('.').pop() === 'js')
  if(jsfile.length <= 0) {
    klog.warn('Failed to load command!')
    return
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`)
    klog.success(`${f} Loaded!`)
    client.commands.set(props.help.name, props)
  })

})

client.on('ready', () => {
  klog.alert(`Online ${client.user.tag}`);
});

client.on('message', message => {
  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;

  let prefix = 'YOUR_PREFIX'
  let messageArray = message.content.split(' ')
  let cmd = messageArray[0]
  let args = messageArray.slice(1)

  let commandfile = client.commands.get(cmd.slice(prefix.length))
  if(!message.content.startsWith(prefix)) return;
  if(message.content.startsWith(prefix) && !commandfile) return;
  if(commandfile) commandfile.run(client,message,args)
})

client.login('YOUR_TOKEN')
