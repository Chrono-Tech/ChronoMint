import {Map} from 'immutable';
import IPFS from 'ipfs';

const INIT_NODE_SUCCESS = 'ipfs/INIT_NODE_SUCCESS';
const CREATE_NODE_SUCCESS = 'ipfs/CREATE_NODE_SUCCESS';
const CREATE_NODE_ERROR = 'ipfs/CREATE_NODE_ERROR';
const UPLOAD_FILE_SUCCESS = 'ipfs/UPLOAD_FILE_SUCCESS';

const initialState = {
    ipfs: {
        id: null,
        node: null,
        version: null,
        protocol_version: null,
    },
    files: new Map(),
    error: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPLOAD_FILE_SUCCESS:
            return {
                ...state,
                files: state.files.set(action.payload.hash, action.payload)
            };
        case INIT_NODE_SUCCESS:
            return {
                ...state,
                ipfs: {
                    ...state.ipfs,
                    node: action.payload
                }
            };
        case CREATE_NODE_SUCCESS:
            return {
                ...state,
                ipfs: {
                    ...state.ipfs,
                    ...action.payload
                }
            };
        case CREATE_NODE_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

const initNode = (payload) => ({type: INIT_NODE_SUCCESS, payload});
const createNode = (payload) => ({type: CREATE_NODE_SUCCESS, payload});
const handleCreateError = (payload) => ({type: CREATE_NODE_ERROR, payload});
const uploadFileSuccess = (payload) => ({type: UPLOAD_FILE_SUCCESS, payload});

const setupIPFSNode = () => (dispatch) => {
    const repoPath = String(Math.random());
    const node = new IPFS(repoPath);

    node.init({emptyRepo: true, bits: 2048}, (err) => {
        if (err) {
            dispatch(handleCreateError(err));
        }
        dispatch(initNode(node));

        node.load(function (err) {
            if (err) {
                dispatch(handleCreateError(err));
            }

            node.goOnline(function (err) {
                if (err) {
                    dispatch(handleCreateError(err));
                }
                node.id((err, res) => {
                    if (err) {
                        dispatch(handleCreateError(err));
                    }
                    dispatch(createNode({
                        id: res.id,
                        version: res.agentVersion,
                        protocol_version: res.protocolVersion
                    }));
                });
            })
        })
    })
};

export {
    setupIPFSNode,
    uploadFileSuccess
}

export default reducer;