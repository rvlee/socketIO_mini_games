import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [ timer, setTimer ] = useState(240)
  useEffect(() => {
    const countDown = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(countDown);
  }, [timer]);

  return (
    <div>
      <h3>timer: {timer}</h3>
    </div>
  )
}

export default Timer