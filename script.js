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
  
  // Result elements
  const resultHero = document.getElementById('resultHero');
  const resultBadge = document.getElementById('resultBadge');
  const resultTitle = document.getElementById('resultTitle');
  const resultSubtitle = document.getElementById('resultSubtitle');
  const resultSummaryBox = document.getElementById('resultSummaryBox');
  const resultHeading = document.getElementById('resultHeading');
  const resultMainText = document.getElementById('resultMainText');
  const anxietyPill = document.getElementById('anxietyPill');
  const depressionPill = document.getElementById('depressionPill');
  const overallPill = document.getElementById('overallPill');
  const recommendationTitle = document.getElementById('recommendationTitle');
  const recommendationList = document.getElementById('recommendationList');
  const disclaimerBox = document.getElementById('disclaimerBox');
  
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
      const scaleLabel = q.domain === 'A' ? 'Skala A - Ansietas' : 'Skala B - Depresi';
  
      const article = document.createElement('article');
      article.className = 'question';
      article.innerHTML = `
        <h3>${index + 1}. ${scaleLabel}</h3>
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
  }
  
  ageGroup.addEventListener('change', (e) => {
    renderQuestions(e.target.value);
  });
  
  resetBtn.addEventListener('click', () => {
    form.reset();
    renderQuestions('');
  });
  
  // --- LOGIKA KLASIFIKASI DOMAIN ---
  // Sesuai MMYS V.1:
  // - Tidak menunjukkan gejala: 000 atau 010
  // - Ringan: salah satu nomor 1 atau 3 = Ya, tetapi tidak keduanya
  // - Berat: nomor 1 dan 3 = Ya
  function classifyDomain(q1, q2, q3, label) {
    const total = q1 + q2 + q3;
  
    if (q1 === 1 && q3 === 1) {
      return {
        domain: label,
        score: total,
        level: "berat",
        text: `${label} berat`
      };
    }
  
    if (q1 === 1 || q3 === 1) {
      return {
        domain: label,
        score: total,
        level: "ringan",
        text: `${label} ringan`
      };
    }
  
    return {
      domain: label,
      score: total,
      level: "tidak",
      text: `Tidak menunjukkan gejala ${label.toLowerCase()}`
    };
  }
  
  // --- TENTUKAN RISIKO KESELURUHAN ---
  function getOverallRisk(anxietyResult, depressionResult) {
    const levels = [anxietyResult.level, depressionResult.level];
  
    if (levels.includes("berat")) return "tinggi";
    if (levels.includes("ringan")) return "sedang";
    return "rendah";
  }
  
  // --- KONTEN HASIL BERDASARKAN RISIKO ---
  function getResultContent(riskLevel) {
    const commonDisclaimer = "Hasil ini merupakan skrining awal dan bukan diagnosis medis. Untuk penilaian lebih lanjut, disarankan berkonsultasi dengan tenaga profesional.";
  
    const content = {
      rendah: {
        badgeText: "Risiko Rendah",
        badgeClass: "badge-low",
        heroClass: "hero-low",
        boxClass: "box-low",
        title: "Hasil Skrining: Kondisi Kamu Saat Ini Cenderung Baik",
        subtitle: "Saat ini hasil skrining tidak menunjukkan tanda yang mengarah pada masalah kecemasan atau suasana hati yang signifikan.",
        mainHeading: "Kondisi Kamu Saat Ini Cenderung Baik",
        mainText: "Berdasarkan jawaban yang kamu berikan, saat ini kamu tidak menunjukkan tanda-tanda yang mengarah pada masalah kecemasan atau suasana hati yang signifikan. Ini menunjukkan bahwa kondisi emosionalmu relatif stabil dalam dua minggu terakhir.",
        recommendations: [
          "Istirahat yang cukup",
          "Berbagi cerita dengan orang kamu percaya",
          "Melakukan aktivitas yang kamu sukai",
          "Jika suatu saat kamu merasa ada perubahan dalam kondisi emosionalmu, tidak apa untuk melakukan skrining ulang atau mencari dukungan."
        ],
        disclaimer: commonDisclaimer
      },
      sedang: {
        badgeText: "Risiko Sedang",
        badgeClass: "badge-medium",
        heroClass: "hero-medium",
        boxClass: "box-medium",
        title: "Hasil Skrining: Perlu Perhatian Lebih",
        subtitle: "Ada beberapa tanda yang menunjukkan kamu mungkin sedang mengalami tekanan emosional atau kecemasan dalam tingkat tertentu.",
        mainHeading: "Perlu Perhatian Lebih",
        mainText: "Berdasarkan jawaban yang kamu berikan, terdapat beberapa tanda yang menunjukkan kamu mungkin sedang mengalami tekanan emosional atau kecemasan dalam tingkat tertentu. Kondisi ini cukup umum terjadi, terutama saat menghadapi tekanan, perubahan, atau situasi yang menantang dalam kehidupan sehari-hari. Beberapa perasaan seperti khawatir, tegang, atau perubahan suasana hati mungkin muncul lebih sering dan mulai terasa memengaruhi kenyamananmu.",
        recommendations: [
          "Mengatur waktu istirahat dan aktivitas",
          "Mencoba teknik relaksasi (napas dalam, journaling, dll)",
          "Berbicara dengan teman, keluarga, atau orang yang kamu percaya",
          "Jika perasaan ini terasa menetap atau mengganggu aktivitas sehari-hari, kamu bisa mempertimbangkan untuk mencari bantuan profesional."
        ],
        disclaimer: commonDisclaimer
      },
      tinggi: {
        badgeText: "Risiko Tinggi",
        badgeClass: "badge-high",
        heroClass: "hero-high",
        boxClass: "box-high",
        title: "Hasil Skrining: Disarankan Mendapatkan Dukungan Lebih Lanjut",
        subtitle: "Terdapat tanda yang mengarah pada kemungkinan tekanan emosional yang cukup berat dan perlu perhatian lebih lanjut.",
        mainHeading: "Disarankan Mendapatkan Dukungan Lebih Lanjut",
        mainText: "Berdasarkan jawaban yang kamu berikan, terdapat beberapa tanda yang mengarah pada kemungkinan kamu sedang mengalami tekanan emosional yang cukup berat. Kondisi ini dapat memengaruhi berbagai aspek kehidupan sehari-hari, seperti konsentrasi, energi, maupun suasana hati. Perasaan cemas, tegang, atau sedih mungkin muncul cukup sering dalam dua minggu terakhir dan terasa lebih sulit untuk diatasi sendiri.",
        recommendations: [
          "Menghubungi psikolog atau tenaga profesional",
          "Mengunjungi fasilitas kesehatan terdekat",
          "Menggunakan layanan konseling online yang tersedia",
          "Mencari bantuan adalah langkah yang berani dan positif untuk dirimu sendiri."
        ],
        disclaimer: commonDisclaimer
      }
    };
  
    return content[riskLevel];
  }
  
  // --- RENDER HALAMAN HASIL ---
  function renderResultPage(anxietyResult, depressionResult, overallRisk) {
    const resultContent = getResultContent(overallRisk);
  
    // reset class
    resultHero.className = "hero";
    resultBadge.className = "badge";
    resultSummaryBox.className = "summary-box";
    disclaimerBox.className = "notice";
  
    // apply class
    resultHero.classList.add(resultContent.heroClass);
    resultBadge.classList.add(resultContent.badgeClass);
    resultSummaryBox.classList.add(resultContent.boxClass);
  
    // fill content
    resultBadge.textContent = resultContent.badgeText;
    resultTitle.textContent = resultContent.title;
    resultSubtitle.textContent = resultContent.subtitle;
    resultHeading.textContent = resultContent.mainHeading;
    resultMainText.textContent = resultContent.mainText;
  
    anxietyPill.textContent = `Ansietas: ${anxietyResult.text}`;
    depressionPill.textContent = `Depresi: ${depressionResult.text}`;
    overallPill.textContent = `Risiko: ${overallRisk.charAt(0).toUpperCase() + overallRisk.slice(1)}`;
  
    recommendationTitle.textContent = "Untuk membantu dirimu, kamu bisa mulai dengan:";
    recommendationList.innerHTML = "";
  
    resultContent.recommendations.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      recommendationList.appendChild(li);
    });
  
    if (overallRisk === "tinggi") {
      disclaimerBox.classList.add("danger");
    }
  
    goToPage("page-hasil");
  }
  
  // --- SUBMIT FORM ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const getValue = (name) => {
      const checked = form.querySelector(`input[name="${name}"]:checked`);
      return checked ? Number(checked.value) : null;
    };
  
    const A1 = getValue('A1');
    const A2 = getValue('A2');
    const A3 = getValue('A3');
    const B1 = getValue('B1');
    const B2 = getValue('B2');
    const B3 = getValue('B3');
  
    if ([A1, A2, A3, B1, B2, B3].includes(null)) return;
  
    const anxietyResult = classifyDomain(A1, A2, A3, "Ansietas");
    const depressionResult = classifyDomain(B1, B2, B3, "Depresi");
    const overallRisk = getOverallRisk(anxietyResult, depressionResult);
  
    renderResultPage(anxietyResult, depressionResult, overallRisk);
  });
