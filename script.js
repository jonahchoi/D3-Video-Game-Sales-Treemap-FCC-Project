let h = 800;
let w = 1200;
let padding = 50;

let svg = d3.select('#svg-container').
append('svg').
attr('height', h).
attr('width', w);

let tooltip = d3.select('#svg-container').
append('div').
attr('id', 'tooltip').
style('opacity', 0);

let legend = d3.select('#legend-container').
append('svg').
attr('height', 200).
attr('width', 375).
attr('id', 'legend');


d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json').
then(function (data) {
  let consoles = data.children.map(d => d.name);

  let myColor = d3.scaleOrdinal().
  domain(consoles).
  range(['#34ace0', ' #33d9b2', '#ffda79', '#ffb142', '#227093', '#ff793f', '#b33939', '#f7f1e3', '#cc8e35', '#D6A2E8', '#474787', '#d1ccc0', '#ccae62', '#84817a', '#cd6133', '#ff5252', '#706fd3', '#218c74']);

  const root = d3.hierarchy(data).sum(d => d.value).sort(function (a, b) {
    return b.height - a.height || b.value - a.value;
  });
  d3.treemap().
  size([w, h - 2 * padding]).
  paddingInner(1)(
  root);

  let box = svg.selectAll('g').
  data(root.leaves()).
  enter().
  append('g').
  attr('transform', d => 'translate(' + d.x0 + ',' + d.y0 + ')');

  box.append('rect').
  attr('width', d => d.x1 - d.x0).
  attr('height', d => d.y1 - d.y0).
  style('fill', d => myColor(d.parent.data.name)).
  attr('class', 'tile').
  attr('data-name', d => d.data.name).
  attr('data-category', d => d.data.category).
  attr('data-value', d => d.data.value).
  on('mouseover', function (e, d) {
    tooltip.style('opacity', 0.9).
    style('left', () => d.x0 + 350 + 'px').
    style('top', () => d.y0 + 150 + 'px');
    tooltip.html(() => {
      let output = 'Name: ' + d.data.name + '<br>Console: ' + d.data.category + '<br>Value: ' + d.data.value;
      return output;
    }).
    attr('data-value', () => d.data.value);
  }).
  on('mouseout', function (e, d) {
    tooltip.style('opacity', 0);
  });

  box.append('text').
  selectAll('tspan').
  data(d => {return d.data.name.split(/(?=[A-Z][^A-Z])/g);}).
  join('tspan').
  attr('x', 5).
  attr('y', (d, i) => 15 + i * 10).
  text(d => d).
  style('font-size', '10px').
  style('pointer-events', 'none');

  legend.selectAll('rect').
  data(consoles).
  join('rect').
  attr('x', (d, i) => i % 3 * 150).
  attr('y', (d, i) => Math.floor(i / 3) * 35).
  attr('height', 15).
  attr('width', 15).
  style('fill', d => myColor(d)).
  attr('class', 'legend-item');

  legend.selectAll('text').
  data(consoles).
  join('text').
  text(d => d).
  attr('x', (d, i) => 25 + i % 3 * 150).
  attr('y', (d, i) => 15 + Math.floor(i / 3) * 35);



});