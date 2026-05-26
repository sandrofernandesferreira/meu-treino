import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY_PREFIX = 'exerciseImage_';

/**
 * Mapa de exercícios para URLs de imagem (usando Pexels e imagens públicas)
 */
const exerciseImageMap = {
  'supino reto': 'https://images.pexels.com/photos/4761768/pexels-photo-4761768.jpeg?w=400&h=600&fit=crop',
  'supino inclinado': 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=400&h=600&fit=crop',
  'crucifixo': 'https://images.pexels.com/photos/3944311/pexels-photo-3944311.jpeg?w=400&h=600&fit=crop',
  'tríceps corda': 'https://images.pexels.com/photos/3941857/pexels-photo-3941857.jpeg?w=400&h=600&fit=crop',
  'tríceps testa': 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=400&h=600&fit=crop',
  'mergulho': 'https://images.pexels.com/photos/3808014/pexels-photo-3808014.jpeg?w=400&h=600&fit=crop',
  'barra fixa': 'https://images.pexels.com/photos/3808047/pexels-photo-3808047.jpeg?w=400&h=600&fit=crop',
  'rosca direta': 'https://images.pexels.com/photos/3808010/pexels-photo-3808010.jpeg?w=400&h=600&fit=crop',
  'puxada frente': 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=400&h=600&fit=crop',
  'remada curvada': 'https://images.pexels.com/photos/3808013/pexels-photo-3808013.jpeg?w=400&h=600&fit=crop',
  'remada baixa': 'https://images.pexels.com/photos/3808011/pexels-photo-3808011.jpeg?w=400&h=600&fit=crop',
  'rosca alternada': 'https://images.pexels.com/photos/3808012/pexels-photo-3808012.jpeg?w=400&h=600&fit=crop',
  'rosca concentrada': 'https://images.pexels.com/photos/3808009/pexels-photo-3808009.jpeg?w=400&h=600&fit=crop',
  'leg press': 'https://images.pexels.com/photos/3808006/pexels-photo-3808006.jpeg?w=400&h=600&fit=crop',
  'agachamento livre': 'https://images.pexels.com/photos/3808007/pexels-photo-3808007.jpeg?w=400&h=600&fit=crop',
  'cadeira extensora': 'https://images.pexels.com/photos/3808005/pexels-photo-3808005.jpeg?w=400&h=600&fit=crop',
  'mesa flexora': 'https://images.pexels.com/photos/3808008/pexels-photo-3808008.jpeg?w=400&h=600&fit=crop',
  'panturrilha': 'https://images.pexels.com/photos/3809673/pexels-photo-3809673.jpeg?w=400&h=600&fit=crop',
  'desenvolvimento': 'https://images.pexels.com/photos/3808017/pexels-photo-3808017.jpeg?w=400&h=600&fit=crop',
  'elevação lateral': 'https://images.pexels.com/photos/3808018/pexels-photo-3808018.jpeg?w=400&h=600&fit=crop',
  'elevação frontal': 'https://images.pexels.com/photos/3808019/pexels-photo-3808019.jpeg?w=400&h=600&fit=crop',
  'posterior': 'https://images.pexels.com/photos/3808020/pexels-photo-3808020.jpeg?w=400&h=600&fit=crop',
  'crunch': 'https://images.pexels.com/photos/3808021/pexels-photo-3808021.jpeg?w=400&h=600&fit=crop',
  'elevação de pernas': 'https://images.pexels.com/photos/3808022/pexels-photo-3808022.jpeg?w=400&h=600&fit=crop',
  'prancha': 'https://images.pexels.com/photos/3808023/pexels-photo-3808023.jpeg?w=400&h=600&fit=crop',
  'puxada costas': 'https://images.pexels.com/photos/3808013/pexels-photo-3808013.jpeg?w=400&h=600&fit=crop',
  'rosca martelo': 'https://images.pexels.com/photos/3808010/pexels-photo-3808010.jpeg?w=400&h=600&fit=crop',
};

/**
 * Busca imagem de exercício da cache ou da internet
 * @param {string} exerciseName - Nome do exercício
 * @returns {Promise<string|null>} URL da imagem ou null
 */
export async function searchExerciseImage(exerciseName) {
  if (!exerciseName || !exerciseName.trim()) {
    return null;
  }

  const cacheKey = `${CACHE_KEY_PREFIX}${exerciseName.toLowerCase()}`;

  try {
    // Verificar cache local primeiro
    const cachedUrl = await AsyncStorage.getItem(cacheKey);
    if (cachedUrl) {
      return cachedUrl;
    }

    // Buscar imagem do mapa de exercícios
    const imageUrl = getExerciseImage(exerciseName);

    if (imageUrl) {
      // Cachear a URL
      await AsyncStorage.setItem(cacheKey, imageUrl);
      return imageUrl;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    return null;
  }
}

/**
 * Função helper para retornar URLs de imagem baseado no nome do exercício
 */
function getExerciseImage(exerciseName) {
  const lowerName = exerciseName.toLowerCase().trim();

  // Procurar por correspondência exata
  if (exerciseImageMap[lowerName]) {
    return exerciseImageMap[lowerName];
  }

  // Procurar por correspondência parcial
  for (const [key, url] of Object.entries(exerciseImageMap)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return url;
    }
  }

  // Se não encontrar, retornar null (será usado placeholder)
  return null;
}

/**
 * Limpar cache de imagens
 */
export async function clearImageCache() {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const cacheKeys = allKeys.filter(key =>
      key.startsWith(CACHE_KEY_PREFIX)
    );
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  }
}

/**
 * Buscar imagem de forma assíncrona com fallback
 * Pode ser usada em background sem bloquear UI
 */
export async function preloadExerciseImage(exerciseName) {
  try {
    const url = await searchExerciseImage(exerciseName);
    if (url) {
      // Pré-carregar a imagem verificando se é uma URL válida
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = reject;
        img.src = url;
      });
    }
  } catch (error) {
    console.error('Erro ao pré-carregar imagem:', error);
  }
}
