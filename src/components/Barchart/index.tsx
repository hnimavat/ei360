import React from "react";
import {
    GroupedVerticalBarChart,   
    ILegendsProps
  } from '@fluentui/react-charting';

// Props Typescript
import type { BarChartProps } from './BarChartProps.js';

// Styling.
import './style.css'


export interface BarchartState {
  parentWidth: number;
}
class Barchart extends React.Component<BarChartProps, BarchartState, {}> {
private parentRef: React.RefObject<HTMLDivElement>; 

 constructor(props: BarChartProps){
    super(props); 

    this.parentRef = React.createRef();

    this.state = {
      parentWidth: 0,
    }
 }

 componentDidMount() {
  this.setState({
    parentWidth: this.parentRef.current?.offsetWidth || 0,
  });
}

// Ensure the chart updates when the window is resized
handleResize = () => {
  this.setState({
    parentWidth: this.parentRef.current?.offsetWidth || 0,
  });
};

componentDidUpdate() {
  window.addEventListener("resize", this.handleResize);
}

componentWillUnmount() {
  window.removeEventListener("resize", this.handleResize);
}

 public render(): React.ReactElement<BarChartProps> {
    const {data , hideLegend} = this.props;
    const legendStyles: Partial<ILegendsProps> = {
      styles : {
        rect : {
          width : 30,            
        },
        text : {
          fontFamily : 'Poppins',
          fontSize : '12px',
          color : '#74788D',
          fontWeight : '500'
        }
      },
      centerLegends: true 
    }


    return (
        <>
        <div id="BarchartWrap" ref={this.parentRef}>
          <GroupedVerticalBarChart                  
                    data={data}
                    width={this.state.parentWidth}
                    height={this.state.parentWidth/2}
                    yAxisTickCount={5}
                    barwidth={20}
                    enableReflow={true}
                    hideLabels={true}
                    hideLegend={hideLegend}
                    legendProps={legendStyles}
                    styles={{ opacityChangeOnHover:{ cursor: 'pointer'}}}
                  />
        </div>
           
        </>
    )
 }
}

export default Barchart;