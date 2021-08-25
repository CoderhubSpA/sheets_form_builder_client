import axios from 'axios`'
/**
 *
 */
export class FormBuilder {
    constructor(entityId) {
        this.id = entityId
        this.sections = []
    }

    async request(entityId) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/sheets/form/${this.id}`)
            .then(response => {
                const data = response.data.content

                if (data.poll) {
                    this.isPoll = true
                    this.parsePoll(data)
                }
                else {
                    this.isPoll = false
                }
            })
            .catch(error => {
                reject(error.response)
            })
        })
    }

    parseForm() {

    }

    parsePoll(data) {
        this.sections = data.sections
    }


}
