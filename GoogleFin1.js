var margin={top:10, left:100, bottom:100, right:10};

var width=950 - margin.left - margin.right;
var height=600 - margin.top - margin.bottom;

 var  flag= true; 
 var t=d3.transition().duration(750);

var svg=d3.select(".column1").append("svg").attr("width",width+margin.left+margin.right)
                                  .attr("height",height+margin.top+margin.bottom);
        
var g= svg.append("g")/*.attr("height",height)
                      .attr("width",width)*/
                      .attr("transform","translate("+margin.left+","+margin.top+")");   
/*var g= svg.append("g").attr("height",height).attr("width",width);*/

//X label
var xLabel=g.append("text").attr("class", "x axis-label")
                .attr("x",width/2)
                .attr("y",height+80)
                .attr("font-size","20px")
                .attr("text-anchor","middle")
                .text("Year")  

//Y label                
var yLabel=g.append("text").attr("class","y axis-label")
                .attr("x", -(height/2))
                .attr("y", -60)
                .attr("font-size","20px")
                .attr("text-anchor","middle")
                .attr("transform","rotate(-90)")
                .text("Revenue")                
var x= d3.scaleBand().range([0,width])
                     .paddingInner(0.3)
                     .paddingOuter(0.3);
var y= d3.scaleLinear().range([height, 0]); 

var xAxisgroup=g.append("g").attr("class","x axis")
             .attr("transform","translate(0,"+ height +")")
             
         /*    .attr("text-anchor","end")
             .attr("transform","rotate(-40)");*/


var yAxisgroup= g.append("g").attr("class","y axis");

d3.json("GoogleFin.json").then(function(data){
    data.forEach(d => {
        d.revenue= +d.revenue;
        d.profit= +d.profit;
    });
    d3.interval(function(){
            
        update(data);
        flag= !flag
    }, 1000);   
    
    //Run visuaization in the beginning
    update(data);
});   
function update(data){
  var value = flag ? "revenue" : "profit";   
    x.domain(data.map(function(d){
        return d.year;
                             }));
    y.domain([0, d3.max(data, function(d){
        return d[value];
                           })]);
    //X axis                       
    var xAxisCall= d3.axisBottom(x);
    xAxisgroup.transition(t).call(xAxisCall).selectAll("text")
    .attr("x","0")
    .attr("y","20");
   
    //Y axis
    var yAxisCall= d3.axisLeft(y).ticks(5).tickFormat(function(d){
        return d+"B";
});
    yAxisgroup.transition(t).call(yAxisCall);

    
    //Join new data with old elements
   var rects= g.selectAll("rect").data(data, function(d){
       return d.year
   });

   //Exit old elements not present in new data
    rects.exit().attr("fill", "red")
                .transition(t)
                .attr("y",y(0))
                .attr("height",0)
                .remove();
   
 /*  //Update old elements present in new data
   rects.transition(t).attr("x",(d)=>{return x(d.month);})
        .attr("y", function(d){return y(d[value])})
        .attr("height",(d)=>{return height-y(d[value]);})
        .attr("width",x.bandwidth)   
        
   
  // Enter new elements present in new data
   rects.enter().append("rect").attr("x",(d)=>{return x(d.month);})
                                               .attr("y", function(d){return y(d[value])})
                                               .attr("height",(d)=>{return height-y(d[value]);})
                                               .attr("width",x.bandwidth)
                                               .attr("fill","grey");   */
    // Enter new elements present in new data                                           
   rects.enter().append("rect").attr("x", (d)=>{return x(d.year);})
                               .attr("fill", "darkblue")
                               .attr("y", y(0))
                               .attr("height", 0)
                               .attr("width",x.bandwidth)
                           //Update old elements present in new data    
                               .merge(rects)
                               .transition(t)
                               .attr("x",(d)=>{return x(d.year);})
                               .attr("width",x.bandwidth)
                               .attr("y", function(d){return y(d[value]);})
                               .attr("height", function(d){
                                   return height - y(d[value]);
                                });

var label=flag?"Revenue":"Net income";
                                yLabel.text(label);                                                           
        }                        