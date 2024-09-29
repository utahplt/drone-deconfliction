const getTakeOff = (uavI) => instances.map(inst => {
    return inst.signature('UAV').tuples()[uavI]._atoms[0].flying._id == 1
    }).indexOf(true)

const uavs = instances[0].signature('UAV').tuples().map((x, i)=> {
    return {
        early: x._atoms[0].earlyistEntry._id,
        late: x._atoms[0].latestEntry._id,
        speed: x._atoms[0].planedSpeed._id,
        takeOff: getTakeOff(i)
    }
})

const uavStr = (uav) => {
    return `[${uav.early}, ${uav.late}]@${uav.speed}`
}

box =
     d3.select(svg)
     .selectAll('g')
     .data([0])
     .enter()
     .append('g')

box
    .append('rect')
    .attr('x', 25)
     .attr('y', 25)
    .attr('width', 400)
    .attr('height', 400)
    .attr('stroke-width', 2)
    .attr('stroke', 'black')
    .attr('fill', 'transparent');

box.append("text").style("fill", "black").attr('y', 445).attr('x', 25).text("0")
box.append("text").style("fill", "black").attr('y', 445).attr('x', 400).text("20")
box.append("text").style("fill", "black").attr('y', 425).attr('x', 10).text("0")
box.append("text").style("fill", "black").attr('y', 50).attr('x', 3).text("10")

box
    .append("text")
    .style("fill", "black")
     .attr('y', 475)
     .attr('x', 75)
     .text(uavs.map(x => uavStr(x)).join("\n"));


const line = d3.line()
    .x(d => d.x)
    .y(d => d.y);


uavs.map(x => {
    box.append("path")
        .datum([
            {x: x.takeOff * 20 + 25, y: 425},
            {x: (x.takeOff+(10/x.speed)) * 20 + 25, y:25}])
        .attr("d", line)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none");
    box.append("text").style("fill", "black").attr('y', 445).attr('x', x.takeOff * 20 + 20).text(x.takeOff)
})
