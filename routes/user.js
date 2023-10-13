const express = require("express");
const router = express.Router();
const conn = require("../config/database");

// 회원가입 기능 라우터
router.post("/register", (req, res) => {
	let { m_id, m_pw, m_pw2, m_name, m_phone, store_name, store_owner, store_phone, store_loc } = req.body;
	console.log('가입', req.body)
	let sql_m = "insert into members(m_id, m_pw, m_name, m_phone) values(?,?,?,?)";
	let sql_s = "insert into stores(store_name, store_owner, store_phone, store_loc, m_id) values(?,?,?,?,?)";
	// tip!
	// 데이터가 {} <-이렇게만 뜨고 넘어오질 않는다=> body-parser 설치
	// 데이터가 아예 넘어오질 않는가=> front 단에서 input name 설정했는지 확인
	// Router관련 오류가 뜬다=> 경로 설정 잘못한거임(front, router 경로 같은지 확인)

	// 1. join.html 에서 받아온 id, pw, pw2, name, address를 각각의 변수에 저장

	// 2. 비밀번호와, 비밀번호 확인 데이터가 같으면 회원가입 로직으로
	if (m_id && m_pw && m_name && m_phone) {
		// 회원가입 로직

		// tip!
		// 본격적으로 DB연동하기 전에, 테이블을 생성해야한다.

		// 3. DB 연결 작업 => insert into 테이블명 values (아이디, 비번, 이름, 주소)


		// 회원가입 정보 저장
		if (m_pw === m_pw2) {
			conn.query(sql_m, [m_id, m_pw, m_name, m_phone], (err, rows) => {
				console.log('err: ', err);
				if (err) {
					console.log('회원가입 실패')
					res.send(`
                  <script>
                      alert('올바르지 못한 정보입니다.');
                      location.href="http://localhost:3333/register";
                  </script>
              `);
				} else {
					console.log('rows', rows);
					if (rows.affectedRows > 0) {
						console.log('회원가입 성공');
						// 3. 매장 정보 저장
						conn.query(sql_s, [store_name, store_owner, store_phone, store_loc, m_id], (err, rows) => {
							if (err) {
								console.log('매장정보 저장 실패');
								console.log('매장err:', err);

							} else {
								console.log('회원가입 및 매장 정보 입력 성공');
								res.send(`
													<script>
															alert('가입을 축하합니다!');
															location.href="http://localhost:3333/login";
													</script>
																`);
							}
						});
					}
				}
			});
		} else {
			res.send(`
          <script>
              alert('비밀번호가 일치하지 않습니다!');
              location.href="http://localhost:3333/register";
          </script>
      `);
		}
	} else {
		res.send(`
      <script>
          alert('필수입력사항을 입력해주세요.');
          location.href="http://localhost:3333/register";
      </script>
  `);
	}
})
// 로그인 기능 라우터
router.post("/login", (req, res) => {
	// 1. layout.html 에서 login Box 안의 데이터를 받아온다 (id, pw)
	let { m_id, m_pw } = req.body
	console.log(m_id + ',', m_pw)

	// 2. 그 데이터들을 각각 id, pw 변수 안에 저장
	// 3. DB 연동해서 해당 id값과 pw값이 일치하는 데이터가 DB에 있는지 확인한다
	let sql = 'select m_id,m_name from members where m_id=? and m_pw=?'
	// 4. 데이터가 존재한다면 로그인 성공
	conn.query(sql, [m_id, m_pw], (err, rows) => {
		console.log(rows)
		if (rows.length > 0) { //if(rows)가 안되는 이유: rows는 로그인에 실패해도 뜸

			console.log('로그인 성공')
			req.session.m_id = rows[0].m_id;
			// req.session.name=rows[0].username;

			req.session.save(() => {

				res.send(`
        <script>
        alert("${req.session.m_id} 환영합니다.");location.href="/"
        </script>>`)
			})
		} else {
			console.log('로그인 실패')
			res.send(`
        <script>
        alert("회원 정보를 다시 확인해주시기 바랍니다.");location.href="/login"
        </script>>`)

		}

	})
	//      4-2) 로그인이 성공했다면, 해당 유저의 정보를 세션에 저장 (id, nick, address)
	//      4-3) 환영합니다! alert => 메인으로 이동
	// 5. 데이터가 존재하지 않는다면 로그인 실패
});

// 로그아웃 기능 라우터
router.get("/logout", (req, res) => {
	console.log('logout')
	req.session.user = ""
	req.session.save(() => {
		res.send('<script>location.href="/"</script>')
	})
	// 1. 세션 삭제
	// 2. 메인페이지에 다시 접근
});

// 회원 정보 수정 기능 라우터 (JS fetch 와의 연동) ★★★★★
router.post("/myPage", (req, res) => {
	console.log('회원정보 수정', req.body);
	// 1. 내가 받아온 새 이름과 새 주소를 name, add라는 변수에 넣을 것
	let { name, address } = req.body;

	// 2. id 값? session에서 가져오기
	let id = req.session.user.m_id;

	let sql = "update members set m_name=?, m_phone=?, m_pw=? where m_id=?"
	conn.query(sql_m, [m_id, m_pw, m_name, m_phone,], (err, rows) => {
		console.log('결과', rows)
		if (rows) {
			// 변경성공
			req.session.user.m_pw = m_pw;
			req.session.user.m_name = m_name;
			req.session.user.m_phone = m_phone;
			res.json({ msg: 'success' })
		} else {
			// 변경실패
			res.json({ msg: 'failed' })
		}
	})

	// 3. DB 연동
	//  3-2) update set 을 이용해서 DB 값 변경
	//  3-3) 세션 안에 있는 값 변경 (이름, 주소 변경)
	// 4. console.log('값 변경 성공!'), '값 변경 실패'
	//       => 페이지 이동 X 캡쳐해서 단톡방에~

});

module.exports = router;
