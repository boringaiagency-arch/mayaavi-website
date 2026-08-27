/**
 * Mayaavi Interactive Oral Simulator (P3 Reading Aloud & P6 Video Stimulus)
 */

document.addEventListener('DOMContentLoaded', () => {
  initModeSwitcher();
  initP3ReadingSimulator();
  initP6VideoSimulator();
});

/* Toast Notification Utility */
function showToast(message) {
  let toast = document.querySelector('.sim-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'sim-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="font-size: 1.2rem;">✨</span> <span>${message}</span>`;
  toast.classList.add('is-active');

  setTimeout(() => {
    toast.classList.remove('is-active');
  }, 3500);
}

/* 1. Mode Switcher (P3 vs P6) */
function initModeSwitcher() {
  const tabs = document.querySelectorAll('.sim-tab-btn');
  const views = document.querySelectorAll('.sim-view');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.getAttribute('data-mode');

      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      views.forEach(view => {
        if (view.id === `view-${mode}`) {
          view.classList.add('is-active');
        } else {
          view.classList.remove('is-active');
        }
      });
    });
  });
}

/* 2. Primary 3 Reading Simulator */
function initP3ReadingSimulator() {
  const listenBtn = document.getElementById('p3-listen-btn');
  const recordBtn = document.getElementById('p3-record-btn');
  const words = document.querySelectorAll('.passage-text-content .word');
  const waveBars = document.querySelectorAll('.wave-bar');
  const scoreInner = document.getElementById('p3-score-value');

  let isPlayingAudio = false;
  let isRecording = false;
  let audioTimer = null;

  // Clickable word translation tooltip
  words.forEach(w => {
    w.addEventListener('click', () => {
      const meaning = w.getAttribute('data-meaning');
      const gloss = w.getAttribute('data-gloss');
      const sound = w.getAttribute('data-sound');

      let tip = `<strong>${w.textContent.trim()}</strong>: ${meaning} (${gloss})`;
      if (sound) tip += ` • Sound focus: <span style="color:var(--amber-400);">${sound}</span>`;

      const tipBox = document.getElementById('p3-feedback-tips');
      if (tipBox) {
        tipBox.innerHTML = `💡 <strong>Word Spotlight</strong>: ${tip}`;
      }
      showToast(`Selected word: "${w.textContent.trim()}" (${meaning})`);
    });
  });

  // Listen model audio simulation
  if (listenBtn) {
    listenBtn.addEventListener('click', () => {
      if (isPlayingAudio) {
        stopAudioPlayback();
        return;
      }

      if (isRecording) stopRecording();

      isPlayingAudio = true;
      listenBtn.classList.add('is-playing');
      listenBtn.innerHTML = `<span>⏸</span> Pause Model Audio`;
      waveBars.forEach(bar => bar.classList.add('active'));

      let currentIndex = 0;
      clearInterval(audioTimer);

      audioTimer = setInterval(() => {
        words.forEach(w => w.classList.remove('active-word'));

        if (currentIndex < words.length) {
          words[currentIndex].classList.add('active-word');
          currentIndex++;
        } else {
          stopAudioPlayback();
          showToast('Model reading completed. Now try speaking!');
        }
      }, 350);
    });
  }

  function stopAudioPlayback() {
    isPlayingAudio = false;
    clearInterval(audioTimer);
    if (listenBtn) {
      listenBtn.classList.remove('is-playing');
      listenBtn.innerHTML = `<span>🎧</span> Listen Model Reading`;
    }
    waveBars.forEach(bar => bar.classList.remove('active'));
    words.forEach(w => w.classList.remove('active-word'));
  }

  // Record simulation
  if (recordBtn) {
    recordBtn.addEventListener('click', () => {
      if (isRecording) {
        stopRecording();
        evaluateAttempt();
        return;
      }

      if (isPlayingAudio) stopAudioPlayback();

      isRecording = true;
      recordBtn.classList.add('is-recording');
      recordBtn.innerHTML = `<span>⏹</span> Stop & Analyze Speech`;
      waveBars.forEach(bar => bar.classList.add('active'));
      showToast('Microphone active: Simulating speech recognition...');

      // Auto stop after 5s if user doesn't press stop
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
          evaluateAttempt();
        }
      }, 5000);
    });
  }

  function stopRecording() {
    isRecording = false;
    if (recordBtn) {
      recordBtn.classList.remove('is-recording');
      recordBtn.innerHTML = `<span>🎙️</span> Simulate My Recording`;
    }
    waveBars.forEach(bar => bar.classList.remove('active'));
  }

  function evaluateAttempt() {
    if (scoreInner) {
      scoreInner.textContent = '94%';
    }
    const accBar = document.getElementById('p3-bar-accuracy');
    const fluBar = document.getElementById('p3-bar-fluency');
    const pauBar = document.getElementById('p3-bar-pause');

    if (accBar) accBar.style.width = '94%';
    if (fluBar) fluBar.style.width = '89%';
    if (pauBar) pauBar.style.width = '92%';

    const tipBox = document.getElementById('p3-feedback-tips');
    if (tipBox) {
      tipBox.innerHTML = `🌟 <strong>AI Diagnostic</strong>: Excellent pacing! <em>"பொறுப்பு"</em> (po-rup-pu) and <em>"நடைப்பயிற்சி"</em> pronounced with clear retroflex 'ற'. You improved by +12% from Attempt 1.`;
    }

    showToast('AI speech analysis complete: 94% Accuracy achieved! 🌟');
  }
}

/* 3. Primary 6 Video Stimulus Simulator */
function initP6VideoSimulator() {
  const shotBtns = document.querySelectorAll('.shot-btn');
  const videoScene = document.getElementById('p6-scene-bg');
  const videoBadge = document.getElementById('p6-shot-badge');
  const prepBtns = document.querySelectorAll('.prep-selector-btn');
  const tamilResponse = document.getElementById('p6-response-tamil');
  const engResponse = document.getElementById('p6-response-eng');
  const connectorChips = document.querySelectorAll('.chip-btn');

  const shotData = {
    '1': {
      title: 'Shot 1 (0:00 - 0:15) ~ Canteen Crowd & Queuing',
      bg: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url("images/p6-oral.jpg")',
      point: 'பள்ளி உணவகத்தில் மாணவர்கள் வரிசையில் நின்று உணவு வாங்குகிறார்கள்.',
      eng: 'Students are queuing up politely at the school canteen stalls to buy food.',
      reason: 'இதனால் உணவகத்தில் ஒழுங்குமுறை பேணப்படுகிறது மற்றும் நெரிசல் தவிர்க்கப்படுகிறது.',
      engReason: 'Because of this, order is maintained in the canteen and congestion is prevented.',
      example: 'உதாரணமாக, கவின் அமைதியாகத் தன் முறை வரும் வரை காத்திருக்கிறான்.',
      engExample: 'For example, Kavin waits patiently until his turn arrives.'
    },
    '2': {
      title: 'Shot 2 (0:15 - 0:30) ~ Tray Return & Cleanliness',
      bg: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url("images/hero-illustration.jpg")',
      point: 'சாப்பிட்டு முடித்தவுடன் தட்டுகளைத் தட்டு சேகரிக்கும் இடத்தில் வைக்கிறார்கள்.',
      eng: 'After finishing their meal, students return their trays to the collection station.',
      reason: 'ஏனென்றால் அடுத்த மாணவர் சுத்தமான மேசையில் அமர்ந்து உணவருந்த வேண்டும்.',
      engReason: 'Because the next student deserves to sit at a clean dining table.',
      example: 'மேசையில் சிந்திய உணவுத் துகள்களைத் துடைப்பது ஒரு நல்ல பழக்கம்.',
      engExample: 'Wiping away food crumbs left behind on the table is a commendable civic habit.'
    },
    '3': {
      title: 'Shot 3 (0:30 - 0:50) ~ Moral Dilemma: Lost Wallet Found',
      bg: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url("images/p3-reading.jpg")',
      point: 'ஒரு மாணவர் தரையில் கிடந்த பணப்பையை எடுத்துப் பொது அலுவலகத்தில் ஒப்படைக்கிறார்.',
      eng: 'A student picks up a dropped wallet and promptly hands it over to the General Office.',
      reason: 'நேர்மை என்பது ஒரு நல்ல மாணவனுக்கு மிக முக்கியமான பண்பாகும்.',
      engReason: 'Honesty is one of the most vital moral virtues for every student.',
      example: 'உதாரணமாக, பணப்பையைத் தவறவிட்ட மாணவர் மிகுந்த கவலையில் இருப்பார்; அதை ஒப்படைப்பது அவருக்கு நிம்மதியைத் தரும்.',
      engExample: 'For example, the owner would be anxious; returning it provides instant relief.'
    }
  };

  let currentShot = '1';
  let currentStep = 'point';

  shotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const shot = btn.getAttribute('data-shot');
      currentShot = shot;

      shotBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      if (videoBadge) videoBadge.textContent = shotData[shot].title;
      if (videoScene) videoScene.style.backgroundImage = shotData[shot].bg;

      updatePrepContent();
      showToast(`Switched to Video Scene ${shot}`);
    });
  });

  prepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.getAttribute('data-step');
      currentStep = step;

      prepBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      updatePrepContent();
    });
  });

  function updatePrepContent() {
    const data = shotData[currentShot];
    if (!data) return;

    if (currentStep === 'point') {
      if (tamilResponse) tamilResponse.innerHTML = `<span style="color:var(--amber-300);">[கருத்து / Point]:</span> ${data.point}`;
      if (engResponse) engResponse.textContent = data.eng;
    } else if (currentStep === 'reason') {
      if (tamilResponse) tamilResponse.innerHTML = `<span style="color:var(--purple-500);">[காரணம் / Reason]:</span> ${data.reason}`;
      if (engResponse) engResponse.textContent = data.engReason;
    } else {
      if (tamilResponse) tamilResponse.innerHTML = `<span style="color:var(--emerald-400);">[எடுத்துக்காட்டு / Example]:</span> ${data.example}`;
      if (engResponse) engResponse.textContent = data.engExample;
    }
  }

  connectorChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const connector = chip.textContent.trim();
      if (tamilResponse) {
        tamilResponse.innerHTML += ` <span style="background:rgba(251,191,36,0.3); color:#fde047; padding:2px 6px; border-radius:4px; font-weight:bold;">${connector}</span>`;
      }
      showToast(`Inserted connector "${connector}" into your structured response!`);
    });
  });
}
