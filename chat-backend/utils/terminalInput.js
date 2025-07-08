const Commands = require('./Commands');

function setupTerminalInput(io) {
  const listCommands = Commands({io:io});

  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function (text) {
    const input = text.trim();
  
    process.stdout.write('\x1b[1A');  
    process.stdout.write('\x1b[2K'); 
  
    console.log('► Comando recibido:', input);
    
    const [command, ...args] = input.split(/\s+/);
    
    if(listCommands[command] === undefined){
      console.log('  › Comando desconocido');
    }else{
      listCommands[command](args);
      console.log('► Fin de comando', input);
    }
  });
}
  
module.exports = setupTerminalInput;