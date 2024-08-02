function bidirectionalAStar(grid, start, end, forwardDistanceMap, backwardDistanceMap, forwardProcessed, backwardProcessed, forwardHeuristic, backwardHeuristic,
forwardParentMap, backwardParentMap, forwardMinHeap, backwardMinHeap, forwardCurr, backwardCurr, choices){

  if(forwardMinHeap.length || backwardMinHeap.length){
    if(checkIntersectionAStar(forwardProcessed, backwardCurr, forwardParentMap, backwardParentMap)){ return;}
    if(checkIntersectionAStar(backwardProcessed, forwardCurr, backwardParentMap, forwardParentMap)){ return;}
    if(forwardMinHeap.length){
      forwardCurr = doAStar(forwardMinHeap,forwardDistanceMap,forwardHeuristic,forwardProcessed,choices,grid,forwardParentMap);
    }
    if(backwardMinHeap.length){
      backwardCurr = doAStar(backwardMinHeap,backwardDistanceMap,backwardHeuristic,backwardProcessed,choices,grid,backwardParentMap,"-backward");
    }

setTimeout(bidirectionalAStar,10,grid, start, end, forwardDistanceMap, backwardDistanceMap, forwardProcessed, backwardProcessed, forwardHeuristic, backwardHeuristic,
forwardParentMap, backwardParentMap, forwardMinHeap, backwardMinHeap, forwardCurr, backwardCurr, choices);
  }else{
    document.querySelector("#clear").disabled = false;
    document.querySelector("#clear-path").disabled = false;
    document.querySelector("#size-slider").disabled = false;
  document.querySelector("#path-finding-grp-btn").disabled = false;
  document.querySelector("#maze-generation-grp-btn").disabled = false;
    let toastTriggerEl = document.getElementById('fail-toast')
    let toast = new mdb.Toast(toastTriggerEl)
    toast.show()
    return;
  }
}
function bidirectionalDijkstra(grid,start,end,forwardDistanceMap,backwardDistanceMap,forwardProcessed,backwardProcessed,forwardParentMap,backwardParentMap,
forwardMinHeap, backwardMinHeap, forwardCurr, backwardCurr, choices){
  if(forwardMinHeap.length || backwardMinHeap.length){
    if(checkIntersectionAStar(forwardProcessed, backwardCurr, forwardParentMap, backwardParentMap)){return ;}
    if(checkIntersectionAStar(backwardProcessed, forwardCurr, backwardParentMap, forwardParentMap)){return ;}
    if(forwardMinHeap.length){
      forwardCurr = doDijkstra(forwardMinHeap,forwardDistanceMap,forwardProcessed,choices,grid,forwardParentMap);
    }
    if(backwardMinHeap.length){
      backwardCurr = doDijkstra(backwardMinHeap,backwardDistanceMap,backwardProcessed,choices,grid,backwardParentMap,"-backward");
    }
setTimeout(bidirectionalDijkstra,10,grid, start, end, forwardDistanceMap, backwardDistanceMap, forwardProcessed, backwardProcessed,
forwardParentMap, backwardParentMap, forwardMinHeap, backwardMinHeap, forwardCurr, backwardCurr, choices);
  }else{
    document.querySelector("#clear").disabled = false;
    document.querySelector("#clear-path").disabled = false;
    document.querySelector("#size-slider").disabled = false;
  document.querySelector("#path-finding-grp-btn").disabled = false;
  document.querySelector("#maze-generation-grp-btn").disabled = false;
    let toastTriggerEl = document.getElementById('fail-toast')
    let toast = new mdb.Toast(toastTriggerEl)
    toast.show()
    return;
  }
}


function doDijkstra(minHeap, distanceMap, processed, choices, grid, parentMap, type="",realtime = false){
  minHeap.sort((a,b) => distanceMap.get(b) - distanceMap.get(a));
  let curr = minHeap.pop();
  let div = curr.divReference;
  if(processed.has(curr)){
    return;
  }
  if(realtime){
    curr.divReference.classList.add(`node-check-rt${type}`);
  }else{
    div.classList.add(`node-current${type}`);
    setTimeout(() => {div.classList.remove(`node-current${type}`); div.classList.add(`node-check${type}`)},1000);
  }
  processed.add(curr);
  for(let i = 0 ; i < choices.length ; ++i){
    let row = curr.row + choices[i][0];
    let col = curr.col + choices[i][1];
    if(grid[row] && grid[row][col] && !grid[row][col].isWall && !processed.has(grid[row][col])){
      let edgeWeight = !grid[row][col].weight ? 1 : grid[row][col].weight;
      let newDistance = distanceMap.get(curr) + edgeWeight;
      if(!distanceMap.has(grid[row][col]) || newDistance < distanceMap.get(grid[row][col])){
        parentMap.set(grid[row][col], curr);
        distanceMap.set(grid[row][col], newDistance);
      }
      minHeap.push(grid[row][col]);
    }
  }

  return curr;
}
function doAStar(minHeap, distanceMap, heursticMap, processed, choices, grid, parentMap,type=""){
  minHeap.sort((a,b) => (distanceMap.get(b) + heursticMap.get(b)) - (distanceMap.get(a) + heursticMap.get(a)));
  let curr = minHeap.pop();
  let div = curr.divReference;
  if(processed.has(curr)){
    div.classList.add("node-backtrack");
    return curr;
  }
  div.classList.add(`node-current${type}`);
  setTimeout(() => {div.classList.remove(`node-current${type}`); div.classList.add(`node-check${type}`)},1000);
  // div.classList.add("node-current");
  // setTimeout(() => {div.classList.remove("node-current"); div.classList.add("node-check")});
  processed.add(curr);
  for(let i = 0 ; i < choices.length ; ++i){
    let row = curr.row + choices[i][0];
    let col = curr.col + choices[i][1];
    if(grid[row] && grid[row][col] && !grid[row][col].isWall && !processed.has(grid[row][col])){
      let edgeDistance = !grid[row][col].weight ? 1 : grid[row][col].weight;
      let newDistance = distanceMap.get(curr) + edgeDistance;
      if(newDistance < distanceMap.get(grid[row][col])){
        parentMap.set(grid[row][col], curr);
        distanceMap.set(grid[row][col], newDistance);
      }
      minHeap.push(grid[row][col]);
    }
  }

  return curr;
}

function checkIntersectionAStar(processed, curr, currentParentMap, otherParentMap){
  if(processed.has(curr)){
    curr.divReference.classList.add("node-intersection");
    executeDrawPath(currentParentMap, curr);
    executeDrawPath(otherParentMap, curr);
    return true;
  }
  return false;
}
function checkIntersectionAStarRT(processed, curr, currentParentMap, otherParentMap){
  if(processed.has(curr)){
    curr.divReference.classList.add("node-intersection");
    let path = getPath(currentParentMap,curr);
    drawPathRT(path);
    path = getPath(otherParentMap,curr);
    drawPathRT(path);
    return true;
  }
  return false;
}
function bidirectionalDijkstraRT(grid, start, end){
  if(!grid || !start || !end){
    return;
  }

  let forwardDistanceMap = new Map();
  let backwardDistanceMap = new Map();
  let forwardProcessed = new Set();
  let backwardProcessed = new Set();
  let forwardParentMap = new Map();
  let backwardParentMap = new Map();
  let forwardMinHeap = [];
  let backwardMinHeap = [];
  let forwardCurr = start;
  let backwardCurr = end;
  let choices = [[-1,0],[1,0],[0,-1],[0,1]];
 
  forwardDistanceMap.set(forwardCurr,0);
  backwardDistanceMap.set(backwardCurr,0);
  forwardParentMap.set(forwardCurr, null);
  backwardParentMap.set(backwardCurr, null);
  forwardMinHeap.push(forwardCurr);
  backwardMinHeap.push(backwardCurr);

  while(forwardMinHeap.length || backwardMinHeap.length){
    if(checkIntersectionAStarRT(forwardProcessed, backwardCurr, forwardParentMap, backwardParentMap)){ return;}
    if(checkIntersectionAStarRT(backwardProcessed, forwardCurr, backwardParentMap, forwardParentMap)){ return;}
    if(forwardMinHeap.length){
      forwardCurr = doDijkstra(forwardMinHeap,forwardDistanceMap,forwardProcessed,choices,grid,forwardParentMap,"",true);
    }
    if(backwardMinHeap.length){
      backwardCurr = doDijkstra(backwardMinHeap,backwardDistanceMap,backwardProcessed,choices,grid,backwardParentMap,"-backward",true);
    }
  }

    document.querySelector("#clear").disabled = false;
    document.querySelector("#clear-path").disabled = false;
    document.querySelector("#size-slider").disabled = false;
    document.querySelector("#path-finding-grp-btn").disabled = false;
    document.querySelector("#maze-generation-grp-btn").disabled = false;
    let toastTriggerEl = document.getElementById('fail-toast')
    let toast = new mdb.Toast(toastTriggerEl)
    toast.show()
    return;
}

function bidirectionalAStarRT(grid, start, end){
  if(!grid || !start || !end){
    return;
  }

  let forwardDistanceMap = new Map();
  let backwardDistanceMap = new Map();
  let forwardProcessed = new Set();
  let backwardProcessed = new Set();
  let forwardHeuristic = new Map();
  let backwardHeuristic = new Map();
  let forwardParentMap = new Map();
  let backwardParentMap = new Map();
  let forwardMinHeap = [];
  let backwardMinHeap = [];
  let forwardCurr = start;
  let backwardCurr = end;
  let choices = [[-1,0],[1,0],[0,-1],[0,1]];
  for(let i = 0 ; i < grid.length ; ++i){
    for(let j = 0 ; j < grid[i].length ; ++j){
      forwardDistanceMap.set(grid[i][j],Infinity);
      backwardDistanceMap.set(grid[i][j],Infinity);
      forwardHeuristic.set(grid[i][j], Math.abs(grid[i][j].row - end.row) + Math.abs(grid[i][j].col - end.col));
      backwardHeuristic.set(grid[i][j], Math.abs(grid[i][j].row - start.row) + Math.abs(grid[i][j].col - start.col));
    }
  }
  forwardDistanceMap.set(forwardCurr,0);
  backwardDistanceMap.set(backwardCurr,0);
  forwardParentMap.set(forwardCurr, null);
  backwardParentMap.set(backwardCurr, null);
  forwardMinHeap.push(forwardCurr);
  backwardMinHeap.push(backwardCurr);

  while(forwardMinHeap.length || backwardMinHeap.length){
    if(checkIntersectionAStarRT(forwardProcessed, backwardCurr, forwardParentMap, backwardParentMap)){ return;}
    if(checkIntersectionAStarRT(backwardProcessed, forwardCurr, backwardParentMap, forwardParentMap)){ return;}
    if(forwardMinHeap.length){
      forwardCurr = doAStarRT(forwardMinHeap,forwardDistanceMap,forwardHeuristic,forwardProcessed,choices,grid,forwardParentMap);
    }
    if(backwardMinHeap.length){
      backwardCurr = doAStarRT(backwardMinHeap,backwardDistanceMap,backwardHeuristic,backwardProcessed,choices,grid,backwardParentMap,"-backward");
    }
  }

    document.querySelector("#clear").disabled = false;
    document.querySelector("#clear-path").disabled = false;
    document.querySelector("#size-slider").disabled = false;
  document.querySelector("#path-finding-grp-btn").disabled = false;
  document.querySelector("#maze-generation-grp-btn").disabled = false;
    let toastTriggerEl = document.getElementById('fail-toast')
    let toast = new mdb.Toast(toastTriggerEl)
    toast.show()
    return;
}
function doAStarRT(minHeap, distanceMap, heursticMap, processed, choices, grid, parentMap,type=""){
  minHeap.sort((a,b) => (distanceMap.get(b) + heursticMap.get(b)) - (distanceMap.get(a) + heursticMap.get(a)));
  let curr = minHeap.pop();
  if(processed.has(curr)){
    return curr;
  }
  curr.divReference.classList.add(`node-check-rt${type}`);
  processed.add(curr);
  for(let i = 0 ; i < choices.length ; ++i){
    let row = curr.row + choices[i][0];
    let col = curr.col + choices[i][1];
    if(grid[row] && grid[row][col] && !grid[row][col].isWall && !processed.has(grid[row][col])){
      let edgeDistance = !grid[row][col].weight ? 1 : grid[row][col].weight;
      let newDistance = distanceMap.get(curr) + edgeDistance;
      if(newDistance < distanceMap.get(grid[row][col])){
        parentMap.set(grid[row][col], curr);
        distanceMap.set(grid[row][col], newDistance);
      }
      minHeap.push(grid[row][col]);
    }
  }

  return curr;
}
