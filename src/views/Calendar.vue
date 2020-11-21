<template>
  <div>
    <button @click="toggleWeekends">toggle weekends</button>
    <FullCalendar :options="calendarOptions" />
    <!-- モーダル -->
    <div class="example-modal-window">
      <button @click="openModal">開く</button>
      <!-- コンポーネント MyModal -->
      <Modal @close="closeModal" v-if="modal">
        <!-- default スロットコンテンツ -->
        <p>Vue.js Modal Window!</p>
        <div><input v-model="message"></div>
        <!-- /default -->
        <!-- footer スロットコンテンツ -->
        <template slot="footer">
          <button @click="doSend">送信</button>
        </template>
        <!-- /footer -->
      </Modal>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import Modal from '../components/modal.vue'
// import TodoList from './TodoList'
import { mapGetters } from 'vuex'


export default {
  
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    Modal,
    // TodoList,
  },
  computed: {
    ...mapGetters([
      'allTodos',
    ]),
  },
  data() {
    return {
      calendarOptions: {
        
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        weekends: true, // initial value,
        events: [ 
        ]
      },
      modal: false,
      message: ''
    }
  },
  created(){
    this.addEvent()
  },
  methods: {
    toggleWeekends: function() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
    },
    openModal() {
      this.modal = true
    },
    closeModal() {
      this.modal = false
    },
    doSend() {
      if (this.message.length > 0) {
        alert(this.message)
        this.message = ''
        this.closeModal()
      } else {
        alert('メッセージを入力してください')
      }
    },
    // イベントを追加する関数
    addEvent(){
      this.calendarOptions.events = this.$store.getters.allTodos
    }
  },
  // 読み込んだと同時にカレンダーを更新する
  mounted(){
    this.$store.watch(
      (state, getters) => getters.allTodos,
      () => {
      this.addEvent()
      }
    )
  }
}
</script>

