  var url = "http://demo.neuralmechanics.ai/nlp/word_similarity?limit=15&q="
  var input_terms = ''

function init_graph(){
  
  div = document.getElementById('d3_div')  
  console.log(div)
  width = div.offsetWidth;
  height = div.offsetHeight;

  svg = d3.select('#graph').append("svg:svg")
      .attr("width", width)//canvasWidth)
      .attr("height",height)//canvasHeight)


// Remove menu appearing when right click button was pressed
document.addEventListener("contextmenu", function(e){
      e.preventDefault();
    }, false);


    // simulation setup with all forces
 linkForce = d3
  .forceLink()
  .id(function (link) { return link.id })
  .strength(function (link) { return 1})



 simulation = d3
  .forceSimulation()
  .force('link', linkForce)
  .force('charge', d3.forceManyBody().strength(-150))
  .force('center', d3.forceCenter(width / 2, height / 2))


 dragDrop = d3.drag().on('start', function (node) {
  node.fx = node.x
  node.fy = node.y
}).on('drag', function (node) {
  simulation.alphaTarget(0.20).restart()
  node.fx = d3.event.x
  node.fy = d3.event.y
}).on('end', function (node) {
  if (!d3.event.active) {
    simulation.alphaTarget(0)
  }
  node.fx = null
  node.fy = null
})

}

function getNeighbors(node) {
  return links.reduce(function (neighbors, link) {
      if (link.target.id === node.id) {
        neighbors.push(link.source.id)
      } else if (link.source.id === node.id) {
        neighbors.push(link.target.id)
      }
      return neighbors
    },
    [node.id]
  )
}

function isNeighborLink(node, link) {
  return link.target.id === node.id || link.source.id === node.id
}

function getNodeSize(node){
  if(node.level == 1){
    return 10
  }

    else if(node.level == 2){
    return 5
  }

  else{
    return 5
  }
 
}

function getNodeColor(node, neighbors, selectedNode) {

  if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
    return node.id == selectedNode.id ? '#7f7fff' : '#e5e5ff'
  }
  return node.level === 1 ? 'white' :  'white'
}


function getLinkColor(node, link) {
  return isNeighborLink(node, link) ? '#9999ff' : '#E5E5E5'
}

function getLinkWidth(link){
  return link.strength * 5;
}

function getTextColor(node, neighbors) {
  return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? '#000066' : 'black'
}


function reset_graph(){
  // we modify the styles to highlight selected nodes
  nodeElements.attr('fill', function (node) { return getNodeColor(node) })
  textElements.attr('fill', function (node) { return getTextColor(node) })
  linkElements.attr('stroke', function (link) { return '#e5e5ff'})

}



var current_selected_node;
function selectNode(selectedNode) {
  var neighbors = getNeighbors(selectedNode)
  if(selectedNode.id == current_selected_node && selectedNode.level != 1){

    input_terms = input_terms + ',' + encodeURI(selectedNode.id)
    update_d3_graph(selectedNode.id === "_root_" ? input_terms : input_terms)
  }

  current_selected_node = selectedNode.id
  // we modify the styles to highlight selected nodes
  nodeElements.attr('fill', function (node) { return getNodeColor(node, neighbors, selectedNode) })
  textElements.attr('fill', function (node) { return getTextColor(node, neighbors) })
  linkElements.attr('stroke', function (link) { return getLinkColor(selectedNode, link) })
}


function update_d3_graph(input_terms){

  console.log('input terms: ' + input_terms)

  svg.selectAll('*').remove();

  d3.json(url + input_terms, function(error, json) {
  if (error) throw error;
  
  console.log(json);

// D3 Graph properties
// group - clustering of nodes
// level - node color
  nodes = json['data']['nodes']
  links = json['data']['links']
  
  linkElements = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
      .attr("stroke-width", getLinkWidth)
      .attr("stroke", "#e5e5ff")
      .attr('class', "link")

  nodeElements = svg.append("g")
    .attr("class", "node")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", getNodeSize)
      .attr("fill", getNodeColor)
      .attr('class',"node")
      .on('click', selectNode)
      .call(dragDrop)


  textElements = svg.append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
      .text(function (node) { return  node.label })
      .attr("font-size", function(node){ return node.level == 1 ? 20 : 10})
      .attr("opacity", 0.75)
      .attr("x", 0)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("font-family", "roboto")
      .classed('noselect', true)
      .on('click', selectNode)    
      .call(dragDrop)

  simulation.nodes(nodes).on('tick', () => {
    nodeElements
      .attr('cx', function (node) { return Math.max(getNodeSize(node), Math.min(width - getNodeSize(node), node.x)) })
      .attr('cy', function (node) { return Math.max(getNodeSize(node), Math.min(width - getNodeSize(node), node.y)) })
    textElements
      .attr('x', function (node) {  return Math.max(getNodeSize(node), Math.min(width - getNodeSize(node), node.x)) })
      .attr('y', function (node) { return Math.max(getNodeSize(node), Math.min(width - getNodeSize(node), node.y)) })
    linkElements
      .attr('x1', function (link) { return link.source.x })
      .attr('y1', function (link) { return link.source.y })
      .attr('x2', function (link) { return link.target.x })
      .attr('y2', function (link) { return link.target.y })
  })

simulation.force("link").links(links)
  
simulation.force('x', d3.forceX().x(function(d) {
  return width/2
}))
.force('y', d3.forceY().y(function(d) {
  return height/2
}))
.force('collision', d3.forceCollide().radius(function(d) {
    return getNodeSize(d) + 10}))

simulation.alphaTarget(0.20).restart()
});
}
