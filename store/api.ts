import {actionTree, getterTree, mutationTree} from 'typed-vuex'
import axios, {AxiosError} from "axios";
import {FastApiValidationError} from "~/assets/api/models";

const apiTimeout = parseInt(process.env.apiTimeout || '30000');

// ---------------------------------------------------------------------------------------------------------------------
// INTERFACES
// ---------------------------------------------------------------------------------------------------------------------

export enum ApiMessageStatus {
  SUCCESS = 'success', INFO = 'info', WARNING = 'warning', ERROR = 'error',
}

export interface ApiMessage {
  timestamp?: Date
  message: string
  status: ApiMessageStatus
}


// ---------------------------------------------------------------------------------------------------------------------
// VUEX STATE
// ---------------------------------------------------------------------------------------------------------------------

export interface State {
  showApiSnackbar: boolean,
  messages: ApiMessage[]
}

export const state = (): State => ({
  showApiSnackbar: false, messages: [],
})


// ---------------------------------------------------------------------------------------------------------------------
// GETTERS
// ---------------------------------------------------------------------------------------------------------------------

export const getters = getterTree(state, {
  showApiSnackbar: state => state.showApiSnackbar, getMessages: state => state.messages,
})

// ---------------------------------------------------------------------------------------------------------------------
// MUTATIONS
// ---------------------------------------------------------------------------------------------------------------------

export const mutations = mutationTree(state, {
  SET_SHOW_API_SNACKBAR: (state, value) => (state.showApiSnackbar = value),
  ADD_MESSAGE: (state, message) => (state.messages.push(message))
})

// ---------------------------------------------------------------------------------------------------------------------
// ACTIONS
// ---------------------------------------------------------------------------------------------------------------------

export const actions = actionTree({state, getters, mutations}, {

  setShowApiSnackbar({commit}, payload: boolean) {
    commit('SET_SHOW_API_SNACKBAR', payload)
  },

  addMessage({commit}, payload: ApiMessage) {
    payload.timestamp = new Date();
    commit('ADD_MESSAGE', payload)
    commit('SET_SHOW_API_SNACKBAR', true)
  },

  defaultCatch({commit}, error: Error | AxiosError) {
    const errMessage = axiosErrorToApiMessage(error);
    if (errMessage) {
      commit('ADD_MESSAGE', axiosErrorToApiMessage(error))
      commit('SET_SHOW_API_SNACKBAR', true)
    }
  }

})


// ---------------------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------------------------------------------------

export function axiosErrorToApiMessage(error: Error | AxiosError): ApiMessage | null {

  // Requests that are cancelled are not errors, return without issue
  if (axios.isCancel(error)) {
    return null;
  }

  // Handle axios errors
  if (axios.isAxiosError(error)) {
    console.log(error.toJSON())

    // Axios errors will have a response and detail
    if (error.response && error.response.data && error.response.data.detail) {

      // Validation error
      if (error.response.status === 422) {
        const validation = [];
        const msg: FastApiValidationError[] = error.response.data.detail;
        for (let i = 0; i < msg.length; i++) {
          const curMsg = msg[i];
          validation.push(`${curMsg.loc[curMsg.loc.length - 1]}: ${curMsg.msg}`)
        }
        return {
          timestamp: new Date(), message: validation.join('. '), status: ApiMessageStatus.WARNING,
        }
      }

      // Not a validation error
      return {
        timestamp: new Date(), message: error.response.data.detail, status: ApiMessageStatus.ERROR,
      }

    }

    // Client error / network error
    else {
      if (error.message === 'Network Error') {
        return {
          timestamp: new Date(),
          message: `${error.message}. Unable to contact the GTDB API.`,
          status: ApiMessageStatus.ERROR,
        }
      }

      if (error.message === `timeout of ${apiTimeout}ms exceeded`) {
        return {
          timestamp: new Date(),
          message: `Timeout of ${(apiTimeout).toLocaleString()}ms exceeded.`,
          status: ApiMessageStatus.ERROR,
        }
      }

      return {
        timestamp: new Date(), message: error.message, status: ApiMessageStatus.ERROR,
      }
    }
  }

  // Not an axios error / did not exit early, unknown error
  console.log(error);
  return {
    timestamp: new Date(),
    message: error.message == null ? 'An unknown error occurred.' : error.message,
    status: ApiMessageStatus.ERROR,
  }
}
