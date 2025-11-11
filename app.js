/* ======== VAN GOGH GRAM - APP.JS (PHIÊN BẢN HOÀN CHỈNH) ======== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. KHAI BÁO BIẾN VÀ DOM ELEMENTS =====

    // URLs - Đã cập nhật theo đường dẫn bạn cung cấp
    const URL_EN = `https://raw.githubusercontent.com/nvquynhu26/youmetest/refs/heads/main/VanGogh_EN.json`;
    const URL_VN = `https://raw.githubusercontent.com/nvquynhu26/youmetest/refs/heads/main/VanGogh_VN.json`;
    const URL_KO = `https://raw.githubusercontent.com/nvquynhu26/youmetest/refs/heads/main/VanGogh_KO.json`;
    const URL_MOOD = `https://raw.githubusercontent.com/nvquynhu26/youmetest/refs/heads/main/VanGogh_mood.json`;
    
    // Biến lưu trữ dữ liệu
    let dataEN = [], dataVN = [], dataKO = [], dataMood = [];
    let allPaintings = []; // Dữ liệu theo ngôn ngữ hiện tại
    let currentPaintingIndex = 0;
    let currentLang = 'EN';

    // Biến lưu trữ các đối tượng biểu đồ
    let colorChart = null;
    let moodChart = null;

    // DOM Elements
    const splashScreen = document.getElementById('splash-screen');
    const mainApp = document.getElementById('main-app');
    // Sửa ID cửa
    const doorLeft = document.getElementById('door_left');
    const doorRight = document.getElementById('door_right');

    const searchInput = document.getElementById('search-input');
    const langButtons = document.querySelectorAll('.lang-btn');
    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    const paintingImage = document.getElementById('painting-image');
    const paintingName = document.getElementById('painting-name');
    const infoYear = document.getElementById('info-year');
    const infoMaterial = document.getElementById('info-material');
    const infoSize = document.getElementById('info-size');
    const infoLocation = document.getElementById('info-location');
    
    const colorPaletteContainer = document.getElementById('color-palette');
    const moodText = document.getElementById('mood-text');
    const paintingDescription = document.getElementById('painting-description');
    
    const colorChartCtx = document.getElementById('color-donut-chart').getContext('2d');
    const moodGaugeCtx = document.getElementById('mood-gauge-chart').getContext('2d');


    // ===== 2. HÀM TẢI DỮ LIỆU (LOAD DATA) =====

    async function loadAllData() {
        try {
            // Tải song song 4 file JSON
            const [resEN, resVN, resKO, resMood] = await Promise.all([
                fetch(URL_EN),
                fetch(URL_VN),
                fetch(URL_KO),
                fetch(URL_MOOD)
            ]);

            dataEN = await resEN.json();
            dataVN = await resVN.json();
            dataKO = await resKO.json();
            dataMood = await resMood.json();
            // ===== BẮT ĐẦU CODE TỰ ĐỘNG TẠO ID =====

            // Hàm này tạo ID sạch từ tên (vd: "The Sower" -> "the-sower")
            const createIdFromText = (text) => {
                if (!text) return 'unknown-' + Math.random().toString(36).substr(2, 9);
                return text.toLowerCase()
                    .replace(/\s+/g, '-')       // Thay khoảng trắng bằng '-'
                    .replace(/[^\w-]+/g, '')  // Xóa ký tự đặc biệt
                    .replace(/--+/g, '-')      // Thay 2 dấu '--' bằng 1 '-'
                    .trim();
            };

            // Bây giờ, duyệt qua mảng tranh và thêm 'id' cho mỗi bức
            dataEN.Artwork.forEach(painting => {
                painting.id = createIdFromText(painting.Artwork);
            });
            dataVN.Artwork.forEach(painting => {
                painting.id = createIdFromText(painting.Artwork);
            });
            dataKO.Artwork.forEach(painting => {
                painting.id = createIdFromText(painting.Artwork);
            });
            
            // ===== KẾT THÚC CODE TỰ ĐỘNG TẠO ID =====

            console.log('Tải dữ liệu thành công!');
            
            // Khởi tạo trang
            initializeSite();

        } catch (error) {
            console.error('LỖI: Không thể tải file JSON.', error);
            splashScreen.innerHTML = `<h1>Lỗi tải dữ liệu. Vui lòng kiểm tra lại đường dẫn file JSON và kết nối mạng.</h1><p>${error}</p>`;
        }
    }

    // ===== 3. HÀM KHỞI TẠO VÀ HIỂN THỊ (RENDER) =====

    function initializeSite() {
        // Thiết lập ngôn ngữ ban đầu (đã bao gồm fix .Artwork)
        setLanguage('EN');
        
        // Hiển thị tranh đầu tiên
        renderPainting(currentPaintingIndex);

        // Khởi tạo biểu đồ
        createCharts();
        
        // Cập nhật biểu đồ với dữ liệu tranh đầu tiên
        updateCharts(currentPaintingIndex);
        
        // Cập nhật bảng màu
        updateColorPalette(currentPaintingIndex);

        // Gắn sự kiện
        setupEventListeners();
    }

    /**
     * HÀM PHÂN TÍCH CHUỖI MÀU
     * Dùng chung cho cả updateCharts và updateColorPalette
     * Chuyển đổi chuỗi "Brown: ~30%\n..." thành mảng [{name: 'Brown', percent: 30, hex: '#...'}, ...]
     */
    function parseColorsData(painting) {
        const colorRatioString = painting.Color_Ratio;
        if (!colorRatioString) return [];
        
        const lines = colorRatioString.split('\n');
        return lines.map(line => {
            const parts = line.split(':');
            if (parts.length < 2) return null; // Bỏ qua dòng không hợp lệ
            
            const name = parts[0].trim();
            const percentStr = parts[1].trim().replace(/~|%/g, '');
            const percent = parseFloat(percentStr);
            
            return {
                name: name,
                percent: percent,
                // QUAN TRỌNG: JSON của bạn không có mã HEX. 
                // Mã màu ở đây đang được TẠO NGẪU NHIÊN.
                // Để màu chuẩn, bạn phải thêm mã HEX vào file JSON.
                hex: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
            };
        }).filter(c => c && !isNaN(c.percent)); // Lọc ra các dòng hợp lệ
    }


    // HÀM RENDER TRANH (ĐÃ SỬA KEY THEO MẪU JSON CỦA BẠN)
    function renderPainting(index) {
        if (!allPaintings[index]) return;

        const painting = allPaintings[index];

        // -----------------------------------------------------------------
        // !!! CẢNH BÁO QUAN TRỌNG !!!
        // Mẫu JSON của bạn KHÔNG CÓ key cho 'image_url' (link ảnh)
        // và 'id' (để map với file mood).
        // Bạn PHẢI THÊM 2 key này vào file JSON để ảnh và đồng hồ mood hiển thị.
        // 
        // Ví dụ, file JSON của bạn nên có thêm:
        // "id": "vg_001",
        // "image_url": "https://link-toi-buc-tranh.jpg",
        // -----------------------------------------------------------------

        paintingImage.src = painting.image_url || ''; // Dùng 'image_url' (cần thêm vào JSON)
        paintingImage.alt = painting.Artwork;
        
        // Thông tin cơ bản
        paintingName.textContent = painting.Artwork;
        infoYear.textContent = painting.Year;
        infoMaterial.textContent = painting.Medium;
        infoSize.textContent = painting.Dimensions;
        infoLocation.textContent = painting.Current_Location;
        
        // Mô tả chi tiết (Ghép các trường text lại)
        // Dùng .replace(/\n/g, '<br>') để giữ nguyên định dạng xuống dòng
        paintingDescription.innerHTML = `
            <h4 class="title-font">Thời kỳ (Period)</h4>
            <p>${painting.Period || 'N/A'}</p>
            
            <h4 class="title-font">Phương pháp vẽ (Technique)</h4>
            <p>${(painting.Technique || 'N/A').replace(/\n/g, '<br>')}</p>
            
            <h4 class="title-font">Ý nghĩa tác phẩm (Meaning)</h4>
            <p>${(painting.Meaning_of_the_Painting || 'N/A').replace(/\n/g, '<br>')}</p>
            
            <h4 class="title-font">Phân tích tâm lý (Psychological Analysis)</h4>
            <p>${(painting.Psychological_Analysis || 'N/A').replace(/\n/g, '<br>')}</p>

            <h4 class="title-font">Ý đồ sáng tác (Intent Analysis)</h4>
            <p>${(painting.Intent_Analysis || 'N/A').replace(/\n/g, '<br>')}</p>
        `;
    }
    
    // Hàm cập nhật tất cả
    function updateDisplay(index) {
        renderPainting(index);
        updateCharts(index);
        updateColorPalette(index);
    }

    // ===== 4. HÀM XỬ LÝ BIỂU ĐỒ (CHARTS) =====

    function createCharts() {
        // 1. Tạo biểu đồ Donut
        colorChart = new Chart(colorChartCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.parsed}%`
                        }
                    }
                }
            }
        });

        // 2. Tạo biểu đồ Gauge
        moodChart = new Chart(moodGaugeCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [0, 15], // [Giá trị, Giá trị còn lại]
                    backgroundColor: ['var(--accent-color)', '#e0e0e0'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                rotation: -90,
                circumference: 180,
                cutout: '70%',
                plugins: {
                    tooltip: { enabled: false },
                    legend: { display: false }
                }
            }
        });
    }

    // CẬP NHẬT BIỂU ĐỒ (ĐÃ SỬA KEY VÀ LOGIC MÀU)
    function updateCharts(index) {
        const painting = allPaintings[index];
        
        // 1. Cập nhật Donut Chart
        const paintingColors = parseColorsData(painting);
        
        if (colorChart) {
            colorChart.data.labels = paintingColors.map(c => c.name);
            colorChart.data.datasets[0].data = paintingColors.map(c => c.percent);
            colorChart.data.datasets[0].backgroundColor = paintingColors.map(c => c.hex);
            colorChart.update();
        }

        // 2. Cập nhật Mood Gauge
        // CẢNH BÁO: Cần key "id" trong file JSON chính để map với file mood
        const moodData = dataMood.find(m => m.id === painting.id); 
        
        if (moodData && moodChart) {
            const score = moodData.mood_score; // Giả định key trong file mood là 'mood_score'
            moodChart.data.datasets[0].data = [score, 15 - score];
            moodChart.update();
            moodText.textContent = `${score}/15`;
        } else {
            // Nếu không tìm thấy mood data (do thiếu ID)
            moodChart.data.datasets[0].data = [0, 15];
            moodChart.update();
            moodText.textContent = `N/A`;
        }
    }
    
    // CẬP NHẬT BẢNG MÀU (ĐÃ SỬA KEY VÀ LOGIC MÀU)
    function updateColorPalette(index) {
        colorPaletteContainer.innerHTML = ''; // Xóa palette cũ
        const paintingColors = parseColorsData(allPaintings[index]);

        if (paintingColors) {
            paintingColors.forEach(color => {
                const colorBox = document.createElement('div');
                colorBox.className = 'palette-color';
                colorBox.style.backgroundColor = color.hex;
                // Hiển thị Tên Màu và Mã HEX (đang là ngẫu nhiên)
                colorBox.innerHTML = `<strong>${color.name}</strong><br>${color.hex}`;
                colorPaletteContainer.appendChild(colorBox);
            });
        }
    }


    // ===== 5. HÀM XỬ LÝ SỰ KIỆN (EVENT LISTENERS) =====

    function setupEventListeners() {
        // 1. Mở cửa (Đã sửa ID cửa)
        [doorLeft, doorRight].forEach(door => {
            door.addEventListener('click', () => {
                doorLeft.classList.add('open');
                doorRight.classList.add('open');

                setTimeout(() => {
                    splashScreen.classList.add('hidden');
                    mainApp.classList.remove('hidden');
                }, 1500); // 1.5 giây
            });
        });

        // 2. Chuyển tranh (Next/Prev)
        nextBtn.addEventListener('click', () => {
            currentPaintingIndex = (currentPaintingIndex + 1) % allPaintings.length;
            updateDisplay(currentPaintingIndex);
        });

        prevBtn.addEventListener('click', () => {
            currentPaintingIndex = (currentPaintingIndex - 1 + allPaintings.length) % allPaintings.length;
            updateDisplay(currentPaintingIndex);
        });
        
        // 3. Chuyển ngôn ngữ
        langButtons.forEach(button => {
            button.addEventListener('click', () => {
                const lang = button.dataset.lang;
                setLanguage(lang);
                updateDisplay(currentPaintingIndex);
            });
        });
        
        // 4. Tìm kiếm (Sửa key tìm kiếm thành 'Artwork')
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 2) {
                // Sửa key 'name' thành 'Artwork'
                const foundIndex = allPaintings.findIndex(p => p.Artwork.toLowerCase().includes(searchTerm));
                
                if (foundIndex > -1) {
                    currentPaintingIndex = foundIndex;
                    updateDisplay(currentPaintingIndex);
                }
            }
        });
    }
    
    // HÀM ĐỔI NGÔN NGỮ (ĐÃ SỬA LỖI .Artwork)
    function setLanguage(lang) {
        currentLang = lang;
        switch (lang) {
            case 'VN':
                allPaintings = dataVN.Artwork;
                break;
            case 'KO':
                allPaintings = dataKO.Artwork;
                break;
            default:
                allPaintings = dataEN.Artwork;
                break;
        }
        // Cập nhật placeholder cho ô tìm kiếm (ví dụ)
        if (lang === 'VN') {
            searchInput.placeholder = "Tìm theo tên tác phẩm...";
        } else if (lang === 'KO') {
            searchInput.placeholder = "작품명으로 검색...";
        } else {
            searchInput.placeholder = "Search by artwork name...";
        }
    }

    // ===== 6. BẮT ĐẦU CHẠY ỨNG DỤNG =====
    loadAllData();

});
