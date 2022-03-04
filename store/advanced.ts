import {actionTree, getterTree, mutationTree} from 'typed-vuex'
import {base64DecodeUrl, base64EncodeUrl} from '~/assets/ts/common'
import {Dict} from '~/assets/ts/interfaces'

// ---------------------------------------------------------------------------------------------------------------------
// ENUMS
// ---------------------------------------------------------------------------------------------------------------------

// All nodes implement this to determine type
export enum NodeType {
  GROUP,  // e.g. Match "ALL", or "ANY" of the rules in this group
  RULE    // e.g. Column IS "foo"
}

// The type of matching for rules within a NodeGroup
export enum NodeGroupMatchType {
  ALL = "All",  // AND
  ANY = "Any",  // OR
}

// What type of data is stored in this column? (must be synced with API)
export enum ColumnDataType {
  STRING = "string", DATE = "date", BOOLEAN = "boolean", NUMERIC = "numeric", ENUM = "enum",
}

// ---------------------------------------------------------------------------------------------------------------------
// INTERFACES
// ---------------------------------------------------------------------------------------------------------------------

// An allowed option for a specific column (part of an enum array)
export interface ColumnOption {
  id: number,
  display: string
}

// A column that can be selected in a NodeRule
export interface Column {
  id: number,
  display: string,           // Display name to the user
  dataType: ColumnDataType,
  options: ColumnOption[],    // Array of options (text input used if zero length)
  group: string,
}

// An operator to apply to a column (e.g. IS, >, TRUE)
export interface Operator {
  id: number,
  display: string,
  dataType: ColumnDataType,  // Applied to all columns of the same data type
}

// The basic Node interface that all NodeRules and NodeGroups inherit from
export interface BaseNode {
  id: number
  type: NodeType,
}

interface INodeGroup extends BaseNode {
  type: NodeType.GROUP
  matchType: NodeGroupMatchType
  children: Array<BaseNode>
}

interface INodeRule extends BaseNode {
  type: NodeType.RULE,
  columnId: number | null,
  operatorId: number | null,
  value: string | null;
}


// ---------------------------------------------------------------------------------------------------------------------
// CLASSES
// ---------------------------------------------------------------------------------------------------------------------

export class NodeGroup implements INodeGroup {
  id: number;
  children: Array<BaseNode>;
  matchType: NodeGroupMatchType;
  type: NodeType.GROUP;

  constructor(id: number, children?: Array<BaseNode>, matchType?: NodeGroupMatchType) {
    this.id = id
    this.children = children != null ? children : []
    this.matchType = matchType != null ? matchType : NodeGroupMatchType.ALL
    this.type = NodeType.GROUP
  }

  toJSON() {
    return JSON.stringify({
      id: this.id, children: this.children, matchType: this.matchType, type: this.type
    })
  }
}

export class NodeRule implements INodeRule {
  id: number;
  type: NodeType.RULE;
  columnId: number | null;
  operatorId: number | null;
  value: string | null;

  constructor(id: number, columnId?: number, operatorId?: number, value?: string | null) {
    this.id = id;
    this.type = NodeType.RULE
    this.columnId = columnId != null ? columnId : null;
    this.operatorId = operatorId != null ? operatorId : null;
    this.value = value != null ? value : null;
  }

  // toJSON() {
  //   return JSON.stringify({
  //     id: this.id,
  //     type: this.type,
  //     children: this.children,
  //     column: this.column,
  //     operator: this.operator,
  //     value: this.value
  //   })
  // }
}


// ---------------------------------------------------------------------------------------------------------------------
// VUEX STATE
// ---------------------------------------------------------------------------------------------------------------------

export interface State {
  columns: Dict<Column>,
  operators: Dict<Operator>,
  options: Dict<ColumnOption>
  root: NodeGroup,
  nextId: number,
  history: Array<NodeGroup>  // previous versions
  results: Dict<[]> | null,
  resultsIsLoading: boolean,
  resultsHasBeenRun: boolean,
  resultsPageNo: number,
  resultsItemPerPage: number,
  resultsSortBy: string | null,
  resultsSortDesc: boolean | null
}

export const state = (): State => ({
  columns: {},
  operators: {},
  options: {},
  root: new NodeGroup(0, [], NodeGroupMatchType.ALL),
  nextId: 1,
  history: [],
  results: null,
  resultsIsLoading: false,
  resultsHasBeenRun: false,
  resultsPageNo: 1,
  resultsItemPerPage: 10,
  resultsSortBy: null,
  resultsSortDesc: null,
})

// ---------------------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------------------------------------------------

// Returns the node in a tree
function findNodeInTree(root: BaseNode, node: BaseNode): BaseNode | null {
  const queue = [root];
  while (queue.length > 0) {
    const curNode = queue.shift();
    if (curNode) {
      // Found the node we are looking for
      if (curNode.id === node.id) {
        return curNode;
      }
      // Check to see if it got children
      if (curNode.type === NodeType.GROUP) {
        (curNode as NodeGroup).children.forEach(node => {
          queue.push(node);
        })
      }
    }
  }
  console.log(`Unable to find node: ${node}`)
  return null;
}

// Returns a parent node in the tree
function findParentNodeInTree(root: NodeGroup, targetNode: BaseNode): NodeGroup | null {
  const queue: Array<Array<BaseNode>> = [];
  if (root.children) {
    root.children.forEach(childNode => {
      queue.push([childNode, root]);
    })
  }
  while (queue.length > 0) {
    const curItem = queue.shift();
    if (curItem) {
      const [curNode, parentNode] = curItem;
      if (curNode.id === targetNode.id) {
        return (parentNode as NodeGroup);
      }
      if (curNode.type === NodeType.GROUP) {
        (curNode as NodeGroup).children.forEach(childNode => {
          queue.push([childNode, curNode]);
        })
      }
    }
  }
  console.log(`Unable to find node: ${targetNode}`)
  return null;
}

// Encode the tree into the minimal format (i.e. just using IDs and operators)
function formatTreeAsPayload(nodes: BaseNode[]): [string[], Dict<string>] {
  // TODO: FINISH DEBUGGING WHY THE TREE DOESNT SHOW STRAIGHT AWAY
  // TODO: WHEN DOING BOOL FIRST?
  const out: string[] = [];
  const args: Dict<string> = {};
  nodes.forEach(childNode => {
    if (childNode.type === NodeType.GROUP) {
      const childNodeGroup = childNode as NodeGroup;
      const [descNodes, descArgs] = formatTreeAsPayload(childNodeGroup.children);
      if (descNodes.length > 0) {
        const curOp = childNodeGroup.matchType === NodeGroupMatchType.ANY ? '|' : '&';
        out.push(`(${descNodes.join(`${curOp}`)})`);
        Object.assign(args, descArgs);
      }
    } else {
      const childNodeRule = childNode as NodeRule;
      if (childNodeRule.operatorId != null && childNodeRule.columnId != null) {
        args[childNodeRule.id] = `${childNodeRule.columnId}~${childNodeRule.operatorId}~${childNodeRule.value}`;
        out.push(String(childNode.id))
      }
    }
  })
  return [out, args]
}

// Format the tree into a human readable string
function formatTreeAsString(nodes: BaseNode[], columns: Dict<Column>, operators: Dict<Operator>, enums: Dict<ColumnOption>): string[] {
  if (Object.keys(columns).length == 0 || Object.keys(operators).length == 0 || Object.keys(enums).length == 0) {
    return ['']
  }

  const out: string[] = [];
  nodes.forEach(childNode => {
    if (childNode.type === NodeType.GROUP) {
      const childNodeGroup = childNode as NodeGroup;
      const descNodes = formatTreeAsString(childNodeGroup.children, columns, operators, enums);
      if (descNodes.length > 0 && descNodes[0] != '') {
        const curMatchType = childNodeGroup.matchType == NodeGroupMatchType.ANY ? "OR" : "AND";
        out.push(`(${descNodes.join(` ${curMatchType} `)})`);
      }
    } else {
      const childNodeRule = childNode as NodeRule;
      if (childNodeRule.operatorId != null && childNodeRule.columnId != null) {
        const curCol: Column = columns[childNodeRule.columnId];
        const curOp: Operator = operators[childNodeRule.operatorId];
        let curStr = '';

        // Boolean data types dont display a value as the operator is used
        if (curCol.dataType == ColumnDataType.BOOLEAN) {
          curStr = `"${curCol.display}" IS ${curOp.display}`;
        }

        // Otherwise, don't display anything with a null value
        else if (childNodeRule.value != null) {

          // Enum data types need to parse the value
          if (curCol.dataType == ColumnDataType.ENUM) {
            curStr = `"${curCol.display}" ${curOp.display} "${enums[childNodeRule.value].display}"`;
          }
          // Everything else
          else {
            curStr = `"${curCol.display}" ${curOp.display} "${childNodeRule.value}"`;
          }
        }

        out.push(curStr)
      }
    }
  })
  return out
}


// Base64 decode the search string
function base64DecodeUrlPayload(payload: Dict<string>): Dict<string> {
  const out: Dict<string> = {}
  for (const [key, value] of Object.entries(payload)) {
    out[key] = base64DecodeUrl(value as string)
  }
  return out
}

// Convert the compact expression into data
function compactExpToData(exp: string): Dict<string | null> {
  const matches = [...exp.matchAll(/(\d+)~(\d+)~?(.*)/g)]
  const out: Dict<string | null> = {}
  out['columnId'] = matches[0][1]
  out['operatorId'] = matches[0][2]
  if (matches[0].length == 4) {
    out['value'] = matches[0][3]
  } else {
    out['value'] = null;
  }
  return out;
}

// Convert a search string into a fully formatted tree
function urlPayloadToTree(payload: Dict<string>): null | NodeGroup {

  // Extract each of the groups and their start/end position
  const matches = [...payload.exp.matchAll(/(\d+)/g)];
  const idxToMatch: Dict<number> = {};
  matches.forEach(match => {
    if (match && match.index) {
      idxToMatch[match.index] = Number.parseInt(match[1]);
    }
  })

  // Setup variables for iterating
  let root = new NodeGroup(0, [], NodeGroupMatchType.ALL);
  let nextId = 1;
  let curNodeGroup = root;
  const parentNodes: NodeGroup[] = [];

  // Parse the string
  for (const [i, char] of payload.exp.split('').entries()) {

    // New group, append to previous (skip root case)
    if (char === "(" && i > 0) {
      const childNodeGroup = new NodeGroup(nextId, [], NodeGroupMatchType.ALL);
      curNodeGroup.children.push(childNodeGroup)
      parentNodes.push(curNodeGroup);
      curNodeGroup = childNodeGroup;
      nextId++;
    }

    // Go back to the parent node
    else if (char === ")") {
      const newParentNode = parentNodes.pop()
      if (newParentNode) {
        curNodeGroup = newParentNode;
      } else if (i < payload.exp.length - 1) {
        console.log('Malformed brackets in expression.')
      }
    }

    // Set the type of matching for this node group
    else if (char === '|') {
      curNodeGroup.matchType = NodeGroupMatchType.ANY
    } else if (char === '&') {
      curNodeGroup.matchType = NodeGroupMatchType.ALL
    }

    // This is one of the columns
    else if (idxToMatch[i] != null) {
      const colOperatorValue = compactExpToData(payload[idxToMatch[i]])
      const ruleNode = new NodeRule(nextId, parseInt(String(colOperatorValue.columnId)), parseInt(String(colOperatorValue.operatorId)), colOperatorValue.value);
      curNodeGroup.children.push(ruleNode)
      nextId++;
    }

  }

  if (parentNodes.length !== 0) {
    console.log('Expected parent nodes to be 0 after processing. Malformed brackets.')
  }

  return root
}


// ---------------------------------------------------------------------------------------------------------------------
// GETTERS
// ---------------------------------------------------------------------------------------------------------------------

export const getters = getterTree(state, {
  root: state => state.root,
  historyLength: state => state.history.length,
  nextId: state => state.nextId,
  columns: state => state.columns,
  results: state => state.results,
  resultsIsLoading: state => state.resultsIsLoading,
  resultsHasBeenRun: state => state.resultsHasBeenRun,
  operators: state => state.operators,
  treeAsEncodedPayload: state => {
    const [expr, args] = formatTreeAsPayload([state.root]);
    const encodedArgs: Dict<String> = {};
    for (const [k, v] of Object.entries(args)) {
      encodedArgs[k] = base64EncodeUrl(v);
    }
    return [base64EncodeUrl(expr.join('')), encodedArgs]
  },
  treeAsPayload: state => {
    return formatTreeAsPayload([state.root]);
  },
  treeAsString: state => {
    return formatTreeAsString([state.root], state.columns, state.operators, state.options).join('');
  },
  resultsPaginated: state => {
    if (state.results == null || state.results.rows == null) {
      return null
    }
    // TOOD: The sorting method.
    const sortDesc = state.resultsSortDesc == false
    let sortedRows: [];
    if (state.resultsSortBy != null && state.resultsSortBy.length > 0) {
      // @ts-ignore
      sortedRows = [...state.results.rows].sort((a: Dict<any>, b: Dict<any>) => {
        let aVal;
        let bVal;
        if (sortDesc) {
          aVal = a[(state.resultsSortBy as any)];
          bVal = b[(state.resultsSortBy as any)]
        } else {
          aVal = b[(state.resultsSortBy as any)];
          bVal = a[(state.resultsSortBy as any)]
        }
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      })
    } else {
      sortedRows = state.results.rows;
    }
    const idxFrom = state.resultsItemPerPage * (state.resultsPageNo - 1)
    const idxTo = state.resultsItemPerPage * state.resultsPageNo
    return sortedRows.slice(idxFrom, idxTo)
  },
  resultsSortBy: state => state.resultsSortBy,
  resultsSortDesc: state => state.resultsSortDesc,
})

// ---------------------------------------------------------------------------------------------------------------------
// MUTATIONS
// ---------------------------------------------------------------------------------------------------------------------

export const mutations = mutationTree(state, {
  // -------------------------------------------------------------------------------------------------------------------
  // Result mutations
  // -------------------------------------------------------------------------------------------------------------------
  SET_RESULTS: (state, value) => (state.results = value),
  SET_RESULTS_IS_LOADING: (state, value) => (state.resultsIsLoading = value),
  SET_RESULTS_HAS_BEEN_RUN: (state, value) => (state.resultsHasBeenRun = value),
  SET_RESULTS_ITEMS_PER_PAGE: (state, value) => (state.resultsItemPerPage = value),
  SET_RESULTS_PAGE_NO: (state, value) => (state.resultsPageNo = value),
  SET_RESULTS_SORT_BY: (state, value) => (state.resultsSortBy = value),
  SET_RESULTS_SORT_DESC: (state, value) => (state.resultsSortDesc = value),

  // -------------------------------------------------------------------------------------------------------------------
  // Column mutations
  // -------------------------------------------------------------------------------------------------------------------
  SET_COLUMNS: (state, value) => (state.columns = value),

  // -------------------------------------------------------------------------------------------------------------------
  // Operator mutations
  // -------------------------------------------------------------------------------------------------------------------
  SET_OPERATORS: (state, value) => (state.operators = value),

  // -------------------------------------------------------------------------------------------------------------------
  // History mutations
  // -------------------------------------------------------------------------------------------------------------------
  ADD_HISTORY: (state) => {
    const maxState = process.env.advancedMaxHistory ? Number.parseInt(process.env.advancedMaxHistory) : 50
    if (state.history.length > maxState) {
      state.history.shift();
    }
    state.history.push(JSON.parse(JSON.stringify(state.root)))
  },
  UNDO_HISTORY: (state) => {
    console.log(state.history)
    if (state.history.length > 0) {
      const newRoot = state.history.pop();
      if (newRoot != null) {
        // @ts-ignore
        state.root = JSON.parse(newRoot);
      }
    }
  },

  // -------------------------------------------------------------------------------------------------------------------
  // Option mutations
  // -------------------------------------------------------------------------------------------------------------------
  SET_OPTIONS: (state, value) => (state.options = value),

  // -------------------------------------------------------------------------------------------------------------------
  // Next ID mutations
  // -------------------------------------------------------------------------------------------------------------------
  INCREMENT_NEXT_ID: (state) => (state.nextId++),
  SET_NEXT_ID: (state, nextId) => (state.nextId = nextId),

  // -------------------------------------------------------------------------------------------------------------------
  // BaseNode mutations
  // -------------------------------------------------------------------------------------------------------------------
  ADD_CHILD_TO_NODE: (state, payload) => {
    const node = findNodeInTree(state.root, payload.targetNode);
    if (node && node.type == NodeType.GROUP) {
      (node as NodeGroup).children.push(payload.child)
    }
  },

  // Remove a specific node from the tree
  REMOVE_NODE: (state, node) => {
    const parentNode = findParentNodeInTree(state.root, node)
    if (!parentNode) {
      console.log(`Unable to find parent node: ${parentNode}`)
      return;
    }
    let idx = null;
    for (let i = 0; i < parentNode.children.length; i++) {
      if (parentNode.children[i].id === node.id) {
        idx = i;
        break;
      }
    }
    if (idx === null) {
      console.log(`Tree is inconsistent when finding node: ${node}`);
      return
    }
    parentNode.children.splice(idx, 1);
  },

  // Override the root node with a new node
  SET_ROOT_NODE: (state, node) => {
    state.root = node
  },

  // -------------------------------------------------------------------------------------------------------------------
  // NodeRule mutations
  // -------------------------------------------------------------------------------------------------------------------
  SET_NODE_RULE_COLUMN: (state, payload) => {
    const node = findNodeInTree(state.root, payload.node);
    if (node && node.type == NodeType.RULE) {
      (node as NodeRule).columnId = payload.columnId;
    }
  },

  SET_NODE_RULE_OPERATOR: (state, payload) => {
    const node = findNodeInTree(state.root, payload.node);
    if (node && node.type == NodeType.RULE) {
      (node as NodeRule).operatorId = payload.operatorId;
    }
  },

  SET_NODE_RULE_SEARCH_VALUE: (state, payload) => {
    const node = findNodeInTree(state.root, payload.node);
    if (node && node.type == NodeType.RULE) {
      (node as NodeRule).value = payload.value;
    }
  },

  // -------------------------------------------------------------------------------------------------------------------
  // NodeGroup mutations
  // -------------------------------------------------------------------------------------------------------------------
  SET_NODE_GROUP_MATCH_TYPE: (state, payload) => {
    const node = findNodeInTree(state.root, payload.node);
    if (node && node.type === NodeType.GROUP) {
      const nodeGroup = node as NodeGroup;
      nodeGroup.matchType = payload.type;
    }
  },

})

// ---------------------------------------------------------------------------------------------------------------------
// ACTIONS
// ---------------------------------------------------------------------------------------------------------------------

export const actions = actionTree({state, getters, mutations}, {

  // -------------------------------------------------------------------------------------------------------------------
  // Methods to retrieve data required from the API
  // -------------------------------------------------------------------------------------------------------------------

  // Get the list of columns from the database
  async fetchColumns({commit}) {
    this.$api.advanced.getColumns().then(resp => {
      const columns: Dict<Column> = {};
      for (let i = 0; i < resp.data.length; i++) {
        //@ts-ignore
        columns[resp.data[i].id] = resp.data[i]
      }
      commit('SET_COLUMNS', columns)
    })
  },

  // Get the list of operators from the database
  async fetchOperators({commit}) {
    this.$api.advanced.getOperators()
      .then(resp => {
        const operators: Dict<Operator> = {};
        for (let i = 0; i < resp.data.length; i++) {
          //@ts-ignore
          operators[resp.data[i].id] = resp.data[i]
        }
        commit('SET_OPERATORS', operators)
      })
  },

  // Get the list of options from the database
  async fetchOptions({commit}) {
    this.$api.advanced.getOptions()
      .then(resp => {
        const options: Dict<ColumnOption> = {};
        for (let i = 0; i < resp.data.length; i++) {
          options[resp.data[i].id] = resp.data[i]
        }
        commit('SET_OPTIONS', options)
      })
  },

  // -------------------------------------------------------------------------------------------------------------------
  // Node modifications
  // -------------------------------------------------------------------------------------------------------------------

  // Change the MatchType of a NodeGroup (e.g. "ALL", "ANY")
  setNodeGroupMatchType({commit}, payload) {
    if (!Object.values(NodeGroupMatchType).includes(payload.type)) {
      console.log(`Invalid MatchType: ${payload}`);
      return;
    }
    commit('SET_NODE_GROUP_MATCH_TYPE', payload)
  },

  // Add a new NodeGroup as a child to a node
  addGroupToNode({commit, getters}, node: BaseNode) {
    const payload = {
      "targetNode": node, "child": new NodeGroup(getters.nextId, [], NodeGroupMatchType.ANY),
    }
    commit('ADD_HISTORY')
    commit('INCREMENT_NEXT_ID')
    commit('ADD_CHILD_TO_NODE', payload)
  },

  // Remove a node from the tree
  removeNode({commit}, node: BaseNode) {
    commit('ADD_HISTORY')
    commit('REMOVE_NODE', node)
  },

  // Add a new NodeRule as a child to a node
  addRuleToNode({commit, getters}, node: BaseNode) {
    const payload = {
      "targetNode": node, "child": new NodeRule(getters.nextId)
    }
    commit('ADD_HISTORY')
    commit('INCREMENT_NEXT_ID')
    commit('ADD_CHILD_TO_NODE', payload)
  },

  // Set the column of a NodeRule node
  // If the new column is a different data type then the operator and value should be reset
  setNodeRuleColumn({commit, getters}, payload) {

    // Clearing the column - remove all information
    if (payload.columnId == null) {
      commit('SET_NODE_RULE_OPERATOR', {
        "node": payload.node, "operatorId": null,
      });
      commit('SET_NODE_RULE_SEARCH_VALUE', {
        "node": payload.node, "value": null,
      });
    }

    // Changing the column
    else {

      // The previous column was not null
      if (payload.node.columnId != null) {
        const newDt = getters.columns[payload.columnId].dataType;
        const oldDt = getters.columns[payload.node.columnId].dataType;

        // The data type is changing, do we need to clear the operator and value?
        if (newDt != oldDt) {

          // Changing between string and numeric shouldn't clear the value
          const keepValDt = [ColumnDataType.NUMERIC, ColumnDataType.STRING];
          if (!(keepValDt.includes(newDt) && keepValDt.includes(oldDt))) {
            commit('SET_NODE_RULE_SEARCH_VALUE', {"node": payload.node, "value": null,});
          }
          commit('SET_NODE_RULE_OPERATOR', {"node": payload.node, "operatorId": null,});
        }
      }
    }

    // Always change the column ID
    commit('SET_NODE_RULE_COLUMN', {"node": payload.node, "columnId": payload.columnId,});
  },

  // Set the operator of a NodeRule node
  setNodeRuleOperator({commit}, payload) {
    commit('SET_NODE_RULE_OPERATOR', {
      "node": payload.node, "operatorId": payload.operatorId
    });
  },

  // When the value of a NodeRule search value changes
  setNodeRuleSearchValue({commit, getters}, payload) {
    commit('SET_NODE_RULE_SEARCH_VALUE', payload)
  },

  // -------------------------------------------------------------------------------------------------------------------
  // History modifications
  // -------------------------------------------------------------------------------------------------------------------

  // Revert backwards one history state
  undoHistory({commit}) {
    commit('UNDO_HISTORY')
  },

  // -------------------------------------------------------------------------------------------------------------------
  // Initial state modifications
  // -------------------------------------------------------------------------------------------------------------------

  queryDatabase({commit}, payload) {
    commit('SET_RESULTS', null);
    commit('SET_RESULTS_IS_LOADING', true);
    commit('SET_RESULTS_HAS_BEEN_RUN', true);
    this.$api.advanced.getSearch(payload)
      .then(resp => {
        commit('SET_RESULTS_IS_LOADING', false);
        commit('SET_RESULTS', resp.data);
      });
  },

  // Initialise the tree based on a query string
  setInitialStateByEncodedString({commit, getters}, payload) {
    try {
      if (payload.exp && payload.exp.length > 0) {
        const decodedPayload = base64DecodeUrlPayload(payload);
        commit('SET_ROOT_NODE', urlPayloadToTree(decodedPayload));
        commit('SET_NEXT_ID', Object.keys(payload).length + 1)

        commit('SET_RESULTS_IS_LOADING', true);
        commit('SET_RESULTS_HAS_BEEN_RUN', true);
        this.$api.advanced.getSearch(payload)
          .then(resp => {
            commit('SET_RESULTS_IS_LOADING', false);
            commit('SET_RESULTS', resp.data);
          })
      }
    } catch (e) {
      console.log(`Unable to set initial state: ${e}`)
    }
  },

})

/**
 * [ [ "(3&4&(6))" ], { "3": "0~1~ac", "4": "2~2~g", "6": "6~9~5" } ]
 * ("Accession" IS NOT "ac" AND "NCBI Taxonomy" CONTAINS "g" AND ("CheckM Completeness" < 5))
 *
 *
 * ("Accession" IS "a" OR ("NCBI Taxonomy" IS NOT "c" AND "NCBI Taxonomy" IS "d"))
 [ [ "(4|(6&7))" ], { "4": "0~0~a", "6": "2~1~c", "7": "2~0~d" } ]
 http://localhost:3000/advanced?exp=KDR8KDYmNykp&4=MH4wfmE~&6=Mn4xfmM~&7=Mn4wfmQ~
 */
