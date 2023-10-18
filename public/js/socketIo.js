const socket = io(); // 서버에 연결

// 세션 스토리지에서 "badgeCount" 값 읽기
const badgeCount = sessionStorage.getItem("badgeCount");

if (badgeCount) {
  document.getElementById('badgeCount').innerText = badgeCount;
}

// 서버로 메시지 전송
// socket.emit("message", "안녕, 서버!");

// 서버로부터 응답 받을 때 처리
socket.on("lowStock", (data) => {
  console.log("서버로부터 응답 받음:", data);
  if (data != parseInt(document.getElementById('badgeCount').innerText)) {
    document.getElementById('badgeCount').innerText = data

    document.getElementById('alertsDropdown').click();

    // 세션 스토리지에 "badgeCount" 값 저장
    sessionStorage.setItem("badgeCount", data);
  }
});

// 창이 닫힐 때 소켓 연결 종료
window.addEventListener("beforeunload", () => {
  socket.disconnect();
});