/**
 * 阿里大环线离线路书助手 - 行程数据 v3.0
 * 包含 16 天行程、冈仁波齐转山、CheckList、应急信息
 * 所有数据内置于 HTML 中，无网络依赖
 */

// ============================================================
// 16 天行程数据
// ============================================================
const TRIP_DATA = [
  {
    id: "day01",
    day: 1,
    date: "2026-06-19",
    title: "到达拉萨，适应高原",
    route: "拉萨贡嘎机场/拉萨火车站 → 拉萨市区（城关区）",
    type: "rest",
    distance: "市区短途，约5–10 km",
    duration: "宽松适应，全天自由安排",
    startTime: "全天到达即可，不赶时间",
    sleepPlace: "拉萨市区酒店（海拔 3650 m）",
    sleepAltitude: 3650,
    maxAltitude: 3700,
    riskLevel: "low",
    risks: ["初到高原身体需适应","不宜剧烈运动","早晚温差大"],
    mustDo: ["多喝温水","好好休息、不赶路","到达后慢走适应","确认边防证已办好","检查次日行程安排"],
    avoid: ["不要洗澡（尤其是热水澡）","不要饮酒","不要剧烈运动","不要熬夜","不要吃太饱"],
    clothing: "长袖T恤 + 薄外套/防晒衣，早晚加一件冲锋衣外壳",
    fuelReminder: "拉萨市区加油站充足，无需担心",
    photoSpot: "布达拉宫广场、八廓街",
    backupPlan: "如严重高反不适，在拉萨多休整 1 天，延迟 Day 3 出发",
    notes: ""
  },
  {
    id: "day02",
    day: 2,
    date: "2026-06-20",
    title: "拉萨适应，办证/采购/检查装备",
    route: "拉萨市区内活动（城关区 + 堆龙德庆区）",
    type: "rest",
    distance: "市区短途，约10–20 km",
    duration: "全天弹性安排",
    startTime: "上午 9:00–10:00 出门即可",
    sleepPlace: "拉萨市区酒店（海拔 3650 m）",
    sleepAltitude: 3650,
    maxAltitude: 3800,
    riskLevel: "low",
    risks: ["适应期不宜过度活动","注意防晒"],
    mustDo: ["确认边防证（阿里地区/日喀则/山南）","补充采购物资（水、干粮、氧气、药品）","检查车辆（租车/包车确认）","下载离线地图（高德/百度离线包）","确认沿途住宿预订","现金取款（阿里地区ATM少）"],
    avoid: ["不要剧烈走动","不要忽略车辆检查","不要只依赖电子支付"],
    clothing: "长袖 + 薄外套，白天温暖，早晚需加衣",
    fuelReminder: "拉萨市区加油方便，出发前加满油",
    photoSpot: "大昭寺、八廓街转经道",
    backupPlan: "如边防证未办好，延迟一天出发",
    notes: ""
  },
  {
    id: "day03",
    day: 3,
    date: "2026-06-21",
    title: "拉萨 → 羊卓雍措（羊湖）→ 日喀则",
    route: "拉萨 → 曲水 → 羊卓雍措（羊湖）→ 浪卡子 → 江孜 → 日喀则",
    type: "driving",
    distance: "约360 km，驾车约7–8小时",
    duration: "7–8 小时（含游览停留）",
    startTime: "07:00–07:30 出发",
    sleepPlace: "日喀则市区酒店（海拔 3850 m）",
    sleepAltitude: 3850,
    maxAltitude: 5039,
    riskLevel: "medium",
    risks: ["翻越岗巴拉山口（约5039m）","长距离驾驶","弯道多","高反风险增加"],
    mustDo: ["出发前加满油","携带充足水和干粮","羊湖观景台停留拍照","注意限速和弯道","到达日喀则后休息适应"],
    avoid: ["不要在羊湖高海拔处奔跑","不要疲劳驾驶","不要赶夜路"],
    clothing: "冲锋衣 + 抓绒，山口风大温度低，山下较暖",
    fuelReminder: "出发前加满油，浪卡子有加油站但间隔远，建议见到即加",
    photoSpot: "羊卓雍措观景台、卡若拉冰川远眺、江孜宗山古堡",
    backupPlan: "如高反严重，可在浪卡子或江孜提前住宿，次日再赶路",
    notes: ""
  },
  {
    id: "day04",
    day: 4,
    date: "2026-06-22",
    title: "日喀则 → 拉孜 → 萨嘎",
    route: "日喀则 → 拉孜 → 昂仁 → 萨嘎",
    type: "driving",
    distance: "约450 km，驾车约8–9小时",
    duration: "8–9 小时",
    startTime: "07:00 前出发",
    sleepPlace: "萨嘎县城（海拔 4500 m）",
    sleepAltitude: 4500,
    maxAltitude: 5089,
    riskLevel: "medium",
    risks: ["海拔明显升高","住宿海拔4500m高反风险","长距离驾驶","拉孜至萨嘎段补给少"],
    mustDo: ["日喀则出发前加满油","拉孜检查加油","多喝水防高反","到达后少活动早休息","注意身体反应"],
    avoid: ["不要在拉孜至萨嘎段高速行驶","不要忽略高反症状","不要忘记补水"],
    clothing: "冲锋衣 + 抓绒/薄羽绒，海拔升高温度明显降低",
    fuelReminder: "⚠️ 拉孜必须加满油！萨嘎前补给点极少",
    photoSpot: "拉孜318国道5000km纪念碑、昂仁错",
    backupPlan: "如严重不适，可在昂仁或桑桑镇附近休整",
    notes: ""
  },
  {
    id: "day05",
    day: 5,
    date: "2026-06-23",
    title: "萨嘎 → 仲巴 → 玛旁雍错/拉昂错 → 塔钦",
    route: "萨嘎 → 仲巴 → 帕羊 → 霍尔 → 玛旁雍错 → 拉昂错（鬼湖）→ 塔钦",
    type: "driving",
    distance: "约500 km，驾车约9–10小时",
    duration: "9–10 小时",
    startTime: "06:30–07:00 出发",
    sleepPlace: "塔钦/冈仁波齐脚下（海拔 4660 m）",
    sleepAltitude: 4660,
    maxAltitude: 5211,
    riskLevel: "high",
    risks: ["长距离驾驶（本程最长）","翻越马攸木拉山口（5211m）","住宿海拔高（4660m）","进入阿里地区后补给更少","风大且天气多变"],
    mustDo: ["萨嘎出发前必须加满油","仲巴/帕羊务必补油","路过玛旁雍错停留拍照","到达塔钦后确认转山安排","确认背夫/向导/住宿"],
    avoid: ["不要错过仲巴加油","不要在玛旁雍错高海拔处停留过久","不要夜路驾驶","不要到达后剧烈活动"],
    clothing: "冲锋衣 + 抓绒/薄羽绒 + 防风帽，阿里地区风大温低",
    fuelReminder: "⚠️ 萨嘎加满！仲巴必补油！帕羊见到加油站就加！阿里段加油站极少",
    photoSpot: "玛旁雍错、拉昂错（鬼湖）、冈仁波齐远眺",
    backupPlan: "如到达塔钦时身体不适，多休息一天再进行转山",
    notes: ""
  },
  {
    id: "day06",
    day: 6,
    date: "2026-06-24",
    title: "塔钦休整，转山准备",
    route: "塔钦村内活动（冈仁波齐山脚）",
    type: "rest",
    distance: "村内短途，约2–5 km",
    duration: "全天休整、准备",
    startTime: "自然醒，白天准备即可",
    sleepPlace: "塔钦住宿（海拔 4660 m）",
    sleepAltitude: 4660,
    maxAltitude: 4700,
    riskLevel: "medium",
    risks: ["住宿海拔高","明日转山需充分准备","天气不确定性"],
    mustDo: ["确认转山装备（逐项检查CheckList）","安排背夫/向导","购买转山门票","准备转山干粮和水","轻装打包（只带转山必需品）","确认明日出发时间","预留行李寄存处"],
    avoid: ["不要忽视装备检查","不要携带过多物品","不要饮酒","不要熬夜"],
    clothing: "冲锋衣 + 抓绒/薄羽绒，塔钦风大",
    fuelReminder: "塔钦有简易加油站/私油，建议提前确认",
    photoSpot: "冈仁波齐南面、塔钦村全景",
    backupPlan: "如身体不适，可推迟转山或在塔钦原地休整等队友",
    notes: ""
  },
  {
    id: "day07",
    day: 7,
    date: "2026-06-25",
    title: "冈仁波齐转山 D1",
    route: "塔钦 → 经幡广场 → 曲古寺 → 止热寺",
    type: "trekking",
    distance: "约20 km",
    duration: "6–8 小时",
    startTime: "08:00 前出发",
    sleepPlace: "止热寺/附近简易住宿（海拔 5000 m）",
    sleepAltitude: 5000,
    maxAltitude: 5200,
    riskLevel: "high",
    risks: ["高海拔徒步","风大","住宿简陋/海拔极高","补给弱","可能出现高反症状"],
    mustDo: ["慢走、保持匀速","轻装、让背夫背大件","带头灯","确认背夫联系方式","多喝水","走不动就休息"],
    avoid: ["不要走太快","不要在高海拔长时间停留","不要饮酒","不要逞强","不要天黑后赶路"],
    clothing: "冲锋衣 + 抓绒/薄羽绒 + 防风帽 + 手套，山口风极大",
    fuelReminder: "转山期间无车辆，不涉及加油",
    photoSpot: "经幡广场、冈仁波齐北面、止热寺远眺",
    backupPlan: "如身体不适，立即停止转山，原路返回或由背夫协助返回塔钦",
    notes: ""
  },
  {
    id: "day08",
    day: 8,
    date: "2026-06-26",
    title: "冈仁波齐转山 D2（最艰难）",
    route: "止热寺 → 天葬台 → 卓玛拉山口（5630m）→ 慈悲湖/托吉错 → 祖楚寺",
    type: "trekking",
    distance: "约22 km",
    duration: "8–10 小时",
    startTime: "06:00–06:30 出发",
    sleepPlace: "祖楚寺附近简易住宿（海拔 4800 m）",
    sleepAltitude: 4800,
    maxAltitude: 5630,
    riskLevel: "critical",
    risks: ["⚠️ 全程最难一天","翻越卓玛拉山口5630m","高反风险极高","下午天气易变","下坡碎石多伤膝盖","体力消耗极大"],
    mustDo: ["天没亮就出发","翻山口前补充能量","卓玛拉山口不要长时间停留","登山杖+护膝必备","下午2点前必须翻过山口","保持与同伴的联系"],
    avoid: ["不要在卓玛拉山口停留超过15分钟","不要下午翻山口","不要不用登山杖","不要脱离同伴单独行动","出现严重高反不要硬撑"],
    clothing: "冲锋衣 + 厚抓绒/羽绒 + 防风帽 + 手套 + 护膝，山口极冷风极大",
    fuelReminder: "转山期间无车辆",
    photoSpot: "卓玛拉山口、慈悲湖、托吉错",
    backupPlan: "⚠️ 如翻山口前出现严重高反，必须下撤返回止热寺方向，不要强行翻山口",
    notes: ""
  },
  {
    id: "day09",
    day: 9,
    date: "2026-06-27",
    title: "冈仁波齐转山 D3，返回塔钦",
    route: "祖楚寺 → 宗堆 → 塔钦",
    type: "trekking",
    distance: "约10 km",
    duration: "3–4 小时",
    startTime: "08:00–09:00 出发",
    sleepPlace: "塔钦住宿（海拔 4660 m）",
    sleepAltitude: 4660,
    maxAltitude: 4800,
    riskLevel: "medium",
    risks: ["体力透支后恢复期","膝盖/脚踝损伤","脱水"],
    mustDo: ["走得慢、不赶时间","检查膝盖和脚趾（水泡）","回塔钦后大量补水","好好休息、补充营养","确认次日行程"],
    avoid: ["不要当天继续长途赶路","不要忽视身体恢复","不要忽略拉伸"],
    clothing: "冲锋衣 + 抓绒，下山后换干衣",
    fuelReminder: "回塔钦后确认车辆和油量",
    photoSpot: "转山归来合影、冈仁波齐告别",
    backupPlan: "如膝盖受伤，在塔钦多休整一天",
    notes: ""
  },
  {
    id: "day10",
    day: 10,
    date: "2026-06-28",
    title: "塔钦 → 札达土林 → 古格王朝遗址",
    route: "塔钦 → 门士 → 巴尔兵站 → 札达土林 → 札达县城 → 古格王朝遗址",
    type: "driving",
    distance: "约280 km，驾车约5–6小时",
    duration: "5–6 小时（含游览）",
    startTime: "08:00–09:00 出发",
    sleepPlace: "札达县城（海拔 3700 m）",
    sleepAltitude: 3700,
    maxAltitude: 5100,
    riskLevel: "medium",
    risks: ["转山后体力未完全恢复","部分路段弯急坡陡","土林区域道路窄"],
    mustDo: ["转山后检查身体状态","加满油再出发","古格王朝看日落","札达土林沿途拍照"],
    avoid: ["不要疲劳驾驶","不要在土林区域走夜路","不要忽略加油"],
    clothing: "冲锋衣 + 长袖，札达海拔降低白天较暖",
    fuelReminder: "塔钦出发前加满油，巴尔兵站可补油",
    photoSpot: "札达土林全景、古格王朝遗址日落",
    backupPlan: "如体力不支，可在门士乡简休后继续",
    notes: ""
  },
  {
    id: "day11",
    day: 11,
    date: "2026-06-29",
    title: "札达 → 狮泉河（阿里首府）",
    route: "札达县城 → 那不如 → 阿里昆莎机场方向 → 狮泉河镇",
    type: "driving",
    distance: "约250 km，驾车约5–6小时",
    duration: "5–6 小时",
    startTime: "08:00–09:00 出发",
    sleepPlace: "狮泉河镇（海拔 4280 m）",
    sleepAltitude: 4280,
    maxAltitude: 4900,
    riskLevel: "medium",
    risks: ["部分路段为土路/砂石路","进入阿里北部","天气变化快"],
    mustDo: ["狮泉河补充物资","检查车辆状况","确认北线住宿","补给充足再出发"],
    avoid: ["不要错过狮泉河的补给机会","不要在土路高速行驶"],
    clothing: "冲锋衣 + 抓绒，狮泉河风大",
    fuelReminder: "狮泉河有正规加油站，务必加满！北线加油点更少",
    photoSpot: "狮泉河全景、阿里昆莎机场方向风光",
    backupPlan: "如车辆有异常，在狮泉河多停留检修",
    notes: ""
  },
  {
    id: "day12",
    day: 12,
    date: "2026-06-30",
    title: "狮泉河 → 革吉 → 改则（阿里北线）",
    route: "狮泉河 → 革吉 → 改则",
    type: "driving",
    distance: "约480 km，驾车约8–9小时",
    duration: "8–9 小时",
    startTime: "07:00 前出发",
    sleepPlace: "改则县城（海拔 4430 m）",
    sleepAltitude: 4430,
    maxAltitude: 4900,
    riskLevel: "high",
    risks: ["阿里北线长距离荒原路段","补给极少","道路条件一般","野生动物穿行","救援困难"],
    mustDo: ["狮泉河加满油（必须！）","携带充足食物和水","革吉检查加油","注意野生动物（藏羚羊/藏野驴）","控制车速"],
    avoid: ["不要夜间驾驶","不要错过革吉加油","不要开太快（砂石路+野生动物）","不要脱离主路"],
    clothing: "冲锋衣+抓绒/薄羽绒，北线荒原风极大",
    fuelReminder: "⚠️ 狮泉河加满！革吉必补油！北线油站极少，间隔200km+",
    photoSpot: "阿里北线荒原、藏羚羊群、藏野驴",
    backupPlan: "如车辆故障，联系狮泉河或改则方向救援",
    notes: ""
  },
  {
    id: "day13",
    day: 13,
    date: "2026-07-01",
    title: "改则 → 措勤（一错再错之路）",
    route: "改则 → 洞错 → 达瓦错 → 措勤",
    type: "driving",
    distance: "约350 km，驾车约7–8小时",
    duration: "7–8 小时",
    startTime: "07:30–08:00 出发",
    sleepPlace: "措勤县城（海拔 4610 m）",
    sleepAltitude: 4610,
    maxAltitude: 5000,
    riskLevel: "high",
    risks: ["北线荒原继续","土路/砂石路","海拔持续在4500m+","补给点极少"],
    mustDo: ["改则出发前加满油","携带充足补给","司机轮换或定时休息","注意路况变化"],
    avoid: ["不要疲劳驾驶","不要偏离主路","不要错过加油机会"],
    clothing: "冲锋衣+抓绒/薄羽绒，荒原风大温度低",
    fuelReminder: "⚠️ 改则加满油！洞错方向加油站极度稀少",
    photoSpot: "达瓦错、扎日南木错方向风光",
    backupPlan: "措勤住宿条件有限，做好心理准备",
    notes: ""
  },
  {
    id: "day14",
    day: 14,
    date: "2026-07-02",
    title: "措勤 → 尼玛 → 班戈",
    route: "措勤 → 达则错 → 尼玛 → 色林错 → 班戈",
    type: "driving",
    distance: "约500 km，驾车约9–10小时",
    duration: "9–10 小时",
    startTime: "06:30–07:00 出发",
    sleepPlace: "班戈县城（海拔 4720 m）",
    sleepAltitude: 4720,
    maxAltitude: 5000,
    riskLevel: "high",
    risks: ["⚠️ 本程最长距离之一","连续高海拔荒原","色林错附近风极大","补给点极稀少","住宿海拔极高"],
    mustDo: ["措勤加满油","尼玛必须补油","携带充足食物和水","注意色林错横风","控制车速防野生动物"],
    avoid: ["不要夜间驾驶","不要疲劳驾驶","不要错过尼玛加油","不要忽略防风保暖"],
    clothing: "冲锋衣+抓绒/羽绒，色林错区域风极大注意防风",
    fuelReminder: "⚠️ 措勤加满！尼玛必补油！班戈前加油站极少！",
    photoSpot: "色林错（西藏最大湖）、达则错风光",
    backupPlan: "如体力或油量不足，可在尼玛提前住宿",
    notes: ""
  },
  {
    id: "day15",
    day: 15,
    date: "2026-07-03",
    title: "班戈 → 纳木错/那根拉山口 → 拉萨",
    route: "班戈 → 纳木错 → 那根拉山口（5190m）→ 当雄 → 羊八井 → 拉萨",
    type: "driving",
    distance: "约380 km，驾车约7–8小时",
    duration: "7–8 小时",
    startTime: "07:00–07:30 出发",
    sleepPlace: "拉萨市区酒店（海拔 3650 m）",
    sleepAltitude: 3650,
    maxAltitude: 5190,
    riskLevel: "medium",
    risks: ["那根拉山口海拔5190m","纳木错景区人多车多","下山弯道多注意安全","长时间驾驶后疲劳"],
    mustDo: ["那根拉山口短暂停留拍照","纳木错景区游览","当雄/羊八井可补油","回到拉萨后好好休息"],
    avoid: ["不要在那根拉山口长时间停留（风大缺氧）","不要疲劳驾驶","不要赶夜路"],
    clothing: "冲锋衣+抓绒，山口风大，回拉萨后气温回升",
    fuelReminder: "班戈加满油，当雄有正规加油站",
    photoSpot: "纳木错、那根拉山口、念青唐古拉山远眺",
    backupPlan: "如时间太晚，可在当雄住宿，次日返回拉萨",
    notes: ""
  },
  {
    id: "day16",
    day: 16,
    date: "2026-07-04",
    title: "拉萨返程",
    route: "拉萨市区 → 贡嘎机场/火车站",
    type: "rest",
    distance: "市区到机场约60 km",
    duration: "根据航班/火车时间安排",
    startTime: "根据交通工具时间提前出发",
    sleepPlace: "返程，无住宿",
    sleepAltitude: 0,
    maxAltitude: 3700,
    riskLevel: "low",
    risks: ["注意航班/火车时间","市区到机场需预留充足时间"],
    mustDo: ["提前2小时到达机场","确认行李托运","归还租车（如自驾）","和同伴告别合影"],
    avoid: ["不要赶时间","不要忘记身份证件"],
    clothing: "根据返程目的地选择衣物",
    fuelReminder: "拉萨市区加油方便",
    photoSpot: "返程沿途最后的高原风光",
    backupPlan: "如航班延误，拉萨市区住宿方便",
    notes: ""
  }
];

// ============================================================
// 冈仁波齐转山数据
// ============================================================
const KORA_DATA = {
  overview: {
    title: "冈仁波齐外圈转山",
    type: "外圈转山（Kora）",
    suggestedDays: "3 天",
    totalDistance: "约 52 km",
    highestPoint: "卓玛拉山口，约 5,630 m",
    startEnd: "塔钦（Darchen）→ 塔钦",
    riskLevel: "high",
    risks: ["高反","低温","大风","失温","体力透支","下坡伤膝盖","补给弱","救援困难"],
    description: "冈仁波齐转山是藏传佛教最重要的朝圣路线之一，外圈全程约52公里。建议分3天完成，以适应高海拔、降低体力消耗和风险。"
  },
  days: [
    {
      day: "转山 D1",
      title: "塔钦 → 经幡广场 → 曲古寺 → 止热寺",
      distance: "约 20 km",
      duration: "6–8 小时",
      sleepPlace: "止热寺/附近简易住宿",
      sleepAltitude: 5000,
      maxAltitude: 5200,
      supplies: "经幡广场有茶馆，曲古寺有简易补给",
      risks: ["高海拔徒步初段","住宿海拔极高（5000m）","风大","晚间温度极低"],
      gear: ["登山杖","头灯","保温杯","冲锋衣","抓绒/薄羽绒","防风帽","手套","雨衣","能量食品"],
      notes: [
        "第一天以上升为主，路况相对好走",
        "慢走适应，不要赶速度",
        "止热寺住宿条件简陋，做好心理准备",
        "建议天黑前到达住宿点"
      ]
    },
    {
      day: "转山 D2",
      title: "止热寺 → 天葬台 → 卓玛拉山口 → 慈悲湖 → 祖楚寺",
      distance: "约 22 km",
      duration: "8–10 小时",
      sleepPlace: "祖楚寺附近简易住宿",
      sleepAltitude: 4800,
      maxAltitude: 5630,
      supplies: "天葬台附近有简易补给点",
      risks: ["⚠️ 全程最难一天","卓玛拉山口海拔5630m","下午天气易变","下坡碎石极多","体力消耗极大","失温风险高"],
      gear: ["登山杖（必带！）","护膝（必带！）","头灯","保温杯","冲锋衣","厚羽绒","防风帽","手套","雨衣","能量食品","氧气"],
      notes: [
        "⚠️ 第二天是全程最难的一天！",
        "卓玛拉山口（5630m）不要长时间停留",
        "下午天气容易变差，务必上午翻过山口",
        "下坡碎石多，必须使用登山杖和护膝",
        "出现严重高反症状必须停止上升并下撤",
        "建议天没亮就出发（约6:00）"
      ]
    },
    {
      day: "转山 D3",
      title: "祖楚寺 → 宗堆 → 塔钦",
      distance: "约 10 km",
      duration: "3–4 小时",
      sleepPlace: "塔钦住宿",
      sleepAltitude: 4660,
      maxAltitude: 4800,
      supplies: "沿途有简易茶馆",
      risks: ["体力透支恢复期","膝盖/脚踝损伤","脱水"],
      gear: ["登山杖","防晒","水","少量干粮"],
      notes: [
        "不建议当天继续长途赶路",
        "回塔钦后休整、补水、观察身体",
        "检查膝盖、脚趾、水泡等",
        "第三天相对轻松，但仍不可大意"
      ]
    }
  ],
  // 转山装备清单
  gearChecklist: [
    { id: "kora_gear_01", name: "登山杖（双杖）", required: true },
    { id: "kora_gear_02", name: "护膝", required: true },
    { id: "kora_gear_03", name: "头灯（备用电池）", required: true },
    { id: "kora_gear_04", name: "保温杯（热水）", required: true },
    { id: "kora_gear_05", name: "冲锋衣（防风防水）", required: true },
    { id: "kora_gear_06", name: "抓绒/薄羽绒", required: true },
    { id: "kora_gear_07", name: "防风帽", required: true },
    { id: "kora_gear_08", name: "手套（保暖+防水）", required: true },
    { id: "kora_gear_09", name: "雨衣（分体式更好）", required: true },
    { id: "kora_gear_10", name: "能量食品（巧克力/坚果/能量棒）", required: true },
    { id: "kora_gear_11", name: "现金（转山路途无电子支付）", required: true },
    { id: "kora_gear_12", name: "身份证/边防证", required: true },
    { id: "kora_gear_13", name: "便携氧气瓶", required: true },
    { id: "kora_gear_14", name: "常用药（止痛/肠胃/感冒/高原安）", required: true },
    { id: "kora_gear_15", name: "充电宝（大容量）", required: true },
    { id: "kora_gear_16", name: "垃圾袋", required: true },
    { id: "kora_gear_17", name: "湿巾/纸巾", required: true },
    { id: "kora_gear_18", name: "睡袋内胆/薄睡袋", required: false }
  ],
  // 下撤判断
  descentWarning: {
    title: "下撤判断 — 是否继续转山？",
    intro: "如出现以下任一情况，应停止上升并考虑立即下撤：",
    symptoms: [
      "持续严重头痛（休息后不缓解）",
      "呕吐（不止一次）",
      "走路不稳、失去平衡",
      "呼吸困难（休息时也喘）",
      "意识模糊、反应迟钝",
      "嘴唇发紫（血氧过低）",
      "咳嗽胸闷（可能高原肺水肿）",
      "明显失温（发抖不止、肢体僵硬）",
      "同伴无法正常交流"
    ],
    action: "停止上升，立即休息和保暖，吸氧！联系救援或由背夫协助下撤。不要继续转山或赶路。安全第一，山永远在。"
  }
};

// ============================================================
// CheckList 数据
// ============================================================
const CHECKLIST_DATA = {
  byCategory: [
    {
      category: "证件",
      items: [
        { id: "cl_doc_01", name: "身份证", required: true },
        { id: "cl_doc_02", name: "边防证（阿里/日喀则/山南）", required: true },
        { id: "cl_doc_03", name: "驾驶证", required: true },
        { id: "cl_doc_04", name: "行驶证", required: true },
        { id: "cl_doc_05", name: "保险单（旅行/车辆）", required: true },
        { id: "cl_doc_06", name: "现金（阿里地区ATM少）", required: true },
        { id: "cl_doc_07", name: "银行卡", required: false }
      ]
    },
    {
      category: "衣物",
      items: [
        { id: "cl_cloth_01", name: "冲锋衣（防风防水）", required: true },
        { id: "cl_cloth_02", name: "抓绒衣", required: true },
        { id: "cl_cloth_03", name: "薄羽绒服", required: true },
        { id: "cl_cloth_04", name: "速干衣（2–3件）", required: true },
        { id: "cl_cloth_05", name: "保暖帽/防风帽", required: true },
        { id: "cl_cloth_06", name: "手套（保暖+防水）", required: true },
        { id: "cl_cloth_07", name: "保暖内衣/秋衣", required: true },
        { id: "cl_cloth_08", name: "徒步鞋/登山鞋", required: true },
        { id: "cl_cloth_09", name: "厚袜子（多双）", required: true },
        { id: "cl_cloth_10", name: "遮阳帽/防晒面巾", required: true },
        { id: "cl_cloth_11", name: "太阳镜/墨镜", required: true },
        { id: "cl_cloth_12", name: "雨衣", required: true }
      ]
    },
    {
      category: "转山装备",
      items: [
        { id: "cl_kora_01", name: "登山杖（双杖）", required: true },
        { id: "cl_kora_02", name: "护膝", required: true },
        { id: "cl_kora_03", name: "头灯（备用电池）", required: true },
        { id: "cl_kora_04", name: "保温杯", required: true },
        { id: "cl_kora_05", name: "雨衣（分体式更好）", required: true },
        { id: "cl_kora_06", name: "能量食品", required: true },
        { id: "cl_kora_07", name: "睡袋内胆", required: false },
        { id: "cl_kora_08", name: "防水袋（保护电子设备）", required: true }
      ]
    },
    {
      category: "药品/高反",
      items: [
        { id: "cl_med_01", name: "便携氧气瓶（多瓶）", required: true },
        { id: "cl_med_02", name: "个人常用药", required: true },
        { id: "cl_med_03", name: "肠胃药（黄连素/蒙脱石散）", required: true },
        { id: "cl_med_04", name: "止痛药（布洛芬）", required: true },
        { id: "cl_med_05", name: "高原安/红景天/诺迪康", required: true },
        { id: "cl_med_06", name: "葡萄糖口服液", required: true },
        { id: "cl_med_07", name: "电解质冲剂/泡腾片", required: true },
        { id: "cl_med_08", name: "感冒药", required: true },
        { id: "cl_med_09", name: "创可贴/碘伏/绷带", required: true },
        { id: "cl_med_10", name: "晕车药", required: false }
      ]
    },
    {
      category: "电子数码",
      items: [
        { id: "cl_elec_01", name: "手机", required: true },
        { id: "cl_elec_02", name: "充电宝（大容量 ×2）", required: true },
        { id: "cl_elec_03", name: "车载充电器", required: true },
        { id: "cl_elec_04", name: "相机/GoPro", required: false },
        { id: "cl_elec_05", name: "存储卡（备用）", required: false },
        { id: "cl_elec_06", name: "数据线（多根）", required: true },
        { id: "cl_elec_07", name: "插线板/多口充电头", required: true }
      ]
    },
    {
      category: "日常用品",
      items: [
        { id: "cl_daily_01", name: "防晒霜（SPF50+）", required: true },
        { id: "cl_daily_02", name: "润唇膏", required: true },
        { id: "cl_daily_03", name: "湿巾/纸巾", required: true },
        { id: "cl_daily_04", name: "垃圾袋", required: true },
        { id: "cl_daily_05", name: "洗漱用品", required: true },
        { id: "cl_daily_06", name: "速干毛巾", required: true },
        { id: "cl_daily_07", name: "保温杯/水壶（1L+）", required: true }
      ]
    },
    {
      category: "车辆物品",
      items: [
        { id: "cl_car_01", name: "备胎（确认状态）", required: true },
        { id: "cl_car_02", name: "拖车绳", required: true },
        { id: "cl_car_03", name: "搭电宝/过江龙", required: true },
        { id: "cl_car_04", name: "防滑链（视季节）", required: false },
        { id: "cl_car_05", name: "胎压表/充气泵", required: true },
        { id: "cl_car_06", name: "备用钥匙", required: true },
        { id: "cl_car_07", name: "三角警示牌", required: true },
        { id: "cl_car_08", name: "灭火器", required: false }
      ]
    },
    {
      category: "出发前必做",
      items: [
        { id: "cl_prep_01", name: "下载离线地图（高德/百度）", required: true },
        { id: "cl_prep_02", name: "确认全部住宿预订", required: true },
        { id: "cl_prep_03", name: "确认景区开放情况", required: true },
        { id: "cl_prep_04", name: "检查全车油量/保养", required: true },
        { id: "cl_prep_05", name: "确认边防证有效期", required: true },
        { id: "cl_prep_06", name: "下载本页面离线备用", required: true },
        { id: "cl_prep_07", name: "保存关键联系电话", required: true }
      ]
    }
  ],
  byScene: [
    {
      scene: "出发前 7 天",
      items: [
        { id: "cl_s7_01", name: "办理边防证（阿里/日喀则/山南）", category: "证件" },
        { id: "cl_s7_02", name: "购买旅行保险", category: "证件" },
        { id: "cl_s7_03", name: "车辆保养检查", category: "车辆" },
        { id: "cl_s7_04", name: "确认全程住宿预订", category: "出发前" },
        { id: "cl_s7_05", name: "购买药品和氧气", category: "药品" }
      ]
    },
    {
      scene: "出发前 1 天",
      items: [
        { id: "cl_s1_01", name: "下载离线地图包", category: "电子" },
        { id: "cl_s1_02", name: "充电宝全部充满", category: "电子" },
        { id: "cl_s1_03", name: "取足现金", category: "证件" },
        { id: "cl_s1_04", name: "氧气瓶检查", category: "药品" },
        { id: "cl_s1_05", name: "下载地图图片到手机相册", category: "出发前" },
        { id: "cl_s1_06", name: "保存本页面链接到微信收藏", category: "出发前" }
      ]
    },
    {
      scene: "每天出发前",
      items: [
        { id: "cl_dd_01", name: "水/保温杯（装满热水）", category: "日常" },
        { id: "cl_dd_02", name: "干粮/零食", category: "日常" },
        { id: "cl_dd_03", name: "冲锋衣/外套（应对天气变化）", category: "衣物" },
        { id: "cl_dd_04", name: "便携氧气瓶", category: "药品" },
        { id: "cl_dd_05", name: "身份证/边防证随身携带", category: "证件" },
        { id: "cl_dd_06", name: "加油确认", category: "车辆" },
        { id: "cl_dd_07", name: "查看今日行程和风险", category: "出发前" }
      ]
    },
    {
      scene: "转山前",
      items: [
        { id: "cl_ks_01", name: "登山杖（双杖）", category: "转山装备" },
        { id: "cl_ks_02", name: "护膝", category: "转山装备" },
        { id: "cl_ks_03", name: "头灯（确认电量）", category: "转山装备" },
        { id: "cl_ks_04", name: "保温杯装满热水", category: "日常" },
        { id: "cl_ks_05", name: "能量食品充足", category: "转山装备" },
        { id: "cl_ks_06", name: "现金充足（转山途中无电子支付）", category: "证件" },
        { id: "cl_ks_07", name: "安排背夫/向导", category: "出发前" }
      ]
    },
    {
      scene: "进入北线前",
      items: [
        { id: "cl_nl_01", name: "油箱加满（必须！）", category: "车辆" },
        { id: "cl_nl_02", name: "水和食物充足（至少2天量）", category: "日常" },
        { id: "cl_nl_03", name: "备胎和工具确认", category: "车辆" },
        { id: "cl_nl_04", name: "拖车绳在车上", category: "车辆" },
        { id: "cl_nl_05", name: "离线地图已下载", category: "出发前" },
        { id: "cl_nl_06", name: "手机电量充足/充电宝满电", category: "电子" }
      ]
    }
  ]
};

// ============================================================
// 应急信息
// ============================================================
const EMERGENCY_DATA = {
  categories: [
    { id: "ams", name: "我高反了", icon: "🤢", color: "#e74c3c" },
    { id: "car", name: "车坏了", icon: "🚗", color: "#e67e22" },
    { id: "hypothermia", name: "失温了", icon: "🥶", color: "#3498db" },
    { id: "lost", name: "迷路/无信号", icon: "🗺️", color: "#9b59b6" },
    { id: "police", name: "需要报警", icon: "🚨", color: "#e74c3c" },
    { id: "hospital", name: "需要医院", icon: "🏥", color: "#e74c3c" },
    { id: "tow", name: "需要拖车", icon: "🔧", color: "#e67e22" },
    { id: "companion", name: "同伴情况异常", icon: "🆘", color: "#c0392b" }
  ],
  ams: {
    title: "高原反应（AMS）应急处置",
    intro: "请勾选当前出现的症状，系统将给出建议：",
    symptoms: [
      { id: "ams_s1", text: "头痛", severe: false },
      { id: "ams_s2", text: "恶心", severe: false },
      { id: "ams_s3", text: "呕吐", severe: true },
      { id: "ams_s4", text: "走路不稳", severe: true },
      { id: "ams_s5", text: "呼吸困难（休息时也喘）", severe: true },
      { id: "ams_s6", text: "胸闷/咳嗽", severe: true },
      { id: "ams_s7", text: "意识模糊", severe: true },
      { id: "ams_s8", text: "嘴唇发紫", severe: true }
    ],
    mildAdvice: "症状较轻，建议：休息、喝水、保暖、减少活动、观察。不要继续上升。如2小时内无好转，下撤到低海拔。",
    severeAdvice: "⚠️ 出现严重高反症状！\n\n立即采取以下措施：\n1. 停止上升，就地休息\n2. 保暖（穿多层衣物、防风）\n3. 吸氧（如有氧气瓶）\n4. 补充温水和葡萄糖\n5. 联系救援或前往最近医院\n6. 不要继续转山或赶路\n\n如条件允许，尽快下撤到海拔4000m以下区域。"
  },
  car: {
    title: "车辆故障应急处置",
    steps: [
      { step: 1, text: "靠边停车（选择安全、平坦的位置）" },
      { step: 2, text: "打开双闪灯" },
      { step: 3, text: "放置三角警示牌（车后50–100米）" },
      { step: 4, text: "所有人员撤到安全区域（护栏外/远离车道）" },
      { step: 5, text: "确认当前定位（GPS坐标/路标/里程碑）" },
      { step: 6, text: "拨打救援电话：\n    交警：122\n    急救：120\n    保险道路救援：（见保单）" },
      { step: 7, text: "如在荒原无信号，尝试：\n    • 走到高处找信号\n    • 沿路等待过往车辆\n    • 发送短信求救（比打电话省电）" }
    ],
    tireChange: "高海拔换胎注意事项：\n• 动作要慢，避免剧烈用力导致高反\n• 两人配合，一人操作一人休息\n• 确保手刹拉死、车轮下垫石头\n• 换好后低速试车确认\n• 到下一补给点检查螺丝紧固"
  },
  hypothermia: {
    title: "失温（低体温症）应急处置",
    levels: [
      {
        level: "轻度失温",
        symptoms: "发抖、手脚冰冷、皮肤起鸡皮疙瘩",
        action: "停止暴露在风中，加衣服，喝热水/热饮，吃含糖食物，增加活动量"
      },
      {
        level: "中度失温",
        symptoms: "剧烈发抖、行动困难、说话不清、判断力下降",
        action: "立即脱离风和湿环境，换干衣物，钻进睡袋/保暖毯，喝温水加糖，同伴贴身取暖，不要喝酒"
      },
      {
        level: "重度失温",
        symptoms: "停止发抖、意识模糊、呼吸变慢、皮肤发紫",
        action: "⚠️ 紧急情况！拨打120/救援，保暖但不要剧烈加热，不要搓四肢，保持平躺，等待专业救援"
      }
    ]
  },
  lost: {
    title: "迷路/无信号处置",
    steps: [
      "保持冷静，不要盲目乱走",
      "确认最后已知位置（回忆路标/里程碑/建筑物）",
      "尝试走到高处寻找信号",
      "沿主路/车辙走（不要另辟道路）",
      "发短信给同伴（短信比语音通话更容易发出）",
      "节省手机电量（关掉不必要的应用，开启省电模式）",
      "如天黑还未找到路，在原地安全处等待天亮",
      "阿里地区常见无信号区域：北线大部分路段、转山路段"
    ]
  },
  police: {
    title: "报警求助",
    numbers: [
      { name: "报警电话", number: "110" },
      { name: "交警", number: "122" },
      { name: "急救", number: "120" },
      { name: "火警", number: "119" },
      { name: "阿里地区公安处", number: "0897-2822110" },
      { name: "日喀则地区公安处", number: "0892-8822241" },
      { name: "拉萨市公安局", number: "0891-6248110" }
    ],
    template: "我们在阿里大环线旅行，目前位置：____。\n出现情况：高反/车辆故障/失温/迷路。\n人数：____人。\n是否有人受伤：____。\n车辆情况：____。\n手机电量：____%。\n需要：医疗救援/拖车/道路救援/警方协助。"
  },
  hospital: {
    title: "沿途医院信息",
    facilities: [
      { name: "拉萨市人民医院", location: "拉萨市区", level: "三级医院", phone: "0891-6323228" },
      { name: "日喀则市人民医院", location: "日喀则市区", level: "二级甲等", phone: "0892-8822650" },
      { name: "阿里地区人民医院", location: "狮泉河镇", level: "二级", phone: "0897-2821462" },
      { name: "萨嘎县人民医院", location: "萨嘎县城", level: "县级", phone: "—" },
      { name: "改则县人民医院", location: "改则县城", level: "县级", phone: "—" },
      { name: "普兰县人民医院", location: "普兰县城", level: "县级", phone: "—" },
      { name: "札达县人民医院", location: "札达县城", level: "县级", phone: "—" }
    ],
    note: "⚠️ 阿里地区医疗资源有限，县级医院仅能处理一般急症。严重情况需尽快转送狮泉河或拉萨。"
  }
};

// ============================================================
// 海拔数据（用于绘制曲线图）
// ============================================================
const ALTITUDE_DATA = {
  days: ["D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12","D13","D14","D15","D16"],
  sleepAltitude: [3650,3650,3850,4500,4660,4660,5000,4800,4660,3700,4280,4430,4610,4720,3650,0],
  maxAltitude: [3700,3800,5039,5089,5211,4700,5200,5630,4800,5100,4900,4900,5000,5000,5190,3700],
  riskLevels: ["low","low","medium","medium","high","medium","high","critical","medium","medium","medium","high","high","high","medium","low"]
};

// ============================================================
// 天气描述（离线经验数据）
// ============================================================
const WEATHER_NOTES = {
  general: "阿里地区 6–7 月为夏季，白天温度 10–20°C，夜间可降至 0–5°C。高海拔地区（>5000m）随时可能降雪。早晚温差极大，风大干燥。",
  byDay: {
    1: "拉萨白天温暖（15–22°C），夜间凉爽（5–10°C），天气较好",
    2: "拉萨同前，注意防晒，紫外线极强",
    3: "羊湖区域风大，山口气温低（可能5–10°C），日喀则较暖",
    4: "海拔明显升高，温度下降，萨嘎夜间可能接近0°C",
    5: "进入阿里，风大温低，玛旁雍错区域天气多变",
    6: "塔钦风大，冈仁波齐天气阴晴不定，注意保暖",
    7: "转山第一天，山口风大，夜间止热寺极冷（可能–5–5°C）",
    8: "⚠️ 转山第二天，卓玛拉山口可能遇到风雪，午后天气易变",
    9: "转山第三天较轻松，但仍需防风雨",
    10: "札达海拔降低，白天较暖，土林区域干燥炎热（注意防晒补水）",
    11: "狮泉河至革吉方向，北线开始，风大干燥",
    12: "北线荒原，全天可能遇强风，温度低",
    13: "继续北线，荒原景观，天气变幻快",
    14: "色林错区域风极大（可能7–8级），注意防风保暖",
    15: "那根拉山口风大温度低，回到拉萨后温暖",
    16: "拉萨温暖，适合返程"
  }
};
