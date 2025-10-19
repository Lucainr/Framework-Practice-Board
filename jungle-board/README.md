# Jungle Board Monorepo

## 프로젝트 구조
```
apps/
  backend/      # Nest.js API 서버
  frontend/     # Next.js 프런트엔드
packages/
  shared/       # 공통 타입 & 유틸 (TypeScript)
docker/
  Dockerfile.*  # 서비스별 Docker 설정
docker-compose.dev.yml
docker-compose.prod.yml
.env.example
```

## 빠른 시작
1. `.env` 생성 및 값 입력
   ```bash
   cp .env.example .env
   ```
2. 개발용 컨테이너 실행
   ```bash
 docker compose -f docker-compose.dev.yml up --build
  ```
 - 프런트엔드: http://localhost:3000
  - 백엔드 API: http://localhost:3001
  - PostgreSQL: localhost:5432
  - 최초 한 번 아래 명령으로 데이터베이스 생성: `createdb -h localhost -U jungle jungle`

## 직접 실행 명령어
```bash
pnpm --filter @jungle-board/shared build
pnpm --filter backend start:dev
pnpm --filter frontend dev
```

## 배포용 이미지 빌드 & 실행
```bash
docker compose -f docker-compose.prod.yml up --build
```
`NEXT_PUBLIC_API_URL` 등 환경변수를 실제 배포 환경에 맞게 오버라이드하세요.
