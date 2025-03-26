// /app/data/components.ts

// 컴포넌트 타입 상수
export const componentOrder = ["vga", "cpu", "mb", "memory", "ssd", "case", "cooler", "power"] as const

// 컴포넌트 이름 매핑
export const componentNames = {
  vga: "VGA",
  cpu: "CPU",
  mb: "M.B",
  memory: "Memory",
  ssd: "SSD",
  case: "Case",
  cooler: "Cooler",
  power: "Power",
} as const

// 컴포넌트 옵션 인터페이스
export interface ComponentOption {
  readonly id: string
  readonly name: string
  readonly price: number
  readonly image: string
  readonly description: string // description을 필수 필드로 추가
}

// 컴포넌트 타입 정의
export type ComponentType = (typeof componentOrder)[number]

// 컴포넌트 옵션 타입
export type ComponentOptions = {
  readonly [K in ComponentType]: readonly ComponentOption[]
}

// 컴포넌트 데이터
export const componentOptions: ComponentOptions = {
  vga: [
    {
      id: "4060-ti",
      name: "RTX 4060 Ti",
      price: 589000,
      image: "/images/RTX 4060 Ti.png",
      description:
        "4nm / 부스트클럭:2610MHz / OC클럭:2625MHz / 스트림 프로세서:4352개 / PCIe4.0x16(at x8) / GDDR6 / 출력단자:HDMI2.1;DP1.4 / 지원정보:8K 지원;HDR 지원;HDCP 2.3 / 사용전력:165W / 정격파워 550W 이상 / 전원 포트:8핀 x1 / 2팬 / 가로(길이):199mm / 두께:42mm / 제로팬(0-dB기술) / 백플레이트 / DrMOS",
    },
    {
      id: "3070",
      name: "RTX 3070",
      price: 689000,
      image: "/images/RTX 3070.png",
      description:
        "8nm / 부스트클럭:1770MHz / 스트림 프로세서:6144개 / PCIe4.0x16 / GDDR6X / 출력단자:HDMI2.1;DP1.4 / 지원정보:8K 지원;HDR 지원;HDCP 2.3 / 사용전력:최대 290W / 정격파워 750W 이상 / 전원 포트:8핀 x2 / 전원부:12페이즈 / 2팬 / 가로(길이):238mm / 두께:50~59mm / 제로팬(0-dB기술) / 백플레이트 / DrMOS",
    },
    {
      id: "3080",
      name: "RTX 3080",
      price: 989000,
      image: "/images/RTX 3080.png",
      description:
        "8nm / 부스트클럭:1755MHz / 스트림 프로세서:8960개 / PCIe4.0x16 / GDDR6X / 출력단자:HDMI2.1;DP1.4 / 지원정보:8K 지원;HDR 지원;HDCP 2.3 / 사용전력:최대 350W / 정격파워 750W 이상 / 전원 포트:8핀 x2 / 전원부:16+3페이즈 / 3팬 / 가로(길이):317.8mm / 두께:64.6mm / 제로팬(0-dB기술) / 백플레이트 / LED 라이트 / SPECTRA",
    },
    {
      id: "4070-super",
      name: "RTX 4070 super",
      price: 889000,
      image: "/images/RTX 4070 super.png",
      description:
        " 4nm / 베이스클럭:1980MHz / 부스트클럭:2505MHz / OC클럭:2520MHz / 스트림 프로세서:7168개 / PCIe4.0x16 / GDDR6X / 출력단자:HDMI2.1;DP1.4 / 지원정보:8K 지원;HDR 지원;HDCP 2.3 / 사용전력:220W / 정격파워 650W 이상 / 전원 포트:16핀(12VHPWR) x1 / 2팬 / 가로(길이):242mm / 두께:43mm / 제로팬(0-dB기술) / 백플레이트 / DrMOS / 구성품:2x8핀 to 16핀 커넥터",
    },
    {
      id: "3090",
      name: "RTX 3090",
      price: 1589000,
      image: "/images/RTX 3090.png",
      description:
        " 8nm / 베이스클럭:1860MHz / 부스트클럭:1905MHz / 스트림 프로세서:10752개 / PCIe4.0x16 / GDDR6X / 출력단자:HDMI2.1;DP1.4 / 지원정보:멀티VGA 지원;8K 지원;HDR ��원 / 정격파워 850W 이상 / 전원 포트:16핀(12VHPWR) x1 / 3팬 / 가로(길이):331mm / 두께:70mm / 제로팬(0-dB기술) / 백플레이트 / Dual BIOS",
    },
    {
      id: "4080",
      name: "RTX 4080",
      price: 1789000,
      image: "/images/RTX 4080.png",
      description:
        " 4nm / 베이스클럭:2295MHz / 부스트클럭:2550MHz / OC클럭:2565MHz / 스트림 프로세서:10240개 / PCIe4.0x16 / GDDR6X / 출력단자:HDMI2.1;DP1.4 / 지원정보:8K 지원;HDR 지원;HDCP 2.3 / 사용전력:320W / 정격파워 850W 이상 / 전원 포트:16핀(12VHPWR) x1 / 3팬 / 가로(길이):315mm / 두께:59mm / 제로팬(0-dB기술) / 백플레이트 / 구성품:VGA지지대;3x8핀 to 16핀 커넥터",
    },
  ],
  cpu: [
    {
      id: "ryzen-7-5700x3d",
      name: "AMD Ryzen 7 5700X3D",
      price: 389000,
      image: "/images/AMD Ryzen 7 5700X3D.png",
      description:
        "AMD(소켓AM4) / 4세대(Zen3) / 7nm / 8코어 / 16스레드 / 기본 클럭:3.0GHz / 최대 클럭:4.1GHz / L2 캐시:4MB / L3 캐시:96MB / TDP:105W / PPT:142W / PCIe4.0 / 메모리 규격:DDR4 / 3200MHz / 내장그래픽: 미탑재 / 기술 지원:SMT(하이퍼스레딩);StoreMI;AMD Ryzen Master;VR Ready 프리미엄;AMD 3D V캐시 / 쿨러:미포함 / 시네벤치R23(싱글):1367 / 시네벤치R23(멀티):13788",
    },
    {
      id: "ryzen-7-7800x3d",
      name: "AMD Ryzen 7 7800X3D",
      price: 529000,
      image: "/images/AMD Ryzen 7 7800X3D.png",
      description:
        "AMD(소켓AM5) / 5세대(Zen4) / 5nm / 8코어 / 16스레드 / 기본 클럭:4.2GHz / 최대 클럭:5.0GHz / L2 캐시:8MB / L3 캐시:96MB / TDP:120W / PPT:162W / PCIe5.0 / 메모리 규격:DDR5 / 5200MHz / 내장그래픽: 탑재 / AMD 라데온 그래픽 / 기술 지원:SMT(하이퍼스레딩);AMD Ryzen Master;AMD 3D V캐시 / 쿨러:미포함 / 시네벤치R23(싱글):1788 / 시네벤치R23(멀티):18208",
    },
    {
      id: "intel-i5-14400f",
      name: "Intel Core i5-14400F",
      price: 299000,
      image: "/images/Intel Core i5-14400F.png",
      description:
        "인텔(소켓1700) / 10nm(인텔7) / P6+E4코어 / 12+4스레드 / 기본 클럭:2.5GHz / 최대 클럭:4.7GHz / L2 캐시:9.5MB / L3 캐시:20MB / PBP-MTP:65-148W / PCIe5.0, 4.0 / 메모리 규격:DDR5, DDR4 / 4800, 3200MHz / 내장그래픽: 미탑재 / 기술 지원:SMT(하이퍼스레딩);인텔 딥러닝부스트 / 쿨러:인텔 기본쿨러 포함 / 시네벤치R23(싱글):1790 / 시네벤치R23(멀티):17804",
    },
    {
      id: "intel-i7-14700k",
      name: "Intel Core i7-14700K",
      price: 549000,
      image: "/images/Intel Core i7-14700K.png",
      description:
        "인텔(소켓1700) / 10nm(인텔7) / P8+E12코어 / 16+12스레드 / 기본 클럭:3.4GHz / 최대 클럭:5.6GHz / L2 캐시:28MB / L3 캐시:33MB / PBP-MTP:125-253W / PCIe5.0, 4.0 / 메모리 규격:DDR5, DDR4 / 5600, 3200MHz / 내장그래픽: 탑재 / 인텔 UHD 770 / 기술 지원:SMT(하이퍼스레딩);인텔 XTU;인텔 퀵싱크;인텔 딥러닝부스트 / 쿨러:미포함 / 시네벤치R23(싱글):2069 / 시네벤치R23(멀티):34818",
    },
    {
      id: "ryzen-9-7950x",
      name: "AMD Ryzen 9 7950X",
      price: 899000,
      image: "/images/AMD Ryzen 9 7950X.png",
      description:
        "AMD(소켓AM5) / 5세대(Zen4) / 5nm / 16코어 / 32스레드 / 기본 클럭:4.5GHz / 최대 클럭:5.7GHz / L2 캐시:16MB / L3 캐시:64MB / TDP:170W / PPT:230W / PCIe5.0 / 메모리 규격:DDR5 / 5200MHz / 내장그래픽: 탑재 / AMD 라데온 그래픽 / 기술 지원:SMT(하이퍼스레딩) / 쿨러:미포함 / 시네벤치R23(싱글):2025 / 시네벤치R23(멀티):36836",
    },
    {
      id: "intel-i9-14900k",
      name: "Intel Core i9-14900K",
      price: 1199000,
      image: "/images/Intel Core i9-14900K.png",
      description:
        "인텔(소켓1700) / 10nm(인텔7) / P8+E16코어 / 16+16스레드 / 기본 클럭:3.2GHz / 최대 클럭:6.0GHz / L2 캐시:32MB / L3 캐시:36MB / PBP-MTP:125-253W / PCIe5.0, 4.0 / 메모리 규격:DDR5, DDR4 / 5600, 3200MHz / 내장그래픽: 탑재 / 인텔 UHD 770 / 기술 지원:SMT(하이퍼스레딩);인텔 XTU;인텔 퀵싱크;인텔 딥러닝부스트 / 쿨러:미포함 / 시네벤치R23(싱글):2277 / 시네벤치R23(멀티):40146",
    },
  ],
  mb: [
    {
      id: "asus-prime-b650m",
      name: "ASUS PRIME B650M-A",
      price: 199000,
      image: "/images/ASUS PRIME B650M-A.png",
      description:
        "AMD(소켓AM5) / AMD B650 / M-ATX (24.4x24.4cm) / [메모리] / DDR5 / 6400MHz (PC5-51200) / 4개 / 메모리 용량:최대 128GB / EXPO / [확장슬롯] / VGA 연결:PCIe4.0 x16 / PCIe버전:PCIe4.0 / PCIex16:1개 / PCIex16(at x1):2개 / [저장장치] / M.2:2개 / SATA3:4개 / M.2 연결:PCIe5.0;PCIe4.0;NVMe / HDMI / DP / D-SUB / USB3.x 10Gbps / USB3.x 5Gbps / USB 2.0 / RJ-45 / 오디오잭 / PS/2 / USB A타입:8개 / [랜/오디오] / 유선랜 칩셋:Realtek / 2.5Gbps / RJ-45:1개 / 오디오 칩셋:Realtek / 7.1채널(8ch) / [내부I/O] / USB/팬 헤더:USB3.0 헤더;USB2.0 헤더;RGB 12V 4핀 헤더;ARGB 5V 3핀 헤더 / 시스템팬 4핀:3개 / I/O 헤더:TPM 헤더 / [특징] / UEFI",
    },
    {
      id: "msi-mpg-b650",
      name: "MSI MPG B650 EDGE WIFI",
      price: 299000,
      image: "/images/MSI MPG B650 EDGE WIFI.png",
      description:
        "AMD(소켓AM5) / AMD B650 / M-iTX (17.0x17.0cm) / 전원부:8+2+1페이즈 / [메모리] / DDR5 / 7200MHz (PC5-57600) / 2개 / 메모리 용량:최대 128GB / EXPO / [확장슬롯] / VGA 연결:PCIe4.0 x16 / PCIe버전:PCIe4.0 / PCIex16:1개 / [저장장치] / M.2:2개 / SATA3:4개 / M.2 연결:PCIe4.0;NVMe / [후면단자] / HDMI / USB3.x 20Gbps / USB3.x 10Gbps / USB3.x 5Gbps / RJ-45 / 오디오잭 / USB A타입:5개 / USB C타입:1개 / [랜/오디오] / 유선랜 칩셋:Realtek RTL8125BG / 2.5Gbps / RJ-45:1개 / AMD 계열 / 무선랜(Wi-Fi) / 블루투스 / 오디오 칩셋:Realtek ALC4080 / 7.1채널(8ch) / [내부I/O] / USB/팬 헤더:USB3.0 헤더;USB2.0 헤더;USB3.1 Type C 헤더;ARGB 5V 3핀 헤더 / 시����템팬 4핀:1개 / I/O 헤더:TPM 헤더 / [특징] / DrMOS / 전원부 방열판 / M.2 히트싱크 / UEFI",
    },
    {
      id: "gigabyte-b650-aorus",
      name: "GIGABYTE B650 AORUS ELITE AX",
      price: 349000,
      image: "/images/GIGABYTE B650 AORUS ELITE AX.png",
      description:
        "AMD(소켓AM5) / AMD B650 / M-ATX (24.4x24.4cm) / 전원부:12+2+2페이즈 / 페이즈당60A / Vcore출력합계:720A / [메모리] / DDR5 / 8000MHz (PC5-64000) / 4개 / 메모리 용량:최대 192GB / XMP3.0 / EXPO / [확장슬롯] / VGA 연결:PCIe4.0 x16 / PCIe버전:PCIe4.0 / PCIex16:1개 / PCIex16(at x4):1개 / [저장장치] / M.2:2개 / SATA3:4개 / M.2 연결:PCIe5.0;PCIe4.0;NVMe / [후면단자] / HDMI / DP / USB3.x 10Gbps / USB3.x 5Gbps / USB 2.0 / RJ-45 / S/PDIF / 오디오잭 / BIOS플래시백 / USB A타입:11개 / USB C타입:1개 / [랜/오디오] / 유선랜 칩셋:Realtek / 2.5Gbps / RJ-45:1개 / Realtek RTL8852CE / 무선랜(Wi-Fi) / 블루투스 / 오디오 칩셋:Realtek / 7.1채널(8ch) / [내부I/O] / USB/팬 헤더:썬더볼트 헤더;USB3.2 Type C 헤더;CPU추가팬(OPT) 헤더;펌프전용 헤더 / 시스템팬 4핀:3개 / I/O 헤더:TPM 헤더;프론트오디오AAFP 헤더;COM포트 헤더 / [특징] / DrMOS / 전원부 방열판 / M.2 히트싱크 / 일체형IO실드 / LED라이트 / UEFI",
    },
    {
      id: "asrock-b650m-pg",
      name: "ASRock B650M PG RIPTIDE",
      price: 249000,
      image: "/images/ASRock B650M PG RIPTIDE.png",
      description:
        "AMD(소켓AM5) / AMD B650 / M-ATX (24.4x24.4cm) / 전원부:12+2+1페이즈 / 페이즈당50A / Vcore출력합계:600A / [메모리] / DDR5 / 7200MHz (PC5-57600) / 4개 / 메모리 용량:최대 192GB / XMP / EXPO / [확장슬롯] / VGA 연결:PCIe4.0 x16 / PCIe버전:PCIe4.0;PCIe3.0 / PCIex16:1개 / PCIex16(at x4):1개 / PCIex1:2개 / CrossFire / [저장장치] / M.2:2개 / SATA3:4개 / M.2 연결:PCIe5.0;PCIe4.0;NVMe / [후면단자] / HDMI / DP / USB3.x 10Gbps / USB3.x 5Gbps / USB 2.0 / RJ-45 / 오디오잭 / USB A타입:7개 / USB C타입:1개 / [랜/오디오] / 유선랜 칩셋:Realtek Dragon RTL8125BG / 2.5Gbps / RJ-45:1개 / 오디오 칩셋:Realtek ALC897 / 7.1채널(8ch) / [내부I/O] / USB/팬 헤더:썬더볼트4 헤더;USB3.0 헤더;USB2.0 헤더;USB3.0 Type C 헤더;RGB 12V 4핀 헤더;ARGB 5V 3핀 헤더 / 시스템팬 4핀:3개 / I/O 헤더:TPM 헤더 / [특징] / SPS(DrMOS) / 전원부 방열판 / M.2 히트싱크 / LED라이트 / UEFI",
    },
    {
      id: "asus-rog-strix-x670e-e",
      name: "ASUS ROG STRIX X670E-E GAMING WIFI",
      price: 599000,
      image: "/images/ASUS ROG STRIX X670E-E GAMING WIFI.png",
      description:
        "AMD(소켓AM5) / AMD X670E / ATX (30.5x24.4cm) / 전원부:16+2페이즈 / [메모리] / DDR5 / 6400MHz (PC5-51200) / 4개 / 메모리 용량:최대 128GB / EXPO / [확장슬롯] / VGA 연결:PCIe5.0 x16 / PCIe버전:PCIe5.0;PCIe4.0;PCIe3.0 / PCIex16:1개 / PCIex16(at x4):1개 / PCIex16(at x1):1개 / [저장장치] / M.2:4개 / SATA3:4개 / M.2 연결:PCIe5.0;PCIe4.0;NVMe / [후면단자] / HDMI / DP / USB3.x 20Gbps / USB3.x 10Gbps / USB3.x 5Gbps / USB 2.0 / RJ-45 / S/PDIF / 오디오잭 / USB A타입:10개 / USB C타입:2개 / [랜/오디오] / 유선랜 칩셋:Intel I225-V / 2.5Gbps / RJ-45:1개 / 무선랜(Wi-Fi) / 블루투스 / 오디오 칩셋:SupremeFX ALC4080 / 7.1채널(8ch) / [내부I/O] / USB/팬 헤더:USB3.0 헤더;USB2.0 헤더;USB3.2 Type C 헤더;RGB 12V 4핀 헤더;ARGB 5V 3핀 헤더 / 시스템팬 4핀:5개 / [특징] / M.2 히트싱크 / LED라이트 / UEFI",
    },
    {
      id: "msi-meg-z790-ace",
      name: "MSI MEG Z790 ACE",
      price: 699000,
      image: "/images/MSI MEG Z790 ACE.png",
      description:
        "인텔(소켓1700) / 인텔 Z790 / E-ATX (30.5x27.7cm) / 전원부:24+1+2페이즈 / 페이즈당105A / Vcore출력합계:2520A / [메모리] / DDR5 / 7800MHz (PC5-62400) / 4개 / 메모리 용량:최대 128GB / XMP3.0 / [확장슬롯] / VGA 연결:PCIe5.0 x16 / PCIe버전:PCIe5.0;PCIe4.0 / PCIex16:1개 / PCIex16(at x8):1개 / PCIex16(at x4):1개 / CrossFire / [저장장치] / M.2:5개 / SATA3:6개 / M.2 연결:PCIe5.0;PCIe4.0;NVMe;SATA / [후면단자] / Type-C / 썬더볼트4 / USB3.x 10Gbps / RJ-45 / S/PDIF / 오디오잭 / USB A타입:7개 / USB C타입:1개 / [랜/오디오] / 유선랜 칩셋:Intel 2.5G / 2.5Gbps / RJ-45:2개 / Intel 계열 / 무선랜(Wi-Fi) / 블루투스 / 오디오 칩셋:Realtek ALC4082 / 7.1채널(8ch) / [내부I/O] / USB/팬 헤더:USB3.0 헤더;USB2.0 헤더;USB3.2 Type C 헤더;RGB 12V 4핀 헤더;ARGB 5V 3핀 헤더 / 시스템팬 4핀:5개 / I/O 헤더:TPM 헤더 / [특징] / DrMOS / 전원부 방열판 / M.2 히트싱크 / UEFI",
    },
  ],
  memory: [
    {
      id: "corsair-vengeance-16gb",
      name: "Corsair Vengeance RGB Pro 16GB",
      price: 89000,
      image: "/images/Corsair Vengeance RGB Pro 16GB.png",
      description:
        "데스크탑용 / DDR4 / 3600MHz (PC4-28800) / 램타이밍:CL18-22-22-42 / 1.35V / 램개수:2개 / LED 라이트 / XMP / 히트싱크:방열판 / 방열판 색상:블랙 / LED색상:RGB / LED 시스템:AURA SYNC;MYSTIC LIGHT;RGB FUSION;CORSAIR iCUE",
    },
    {
      id: "gskill-trident-32gb",
      name: "G.Skill Trident Z Neo 32GB",
      price: 149000,
      image: "/images/G.Skill Trident Z Neo 32GB.png",
      description:
        "데스크탑용 / DDR4 / 3600MHz (PC4-28800) / 램타이밍:CL16-19-19-39 / 1.35V / 램개수:2개 / LED 라이트 / XMP / 히트싱크:방열판 / 방열판 색상:블랙 / LED색상:RGB / LED 시스템:AURA SYNC;MYSTIC LIGHT;RGB FUSION;POLYCHROME",
    },
    {
      id: "crucial-ballistix-32gb",
      name: "Crucial Ballistix 32GB",
      price: 139000,
      image: "/images/Crucial Ballistix 32GB.png",
      description:
        "데스크탑용 / DDR4 / 4400MHz (PC4-35200) / 램타이밍: CL19-19-19-43 / 1.40V / 램개수: 2개 / LED 라이트 / 히트싱크: 방열판 / 방열판 색상: 블랙 / LED색상: RGB / LED 시스템: AURA SYNC , MYSTIC LIGHT , RGB FUSION",
    },
    {
      id: "teamgroup-t-force-64gb",
      name: "TeamGroup T-Force Delta RGB 64GB",
      price: 299000,
      image: "/images/TeamGroup T-Force Delta RGB 64GB.png",
      description:
        "데스크탑용 / DDR5 / 5600MHz (PC5-44800) / 램타이밍:CL36-36-36-76 / 1.30V / 램개수:2개 / LED 라이트 / XMP3.0 / 온다이ECC / 히트싱크:방열판 / 방열판 색상:화이트 / LED색상:RGB / LED 시스템:AURA SYNC;MYSTIC LIGHT;RGB FUSION;POLYCHROME / 높이:46.1mm",
    },
    {
      id: "kingston-fury-32gb",
      name: "Kingston FURY Beast 32GB",
      price: 129000,
      image: "/images/Kingston FURY Beast 32GB.png",
      description:
        "데스크탑용 / DDR5 / 5200MHz (PC5-41600) / 램타이밍: CL40 / 1.25V / 램개수: 2개 / XMP3.0 / 히트싱크: 방열판 / 방열판 색상: 블랙 / 높이: 34.9mm",
    },
    {
      id: "patriot-viper-64gb",
      name: "Patriot Viper Steel 64GB",
      price: 279000,
      image: "/images/Patriot Viper Steel 64GB.png",
      description:
        "데스크탑용 / DDR4 / 3600MHz (PC4-28800) / 램타이밍:CL18-22-22-42 / 1.35V / 램개수:2개 / XMP / 히트싱크:방열판 / 방열판 색상:실버/그레이 / 높이:44.4mm",
    },
  ],
  ssd: [
    {
      id: "samsung-980-pro-1tb",
      name: "Samsung 980 PRO 1TB",
      price: 129000,
      image: "/images/Samsung 980 PRO 1TB.png",
      description:
        "내장형SSD / M.2 (2280) / PCIe4.0x4 (64GT/s) / NVMe 1.3c / TLC(토글) / 3D낸드 / DRAM 탑재 / DDR4 1GB / 컨트롤러:삼성 Elpis / PS5 호환 / [성능] / 순차읽기:7,000MB/s / 순차쓰기:5,000MB/s / 읽기IOPS:1,000K / 쓰기IOPS:1,000K / [지원기능] / TRIM / GC / SLC캐싱 / S.M.A.R.T / DEVSLP / AES 암호화 / 전용 S/W / [환경특성] / MTBF:150만시간 / TBW:600TB / A/S기간:5년;제한보증 / 방열판 포함 / 두께:8.6mm",
    },
    {
      id: "wd-black-sn850x-2tb",
      name: "WD Black SN850X 2TB",
      price: 249000,
      image: "/images/WD Black SN850X 2TB.png",
      description:
        "내장형SSD / M.2 (2280) / PCIe4.0x4 (64GT/s) / NVMe 1.4 / TLC(기타) / 3D낸드 / DRAM 탑재 / DDR4 2GB / 컨트롤러:WD / PS5 호환 / [성능] / 순차읽기:7,300MB/s / 순차쓰기:6,600MB/s / 읽기IOPS:1,200K / 쓰기IOPS:1,100K / [지원기능] / TRIM / SLC캐싱 / S.M.A.R.T / 전용 S/W / [환경특성] / TBW:1,200TB / A/S기간:5년;제한보증 / 방열판 미포함 / 두께:2.38mm / 7.5g",
    },
    {
      id: "crucial-p5-plus-2tb",
      name: "Crucial P5 Plus 2TB",
      price: 229000,
      image: "/images/Crucial P5 Plus 2TB.png",
      description:
        "내장형SSD / M.2 (2280) / PCIe4.0x4 (64GT/s) / NVMe 1.4 / TLC(기타) / 3D낸드 / DRAM 탑재 / DDR4 2GB / 컨트롤러:기타 / PS5 호환 / [성능] / 순차읽기:6,600MB/s / 순차쓰기:5,000MB/s / 읽기IOPS:720K / 쓰기IOPS:700K / [지원기능] / TRIM / SLC캐싱 / S.M.A.R.T / DEVSLP / ECC / AES 암호화 / 전용 S/W / [환경특성] / MTBF:200만시간 / TBW:1,200TB / 방열판 미포함 / 두께:2.4mm / 17g",
    },
    {
      id: "sabrent-rocket-4-plus-4tb",
      name: "Sabrent Rocket 4 Plus 4TB",
      price: 499000,
      image: "/images/Sabrent Rocket 4 Plus 4TB.png",
      description:
        "내장형SSD / M.2 (2280) / PCIe4.0x4 (64GT/s) / NVMe 1.3 / TLC(기타) / 3D낸드 / 컨트롤러:기타 / PS5 호환 / [성능] / 순차읽기:7,000MB/s / 순차쓰기:6,850MB/s / [지원기능] / TRIM / S.M.A.R.T / [환경특성] / TBW:3,000TB / 방열판 제공(탈거가능)",
    },
    {
      id: "corsair-mp600-pro-2tb",
      name: "Corsair MP600 PRO 2TB",
      price: 269000,
      image: "/images/Corsair MP600 PRO 2TB.png",
      description:
        "내장형SSD / M.2 (2280) / PCIe4.0x4 (64GT/s) / NVMe 1.4 / TLC(기타) / 3D낸드 / DRAM 탑재 / DDR4 2GB / 컨트롤러:PS5018-E18 / PS5 호환 / [성능] / 순차읽기:7,000MB/s / 순차쓰기:5,700MB/s / 읽기IOPS:1,000K / 쓰기IOPS:1,200K / [환경특성] / MTBF:160만시간 / TBW:1,400TB / A/S기간:5년 / 방열판 미포함 / 두께:3mm / 8.2g",
    },
    {
      id: "seagate-firecuda-530-4tb",
      name: "Seagate FireCuda 530 4TB",
      price: 549000,
      image: "/images/Seagate FireCuda 530 4TB.png",
      description:
        "내장형SSD / M.2 (2280) / PCIe4.0x4 (64GT/s) / NVMe 1.4 / TLC(기타) / 3D낸드 / DRAM 탑재 / 컨트롤러:파이슨 E18 / PS5 호환 / [성능] / 순차읽기:7,400MB/s / 순차쓰기:6,800MB/s / 읽기IOPS:1,300K / 쓰기IOPS:1,300K / [지원기능] / TRIM / GC / SLC캐싱 / S.M.A.R.T / DEVSLP / AES 암호화 / 전용 S/W / [환경특성] / MTBF:180만시간 / TBW:5,050TB / A/S기간:5년;데이터 복구 3년;제한보증 / 방열판 포함 / 두께:11.10mm / 49g",
    },
  ],
  case: [
    {
      id: "nzxt-h510",
      name: "NZXT H510",
      price: 119000,
      image: "/images/NZXT H510.png",
      description:
        "PC케이스(ATX) / 미들타워 / 파워미포함 / ATX / M-ATX / M-ITX / 쿨링팬:총2개 / 측면 패널 타입:강화유리 / 후면:120mm x1 / 상단:120mm x1 / 너비(W):210mm / 깊이(D):428mm / 높이(H):460mm / 파워 장착 길이:200mm / 파워 위치:하단후면 / VGA 장착 길이:381mm / CPU쿨러 장착높이:165mm / LED 색상:레드",
    },
    {
      id: "corsair-4000d-airflow",
      name: "Corsair 4000D Airflow",
      price: 129000,
      image: "/images/Corsair 4000D Airflow.png",
      description:
        "PC케이스(ATX) / 미들타워 / 파워미포함 / E-ATX / ATX / M-ATX / M-ITX / 쿨링팬:총3개 / LED팬:3개 / 전면 패널 타입:메쉬 / 측면 패널 타입:강화유리 / 전면:120mm LED x3 / 너비(W):230mm / 깊이(D):453mm / 높이(H):466mm / 파워 장착 길이:180mm / 파워 위치:하단후면 / VGA 장착 길이:360mm / CPU쿨러 장착높이:170mm / RGB 컨트롤 / LED 색상:RGB",
    },
    {
      id: "lian-li-o11-dynamic",
      name: "Lian Li O11 Dynamic",
      price: 199000,
      image: "/images/Lian Li O11 Dynamic.png",
      description:
        "PC케이스(ATX) / 미들타워 / 파워미포함 / E-ATX / ATX / M-ATX / 측면 패널 타입:강화유리 / 너비(W):272mm / 깊이(D):445mm / 높이(H):446mm / 파워 장착 길이:255mm / 파워 위치:하단후면 / VGA 장착 길이:420mm / CPU쿨러 장착높이:155mm",
    },
    {
      id: "fractal-design-meshify-c",
      name: "Fractal Design Meshify C",
      price: 149000,
      image: "/images/Fractal Design Meshify C.png",
      description:
        "PC케이스(ATX) / 미들타워 / 파워미포함 / ATX / M-ATX / M-ITX / 쿨링팬:총2개 / 전면 패널 타입:메쉬 / 측면 패널 타입:강화유리 / 후면:120mm / 전면:120mm / 너비(W):217mm / 깊이(D):395mm / 높이(H):440mm / 파워 장착 길이:175mm / 파워 위치:하단후면 / VGA 장착 길이:335mm / CPU쿨러 장착높이:172mm",
    },
    {
      id: "phanteks-eclipse-p400a",
      name: "Phanteks Eclipse P400A",
      price: 139000,
      image: "/images/Phanteks Eclipse P400A.png",
      description:
        "PC케이스(ATX) / 미들타워 / 파워미포함 / E-ATX / ATX / M-ATX / M-ITX / 쿨링팬:총3개 / LED팬:3개 / 전면 패널 타입:메쉬 / 측면 패널 타입:강화유리 / 전면:120mm LED x3 / 너비(W):210mm / 깊이(D):470mm / 높이(H):465mm / 파워 장착 길이:270mm / 파워 위치:하단후면 / VGA 장착 길이:280mm / CPU쿨러 장착높이:160mm / RGB 컨트롤 / LED 색상:RGB",
    },
    {
      id: "cooler-master-nr200",
      name: "Cooler Master NR200",
      price: 99000,
      image: "/images/Cooler Master NR200.png",
      description:
        "미니ITX / 미니ITX(리틀밸리) / 파워미포함 / M-ITX / 쿨링팬:총2개 / 전면 패널 타입:일반(솔리드) / 측면 패널 타입:강화유리 / 상단:120mm x2 / 너비(W):185mm / 높이(H):292mm / 깊이(D):376mm / 파워 장착 길이:130mm / VGA 장착 길이:330mm / CPU쿨러 장착높이:153mm",
    },
  ],
  cooler: [
    {
      id: "noctua-nh-d15",
      name: "Noctua NH-D15",
      price: 99000,
      image: "/images/Noctua NH-D15.png",
      description:
        "CPU 쿨러 / 듀얼타워형 / 공랭 / 팬 쿨러 / [호환/크기] / 인텔 소켓:LGA1851;LGA1700;LGA1200;LGA115x / AMD 소켓:AM5;AM4 / 가로:150mm / 세로:152mm / 높이:168mm / 무게:1.525kg / [쿨링팬] / 팬 크기:140mm / 팬 개수:2개 / 25T / 4핀 / 베어링:SSO2(유체+마그네틱) / 1500 RPM / 최대 풍량:91.58 CFM / 최대 팬소음:24.8dBA / 작동전압:팬 12V / [부가기능] / PWM 지원 / 제로팬(0-dB기술) / non-LED / [구성품/기타] / 구성품:써멀컴파운드",
    },
    {
      id: "cooler-master-hyper-212",
      name: "Cooler Master Hyper 212 EVO",
      price: 49000,
      image: "/images/Cooler Master Hyper 212 EVO.png",
      description:
        "CPU 쿨러 / 싱글타워형 / 공랭 / 팬 쿨러 / [호환/크기] 인텔 소켓: LGA1200, LGA115x , LGA2011 , LGA1366 , LGA775 / AMD 소켓: FMx/AM2,3 / 무게: 626g / [쿨링팬] 팬 크기: 120mm / 팬 개수: 1개 / 25T / 4핀 / 베어링: 슬리브 / 2000 RPM / 최대 풍량: 82.9 CFM / 최대 팬소음: 36dBA / 크기: 120 x 80 x 159mm",
    },
    {
      id: "be-quiet-dark-rock-pro-4",
      name: "be quiet! Dark Rock Pro 4",
      price: 89000,
      image: "/images/be quiet! Dark Rock Pro 4.png",
      description:
        "CPU 쿨러 / 듀얼타워형 / 공랭 / 팬 쿨러 / TDP:270W / A/S기간:3년 / [호환/크기] / 인텔 소켓:LGA1700;LGA1200;LGA115x / AMD 소켓:AM5;AM4 / 가로:136mm / 세로:145mm / 높이:168mm / 무게:1.29kg / [쿨링팬] / 팬 크기:135mm, 120mm / 팬 개수:2개 / 25T / 4핀 / 베어링:FDB(유체) / 1500, 2000 RPM / 최대 팬소음:23.3dBA / 작동전압:팬 12V / [부가기능] / PWM 지원",
    },
    {
      id: "arctic-freezer-34-esports-duo",
      name: "Arctic Freezer 34 eSports DUO",
      price: 79000,
      image: "/images/Arctic Freezer 34 eSports DUO.png",
      description:
        "CPU 쿨러 / 싱글타워형 / 공랭 / TDP:210W / [호환/크기] / 인텔 소켓:LGA1200;LGA115x;LGA2066;LGA2011-V3;LGA2011 / AMD 소켓:AM4 / 가로:124mm / 세로:103mm / 높이:157mm / 무게:764g / [쿨링팬] / 팬 크기:120mm / 팬 개수:2개 / 베어링:FDB(유체) / 2100 RPM / PWM 지원 / non-LED",
    },
    {
      id: "corsair-h100i-rgb-platinum",
      name: "Corsair H100i RGB Platinum",
      price: 149000,
      image: "/images/Corsair H100i RGB Platinum.png",
      description:
        "CPU 쿨러 / 수랭 / [호환/크기] / 인텔 소켓:LGA1200;LGA115x;LGA2066;LGA2011-V3;LGA2011;LGA1366 / AMD 소켓:AM4;FMx/AM2,3;TR4 / [수랭] / 라디에이터:2열 / 라디에이터 길이:277mm / 라디에이터 두께:27mm / [쿨링팬] / 팬 크기:120mm / 팬 개수:2개 / 25T / 4핀 / 베어링:Hydraulic(유체) / 2200 RPM / 최대 풍량:63 CFM / 최대 팬소음:36dBA / [부가기능] / LED 라이트 / PWM 지원 / RGB / LED시스템:제조사 소프트웨어",
    },
    {
      id: "nzxt-kraken-x53",
      name: "NZXT Kraken X53",
      price: 129000,
      image: "/images/NZXT Kraken X53.png",
      description:
        "CPU 쿨러 / 수랭 / 팬 쿨러 / A/S기간: 6년+누수보상 / [호환/크기] 인텔 소켓: LGA1700, LGA1200, LGA115x , LGA2066 , LGA2011-V3 , LGA2011 , LGA1366 / AMD 소켓: AM5, AM4 , TR4 / [수랭] 라디에이터: 2열 / 라디에이터 길이: 275mm / 라디에이터 두께: 30mm / 호스 길이: 400mm / [쿨링팬] 팬 크기: 120mm / 팬 개수: 2개 / 26T / 4핀 / 베어링: FDB(유체) / 2000 RPM / 최대 풍량: 73.11 CFM / 풍압(정압): 2.93mmH₂O / 최대 팬소음: 36dBA / [부가기능] LED 라이트 / PWM 지원 / 펌프속도조절 / 워터블록/로고 회�� / RGB / LED시스템: 제조사 소프트웨어 / [구성품/기타] 22년 10월부로 소켓 호환 추가",
    },
  ],
  power: [
    {
      id: "corsair-rm750x",
      name: "Corsair RM750x",
      price: 129000,
      image: "/images/Corsair RM750x.png",
      description:
        "ATX 파워 / 정격출력:750W / 80 PLUS 골드 / LAMBDA인증:A- / +12V 싱글레일 / 140mm 팬 / 깊이:160mm / 무상 10년 / [커넥터] / 풀모듈러 / 메인전원:24핀 x1 / 보조전원:8핀(4+4) 2개 / PCIe 16핀(12+4):12VHPWR 1개 / PCIe 8핀(6+2):2개 / SATA:12개 / IDE 4핀:4개 / [부가기능] / 팬리스모드 / 자동 팬 조절 / 프리볼트",
    },
    {
      id: "seasonic-focus-gx-850",
      name: "Seasonic FOCUS GX-850",
      price: 169000,
      image: "/images/Seasonic FOCUS GX-850.png",
      description:
        "ATX 파워 / 정격출력:850W / 80 PLUS 골드 / ETA인증:PLATINUM / LAMBDA인증:A- / +12V 싱글레일 / +12V 가용률:98% / 액티브PFC / PF(역률):99% / 135mm 팬 / 깊이:140mm / 무상 10년 / [커넥터] / 풀모듈러 / 메인전원:24핀(20+4) / 보조전원:8핀(4+4) 2개 / PCIe 16핀(12+4):12V2x6 1개 / PCIe 8핀(6+2):3개 / SATA:8개 / IDE 4핀:3개 / [부가기능] / 팬리스모드 / 자동 팬 조절 / 대기전력 1W 미만",
    },
    {
      id: "evga-supernova-750-g5",
      name: "EVGA SuperNOVA 750 G5",
      price: 149000,
      image: "/images/EVGA SuperNOVA 750 G5.png",
      description:
        "ATX 파워/정격출력: 750W/80 PLUS 골드/+12V 싱글레일/+12V 가용률: 99%/액티브PFC/PF(역률): 99%/135mm 팬/깊이: 165mm",
    },
    {
      id: "be-quiet-straight-power-11-750w",
      name: "be quiet! Straight Power 11 750W",
      price: 159000,
      image: "/images/be quiet! Straight Power 11 750W.png",
      description:
        "ATX 파워 / 정격출력:750W / 80 PLUS 플래티넘 / +12V 다중레일 / 액티브PFC / PF(역률):99% / 135mm 팬 / 깊이:160mm / 무상 5년 / [커넥터] / 풀모듈러 / 메인전원:24핀(20+4) / 보조전원:8+4+4+4+4핀 1개 / PCIe 8핀(6+2):4개 / SATA:11개 / IDE 4핀:4개 / FDD:1개 / [부가기능] / 대기전력 1W 미만 / 프리볼트",
    },
    {
      id: "thermaltake-toughpower-gf1-850w",
      name: "Thermaltake Toughpower GF1 850W",
      price: 179000,
      image: "/images/Thermaltake Toughpower GF1 850W.png",
      description:
        "ATX 파워 / 정격출력:850W / 80 PLUS 골드 / ETA인증:GOLD / LAMBDA인증:A- / 전압변동:±2% / +12V 싱글레일 / +12V 가용률:100% / 액티브PFC / PF(역률):99% / 135mm 팬 / 깊이:160mm / 무상 10년 / [커넥터] / 풀모듈러 / 메인전원:24핀 / 보조전원:8+4+4핀 1개 / PCIe 16핀(12+4):12VHPWR 1개 / PCIe 8핀(6+2):2개 / SATA:4개 / IDE 4핀:4개 / FDD:1개 / [부가기능] / 팬리스모드 / 자동 팬 조절 / 대기전력 1W 미만 / 프리볼트",
    },
    {
      id: "silverstone-strider-platinum-1000w",
      name: "SilverStone Strider Platinum 1000W",
      price: 249000,
      image: "/images/SilverStone Strider Platinum 1000W.png",
      description:
        "ATX 파워 / 정격출력: 1000W / 80 PLUS 실버 / +12V 다중레일 / 액티브PFC / 135mm 팬 / 무상 3년 / [커넥터] 풀모듈러 / 메인전원: 24핀(20+4) / PCIe 8핀(6+2): 4개 / PCIe 6핀: 2개 / SATA: 6개 / IDE 4핀: 6개 /",
    },
  ],
} as const

// 선택된 컴포넌트 타입
export type SelectedComponent = {
  type: ComponentType
  option: ComponentOption
}

