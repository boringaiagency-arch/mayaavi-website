/**
 * Mayaavi - School Pilot Consultation & Early Access Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initLeadModal();
});

function initLeadModal() {
  const openButtons = document.querySelectorAll('[data-open-modal="pilot-modal"]');
  const modal = document.getElementById('pilot-modal');
  const closeBtn = document.getElementById('close-pilot-modal');
  const leadForm = document.getElementById('lead-pilot-form');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = leadForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳</span> Confirming Registration...`;

      setTimeout(() => {
        leadForm.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); border: 2px solid var(--emerald-400); color: var(--emerald-400); font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">✓</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #fff;">Pilot Request Received!</h3>
            <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem;">
              Thank you for partnering with Mayaavi. Our Singapore Tamil Curriculum Specialist team will contact you within 1 business day with your institutional access pack.
            </p>
            <button onclick="document.getElementById('pilot-modal').classList.remove('is-active'); document.body.style.overflow='';" class="btn btn-gold" style="width: 100%;">Return to Mayaavi</button>
          </div>
        `;
      }, 1200);
    });
  }
}
