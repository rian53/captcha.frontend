// Teste para verificar se os valores dos super surveys são sempre 2.5x maiores que os normais

// Simulando a função randomValue do backend
function randomValue(id, min, max) {
  const seed = id * 9301 + 49297;
  const value = (seed % 233280) / 233280;
  return Math.floor(min + value * (max - min));
}

// Simulando a nova lógica de cálculo
function calculateSurveyValue(surveyId, diffDays, hasBonus, isDetailPage = false) {
  // Primeiro calcula o valor normal
  let normalValue = 0;
  if (diffDays < 1) {
    // Dia 0: US$ 3,18 - US$ 6,94
    normalValue = randomValue(surveyId, 318, 694);
  } else if (diffDays >= 1 && diffDays <= 6) {
    // Dias 1-6: decremento linear de 299
    const decrement = Math.floor((299 - 1) / 5);
    let newValue = 299 - ((diffDays - 1) * decrement);
    normalValue = newValue < 1 ? 1 : newValue;
  } else {
    // Dia 7+: US$ 0,01
    normalValue = 1;
  }

  // Se for super survey, garante que seja pelo menos 2.5x maior
  if (hasBonus) {
    const minSuperValue = Math.ceil(normalValue * 2.5);
    
    if (isDetailPage) {
      // Página de detalhes: valores mais altos
      if (diffDays < 1) {
        const calculatedValue = randomValue(surveyId, 618, 928);
        return Math.max(calculatedValue, minSuperValue);
      } else if (diffDays >= 1 && diffDays <= 6) {
        const decrement = Math.floor((799 - 100) / 5);
        let newValue = 799 - ((diffDays - 1) * decrement);
        newValue = newValue < 100 ? 100 : newValue;
        return Math.max(newValue, minSuperValue);
      } else {
        return Math.max(50, minSuperValue);
      }
    } else {
      // Lista: valores menores mas garantindo 2.5x
      if (diffDays < 1) {
        const calculatedValue = randomValue(surveyId, 618, 928);
        return Math.max(calculatedValue, minSuperValue);
      } else if (diffDays === 1) {
        return Math.max(100, minSuperValue);
      } else if (diffDays >= 2 && diffDays <= 6) {
        const decrementSuper = Math.floor((200 - 50) / 5);
        let newValueSuper = 200 - ((diffDays - 1) * decrementSuper);
        newValueSuper = newValueSuper < 50 ? 50 : newValueSuper;
        return Math.max(newValueSuper, minSuperValue);
      } else {
        return Math.max(50, minSuperValue);
      }
    }
  }

  return normalValue;
}

// Testando diferentes cenários
console.log('=== TESTE DE VALORES DE SURVEYS ===\n');

const testCases = [
  { diffDays: 0, isDetailPage: false, description: 'Dia 0 - Lista' },
  { diffDays: 0, isDetailPage: true, description: 'Dia 0 - Detalhes' },
  { diffDays: 1, isDetailPage: false, description: 'Dia 1 - Lista' },
  { diffDays: 1, isDetailPage: true, description: 'Dia 1 - Detalhes' },
  { diffDays: 3, isDetailPage: false, description: 'Dia 3 - Lista' },
  { diffDays: 3, isDetailPage: true, description: 'Dia 3 - Detalhes' },
  { diffDays: 7, isDetailPage: false, description: 'Dia 7+ - Lista' },
  { diffDays: 7, isDetailPage: true, description: 'Dia 7+ - Detalhes' },
];

testCases.forEach(testCase => {
  console.log(`--- ${testCase.description} ---`);
  
  // Testar com survey ID 1 para consistência
  const normalValue = calculateSurveyValue(1, testCase.diffDays, false, testCase.isDetailPage);
  const superValue = calculateSurveyValue(1, testCase.diffDays, true, testCase.isDetailPage);
  const ratio = superValue / normalValue;
  
  console.log(`Normal: $${(normalValue / 100).toFixed(2)}`);
  console.log(`Super:  $${(superValue / 100).toFixed(2)}`);
  console.log(`Ratio:  ${ratio.toFixed(2)}x (deve ser >= 2.5x)`);
  console.log(`✅ ${ratio >= 2.5 ? 'PASSOU' : 'FALHOU'}\n`);
});
