const express=require('express');
const router=express.Router()

/* 세션(Session)
- 서버가 클라이언트에게 암호화된 아이디(Sesstion ID)를 부여함
- 쿠키랑 다른 점
  > 세션의 서버 자원을 쓰는 것, 너무 많은 세션을 낭비하지 않는 것이 좋다. 
  > 브라우저가 종료되면 세션은 자동으로 삭제
  > 로그인 기능

1) 설치
- 세션 기능: express-session
- 세션 저장소: session-file-store
 (참고로, 세션 저장소의 종류는 다양함 DB, file..)

 2) require
 3) 세션 미들웨어
 */

 //세션페이지
router.get('/',(req,res)=>{
    console.log('session')
    res.render('session')
})

// 1) 세션 생성하기
router.get('/set' ,(req,res)=>{
    req.session.name="이다현";
    req.session.save(()=>{ //콜백함수 이용
        /*순서정하기 위해 사용할 수 있는 방법
        (JS문법- js는 문법이 순차적으로 진행되지 x)
        
        1)콜백함수 (()=>{})
        - 겉에 있는 함수가 실행된 이후-> 속함수가 진행
        => 콜백지옥! 유지 보수성 떨어짐

        2) promise(fetch)
        fetch(url)
        .then(res=>res.json())
        .then(res=>console.log(res));
        .catch(~)

        3) async await
        async()=>{
        const file=await fileRead('a.txt')
        }
        */
        res.redirect('/s')
    });
})

// 2) 세션 값 확인하기
router.get('/index', (req,res)=>{
    // 메인창 로그인할 때, 00님 환영합니다
    console.log(req.session.name) // 서버에서 클라이언트에게 주는 것으므로 응답임
})

// 3) 세션 삭제(== 로그아웃)
router.get('/login',(req,res)=>{
    //case 1) 세션 내용 단일 삭제
    // 사실상 비어있는 데이터를 저장하는 것
    req.session.name=""
    req.session.save(()=>{
        res.redirect('/s');
    })

    // case 2) 세션 전체 삭제
    // req.session.destroy(()=>{
    //     res.redirect('/s')
    // })
})
module.exports=router;