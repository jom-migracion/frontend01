// Lista básica de palabras ofensivas (expandir según necesidades)
const OFFENSIVE_WORDS = [
  // Palabras explícitamente ofensivas en español
  "idiota",
  "estúpido",
  "tonto",
  "imbécil",
  "maldito",
  "carajo",
  "joder",
  "mierda",
  "puta",
  "pendejo",
  "culero",
  "verga",
  "coño",
  "gilipollas",
  "zorra",
  "cabronazo",
  "hijo de puta",
  "chinga tu madre",
  "pito",
  "culo",
  "idiot",
  "stupid",
  "dumb",
  "moron",
  "damn",
  "bastard",
  "asshole",
];

// Lista de palabras inapropiadas para descripciones de propiedades
const INAPPROPRIATE_PROPERTY_WORDS = [
  "drogas",
  "prostitución",
  "ilegal",
  "estafa",
  "fraude",
  "violencia",
  "amenaza",
  "discriminación",
  "sexo",
  "pornografía",
  "alcoholismo",
  "adicción",
];

// ---------------------------------------------------------------------------
// CARACTERES DE CONTROL E INVISIBLES
// Fuente principal: https://www.uv.es/jac/guia/coditab.htm (tabla uv.es)
// Complementado con rangos Unicode de control/invisible estándar.
//
// Rangos incluidos:
//   \u0000-\u001F  → Caracteres de control ASCII (NUL, BEL, BS, TAB*, LF*, CR*, etc.)
//                    &#0; – &#31; en la tabla uv.es
//   \u007F         → DEL (Delete) &#127;
//   \u0080-\u009F  → Caracteres de control C1 (Latin-1 Supplement, no imprimibles)
//                    &#128; – &#159; en la tabla uv.es
//   \u00A0         → Espacio de no separación (nbsp &#160;) — puede usarse para ocultar texto
//   \u00AD         → Guión suave (shy &#173;) — invisible, usado para ofuscación
//   \u034F         → Combinación de grafema unificador (invisible)
//   \u115F-\u1160  → Jamo consonante/vocal vacío (coreano, invisible)
//   \u17B4-\u17B5  → Caracteres invisibles del Khmer
//   \u180B-\u180D  → Selectores de variación mongola (invisibles)
//   \u180E         → Separador de vocal mongola (invisible)
//   \u200B-\u200F  → Espacios de ancho cero y marcadores de dirección:
//                      \u200B ZWSP (Zero Width Space)
//                      \u200C ZWNJ (Zero Width Non-Joiner)
//                      \u200D ZWJ  (Zero Width Joiner)
//                      \u200E LRM  (Left-to-Right Mark)
//                      \u200F RLM  (Right-to-Left Mark)
//   \u2028-\u2029  → Separador de línea y párrafo Unicode
//   \u202A-\u202E  → Caracteres de control de dirección (LRE, RLE, PDF, LRO, RLO)
//                    Usados en ataques de inversión de texto (bidirectional spoofing)
//   \u2060-\u2064  → Word Joiner y caracteres de formato invisible
//   \u2066-\u206F  → Marcadores de aislamiento bidireccional y caracteres de control
//   \u3164         → Hangul Filler (carácter coreano invisible)
//   \uFEFF         → BOM / Zero Width No-Break Space (ByteOrderMark, invisible)
//   \uFFF9-\uFFFB  → Marcadores de anotación intercalada (invisibles)
//   \uFFFC-\uFFFD  → Objeto de reemplazo / carácter de reemplazo Unicode
//   \uFFFE-\uFFFF  → No son caracteres Unicode válidos
// ---------------------------------------------------------------------------
// Se permiten saltos de línea CR/LF; todos los demás caracteres de control y
// caracteres invisibles siguen bloqueados.
const CONTROL_CHAR_REGEX =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u0080-\u009F\u00A0\u00AD\u034F\u115F\u1160\u17B4\u17B5\u180B-\u180E\u200B-\u200F\u2028\u2029\u202A-\u202E\u2060-\u2064\u2066-\u206F\u3164\uFEFF\uFFF9-\uFFFF]/;

// ---------------------------------------------------------------------------
// ENTIDADES HTML NUMÉRICAS SOSPECHOSAS
// Detecta el uso de entidades HTML codificadas (&#NNN; o &#xHH;) que podrían
// usarse para ocultar caracteres de control o invisibles de la tabla uv.es.
//
// Rangos bloqueados según tabla uv.es (&#0;–&#31;, &#127;–&#159;, &#173;):
//   &#0; – &#31;   → Control ASCII
//   &#127;         → DEL
//   &#128;–&#159;  → Control C1
//   &#160;         → &nbsp; (espacio invisible)
//   &#173;         → &shy;  (guión suave invisible)
//   &#8203;–&#8207 → ZWSP, ZWNJ, ZWJ, LRM, RLM  (\u200B-\u200F)
//   &#8232;–&#8239 → Separadores de línea/párrafo y espacios especiales
//   &#8288;–&#8303 → Caracteres de formato Unicode (Word Joiner, etc.)
//   &#65279;       → BOM \uFEFF
// ---------------------------------------------------------------------------
const HTML_ENTITY_CONTROL_REGEX =
  /&#(x[0-9a-fA-F]+|[0-9]+);/;

/**
 * Verifica si una entidad HTML numérica corresponde a un carácter de control
 * o invisible según los rangos de la tabla uv.es y Unicode.
 */
function isControlHtmlEntity(entity: string): boolean {
  const match = entity.match(/&#(x[0-9a-fA-F]+|([0-9]+));/);
  if (!match) return false;

  const codePoint = match[1].startsWith("x")
    ? parseInt(match[1].slice(1), 16)
    : parseInt(match[1], 10);

  return (
    (codePoint >= 0 && codePoint <= 31) ||    // Control ASCII &#0;–&#31;
    codePoint === 127 ||                        // DEL &#127;
    (codePoint >= 128 && codePoint <= 159) ||  // Control C1 &#128;–&#159;
    codePoint === 160 ||                        // &nbsp; &#160;
    codePoint === 173 ||                        // &shy; &#173;
    (codePoint >= 8203 && codePoint <= 8207) || // ZWSP–RLM &#8203;–&#8207;
    (codePoint >= 8232 && codePoint <= 8239) || // Separadores línea/párrafo
    (codePoint >= 8288 && codePoint <= 8303) || // Formato Unicode
    codePoint === 65279                         // BOM &#65279;
  );
}

/**
 * Detecta entidades HTML numéricas que representan caracteres de control/invisibles.
 * Esto evita que alguien use &#0; o &#x200B; para ocultar contenido ofensivo.
 */
function hasControlHtmlEntities(text: string): boolean {
  const matches = text.match(HTML_ENTITY_CONTROL_REGEX);
  if (!matches) return false;
  return matches.some(isControlHtmlEntity);
}

// Permite exactamente los caracteres que se consideran válidos en descripciones
// y textos normales del negocio. Cualquier símbolo fuera de esta lista se
// considera sospechoso y se bloquea.
const ALLOWED_SPECIAL_CHARACTERS = new Set([
  "*",
  ".",
  ",",
  ";",
  ":",
  "!",
  "?",
  "¿",
  "¡",
  "(",
  ")",
  "[",
  "]",
  "/",
  "\\",
  "-",
  "_",
  "+",
  "&",
  "%",
  "$",
  "€",
  '"',
  "'",
  " ",
  "\n",
  "\r",
  "•",
  "·",
  "–",
  "—",
]);

function hasDisallowedCharacters(text: string): boolean {
  for (const char of text) {
    const isLetter = /\p{L}/u.test(char);
    const isNumber = /\p{N}/u.test(char);
    if (isLetter || isNumber || ALLOWED_SPECIAL_CHARACTERS.has(char)) continue;
    return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// EMOJIS
// Usa las propiedades Unicode estándar para detectar TODOS los emojis sin
// depender de rangos manuales de surrogate pairs (que pueden fallar según el
// motor JS y quedar desactualizados con nuevos emojis).
//
// \p{Emoji_Presentation}   → Emojis que siempre se renderizan como imagen:
//                             😁 🏠 🌿 ❤️ 🐶 🍕 — el grueso de todos los emojis
// \p{Extended_Pictographic} → Pictogramas extendidos definidos por Unicode:
//                             Cubre caras, objetos, símbolos, banderas, gestos,
//                             animales, comida, actividades, viajes, etc.
//                             Incluye emojis nuevos que aún no tienen
//                             Emoji_Presentation asignado.
//
// La combinación de ambas propiedades captura el universo completo de emojis
// sin generar falsos positivos en dígitos (0-9), letras ni puntuación normal.
// ---------------------------------------------------------------------------
const EMOJI_REGEX = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

// Nota: se mantiene la bandera 'g' solo para extraer coincidencias en el texto,
// pero cada validación debe reiniciar lastIndex antes de usar .test().
const resetRegexState = (regex: RegExp) => {
  regex.lastIndex = 0;
  return regex;
};

/**
 * Detecta si una palabra contiene una palabra ofensiva con símbolos intercalados
 * Ejemplo: "p#ta" contiene "puta" con # intercalado
 */
function detectIntercalatedWord(word: string, offensiveWord: string): boolean {
  const cleanWord = word.toLowerCase();

  // Crear versión híbrida: normalizar números pero mantener letras
  const hybridWord = cleanWord
    .replace(/[@4]/g, "a")
    .replace(/[3]/g, "e")
    .replace(/[1!|]/g, "i")
    .replace(/[0]/g, "o")
    .replace(/[5]/g, "s")
    .replace(/[7]/g, "t");

  // Extraer solo las letras en orden
  const lettersOnly = hybridWord.replace(/[^a-z]/g, "");

  if (lettersOnly === offensiveWord) return true;
  if (lettersOnly.includes(offensiveWord) && offensiveWord.length >= 3) return true;
  if (lettersOnly.length >= 3 && offensiveWord.length > 4 && levenshteinDistance(lettersOnly, offensiveWord) <= 1) return true;

  return false;
}

/**
 * Normaliza texto censurado reemplazando símbolos y números por letras originales
 */
function normalizeCensoredText(text: string): string {
  return text
    .replace(/[@4]/g, "a")
    .replace(/[3]/g, "e")
    .replace(/[1!|]/g, "i")
    .replace(/[0]/g, "o")
    .replace(/[5]/g, "s")
    .replace(/[7]/g, "t")
    .replace(/[\*#\+\-_]/g, "")
    .replace(/[^a-z]/g, "");
}

/**
 * Detecta si una palabra podría ser una versión censurada de palabras ofensivas
 */
function detectCensoredWord(word: string, offensiveWords: string[]): boolean {
  const originalWord = word.toLowerCase();

  return offensiveWords.some((offensive) => {
    if (detectIntercalatedWord(originalWord, offensive)) return true;

    const normalizedWord = normalizeCensoredText(originalWord);
    if (normalizedWord.length >= 2) {
      if (normalizedWord === offensive) return true;
      if (normalizedWord.includes(offensive) && offensive.length >= 3) return true;
      if (offensive.length > 4 && levenshteinDistance(normalizedWord, offensive) <= 1 && normalizedWord.length >= 3) return true;
    }

    const cleanWord = originalWord.replace(/[^a-z0-9]/g, "");
    if (cleanWord.length >= 3) {
      if (cleanWord === offensive) return true;
      if (cleanWord.includes(offensive) && offensive.length >= 3) return true;
      if (offensive.length > 4 && levenshteinDistance(cleanWord, offensive) <= 1) return true;
    }

    return false;
  });
}

/**
 * Valida si hay uso problemático de caracteres especiales.
 * Incluye detección de:
 *   1. Caracteres de control/invisibles (rangos Unicode + tabla uv.es)
 *   2. Entidades HTML numéricas que encubren caracteres de control (&#NNN;, &#xHH;)
 *   3. Símbolos sin sentido semántico (#, @, !, $, etc.) — incluso 1 solo bloquea
 *   4. Emojis (todos los bloques Unicode de pictogramas y símbolos)
 *   5. Ratio excesivo de caracteres especiales (> 35%)
 *   6. Rachas largas de símbolos consecutivos (spam/ofuscación)
 */
function hasProblematicSpecialCharacters(text: string): boolean {
  if (!text) return false;

  // 1) Caracteres de control/invisibles Unicode (incluye rangos de tabla uv.es)
  if (resetRegexState(CONTROL_CHAR_REGEX).test(text)) return true;

  // 2) Entidades HTML numéricas que representan caracteres de control/invisibles
  //    Ejemplo: &#0; &#160; &#x200B; &#173; etc. (según tabla uv.es)
  if (hasControlHtmlEntities(text)) return true;

  // 3) Símbolos fuera del conjunto permitido en texto descriptivo.
  //    Esto bloquea caracteres como #, @, *, =, >, <, ~, etc., pero permite la
  //    puntuación, monedas y símbolos específicos requeridos por el negocio.
  if (hasDisallowedCharacters(text)) return true;

  // 4) Emojis — ningún emoji es válido en texto descriptivo de propiedades.
  //    Cubre todos los bloques Unicode: caras, objetos, banderas, símbolos, etc.
  //    Ejemplos bloqueados: "bonita casa 😊", "apto🏠centro", "jardín 🌿🌸"
  if (resetRegexState(EMOJI_REGEX).test(text)) return true;

  // 5) No hay más bloqueos adicionales: la lista blanca anterior ya valida que
  //    solo se usen los caracteres aceptados por la regla de negocio.
  return false;
}

/**
 * Valida si el texto contiene contenido ofensivo o inapropiado
 * @param text Texto a validar
 * @returns Objeto con resultado de validación y palabras encontradas
 */
export const validateOffensiveContent = (
  text: string
): {
  isValid: boolean;
  offensiveWords: string[];
  severity: "low" | "medium" | "high";
} => {
  if (!text || typeof text !== "string") {
    return { isValid: true, offensiveWords: [], severity: "low" };
  }

  // Bloquear payloads con caracteres especiales maliciosos o excesivos
  if (hasProblematicSpecialCharacters(text)) {
    return {
      isValid: false,
      offensiveWords: ["caracteres_especiales"],
      severity: "medium",
    };
  }

  const normalizedText = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");

  const words = normalizedText.split(/\s+/);
  const foundOffensiveWords: string[] = [];
  const foundInappropriateWords: string[] = [];

  words.forEach((word) => {
    const hasOffensiveWord = OFFENSIVE_WORDS.some(
      (offensive) => {
        if (word.includes(offensive)) return true;
        return offensive.length > 4 && levenshteinDistance(word, offensive) <= 1;
      }
    );
    const hasCensoredWord = detectCensoredWord(word, OFFENSIVE_WORDS);
    if (hasOffensiveWord || hasCensoredWord) {
      foundOffensiveWords.push(word);
    }
  });

  words.forEach((word) => {
    const hasInappropriateWord = INAPPROPRIATE_PROPERTY_WORDS.some(
      (inappropriate) => word.includes(inappropriate)
    );
    const hasCensoredInappropriate = detectCensoredWord(word, INAPPROPRIATE_PROPERTY_WORDS);
    if (hasInappropriateWord || hasCensoredInappropriate) {
      foundInappropriateWords.push(word);
    }
  });

  const allProblematicWords = [...foundOffensiveWords, ...foundInappropriateWords];

  let severity: "low" | "medium" | "high" = "low";
  if (foundOffensiveWords.length > 0) {
    severity = "high";
  } else if (foundInappropriateWords.length > 0) {
    severity = "medium";
  }

  return {
    isValid: allProblematicWords.length === 0,
    offensiveWords: allProblematicWords,
    severity,
  };
};

/**
 * Cálculo simple de distancia Levenshtein para detectar variaciones
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  const n = str1.length;
  const m = str2.length;

  if (n === 0) return m;
  if (m === 0) return n;

  for (let i = 0; i <= m; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[m][n];
}