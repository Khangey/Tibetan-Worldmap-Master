// 在文件开头添加常量
const MIN_ZOOM_LEVEL = 2;  // 最小缩放级别
const BASE_FONT_SCALE = 0.000025; // 基础字体缩放因子

// 等待文档加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 国家数据
    const countriesData = {
        "ཀྲུང་ཧྭ་མི་དམངས་སྤྱི་མཐུན་རྒྱལ་ཁབ།": {
            capital: "པེ་ཅིང་།",
            coordinates: [36.5, 105.0]  // 调整到甘肃和宁夏交界处，更好地居中于大陆
        },
        "ཧིན་རྡུ།": {
            capital: "ལྡི་ལི།",
            coordinates: [20.5937, 78.9629]
        }
    };

    // 国家名称映射函数
    function getCountryName(englishName) {
        // 如果是俄罗斯，返回 null
        if (englishName === 'Russia' || 
            englishName === 'Russian Federation' || 
            englishName.includes('RUS')) {
            return null;
        }

        const nameMap = {
            // === 东亚 ===
            'China': 'ཀྲུང་ཧྭ་མི་དམངས་སྤྱི་མཐུན་རྒྱལ་ཁབ།',
            'Mongolia': 'མང་གོལ།',
            'Japan': 'ཉི་ཧོང་།',
            'North Korea': 'བྱང་ཁོ་རེ་ཡ།',
            'South Korea': 'ལྷོ་ཁོ་རེཡ།',
            'Taiwan': 'ཀྲུང་གོ་ཐེ་ཝན།',
            'Hong Kong': 'ཀྲུང་གོ་ཧོང་གོང་།',
            'Macau': 'ཀྲུང་གོ་མཱ་ཁའོ།',

            // === 东南亚 ===
            'Vietnam': 'ཝི་ཏི་ནམ།',
            'Thailand': 'ཐའི་ལན།',
            'Myanmar': 'འབར་མ།',
            'Laos': 'ལའོ་སི།',
            'Cambodia': 'ཅམ་པོ་ཛ།',
            'Malaysia': 'མ་ལེ་ཞི་ཡ།',
            'Singapore': 'སིང་ག་པུར།',
            'Indonesia': 'ཨིན་རྡུ་ནི་ཞི་ཡ།',
            'Philippines': 'ཕི་ལི་པིན།',
            'Brunei': 'བྷུ་རུ་ནི།',
            'East Timor': 'ཤར་ཏི་མོར།',

            // === 南亚 ===
            'India': 'ཧིན་རྡུ།',
            'Pakistan': 'པ་ཀི་སི་ཐན།',
            'Bangladesh': 'བྷང་ལ་རྡེ་ཤི།',
            'Sri Lanka': 'སི་རི་ལང་ཀ།',
            'Nepal': 'བལ་ཡུལ།',
            'Bhutan': 'འབྲུག་ཡུལ།',
            'Maldives': 'མལ་དི་ཝེསི།',

            // === 中亚 ===
            'Kazakhstan': 'ཀ་ས་ཁི་སི་ཐན།',
            'Kyrgyzstan': 'ཀིར་གི་སི་སི་ཐན།',
            'Tajikistan': 'ཐ་ཇི་ཀི་སི་ཐན།',
            'Turkmenistan': 'ཐུར་ཀི་མེ་ནི་སི་ཐན།',
            'Uzbekistan': 'ཨུ་སི་བྷེ་ཀི་སི་ཐན།',

            // === 中东 ===
            'Iran': 'ཨི་རན།',
            'Iraq': 'ཨི་རག',
            'Syria': 'སི་རི་ཡ།',
            'Lebanon': 'ལེ་པ་ནོན།',
            'Israel': 'ཨི་སི་རལ།',
            'Jordan': 'ཇོར་ཏན།',
            'Saudi Arabia': 'སའུ་ཏི་ཨ་རབ།',
            'Yemen': 'ཡེ་མེན།',
            'Oman': 'ཨོ་མན།',
            'UAE': 'ཨ་རབ་ཨི་མི་རཊ།',
            'Qatar': 'ཁ་ཏར།',
            'Bahrain': 'བྷཱ་རེན།',
            'Kuwait': 'ཁུ་ཝེཏ།',

            // === 欧洲 ===
            'France': 'ཕ་རན་སི།',
            'Germany': 'འཇར་མན།',
            'United Kingdom': 'དབྱིན་ཇི།',
            'Italy': 'ཨི་ཏ་ལི།',
            'Spain': 'སི་པེན།',
            'Portugal': 'པོར་ཏུ་གྷལ།',
            'Greece': 'གྷི་རི་སི།',
            'Netherlands': 'ནེ་ཊི་ལན།',
            'Belgium': 'པེལ་ཇམ།',
            'Switzerland': 'སུད་སི།',
            'Austria': 'ཨོ་སི་ཐྲི་ཡ།',
            'Poland': 'པོ་ལན།',
            'Sweden': 'སུད་དען།',
            'Norway': 'ནོར་ཝེ།',
            'Finland': 'ཕིན་ལན།',
            'Denmark': 'ཌེན་མརྐ།',
            'Ireland': 'ཨར་ལན།',
            'Ukraine': 'ཡུ་ཀྲེན།',
            'Belarus': 'བྷེ་ལ་རུ་སུ།',
            'Romania': 'རོ་མ་ནི་ཡ།',
            'Bulgaria': 'པུལ་ག་རི་ཡ།',
            'Hungary': 'ཧང་ག་རི།',
            'Czech Republic': 'ཅེཀ',
            'Slovakia': 'སི་ལོ་ཝ་ཀི་ཡ།',

            // === 非洲 ===
            'Egypt': 'ཨི་ཇིབཊ།',
            'Libya': 'ལི་བི་ཡ།',
            'Tunisia': 'ཏུ་ནི་ཤི་ཡ།',
            'Algeria': 'ཨལ་ཇི་རི་ཡ།',
            'Morocco': 'མོ་རོ་ཀོ',
            'Sudan': 'སུ་དན།',
            'South Sudan': 'ལྷོ་སུ་དན།',
            'Ethiopia': 'ཨི་ཐི་ཡོ་པི་ཡ།',
            'Somalia': 'སོ་མ་ལི་ཡ།',
            'Kenya': 'ཁེན་ཉི་ཡ།',
            'Tanzania': 'ཏན་ཛ་ནི་ཡ།',
            'Uganda': 'ཡུ་གན་ཌ།',
            'Rwanda': 'རུ་ཝན་ཌ།',
            'Burundi': 'བུ་རུན་ཌི།',
            'Congo': 'ཀོང་གོ།',
            'Democratic Republic of the Congo': 'ཀོང་གོ་མི་དམངས་སྤྱི་མཐུན་རྒྱལ་ཁབ།',
            'Angola': 'ཨང་གོ་ལ།',
            'Zambia': 'ཛམ་བི་ཡ།',
            'Zimbabwe': 'ཛིམ་བྷབ་ཝེ།',
            'Mozambique': 'མོ་ཛམ་བིག',
            'Madagascar': 'མ་ད་གཱས་ཀར།',
            'South Africa': 'ལྷོ་ཨ་ཕི་རི་ཀ',

            // === 美洲 ===
            'United States': 'ཨ་མེ་རི་ཀ',
            'United States of America': 'ཨ་མེ་རི་ཀ',
            'USA': 'ཨ་མེ་རི་ཀ',
            'U.S.A.': 'ཨ་མེ་རི་ཀ',
            'US': 'ཨ་མེ་རི་ཀ',
            'Canada': 'ཁེ་ན་ཌ།',
            'Mexico': 'མེཀ་སི་ཀོ',
            'Brazil': 'བྷར་ཛིལ།',
            'Argentina': 'ཨར་གེན་ཐི་ན།',
            'Chile': 'ཅི་ལི།',
            'Peru': 'པེ་རུ།',
            'Colombia': 'ཁོ་ལོམ་བྷི་ཡ།',
            'Venezuela': 'ཝེ་ནེ་ཛུ་ཨེ་ལ།',
            'Ecuador': 'ཨི་ཁྭ་ཌོར།',
            'Bolivia': 'བྷོ་ལི་ཝི་ཡ།',
            'Paraguay': 'པ་ར་གུ་ཡེ།',
            'Uruguay': 'ཨུ་རུ་གུ་ཡེ།',
            'Guyana': 'གི་ཡ་ན།',
            'Suriname': 'སུ་རི་ནམ།',
            'French Guiana': 'ཕ་རན་སིའི་གི་ཡ་ན།',

            // === 大洋洲 ===
            'Australia': 'ཨོ་སི་ཐྲོ་ལི་ཡ།',
            'New Zealand': 'ནིའུ་ཛི་ལན།',
            'Papua New Guinea': 'པ་པུ་ཨ་ནིའུ་གི་ནི།',
            'Fiji': 'ཕི་ཇི།',
            'Solomon Islands': 'སོ་ལོ་མོན་གླིང་ཚོམ།',
            'Vanuatu': 'ཝ་ནུ་ཨ་ཏུ།',
            'New Caledonia': 'ནིའུ་ཁལ་ཌོ་ནི་ཡ།',
            'French Polynesia': 'ཕ་རན་སིའི་པོ་ལི་ནི་ཤི་ཡ།',

            // === 非洲 ===
            'Nigeria': 'ནི་ཇི་རི་ཡ།',
            'Ghana': 'ག་ན།',
            'Ivory Coast': 'ཨི་ཝོ་རི་ཁོ་སི་ཊི།',
            "Côte d'Ivoire": 'ཨི་ཝོ་རི་ཁོ་སི་ཊི།',
            'Senegal': 'སི་ནི་གྷལ།',
            'Mali': 'མ་ལི།',
            'Burkina Faso': 'བྷར་ཀི་ན་ཕ་སོ།',
            'Niger': 'ནི་ཇར།',
            'Chad': 'ཆད།',
            'Cameroon': 'ཀེ་མེ་རུན།',
            'Gabon': 'ག་བོན།',
            'Republic of the Congo': 'ཀོང་གོ',
            'Central African Republic': 'དབུས་ཨ་ཧི་རི་ཀ་སྤྱི་མཐུན་རྒྱལ་ཁབ།',

            // === 加勒比海地区 ===
            'Cuba': 'ཁུ་བ།',
            'Haiti': 'ཧེ་ཏི།',
            'Dominican Republic': 'ཌོ་མི་ནི་ཀན་སྤྱི་མཐུན་རྒྱལ་ཁབ།',
            'Jamaica': 'ཇ་མའི་ཀ',
            'Trinidad and Tobago': 'ཏྲི་ནི་ཌད་དང་ཏོ་བྷ་གོ',
            'Bahamas': 'བ་ཧ་མས།',
            'Barbados': 'བར་བ་ཌོས།',
            'Saint Lucia': 'སེནཊ་ལུ་ཤི་ཡ།',
            'Grenada': 'གྷི་རི་ན་ཌ།',
            'Antigua and Barbuda': 'ཨན་ཊི་གུ་དང་བར་བུ་ཌ།',
            'Saint Vincent and the Grenadines': 'སེནཊ་ཝིན་སེནཊ་དང་གྷི་རི་ན་ཌིནས།',
            'Saint Kitts and Nevis': 'སེནཊ་ཀིཊས་དང་ནེ་ཝིས།',
            'Dominica': 'ཌོ་མི་ནི་ཀ',

            // === 中美洲 ===
            'Guatemala': 'གུ་ཏི་མ་ལ།',
            'Belize': 'བྷེ་ལིཛ།',
            'El Salvador': 'ཨེལ་སལ་ཝ་ཌོར།',
            'Honduras': 'ཧོན་ཌུ་རས།',
            'Nicaragua': 'ནི་ཀ་ར་གུ་ཝ།',
            'Costa Rica': 'ཀོ་ས་ཊ་རི་ཀ',
            'Panama': 'པ་ན་མ།',

            // === 更多非洲国家 ===
            'Namibia': 'ན་མི་བྷི་ཡ།',
            'Botswana': 'བྷོ་ཚ་ཝ་ན།',
            'Malawi': 'མ་ལ་ཝི།',
            'Lesotho': 'ལེ་སོ་ཐོ།',
            'Swaziland': 'སི་ཝ་ཛི་ལནཌ།',
            'Eswatini': 'སི་ཝ་ཛི་ལནཌ།',
            'Gambia': 'གམ་བྷི་ཡ།',
            'Guinea': 'གི་ནི།',
            'Guinea-Bissau': 'གི་ནི་བྷི་སའོ།',
            'Sierra Leone': 'སི་ར་ལེ་ཨོན།',
            'Liberia': 'ལི་བེ་རི་ཡ།',
            'Togo': 'ཊོ་གོ།',
            'Benin': 'བྷེ་ནིན།',
            'Mauritania': 'མོ་རི་ཏ་ནི་ཡ།',
            'Western Sahara': 'ནུབ་ས་ཧ་ར།',
            'Equatorial Guinea': 'ཨི་ཁུ་ཊོ་རི་ཡལ་གི་ནི།',
            'Djibouti': 'ཇི་བུ་ཏི།',
            'Eritrea': 'ཨི་རི་ཏྲེ་ཡ།',
            'Comoros': 'ཁོ་མོ་རོ་སུ།',
            'Mauritius': 'མོ་རི་ཤས།',
            'Seychelles': 'སེ་ཤེལ་སུ།',
            'Cape Verde': 'ཁེབ་ཝར་ཌི།',
            'Cabo Verde': 'ཁེབ་ཝར་ཌི།',
            'São Tomé and Príncipe': 'སའོ་ཏོ་མེ་དང་པི་རིན་སི་པེ།',

            // === 中亚和高加索地区 ===
            'Kazakhstan': 'ཀ་ཛཁ་སི་ཐན།',
            'Uzbekistan': 'ཨུཛ་བེཀ་སི་ཐན།',
            'Kyrgyzstan': 'ཀིར་གིཛ་སི་ཐན།',
            'Tajikistan': 'ཐ་ཇི་ཀི་སི་ཐན།',
            'Turkmenistan': 'ཐུརཀ་མེ་ནི་སི་ཐན།',
            'Afghanistan': 'ཨཕ་ག་ནི་སི་ཐན།',
            'Azerbaijan': 'ཨ་ཛར་བཡི་ཇན།',
            'Georgia': 'ཇོར་ཇི་ཡ།',
            'Armenia': 'ཨར་མེ་ནི་ཡ།',

            // === 土耳其及周边 ===
            'Turkey': 'ཐུར་ཀི།',
            'Cyprus': 'སཡི་པ་རསི།',
            'Syria': 'སི་རི་ཡ།',
            'Lebanon': 'ལེ་བ་ནོན།',
            'Israel': 'དབྱི་སི་ར་ཨེལ།',
            'Palestine': 'པེ་ལེ་སི་ཐན།',
            'Jordan': 'ཇོར་ཌན།',
            'Iraq': 'ཨི་རག',
            'Kuwait': 'ཀུ་ཝེཊ།',
            'Saudi Arabia': 'སཱ་ཨུ་དི་ཨ་རབ།',
            'Yemen': 'ཡེ་མེན།',
            'Oman': 'ཨོ་མན།',
            'United Arab Emirates': 'ཨ་རབ་ཨི་མི་རཊ།',
            'Qatar': 'ཀ་ཏར།',
            'Bahrain': 'བྷཱ་རེན།',
            'Iran': 'ཨི་རན།'
        };
        
        return nameMap[englishName];
    }

    // 定义莫兰迪色系
    const morandiColors = [
        '#A5B1AA', // 灰绿色
        '#E6D1C0', // 浅粉色
        '#C4B6B6', // 灰褐色
        '#A8B4B8'  // 灰蓝色
    ];

    // 创建颜色分配函数
    function assignColors(features) {
        const colorAssignments = new Map();
        const adjacencyList = new Map();

        // 构建邻接表
        features.forEach(feature => {
            const countryName = feature.properties.name;
            adjacencyList.set(countryName, new Set());
        });

        // 填充邻接关系
        features.forEach(feature => {
            const countryName = feature.properties.name;
            features.forEach(neighbor => {
                const neighborName = neighbor.properties.name;
                if (countryName !== neighborName && areCountriesAdjacent(feature, neighbor)) {
                    adjacencyList.get(countryName).add(neighborName);
                    adjacencyList.get(neighborName).add(countryName);
                }
            });
        });

        // 为中国分配颜色
        const chinaColor = morandiColors[0];  // 使用第一个颜色作为中国的颜色

        // 为每个国家分配颜色
        features.forEach(feature => {
            const countryName = feature.properties.name;
            // 如果是中国、台湾、香港或澳门，使用相同的颜色
            if (countryName === 'China' || 
                countryName === 'Taiwan' || 
                countryName === 'Hong Kong' || 
                countryName === 'Macau') {
                colorAssignments.set(countryName, chinaColor);
            } else if (!colorAssignments.has(countryName)) {
                const usedColors = new Set();
                adjacencyList.get(countryName).forEach(neighbor => {
                    if (colorAssignments.has(neighbor)) {
                        usedColors.add(colorAssignments.get(neighbor));
                    }
                });
                
                // 选择第一个未被邻国使用的颜色
                const availableColor = morandiColors.find(color => !usedColors.has(color));
                colorAssignments.set(countryName, availableColor || morandiColors[1]);  // 使用第二个颜色作为默认
            }
        });

        return colorAssignments;
    }

    // 检查两个国家是否相邻
    function areCountriesAdjacent(country1, country2) {
        // 简化版的相邻检查：检查边界框是否重叠
        const bbox1 = turf.bbox(country1);
        const bbox2 = turf.bbox(country2);
        
        return !(bbox1[2] < bbox2[0] || bbox1[0] > bbox2[2] ||
                 bbox1[3] < bbox2[1] || bbox1[1] > bbox2[3]);
    }

    // 加载世界地图边界数据
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(response => response.json())
        .then(worldData => {
            const colorAssignments = assignColors(worldData.features);
            const countryLabels = new Map();

            worldData.features.forEach(feature => {
                const countryName = getCountryName(feature.properties.name);
                
                // 创建国家边界
                const boundary = L.geoJSON(feature.geometry, {
                    style: {
                        color: '#666',
                        weight: 1,
                        fillColor: colorAssignments.get(feature.properties.name) || morandiColors[0],
                        fillOpacity: 0.6
                    }
                }).addTo(map);

                if (countryName) {
                    // 计算国家面积和边界
                    const area = turf.area(feature.geometry);
                    const bounds = boundary.getBounds();
                    
                    // 创建标签层
                    const labelDiv = L.divIcon({
                        className: 'country-name-container',
                        html: `<div class="country-name">${countryName}</div>`,
                        iconSize: [200, 50],  // 初始大小
                        iconAnchor: [100, 25] // 居中锚点
                    });

                    const label = L.marker(bounds.getCenter(), {
                        icon: labelDiv,
                        interactive: false // 禁用鼠标事件
                    });

                    // 存储国家信息
                    countryLabels.set(countryName, {
                        area: area,
                        bounds: bounds,
                        label: label
                    });
                }
            });

            // 处理缩放事件
            map.on('zoomend moveend', () => {
                const currentZoom = map.getZoom();
                
                countryLabels.forEach((data, countryName) => {
                    const { area, bounds, label } = data;
                    
                    // 计算显示阈值（面积越大，越早显示）
                    const showThreshold = Math.max(MIN_ZOOM_LEVEL, 
                        8 - Math.log10(area) * 0.5);
                    
                    // 计算字体大小（基于面积和当前缩放级别）
                    const baseFontSize = Math.sqrt(area) * BASE_FONT_SCALE;
                    const zoomFactor = Math.pow(2, currentZoom - MIN_ZOOM_LEVEL);
                    const fontSize = Math.max(6, Math.min(24, baseFontSize * zoomFactor * 0.5));
                    
                    if (currentZoom >= showThreshold) {
                        // 更新标签样式
                        const icon = label.getIcon();
                        icon.options.html = `<div class="country-name" style="font-size: ${fontSize}px;">${countryName}</div>`;
                        label.setIcon(icon);
                        
                        if (!map.hasLayer(label)) {
                            label.addTo(map);
                        }
                    } else {
                        if (map.hasLayer(label)) {
                            map.removeLayer(label);
                        }
                    }
                });
            });

            // 触发初始缩放事件
            map.fire('zoomend');
        })
        .catch(error => {
            console.error('Error loading world data:', error);
        });
}); 