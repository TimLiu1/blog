// generic binary search tree

let tree = node(5);
function main() {
  //构建二叉树
  const arr = [3, 2, 1, 4, 6, 7, 8, 9];
  arr.forEach(e => {
    insert(e);
  });
  
  //前序遍历
  console.log("preOrder", preOrder());
  //中序遍历
  console.log("inOrder", inOrder());
  //后序遍历
  console.log("postOrder", postOrder());
  //查找
  console.log("search", search(1));
}

function node(value, left, right) {
  return {
    value,
    left,
    right
  };
}

// insert
function insert(value) {
  function doInsert(tree) {
    if (!tree) {
      tree = node(value);
    } else {
      if (tree.value > value) {
        if (!tree.left) {
          tree.left = node(value);
        } else {
          doInsert(tree.left);
        }
      } else {
        if (!tree.right) {
          tree.right = node(value);
        } else {
          doInsert(tree.right);
        }
      }
    }
  }
  doInsert(tree);
}

// preOrder
function preOrder() {
  let result = [];
  function doPreOrder(tree) {
    if (tree.value) {
      result.push(tree.value);
    }
    if (tree.left) {
      doPreOrder(tree.left);
    }
    if (tree.right) {
      doPreOrder(tree.right);
    }
  }
  doPreOrder(tree);
  return result;
}

// inOrder
function inOrder() {
  let result = [];
  function doInOrder(tree) {
    if (tree.left) {
      doInOrder(tree.left);
    }
    result.push(tree.value);
    if (tree.right) {
      doInOrder(tree.right);
    }
  }
  doInOrder(tree);
  return result;
}

// postOrder
function postOrder() {
  let result = [];
  let i = 1;
  function doPostOrder(tree) {
    if (tree.left) {
      doPostOrder(tree.left);
    }
    if (tree.right) {
      doPostOrder(tree.right);
    }
    result.push(tree.value);
  }
  doPostOrder(tree);
  return result;
}

//search
function search(value) {
  let result;
  let i = 0;
  function doSearch(tree) {
    if (tree.value === value) {
      result = tree;
      return;
    }
    if (tree.value > value) {
      if (tree.left) {
        doSearch(tree.left);
      }
    } else {
      if (tree.right) {
        doSearch(tree.right);
      }
    }
  }
  doSearch(tree);
  return result;
}

main();
