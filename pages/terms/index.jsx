import { useRouter } from "next/router";
import { useTheme } from "next-themes";

export default function Terms() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen gap-2 p-5">
      <div className="flex flex-col gap-5 p-5 rounded-lg bg-card max-w-4xl">
        <div className="flex justify-center mb-4">
          <img 
            src={resolvedTheme === 'dark' ? "/img/logo-white.png" : "/img/logo-black.png"} 
            alt="EscalaPro Logo"
            className="h-12 w-auto object-contain"
          />
        </div>
        
        <h1 className="mb-2 text-xl font-bold text-center">
          Términos y condiciones de uso de la aplicación
        </h1>
        
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">ACEPTACIÓN</h2>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Estos "Términos y condiciones de uso de la solicitud" rigen el uso de la aplicación "Captcha" original, y son válidos para todas y cada una de las opciones de uso, ya sea para dispositivos móviles (Android, IOS, Windows Mobile), servidores, computadoras personales (escritorios) o servicio web.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Lea atentamente estos términos, ya que el uso de la aplicación significa que el usuario ha aceptado todos los términos y se compromete a cumplirlos. Si el usuario es menor o considerado incapaz por la legislación para expresar su aceptación, necesitará la permiso de tus padres o tutores, quienes también deben aceptar estos mismos términos y condiciones.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Si el usuario no está de acuerdo con los términos y condiciones aquí expuesto, no debe utilizar esta aplicación. Si ya has comprado cupones o productos que se venden dentro de la aplicación, el usuario puede solicitar un reembolso a través de la plataforma de pagos que intermediaron la compra, que reembolsará automáticamente su compra, si se reembolsa solicitarse dentro de los plazos de 7 dias.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Para solicitudes de retiro, nos reservamos el derecho de realizar el pago solo si el cliente completa los objetivos y de acuerdo con la disponibilidad de nuestros sistemas. El pago de los retiros se realizará a través de PayPal o del banco registrado en la plataforma.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            El pago de +Superevaluación es una suscripción mensual, que puedes cancelar en cualquier momento.
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">LICENCIA LIMITADA GRATUITA</h2>
          <h3 className="text-xs leading-tight text-muted-foreground">
            La creación de cuenta le da al usuario acceso a una licencia limitado, intransferible, no exclusivo, libre de regalías y revocable, que incluye la descarga, instalación, ejecuta y utiliza esta aplicación en tu dispositivo.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            El usuario que descarga la aplicación acepta que posee un licencia exclusiva para usar la aplicación y, por lo tanto, no le transfiere derechos sobre el producto.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Con excepción de los productos y cupones vendidos dentro del aplicación, la licencia de acceso Captcha es completamente GRATIS bajo cualquier circunstancia.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Se autoriza la venta de infoproductos en general, comercializando el información sobre el modo de acceso, creación de cuenta, licencia de uso o cómo utilizar mejor Captcha como fuente de ingresos extra, así como códigos y cupones. El usuario, por su parte, es consciente y acepta que el responsable de la aplicación no es responsable de atender y/o reembolsar los montos cobrados por estos productos, ya que puedes acceder a Captcha de forma gratuita a través del sitio web donde está alojado.
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">USO DE LA APLICACIÓN</h2>
          <h3 className="text-xs leading-tight text-muted-foreground">
            La aplicación debe ser utilizada por el usuario. En venta, transferencia, modificación, ingeniería inversa o distribución, así como la copia de textos, imágenes o cualquier parte del mismo está expresamente <span className="font-bold underline">prohibida.</span>
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            La aplicación permite al usuario acumular créditos en reales, generado a partir de valoraciones positivas o negativas de productos realizadas por el usuario.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Los productos a evaluar por el usuario serán disponibles en la aplicación de forma escalonada, con una posible reducción en el número de productos disponibles cada nueva semana de uso, debido a la reducción de la demanda de evaluaciones dentro del aplicación o aumento del número de usuarios.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            El tiempo necesario para que el usuario califique todas las imágenes disponibles y, como resultado de estas evaluaciones, permitir al usuario retirar el saldo acumulado, dependerá de la demanda de evaluaciones y también del número de usuarios de la aplicación, pero el usuario Debes cumplir la meta en un plazo de 6 meses, que es el plazo para que una evaluación realizada pierda su vigencia y caduque.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            El retiro del saldo acumulado se liberará dentro de los 02 (dos) semanas después de la solicitud, mediante transferencia bancaria a la cuenta facilitada por el usuario en el momento registro en la aplicación, cuya cuenta debe ser propiedad del usuario.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Se ha alcanzado la fecha de vencimiento de la licencia de uso sin el El usuario ha solicitado el retiro, el monto del saldo acumulado se acreditará automáticamente en la cuenta. no conforme dentro de los 30 (treinta) días siguientes a la expiración de la licencia, siempre que se haya cumplido el objetivo de evaluación. sido golpeado.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            El botón de retiro se soltará una vez que las calificaciones alcancen el objetivo. se accede dentro de la aplicación.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Cuando se solicita un retiro, las revisiones serán auditadas Se descontarán las evaluaciones que no sean válidas dentro de los siguientes criterios: Se considerarán las evaluaciones que no sean válidas. valida evaluaciones no respondidas, o aquellas respondidas con menos de una justificación que respalde la respuesta. Ya que no son válidas justificaciones como "porque sí", "porque me gusta", "porque me pareció bonito", porque quiero" y similares.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Podrá ocurrir, por decisión de la administración de la aplicación, ventanas de anticipación, en las que la opción de anticipar la retirada antes de los objetivos de valoración del Los usuarios son aprovechados, pero con tarifas anticipadas con descuento que se calcularán de acuerdo con el número de reseñas mencionadas en los términos de uso.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            El cupón de "desbloqueo de saldo" permite al usuario desbloquea el límite del saldo máximo en la aplicación Captcha a una cantidad mayor, permitiéndote recibir importes mayores al alcanzar el objetivo de valoración, siempre que sea conforme a las condiciones de pago mencionado anteriormente en las condiciones de uso.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            El cupón "200 reseñas más" aumentará tu volumen evaluaciones disponibles en hasta 4 evaluaciones adicionales por día, hasta agotar 200 evaluaciones. pero no contará para el objetivo.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Cupones comprados por separado (como el cupón "+100 saldo", cupón de "duplicar su saldo" o cupón de "desbloqueo de saldo") se agregan al retiro cuando el Se logra la meta, y no se aplica a anticipaciones o metas logradas con más del 10% de las evaluaciones consideradas. no válido.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            El administrador de la aplicación no tiene ninguna responsabilidad para pago de saldos obtenidos en sitios web pirateados, copias o similares a Captcha, con su responsabilidad restringida a saldos obtenidos exclusivamente a través de Captcha, de conformidad con las reglas contenida en estos términos y condiciones de uso.
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">CONDICIONES DE TERMINACIÓN</h2>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Para utilizar la aplicación, el usuario está obligado a pagar el valor de la licencia de uso, así como estar obligado a comprobar el valor del objetivo a alcanzar para la liberación del retiro, el valor del crédito que se generará por cada evaluación realizada y el número de productos a ser disponible en cada campaña.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            El suministro de información de registro falsa resultará, en cualquier momento, en la eliminación de su cuenta, y es responsabilidad exclusiva del usuario mantener información de inicio de sesión y contraseña para su uso personal exclusivo.
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">CAMBIOS, MODIFICACIONES Y TERMINACIÓN</h2>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Estos términos podrán modificarse, ya sea incluyendo, eliminando o alterando cualquiera de sus cláusulas. Dichas modificaciones entrarán en vigor inmediatamente.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Después de publicar los cambios, continuar usando el solicitud, el usuario habrá aceptado y acordado cumplir con los términos modificados.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            El usuario debe tener en cuenta que de vez en cuando, puede modificar o discontinuar (temporal o permanentemente) la distribución o actualización de esto aplicación.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            El proveedor de la aplicación no tiene obligación de proporcionar cualquier servicio de soporte para el mismo. El usuario no puede responsabilizar al productor de la aplicación ni sus funcionarios ejecutivos, empleados, afiliados, agentes, divulgadores, contratistas o licenciantes para cualquier modificación, suspensión o interrupción de la aplicación.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Este contrato puede rescindirse debido a incumplimiento de estos términos y condiciones de uso, debido a la inactividad del usuario durante el mismo período o superior a 30 días, así como excepcionalmente por caso fortuito o fuerza mayor.
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">RESPONSABILIDAD</h2>
          <h3 className="text-xs leading-tight text-muted-foreground">
            La aplicación estará en desarrollo y actualizaciones continuo y puede presentar errores y defectos. Por este motivo, el uso de la aplicación se proporciona "tal cual". localizado" y por cuenta y riesgo del usuario final.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            La responsabilidad del productor de Captcha se limita a ofrecer y actualizar la aplicación, si fuera necesario, así como la obligación de realizar una transferencia bancaria en los términos exactos establecidos en este documento de acuerdo con los valores y metas informadas en cada campaña.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            El usuario es responsable de los daños y perjuicios que pueda causar durante el uso de la aplicación, no siendo el productor de la App responsable de ninguna carga derivada de ello.
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">CONSENTIMIENTO PARA LA RECOPILACIÓN Y ALMACENAMIENTO DE DATOS</h2>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Al utilizar la aplicación, el usuario acepta que si puede recopilar y utilizar datos técnicos de su dispositivo, como especificaciones, configuraciones, versiones de sistema operativo, tipo de conexión a Internet y similares.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            El productor de la aplicación se compromete a conservar los datos los datos personales del usuario de forma segura, sometiendo todo tratamiento de datos a la disciplina de la Ley.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Al utilizar la aplicación, el usuario acepta la presencia de los anuncios contenidos en los mismos, los cuales deberán resaltarse como tales, siendo responsabilidad exclusiva del El usuario es responsable de las compras, visitas o acceso a los enlaces y direcciones de los anunciantes.
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">POLÍTICA DE PRIVACIDAD</h2>
          <h3 className="text-xs leading-tight text-muted-foreground">
            La Política de Privacidad del sitio fue creada para reafirmar la nuestro compromiso con la seguridad y privacidad de sus datos, estableciendo las condiciones generales de procesamiento de datos personales, de acuerdo con las normas establecidas en el ordenamiento jurídico, especialmente los establecidos.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Para adaptarnos a posibles cambios en la legislación, nuestros La política puede cambiar con el tiempo, por lo que recomendamos consultarla. periódicamente.
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">
            EL TITULAR DE LOS DATOS PERSONALES DECLARA CONOCER ESTA POLÍTICA Y RECONOCE CONSENTIMIENTO EXPRESO PARA EL TRATAMIENTO DE SU INFORMACIÓN PERSONAL POR PARTE DEL PROPIETARIO DEL SITIO.
          </h2>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Si el usuario es una Persona Jurídica, algunas condiciones previsto en esta Política puede no ser aplicable.
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">COMPARTIR DATOS PERSONALES</h2>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Sus datos pueden ser compartidos previa determinación legal o judicial y también en un ambiente controlado, con análisis estadístico, investigación y publicidad, u organizan bases de datos, además de entidades financieras, entidades de pago, análisis de datos crédito y riesgo.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Al compartir datos, todos los aspectos técnicos y Se adoptarán disposiciones organizativas apropiadas, encaminadas a la privacidad, confidencialidad e integridad de información, y quienes intervienen en esta forma de tratamiento están obligados a cumplir con las mismas seguridad y protección de Datos Personales requerida por la legislación.
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">MEDIDAS DE SEGURIDAD</h2>
          <h3 className="text-xs leading-tight text-muted-foreground">
            El propietario del sitio web hará todos los esfuerzos necesarios para protección de los datos recopilados, pero no es responsable de los datos personales que el usuario comparte con terceros o que terceros tengan conocimiento por falta de celo/cuidado por parte del titular, ya que es responsabilidad del titular igualmente el deber de proteger su información.
          </h3>
          <h3 className="text-xs leading-tight text-muted-foreground">
            En caso de sospecha o confirmación de violación del sitio web o pérdida de datos personales del usuario, la empresa tomará medidas inmediatas para eliminar o reducir los riesgos de daños, así como informar de este hecho a los potencialmente afectados y a las autoridades competentes. posibles riesgos y las medidas necesarias para evitar dichas pérdidas.
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">DISPOSICIONES FINALES</h2>
          <h3 className="text-xs leading-tight text-muted-foreground">
            Al utilizar la aplicación, el Usuario declara haber leído, comprendido y aceptado voluntariamente estos Términos y condiciones de uso.
          </h3>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Para volver
          </button>
        </div>
      </div>
    </div>
  );
}