let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countyData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
 
    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (countyDataItem) => {
              let id = countyDataItem['id']
              let county = educationData.find((item) => {
                return item['fips'] === id
              })
              let percentage = county['bachelorsOrHigher']
              if(percentage <= 5){
                return '#fcdcfb'
              } else if(percentage <= 10){
                return '#ffbdfd'
              }
              else if(percentage <= 15){
                return '#ff96fc'
              } else if (percentage <= 20){
                return '#f576f1'
              } else if(percentage <= 30){
                return '#f55df0'
              } else if(percentage <= 40){
                return '#ed1fe6'
              } else {
                return '#b806b2'
              }
    })
          .attr('data-fips', (countyDataItem) => {
          return countyDataItem['id']
    })
          .attr('data-education', (countyDataItem) => {
           let id = countyDataItem['id']
           let county = educationData.find((item) => {
             return item['fips'] === id
           })
           let percentage = county['bachelorsOrHigher']
           return percentage
    })
      .on('mouseover', (countyDataItem)=> {
           tooltip.transition()
                  .style('visibility', 'visible')
         let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
             })
            tooltip.text(county['area_name'] + ', ' + county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')

            tooltip.attr('data-education', county['bachelorsOrHigher'] )
            })
  .on('mouseout', (countyDataItem) => {
          tooltip.transition()
                 .style('visibility', 'hidden')
            })
}

d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(log)
        }else{
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }else{
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)
