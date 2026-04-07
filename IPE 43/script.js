 // --- DATABASE PERTANYAAN ---
 const questionBank = {
    "7-9": {
      intro: "Versi ini diisi oleh orang tua, pengasuh utama, atau guru yang mengenal anak dengan baik.",
      questions: [
        { domain: "A", no: 1, text: "Dalam 2 minggu terakhir, anak sering merasa khawatir atau tidak tenang, tegang, deg-degan dan gelisah terutama terhadap hal-hal negatif atau yang belum tentu terjadi." },
        { domain: "A", no: 2, text: "Dalam 2 minggu terakhir, anak berpikir berlebihan dan tidak bisa mengendalikan diri, terutama terhadap hal-hal negatif atau yang belum tentu terjadi." },
        { domain: "A", no: 3, text: "Dalam 2 minggu terakhir, anak sulit tidur dan berkonsentrasi terutama saat memikirkan hal-hal negatif yang belum tentu terjadi." },
        { domain: "B", no: 1, text: "Dalam 2 minggu terakhir, anak sering merasa sedih atau tertekan padahal tidak ada penyebab yang jelas." },
        { domain: "B", no: 2, text: "Dalam 2 minggu terakhir, anak tidak tertarik lagi dengan kegiatan atau hal-hal yang biasanya dia suka." },
        { domain: "B", no: 3, text: "Dalam 2 minggu terakhir, anak merasa sering capek, sulit tidur, dan sulit fokus saat belajar atau melakukan kegiatan." }
      ]
    },
    "10-18": {
      intro: "Versi ini diisi secara mandiri oleh anak atau remaja usia 10–18 tahun.",
      questions: [
        { domain: "A", no: 1, text: "Dalam 2 minggu terakhir, saya sering merasa khawatir atau tidak tenang, tegang, deg-degan dan gelisah terutama terhadap hal-hal negatif atau yang belum tentu terjadi." },
        { domain: "A", no: 2, text: "Dalam 2 minggu terakhir, saya berpikir berlebihan dan tidak bisa mengendalikan diri, terutama terhadap hal-hal negatif atau yang belum tentu terjadi." },
        { domain: "A", no: 3, text: "Dalam 2 minggu terakhir, saya sulit tidur dan berkonsentrasi terutama saat memikirkan hal-hal negatif yang belum tentu terjadi." },
        { domain: "B", no: 1, text: "Dalam 2 minggu terakhir, saya sering merasa sedih atau tertekan padahal tidak ada penyebab yang jelas." },
        { domain: "B", no: 2, text: "Dalam 2 minggu terakhir, saya tidak tertarik lagi dengan kegiatan atau hal-hal yang biasanya saya suka." },
        { domain: "B", no: 3, text: "Dalam 2 minggu terakhir, saya merasa sering capek, sulit tidur, dan sulit fokus saat belajar atau melakukan kegiatan." }
      ]
    }
  };

  // --- DOM ELEMENTS ---
  const ageGroup = document.getElementById('ageGroup');
  const introText = document.getElementById('introText');
  const questionsContainer = document.getElementById('questionsContainer');
  const actionButtons = document.getElementById('actionButtons');
  const form = document.getElementById('screeningForm');
  const resetBtn = document.getElementById('resetBtn');

  // --- NAVIGASI HALAMAN (SPA FLOW) ---
  function goToPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- RENDER PERTANYAAN ---
  function renderQuestions(group) {
    questionsContainer.innerHTML = '';
    
    if (!group || !questionBank[group]) {
      introText.classList.add('hidden');
      actionButtons.classList.add('hidden');
      return;
    }

    introText.textContent = questionBank[group].intro;
    introText.classList.remove('hidden');
    actionButtons.classList.remove('hidden');

    questionBank[group].questions.forEach((q, index) => {
      const key = `${q.domain}${q.no}`;
      const article = document.createElement('article');
      article.className = 'question';
      article.innerHTML = `
        <h3>${index + 1}. ${q.domain === 'A' ? '' : ''}</h3> 
        <p>${q.text}</p>
        <div class="options">
          <div class="option">
            <input type="radio" id="${key}_yes" name="${key}" value="1" required>
            <label for="${key}_yes">Ya</label>
          </div>
          <div class="option">
            <input type="radio" id="${key}_no" name="${key}" value="0" required>
            <label for="${key}_no">Tidak</label>
          </div>
        </div>
      `;
      questionsContainer.appendChild(article);
    });
    // bagian {q.domain === 'A' ? 'harusnya ada tulisan SKALA A' : 'harusnya ada tulisan SKALA B'}
  }

  ageGroup.addEventListener('change', (e) => {
    renderQuestions(e.target.value);
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    renderQuestions('');
  });

  // --- LOGIKA KLASIFIKASI & CABANG FLOWCHART ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const getValue = (name) => {
      const checked = form.querySelector(`input[name="${name}"]:checked`);
      return checked ? Number(checked.value) : null;
    };

    const A1 = getValue('A1'); const A3 = getValue('A3');
    const B1 = getValue('B1'); const B3 = getValue('B3');

    // Validasi bawaan HTML5 (required) sudah jalan sebelum submit trigger,
    // Tapi kita bisa pastikan lagi tidak ada yang null
    if (A1 === null || A3 === null || B1 === null || B3 === null) return;

    // Interpretasi PDF: Gejala (ringan/berat) muncul jika P1 atau P3 bernilai Ya (1)
    const risikoAnsietas = (A1 === 1 || A3 === 1);
    const risikoDepresi = (B1 === 1 || B3 === 1);
    const isBerisiko = risikoAnsietas || risikoDepresi;

    // Cabang Flowchart
    if (isBerisiko) {
      goToPage('page-layanan');
    } else {
      goToPage('page-edukasi');
    }
  });