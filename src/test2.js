import cloneDeep from 'lodash/cloneDeep'
import find from 'lodash/find'

const users = [
  { 'user': 'barney',  'age': 36, 'active': true },
  { 'user': 'fred',    'age': 40, 'active': false },
  { 'user': 'pebbles', 'age': 1,  'active': true }
]
const deep = cloneDeep(users)
const res = find(users, o => o.age < 40)

console.log('deep', deep)
console.log('res', res)