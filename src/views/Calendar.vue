<template>
  <div>
    <button @click="toggleWeekends">toggle weekends</button>
    <FullCalendar :options="calendarOptions" />
     <div class="example-modal-window">
      <p>ボタンを押すとモーダルウィンドウが開きます</p>
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

export default {
  
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    Modal,
  },
  data() {
    return {
      calendarOptions: {
        
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        weekends: false, // initial value,
        events: [
          { title: 'おぬまっち', date: '2020-11-20' },
          { title: 'event 2', date: '2020-11-02' },
          { title: 'ホゲホゲ', date: '2020-11-21' }
        ]
      },
      modal: false,
      message: ''
    }
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
    }
  }
}
</script>

