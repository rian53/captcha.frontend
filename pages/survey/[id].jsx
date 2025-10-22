import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Loader2,
  Star,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { surveysService } from "@/services";
import { toast } from "sonner";

const SURVEY_QUESTIONS = [
  {
    id: 1,
    question:
      "Lo que está escrito en el CAPTCHA anterior (puedes cometer un error o dejarlo incompleto si no lo entiendes)",
    type: "input",
  },
  {
    id: 2,
    question:
      "¿Cuál es su percepción general sobre la dificultad de los CAPTCHA presentados?",
    type: "textarea",
  },
  {
    id: 3,
    question:
      "¿Alguna vez has tenido dificultades para completar un CAPTCHA? Si es así, ¿cuál fue la razón principal?",
    type: "textarea",
  },
  {
    id: 4,
    question:
      "En su opinión, ¿los CAPTCHA son eficaces para impedir el acceso automatizado?",
    type: "textarea",
  },
  {
    id: 5,
    question:
      "¿Alguna vez abandonó el acceso a un sitio web o servicio porque no pudo completar un CAPTCHA?",
    type: "textarea",
  },
  {
    id: 6,
    question:
      "¿Qué tan satisfecho está con la experiencia general al utilizar CAPTCHA?",
    type: "textarea",
  },
  {
    id: 7,
    question:
      "¿Qué mejoras sugieres para que los CAPTCHA sean más accesibles y fáciles de completar?",
    type: "textarea",
  },
  {
    id: 8,
    question: "¿Qué calificación general le das a este CAPTCHA?",
    type: "grade",
  },
];

function SurveyPage() {
  const router = useRouter();
  const { id } = router.query;

  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [imageData, setImageData] = useState('');
  const [loadingImage, setLoadingImage] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (id) {
      loadSurvey();
      fetchImage();
    }
  }, [id]);

  const fetchImage = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "*/*");
      myHeaders.append("Accept-Language", "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6,ja;q=0.5,ru;q=0.4");
      myHeaders.append("Cache-Control", "no-cache");
      myHeaders.append("Connection", "keep-alive");
      myHeaders.append("DNT", "1");
      myHeaders.append("Pragma", "no-cache");
      myHeaders.append("Referer", "https://captcha.com/demos/features/captcha-demo.aspx");
      myHeaders.append("Sec-Fetch-Dest", "empty");
      myHeaders.append("Sec-Fetch-Mode", "cors");
      myHeaders.append("Sec-Fetch-Site", "same-origin");
      myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36");
      myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"");
      myHeaders.append("sec-ch-ua-mobile", "?0");
      myHeaders.append("sec-ch-ua-platform", "\"Windows\"");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      let response = await fetch('https://cors.blackgoatproject.com.br/https://captcha.com/forms/captcha-demo-features/captcha-endpoint.php?get=image&c=demoCaptcha&t=c7c7b8093c188b07f1c75561b4c618b3', requestOptions);
      if (!response.ok) {
        throw new Error('Erro ao buscar a imagem');
      }
      let blob = await response.blob();
      let url = URL.createObjectURL(blob);
      setImageData(url);
      setLoadingImage(false);
    } catch (error) {
      console.error('Erro ao buscar a imagem:', error);
      setImageError(true);
      setLoadingImage(false);
    }
  };

  const loadSurvey = async () => {
    try {
      const data = await surveysService.getById(id);
      if (data.status === 200) {
        setSurvey(data.response.survey);
      }
    } catch (error) {
      toast.error(error.message || "Não foi possível carregar a búsqueda");
      router.push("/home");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    const reais = (value / 100).toFixed(2);
    return `US$ ${reais.replace(".", ",")}`;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    const currentQuestion = SURVEY_QUESTIONS[currentStep];
    if (!answers[currentQuestion.id]) {
      toast.error("Por favor, responda a pergunta antes de continuar");
      return;
    }

    // Validação especial para a primeira pergunta (CAPTCHA)
    if (currentStep === 0 && answers[currentQuestion.id].length < 5) {
      toast.error("Responde la pregunta con 5 o más palabras.");
      return;
    }

    if (currentStep < SURVEY_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const currentQuestion = SURVEY_QUESTIONS[currentStep];
    if (!answers[currentQuestion.id]) {
      toast.error("Por favor, responda a pergunta antes de finalizar");
      return;
    }

    // Validação especial para a primeira pergunta (CAPTCHA)
    if (currentStep === 0 && answers[currentQuestion.id].length < 5) {
      toast.error("Responde la pregunta con 5 o más palabras.");
      return;
    }

    try {
      setSubmitting(true);
      const result = await surveysService.complete(parseInt(id));

      if (result.status === 200) {
        toast.success(`Búsqueda completada! Ganaste ${formatCurrency(
          result.earnedValue
        )}`);
        router.push("/home");
      }
    } catch (error) {
      toast.error(error.message || "Não foi possível completar a búsqueda");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!survey) {
    return null;
  }

  const currentQuestion = SURVEY_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / SURVEY_QUESTIONS.length) * 100;
  const isLastQuestion = currentStep === SURVEY_QUESTIONS.length - 1;

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Header com informações do produto */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div
              className="w-16 h-16 bg-center bg-contain bg-no-repeat rounded"
              style={{ backgroundImage: `url(${survey.imageUrl})` }}
            />
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-primary mb-2">
                {survey.title}
              </h2>
              <div className="flex items-center gap-6">
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(survey.value)}
                </span>
                {survey.hasBonus === 1 && (
                  <Badge variant="gold" className="text-yellow-900 text-xs px-2 py-1">
                    SÚPER CALIFICACIÓN
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barra de progresso */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">
              Pregunta {currentStep + 1} de {SURVEY_QUESTIONS.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-primary/20 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pergunta atual */}
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-md">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Exibir imagem do CAPTCHA apenas na primeira pergunta */}
          {currentStep === 0 && (
            <div className="mb-4">
              {loadingImage ? (
                <div className="flex items-center justify-center rounded aspect-video bg-gray-200">
                  <span className="text-gray-500">Cargando imagen...</span>
                </div>
              ) : imageError ? (
                <div className="flex items-center justify-center rounded aspect-video bg-gray-200">
                  <span className="text-red-500">Error al cargar la imagen.</span>
                </div>
              ) : (
                <img
                  src={imageData}
                  alt="Captcha Image"
                  className="object-center object-contain rounded w-full max-w-md mx-auto"
                />
              )}
            </div>
          )}

          {currentQuestion.type === "input" && (
            <Input
              value={answers[currentQuestion.id] || ""}
              onChange={(e) =>
                handleAnswerChange(currentQuestion.id, e.target.value)
              }
              placeholder="Tu respuesta..."
              className="w-full"
            />
          )}

          {currentQuestion.type === "textarea" && (
            <Textarea
              value={answers[currentQuestion.id] || ""}
              onChange={(e) =>
                handleAnswerChange(currentQuestion.id, e.target.value)
              }
              placeholder="Tu respuesta..."
              rows={4}
              className="w-full"
            />
          )}

          {currentQuestion.type === "grade" && (
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((grade) => (
                <button
                  key={grade}
                  onClick={() => handleAnswerChange(currentQuestion.id, grade)}
                  className={`p-3 rounded-lg transition-all ${
                    answers[currentQuestion.id] === grade
                      ? "bg-yellow-400 scale-110"
                      : "bg-slate-200 hover:bg-slate-300"
                  }`}
                >
                  <Star
                    className={`w-8 h-8 ${
                      answers[currentQuestion.id] >= grade
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-slate-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botões de navegação */}
      <div className="flex gap-2">
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1"
            disabled={submitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
        )}

        {!isLastQuestion ? (
          <Button onClick={handleNext} className="flex-1" disabled={submitting}>
            Siguiente
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Finalizar
              </>
            )}
          </Button>
        )}
      </div>

      {/* Botão de voltar */}
      <Button 
        variant="ghost" 
        className="w-full"
        onClick={() => router.push("/home")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al inicio
      </Button>
    </div>
  );
}

SurveyPage.layoutName = "Búsqueda";
export default SurveyPage;

