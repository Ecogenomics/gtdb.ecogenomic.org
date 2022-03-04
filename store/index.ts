import {getAccessorType} from 'typed-vuex'
import * as advanced from '~/store/advanced'
import * as tree from '~/store/tree'
import * as api from '~/store/api'

export interface RootState {
}

export const state = (): RootState => ({})

export const accessorType = getAccessorType({
  state,
  modules: {
    advanced,
    tree,
    api,
  },
})
