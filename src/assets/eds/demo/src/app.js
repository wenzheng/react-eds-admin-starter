console.log('Ericsson Design System v1.3.0');

// Import the style files
import './common/styles.less';

// Import the script files
import { Layout } from './common/scripts/Layout';
import { Tree } from './trees/Tree';

const layout = new Layout(document.querySelector('body'));
layout.init();

//  - Tree (Navigation)
const tree = new Tree(document.querySelector('.appnav .tree.navigation'));
tree.init();
