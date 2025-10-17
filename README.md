# 🏆 KBO Foreign Hitter Predictor

<div align="center">

![KBO Predictor](https://img.shields.io/badge/KBO-Predictor-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.4-3178C6?logo=typescript)
![Styled Components](https://img.shields.io/badge/Styled_Components-5.3.6-DB7093?logo=styled-components)

**Data-Driven Scouting with DIKW Model**

KBO 리그 외국인 타자의 성공 가능성을 예측하는 인터랙티브 웹 애플리케이션

[Demo](#) • [Features](#features) • [Installation](#installation) • [Usage](#usage)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [DIKW Model](#dikw-model)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Data Analysis](#data-analysis)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

KBO Foreign Hitter Predictor는 **DIKW(Data-Information-Knowledge-Wisdom) 모델**을 기반으로 외국인 선수의 KBO 적응 가능성을 예측하는 웹 애플리케이션입니다.

### 프로젝트 목표

- 📊 **데이터 기반 스카우팅**: 69명의 외국인 타자 통계 분석
- 🔍 **상관관계 분석**: Pre-KBO와 KBO 성적 간의 관계 파악
- 🎯 **예측 모델**: K-Success Score 계산으로 성공 가능성 예측
- 💰 **리스크 감소**: 객관적 지표로 영입 실패 위험 최소화

---

## ✨ Features

### 📊 Dashboard
- 총 분석 선수 수
- 평균 wRC+ (Weighted Runs Created Plus)
- 평균 홈런 수
- 성공률 (wRC+ > 110)

### ⚖️ Player Comparison
- Top 10 선수 성과 비교
- 클릭으로 상세 통계 확인
- 12가지 핵심 지표 시각화
- 인터랙티브 선수 카드

### 📈 Correlation Analysis
- K% 안정성: r ≈ 0.50 (중간 수준 상관관계)
- BB% 안정성: r ≈ 0.29 (낮은 수준 상관관계)
- wRC+ 전이성: r ≈ -0.12 (제한적 전이)
- ΔStats 분포 분석

### 🔮 Prediction Model
- **K-Success Score 계산기**
- Pre-KBO 통계 입력
- 실시간 성공 가능성 예측
- 리스크 레벨 표시