
// Cores e logos das plataformas
export const platformConfigs = {
  youtube: {
    color: '#FF0000',
    name: 'YouTube',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg'
  },
  vimeo: {
    color: '#1AB7EA',
    name: 'Vimeo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Vimeo_Logo.svg'
  },
  screenpal: {
    color: '#00C851',
    name: 'ScreenPal',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop'
  },
  wistia: {
    color: '#54BBFF',
    name: 'Wistia',
    logo: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=100&h=100&fit=crop'
  },
  dailymotion: {
    color: '#0066CC',
    name: 'Dailymotion',
    logo: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=100&h=100&fit=crop'
  },
  facebook: {
    color: '#1877F2',
    name: 'Facebook',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg'
  },
  instagram: {
    color: '#E4405F',
    name: 'Instagram',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png'
  },
  twitch: {
    color: '#9146FF',
    name: 'Twitch',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Twitch_logo.svg'
  },
  outros: {
    color: '#6B7280',
    name: 'Outros',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop'
  }
};

// Função para gerar a imagem automática baseada na plataforma
export const generatePlatformImage = (platform: string): string => {
  const config = platformConfigs[platform as keyof typeof platformConfigs] || platformConfigs.outros;
  
  // Criar um canvas virtual para gerar a imagem
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // Definir dimensões
  canvas.width = 320;
  canvas.height = 180;
  
  // Preencher com a cor da plataforma
  ctx.fillStyle = config.color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Adicionar gradiente sutil
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, config.color);
  gradient.addColorStop(1, adjustBrightness(config.color, -20));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Adicionar texto da plataforma no centro
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.name, canvas.width / 2, canvas.height / 2);
  
  // Converter para Data URL
  return canvas.toDataURL('image/png');
};

// Função auxiliar para ajustar brilho da cor
function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Função para obter a imagem da plataforma (usar imagem gerada ou logo)
export const getPlatformImage = (platform: string): string => {
  const config = platformConfigs[platform as keyof typeof platformConfigs] || platformConfigs.outros;
  return generatePlatformImage(platform);
};

// Função para obter a cor da plataforma
export const getPlatformColor = (platform: string): string => {
  const config = platformConfigs[platform as keyof typeof platformConfigs] || platformConfigs.outros;
  return config.color;
};
