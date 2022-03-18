// ---------------------------------------------------------------------------------------------------------------------
// INTERFACES
// ---------------------------------------------------------------------------------------------------------------------

import {actionTree, getterTree, mutationTree} from "typed-vuex";
import {TaxonDescendants} from "~/assets/api/taxon";

const MAX_CHILDREN = 100;

export interface TreeItem {
  taxon: string
  total?: number
  children?: TreeItem[],

  isGenome?: boolean,
  isTypeSpeciesOfGenus?: boolean,
  isTypeStrainOfSpecies?: boolean,
  isTypeStrainOfSubspecies?: boolean,
  isGtdbSpeciesRep?: boolean,

  hideLink?: boolean
  species?: string

}

interface SetNodeChildrenPayload {
  taxon: string,
  children: TreeItem[]
}


// ---------------------------------------------------------------------------------------------------------------------
// VUEX STATE
// ---------------------------------------------------------------------------------------------------------------------

export interface State {
  items: TreeItem[],
  initHasRun: boolean,
  open: string[],
  active: string[],
}

export const state = (): State => ({
  items: ([{taxon: 'd__Archaea', children: []}, {taxon: 'd__Bacteria', children: []}] as TreeItem[]),
  initHasRun: false,
  open: [],
  active: [],
})


// ---------------------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------------------------------------------------

// Traverse the opened nodes to try and find the taxon
function findNodeInTree(items: TreeItem[], taxon: string): TreeItem | null {
  const queue = [...items]
  while (queue.length > 0) {
    const item = queue.shift()
    if (item) {
      if (item.taxon === taxon) {
        return item
      }
      if (item.children) {
        queue.push(...item.children)
      }
    }
  }
  console.log('Unable to find node in tree!')
  return null
}

// Returns a specific child node or null if not found
function getChildNode(item: TreeItem, taxon: string): TreeItem | null {
  if (item.children) {
    for (let i = 0; i < item.children.length; i++) {
      if (item.children[i].taxon === taxon) {
        return item.children[i]
      }
    }
  }
  console.log(`Cannot find child node: ${taxon}`)
  return null
}


// Gets and loads children
function treeItemFromTaxonDescendants(item: TaxonDescendants): TreeItem {
  const out = {taxon: item.taxon} as TreeItem

  if (item.typeMaterial === 'type_species') {
    out.isTypeSpeciesOfGenus = true
  } else if (item.typeMaterial === 'type_strain_of_heterotypic_synonym') {
    // ???
  } else if (item.typeMaterial === 'type_strain_of_subspecies') {
    out.isTypeStrainOfSubspecies = true;
  } else if (item.typeMaterial === 'type_strain_of_species') {
    out.isTypeStrainOfSpecies = true;
  }

  // Species
  if (item.isGenome) {
    out.isGenome = true
    if (item.isRep) {
      out.isGtdbSpeciesRep = true
    }
  }
  // Taxon
  else {
    out.total = item.total
    out.children = []
  }
  return out
}

// ---------------------------------------------------------------------------------------------------------------------
// GETTERS
// ---------------------------------------------------------------------------------------------------------------------

export const getters = getterTree(state, {
  items: state => state.items, initHasRun: state => state.initHasRun, open: state => state.open
})

// ---------------------------------------------------------------------------------------------------------------------
// MUTATIONS
// ---------------------------------------------------------------------------------------------------------------------

export const mutations = mutationTree(state, {
  // Set all nodes in the tree at once
  SET_ITEMS: (state, value) => (state.items = value),

  // T/F if the tree has been init
  SET_INIT_HAS_RUN: (state, value) => (state.initHasRun = value),

  // Change which nodes are currently open within the tree
  SET_OPEN: (state, value) => (state.open = value),
  ADD_OPEN: (state, value) => (state.open.includes(value) ? null : state.open.push(value)),

  // Set the descendants of a node in the tree
  SET_NODE_CHILDREN: (state, payload: SetNodeChildrenPayload) => {
    const node = findNodeInTree(state.items, payload.taxon);
    if (node) {
      node.children = payload.children
    }
  },

  // Set the active nodes within the tree (not used)
  SET_ACTIVE: (state, value) => (state.active = value),
})


// ---------------------------------------------------------------------------------------------------------------------
// ACTIONS
// ---------------------------------------------------------------------------------------------------------------------

export const actions = actionTree({state, getters, mutations}, {

  // Change the active taxon in the tree
  setActiveTaxon({commit}, taxa) {
    commit('SET_ACTIVE', taxa)
  },

  // Given an array of taxa, open the tree to that taxon
  openTreeToPath({commit, getters}, payload: string[]) {
    // Make API calls at once
    const promises = [];
    for (let i = 0; i < payload.length; i++) {
      promises.push(this.$api.taxon.getTaxonName(payload[i]))
    }
    Promise.all(promises).then((values) => {
      for (let i = 0; i < values.length; i++) {
        const taxon = payload[i];
        const resp = values[i];
        const children: TreeItem[] = [];

        // break if too many genomes
        for (let j = 0; j < resp.data.length; j++) {
          children.push(treeItemFromTaxonDescendants(resp.data[j]))

          if (j >= MAX_CHILDREN && resp.data[j].isGenome) {
            children.push({
              taxon: `+ ${(resp.data.length - MAX_CHILDREN).toLocaleString()} others`,
              isGenome: true,
              hideLink: true,
              species: taxon
            })
            break;
          }
        }
        commit('SET_NODE_CHILDREN', {taxon: taxon, children: children})
        commit('ADD_OPEN', taxon)
      }
    })
  },

  // Set which nodes are open in the tree
  async setOpen({commit}, open) {
    commit('SET_OPEN', open)
  },

  // Run the initial setup of the tree if not already done
  async initTreeState({commit, getters}) {
    if (!getters.initHasRun) {
      this.$api.taxon.getTaxonName('root').then((res) => {
        const children: TreeItem[] = [];
        for (let i = 0; i < res.data.length; i++) {
          children.push(treeItemFromTaxonDescendants(res.data[i]));
        }
        commit('SET_ITEMS', children)
        commit('SET_INIT_HAS_RUN', true)
      })
    }
  },

  // Load children for a specific node (i.e. that node was opened)
  async loadChildren({commit}, item: TreeItem) {
    return this.$api.taxon.getTaxonName(item.taxon).then((res) => {
      const children: TreeItem[] = [];
      for (let i = 0; i < res.data.length; i++) {
        children.push(treeItemFromTaxonDescendants(res.data[i]));
        if (i >= MAX_CHILDREN && res.data[i].isGenome) {
          children.push({
            taxon: `+ ${(res.data.length - MAX_CHILDREN).toLocaleString()} others`,
            isGenome: true,
            hideLink: true,
            species: item.taxon
          })
          break;
        }
      }
      commit('SET_NODE_CHILDREN', {taxon: item.taxon, children: children})
    })
  }
})
