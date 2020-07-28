const D3Node = require('d3-node');
const d3 = D3Node.d3;

async function makeBarchart(canvas, context, data, xfield, yfield) {
	const margin = { top: 20, right: 20, bottom: 30, left: 40 },
		width = canvas.width - margin.left - margin.right,
		height = canvas.height - margin.top - margin.bottom;

	const x = d3.scaleBand()
		.rangeRound([0, width])
		.padding(0.1);

	const y = d3.scaleLinear()
		.rangeRound([height, 0]);

	context.translate(margin.left, margin.top);

	const maxVal = d3.max(data, function(d) { return d[yfield]; });

	x.domain(data.map(function(d) { return d[xfield]; }));
	y.domain([0, maxVal]);

	const yTickCount = maxVal,
		yTicks = y.ticks(yTickCount),
		yTickFormat = y.tickFormat(yTickCount);
	context.fillStyle = 'white';
	context.beginPath();
	x.domain().forEach(function(d) {
		context.moveTo(x(d) + x.bandwidth() / 2, height);
		context.lineTo(x(d) + x.bandwidth() / 2, height + 6);
	});
	context.strokeStyle = 'white';
	context.stroke();

	context.textAlign = 'center';
	context.textBaseline = 'top';
	x.domain().forEach(function(d) {
		context.fillText(d, x(d) + x.bandwidth() / 2, height + 6);
	});

	context.beginPath();
	yTicks.forEach(function(d) {
		context.moveTo(0, y(d) + 0.5);
		context.lineTo(-6, y(d) + 0.5);
	});
	context.strokeStyle = 'white';
	context.stroke();

	context.textAlign = 'right';
	context.textBaseline = 'middle';

	yTicks.forEach(function(d) {
		context.fillText(yTickFormat(d), -9, y(d));
	});

	context.beginPath();
	context.moveTo(-6.5, 0 + 0.5);
	context.lineTo(0.5, 0 + 0.5);
	context.lineTo(0.5, height + 0.5);
	context.lineTo(-6.5, height + 0.5);
	context.strokeStyle = 'white';
	context.stroke();

	context.save();
	context.rotate(-Math.PI / 2);
	context.textAlign = 'right';
	context.textBaseline = 'top';
	context.font = 'bold 10px sans-serif';
	context.fillStyle = 'white';
	context.fillText('Frequency', -10, 10);
	context.restore();

	context.fillStyle = 'steelblue';
	data.forEach(function(d) {
		context.fillRect(x(d[xfield]), y(d[yfield]), x.bandwidth(), height - y(d[yfield]));
	});

}

module.exports = {
	makeBarchart,
};