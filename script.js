// Global variables
let periodData = [];
let allArtworks = [];
let filteredArtworks = [];
let currentArtworkIndex = 0;

// Custom cursor: sử dụng file mouse.svg với chiều cao 25pt
// ViewBox gốc: 0 0 60.01 42.92, scale để height = 25pt, width ≈ 35pt
const CUSTOM_CURSOR = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'35pt\' height=\'25pt\' viewBox=\'0 0 60.01 42.92\'><path fill=\'%23fff\' d=\'M15.91,40.53c4.07.46,8.93-.34,13.08,0,.26-3.65-5.95-1.71-6.74-2.79-1.18-1.62.89-1.81,1.62-2.2,1.28-.69,1.82-1.33,2.35-2.69,2.14-5.44-1.69-11.75-7.8-11.04v-2.16c7.47-.71,12.31,6.92,9.96,13.68-.37,1.05-1.12,1.88-1.55,2.88,2.51-.25,4.14,2,4.34,4.3,1.47,0,2.96.08,4.43.03.57-.02,1.09-.25,1.66-.26,5.44-.11,13.09.69,18.19-.05,2.36-.34,2.51-1.49,2.34-3.65-.2-2.57-1.97-5.71-3.6-7.68-.74-.9-5.14-4.75-5.24-5.1-.19-.71.77-1.83,1.04-2.71,2.83-9.16-12.55-11.1-11.89-1.31.19,2.88,2.27,3.46,2.61,4.6s-.6,1.87-1.63,1.39c-2.35-1.1-4.01-6.89-2.65-9.23-6.33-2.46-15.61-5.62-22.37-4.02-14.72,3.49-13.26,26.31,1.85,28.01Z\'/><path d=\'M2.11,21.33l1.07-2.41c2.35-4.64,7.19-8.46,12.48-8.88,7.02-.56,15.01,1.85,21.41,4.53.43.04,1.77-1.61,2.26-1.98,4.51-3.42,11.37-.99,12.83,4.41.65,2.4.08,4.04-.58,6.33,3.12,2.74,6.45,6.24,7.72,10.3,1.38,4.43,1.13,8.33-4.27,8.82-12.52-.71-25.74,1.07-38.17.26C-1.54,41.5-6.84,10.45,10.89,5.27c2.04-.59,7.8-.64,3.21-3.29.09-.47.14-2.04.82-1.98,1.42.14,3.1,2.21,3.05,3.68-.11,3.26-4,2.98-6.25,3.61-5.9,1.66-10.08,7.94-9.6,14.04ZM15.91,40.53c4.07.46,8.93-.34,13.08,0,.26-3.65-5.95-1.71-6.74-2.79-1.18-1.62.89-1.81,1.62-2.2,1.28-.69,1.82-1.33,2.35-2.69,2.14-5.44-1.69-11.75-7.8-11.04v-2.16c7.47-.71,12.31,6.92,9.96,13.68-.37,1.05-1.12,1.88-1.55,2.88,2.51-.25,4.14,2,4.34,4.3,1.47,0,2.96.08,4.43.03.57-.02,1.09-.25,1.66-.26,5.44-.11,13.09.69,18.19-.05,2.36-.34,2.51-1.49,2.34-3.65-.2-2.57-1.97-5.71-3.6-7.68-.74-.9-5.14-4.75-5.24-5.1-.19-.71.77-1.83,1.04-2.71,2.83-9.16-12.55-11.1-11.89-1.31.19,2.88,2.27,3.46,2.61,4.6s-.6,1.87-1.63,1.39c-2.35-1.1-4.01-6.89-2.65-9.23-6.33-2.46-15.61-5.62-22.37-4.02-14.72,3.49-13.26,26.31,1.85,28.01Z\'/><path d=\'M46.92,28.34c3.75-.86,4.46,4.33,1.33,4.94-3.42.66-4.17-4.29-1.33-4.94Z\'/></svg>") 0 0, pointer';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initWelcomePage();
    initMusicToggle();
});

// Initialize Music Toggle
function initMusicToggle() {
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    
    if (!musicToggle || !backgroundMusic) return;
    
    // Tự động bật nhạc khi load trang
    try {
        backgroundMusic.play().then(() => {
            console.log('Background music started automatically');
            musicToggle.checked = true;
        }).catch(error => {
            console.warn('Autoplay was prevented:', error);
            // Nếu autoplay bị chặn, vẫn giữ toggle ở trạng thái checked
            musicToggle.checked = true;
        });
    } catch (error) {
        console.error('Error starting background music:', error);
    }
    
    // Xử lý toggle switch
    musicToggle.addEventListener('change', function() {
        if (this.checked) {
            // Bật nhạc
            backgroundMusic.play().then(() => {
                console.log('Music started');
            }).catch(error => {
                console.error('Error playing music:', error);
                // Nếu không thể play, đặt lại toggle về false
                this.checked = false;
            });
        } else {
            // Tắt nhạc
            backgroundMusic.pause();
            console.log('Music paused');
        }
    });
    
    // Xử lý khi nhạc kết thúc (nếu không loop)
    backgroundMusic.addEventListener('ended', function() {
        if (musicToggle.checked) {
            backgroundMusic.play();
        }
    });
}

// Initialize Welcome Page
function initWelcomePage() {
    const startSvgObject = document.getElementById('start-svg');
    
    if (!startSvgObject) return;
    
    startSvgObject.addEventListener('load', function() {
        const startSvg = startSvgObject.contentDocument;
        if (!startSvg) return;
        
        const doorLeft = startSvg.getElementById('doorleft');
        const doorRight = startSvg.getElementById('doorright');
        
        if (doorLeft) {
            doorLeft.style.cursor = CUSTOM_CURSOR;
            doorLeft.addEventListener('click', function() {
                openDoorsAndTransition(doorLeft, doorRight);
            });
        }
        
        if (doorRight) {
            doorRight.style.cursor = CUSTOM_CURSOR;
            doorRight.addEventListener('click', function() {
                openDoorsAndTransition(doorLeft, doorRight);
            });
        }
    });
}

// Open doors and transition to reception
function openDoorsAndTransition(doorLeft, doorRight) {
    if (!doorLeft || !doorRight) return;
    
    // Add door-open class for animation
    doorLeft.classList.add('door-open');
    doorRight.classList.add('door-open');
    
    // Wait for animation, then transition
    setTimeout(function() {
        showReceptionPage();
    }, 500);
}

// Show Welcome Page
function showWelcomePage() {
    const welcomePage = document.getElementById('welcome-page');
    const receptionPage = document.getElementById('reception-page');
    const mapPage = document.getElementById('mapofvangogh-page');
    const colorsstudioPage = document.getElementById('colorsstudio-page');
    
    if (welcomePage) welcomePage.classList.add('active');
    if (receptionPage) receptionPage.classList.remove('active');
    if (mapPage) mapPage.classList.remove('active');
    if (colorsstudioPage) colorsstudioPage.classList.remove('active');
    
    // Hide info panel if open
    const infoPanel = document.getElementById('map-info-panel');
    if (infoPanel) {
        infoPanel.classList.remove('active');
    }
}

// Show Reception Page
function showReceptionPage() {
    const welcomePage = document.getElementById('welcome-page');
    const receptionPage = document.getElementById('reception-page');
    const mapPage = document.getElementById('mapofvangogh-page');
    const colorsstudioPage = document.getElementById('colorsstudio-page');
    
    if (welcomePage) welcomePage.classList.remove('active');
    if (receptionPage) {
        receptionPage.classList.add('active');
        initReceptionPage();
    }
    if (mapPage) mapPage.classList.remove('active');
    if (colorsstudioPage) colorsstudioPage.classList.remove('active');
    
    // Hide info panel if open
    const infoPanel = document.getElementById('map-info-panel');
    if (infoPanel) {
        infoPanel.classList.remove('active');
    }
}

// Initialize Reception Page
function initReceptionPage() {
    const receptionSvgObject = document.getElementById('reception-svg');
    
    if (!receptionSvgObject) return;
    
    receptionSvgObject.addEventListener('load', function() {
        const receptionSvg = receptionSvgObject.contentDocument;
        if (!receptionSvg) return;
        
        const mapButton = receptionSvg.getElementById('Map');
        const colorsStudioButton = receptionSvg.getElementById('Colors_studio');
        const byeButton = receptionSvg.getElementById('Bye');
        
        if (mapButton) {
            mapButton.style.cursor = CUSTOM_CURSOR;
            mapButton.addEventListener('click', function() {
                showMapPage();
            });
        }
        
        if (colorsStudioButton) {
            colorsStudioButton.style.cursor = CUSTOM_CURSOR;
            colorsStudioButton.addEventListener('click', function() {
                showColorsstudioPage();
            });
        }
        
        // Handle "Bye" button click to return to Welcome page
        if (byeButton) {
            byeButton.style.cursor = CUSTOM_CURSOR;
            byeButton.addEventListener('click', function() {
                showWelcomePage();
            });
        }
    });
}

// Show Map Page
function showMapPage() {
    const welcomePage = document.getElementById('welcome-page');
    const receptionPage = document.getElementById('reception-page');
    const mapPage = document.getElementById('mapofvangogh-page');
    const colorsstudioPage = document.getElementById('colorsstudio-page');
    
    if (welcomePage) welcomePage.classList.remove('active');
    if (receptionPage) receptionPage.classList.remove('active');
    if (mapPage) {
        mapPage.classList.add('active');
        initMapofvangoghPage();
    }
    if (colorsstudioPage) colorsstudioPage.classList.remove('active');
}

// Show Colorsstudio Page
function showColorsstudioPage() {
    const welcomePage = document.getElementById('welcome-page');
    const receptionPage = document.getElementById('reception-page');
    const mapPage = document.getElementById('mapofvangogh-page');
    const colorsstudioPage = document.getElementById('colorsstudio-page');
    
    if (welcomePage) welcomePage.classList.remove('active');
    if (receptionPage) receptionPage.classList.remove('active');
    if (mapPage) mapPage.classList.remove('active');
    if (colorsstudioPage) {
        colorsstudioPage.classList.add('active');
        initColorsstudioPage();
    }
}

// Initialize Mapofvangogh Page
function initMapofvangoghPage() {
    const mapSvgObject = document.getElementById('mapofvangogh-svg');
    
    if (!mapSvgObject) return;
    
    mapSvgObject.addEventListener('load', function() {
        const mapSvg = mapSvgObject.contentDocument;
        if (!mapSvg) return;
        
        const backButton = mapSvg.getElementById('Back');
        if (backButton) {
            backButton.style.cursor = CUSTOM_CURSOR;
            backButton.addEventListener('click', function() {
                showReceptionPage();
            });
        }
        
        // Create network graph inside Board group
        createLocationNetworkGraph(mapSvg);
    });
}

// Parse year string to get start year for sorting
function parseYear(yearStr) {
    if (!yearStr) return 0;
    const match = yearStr.match(/\d{4}/);
    return match ? parseInt(match[0]) : 0;
}

// Create network graph from location.json
function createLocationNetworkGraph(mapSvg) {
    const boardGroup = mapSvg.getElementById('Board');
    if (!boardGroup) {
        console.error('Board group not found in SVG');
        return;
    }
    
    // Get Board dimensions and position
    const boardBBox = boardGroup.getBBox();
    
    fetch('location.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Check content type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn('location.json may not be JSON format');
            }
            return response.json();
        })
        .then(data => {
            if (!data || !Array.isArray(data)) {
                throw new Error('location.json is not a valid array');
            }
            
            if (data.length === 0) {
                console.warn('location.json is empty');
                return;
            }
            
            console.log(`Loaded ${data.length} location entries from location.json`);
            
            // Process data to create nodes and links
            const nodes = [];
            const hierarchyLinks = [];
            const timelineLinks = [];
            
            // Map English country names to Korean (for display)
            const countryMap = {
                'Belgium': '벨시에',
                'Netherlands': '네덜란드',
                'British': '영국',
                'France': '프랑스'
            };
            
            // Define colors for each country (using Korean names)
            const countryColors = {
                '벨시에': '#E91E63',      // Pink
                '네덜란드': '#2196F3',    // Blue
                '영국': '#4CAF50',        // Green
                '프랑스': '#FF9800'       // Orange
            };
            
            // Function to lighten color (mix with white)
            function lightenColor(color, amount = 0.5) {
                const hex = color.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                const newR = Math.round(r + (255 - r) * amount);
                const newG = Math.round(g + (255 - g) * amount);
                const newB = Math.round(b + (255 - b) * amount);
                return `rgb(${newR}, ${newG}, ${newB})`;
            }
            
            // Create country nodes (large circles)
            const countries = ['벨시에', '네덜란드', '영국', '프랑스'];
            const countryNodes = {};
            countries.forEach((country, index) => {
                const nodeId = `country-${country}`;
                countryNodes[country] = {
                    id: nodeId,
                    name: country,
                    type: 'country',
                    radius: 40,
                    color: countryColors[country],
                    x: boardBBox.x + boardBBox.width * (0.2 + index * 0.2),
                    y: boardBBox.y + boardBBox.height * 0.5,
                    fixed: false
                };
                nodes.push(countryNodes[country]);
            });
            
            // Sort data by year for timeline
            // Support both old format (나라, 도시, 년) and new format (Country, City, Year)
            const sortedData = [...data].sort((a, b) => {
                const yearA = parseYear(a.년 || a.Year || '');
                const yearB = parseYear(b.년 || b.Year || '');
                return yearA - yearB;
            });
            
            // Create city nodes and links
            const cityNodes = {};
            const cityToCountry = {};
            
            sortedData.forEach((item, index) => {
                // Support both old format (나라, 도시, 년) and new format (Country, City, Year)
                const countryEN = item.나라 || item.Country || '';
                const cityName = (item.도시 || item.City || '').trim();
                const yearValue = item.년 || item.Year || '';
                
                if (!countryEN || !cityName) {
                    console.warn(`Entry ${index + 1} missing country or city, skipping`);
                    return;
                }
                
                // Map country name from English to Korean
                const countryKR = countryMap[countryEN] || countryEN;
                
                // Check if country exists in countryNodes
                if (!countryNodes[countryKR]) {
                    console.warn(`Country "${countryEN}" (${countryKR}) not found in countryNodes, skipping entry`);
                    return;
                }
                
                const cityKey = `${countryEN}-${cityName}`;
                
                // Handle duplicate cities by combining years
                if (cityNodes[cityKey]) {
                    // If city already exists, combine years (e.g., "1874-1875, 1876")
                    const existingYear = cityNodes[cityKey].year || '';
                    const newYear = yearValue || '';
                    
                    if (newYear && newYear.trim()) {
                        if (existingYear && existingYear.trim()) {
                            // Check if the new year is already included
                            const yearParts = existingYear.split(',').map(y => y.trim());
                            // Also check if any part of newYear (if it contains commas) is already included
                            const newYearParts = newYear.split(',').map(y => y.trim());
                            let needsUpdate = false;
                            for (const newPart of newYearParts) {
                                if (!yearParts.includes(newPart)) {
                                    needsUpdate = true;
                                    break;
                                }
                            }
                            if (needsUpdate) {
                                cityNodes[cityKey].year = `${existingYear}, ${newYear}`;
                            }
                        } else {
                            // If existing node has no year but new entry has year
                            cityNodes[cityKey].year = newYear;
                        }
                    }
                    return; // Skip creating duplicate node
                }
                
                const countryColor = countryColors[countryKR] || '#999';
                // Ensure year is always set, even if empty string
                const cityYear = yearValue || '';
                cityNodes[cityKey] = {
                    id: `city-${cityKey}`,
                    name: cityName, // Use trimmed name
                    country: countryKR, // Use Korean name
                    year: cityYear, // Always set year (can be empty string)
                    type: 'city',
                    radius: 15,
                    color: lightenColor(countryColor, 0.6), // Màu nhạt hơn 60%
                    x: 0,
                    y: 0,
                    fixed: false
                };
                
                // Log if city has no year for debugging
                if (!cityYear || !cityYear.trim()) {
                    console.warn(`City node created without year: ${cityKey} (${cityName})`);
                } else {
                    console.log(`City node created: ${cityName} (${countryEN}) with year: ${cityYear}`);
                }
                nodes.push(cityNodes[cityKey]);
                cityToCountry[cityKey] = countryKR;
                
                // Create hierarchy link (country -> city)
                hierarchyLinks.push({
                    source: countryNodes[countryKR].id,
                    target: cityNodes[cityKey].id,
                    type: 'hierarchy'
                });
            });
            
            // Create timeline links (city -> next city)
            // Only link unique cities (skip duplicates)
            const uniqueCityKeys = Object.keys(cityNodes);
            for (let i = 0; i < sortedData.length - 1; i++) {
                const current = sortedData[i];
                const next = sortedData[i + 1];
                // Support both old and new format
                const currentCountry = current.나라 || current.Country || '';
                const currentCity = current.도시 || current.City || '';
                const nextCountry = next.나라 || next.Country || '';
                const nextCity = next.도시 || next.City || '';
                
                const currentKey = `${currentCountry}-${currentCity}`;
                const nextKey = `${nextCountry}-${nextCity}`;
                
                // Only create link if both cities exist and are different
                if (cityNodes[currentKey] && cityNodes[nextKey] && currentKey !== nextKey) {
                    // Check if link already exists
                    const linkExists = timelineLinks.some(link => 
                        link.source === cityNodes[currentKey].id && 
                        link.target === cityNodes[nextKey].id
                    );
                    
                    if (!linkExists) {
                        timelineLinks.push({
                            source: cityNodes[currentKey].id,
                            target: cityNodes[nextKey].id,
                            type: 'timeline'
                        });
                    }
                }
            }
            
            // Create SVG group for network graph
            const networkGroup = mapSvg.createElementNS('http://www.w3.org/2000/svg', 'g');
            networkGroup.setAttribute('id', 'location-network');
            boardGroup.appendChild(networkGroup);
            
            // Use D3 with the SVG document
            const d3Svg = d3.select(networkGroup);
            
            // Create D3 force simulation
            const simulation = d3.forceSimulation(nodes)
                .force('link', d3.forceLink([...hierarchyLinks, ...timelineLinks]).id(d => d.id).distance(d => {
                    return d.type === 'hierarchy' ? 100 : 150;
                }))
                .force('charge', d3.forceManyBody().strength(d => {
                    return d.type === 'country' ? -500 : -100;
                }))
                .force('center', d3.forceCenter(boardBBox.x + boardBBox.width / 2, boardBBox.y + boardBBox.height / 2))
                .force('collision', d3.forceCollide().radius(d => d.radius + 5))
                .alphaDecay(0.02) // Slower decay để simulation chạy lâu hơn
                .velocityDecay(0.4); // Velocity decay để mượt hơn
            
            // Create links - tất cả đều dày 3pt
            const link = d3Svg.selectAll('line')
                .data([...hierarchyLinks, ...timelineLinks])
                .enter()
                .append('line')
                .attr('stroke', d => d.type === 'hierarchy' ? '#999' : '#FFD700')
                .attr('stroke-width', '3pt') // Tất cả đều 3pt
                .attr('stroke-dasharray', d => d.type === 'timeline' ? '5,5' : '0')
                .attr('opacity', 0.6);
            
            // Create nodes - với màu sắc theo quốc gia
            const node = d3Svg.selectAll('circle')
                .data(nodes)
                .enter()
                .append('circle')
                .attr('r', d => d.radius)
                .attr('fill', d => d.color)
                .attr('stroke', '#fff')
                .attr('stroke-width', 2)
                .style('cursor', 'pointer')
                .call(d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended));
            
            // Add labels - font Pretendard, tăng thêm 5 size + 3 size = 8 size, quốc gia lớn hơn thành phố 3 size
            const label = d3Svg.selectAll('text.name-label')
                .data(nodes)
                .enter()
                .append('text')
                .attr('class', 'name-label')
                .attr('text-anchor', 'middle')
                .attr('dy', d => d.type === 'country' ? d.radius + 20 : d.radius + 15)
                .attr('font-size', d => d.type === 'country' ? '22px' : '19px') // Tăng thêm 3 size: quốc gia 22px (19+3), thành phố 19px (16+3)
                .attr('font-family', 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif')
                .attr('font-weight', d => d.type === 'country' ? 'bold' : 'normal') // Quốc gia đậm
                .attr('fill', '#333')
                .attr('pointer-events', 'none')
                .text(d => d.name);
            
            // Create year label (initially hidden) - tăng thêm 3 size
            // Create labels for all city nodes
            const cityNodesForLabels = nodes.filter(n => n.type === 'city');
            const yearLabel = d3Svg.selectAll('text.year-label')
                .data(cityNodesForLabels, d => d.id) // Use key function to ensure proper binding
                .enter()
                .append('text')
                .attr('class', 'year-label')
                .attr('id', d => `year-label-${d.id}`)
                .attr('text-anchor', 'middle')
                .attr('dy', d => -(d.radius + 20)) // Hiển thị phía trên hình tròn
                .attr('font-size', '19px') // Tăng thêm 3 size từ 16px lên 19px
                .attr('font-family', 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif')
                .attr('font-weight', 'bold')
                .attr('fill', '#000') // Màu đen thay vì vàng
                .attr('pointer-events', 'none')
                .attr('opacity', 0)
                .text(d => {
                    // Hiển thị năm cho thành phố
                    return d.year || '';
                });
            
            // Log which cities have year labels and their years
            console.log(`Created ${yearLabel.size()} year labels for ${cityNodesForLabels.length} city nodes`);
            cityNodesForLabels.forEach(node => {
                if (node.year && node.year.trim()) {
                    console.log(`  ✓ ${node.name} (${node.id}): "${node.year}"`);
                } else {
                    console.warn(`  ⚠️ ${node.name} (${node.id}): NO YEAR`);
                }
            });
            
            // Track which node is currently showing year (by id)
            let activeYearNodeId = null;
            
            // Function to show year for a city node
            function showYearForNode(nodeId) {
                // Hide all year labels first
                yearLabel.attr('opacity', 0);
                
                // Show year for the specified node
                if (nodeId) {
                    activeYearNodeId = nodeId;
                    const targetLabel = d3Svg.select(`#year-label-${nodeId}`);
                    const nodeData = nodes.find(n => n.id === nodeId);
                    
                    if (!targetLabel.empty()) {
                        if (nodeData && nodeData.type === 'city') {
                            const yearText = nodeData.year || '';
                            if (yearText && yearText.trim()) {
                                // Update text content in case it changed
                                targetLabel.text(yearText);
                                targetLabel.attr('opacity', 1);
                                console.log(`Showing year label for ${nodeId} (${nodeData.name}): "${yearText}"`);
                            } else {
                                console.warn(`City node ${nodeId} (${nodeData.name}) has no year to display`);
                                // Still show the label (will be empty, but helps debug)
                                targetLabel.attr('opacity', 1);
                            }
                        } else {
                            console.warn(`Node ${nodeId} is not a city node or not found`);
                        }
                    } else {
                        console.warn(`Year label element not found for node: ${nodeId}`);
                        if (nodeData) {
                            console.warn(`Node exists in data:`, nodeData);
                            // Try to recreate the label if node exists but label doesn't
                            if (nodeData.type === 'city' && nodeData.year) {
                                const newLabel = d3Svg.append('text')
                                    .attr('class', 'year-label')
                                    .attr('id', `year-label-${nodeId}`)
                                    .attr('text-anchor', 'middle')
                                    .attr('font-size', '19px')
                                    .attr('font-family', 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif')
                                    .attr('font-weight', 'bold')
                                    .attr('fill', '#000')
                                    .attr('pointer-events', 'none')
                                    .attr('x', nodeData.x || 0)
                                    .attr('y', (nodeData.y || 0) - (nodeData.radius + 25))
                                    .attr('opacity', 1)
                                    .text(nodeData.year);
                                console.log(`Recreated year label for ${nodeId}: "${nodeData.year}"`);
                            }
                        }
                    }
                } else {
                    activeYearNodeId = null;
                }
            }
            
            // Add click handler to show year above circle
            // Use mouseup instead of click to avoid conflicts with drag
            node.on('click', function(event, d) {
                event.stopPropagation();
                event.preventDefault();
                console.log('Node clicked:', d.id, d.type, 'name:', d.name, 'year:', d.year, 'hasYear:', !!d.year);
                // Show year for clicked city node (show for all city nodes, even if year is empty)
                if (d.type === 'city') {
                    // Always try to show year, even if it's empty (for debugging)
                    console.log('Showing year for city:', d.id, d.name, 'year:', d.year);
                    showYearForNode(d.id);
                } else {
                    // If clicking on country, hide year
                    console.log('Hiding year (clicked on country)');
                    showYearForNode(null);
                }
            });
            
            // Update positions on simulation tick
            simulation.on('tick', () => {
                link
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);
                
                node
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y);
                
                label
                    .attr('x', d => d.x)
                    .attr('y', d => d.y);
                
                // Update year label positions (follows node, positioned above)
                yearLabel
                    .attr('x', d => d.x || 0)
                    .attr('y', d => {
                        const baseY = d.y || 0;
                        return baseY - (d.radius + 25); // Position above the circle
                    });
                
                // Maintain opacity and position for active year label during simulation
                if (activeYearNodeId !== null) {
                    const activeLabel = d3Svg.select(`#year-label-${activeYearNodeId}`);
                    const nodeData = nodes.find(n => n.id === activeYearNodeId);
                    
                    if (nodeData && nodeData.type === 'city') {
                        const yearText = nodeData.year || '';
                        if (yearText && yearText.trim()) {
                            if (!activeLabel.empty()) {
                                // Update position and text content
                                activeLabel
                                    .attr('x', nodeData.x || 0)
                                    .attr('y', (nodeData.y || 0) - (nodeData.radius + 25))
                                    .text(yearText)
                                    .attr('opacity', 1);
                            } else {
                                // Label doesn't exist but node does - recreate it
                                const newLabel = d3Svg.append('text')
                                    .attr('class', 'year-label')
                                    .attr('id', `year-label-${activeYearNodeId}`)
                                    .attr('text-anchor', 'middle')
                                    .attr('font-size', '19px')
                                    .attr('font-family', 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif')
                                    .attr('font-weight', 'bold')
                                    .attr('fill', '#000')
                                    .attr('pointer-events', 'none')
                                    .attr('x', nodeData.x || 0)
                                    .attr('y', (nodeData.y || 0) - (nodeData.radius + 25))
                                    .attr('opacity', 1)
                                    .text(yearText);
                            }
                        }
                    }
                }
            });
            
            // Drag functions - handle SVG coordinates
            function dragstarted(event, d) {
                // Show year when starting to drag a city node (show for all city nodes)
                if (d.type === 'city') {
                    console.log('Drag started for city:', d.id, d.name, 'year:', d.year);
                    showYearForNode(d.id);
                }
                // Restart simulation with higher alpha to make it responsive
                if (!event.active) {
                    simulation.alphaTarget(0.3).restart();
                }
                // Fix the node position at current location
                d.fx = d.x;
                d.fy = d.y;
            }
            
            function dragged(event, d) {
                // Use D3's pointer function to get SVG coordinates
                const [x, y] = d3.pointer(event, boardGroup);
                // Update fixed position as we drag
                d.fx = x;
                d.fy = y;
                // Keep simulation active during drag with higher alpha
                if (!event.active) {
                    simulation.alphaTarget(0.3).restart();
                } else {
                    simulation.alphaTarget(0.3);
                }
            }
            
            function dragended(event, d) {
                // Don't immediately stop simulation - let it settle naturally
                // Only reset alphaTarget if no other drags are active
                if (!event.active) {
                    // Gradually reduce alphaTarget instead of stopping immediately
                    simulation.alphaTarget(0.05);
                    // After a delay, let simulation settle but keep it slightly active
                    setTimeout(() => {
                        if (!event.active) {
                            // Keep simulation at very low alpha so nodes can still move
                            // This prevents nodes from getting "stuck"
                            simulation.alphaTarget(0.01);
                        }
                    }, 300);
                }
                // Unlock the node position after drag ends so it can move freely again
                // This allows nodes to be dragged again and prevents them from getting stuck
                d.fx = null;
                d.fy = null;
            }
        })
        .catch(error => {
            console.error('Error loading location.json:', error);
            console.error('Error details:', error.message);
            if (error.stack) {
                console.error('Stack trace:', error.stack);
            }
            
            // Show user-friendly error message in the Board group
            if (boardGroup) {
                const errorText = boardGroup.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'text');
                errorText.setAttribute('x', boardBBox.x + boardBBox.width / 2);
                errorText.setAttribute('y', boardBBox.y + boardBBox.height / 2);
                errorText.setAttribute('text-anchor', 'middle');
                errorText.setAttribute('fill', '#666');
                errorText.setAttribute('font-size', '16px');
                errorText.setAttribute('font-family', 'Pretendard, sans-serif');
                errorText.textContent = `위치 데이터를 불러올 수 없습니다. (${error.message})`;
                boardGroup.appendChild(errorText);
            }
        });
}

// Initialize Colorsstudio Page
// This function loads all data from van_gogh_artwork_kr.json and initializes the colorsstudio page
function initColorsstudioPage() {
    // Load artwork data from van_gogh_artwork_kr.json
    // All data displayed in colorsstudio page comes from this JSON file
    const filename = 'van_gogh_artwork_kr.json';
    
    // Show loading indicator
    const colorsstudioPage = document.getElementById('colorsstudio-page');
    if (colorsstudioPage) {
        const loadingMsg = document.createElement('div');
        loadingMsg.id = 'loading-message';
        loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 10000;';
        loadingMsg.textContent = '작품 데이터를 불러오는 중...';
        document.body.appendChild(loadingMsg);
    }
    
    fetch(filename)
        .then(response => {
            console.log('Fetching:', filename);
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response.json(); // Parse JSON directly
        })
        .then(data => {
            // Remove loading indicator
            const loadingMsg = document.getElementById('loading-message');
            if (loadingMsg) {
                loadingMsg.remove();
            }
            
            // Validate data structure
            if (!Array.isArray(data)) {
                throw new Error('JSON data is not an array');
            }
            
            if (data.length === 0) {
                console.warn('JSON file is empty');
            }
            
            // Filter out invalid artworks and store valid ones
            // Since JSON is already cleaned, we can be more lenient with filtering
            allArtworks = data.filter(artwork => {
                // Basic validation: artwork must be an object
                if (!artwork || typeof artwork !== 'object') {
                    console.warn('Invalid artwork found (not an object):', artwork);
                    return false;
                }
                
                // Get title from various possible fields
                const title = artwork['예술작품'] || artwork['Artwork'] || artwork['Title'] || artwork['짧은 제목'] || '';
                
                // Filter out entries without valid title (but be lenient since JSON is pre-cleaned)
                if (!title || typeof title !== 'string' || title.trim().length < 2) {
                    return false;
                }
                
                // Filter out entries where title looks like metadata/color info instead of artwork name
                const titleLower = title.toLowerCase();
                const titleStr = title.trim();
                
                // Specific patterns that indicate this is metadata, not an artwork title
                // These are very specific to catch only obvious metadata entries
                const metadataPatterns = [
                    /^노란색.*초록색.*빨간색.*파란색.*검은색/i,  // Color percentages at start
                    /^~?\d+%.*~?\d+%.*~?\d+%/i,  // Multiple percentage patterns
                    /^차분함.*치료적.*회복.*집중력/i,  // Emotion list
                    /^극도의 행복.*창조적인 행복감.*절대적인 기쁨/i,  // Emotion descriptions
                    /직접적인 보색.*조화/i,  // Color theory terms
                ];
                
                // Check if title matches specific metadata patterns (only at start or throughout)
                let isMetadata = false;
                for (const pattern of metadataPatterns) {
                    if (pattern.test(titleStr)) {
                        isMetadata = true;
                        break;
                    }
                }
                
                // Also check for titles that are clearly just color/emotion lists
                if (!isMetadata) {
                    // Check if title is just a list of colors or emotions (no actual artwork name)
                    const colorEmotionWords = ['노란색', '초록색', '빨간색', '파란색', '검은색', '차분함', '치료적', '회복', '집중력', '행복', '기쁨'];
                    const wordsInTitle = titleStr.split(/[,\s\.]+/).filter(w => w.length > 0);
                    const metadataWordCount = wordsInTitle.filter(w => colorEmotionWords.some(cew => w.includes(cew))).length;
                    // If more than 50% of words are metadata words, it's likely metadata
                    if (wordsInTitle.length > 0 && metadataWordCount / wordsInTitle.length > 0.5) {
                        isMetadata = true;
                    }
                }
                
                if (isMetadata) {
                    return false;
                }
                
                // Filter out very long titles (likely descriptions, not titles) - but be more lenient
                if (title.length > 300) {
                    return false;
                }
                
                // Since JSON is pre-cleaned, we can be more lenient
                // Just check if it has at least a title and one other field
                const hasYear = artwork['년도'] && String(artwork['년도']).trim().length > 0;
                const hasSize = artwork['크기'] && String(artwork['크기']).trim().length > 0;
                const hasType = artwork['유형'] && String(artwork['유형']).trim().length > 0;
                const hasStage = artwork['단계'] && String(artwork['단계']).trim().length > 0;
                
                // At least one meaningful field should be present (minimal check since JSON is pre-cleaned)
                const hasAnyData = hasYear || hasSize || hasType || hasStage;
                if (!hasAnyData) {
                    console.warn('Artwork missing all basic fields:', title);
                    return false;
                }
                
                return true;
            });
            filteredArtworks = [...allArtworks];
            
            console.log(`Successfully loaded ${allArtworks.length} valid artworks from van_gogh_artwork_kr.json`);
            console.log(`Total artworks available for display: ${filteredArtworks.length}`);
            if (data.length !== allArtworks.length) {
                console.warn(`${data.length - allArtworks.length} invalid artworks were filtered out`);
            }
            
            // Log first and last artworks to verify range
            if (filteredArtworks.length > 0) {
                const firstTitle = filteredArtworks[0]['예술작품'] || filteredArtworks[0]['Artwork'] || filteredArtworks[0]['Title'] || 'Unknown';
                const lastTitle = filteredArtworks[filteredArtworks.length - 1]['예술작품'] || filteredArtworks[filteredArtworks.length - 1]['Artwork'] || filteredArtworks[filteredArtworks.length - 1]['Title'] || 'Unknown';
                console.log(`First artwork: "${firstTitle}"`);
                console.log(`Last artwork: "${lastTitle}"`);
            }
            
            // Setup event listeners
            setupColorsstudioEventListeners();
            
            // Display first artwork using data from JSON
            if (filteredArtworks.length > 0) {
                displayArtwork(0);
            } else {
                console.warn('No artworks to display');
            }
            
            // Create period chart (uses period.json, but artwork data comes from van_gogh_artwork_kr.json)
            createPeriodChart();
        })
        .catch(error => {
            // Remove loading indicator
            const loadingMsg = document.getElementById('loading-message');
            if (loadingMsg) {
                loadingMsg.remove();
            }
            
            console.error('Error loading artwork data from van_gogh_artwork_kr.json:', error);
            console.error('Error details:', error.message);
            if (error.stack) {
                console.error('Stack trace:', error.stack);
            }
            
            // Check if it's a CORS or network error
            let errorMsg = '작품 데이터를 불러올 수 없습니다.\n\n';
            errorMsg += '오류: ' + error.message + '\n\n';
            
            if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
                errorMsg += '⚠️ CORS 오류가 발생했습니다.\n';
                errorMsg += '해결 방법:\n';
                errorMsg += '1. 로컬 서버를 사용하세요 (예: VS Code Live Server, Python http.server)\n';
                errorMsg += '2. file:// 프로토콜 대신 http:// 또는 https:// 사용\n';
                errorMsg += '3. 브라우저 확장 프로그램이 CORS를 차단하는지 확인\n\n';
            }
            
            errorMsg += '확인 사항:\n';
            errorMsg += '1. van_gogh_artwork_kr.json 파일이 같은 폴더에 있는지 확인\n';
            errorMsg += '2. 파일 이름이 정확한지 확인 (대소문자 포함)\n';
            errorMsg += '3. JSON 형식이 올바른지 확인\n';
            errorMsg += '4. 브라우저 콘솔(F12)에서 자세한 오류 확인';
            
            alert(errorMsg);
        });
}

// Setup event listeners for colorsstudio page
function setupColorsstudioEventListeners() {
    // Exit button (SVG)
    const exitSvg = document.getElementById('colorsstudio-exit-svg');
    if (exitSvg) {
        exitSvg.addEventListener('load', function() {
            const svgDoc = exitSvg.contentDocument;
            if (svgDoc) {
                const svgElement = svgDoc.documentElement;
                svgElement.style.cursor = CUSTOM_CURSOR;
                svgElement.addEventListener('click', function() {
                    showReceptionPage();
                });
            }
        });
    }
    
    // Also handle click on container
    const exitContainer = document.getElementById('colorsstudio-exit-container');
    if (exitContainer) {
        exitContainer.addEventListener('click', function() {
            showReceptionPage();
        });
    }
    
    // Search button
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
    }
    
    // Navigation arrows
    const prevBtn = document.getElementById('prev-painting');
    const nextBtn = document.getElementById('next-painting');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentArtworkIndex > 0) {
                displayArtwork(currentArtworkIndex - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentArtworkIndex < filteredArtworks.length - 1) {
                displayArtwork(currentArtworkIndex + 1);
            }
        });
    }
    
    // Info buttons
    const infoButtons = document.querySelectorAll('.info-btn');
    infoButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            infoButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            const type = this.getAttribute('data-type');
            showInfoContent(type);
        });
    });
}

// Perform search
function performSearch() {
    const searchName = document.getElementById('search-name').value.toLowerCase();
    const searchColor = document.getElementById('search-color').value.toLowerCase();
    const searchPeriod = document.getElementById('search-period').value;
    
    filteredArtworks = allArtworks.filter(artwork => {
        const nameMatch = !searchName || 
                         (artwork['예술작품'] && artwork['예술작품'].toLowerCase().includes(searchName));
        const colorMatch = !searchColor || 
                          (artwork['5_주요_색상'] && artwork['5_주요_색상'].toLowerCase().includes(searchColor)) ||
                          (artwork['지배적인 색상'] && artwork['지배적인 색상'].toLowerCase().includes(searchColor));
        const periodMatch = !searchPeriod || (artwork['단계'] && artwork['단계'] === searchPeriod);
        
        return nameMatch && colorMatch && periodMatch;
    });
    
    if (filteredArtworks.length > 0) {
        displayArtwork(0);
    } else {
        alert('검색 결과가 없습니다.');
    }
}

// Display artwork
function displayArtwork(index) {
    if (index < 0 || index >= filteredArtworks.length) {
        console.warn(`Invalid artwork index: ${index}, total artworks: ${filteredArtworks.length}`);
        return;
    }
    
    currentArtworkIndex = index;
    const artwork = filteredArtworks[index];
    
    // Validate artwork object
    if (!artwork || typeof artwork !== 'object') {
        console.error(`Invalid artwork at index ${index}:`, artwork);
        alert(`작품 데이터가 올바르지 않습니다. (인덱스: ${index})`);
        return;
    }
    
    // Log artwork info for debugging
    const title = artwork['예술작품'] || artwork['짧은 제목'] || artwork['Artwork'] || artwork['Title'] || 'Unknown';
    console.log(`Displaying artwork ${index + 1}/${filteredArtworks.length}: "${title}"`);
    
    try {
        // Display painting info - using all fields from JSON
    const titleEl = document.getElementById('painting-title');
    const stageEl = document.getElementById('painting-stage');
    const yearEl = document.getElementById('painting-year');
    const sizeEl = document.getElementById('painting-size');
    const typeEl = document.getElementById('painting-type');
    const locationEl = document.getElementById('painting-location');
    const dominantColorEl = document.getElementById('painting-dominant-color');
    
    // Hiển thị tên tranh - ưu tiên 예술작품, nếu không có thì thử các field khác
    if (titleEl) {
        let title = artwork['예술작품'] || '';
        // Nếu không có 예술작품, thử các field khác
        if (!title || title.trim() === '') {
            title = artwork['짧은 제목'] || artwork['Artwork'] || artwork['Title'] || 'Untitled';
        }
        titleEl.textContent = title;
    }
    
    if (stageEl) {
        const stage = artwork['단계'] || '';
        const stageTotal = artwork['스테이지_토탈_웍스'] || '';
        const stageId = artwork['스테이지_아이디'] || '';
        if (stage) {
            let stageText = `단계: ${stage}`;
            if (stageTotal) stageText += ` (총 ${stageTotal}점)`;
            if (stageId) stageText += ` [${stageId}]`;
            stageEl.textContent = stageText;
        }
    }
    
    if (yearEl) yearEl.textContent = `년도: ${artwork['년도'] || ''}`;
    if (sizeEl) sizeEl.textContent = `크기: ${artwork['크기'] || ''}`;
    if (typeEl) typeEl.textContent = `유형: ${artwork['유형'] || ''}`;
    if (locationEl) locationEl.textContent = `현재 표시 위치: ${artwork['현재 표시 위치'] || ''}`;
    
    if (dominantColorEl) {
        const dominantColor = artwork['지배적인 색상'] || '';
        if (dominantColor) {
            dominantColorEl.textContent = `지배적인 색상: ${dominantColor}`;
            dominantColorEl.style.display = 'block';
        } else {
            dominantColorEl.style.display = 'none';
        }
    }
    
        // Load and display image
        const imagePath = getImageFileName(artwork);
        const paintingImage = document.getElementById('painting-image');
        const paintingImageWrapper = document.querySelector('.painting-image-wrapper');
        const infoContentPanel = document.getElementById('info-content-panel');
        
        if (paintingImage) {
            // Dùng title đã tìm được ở trên
            const title = artwork['예술작품'] || artwork['짧은 제목'] || artwork['Artwork'] || artwork['Title'] || 'Van Gogh Painting';
            paintingImage.alt = title;
            
            // Special handling for "The Parsonage at Nuenen" - tăng kích thước hình ảnh 70% và thu nhỏ ô thông tin
            const isParsonageNuenen = title.toLowerCase().includes('parsonage') && title.toLowerCase().includes('nuenen');
            
            if (isParsonageNuenen) {
                // Tăng kích thước hình ảnh lên 70% (300px * 1.7 = 510px, 350px * 1.7 = 595px)
                if (paintingImageWrapper) {
                    paintingImageWrapper.style.maxWidth = '510px'; // Tăng 70% từ 300px
                    paintingImageWrapper.style.flexShrink = '0';
                }
                if (paintingImage) {
                    paintingImage.style.maxWidth = '510px'; // Tăng 70% từ 300px
                    paintingImage.style.maxHeight = '595px'; // Tăng 70% từ 350px
                }
                // Thu nhỏ bề ngang ô thông tin bên phải
                if (infoContentPanel) {
                    infoContentPanel.style.flex = '0.6'; // Giảm từ 1.5 xuống 0.6
                    infoContentPanel.style.minWidth = '250px'; // Giảm từ 400px xuống 250px
                }
            } else {
                // Reset về mặc định cho các tranh khác
                if (paintingImageWrapper) {
                    paintingImageWrapper.style.maxWidth = '';
                    paintingImageWrapper.style.flexShrink = '0';
                }
                if (paintingImage) {
                    paintingImage.style.maxWidth = '';
                    paintingImage.style.maxHeight = '';
                }
                if (infoContentPanel) {
                    infoContentPanel.style.flex = '1';
                    infoContentPanel.style.minWidth = '';
                }
            }
            
            // Handle image load error
            paintingImage.onerror = function() {
                console.error(`Failed to load image: images/${imagePath}`);
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="16" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E';
                this.alt = `Image not found: ${imagePath}`;
            };
            
            // Set src after setting error handler
            paintingImage.src = `images/${imagePath}`;
        }
    
        // Create visualizations using all data from JSON
        // Wrap each in try-catch to prevent one error from breaking others
        try {
            createDonutChart(artwork);
        } catch (error) {
            console.error('Error creating donut chart:', error);
        }
        
        try {
            createColorTable(artwork);
        } catch (error) {
            console.error('Error creating color table:', error);
        }
        
        try {
            createMoodBar(artwork);
        } catch (error) {
            console.error('Error creating mood bar:', error);
        }
        
        try {
            updatePeriodChart(artwork['년도']);
        } catch (error) {
            console.error('Error updating period chart:', error);
        }
        
        // Hiển thị nội dung "기술" mặc định
        try {
            showInfoContent('technique');
            // Đảm bảo nút "기술" có class active
            const techniqueBtn = document.querySelector('.info-btn[data-type="technique"]');
            if (techniqueBtn) {
                document.querySelectorAll('.info-btn').forEach(btn => btn.classList.remove('active'));
                techniqueBtn.classList.add('active');
            }
        } catch (error) {
            console.error('Error showing default info:', error);
        }
        
        try {
            displayColorMeaningAnalysis(artwork);
        } catch (error) {
            console.error('Error displaying color meaning analysis:', error);
        }
    } catch (error) {
        console.error('Error displaying artwork:', error);
        console.error('Artwork data:', artwork);
        alert(`작품을 표시하는 중 오류가 발생했습니다: ${error.message}`);
    }
}

// Parse colors from JSON field "5_주요_색상"
function parseColors(artwork) {
    const colorText = artwork['5_주요_색상'] || '';
    const colors = [];
    
    // Split by comma and parse each color
    const colorParts = colorText.split(',');
    colorParts.forEach(part => {
        part = part.trim();
        // Extract hex code: (#964B00) or try to match color name
        const hexMatch = part.match(/#([0-9A-Fa-f]{6})/);
        if (hexMatch) {
            const hex = hexMatch[0];
            // Extract color name (before the hex or parentheses)
            const nameMatch = part.match(/(.+?)\s*\(/);
            const name = nameMatch ? nameMatch[1].trim() : part.replace(hex, '').trim();
            colors.push({ name: name, hex: hex });
        } else {
            // If no hex, try to extract color name only
            const cleanName = part.split('(')[0].trim();
            if (cleanName) {
                // Try to find hex from dominant color or use a default
                colors.push({ name: cleanName, hex: '#999999' });
            }
        }
    });
    
    return colors;
}

// Parse color ratios from JSON field "색상 비율"
function parseColorRatios(artwork) {
    const ratioText = artwork['색상 비율'] || '';
    const ratios = {};
    
    // Match patterns like "갈색/갈색 암갈색: ~40%" or "갈색: ~40%"
    const ratioMatches = ratioText.matchAll(/([^:]+):\s*~?(\d+)%/g);
    for (const match of ratioMatches) {
        const colorName = match[1].trim();
        const percentage = parseInt(match[2]);
        ratios[colorName] = percentage;
    }
    
    return ratios;
}

// Create donut chart for 5 dominant colors
function createDonutChart(artwork) {
    const colors = parseColors(artwork);
    const ratios = parseColorRatios(artwork);
    
    const donutDiv = document.getElementById('donut-chart');
    const colorNamesDiv = document.getElementById('color-names');
    
    if (!donutDiv) return;
    
    donutDiv.innerHTML = '';
    if (colorNamesDiv) colorNamesDiv.innerHTML = '';
    
    if (colors.length === 0) {
        donutDiv.innerHTML = '<p>색상 데이터가 없습니다.</p>';
        return;
    }
    
    if (Object.keys(ratios).length === 0) {
        donutDiv.innerHTML = '<p>색상 비율 데이터가 없습니다.</p>';
        return;
    }
    
    // Parse ratios as array to maintain order
    const ratioText = artwork['색상 비율'] || '';
    const ratioArray = [];
    const ratioMatches = ratioText.matchAll(/([^:]+):\s*~?(\d+)%/g);
    for (const match of ratioMatches) {
        const colorName = match[1].trim();
        const percentage = parseInt(match[2]);
        ratioArray.push({ name: colorName, percentage: percentage });
    }
    
    // Match colors with ratios
    const colorData = colors.map((color, index) => {
        let percentage = 0;
        
        // Strategy 1: Match by position
        if (index < ratioArray.length) {
            percentage = ratioArray[index].percentage;
        } else {
            // Strategy 2: Try to find by name matching
            for (const ratio of ratioArray) {
                const colorKey = color.name.toLowerCase().replace(/[^가-힣a-z0-9]/g, '');
                const ratioKey = ratio.name.toLowerCase().replace(/[^가-힣a-z0-9]/g, '');
                
                if (colorKey.includes(ratioKey.split('/')[0]) || 
                    ratioKey.includes(colorKey.split('/')[0]) ||
                    colorKey.includes(ratioKey) || 
                    ratioKey.includes(colorKey)) {
                    percentage = ratio.percentage;
                    break;
                }
            }
        }
        
        return { ...color, percentage };
    });
    
    // Filter out colors with 0 percentage and sort by percentage
    const validColorData = colorData.filter(c => c.percentage > 0);
    
    if (validColorData.length === 0) {
        donutDiv.innerHTML = '<p>색상 비율을 매칭할 수 없습니다.</p>';
        return;
    }
    
    // Sort by percentage (descending)
    validColorData.sort((a, b) => b.percentage - a.percentage);
    
    // Create SVG for donut chart
    const baseSize = 200;
    const newSize = Math.sqrt(baseSize * baseSize * 1.3);
    const width = Math.round(newSize);
    const height = Math.round(newSize);
    const radius = Math.min(width, height) / 2;
    
    const originalThickness = baseSize / 2 * 0.4;
    const newThickness = originalThickness * 1.1;
    const innerRadius = radius - newThickness;
    const outerRadius = radius;
    
    const svg = d3.select('#donut-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const g = svg.append('g')
        .attr('transform', `translate(${width/2}, ${height/2})`);
    
    const pie = d3.pie()
        .value(d => d.percentage)
        .sort(null);
    
    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
    
    const arcs = g.selectAll('.arc')
        .data(pie(validColorData))
        .enter()
        .append('g')
        .attr('class', 'arc');
    
    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => d.data.hex);
    
    // Add percentage labels on chart - display all percentages
    arcs.append('text')
        .attr('transform', d => {
            const [x, y] = arc.centroid(d);
            return `translate(${x}, ${y})`;
        })
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .style('fill', '#333')
        .text(d => `${d.data.percentage}%`); // Display all percentages
    
    // Display color names below chart (centered)
    if (colorNamesDiv) {
        colorNamesDiv.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 15px;';
        validColorData.forEach(color => {
            const item = document.createElement('div');
            item.className = 'color-name-item';
            item.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 8px; margin: 2px 0; text-align: center;';
            item.innerHTML = `
                <div style="width: 20px; height: 20px; background: ${color.hex}; border-radius: 4px; border: 1px solid #ddd;"></div>
                <span style="font-size: 0.9em;">${color.name}</span>
            `;
            colorNamesDiv.appendChild(item);
        });
    }
}

// Create color table using all color data from JSON
function createColorTable(artwork) {
    const colors = parseColors(artwork);
    const ratios = parseColorRatios(artwork);
    const colorTableDiv = document.getElementById('color-table');
    
    if (!colorTableDiv) return;
    
    colorTableDiv.innerHTML = '';
    
    if (colors.length === 0) {
        colorTableDiv.innerHTML = '<p>색상 데이터가 없습니다.</p>';
        return;
    }
    
    // Parse ratios as array
    const ratioText = artwork['색상 비율'] || '';
    const ratioArray = [];
    const ratioMatches = ratioText.matchAll(/([^:]+):\s*~?(\d+)%/g);
    for (const match of ratioMatches) {
        const colorName = match[1].trim();
        const percentage = parseInt(match[2]);
        ratioArray.push({ name: colorName, percentage: percentage });
    }
    
    // Combine and sort by percentage
    const colorData = colors.map((color, index) => {
        let percentage = 0;
        if (index < ratioArray.length) {
            percentage = ratioArray[index].percentage;
        } else {
            for (const ratio of ratioArray) {
                const colorKey = color.name.toLowerCase().replace(/[^가-힣a-z0-9]/g, '');
                const ratioKey = ratio.name.toLowerCase().replace(/[^가-힣a-z0-9]/g, '');
                if (colorKey.includes(ratioKey.split('/')[0]) || ratioKey.includes(colorKey.split('/')[0])) {
                    percentage = ratio.percentage;
                    break;
                }
            }
        }
        return { ...color, percentage };
    }).filter(c => c.percentage > 0).sort((a, b) => b.percentage - a.percentage);
    
    const dominant = colorData[0];
    const others = colorData.slice(1, 5);
    
    // Parse complementary colors from 보색대비 field
    const complementaryText = artwork['보색대비'] || '';
    let complementaryColors = [];
    if (complementaryText) {
        const parts = complementaryText.split(/와|과|paired with|가 결합/);
        if (parts.length >= 2) {
            const findColor = (text) => {
                for (const color of colorData) {
                    const colorKey = color.name.toLowerCase().replace(/[^가-힣a-z0-9]/g, '');
                    const textKey = text.toLowerCase().replace(/[^가-힣a-z0-9]/g, '');
                    if (textKey.includes(colorKey.split('/')[0]) || colorKey.includes(textKey.split('/')[0])) {
                        return color;
                    }
                }
                const hexMatch = text.match(/#([0-9A-Fa-f]{6})/);
                if (hexMatch) {
                    const hex = hexMatch[0];
                    const nameMatch = text.match(/(.+?)\s*\(/);
                    const name = nameMatch ? nameMatch[1].trim() : text.replace(hex, '').trim();
                    return { name: name, hex: hex, percentage: 0 };
                }
                return null;
            };
            
            const color1 = findColor(parts[0].trim());
            const color2 = findColor(parts[1].trim());
            
            if (color1 && color2) {
                complementaryColors = [color1, color2];
            }
        }
    }
    
    let html = '<div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">';
    
    // Dominant color (horizontal rectangle - increased width by 50%)
    html += `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
            <div style="width: 180px; height: 60px; background: ${dominant.hex}; border-radius: 8px; border: 2px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
            <div style="font-family: monospace; font-size: 12px; color: #666;">${dominant.hex}</div>
            <div style="font-size: 11px; color: #999; font-weight: 600;">(주요)</div>
        </div>
    `;
    
    // Other 4 colors in 2x2 grid (increased width by 50%)
    html += '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">';
    others.forEach(color => {
        html += `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                <div style="width: 112.5px; height: 50px; background: ${color.hex}; border-radius: 8px; border: 2px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
                <div style="font-family: monospace; font-size: 11px; color: #666;">${color.hex}</div>
            </div>
        `;
    });
    html += '</div>';
    
    // Complementary colors section (increased width by 50%)
    if (complementaryColors.length === 2) {
        html += '<div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e5e5; width: 100%;">';
        html += '<div style="font-size: 14px; font-weight: 700; color: #333; margin-bottom: 12px; text-align: center;">보색대비</div>';
        html += '<div style="display: flex; justify-content: center; gap: 20px; align-items: center;">';
        complementaryColors.forEach(color => {
            html += `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                    <div style="width: 75px; height: 50px; background: ${color.hex}; border-radius: 8px; border: 2px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
                    <div style="font-family: monospace; font-size: 11px; color: #666;">${color.hex}</div>
                    <div style="font-size: 10px; color: #999; text-align: center;">${color.name}</div>
                </div>
            `;
        });
        html += '</div>';
        html += '</div>';
    }
    
    html += '</div>';
    
    colorTableDiv.innerHTML = html;
}

// Create psychology meter using 기분 점수, 이모티콘, 표현 from JSON
// Create horizontal mood bar
function createMoodBar(artwork) {
    let moodScoreValue = artwork['기분 점수'];
    
    let moodScore = 0;
    if (moodScoreValue !== null && moodScoreValue !== undefined && moodScoreValue !== '') {
        moodScore = parseInt(moodScoreValue);
        if (isNaN(moodScore)) {
            moodScore = 0;
        }
    }
    
    const displayScore = Math.min(15, Math.max(0, moodScore));
    
    const barDiv = document.getElementById('mood-bar-chart');
    barDiv.innerHTML = '';
    
    const width = 388; // Thu ngắn 3% từ 400px (400 * 0.97 = 388)
    const barHeight = 80; // Tăng gấp đôi từ 40 lên 80
    const labelHeight = 25; // Không gian cho label bên dưới
    const height = barHeight + labelHeight; // Tổng chiều cao = thanh + label
    const barY = 0; // Thanh nằm ở trên cùng
    
    const svg = d3.select('#mood-bar-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('display', 'block')
        .style('margin', '0 auto'); // Căn giữa
    
    // Define 5 color segments (from red to green)
    const segments = [
        { start: 0, end: 3, color: '#E53935' },      // Red - 매우 낮음
        { start: 3, end: 6, color: '#FF8C00' },       // Orange - 낮음
        { start: 6, end: 9, color: '#FFD700' },      // Yellow - 보통
        { start: 9, end: 12, color: '#64B5F6' },     // Light Blue - 높음
        { start: 12, end: 15, color: '#43A047' }     // Green - 매우 높음
    ];
    
    const segmentWidth = width / 5;
    
    // Draw color segments
    segments.forEach((segment, index) => {
        svg.append('rect')
            .attr('x', index * segmentWidth)
            .attr('y', barY)
            .attr('width', segmentWidth)
            .attr('height', barHeight)
            .attr('fill', segment.color)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1)
            .attr('rx', 4)
            .attr('ry', 4);
    });
    
    // Draw tick marks
    for (let i = 0; i <= 15; i++) {
        const tickX = (i / 15) * width;
        const tickY1 = barY;
        const tickY2 = barY + barHeight;
        
        svg.append('line')
            .attr('x1', tickX)
            .attr('y1', tickY1)
            .attr('x2', tickX)
            .attr('y2', tickY2)
            .attr('stroke', '#333')
            .attr('stroke-width', 0.5)
            .attr('opacity', 0.3);
    }
    
    // Draw slider knob at current score position
    const knobX = (displayScore / 15) * width;
    const knobY = barY + barHeight / 2;
    
    // Determine color based on score for the knob
    let knobColor = '#E53935';
    if (displayScore >= 12) {
        knobColor = '#43A047';
    } else if (displayScore >= 9) {
        knobColor = '#64B5F6';
    } else if (displayScore >= 6) {
        knobColor = '#FFD700';
    } else if (displayScore >= 3) {
        knobColor = '#FF8C00';
    }
    
    // Draw slider knob (circle)
    svg.append('circle')
        .attr('cx', knobX)
        .attr('cy', knobY)
        .attr('r', 12)
        .attr('fill', '#E0E0E0')
        .attr('stroke', '#999')
        .attr('stroke-width', 2)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))');
    
    // Draw labels - vẽ sau cùng để nằm trên cùng của tất cả layer
    // Hiển thị đầy đủ tất cả các số từ 0 đến 15 bên dưới thanh
    for (let i = 0; i <= 15; i++) {
        const tickX = (i / 15) * width;
        let textAnchor = 'middle'; // Mặc định căn giữa
        
        // Điều chỉnh cho số 0 và 15 để không bị cắt
        if (i === 0) {
            textAnchor = 'start'; // Số 0 căn trái
        } else if (i === 15) {
            textAnchor = 'end'; // Số 15 căn phải
        }
        
        svg.append('text')
            .attr('x', tickX)
            .attr('y', barY + barHeight + 18) // Đặt bên dưới thanh
            .attr('text-anchor', textAnchor)
            .style('font-size', '11px')
            .style('font-weight', '600')
            .style('fill', '#333')
            .style('pointer-events', 'none') // Không chặn sự kiện chuột
            .text(i);
    }
    
    // Display score
    const scoreDisplay = document.getElementById('mood-score-display');
    scoreDisplay.textContent = `${displayScore}/15`;
    scoreDisplay.style.color = knobColor;
    
    // Get emoji and expression from artwork
    const emoji = artwork['이모티콘'] || '';
    const expression = artwork['표현'] || '';
    
    // Map emotion to emoji
    const emojiMap = {
        'DESPAIR': '😭',
        'SORROW': '😔',
        'STRUGGLE': '🤔',
        'WEARINESS': '😥',
        'CALM': '🧘',
        'INTENSE': '🤩',
        'OPTIMISTIC': '🥳',
        'EUPHORIA': '✨'
    };
    
    // Get emoji to display
    let displayEmoji = emojiMap[emoji] || '';
    if (emoji && emoji.match(/[\u{1F300}-\u{1F9FF}]/u)) {
        // If emoji is already an emoji character, use it directly
        displayEmoji = emoji;
    }
    
    // Display emoji
    const emojiDisplay = document.getElementById('mood-emoji-display');
    if (emojiDisplay) {
        emojiDisplay.textContent = displayEmoji;
    }
    
    // Display expression
    const expressionDisplay = document.getElementById('mood-expression-display');
    if (expressionDisplay) {
        expressionDisplay.textContent = expression;
    }
}

// Display color meaning analysis using "색상 의미 분석" field from JSON
function displayColorMeaningAnalysis(artwork) {
    const analysisText = artwork['색상 의미 분석'] || '';
    const contentDiv = document.getElementById('color-meaning-content');
    
    if (!contentDiv) return;
    
    contentDiv.innerHTML = '';
    
    if (!analysisText) {
        contentDiv.innerHTML = '<p>색상 의미 분석 데이터가 없습니다.</p>';
        return;
    }
    
    const lines = analysisText.split('\n').filter(line => line.trim());
    const colors = parseColors(artwork);
    
    lines.forEach(line => {
        const item = document.createElement('div');
        item.style.cssText = 'margin-bottom: 15px; padding: 10px; display: flex; align-items: flex-start; gap: 10px;';
        
        let colorBox = '';
        for (const color of colors) {
            const colorNamePart = color.name.split('/')[0].trim();
            if (line.includes(colorNamePart) || line.toLowerCase().includes(colorNamePart.toLowerCase())) {
                colorBox = `<div style="width: 20px; height: 20px; background: ${color.hex}; border-radius: 4px; border: 1px solid #ddd; flex-shrink: 0;"></div>`;
                break;
            }
        }
        
        if (!colorBox && colors.length > 0) {
            colorBox = `<div style="width: 20px; height: 20px; background: ${colors[0].hex}; border-radius: 4px; border: 1px solid #ddd; flex-shrink: 0;"></div>`;
        }
        
        item.innerHTML = colorBox + `<span style="font-size: 0.95em; line-height: 1.6;">${line.trim()}</span>`;
        contentDiv.appendChild(item);
    });
}

// List of available image files (will be populated on first use)
let availableImageFiles = null;

// Get list of available image files
function getAvailableImageFiles() {
    if (availableImageFiles) {
        return availableImageFiles;
    }
    
    // Known image files from the images folder (GitHub-friendly names: lowercase, underscores, no special chars)
    availableImageFiles = [
        'agostina_segatori_sitting_in_the_cafe_du_tambourin.jpg',
        'almond_blossom.jpg',
        'at_eternitys_gate.jpg',
        'avenue_of_poplars_in_autumn.jpg',
        'beach_at_scheveningen_in_stormy_weather.jpg',
        'boulevard_de_clichy.jpg',
        'bridge_in_the_rain_after_hiroshige.jpg',
        'cafe_terrace_at_night_arles.jpg',
        'cottages.jpg',
        'courtesan_after_eisen.jpg',
        'first_steps_after_ㅡillet.jpg',
        'four_cut_sunflowers.jpg',
        'head_of_a_peasant_woman.jpg',
        'la_mousme.jpg',
        'le_restaurant_de_la_sirene_at_asnieres.jpg',
        'olive_trees_with_yellow_sky_and_sun.jpg',
        'outskirts_of_paris.jpg',
        'peasant_family_at_table.jpg',
        'peasant_woman_digging.jpg',
        'portrait_of_dr_gachet.jpg',
        'portrait_of_pere_tanguy.jpg',
        'portrait_of_the_postman_joseph_roulin.jpg',
        'potato_field.jpg',
        'restaurant_de_la_sirene_a_asnieres.jpg',
        'road_with_cypress_and_star.jpg',
        'self_portrait_pointillist.jpg',
        'self_portrait_as_a_painter.jpg',
        'self_portrait_with_bandaged_ear.jpg',
        'self_portrait_with_grey_felt_hat.jpg',
        'self_portrait_with_pipe.jpg',
        'shoes.jpg',
        'skull_of_a_skeleton_with_burning_cigarette.jpg',
        'sorrow.jpg',
        'starry_night_over_the_rhone.jpg',
        'still_life_with_clogs_and_pots.jpg',
        'still_life_with_dahlias.jpg',
        'still_life_with_open_bible.jpg',
        'sunflowers.jpg',
        'terrace_of_a_restaurant_at_montmartre.jpg',
        'the_church_at_auvers.jpg',
        'the_italian_woman.jpg',
        'the_night_cafe.jpg',
        'the_old_church_tower_at_nuenen.jpg',
        'the_parsonage_at_nuenen.jpg',
        'the_potato_eaters.jpg',
        'the_potato_peeler.jpg',
        'the_raising_of_lazarus_after_rembrandt.jpg',
        'the_seine_bridge_at_asnieres.jpg',
        'the_sower.jpg',
        'the_starry_night.jpg',
        'the_vegetable_garden_in_montmartre.jpg',
        'the_yellow_house.jpg',
        'trees_in_the_garden_of_saint_paul.jpg',
        'two_peasant_women_digging.jpg',
        'van_goghs_chair.jpg',
        'view_of_montmartre_with_windmills.jpg',
        'water_mill_at_opwetten.jpg',
        'weaver_seen_from_the_front.jpg',
        'wheat_field_with_cypresses.jpg',
        'wheatfield_with_crows.jpg'
    ];
    
    return availableImageFiles;
}

// Normalize string for matching (remove special chars, lowercase, etc.)
function normalizeString(str) {
    if (!str) return '';
    
    return str
        .toLowerCase()
        // Remove accents/diacritics (é -> e, ô -> o, etc.)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Replace hyphens with underscores (Self-Portrait -> self_portrait)
        .replace(/-/g, '_')
        // Remove parentheses and their content (after Hiroshige) -> after_hiroshige
        .replace(/\([^)]*\)/g, '')
        // Remove other special characters except alphanumeric, space, underscore
        .replace(/[^a-z0-9\s_]/g, '')
        // Replace spaces with underscores
        .replace(/\s+/g, '_')
        // Replace multiple underscores with single
        .replace(/_+/g, '_')
        // Remove leading/trailing underscores
        .replace(/^_|_$/g, '')
        .trim();
}

// Find best matching image file based on artwork title
function getImageFileName(artwork) {
    // Use 예술작품 (main artwork title) to find image file
    // Nếu không có 예술작품, thử các field khác
    let title = artwork['예술작품'] || '';
    if (!title || title.trim() === '') {
        title = artwork['짧은 제목'] || artwork['Artwork'] || artwork['Title'] || '';
    }
    
    if (!title || title.trim() === '') {
        console.warn('No artwork title found for artwork:', artwork);
        return 'the_potato_eaters.jpg'; // Updated to match new filename format
    }
    
    // Get available image files (synchronous function, returns array directly)
    const imageFiles = getAvailableImageFiles();
    
    // Ensure imageFiles is an array
    if (!Array.isArray(imageFiles)) {
        console.error('getAvailableImageFiles() did not return an array:', imageFiles);
        // Fallback: try direct title match
        const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.Jpg'];
        for (const ext of extensions) {
            const testFilename = title + ext;
            return testFilename;
        }
        return 'the_potato_eaters.jpg';
    }
    
    // Normalize the artwork title (예술작품)
    const normalizedTitle = normalizeString(title);
    
    // Try to find exact or close match using 예술작품 only
    let bestMatch = null;
    let bestScore = 0;
    
    imageFiles.forEach(filename => {
        // Remove extension for comparison
        const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP|Jpg|Jpeg|Png|Webp)$/i, '');
        const normalizedFilename = normalizeString(nameWithoutExt);
        
        // Calculate similarity score based on 예술작품 only
        let score = 0;
        
        // Exact match
        if (normalizedTitle === normalizedFilename) {
            score = 100;
        }
        // Title contains filename or filename contains title
        else if (normalizedTitle.includes(normalizedFilename) || normalizedFilename.includes(normalizedTitle)) {
            score = 90;
        }
        // Word-by-word matching (split by underscore since filenames use underscores)
        else {
            const titleWords = normalizedTitle.split('_').filter(w => w.length > 0);
            const filenameWords = normalizedFilename.split('_').filter(w => w.length > 0);
            const commonWords = titleWords.filter(word => filenameWords.includes(word));
            if (commonWords.length > 0) {
                const matchRatio = commonWords.length / Math.max(titleWords.length, filenameWords.length);
                score = matchRatio * 70; // Increased from 60 to 70
                
                // Bonus if most words match
                if (matchRatio >= 0.7) {
                    score += 10;
                }
            }
        }
        
        if (score > bestScore) {
            bestScore = score;
            bestMatch = filename;
        }
    });
    
    // If we found a good match, return it (giảm threshold xuống 10 để match nhiều hơn)
    if (bestMatch && bestScore >= 10) {
        console.log(`✓ Matched "${title}" to "${bestMatch}" with score ${bestScore.toFixed(1)}`);
        return bestMatch;
    }
    
    // If no good match but we have a best match, still try it (very low threshold)
    if (bestMatch && bestScore > 0) {
        console.log(`⚠ Using best available match "${title}" -> "${bestMatch}" with score ${bestScore.toFixed(1)}`);
        return bestMatch;
    }
    
    // Fallback 1: try direct title match with common extensions
    const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.Jpg'];
    for (const ext of extensions) {
        const testFilename = title + ext;
        if (imageFiles.includes(testFilename)) {
            console.log(`Direct match found: "${testFilename}"`);
            return testFilename;
        }
    }
    
    // Fallback 2: try with normalized title (convert to underscore format like new filenames)
    const normalizedTitleForFile = normalizeString(title);
    for (const ext of extensions) {
        const testFilename = normalizedTitleForFile + ext.toLowerCase();
        if (imageFiles.includes(testFilename)) {
            console.log(`Normalized match found: "${testFilename}"`);
            return testFilename;
        }
    }
    
    // Fallback 3: try matching first few words (convert to underscore format)
    const titleWordsPartial = normalizedTitleForFile.split('_').filter(w => w.length > 0);
    if (titleWordsPartial.length > 0) {
        // Try matching with first 2-3 words
        for (let wordCount = Math.min(3, titleWordsPartial.length); wordCount >= 1; wordCount--) {
            const partialTitle = titleWordsPartial.slice(0, wordCount).join('_');
            for (const ext of extensions) {
                const testFilename = partialTitle + ext.toLowerCase();
                if (imageFiles.includes(testFilename)) {
                    console.log(`Partial match found (${wordCount} words): "${testFilename}"`);
                    return testFilename;
                }
            }
        }
    }
    
    // Fallback 4: try case-insensitive matching with normalized strings
    const normalizedTitleLower = normalizedTitle.toLowerCase();
    for (const filename of imageFiles) {
        const lowerFilename = filename.toLowerCase();
        const nameWithoutExt = lowerFilename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
        const normalizedFilename = normalizeString(nameWithoutExt);
        if (normalizedFilename === normalizedTitleLower || normalizedFilename.includes(normalizedTitleLower) || normalizedTitleLower.includes(normalizedFilename)) {
            console.log(`Case-insensitive normalized match found: "${filename}"`);
            return filename;
        }
    }
    
    // Last resort: try partial word matching (for cases like "The Raising of Lazarus" -> might match "raising" or "lazarus")
    const titleWordsFinal = normalizedTitle.split('_').filter(w => w.length > 3); // Only words longer than 3 chars
    for (const word of titleWordsFinal) {
        for (const filename of imageFiles) {
            const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
            const normalizedFilename = normalizeString(nameWithoutExt);
            if (normalizedFilename.includes(word) || word.includes(normalizedFilename)) {
                console.log(`⚠ Partial word match found: "${title}" -> "${filename}" (matched word: "${word}")`);
                return filename;
            }
        }
    }
    
    // Last resort: log detailed warning and return a default
    console.warn(`⚠️ Could not find image file for artwork: "${title}"`);
    console.warn(`   Normalized title: "${normalizedTitle}"`);
    console.warn(`   Available files (first 10): ${imageFiles.slice(0, 10).join(', ')}...`);
    console.warn(`   Best match was: "${bestMatch || 'none'}" with score ${bestScore}`);
    // Return a default image that exists
    return 'the_potato_eaters.jpg';
}

// Show info content in panel
function showInfoContent(type) {
    const artwork = filteredArtworks[currentArtworkIndex];
    const title = document.getElementById('info-title');
    const text = document.getElementById('info-text');
    
    if (!artwork) return;
    
    const fieldMap = {
        'technique': '기술',
        'meaning': '의미',
        'psychology': '심리 분석',
        'intention': '의도 분석'
    };
    
    const fieldName = fieldMap[type];
    const content = artwork[fieldName] || '';
    
    if (title) title.textContent = fieldName;
    if (text) text.textContent = content;
}

// Create period chart
function createPeriodChart() {
    fetch('period.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Check content type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn('period.json may not be JSON format');
            }
            return response.json();
        })
        .then(data => {
            if (!data || !Array.isArray(data)) {
                throw new Error('period.json is not a valid array');
            }
            // Filter and clean data - trim whitespace from 한국어 field
            periodData = data
                .filter(item => item && item.한국어 && item.한국어.trim() !== '모두')
                .map(item => ({
                    ...item,
                    한국어: item.한국어.trim(), // Ensure no trailing spaces
                    기간: item.기간 ? item.기간.trim() : '',
                    그림: item.그림 ? item.그림.trim() : ''
                }));
            
            if (periodData.length === 0) {
                console.error('No period data found after filtering');
                return;
            }
            
            console.log(`Loaded ${periodData.length} periods from period.json`);
            
            const chartDiv = document.getElementById('period-bar-chart');
            if (!chartDiv) {
                console.error('period-bar-chart element not found');
                return;
            }
            
            chartDiv.innerHTML = '';
            
            // Center the chart on screen - tăng chiều dài 30%
            const width = 1040; // Tăng 30% từ 800 (800 * 1.3 = 1040)
            const height = 100;
            // Tính tổng số tranh từ 6 thời kỳ thay vì hardcode 2100
            const totalWorks = periodData.reduce((sum, period) => {
                const count = parseInt(period.그림.replace('점', '')) || 0;
                return sum + count;
            }, 0);
            const scale = width / totalWorks;
            
            // Create SVG directly in chartDiv (CSS will center it)
            const svg = d3.select('#period-bar-chart')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style('display', 'block')
                .style('margin', '0 auto')
                .style('max-width', '100%'); // Đảm bảo không vượt quá container
            
            // Define colors for each period - very eye-catching, vibrant colors
            // Đổi màu để phân biệt rõ hơn: 초기 회화 시기 và 뇌넌/앤트베르펜 시기
            const periodColors = {
                '초기 회화 시기': '#D32F2F',        // Dark Red
                '뇌넌/앤트베르펜 시기': '#E91E63',   // Pink - màu hồng
                '파리 시기': '#1E88E5',             // Vibrant Blue
                '아를 시기': '#FB8C00',             // Vibrant Orange
                '생레미 시기': '#8E24AA',           // Vibrant Purple
                '오베르 쉬르 우아즈 시기': '#FDD835' // Vibrant Yellow
            };
            
            let xPos = 0;
            
            periodData.forEach((period, index) => {
                const count = parseInt(period.그림.replace('점', '')) || 0;
                const segmentWidth = count * scale;
                const color = periodColors[period.한국어] || '#ccc';
                
                svg.append('rect')
                    .attr('class', 'period-bar')
                    .attr('x', xPos)
                    .attr('y', 0)
                    .attr('width', segmentWidth)
                    .attr('height', height - 30)
                    .attr('fill', color)
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 1)
                    .attr('data-period', period.한국어.trim()); // Trim để đảm bảo khớp với label
                
                xPos += segmentWidth;
            });
            
            // Add labels below
            const labelsContainer = document.createElement('div');
            labelsContainer.className = 'period-labels-container';
            labelsContainer.style.cssText = 'display: flex; justify-content: space-around; margin-top: 10px; flex-wrap: wrap; gap: 15px;';
            
            periodData.forEach(period => {
                const color = periodColors[period.한국어] || '#ccc';
                const labelItem = document.createElement('div');
                labelItem.className = 'period-label-item';
                labelItem.setAttribute('data-period', period.한국어.trim()); // Thêm data attribute để highlight
                labelItem.style.cssText = 'display: flex; align-items: center; gap: 5px;';
                labelItem.innerHTML = `
                    <div style="width: 12px; height: 12px; background: ${color}; border-radius: 2px;"></div>
                    <span class="period-label-text" style="font-size: 0.9em;">${period.한국어.trim()} (${period.그림})</span>
                `;
                labelsContainer.appendChild(labelItem);
            });
            
            chartDiv.appendChild(labelsContainer);
        })
        .catch(error => {
            console.error('Error loading period.json:', error);
            console.error('Error details:', error.message);
            if (error.stack) {
                console.error('Stack trace:', error.stack);
            }
            
            // Show user-friendly error message
            const chartDiv = document.getElementById('period-bar-chart');
            if (chartDiv) {
                chartDiv.innerHTML = `
                    <div style="padding: 20px; text-align: center; color: #666;">
                        <p>시기별 작품 수 데이터를 불러올 수 없습니다.</p>
                        <p style="font-size: 0.9em; margin-top: 10px;">오류: ${error.message}</p>
                    </div>
                `;
            }
            
            // Set empty array to prevent errors in updatePeriodChart
            periodData = [];
        });
}

// Update period chart highlight - sử dụng dữ liệu từ period.json
function updatePeriodChart(year) {
    if (!year || !periodData.length) return;
    
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) return;
    
    // Parse period data từ period.json để xác định thời kỳ
    // Dựa trên "기간" trong period.json
    let periodName = '';
    
    // Lặp qua periodData để tìm thời kỳ phù hợp
    for (const period of periodData) {
        const 기간 = period.기간 || '';
        const 한국어 = period.한국어.trim();
        
        // Parse năm từ "기간"
        // Format: "1881–1883", "December 1883 - November 1885", etc.
        if (기간.includes('–')) {
            // Format: "1881–1883"
            const years = 기간.split('–').map(y => parseInt(y.trim()));
            if (years.length === 2 && yearNum >= years[0] && yearNum <= years[1]) {
                periodName = 한국어;
                break;
            }
        } else if (기간.includes('-')) {
            // Format: "December 1883 - November 1885"
            const parts = 기간.split('-');
            if (parts.length === 2) {
                // Extract years from both parts
                const year1Match = parts[0].match(/\d{4}/);
                const year2Match = parts[1].match(/\d{4}/);
                if (year1Match && year2Match) {
                    const year1 = parseInt(year1Match[0]);
                    const year2 = parseInt(year2Match[0]);
                    // Check if year falls within range
                    if (yearNum >= year1 && yearNum <= year2) {
                        periodName = 한국어;
                        break;
                    }
                }
            }
        }
    }
    
    // Fallback logic nếu không tìm thấy từ parsing
    if (!periodName) {
        if (yearNum >= 1881 && yearNum <= 1883) {
            periodName = '초기 회화 시기';
        } else if (yearNum >= 1884 && yearNum <= 1885) {
            periodName = '뇌넌/앤트베르펜 시기';
        } else if (yearNum >= 1886 && yearNum <= 1887) {
            periodName = '파리 시기';
        } else if (yearNum === 1888) {
            periodName = '아를 시기';
        } else if (yearNum === 1889) {
            periodName = '생레미 시기';
        } else if (yearNum === 1890) {
            periodName = '오베르 쉬르 우아즈 시기';
        }
    }
    
    // Remove previous highlights từ cả bar và label
    d3.selectAll('.period-bar').classed('highlighted', false);
    document.querySelectorAll('.period-label-item').forEach(item => {
        item.classList.remove('highlighted');
        // Reset border và background
        item.style.border = '';
        item.style.borderRadius = '';
        item.style.padding = '';
        item.style.backgroundColor = '';
        const span = item.querySelector('.period-label-text');
        if (span) {
            span.style.fontWeight = 'normal';
            span.style.color = 'black';
            span.style.fontSize = '';
        }
    });
    
    // Add highlight to current period bar và label
    if (periodName) {
        // Highlight bar
        d3.selectAll('.period-bar')
            .filter(function() {
                const barPeriod = d3.select(this).attr('data-period');
                return barPeriod && barPeriod.trim() === periodName.trim();
            })
            .classed('highlighted', true);
        
        // Highlight label
        document.querySelectorAll('.period-label-item').forEach(item => {
            const itemPeriod = item.getAttribute('data-period');
            if (itemPeriod && itemPeriod.trim() === periodName.trim()) {
                item.classList.add('highlighted');
                const span = item.querySelector('.period-label-text');
                if (span) {
                    span.style.fontWeight = 'bold';
                    span.style.color = '#FFD700'; // Màu vàng để highlight
                    span.style.fontSize = '1em'; // To hơn một chút
                }
            }
        });
    }
}

