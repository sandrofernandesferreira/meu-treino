const sharp = require('sharp');
const fs = require('fs');

const assetsDir = './assets';

// Criar diretório se não existir
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Cores do projeto (dark theme)
const bgColor = '#0D0D1A';
const accentColor = '#FF6B35';

// SVG para o ícone
const iconSvg = `
<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="${bgColor}"/>
  <circle cx="96" cy="96" r="60" fill="${accentColor}"/>
  <text x="96" y="110" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="${bgColor}" text-anchor="middle">MT</text>
</svg>
`;

// SVG para o splash
const splashSvg = `
<svg width="512" height="1024" viewBox="0 0 512 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="1024" fill="${bgColor}"/>
  <circle cx="256" cy="400" r="100" fill="${accentColor}"/>
  <text x="256" y="440" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="${bgColor}" text-anchor="middle">MEU</text>
  <text x="256" y="550" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="${accentColor}" text-anchor="middle">TREINO</text>
</svg>
`;

// SVG para o adaptive icon
const adaptiveIconSvg = `
<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="${bgColor}"/>
  <circle cx="96" cy="96" r="70" fill="${accentColor}"/>
</svg>
`;

// Criar PNGs a partir dos SVGs
sharp(Buffer.from(iconSvg))
  .png()
  .toFile(`${assetsDir}/icon.png`)
  .then(() => console.log('✓ icon.png criado'))
  .catch(err => console.error('Erro ao criar icon.png:', err));

sharp(Buffer.from(splashSvg))
  .png()
  .toFile(`${assetsDir}/splash-icon.png`)
  .then(() => console.log('✓ splash-icon.png criado'))
  .catch(err => console.error('Erro ao criar splash-icon.png:', err));

sharp(Buffer.from(adaptiveIconSvg))
  .png()
  .toFile(`${assetsDir}/adaptive-icon.png`)
  .then(() => console.log('✓ adaptive-icon.png criado'))
  .catch(err => console.error('Erro ao criar adaptive-icon.png:', err));
