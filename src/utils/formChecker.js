export default (configs, state) => {
  let checker = true;
  configs.forEach((config) => {
      let condition = config.condition ? config.condition(state) : true;
      if (config.required && condition && !state[config.key]) {
        checker = false;
      }
  })
  return checker
}