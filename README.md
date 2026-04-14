# 🎫 Ticket Reservation Front

> **분산 환경 티켓 예매 시스템 — Frontend**  
> React · Vite · Tailwind CSS · Zustand · Axios

분산 환경 티켓 예매 시스템의 프론트엔드 레포지토리입니다.  
회원가입/로그인부터 좌석 선택, 예매, 내 예매 목록 조회까지 전체 예매 플로우를 구현했습니다.

🔗 **Backend Repository** → [ticket-reservation-service](https://github.com/ms/ticket-reservation-service)

---

## 📌 주요 기능

| 기능 | 설명 |
|---|---|
| 회원가입 / 로그인 | JWT 기반 인증, 전역 상태 관리 (Zustand) |
| 공연 목록 | 예매 가능한 공연 카드 목록 조회 |
| 좌석 선택 | 시각적 좌석 배치도, 실시간 선택/해제 |
| 예매 확인 | 선택 좌석 및 결제 정보 확인 |
| 예매 완료 | 예매 번호 및 완료 화면 |
| 내 예매 목록 | 로그인한 사용자의 예매 내역 조회 |
| 인증 보호 | PrivateRoute로 비로그인 사용자 접근 차단 |

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| 상태 관리 | Zustand |
| HTTP 클라이언트 | Axios (JWT interceptor) |
| 라우팅 | React Router v6 |

---

## 📺 화면 구성

```
/                        공연 목록 (EventListPage)
/login                   로그인 / 회원가입 (LoginPage)
/events/:id/seats        좌석 선택 - 시각적 배치도 (SeatSelectPage)
/events/:id/confirm      예매 확인 + 결제 (ReservationPage)
/reservation-complete    예매 완료 (ReservationCompletePage)
/my-reservations         내 예매 목록 (MyReservationsPage)
```

---

## 🔄 예매 플로우

```
로그인
  │
  ▼
공연 목록 (/))
  │  공연 카드 클릭
  ▼
좌석 선택 (/events/:id/seats)
  │  좌석 선택 후 예매하기 버튼
  ▼
예매 확인 (/events/:id/confirm)
  │  결제하기 버튼
  ▼
예매 완료 (/reservation-complete)
  │
  ▼
내 예매 목록 (/my-reservations)
```

---

## 🔐 인증 처리

- 로그인 성공 시 JWT를 **Zustand**로 전역 관리
- **Axios interceptor**로 모든 API 요청에 `Authorization: Bearer {token}` 자동 첨부
- **PrivateRoute**로 미로그인 사용자는 `/login`으로 리다이렉트

---

## 📁 프로젝트 구조

```
src/
├── api/
│   └── client.js          # Axios 인스턴스 + JWT interceptor
├── components/
│   └── Navbar.jsx          # 공통 네비게이션 바
├── pages/
│   ├── LoginPage.jsx        # 로그인 / 회원가입
│   ├── EventListPage.jsx    # 공연 목록
│   ├── SeatSelectPage.jsx   # 좌석 선택
│   ├── ReservationPage.jsx  # 예매 확인
│   ├── ReservationCompletePage.jsx  # 예매 완료
│   └── MyReservationsPage.jsx       # 내 예매 목록
├── router/
│   └── PrivateRoute.jsx    # 인증 보호 라우터
├── store/
│   └── authStore.js        # Zustand 인증 상태
└── App.jsx
```

---

## 🚀 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 3. 백엔드 연동

`vite.config.js`에 프록시가 설정되어 있어 `/api` 요청이 자동으로 `localhost:8080`으로 전달됩니다.

```js
// vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

백엔드 서버를 먼저 실행한 후 프론트를 띄우면 바로 연동됩니다.

---

## 🔑 환경 변수

별도 `.env` 설정 없이 Vite 프록시로 백엔드 연동이 가능합니다.  
프로덕션 배포 시 아래 변수를 설정하세요.

| 변수 | 설명 |
|---|---|
| `VITE_API_BASE_URL` | 백엔드 API 주소 |
