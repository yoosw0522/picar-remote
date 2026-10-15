# PiCar Remote

Adeept PiCar-Pro V2.0 로봇을 폰에서 원격 조종하는 앱.

- `www/index.html` — 조종 화면 (라즈베리파이 `Server/dist/mobile.html` 과 동일한 파일)
- 로봇 서버: 영상 `http://<로봇IP>:5000/video_feed`, 제어 `ws://<로봇IP>:8888`

## APK 받기
`main` 브랜치에 푸시할 때마다 GitHub Actions가 APK를 빌드해 **Releases** 에 올립니다.
→ 저장소의 **Releases** 탭에서 최신 `PiCar-Remote.apk` 다운로드 → 갤럭시에 설치.

## 화면 수정하기
`www/index.html` 을 고쳐서 푸시하면 새 APK가 자동으로 만들어집니다.
라즈베리파이의 `mobile.html` 도 같은 파일로 바꿔주면 아이폰(홈 화면 추가)도 동일하게 반영됩니다.

## 로컬 빌드 (Android Studio 있는 경우)
```
npm install
npm run android:add      # android/ 폴더 생성 + 설정 패치
npx cap open android     # Android Studio 에서 열기
```
