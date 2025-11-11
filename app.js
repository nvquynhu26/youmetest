{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 document.addEventListener('DOMContentLoaded', () => \{\
\
    // ===== 1. KHAI B\'c1O BI\uc0\u7870 N V\'c0 DOM ELEMENTS =====\
\
    // URLs (!!! B\uc0\u7840 N PH\u7842 I THAY TH\u7870  B\u7856 NG URL TH\u7852 T C\u7910 A B\u7840 N !!!)\
    const GITHUB_USER = 'youmetest'; // Ho\uc0\u7863 c username c\u7911 a b\u7841 n\
    const GITHUB_REPO = 'youmetest'; // T\'ean repo c\uc0\u7911 a b\u7841 n\
    const GITHUB_BRANCH = 'main';    // Nh\'e1nh (th\uc0\u432 \u7901 ng l\'e0 'main' ho\u7863 c 'master')\
\
    const URL_EN = `https://raw.githubusercontent.com/nvquynhu26/youmetest/refs/heads/main/VanGogh_EN.json`;\
    const URL_VN = `https://raw.githubusercontent.com/nvquynhu26/youmetest/refs/heads/main/VanGogh_VN.json`;\
    const URL_KO = `https://raw.githubusercontent.com/nvquynhu26/youmetest/refs/heads/main/VanGogh_KO.json`;\
    const URL_MOOD = `https://raw.githubusercontent.com/nvquynhu26/youmetest/refs/heads/main/VanGogh_mood.json`;\
    \
    // Bi\uc0\u7871 n l\u432 u tr\u7919  d\u7919  li\u7879 u\
    let dataEN = [], dataVN = [], dataKO = [], dataMood = [];\
    let allPaintings = []; // D\uc0\u7919  li\u7879 u theo ng\'f4n ng\u7919  hi\u7879 n t\u7841 i\
    let currentPaintingIndex = 0;\
    let currentLang = 'EN';\
\
    // Bi\uc0\u7871 n l\u432 u tr\u7919  c\'e1c \u273 \u7889 i t\u432 \u7907 ng bi\u7875 u \u273 \u7891  (\u273 \u7875  c\u7853 p nh\u7853 t)\
    let colorChart = null;\
    let moodChart = null;\
\
    // DOM Elements\
    const splashScreen = document.getElementById('splash-screen');\
    const mainApp = document.getElementById('main-app');\
    const doorLeft = document.getElementById('door-left');\
    const doorRight = document.getElementById('door-right');\
\
    const searchInput = document.getElementById('search-input');\
    const langButtons = document.querySelectorAll('.lang-btn');\
    \
    const prevBtn = document.getElementById('prev-btn');\
    const nextBtn = document.getElementById('next-btn');\
    \
    const paintingImage = document.getElementById('painting-image');\
    const paintingName = document.getElementById('painting-name');\
    const infoYear = document.getElementById('info-year');\
    const infoMaterial = document.getElementById('info-material');\
    const infoSize = document.getElementById('info-size');\
    const infoLocation = document.getElementById('info-location');\
    \
    const colorPaletteContainer = document.getElementById('color-palette');\
    const moodText = document.getElementById('mood-text');\
    const paintingDescription = document.getElementById('painting-description');\
    \
    const colorChartCtx = document.getElementById('color-donut-chart').getContext('2d');\
    const moodGaugeCtx = document.getElementById('mood-gauge-chart').getContext('2d');\
\
\
    // ===== 2. H\'c0M T\uc0\u7842 I D\u7918  LI\u7878 U (LOAD DATA) =====\
\
    async function loadAllData() \{\
        try \{\
            // T\uc0\u7843 i song song 4 file JSON\
            const [resEN, resVN, resKO, resMood] = await Promise.all([\
                fetch(URL_EN),\
                fetch(URL_VN),\
                fetch(URL_KO),\
                fetch(URL_MOOD)\
            ]);\
\
            dataEN = await resEN.json();\
            dataVN = await resVN.json();\
            dataKO = await resKO.json();\
            dataMood = await resMood.json();\
\
            // Gi\uc0\u7843  \u273 \u7883 nh: C\'e1c file JSON l\'e0 m\u7897 t m\u7843 ng c\'e1c \u273 \u7889 i t\u432 \u7907 ng tranh\
            // v\'e0 file mood c\'f3 c\'f9ng th\uc0\u7913  t\u7921  ho\u7863 c c\'f3 ID \u273 \u7875  map\
            console.log('T\uc0\u7843 i d\u7919  li\u7879 u th\'e0nh c\'f4ng!');\
            \
            // Kh\uc0\u7903 i t\u7841 o trang\
            initializeSite();\
\
        \} catch (error) \{\
            console.error('L\uc0\u7894 I: Kh\'f4ng th\u7875  t\u7843 i file JSON.', error);\
            // Hi\uc0\u7875 n th\u7883  l\u7895 i cho ng\u432 \u7901 i d\'f9ng\
            splashScreen.innerHTML = `<h1>L\uc0\u7895 i t\u7843 i d\u7919  li\u7879 u. Vui l\'f2ng ki\u7875 m tra l\u7841 i \u273 \u432 \u7901 ng d\u7851 n file JSON v\'e0 k\u7871 t n\u7889 i m\u7841 ng.</h1>`;\
        \}\
    \}\
\
    // ===== 3. H\'c0M KH\uc0\u7902 I T\u7840 O V\'c0 HI\u7874 N TH\u7882  (RENDER) =====\
\
    function initializeSite() \{\
        // Thi\uc0\u7871 t l\u7853 p ng\'f4n ng\u7919  ban \u273 \u7847 u\
        setLanguage('EN');\
        \
        // Hi\uc0\u7875 n th\u7883  tranh \u273 \u7847 u ti\'ean\
        renderPainting(currentPaintingIndex);\
\
        // Kh\uc0\u7903 i t\u7841 o bi\u7875 u \u273 \u7891 \
        createCharts();\
        \
        // C\uc0\u7853 p nh\u7853 t bi\u7875 u \u273 \u7891  v\u7899 i d\u7919  li\u7879 u tranh \u273 \u7847 u ti\'ean\
        updateCharts(currentPaintingIndex);\
\
        // G\uc0\u7855 n s\u7921  ki\u7879 n\
        setupEventListeners();\
    \}\
\
    // H\'e0m render 1 b\uc0\u7913 c tranh c\u7909  th\u7875 \
    function renderPainting(index) \{\
        if (!allPaintings[index]) return;\
\
        // Gi\uc0\u7843  \u273 \u7883 nh c\u7845 u tr\'fac file JSON c\u7911 a b\u7841 n\
        // B\uc0\u7840 N C\u7846 N \u272 I\u7872 U CH\u7880 NH C\'c1C KEY N\'c0Y (vd: 'name', 'year'...) cho \u273 \'fang\
        const painting = allPaintings[index];\
\
        paintingImage.src = painting.image_url; // Gi\uc0\u7843  \u273 \u7883 nh key l\'e0 'image_url'\
        paintingName.textContent = painting.name; // Gi\uc0\u7843  \u273 \u7883 nh key l\'e0 'name'\
        infoYear.textContent = painting.year;\
        infoMaterial.textContent = painting.material;\
        infoSize.textContent = painting.size;\
        infoLocation.textContent = painting.location;\
        paintingDescription.textContent = painting.description;\
    \}\
    \
    // H\'e0m c\uc0\u7853 p nh\u7853 t t\u7845 t c\u7843  (tranh, bi\u7875 u \u273 \u7891 , palette...)\
    function updateDisplay(index) \{\
        renderPainting(index);\
        updateCharts(index);\
        updateColorPalette(index);\
    \}\
\
    // ===== 4. H\'c0M X\uc0\u7916  L\'dd BI\u7874 U \u272 \u7890  (CHARTS) =====\
\
    function createCharts() \{\
        // 1. T\uc0\u7841 o bi\u7875 u \u273 \u7891  Donut (r\u7895 ng ban \u273 \u7847 u)\
        colorChart = new Chart(colorChartCtx, \{\
            type: 'doughnut',\
            data: \{\
                labels: [], // S\uc0\u7869  \u273 \u432 \u7907 c c\u7853 p nh\u7853 t\
                datasets: [\{\
                    data: [], // S\uc0\u7869  \u273 \u432 \u7907 c c\u7853 p nh\u7853 t\
                    backgroundColor: [], // S\uc0\u7869  \u273 \u432 \u7907 c c\u7853 p nh\u7853 t\
                \}]\
            \},\
            options: \{\
                responsive: true,\
                plugins: \{\
                    legend: \{\
                        position: 'bottom',\
                    \},\
                    tooltip: \{\
                        callbacks: \{\
                            label: function(context) \{\
                                let label = context.label || '';\
                                let value = context.parsed;\
                                return `$\{label\}: $\{value\}%`;\
                            \}\
                        \}\
                    \}\
                \}\
            \}\
        \});\
\
        // 2. T\uc0\u7841 o bi\u7875 u \u273 \u7891  Gauge (d\'f9ng\
        // 1. T\uc0\u7841 o bi\u7875 u \u273 \u7891  Donut (r\u7895 ng ban \u273 \u7847 u)\
        colorChart = new Chart(colorChartCtx, \{\
            type: 'doughnut',\
            data: \{\
                labels: [], // S\uc0\u7869  \u273 \u432 \u7907 c c\u7853 p nh\u7853 t\
                datasets: [\{\
                    data: [], // S\uc0\u7869  \u273 \u432 \u7907 c c\u7853 p nh\u7853 t\
                    backgroundColor: [], // S\uc0\u7869  \u273 \u432 \u7907 c c\u7853 p nh\u7853 t\
                \}]\
            \},\
            options: \{\
                responsive: true,\
                plugins: \{\
                    legend: \{\
                        position: 'bottom',\
                    \},\
                    tooltip: \{\
                        callbacks: \{\
                            label: function(context) \{\
                                let label = context.label || '';\
                                let value = context.parsed;\
                                return `$\{label\}: $\{value\}%`;\
                            \}\
                        \}\
                    \}\
                \}\
            \}\
        \});\
\
        // 2. T\uc0\u7841 o bi\u7875 u \u273 \u7891  Gauge (d\'f9ng lo\u7841 i 'doughnut' t\'f9y ch\u7881 nh)\
        moodChart = new Chart(moodGaugeCtx, \{\
            type: 'doughnut',\
            data: \{\
                datasets: [\{\
                    data: [0, 15], // [Gi\'e1 tr\uc0\u7883  hi\u7879 n t\u7841 i, Gi\'e1 tr\u7883  c\'f2n l\u7841 i]\
                    backgroundColor: [var(--accent-color), '#e0e0e0'],\
                    borderWidth: 0\
                \}]\
            \},\
            options: \{\
                responsive: true,\
                rotation: -90,      // B\uc0\u7855 t \u273 \u7847 u t\u7915  d\u432 \u7899 i c\'f9ng b\'ean tr\'e1i\
                circumference: 180, // V\uc0\u7869  n\u7917 a v\'f2ng tr\'f2n\
                cutout: '70%',      // \uc0\u272 \u7897  d\'e0y c\u7911 a v\'f2ng\
                plugins: \{\
                    tooltip: \{ enabled: false \}, // T\uc0\u7855 t tooltip\
                    legend: \{ display: false \}   // T\uc0\u7855 t ch\'fa th\'edch\
                \}\
            \}\
        \});\
    \}\
\
    // C\uc0\u7853 p nh\u7853 t bi\u7875 u \u273 \u7891  khi \u273 \u7893 i tranh\
    function updateCharts(index) \{\
        // Gi\uc0\u7843  \u273 \u7883 nh file JSON c\'f3 key `colors` l\'e0 m\u7843 ng objects: [\{name: 'Blue', percent: 40, hex: '#0000FF'\}, ...]\
        const painting = allPaintings[index];\
        const paintingColors = painting.colors; // B\uc0\u7841 n c\u7847 n \u273 \u7843 m b\u7843 o key n\'e0y \u273 \'fang\
\
        // 1. C\uc0\u7853 p nh\u7853 t Donut Chart\
        if (paintingColors && colorChart) \{\
            colorChart.data.labels = paintingColors.map(c => c.name);\
            colorChart.data.datasets[0].data = paintingColors.map(c => c.percent);\
            colorChart.data.datasets[0].backgroundColor = paintingColors.map(c => c.hex);\
            colorChart.update();\
        \}\
\
        // Gi\uc0\u7843  \u273 \u7883 nh file MOOD c\'f3 key 'id' v\'e0 'mood_score'\
        // v\'e0 file data ch\'ednh c\uc0\u361 ng c\'f3 'id' \u273 \u7875  map\
        const moodData = dataMood.find(m => m.id === painting.id);\
        \
        // 2. C\uc0\u7853 p nh\u7853 t Mood Gauge\
        if (moodData && moodChart) \{\
            const score = moodData.mood_score; // Gi\uc0\u7843  \u273 \u7883 nh t\u7915  0-15\
            moodChart.data.datasets[0].data = [score, 15 - score];\
            moodChart.update();\
            moodText.textContent = `$\{score\}/15`;\
        \}\
    \}\
    \
    // C\uc0\u7853 p nh\u7853 t b\u7843 ng m\'e0u\
    function updateColorPalette(index) \{\
        colorPaletteContainer.innerHTML = ''; // X\'f3a palette c\uc0\u361 \
        const paintingColors = allPaintings[index].colors; // L\uc0\u7845 y d\u7919  li\u7879 u m\'e0u\
\
        if (paintingColors) \{\
            paintingColors.forEach(color => \{\
                const colorBox = document.createElement('div');\
                colorBox.className = 'palette-color';\
                colorBox.style.backgroundColor = color.hex;\
                colorBox.textContent = color.hex;\
                colorPaletteContainer.appendChild(colorBox);\
            \});\
        \}\
    \}\
\
\
    // ===== 5. H\'c0M X\uc0\u7916  L\'dd S\u7920  KI\u7878 N (EVENT LISTENERS) =====\
\
    function setupEventListeners() \{\
        // 1. M\uc0\u7903  c\u7917 a\
        [doorLeft, doorRight].forEach(door => \{\
            door.addEventListener('click', () => \{\
                doorLeft.classList.add('open');\
                doorRight.classList.add('open');\
\
                // \uc0\u7848 n splash screen v\'e0 hi\u7879 n app sau khi animation ch\u7841 y xong\
                setTimeout(() => \{\
                    splashScreen.classList.add('hidden');\
                    mainApp.classList.remove('hidden');\
                \}, 1500); // 1.5 gi\'e2y (ph\uc0\u7843 i kh\u7899 p v\u7899 i CSS transition)\
            \});\
        \});\
\
        // 2. Chuy\uc0\u7875 n tranh (Next/Prev)\
        nextBtn.addEventListener('click', () => \{\
            currentPaintingIndex = (currentPaintingIndex + 1) % allPaintings.length;\
            updateDisplay(currentPaintingIndex);\
        \});\
\
        prevBtn.addEventListener('click', () => \{\
            currentPaintingIndex = (currentPaintingIndex - 1 + allPaintings.length) % allPaintings.length;\
            updateDisplay(currentPaintingIndex);\
        \});\
        \
        // 3. Chuy\uc0\u7875 n ng\'f4n ng\u7919 \
        langButtons.forEach(button => \{\
            button.addEventListener('click', () => \{\
                const lang = button.dataset.lang;\
                setLanguage(lang);\
                // Render l\uc0\u7841 i tranh hi\u7879 n t\u7841 i v\u7899 i ng\'f4n ng\u7919  m\u7899 i\
                updateDisplay(currentPaintingIndex);\
            \});\
        \});\
        \
        // 4. T\'ecm ki\uc0\u7871 m (\u273 \u417 n gi\u7843 n, t\'ecm theo t\'ean)\
        searchInput.addEventListener('input', (e) => \{\
            const searchTerm = e.target.value.toLowerCase();\
            if (searchTerm.length > 2) \{\
                // T\'ecm tranh \uc0\u273 \u7847 u ti\'ean kh\u7899 p\
                const foundIndex = allPaintings.findIndex(p => p.name.toLowerCase().includes(searchTerm));\
                \
                if (foundIndex > -1) \{\
                    currentPaintingIndex = foundIndex;\
                    updateDisplay(currentPaintingIndex);\
                \}\
            \}\
        \});\
    \}\
    \
    // H\'e0m ti\uc0\u7879 n \'edch: \u272 \u7893 i ng\'f4n ng\u7919 \
    function setLanguage(lang) \{\
        currentLang = lang;\
        switch (lang) \{\
            case 'VN':\
                allPaintings = dataVN;\
                break;\
            case 'KO':\
                allPaintings = dataKO;\
                break;\
            default:\
                allPaintings = dataEN;\
                break;\
        \}\
        // C\uc0\u7853 p nh\u7853 t text c\u7911 a c\'e1c n\'fat (n\u7871 u c\u7847 n)\
        // ... (v\'ed d\uc0\u7909 : searchInput.placeholder = "Search by name...")\
    \}\
\
    // ===== 6. B\uc0\u7854 T \u272 \u7846 U CH\u7840 Y \u7912 NG D\u7908 NG =====\
    loadAllData();\
\
\});}
