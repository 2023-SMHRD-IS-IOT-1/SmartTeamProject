const express= require('express')
const router= express.Router();

// fetch 페이징 처리
router.get('/fetch', (req,res)=>{
    res.render('fetch')
})

// fetch로 데이터 받는 부분
router.post('/led',(req,res)=>{
    console.log('led router', req.body);
    
    // 보통 내가 받아온 데이터로 특정 작업들을 한 이후에 (DB, Session..)
    // 응답을 한다.

    // 만약 DB에 led값 저장 성공했다고 가정
    // Node.js=> Front로 값을 전달
    res.json({msg: "success"});//**back에서 front로 보낼 데이터
})

// flask페이징 처리
router.get('/flask', (req,res)=>{
    res.render('flask')
})

// flask에서 보낸 데이터 처리
router.post('/exchange',(req,res)=>{
    // flask=>node.js로 온 데이터(IoT값, 머신러닝 결과값..)
    console.log('flask->node data:', req.body) //받는 부분

    // Node.js=>flask로 보낼 데이터 (웹에서 설정한 IoT..)
    const data={'그룹':'트와이스','이름':'나연'}
    res.status(200).json(data); //보내는 부분
})

module.exports=router;