<template>
    <form-group
        :label="label"
        :id="id"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        v-if="show_field"
    >
        <date-picker
            v-model="picker"
            wrapper-class="form-control"
            input-class="date-input"
            :id="id"
            :format="customDateFormat"
            :disabled="disabled"
            :disabled-dates="disabledDates"
            :placeholder="defaultValue"
            :language="es"
            @input="onInput"
            @changed-month="setSundayDays"
            @changed-year="setSundayDays"
            @changed-decade="setSundayDays"
        ></date-picker>
    </form-group>
</template>
<script>
import mix from '../mixs/input.vue';
import mixDate from '../mixs/dates.vue';
import FormGroup from '../templates/form-group.vue';
import DatePicker from '@sum.cumo/vue-datepicker';
import '@sum.cumo/vue-datepicker/dist/Datepicker.css'

export default {
    mixins: [mix, mixDate],
    components: {
        'form-group': FormGroup,
        'date-picker': DatePicker,
    },
    data() {
        return {
            disabledDates: {
                // The dates in this array are disabled.
                dates: [
                    // January 1, 2023
                    new Date(2023, 0, 1),
                    // January 2, 2023
                    new Date(2023, 0, 2),
                    // April 8, 2023
                    new Date(2023, 3, 8),
                    // May 1, 2023
                    new Date(2023, 4, 1),
                    // May 21, 2023
                    new Date(2023, 4, 21),
                    // June 21, 2023
                    new Date(2023, 5, 21),
                    // June 26, 2023
                    new Date(2023, 5, 26),
                    // July 16, 2023
                    new Date(2023, 6, 16),
                    // August 15, 2023
                    new Date(2023, 7, 15),
                    // September 18, 2023
                    new Date(2023, 8, 18),
                    // September 19, 2023
                    new Date(2023, 8, 19),
                    // October 9, 2023
                    new Date(2023, 9, 9),
                    // October 27, 2023
                    new Date(2023, 9, 27),
                    // November 1, 2023
                    new Date(2023, 10, 1),
                    // December 8, 2023
                    new Date(2023, 11, 8),
                    // December 25, 2023
                    new Date(2023, 11, 25),
                ],
            },
        };
    },
    mounted() {
        const date = new Date();

        this.setSundayDays(date);
    },
    computed: {
        customDateFormat() {
            return this.input.format === 'DATE[RESTRICT]' ? 'dd/MM/yyyy' : '';
        },
    },
    methods: {
        // This function takes a month and year as arguments, and returns an array of all the days in the month. It uses the Date object to get the number of days in the month, and returns an array of Date objects.
        getDaysInMonth(month, year) {
            // Create a new date object, and set it to the first day of the month
            let date = new Date(year, month, 1);
            // Create an empty array to store the days in
            let days = [];

            // Loop through the days of the month
            while (date.getMonth() === month) {
                // Add the current date to the days array
                days.push(new Date(date));
                // Add one day to the date object
                date.setDate(date.getDate() + 1);
            }

            // Return the days array
            return days;
        },
        // This code sets all Sundays in a year to be disabled dates. It takes a date object as an argument, and uses the getFullYear() method to get the year. It then loops through all the months in the year, and uses the getDaysInMonth() function to get all the days in each month. It then loops through all the days in each month, and uses the getDay() method to get the day of the week. If the day is a Sunday, it adds the date to the disabled dates array.
        setSundayDays(date) {
            // Get the year
            let year = date.getFullYear();
            // Create an array of all the months
            let months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

            // for each month...
            months.forEach(month => {
                // get all the days in that month
                this.getDaysInMonth(month, year).forEach(date => {
                    // get the day of the week
                    let day = date.getDay();

                    // if it's a Sunday...
                    if (day === 0) {
                        // add the date to the disabled dates array
                        this.disabledDates.dates.push(new Date(year, month, date.getDate()));
                    }
                });
            });
        },
    }
};
</script>
<style lang="scss">
    .date-input {
        width: 100% !important;
        border: none !important;

        &:focus-visible {
            outline: none !important;
        }
    }

    .vdp-datepicker__calendar .cell.selected.highlighted, .vdp-datepicker__calendar .cell.selected:hover {
        background-color: #007571 !important;
    }

    .vdp-datepicker__calendar .cell.selected {
        background: #00938f;
        color: #fff;
    }
</style>
