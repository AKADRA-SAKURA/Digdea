<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        weekends: false, // initial value,
        events: [
          { title: 'おぬまっち', date: '2020-11-20' },
          { title: 'event 2', date: '2020-11-02' }
        ]
      }
    }
  },
  methods: {
    toggleWeekends: function() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
    }
  }
}
</script>
<template>
  <div>
    <button @click="toggleWeekends">toggle weekends</button>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>
