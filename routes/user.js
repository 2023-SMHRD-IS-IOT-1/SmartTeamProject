const express = require("express");
const router = express.Router();
const conn = require("../config/database");

// 회원가입 기능 라우터
router.post("/register", (req, res) => {
	let { m_id, m_pw, m_pw2, m_name, m_phone, store_name, store_owner, store_phone, store_loc } = req.body;
	console.log('가입', req.body)
	let sql_m = "insert into members(m_id, m_pw, m_name, m_phone) values(?,?,?,?)";
	let sql_s = "insert into stores(store_name, store_owner, store_phone, store_loc, m_id) values(?,?,?,?,?)";

	if (m_id && m_pw && m_name && m_phone) {
		// 회원가입 정보 저장
		if (m_pw === m_pw2) {
			if (store_name && store_owner && store_phone && store_loc || !store_name && !store_owner && !store_phone && !store_loc) {
				conn.query(sql_m, [m_id, m_pw, m_name, m_phone], (err, rows) => {
					console.log('err: ', err);
					if (err) {
						console.log('회원가입 실패')
						res.send(`
                  <script>
                      alert('이미 사용 중인 아이디입니다.');
                      location.href="http://localhost:3333/register";
                  </script>
              `);
					} else {
						conn.query(sql_s, [store_name, store_owner, store_phone, store_loc, m_id], (err, rows) => {
							if (rows.affectedRows > 0) {
								console.log('매장정보 입력 성공');
								res.send(`
							<script>
							alert('가입을 축하합니다!');
							location.href="http://localhost:3333/login";
							</script>
							`);
								console.log('회원가입 성공');
							}
						});
					}
				})
			} else
				res.send(`
							<script>
								alert('매장 정보를 모두 입력해주시기 바랍니다.');
								location.href="http://localhost:3333/register";
							</script>
						`);
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
	let sql_m = 'select * from members where m_id=? and m_pw=?'
	let sql_s = 'select * from stores where m_id=?'
	let sql_p = "select * from products where store_code=?"
	let sql_ship = 'select * from shipments where p_code=?'

	// 4. 데이터가 존재한다면 로그인 성공
	conn.query(sql_m, [m_id, m_pw], (err, m_rows) => {
		// console.log(rows)
		if (m_rows.length > 0) { //if(rows)가 안되는 이유: rows는 로그인에 실패해도 뜸
			req.session.user = m_rows[0];
			console.log('회원 세션 정보: ', req.session.user);

		
			conn.query(sql_s, [m_id], (err, s_rows) => {
				if (s_rows.length > 0) {
			            req.session.store = s_rows[0];
						console.log('매장 세션 정보: ', req.session.store);
						
						let store_code=req.session.store.store_code;	
						conn.query(sql_p, [store_code], (err, p_rows) => {
							req.session.product = p_rows;
							console.log('상품 세션 정보: ', req.session.product);
							
						// let p_code=req.session.product.p_code;
						// conn.query(sql_ship, [p_code], (err, ship_rows) => {
						// 	if(err){
						// 		console.log("출고err:",err);
						// 	}else{
						// 	req.session.shipment = ship_rows;
						// 	console.log('출고 세션 정보: ', req.session.shipment);
						// 	console.log('로그인 성공')
							req.session.save(() => {
										res.send(`
									<script>
									alert("${m_rows[0].m_name}님 환영합니다.");location.href="/"
									</script>>`)
										})
						// 			}
						// })
					})
				} else {
					console.log('매장 정보 부재')
				}
				// req.session.name=rows[0].username;

				//      4-2) 로그인이 성공했다면, 해당 유저의 정보를 세션에 저장 (id, nick, address)
				//      4-3) 환영합니다! alert => 메인으로 이동
				// 5. 데이터가 존재하지 않는다면 로그인 실패

			})
		} else {
			console.log('로그인 실패')
			res.send(`
			<script>
			alert("아이디 혹은 비밀번호를 다시 확인해주시기 바랍니다.");location.href="/login"
			</script>`);

		}
	})
})

// 로그아웃 기능 라우터
router.get("/logout", (req, res) => {
	console.log('logout')
	req.session.user = ""
	req.session.store = ""

	console.log("session:", req.session)
	req.session.save(() => {
		res.send(
			`<script>
			alert("로그아웃되었습니다.");location.href="/login"
			</script>`); //로그아웃할때 흰색 배경으로 바뀌는 부분.. 해결 생각해보기
	})
	// 1. 세션 삭제
	// 2. 메인페이지에 다시 접근
});

// 회원 정보 수정 기능 라우터 (JS fetch 와의 연동) ★★★★★
router.post("/myPage", (req, res) => {
	if (req.session.user) {

		console.log('회원정보 수정', req.body);
		let sql_s = "update stores set store_name = ?, store_owner=?, store_phone=?, store_loc=? where m_id=?";
		let sql_m = "update members set m_pw = ?, m_name = ?, m_phone = ? where m_id = ?"

		let sql_p = 'select * from products where store_code=?'
		// let sql_ship = 'select * from shipments where p_code=?'

		let { m_pw, m_pw2, m_name, m_phone, store_name, store_owner, store_phone, store_loc } = req.body;
		let m_id = req.session.user.m_id;

		if (m_pw === m_pw2) {
			conn.query(sql_m, [m_pw, m_name, m_phone, m_id], (err, rows) => {

				console.log('sql_m 결과', rows)

				if (err) {
					console.log("에러:", err);
				} else if (rows.affectedRows > 0) {
					// 	// 변경성공
					req.session.user.m_pw = m_pw;
					req.session.user.m_name = m_name;
					req.session.user.m_phone = m_phone;
					console.log('회원정보 수정 성공');
					// console.log('결과', rows)
					conn.query(sql_s, [store_name, store_owner, store_phone, store_loc, m_id], (err, rows) => {
						console.log('매장정보');
						if (rows.affectedRows > 0) {
							req.session.store.store_name = store_name;
							req.session.store.store_owner = store_owner;
							req.session.store.store_phone = store_phone;
							req.session.store.store_loc = store_loc;
							console.log('매장정보 수정 성공');
							res.send(`
							<script>
							alert('정보 수정 완료 되었습니다!');
							location.href="/myPage";
							</script>
							`);
						} else {
							res.send(`
						<script>
						alert('매장 정보가 올바르지 않습니다.');
						</script>
						`);
						}
						console.log('매장 결과', rows)

					})
				} else {
					res.send(`
					<script>
					alert('정보 수정에 실패하였습니다.');
					location.href="/myPage";

					</script>
					`);
				}
			});
		} else {
			res.send(
				`<script>
			alert("비밀번호가 일치하지 않습니다.")
			</script>`);
		}
	} else {
		res.send(
			`<script>
				alert("로그인을 해주시기 바랍니다.")
				location.href="/login";
				</script>`);
	}
})


// 상품 정보 목록 및 입력
router.post("/itemManage", (req, res) => {

	// 상품 입력 관련
	// 1. 내가 받아온 새 이름과 새 주소를 name, add라는 변수에 넣을 것
	let { p_name, p_weight, p_category, shelf_loc } = req.body;
	console.log('수정 정보: ', req.body);

	// 2. store_code 값? session에서 가져오기
	if (req.session.user != undefined) {
		let store_code = req.session.store.store_code;
		console.log('매장 코드:', store_code);

		let sql_p = "insert into products (p_name, p_weight, p_category, shelf_loc, store_code) values (?,?,?,?,?)";
		if (p_name && p_weight && p_category && shelf_loc) {
			conn.query(sql_p, [p_name, p_weight, p_category, shelf_loc, store_code], (err, rows) => {
				if (err) {
					console.error('SQLinsert 에러:', err);
					// 에러 처리
					res.send(`
			  <script>
			  alert('상품 정보 입력 중 에러가 발생했습니다.');
			  location.href="/itemManage"
			  </script>
			`);
				} else {
					if (rows && rows.affectedRows > 0) {
						res.send(`
				<script>
				alert('상품 정보를 성공적으로 입력했습니다!');
				location.href="/user/itemManage"
				</script>
			  `);
						console.log('상품 정보 입력 성공');
					} else {
						// 입력 실패
						res.send(`
							<script>
							alert('상품 정보 입력에 실패했습니다');
							location.href="/itemManage";
							</script>
						`);
					}
				}
			});
		} else {
			res.send(`
				<script>
				alert('상품 정보를 모두 입력해주시기 바랍니다.');location.href="/itemManage"
				</script>
			  `);
		}


	} else {
		// store_code를 찾을 수 없는 경우에 대한 처리
		res.send(`
		<script>
		alert('로그인을 해주시기 바랍니다');location.href="/login"
		</script>
	  `);
	}
});

router.get("/itemManage", (req, res) => {
	// 상품 목록 관련
	let sql_p_select = "select p_code, p_name, p_weight, p_category, shelf_loc from products where store_code=?";
	let store_code = req.session.store.store_code;
	conn.query(sql_p_select, [store_code], (err, rows) => {
		if (err) {
			console.error('SQLselect 에러:', err);
			res.send(`
				<script>
				alert('상품 목록 조회 중 에러가 발생했습니다.');
				location.href="/itemManage";
				</script>
			`);
		} else {
			console.log(rows);
			req.session.product = rows;
			res.redirect("/itemManage");
		}
	})
})



module.exports = router;