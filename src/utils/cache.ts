import AsyncStorage from '@react-native-community/async-storage'
export const getCache = async () => {
  let cache = 180
  const res = await AsyncStorage.getItem('MY_CAHCE')
  if (res) cache = Number(res) + 40
  if (cache > 1024) cache = 100
  await AsyncStorage.setItem('MY_CAHCE', cache + '')
  return cache
}