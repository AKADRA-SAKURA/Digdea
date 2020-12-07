<template>
  <div>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
// import TodoList from './TodoList'
import { mapGetters } from "vuex";

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  
    // TodoList,
  },
  computed: {
    ...mapGetters(["allTodos"]),
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        weekends: true, // initial value,
        events: [],
      },
      modal: false,
      message: "",
    };
  },
  created() {
    this.addEvent();
  },
  methods: {
    // イベントを追加する関数
    addEvent() {
      this.calendarOptions.events = this.$store.getters.allTodos;
    },
  },
  // 読み込んだと同時にカレンダーを更新する
  mounted() {
    this.$store.watch(
      (state, getters) => getters.allTodos,
      () => {
        this.addEvent();
      }
    );
  },
};
</script>
<style lang="scss">
.fc-toolbar-chunk{
  display: flex;
  .fc-event-title {
    background-color: #3d9e8d;
  }
}
.fc-view-harness{
  background-color: white;
}
.fc-event-title{
    background-color: #3d9e8d;

}
.fc .fc-view-harness-active > .fc-view {
    height: 500px;
}
.fc {
  height: 630px;
}

.fc .fc-daygrid-day-frame {
    position: relative;
    min-height: 100%;
    height: 75px;
}

</style>
