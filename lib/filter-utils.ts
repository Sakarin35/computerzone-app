import type { FilterCategory, FilterState } from "@/components/parts-filter"
import type { FirebaseComponentData } from "./fetch-components"

// 부품 데이터에서 필터 옵션을 추출하는 함수
export function generateFiltersFromComponents(components: FirebaseComponentData[], category: string): FilterCategory[] {
  if (!components || components.length === 0) return []

  console.log("Generating filters for category:", category, "with", components.length, "components")

  const filters: FilterCategory[] = []

  // 카테고리별 필터 정의
  switch (category.toLowerCase()) {
    case "cpu":
    case "Cpu":
      filters.push(...generateCpuFilters(components))
      break

    case "vga":
    case "Vga":
      filters.push(...generateVgaFilters(components))
      break

    case "memory":
    case "Memory":
      filters.push(...generateMemoryFilters(components))
      break

    case "ssd":
    case "SSD":
    case "Ssd":
      filters.push(...generateSsdFilters(components))
      break

    case "case":
    case "Case":
      filters.push(...generateCaseFilters(components))
      break

    case "mb":
    case "m.b":
    case "M.B":
      filters.push(...generateMbFilters(components))
      break

    case "cooler":
    case "Cooler":
      filters.push(...generateCoolerFilters(components))
      break

    case "power":
    case "Power":
      filters.push(...generatePowerFilters(components))
      break

    default:
      // 기본 필터들
      filters.push(generateManufacturerFilter(components), generatePriceRangeFilter(components))
      break
  }

  console.log("Generated filters:", filters)
  return filters.filter((filter) => filter.options.length > 0)
}

// CPU 전용 필터 생성
function generateCpuFilters(components: FirebaseComponentData[]): FilterCategory[] {
  const filters: FilterCategory[] = []

  // 1. 제조사 필터 - 인텔과 AMD만 표시
  const manufacturers = [
    { id: "인텔", label: "인텔", count: 0 },
    { id: "amd", label: "AMD", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (
      text.includes("intel") ||
      text.includes("인텔") ||
      text.includes("core") ||
      text.includes("코어") ||
      text.includes("i3") ||
      text.includes("i5") ||
      text.includes("i7") ||
      text.includes("i9") ||
      text.includes("xeon") ||
      text.includes("제온")
    ) {
      manufacturers[0].count++
    }

    if (
      text.includes("amd") ||
      text.includes("ryzen") ||
      text.includes("라이젠") ||
      text.includes("epyc") ||
      text.includes("threadripper") ||
      text.includes("스레드리퍼") ||
      text.includes("athlon") ||
      text.includes("애슬론")
    ) {
      manufacturers[1].count++
    }
  })

  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  // 2. 인텔 CPU종류
  const intelCpuTypes = [
    { id: "코어-울트라9s2", label: "코어 울트라9(S2)", count: 0 },
    { id: "코어-울트라7s2", label: "코어 울트라7(S2)", count: 0 },
    { id: "코어-울트라5s2", label: "코어 울트라5(S2)", count: 0 },
    { id: "코어i9-14세대", label: "코어i9-14세대", count: 0 },
    { id: "코어i7-14세대", label: "코어i7-14세대", count: 0 },
    { id: "코어i5-14세대", label: "코어i5-14세대", count: 0 },
    { id: "코어i3-14세대", label: "코어i3-14세대", count: 0 },
    { id: "코어i9-13세대", label: "코어i9-13세대", count: 0 },
    { id: "코어i7-13세대", label: "코어i7-13세대", count: 0 },
    { id: "코어i5-13세대", label: "코어i5-13세대", count: 0 },
    { id: "코어i3-13세대", label: "코어i3-13세대", count: 0 },
    { id: "코어i9-12세대", label: "코어i9-12세대", count: 0 },
    { id: "코어i7-12세대", label: "코어i7-12세대", count: 0 },
    { id: "코어i5-12세대", label: "코어i5-12세대", count: 0 },
    { id: "코어i3-12세대", label: "코어i3-12세대", count: 0 },
    { id: "제온", label: "제온", count: 0 },
    { id: "코어i9", label: "코어i9", count: 0 },
    { id: "코어i7", label: "코어i7", count: 0 },
    { id: "코어i5", label: "코어i5", count: 0 },
    { id: "코어i3", label: "코어i3", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    // 인텔 제품만 필터링
    if (!text.includes("intel") && !text.includes("인텔") && !text.includes("core") && !text.includes("코어")) {
      return
    }

    // 각 CPU 종류 매칭
    if (text.includes("울트라9") || text.includes("ultra 9")) intelCpuTypes[0].count++
    if (text.includes("울트라7") || text.includes("ultra 7")) intelCpuTypes[1].count++
    if (text.includes("울트라5") || text.includes("ultra 5")) intelCpuTypes[2].count++
    if (text.includes("i9") && (text.includes("14") || text.includes("14세대"))) intelCpuTypes[3].count++
    if (text.includes("i7") && (text.includes("14") || text.includes("14세대"))) intelCpuTypes[4].count++
    if (text.includes("i5") && (text.includes("14") || text.includes("14세대"))) intelCpuTypes[5].count++
    if (text.includes("i3") && (text.includes("14") || text.includes("14세대"))) intelCpuTypes[6].count++
    if (text.includes("i9") && (text.includes("13") || text.includes("13세대"))) intelCpuTypes[7].count++
    if (text.includes("i7") && (text.includes("13") || text.includes("13세대"))) intelCpuTypes[8].count++
    if (text.includes("i5") && (text.includes("13") || text.includes("13세대"))) intelCpuTypes[9].count++
    if (text.includes("i3") && (text.includes("13") || text.includes("13세대"))) intelCpuTypes[10].count++
    if (text.includes("i9") && (text.includes("12") || text.includes("12세대"))) intelCpuTypes[11].count++
    if (text.includes("i7") && (text.includes("12") || text.includes("12세대"))) intelCpuTypes[12].count++
    if (text.includes("i5") && (text.includes("12") || text.includes("12세대"))) intelCpuTypes[13].count++
    if (text.includes("i3") && (text.includes("12") || text.includes("12세대"))) intelCpuTypes[14].count++
    if (text.includes("xeon") || text.includes("제온")) intelCpuTypes[15].count++
    if (text.includes("i9") && !text.includes("12") && !text.includes("13") && !text.includes("14"))
      intelCpuTypes[16].count++
    if (text.includes("i7") && !text.includes("12") && !text.includes("13") && !text.includes("14"))
      intelCpuTypes[17].count++
    if (text.includes("i5") && !text.includes("12") && !text.includes("13") && !text.includes("14"))
      intelCpuTypes[18].count++
    if (text.includes("i3") && !text.includes("12") && !text.includes("13") && !text.includes("14"))
      intelCpuTypes[19].count++
  })

  filters.push({
    id: "intel-cpu-type",
    label: "인텔 CPU종류",
    options: intelCpuTypes.filter((t) => t.count > 0),
    isOpen: true,
  })

  // 3. AMD CPU종류
  const amdCpuTypes = [
    { id: "라이젠9-6세대", label: "라이젠9-6세대", count: 0 },
    { id: "라이젠7-6세대", label: "라이젠7-6세대", count: 0 },
    { id: "라이젠5-6세대", label: "라이젠5-6세대", count: 0 },
    { id: "라이젠9-5세대", label: "라이젠9-5세대", count: 0 },
    { id: "라이젠7-5세대", label: "라이젠7-5세대", count: 0 },
    { id: "라이젠5-5세대", label: "라이젠5-5세대", count: 0 },
    { id: "라이젠9-4세대", label: "라이젠9-4세대", count: 0 },
    { id: "라이젠7-4세대", label: "라이젠7-4세대", count: 0 },
    { id: "라이젠5-4세대", label: "라이젠5-4세대", count: 0 },
    { id: "라이젠-스레드리퍼", label: "라이젠 스레드리퍼", count: 0 },
    { id: "epyc", label: "EPYC", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    // AMD 제품만 필터링
    if (!text.includes("amd") && !text.includes("ryzen") && !text.includes("라이젠") && !text.includes("epyc")) {
      return
    }

    // 각 CPU 종류 매칭
    if ((text.includes("라이젠9") || text.includes("ryzen 9")) && (text.includes("9000") || text.includes("6세대")))
      amdCpuTypes[0].count++
    if ((text.includes("라이젠7") || text.includes("ryzen 7")) && (text.includes("9000") || text.includes("6세대")))
      amdCpuTypes[1].count++
    if ((text.includes("라이젠5") || text.includes("ryzen 5")) && (text.includes("9000") || text.includes("6세대")))
      amdCpuTypes[2].count++
    if (
      (text.includes("라이젠9") || text.includes("ryzen 9")) &&
      (text.includes("7000") || text.includes("8000") || text.includes("5세대"))
    )
      amdCpuTypes[3].count++
    if (
      (text.includes("라이젠7") || text.includes("ryzen 7")) &&
      (text.includes("7000") || text.includes("8000") || text.includes("5세대"))
    )
      amdCpuTypes[4].count++
    if (
      (text.includes("라이젠5") || text.includes("ryzen 5")) &&
      (text.includes("7000") || text.includes("8000") || text.includes("5세대"))
    )
      amdCpuTypes[5].count++
    if ((text.includes("라이젠9") || text.includes("ryzen 9")) && (text.includes("5000") || text.includes("4세대")))
      amdCpuTypes[6].count++
    if ((text.includes("라이젠7") || text.includes("ryzen 7")) && (text.includes("5000") || text.includes("4세대")))
      amdCpuTypes[7].count++
    if ((text.includes("라이젠5") || text.includes("ryzen 5")) && (text.includes("5000") || text.includes("4세대")))
      amdCpuTypes[8].count++
    if (text.includes("threadripper") || text.includes("스레드리퍼")) amdCpuTypes[9].count++
    if (text.includes("epyc")) amdCpuTypes[10].count++
  })

  filters.push({
    id: "amd-cpu-type",
    label: "AMD CPU종류",
    options: amdCpuTypes.filter((t) => t.count > 0),
    isOpen: true,
  })

  // 4. 소켓 구분
  const socketTypes = [
    { id: "인텔소켓1851", label: "인텔(소켓1851)", count: 0 },
    { id: "인텔소켓1700", label: "인텔(소켓1700)", count: 0 },
    { id: "인텔소켓1200", label: "인텔(소켓1200)", count: 0 },
    { id: "amd소켓am5", label: "AMD(소켓AM5)", count: 0 },
    { id: "amd소켓am4", label: "AMD(소켓AM4)", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("1851") || text.includes("lga1851")) socketTypes[0].count++
    if (text.includes("1700") || text.includes("lga1700")) socketTypes[1].count++
    if (text.includes("1200") || text.includes("lga1200")) socketTypes[2].count++
    if (text.includes("am5")) socketTypes[3].count++
    if (text.includes("am4")) socketTypes[4].count++
  })

  filters.push({
    id: "socket",
    label: "소켓 구분",
    options: socketTypes.filter((s) => s.count > 0),
    isOpen: true,
  })

  // 5. 코어 수
  const coreCountTypes = [
    { id: "24코어", label: "24코어", count: 0 },
    { id: "20코어", label: "20코어", count: 0 },
    { id: "16코어", label: "16코어", count: 0 },
    { id: "14코어", label: "14코어", count: 0 },
    { id: "12코어", label: "12코어", count: 0 },
    { id: "10코어", label: "10코어", count: 0 },
    { id: "8코어", label: "8코어", count: 0 },
    { id: "6코어", label: "6코어", count: 0 },
    { id: "4코어", label: "4코어", count: 0 },
    { id: "2코어", label: "2코어", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    // 정규식으로 코어 수 추출
    const coreMatch = text.match(/(\d+)코어/)
    if (coreMatch) {
      const coreCount = coreMatch[1]
      const coreType = coreCountTypes.find((c) => c.label === `${coreCount}코어`)
      if (coreType) {
        coreType.count++
      }
    }
  })

  filters.push({
    id: "core-count",
    label: "코어 수",
    options: coreCountTypes.filter((c) => c.count > 0),
    isOpen: true,
  })

  // 6. 스레드 수
  const threadCountTypes = [
    { id: "32스레드", label: "32스레드", count: 0 },
    { id: "28스레드", label: "28스레드", count: 0 },
    { id: "24스레드", label: "24스레드", count: 0 },
    { id: "20스레드", label: "20스레드", count: 0 },
    { id: "16스레드", label: "16스레드", count: 0 },
    { id: "12스레드", label: "12스레드", count: 0 },
    { id: "8스레드", label: "8스레드", count: 0 },
    { id: "6스레드", label: "6스레드", count: 0 },
    { id: "4스레드", label: "4스레드", count: 0 },
    { id: "2스레드", label: "2스레드", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    // 정규식으로 스레드 수 추출
    const threadMatch = text.match(/(\d+)스레드/)
    if (threadMatch) {
      const threadCount = threadMatch[1]
      const threadType = threadCountTypes.find((t) => t.label === `${threadCount}스레드`)
      if (threadType) {
        threadType.count++
      }
    }
  })

  filters.push({
    id: "thread-count",
    label: "스레드 수",
    options: threadCountTypes.filter((t) => t.count > 0),
    isOpen: true,
  })

  // 7. 메모리 규격
  const memoryTypes = [
    { id: "ddr5", label: "DDR5", count: 0 },
    { id: "ddr5-ddr4", label: "DDR5, DDR4", count: 0 },
    { id: "ddr4", label: "DDR4", count: 0 },
    { id: "ddr4-ddr3l", label: "DDR4, DDR3L", count: 0 },
    { id: "ddr3", label: "DDR3", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("ddr5") && text.includes("ddr4")) memoryTypes[1].count++
    else if (text.includes("ddr5")) memoryTypes[0].count++
    else if (text.includes("ddr4") && text.includes("ddr3l")) memoryTypes[3].count++
    else if (text.includes("ddr4")) memoryTypes[2].count++
    else if (text.includes("ddr3")) memoryTypes[4].count++
  })

  filters.push({
    id: "memory-type",
    label: "메모리 규격",
    options: memoryTypes.filter((m) => m.count > 0),
    isOpen: true,
  })

  return filters
}

// VGA(그래픽카드) 전용 필터 생성
function generateVgaFilters(components: FirebaseComponentData[]): FilterCategory[] {
  const filters: FilterCategory[] = []

  // 1. 제조사 필터
  const manufacturers = [
    { id: "msi", label: "MSI", count: 0 },
    { id: "palit", label: "PALIT", count: 0 },
    { id: "gigabyte", label: "GIGABYTE", count: 0 },
    { id: "asus", label: "ASUS", count: 0 },
    { id: "이엠텍", label: "이엠텍", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("msi")) manufacturers[0].count++
    if (text.includes("palit")) manufacturers[1].count++
    if (text.includes("gigabyte")) manufacturers[2].count++
    if (text.includes("asus")) manufacturers[3].count++
    if (text.includes("이엠텍") || text.includes("emtek")) manufacturers[4].count++
  })

  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  // 2. 칩셋 제조사
  const chipsetManufacturers = [
    { id: "nvidia", label: "NVIDIA", count: 0 },
    { id: "amdati", label: "AMD(ATI)", count: 0 },
    { id: "intel", label: "Intel", count: 0 },
    { id: "matrox", label: "Matrox", count: 0 },
    { id: "furiosai", label: "FuriosaAI", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("nvidia") || text.includes("rtx") || text.includes("gtx")) chipsetManufacturers[0].count++
    if (text.includes("amd") || text.includes("radeon") || text.includes("rx")) chipsetManufacturers[1].count++
    if (text.includes("intel") || text.includes("arc")) chipsetManufacturers[2].count++
    if (text.includes("matrox")) chipsetManufacturers[3].count++
    if (text.includes("furiosa")) chipsetManufacturers[4].count++
  })

  filters.push({
    id: "chipset-manufacturer",
    label: "칩셋 제조사",
    options: chipsetManufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  // 3. 제품 시리즈
  const productSeries = [
    { id: "지포스-rtx-50", label: "지포스 RTX 50", count: 0 },
    { id: "지포스-rtx-40", label: "지포스 RTX 40", count: 0 },
    { id: "지포스-rtx-30", label: "지포스 RTX 30", count: 0 },
    { id: "라데온-rx-9000", label: "라데온 RX 9000", count: 0 },
    { id: "라데온-rx-7000", label: "라데온 RX 7000", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("rtx 50") || text.includes("5090") || text.includes("5080")) productSeries[0].count++
    if (
      text.includes("rtx 40") ||
      text.includes("4090") ||
      text.includes("4080") ||
      text.includes("4070") ||
      text.includes("4060")
    )
      productSeries[1].count++
    if (
      text.includes("rtx 30") ||
      text.includes("3090") ||
      text.includes("3080") ||
      text.includes("3070") ||
      text.includes("3060")
    )
      productSeries[2].count++
    if (text.includes("rx 9000") || text.includes("9070") || text.includes("9060")) productSeries[3].count++
    if (
      text.includes("rx 7000") ||
      text.includes("7900") ||
      text.includes("7800") ||
      text.includes("7700") ||
      text.includes("7600")
    )
      productSeries[4].count++
  })

  filters.push({
    id: "product-series",
    label: "제품 시리즈",
    options: productSeries.filter((s) => s.count > 0),
    isOpen: true,
  })

  // 4. GPU 제조 공정
  const gpuProcess = [
    { id: "4-nm", label: "4 nm", count: 0 },
    { id: "8-nm", label: "8 nm", count: 0 },
    { id: "12-nm", label: "12 nm", count: 0 },
    { id: "14-nm", label: "14 nm", count: 0 },
    { id: "16-nm", label: "16 nm", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("4 nm") || text.includes("4nm")) gpuProcess[0].count++
    if (text.includes("8 nm") || text.includes("8nm")) gpuProcess[1].count++
    if (text.includes("12 nm") || text.includes("12nm")) gpuProcess[2].count++
    if (text.includes("14 nm") || text.includes("14nm")) gpuProcess[3].count++
    if (text.includes("16 nm") || text.includes("16nm")) gpuProcess[4].count++
  })

  filters.push({
    id: "gpu-process",
    label: "GPU 제조 공정",
    options: gpuProcess.filter((p) => p.count > 0),
    isOpen: true,
  })

  // 5. NVIDIA 칩셋
  const nvidiaChipsets = [
    { id: "rtx-5090", label: "RTX 5090", count: 0 },
    { id: "rtx-5080", label: "RTX 5080", count: 0 },
    { id: "rtx-5070", label: "RTX 5070", count: 0 },
    { id: "rtx-5070-ti", label: "RTX 5070 Ti", count: 0 },
    { id: "rtx-5060", label: "RTX 5060", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("rtx 5090") || text.includes("rtx5090")) nvidiaChipsets[0].count++
    if (text.includes("rtx 5080") || text.includes("rtx5080")) nvidiaChipsets[1].count++
    if (text.includes("rtx 5070") && !text.includes("ti")) nvidiaChipsets[2].count++
    if (text.includes("rtx 5070 ti") || text.includes("rtx5070ti")) nvidiaChipsets[3].count++
    if (text.includes("rtx 5060") || text.includes("rtx5060")) nvidiaChipsets[4].count++
  })

  filters.push({
    id: "nvidia-chipset",
    label: "NVIDIA 칩셋",
    options: nvidiaChipsets.filter((c) => c.count > 0),
    isOpen: true,
  })

  // 6. AMD 칩셋
  const amdChipsets = [
    { id: "rx-9070-xt", label: "RX 9070 XT", count: 0 },
    { id: "rx-9070", label: "RX 9070", count: 0 },
    { id: "rx-7900-xtx", label: "RX 7900 XTX", count: 0 },
    { id: "rx-7800-xt", label: "RX 7800 XT", count: 0 },
    { id: "rx-7700-xt", label: "RX 7700 XT", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("rx 9070 xt") || text.includes("rx9070xt")) amdChipsets[0].count++
    if (text.includes("rx 9070") && !text.includes("xt")) amdChipsets[1].count++
    if (text.includes("rx 7900 xtx") || text.includes("rx7900xtx")) amdChipsets[2].count++
    if (text.includes("rx 7800 xt") || text.includes("rx7800xt")) amdChipsets[3].count++
    if (text.includes("rx 7700 xt") || text.includes("rx7700xt")) amdChipsets[4].count++
  })

  filters.push({
    id: "amd-chipset",
    label: "AMD 칩셋",
    options: amdChipsets.filter((c) => c.count > 0),
    isOpen: true,
  })

  // 7. 인텔 칩셋
  const intelChipsets = [
    { id: "arc-b580", label: "ARC B580", count: 0 },
    { id: "arc-b570", label: "ARC B570", count: 0 },
    { id: "arc-a770", label: "ARC A770", count: 0 },
    { id: "arc-a750", label: "ARC A750", count: 0 },
    { id: "arc-a380", label: "ARC A380", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("arc b580") || text.includes("arcb580")) intelChipsets[0].count++
    if (text.includes("arc b570") || text.includes("arcb570")) intelChipsets[1].count++
    if (text.includes("arc a770") || text.includes("arca770")) intelChipsets[2].count++
    if (text.includes("arc a750") || text.includes("arca750")) intelChipsets[3].count++
    if (text.includes("arc a380") || text.includes("arca380")) intelChipsets[4].count++
  })

  filters.push({
    id: "intel-chipset",
    label: "인텔 칩셋",
    options: intelChipsets.filter((c) => c.count > 0),
    isOpen: true,
  })

  return filters
}

// 메모리 전용 필터 생성
function generateMemoryFilters(components: FirebaseComponentData[]): FilterCategory[] {
  const filters: FilterCategory[] = []

  // 1. 제조사 필터
  const manufacturers = [
    { id: "삼성전자", label: "삼성전자", count: 0 },
    { id: "teamgroup", label: "TeamGroup", count: 0 },
    { id: "마이크론", label: "마이크론", count: 0 },
    { id: "essencore", label: "ESSENCORE", count: 0 },
    { id: "sk하이닉스", label: "SK하이닉스", count: 0 },
    { id: "g-skill", label: "G.Skill", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("삼성") || text.includes("samsung")) manufacturers[0].count++
    if (text.includes("teamgroup") || text.includes("팀그룹")) manufacturers[1].count++
    if (text.includes("마이크론") || text.includes("micron") || text.includes("crucial")) manufacturers[2].count++
    if (text.includes("essencore")) manufacturers[3].count++
    if (text.includes("sk하이닉스") || text.includes("hynix")) manufacturers[4].count++
    if (text.includes("gskill") || text.includes("g.skill")) manufacturers[5].count++
  })

  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  // 2. 사용 장치
  const usageTypes = [
    { id: "데스크탑용", label: "데스크탑용", count: 0 },
    { id: "노트북용", label: "노트북용", count: 0 },
    { id: "서버용", label: "서버용", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("데스크탑") || text.includes("desktop")) usageTypes[0].count++
    if (text.includes("노트북") || text.includes("laptop") || text.includes("sodimm")) usageTypes[1].count++
    if (text.includes("서버") || text.includes("server") || text.includes("ecc")) usageTypes[2].count++
  })

  filters.push({
    id: "usage-type",
    label: "사용 장치",
    options: usageTypes.filter((u) => u.count > 0),
    isOpen: true,
  })

  // 3. 제품 분류
  const memoryTypes = [
    { id: "ddr5", label: "DDR5", count: 0 },
    { id: "ddr4", label: "DDR4", count: 0 },
    { id: "ddr3", label: "DDR3", count: 0 },
    { id: "ddr2", label: "DDR2", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("ddr5")) memoryTypes[0].count++
    if (text.includes("ddr4")) memoryTypes[1].count++
    if (text.includes("ddr3")) memoryTypes[2].count++
    if (text.includes("ddr2")) memoryTypes[3].count++
  })

  filters.push({
    id: "memory-type",
    label: "제품 분류",
    options: memoryTypes.filter((m) => m.count > 0),
    isOpen: true,
  })

  // 4. 메모리 용량
  const capacities = [
    { id: "64gb", label: "64GB", count: 0 },
    { id: "32gb", label: "32GB", count: 0 },
    { id: "16gb", label: "16GB", count: 0 },
    { id: "8gb", label: "8GB", count: 0 },
    { id: "4gb", label: "4GB", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("64gb")) capacities[0].count++
    if (text.includes("32gb")) capacities[1].count++
    if (text.includes("16gb")) capacities[2].count++
    if (text.includes("8gb")) capacities[3].count++
    if (text.includes("4gb")) capacities[4].count++
  })

  filters.push({
    id: "memory-capacity",
    label: "메모리 용량",
    options: capacities.filter((c) => c.count > 0),
    isOpen: true,
  })

  // 5. 동작클럭(대역폭)
  const clockSpeeds = [
    { id: "8800mhz", label: "8800MHz (PC5-7", count: 0 },
    { id: "8400mhz", label: "8400MHz (PC5-6", count: 0 },
    { id: "8200mhz", label: "8200MHz (PC5-6", count: 0 },
    { id: "8000mhz", label: "8000MHz (PC5-6", count: 0 },
    { id: "7800mhz", label: "7800MHz (PC5-6", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("8800mhz") || text.includes("8800 mhz")) clockSpeeds[0].count++
    if (text.includes("8400mhz") || text.includes("8400 mhz")) clockSpeeds[1].count++
    if (text.includes("8200mhz") || text.includes("8200 mhz")) clockSpeeds[2].count++
    if (text.includes("8000mhz") || text.includes("8000 mhz")) clockSpeeds[3].count++
    if (text.includes("7800mhz") || text.includes("7800 mhz")) clockSpeeds[4].count++
  })

  filters.push({
    id: "clock-speed",
    label: "동작클럭(대역폭)",
    options: clockSpeeds.filter((c) => c.count > 0),
    isOpen: true,
  })

  // 6. 램타이밍
  const timings = [
    { id: "cl14", label: "CL14", count: 0 },
    { id: "cl15", label: "CL15", count: 0 },
    { id: "cl16", label: "CL16", count: 0 },
    { id: "cl17", label: "CL17", count: 0 },
    { id: "cl18", label: "CL18", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("cl14") || text.includes("cl 14")) timings[0].count++
    if (text.includes("cl15") || text.includes("cl 15")) timings[1].count++
    if (text.includes("cl16") || text.includes("cl 16")) timings[2].count++
    if (text.includes("cl17") || text.includes("cl 17")) timings[3].count++
    if (text.includes("cl18") || text.includes("cl 18")) timings[4].count++
  })

  filters.push({
    id: "timing",
    label: "램타이밍",
    options: timings.filter((t) => t.count > 0),
    isOpen: true,
  })

  // 7. 동작전압
  const voltages = [
    { id: "1-10v", label: "1.10V", count: 0 },
    { id: "1-20v", label: "1.20V", count: 0 },
    { id: "1-25v", label: "1.25V", count: 0 },
    { id: "1-35v", label: "1.35V", count: 0 },
    { id: "1-50v", label: "1.50V", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("1.10v") || text.includes("1.1v")) voltages[0].count++
    if (text.includes("1.20v") || text.includes("1.2v")) voltages[1].count++
    if (text.includes("1.25v")) voltages[2].count++
    if (text.includes("1.35v")) voltages[3].count++
    if (text.includes("1.50v") || text.includes("1.5v")) voltages[4].count++
  })

  filters.push({
    id: "voltage",
    label: "동작전압",
    options: voltages.filter((v) => v.count > 0),
    isOpen: true,
  })

  return filters
}

// SSD 전용 필터 생성
function generateSsdFilters(components: FirebaseComponentData[]): FilterCategory[] {
  const filters: FilterCategory[] = []

  // 1. 제조사 필터
  const manufacturers = [
    { id: "삼성전자", label: "삼성전자", count: 0 },
    { id: "sk하이닉스", label: "SK하이닉스", count: 0 },
    { id: "마이크론", label: "마이크론", count: 0 },
    { id: "western-digital", label: "Western Digital", count: 0 },
    { id: "adata", label: "ADATA", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("삼성") || text.includes("samsung")) manufacturers[0].count++
    if (text.includes("sk하이닉스") || text.includes("hynix")) manufacturers[1].count++
    if (text.includes("마이크론") || text.includes("micron") || text.includes("crucial")) manufacturers[2].count++
    if (text.includes("western digital") || text.includes("wd")) manufacturers[3].count++
    if (text.includes("adata")) manufacturers[4].count++
  })

  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  // 2. 폼팩터
  const formFactors = [
    { id: "m2-2280", label: "M.2 (2280)", count: 0 },
    { id: "64cm25형", label: "6.4cm(2.5형)", count: 0 },
    { id: "m2-2230", label: "M.2 (2230)", count: 0 },
    { id: "m2-2242", label: "M.2 (2242)", count: 0 },
    { id: "mini-satamsat", label: "Mini SATA(mSAT", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("m.2") && text.includes("2280")) formFactors[0].count++
    if (text.includes("2.5") || text.includes("6.4cm")) formFactors[1].count++
    if (text.includes("m.2") && text.includes("2230")) formFactors[2].count++
    if (text.includes("m.2") && text.includes("2242")) formFactors[3].count++
    if (text.includes("mini sata") || text.includes("msat")) formFactors[4].count++
  })

  filters.push({
    id: "form-factor",
    label: "폼팩터",
    options: formFactors.filter((f) => f.count > 0),
    isOpen: true,
  })

  // 3. 인터페이스
  const interfaces = [
    { id: "pcie50x4", label: "PCIe5.0×4 (128G", count: 0 },
    { id: "pcie40x4", label: "PCIe4.0×4 (64G", count: 0 },
    { id: "pcie30x4", label: "PCIe3.0×4 (32G", count: 0 },
    { id: "pcie30x2", label: "PCIe3.0×2 (16GT/", count: 0 },
    { id: "sata3", label: "SATA3 (6Gb/s)", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("pcie5.0") || text.includes("pcie 5.0") || text.includes("pcie5") || text.includes("pcie 5"))
      interfaces[0].count++
    if (text.includes("pcie4.0") || text.includes("pcie 4.0") || text.includes("pcie4") || text.includes("pcie 4"))
      interfaces[1].count++
    if (
      (text.includes("pcie3.0") || text.includes("pcie 3.0") || text.includes("pcie3") || text.includes("pcie 3")) &&
      text.includes("x4")
    )
      interfaces[2].count++
    if (
      (text.includes("pcie3.0") || text.includes("pcie 3.0") || text.includes("pcie3") || text.includes("pcie 3")) &&
      text.includes("x2")
    )
      interfaces[3].count++
    if (text.includes("sata3") || text.includes("sata 3") || text.includes("6gb/s")) interfaces[4].count++
  })

  filters.push({
    id: "interface",
    label: "인터페이스",
    options: interfaces.filter((i) => i.count > 0),
    isOpen: true,
  })

  // 4. 프로토콜
  const protocols = [
    { id: "nvme-20", label: "NVMe 2.0", count: 0 },
    { id: "nvme-14", label: "NVMe 1.4", count: 0 },
    { id: "nvme-13", label: "NVMe 1.3", count: 0 },
    { id: "nvme-12", label: "NVMe 1.2", count: 0 },
    { id: "nvme", label: "NVMe", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("nvme 2.0") || text.includes("nvme2.0")) protocols[0].count++
    else if (text.includes("nvme 1.4") || text.includes("nvme1.4")) protocols[1].count++
    else if (text.includes("nvme 1.3") || text.includes("nvme1.3")) protocols[2].count++
    else if (text.includes("nvme 1.2") || text.includes("nvme1.2")) protocols[3].count++
    else if (text.includes("nvme")) protocols[4].count++
  })

  filters.push({
    id: "protocol",
    label: "프로토콜",
    options: protocols.filter((p) => p.count > 0),
    isOpen: true,
  })

  // 5. 용량
  const capacities = [
    { id: "4tb3tb", label: "4TB~3TB", count: 0 },
    { id: "2tb11tb", label: "2TB~1.1TB", count: 0 },
    { id: "1tb600gb", label: "1TB~600GB", count: 0 },
    { id: "525gb270gb", label: "525GB~270GB", count: 0 },
    { id: "256gb130gb", label: "256GB~130GB", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("4tb") || text.includes("3tb")) capacities[0].count++
    else if (text.includes("2tb") || text.includes("1.1tb")) capacities[1].count++
    else if (text.includes("1tb") || text.includes("600gb")) capacities[2].count++
    else if (text.includes("525gb") || text.includes("500gb") || text.includes("480gb") || text.includes("270gb"))
      capacities[3].count++
    else if (text.includes("256gb") || text.includes("250gb") || text.includes("240gb") || text.includes("130gb"))
      capacities[4].count++
  })

  filters.push({
    id: "capacity",
    label: "용량",
    options: capacities.filter((c) => c.count > 0),
    isOpen: true,
  })

  // 6. 메모리 타입
  const memoryTypes = [
    { id: "tlc", label: "TLC", count: 0 },
    { id: "qlc", label: "QLC", count: 0 },
    { id: "mlc", label: "MLC", count: 0 },
    { id: "slc", label: "SLC", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("tlc")) memoryTypes[0].count++
    if (text.includes("qlc")) memoryTypes[1].count++
    if (text.includes("mlc")) memoryTypes[2].count++
    if (text.includes("slc")) memoryTypes[3].count++
  })

  filters.push({
    id: "memory-type",
    label: "메모리 타입",
    options: memoryTypes.filter((m) => m.count > 0),
    isOpen: true,
  })

  // 7. 낸드 구조
  const nandStructures = [
    { id: "3d낸드", label: "3D낸드", count: 0 },
    { id: "2d낸드", label: "2D낸드", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("3d") && text.includes("낸드")) nandStructures[0].count++
    if (text.includes("2d") && text.includes("낸드")) nandStructures[1].count++
  })

  filters.push({
    id: "nand-structure",
    label: "낸드 구조",
    options: nandStructures.filter((n) => n.count > 0),
    isOpen: true,
  })

  return filters
}

// 케이스 전용 필터 생성
function generateCaseFilters(components: FirebaseComponentData[]): FilterCategory[] {
  const filters: FilterCategory[] = []

  // 1. 제조사 필터
  const manufacturers = [
    { id: "앱코", label: "앱코", count: 0 },
    { id: "darkflash", label: "darkFlash", count: 0 },
    { id: "마이크로닉스", label: "마이크로닉스", count: 0 },
    { id: "잘만", label: "잘만", count: 0 },
    { id: "antec", label: "Antec", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("앱코") || text.includes("abko")) manufacturers[0].count++
    if (text.includes("darkflash")) manufacturers[1].count++
    if (text.includes("마이크로닉스") || text.includes("micronics")) manufacturers[2].count++
    if (text.includes("잘만") || text.includes("zalman")) manufacturers[3].count++
    if (text.includes("antec") || text.includes("안텍")) manufacturers[4].count++
  })

  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  // 2. 제품 분류
  const caseTypes = [
    { id: "atx-케이스", label: "ATX 케이스", count: 0 },
    { id: "m-atx-케이스", label: "M-ATX 케이스", count: 0 },
    { id: "미니itx", label: "미니ITX", count: 0 },
    { id: "htpc-케이스", label: "HTPC 케이스", count: 0 },
    { id: "튜닝-케이스", label: "튜닝 케이스", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("atx") && !text.includes("m-atx") && !text.includes("mini")) caseTypes[0].count++
    if (text.includes("m-atx") || text.includes("matx")) caseTypes[1].count++
    if (text.includes("mini itx") || text.includes("mitx")) caseTypes[2].count++
    if (text.includes("htpc")) caseTypes[3].count++
    if (text.includes("튜닝") || text.includes("tuning")) caseTypes[4].count++
  })

  filters.push({
    id: "case-type",
    label: "제품 분류",
    options: caseTypes.filter((c) => c.count > 0),
    isOpen: true,
  })

  // 3. 지원보드규격
  const boardSupports = [
    { id: "atx", label: "ATX", count: 0 },
    { id: "m-atx", label: "M-ATX", count: 0 },
    { id: "itx", label: "ITX", count: 0 },
    { id: "e-atx", label: "E-ATX", count: 0 },
    { id: "m-itx", label: "M-ITX", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("atx") && !text.includes("m-atx") && !text.includes("e-atx")) boardSupports[0].count++
    if (text.includes("m-atx") || text.includes("matx")) boardSupports[1].count++
    if (text.includes("itx") && !text.includes("m-itx")) boardSupports[2].count++
    if (text.includes("e-atx") || text.includes("eatx")) boardSupports[3].count++
    if (text.includes("m-itx") || text.includes("mitx")) boardSupports[4].count++
  })

  filters.push({
    id: "board-support",
    label: "지원보드규격",
    options: boardSupports.filter((b) => b.count > 0),
    isOpen: true,
  })

  // 4. VGA 길이
  const vgaLengths = [
    { id: "400-mm", label: "400~ mm", count: 0 },
    { id: "370399-mm", label: "370~399 mm", count: 0 },
    { id: "350369-mm", label: "350~369 mm", count: 0 },
    { id: "330349-mm", label: "330~349 mm", count: 0 },
    { id: "310329-mm", label: "310~329 mm", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    // VGA 길이 정보 추출
    if (text.includes("vga") && text.includes("길이")) {
      if (text.includes("400mm") || text.match(/4\d\d\s*mm/)) vgaLengths[0].count++
      else if (text.match(/3[7-9]\d\s*mm/)) vgaLengths[1].count++
      else if (text.match(/3[5-6]\d\s*mm/)) vgaLengths[2].count++
      else if (text.match(/3[3-4]\d\s*mm/)) vgaLengths[3].count++
      else if (text.match(/31\d\s*mm/) || text.match(/32\d\s*mm/)) vgaLengths[4].count++
    }
  })

  filters.push({
    id: "vga-length",
    label: "VGA 길이",
    options: vgaLengths.filter((v) => v.count > 0),
    isOpen: true,
  })

  // 5. CPU쿨러 높이
  const cpuCoolerHeights = [
    { id: "200mm-이상", label: "200mm 이상", count: 0 },
    { id: "190199mm", label: "190~199mm", count: 0 },
    { id: "180189mm", label: "180~189mm", count: 0 },
    { id: "170179mm", label: "170~179mm", count: 0 },
    { id: "160169mm", label: "160~169mm", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("200mm") || text.match(/2\d\d\s*mm/)) cpuCoolerHeights[0].count++
    else if (text.match(/19\d\s*mm/)) cpuCoolerHeights[1].count++
    else if (text.match(/18\d\s*mm/)) cpuCoolerHeights[2].count++
    else if (text.match(/17\d\s*mm/)) cpuCoolerHeights[3].count++
    else if (text.match(/16\d\s*mm/)) cpuCoolerHeights[4].count++
  })

  filters.push({
    id: "cpu-coo ler-height",
    label: "CPU쿨러 높이",
    options: cpuCoolerHeights.filter((c) => c.count > 0),
    isOpen: true,
  })

  // 6. 케이스 크기
  const caseSizes = [
    { id: "빅타워", label: "빅타워", count: 0 },
    { id: "미들타워", label: "미들타워", count: 0 },
    { id: "미니타워", label: "미니타워", count: 0 },
    { id: "슬림", label: "슬림", count: 0 },
    { id: "큐브", label: "큐브", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("빅타워") || text.includes("big tower")) caseSizes[0].count++
    if (text.includes("미들타워") || text.includes("middle tower") || text.includes("mid tower")) caseSizes[1].count++
    if (text.includes("미니타워") || text.includes("mini tower")) caseSizes[2].count++
    if (text.includes("슬림") || text.includes("slim")) caseSizes[3].count++
    if (text.includes("큐브") || text.includes("cube")) caseSizes[4].count++
  })

  filters.push({
    id: "case-size",
    label: "케이스 크기",
    options: caseSizes.filter((c) => c.count > 0),
    isOpen: true,
  })

  // 7. 지원파워규격
  const powerSupports = [
    { id: "atx", label: "ATX", count: 0 },
    { id: "sfx", label: "SFX", count: 0 },
    { id: "tfx", label: "TFX", count: 0 },
    { id: "flex-atx", label: "Flex ATX", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("atx") && !text.includes("flex")) powerSupports[0].count++
    if (text.includes("sfx")) powerSupports[1].count++
    if (text.includes("tfx")) powerSupports[2].count++
    if (text.includes("flex atx") || text.includes("flex-atx")) powerSupports[3].count++
  })

  filters.push({
    id: "power-support",
    label: "지원파워규격",
    options: powerSupports.filter((p) => p.count > 0),
    isOpen: true,
  })

  return filters
}

// 메인보드 전용 필터 생성
function generateMbFilters(components: FirebaseComponentData[]): FilterCategory[] {
  const filters: FilterCategory[] = []

  // 1. 제조사 필터
  const manufacturers = [
    { id: "msi", label: "MSI", count: 0 },
    { id: "asus", label: "ASUS", count: 0 },
    { id: "gigabyte", label: "GIGABYTE", count: 0 },
    { id: "asrock", label: "ASRock", count: 0 },
    { id: "biostar", label: "BIOSTAR", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("msi")) manufacturers[0].count++
    if (text.includes("asus")) manufacturers[1].count++
    if (text.includes("gigabyte")) manufacturers[2].count++
    if (text.includes("asrock")) manufacturers[3].count++
    if (text.includes("biostar")) manufacturers[4].count++
  })

  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  // 2. 제품 분류
  const productTypes = [
    { id: "인텔-메인보드", label: "인텔 메인보드", count: 0 },
    { id: "amd-메인보드", label: "AMD 메인보드", count: 0 },
    { id: "서버-메인보드", label: "서버 메인보드", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("intel") || text.includes("인텔") || text.includes("lga")) productTypes[0].count++
    if (text.includes("amd") || text.includes("am4") || text.includes("am5")) productTypes[1].count++
    if (text.includes("서버") || text.includes("server")) productTypes[2].count++
  })

  filters.push({
    id: "product-type",
    label: "제품 분류",
    options: productTypes.filter((p) => p.count > 0),
    isOpen: true,
  })

  // 3. CPU 소켓
  const cpuSockets = [
    { id: "인텔-소켓1851", label: "인텔 소켓1851", count: 0 },
    { id: "인텔-소켓1700", label: "인텔 소켓1700", count: 0 },
    { id: "인텔-소켓1200", label: "인텔 소켓1200", count: 0 },
    { id: "amd-소켓am5", label: "AMD 소켓AM5", count: 0 },
    { id: "amd-소켓am4", label: "AMD 소켓AM4", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("1851") || text.includes("lga1851")) cpuSockets[0].count++
    if (text.includes("1700") || text.includes("lga1700")) cpuSockets[1].count++
    if (text.includes("1200") || text.includes("lga1200")) cpuSockets[2].count++
    if (text.includes("am5")) cpuSockets[3].count++
    if (text.includes("am4")) cpuSockets[4].count++
  })

  filters.push({
    id: "cpu-socket",
    label: "CPU 소켓",
    options: cpuSockets.filter((s) => s.count > 0),
    isOpen: true,
  })

  // 4. 세부 칩셋
  const chipsets = [
    { id: "z890", label: "Z890", count: 0 },
    { id: "b860", label: "B860", count: 0 },
    { id: "h810", label: "H810", count: 0 },
    { id: "z790", label: "Z790", count: 0 },
    { id: "b760", label: "B760", count: 0 },
    { id: "h770", label: "H770", count: 0 },
    { id: "x870e", label: "X870E", count: 0 },
    { id: "x870", label: "X870", count: 0 },
    { id: "b850", label: "B850", count: 0 },
    { id: "x670e", label: "X670E", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("z890")) chipsets[0].count++
    if (text.includes("b860")) chipsets[1].count++
    if (text.includes("h810")) chipsets[2].count++
    if (text.includes("z790")) chipsets[3].count++
    if (text.includes("b760")) chipsets[4].count++
    if (text.includes("h770")) chipsets[5].count++
    if (text.includes("x870e")) chipsets[6].count++
    if (text.includes("x870") && !text.includes("x870e")) chipsets[7].count++
    if (text.includes("b850")) chipsets[8].count++
    if (text.includes("x670e")) chipsets[9].count++
  })

  filters.push({
    id: "chipset",
    label: "세부 칩셋",
    options: chipsets.filter((c) => c.count > 0),
    isOpen: true,
  })

  // 5. 메모리 종류
  const memoryTypes = [
    { id: "ddr5", label: "DDR5", count: 0 },
    { id: "ddr4", label: "DDR4", count: 0 },
    { id: "ddr5-ddr4", label: "DDR5, DDR4", count: 0 },
    { id: "ddr3", label: "DDR3", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("ddr5") && text.includes("ddr4")) memoryTypes[2].count++
    else if (text.includes("ddr5")) memoryTypes[0].count++
    else if (text.includes("ddr4")) memoryTypes[1].count++
    else if (text.includes("ddr3")) memoryTypes[3].count++
  })

  filters.push({
    id: "memory-type",
    label: "메모리 종류",
    options: memoryTypes.filter((m) => m.count > 0),
    isOpen: true,
  })

  // 6. VGA 연결
  const vgaConnections = [
    { id: "pcie50x16", label: "PCIe5.0 x16", count: 0 },
    { id: "pcie40x16", label: "PCIe4.0 x16", count: 0 },
    { id: "pcie30x16", label: "PCIe3.0 x16", count: 0 },
    { id: "pcie20x16", label: "PCIe2.0 x16", count: 0 },
    { id: "agp", label: "AGP", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("pcie5.0") || text.includes("pcie 5.0")) vgaConnections[0].count++
    if (text.includes("pcie4.0") || text.includes("pcie 4.0")) vgaConnections[1].count++
    if (text.includes("pcie3.0") || text.includes("pcie 3.0")) vgaConnections[2].count++
    if (text.includes("pcie2.0") || text.includes("pcie 2.0")) vgaConnections[3].count++
    if (text.includes("agp")) vgaConnections[4].count++
  })

  filters.push({
    id: "vga-connection",
    label: "VGA 연결",
    options: vgaConnections.filter((v) => v.count > 0),
    isOpen: true,
  })

  // 7. 폼팩터
  const formFactors = [
    { id: "atx", label: "ATX", count: 0 },
    { id: "m-atx", label: "M-ATX", count: 0 },
    { id: "mini-itx", label: "Mini-ITX", count: 0 },
    { id: "e-atx", label: "E-ATX", count: 0 },
    { id: "xl-atx", label: "XL-ATX", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("atx") && !text.includes("m-atx") && !text.includes("mini") && !text.includes("e-atx"))
      formFactors[0].count++
    if (text.includes("m-atx") || text.includes("matx")) formFactors[1].count++
    if (text.includes("mini-itx") || text.includes("mini itx")) formFactors[2].count++
    if (text.includes("e-atx") || text.includes("eatx")) formFactors[3].count++
    if (text.includes("xl-atx") || text.includes("xlatx")) formFactors[4].count++
  })

  filters.push({
    id: "form-factor",
    label: "폼팩터",
    options: formFactors.filter((f) => f.count > 0),
    isOpen: true,
  })

  return filters
}

// 쿨러 전용 필터 생성
function generateCoolerFilters(components: FirebaseComponentData[]): FilterCategory[] {
  const filters: FilterCategory[] = []

  // 1. 제조사 필터
  const manufacturers = [
    { id: "써모랩", label: "써모랩", count: 0 },
    { id: "잘만", label: "잘만", count: 0 },
    { id: "쿨러마스터", label: "쿨러마스터", count: 0 },
    { id: "녹투아", label: "녹투아", count: 0 },
    { id: "딥쿨", label: "딥쿨", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("써모랩") || text.includes("thermolab")) manufacturers[0].count++
    if (text.includes("잘만") || text.includes("zalman")) manufacturers[1].count++
    if (text.includes("쿨러마스터") || text.includes("cooler master")) manufacturers[2].count++
    if (text.includes("녹투아") || text.includes("noctua")) manufacturers[3].count++
    if (text.includes("딥쿨") || text.includes("deepcool")) manufacturers[4].count++
  })

  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  // 2. 제품 종류
  const productTypes = [
    { id: "cpu-쿨러", label: "CPU 쿨러", count: 0 },
    { id: "케이스-쿨러", label: "케이스 쿨러", count: 0 },
    { id: "vga-쿨러", label: "VGA 쿨러", count: 0 },
    { id: "메모리-쿨러", label: "메모리 쿨러", count: 0 },
    { id: "hdd-쿨러", label: "HDD 쿨러", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("cpu") && text.includes("쿨러")) productTypes[0].count++
    if (text.includes("케이스") && text.includes("쿨러")) productTypes[1].count++
    if (text.includes("vga") && text.includes("쿨러")) productTypes[2].count++
    if (text.includes("메모리") && text.includes("쿨러")) productTypes[3].count++
    if (text.includes("hdd") && text.includes("쿨러")) productTypes[4].count++
  })

  filters.push({
    id: "product-type",
    label: "제품 종류",
    options: productTypes.filter((p) => p.count > 0),
    isOpen: true,
  })

  // 3. 냉각 방식
  const coolingTypes = [
    { id: "공랭", label: "공랭", count: 0 },
    { id: "수랭", label: "수랭", count: 0 },
    { id: "하이브리드", label: "하이브리드", count: 0 },
    { id: "팬리스", label: "팬리스", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("공랭") || text.includes("air cooling")) coolingTypes[0].count++
    if (text.includes("수랭") || text.includes("water cooling") || text.includes("aio")) coolingTypes[1].count++
    if (text.includes("하이브리드") || text.includes("hybrid")) coolingTypes[2].count++
    if (text.includes("팬리스") || text.includes("fanless")) coolingTypes[3].count++
  })

  filters.push({
    id: "cooling-type",
    label: "냉각 방식",
    options: coolingTypes.filter((c) => c.count > 0),
    isOpen: true,
  })

  // 4. A/S기간
  const warrantyPeriods = [
    { id: "5년", label: "5년", count: 0 },
    { id: "3년", label: "3년", count: 0 },
    { id: "2년", label: "2년", count: 0 },
    { id: "1년", label: "1년", count: 0 },
    { id: "6개월", label: "6개월", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("5년") || text.includes("5 year")) warrantyPeriods[0].count++
    if (text.includes("3년") || text.includes("3 year")) warrantyPeriods[1].count++
    if (text.includes("2년") || text.includes("2 year")) warrantyPeriods[2].count++
    if (text.includes("1년") || text.includes("1 year")) warrantyPeriods[3].count++
    if (text.includes("6개월") || text.includes("6 month")) warrantyPeriods[4].count++
  })

  filters.push({
    id: "warranty-period",
    label: "A/S기간",
    options: warrantyPeriods.filter((w) => w.count > 0),
    isOpen: true,
  })

  // 5. 인텔 소켓
  const intelSockets = [
    { id: "소켓1851", label: "소켓1851", count: 0 },
    { id: "소켓1700", label: "소켓1700", count: 0 },
    { id: "소켓1200", label: "소켓1200", count: 0 },
    { id: "소켓1151", label: "소켓1151", count: 0 },
    { id: "소켓1150", label: "소켓1150", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("1851") || text.includes("lga1851")) intelSockets[0].count++
    if (text.includes("1700") || text.includes("lga1700")) intelSockets[1].count++
    if (text.includes("1200") || text.includes("lga1200")) intelSockets[2].count++
    if (text.includes("1151") || text.includes("lga1151")) intelSockets[3].count++
    if (text.includes("1150") || text.includes("lga1150")) intelSockets[4].count++
  })

  filters.push({
    id: "intel-socket",
    label: "인텔 소켓",
    options: intelSockets.filter((s) => s.count > 0),
    isOpen: true,
  })

  // 6. AMD 소켓
  const amdSockets = [
    { id: "소켓am5", label: "소켓AM5", count: 0 },
    { id: "소켓am4", label: "소켓AM4", count: 0 },
    { id: "소켓am3", label: "소켓AM3", count: 0 },
    { id: "소켓fm2", label: "소켓FM2", count: 0 },
    { id: "소켓tr4", label: "소켓TR4", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("am5")) amdSockets[0].count++
    if (text.includes("am4")) amdSockets[1].count++
    if (text.includes("am3")) amdSockets[2].count++
    if (text.includes("fm2")) amdSockets[3].count++
    if (text.includes("tr4")) amdSockets[4].count++
  })

  filters.push({
    id: "amd-socket",
    label: "AMD 소켓",
    options: amdSockets.filter((s) => s.count > 0),
    isOpen: true,
  })

  // 7. 높이
  const heights = [
    { id: "200mm-이상", label: "200mm 이상", count: 0 },
    { id: "180199mm", label: "180~199mm", count: 0 },
    { id: "160179mm", label: "160~179mm", count: 0 },
    { id: "140159mm", label: "140~159mm", count: 0 },
    { id: "120139mm", label: "120~139mm", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    // 높이 정보 추출
    const heightMatch = text.match(/(\d+)mm/)
    if (heightMatch) {
      const height = Number.parseInt(heightMatch[1])
      if (height >= 200) heights[0].count++
      else if (height >= 180) heights[1].count++
      else if (height >= 160) heights[2].count++
      else if (height >= 140) heights[3].count++
      else if (height >= 120) heights[4].count++
    }
  })

  filters.push({
    id: "height",
    label: "높이",
    options: heights.filter((h) => h.count > 0),
    isOpen: true,
  })

  return filters
}

// 파워 전용 필터 생성
function generatePowerFilters(components: FirebaseComponentData[]): FilterCategory[] {
  const filters: FilterCategory[] = []

  // 1. 제조사 필터
  const manufacturers = [
    { id: "마이크로닉스", label: "마이크로닉스", count: 0 },
    { id: "시소닉", label: "시소닉", count: 0 },
    { id: "쿨러마스터", label: "쿨러마스터", count: 0 },
    { id: "corsair", label: "Corsair", count: 0 },
    { id: "antec", label: "Antec", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("마이크로닉스") || text.includes("micronics")) manufacturers[0].count++
    if (text.includes("시소닉") || text.includes("seasonic")) manufacturers[1].count++
    if (text.includes("쿨러마스터") || text.includes("cooler master")) manufacturers[2].count++
    if (text.includes("corsair")) manufacturers[3].count++
    if (text.includes("antec")) manufacturers[4].count++
  })

  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  // 2. 제품 분류
  const productTypes = [
    { id: "atx", label: "ATX", count: 0 },
    { id: "sfx", label: "SFX", count: 0 },
    { id: "tfx", label: "TFX", count: 0 },
    { id: "flex-atx", label: "Flex ATX", count: 0 },
    { id: "1u", label: "1U", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("atx") && !text.includes("flex")) productTypes[0].count++
    if (text.includes("sfx")) productTypes[1].count++
    if (text.includes("tfx")) productTypes[2].count++
    if (text.includes("flex atx") || text.includes("flex-atx")) productTypes[3].count++
    if (text.includes("1u")) productTypes[4].count++
  })

  filters.push({
    id: "product-type",
    label: "제품 분류",
    options: productTypes.filter((p) => p.count > 0),
    isOpen: true,
  })

  // 3. 정격출력
  const powerOutputs = [
    { id: "1500w-이상", label: "1500W 이상", count: 0 },
    { id: "1200w1499w", label: "1200W~1499W", count: 0 },
    { id: "1000w1199w", label: "1000W~1199W", count: 0 },
    { id: "850w999w", label: "850W~999W", count: 0 },
    { id: "750w849w", label: "750W~849W", count: 0 },
    { id: "650w749w", label: "650W~749W", count: 0 },
    { id: "550w649w", label: "550W~649W", count: 0 },
    { id: "450w549w", label: "450W~549W", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    // 정격출력 추출
    const powerMatch = text.match(/(\d+)w/)
    if (powerMatch) {
      const power = Number.parseInt(powerMatch[1])
      if (power >= 1500) powerOutputs[0].count++
      else if (power >= 1200) powerOutputs[1].count++
      else if (power >= 1000) powerOutputs[2].count++
      else if (power >= 850) powerOutputs[3].count++
      else if (power >= 750) powerOutputs[4].count++
      else if (power >= 650) powerOutputs[5].count++
      else if (power >= 550) powerOutputs[6].count++
      else if (power >= 450) powerOutputs[7].count++
    }
  })

  filters.push({
    id: "power-output",
    label: "정격출력",
    options: powerOutputs.filter((p) => p.count > 0),
    isOpen: true,
  })

  // 4. 80PLUS인증
  const plus80Certifications = [
    { id: "80plus-titanium", label: "80PLUS Titanium", count: 0 },
    { id: "80plus-platinum", label: "80PLUS Platinum", count: 0 },
    { id: "80plus-gold", label: "80PLUS Gold", count: 0 },
    { id: "80plus-silver", label: "80PLUS Silver", count: 0 },
    { id: "80plus-bronze", label: "80PLUS Bronze", count: 0 },
    { id: "80plus-white", label: "80PLUS White", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("titanium") || text.includes("티타늄")) plus80Certifications[0].count++
    if (text.includes("platinum") || text.includes("플래티넘")) plus80Certifications[1].count++
    if (text.includes("gold") || text.includes("골드")) plus80Certifications[2].count++
    if (text.includes("silver") || text.includes("실버")) plus80Certifications[3].count++
    if (text.includes("bronze") || text.includes("브론즈")) plus80Certifications[4].count++
    if (text.includes("white") || text.includes("화이트")) plus80Certifications[5].count++
  })

  filters.push({
    id: "80plus-certification",
    label: "80PLUS인증",
    options: plus80Certifications.filter((c) => c.count > 0),
    isOpen: true,
  })

  // 5. 케이블연결
  const cableTypes = [
    { id: "풀모듈러", label: "풀모듈러", count: 0 },
    { id: "세미모듈러", label: "세미모듈러", count: 0 },
    { id: "논모듈러", label: "논모듈러", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("풀모듈러") || text.includes("full modular")) cableTypes[0].count++
    if (text.includes("세미모듈러") || text.includes("semi modular")) cableTypes[1].count++
    if (text.includes("논모듈러") || text.includes("non modular")) cableTypes[2].count++
  })

  filters.push({
    id: "cable-type",
    label: "케이블연결",
    options: cableTypes.filter((c) => c.count > 0),
    isOpen: true,
  })

  // 6. ETA인증
  const etaCertifications = [
    { id: "eta-a", label: "ETA-A", count: 0 },
    { id: "eta-b", label: "ETA-B", count: 0 },
    { id: "eta-c", label: "ETA-C", count: 0 },
    { id: "eta-미인증", label: "ETA 미인증", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("eta-a") || text.includes("eta a")) etaCertifications[0].count++
    if (text.includes("eta-b") || text.includes("eta b")) etaCertifications[1].count++
    if (text.includes("eta-c") || text.includes("eta c")) etaCertifications[2].count++
    if (text.includes("eta 미인증") || text.includes("eta 없음")) etaCertifications[3].count++
  })

  filters.push({
    id: "eta-certification",
    label: "ETA인증",
    options: etaCertifications.filter((e) => e.count > 0),
    isOpen: true,
  })

  // 7. LAMBDA인증
  const lambdaCertifications = [
    { id: "lambda-a", label: "LAMBDA-A", count: 0 },
    { id: "lambda-b", label: "LAMBDA-B", count: 0 },
    { id: "lambda-c", label: "LAMBDA-C", count: 0 },
    { id: "lambda-미인증", label: "LAMBDA 미인증", count: 0 },
  ]

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    if (text.includes("lambda-a") || text.includes("lambda a")) lambdaCertifications[0].count++
    if (text.includes("lambda-b") || text.includes("lambda b")) lambdaCertifications[1].count++
    if (text.includes("lambda-c") || text.includes("lambda c")) lambdaCertifications[2].count++
    if (text.includes("lambda 미인증") || text.includes("lambda 없음")) lambdaCertifications[3].count++
  })

  filters.push({
    id: "lambda-certification",
    label: "LAMBDA인증",
    options: lambdaCertifications.filter((l) => l.count > 0),
    isOpen: true,
  })

  return filters
}

// 기본 제조사 필터 생성
function generateManufacturerFilter(components: FirebaseComponentData[]): FilterCategory {
  const manufacturerCounts: Record<string, number> = {}

  components.forEach((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    // 주요 제조사들 추출
    const manufacturers = [
      "삼성",
      "lg",
      "msi",
      "asus",
      "gigabyte",
      "asrock",
      "intel",
      "amd",
      "nvidia",
      "corsair",
      "gskill",
      "crucial",
      "western digital",
      "seagate",
      "antec",
      "cooler master",
      "noctua",
      "be quiet",
      "fractal design",
      "lian li",
      "thermaltake",
      "evga",
      "seasonic",
      "silverstone",
      "phanteks",
    ]

    manufacturers.forEach((manufacturer) => {
      if (text.includes(manufacturer.toLowerCase())) {
        manufacturerCounts[manufacturer] = (manufacturerCounts[manufacturer] || 0) + 1
      }
    })
  })

  const options = Object.entries(manufacturerCounts)
    .map(([manufacturer, count]) => ({
      id: manufacturer.toLowerCase().replace(/\s+/g, "-"),
      label: manufacturer,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // 상위 10개만

  return {
    id: "manufacturer",
    label: "제조사",
    options,
    isOpen: true,
  }
}

// 기본 가격대 필터 생성
function generatePriceRangeFilter(components: FirebaseComponentData[]): FilterCategory {
  const priceRanges = [
    { id: "under-50000", label: "5만원 미만", min: 0, max: 50000, count: 0 },
    { id: "50000-100000", label: "5만원 ~ 10만원", min: 50000, max: 100000, count: 0 },
    { id: "100000-200000", label: "10만원 ~ 20만원", min: 100000, max: 200000, count: 0 },
    { id: "200000-300000", label: "20만원 ~ 30만원", min: 200000, max: 300000, count: 0 },
    { id: "300000-500000", label: "30만원 ~ 50만원", min: 300000, max: 500000, count: 0 },
    { id: "over-500000", label: "50만원 이상", min: 500000, max: Number.POSITIVE_INFINITY, count: 0 },
  ]

  components.forEach((component) => {
    const price = component.price || 0
    priceRanges.forEach((range) => {
      if (price >= range.min && price < range.max) {
        range.count++
      }
    })
  })

  return {
    id: "price-range",
    label: "가격대",
    options: priceRanges
      .filter((range) => range.count > 0)
      .map((range) => ({
        id: range.id,
        label: range.label,
        count: range.count,
      })),
    isOpen: true,
  }
}

// 필터 적용 함수
export function applyFilters(
  components: FirebaseComponentData[],
  filters: FilterState,
  category: string,
): FirebaseComponentData[] {
  if (!components || components.length === 0) return []

  return components.filter((component) => {
    const text = `${component.name} ${component.description || ""} ${component.specs || ""}`.toLowerCase()

    // 각 필터 카테고리별로 체크
    for (const [filterId, selectedOptions] of Object.entries(filters)) {
      if (selectedOptions.length === 0) continue

      let matchesFilter = false

      switch (filterId) {
        case "manufacturer":
          matchesFilter = selectedOptions.some((option) => {
            if (option === "인텔") {
              return (
                text.includes("intel") ||
                text.includes("인텔") ||
                text.includes("core") ||
                text.includes("코어") ||
                text.includes("i3") ||
                text.includes("i5") ||
                text.includes("i7") ||
                text.includes("i9")
              )
            }
            if (option === "amd") {
              return (
                text.includes("amd") ||
                text.includes("ryzen") ||
                text.includes("라이젠") ||
                text.includes("epyc") ||
                text.includes("threadripper")
              )
            }
            return text.includes(option.toLowerCase())
          })
          break

        case "chipset-manufacturer":
          matchesFilter = selectedOptions.some((option) => {
            if (option === "nvidia") {
              return text.includes("nvidia") || text.includes("rtx") || text.includes("gtx")
            }
            if (option === "amdati") {
              return text.includes("amd") || text.includes("radeon") || text.includes("rx")
            }
            if (option === "intel") {
              return text.includes("intel") || text.includes("arc")
            }
            return text.includes(option.toLowerCase())
          })
          break

        case "intel-cpu-type":
        case "amd-cpu-type":
        case "nvidia-chipset":
        case "amd-chipset":
        case "intel-chipset":
          matchesFilter = selectedOptions.some((option) => {
            const optionText = option.toLowerCase().replace(/[-\s]/g, "")
            const componentText = text.replace(/[-\s]/g, "")
            return componentText.includes(optionText)
          })
          break

        case "socket":
        case "cpu-socket":
        case "intel-socket":
        case "amd-socket":
          matchesFilter = selectedOptions.some((option) => {
            if (option.includes("1851")) return text.includes("1851") || text.includes("lga1851")
            if (option.includes("1700")) return text.includes("1700") || text.includes("lga1700")
            if (option.includes("1200")) return text.includes("1200") || text.includes("lga1200")
            if (option.includes("am5")) return text.includes("am5")
            if (option.includes("am4")) return text.includes("am4")
            return text.includes(option.toLowerCase())
          })
          break

        case "core-count":
        case "thread-count":
          matchesFilter = selectedOptions.some((option) => {
            return text.includes(option.toLowerCase())
          })
          break

        case "memory-type":
        case "memory-capacity":
        case "clock-speed":
        case "timing":
        case "voltage":
          matchesFilter = selectedOptions.some((option) => {
            return text.includes(option.toLowerCase().replace(/[-\s]/g, ""))
          })
          break

        case "form-factor":
        case "interface":
        case "protocol":
        case "capacity":
        case "nand-structure":
          matchesFilter = selectedOptions.some((option) => {
            return text.includes(option.toLowerCase())
          })
          break

        case "case-type":
        case "board-support":
        case "case-size":
        case "power-support":
          matchesFilter = selectedOptions.some((option) => {
            return text.includes(option.toLowerCase())
          })
          break

        case "product-type":
        case "chipset":
        case "vga-connection":
          matchesFilter = selectedOptions.some((option) => {
            return text.includes(option.toLowerCase())
          })
          break

        case "cooling-type":
        case "warranty-period":
        case "height":
          matchesFilter = selectedOptions.some((option) => {
            return text.includes(option.toLowerCase())
          })
          break

        case "power-output":
        case "80plus-certification":
        case "cable-type":
        case "eta-certification":
        case "lambda-certification":
          matchesFilter = selectedOptions.some((option) => {
            return text.includes(option.toLowerCase())
          })
          break

        case "price-range":
          matchesFilter = selectedOptions.some((option) => {
            const price = component.price || 0
            switch (option) {
              case "under-50000":
                return price < 50000
              case "50000-100000":
                return price >= 50000 && price < 100000
              case "100000-200000":
                return price >= 100000 && price < 200000
              case "200000-300000":
                return price >= 200000 && price < 300000
              case "300000-500000":
                return price >= 300000 && price < 500000
              case "over-500000":
                return price >= 500000
              default:
                return false
            }
          })
          break

        default:
          // 기타 필터들은 단순 텍스트 매칭
          matchesFilter = selectedOptions.some((option) => text.includes(option.toLowerCase()))
          break
      }

      if (!matchesFilter) {
        return false
      }
    }

    return true
  })
}
