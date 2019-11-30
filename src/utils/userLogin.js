// 此文件封装的是操作本地存储数据对其进行获取，设置，删除等操作
// 设置一个存储的键名
const key = 'userLogin'
// 获取本地数据
export const getUser = () => {
  // 加||的意思是当你获取的是空数据时返回一个空对象不会报错
  return JSON.parse(window.localStorage.getItem(key || '{}'))
}
// 添加本地数据
export const addUser = (shuju) => {
  return window.localStorage.setItem(key, JSON.stringify(shuju))
}
// 删除本地数据
export const removeUser = () => {
  return window.localStorage.removeItem(key)
}
