# WebRTC 구현
## [소개]
- WebRTC API를 통해 PC, 모바일에서 가능한 P2P 통신 구현 

## [개발 환경]
- Node.js

## [사용 기술] 
대상|버전
---|---|
express|4.17.1
socket.io|4.3.2
PeerJs|
OpenSSL|[Download](https://slproweb.com/products/Win32OpenSSL.html)

## [실행방법] 
```jsx
npm init -y
```
```jsx
npm i express ejs socket.io
```
```jsx
npm i uuid
```
```jsx
npm i --save-dev nodemon
```
```jsx
npm run devStart
```
```jsx
npm install -g nodemon --unsafe-perm=true --allow-root
```
```jsx
peerjs --port 3001 
```

## [참고 링크]
[How To Create A Video Chat App With WebRTC](https://www.youtube.com/watch?v=DvlyzDZDEq4&t=145s)
