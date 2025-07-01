const fs = require('fs');
const path = require('path');

const tsconfigPath = path.resolve(__dirname, '../tsconfig.json');
const srcPath = path.resolve(__dirname, '../src');

const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

const folders = fs.readdirSync(srcPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
tsconfig.compilerOptions.baseUrl = 'src';
tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};

// Limpiar los alias previos que empiezan con @
Object.keys(tsconfig.compilerOptions.paths).forEach(key => {
  if (key.startsWith('@') && key.endsWith('/*')) {
    delete tsconfig.compilerOptions.paths[key];
  }
});

// Agregar alias para cada carpeta
folders.forEach(folder => {
  tsconfig.compilerOptions.paths[`@${folder}/*`] = [`${folder}/*`];
});

fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
console.log('Alias de tsconfig.json actualizados correctamente.'); 