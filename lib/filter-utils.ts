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

// 텍스트 정규화 함수
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ") // 여러 공백을 하나로
    .replace(/[^\w\s가-힣]/g, "") // 특수문자 제거 (한글, 영문, 숫자, 공백만 유지)
    .trim()
}

// CPU 전용 필터 생성 - 확장된 버전
function generateCpuFilters(components: FirebaseComponentData[]): FilterCategory[] {
  const filters: FilterCategory[] = []

  // 디버깅을 위해 샘플 데이터 출력
  console.log("=== CPU 필터 생성 디버깅 ===")
  console.log("샘플 컴포넌트 (처음 5개):")
  components.slice(0, 5).forEach((comp, index) => {
    console.log(`${index + 1}. ${comp.name}`)
    console.log(`   설명: ${comp.description || "없음"}`)
    console.log(`   스펙: ${comp.specs || "없음"}`)
  })

  // 1. 제조사 필터 - 인텔과 AMD만 표시
  const manufacturers = [
    { id: "인텔", label: "인텔", count: 0 },
    { id: "amd", label: "AMD", count: 0 },
  ]

  components.forEach((component) => {
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    // AMD 제품 먼저 체크 (더 구체적인 조건)
    const isAmd =
      text.includes("amd") ||
      text.includes("ryzen") ||
      text.includes("라이젠") ||
      text.includes("epyc") ||
      text.includes("threadripper") ||
      text.includes("스레드리퍼") ||
      text.includes("athlon") ||
      text.includes("애슬론")

    // Intel 제품 체크 (AMD가 아닌 경우에만)
    const isIntel =
      !isAmd &&
      (text.includes("intel") ||
        text.includes("인텔") ||
        (text.includes("core") && !text.includes("라이젠")) ||
        (text.includes("코어") && !text.includes("라이젠")) ||
        text.includes("i3") ||
        text.includes("i5") ||
        text.includes("i7") ||
        text.includes("i9") ||
        text.includes("xeon") ||
        text.includes("제온") ||
        text.includes("ultra") ||
        text.includes("울트라"))

    if (isIntel) {
      manufacturers[0].count++
    }

    if (isAmd) {
      manufacturers[1].count++
    }
  })

  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  // 2. 인텔 CPU종류 - 확장된 버전
  const intelCpuTypes = [
    { id: "코어-울트라9s2", label: "코어 울트라9(S2)", count: 0, keywords: ["ultra 9", "울트라9", "core ultra 9"] },
    { id: "코어-울트라7s2", label: "코어 울트라7(S2)", count: 0, keywords: ["ultra 7", "울트라7", "core ultra 7"] },
    { id: "코어-울트라5s2", label: "코어 울트라5(S2)", count: 0, keywords: ["ultra 5", "울트라5", "core ultra 5"] },
    { id: "코어i9-15세대", label: "코어i9-15세대", count: 0, keywords: ["i9 15", "i9-15", "15세대", "15th gen"] },
    { id: "코어i7-15세대", label: "코어i7-15세대", count: 0, keywords: ["i7 15", "i7-15", "15세대", "15th gen"] },
    { id: "코어i5-15세대", label: "코어i5-15세대", count: 0, keywords: ["i5 15", "i5-15", "15세대", "15th gen"] },
    { id: "코어i3-15세대", label: "코어i3-15세대", count: 0, keywords: ["i3 15", "i3-15", "15세대", "15th gen"] },
    { id: "코어i9-14세대", label: "코어i9-14세대", count: 0, keywords: ["i9 14", "i9-14", "14세대", "14th gen"] },
    { id: "코어i7-14세대", label: "코어i7-14세대", count: 0, keywords: ["i7 14", "i7-14", "14세대", "14th gen"] },
    { id: "코어i5-14세대", label: "코어i5-14세대", count: 0, keywords: ["i5 14", "i5-14", "14세대", "14th gen"] },
    { id: "코어i3-14세대", label: "코어i3-14세대", count: 0, keywords: ["i3 14", "i3-14", "14세대", "14th gen"] },
    { id: "코어i9-13세대", label: "코어i9-13세대", count: 0, keywords: ["i9 13", "i9-13", "13세대", "13th gen"] },
    { id: "코어i7-13세대", label: "코어i7-13세대", count: 0, keywords: ["i7 13", "i7-13", "13세대", "13th gen"] },
    { id: "코어i5-13세대", label: "코어i5-13세대", count: 0, keywords: ["i5 13", "i5-13", "13세대", "13th gen"] },
    { id: "코어i3-13세대", label: "코어i3-13세대", count: 0, keywords: ["i3 13", "i3-13", "13세대", "13th gen"] },
    { id: "코어i9-12세대", label: "코어i9-12세대", count: 0, keywords: ["i9 12", "i9-12", "12세대", "12th gen"] },
    { id: "코어i7-12세대", label: "코어i7-12세대", count: 0, keywords: ["i7 12", "i7-12", "12세대", "12th gen"] },
    { id: "코어i5-12세대", label: "코어i5-12세대", count: 0, keywords: ["i5 12", "i5-12", "12세대", "12th gen"] },
    { id: "코어i3-12세대", label: "코어i3-12세대", count: 0, keywords: ["i3 12", "i3-12", "12세대", "12th gen"] },
    { id: "코어i9-11세대", label: "코어i9-11세대", count: 0, keywords: ["i9 11", "i9-11", "11세대", "11th gen"] },
    { id: "코어i7-11세대", label: "코어i7-11세대", count: 0, keywords: ["i7 11", "i7-11", "11세대", "11th gen"] },
    { id: "코어i5-11세대", label: "코어i5-11세대", count: 0, keywords: ["i5 11", "i5-11", "11세대", "11th gen"] },
    { id: "코어i3-11세대", label: "코어i3-11세대", count: 0, keywords: ["i3 11", "i3-11", "11세대", "11th gen"] },
    { id: "코어i9-10세대", label: "코어i9-10세대", count: 0, keywords: ["i9 10", "i9-10", "10세대", "10th gen"] },
    { id: "코어i7-10세대", label: "코어i7-10세대", count: 0, keywords: ["i7 10", "i7-10", "10세대", "10th gen"] },
    { id: "코어i5-10세대", label: "코어i5-10세대", count: 0, keywords: ["i5 10", "i5-10", "10세대", "10th gen"] },
    { id: "코어i3-10세대", label: "코어i3-10세대", count: 0, keywords: ["i3 10", "i3-10", "10세대", "10th gen"] },
    { id: "제온-w", label: "제온-W", count: 0, keywords: ["xeon w", "제온 w", "xeon-w"] },
    { id: "제온-e", label: "제온-E", count: 0, keywords: ["xeon e", "제온 e", "xeon-e"] },
    { id: "제온", label: "제온", count: 0, keywords: ["xeon", "제온"] },
    { id: "펜티엄", label: "펜티엄", count: 0, keywords: ["pentium", "펜티엄"] },
    { id: "셀러론", label: "셀러론", count: 0, keywords: ["celeron", "셀러론"] },
  ]

  // 인텔 CPU 카운팅
  components.forEach((component) => {
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    // AMD 제품 먼저 체크
    const isAmd =
      text.includes("amd") ||
      text.includes("ryzen") ||
      text.includes("라이젠") ||
      text.includes("epyc") ||
      text.includes("threadripper") ||
      text.includes("스레드리퍼") ||
      text.includes("athlon") ||
      text.includes("애슬론")

    // 인텔 제품만 필터링 (AMD가 아닌 경우에만)
    if (isAmd) return

    const isIntel =
      text.includes("intel") ||
      text.includes("인텔") ||
      text.includes("core") ||
      text.includes("코어") ||
      text.includes("i3") ||
      text.includes("i5") ||
      text.includes("i7") ||
      text.includes("i9") ||
      text.includes("xeon") ||
      text.includes("제온") ||
      text.includes("ultra") ||
      text.includes("울트라") ||
      text.includes("pentium") ||
      text.includes("펜티엄") ||
      text.includes("celeron") ||
      text.includes("셀러론")

    if (!isIntel) return

    // 각 CPU 종류 매칭 (하나의 제품은 하나의 카테고리에만 카운트)
    let counted = false

    for (const cpuType of intelCpuTypes) {
      if (counted) break

      for (const keyword of cpuType.keywords) {
        if (text.includes(keyword)) {
          cpuType.count++
          counted = true

          // 울트라 제품 디버깅
          if (keyword.includes("ultra") || keyword.includes("울트라")) {
            console.log(`🔍 울트라 제품 발견: ${component.name}`)
            console.log(`   매칭된 키워드: ${keyword}`)
            console.log(`   정규화된 텍스트: ${text}`)
          }
          break
        }
      }
    }
  })

  filters.push({
    id: "intel-cpu-type",
    label: "인텔 CPU종류",
    options: intelCpuTypes.filter((t) => t.count > 0),
    isOpen: true,
  })

  // 3. AMD CPU종류 - 간단하고 정확한 버전
  const amdCpuTypes = [
    { id: "라이젠9-6세대", label: "라이젠9-6세대", count: 0 },
    { id: "라이젠7-6세대", label: "라이젠7-6세대", count: 0 },
    { id: "라이젠5-6세대", label: "라이젠5-6세대", count: 0 },
    { id: "라이젠3-6세대", label: "라이젠3-6세대", count: 0 },
    { id: "라이젠9-5세대", label: "라이젠9-5세대", count: 0 },
    { id: "라이젠7-5세대", label: "라이젠7-5세대", count: 0 },
    { id: "라이젠5-5세대", label: "라이젠5-5세대", count: 0 },
    { id: "라이젠3-5세대", label: "라이젠3-5세대", count: 0 },
    { id: "라이젠9-4세대", label: "라이젠9-4세대", count: 0 },
    { id: "라이젠7-4세대", label: "라이젠7-4세대", count: 0 },
    { id: "라이젠5-4세대", label: "라이젠5-4세대", count: 0 },
    { id: "라이젠3-4세대", label: "라이젠3-4세대", count: 0 },
    { id: "라이젠9-3세대", label: "라이젠9-3세대", count: 0 },
    { id: "라이젠7-3세대", label: "라이젠7-3세대", count: 0 },
    { id: "라이젠5-3세대", label: "라이젠5-3세대", count: 0 },
    { id: "라이젠3-3세대", label: "라이젠3-3세대", count: 0 },
    { id: "라이젠-스레드리퍼-pro", label: "라이젠 스레드리퍼 PRO", count: 0 },
    { id: "라이젠-스레드리퍼", label: "라이젠 스레드리퍼", count: 0 },
    { id: "epyc", label: "EPYC", count: 0 },
    { id: "애슬론", label: "애슬론", count: 0 },
  ]

  // AMD CPU 카운팅 - 간단한 로직
  components.forEach((component) => {
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    // AMD 제품만 필터링
    const isAmd =
      text.includes("amd") ||
      text.includes("ryzen") ||
      text.includes("라이젠") ||
      text.includes("epyc") ||
      text.includes("threadripper") ||
      text.includes("스레드리퍼") ||
      text.includes("athlon") ||
      text.includes("애슬론")

    if (!isAmd) return

    console.log(`🔍 AMD 제품 분석: ${component.name}`)
    console.log(`   정규화된 텍스트: ${text}`)

    // 각 CPU 종류 매칭 (하나의 제품은 하나의 카테고리에만 카운트)
    let counted = false

    // EPYC 먼저 체크 (가장 구체적)
    if (!counted && text.includes("epyc")) {
      amdCpuTypes.find((t) => t.id === "epyc")!.count++
      counted = true
      console.log(`   -> EPYC로 분류`)
    }

    // 스레드리퍼 체크
    if (!counted && (text.includes("threadripper pro") || text.includes("스레드리퍼 pro"))) {
      amdCpuTypes.find((t) => t.id === "라이젠-스레드리퍼-pro")!.count++
      counted = true
      console.log(`   -> 스레드리퍼 PRO로 분류`)
    }
    if (!counted && (text.includes("threadripper") || text.includes("스레드리퍼"))) {
      amdCpuTypes.find((t) => t.id === "라이젠-스레드리퍼")!.count++
      counted = true
      console.log(`   -> 스레드리퍼로 분류`)
    }

    // 애슬론 체크
    if (!counted && (text.includes("athlon") || text.includes("애슬론"))) {
      amdCpuTypes.find((t) => t.id === "애슬론")!.count++
      counted = true
      console.log(`   -> 애슬론으로 분류`)
    }

    // 라이젠 시리즈 체크 (모델 번호 기반)
    if (!counted && (text.includes("ryzen") || text.includes("라이젠"))) {
      // 모델 번호 추출 (예: 7600X, 5800X, 9950X 등)
      const modelMatch = text.match(/(\d{4})[a-z]*/) // 4자리 숫자 + 선택적 문자

      if (modelMatch) {
        const modelNumber = Number.parseInt(modelMatch[1])
        console.log(`   모델 번호: ${modelNumber}`)

        // 라이젠 시리즈 구분 (Ryzen 3, 5, 7, 9)
        let series = ""
        if (text.includes("ryzen 9") || text.includes("라이젠9")) series = "9"
        else if (text.includes("ryzen 7") || text.includes("라이젠7")) series = "7"
        else if (text.includes("ryzen 5") || text.includes("라이젠5")) series = "5"
        else if (text.includes("ryzen 3") || text.includes("라이젠3")) series = "3"

        if (series) {
          // 세대 구분 (모델 번호 첫 자리로 판단)
          let generation = ""
          if (modelNumber >= 9000)
            generation = "6세대" // 9000 시리즈 = 6세대
          else if (modelNumber >= 7000)
            generation = "5세대" // 7000, 8000 시리즈 = 5세대
          else if (modelNumber >= 5000)
            generation = "4세대" // 5000 시리즈 = 4세대
          else if (modelNumber >= 3000) generation = "3세대" // 3000 시리즈 = 3세대

          if (generation) {
            const cpuTypeId = `라이젠${series}-${generation}`
            const cpuType = amdCpuTypes.find((t) => t.id === cpuTypeId)
            if (cpuType) {
              cpuType.count++
              counted = true
              console.log(`   -> ${cpuType.label}로 분류`)
            }
          }
        }
      }
    }

    if (!counted) {
      console.log(`   -> 분류되지 않음`)
    }
  })

  filters.push({
    id: "amd-cpu-type",
    label: "AMD CPU종류",
    options: amdCpuTypes.filter((t) => t.count > 0),
    isOpen: true,
  })

  // 4. 소켓 구분 - 확장된 버전
  const socketTypes = [
    { id: "인텔소켓1851", label: "인텔(소켓1851)", count: 0, keywords: ["1851", "lga1851"] },
    { id: "인텔소켓1700", label: "인텔(소켓1700)", count: 0, keywords: ["1700", "lga1700"] },
    { id: "인텔소켓1200", label: "인텔(소켓1200)", count: 0, keywords: ["1200", "lga1200"] },
    { id: "인텔소켓1151", label: "인텔(소켓1151)", count: 0, keywords: ["1151", "lga1151"] },
    { id: "인텔소켓1150", label: "인텔(소켓1150)", count: 0, keywords: ["1150", "lga1150"] },
    { id: "인텔소켓2066", label: "인텔(소켓2066)", count: 0, keywords: ["2066", "lga2066"] },
    { id: "amd소켓am5", label: "AMD(소켓AM5)", count: 0, keywords: ["am5"] },
    { id: "amd소켓am4", label: "AMD(소켓AM4)", count: 0, keywords: ["am4"] },
    { id: "amd소켓am3", label: "AMD(소켓AM3)", count: 0, keywords: ["am3"] },
    { id: "amd소켓tr4", label: "AMD(소켓TR4)", count: 0, keywords: ["tr4", "strx4"] },
    { id: "amd소켓sp3", label: "AMD(소켓SP3)", count: 0, keywords: ["sp3"] },
  ]

  components.forEach((component) => {
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    socketTypes.forEach((socketType) => {
      if (socketType.keywords.some((keyword) => text.includes(keyword))) {
        socketType.count++
      }
    })
  })

  filters.push({
    id: "socket",
    label: "소켓 구분",
    options: socketTypes.filter((s) => s.count > 0),
    isOpen: true,
  })

  // 5. 코어 수 - 확장된 버전
  const coreCountTypes = [
    { id: "64코어", label: "64코어", count: 0 },
    { id: "32코어", label: "32코어", count: 0 },
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
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    // 정규식으로 코어 수 추출 (가장 큰 수부터 매칭)
    const coreMatches = text.match(/(\d+)코어/g) || text.match(/(\d+)\s*core/g)
    if (coreMatches && coreMatches.length > 0) {
      // 가장 큰 코어 수만 카운트
      const maxCores = Math.max(...coreMatches.map((match) => Number.parseInt(match.replace(/[^\d]/g, ""))))
      const coreType = coreCountTypes.find((c) => c.label === `${maxCores}코어`)
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

  // 6. 스레드 수 - 확장된 버전
  const threadCountTypes = [
    { id: "128스레드", label: "128스레드", count: 0 },
    { id: "64스레드", label: "64스레드", count: 0 },
    { id: "48스레드", label: "48스레드", count: 0 },
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
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    // 정규식으로 스레드 수 추출
    const threadMatch = text.match(/(\d+)스레드/) || text.match(/(\d+)\s*thread/)
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

  // 7. 메모리 규격 - 확장된 버전
  const memoryTypes = [
    { id: "ddr5", label: "DDR5", count: 0 },
    { id: "ddr5-ddr4", label: "DDR5, DDR4", count: 0 },
    { id: "ddr4", label: "DDR4", count: 0 },
    { id: "ddr4-ddr3l", label: "DDR4, DDR3L", count: 0 },
    { id: "ddr3", label: "DDR3", count: 0 },
    { id: "ddr3l", label: "DDR3L", count: 0 },
    { id: "ddr2", label: "DDR2", count: 0 },
  ]

  components.forEach((component) => {
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    if (text.includes("ddr5") && text.includes("ddr4")) memoryTypes[1].count++
    else if (text.includes("ddr5")) memoryTypes[0].count++
    else if (text.includes("ddr4") && text.includes("ddr3l")) memoryTypes[3].count++
    else if (text.includes("ddr4")) memoryTypes[2].count++
    else if (text.includes("ddr3l")) memoryTypes[5].count++
    else if (text.includes("ddr3")) memoryTypes[4].count++
    else if (text.includes("ddr2")) memoryTypes[6].count++
  })

  filters.push({
    id: "memory-type",
    label: "메모리 규격",
    options: memoryTypes.filter((m) => m.count > 0),
    isOpen: true,
  })

  return filters
}

// VGA(그래픽카드) 전용 필터 생성 - 상세 버전
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

  // 2. 칩셋 제조사
  const chipsetManufacturers = [
    { id: "nvidia", label: "NVIDIA", count: 0 },
    { id: "amdati", label: "AMD(ATI)", count: 0 },
    { id: "intel", label: "Intel", count: 0 },
    { id: "matrox", label: "Matrox", count: 0 },
    { id: "furiosai", label: "FuriosaAI", count: 0 },
  ]

  // 3. 제품 시리즈
  const productSeries = [
    { id: "지포스-rtx-50", label: "지포스 RTX 50", count: 0 },
    { id: "지포스-rtx-40", label: "지포스 RTX 40", count: 0 },
    { id: "지포스-rtx-30", label: "지포스 RTX 30", count: 0 },
    { id: "라데온-rx-9000", label: "라데온 RX 9000", count: 0 },
    { id: "라데온-rx-7000", label: "라데온 RX 7000", count: 0 },
  ]

  // 4. GPU 제조 공정
  const gpuProcess = [
    { id: "4nm", label: "4 nm", count: 0 },
    { id: "8nm", label: "8 nm", count: 0 },
    { id: "12nm", label: "12 nm", count: 0 },
    { id: "14nm", label: "14 nm", count: 0 },
    { id: "16nm", label: "16 nm", count: 0 },
  ]

  // 5. NVIDIA 칩셋
  const nvidiaChipsets = [
    { id: "rtx-5090", label: "RTX 5090", count: 0 },
    { id: "rtx-5080", label: "RTX 5080", count: 0 },
    { id: "rtx-5070", label: "RTX 5070", count: 0 },
    { id: "rtx-5070-ti", label: "RTX 5070 Ti", count: 0 },
    { id: "rtx-5060", label: "RTX 5060", count: 0 },
  ]

  // 6. AMD 칩셋
  const amdChipsets = [
    { id: "rx-9070-xt", label: "RX 9070 XT", count: 0 },
    { id: "rx-9070", label: "RX 9070", count: 0 },
    { id: "rx-7900-xtx", label: "RX 7900 XTX", count: 0 },
    { id: "rx-7800-xt", label: "RX 7800 XT", count: 0 },
    { id: "rx-7700-xt", label: "RX 7700 XT", count: 0 },
  ]

  // 7. 인텔 칩셋
  const intelChipsets = [
    { id: "arc-b580", label: "ARC B580", count: 0 },
    { id: "arc-b570", label: "ARC B570", count: 0 },
    { id: "arc-a770", label: "ARC A770", count: 0 },
    { id: "arc-a750", label: "ARC A750", count: 0 },
    { id: "arc-a380", label: "ARC A380", count: 0 },
  ]

  components.forEach((component) => {
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    // 제조사 카운팅
    if (text.includes("msi")) manufacturers[0].count++
    if (text.includes("palit")) manufacturers[1].count++
    if (text.includes("gigabyte")) manufacturers[2].count++
    if (text.includes("asus")) manufacturers[3].count++
    if (text.includes("이엠텍") || text.includes("emtek")) manufacturers[4].count++

    // 칩셋 제조사 카운팅
    if (text.includes("nvidia") || text.includes("rtx") || text.includes("gtx")) chipsetManufacturers[0].count++
    if (text.includes("amd") || text.includes("radeon") || text.includes("rx")) chipsetManufacturers[1].count++
    if (text.includes("intel") || text.includes("arc")) chipsetManufacturers[2].count++
    if (text.includes("matrox")) chipsetManufacturers[3].count++
    if (text.includes("furiosa")) chipsetManufacturers[4].count++

    // 제품 시리즈 카운팅
    if (text.includes("rtx 50") || text.includes("5090") || text.includes("5080") || text.includes("5070"))
      productSeries[0].count++
    if (text.includes("rtx 40") || text.includes("4090") || text.includes("4080") || text.includes("4070"))
      productSeries[1].count++
    if (text.includes("rtx 30") || text.includes("3090") || text.includes("3080") || text.includes("3070"))
      productSeries[2].count++
    if (text.includes("rx 9") || text.includes("9070")) productSeries[3].count++
    if (text.includes("rx 7") || text.includes("7900") || text.includes("7800") || text.includes("7700"))
      productSeries[4].count++

    // GPU 제조 공정 카운팅
    if (text.includes("4nm")) gpuProcess[0].count++
    if (text.includes("8nm")) gpuProcess[1].count++
    if (text.includes("12nm")) gpuProcess[2].count++
    if (text.includes("14nm")) gpuProcess[3].count++
    if (text.includes("16nm")) gpuProcess[4].count++

    // NVIDIA 칩셋 카운팅
    if (text.includes("5090")) nvidiaChipsets[0].count++
    if (text.includes("5080")) nvidiaChipsets[1].count++
    if (text.includes("5070") && !text.includes("ti")) nvidiaChipsets[2].count++
    if (text.includes("5070 ti")) nvidiaChipsets[3].count++
    if (text.includes("5060")) nvidiaChipsets[4].count++

    // AMD 칩셋 카운팅
    if (text.includes("9070 xt")) amdChipsets[0].count++
    if (text.includes("9070") && !text.includes("xt")) amdChipsets[1].count++
    if (text.includes("7900 xtx")) amdChipsets[2].count++
    if (text.includes("7800 xt")) amdChipsets[3].count++
    if (text.includes("7700 xt")) amdChipsets[4].count++

    // 인텔 칩셋 카운팅
    if (text.includes("b580")) intelChipsets[0].count++
    if (text.includes("b570")) intelChipsets[1].count++
    if (text.includes("a770")) intelChipsets[2].count++
    if (text.includes("a750")) intelChipsets[3].count++
    if (text.includes("a380")) intelChipsets[4].count++
  })

  // 필터 추가
  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "chipset-manufacturer",
    label: "칩셋 제조사",
    options: chipsetManufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "product-series",
    label: "제품 시리즈",
    options: productSeries.filter((s) => s.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "gpu-process",
    label: "GPU 제조 공정",
    options: gpuProcess.filter((p) => p.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "nvidia-chipset",
    label: "NVIDIA 칩셋",
    options: nvidiaChipsets.filter((c) => c.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "amd-chipset",
    label: "AMD 칩셋",
    options: amdChipsets.filter((c) => c.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "intel-chipset",
    label: "인텔 칩셋",
    options: intelChipsets.filter((c) => c.count > 0),
    isOpen: true,
  })

  return filters
}

// 메모리 전용 필터 생성 - 상세 버전
function generateMemoryFilters(components: FirebaseComponentData[]): FilterCategory[] {
  const filters: FilterCategory[] = []

  // 1. 제조사 필터
  const manufacturers = [
    { id: "삼성전자", label: "삼성전자", count: 0 },
    { id: "teamgroup", label: "TeamGroup", count: 0 },
    { id: "마이크론", label: "마이크론", count: 0 },
    { id: "essencore", label: "ESSENCORE", count: 0 },
    { id: "sk하이닉스", label: "SK하이닉스", count: 0 },
  ]

  // 2. 사용 장치
  const usageTypes = [
    { id: "데스크탑용", label: "데스크탑용", count: 0 },
    { id: "노트북용", label: "노트북용", count: 0 },
    { id: "서버용", label: "서버용", count: 0 },
  ]

  // 3. 제품 분류
  const productTypes = [
    { id: "ddr5", label: "DDR5", count: 0 },
    { id: "ddr4", label: "DDR4", count: 0 },
    { id: "ddr3", label: "DDR3", count: 0 },
    { id: "ddr2", label: "DDR2", count: 0 },
  ]

  // 4. 메모리 용량
  const capacities = [
    { id: "64gb", label: "64GB", count: 0 },
    { id: "32gb", label: "32GB", count: 0 },
    { id: "16gb", label: "16GB", count: 0 },
    { id: "8gb", label: "8GB", count: 0 },
    { id: "4gb", label: "4GB", count: 0 },
  ]

  // 5. 동작클럭(대역폭)
  const clockSpeeds = [
    { id: "8800mhz", label: "8800MHz (PC5-70400)", count: 0 },
    { id: "8400mhz", label: "8400MHz (PC5-67200)", count: 0 },
    { id: "8200mhz", label: "8200MHz (PC5-65600)", count: 0 },
    { id: "8000mhz", label: "8000MHz (PC5-64000)", count: 0 },
    { id: "7800mhz", label: "7800MHz (PC5-62400)", count: 0 },
  ]

  // 6. 레이턴시
  const latencies = [
    { id: "cl14", label: "CL14", count: 0 },
    { id: "cl15", label: "CL15", count: 0 },
    { id: "cl16", label: "CL16", count: 0 },
    { id: "cl17", label: "CL17", count: 0 },
    { id: "cl18", label: "CL18", count: 0 },
  ]

  // 7. 동작전압
  const voltages = [
    { id: "1.10v", label: "1.10V", count: 0 },
    { id: "1.20v", label: "1.20V", count: 0 },
    { id: "1.25v", label: "1.25V", count: 0 },
    { id: "1.35v", label: "1.35V", count: 0 },
    { id: "1.50v", label: "1.50V", count: 0 },
  ]

  components.forEach((component) => {
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    // 제조사 카운팅
    if (text.includes("삼성") || text.includes("samsung")) manufacturers[0].count++
    if (text.includes("teamgroup") || text.includes("팀그룹")) manufacturers[1].count++
    if (text.includes("마이크론") || text.includes("micron") || text.includes("crucial")) manufacturers[2].count++
    if (text.includes("essencore")) manufacturers[3].count++
    if (text.includes("sk하이닉스") || text.includes("hynix")) manufacturers[4].count++

    // 사용 장치 카운팅
    if (text.includes("데스크탑") || text.includes("desktop")) usageTypes[0].count++
    if (text.includes("노트북") || text.includes("laptop") || text.includes("sodimm")) usageTypes[1].count++
    if (text.includes("서버") || text.includes("server") || text.includes("ecc")) usageTypes[2].count++

    // 제품 분류 카운팅
    if (text.includes("ddr5")) productTypes[0].count++
    if (text.includes("ddr4")) productTypes[1].count++
    if (text.includes("ddr3")) productTypes[2].count++
    if (text.includes("ddr2")) productTypes[3].count++

    // 메모리 용량 카운팅
    if (text.includes("64gb")) capacities[0].count++
    if (text.includes("32gb")) capacities[1].count++
    if (text.includes("16gb")) capacities[2].count++
    if (text.includes("8gb")) capacities[3].count++
    if (text.includes("4gb")) capacities[4].count++

    // 동작클럭 카운팅
    if (text.includes("8800") || text.includes("pc5-70400")) clockSpeeds[0].count++
    if (text.includes("8400") || text.includes("pc5-67200")) clockSpeeds[1].count++
    if (text.includes("8200") || text.includes("pc5-65600")) clockSpeeds[2].count++
    if (text.includes("8000") || text.includes("pc5-64000")) clockSpeeds[3].count++
    if (text.includes("7800") || text.includes("pc5-62400")) clockSpeeds[4].count++

    // 레이턴시 카운팅
    if (text.includes("cl14")) latencies[0].count++
    if (text.includes("cl15")) latencies[1].count++
    if (text.includes("cl16")) latencies[2].count++
    if (text.includes("cl17")) latencies[3].count++
    if (text.includes("cl18")) latencies[4].count++

    // 동작전압 카운팅
    if (text.includes("1.10v")) voltages[0].count++
    if (text.includes("1.20v")) voltages[1].count++
    if (text.includes("1.25v")) voltages[2].count++
    if (text.includes("1.35v")) voltages[3].count++
    if (text.includes("1.50v")) voltages[4].count++
  })

  // 필터 추가
  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "usage-type",
    label: "사용 장치",
    options: usageTypes.filter((u) => u.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "product-type",
    label: "제품 분류",
    options: productTypes.filter((p) => p.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "capacity",
    label: "메모리 용량",
    options: capacities.filter((c) => c.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "clock-speed",
    label: "동작클럭(대역폭)",
    options: clockSpeeds.filter((c) => c.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "latency",
    label: "레이턴시",
    options: latencies.filter((l) => l.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "voltage",
    label: "동작전압",
    options: voltages.filter((v) => v.count > 0),
    isOpen: true,
  })

  return filters
}

// SSD 전용 필터 생성 - 매우 상세한 버전 (스크린샷 기반)
function generateSsdFilters(components: FirebaseComponentData[]): FilterCategory[] {
  const filters: FilterCategory[] = []

  // 1. 제조사 필터 - 확장된 버전
  const manufacturers = [
    { id: "삼성전자", label: "삼성전자", count: 0 },
    { id: "sk하이닉스", label: "SK하이닉스", count: 0 },
    { id: "마이크론", label: "마이크론", count: 0 },
    { id: "western-digital", label: "Western Digital", count: 0 },
    { id: "adata", label: "ADATA", count: 0 },
    { id: "kingston", label: "Kingston", count: 0 },
    { id: "seagate", label: "Seagate", count: 0 },
    { id: "intel", label: "Intel", count: 0 },
    { id: "sandisk", label: "SanDisk", count: 0 },
    { id: "corsair", label: "Corsair", count: 0 },
    { id: "gigabyte", label: "GIGABYTE", count: 0 },
    { id: "msi", label: "MSI", count: 0 },
    { id: "teamgroup", label: "TeamGroup", count: 0 },
    { id: "patriot", label: "Patriot", count: 0 },
    { id: "pny", label: "PNY", count: 0 },
  ]

  // 2. 폼팩터 - 확장된 버전
  const formFactors = [
    { id: "m2-2280", label: "M.2 (2280)", count: 0 },
    { id: "6.4cm-2.5", label: "6.4cm(2.5형)", count: 0 },
    { id: "m2-2230", label: "M.2 (2230)", count: 0 },
    { id: "m2-2242", label: "M.2 (2242)", count: 0 },
    { id: "mini-sata", label: "Mini SATA(mSATA)", count: 0 },
    { id: "m2-22110", label: "M.2 (22110)", count: 0 },
    { id: "m2-2260", label: "M.2 (2260)", count: 0 },
    { id: "pcie-card", label: "PCIe 카드형", count: 0 },
  ]

  // 3. 인터페이스 - 확장된 버전
  const interfaces = [
    { id: "pcie5.0x4-128g", label: "PCIe5.0×4 (128Gbps)", count: 0 },
    { id: "pcie4.0x4-64g", label: "PCIe4.0×4 (64Gbps)", count: 0 },
    { id: "pcie3.0x4-32g", label: "PCIe3.0×4 (32Gbps)", count: 0 },
    { id: "pcie3.0x2-16g", label: "PCIe3.0×2 (16Gbps)", count: 0 },
    { id: "sata3-6g", label: "SATA3 (6Gb/s)", count: 0 },
    { id: "sata2-3g", label: "SATA2 (3Gb/s)", count: 0 },
    { id: "usb3.0", label: "USB 3.0", count: 0 },
    { id: "thunderbolt", label: "Thunderbolt", count: 0 },
  ]

  // 4. 프로토콜 - 확장된 버전
  const protocols = [
    { id: "nvme-2.0", label: "NVMe 2.0", count: 0 },
    { id: "nvme-1.4", label: "NVMe 1.4", count: 0 },
    { id: "nvme-1.3", label: "NVMe 1.3", count: 0 },
    { id: "nvme-1.2", label: "NVMe 1.2", count: 0 },
    { id: "nvme-1.1", label: "NVMe 1.1", count: 0 },
    { id: "nvme", label: "NVMe", count: 0 },
    { id: "ahci", label: "AHCI", count: 0 },
  ]

  // 5. 용량 - 매우 상세한 버전
  const capacities = [
    { id: "8tb-above", label: "8TB 이상", count: 0 },
    { id: "4tb-7.9tb", label: "4TB~7.9TB", count: 0 },
    { id: "2tb-3.9tb", label: "2TB~3.9TB", count: 0 },
    { id: "1tb-1.9tb", label: "1TB~1.9TB", count: 0 },
    { id: "500gb-999gb", label: "500GB~999GB", count: 0 },
    { id: "250gb-499gb", label: "250GB~499GB", count: 0 },
    { id: "120gb-249gb", label: "120GB~249GB", count: 0 },
    { id: "64gb-119gb", label: "64GB~119GB", count: 0 },
    { id: "32gb-63gb", label: "32GB~63GB", count: 0 },
    { id: "under-32gb", label: "32GB 미만", count: 0 },
  ]

  // 6. 메모리 타입 - 확장된 버전
  const memoryTypes = [
    { id: "tlc", label: "TLC", count: 0 },
    { id: "qlc", label: "QLC", count: 0 },
    { id: "mlc", label: "MLC", count: 0 },
    { id: "slc", label: "SLC", count: 0 },
    { id: "3d-tlc", label: "3D TLC", count: 0 },
    { id: "3d-qlc", label: "3D QLC", count: 0 },
    { id: "3d-mlc", label: "3D MLC", count: 0 },
    { id: "v-nand", label: "V-NAND", count: 0 },
  ]

  // 7. 낸드 구조 - 확장된 버전
  const nandStructures = [
    { id: "3d-nand", label: "3D낸드", count: 0 },
    { id: "2d-nand", label: "2D낸드", count: 0 },
    { id: "v-nand", label: "V-NAND", count: 0 },
    { id: "3d-v-nand", label: "3D V-NAND", count: 0 },
    { id: "planar-nand", label: "Planar NAND", count: 0 },
  ]

  // 8. 읽기 속도 (새로 추가)
  const readSpeeds = [
    { id: "7000mb-above", label: "7,000MB/s 이상", count: 0 },
    { id: "6000-6999mb", label: "6,000~6,999MB/s", count: 0 },
    { id: "5000-5999mb", label: "5,000~5,999MB/s", count: 0 },
    { id: "4000-4999mb", label: "4,000~4,999MB/s", count: 0 },
    { id: "3000-3999mb", label: "3,000~3,999MB/s", count: 0 },
    { id: "2000-2999mb", label: "2,000~2,999MB/s", count: 0 },
    { id: "1000-1999mb", label: "1,000~1,999MB/s", count: 0 },
    { id: "500-999mb", label: "500~999MB/s", count: 0 },
    { id: "under-500mb", label: "500MB/s 미만", count: 0 },
  ]

  // 9. 쓰기 속도 (새로 추가)
  const writeSpeeds = [
    { id: "6000mb-above", label: "6,000MB/s 이상", count: 0 },
    { id: "5000-5999mb", label: "5,000~5,999MB/s", count: 0 },
    { id: "4000-4999mb", label: "4,000~4,999MB/s", count: 0 },
    { id: "3000-3999mb", label: "3,000~3,999MB/s", count: 0 },
    { id: "2000-2999mb", label: "2,000~2,999MB/s", count: 0 },
    { id: "1000-1999mb", label: "1,000~1,999MB/s", count: 0 },
    { id: "500-999mb", label: "500~999MB/s", count: 0 },
    { id: "under-500mb", label: "500MB/s 미만", count: 0 },
  ]

  // 10. DRAM 캐시 (새로 추가)
  const dramCache = [
    { id: "dram-cache", label: "DRAM 캐시", count: 0 },
    { id: "no-dram", label: "DRAM-less", count: 0 },
    { id: "slc-cache", label: "SLC 캐시", count: 0 },
    { id: "hmb", label: "HMB 지원", count: 0 },
  ]

  // 11. 보증 기간 (새로 추가)
  const warrantyPeriods = [
    { id: "10years", label: "10년", count: 0 },
    { id: "7years", label: "7년", count: 0 },
    { id: "5years", label: "5년", count: 0 },
    { id: "3years", label: "3년", count: 0 },
    { id: "2years", label: "2년", count: 0 },
    { id: "1year", label: "1년", count: 0 },
  ]

  // 12. 사용 목적 (새로 추가)
  const usagePurpose = [
    { id: "gaming", label: "게이밍", count: 0 },
    { id: "professional", label: "전문가용", count: 0 },
    { id: "enterprise", label: "기업용", count: 0 },
    { id: "mainstream", label: "일반용", count: 0 },
    { id: "budget", label: "보급형", count: 0 },
    { id: "portable", label: "휴대용", count: 0 },
  ]

  // 13. 내구성 등급 (새로 추가)
  const enduranceRating = [
    { id: "3000tbw-above", label: "3,000TBW 이상", count: 0 },
    { id: "2000-2999tbw", label: "2,000~2,999TBW", count: 0 },
    { id: "1000-1999tbw", label: "1,000~1,999TBW", count: 0 },
    { id: "500-999tbw", label: "500~999TBW", count: 0 },
    { id: "200-499tbw", label: "200~499TBW", count: 0 },
    { id: "100-199tbw", label: "100~199TBW", count: 0 },
    { id: "under-100tbw", label: "100TBW 미만", count: 0 },
  ]

  components.forEach((component) => {
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    // 제조사 카운팅 - 확장된 버전
    if (text.includes("삼성") || text.includes("samsung")) manufacturers[0].count++
    if (text.includes("sk하이닉스") || text.includes("hynix")) manufacturers[1].count++
    if (text.includes("마이크론") || text.includes("micron") || text.includes("crucial")) manufacturers[2].count++
    if (text.includes("western digital") || text.includes("wd")) manufacturers[3].count++
    if (text.includes("adata")) manufacturers[4].count++
    if (text.includes("kingston")) manufacturers[5].count++
    if (text.includes("seagate")) manufacturers[6].count++
    if (text.includes("intel")) manufacturers[7].count++
    if (text.includes("sandisk")) manufacturers[8].count++
    if (text.includes("corsair")) manufacturers[9].count++
    if (text.includes("gigabyte")) manufacturers[10].count++
    if (text.includes("msi")) manufacturers[11].count++
    if (text.includes("teamgroup") || text.includes("팀그룹")) manufacturers[12].count++
    if (text.includes("patriot")) manufacturers[13].count++
    if (text.includes("pny")) manufacturers[14].count++

    // 폼팩터 카운팅 - 확장된 버전
    if (text.includes("m.2") && text.includes("2280")) formFactors[0].count++
    if (text.includes("2.5") || text.includes("6.4cm")) formFactors[1].count++
    if (text.includes("m.2") && text.includes("2230")) formFactors[2].count++
    if (text.includes("m.2") && text.includes("2242")) formFactors[3].count++
    if (text.includes("msata") || text.includes("mini sata")) formFactors[4].count++
    if (text.includes("m.2") && text.includes("22110")) formFactors[5].count++
    if (text.includes("m.2") && text.includes("2260")) formFactors[6].count++
    if (text.includes("pcie") && text.includes("카드")) formFactors[7].count++

    // 인터페이스 카운팅 - 확장된 버전
    if (text.includes("pcie 5.0") || text.includes("pcie5.0")) interfaces[0].count++
    if (text.includes("pcie 4.0") || text.includes("pcie4.0")) interfaces[1].count++
    if (text.includes("pcie 3.0") && text.includes("x4")) interfaces[2].count++
    if (text.includes("pcie 3.0") && text.includes("x2")) interfaces[3].count++
    if (text.includes("sata3") || text.includes("sata 3")) interfaces[4].count++
    if (text.includes("sata2") || text.includes("sata 2")) interfaces[5].count++
    if (text.includes("usb 3.0") || text.includes("usb3.0")) interfaces[6].count++
    if (text.includes("thunderbolt")) interfaces[7].count++

    // 프로토콜 카운팅 - 확장된 버전
    if (text.includes("nvme 2.0")) protocols[0].count++
    if (text.includes("nvme 1.4")) protocols[1].count++
    if (text.includes("nvme 1.3")) protocols[2].count++
    if (text.includes("nvme 1.2")) protocols[3].count++
    if (text.includes("nvme 1.1")) protocols[4].count++
    if (text.includes("nvme")) protocols[5].count++
    if (text.includes("ahci")) protocols[6].count++

    // 용량 카운팅 - 매우 상세한 버전
    const capacityMatch = text.match(/(\d+(?:\.\d+)?)\s*(tb|gb)/i)
    if (capacityMatch) {
      const value = Number.parseFloat(capacityMatch[1])
      const unit = capacityMatch[2].toLowerCase()
      const gbValue = unit === "tb" ? value * 1000 : value

      if (gbValue >= 8000) capacities[0].count++
      else if (gbValue >= 4000) capacities[1].count++
      else if (gbValue >= 2000) capacities[2].count++
      else if (gbValue >= 1000) capacities[3].count++
      else if (gbValue >= 500) capacities[4].count++
      else if (gbValue >= 250) capacities[5].count++
      else if (gbValue >= 120) capacities[6].count++
      else if (gbValue >= 64) capacities[7].count++
      else if (gbValue >= 32) capacities[8].count++
      else capacities[9].count++
    }

    // 메모리 타입 카운팅 - 확장된 버전
    if (text.includes("3d tlc")) memoryTypes[4].count++
    else if (text.includes("tlc")) memoryTypes[0].count++
    if (text.includes("3d qlc")) memoryTypes[5].count++
    else if (text.includes("qlc")) memoryTypes[1].count++
    if (text.includes("3d mlc")) memoryTypes[6].count++
    else if (text.includes("mlc")) memoryTypes[2].count++
    if (text.includes("slc")) memoryTypes[3].count++
    if (text.includes("v-nand")) memoryTypes[7].count++

    // 낸드 구조 카운팅 - 확장된 버전
    if (text.includes("3d v-nand")) nandStructures[3].count++
    else if (text.includes("3d") || text.includes("3d nand")) nandStructures[0].count++
    else if (text.includes("v-nand")) nandStructures[2].count++
    if (text.includes("2d") || text.includes("2d nand")) nandStructures[1].count++
    if (text.includes("planar")) nandStructures[4].count++

    // 읽기 속도 카운팅
    const readSpeedMatch = text.match(/읽기.*?(\d+(?:,\d+)?)\s*mb\/s/i) || text.match(/read.*?(\d+(?:,\d+)?)\s*mb\/s/i)
    if (readSpeedMatch) {
      const speed = Number.parseInt(readSpeedMatch[1].replace(/,/g, ""))
      if (speed >= 7000) readSpeeds[0].count++
      else if (speed >= 6000) readSpeeds[1].count++
      else if (speed >= 5000) readSpeeds[2].count++
      else if (speed >= 4000) readSpeeds[3].count++
      else if (speed >= 3000) readSpeeds[4].count++
      else if (speed >= 2000) readSpeeds[5].count++
      else if (speed >= 1000) readSpeeds[6].count++
      else if (speed >= 500) readSpeeds[7].count++
      else readSpeeds[8].count++
    }

    // 쓰기 속도 카운팅
    const writeSpeedMatch =
      text.match(/쓰기.*?(\d+(?:,\d+)?)\s*mb\/s/i) || text.match(/write.*?(\d+(?:,\d+)?)\s*mb\/s/i)
    if (writeSpeedMatch) {
      const speed = Number.parseInt(writeSpeedMatch[1].replace(/,/g, ""))
      if (speed >= 6000) writeSpeeds[0].count++
      else if (speed >= 5000) writeSpeeds[1].count++
      else if (speed >= 4000) writeSpeeds[2].count++
      else if (speed >= 3000) writeSpeeds[3].count++
      else if (speed >= 2000) writeSpeeds[4].count++
      else if (speed >= 1000) writeSpeeds[5].count++
      else if (speed >= 500) writeSpeeds[6].count++
      else writeSpeeds[7].count++
    }

    // DRAM 캐시 카운팅
    if (text.includes("dram") && !text.includes("dram-less")) dramCache[0].count++
    if (text.includes("dram-less") || text.includes("dramless")) dramCache[1].count++
    if (text.includes("slc 캐시") || text.includes("slc cache")) dramCache[2].count++
    if (text.includes("hmb")) dramCache[3].count++

    // 보증 기간 카운팅
    const warrantyMatch = text.match(/(\d+)년.*?보증/i) || text.match(/warranty.*?(\d+)\s*year/i)
    if (warrantyMatch) {
      const years = Number.parseInt(warrantyMatch[1])
      if (years >= 10) warrantyPeriods[0].count++
      else if (years >= 7) warrantyPeriods[1].count++
      else if (years >= 5) warrantyPeriods[2].count++
      else if (years >= 3) warrantyPeriods[3].count++
      else if (years >= 2) warrantyPeriods[4].count++
      else warrantyPeriods[5].count++
    }

    // 사용 목적 카운팅
    if (text.includes("게이밍") || text.includes("gaming")) usagePurpose[0].count++
    if (text.includes("전문가") || text.includes("professional") || text.includes("pro")) usagePurpose[1].count++
    if (text.includes("기업") || text.includes("enterprise")) usagePurpose[2].count++
    if (text.includes("일반") || text.includes("mainstream")) usagePurpose[3].count++
    if (text.includes("보급") || text.includes("budget") || text.includes("value")) usagePurpose[4].count++
    if (text.includes("휴대") || text.includes("portable") || text.includes("external")) usagePurpose[5].count++

    // 내구성 등급 카운팅
    const tbwMatch = text.match(/(\d+(?:,\d+)?)\s*tbw/i)
    if (tbwMatch) {
      const tbw = Number.parseInt(tbwMatch[1].replace(/,/g, ""))
      if (tbw >= 3000) enduranceRating[0].count++
      else if (tbw >= 2000) enduranceRating[1].count++
      else if (tbw >= 1000) enduranceRating[2].count++
      else if (tbw >= 500) enduranceRating[3].count++
      else if (tbw >= 200) enduranceRating[4].count++
      else if (tbw >= 100) enduranceRating[5].count++
      else enduranceRating[6].count++
    }
  })

  // 필터 추가
  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "form-factor",
    label: "폼팩터",
    options: formFactors.filter((f) => f.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "interface",
    label: "인터페이스",
    options: interfaces.filter((i) => i.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "protocol",
    label: "프로토콜",
    options: protocols.filter((p) => p.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "capacity",
    label: "용량",
    options: capacities.filter((c) => c.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "memory-type",
    label: "메모리 타입",
    options: memoryTypes.filter((m) => m.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "nand-structure",
    label: "낸드 구조",
    options: nandStructures.filter((n) => n.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "read-speed",
    label: "읽기 속도",
    options: readSpeeds.filter((r) => r.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "write-speed",
    label: "쓰기 속도",
    options: writeSpeeds.filter((w) => w.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "dram-cache",
    label: "DRAM 캐시",
    options: dramCache.filter((d) => d.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "warranty-period",
    label: "보증 기간",
    options: warrantyPeriods.filter((w) => w.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "usage-purpose",
    label: "사용 목적",
    options: usagePurpose.filter((u) => u.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "endurance-rating",
    label: "내구성 등급",
    options: enduranceRating.filter((e) => e.count > 0),
    isOpen: true,
  })

  return filters
}

// 케이스 전용 필터 생성 - 상세 버전 (스크린샷 기반)
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

  // 2. 제품 분류
  const productTypes = [
    { id: "atx-case", label: "ATX 케이스", count: 0 },
    { id: "m-atx-case", label: "M-ATX 케이스", count: 0 },
    { id: "mini-itx", label: "미니ITX", count: 0 },
    { id: "htpc-case", label: "HTPC 케이스", count: 0 },
    { id: "tuning-case", label: "튜닝 케이스", count: 0 },
  ]

  // 3. 지원보드규격
  const boardSupport = [
    { id: "atx", label: "ATX", count: 0 },
    { id: "m-atx", label: "M-ATX", count: 0 },
    { id: "itx", label: "ITX", count: 0 },
    { id: "e-atx", label: "E-ATX", count: 0 },
    { id: "m-itx", label: "M-ITX", count: 0 },
  ]

  // 4. VGA 길이
  const vgaLengths = [
    { id: "400mm-above", label: "400~ mm", count: 0 },
    { id: "370-399mm", label: "370~399 mm", count: 0 },
    { id: "350-369mm", label: "350~369 mm", count: 0 },
    { id: "330-349mm", label: "330~349 mm", count: 0 },
    { id: "310-329mm", label: "310~329 mm", count: 0 },
  ]

  // 5. CPU쿨러 높이
  const coolerHeights = [
    { id: "200mm-above", label: "200mm 이상", count: 0 },
    { id: "190-199mm", label: "190~199mm", count: 0 },
    { id: "180-189mm", label: "180~189mm", count: 0 },
    { id: "170-179mm", label: "170~179mm", count: 0 },
    { id: "160-169mm", label: "160~169mm", count: 0 },
  ]

  // 6. 케이스 크기
  const caseSizes = [
    { id: "big-tower", label: "빅타워", count: 0 },
    { id: "mid-tower", label: "미들타워", count: 0 },
    { id: "mini-tower", label: "미니타워", count: 0 },
    { id: "mini-tower-lp", label: "미니타워(LP)", count: 0 },
    { id: "mini-itx-cube", label: "미니ITX(큐브형)", count: 0 },
  ]

  // 7. 지원파워규격
  const powerSupport = [
    { id: "standard-atx", label: "표준-ATX", count: 0 },
    { id: "m-atx-sfx", label: "M-ATX(SFX)", count: 0 },
    { id: "tfx", label: "TFX", count: 0 },
    { id: "dc-to-dc", label: "DC to DC", count: 0 },
    { id: "flex", label: "FLEX", count: 0 },
  ]

  components.forEach((component) => {
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    // 제조사 카운팅
    if (text.includes("앱코") || text.includes("abko")) manufacturers[0].count++
    if (text.includes("darkflash")) manufacturers[1].count++
    if (text.includes("마이크로닉스") || text.includes("micronics")) manufacturers[2].count++
    if (text.includes("잘만") || text.includes("zalman")) manufacturers[3].count++
    if (text.includes("antec") || text.includes("안텍")) manufacturers[4].count++

    // 제품 분류 카운팅
    if (text.includes("atx 케이스") || (text.includes("atx") && text.includes("케이스"))) productTypes[0].count++
    if (text.includes("m-atx 케이스") || text.includes("matx 케이스")) productTypes[1].count++
    if (text.includes("mini itx") || text.includes("미니itx")) productTypes[2].count++
    if (text.includes("htpc")) productTypes[3].count++
    if (text.includes("튜닝")) productTypes[4].count++

    // 지원보드규격 카운팅
    if (text.includes("atx") && !text.includes("m-atx") && !text.includes("e-atx")) boardSupport[0].count++
    if (text.includes("m-atx") || text.includes("matx")) boardSupport[1].count++
    if (text.includes("itx") && !text.includes("mini")) boardSupport[2].count++
    if (text.includes("e-atx") || text.includes("eatx")) boardSupport[3].count++
    if (text.includes("m-itx") || text.includes("mini-itx")) boardSupport[4].count++

    // VGA 길이 카운팅
    const vgaMatch = text.match(/vga.*?(\d+)mm/) || text.match(/그래픽.*?(\d+)mm/)
    if (vgaMatch) {
      const length = Number.parseInt(vgaMatch[1])
      if (length >= 400) vgaLengths[0].count++
      else if (length >= 370) vgaLengths[1].count++
      else if (length >= 350) vgaLengths[2].count++
      else if (length >= 330) vgaLengths[3].count++
      else if (length >= 310) vgaLengths[4].count++
    }

    // CPU쿨러 높이 카운팅
    const coolerMatch = text.match(/쿨러.*?(\d+)mm/) || text.match(/cpu.*?(\d+)mm/)
    if (coolerMatch) {
      const height = Number.parseInt(coolerMatch[1])
      if (height >= 200) coolerHeights[0].count++
      else if (height >= 190) coolerHeights[1].count++
      else if (height >= 180) coolerHeights[2].count++
      else if (height >= 170) coolerHeights[3].count++
      else if (height >= 160) coolerHeights[4].count++
    }

    // 케이스 크기 카운팅
    if (text.includes("빅타워") || text.includes("big tower")) caseSizes[0].count++
    if (text.includes("미들타워") || text.includes("mid tower")) caseSizes[1].count++
    if (text.includes("미니타워") && !text.includes("lp")) caseSizes[2].count++
    if (text.includes("미니타워") && text.includes("lp")) caseSizes[3].count++
    if (text.includes("큐브") || text.includes("cube")) caseSizes[4].count++

    // 지원파워규격 카운팅
    if (text.includes("표준 atx") || text.includes("standard atx")) powerSupport[0].count++
    if (text.includes("sfx") || text.includes("m-atx")) powerSupport[1].count++
    if (text.includes("tfx")) powerSupport[2].count++
    if (text.includes("dc to dc")) powerSupport[3].count++
    if (text.includes("flex")) powerSupport[4].count++
  })

  // 필터 추가
  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "product-type",
    label: "제품 분류",
    options: productTypes.filter((p) => p.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "board-support",
    label: "지원보드규격",
    options: boardSupport.filter((b) => b.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "vga-length",
    label: "VGA 길이",
    options: vgaLengths.filter((v) => v.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "cooler-height",
    label: "CPU쿨러 높이",
    options: coolerHeights.filter((c) => c.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "case-size",
    label: "케이스 크기",
    options: caseSizes.filter((c) => c.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "power-support",
    label: "지원파워규격",
    options: powerSupport.filter((p) => p.count > 0),
    isOpen: true,
  })

  return filters
}

// 쿨러 전용 필터 생성 - 상세 버전 (스크린샷 기반)
function generateCoolerFilters(components: FirebaseComponentData[]): FilterCategory[] {
  const filters: FilterCategory[] = []

  // 1. 제조사 필터
  const manufacturers = [
    { id: "pccooler", label: "PCCOOLER", count: 0 },
    { id: "deepcool", label: "DEEPCOOL", count: 0 },
    { id: "쿨러마스터", label: "쿨러마스터", count: 0 },
    { id: "잘만", label: "잘만", count: 0 },
    { id: "darkflash", label: "darkFlash", count: 0 },
  ]

  // 2. 제품 종류
  const productTypes = [
    { id: "cpu-cooler", label: "CPU 쿨러", count: 0 },
    { id: "system-compound-cooler", label: "시스템컴파운드(그리스)", count: 0 },
    { id: "system-cooler", label: "시스템 쿨러", count: 0 },
    { id: "m2-ssd-cooler", label: "M.2 SSD 쿨러", count: 0 },
    { id: "vga-support", label: "VGA 지지대", count: 0 },
  ]

  // 3. 냉각 방식
  const coolingTypes = [
    { id: "air-cooling", label: "공랭", count: 0 },
    { id: "water-cooling", label: "수랭", count: 0 },
  ]

  // 4. A/S기간
  const warrantyPeriods = [
    { id: "6years-above", label: "6년+무상보상", count: 0 },
    { id: "5years-above", label: "5년+무상보상", count: 0 },
    { id: "3years-above", label: "3년+무상보상", count: 0 },
    { id: "1year-above-5years", label: "1년1년+무상보상5년", count: 0 },
    { id: "2years-above-5years", label: "2년1년+무상보상5년", count: 0 },
  ]

  // 5. 인텔 소켓
  const intelSockets = [
    { id: "lga1851", label: "LGA1851", count: 0 },
    { id: "lga1700", label: "LGA1700", count: 0 },
    { id: "lga1200", label: "LGA1200", count: 0 },
    { id: "lga115x", label: "LGA115x", count: 0 },
    { id: "lga2011-v3", label: "LGA2011-V3", count: 0 },
  ]

  // 6. AMD 소켓
  const amdSockets = [
    { id: "am5", label: "AM5", count: 0 },
    { id: "am4", label: "AM4", count: 0 },
    { id: "swrx8", label: "sWRX8", count: 0 },
    { id: "strx4", label: "sTRX4", count: 0 },
    { id: "tr4", label: "TR4", count: 0 },
  ]

  // 7. 높이
  const heights = [
    { id: "200mm-above", label: "200~ mm", count: 0 },
    { id: "165mm-above", label: "165~ mm", count: 0 },
    { id: "150-164mm", label: "150~164 mm", count: 0 },
    { id: "125-149mm", label: "125~149 mm", count: 0 },
    { id: "100-124mm", label: "100~124 mm", count: 0 },
  ]

  components.forEach((component) => {
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    // 제조사 카운팅
    if (text.includes("pccooler")) manufacturers[0].count++
    if (text.includes("deepcool") || text.includes("딥쿨")) manufacturers[1].count++
    if (text.includes("쿨러마스터") || text.includes("cooler master")) manufacturers[2].count++
    if (text.includes("잘만") || text.includes("zalman")) manufacturers[3].count++
    if (text.includes("darkflash")) manufacturers[4].count++

    // 제품 종류 카운팅
    if (text.includes("cpu 쿨러") || text.includes("cpu쿨러")) productTypes[0].count++
    if (text.includes("그리스") || text.includes("컴파운드")) productTypes[1].count++
    if (text.includes("시스템 쿨러")) productTypes[2].count++
    if (text.includes("m.2") && text.includes("쿨러")) productTypes[3].count++
    if (text.includes("vga") && text.includes("지지대")) productTypes[4].count++

    // 냉각 방식 카운팅
    if (text.includes("공랭") || text.includes("air")) coolingTypes[0].count++
    if (text.includes("수랭") || text.includes("water")) coolingTypes[1].count++

    // A/S기간 카운팅
    if (text.includes("6년")) warrantyPeriods[0].count++
    if (text.includes("5년")) warrantyPeriods[1].count++
    if (text.includes("3년")) warrantyPeriods[2].count++
    if (text.includes("1년") && text.includes("5년")) warrantyPeriods[3].count++
    if (text.includes("2년") && text.includes("5년")) warrantyPeriods[4].count++

    // 인텔 소켓 카운팅
    if (text.includes("lga1851") || text.includes("1851")) intelSockets[0].count++
    if (text.includes("lga1700") || text.includes("1700")) intelSockets[1].count++
    if (text.includes("lga1200") || text.includes("1200")) intelSockets[2].count++
    if (text.includes("lga115") || text.includes("115x")) intelSockets[3].count++
    if (text.includes("lga2011") || text.includes("2011")) intelSockets[4].count++

    // AMD 소켓 카운팅
    if (text.includes("am5")) amdSockets[0].count++
    if (text.includes("am4")) amdSockets[1].count++
    if (text.includes("swrx8")) amdSockets[2].count++
    if (text.includes("strx4")) amdSockets[3].count++
    if (text.includes("tr4")) amdSockets[4].count++

    // 높이 카운팅
    const heightMatch = text.match(/(\d+)mm/)
    if (heightMatch) {
      const height = Number.parseInt(heightMatch[1])
      if (height >= 200) heights[0].count++
      else if (height >= 165) heights[1].count++
      else if (height >= 150) heights[2].count++
      else if (height >= 125) heights[3].count++
      else if (height >= 100) heights[4].count++
    }
  })

  // 필터 추가
  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "product-type",
    label: "제품 종류",
    options: productTypes.filter((p) => p.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "cooling-type",
    label: "냉각 방식",
    options: coolingTypes.filter((c) => c.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "warranty-period",
    label: "A/S기간",
    options: warrantyPeriods.filter((w) => w.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "intel-socket",
    label: "인텔 소켓",
    options: intelSockets.filter((i) => i.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "amd-socket",
    label: "AMD 소켓",
    options: amdSockets.filter((a) => a.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "height",
    label: "높이",
    options: heights.filter((h) => h.count > 0),
    isOpen: true,
  })

  return filters
}

// 메인보드 전용 필터 생성 - 상세 버전 (스크린샷 기반)
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

  // 2. 제품 분류
  const productTypes = [
    { id: "intel-cpu", label: "인텔 CPU용", count: 0 },
    { id: "amd-cpu", label: "AMD CPU용", count: 0 },
    { id: "embedded", label: "임베디드", count: 0 },
  ]

  // 3. CPU 소켓
  const cpuSockets = [
    { id: "intel-socket1851", label: "인텔(소켓1851)", count: 0 },
    { id: "intel-socket1700", label: "인텔(소켓1700)", count: 0 },
    { id: "intel-socket1200", label: "인텔(소켓1200)", count: 0 },
    { id: "amd-socket-am5", label: "AMD(소켓AM5)", count: 0 },
    { id: "amd-socket-am4", label: "AMD(소켓AM4)", count: 0 },
  ]

  // 4. 세부 칩셋
  const chipsets = [
    { id: "intel-z890", label: "인텔 Z890", count: 0 },
    { id: "intel-b860", label: "인텔 B860", count: 0 },
    { id: "intel-b760", label: "인텔 B760", count: 0 },
    { id: "amd-b850", label: "AMD B850", count: 0 },
    { id: "amd-b650", label: "AMD B650", count: 0 },
  ]

  // 5. 메모리 종류
  const memoryTypes = [
    { id: "ddr5", label: "DDR5", count: 0 },
    { id: "lpddr5", label: "LPDDR5", count: 0 },
    { id: "ddr4", label: "DDR4", count: 0 },
    { id: "lpddr4", label: "LPDDR4", count: 0 },
    { id: "ddr3", label: "DDR3", count: 0 },
  ]

  // 6. VGA 연결
  const vgaConnections = [
    { id: "pcie5.0-x16", label: "PCIe5.0 ×16", count: 0 },
    { id: "pcie4.0-x16", label: "PCIe4.0 ×16", count: 0 },
    { id: "pcie3.0-x16", label: "PCIe3.0 ×16", count: 0 },
    { id: "pcie-x16", label: "PCIe ×16", count: 0 },
    { id: "pcie-hybrid", label: "PCIe 혼합", count: 0 },
  ]

  // 7. 폼팩터
  const formFactors = [
    { id: "atx-30.5x24.4", label: "ATX (30.5×24.4cm)", count: 0 },
    { id: "m-atx-24.4x24.4", label: "M-ATX (24.4×24.4cm)", count: 0 },
    { id: "m-itx-17.0x17.0", label: "M-iTX (17.0×17.0cm)", count: 0 },
    { id: "e-atx-30.5x33.0", label: "E-ATX (30.5×33.0cm)", count: 0 },
    { id: "atx-mini-factor", label: "ATX (슈퍼미니팩터)", count: 0 },
  ]

  components.forEach((component) => {
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    // 제조사 카운팅
    if (text.includes("msi")) manufacturers[0].count++
    if (text.includes("asus")) manufacturers[1].count++
    if (text.includes("gigabyte")) manufacturers[2].count++
    if (text.includes("asrock")) manufacturers[3].count++
    if (text.includes("biostar")) manufacturers[4].count++

    // 제품 분류 카운팅
    if (text.includes("인텔") || text.includes("intel") || text.includes("lga")) productTypes[0].count++
    if (text.includes("amd") || text.includes("am4") || text.includes("am5")) productTypes[1].count++
    if (text.includes("임베디드") || text.includes("embedded")) productTypes[2].count++

    // CPU 소켓 카운팅
    if (text.includes("1851") || text.includes("lga1851")) cpuSockets[0].count++
    if (text.includes("1700") || text.includes("lga1700")) cpuSockets[1].count++
    if (text.includes("1200") || text.includes("lga1200")) cpuSockets[2].count++
    if (text.includes("am5")) cpuSockets[3].count++
    if (text.includes("am4")) cpuSockets[4].count++

    // 세부 칩셋 카운팅
    if (text.includes("z890")) chipsets[0].count++
    if (text.includes("b860")) chipsets[1].count++
    if (text.includes("b760")) chipsets[2].count++
    if (text.includes("b850")) chipsets[3].count++
    if (text.includes("b650")) chipsets[4].count++

    // 메모리 종류 카운팅
    if (text.includes("ddr5") && !text.includes("lpddr5")) memoryTypes[0].count++
    if (text.includes("lpddr5")) memoryTypes[1].count++
    if (text.includes("ddr4") && !text.includes("lpddr4")) memoryTypes[2].count++
    if (text.includes("lpddr4")) memoryTypes[3].count++
    if (text.includes("ddr3")) memoryTypes[4].count++

    // VGA 연결 카운팅
    if (text.includes("pcie 5.0") && text.includes("x16")) vgaConnections[0].count++
    if (text.includes("pcie 4.0") && text.includes("x16")) vgaConnections[1].count++
    if (text.includes("pcie 3.0") && text.includes("x16")) vgaConnections[2].count++
    if (text.includes("pcie") && text.includes("x16")) vgaConnections[3].count++
    if (text.includes("pcie") && text.includes("혼합")) vgaConnections[4].count++

    // 폼팩터 카운팅
    if (text.includes("atx") && !text.includes("m-atx") && !text.includes("e-atx")) formFactors[0].count++
    if (text.includes("m-atx") || text.includes("matx")) formFactors[1].count++
    if (text.includes("m-itx") || text.includes("mini-itx")) formFactors[2].count++
    if (text.includes("e-atx") || text.includes("eatx")) formFactors[3].count++
    if (text.includes("슈퍼미니") || text.includes("mini factor")) formFactors[4].count++
  })

  // 필터 추가
  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "product-type",
    label: "제품 분류",
    options: productTypes.filter((p) => p.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "cpu-socket",
    label: "CPU 소켓",
    options: cpuSockets.filter((c) => c.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "chipset",
    label: "세부 칩셋",
    options: chipsets.filter((c) => c.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "memory-type",
    label: "메모리 종류",
    options: memoryTypes.filter((m) => m.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "vga-connection",
    label: "VGA 연결",
    options: vgaConnections.filter((v) => v.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "form-factor",
    label: "폼팩터",
    options: formFactors.filter((f) => f.count > 0),
    isOpen: true,
  })

  return filters
}

// 파워 전용 필터 생성 - 상세 버전 (스크린샷 기반)
function generatePowerFilters(components: FirebaseComponentData[]): FilterCategory[] {
  const filters: FilterCategory[] = []

  // 1. 제조사 필터
  const manufacturers = [
    { id: "시소닉", label: "시소닉", count: 0 },
    { id: "잘만", label: "잘만", count: 0 },
    { id: "마이크로닉스", label: "마이크로닉스", count: 0 },
    { id: "쿨러마스터", label: "쿨러마스터", count: 0 },
    { id: "darkflash", label: "darkFlash", count: 0 },
  ]

  // 2. 제품 분류
  const productTypes = [
    { id: "atx-power", label: "ATX 파워", count: 0 },
    { id: "m-atx-sfx-power", label: "M-ATX(SFX) 파워", count: 0 },
    { id: "tfx-power", label: "TFX 파워", count: 0 },
    { id: "server-power", label: "서버용 파워", count: 0 },
    { id: "flex-atx-power", label: "Flex-ATX 파워", count: 0 },
  ]

  // 3. 정격출력
  const powerRatings = [
    { id: "2000w-above", label: "2000W 이상", count: 0 },
    { id: "1600w-1999w", label: "1600W~1999W", count: 0 },
    { id: "1300w-1599w", label: "1300W~1599W", count: 0 },
    { id: "1000w-1299w", label: "1000W~1299W", count: 0 },
    { id: "900w-999w", label: "900W~999W", count: 0 },
  ]

  // 4. 80PLUS인증
  const plus80Certifications = [
    { id: "80plus-titanium", label: "80 PLUS 티타늄", count: 0 },
    { id: "80plus-platinum", label: "80 PLUS 플래티넘", count: 0 },
    { id: "80plus-gold", label: "80 PLUS 골드", count: 0 },
    { id: "80plus-silver", label: "80 PLUS 실버", count: 0 },
    { id: "80plus-bronze", label: "80 PLUS 브론즈", count: 0 },
  ]

  // 5. 케이블연결
  const cableConnections = [
    { id: "full-modular", label: "풀모듈러", count: 0 },
    { id: "semi-modular", label: "세미모듈러", count: 0 },
    { id: "cable-integrated", label: "케이블일체형", count: 0 },
  ]

  // 6. ETA인증
  const etaCertifications = [
    { id: "titanium", label: "TITANIUM", count: 0 },
    { id: "platinum", label: "PLATINUM", count: 0 },
    { id: "gold", label: "GOLD", count: 0 },
    { id: "silver", label: "SILVER", count: 0 },
    { id: "bronze", label: "BRONZE", count: 0 },
  ]

  // 7. LAMBDA인증
  const lambdaCertifications = [
    { id: "a-plus-plus", label: "A++", count: 0 },
    { id: "a-plus", label: "A+", count: 0 },
    { id: "a", label: "A", count: 0 },
    { id: "a-minus", label: "A-", count: 0 },
    { id: "standard-plus-plus", label: "STANDARD++", count: 0 },
  ]

  components.forEach((component) => {
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    // 제조사 카운팅
    if (text.includes("시소닉") || text.includes("seasonic")) manufacturers[0].count++
    if (text.includes("잘만") || text.includes("zalman")) manufacturers[1].count++
    if (text.includes("마이크로닉스") || text.includes("micronics")) manufacturers[2].count++
    if (text.includes("쿨러마스터") || text.includes("cooler master")) manufacturers[3].count++
    if (text.includes("darkflash")) manufacturers[4].count++

    // 제품 분류 카운팅
    if (text.includes("atx") && !text.includes("m-atx") && !text.includes("flex")) productTypes[0].count++
    if (text.includes("m-atx") || text.includes("sfx")) productTypes[1].count++
    if (text.includes("tfx")) productTypes[2].count++
    if (text.includes("서버") || text.includes("server")) productTypes[3].count++
    if (text.includes("flex-atx") || text.includes("flex atx")) productTypes[4].count++

    // 정격출력 카운팅
    const wattMatch = text.match(/(\d+)w/)
    if (wattMatch) {
      const watts = Number.parseInt(wattMatch[1])
      if (watts >= 2000) powerRatings[0].count++
      else if (watts >= 1600) powerRatings[1].count++
      else if (watts >= 1300) powerRatings[2].count++
      else if (watts >= 1000) powerRatings[3].count++
      else if (watts >= 900) powerRatings[4].count++
    }

    // 80PLUS인증 카운팅
    if (text.includes("80 plus titanium") || text.includes("티타늄")) plus80Certifications[0].count++
    if (text.includes("80 plus platinum") || text.includes("플래티넘")) plus80Certifications[1].count++
    if (text.includes("80 plus gold") || text.includes("골드")) plus80Certifications[2].count++
    if (text.includes("80 plus silver") || text.includes("실버")) plus80Certifications[3].count++
    if (text.includes("80 plus bronze") || text.includes("브론즈")) plus80Certifications[4].count++

    // 케이블연결 카운팅
    if (text.includes("풀모듈러") || text.includes("full modular")) cableConnections[0].count++
    if (text.includes("세미모듈러") || text.includes("semi modular")) cableConnections[1].count++
    if (text.includes("케이블일체형") || text.includes("cable integrated")) cableConnections[2].count++

    // ETA인증 카운팅
    if (text.includes("eta") && text.includes("titanium")) etaCertifications[0].count++
    if (text.includes("eta") && text.includes("platinum")) etaCertifications[1].count++
    if (text.includes("eta") && text.includes("gold")) etaCertifications[2].count++
    if (text.includes("eta") && text.includes("silver")) etaCertifications[3].count++
    if (text.includes("eta") && text.includes("bronze")) etaCertifications[4].count++

    // LAMBDA인증 카운팅
    if (text.includes("lambda") && text.includes("a++")) lambdaCertifications[0].count++
    if (text.includes("lambda") && text.includes("a+")) lambdaCertifications[1].count++
    if (text.includes("lambda") && text.includes("a") && !text.includes("a+")) lambdaCertifications[2].count++
    if (text.includes("lambda") && text.includes("a-")) lambdaCertifications[3].count++
    if (text.includes("lambda") && text.includes("standard++")) lambdaCertifications[4].count++
  })

  // 필터 추가
  filters.push({
    id: "manufacturer",
    label: "제조사",
    options: manufacturers.filter((m) => m.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "product-type",
    label: "제품 분류",
    options: productTypes.filter((p) => p.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "power-rating",
    label: "정격출력",
    options: powerRatings.filter((p) => p.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "80plus-certification",
    label: "80PLUS인증",
    options: plus80Certifications.filter((c) => c.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "cable-connection",
    label: "케이블연결",
    options: cableConnections.filter((c) => c.count > 0),
    isOpen: true,
  })

  filters.push({
    id: "eta-certification",
    label: "ETA인증",
    options: etaCertifications.filter((e) => e.count > 0),
    isOpen: true,
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
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

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

// 필터 적용 함수 - 필터 생성과 동일한 로직 사용
export function applyFilters(
  components: FirebaseComponentData[],
  filters: FilterState,
  category: string,
): FirebaseComponentData[] {
  console.log("=== APPLY FILTERS DEBUG ===")
  console.log("Input components:", components.length)
  console.log("Filters:", filters)
  console.log("Category:", category)

  if (!components || components.length === 0) {
    console.log("No components to filter")
    return []
  }

  // 필터가 비어있으면 모든 컴포넌트 반환
  const hasActiveFilters = Object.values(filters).some((options) => options.length > 0)
  if (!hasActiveFilters) {
    console.log("No active filters, returning all components")
    return components
  }

  const result = components.filter((component) => {
    const text = normalizeText(`${component.name} ${component.description || ""} ${component.specs || ""}`)

    // 각 필터 카테고리별로 체크
    for (const [filterId, selectedOptions] of Object.entries(filters)) {
      if (selectedOptions.length === 0) continue

      let matchesFilter = false

      switch (filterId) {
        case "manufacturer":
          matchesFilter = selectedOptions.some((option) => {
            if (option === "인텔") {
              // AMD 제품 먼저 체크
              const isAmd =
                text.includes("amd") ||
                text.includes("ryzen") ||
                text.includes("라이젠") ||
                text.includes("epyc") ||
                text.includes("threadripper") ||
                text.includes("스레드리퍼") ||
                text.includes("athlon") ||
                text.includes("애슬론")

              // AMD가 아닌 경우에만 Intel 체크
              const isIntel =
                !isAmd &&
                (text.includes("intel") ||
                  text.includes("인텔") ||
                  (text.includes("core") && !text.includes("라이젠")) ||
                  (text.includes("코어") && !text.includes("라이젠")) ||
                  text.includes("i3") ||
                  text.includes("i5") ||
                  text.includes("i7") ||
                  text.includes("i9") ||
                  text.includes("xeon") ||
                  text.includes("제온") ||
                  text.includes("ultra") ||
                  text.includes("울트라"))

              return isIntel
            }
            if (option === "amd") {
              const isAmd =
                text.includes("amd") ||
                text.includes("ryzen") ||
                text.includes("라이젠") ||
                text.includes("epyc") ||
                text.includes("threadripper") ||
                text.includes("스레드리퍼") ||
                text.includes("athlon") ||
                text.includes("애슬론")
              return isAmd
            }
            return text.includes(option.toLowerCase())
          })
          break

        case "intel-cpu-type":
          matchesFilter = selectedOptions.some((option) => {
            // 키워드 기반 매칭 (필터 생성과 동일한 로직)
            const keywordMap: Record<string, string[]> = {
              "코어-울트라9s2": ["ultra 9", "울트라9", "core ultra 9"],
              "코어-울트라7s2": ["ultra 7", "울트라7", "core ultra 7"],
              "코어-울트라5s2": ["ultra 5", "울트라5", "core ultra 5"],
              "코어i9-14세대": ["i9 14", "i9-14", "14세대", "14th gen"],
              "코어i7-14세대": ["i7 14", "i7-14", "14세대", "14th gen"],
              "코어i5-14세대": ["i5 14", "i5-14", "14세대", "14th gen"],
              "코어i3-14세대": ["i3 14", "i3-14", "14세대", "14th gen"],
              "코어i9-13세대": ["i9 13", "i9-13", "13세대", "13th gen"],
              "코어i7-13세대": ["i7 13", "i7-13", "13세대", "13th gen"],
              "코어i5-13세대": ["i5 13", "i5-13", "13세대", "13th gen"],
              "코어i3-13세대": ["i3 13", "i3-13", "13세대", "13th gen"],
              "코어i9-12세대": ["i9 12", "i9-12", "12세대", "12th gen"],
              "코어i7-12세대": ["i7 12", "i7-12", "12세대", "12th gen"],
              "코어i5-12세대": ["i5 12", "i5-12", "12세대", "12th gen"],
              "코어i3-12세대": ["i3 12", "i3-12", "12세대", "12th gen"],
              제온: ["xeon", "제온"],
            }

            const keywords = keywordMap[option] || []
            return keywords.some((keyword) => text.includes(keyword))
          })
          break

        case "amd-cpu-type":
          matchesFilter = selectedOptions.some((option) => {
            // AMD 제품인지 먼저 확인
            const isAmd =
              text.includes("amd") ||
              text.includes("ryzen") ||
              text.includes("라이젠") ||
              text.includes("epyc") ||
              text.includes("threadripper") ||
              text.includes("스레드리퍼") ||
              text.includes("athlon") ||
              text.includes("애슬론")

            if (!isAmd) return false

            // 각 옵션별 매칭
            switch (option) {
              case "epyc":
                return text.includes("epyc")

              case "라이젠-스레드리퍼-pro":
                return text.includes("threadripper pro") || text.includes("스레드리퍼 pro")

              case "라이젠-스레드리퍼":
                return (text.includes("threadripper") || text.includes("스레드리퍼")) && !text.includes("pro")

              case "애슬론":
                return text.includes("athlon") || text.includes("애슬론")

              default:
                // 라이젠 시리즈 처리
                if (option.startsWith("라이젠")) {
                  const modelMatch = text.match(/(\d{4})[a-z]*/)
                  if (!modelMatch) return false

                  const modelNumber = Number.parseInt(modelMatch[1])

                  // 시리즈 확인
                  const seriesMatch = option.match(/라이젠(\d)-(\d)세대/)
                  if (!seriesMatch) return false

                  const [, series, generation] = seriesMatch

                  // 시리즈 매칭 확인
                  const hasCorrectSeries = text.includes(`ryzen ${series}`) || text.includes(`라이젠${series}`)

                  if (!hasCorrectSeries) return false

                  // 세대 매칭 확인 (모델 번호 기반)
                  let correctGeneration = false
                  if (generation === "6" && modelNumber >= 9000) correctGeneration = true
                  else if (generation === "5" && modelNumber >= 7000 && modelNumber < 9000) correctGeneration = true
                  else if (generation === "4" && modelNumber >= 5000 && modelNumber < 7000) correctGeneration = true
                  else if (generation === "3" && modelNumber >= 3000 && modelNumber < 5000) correctGeneration = true

                  return correctGeneration
                }

                return false
            }
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
          matchesFilter = selectedOptions.some((option) => {
            return text.includes(option.toLowerCase().replace(/[-\s]/g, ""))
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

  console.log("Filter result:", result.length)
  console.log("=== END APPLY FILTERS DEBUG ===")
  return result
}
