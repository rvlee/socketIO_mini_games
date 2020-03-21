import React from 'react';
import modalFormFactory from '../factory/modalFormFactory';
import formChecker from '../utils/formChecker';

const CreateForm = ({configs, state, onChange, createBtnClick}) => {
  return (
    <div>
      {
        configs.map((config) => {
          return modalFormFactory(state, config, onChange)
        })
      }
      <div>
        <button onClick={createBtnClick} disabled={!formChecker(configs, state)}>Create</button>
      </div>
    </div>
  )
}

export default CreateForm;