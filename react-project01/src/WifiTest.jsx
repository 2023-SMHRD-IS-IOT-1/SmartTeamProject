import React, { useEffect, useState } from 'react'
import axios from 'axios'

const WifiTest = () => {
  const sensorDataUrl = "http://59.0.124.16:3333/sendArduinoDataToReact"
  const [resData, setResData] = useState(null);

  const fetchData = async  (  ) => { 
    axios
      .post(sensorDataUrl)
      .then((res) => {
        console.log(res.data);
        setResData(res.data) 
      })


      .catch((err) => {
        console.log('error : ', err);
      })
   } 

  useEffect(() => {
    fetchData(); // 처음 데이터 가져오기

    const intervalId = setInterval(() => {
      fetchData(); // 주기적으로 데이터 가져오기
    }, 5000); // 5초마다 가져오도록 설정

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => {
      clearInterval(intervalId);
    };
  }, [])

  return (
    <div>
      {resData && (
        <div>
          <h2>Received Data:</h2>
          <pre>{JSON.stringify(resData, null, 2)}</pre>
        </div>
      )}

    </div>
  )
}

export default WifiTest