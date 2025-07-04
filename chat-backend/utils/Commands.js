const reloadEnv = require('./reloadEnv');

const Commands = {
  exit: () => {
    console.log('• Comando de cerrado');
        console.log('----------------------------------------------------------\n');
    console.log('  › Cerrando servidor...');
        console.log('\n----------------------------------------------------------');
    process.exit();
  },
  info: (args) => {
    if (args && args.length > 0) {
      args.forEach(arg => {
        switch (arg.toLowerCase()) {
          case 'pid':
            console.log(`  › PID: ${process.pid}`);
          break;
          case 'version':
            console.log(`  › Version: ${process.version}`);
          break; 
            case 'argv':
            console.log(`  › Argumentos de inicio: ${process.pid}`);
          break;
          case 'platform':
            console.log(`  › Plataforma: ${process.platform}`); 
          break;
          case 'uptime':
            console.log(`  › Tiempo activo: ${process.uptime()}`); 
          break;
          case 'memory':
            console.log('  › Memoria:');

            const mem = process.memoryUsage();

            for (const key in mem) {
              console.log(`    - ${key}: ${mem[key]}`);
            }
      
            console.log('\n----------------------------------------------------------');
          break;
          default:
            console.log(`  › Opción desconocida: ${arg}`);
        }
      });
    }else{
      console.log('----------------------------------------------------------\n');
      console.log('• Información del servidor');
      console.log(`  › PID: ${process.pid}`); 
      console.log(`  › Version: ${process.version}`); 
      console.log(`  › Argumentos de inicio: ${process.argv}`); 
      console.log(`  › Plataforma: ${process.platform}`); 
      console.log(`  › Tiempo activo: ${process.uptime()}`); 
      console.log('  › Memoria:');

      const mem = process.memoryUsage();

      for (const key in mem) {
        console.log(`    - ${key}: ${mem[key]}`);
      }
 
      console.log('\n----------------------------------------------------------');
    }
  },
  reload: () => {
    reloadEnv();
  }
};

module.exports = Commands;