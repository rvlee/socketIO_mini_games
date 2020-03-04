import React from 'react';
import modalFormFactory from '../factory/modalFormFactory';

const CreateForm = ({configs, state, onChange, createBtnClick}) => {
  return (
    <div>
      {
        configs.map((config) => {
          return modalFormFactory(state, config, onChange)
        })
      }
      <div>
        <button onClick={createBtnClick}>Create</button>
      </div>
    </div>
  )
}

export default CreateForm;