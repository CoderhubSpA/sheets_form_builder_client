<script>
export default {
    props: {
        form: {
            type: Object,
            default: () => ({})
        },
        styles: {
            type: [Array, String],
            default: () => [] || ''
        }
    },
    computed: {
         /**
         * Hint for expected file type in file upload controls
         */
        accept() {
            switch (this.form.format) {
                case 'DOCUMENT[IMAGE]':
                    return 'image/*'
                default:
                    // return ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf"
                    return "";
            }
        },
        /**
         * Hint for form autofill feature
         */
        autocomplete() {
            return !!this.form.autocomplete
        },
        /**
         * Automatically focus the form control when the page is loaded
         */
        autofocus() {
            return !!this.form.autofocus
        },
        /**
         * Whether the form control is disabled
         */
        disabled() {
            return this.form.disabled
        },
        /**
         * Maximum value
         * [number]
         */
        maximun() {
            return this.max
        },
        /**
         * Minimum value
         * [number]
         */
        minimun() {
            return this.min
        },
        /**
         * Boolean. Whether to allow multiple values
         * [email, file]
         */
        multiple() {
            return !!this.form.multiple
        },
        /**
         * Name of the form control. Submitted with the form as part of a name/value pair.
         */
        name() {
            return this.form.col_name
        },
        /**
         * Text that appears in the form control when it has no value set
         * [password, search, tel, text, url]
         */
        placeholder() {
            return this.form.placeholder
        },
        readonly() {
            return this.form.readonly
        },
        /**
         * Boolean. A value is required or must be check for the form to be submittable
         */
        required() {
            return (this.form.required == 1) ? true : false
        },
        /**
         * Incremental values that are valid.
         */
        step() {
            return this.form.step
        },
        originalType() {
            return this.form.format
        },
        /**
         * Type of form control
         */
        sheetType() {
            switch (this.form.format) {
                case 'TEXT':
                case 'RUT':
                case 'URL':
                case 'EMAIL':
                    return 'text'
                case 'NUMBER':
                case 'CLP':
                case 'PERCENTAGE':
                    return 'number'
                case 'PASSWORD':
                    return 'password'
                case 'DATE':
                    return 'date'
                case 'DATETIME':
                    return 'datetime'
                case 'SiNo':
                    return 'checkbox'
                case 'URL':
                    return 'url'
                case 'EMAIL':
                    return 'email'
                case 'MAPA':
                    return 'map'
                case 'DOCUMENT':
                case 'DOCUMENT[IMAGE]':
                    return 'file'
                case 'QUESTION':
                    return 'question'
                case 'INFO':
                    return 'info'
                default:
                    return this.form.format
            }
        },
        label() {
            return this.form.name
        },
        id() {
            return (this.form.id) ? this.form.id : this.uuid()
        },
        applyStyles() {
            let style  = null
            if (typeof(this.styles) === 'string') {
                return this.styles
            }
            style = this.styles.join(' ')
            return style
        },
        errorMessage() {
            if (this.$attrs["error-message"]) {
                return this.$attrs["error-message"].join(' ')
            }
            return null
        },
    },
    methods: {
        uuid() {
            let dt = new Date().getTime();
            let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (dt + Math.random()*16)%16 | 0;
                dt = Math.floor(dt/16);
                return (c=='x' ? r :(r&0x3|0x8)).toString(16);
            });
            return uuid;
        }
    }
}
</script>

<style>

</style>
