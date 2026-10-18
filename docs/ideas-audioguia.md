# Idea aparcada: audioguía

Estado: descartada por ahora (decisión de 2026-10-18). Se guarda para retomarla si hace falta.

## Concepto
Un botón "escuchar" por capítulo con una narración corta, al estilo de las audioguías de museo, y opcionalmente el sonido ambiente de la cueva.

## Opciones de implementación
1. **Narración grabada por una persona de Caripe.** La más auténtica. Un archivo de audio por capítulo, reproducido con `<audio>`. Requiere grabar y licenciar las voces.
2. **Síntesis de voz del navegador (`speechSynthesis`).** Sin archivos ni coste, pero la calidad y el acento dependen del dispositivo.
3. **Audio generado y guardado como archivos estáticos.** Calidad uniforme, pero hay que revisar la pronunciación de topónimos y decidir la voz.

## Riesgos
- Peso de los archivos y autoplay bloqueado por los navegadores (siempre bajo acción del usuario).
- Sincronizar con el modo documental ya existente (`DocumentaryMode`) sin que dos cosas se muevan a la vez.
- Los sonidos de la cueva necesitan una fuente libre y acreditada.
