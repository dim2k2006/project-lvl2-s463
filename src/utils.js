const getKeys = (data1 = {}, data2 = {}) => [...Object.keys(data1), ...Object.keys(data2)]
  .reduce((accumulator, key) => {
    if (!accumulator.includes(key)) return [...accumulator, key];

    return accumulator;
  }, []);

export default { getKeys };
