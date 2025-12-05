# ⚾️ KBO Foreign Hitter Predictor

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.4-3178C6?logo=typescript)
![Styled Components](https://img.shields.io/badge/Styled_Components-5.3.6-DB7093?logo=styled-components)

**Data-Driven Scouting & Interactive Storytelling**

KBO 리그 외국인 타자의 성공 가능성을 예측하는 **인터랙티브 데이터 저널리즘 웹 애플리케이션**입니다.
단순한 대시보드를 넘어, "왜 MLB 거포들이 KBO에서 실패하는가?"에 대한 해답을 스토리텔링 형식으로 풀어냅니다.

[Demo](#) • [Features](#-features) • [Installation](#-installation)

</div>

---

## 📖 Overview

이 프로젝트는 **Scrollytelling(스크롤 스토리텔링)** 기법을 사용하여 사용자가 스크롤함에 따라 데이터 분석의 흐름을 자연스럽게 따라가도록 설계되었습니다.

1.  **Intro**: 외국인 타자들의 실패 역사와 문제 제기
2.  **Analysis**: wRC+의 함정, K%와 BB%의 중요성, 그리고 리그 적응 비용(Delta) 분석
3.  **Solution**: 환경 독립적 지표에 가중치를 둔 새로운 평가 모델 **KFS(Korean Foreigner Success) Score** 제시
4.  **Application**: 2025년 AAA 대상자 스카우팅 리포트 및 예측 시뮬레이션

---

## ✨ Features

### 📜 Interactive Scrollytelling
- **몰입형 경험**: 좌측의 내러티브와 우측의 동적 시각화가 연동되어 데이터의 의미를 직관적으로 전달합니다.
- **Dynamic Charts**: 스크롤 위치에 따라 차트가 변화하며 데이터의 맥락을 설명합니다.

### 📊 Deep Data Analysis
- **Correlation Analysis**: AAA와 KBO 성적 간의 상관관계(Pearson Correlation) 분석 시각화.
- **Delta Insights**: 리그 이동 시 발생하는 주요 스탯(K%, BB%, ISO 등)의 변화량 분석.
- **Success vs Failure**: 테임즈, 로사리오 등 성공 사례와 실패 사례의 비교 분석.

### 🎯 AAA Scouting Board
- **2025 Prospects**: 2025년 영입 대상이 될 수 있는 150+명의 AAA 선수 데이터베이스.
- **Deep Dive Overlay**: 선수 클릭 시 상세 스탯, KFS 점수 분해, 유사 선수 비교 등을 제공하는 심층 분석 패널.
- **Analyst Insights**: 데이터 기반의 자동 생성된 선수 평가 코멘트.

### 🧮 KFS Score (Korean Foreigner Success Score)
- **Custom Algorithm**: 기존 wRC+ 의존도를 낮추고, 컨택 능력과 선구안 등 '적응력' 관련 지표를 강조한 독자적인 스코어링 시스템.
- **Risk Assessment**: 선수의 실패 확률을 'Risk Level'로 시각화.

### 🔮 Prediction Model
- **Simulator**: 사용자가 직접 입력한 AAA 성적을 바탕으로 KBO 예상 성적을 시뮬레이션.
- **Interactive Calculator**: 슬라이더를 통해 변수를 조정하며 예측 결과의 변화 관찰.

---

## 🛠 Tech Stack

- **Core**: React 18, TypeScript
- **Styling**: Styled-components
- **Visualization**: Recharts, Custom SVG Components
- **State Management**: React Context / Local State
- **Data Processing**: Custom statistical utility functions (Pearson correlation, Z-score, etc.)

---

## 🚀 Installation

```bash
# Repository 클론
git clone https://github.com/yourusername/im-kbo-scouter.git

# 디렉토리 이동
cd im-kbo-scouter

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

## 📂 Project Structure

```
src/
├── components/        # 재사용 가능한 UI 컴포넌트
│   ├── AAAScoutingBoard.tsx  # 스카우팅 보드 메인
│   ├── ScrollyLayout.tsx     # 스크롤텔링 레이아웃 엔진
│   ├── CorrelationChart.tsx  # 상관관계 분석 차트
│   ├── DeepDiveOverlay.tsx   # 선수 상세 분석 오버레이
│   └── ...
├── data/             # 전처리된 야구 데이터 (JSON)
├── pages/            # 주요 페이지 (PredictionModel 등)
├── styles/           # 전역 스타일 및 테마
├── utils/            # 통계 계산 함수 (sabermetrics.ts)
└── App.tsx           # 메인 애플리케이션 구조 (Steps 정의)
```

---

## 📝 License

This project is licensed under the MIT License.