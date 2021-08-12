/**
 * @author Jorge Peraza
 *
 * ------------------------------------------------
 * Unificacion de formato de respuesta del field
 * al momento de trabajar con encuestas
 * ------------------------------------------------
 */
export default class Answer {
    /**
     * Convertir un objeto para sheets {key: value}
     * en un objeto capaz de trabajar en funcion de
     * las encuestas
     * @param {Object} answer Objeto proveniente de un field
     * @param {Object} section Seccion actual donde se recibe la respuesta
     * @param {Array} list_questions Listado de preguntas disponibles en la encuesta
     */
    constructor(answer, section, list_questions) {
        const key = Object.keys(answer)[0]
        // busca y selecciona la pregunta
        this.findQuestion(key, list_questions)
        // id de la pregunta
        this.question_id = this.question.id
        // texto de la pregunta
        this.question_label = this.question.name
        // pregunta requerida
        this.question_required = !!this.question.required
        // valor de la respuesta
        this.answer = answer[key]
        // id de la seccion donde se realiza la respuesta
        this.section_id = section.id
        // nombre de la columna
        this.col_name = this.question.col_name
        // instancia de tiempo cuando se responde la pregunta
        this.timestamp = Date.now()
        // seleccion de alternativas
        this.setAlternative()
        // asignacion de la siguiente seccion
        this.setNextSection(section, list_questions)
        // seleccion de examenes si los tiene
        this.setExam()
        // limpiado question del objeto
        delete(this.question)
    }
    /**
     * Obtiene el objeto de
     * @param {String} id ID de la respuesta
     */
    findQuestion(id, list_questions) {
        const question = list_questions.find(q => q.id === id)
        this.question = question
    }
    /**
     * Asigna el valor de la siguiente seccion
     * @param {Object} section Objeto de la seccion en curso
     */
    setNextSection(section) {
        if (this.alternative && this.alternative.next_form_section) {
            this.autopass = true
            this.next_section = this.alternative.next_form_section
        }
        else {
            this.autopass = false
            this.next_section = section.default_next_form_section
        }

    }
    /**
     * Asigna el valor de la alternativa
     * en caso de no tener alternativa sera null
     */
    setAlternative() {
        if (this.question.alternatives) {
            this.alternative = this.question.alternatives[this.answer]
            delete(this.alternative.products)
        }
        else
            this.alternative = null
    }
    /**
     * Pregunta si la alternativa seleccionada
     * tiene examenes
     * @return {Boolean}
     */
    hasExam() {
        if (this.alternative) {
            return this.alternative.hasOwnProperty('products')
        }
        return false
    }
    /**
     * Asigna los examenes en caso de tenerlos
     */
    setExam() {
        if (this.hasExam())
            this.exams = this.alternative.products
        else
            this.exams = null
    }
}

