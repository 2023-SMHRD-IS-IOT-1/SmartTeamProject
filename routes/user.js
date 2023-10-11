const express = require("express");
const router = express.Router();
const conn = require("../config/database");

// 회원가입 기능 라우터
router.post("/join", (req, res) => {
  console.log('join', req.body)
  // tip!
  // 데이터가 {} <-이렇게만 뜨고 넘어오질 않는다=> body-parser 설치
  // 데이터가 아예 넘어오질 않는가=> front 단에서 input name 설정했는지 확인
  // Router관련 오류가 뜬다=> 경로 설정 잘못한거임(front, router 경로 같은지 확인)

  // 1. join.html 에서 받아온 id, pw, pw2, name, address를 각각의 변수에 저장
  let{id, pw, pw2, name, address}=req.body;
  // 2. 비밀번호와, 비밀번호 확인 데이터가 같으면 회원가입 로직으로
  if (pw===pw2){
    // 회원가입 로직

    // tip!
    // 본격적으로 DB연동하기 전에, 테이블을 생성해야한다.

    // 3. DB 연결 작업 => insert into 테이블명 values (아이디, 비번, 이름, 주소)
    let sql="insert into home_member values(?,?,?,?)";

    //** tip! conn.quary 시 오류의 종류
    // 오류가 난다? is not defined <-그 부분이 오타
    // 오류x, rows에 undefined? <-sql문 오류(테이블명이 틀렸거나, 테이블이 없거나)
    conn.query(sql,[id,pw,name,address],(err,rows)=>{  //DB에 있는 것이 아닌 1번의 변수다

      console.log('회원가입 결과', rows)
      if(rows){
        console.log('회원가입 성공')
        res.send(`
        <script>
          alert('가입을 축하합니다!');
          location.href="http://localhost:3333/";
        </script>
        `)
      }else{
        console.log('회원가입 실패')
        res.send(`
        <script>
          alert('올바르지 못한 정보입니다.');
          location.href="http://localhost:3333/join";
        </script>
        `)
      }
    })
    // 4. 만약 회원가입에 성공하면 alert로 회원가입 성공! => 메인창 이동
    // 5. 만약 회원가입에 실패하면 aelrt로 회원가입 실패 ... => 회원가입 창으로 이동
    // ** 참고
    // 07.DB => 회원가입 로직
    // 07.DB 참고 끝났으면 바로바로 폴더 닫아주세요! ★★★
    }else{
      res.send(`
      <script>
        alert('비밀번호가 일치하지 않습니다!');
        location.href="http://localhost:3333/join";
      </script>`)
    }
  });

// 로그인 기능 라우터
router.post("/login", (req, res) => {
  // 1. layout.html 에서 login Box 안의 데이터를 받아온다 (id, pw)
  let {id, pw}= req.body
  //console.log(id + ',', pw)

  // 2. 그 데이터들을 각각 id, pw 변수 안에 저장
  // 3. DB 연동해서 해당 id값과 pw값이 일치하는 데이터가 DB에 있는지 확인한다
  let sql= 'select id,username,address from home_member where id=? and pw=?'
  // 4. 데이터가 존재한다면 로그인 성공
  conn.query(sql,[id,pw],(err, rows)=>{
    console.log(rows)
    if (rows.length>0){ //if(rows)가 안되는 이유: rows는 로그인에 실패해도 뜸
      
      console.log('로그인 성공')
      req.session.user=rows[0];
      // req.session.name=rows[0].username;

      req.session.save(()=>{

        res.send(`
        <script>
        alert("${rows[0].username} 환영합니다.");location.href="/"
        </script>>`)
      })
    }else{
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
  req.session.user=""
  req.session.save(()=>{
    res.send('<script>location.href="/"</script>')
  })
  // 1. 세션 삭제
  // 2. 메인페이지에 다시 접근
});

// 회원 정보 수정 기능 라우터 (JS fetch 와의 연동) ★★★★★
router.post("/modify", (req, res) => {
  console.log('modify router',req.body);
  // 1. 내가 받아온 새 이름과 새 주소를 name, add라는 변수에 넣을 것
  let{name,address}=req.body;

  // 2. id 값? session에서 가져오기
  let id=req.session.user.id;

  let sql="update home_member set username=?, address=? where id=?"
  conn.query(sql,[name, address, id],(err,rows)=>{
    console.log('결과', rows)
    if(rows){
      // 변경성공
      req.session.user.address=address;
      req.session.user.username=name;
      res.json({msg:'success'})
    }else{
      // 변경실패
      res.json({msg:'failed'})
    }
  })

  // 3. DB 연동
  //  3-2) update set 을 이용해서 DB 값 변경
  //  3-3) 세션 안에 있는 값 변경 (이름, 주소 변경)
  // 4. console.log('값 변경 성공!'), '값 변경 실패'
  //       => 페이지 이동 X 캡쳐해서 단톡방에~

});

module.exports = router;
