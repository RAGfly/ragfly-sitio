Mensajes Marketing — contrato público

La fuente es Corp: parametros_generales, categoría MENSAJES_MARKETING, un tipo por anuncio.
El campo md contiene JSON version 1, idioma en, titulo (fragmentos texto/estilo normal|enfasis) y cuerpo.
valor_parametro es una referencia legada; editar md para cambiar el mensaje publicado.
GET /parametros/mensajes-marketing/{patron} expone exclusivamente este contenido comercial público,
valida el contrato y devuelve 404 para tipos inexistentes y 503 para contenido inválido.
No ejecutar python_insert/python_update ni incluir CSS, HTML o scripts.

El sitio usa /start/marketing?utm_content=l-b1, y también acepta identificadores en /start/memory y
/start/context para conservar campañas publicadas. El mensaje se consulta en el servidor y se
cachea 60 segundos. Un identificador ausente/incorrecto o un fallo del backend conserva el texto
base. Los patrones actuales están en inglés; cuando se resuelve uno la página completa usa inglés.
El énfasis se presenta con Zalando Sans italic 600 mediante next/font y una clase centralizada.
Los textos se escapan como React children. Los parámetros de atribución siguen en el flujo de alta.

Verificación: contrato Pydantic, pruebas de validación/errores de red/IDs inválidos y build Next.js.
