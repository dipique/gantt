import './App.css';
import { Gantt } from './gantt/Gantt';
import { Tree } from './gantt/Tree';
import { Task } from './gantt/Task';

const tree = new Tree('My project')
const first = tree.add(new Task('Task 1'))
const second = tree.add(new Task('Task 2'))
tree.add(new Task('Task 3'))
const iat = tree.addAfter(new Task('Insert after 2'), second)
tree.addChild(new Task('Child of 1 (1)'), first)
const child = tree.addChild(new Task('Child of 1 (2)'), first)
tree.addChild(new Task('Grandchild 1'), child)
const gttwo = tree.addChild(new Task('Grandchild 2'), child)
tree.addChild(new Task('Grandchild 3'), child)
tree.addChild(new Task('Inserted task'), iat)
tree.delete(gttwo) // id 8, parent 6

console.log(tree)

// should look like:

// My Project
//   Task 1
//     Child of 1 (1)
//     Child of 1 (2)
//       Grandchild 1
//       Grandchild 3
//   Task 2
//     Insert after 2
//       Inserted task
//   Task 3


function App() {
  return (
    <div className="App">
      <Gantt tree={tree} />
    </div>
  );
}

export default App;
