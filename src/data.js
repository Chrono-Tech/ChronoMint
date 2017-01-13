import React from 'react';
import Assessment from 'material-ui/svg-icons/action/assessment';
import GridOn from 'material-ui/svg-icons/image/grid-on';
import PermIdentity from 'material-ui/svg-icons/action/perm-identity';
import Web from 'material-ui/svg-icons/av/web';
import {cyan600, pink600, purple600} from 'material-ui/styles/colors';
import Group from 'material-ui/svg-icons/social/group';
import GroupAdd from 'material-ui/svg-icons/social/group-add';
import Pages from 'material-ui/svg-icons/social/pages';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ActionInfo from 'material-ui/svg-icons/action/info';

const data = {
    menus: [
        { text: 'CBE DashBoard', icon: <Assessment/>, link: '/dashboard' },
        { text: 'Create LOC', icon: <GroupAdd/>, link: '/form' },
        { text: 'LOCs List', icon: <Group/>, link: '/table' },
        { text: 'Operations List', icon: <GridOn/>, link: '/operation', ricon: <ActionInfo/> }
        //{ text: 'Switch User', icon: <PermIdentity/>, link: '/login' }
    ], menus2: [
        { text: 'LOC DashBoard', icon: <Assessment/>, link: '/dashboard2' },
        { text: 'Edit LOC', icon: <Pages/>, link: '/loc/form2' },
        { text: 'LH Admin', icon: <Group/>, link: '/loc/table2' },
        { text: 'Operations List', icon: <GridOn/>, link: '/operation' }
       // { text: 'Switch User', icon: <PermIdentity/>, link: '/login' }
    ],
    tablePage: {
        items: [
            {id: 1, name: 'LOC 1', price: '5000 LHAU', category: 'Marketing', isPending: true },
            {id: 2, name: 'LOC 2', price: '7000 LHAU', category: 'Construction'},
            {id: 3, name: 'LOC 3', price: '15000 LHAU', category: 'Sales'},
            {id: 4, name: 'LOC 4', price: '3000 LHAU', category: 'IT'},
            {id: 5, name: 'LOC 5', price: '45000 LHAU', category: 'Cleaning'},
            {id: 6, name: 'LOC 6', price: '20000 LHAU', category: 'Category 6'},
            {id: 7, name: 'LOC 7', price: '97000 LHAU', category: 'Category 7'},
            {id: 8, name: 'LOC 8', price: '20000 LHAU', category: 'Category 8'}
        ]
    },
    dashBoardPage: {
        LOCsList: [
            {id: 1, title: 'LOC 1', text: '7000 LHAU issued.'},
            {id: 2, title: 'LOC 2', text: '100000 LHAU issued.'},
            {id: 3, title: 'LOC 3', text: '55000 LHAU issued.'},
            {id: 4, title: 'LOC 4', text: '20000 LHAU issued.'}
        ], WorkersList: [
            {id: 1, title: 'Worker 1', text: '70 LHAU paid.'},
            {id: 2, title: 'Worker 2', text: '10 LHAU paid.'},
            {id: 3, title: 'Worker 3', text: '55 LHAU paid.'},
            {id: 4, title: 'Worker 4', text: '20 LHAU paid.'}
        ],
        monthlySales: [
            {name: 'Jan', uv: 3700},
            {name: 'Feb', uv: 3000},
            {name: 'Mar', uv: 2000},
            {name: 'Apr', uv: 2780},
            {name: 'May', uv: 2000},
            {name: 'Jun', uv: 1800},
            {name: 'Jul', uv: 2600},
            {name: 'Aug', uv: 2900},
            {name: 'Sep', uv: 3500},
            {name: 'Oct', uv: 3000},
            {name: 'Nov', uv: 2400},
            {name: 'Dec', uv: 2780}
        ],
        newOrders: [
            {pv: 2400},
            {pv: 1398},
            {pv: 9800},
            {pv: 3908},
            {pv: 4800},
            {pv: 3490},
            {pv: 4300}
        ],
        browserUsage: [
            {name: 'LOC 1', value: 800, color: "#161240", icon: <ExpandMore/>},
            {name: 'LOC 2', value: 300, color: "#17579c", icon: <ChevronRight/>},
            {name: 'LOC 3', value: 300, color: "#4a8fb9", icon: <ExpandLess/>}
        ]
    }
};

export default data;
