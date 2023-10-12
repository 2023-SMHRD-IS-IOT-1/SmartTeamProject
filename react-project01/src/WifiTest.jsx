import React from 'react'
import axios from 'axios'

const WifiTest = () => {
  axios.post('http://59.0.124.16:3000/', {
    sensor_number: 1,
    value: 10
  })
    .then((res) => {
      console.log(res.data)
    })
    .catch((err) => {
      console.error(err);
    })

  return (
    <div>
      

    </div>
  )
}

export default WifiTest