// 创建地图实例
const map = L.map('map', {
    center: [30, 0],
    zoom: 3,
    worldCopyJump: true,  // 允许地图在日期变更线处复制
    maxBounds: [[-90, -180], [90, 180]]  // 限制地图范围
});

// 添加无标签的 CartoDB 底图
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 2,
    noWrap: false,  // 允许地图在经度方向上重复
    bounds: [[-90, -180], [90, 180]]
}).addTo(map);

// 添加自定义 CSS 来修改地图标签样式
const style = document.createElement('style');
style.textContent = `
    .country-label {
        font-family: "Tibetan Machine Uni", "Microsoft Himalaya", serif;
        font-size: 18px;
        font-weight: bold;
        color: #000;
        background: rgba(255, 255, 255, 0.8);
        padding: 3px 8px;
        border-radius: 4px;
        border: 2px solid #666;
        z-index: 1000;
    }

    .capital-label {
        font-family: "Tibetan Machine Uni", "Microsoft Himalaya", serif;
        font-size: 16px;
        font-weight: bold;
        color: #333;
        background: rgba(255, 255, 255, 0.8);
        padding: 2px 6px;
        border-radius: 3px;
        border: 1px solid #666;
        z-index: 900;
    }

    .city-label {
        font-family: "Tibetan Machine Uni", "Microsoft Himalaya", serif;
        font-size: 14px;
        color: #444;
        background: rgba(255, 255, 255, 0.8);
        padding: 1px 4px;
        border-radius: 2px;
        border: 1px solid #999;
        z-index: 800;
    }
`;
document.head.appendChild(style);

// 添加经纬度显示
map.on('mousemove', function(e) {
    document.getElementById('coordinates').innerHTML = 
        `ཞེང་ཐིག: ${e.latlng.lat.toFixed(4)}° | གཞུང་ཐིག: ${e.latlng.lng.toFixed(4)}°`;
});

// 添加国际日期变更线
const dateLineCoords = [
    [85, 180],
    [-85, 180]
];

const dateLine = L.polyline(dateLineCoords, {
    color: 'red',
    weight: 2,
    dashArray: '5, 5'
}).addTo(map);

// 导出 map 变量
window.map = map; 