import React from 'react';
import modalFormFactory from '../factory/modalFormFactory';

const JoinForm = ({configs, state, onChange, joinBtnClick}) => {
  return (
    <div>
      {
        configs.map((config) => {
          return modalFormFactory(state, config, onChange)
        })
      }
      <div>
        <button onClick={joinBtnClick}>Join</button>
      </div>
    </div>
  )
}

export default JoinForm;