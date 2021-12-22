import '../css/common.css';
// Описаний в документації
import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

let selectedDate = 0;
let timerId = 0;

const refEl = {
  myInput: document.querySelector('input#datetime-picker'),
  btnStart: document.querySelector('button[data-start]'),
  dataDays: document.querySelector('.timer [data-days]'),
  dataHours: document.querySelector('.timer [data-hours]'),
  dataMinutes: document.querySelector('.timer [data-minutes]'),
  dataSeconds: document.querySelector('.timer [data-seconds]'),
};

refEl.btnStart.addEventListener('click', getButtonStart);

refEl.btnStart.setAttribute('disabled', 'disabled');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    selectedDate = selectedDates[0];
    if (selectedDate < new Date()) {
      Notiflix.Notify.failure('Please choose a date in the future');
    } else {
      refEl.btnStart.removeAttribute('disabled');
      console.log(selectedDates);
    }
  },
};

flatpickr(refEl.myInput, options);

function getButtonStart() {
  timerId = setInterval(() => {
    const targetDate = selectedDate - new Date();
    refEl.btnStart.setAttribute('disabled', 'disabled');
    stopTimeOut(targetDate);
    const convertObj = convertMs(targetDate);
    showDate(convertObj);
  }, 1000);
}

function stopTimeOut(targetDate) {
  if (targetDate < 1000) {
    clearInterval(timerId);
    refEl.myInput.removeAttribute('disabled');
    Notiflix.Notify.success('Time is out');
  }
}

function showDate(time) {
  refEl.dataDays.textContent = addZero(time.days);
  refEl.dataHours.textContent = addZero(time.hours);
  refEl.dataMinutes.textContent = addZero(time.minutes);
  refEl.dataSeconds.textContent = addZero(time.seconds);
}

function addZero(value) {
  return String(value).padStart(2, 0);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
